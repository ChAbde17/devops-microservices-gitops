from pydantic import BaseModel


class SimulationResponse(BaseModel):
    status: str
    injected_latency_ms: int
    injected_error_rate: float
