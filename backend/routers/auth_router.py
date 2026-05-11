"""Authentication routes."""
from __future__ import annotations

import os
import secrets
import uuid
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, Request, Response
from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from auth import (
    clear_auth_cookies,
    create_access_token,
    create_refresh_token,
    get_current_user,
    get_db_from_request,
    hash_password,
    set_auth_cookies,
    user_public_dict,
    verify_password,
)
from email_service import send_email, tpl_otp, tpl_welcome
from models import LoginIn, OtpVerifyIn, RegisterIn
from models_db import FeatureFlag, LoginAttempt, OtpCode, User

router = APIRouter(prefix="/api/auth", tags=["auth"])

MAX_ATTEMPTS = 5
LOCKOUT_MIN = 15


def _identifier(req: Request, email: str) -> str:
    ip = req.client.host if req.client else "unknown"
    return f"{ip}:{email.lower()}"


def _naive_utc_now():
    return datetime.now(timezone.utc).replace(tzinfo=None)


async def _check_lockout(db: AsyncSession, ident: str) -> None:
    result = await db.execute(select(LoginAttempt).where(LoginAttempt.identifier == ident))
    rec = result.scalar_one_or_none()
    if rec and rec.count >= MAX_ATTEMPTS and rec.locked_until and _naive_utc_now() < rec.locked_until:
        raise HTTPException(status_code=429, detail="Too many failed attempts. Try again later.")


async def _register_attempt(db: AsyncSession, ident: str, success: bool) -> None:
    if success:
        await db.execute(delete(LoginAttempt).where(LoginAttempt.identifier == ident))
        await db.commit()
        return

    result = await db.execute(select(LoginAttempt).where(LoginAttempt.identifier == ident))
    rec = result.scalar_one_or_none()
    count = (rec.count if rec else 0) + 1
    locked_until = _naive_utc_now() + timedelta(minutes=LOCKOUT_MIN) if count >= MAX_ATTEMPTS else None

    if rec is None:
        db.add(LoginAttempt(identifier=ident, count=count, updated_at=_naive_utc_now(), locked_until=locked_until))
    else:
        rec.count = count
        rec.updated_at = _naive_utc_now()
        rec.locked_until = locked_until
    await db.commit()


async def _otp_enabled(db: AsyncSession) -> bool:
    result = await db.execute(select(FeatureFlag).where(FeatureFlag.key == "otp_enabled"))
    flag = result.scalar_one_or_none()
    return bool(flag and flag.enabled)


@router.post("/register")
async def register(payload: RegisterIn, request: Request, response: Response, db: AsyncSession = Depends(get_db_from_request)):
    email = payload.email.lower()
    result = await db.execute(select(User).where(User.email == email))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        id=str(uuid.uuid4()),
        email=email,
        password_hash=hash_password(payload.password),
        name=payload.name,
        role="client",
        company=payload.company,
        created_at=_naive_utc_now(),
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)

    subj, html = tpl_welcome(payload.name)
    await send_email(email, subj, html)

    access = create_access_token(user.id, email, user.role)
    refresh = create_refresh_token(user.id)
    set_auth_cookies(response, access, refresh)
    return {"user": user_public_dict(user), "access_token": access, "otp_required": False}


@router.post("/login")
async def login(payload: LoginIn, request: Request, response: Response, db: AsyncSession = Depends(get_db_from_request)):
    email = payload.email.lower()
    ident = _identifier(request, email)
    await _check_lockout(db, ident)

    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()
    if not user or not verify_password(payload.password, user.password_hash):
        await _register_attempt(db, ident, False)
        raise HTTPException(status_code=401, detail="Invalid email or password")

    await _register_attempt(db, ident, True)

    if await _otp_enabled(db):
        code = f"{secrets.randbelow(1_000_000):06d}"
        result = await db.execute(select(OtpCode).where(OtpCode.email == email))
        otp = result.scalar_one_or_none()
        expires_at = _naive_utc_now() + timedelta(minutes=10)
        if otp is None:
            db.add(OtpCode(email=email, code=code, expires_at=expires_at))
        else:
            otp.code = code
            otp.expires_at = expires_at
        await db.commit()

        subj, html = tpl_otp(code)
        await send_email(email, subj, html)
        return {"otp_required": True, "email": email}

    access = create_access_token(user.id, email, user.role)
    refresh = create_refresh_token(user.id)
    set_auth_cookies(response, access, refresh)
    return {"user": user_public_dict(user), "access_token": access, "otp_required": False}


@router.post("/verify-otp")
async def verify_otp(payload: OtpVerifyIn, request: Request, response: Response, db: AsyncSession = Depends(get_db_from_request)):
    email = payload.email.lower()
    result = await db.execute(select(OtpCode).where(OtpCode.email == email))
    rec = result.scalar_one_or_none()
    if not rec or rec.code != payload.code:
        raise HTTPException(status_code=401, detail="Invalid code")
    if _naive_utc_now() > rec.expires_at:
        raise HTTPException(status_code=401, detail="Code expired")

    user_result = await db.execute(select(User).where(User.email == email))
    user = user_result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    await db.delete(rec)
    await db.commit()

    access = create_access_token(user.id, email, user.role)
    refresh = create_refresh_token(user.id)
    set_auth_cookies(response, access, refresh)
    return {"user": user_public_dict(user), "access_token": access, "otp_required": False}


@router.get("/me")
async def me(user: User = Depends(get_current_user)):
    return {"user": user_public_dict(user)}


@router.post("/logout")
async def logout(response: Response):
    clear_auth_cookies(response)
    return {"ok": True}


@router.post("/refresh")
async def refresh(request: Request, response: Response, db: AsyncSession = Depends(get_db_from_request)):
    import jwt as _jwt

    token = request.cookies.get("refresh_token")
    if not token:
        raise HTTPException(status_code=401, detail="No refresh token")
    try:
        payload = _jwt.decode(token, os.environ["JWT_SECRET"], algorithms=["HS256"])
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    if payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Invalid token type")

    result = await db.execute(select(User).where(User.id == payload["sub"]))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    access = create_access_token(user.id, user.email, user.role)
    new_refresh = create_refresh_token(user.id)
    set_auth_cookies(response, access, new_refresh)
    return {"ok": True}
