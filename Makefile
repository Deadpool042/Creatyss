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

.PHONY: help \
	up up-proxy down restart build app-build logs ps sh dev stripe-dev certs hosts-setup \
	prisma-format prisma-validate prisma-generate prisma-db-push prisma-db-reset prisma-studio \
	db-schema \
	db-shell db-seed-dev db-seed-images db-import-woocommerce db-import-woocommerce-images \
	db-reseed-dev db-reset-dev uploads-import seed seed-data-init \
	typecheck-local typecheck typecheck-watch lint-local lint lint-fix lint-watch \
	format format-check format-check-local \
	test test-unit test-e2e test-e2e-ui test-e2e-headed test-select

help:
	@echo "Usage: make [target]"
	@echo ""
	@echo "Infrastructure:"
	@echo "  up                         - Demarre app + db"
	@echo "  up-proxy                   - Demarre app + db + traefik"
	@echo "  down                       - Stoppe les services"
	@echo "  restart                    - Redemarre app + db"
	@echo "  build                      - Construit les images Docker"
	@echo "  app-build                  - Lance le build Next.js dans le conteneur"
	@echo "  logs                       - Suit les logs"
	@echo "  ps                         - Liste les conteneurs"
	@echo "  sh                         - Ouvre un shell dans l'app"
	@echo "  dev                        - Lance le serveur de dev"
	@echo "  stripe-dev                 - Lance le forward Stripe"
	@echo "  certs                      - Genere les certs TLS locaux via mkcert"
	@echo "  hosts-setup                - Ajoute les entrees /etc/hosts"
	@echo ""
	@echo "Prisma:"
	@echo "  prisma-format              - Formate le schema Prisma dans le conteneur"
	@echo "  prisma-validate            - Valide le schema Prisma dans le conteneur"
	@echo "  prisma-generate            - Regenere le client Prisma dans le conteneur"
	@echo "  prisma-db-push             - Applique le schema Prisma a la base dans le conteneur"
	@echo "  prisma-db-reset            - Reset + db push dans le conteneur"
	@echo "  prisma-studio              - Lance Prisma Studio dans le conteneur"
	@echo ""
	@echo "Base de donnees:"
	@echo "  db-schema                  - Applique le schema Prisma courant a la base"
	@echo "  db-shell                   - Ouvre psql dans le conteneur db"
	@echo "  db-seed-dev                - Cree le socle local puis importe le catalogue WooCommerce Creatyss"
	@echo "  db-seed-images             - Convertit + aligne les images seed"
	@echo "  db-import-woocommerce      - Reimporte le catalogue WooCommerce sans images"
	@echo "  db-import-woocommerce-images - Reimporte le catalogue WooCommerce avec images"
	@echo "  db-reseed-dev              - Re-seed de la base de dev"
	@echo "  db-reset-dev               - Reset complet de la base de dev"
	@echo "  uploads-import             - Importe les uploads depuis l'hote vers le volume"
	@echo "  seed                       - Lance le seed dev complet dans le service jobs"
	@echo "  seed-data-init             - Initialise les donnees de seed"
	@echo ""
	@echo "Qualite:"
	@echo "  typecheck                  - Verifie les types TypeScript dans le conteneur"
	@echo "  typecheck-local            - Verifie les types TypeScript en local"
	@echo "  typecheck-watch            - Typecheck incremental en local"
	@echo "  lint                       - Lance ESLint dans le conteneur"
	@echo "  lint-fix                   - Lance ESLint --fix dans le conteneur"
	@echo "  lint-local                 - Lance ESLint en local"
	@echo "  lint-watch                 - ESLint au save en local"
	@echo "  format                     - Lance Prettier --write en local"
	@echo "  format-check               - Verifie Prettier dans le conteneur"
	@echo "  format-check-local         - Verifie Prettier en local"
	@echo ""
	@echo "Tests:"
	@echo "  test                       - Lance tous les tests dans le conteneur"
	@echo "  test-unit                  - Lance les tests unitaires dans le conteneur"
	@echo "  test-e2e                   - Lance les tests e2e en local"
	@echo "  test-e2e-ui                - Lance les tests e2e avec UI Playwright"
	@echo "  test-e2e-headed            - Lance les tests e2e en mode headed"
	@echo "  test-select                - Lance les tests selectionnes"

up:
	$(COMPOSE_CORE) up -d --build

up-proxy:
	$(COMPOSE_CORE_PROXY) up -d --build

