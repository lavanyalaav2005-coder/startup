"""AI chatbot + auto proposal generation using Emergent LLM Key."""
from __future__ import annotations

import os
import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from auth import get_db_from_request, require_roles
from models import ChatMessageIn
from models_db import ChatMessage, Project, User

router = APIRouter(prefix="/api/chatbot", tags=["chatbot"])

SYSTEM_PROMPT = (
    "You are Nova, the AI concierge for FusionCircle Tech, a premium AI-powered IT services company. "
    "You help prospective clients understand our services: AI & ML Solutions, Cloud Architecture, Web & Mobile Development, "
    "Cybersecurity, DevOps, Data Engineering, and Product Design. "
    "Be concise, warm, and expert. Ask qualifying questions about timeline, budget, and goals, and encourage project submission. "
    "Never make up pricing; say custom-quoted per engagement when asked."
)


def _now():
    return datetime.now(timezone.utc).replace(tzinfo=None)


def _llm_key() -> str:
    return os.environ.get("ANTHROPIC_API_KEY", "").strip()


async def _chat(session_id: str, user_text: str, system: str = SYSTEM_PROMPT) -> str:
    key = _llm_key()
    if not key or key == "sk-ant-...":
        return (
            "FusionCircle Tech can help with AI and ML, cloud architecture, web and mobile apps, "
            "cybersecurity, DevOps, data engineering, and product design. Share your goals, budget, "
            "and timeline, and we can turn that into a tailored project proposal."
        )

    from emergentintegrations.llm.chat import LlmChat, UserMessage

    chat = LlmChat(api_key=key, session_id=session_id, system_message=system).with_model(
        "anthropic", "claude-sonnet-4-5-20250929"
    )
    try:
        return await chat.send_message(UserMessage(text=user_text))
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"AI provider error: {e}")


@router.post("/message")
async def chat_message(payload: ChatMessageIn, request: Request, db: AsyncSession = Depends(get_db_from_request)):
    db.add(ChatMessage(id=str(uuid.uuid4()), session_id=payload.session_id, role="user", content=payload.message, created_at=_now()))

    reply = await _chat(payload.session_id, payload.message)

    db.add(ChatMessage(id=str(uuid.uuid4()), session_id=payload.session_id, role="assistant", content=reply, created_at=_now()))
    await db.commit()
    return {"reply": reply}


@router.get("/history/{session_id}")
async def history(session_id: str, request: Request, db: AsyncSession = Depends(get_db_from_request)):
    result = await db.execute(select(ChatMessage).where(ChatMessage.session_id == session_id).order_by(ChatMessage.created_at.asc()))
    return [
        {
            "id": row.id,
            "session_id": row.session_id,
            "role": row.role,
            "content": row.content,
            "created_at": row.created_at,
        }
        for row in result.scalars().all()
    ]


@router.post("/proposal/{project_id}")
async def generate_proposal(
    project_id: str,
    request: Request,
    admin: User = Depends(require_roles("admin", "super_admin")),
    db: AsyncSession = Depends(get_db_from_request),
):
    result = await db.execute(select(Project).where(Project.id == project_id))
    proj = result.scalar_one_or_none()
    if not proj:
        raise HTTPException(status_code=404, detail="Project not found")

    prompt = (
        "Generate a crisp, professional project proposal for the following client request. "
        "Structure with markdown headers: Executive Summary, Proposed Solution, Deliverables, Timeline, Next Steps. "
        "Keep it under 400 words and avoid made-up pricing.\n\n"
        f"Client: {proj.client_name} ({proj.client_email})\n"
        f"Title: {proj.title}\n"
        f"Category: {proj.category}\n"
        f"Budget: {proj.budget or 'not specified'}\n"
        f"Timeline: {proj.timeline or 'not specified'}\n"
        f"Description:\n{proj.description}"
    )
    system = "You are a senior solutions architect at FusionCircle Tech drafting client-ready proposals."
    proposal = await _chat(f"proposal-{project_id}", prompt, system=system)

    proj.ai_proposal = proposal
    proj.updated_at = _now()
    await db.commit()
    return {"project_id": project_id, "proposal": proposal}
