"""Admin + Super Admin routes: users, analytics, feature flags."""
from __future__ import annotations

from typing import List

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from auth import get_db_from_request, require_roles, user_public_dict
from models_db import ContactMessage, FeatureFlag, Project, User

router = APIRouter(prefix="/api/admin", tags=["admin"])


@router.get("/users")
async def list_users(request: Request, admin=Depends(require_roles("admin", "super_admin")), db: AsyncSession = Depends(get_db_from_request)) -> List[dict]:
    result = await db.execute(select(User).order_by(User.created_at.desc()))
    return [user_public_dict(user) for user in result.scalars().all()]


@router.patch("/users/{user_id}/role")
async def set_user_role(
    user_id: str,
    payload: dict,
    request: Request,
    admin=Depends(require_roles("super_admin")),
    db: AsyncSession = Depends(get_db_from_request),
):
    role = payload.get("role")
    if role not in ("client", "admin", "super_admin"):
        raise HTTPException(status_code=400, detail="Invalid role")

    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    user.role = role
    await db.commit()
    return {"ok": True}


@router.get("/analytics")
async def analytics(request: Request, admin=Depends(require_roles("admin", "super_admin")), db: AsyncSession = Depends(get_db_from_request)):
    total_users = await db.scalar(select(func.count()).select_from(User))
    total_clients = await db.scalar(select(func.count()).select_from(User).where(User.role == "client"))
    total_projects = await db.scalar(select(func.count()).select_from(Project))

    statuses = ["pending", "approved", "in_progress", "completed", "rejected"]
    by_status = {}
    for status in statuses:
        by_status[status] = await db.scalar(select(func.count()).select_from(Project).where(Project.status == status))

    category_result = await db.execute(
        select(Project.category, func.count()).group_by(Project.category).order_by(func.count().desc())
    )
    by_category = [{"category": category or "Uncategorized", "count": count} for category, count in category_result.all()]

    timeline_result = await db.execute(
        select(func.date(Project.created_at), func.count()).group_by(func.date(Project.created_at)).order_by(func.date(Project.created_at))
    )
    timeline = [{"date": str(date_value), "count": count} for date_value, count in timeline_result.all()]

    recent_contacts = await db.scalar(select(func.count()).select_from(ContactMessage))

    return {
        "total_users": total_users,
        "total_clients": total_clients,
        "total_projects": total_projects,
        "by_status": by_status,
        "by_category": by_category,
        "timeline": timeline,
        "contact_messages": recent_contacts,
    }


@router.get("/feature-flags")
async def list_flags(request: Request, admin=Depends(require_roles("admin", "super_admin")), db: AsyncSession = Depends(get_db_from_request)):
    result = await db.execute(select(FeatureFlag).order_by(FeatureFlag.key.asc()))
    return [{"key": flag.key, "enabled": flag.enabled, "description": flag.description} for flag in result.scalars().all()]


@router.patch("/feature-flags/{key}")
async def update_flag(
    key: str,
    payload: dict,
    request: Request,
    admin=Depends(require_roles("super_admin")),
    db: AsyncSession = Depends(get_db_from_request),
):
    enabled = bool(payload.get("enabled", False))
    result = await db.execute(select(FeatureFlag).where(FeatureFlag.key == key))
    flag = result.scalar_one_or_none()
    if flag is None:
        raise HTTPException(status_code=404, detail="Flag not found")

    flag.enabled = enabled
    await db.commit()
    return {"ok": True, "key": key, "enabled": enabled}
