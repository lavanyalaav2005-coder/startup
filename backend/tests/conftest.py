import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://circle-ai-platform.preview.emergentagent.com").rstrip("/")
ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL", "admin@fusioncircle.tech")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "FusionAdmin@2026")


@pytest.fixture(scope="session")
def base_url():
    return BASE_URL


@pytest.fixture
def api_client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="session")
def admin_session():
    s = requests.Session()
    r = s.post(f"{BASE_URL}/api/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=30)
    if r.status_code != 200:
        pytest.skip(f"admin login failed: {r.status_code} {r.text}")
    return s


@pytest.fixture(scope="session")
def client_session():
    s = requests.Session()
    import uuid
    email = f"test_client_{uuid.uuid4().hex[:8]}@fusioncircle.tech"
    r = s.post(f"{BASE_URL}/api/auth/register", json={
        "email": email, "password": "ClientDemo@2026", "name": "Test Client", "company": "Acme"
    }, timeout=30)
    if r.status_code != 200:
        pytest.skip(f"client register failed: {r.status_code} {r.text}")
    s.email = email  # type: ignore
    return s
