#!/usr/bin/env bash
set -euo pipefail

ENV_FILE="${ENV_FILE:-.env.local}"
COMPOSE="docker compose --env-file $ENV_FILE"
APP_SERVICE="app"

echo "==> Regenerating Prisma client..."
$COMPOSE exec -T $APP_SERVICE pnpm run prisma:generate

echo "==> Resetting database from Prisma schema..."
$COMPOSE exec -T $APP_SERVICE pnpm run prisma:db:reset

echo "==> Seeding local content..."
$COMPOSE exec -T $APP_SERVICE pnpm run seed:dev

echo "==> Done."
