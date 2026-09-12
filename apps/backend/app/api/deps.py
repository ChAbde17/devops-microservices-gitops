"""Shared FastAPI dependencies (Dependency Injection)"""

from ..core.config import Settings, settings
from ..services.incident import IncidentSimulator, incident_simulator


def get_settings() -> Settings:
    """Dependency: returns the application settings singelton."""
    return settings


def get_incident_simulator() -> IncidentSimulator:
    """Dependency: returns the incident simulator singelton."""
    return incident_simulator
