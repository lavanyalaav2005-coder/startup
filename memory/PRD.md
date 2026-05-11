# FusionCircle Tech — SaaS Platform PRD

## Original Problem Statement
Build a COMPLETE startup-grade SaaS platform for "FusionCircle Tech" — an AI-powered IT services company. Must have stunning animated UI, client onboarding, admin + super admin dashboards, AI automation, and marketing-ready SEO structure. Delivered as FastAPI + React + MongoDB (in place of the originally-mentioned Django/Supabase due to platform optimisation) with JWT auth, Emergent Universal LLM Key, and Resend email (toggleable).

## User Personas
1. **Visitor / Prospect** — lands on public pages, chats with AI concierge, fills contact form or creates account.
2. **Client** — logs into `/app/client`, submits project requests, tracks statuses, reads notifications.
3. **Admin / Super Admin** — logs into `/app/admin`, reviews projects, approves/rejects, triggers AI proposals, manages users and feature flags.

## Core Requirements (static)
- Apple-level premium UI: dark-first with light toggle, Outfit/Manrope typography, glassmorphism header, particle hero, animated stats/CTA, tracing-beam service cards.
- JWT auth (httpOnly cookies), bcrypt, brute-force lockout, OTP toggle via feature flag.
- Role-based access (client / admin / super_admin).
- AI chatbot using Claude Sonnet 4.5 via `emergentintegrations` + Emergent Universal LLM Key.
- AI Proposal generator for any project.
- MongoDB persistence with indexes; all UUID string ids; no ObjectId in responses.
- Resend email service (mock-logged when RESEND_API_KEY unset).
- SEO-friendly HTML head + meta tags.

## What's Been Implemented (2026-02)
- **Backend (FastAPI)**: `server.py`, routers for auth/projects/admin/chatbot/notifications, `auth.py` (JWT + bcrypt + RBAC), `email_service.py`, `models.py`, `seed.py` (seeds two admin accounts, indexes, feature flags, `test_credentials.md` writer). All endpoints `/api/*`.
- **Admin Accounts (seeded on startup)**:
  - Super Admin: `prakash@gmail.com` / `admin` (role: super_admin)
  - Admin: `lavanya05@gmail.com` / `admin` (role: admin)
- **Frontend (React)**: Routes for `/`, `/services`, `/about`, `/contact`, `/login`, `/register`, `/app/client`, `/app/admin`. Context: Auth + Theme. Framer-motion page transitions, tsparticles hero, recharts analytics.
- **Advanced background animations (2026-02 iteration)**: AuroraBackground (4 animated radial-gradient blobs with blur), CursorGlow (follows mouse), MarqueeTicker (giant scrolling text band), scanline overlay, grid-fade mask, sweep effect on cards.
- **AI**: Chatbot widget (Nova) + AI Proposal generator, session history persisted in MongoDB.
- **Admin Dashboard**: Overview KPIs, 3 charts (line/pie/bar), project approval flow, AI proposal panel, user table, feature-flag toggles.
- **Client Dashboard**: Project list with status chips, notifications panel, project submission modal.
- **Seeded credentials**: `/app/memory/test_credentials.md`.
- **Testing**: Backend pytest 19/19 passing; frontend e2e passing (critical CSS click-blocker bug identified + fixed: `.fc-trace-card::before` now has `pointer-events: none`).

## Prioritized Backlog

### P0 (before next milestone)
- Add real `RESEND_API_KEY` for live transactional emails.
- Enable OTP feature flag for production-grade login hardening.

### P1
- Super Admin management UI (role assignment, admin audit log viewer).
- Blog / CMS module for SEO (public `/blog` + admin editor).
- Google Analytics / PostHog event wiring for marketing funnels.
- WebSocket real-time notifications instead of polling.
- Client activity tracking (button clicks, session logs) + admin view.

### P2
- Advanced AI project recommendation system (matches services to client brief).
- Google/GitHub OAuth alternative to email/password.
- Stripe retainer payments.
- Docker + Nginx prod compose & CI/CD playbook (GitHub Actions).
- Password reset flow via email magic link.

## Next Tasks (when user resumes)
1. Provide Resend API key → enable real emails.
2. Turn on OTP via Super Admin → Feature Flags (`otp_enabled`).
3. Decide on Super Admin UX scope (role management, audit log) before expanding.
4. Add Blog + SEO content engine (P1).

## Architecture (high level)
- `React` SPA on port 3000 → `REACT_APP_BACKEND_URL`
- `FastAPI` on port 8001 behind `/api` prefix
- `MongoDB` on `MONGO_URL`, DB = `fusioncircle_db`
- External: Emergent Universal LLM Key → Claude Sonnet 4.5 via `emergentintegrations`
- Optional external: Resend (email)

## Key API Endpoints
- `POST /api/auth/register | /login | /logout | /refresh | /verify-otp`
- `GET  /api/auth/me`
- `POST /api/projects` (client)
- `GET  /api/projects/mine | /api/projects` (admin)
- `PATCH /api/projects/{id}/status` (admin)
- `POST /api/chatbot/message`
- `POST /api/chatbot/proposal/{project_id}` (admin)
- `GET  /api/notifications/mine`
- `POST /api/contact`
- `GET  /api/admin/analytics | /users | /feature-flags` (admin)
- `PATCH /api/admin/feature-flags/{key}` (super_admin)
