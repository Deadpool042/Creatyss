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

## Portée fonctionnelle actuelle

Le projet couvre actuellement les fondations principales de la boutique Creatyss :

- catalogue produits
- produits simples et produits avec déclinaisons
- variantes par couleur
- changement d’image selon variante
- catégories
- blog
- homepage éditable
- admin interne
- uploads locaux
- SEO de base
- authentification admin simple et sécurisée

L’évolution du projet est documentée par versions et par lots dans `docs/`, en particulier dans `docs/v6/`.

## Documentation de référence actuelle

- `AGENTS.md` : règles de travail, structure du repo et discipline de modification.
- `docs/v6/scope.md` : périmètre fonctionnel V6.
- `docs/v6/data-model.md` : modèle métier V6.
- `docs/v6/roadmap.md` : séquencement des lots V6.
- `docs/v6/admin-language-and-ux.md` : langage visible et UX admin produit.
- `docs/v6/glossary.md` : vocabulaire métier officiel, termes UI autorisés ou à éviter, et hiérarchie documentaire actuelle.

Pour un lot donné, les documents explicitement cités dans la demande priment. Sauf mention contraire, les anciennes docs V1 à V5 et les documents historiques restent du contexte utile, pas la source de vérité courante.

## Démarrage local

Le projet est piloté via `make`.

Commande d’entrée principale :

```bash
make up
```

Variables disponibles :

- `.env.example`

`.env.example` est uniquement un fichier de placeholders versionné. Les vraies valeurs locales doivent vivre dans `.env` ou `.env.local`, qui restent non versionnés.

Le `Makefile` utilise `ENV_FILE=.env.example` par défaut. Pour lancer le projet avec de vrais secrets locaux :

```bash
ENV_FILE=.env.local make up
```

Le même principe s’applique à `make build`, `make db-reset-dev`, `make test-e2e` et aux autres cibles `make`.

Variables sensibles ou locales notables :

- `ADMIN_SESSION_SECRET`
- `CART_SESSION_SECRET`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `BREVO_API_KEY`
- `EMAIL_FROM`

Commandes disponibles :

```bash
make up
make down
make restart
make logs
make ps
make sh
make dev
make build
make db-schema
make typecheck
make db-seed-dev
make db-reset-dev
make test
make test-unit
make test-e2e
make test-e2e-ui
make test-e2e-headed
make test-select
```

## Tests

Commandes disponibles :

```bash
pnpm run test
pnpm run test:unit
pnpm run test:e2e
pnpm run test:e2e-ui
pnpm run test-e2e-headed
pnpm run test-select
```

- `pnpm run test` : lance la base actuelle de tests unitaires
- `pnpm run test:unit` : lance explicitement Vitest
- `pnpm run test:e2e` : lance les smoke tests Playwright
- `pnpm run test:e2e-ui` : lance les tests Playwright avec interface graphique
- `pnpm run test-e2e-headed` : lance les tests Playwright en mode headed
- `pnpm run test-select` : lance Playwright Test Select pour choisir les tests à exécuter via une interface interactive

Via `make` :

```bash
make test
make test-unit
make test-e2e
make test-e2e-ui
make test-e2e-headed
make test-select
```

- `make test` et `make test-unit` s’exécutent dans le conteneur `app`
- `make test-e2e` s’exécute sur l’hôte
- `make test-e2e-ui`, `make test-e2e-headed` et `make test-select` sont aussi disponibles pour Playwright

Prérequis pour `make test-e2e` :

1. l’application et PostgreSQL doivent déjà être démarrés
2. le schéma et le seed doivent déjà être appliqués
3. les dépendances Node locales doivent déjà être installées sur l’hôte (`pnpm install`)
4. Chromium Playwright doit être installé localement une fois
5. si les flux Stripe doivent être testés réellement, de vraies clés de test doivent être définies dans `.env` ou `.env.local`
6. si les emails transactionnels doivent être testés réellement, `BREVO_API_KEY` et `EMAIL_FROM` doivent aussi être définis dans `.env` ou `.env.local`

Flux local minimal :

```bash
pnpm install
docker compose --env-file .env.example up -d --build
make db-schema
make db-seed-dev
pnpm exec playwright install chromium
make test-e2e
```

## Base de données

Le schéma PostgreSQL est défini par les migrations SQL dans `db/migrations/`.

Application locale :

```bash
make up
make db-schema
```

`make db-schema` applique tous les fichiers `db/migrations/*.sql` dans l’ordre lexical et cible uniquement une base vide. Pour réappliquer le schéma proprement, repartez d’une base neuve :

```bash
docker compose --env-file .env.example down -v
make up
make db-schema
```

Vérifications locales exactes :

```bash
docker compose --env-file .env.example exec -T db psql -U creatyss -d creatyss -c "select table_name from information_schema.tables where table_schema = 'public' order by table_name;"
docker compose --env-file .env.example exec -T db psql -U creatyss -d creatyss -c "select indexname from pg_indexes where schemaname = 'public' order by tablename, indexname;"
docker compose --env-file .env.example exec -T db psql -U creatyss -d creatyss -c "select tgname from pg_trigger where not tgisinternal order by tgname;"
docker compose --env-file .env.example exec -T db psql -U creatyss -d creatyss -c "select conname, contype from pg_constraint where connamespace = 'public'::regnamespace order by conname;"
pnpm run typecheck
```

L’évolution fonctionnelle et structurelle en cours est documentée par version dans `docs/`, notamment `docs/v6/`.

