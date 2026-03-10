# Creatyss - Instructions projet

## Contexte

Projet e-commerce custom pour Creatyss, marque de sacs artisanaux.

## Stack

- Next.js App Router (v16+)
- TypeScript strict
- PostgreSQL
- Docker Compose en local
- Makefile comme point d’entrée des commandes
- futur déploiement sur VPS OVH

## Interdits

- Ne jamais proposer WordPress, WooCommerce, Shopify, Supabase ou Vercel.
- Ne jamais ajouter de dépendance inutile.
- Ne jamais introduire Redis, microservices, queue, websocket, IA ou analytics avancés sans demande explicite.
- Ne jamais utiliser `any` sauf justification explicite et exceptionnelle.
- Ne jamais sur-architecturer.

## Priorités

- Solution la plus simple compatible avec l’évolution future.
- Local first via Docker.
- Code lisible, modulaire, maintenable.
- Séparation stricte entre UI, logique métier, accès aux données et validation.
- Mobile first.
- Interface sobre, rapide, claire et orientée conversion.

## Structure attendue

- `app/` pour les routes et layouts
- `features/` pour les cas d’usage par domaine
- `domain/` ou `entities/` pour les types et règles métier
- `db/` pour schéma, accès base et migrations
- `components/` pour composants UI réutilisables
- `lib/` pour helpers techniques transverses
- `docs/` pour la documentation projet

## Règles Next.js et routing

- Server Components par défaut
- Client Components seulement si nécessaire
- Server Actions seulement quand elles simplifient vraiment le flux
- Pas de logique métier directement dans les composants UI
- Utiliser les layouts imbriqués pour limiter les rechargements inutiles
- Utiliser les parallel routes (`@slot`) seulement quand elles apportent un bénéfice clair de structure ou d’UX
- Réserver les parallel routes surtout pour l’admin, les vues composées, les modales ou des zones indépendantes
- Ne jamais introduire de parallel routes par défaut
- Préférer une route simple tant qu’un besoin concret ne justifie pas plus

## Règles UI

- Utiliser `shadcn/ui` comme base UI si une bibliothèque UI est nécessaire
- Ne pas surcharger l’interface avec des composants inutiles
- Toujours privilégier lisibilité, accessibilité et clarté des formulaires
- L’admin doit être simple pour une utilisatrice non technique

## Gestion des erreurs

- Prévoir la gestion des erreurs dès le début
- Valider toutes les entrées côté serveur
- Gérer explicitement les erreurs métier, base de données, authentification et upload
- Utiliser `error.tsx`, `not-found.tsx` et des retours d’erreur typés quand pertinent
- Afficher des messages d’erreur utiles côté admin
- Ne jamais masquer silencieusement une erreur importante

## V1 uniquement

- catalogue produits
- variantes couleur
- changement d’image selon variante
- catégories
- blog
- homepage éditable
- admin simple
- uploads locaux
- SEO de base
- auth admin simple et sécurisée

## Hors périmètre V1

- paiement avancé
- coupons complexes
- promos avancées
- réductions ciblées
- moteur de recommandation sophistiqué
- mailing list avancée
- automatisations marketing avancées
- publication automatique vers les réseaux sociaux
- IA
- analytics avancés
- multi-langue
- espace client complet

## Local first

- Le projet doit fonctionner localement via Docker
- La commande d’entrée principale doit être `make up`
- Le setup local doit inclure au minimum un service `app` et un service `db`

## Quand tu proposes une modification

Toujours donner :

- les fichiers créés/modifiés
- les variables d’environnement nécessaires
- la commande de test
- la vérification manuelle attendue

## Format des réponses

- Répondre de manière concise et orientée implémentation
- Éviter les longues explications théoriques
- Proposer une seule solution principale
- Préférer de petits incréments sûrs
