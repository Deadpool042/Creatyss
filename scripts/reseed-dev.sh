#!/usr/bin/env bash
set -euo pipefail

ENV_FILE="${ENV_FILE:-.env.local}"
COMPOSE="docker compose --env-file $ENV_FILE"
DB_SERVICE="db"
APP_SERVICE="app"

echo "==> Truncating seeded tables..."
$COMPOSE exec -T $DB_SERVICE sh -lc 'psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB"' <<'SQL'
TRUNCATE products, categories, blog_posts, homepage_content CASCADE;
SQL

echo "==> Applying seed files..."
for file in db/seeds/*.sql; do
  [ -e "$file" ] || continue
  echo "    $file"
  $COMPOSE exec -T $DB_SERVICE sh -lc 'psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB"' < "$file"
done

echo "==> Seeding dev admin users..."
$COMPOSE exec -T $APP_SERVICE node --experimental-strip-types scripts/seed-dev-admin-users.ts

echo "==> Seeding images (--force)..."
$COMPOSE exec -T $APP_SERVICE node --experimental-strip-types scripts/seed-images.ts --force

echo "==> Done."
