#!/usr/bin/env bash
set -euo pipefail

echo "[start.sh] Starting Nasy backend service..."

cd "backend"

# Install dependencies
if [ -f package-lock.json ]; then
  echo "[start.sh] Installing dependencies with npm ci"
  npm ci --no-audit --no-fund
else
  echo "[start.sh] Installing dependencies with npm install"
  npm install --no-audit --no-fund
fi

# Generate Prisma client
echo "[start.sh] Generating Prisma client"
npx prisma generate

# Build NestJS
echo "[start.sh] Building backend"
npm run build

# Apply database migrations
echo "[start.sh] Applying Prisma migrations"
npx prisma migrate deploy

# Optionally seed the database (set SEED_DATABASE=true to enable)
if [ "${SEED_DATABASE:-}" = "true" ]; then
  echo "[start.sh] Seeding database"
  npx prisma db seed || echo "[start.sh] Seed failed or skipped"
fi

# Start the server
echo "[start.sh] Starting server"
node dist/src/main.js
