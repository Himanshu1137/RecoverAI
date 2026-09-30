from app.routes.transactions import router as transactions_router
from pathlib import Path
import sys

# Add the project root so the sibling ml package is importable when
# FastAPI is started from the backend directory.
PROJECT_ROOT = Path(__file__).resolve().parents[2]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.errors import unhandled_exception_handler
from app.database.init_db import init_db
from app.database.seed import seed
from app.routes.health import router as health_router
from app.routes.prediction import router as prediction_router
from app.routes.agent import router as agent_router
from app.routes.recovery import router as recovery_router
from app.routes.analytics import router as analytics_router
from app.routes.auth import router as auth_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    if settings.auto_seed_demo:
        seed()
    yield


app = FastAPI(
    title="RecoverAI API",
    description="AI-powered revenue recovery backend",
    version="0.3.1",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=list(dict.fromkeys([
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://recover-ai-orcin-two.vercel.app",
        settings.cors_origin,
    ])),
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_exception_handler(Exception, unhandled_exception_handler)

app.include_router(health_router)
app.include_router(prediction_router)
app.include_router(agent_router)
app.include_router(recovery_router)
app.include_router(analytics_router)
app.include_router(auth_router)
app.include_router(transactions_router)


@app.get("/")
def root():
    return {
        "message": "RecoverAI API is running",
        "docs": "/docs",
        "version": "0.3.1",
    }
