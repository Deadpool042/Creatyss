SHELL := /bin/bash
ENV_FILE ?= .env.example
COMPOSE := docker compose --env-file $(ENV_FILE)
APP_SERVICE := app
DB_SERVICE := db

.PHONY: help up down restart build logs ps sh dev typecheck db-schema db-seed-dev db-reset-dev test test-unit test-e2e test-e2e-ui test-e2e-headed test-select

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
	@echo "  db-reset-dev    - Reset la base de dev (down -v, up -d --build, db-schema, db-seed-dev)"
	@echo "  test            - Lance les tests unitaires"
	@echo "  test-unit       - Lance les tests unitaires"
	@echo "  test-e2e        - Lance les tests E2E"
	@echo "  test-e2e-ui     - Lance Playwright en mode UI"
	@echo "  test-e2e-headed - Lance Playwright avec navigateur visible"
	@echo "  test-select     - Ouvre un menu pour choisir le type de test"

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

db-reset-dev:
	$(COMPOSE) down -v
	$(COMPOSE) up -d --build
	$(MAKE) db-schema
	$(MAKE) db-seed-dev

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
