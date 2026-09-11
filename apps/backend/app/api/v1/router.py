"""Central v1 API router - aggregates all endpoint modules."""

from fastapi import APIRouter

from app.api.v1 import health, simulation, status

router = APIRouter()

# Mount domain-specific routers
router.include_router(health.router)
router.include_router(status.router)
router.include_router(simulation.router)
