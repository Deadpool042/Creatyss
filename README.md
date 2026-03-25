# Creatyss

Socle e-commerce custom pour Creatyss, conçu pour être **local-first**, maintenable, modulaire et déployable ensuite sur un VPS OVH.

Le dépôt documente désormais le projet à partir d’une doctrine explicite d’architecture, de domaines et de validation.

La doctrine actuelle est structurée autour de :

- `docs/architecture/` — doctrine canonique du système
- `docs/domains/` — cartographie et cadrage des domaines
- `docs/testing/` — stratégie et trajectoire de validation
- `AGENTS.md` — règles de travail, discipline de modification et contraintes repo

## Positionnement

Creatyss est une base e-commerce pensée pour :

- fonctionner d’abord en local via Docker Compose
- rester lisible et strictement typée
- éviter les dépendances inutiles
- séparer clairement domaine métier, logique serveur, accès aux données, intégrations et UI
- permettre une évolution progressive sans dissoudre les frontières métier
- rester réutilisable pour d’autres projets e-commerce au-delà du seul cas Creatyss

## Stack cible

- Next.js App Router
- TypeScript strict
- PostgreSQL
- Docker Compose en local
- déploiement futur sur VPS OVH

## Doctrine documentaire actuelle

### Source de vérité courante

- `AGENTS.md`
- `docs/architecture/README.md`
- `docs/architecture/00-introduction/**`
- `docs/architecture/10-fondations/**`
- `docs/architecture/20-structure/**`
- `docs/architecture/30-execution/**`
- `docs/architecture/40-exploitation/**`
- `docs/architecture/90-reference/**`
- `docs/domains/README.md`
- `docs/testing/**`

Les anciens documents `docs/v*` et les anciens chemins plats de `docs/architecture/*` ne sont plus la source de vérité courante.

### Lecture recommandée

Pour comprendre le projet dans son état courant :

1. lire `README.md`
2. lire `AGENTS.md`
3. lire `docs/architecture/README.md`
4. lire `docs/architecture/00-introduction/00-vue-d-ensemble-du-systeme.md`
5. lire `docs/architecture/00-introduction/01-glossaire.md`
6. lire `docs/architecture/00-introduction/02-guide-de-lecture.md`
7. lire `docs/architecture/10-fondations/10-principes-d-architecture.md`
8. lire `docs/architecture/10-fondations/11-modele-de-classification.md`
9. lire `docs/architecture/10-fondations/12-frontieres-et-responsabilites.md`
10. lire `docs/domains/README.md`
11. ensuite lire la fiche domaine, la doc de lot ou la doc de test ciblée par le sujet

## Taxonomie documentaire

La cartographie documentaire des domaines repose sur quatre catégories :

- `core`
- `optional`
- `cross-cutting`
- `satellites`

Il ne faut jamais confondre :

- catégorie documentaire
- criticité architecturale
- activabilité
- source de vérité

Quelques distinctions canoniques déjà stabilisées :

- `availability` porte la disponibilité vendable
- `inventory` porte la vérité de stock
- `fulfillment` porte l’exécution logistique
- `shipping` porte l’expédition et le suivi de livraison
- `stores` porte la boutique comme contexte structurant
- `customers` porte le client métier
- `auth`, `users`, `roles`, `permissions` relèvent d’un coeur structurel

## Portée actuelle du dépôt

Le dépôt couvre actuellement une base locale exploitable pour Creatyss avec :

- authentification admin serveur
- bibliothèque media locale
- CRUD catégories admin
- CRUD produits admin avec catégories, images et déclinaisons
- édition admin de la homepage
- CRUD blog admin
- front public catalogue, blog et homepage
- SEO de base sur produits et articles
- seed local de développement alimenté depuis la source WooCommerce Creatyss d’origine

## Démarrage local

Le projet est piloté via `make`.

Commande d’entrée principale :

```bash
make up
```

### Variables disponibles

- `.env.example`

`.env.example` est uniquement un fichier de placeholders versionné.
Les vraies valeurs locales doivent vivre dans `.env` ou `.env.local`, qui restent non versionnés.

