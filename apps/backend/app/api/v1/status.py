"""System status endpoint for the frontend dashboard."""

import time

from fastapi import APIRouter, Depends

from app.api.deps import get_settings
from app.core.config import Settings

router = APIRouter(tags=["Status"])


@router.get("/api/v1/status")
async def api_status(settings: Settings = Depends(get_settings)):
    """Returns service metadata for the dashboard."""
    return {
        "service": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "environment": "development" if settings.DEBUG else "production",
        "timestamp": time.time(),
    }
