"""FastAPI application factory."""

import logging
import time

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import router as v1_router
from app.core.config import settings
from app.core.logging import setup_logging
from app.metrics.exporter import setup_metrics

logger = logging.getLogger(__name__)


def create_app() -> FastAPI:
    """Create and configure the FastAPI application."""
    setup_logging()

    application = FastAPI(
        title=settings.APP_NAME,
        version=settings.APP_VERSION,
        description="FastAPI backend for the DevOps GitOps platform",
    )

    # CORS middleware
    application.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Root endpoint
    @application.get("/", tags=["Root"])
    async def root():
        return {
            "service": settings.APP_NAME,
            "version": settings.APP_VERSION,
            "status": "healthy",
            "timestamp": time.time(),
        }

    # Register v1 API routes
    application.include_router(v1_router)

    # Prometheus metrics
    setup_metrics(application)

    logger.info("Application '%s' v%s started", settings.APP_NAME, settings.APP_VERSION)

    return application

app = create_app()
