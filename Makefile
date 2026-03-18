SHELL := /bin/bash
ENV_FILE ?= .env.local

COMPOSE := docker compose --env-file $(ENV_FILE)

PROFILE_CORE := --profile core
PROFILE_PROXY := --profile proxy
PROFILE_JOBS := --profile jobs

COMPOSE_CORE := $(COMPOSE) $(PROFILE_CORE)
COMPOSE_CORE_PROXY := $(COMPOSE) $(PROFILE_CORE) $(PROFILE_PROXY)

APP_SERVICE := app
DB_SERVICE := db
STRIPE_WEBHOOK_FORWARD_URL ?= http://localhost:3000/api/stripe/webhook
CERT_DIR := docker/traefik/certs
CERT_DOMAINS := creatyss.localhost
APP_BUILD_NODE_OPTIONS ?= --max-old-space-size=2048

.PHONY: help up up-proxy down restart build app-build logs ps sh dev typecheck \
	db-schema db-seed-dev db-seed-images db-import-woocommerce db-import-woocommerce-images \
	db-reseed-dev db-reset-dev uploads-import seed seed-data-init test test-unit \
	test-e2e test-e2e-ui test-e2e-headed test-select stripe-dev certs hosts-setup



help:
	@echo "Usage: make [target]"
	@echo "Targets:"
	@echo "  up              - Demarre app + db"
	@echo "  up-proxy        - Demarre app + db + traefik"
	@echo "  down            - Stoppe les services"
	@echo "  restart         - Redemarre le mode minimal"
	@echo "  build           - Construit les images Docker du mode minimal"
	@echo "  app-build       - Lance le build Next.js dans le conteneur app avec NODE_OPTIONS"
	@echo "  logs            - Suit les logs du mode minimal"
	@echo "  ps              - Liste les conteneurs du mode minimal"
	@echo "  sh              - Ouvre un shell dans l'app"
	@echo "  dev             - Lance le serveur de dev dans l'app"
	@echo "  seed            - Lance le job seeder manuellement"
	@echo "  db-schema       - Applique toutes les migrations SQL"
	@echo "  db-seed-dev     - Applique les seeds SQL + admin users + images"
	@echo "  db-reset-dev    - Reset complet de la base de dev"
	@echo "  stripe-dev      - Lance le forward Stripe"
	@echo "  certs           - Genere les certs TLS locaux via mkcert"
	@echo "  hosts-setup     - Ajoute les entrees /etc/hosts"

certs:
	@echo "Generating local TLS certs with mkcert..."
	@mkdir -p $(CERT_DIR)
	mkcert -cert-file $(CERT_DIR)/local.crt -key-file $(CERT_DIR)/local.key $(CERT_DOMAINS)
	@echo "Done. Certs written to $(CERT_DIR)/"

hosts-setup:
	@echo "Adding local DNS entries to /etc/hosts (requires sudo)..."
	@grep -q "creatyss.localhost" /etc/hosts || echo "127.0.0.1 creatyss.localhost" | sudo tee -a /etc/hosts
	@echo "Done."

stripe-dev:
	stripe listen --forward-to $(STRIPE_WEBHOOK_FORWARD_URL)

up:
	$(COMPOSE_CORE) up -d --build

up-proxy:
	$(COMPOSE_CORE_PROXY) up -d --build

down:
	$(COMPOSE) down

restart:
	$(COMPOSE_CORE) down
	$(COMPOSE_CORE) up -d --build


logs:
	$(COMPOSE_CORE) logs -f

ps:
	$(COMPOSE_CORE) ps

sh:
	$(COMPOSE_CORE) exec $(APP_SERVICE) sh

dev:
	$(COMPOSE_CORE) exec $(APP_SERVICE) pnpm run dev

seed:
	$(COMPOSE) $(PROFILE_CORE) $(PROFILE_JOBS) run --rm seeder

build:
	$(COMPOSE_CORE) build

app-build:
	$(COMPOSE_CORE) exec -e NODE_OPTIONS="$(APP_BUILD_NODE_OPTIONS)" $(APP_SERVICE) pnpm run build

db-schema:
	@for migration in db/migrations/*.sql; do \
		echo "Applying $$migration"; \
		$(COMPOSE_CORE) exec -T $(DB_SERVICE) sh -lc 'psql -v ON_ERROR_STOP=1 -U "$$POSTGRES_USER" -d "$$POSTGRES_DB"' < "$$migration" || exit $$?; \
	done

typecheck:
	$(COMPOSE_CORE) exec $(APP_SERVICE) pnpm run typecheck

db-seed-dev:
	@for file in db/seeds/*.sql; do \
		[ -e "$$file" ] || continue; \
		echo "Applying $$file"; \
		$(COMPOSE_CORE) exec -T $(DB_SERVICE) sh -lc 'psql -v ON_ERROR_STOP=1 -U "$$POSTGRES_USER" -d "$$POSTGRES_DB"' < "$$file" || exit $$?; \
	done
	@echo "Seeding dev admin users"
	@$(COMPOSE_CORE) exec -T $(APP_SERVICE) node --experimental-strip-types scripts/seed-dev-admin-users.ts
	@$(MAKE) db-seed-images

db-seed-images:
	@echo "Seeding images..."
	@$(COMPOSE_CORE) exec -T $(APP_SERVICE) node --experimental-strip-types scripts/seed-images.ts

db-import-woocommerce:
	@echo "Importing WooCommerce data (data only, no images)..."
	@$(COMPOSE_CORE) exec -T $(APP_SERVICE) node --experimental-strip-types scripts/import-woocommerce.ts --skip-images

db-import-woocommerce-images:
	@echo "Importing WooCommerce data with images (this may take a while)..."
	@$(COMPOSE_CORE) exec -T $(APP_SERVICE) node --experimental-strip-types scripts/import-woocommerce.ts

db-reseed-dev:
	@bash scripts/reseed-dev.sh

db-reset-dev:
	$(COMPOSE_CORE) down -v
	$(COMPOSE_CORE) up -d --build
	$(MAKE) db-schema
	$(MAKE) db-seed-dev

uploads-import:
	@echo "Importing uploads from host to volume..."
	@if [ -d "public/uploads" ]; then \
		$(COMPOSE_CORE) run --rm -v "$(shell pwd)/public/uploads:/host_uploads:ro" \
			-v uploads_data:/app/public/uploads \
			--no-deps $(APP_SERVICE) sh -c "cp -rn /host_uploads/. /app/public/uploads/ && echo 'Import done.'"; \
	else \
		echo "No public/uploads directory found on host."; \
	fi

seed-data-init:
	@mkdir -p seed_data/images
	@if [ -f public/uploads/creatyss.webp ]; then \
		cp public/uploads/creatyss.webp seed_data/images/creatyss.webp; \
		echo "Copied creatyss.webp to seed_data/images/ — commit this file."; \
	elif [ -f seed_data/images/creatyss.webp ]; then \
		echo "seed_data/images/creatyss.webp already exists."; \
	else \
		echo "Error: public/uploads/creatyss.webp not found."; exit 1; \
	fi

test:
	$(COMPOSE_CORE) exec $(APP_SERVICE) pnpm run test

test-unit:
	$(COMPOSE_CORE) exec $(APP_SERVICE) pnpm run test:unit

test-e2e:
	pnpm run test:e2e

test-e2e-ui:
	pnpm exec playwright test --ui

test-e2e-headed:
	pnpm exec playwright test --headed

test-select:
	pnpm run test-select
