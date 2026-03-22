#!/usr/bin/env bash
set -euo pipefail

ENV_FILE="${ENV_FILE:-.env.local}"
COMPOSE="docker compose --env-file $ENV_FILE"
DB_SERVICE="db"
APP_SERVICE="app"

echo "==> Truncating seeded content tables..."
# shellcheck disable=SC2016
$COMPOSE exec -T $DB_SERVICE sh -lc 'psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB"' <<'SQL'
TRUNCATE TABLE
  product_variant_images,
  product_images,
  product_categories,
  product_variants,
  blog_posts,
  pages,
  categories,
  products,
  media_assets,
  email_templates,
  newsletter_subscribers
CASCADE;
SQL

echo "==> Applying seed files..."
for file in db/seeds/*.sql; do
  [ -e "$file" ] || continue
  echo "    $file"
  # shellcheck disable=SC2016
  $COMPOSE exec -T $DB_SERVICE sh -lc 'psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB"' < "$file"
done

echo "==> Seeding dev admin users..."
$COMPOSE exec -T $APP_SERVICE node --experimental-strip-types scripts/seed-dev-admin-users.ts

echo "==> Seeding images (--force)..."
$COMPOSE exec -T $APP_SERVICE node --experimental-strip-types scripts/seed-images.ts --force

echo "==> Done."
