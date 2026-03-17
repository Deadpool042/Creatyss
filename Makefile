SHELL := /bin/bash
ENV_FILE ?= .env.local
COMPOSE := docker compose --env-file $(ENV_FILE)
APP_SERVICE := app
DB_SERVICE := db
STRIPE_WEBHOOK_FORWARD_URL ?= http://localhost:3000/api/stripe/webhook
CERT_DIR := docker/traefik/certs
CERT_DOMAINS := creatyss.localhost registry.creatyss.localhost


.PHONY: help up down restart build logs ps sh dev typecheck db-schema db-seed-dev db-seed-images db-import-woocommerce db-import-woocommerce-images db-reseed-dev db-reset-dev uploads-import seed-data-init test test-unit test-e2e test-e2e-ui test-e2e-headed test-select stripe-dev certs hosts-setup

help:
	@echo "Usage: make [target]"
	@echo "Targets:"
	@echo "  up              - Demarre l'application et PostgreSQL"
	@echo "  down            - Stoppe les services"
	@echo "  restart         - Redemarre les services"
	@echo "  build           - Construit les services"
	@echo "  logs            - Suit les logs"
	@echo "  ps              - Liste les conteneurs"
	@echo "  sh              - Ouvre un shell dans l'app"
	@echo "  dev             - Lance le serveur de dev dans le conteneur app"
	@echo "  db-schema       - Applique toutes les migrations SQL sur une base vide"
	@echo "  typecheck       - Verifie les types TypeScript"
	@echo "  db-seed-dev     - Applique les fichiers de seed SQL sur la base de dev"
	@echo "  db-seed-images       - Copie les images de seed vers le volume et sync les metadonnees DB"
	@echo "  db-import-woocommerce - Importe les produits/categories depuis seed_data/*.creatyss.json"
	@echo "  db-reseed-dev   - Tronque les tables seedees et re-applique le seed (sans redemarrer)"
	@echo "  db-reset-dev    - Reset la base de dev (down -v, up -d --build, db-schema, db-seed-dev)"
	@echo "  uploads-import  - Importe les uploads existants du dossier local vers le volume Docker"
	@echo "  seed-data-init  - Copie creatyss.webp vers seed_data/images/ (une seule fois)"
	@echo "  stripe-dev      - Lance le serveur de mock Stripe pour le dev"
	@echo "  certs           - Genere les certs TLS locaux via mkcert"
	@echo "  hosts-setup     - Ajoute les entrees /etc/hosts pour creatyss.localhost"
	@echo "  test            - Lance les tests unitaires"
	@echo "  test-unit       - Lance les tests unitaires"
	@echo "  test-e2e        - Lance les tests E2E"
	@echo "  test-e2e-ui     - Lance Playwright en mode UI"
	@echo "  test-e2e-headed - Lance Playwright avec navigateur visible"
	@echo "  test-select     - Ouvre un menu pour choisir le type de test"

certs:
	@echo "Generating local TLS certs with mkcert..."
	@mkdir -p $(CERT_DIR)
	mkcert -cert-file $(CERT_DIR)/local.crt -key-file $(CERT_DIR)/local.key $(CERT_DOMAINS)
	@echo "Done. Certs written to $(CERT_DIR)/"

hosts-setup:
	@echo "Adding local DNS entries to /etc/hosts (requires sudo)..."
	@grep -q "creatyss.localhost" /etc/hosts || echo "127.0.0.1 creatyss.localhost" | sudo tee -a /etc/hosts
	@grep -q "registry.creatyss.localhost" /etc/hosts || echo "127.0.0.1 registry.creatyss.localhost" | sudo tee -a /etc/hosts
	@echo "Done."

stripe-dev:
	stripe listen --forward-to $(STRIPE_WEBHOOK_FORWARD_URL)

up:
	$(COMPOSE) up --build

down:
	$(COMPOSE) down

restart:
	$(COMPOSE) down
	$(COMPOSE) up --build

build:
	$(COMPOSE) build

logs:
	$(COMPOSE) logs -f

