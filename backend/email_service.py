"""Email service with Resend + console fallback."""
from __future__ import annotations

import logging
import os
from typing import Optional

logger = logging.getLogger("fusioncircle.email")


def _enabled() -> bool:
    key = os.environ.get("RESEND_API_KEY", "").strip()
    return bool(key)


async def send_email(to: str, subject: str, html: str, text: Optional[str] = None) -> bool:
    """Send email via Resend. Falls back to console logging if RESEND_API_KEY is unset."""
    if not _enabled():
        logger.info("[EMAIL MOCK] to=%s subject=%s", to, subject)
        logger.info("[EMAIL MOCK BODY] %s", (text or html)[:400])
        return True
    try:
        import resend
        resend.api_key = os.environ["RESEND_API_KEY"]
        params = {
            "from": os.environ.get("EMAIL_FROM", "onboarding@resend.dev"),
            "to": [to],
            "subject": subject,
            "html": html,
        }
        if text:
            params["text"] = text
        resend.Emails.send(params)
        return True
    except Exception as e:
        logger.exception("Resend email failed: %s", e)
        return False


# Ready-made templates ------------------------------------------------------

def tpl_welcome(name: str) -> tuple[str, str]:
    subject = "Welcome to FusionCircle Tech"
    html = f"""
    <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; background:#050505; color:#fff; padding:32px;">
      <h1 style="color:#00F0FF;">Welcome, {name}.</h1>
      <p>Your FusionCircle Tech account is ready. Submit a project request from your client dashboard and our team (and AI) will craft a proposal in minutes.</p>
      <p style="margin-top:24px;color:#A1A1AA">— The FusionCircle Team</p>
    </div>
    """
    return subject, html


def tpl_project_submitted(name: str, title: str) -> tuple[str, str]:
    subject = f"Project received: {title}"
    html = f"""
    <div style="font-family: -apple-system, sans-serif; background:#050505; color:#fff; padding:32px;">
      <h1 style="color:#00F0FF;">We got it, {name}.</h1>
      <p>Your project <strong>{title}</strong> has been received and is under review. You'll receive an update shortly.</p>
    </div>
    """
    return subject, html


def tpl_project_status(name: str, title: str, status: str, note: Optional[str]) -> tuple[str, str]:
    subject = f"Project update: {title} — {status}"
    note_html = f"<p><em>{note}</em></p>" if note else ""
    html = f"""
    <div style="font-family: -apple-system, sans-serif; background:#050505; color:#fff; padding:32px;">
      <h1 style="color:#00F0FF;">Status update</h1>
      <p>Hi {name}, your project <strong>{title}</strong> is now <strong>{status}</strong>.</p>
      {note_html}
    </div>
    """
    return subject, html


def tpl_otp(code: str) -> tuple[str, str]:
    subject = "Your FusionCircle verification code"
    html = f"""
    <div style="font-family: -apple-system, sans-serif; background:#050505; color:#fff; padding:32px;">
      <h1 style="color:#00F0FF;">Your code</h1>
      <p style="font-size:28px; letter-spacing:8px; font-weight:700;">{code}</p>
      <p>This code expires in 10 minutes.</p>
    </div>
    """
    return subject, html
