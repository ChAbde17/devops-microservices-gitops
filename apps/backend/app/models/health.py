from pydantic import BaseModel


class HealthResponse(BaseModel):
    status: str
    timestamp: float


class ReadyResponse(BaseModel):
    status: str
    checks: dict[str, str]
