#!/usr/bin/env bash
set -euo pipefail

# ─── Deploy to Raspberry Pi(s) ──────────────────────────────────
# Deploys the portfolio + Stripe server to one or more Pis via SSH/rsync.
#
# Usage:
#   ./deploy-to-pi.sh                     # uses .env defaults
#   PI_HOSTS=pi@10.0.0.5 ./deploy-to-pi.sh  # override target
#
# Expects:
#   - SSH key access to each Pi
#   - Node.js 18+ installed on the Pi
#   - systemd (for service management)
# ─────────────────────────────────────────────────────────────────

# Load .env if present
if [ -f .env ]; then
  set -a; source .env; set +a
fi

PI_HOSTS="${PI_HOSTS:-pi@192.168.1.100}"
PI_DEPLOY_PATH="${PI_DEPLOY_PATH:-/opt/portfolio}"
PI_SSH_KEY="${PI_SSH_KEY:-$HOME/.ssh/id_ed25519}"
SERVICE_NAME="portfolio"

SSH_OPTS="-o StrictHostKeyChecking=no -o ConnectTimeout=10"
if [ -f "$PI_SSH_KEY" ]; then
  SSH_OPTS="$SSH_OPTS -i $PI_SSH_KEY"
fi

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "=== Portfolio Pi Deployer ==="
echo ""

IFS=',' read -ra HOSTS <<< "$PI_HOSTS"

for HOST in "${HOSTS[@]}"; do
  HOST=$(echo "$HOST" | xargs)  # trim whitespace
  echo "--- Deploying to $HOST ---"

  # 1. Ensure target dir exists
  ssh $SSH_OPTS "$HOST" "sudo mkdir -p $PI_DEPLOY_PATH && sudo chown \$(whoami) $PI_DEPLOY_PATH"

  # 2. Rsync project files (exclude dev stuff)
  rsync -avz --delete \
    -e "ssh $SSH_OPTS" \
    --exclude='node_modules' \
    --exclude='.git' \
    --exclude='test-results' \
    --exclude='playwright-report' \
    --exclude='.env' \
    "$SCRIPT_DIR/" "$HOST:$PI_DEPLOY_PATH/"

  # 3. Install production dependencies on the Pi
  ssh $SSH_OPTS "$HOST" "cd $PI_DEPLOY_PATH && npm ci --omit=dev"

  # 4. Copy .env if it exists locally (secrets stay on the Pi)
  if [ -f "$SCRIPT_DIR/.env" ]; then
    scp $SSH_OPTS "$SCRIPT_DIR/.env" "$HOST:$PI_DEPLOY_PATH/.env"
  fi

  # 5. Create/update systemd service
  ssh $SSH_OPTS "$HOST" "sudo tee /etc/systemd/system/${SERVICE_NAME}.service > /dev/null" <<UNIT
[Unit]
Description=Portfolio Server (Stripe)
After=network.target

[Service]
Type=simple
User=$(echo "$HOST" | cut -d@ -f1)
WorkingDirectory=$PI_DEPLOY_PATH
ExecStart=/usr/bin/node $PI_DEPLOY_PATH/server.js
Restart=always
RestartSec=5
Environment=NODE_ENV=production
EnvironmentFile=$PI_DEPLOY_PATH/.env

[Install]
WantedBy=multi-user.target
UNIT

  # 6. Reload and restart
  ssh $SSH_OPTS "$HOST" "sudo systemctl daemon-reload && sudo systemctl enable ${SERVICE_NAME} && sudo systemctl restart ${SERVICE_NAME}"

  # 7. Health check
  sleep 2
  if ssh $SSH_OPTS "$HOST" "curl -sf http://localhost:3000/api/health > /dev/null 2>&1"; then
    echo "[OK] $HOST — server healthy"
  else
    echo "[WARN] $HOST — health check failed, check logs: ssh $HOST journalctl -u $SERVICE_NAME -f"
  fi

  echo ""
done

echo "=== Deployment complete ==="
echo "Targets: ${HOSTS[*]}"
echo "Service: systemctl status $SERVICE_NAME"
echo "Logs:    journalctl -u $SERVICE_NAME -f"
