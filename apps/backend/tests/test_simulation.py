"""Tests for the SRE workload simulation endpoint."""


def test_simulate_workload_no_injection(client):
    response = client.post("/api/v1/simulate-workload?latency_ms=0&error_rate=0")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["injected_latency_ms"] == 0
    assert data["injected_error_rate"] == 0.0


def test_simulate_workload_with_latency(client):
    response = client.post("/api/v1/simulate-workload?latency_ms=100&error_rate=0")
    assert response.status_code == 200
    assert response.json()["injected_latency_ms"] == 100


def test_simulate_workload_guarenteed_error(client):
    """error_rate=1.0 should always trigger a 500."""
    response = client.post("/api/v1/simulate-workload?latency_ms=0&error_rate=1.0")
    assert response.status_code == 500