ps:
	$(COMPOSE) ps

sh:
	$(COMPOSE) exec $(APP_SERVICE) sh

dev:
	$(COMPOSE) exec $(APP_SERVICE) pnpm run dev

db-schema:
	@for migration in db/migrations/*.sql; do \
		echo "Applying $$migration"; \
		$(COMPOSE) exec -T $(DB_SERVICE) sh -lc 'psql -v ON_ERROR_STOP=1 -U "$$POSTGRES_USER" -d "$$POSTGRES_DB"' < "$$migration" || exit $$?; \
	done

typecheck:
	$(COMPOSE) exec $(APP_SERVICE) pnpm run typecheck

db-seed-dev:
	@for file in db/seeds/*.sql; do \
		[ -e "$$file" ] || continue; \
		echo "Applying $$file"; \
		$(COMPOSE) exec -T $(DB_SERVICE) sh -lc 'psql -v ON_ERROR_STOP=1 -U "$$POSTGRES_USER" -d "$$POSTGRES_DB"' < "$$file" || exit $$?; \
	done
	@echo "Seeding dev admin users"
	@$(COMPOSE) exec -T $(APP_SERVICE) node --experimental-strip-types scripts/seed-dev-admin-users.ts
	@$(MAKE) db-seed-images

db-seed-images:
	@echo "Seeding images..."
	@$(COMPOSE) exec -T $(APP_SERVICE) node --experimental-strip-types scripts/seed-images.ts

db-import-woocommerce:
	@echo "Importing WooCommerce data (data only, no images)..."
	@$(COMPOSE) exec -T $(APP_SERVICE) node --experimental-strip-types scripts/import-woocommerce.ts --skip-images
	@echo "Done. Run 'make db-import-woocommerce-images' to also download+convert product images."

db-import-woocommerce-images:
	@echo "Importing WooCommerce data with images (this may take a while)..."
	@$(COMPOSE) exec -T $(APP_SERVICE) node --experimental-strip-types scripts/import-woocommerce.ts

db-reseed-dev:
	@bash scripts/reseed-dev.sh

db-reset-dev:
	$(COMPOSE) down -v
	$(COMPOSE) up -d --build
	$(MAKE) db-schema
	$(MAKE) db-seed-dev

# Copy all existing uploads from the host directory into the Docker uploads volume.
# Run this once after adding the uploads_data volume if you had previous uploads.
uploads-import:
	@echo "Importing uploads from host to volume..."
	@if [ -d "public/uploads" ]; then \
		$(COMPOSE) run --rm -v "$(shell pwd)/public/uploads:/host_uploads:ro" \
			-v uploads_data:/app/public/uploads \
			--no-deps $(APP_SERVICE) sh -c "cp -rn /host_uploads/. /app/public/uploads/ && echo 'Import done.'"; \
	else \
		echo "No public/uploads directory found on host."; \
	fi

# Copy creatyss.webp from public/uploads/ to seed_data/images/ (run once, then commit).
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
	$(COMPOSE) exec $(APP_SERVICE) pnpm run test

test-unit:
	$(COMPOSE) exec $(APP_SERVICE) pnpm run test:unit

test-e2e:
	pnpm run test:e2e

test-e2e-ui:
	pnpm exec playwright test --ui

test-e2e-headed:
	pnpm exec playwright test --headed

test-select:
	@echo "Choisis le type de test a lancer :"; \
	select choice in "Tests unitaires" "Tests E2E" "Tests E2E UI" "Tests E2E navigateur visible" "Tous" "Quitter"; do \
		case $$REPLY in \
			1) $(MAKE) test-unit; break ;; \
			2) $(MAKE) test-e2e; break ;; \
			3) $(MAKE) test-e2e-ui; break ;; \
			4) $(MAKE) test-e2e-headed; break ;; \
			5) $(MAKE) test-unit && $(MAKE) test-e2e; break ;; \
			6) echo "Annule."; break ;; \
			*) echo "Choix invalide." ;; \
		esac; \
	done
