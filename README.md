# Creatyss

Socle e-commerce custom pour Creatyss, conçu pour être **local-first**, maintenable, modulaire et déployable ensuite sur un VPS OVH.

Le dépôt documente le projet à partir d’une doctrine explicite d’architecture, de domaines et de validation.

La doctrine actuelle est structurée autour de :

- `docs/architecture/` — doctrine canonique du système
- `docs/domains/` — cartographie et cadrage des domaines
- `docs/testing/` — stratégie et trajectoire de validation
- `AGENTS.md` — règles de travail, discipline de modification et contraintes repo

## Positionnement

Creatyss est une base e-commerce pensée pour :

- fonctionner d’abord en développement local natif via `pnpm dev`
- conserver Docker Compose pour les vérifications prod-like locales et la préparation au déploiement
- rester lisible et strictement typée
- éviter les dépendances inutiles
- séparer clairement domaine métier, logique serveur, accès aux données, intégrations et UI
- permettre une évolution progressive sans dissoudre les frontières métier
- rester réutilisable pour d’autres projets e-commerce au-delà du seul cas Creatyss

## Modes d’exécution

Le projet distingue trois modes.

### 1. Développement local natif

Mode utilisé au quotidien.

```bash
pnpm dev
```

Ce mode privilégie la rapidité d’itération, la lisibilité des erreurs et l’intégration directe avec l’éditeur.

### 2. Prod-like local via Docker Compose

Mode utilisé pour vérifier le comportement dans un environnement conteneurisé proche production.

```bash
docker compose --env-file .env.local up -d --build
```

Ce mode ne remplace pas le développement courant.

### 3. Production VPS OVH

Mode cible futur.

Le projet doit rester compatible avec un déploiement VPS classique :

- reverse proxy
- process Node.js contrôlé
- PostgreSQL
- variables d’environnement serveur
- stockage média local ou volume dédié
- sauvegardes base + uploads

## Stack cible

- Next.js App Router
- TypeScript strict
- PostgreSQL
- Prisma
- pnpm pour le développement local courant
- Docker Compose pour les vérifications prod-like locales
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

### Lecture recommandée

Pour comprendre le projet dans son état courant :

1. lire `AGENTS.md`
2. lire `README.md`
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
- seed local de développement pouvant importer ponctuellement des données historiques WooCommerce

## Démarrage local

Le développement courant se fait en local natif avec `pnpm`.

Commande d’entrée principale :

```bash
pnpm dev
```

### Flux local recommandé

Prérequis : PostgreSQL local accessible sur `localhost:5434`, variables dans `.env.local`.

```bash
pnpm install
pnpm run db:generate   # génère le client Prisma
pnpm run db:validate   # vérifie la cohérence du schéma
pnpm run db:push       # applique le schéma à la base locale
pnpm run db:seed       # bootstrap store + articles blog de développement
pnpm dev
```

Pour repartir proprement :

```bash
pnpm run db:push-reset  # reset schéma (DESTRUCTIF)
pnpm run db:seed
pnpm dev
```

### Mode prod-like local

Docker Compose reste disponible pour les vérifications d’intégration ou les scénarios proches production :

```bash
docker compose --env-file .env.local up -d --build
```

Si les cibles `make` sont utilisées :

```bash
ENV_FILE=.env.local make up
```

## Variables d’environnement

### Variables disponibles

- `.env.example`

`.env.example` est uniquement un fichier de placeholders versionné.

Les vraies valeurs locales doivent vivre dans :

- `.env.local` pour le développement local natif
- `.env` uniquement si nécessaire pour certains outils ou scripts
- jamais dans un fichier versionné

Le développement courant charge les variables nécessaires depuis `.env.local`.

Le mode Docker Compose peut aussi utiliser `.env.local` explicitement :

```bash
docker compose --env-file .env.local up -d --build
```

Si les cibles `make` sont utilisées, le `Makefile` peut conserver `ENV_FILE=.env.local` par défaut :

```bash
ENV_FILE=.env.local make up
```

### Variables sensibles ou locales notables

- `ADMIN_SESSION_SECRET`
- `CART_SESSION_SECRET`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `EMAIL_PROVIDER`
- `EMAIL_FROM_ADDRESS`
- `EMAIL_FROM_NAME`
- `MAILPIT_SMTP_HOST`
- `MAILPIT_SMTP_PORT`
- `BREVO_API_KEY`
- `BREVO_FROM_ADDRESS`
- `BREVO_FROM_NAME`
- `WC_BASE_URL`
- `WC_CONSUMER_KEY`
- `WC_CONSUMER_SECRET`

Pour l’email transactionnel :