Le `Makefile` utilise `ENV_FILE=.env.local` par défaut.
Pour lancer explicitement le projet avec vos secrets locaux :

```bash
ENV_FILE=.env.local make up
```

Le même principe s’applique à `make build`, `make db-reset-dev`, `make test-e2e` et aux autres cibles `make`.

### Variables sensibles ou locales notables

- `ADMIN_SESSION_SECRET`
- `CART_SESSION_SECRET`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `BREVO_API_KEY`
- `EMAIL_FROM`
- `WC_BASE_URL`
- `WC_CONSUMER_KEY`
- `WC_CONSUMER_SECRET`

## Commandes principales

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

### Prérequis pour `make test-e2e`

1. l’application et PostgreSQL doivent déjà être démarrés
2. le schéma et le seed doivent déjà être appliqués
3. les dépendances Node locales doivent déjà être installées sur l’hôte (`pnpm install`)
4. Chromium Playwright doit être installé localement une fois
5. si les flux Stripe doivent être testés réellement, de vraies clés de test doivent être définies dans `.env` ou `.env.local`
6. si les emails transactionnels doivent être testés réellement, `BREVO_API_KEY` et `EMAIL_FROM` doivent aussi être définis dans `.env` ou `.env.local`

Flux local minimal :

```bash
pnpm install
docker compose --env-file .env.local up -d --build
make db-schema
make db-seed-dev
pnpm exec playwright install chromium
make test-e2e
```

## Base de données

Le schéma PostgreSQL est défini par les fichiers Prisma répartis sous `prisma/`, organisés en sous-dossiers par domaine.
L’historique SQL est archivé sous `db/migrations/_archive/` et la baseline active unique vit sous `db/migrations/active/001_baseline.sql`.

Application locale :

```bash
make up
make db-schema
```

`make db-schema` régénère le client Prisma puis applique la baseline SQL active via `prisma db execute` sur une base fraîche.
Pour une reconstruction locale complète, la commande de référence reste `make db-reset-dev`.

Pour repartir proprement avec schéma + seed :

```bash
make db-reset-dev
```

Vérifications locales exactes :

```bash
docker compose --env-file .env.local exec -T db psql -U creatyss -d creatyss -c "select table_name from information_schema.tables where table_schema = 'public' order by table_name;"
docker compose --env-file .env.local exec -T db psql -U creatyss -d creatyss -c "select indexname from pg_indexes where schemaname = 'public' order by tablename, indexname;"
pnpm run typecheck
```

## Seed dev

Le seed de développement reconstruit un socle local minimal puis hydrate le catalogue depuis le WooCommerce Creatyss d’origine.

Il est destiné uniquement au développement local.

Application locale :

```bash
make db-seed-dev
```

Reset complet + seed :

```bash
make db-reset-dev
```

Le seed de développement couvre :

- une boutique locale `creatyss`
- une liste de prix par défaut
- des comptes admin de développement
- les catégories WooCommerce
- les produits et déclinaisons WooCommerce
- les prix catalogue WooCommerce
- les médias produits WooCommerce si l’import images est activé

### Variables requises pour l’hydratation catalogue

- `WC_BASE_URL`
- `WC_CONSUMER_KEY`
- `WC_CONSUMER_SECRET`

## Fonctionnalités disponibles

### Fonctionnalités admin disponibles

- `/admin/media`
- `/admin/categories`
- `/admin/products`
- `/admin/homepage`
- `/admin/blog`

### Pages publiques disponibles

- `/`
- `/boutique`
- `/boutique/[slug]`
- `/blog`
- `/blog/[slug]`

## Auth admin

L’auth admin repose sur `users`, `auth_identities` et `auth_password_credentials`, plus un cookie de session signé `HttpOnly` côté application.

### Variables d’environnement requises

- `ADMIN_SESSION_SECRET`

### Comptes admin de développement fournis par le seed local

- `admin@creatyss.local` / `AdminDev123!` / actif
- `inactive-admin@creatyss.local` / `AdminDev123!` / inactif

Le seed de développement crée automatiquement ces comptes sur base neuve via `make db-seed-dev` ou `make db-reset-dev`.

