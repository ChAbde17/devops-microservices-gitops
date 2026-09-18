# ==============================================================================
# DevOps Microservices GitOps - Unified Developer Experience (DX)
# ==============================================================================

SHELL := /bin/bash
.DEFAULT_GOAL := help

.PHONY: help
help: ## Display available targets
	@echo "Usage: make [target]"
	@echo ""
	@echo "Targets:"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

.PHONY: install-tools
install-tools: ## Install required CLI tools (kubectl, kind, helm, terraform, gh) to ~/.local/bin
	@./scripts/install-tools.sh

.PHONY: check-tools
check-tools: ## Check versions of all required tools
	@echo "Checking installed tools..."
	@which docker >/dev/null && docker --version || echo "Docker: NOT FOUND"
	@which kubectl >/dev/null && kubectl version --client || echo "kubectl: NOT FOUND"
	@which kind >/dev/null && kind version || echo "kind: NOT FOUND"
	@which helm >/dev/null && helm version --short || echo "helm: NOT FOUND"
	@which terraform >/dev/null && terraform version | head -n 1 || echo "terraform: NOT FOUND"
	@which gh >/dev/null && gh --version | head -n 1 || echo "gh: NOT FOUND"

.PHONY: clean
clean: ## Remove temporary files and build artifacts
	@rm -rf /tmp/devops-bootstrap-*
	@find . -type d -name "__pycache__" -exec rm -rf {} +
	@find . -type d -name ".pytest_cache" -exec rm -rf {} +
	@echo "Clean completed."

# ── CI Targets (mirrors GitHub Actions) ──
.PHONY: ci-backend ci-frontend ci

ci-backend:
	cd apps/backend && \
	if [ -d ".venv" ]; then \
		source .venv/bin/activate && ruff check app/ tests/ && pytest tests/ -v --tb=short; \
	else \
		ruff check app/ tests/ && pytest tests/ -v --tb=short; \
	fi

ci-frontend:
	cd apps/frontend && npm run lint && npm run build

ci: ci-backend ci-frontend

# ── Kubernetes Targets ──
.PHONY: k8s-validate k8s-dry-run k8s-dev k8s-staging k8s-prod

k8s-validate: ## Render and validate all Kustomize overlays
	@echo "── Validating dev overlay ──"
	kubectl kustomize k8s/overlays/dev > /dev/null
	@echo "── Validating staging overlay ──"
	kubectl kustomize k8s/overlays/staging > /dev/null
	@echo "── Validating prod overlay ──"
	kubectl kustomize k8s/overlays/prod > /dev/null
	@echo "✅ All Kustomize overlays are valid."

k8s-dry-run: ## Render final manifests without applying (dry-run)
	@echo "── Dev overlay manifests ──"
	kubectl kustomize k8s/overlays/dev
	@echo "\n── Staging overlay manifests ──"
	kubectl kustomize k8s/overlays/staging
	@echo "\n── Prod overlay manifests ──"
	kubectl kustomize k8s/overlays/prod

k8s-dev: ## Deploy to dev namespace
	kubectl apply -k k8s/overlays/dev
	@echo "✅ Deployed to devops-dev namespace."

k8s-staging: ## Deploy to staging namespace
	kubectl apply -k k8s/overlays/staging
	@echo "✅ Deployed to devops-staging namespace."

k8s-prod: ## Deploy to prod namespace
	kubectl apply -k k8s/overlays/prod
	@echo "✅ Deployed to devops-prod namespace."
