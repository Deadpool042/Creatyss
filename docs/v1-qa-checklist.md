# Checklist QA V1

## Preparation locale

```bash
docker compose --env-file .env.example down -v
docker compose --env-file .env.example up -d --build
make db-schema
make db-seed-dev
docker compose --env-file .env.example exec app pnpm run typecheck
docker compose --env-file .env.example exec app pnpm run build
```

Compte admin seed :

- `admin@creatyss.local`
- `AdminDev123!`

Important :

- le seed ne cree pas de `media_assets`
- importez au moins deux images via `/admin/media` avant de verifier les flux produit, blog et homepage qui selectionnent un media existant

## Auth admin

1. Ouvrir `/admin/login`
2. Se connecter avec `admin@creatyss.local` / `AdminDev123!`
3. Verifier la redirection vers `/admin`
4. Ouvrir `/admin` directement apres connexion
5. Se deconnecter et verifier la redirection vers `/admin/login`
6. Verifier qu'un login avec `inactive-admin@creatyss.local` / `AdminDev123!` est refuse

## Media admin

1. Ouvrir `/admin/media`
2. Importer une image JPEG, PNG ou WebP valide
3. Verifier qu'une ligne apparait dans le listing
4. Verifier l'aperçu image
5. Verifier en base :

```bash
docker compose --env-file .env.example exec -T db psql -U creatyss -d creatyss -c "select id, file_path, mime_type, byte_size, image_width, image_height from media_assets order by created_at desc;"
```

6. Essayer un faux fichier image et verifier le message d'erreur
7. Supprimer manuellement un fichier importe sur disque puis recharger `/admin/media` et verifier le fallback sans aperçu

## Categories admin

1. Ouvrir `/admin/categories`
2. Creer une categorie avec un slug non normalise
3. Verifier le message de succes
4. Modifier la categorie creee
5. Verifier le message d'erreur sur slug deja utilise
6. Tenter de supprimer une categorie liee a un produit et verifier le refus explicite
7. Supprimer une categorie non liee et verifier le retour liste avec succes

## Produits admin

1. Ouvrir `/admin/products`
2. Creer un produit parent avec au moins une categorie
3. Verifier la redirection vers `/admin/products/[id]`
4. Modifier le produit parent
5. Ajouter une variante
6. Ajouter une image produit a partir d'un media existant
7. Ajouter une image de variante a partir d'un media existant
8. Verifier les messages d'erreur par section :
   - slug duplique
   - SKU duplique
   - prix invalide
   - `compare_at_price` inferieur au prix
   - media introuvable
9. Supprimer une image, une variante puis le produit
10. Verifier en base que `product_categories`, `product_variants` et `product_images` ont ete nettoyees

## Homepage admin et homepage publique

1. Ouvrir `/admin/homepage`
2. Modifier :
   - titre hero
   - texte hero
   - image hero via `select`
   - bloc editorial
3. Selectionner des produits, categories et articles mis en avant avec des ordres simples
4. Enregistrer et verifier le message de succes
5. Ouvrir `/` et verifier que la homepage publique reflète les changements
6. Verifier les erreurs visibles :
   - ordre invalide
   - ordre duplique
   - media hero invalide
   - selection invalide

## Blog admin et public

1. Ouvrir `/admin/blog`
2. Creer un article avec :
   - titre
   - slug non normalise
   - extrait
   - contenu
   - statut
   - image de couverture optionnelle
3. Verifier la redirection vers `/admin/blog/[id]`
4. Basculer `draft` / `published` et verifier `published_at`
5. Modifier ou retirer l'image de couverture
6. Verifier les erreurs visibles :
   - slug duplique
   - statut invalide
   - media introuvable
7. Supprimer un article et verifier le retour liste avec succes
8. Ouvrir `/blog` puis `/blog/[slug]` et verifier le contenu public

## SEO de base

1. Ouvrir un produit dans `/admin/products/[id]`
2. Renseigner `SEO title` et `SEO description`
3. Enregistrer puis verifier sur `/boutique/[slug]` :
   - le titre de page
   - la meta description
4. Vider les champs SEO et verifier le fallback vers les champs metier
5. Faire la meme verification sur `/admin/blog/[id]` puis `/blog/[slug]`

## Verification SQL de fin

```bash
docker compose --env-file .env.example exec -T db psql -U creatyss -d creatyss -c "select id, email, is_active from admin_users order by id;"
docker compose --env-file .env.example exec -T db psql -U creatyss -d creatyss -c "select id, file_path, mime_type, byte_size from media_assets order by id desc;"
docker compose --env-file .env.example exec -T db psql -U creatyss -d creatyss -c "select id, name, slug from categories order by id;"
docker compose --env-file .env.example exec -T db psql -U creatyss -d creatyss -c "select id, name, slug, status, seo_title, seo_description from products order by id;"
docker compose --env-file .env.example exec -T db psql -U creatyss -d creatyss -c "select id, product_id, sku, is_default, status from product_variants order by id;"
docker compose --env-file .env.example exec -T db psql -U creatyss -d creatyss -c "select id, product_id, variant_id, file_path, is_primary from product_images order by id;"
docker compose --env-file .env.example exec -T db psql -U creatyss -d creatyss -c "select id, hero_title, hero_image_path, editorial_title, status from homepage_content order by id;"
docker compose --env-file .env.example exec -T db psql -U creatyss -d creatyss -c "select homepage_content_id, product_id, sort_order from homepage_featured_products order by homepage_content_id, sort_order;"
docker compose --env-file .env.example exec -T db psql -U creatyss -d creatyss -c "select homepage_content_id, category_id, sort_order from homepage_featured_categories order by homepage_content_id, sort_order;"
docker compose --env-file .env.example exec -T db psql -U creatyss -d creatyss -c "select homepage_content_id, blog_post_id, sort_order from homepage_featured_blog_posts order by homepage_content_id, sort_order;"
docker compose --env-file .env.example exec -T db psql -U creatyss -d creatyss -c "select id, title, slug, status, published_at, seo_title, seo_description from blog_posts order by id;"
```
