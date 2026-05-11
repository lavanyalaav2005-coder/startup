"""Project request routes (client + admin)."""
from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import List

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from auth import get_current_user, get_db_from_request, require_roles
from email_service import send_email, tpl_project_status, tpl_project_submitted
from models import ProjectCreateIn, ProjectUpdateStatusIn
from models_db import Notification, Project, User

router = APIRouter(prefix="/api/projects", tags=["projects"])


def _now():
    return datetime.now(timezone.utc).replace(tzinfo=None)


def _serialize(project: Project) -> dict:
    return {
        "id": project.id,
        "client_id": project.client_id,
        "client_name": project.client_name,
        "client_email": project.client_email,
        "title": project.title,
        "category": project.category,
        "description": project.description,
        "budget": project.budget,
        "timeline": project.timeline,
        "status": project.status,
        "admin_note": project.admin_note,
        "ai_proposal": project.ai_proposal,
        "created_at": project.created_at,
        "updated_at": project.updated_at,
    }


@router.post("")
async def create_project(payload: ProjectCreateIn, request: Request, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db_from_request)):
    now = _now()
    project = Project(
        id=str(uuid.uuid4()),
        client_id=user.id,
        client_name=user.name,
        client_email=user.email,
        title=payload.title,
        category=payload.category,
        description=payload.description,
        budget=payload.budget,
        timeline=payload.timeline,
        status="pending",
        admin_note=None,
        ai_proposal=None,
        created_at=now,
        updated_at=now,
    )
    db.add(project)
    db.add(
        Notification(
            id=str(uuid.uuid4()),
            user_id=user.id,
            title="Project request submitted",
            body=f"Your project '{payload.title}' is under review.",
            kind="info",
            read=False,
            created_at=now,
        )
    )
    await db.commit()

    subj, html = tpl_project_submitted(user.name, payload.title)
    await send_email(user.email, subj, html)
    return _serialize(project)


@router.get("/mine")
async def list_my_projects(request: Request, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db_from_request)) -> List[dict]:
    result = await db.execute(select(Project).where(Project.client_id == user.id).order_by(Project.created_at.desc()))
    return [_serialize(row) for row in result.scalars().all()]


@router.get("")
async def list_all_projects(request: Request, user: User = Depends(require_roles("admin", "super_admin")), db: AsyncSession = Depends(get_db_from_request)) -> List[dict]:
    result = await db.execute(select(Project).order_by(Project.created_at.desc()))
    return [_serialize(row) for row in result.scalars().all()]


@router.get("/{project_id}")
async def get_project(project_id: str, request: Request, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db_from_request)):
    result = await db.execute(select(Project).where(Project.id == project_id))
    proj = result.scalar_one_or_none()
    if not proj:
        raise HTTPException(status_code=404, detail="Project not found")
    if user.role == "client" and proj.client_id != user.id:
        raise HTTPException(status_code=403, detail="Forbidden")
    return _serialize(proj)


@router.patch("/{project_id}/status")
async def update_status(
    project_id: str,
    payload: ProjectUpdateStatusIn,
    request: Request,
    admin: User = Depends(require_roles("admin", "super_admin")),
    db: AsyncSession = Depends(get_db_from_request),
):
    result = await db.execute(select(Project).where(Project.id == project_id))
    proj = result.scalar_one_or_none()
    if not proj:
        raise HTTPException(status_code=404, detail="Project not found")

    proj.status = payload.status
    proj.admin_note = payload.admin_note
    proj.updated_at = _now()
    db.add(
        Notification(
            id=str(uuid.uuid4()),
            user_id=proj.client_id,
            title=f"Project {payload.status}",
            body=f"'{proj.title}' is now {payload.status}." + (f" Note: {payload.admin_note}" if payload.admin_note else ""),
            kind="success" if payload.status in ("approved", "completed") else "warning" if payload.status == "rejected" else "info",
            read=False,
            created_at=_now(),
        )
    )
    await db.commit()

    subj, html = tpl_project_status(proj.client_name, proj.title, payload.status, payload.admin_note)
    await send_email(proj.client_email, subj, html)
    return _serialize(proj)
