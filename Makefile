SHELL := /bin/sh
ENV_FILE ?= .env.example
COMPOSE := docker compose --env-file $(ENV_FILE)
APP_SERVICE := app
DB_SERVICE := db

.PHONY: help up down restart build logs ps sh dev typecheck db-schema db-seed-dev db-reset-dev

help:
	@echo "Usage: make [target]"
	@echo "Targets:"
	@echo "  up        - Demarre l'application et PostgreSQL"
	@echo "  down      - Stoppe les services"
	@echo "  restart   - Redemarre les services"
	@echo "  build     - Construit les services"
	@echo "  logs      - Suit les logs"
	@echo "  ps        - Liste les conteneurs"
	@echo "  sh        - Ouvre un shell dans l'app"
	@echo "  dev       - Lance le serveur de dev dans le conteneur app"
	@echo "  db-schema - Applique toutes les migrations SQL sur une base vide"
	@echo "  typecheck - Verifie les types TypeScript"
	@echo "  db-seed-dev - Applique les fichiers de seed SQL sur la base de dev"
	@echo "  db-reset-dev - Reset la base de dev (down -v, up -d --build, db-schema, db-seed-dev)"

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
