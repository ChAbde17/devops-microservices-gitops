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

# ── ArgoCD Targets ──
.PHONY: argocd-install argocd-password argocd-ui argocd-apply argocd-status

argocd-install: ## Install ArgoCD on Minikube via Helm
	helm repo add argo https://argoproj.github.io/argo-helm
	helm repo update
	kubectl create namespace argocd --dry-run=client -o yaml | kubectl apply -f -
	helm install argocd argo/argo-cd -n argocd -f argocd/install/values.yaml
	@echo "⏳ Waiting for ArgoCD pods to be ready..."
	kubectl wait --for=condition=ready pod -l app.kubernetes.io/part-of=argocd -n argocd --timeout=120s
	@echo "✅ ArgoCD installed successfully."

argocd-password: ## Get ArgoCD admin password
	@echo "ArgoCD admin password:"
	@kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d && echo

argocd-ui: ## Port-forward ArgoCD UI to https://localhost:8443
	@echo "🌐 ArgoCD UI available at: https://localhost:8443"
	@echo "   Username: admin"
	@echo "   Password: run 'make argocd-password'"
	kubectl port-forward svc/argocd-server -n argocd 8443:443

argocd-apply: ## Apply ArgoCD Project and Applications
	kubectl apply -f argocd/projects/devops-project.yaml
	kubectl apply -f argocd/applications/devops-dev.yaml
	kubectl apply -f argocd/applications/devops-prod.yaml
	@echo "✅ ArgoCD Applications applied. Check UI for sync status."

argocd-status: ## Show ArgoCD Application sync status
	@echo "── Dev Application ──"
	kubectl get application devops-dev -n argocd -o jsonpath='{.status.sync.status}' && echo
	@echo "── Prod Application ──"
	kubectl get application devops-prod -n argocd -o jsonpath='{.status.sync.status}' && echo