# Repository admin `homepage`

## Rôle

`admin-homepage.repository.ts` gère l'édition de la page d'accueil publiée côté admin.

Le domaine couvre :

- lecture de la homepage éditable
- lecture du hero image courant
- lecture des options de sélection :
  - produits
  - catégories
  - articles de blog
- mise à jour transactionnelle de la homepage et de ses sélections mises en avant

## Structure actuelle

Fichiers :

- `admin-homepage.repository.ts`
- `admin-homepage.types.ts`

Contrats publics principaux :

- `AdminHomepageDetail`
- `AdminHomepageEditorData`
- `UpdateAdminHomepageInput`
- `AdminHomepageRepositoryError`

## Fonctions publiques actuelles

- `getAdminHomepageCurrentHeroImagePath(homepageId)`
- `getAdminHomepageEditorData()`
- `updateAdminHomepage(input)`

## Flux principaux

### Lecture éditeur

`getAdminHomepageEditorData()` :

1. lit la homepage publiée
2. charge en parallèle :
   - sélections produits
   - sélections catégories
   - sélections blog
   - options produits
   - options catégories
   - options blog
3. reconstruit `AdminHomepageEditorData`

### Mise à jour

`updateAdminHomepage()` :

1. valide l'id
2. lance une transaction Prisma
3. vérifie l'existence de la homepage publiée
4. vérifie l'existence et le statut des entités sélectionnées
5. met à jour la homepage
6. remplace les trois tables de liaison :
   - `homepage_featured_products`
   - `homepage_featured_categories`
   - `homepage_featured_blog_posts`

## Points complexes réels

### Options de formulaire

Les listes d'options sont construites avec :

- produits publiés
- toutes les catégories
- articles de blog publiés

Le tri catégories et produits est fait en mémoire pour reproduire un tri insensible à la casse.

### Blog posts options

Le code utilise aujourd'hui :

- `published_at DESC NULLS LAST`
- puis `created_at DESC`
- puis `id DESC`

Le fichier contient encore un commentaire historique mentionnant l'ancienne difficulté Prisma autour de `COALESCE(published_at, created_at)`. Ce commentaire ne correspond plus à du raw Prisma runtime.

### Validation transactionnelle

Le domaine valide les références sélectionnées avant tout remplacement des tables de liaison. Les erreurs sont remontées via `AdminHomepageRepositoryError`.

## Limites actuelles

- lecture et écriture cohabitent dans un seul fichier assez long
- les helpers de validation transactionnelle et de remplacement des liaisons pourraient être sortis
- les options de formulaire vivent encore dans le repository plutôt que dans une couche query dédiée

## Lecture V20

Le domaine `admin-homepage` est déjà stabilisé fonctionnellement.

Le gain V20 attendu est surtout :

- extraction des queries de lecture d'options
- isolation des helpers transactionnels
- conservation stricte du contrat `AdminHomepageEditorData`
