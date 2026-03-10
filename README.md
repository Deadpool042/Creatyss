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

- `make test` et `make test-unit` s'executent dans le conteneur `app`
- `make test-e2e` s'execute sur l'hote
- `make test-e2e-ui`, `make test-e2e-headed` et `make test-select` sont aussi disponibles pour Playwright

Prerequis pour `make test-e2e` :

1. l'application et PostgreSQL doivent deja etre demarres
2. le schema et le seed doivent deja etre appliques
3. les dependances Node locales doivent deja etre installees sur l'hote (`pnpm install`)
4. Chromium Playwright doit etre installe localement une fois

Flux local minimal :

```bash
pnpm install
docker compose --env-file .env.example up -d --build
make db-schema
make db-seed-dev
pnpm exec playwright install chromium
make test-e2e
```

## Schema base de donnees

Le schema PostgreSQL V1 est defini par les migrations SQL dans `db/migrations/`.

Application locale :

```bash
make up
make db-schema
```

`make db-schema` applique tous les fichiers `db/migrations/*.sql` dans l'ordre lexical et cible uniquement une base vide. Pour reappliquer le schema proprement, repartez d'une base neuve :

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

## Seed dev

Un seed de developpement minimal permet de reconstituer rapidement un jeu de donnees local apres un reset de volume Docker.

Il est destine uniquement au developpement local sur base neuve.

Application locale :

```bash
make db-seed-dev
```

Reset complet + seed :

```bash
make db-reset-dev
```

Le seed de developpement couvre :

- comptes `admin_users`
- categories
- produits et variantes
- images produit en base
- blog
- homepage

Il ne cree pas de fichiers ou de lignes `media_assets`. Les flux admin qui proposent de choisir un media existant necessitent donc d'importer au moins une image via `/admin/media` avant verification.

## Verticales V1 livrees

Verticales admin disponibles :

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

L'auth admin repose sur la table `admin_users`, un cookie de session signe `HttpOnly`, et une verification serveur sur chaque acces a `/admin`.

Variables d'environnement requises :

- `ADMIN_SESSION_SECRET`

Comptes admin de developpement fournis par le seed local :

- `admin@creatyss.local` / `AdminDev123!` / actif
- `inactive-admin@creatyss.local` / `AdminDev123!` / inactif

Le seed de developpement cree automatiquement ces comptes sur base neuve via `make db-seed-dev` ou `make db-reset-dev`.

Pour creer un admin supplementaire manuellement :

```bash
printf '%s' 'SuperLongPassword123!' | docker compose --env-file .env.example exec -T app node --experimental-strip-types scripts/create-admin-user.ts --email admin@example.com --display-name "Admin Creatyss" --password-stdin
```

Verification locale exacte :

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

Verification manuelle du login admin :

1. ouvrez `http://localhost:3000/admin/login`
2. connectez-vous avec `admin@creatyss.local` / `AdminDev123!`
3. verifiez la redirection vers `/admin`
4. verifiez qu'un acces direct a `http://localhost:3000/admin` fonctionne apres connexion
5. cliquez sur la deconnexion puis verifiez que `/admin` redirige de nouveau vers `/admin/login`
6. verifiez aussi qu'un login avec `inactive-admin@creatyss.local` / `AdminDev123!` est refuse

## Media admin

La bibliotheque media admin repose sur la table `media_assets`, un stockage local sous `public/uploads`, et une page protegee `/admin/media`.

Cette fondation V1 accepte uniquement :

- `image/jpeg`
- `image/png`
- `image/webp`

Verification locale exacte :

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
4. verifiez la ligne creee en base :

```bash
docker compose --env-file .env.example exec -T db psql -U creatyss -d creatyss -c "select id, file_path, original_name, mime_type, byte_size, image_width, image_height from media_assets order by created_at desc;"
find public/uploads/media -type f | sort
```

Pour verifier le fallback listing, supprimez un fichier local deja importe puis rechargez `/admin/media` :

```bash
find public/uploads/media -type f | head -n 1
rm <chemin_retourne>
```

## Documentation

- `docs/architecture-v1.md`
- `docs/roadmap-v1.md`
- `docs/testing/strategy.md`
- `docs/testing/roadmap.md`
- `docs/v1-qa-checklist.md`

## Contraintes importantes

Le projet n’utilise pas :

- WordPress
- WooCommerce
- Shopify
- Supabase
- Vercel

## Etat actuel

Le depot contient une V1 locale exploitable avec :

- auth admin serveur
- bibliotheque media locale
- CRUD categories admin
- CRUD produits admin avec variantes, categories et images
- edition admin de la homepage
- CRUD blog admin
- front public catalogue, blog et homepage
- SEO de base sur produits et articles

La checklist manuelle de recette V1 est centralisee dans `docs/v1-qa-checklist.md`.
