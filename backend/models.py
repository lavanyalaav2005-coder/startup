from __future__ import annotations

from datetime import datetime, timezone
from typing import List, Optional, Literal
from pydantic import BaseModel, EmailStr, Field, ConfigDict
import uuid


def _now() -> datetime:
    return datetime.now(timezone.utc)


# -------------------- Users --------------------

UserRole = Literal["client", "admin", "super_admin"]
ProjectStatus = Literal["pending", "approved", "in_progress", "completed", "rejected"]


class UserPublic(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    email: EmailStr
    name: str
    role: UserRole
    company: Optional[str] = None
    created_at: datetime


class RegisterIn(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6, max_length=128)
    name: str = Field(min_length=1, max_length=80)
    company: Optional[str] = None


class LoginIn(BaseModel):
    email: EmailStr
    password: str


class OtpVerifyIn(BaseModel):
    email: EmailStr
    code: str


# -------------------- Projects --------------------

class ProjectCreateIn(BaseModel):
    title: str = Field(min_length=3, max_length=120)
    category: str
    description: str = Field(min_length=10)
    budget: Optional[str] = None
    timeline: Optional[str] = None


class ProjectUpdateStatusIn(BaseModel):
    status: ProjectStatus
    admin_note: Optional[str] = None


class Project(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_id: str
    client_name: str
    client_email: str
    title: str
    category: str
    description: str
    budget: Optional[str] = None
    timeline: Optional[str] = None
    status: ProjectStatus = "pending"
    admin_note: Optional[str] = None
    ai_proposal: Optional[str] = None
    created_at: datetime = Field(default_factory=_now)
    updated_at: datetime = Field(default_factory=_now)


# -------------------- Notifications --------------------

class Notification(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    title: str
    body: str
    kind: str = "info"  # info | success | warning | danger
    read: bool = False
    created_at: datetime = Field(default_factory=_now)


# -------------------- Chat --------------------

class ChatMessageIn(BaseModel):
    session_id: str
    message: str = Field(min_length=1, max_length=2000)


class ChatMessage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str
    role: Literal["user", "assistant"]
    content: str
    created_at: datetime = Field(default_factory=_now)


class ProposalIn(BaseModel):
    project_id: str


# -------------------- Contact & Feature Flags --------------------

class ContactMessageIn(BaseModel):
    name: str = Field(min_length=1, max_length=80)
    email: EmailStr
    subject: str = Field(min_length=1, max_length=120)
    message: str = Field(min_length=5, max_length=2000)


class FeatureFlag(BaseModel):
    key: str
    enabled: bool
    description: Optional[str] = None
