"""SRE Incident Simulation endpoints - chaos engineering for the dashboard."""

from fastapi import APIRouter, Depends, Query

from app.api.deps import get_incident_simulator
from app.models.simulation import SimulationResponse
from app.services.incident import IncidentSimulator

router = APIRouter(tags=["SRE Simulation"])


@router.post("/api/v1/simulate-workload", response_model=SimulationResponse)
async def simulate_workload(
    latency_ms: int = Query(0, ge=0, le=10000),
    error_rate: float = Query(0.0, ge=0.0, le=1.0),
    simulator: IncidentSimulator = Depends(get_incident_simulator),
):
    """
    Injects aritficial latency and/or HTTP 500 errors.
    Used by the React frontend's WorkloadSimulator component
    """
    result = await simulator.simulate(latency_ms, error_rate)
    return SimulationResponse(**result)
