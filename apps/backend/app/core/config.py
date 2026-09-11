from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    APP_NAME: str = "devops-backend"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False

    #Backend server
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    #Redis
    REDIS_URL: str = "redis://localhost:6379/0"

    #PostgreSQL
    DATABASE_URL: str = "postgresql://devops:devops@localhost:5432/devops_db"

    #CORS
    CORS_ORIGINS: list[str] = ["*"]

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
