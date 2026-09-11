"""Test the status endpoint."""


def test_api_v1_status(client):
    response = client.get("/api/v1/status")
    assert response.status_code == 200
    data = response.json()
    assert data["service"] == "devops-backend"
    assert "version" in data
    assert "timestamp" in data
