#!/usr/bin/env bash
# ==============================================================================
# Script: scripts/install-tools.sh
# Purpose: Bootstrap local DevOps CLI binaries to ~/.local/bin (Zero Sudo)
# ==============================================================================

set -euo pipefail

GREEN="\033[0;32m"
BLUE="\033[0;34m"
YELLOW="\033[1;33m"
RED="\033[0;31m"
NC="\033[0m"

INSTALL_DIR="${HOME}/.local/bin"
mkdir -p "${INSTALL_DIR}"

TMP_DIR=$(mktemp -d /tmp/devops-bootstrap-XXXXXX)
trap 'rm -rf "${TMP_DIR}"' EXIT

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

ARCH=$(uname -m)
if [[ "${ARCH}" != "x86_64" ]]; then
    log_error "This script is configured for x86_64 architecture. Detected: ${ARCH}"
    exit 1
fi

echo -e "${BLUE}=========================================="
echo -e "   DevOps Toolchain Installation Script   "
echo -e "   Target Directory: ${INSTALL_DIR}       "
echo -e "==========================================${NC}\n"

cd "${TMP_DIR}"

# 1. Kubectl
log_info "Installing / Updating kubectl..."
KUBECTL_VERSION=$(curl -L -s https://dl.k8s.io/release/stable.txt)
curl -sLO "https://dl.k8s.io/release/${KUBECTL_VERSION}/bin/linux/amd64/kubectl"
chmod +x kubectl
mv kubectl "${INSTALL_DIR}/"
log_success "kubectl installed (${KUBECTL_VERSION})"

# 2. KinD (Kubernetes in Docker)
log_info "Installing / Updating kind..."
KIND_VERSION="v0.24.0"
curl -sLo ./kind "https://kind.sigs.k8s.io/dl/${KIND_VERSION}/kind-linux-amd64"
chmod +x ./kind
mv ./kind "${INSTALL_DIR}/"
log_success "kind installed (${KIND_VERSION})"

# 3. Helm
log_info "Installing / Updating helm..."
HELM_VERSION="v3.15.4"
curl -sLo helm.tar.gz "https://get.helm.sh/helm-${HELM_VERSION}-linux-amd64.tar.gz"
tar -zxf helm.tar.gz linux-amd64/helm --strip-components=1
chmod +x helm
mv helm "${INSTALL_DIR}/"
log_success "helm installed (${HELM_VERSION})"

# 4. Terraform
log_info "Installing / Updating terraform..."
TF_VERSION="1.9.5"
curl -sLo terraform.zip "https://releases.hashicorp.com/terraform/${TF_VERSION}/terraform_${TF_VERSION}_linux_amd64.zip"
unzip -q -o terraform.zip terraform
chmod +x terraform
mv terraform "${INSTALL_DIR}/"
log_success "terraform installed (${TF_VERSION})"

# 5. GitHub CLI (gh)
log_info "Installing / Updating gh (GitHub CLI)..."
GH_VERSION="2.55.0"
curl -sLo gh.tar.gz "https://github.com/cli/cli/releases/download/v${GH_VERSION}/gh_${GH_VERSION}_linux_amd64.tar.gz"
tar -zxf gh.tar.gz --strip-components=2 "gh_${GH_VERSION}_linux_amd64/bin/gh"
chmod +x gh
mv gh "${INSTALL_DIR}/"
log_success "gh installed (${GH_VERSION})"

echo -e "\n${BLUE}=========================================="
echo -e "          Verification Check             "
echo -e "==========================================${NC}\n"

echo -n "Docker:    " && docker --version 2>/dev/null || log_warn "Docker socket needs group permission (run: sudo usermod -aG docker \$USER && newgrp docker)"
echo -n "Kubectl:   " && kubectl version --client 2>/dev/null || log_error "kubectl not found"
echo -n "KinD:      " && kind version 2>/dev/null || log_error "kind not found"
echo -n "Helm:      " && helm version --short 2>/dev/null || log_error "helm not found"
echo -n "Terraform: " && terraform version | head -n 1 2>/dev/null || log_error "terraform not found"
echo -n "GitHub CLI:" && gh --version | head -n 1 2>/dev/null || log_error "gh not found"

echo -e "\n${GREEN}🎉 Tooling installed successfully!${NC}\n"