down:
	$(COMPOSE) down

restart:
	$(COMPOSE_CORE) down
	$(COMPOSE_CORE) up -d --build

build:
	$(COMPOSE_CORE) build

app-build:
	$(COMPOSE_CORE) exec -e NODE_OPTIONS="$(APP_BUILD_NODE_OPTIONS)" $(APP_SERVICE) pnpm run build

logs:
	$(COMPOSE_CORE) logs -f

ps:
	$(COMPOSE_CORE) ps

sh:
	$(COMPOSE_CORE) exec $(APP_SERVICE) sh

dev:
	$(COMPOSE_CORE) exec $(APP_SERVICE) pnpm run dev

stripe-dev:
	stripe listen --forward-to $(STRIPE_WEBHOOK_FORWARD_URL)

certs:
	@echo "Generating local TLS certs with mkcert..."
	@mkdir -p $(CERT_DIR)
	mkcert -cert-file $(CERT_DIR)/local.crt -key-file $(CERT_DIR)/local.key $(CERT_DOMAINS)
	@echo "Done. Certs written to $(CERT_DIR)/"

hosts-setup:
	@echo "Adding local DNS entries to /etc/hosts (requires sudo)..."
	@grep -q "creatyss.localhost" /etc/hosts || echo "127.0.0.1 creatyss.localhost" | sudo tee -a /etc/hosts
	@echo "Done."

prisma-format:
	$(COMPOSE_CORE) exec $(APP_SERVICE) pnpm run prisma:format

prisma-validate:
	$(COMPOSE_CORE) exec $(APP_SERVICE) pnpm run prisma:validate

prisma-generate:
	$(COMPOSE_CORE) exec $(APP_SERVICE) pnpm run prisma:generate

prisma-db-push:
	$(COMPOSE_CORE) exec $(APP_SERVICE) pnpm run prisma:db:push

prisma-db-reset:
	$(COMPOSE_CORE) exec $(APP_SERVICE) pnpm run prisma:db:reset

prisma-studio:
	$(COMPOSE_CORE) exec $(APP_SERVICE) pnpm run prisma:studio

db-schema:
	@$(MAKE) prisma-generate
	@$(MAKE) prisma-db-push

db-shell:
	$(COMPOSE_CORE) exec $(DB_SERVICE) sh -lc 'psql -U "$$POSTGRES_USER" -d "$$POSTGRES_DB"'

db-seed-dev:
	@$(MAKE) prisma-generate
	@$(COMPOSE_CORE) exec -T $(APP_SERVICE) pnpm run seed:dev

db-seed-images:
	@echo "Seeding images..."
	@$(MAKE) prisma-generate
	@$(COMPOSE_CORE) exec -T $(APP_SERVICE) pnpm run seed:images

db-import-woocommerce:
	@echo "Importing WooCommerce data (data only, no images)..."
	@$(MAKE) prisma-generate
	@$(COMPOSE_CORE) exec -T $(APP_SERVICE) pnpm run seed:woocommerce -- --skip-images

db-import-woocommerce-images:
	@echo "Importing WooCommerce data with images (this may take a while)..."
	@$(MAKE) prisma-generate
	@$(COMPOSE_CORE) exec -T $(APP_SERVICE) pnpm run seed:woocommerce

db-reseed-dev:
	@$(MAKE) prisma-db-reset
	@$(MAKE) db-seed-dev

db-reset-dev:
	$(COMPOSE_CORE) down -v
	$(COMPOSE_CORE) up -d --build
	$(MAKE) prisma-generate
	$(MAKE) prisma-db-reset
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

seed:
	$(COMPOSE) $(PROFILE_CORE) $(PROFILE_JOBS) run --rm seeder

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

typecheck:
	$(COMPOSE_CORE) exec $(APP_SERVICE) pnpm run typecheck

typecheck-local:
	pnpm run typecheck

typecheck-watch:
	pnpm run typecheck:watch

lint:
	$(COMPOSE_CORE) exec $(APP_SERVICE) pnpm run lint

lint-fix:
	$(COMPOSE_CORE) exec $(APP_SERVICE) pnpm run lint:fix

lint-watch:
	pnpm run lint:watch

lint-local:
	pnpm run lint

format:
	pnpm run format

format-check:
	$(COMPOSE_CORE) exec $(APP_SERVICE) pnpm run format:check

format-check-local:
	pnpm run format:check

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
