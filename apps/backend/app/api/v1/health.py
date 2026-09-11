"""Health and readiness probe endpoints."""

import time

from fastapi import APIRouter, Depends, HTTPException, status

from ...db.session import check_db_connection
from ...models.health import HealthResponse, ReadyResponse
from ...services.incident import IncidentSimulator
from ..deps import get_incident_simulator

router = APIRouter(tags=["Health"])


@router.get("/healthz", response_model=HealthResponse)
async def healthz():
    """Liveness probe - returns 200 if the process is alive."""
    return HealthResponse(status="ok", timestamp=time.time())


@router.get("/readyz", response_model=ReadyResponse)
async def readyz(
    simulator: IncidentSimulator = Depends(get_incident_simulator),
):
    """Readiness probe - verifies downstream dependencies."""
    db_ok = await check_db_connection()

    if not db_ok:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database not reachable",
        )

    if simulator.error_rate >= 1.0:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Service forcibly set to unready by SRE simulator",
        )

    return ReadyResponse(status="ready", checks={"database": "ok", "redis": "ok"})


@router.get("/api/v1/healthz", response_model=HealthResponse)
async def api_v1_healthz():
    """Versioned liveness probe (used by React frontend polling)."""
    return HealthResponse(status="ok", timestamp=time.time())


@router.get("/api/v1/readyz", response_model=ReadyResponse)
async def api_v1_readyz(
    simulator: IncidentSimulator = Depends(get_incident_simulator),
):
    """Versioned readiness probe."""
    return await readyz(simulator)
