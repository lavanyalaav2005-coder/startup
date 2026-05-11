"""End-to-end backend tests for FusionCircle Tech."""
import uuid
import pytest


# ---------- Health ----------
class TestHealth:
    def test_health(self, api_client, base_url):
        r = api_client.get(f"{base_url}/api/health", timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert data.get("ok") is True
        assert data.get("db") == "up"


# ---------- Auth ----------
class TestAuth:
    def test_admin_login_returns_super_admin(self, api_client, base_url):
        r = api_client.post(f"{base_url}/api/auth/login",
                            json={"email": "admin@fusioncircle.tech", "password": "FusionAdmin@2026"},
                            timeout=30)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data.get("otp_required") is False
        assert data["user"]["role"] == "super_admin"
        assert data["user"]["email"] == "admin@fusioncircle.tech"
        # cookies set
        assert "access_token" in r.cookies
        assert "refresh_token" in r.cookies

    def test_register_and_me(self, api_client, base_url):
        email = f"test_reg_{uuid.uuid4().hex[:8]}@fusioncircle.tech"
        r = api_client.post(f"{base_url}/api/auth/register", json={
            "email": email, "password": "Pass1234!", "name": "Reg User"
        }, timeout=30)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["user"]["email"] == email
        assert data["user"]["role"] == "client"
        assert "access_token" in api_client.cookies

        # /me
        r2 = api_client.get(f"{base_url}/api/auth/me", timeout=15)
        assert r2.status_code == 200
        assert r2.json()["user"]["email"] == email

    def test_register_duplicate_fails(self, api_client, base_url):
        email = f"test_dup_{uuid.uuid4().hex[:8]}@fusioncircle.tech"
        api_client.post(f"{base_url}/api/auth/register", json={
            "email": email, "password": "Pass1234!", "name": "Dup"
        }, timeout=30)
        r2 = api_client.post(f"{base_url}/api/auth/register", json={
            "email": email, "password": "Pass1234!", "name": "Dup"
        }, timeout=30)
        assert r2.status_code == 400

    def test_login_invalid(self, api_client, base_url):
        r = api_client.post(f"{base_url}/api/auth/login",
                            json={"email": "no-such@fusioncircle.tech", "password": "wrong"},
                            timeout=15)
        assert r.status_code == 401

    def test_logout_clears_cookies(self, base_url):
        import requests
        s = requests.Session()
        s.post(f"{base_url}/api/auth/login",
               json={"email": "admin@fusioncircle.tech", "password": "FusionAdmin@2026"},
               timeout=15)
        assert "access_token" in s.cookies
        r = s.post(f"{base_url}/api/auth/logout", timeout=10)
        assert r.status_code == 200
        # After logout, /me should be 401
        r2 = s.get(f"{base_url}/api/auth/me", timeout=10)
        assert r2.status_code == 401

    def test_me_unauth(self, api_client, base_url):
        import requests
        s = requests.Session()
        r = s.get(f"{base_url}/api/auth/me", timeout=10)
        assert r.status_code == 401


# ---------- Projects ----------
class TestProjects:
    def test_client_creates_project_and_lists_mine(self, client_session, base_url):
        payload = {
            "title": "TEST_ AI Chatbot Build",
            "category": "AI & ML Solutions",
            "description": "We need an AI-powered customer support assistant.",
            "budget": "$10k-$25k",
            "timeline": "2 months",
        }
        r = client_session.post(f"{base_url}/api/projects", json=payload, timeout=20)
        assert r.status_code == 200, r.text
        proj = r.json()
        assert proj["title"] == payload["title"]
        assert proj["status"] == "pending"
        assert "id" in proj

        r2 = client_session.get(f"{base_url}/api/projects/mine", timeout=15)
        assert r2.status_code == 200
        ids = [p["id"] for p in r2.json()]
        assert proj["id"] in ids

    def test_admin_lists_all_projects(self, admin_session, base_url):
        r = admin_session.get(f"{base_url}/api/projects", timeout=15)
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_client_forbidden_admin_endpoint(self, client_session, base_url):
        r = client_session.get(f"{base_url}/api/projects", timeout=15)
        assert r.status_code == 403

    def test_admin_updates_status_creates_notification(self, admin_session, client_session, base_url):
        # Client creates a fresh project
        r = client_session.post(f"{base_url}/api/projects", json={
            "title": "TEST_ Status Project",
            "category": "Web & Mobile",
            "description": "Status flow validation project.",
        }, timeout=15)
        assert r.status_code == 200
        pid = r.json()["id"]

        # Admin approves
        r2 = admin_session.patch(f"{base_url}/api/projects/{pid}/status",
                                 json={"status": "approved", "admin_note": "Looks great!"},
                                 timeout=15)
        assert r2.status_code == 200, r2.text
        assert r2.json()["status"] == "approved"

        # Verify with GET
        r3 = admin_session.get(f"{base_url}/api/projects/{pid}", timeout=15)
        assert r3.status_code == 200
        assert r3.json()["status"] == "approved"

        # Notification appears for client
        r4 = client_session.get(f"{base_url}/api/notifications/mine", timeout=15)
        assert r4.status_code == 200
        titles = [n["title"] for n in r4.json()]
        assert any("approved" in t.lower() for t in titles)


# ---------- Admin ----------
class TestAdmin:
    def test_analytics(self, admin_session, base_url):
        r = admin_session.get(f"{base_url}/api/admin/analytics", timeout=15)
        assert r.status_code == 200
        data = r.json()
        for k in ["total_users", "total_clients", "total_projects", "by_status", "by_category", "timeline"]:
            assert k in data

    def test_feature_flags_list_and_toggle(self, admin_session, base_url):
        r = admin_session.get(f"{base_url}/api/admin/feature-flags", timeout=15)
        assert r.status_code == 200
        flags = r.json()
        assert any(f["key"] == "otp_enabled" for f in flags)

        # Toggle ai_chatbot flag (super_admin allowed)
        r2 = admin_session.patch(f"{base_url}/api/admin/feature-flags/ai_chatbot",
                                 json={"enabled": True}, timeout=15)
        assert r2.status_code == 200
        assert r2.json()["enabled"] is True

    def test_admin_users_list(self, admin_session, base_url):
        r = admin_session.get(f"{base_url}/api/admin/users", timeout=15)
        assert r.status_code == 200
        users = r.json()
        assert isinstance(users, list)
        # password_hash must not leak
        assert all("password_hash" not in u for u in users)


# ---------- Chatbot (AI) ----------
class TestChatbot:
    def test_chat_message_returns_reply(self, api_client, base_url):
        r = api_client.post(f"{base_url}/api/chatbot/message", json={
            "session_id": f"test-{uuid.uuid4().hex[:6]}",
            "message": "Hello, what services do you offer?"
        }, timeout=60)
        assert r.status_code == 200, r.text
        data = r.json()
        assert "reply" in data
        assert isinstance(data["reply"], str)
        assert len(data["reply"]) > 5

    def test_admin_generates_proposal(self, admin_session, client_session, base_url):
        # Need a project to generate proposal for
        r = client_session.post(f"{base_url}/api/projects", json={
            "title": "TEST_ AI Proposal Test",
            "category": "AI & ML",
            "description": "Build a recommendation engine for our marketplace.",
            "budget": "$50k",
            "timeline": "3 months",
        }, timeout=15)
        assert r.status_code == 200
        pid = r.json()["id"]

        r2 = admin_session.post(f"{base_url}/api/chatbot/proposal/{pid}", timeout=90)
        assert r2.status_code == 200, r2.text
        assert "proposal" in r2.json()
        assert len(r2.json()["proposal"]) > 50

        # Verify persisted on project
        r3 = admin_session.get(f"{base_url}/api/projects/{pid}", timeout=15)
        assert r3.status_code == 200
        assert r3.json().get("ai_proposal")


# ---------- Notifications & Contact ----------
class TestNotificationsAndContact:
    def test_notifications_mine(self, client_session, base_url):
        r = client_session.get(f"{base_url}/api/notifications/mine", timeout=15)
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_contact_form_public(self, api_client, base_url):
        r = api_client.post(f"{base_url}/api/contact", json={
            "name": "Test User",
            "email": "test@example.com",
            "subject": "Hello",
            "message": "We need help with a project, please get in touch.",
        }, timeout=15)
        assert r.status_code == 200, r.text
        assert r.json().get("ok") is True

    def test_public_feature_flags(self, api_client, base_url):
        r = api_client.get(f"{base_url}/api/feature-flags", timeout=15)
        assert r.status_code == 200
        assert isinstance(r.json(), list)
