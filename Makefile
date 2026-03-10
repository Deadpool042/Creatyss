SHELL := /bin/sh
COMPOSE := docker compose
APP_SERVICE := app

.PHONY: help up down build logs ps sh

help:
	@echo "Usage: make [target]"
	@echo "Targets:"
	@echo "  up    - Demarre l'application et PostgreSQL"
	@echo "  down  - Stoppe les services"
	@echo "  build - Construit les services"
	@echo "  logs  - Suit les logs"
	@echo "  ps    - Liste les conteneurs"
	@echo "  sh    - Ouvre un shell dans l'app"

up:
	$(COMPOSE) up --build

down:
	$(COMPOSE) down

build:
	$(COMPOSE) build

logs:
	$(COMPOSE) logs -f

ps:
	$(COMPOSE) ps

sh:
	$(COMPOSE) exec $(APP_SERVICE) sh
