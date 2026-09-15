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
		cd apps/backend && ruff check app/ tests/ && pytest tests/ -v --tb=short

ci frontend:
		cd apps/frontend && npm run lint && npm run build

ci: ci-backend ci-frontend
