from pathlib import Path

async def write_test_credentials() -> None:
    storage_path = Path(__file__).resolve().parent.parent / "memory"
    storage_path.mkdir(parents=True, exist_ok=True)
    path = storage_path / "test_credentials.md"

    sa_email = os.environ.get("SUPER_ADMIN_EMAIL", "prakash@gmail.com")
    sa_pw = os.environ.get("SUPER_ADMIN_PASSWORD", "admin")
    a_email = os.environ.get("ADMIN_EMAIL", "lavanya05@gmail.com")
    a_pw = os.environ.get("ADMIN_PASSWORD", "admin")

    content = f"""# FusionCircle Tech — Test Credentials

## Super Admin (Prakash)
- Email: {sa_email}
- Password: {sa_pw}
- Role: super_admin

## Admin (Lavanya)
- Email: {a_email}
- Password: {a_pw}
- Role: dmin

## Test Client (register via UI or API)
- Email: client.demo@fusioncircle.tech
- Password: ClientDemo@2026
- Role: client

## Auth endpoints
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout
- GET  /api/auth/me
- POST /api/auth/refresh

## Core endpoints
- POST /api/projects (client) — submit project request
- GET  /api/projects/mine (client)
- GET  /api/projects (admin) — all projects
- PATCH /api/projects/{{id}}/status (admin)
- POST /api/chatbot/message — AI chat
- POST /api/chatbot/proposal/{{project_id}} (admin)
- GET  /api/notifications/mine
- GET  /api/admin/users (admin)
- GET  /api/admin/analytics (admin)
- PATCH /api/admin/feature-flags/{{key}} (super_admin)
"""
    path.write_text(content, encoding="utf-8")
