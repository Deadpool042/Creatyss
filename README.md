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
make down
make logs
make ps
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
