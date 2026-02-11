#!/usr/bin/env bash
# CI/local helper: create table (optional), run migration, start backend and run smoke tests
set -euo pipefail
ROOT=$(cd "$(dirname "$0")/.." && pwd)
cd "$ROOT"
LOG_DIR="$PWD/tmp/ci-migrate-logs"
mkdir -p "$LOG_DIR"

echo "CREATE TABLE (if POSTGRES_URL provided)"
if [ -n "${POSTGRES_URL-}" ]; then
  node psy-matrimoni/backend/scripts/create_requests_table.js 2>&1 | tee "$LOG_DIR/create_table.log"
else
  echo "POSTGRES_URL not set — skip create_table step" | tee "$LOG_DIR/create_table.log"
fi

echo "RUN MIGRATION (Supabase)"
node psy-matrimoni/backend/scripts/migrate-requests-to-db.js 2>&1 | tee "$LOG_DIR/migration.log"

echo "START BACKEND"
nohup npm run dev --prefix psy-matrimoni/backend > "$LOG_DIR/backend.log" 2>&1 &
echo $! > "$LOG_DIR/backend.pid"

# wait for health
n=0
until curl -sS http://127.0.0.1:5001/health >/dev/null 2>&1 || [ $n -ge 30 ]; do sleep 1; n=$((n+1)); done
curl -sS http://127.0.0.1:5001/health || true

echo "SMOKE: /api/requests"
curl -sS http://127.0.0.1:5001/api/requests | jq . | head -n 60 || true

echo "Logs written to $LOG_DIR"