### Pour créer un admin supplémentaire manuellement

```bash
printf '%s' 'SuperLongPassword123!' | docker compose --env-file .env.local exec -T app node --experimental-strip-types scripts/create-admin-user.ts --email admin@example.com --display-name "Admin Creatyss" --password-stdin
```

### Vérification locale exacte

```bash
docker compose --env-file .env.local down -v
docker compose --env-file .env.local up -d --build
make db-schema
make db-seed-dev
docker compose --env-file .env.local exec -T db psql -U creatyss -d creatyss -c "select u.email, u.display_name, u.status, ai.status as identity_status from users u left join auth_identities ai on ai.user_id = u.id order by u.email;"
docker compose --env-file .env.local exec app pnpm run typecheck
docker compose --env-file .env.local exec app pnpm run build
curl -I http://localhost:3000/admin
```

### Vérification manuelle du login admin

1. ouvrir `http://localhost:3000/admin/login`
2. se connecter avec `admin@creatyss.local` / `AdminDev123!`
3. vérifier la redirection vers `/admin`
4. vérifier qu’un accès direct à `http://localhost:3000/admin` fonctionne après connexion
5. cliquer sur la déconnexion puis vérifier que `/admin` redirige de nouveau vers `/admin/login`
6. vérifier aussi qu’un login avec `inactive-admin@creatyss.local` / `AdminDev123!` est refusé

## Media admin

La bibliothèque media admin repose sur la table `media_assets`, un stockage local sous `public/uploads`, et une page protégée `/admin/media`.

Le système media admin accepte actuellement uniquement :

- `image/jpeg`
- `image/png`
- `image/webp`

### Vérification locale exacte

```bash
docker compose --env-file .env.local down -v
docker compose --env-file .env.local up -d --build
make db-schema
make db-seed-dev
docker compose --env-file .env.local exec app pnpm run typecheck
docker compose --env-file .env.local exec app pnpm run build
docker compose --env-file .env.local exec -T db psql -U creatyss -d creatyss -c "select table_name from information_schema.tables where table_schema = 'public' and table_name = 'media_assets';"
```

Puis :

1. connectez-vous sur `http://localhost:3000/admin/login`
2. ouvrez `http://localhost:3000/admin/media`
3. importez une image JPEG, PNG ou WebP valide
4. vérifiez la ligne créée en base :

```bash
docker compose --env-file .env.local exec -T db psql -U creatyss -d creatyss -c "select id, storage_path, original_filename, mime_type, file_size_bytes, width, height from media_assets order by created_at desc;"
find public/uploads -type f | sort
```

Pour vérifier le fallback listing, supprimez un fichier local déjà importé puis rechargez `/admin/media` :

```bash
find public/uploads -type f | head -n 1
rm <chemin_retourne>
```

## Documentation

### Documentation courante

- `AGENTS.md`
- `docs/architecture/README.md`
- `docs/architecture/00-introduction/**`
- `docs/architecture/10-fondations/**`
- `docs/architecture/20-structure/**`
- `docs/architecture/30-execution/**`
- `docs/architecture/40-exploitation/**`
- `docs/architecture/90-reference/**`
- `docs/domains/README.md`
- `docs/testing/**`
- `.claude/CLAUDE.md`
- `.github/copilot-instructions.md`
- `.codex/config.toml`
- `.codex/skills/`

## Contraintes importantes

Le projet n’utilise pas :

- WordPress
- WooCommerce
- Shopify
- Supabase
- Vercel

## État actuel du projet

Le dépôt contient aujourd’hui un socle e-commerce local exploitable pour Creatyss, avec un coeur documentaire structuré par architecture, domaines et validation.

Les capacités effectivement implémentées à ce stade couvrent notamment :

- authentification admin serveur
- bibliothèque media locale
- CRUD catégories admin
- CRUD produits admin avec catégories, images et déclinaisons
- édition admin de la homepage
- CRUD blog admin
- front public catalogue, blog et homepage
- SEO de base sur produits et articles

La lecture de référence doit désormais partir de `docs/architecture/`, puis `docs/domains/`, puis `docs/testing/`.
