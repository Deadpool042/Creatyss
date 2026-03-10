SHELL := /bin/sh
ENV_FILE ?= .env.example
COMPOSE := docker compose --env-file $(ENV_FILE)
APP_SERVICE := app

.PHONY: help up down restart build logs ps sh dev typecheck lint

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
	@echo "  typecheck - Vérifie les types TypeScript"
	@echo "  lint      - Vérifie le style de code avec ESLint"

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
	$(COMPOSE) exec $(APP_SERVICE) npm run dev

typecheck:
	$(COMPOSE) exec $(APP_SERVICE) npm run typecheck

lint:
	$(COMPOSE) exec $(APP_SERVICE) npm run lint
