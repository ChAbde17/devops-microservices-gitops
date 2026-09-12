"""SRE Incident Simulation Service - manages chaos engineering state."""

import asyncio
import random

from fastapi import HTTPException, status


class IncidentSimulator:
    """Manages artificial latency  injection and error rate simulation."""

    def __init__(self):
        self._delay_ms: int = 0
        self._error_rate: float = 0.0

    @property
    def error_rate(self) -> float:
        return self._error_rate

    async def simulate(self, latency_ms: int, error_rate: float) -> dict:
        """Execute a simulation round with the given parameters."""
        self._delay_ms = latency_ms
        self._error_rate = error_rate

        if latency_ms > 0:
            await asyncio.sleep(latency_ms / 1000.0)

        if error_rate > 0 and random.random() < error_rate:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Simulated incident (SRE Chaos Engineering)",
            )

        return {
            "status": "success",
            "injected_latency_ms": latency_ms,
            "injected_error_rate": error_rate,
        }

# Singelton instance shared across the application
incident_simulator = IncidentSimulator()
