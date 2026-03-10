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

## Auth admin

L'auth admin repose sur la table `admin_users`, un cookie de session signe `HttpOnly`, et une verification serveur sur chaque acces a `/admin`.

Variables d'environnement requises :

- `ADMIN_SESSION_SECRET`

Creation du premier admin :

```bash
printf '%s' 'SuperLongPassword123!' | docker compose --env-file .env.example exec -T app node --experimental-strip-types scripts/create-admin-user.ts --email admin@example.com --display-name "Admin Creatyss" --password-stdin
```

Verification locale exacte :

```bash
docker compose --env-file .env.example down -v
docker compose --env-file .env.example up -d --build
make db-schema
printf '%s' 'SuperLongPassword123!' | docker compose --env-file .env.example exec -T app node --experimental-strip-types scripts/create-admin-user.ts --email admin@example.com --display-name "Admin Creatyss" --password-stdin
docker compose --env-file .env.example exec app pnpm run typecheck
docker compose --env-file .env.example exec app pnpm run build
curl -I http://localhost:3000/admin
curl -i -c /tmp/creatyss-admin.cookie -X POST -H 'Content-Type: application/x-www-form-urlencoded' --data 'email=Admin%40Example.com&password=SuperLongPassword123!' http://localhost:3000/admin/login
COOKIE_VALUE=$(awk '$6=="creatyss_admin_session"{print $7}' /tmp/creatyss-admin.cookie)
node -e "const [payload] = process.argv[1].split('.'); const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')); console.log(data); console.log(Object.keys(data).sort().join(','));" "$COOKIE_VALUE"
curl -I -b /tmp/creatyss-admin.cookie http://localhost:3000/admin
curl -i -b /tmp/creatyss-admin.cookie -X POST http://localhost:3000/admin/logout
curl -I -b /tmp/creatyss-admin.cookie http://localhost:3000/admin
COOKIE_VALUE=$(awk '$6=="creatyss_admin_session"{print $7}' /tmp/creatyss-admin.cookie)
node -e "const [payload, sig] = process.argv[1].split('.'); const obj = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')); obj.exp = 1; process.stdout.write(Buffer.from(JSON.stringify(obj)).toString('base64url') + '.' + sig);" "$COOKIE_VALUE" > /tmp/creatyss-expired.cookie
curl -i -H "Cookie: creatyss_admin_session=$(cat /tmp/creatyss-expired.cookie)" http://localhost:3000/admin
printf 'not-json.invalidsig' > /tmp/creatyss-invalid.cookie
curl -i -H "Cookie: creatyss_admin_session=$(cat /tmp/creatyss-invalid.cookie)" http://localhost:3000/admin
```

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
printf '%s' 'SuperLongPassword123!' | docker compose --env-file .env.example exec -T app node --experimental-strip-types scripts/create-admin-user.ts --email admin@example.com --display-name "Admin Creatyss" --password-stdin
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
