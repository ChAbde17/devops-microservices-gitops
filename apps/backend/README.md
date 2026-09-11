# DevOps Backend — FastAPI Microservice

High-performance async API backend with Prometheus instrumentation, SRE chaos engineering simulation, and Kubernetes-ready health probes.

## Quick Start

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements-dev.txt

# Run locally
uvicorn app.main:app --reload --port 8000

# Run tests
pytest tests/ -v

# Lint
ruff check app/ tests/
```

## API Endpoints

| Endpoint | Method | Purpose |
|---|---|---|
| `/` | GET | Service info |
| `/healthz` | GET | Kubernetes liveness probe |
| `/readyz` | GET | Kubernetes readiness probe |
| `/metrics` | GET | Prometheus scrape target |
| `/api/v1/healthz` | GET | Versioned health check (frontend) |
| `/api/v1/status` | GET | Service metadata |
| `/api/v1/simulate-workload` | POST | SRE incident simulator |

## Architecture

```
app/
├── main.py          → App factory
├── core/            → Config & logging
├── api/v1/          → Route handlers (health, status, simulation)
├── models/          → Pydantic response schemas
├── services/        → Business logic (incident simulator)
├── db/              → Database connections
└── metrics/         → Prometheus exporter
```