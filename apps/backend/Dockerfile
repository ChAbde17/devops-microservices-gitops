# ── Stage 1: Builder ──
FROM python:3.11-alpine AS builder

WORKDIR /build

# Install build dependencies for C-extensions (uvloop, httptools)
RUN apk add --no-cache gcc musl-dev libffi-dev

RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip setuptools wheel && \
    pip install --no-cache-dir -r requirements.txt

# ── Stage 2: Runtime ──
FROM python:3.11-alpine AS runner

WORKDIR /app

RUN addgroup -g 10001 -S appgroup && \
    adduser -u 10001 -G appgroup -S -s /sbin/nologin appuser && \
    chown -R appuser:appgroup /app

COPY --from=builder /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH" \
    PYTHONUNBUFFERED=1

COPY --chown=appuser:appgroup ./app ./app

USER 10001
EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/healthz')" || exit 1

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]