import os
from dataclasses import dataclass
from dotenv import load_dotenv

load_dotenv()

@dataclass(frozen=True)
class Settings:
    database_url: str = os.getenv("DATABASE_URL", "sqlite:///./recoverai.db")
    llm_provider: str = os.getenv("LLM_PROVIDER", "mock")
    llm_api_key: str = os.getenv("LLM_API_KEY", "")
    llm_model: str = os.getenv("LLM_MODEL", "")
    cors_origin: str = os.getenv("CORS_ORIGIN", "http://localhost:5173")
    auto_seed_demo: bool = os.getenv("AUTO_SEED_DEMO", "true").lower() == "true"
    jwt_secret: str = os.getenv(
        "JWT_SECRET",
        "recoverai-local-development-secret-change-in-production"
    )
    jwt_algorithm: str = os.getenv("JWT_ALGORITHM", "HS256")
    access_token_expire_minutes: int = int(
        os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440")
    )

settings = Settings()
