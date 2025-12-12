#!/usr/bin/env bash
set -euo pipefail

# Launch backend service from repo root
cd "$(dirname "$0")/backend"

# Install deps
if command -v npm >/dev/null 2>&1; then
  if [ -f package-lock.json ]; then
    npm ci --unsafe-perm || npm install --unsafe-perm
  else
    npm install --unsafe-perm
  fi
else
  echo "npm is not installed" >&2
  exit 1
fi

# Build and start (start:prod already runs migrations then boots the server)
npm run build
npm run start:prod