- en local natif `pnpm dev`, utiliser `EMAIL_PROVIDER=mailpit` avec `MAILPIT_SMTP_HOST=localhost`
- si l’application tourne dans Docker mais que Mailpit tourne sur la machine hôte, utiliser `MAILPIT_SMTP_HOST=host.docker.internal`
- en production, utiliser `EMAIL_PROVIDER=brevo`
- les placeholders Brevo de `.env.example` sont volontairement refusés quand `EMAIL_PROVIDER=brevo`

## Commandes principales

### Développement local natif

```bash
pnpm install
pnpm dev
pnpm run build
pnpm run typecheck
pnpm run test
pnpm run test:unit
pnpm run test:e2e
pnpm run test:e2e-ui
pnpm run test-e2e-headed
pnpm run test-select
```

### Base de données locale

```bash
pnpm run db:generate    # génère le client Prisma
pnpm run db:validate    # valide le schéma
pnpm run db:push        # applique le schéma (sans reset)
pnpm run db:push-reset  # reset + applique le schéma (DESTRUCTIF)
pnpm run db:seed        # seed minimal dev
pnpm run db:studio      # Prisma Studio local (port 5555)
pnpm run db:format      # formate le schéma Prisma
```

### Mode prod-like local via Docker Compose

```bash
make up
make down
make restart
make logs
make ps
make sh
make build
make db-schema
make db-seed-dev
make db-reset-dev
make test
make test-unit
make test-e2e
make test-e2e-ui
make test-e2e-headed
make test-select
```

Le mode `make` / Docker Compose est réservé aux vérifications prod-like, aux resets contrôlés et aux validations d’intégration.

## Tests

Les tests se lancent prioritairement en local natif avec `pnpm`.

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

Via Docker Compose / `make`, les commandes restent disponibles pour validation prod-like :

```bash
make test
make test-unit
make test-e2e
make test-e2e-ui
make test-e2e-headed
make test-select
```

### Prérequis pour les tests E2E

1. l’application doit être démarrée
2. PostgreSQL doit être accessible
3. le schéma et le seed doivent déjà être appliqués
4. les dépendances Node locales doivent déjà être installées (`pnpm install`)
5. Chromium Playwright doit être installé localement une fois
6. si les flux Stripe doivent être testés réellement, de vraies clés de test doivent être définies dans `.env.local`
7. pour les emails transactionnels en local, lancer Mailpit puis définir `EMAIL_PROVIDER=mailpit`, `EMAIL_FROM_ADDRESS`, `EMAIL_FROM_NAME`, `MAILPIT_SMTP_HOST=localhost` et `MAILPIT_SMTP_PORT=1025` dans `.env.local`
8. pour la production, définir explicitement `EMAIL_PROVIDER=brevo`, `BREVO_API_KEY`, `BREVO_FROM_ADDRESS` et `BREVO_FROM_NAME` dans l’environnement cible
9. si l’application tourne dans Docker mais que Mailpit tourne hors Docker sur la machine hôte, utiliser `MAILPIT_SMTP_HOST=host.docker.internal`

Flux local natif minimal :

```bash
pnpm install
pnpm run db:push
pnpm run db:seed
pnpm exec playwright install chromium
pnpm dev
pnpm run test:e2e
```

Flux prod-like Docker Compose :

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

L’historique SQL est archivé sous `db/migrations/_archive/`.

La baseline active unique vit sous :

- `db/migrations/active/001_baseline.sql`

### Application locale native

```bash
pnpm run db:generate    # génère le client Prisma local
pnpm run db:push        # applique le schéma à la base locale
pnpm run db:seed        # seed minimal de développement
```

Pour repartir proprement :

```bash
pnpm run db:push-reset  # reset schéma (DESTRUCTIF)
pnpm run db:seed
```

### Application prod-like via Docker Compose

```bash
make db-schema
```

`make db-schema` régénère le client Prisma puis applique la baseline SQL active sur une base fraîche dans les conteneurs.

Pour une reconstruction Docker complète :

```bash
make db-reset-dev
```

### Vérifications locales natives

```bash
pnpm run typecheck
pnpm run build
```

Pour inspecter la base PostgreSQL locale, utiliser `psql` avec la valeur de `DATABASE_URL` déclarée dans `.env.local`.

Exemples :

```bash
psql "$DATABASE_URL" -c "select table_name from information_schema.tables where table_schema = 'public' order by table_name;"
psql "$DATABASE_URL" -c "select indexname from pg_indexes where schemaname = 'public' order by tablename, indexname;"
```

### Vérifications prod-like Docker Compose

