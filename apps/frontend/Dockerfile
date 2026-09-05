# ==============================================================================
# Multi-Stage Production Dockerfile for Frontend (Vite + React + Nginx)
# Hardened, Unprivileged, and Minimal
# ==============================================================================

# Stage 1: Build static assets
FROM node:20-alpine AS builder

WORKDIR /app

# Cache dependencies layer
COPY package.json ./
RUN npm install --frozen-lockfile || npm install

# Build static bundle
COPY . ./
RUN npm run build

# Stage 2: Serve via unprivileged Nginx
FROM nginxinc/nginx-unprivileged:alpine AS runner

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy production build from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:8080/nginx-health || exit 1

CMD ["nginx", "-g", "daemon off;"]
