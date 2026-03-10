# Creatyss

Boutique e-commerce custom pour Creatyss.

## Stack cible

- Next.js App Router
- TypeScript strict
- PostgreSQL
- Docker Compose en local
- déploiement futur sur VPS OVH

## Objectif

Construire une base e-commerce premium, sobre, rapide, claire, dockerisée en local, puis déployable sur un VPS OVH.

Le projet doit rester :

- maintenable
- modulaire
- lisible
- sans dépendance inutile

## Périmètre V1

- catalogue produits
- variantes par couleur
- changement d’image selon variante
- catégories
- blog
- homepage éditable
- admin simple
- uploads locaux
- SEO de base
- authentification admin simple et sécurisée

## Démarrage local

Le projet est piloté via `make`.

Commande d’entrée principale :

```bash
make up
```

Variables disponibles :

- `.env.example`

Commandes prévues à terme :

```bash
make up
make db-schema
make down
make logs
make ps
```

## Schema base de donnees

Le schema PostgreSQL initial V1 est defini dans `db/migrations/001_initial_schema.sql`.

Application locale :

```bash
make up
make db-schema
```

`make db-schema` cible uniquement une base vide. Pour reappliquer le schema proprement, repartez d'une base neuve :

```bash
docker compose --env-file .env.example down -v
make up
make db-schema
```

Verifications locales exactes :

```bash
docker compose --env-file .env.example exec -T db psql -U creatyss -d creatyss -c "select table_name from information_schema.tables where table_schema = 'public' order by table_name;"
docker compose --env-file .env.example exec -T db psql -U creatyss -d creatyss -c "select indexname from pg_indexes where schemaname = 'public' order by tablename, indexname;"
docker compose --env-file .env.example exec -T db psql -U creatyss -d creatyss -c "select tgname from pg_trigger where not tgisinternal order by tgname;"
docker compose --env-file .env.example exec -T db psql -U creatyss -d creatyss -c "select conname, contype from pg_constraint where connamespace = 'public'::regnamespace order by conname;"
pnpm run typecheck
```

## Documentation

- `docs/architecture-v1.md`
- `docs/roadmap-v1.md`

## Contraintes importantes

Le projet n’utilise pas :

- WordPress
- WooCommerce
- Shopify
- Supabase
- Vercel

## État du projet

Le dépôt contient désormais une fondation technique minimale :

- base Next.js App Router
- TypeScript strict
- Docker Compose avec `app` + `db`
- connexion PostgreSQL
- configuration initiale des uploads locaux
- commandes `make` minimales
