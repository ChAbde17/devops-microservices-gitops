"""Tests for health and readiness endpoints."""


def test_root(client):
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["service"] == "devops-backend"
    assert data["status"] == "healthy"


def test_healthz(client):
    response = client.get("/healthz")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_readyz(client):
    response = client.get("/readyz")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ready"
    assert "database" in data["checks"]


def test_api_v1_healthz(client):
    """Tests the versioned healthz used by the react frontend."""
    response = client.get("/api/v1/healthz")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"
