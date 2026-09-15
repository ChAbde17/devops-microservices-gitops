# ── Stage 1: Builder ──
FROM python:3.11-alpine AS builder

WORKDIR /build

# Upgrade Alpine OS packages & install build dependencies
RUN apk update && apk upgrade --no-cache && \
    apk add --no-cache gcc musl-dev libffi-dev

RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip "setuptools>=78.1.1" "wheel>=0.46.2" && \
    pip install --no-cache-dir -r requirements.txt

# ── Stage 2: Runtime ──
FROM python:3.11-alpine AS runner

WORKDIR /app

# 1. Upgrade Alpine OS packages to patch OS CVEs
# 2. Upgrade system pip/setuptools/wheel and purge unneeded base image setuptools
RUN apk update && apk upgrade --no-cache && \
    /usr/local/bin/python -m pip install --no-cache-dir --upgrade pip "setuptools>=78.1.1" "wheel>=0.46.2" && \
    rm -rf /usr/local/lib/python3.11/site-packages/setuptools*70* && \
    addgroup -g 10001 -S appgroup && \
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