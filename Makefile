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

COLOR_RESET := \033[0m
COLOR_BOLD := \033[1m
COLOR_DIM := \033[2m
COLOR_RED := \033[31m
COLOR_GREEN := \033[32m
COLOR_YELLOW := \033[33m
COLOR_BLUE := \033[34m
COLOR_MAGENTA := \033[35m
COLOR_CYAN := \033[36m
COLOR_GRAY := \033[90m

define log_info
	@printf "$(COLOR_BLUE)ℹ$(COLOR_RESET) $(COLOR_BOLD)%s$(COLOR_RESET)\n" "$(1)"
endef

define log_success
	@printf "$(COLOR_GREEN)✔$(COLOR_RESET) $(COLOR_BOLD)%s$(COLOR_RESET)\n" "$(1)"
endef

define log_warn
	@printf "$(COLOR_YELLOW)⚠$(COLOR_RESET) $(COLOR_BOLD)%s$(COLOR_RESET)\n" "$(1)"
endef

define log_error
	@printf "$(COLOR_RED)✖$(COLOR_RESET) $(COLOR_BOLD)%s$(COLOR_RESET)\n" "$(1)"
endef

.PHONY: help \
	up up-proxy down restart build app-build logs ps sh dev stripe-dev certs hosts-setup \
	prisma-format prisma-validate prisma-generate prisma-db-push prisma-db-reset prisma-studio \
	db-schema \
	db-shell db-seed-dev db-seed-images db-import-woocommerce db-import-woocommerce-images \
	db-reseed-dev db-reset-dev db-reset-empty uploads-import seed seed-data-init \
	typecheck-local typecheck typecheck-watch typecheck-import-woocommerce \
	lint-local lint lint-fix lint-watch \
	format format-check format-check-local \
	test test-unit test-e2e test-e2e-ui test-e2e-headed test-select

help:
	@printf "$(COLOR_BOLD)Usage:$(COLOR_RESET) make [target]\n\n"
	@printf "$(COLOR_CYAN)Infrastructure$(COLOR_RESET)\n"
	@printf "  $(COLOR_BOLD)up$(COLOR_RESET)                           Demarre app + db\n"
	@printf "  $(COLOR_BOLD)up-proxy$(COLOR_RESET)                     Demarre app + db + traefik\n"
	@printf "  $(COLOR_BOLD)down$(COLOR_RESET)                         Stoppe les services\n"
	@printf "  $(COLOR_BOLD)restart$(COLOR_RESET)                      Redemarre app + db\n"
	@printf "  $(COLOR_BOLD)build$(COLOR_RESET)                        Construit les images Docker\n"
	@printf "  $(COLOR_BOLD)app-build$(COLOR_RESET)                    Lance le build Next.js dans le conteneur\n"
	@printf "  $(COLOR_BOLD)logs$(COLOR_RESET)                         Suit les logs\n"
	@printf "  $(COLOR_BOLD)ps$(COLOR_RESET)                           Liste les conteneurs\n"
	@printf "  $(COLOR_BOLD)sh$(COLOR_RESET)                           Ouvre un shell dans l'app\n"
	@printf "  $(COLOR_BOLD)dev$(COLOR_RESET)                          Lance le serveur de dev\n"
	@printf "  $(COLOR_BOLD)stripe-dev$(COLOR_RESET)                   Lance le forward Stripe\n"
	@printf "  $(COLOR_BOLD)certs$(COLOR_RESET)                        Genere les certs TLS locaux via mkcert\n"
	@printf "  $(COLOR_BOLD)hosts-setup$(COLOR_RESET)                  Ajoute les entrees /etc/hosts\n\n"

	@printf "$(COLOR_CYAN)Prisma$(COLOR_RESET)\n"
	@printf "  $(COLOR_BOLD)prisma-format$(COLOR_RESET)                Formate le schema Prisma dans le conteneur\n"
	@printf "  $(COLOR_BOLD)prisma-validate$(COLOR_RESET)              Valide le schema Prisma dans le conteneur\n"
	@printf "  $(COLOR_BOLD)prisma-generate$(COLOR_RESET)              Regenere le client Prisma dans le conteneur\n"
	@printf "  $(COLOR_BOLD)prisma-db-push$(COLOR_RESET)               Applique le schema Prisma a la base dans le conteneur\n"
	@printf "  $(COLOR_BOLD)prisma-db-reset$(COLOR_RESET)              Reset + db push dans le conteneur\n"
	@printf "  $(COLOR_BOLD)prisma-studio$(COLOR_RESET)                Lance Prisma Studio dans le conteneur\n\n"

	@printf "$(COLOR_CYAN)Base de donnees$(COLOR_RESET)\n"
	@printf "  $(COLOR_BOLD)db-schema$(COLOR_RESET)                    Regenere le client Prisma puis applique le schema courant\n"
	@printf "  $(COLOR_BOLD)db-shell$(COLOR_RESET)                     Ouvre psql dans le conteneur db\n"
	@printf "  $(COLOR_BOLD)db-seed-dev$(COLOR_RESET)                  Cree le socle local puis importe le catalogue WooCommerce Creatyss\n"
	@printf "  $(COLOR_BOLD)db-seed-images$(COLOR_RESET)               Convertit + aligne les images seed\n"
	@printf "  $(COLOR_BOLD)db-import-woocommerce$(COLOR_RESET)        Reimporte le catalogue WooCommerce sans images\n"
	@printf "  $(COLOR_BOLD)db-import-woocommerce-images$(COLOR_RESET) Reimporte le catalogue WooCommerce avec images\n"
	@printf "  $(COLOR_BOLD)db-reseed-dev$(COLOR_RESET)                Re-seed de la base de dev\n"
	@printf "  $(COLOR_BOLD)db-reset-dev$(COLOR_RESET)                 Reset complet de la base de dev puis schema courant + seed\n"
	@printf "  $(COLOR_BOLD)db-reset-empty$(COLOR_RESET)               Reset complet de la base vide puis schema courant, sans seed\n"
	@printf "  $(COLOR_BOLD)uploads-import$(COLOR_RESET)               Importe les uploads depuis l'hote vers le volume\n"
	@printf "  $(COLOR_BOLD)seed$(COLOR_RESET)                         Lance le seed dev complet dans le service jobs\n"
	@printf "  $(COLOR_BOLD)seed-data-init$(COLOR_RESET)               Initialise les donnees de seed\n\n"

	@printf "$(COLOR_CYAN)Qualite$(COLOR_RESET)\n"
	@printf "  $(COLOR_BOLD)typecheck$(COLOR_RESET)                    Verifie les types TypeScript dans le conteneur\n"
	@printf "  $(COLOR_BOLD)typecheck-local$(COLOR_RESET)              Verifie les types TypeScript en local\n"
	@printf "  $(COLOR_BOLD)typecheck-watch$(COLOR_RESET)              Typecheck incremental en local\n"
	@printf "  $(COLOR_BOLD)typecheck-import-woocommerce$(COLOR_RESET) Verifie uniquement le module d'import WooCommerce\n"
	@printf "  $(COLOR_BOLD)lint$(COLOR_RESET)                         Lance ESLint dans le conteneur\n"
	@printf "  $(COLOR_BOLD)lint-fix$(COLOR_RESET)                     Lance ESLint --fix dans le conteneur\n"
	@printf "  $(COLOR_BOLD)lint-local$(COLOR_RESET)                   Lance ESLint en local\n"
	@printf "  $(COLOR_BOLD)lint-watch$(COLOR_RESET)                   ESLint au save en local\n"
	@printf "  $(COLOR_BOLD)format$(COLOR_RESET)                       Lance Prettier --write en local\n"
	@printf "  $(COLOR_BOLD)format-check$(COLOR_RESET)                 Verifie Prettier dans le conteneur\n"
	@printf "  $(COLOR_BOLD)format-check-local$(COLOR_RESET)           Verifie Prettier en local\n\n"

	@printf "$(COLOR_CYAN)Tests$(COLOR_RESET)\n"
	@printf "  $(COLOR_BOLD)test$(COLOR_RESET)                         Lance tous les tests dans le conteneur\n"
	@printf "  $(COLOR_BOLD)test-unit$(COLOR_RESET)                    Lance les tests unitaires dans le conteneur\n"
	@printf "  $(COLOR_BOLD)test-e2e$(COLOR_RESET)                     Lance les tests e2e en local\n"
	@printf "  $(COLOR_BOLD)test-e2e-ui$(COLOR_RESET)                  Lance les tests e2e avec UI Playwright\n"
	@printf "  $(COLOR_BOLD)test-e2e-headed$(COLOR_RESET)              Lance les tests e2e en mode headed\n"
	@printf "  $(COLOR_BOLD)test-select$(COLOR_RESET)                  Lance les tests selectionnes\n"

up:
	$(call log_info,Demarrage de app + db)
	$(COMPOSE_CORE) up -d --build
	$(call log_success,Services demarres)

up-proxy:
	$(call log_info,Demarrage de app + db + traefik)
	$(COMPOSE_CORE_PROXY) up -d --build
	$(call log_success,Services demarres avec proxy)

down:
	$(call log_info,Arret des services)
	$(COMPOSE) down
	$(call log_success,Services arretes)

restart:
	$(call log_info,Redemarrage de app + db)
	$(COMPOSE_CORE) down
	$(COMPOSE_CORE) up -d --build
	$(call log_success,Services redemarres)

build:
	$(call log_info,Build des images Docker)
	$(COMPOSE_CORE) build
	$(call log_success,Images construites)

app-build:
	$(call log_info,Build Next.js dans le conteneur)
	$(COMPOSE_CORE) exec -e NODE_OPTIONS="$(APP_BUILD_NODE_OPTIONS)" $(APP_SERVICE) pnpm run build
	$(call log_success,Build Next.js termine)

logs:
	$(COMPOSE_CORE) logs -f

ps:
	$(COMPOSE_CORE) ps

sh:
	$(call log_info,Ouverture d'un shell dans le conteneur app)
	$(COMPOSE_CORE) exec $(APP_SERVICE) sh

dev:
	$(call log_info,Lancement du serveur de dev)
	$(COMPOSE_CORE) exec $(APP_SERVICE) pnpm run dev

stripe-dev:
	$(call log_info,Lancement du forward Stripe)
	stripe listen --forward-to $(STRIPE_WEBHOOK_FORWARD_URL)

certs:
	$(call log_info,Generation des certificats TLS locaux)
	@mkdir -p $(CERT_DIR)
	mkcert -cert-file $(CERT_DIR)/local.crt -key-file $(CERT_DIR)/local.key $(CERT_DOMAINS)
	$(call log_success,Certificats ecrits dans $(CERT_DIR))

hosts-setup:
	$(call log_info,Ajout des entrees locales dans /etc/hosts)
	@grep -q "creatyss.localhost" /etc/hosts || echo "127.0.0.1 creatyss.localhost" | sudo tee -a /etc/hosts
	$(call log_success,Entrees hosts configurees)

prisma-format:
	$(call log_info,Format du schema Prisma)
	$(COMPOSE_CORE) exec $(APP_SERVICE) pnpm run prisma:format
	$(call log_success,Schema Prisma formate)

prisma-validate:
	$(call log_info,Validation du schema Prisma)
	$(COMPOSE_CORE) exec $(APP_SERVICE) pnpm run prisma:validate
	$(call log_success,Schema Prisma valide)

prisma-generate:
	$(call log_info,Generation du client Prisma)
	$(COMPOSE_CORE) exec $(APP_SERVICE) pnpm run prisma:generate
	$(call log_success,Client Prisma regenere)

prisma-db-push:
	$(call log_info,Application du schema Prisma a la base)
	$(COMPOSE_CORE) exec $(APP_SERVICE) pnpm run prisma:db:push
	$(call log_success,Schema applique)

prisma-db-reset:
	$(call log_info,Reset Prisma + db push)
	$(COMPOSE_CORE) exec $(APP_SERVICE) pnpm run prisma:db:reset
	$(call log_success,Base reinitialisee)

prisma-studio:
	$(call log_info,Lancement de Prisma Studio)
	$(COMPOSE_CORE) exec $(APP_SERVICE) pnpm run prisma:studio

db-schema:
	$(call log_info,Generation du client Prisma puis application du schema)
	@$(MAKE) prisma-generate
	$(COMPOSE_CORE) exec $(APP_SERVICE) pnpm run prisma:db:push
	$(call log_success,Schema synchronise)

db-shell:
	$(call log_info,Ouverture de psql dans le conteneur db)
	$(COMPOSE_CORE) exec $(DB_SERVICE) sh -lc 'psql -U "$$POSTGRES_USER" -d "$$POSTGRES_DB"'

db-seed-dev:
	$(call log_info,Seed dev complet)
	@$(MAKE) prisma-generate
	@$(COMPOSE_CORE) exec -T $(APP_SERVICE) pnpm run seed:dev
	$(call log_success,Seed dev termine)

db-seed-images:
	$(call log_info,Seed des images)
	@$(MAKE) prisma-generate
	@$(COMPOSE_CORE) exec -T $(APP_SERVICE) pnpm run seed:images
	$(call log_success,Images de seed traitees)

db-import-woocommerce:
	$(call log_info,Import WooCommerce sans images)
	@$(MAKE) prisma-generate
	@$(COMPOSE_CORE) exec -T $(APP_SERVICE) pnpm run import:woo:reset:skip-images
	$(call log_success,Import WooCommerce sans images termine)

db-import-woocommerce-images:
	$(call log_info,Import WooCommerce avec images)
	@$(MAKE) prisma-generate
	@$(COMPOSE_CORE) exec -T $(APP_SERVICE) pnpm run import:woo:reset
	$(call log_success,Import WooCommerce avec images termine)

db-reseed-dev:
	@$(MAKE) db-reset-dev

db-reset-dev:
	$(call log_warn,Reset complet de la base de dev)
	$(COMPOSE_CORE) down -v
	$(COMPOSE_CORE) up -d --build
	$(MAKE) db-schema
	$(MAKE) db-seed-dev
	$(call log_success,Base de dev reinitialisee)

db-reset-empty:
	$(call log_warn,Reset complet de la base vide)
	$(COMPOSE_CORE) down -v
	$(COMPOSE_CORE) up -d --build
	$(MAKE) db-schema
	$(call log_success,Base vide reinitialisee)

uploads-import:
	$(call log_info,Import des uploads depuis l'hote vers le volume)
	@if [ -d "public/uploads" ]; then \
		$(COMPOSE_CORE) run --rm -v "$(shell pwd)/public/uploads:/host_uploads:ro" \
			-v uploads_data:/app/public/uploads \
			--no-deps $(APP_SERVICE) sh -c "cp -rn /host_uploads/. /app/public/uploads/ && echo 'Import done.'"; \
		printf "$(COLOR_GREEN)✔$(COLOR_RESET) $(COLOR_BOLD)Uploads importes$(COLOR_RESET)\n"; \
	else \
		printf "$(COLOR_YELLOW)⚠$(COLOR_RESET) $(COLOR_BOLD)Aucun dossier public/uploads trouve sur l'hote$(COLOR_RESET)\n"; \
	fi

seed:
	$(call log_info,Lancement du seed via le service jobs)
	$(COMPOSE) $(PROFILE_CORE) $(PROFILE_JOBS) run --rm seeder
	$(call log_success,Seed jobs termine)

seed-data-init:
	$(call log_info,Initialisation des donnees de seed)
	@mkdir -p seed_data/images
	@if [ -f public/uploads/creatyss.webp ]; then \
		cp public/uploads/creatyss.webp seed_data/images/creatyss.webp; \
		printf "$(COLOR_GREEN)✔$(COLOR_RESET) $(COLOR_BOLD)creatyss.webp copie dans seed_data/images/$(COLOR_RESET)\n"; \
	elif [ -f seed_data/images/creatyss.webp ]; then \
		printf "$(COLOR_BLUE)ℹ$(COLOR_RESET) $(COLOR_BOLD)seed_data/images/creatyss.webp existe deja$(COLOR_RESET)\n"; \
	else \
		printf "$(COLOR_RED)✖$(COLOR_RESET) $(COLOR_BOLD)public/uploads/creatyss.webp introuvable$(COLOR_RESET)\n"; exit 1; \
	fi

typecheck:
	$(call log_info,Typecheck dans le conteneur)
	$(COMPOSE_CORE) exec $(APP_SERVICE) pnpm run typecheck
	$(call log_success,Typecheck conteneur OK)

typecheck-local:
	$(call log_info,Typecheck local)
	pnpm run typecheck
	$(call log_success,Typecheck local OK)

typecheck-watch:
	pnpm run typecheck:watch

typecheck-import-woocommerce:
	$(call log_info,Typecheck cible du module import-woocommerce)
	pnpm run typecheck:import-woocommerce
	$(call log_success,Typecheck import-woocommerce OK)

lint:
	$(call log_info,ESLint dans le conteneur)
	$(COMPOSE_CORE) exec $(APP_SERVICE) pnpm run lint
	$(call log_success,ESLint conteneur OK)

lint-fix:
	$(call log_info,ESLint --fix dans le conteneur)
	$(COMPOSE_CORE) exec $(APP_SERVICE) pnpm run lint:fix
	$(call log_success,ESLint --fix termine)

lint-watch:
	pnpm run lint:watch

lint-local:
	$(call log_info,ESLint local)
	pnpm run lint
	$(call log_success,ESLint local OK)

format:
	$(call log_info,Prettier --write en local)
	pnpm run format
	$(call log_success,Formatage termine)

format-check:
	$(call log_info,Verification Prettier dans le conteneur)
	$(COMPOSE_CORE) exec $(APP_SERVICE) pnpm run format:check
	$(call log_success,Prettier conteneur OK)

format-check-local:
	$(call log_info,Verification Prettier en local)
	pnpm run format:check
	$(call log_success,Prettier local OK)

test:
	$(call log_info,Lancement de tous les tests dans le conteneur)
	$(COMPOSE_CORE) exec $(APP_SERVICE) pnpm run test
	$(call log_success,Tests conteneur OK)

test-unit:
	$(call log_info,Lancement des tests unitaires dans le conteneur)
	$(COMPOSE_CORE) exec $(APP_SERVICE) pnpm run test:unit
	$(call log_success,Tests unitaires OK)

test-e2e:
	$(call log_info,Lancement des tests e2e en local)
	pnpm run test:e2e
	$(call log_success,Tests e2e OK)

test-e2e-ui:
	$(call log_info,Lancement des tests e2e avec UI Playwright)
	pnpm exec playwright test --ui

test-e2e-headed:
	$(call log_info,Lancement des tests e2e en mode headed)
	pnpm exec playwright test --headed

test-select:
	$(call log_info,Lancement des tests selectionnes)
	pnpm run test-select
