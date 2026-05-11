"""FusionCircle Tech backend entrypoint."""
from __future__ import annotations

import logging
import os
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI
from sqlalchemy import text
from sqlalchemy.exc import OperationalError
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from starlette.middleware.cors import CORSMiddleware

from models_db import Base
from routers.admin import router as admin_router
from routers.auth_router import router as auth_router
from routers.chatbot import router as chatbot_router
from routers.notifications import router as notifications_router
from routers.projects import router as projects_router
from seed import seed_admin, seed_feature_flags, write_test_credentials

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env", encoding="utf-8-sig")

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s - %(message)s")
logger = logging.getLogger("fusioncircle")

app = FastAPI(title="FusionCircle Tech API", version="1.0.0")

mysql_url = os.getenv("MYSQL_URL")
if not mysql_url:
    raise RuntimeError("Missing required environment variable MYSQL_URL. Please set it in backend/.env or the process environment.")

engine = create_async_engine(mysql_url, echo=False)
async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
app.state.db_session = async_session
app.state.engine = engine

frontend_url = os.environ.get("FRONTEND_URL", "http://localhost:3000")
origins_env = os.environ.get("CORS_ORIGINS", "").strip()
if origins_env and origins_env != "*":
    origins = [origin.strip() for origin in origins_env.split(",") if origin.strip()]
else:
    origins = [frontend_url, "http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https://.*\.preview\.emergentagent\.com",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def on_startup():
    try:
        async with app.state.engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
    except OperationalError as exc:
        logger.exception("MySQL connection failed during startup.")
        raise RuntimeError(
            "Could not connect to MySQL. Verify MYSQL_URL, the database user/password, "
            "and that the 'fusioncircle' database exists."
        ) from exc

    async with app.state.db_session() as session:
        await seed_admin(session)
        await seed_feature_flags(session)
        await write_test_credentials()

    logger.info("FusionCircle backend ready.")


@app.on_event("shutdown")
async def on_shutdown():
    await app.state.engine.dispose()


@app.get("/api")
async def api_root():
    return {"service": "FusionCircle Tech API", "status": "ok"}


@app.get("/api/health")
async def health():
    try:
        async with app.state.db_session() as session:
            await session.execute(text("SELECT 1"))
        return {"ok": True, "db": "up"}
    except Exception as e:
        return {"ok": False, "error": str(e)}


app.include_router(auth_router)
app.include_router(projects_router)
app.include_router(admin_router)
app.include_router(chatbot_router)
app.include_router(notifications_router)