```bash
docker compose --env-file .env.local exec -T db psql -U creatyss -d creatyss -c "select table_name from information_schema.tables where table_schema = 'public' order by table_name;"
docker compose --env-file .env.local exec -T db psql -U creatyss -d creatyss -c "select indexname from pg_indexes where schemaname = 'public' order by tablename, indexname;"
docker compose --env-file .env.local exec app pnpm run typecheck
```

## Seed dev

Le seed de développement reconstruit un socle local minimal.

Il est destiné uniquement au développement local et aux resets contrôlés.

### Application locale native — seed minimal

```bash
pnpm run db:seed
```

Reset schéma + seed :

```bash
pnpm run db:push-reset
pnpm run db:seed
```

Le seed minimal couvre :

- une boutique locale `creatyss`
- des comptes admin de développement
- des articles blog de développement

### Hydratation catalogue WooCommerce (optionnel)

Le catalogue peut être alimenté ponctuellement depuis les données historiques WooCommerce :

```bash
pnpm run seed:dev
```

Cette commande est distincte du seed minimal. Elle nécessite les variables :

- `WC_BASE_URL`
- `WC_CONSUMER_KEY`
- `WC_CONSUMER_SECRET`

### Application prod-like Docker Compose

```bash
make db-seed-dev   # seed complet WooCommerce dans les conteneurs
make db-reset-dev  # reset complet + seed dans les conteneurs
```

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

Le seed de développement crée automatiquement ces comptes sur base neuve via `pnpm run db:seed`, `make db-seed-dev` ou `make db-reset-dev`.

### Pour créer un admin supplémentaire manuellement

En local natif :

```bash
printf '%s' 'SuperLongPassword123!' | node --experimental-strip-types scripts/create-admin-user.ts --email admin@example.com --display-name "Admin Creatyss" --password-stdin
```

En mode Docker Compose :

```bash
printf '%s' 'SuperLongPassword123!' | docker compose --env-file .env.local exec -T app node --experimental-strip-types scripts/create-admin-user.ts --email admin@example.com --display-name "Admin Creatyss" --password-stdin
```

### Vérification locale native

```bash
pnpm run db:push-reset
pnpm run db:seed
pnpm run typecheck
pnpm run build
pnpm dev
```

Puis vérifier :

```bash
curl -I http://localhost:3000/admin
```

Pour inspecter les comptes admin en base :

```bash
psql "$DATABASE_URL" -c "select u.email, u.display_name, u.status, ai.status as identity_status from users u left join auth_identities ai on ai.user_id = u.id order by u.email;"
```

### Vérification prod-like Docker Compose

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
- `image/avif`

### Vérification locale native

```bash
pnpm run db:push-reset
pnpm run db:seed
pnpm run typecheck
pnpm run build
pnpm dev
```

Puis :

1. connectez-vous sur `http://localhost:3000/admin/login`
2. ouvrez `http://localhost:3000/admin/media`
3. importez une image JPEG, PNG, AVIF ou WebP valide
4. vérifiez la ligne créée en base :

```bash
psql "$DATABASE_URL" -c "select id, storage_path, original_filename, mime_type, file_size_bytes, width, height from media_assets order by created_at desc;"
find public/uploads -type f | sort
```

### Vérification prod-like Docker Compose

```bash
docker compose --env-file .env.local down -v
docker compose --env-file .env.local up -d --build
make db-schema
make db-seed-dev
docker compose --env-file .env.local exec app pnpm run typecheck
docker compose --env-file .env.local exec app pnpm run build
docker compose --env-file .env.local exec -T db psql -U creatyss -d creatyss -c "select table_name from information_schema.tables where table_schema = 'public' and table_name = 'media_assets';"
```

Pour vérifier le fallback listing, supprimez un fichier local déjà importé puis rechargez `/admin/media` :

```bash
find public/uploads -type f | head -n 1
rm <chemin_retourne>
```

## Documentation

La hiérarchie documentaire canonique est définie dans la section `Doctrine documentaire actuelle` plus haut.

Pour la trajectoire projet :

- `docs/roadmap/projet-creatyss.md`

## Contraintes importantes

Le développement courant n’est plus Docker-first.

Par défaut :

- utiliser `pnpm dev`
- utiliser les scripts `pnpm run ...`
- ne proposer Docker Compose que pour les validations prod-like ou les scénarios de déploiement local proche production
- ne pas remplacer le flux local natif par Docker sauf demande explicite

Le projet n’utilise pas en runtime :

- WordPress
- WooCommerce comme base applicative
- Shopify
- Supabase
- Vercel

Un import historique ponctuel depuis WooCommerce est possible uniquement pour l’alimentation de données en développement, seed local ou migration, sans dépendance runtime.

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
