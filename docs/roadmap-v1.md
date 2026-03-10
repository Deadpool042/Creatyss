# Roadmap V1

## Objectif

Construire une V1 locale, dockerisée, maintenable et réellement exploitable pour Creatyss.

La roadmap suit une logique simple :

- poser la fondation technique
- sécuriser le socle de données
- construire l’admin
- livrer le front public
- finir par les validations et ajustements V1

## Étape 1 — Fondation projet

### Objectif de l’étape 1

Mettre en place la base technique minimale du projet.

### Livrables de l’étape 1

- initialisation Next.js App Router
- TypeScript strict activé
- structure initiale des dossiers
- `Dockerfile`
- `docker-compose.yml`
- `Makefile`
- `.env.example`
- `.gitignore`

### Dépendances

Aucune.

### Points d’attention

- rester minimal
- ne pas ajouter de logique métier
- préparer un fonctionnement local via Docker

## Étape 2 — Docker + base de données

### Objectif de l’étape 2

Faire tourner l’application et PostgreSQL en local via Docker.

### Livrables de l’étape 2

- service `app`
- service `db`
- volume persistant PostgreSQL
- connexion applicative à PostgreSQL
- commandes `make` de base (`up`, `down`, `logs`, `ps`)

### Dépendances de l’étape 2

- étape 1

### Points d’attention de l’étape 2

- variables d’environnement claires
- ports cohérents
- logs lisibles
- démarrage simple avec `make up`

## Étape 3 — Modèle de données V1

### Objectif de l’étape 3

Poser un schéma de données propre et stable pour la V1.

### Livrables de l’étape 3

- tables `admin_users`
- tables `categories`
- tables `products`
- tables `product_categories`
- tables `product_variants`
- tables `product_images`
- tables `blog_posts`
- table `homepage_content`
- migrations initiales
- éventuel seed minimal de développement

### Dépendances de l’étape 3

- étape 2

### Points d’attention de l’étape 3

- slugs uniques
- timestamps systématiques
- contraintes explicites
- index utiles sans excès
- modèle produit parent / variantes couleur propre

## Étape 4 — Auth admin

### Objectif de l’étape 4

Mettre en place une authentification admin simple et sécurisée.

### Livrables de l’étape 4

- page `/admin/login`
- session admin sécurisée
- protection des routes `/admin`
- gestion d’un utilisateur admin initial
- messages d’erreur explicites

### Dépendances de l’étape 4

- étape 3

### Points d’attention de l’étape 4

- ne pas sur-architecturer l’auth
- validation serveur obligatoire
- gestion claire des erreurs de connexion
- secret de session centralisé en variable d’environnement

## Étape 5 — CRUD catégories admin

### Objectif de l’étape 5

Permettre la gestion simple des catégories dans l’admin.

### Livrables de l’étape 5

- liste des catégories
- création catégorie
- édition catégorie
- suppression catégorie si autorisée
- validations de formulaire
- gestion du slug

### Dépendances de l’étape 5

- étape 4

### Points d’attention de l’étape 5

- labels clairs
- peu de champs
- erreurs utiles
- éviter toute complexité inutile

## Étape 6 — CRUD produits admin

### Objectif de l’étape 6

Mettre en place le CRUD du produit parent.

### Livrables de l’étape 6

- liste des produits
- création produit
- édition produit
- statut brouillon / publié
- gestion SEO de base
- liaison aux catégories

### Dépendances de l’étape 6

- étape 5

### Points d’attention de l’étape 6

- ne pas mélanger produit parent et variantes
- formulaire compréhensible pour une utilisatrice non technique
- cohérence des slugs et statuts

## Étape 7 — Variantes et images

### Objectif de l’étape 7

Permettre la gestion des variantes couleur et des images associées.

### Livrables de l’étape 7

- CRUD variantes couleur
- image principale produit
- images liées à une variante
- ordre des images
- sélection d’une variante par défaut
- upload local des images

### Dépendances de l’étape 7

- étape 6

### Points d’attention de l’étape 7

- bien séparer images produit et images variante
- prévoir le changement d’image selon variante côté front
- validations serveur sur les uploads
- conventions de nommage simples

## Étape 8 — Blog admin

### Objectif de l’étape 8

Permettre la gestion des articles de blog depuis l’admin.

### Livrables de l’étape 8

- liste des articles
- création article
- édition article
- statut brouillon / publié
- slug
- extrait
- image de couverture
- SEO de base

### Dépendances de l’étape 8

- étape 4

### Points d’attention de l’étape 8

- interface simple
- contenu structuré
- publication maîtrisée
- éviter une logique CMS trop complexe en V1

## Étape 9 — Homepage éditable

### Objectif de l’étape 9

Rendre la homepage pilotable depuis l’admin.

### Livrables de l’étape 9

- formulaire homepage
- hero
- texte principal
- bloc éditorial
- produits mis en avant
- catégories mises en avant
- articles mis en avant
- statut brouillon / publié si retenu

### Dépendances de l’étape 9

- étapes 6 et 8

### Points d’attention de l’étape 9

- structure simple
- pas de builder générique
- données structurées et prévisibles
- expérience d’édition claire

## Étape 10 — Front public

### Objectif de l’étape 10

Construire les pages publiques principales de la V1.

### Livrables de l’étape 10

- homepage
- listing boutique
- fiche produit
- listing catégories
- listing blog
- article de blog
- affichage des variantes couleur
- changement d’image selon variante
- SEO de base rendu côté front
- parallel routes seulement si elles apportent un vrai bénéfice structurel ou UX

### Dépendances de l’étape 10

- étapes 6 à 9

### Points d’attention de l’étape 10

- mobile first
- performance perçue
- UI sobre et lisible
- admin et front bien séparés
- parallel routes seulement si elles apportent un vrai bénéfice

## Étape 11 — Validation V1

### Objectif de l’étape 11

Stabiliser la V1 avant enrichissement futur.

### Livrables de l’étape 11

- vérification TypeScript
- vérification Docker local
- vérification auth admin
- vérification CRUD catégories / produits / variantes / blog / homepage
- vérification uploads
- vérification pages publiques
- revue des erreurs visibles
- corrections de cohérence UI minimales

### Dépendances de l’étape 11

- étapes 1 à 10

### Points d’attention de l’étape 11

- pas de nouvelles features
- priorité à la fiabilité
- corriger les erreurs runtime évidentes
- préparer une base propre pour la V2

## Hors V1

Sont explicitement repoussés hors V1 :

- paiement avancé
- coupons complexes
- promos avancées
- réductions ciblées
- moteur de recommandation sophistiqué
- mailing list avancée
- publication automatique vers les réseaux sociaux
- automatisations marketing avancées
- IA
- analytics avancés
- multi-langue
- espace client complet

## Définition de terminé pour la V1

La V1 est considérée comme terminée si :

- le projet démarre avec `make up`
- l’app et PostgreSQL tournent localement
- l’admin permet de gérer catégories, produits, variantes, images, blog et homepage
- le front public affiche correctement catalogue, fiches produit, blog et homepage
- les variantes changent bien l’image affichée
- l’auth admin fonctionne
- les erreurs principales sont gérées proprement côté admin et côté front
- le code reste lisible, typé strictement et sans sur-architecture