## Seed dev

Un seed de développement minimal permet de reconstituer rapidement un jeu de données local après un reset de volume Docker.

Il est destiné uniquement au développement local sur base neuve.

Application locale :

```bash
make db-seed-dev
```

Reset complet + seed :

```bash
make db-reset-dev
```

Le seed de développement couvre :

- comptes `admin_users`
- catégories
- produits et variantes
- images produit en base
- blog
- homepage

Il ne crée pas de fichiers ou de lignes `media_assets`. Les flux admin qui proposent de choisir un media existant nécessitent donc d’importer au moins une image via `/admin/media` avant vérification.

## Fonctionnalités disponibles

Fonctionnalités admin disponibles :

- `/admin/media`
- `/admin/categories`
- `/admin/products`
- `/admin/homepage`
- `/admin/blog`

Pages publiques disponibles :

- `/`
- `/boutique`
- `/boutique/[slug]`
- `/blog`
- `/blog/[slug]`

## Auth admin

L’auth admin repose sur la table `admin_users`, un cookie de session signé `HttpOnly`, et une vérification serveur sur chaque accès à `/admin`.

Variables d’environnement requises :

- `ADMIN_SESSION_SECRET`

Comptes admin de développement fournis par le seed local :

- `admin@creatyss.local` / `AdminDev123!` / actif
- `inactive-admin@creatyss.local` / `AdminDev123!` / inactif

Le seed de développement crée automatiquement ces comptes sur base neuve via `make db-seed-dev` ou `make db-reset-dev`.

Pour créer un admin supplémentaire manuellement :

```bash
printf '%s' 'SuperLongPassword123!' | docker compose --env-file .env.example exec -T app node --experimental-strip-types scripts/create-admin-user.ts --email admin@example.com --display-name "Admin Creatyss" --password-stdin
```

Vérification locale exacte :

```bash
docker compose --env-file .env.example down -v
docker compose --env-file .env.example up -d --build
make db-schema
make db-seed-dev
docker compose --env-file .env.example exec -T db psql -U creatyss -d creatyss -c "select email, display_name, is_active from admin_users order by email;"
docker compose --env-file .env.example exec app pnpm run typecheck
docker compose --env-file .env.example exec app pnpm run build
curl -I http://localhost:3000/admin
```

Vérification manuelle du login admin :

1. ouvrez `http://localhost:3000/admin/login`
2. connectez-vous avec `admin@creatyss.local` / `AdminDev123!`
3. vérifiez la redirection vers `/admin`
4. vérifiez qu’un accès direct à `http://localhost:3000/admin` fonctionne après connexion
5. cliquez sur la déconnexion puis vérifiez que `/admin` redirige de nouveau vers `/admin/login`
6. vérifiez aussi qu’un login avec `inactive-admin@creatyss.local` / `AdminDev123!` est refusé

## Media admin

La bibliothèque media admin repose sur la table `media_assets`, un stockage local sous `public/uploads`, et une page protégée `/admin/media`.

Le système media admin accepte actuellement uniquement :

- `image/jpeg`
- `image/png`
- `image/webp`

Vérification locale exacte :

```bash
docker compose --env-file .env.example down -v
docker compose --env-file .env.example up -d --build
make db-schema
make db-seed-dev
docker compose --env-file .env.example exec app pnpm run typecheck
docker compose --env-file .env.example exec app pnpm run build
docker compose --env-file .env.example exec -T db psql -U creatyss -d creatyss -c "select table_name from information_schema.tables where table_schema = 'public' and table_name = 'media_assets';"
```

Puis :

1. connectez-vous sur `http://localhost:3000/admin/login`
2. ouvrez `http://localhost:3000/admin/media`
3. importez une image JPEG, PNG ou WebP valide
4. vérifiez la ligne créée en base :

```bash
docker compose --env-file .env.example exec -T db psql -U creatyss -d creatyss -c "select id, file_path, original_name, mime_type, byte_size, image_width, image_height from media_assets order by created_at desc;"
find public/uploads/media -type f | sort
```

Pour vérifier le fallback listing, supprimez un fichier local déjà importé puis rechargez `/admin/media` :

```bash
find public/uploads/media -type f | head -n 1
rm <chemin_retourne>
```

## Documentation

Documentation générale :

- `AGENTS.md`
- `docs/architecture-v1.md`
- `docs/roadmap-v1.md`
- `docs/testing/strategy.md`
- `docs/testing/roadmap.md`
- `docs/v1-qa-checklist.md`

Documentation versionnée en cours :

- `docs/v6/scope.md`
- `docs/v6/data-model.md`
- `docs/v6/roadmap.md`
- `docs/v6/admin-language-and-ux.md`

## Contraintes importantes

Le projet n’utilise pas :

- WordPress
- WooCommerce
- Shopify
- Supabase
- Vercel

## État actuel du projet

Le dépôt contient une base locale exploitable pour Creatyss avec :

- authentification admin serveur
- bibliothèque media locale
- CRUD catégories admin
- CRUD produits admin avec catégories, images et déclinaisons
- édition admin de la homepage
- CRUD blog admin
- front public catalogue, blog et homepage
- SEO de base sur produits et articles

Le projet évolue désormais par versions et lots documentés dans `docs/`, avec un cadrage actif dans `docs/v6/`.

La checklist manuelle de recette historique reste centralisée dans `docs/v1-qa-checklist.md`.
