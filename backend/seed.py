"""Admin seeding + feature flags for MySQL."""
from __future__ import annotations

import logging
import os
import uuid
from datetime import datetime, timezone
from pathlib import Path

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from auth import hash_password, verify_password
from models_db import User, FeatureFlag

logger = logging.getLogger("fusioncircle.seed")


def _now():
    return datetime.now(timezone.utc).replace(tzinfo=None)


# Accounts seeded on startup (idempotent)
SEED_ACCOUNTS = [
    {
        "email_env": "SUPER_ADMIN_EMAIL",
        "password_env": "SUPER_ADMIN_PASSWORD",
        "default_email": "admin@fusioncircle.tech",
        "default_password": "FusionAdmin@2026",
        "name": "FusionCircle Admin",
        "role": "super_admin",
        "company": "FusionCircle Tech",
    },
    {
        "email_env": "ADMIN_EMAIL",
        "password_env": "ADMIN_PASSWORD",
        "default_email": "manager@fusioncircle.tech",
        "default_password": "FusionManager@2026",
        "name": "FusionCircle Manager",
        "role": "admin",
        "company": "FusionCircle Tech",
    },
]


async def seed_admin(session: AsyncSession) -> None:
    for acc in SEED_ACCOUNTS:
        email = os.environ.get(acc["email_env"], acc["default_email"]).lower()
        password = os.environ.get(acc["password_env"], acc["default_password"])
        result = await session.execute(select(User).where(User.email == email))
        existing = result.scalar_one_or_none()

        if existing is None:
            user = User(
                id=str(uuid.uuid4()),
                email=email,
                password_hash=hash_password(password),
                name=acc["name"],
                role=acc["role"],
                company=acc["company"],
                created_at=_now(),
            )
            session.add(user)
            logger.info("Seeded %s: %s", acc["role"], email)
        else:
            updates = False
            if not verify_password(password, existing.password_hash):
                existing.password_hash = hash_password(password)
                updates = True
            if existing.role != acc["role"]:
                existing.role = acc["role"]
                updates = True
            if updates:
                logger.info("Updated %s account: %s", acc["role"], email)

    await session.commit()


async def seed_feature_flags(session: AsyncSession) -> None:
    defaults = [
        {
            "key": "otp_enabled",
            "enabled": os.environ.get("OTP_ENABLED", "false").lower() == "true",
            "description": "Require OTP verification after login.",
        },
        {
            "key": "email_verification",
            "enabled": False,
            "description": "Require email verification on registration.",
        },
        {
            "key": "ai_chatbot",
            "enabled": True,
            "description": "Enable the AI chatbot widget.",
        },
        {
            "key": "ai_proposals",
            "enabled": True,
            "description": "Auto-generate AI proposals for projects.",
        },
    ]

    for f in defaults:
        result = await session.execute(select(FeatureFlag).where(FeatureFlag.key == f["key"]))
        existing = result.scalar_one_or_none()
        if existing is None:
            flag = FeatureFlag(
                key=f["key"], enabled=f["enabled"], description=f["description"]
            )
            session.add(flag)

    await session.commit()


async def write_test_credentials() -> None:
    storage_path = Path(__file__).resolve().parent.parent / "memory"
    storage_path.mkdir(parents=True, exist_ok=True)
    path = storage_path / "test_credentials.md"

    sa_email = os.environ.get("SUPER_ADMIN_EMAIL", "admin@fusioncircle.tech")
    sa_pw = os.environ.get("SUPER_ADMIN_PASSWORD", "FusionAdmin@2026")
    a_email = os.environ.get("ADMIN_EMAIL", "manager@fusioncircle.tech")
    a_pw = os.environ.get("ADMIN_PASSWORD", "FusionManager@2026")

    content = f"""# FusionCircle Tech — Test Credentials

## Super Admin
- Email: `{sa_email}`
- Password: `{sa_pw}`
- Role: `super_admin`

## Admin
- Email: `{a_email}`
- Password: `{a_pw}`
- Role: `admin`

## Test Client (register via UI or API)
- Email: `client.demo@fusioncircle.tech`
- Password: `ClientDemo@2026`
- Role: `client`

## Auth endpoints
- POST `/api/auth/register`
- POST `/api/auth/login`
- POST `/api/auth/logout`
- GET  `/api/auth/me`
- POST `/api/auth/refresh`

## Core endpoints
- POST `/api/projects` (client) — submit project request
- GET  `/api/projects/mine` (client)
- GET  `/api/projects` (admin) — all projects
- PATCH `/api/projects/{{id}}/status` (admin)
- POST `/api/chatbot/message` — AI chat
- POST `/api/chatbot/proposal/{{project_id}}` (admin)
- GET  `/api/notifications/mine`
- GET  `/api/admin/users` (admin)
- GET  `/api/admin/analytics` (admin)
- PATCH `/api/admin/feature-flags/{{key}}` (super_admin)
"""
    path.write_text(content, encoding="utf-8")
