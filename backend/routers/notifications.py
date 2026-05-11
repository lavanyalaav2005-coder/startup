"""Notifications + contact form routes."""
from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import List

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from auth import get_current_user, get_db_from_request
from email_service import send_email
from models import ContactMessageIn
from models_db import ContactMessage, FeatureFlag, Notification, User

router = APIRouter(tags=["notifications"])


def _now():
    return datetime.now(timezone.utc).replace(tzinfo=None)


def _serialize_notification(notification: Notification) -> dict:
    return {
        "id": notification.id,
        "user_id": notification.user_id,
        "title": notification.title,
        "body": notification.body,
        "kind": notification.kind,
        "read": notification.read,
        "created_at": notification.created_at,
    }


@router.get("/api/notifications/mine")
async def list_notifications(request: Request, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db_from_request)) -> List[dict]:
    result = await db.execute(
        select(Notification).where(Notification.user_id == user.id).order_by(Notification.created_at.desc())
    )
    return [_serialize_notification(row) for row in result.scalars().all()]


@router.post("/api/notifications/{notif_id}/read")
async def mark_read(notif_id: str, request: Request, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db_from_request)):
    result = await db.execute(select(Notification).where(Notification.id == notif_id, Notification.user_id == user.id))
    notification = result.scalar_one_or_none()
    if notification is None:
        raise HTTPException(status_code=404, detail="Notification not found")

    notification.read = True
    await db.commit()
    return {"ok": True}


@router.post("/api/notifications/read-all")
async def mark_all_read(request: Request, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db_from_request)):
    result = await db.execute(select(Notification).where(Notification.user_id == user.id, Notification.read.is_(False)))
    for notification in result.scalars().all():
        notification.read = True
    await db.commit()
    return {"ok": True}


@router.post("/api/contact")
async def submit_contact(payload: ContactMessageIn, request: Request, db: AsyncSession = Depends(get_db_from_request)):
    doc = ContactMessage(
        id=str(uuid.uuid4()),
        name=payload.name,
        email=str(payload.email),
        subject=payload.subject,
        message=payload.message,
        created_at=_now(),
    )
    db.add(doc)
    await db.commit()

    html = f"""
    <div style="font-family:-apple-system,sans-serif;background:#050505;color:#fff;padding:32px;">
      <h1 style="color:#00F0FF;">Thanks, {payload.name}.</h1>
      <p>We received your message and will respond within one business day.</p>
      <p style="color:#A1A1AA"><em>{payload.subject}</em></p>
    </div>
    """
    await send_email(payload.email, "We received your message - FusionCircle Tech", html)
    return {"ok": True, "id": doc.id}


@router.get("/api/feature-flags")
async def public_flags(request: Request, db: AsyncSession = Depends(get_db_from_request)):
    result = await db.execute(select(FeatureFlag).order_by(FeatureFlag.key.asc()))
    return [{"key": flag.key, "enabled": flag.enabled, "description": flag.description} for flag in result.scalars().all()]
