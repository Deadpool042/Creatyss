# Objectif

Implémente uniquement la verticale admin catégories V1.

## Inclure

- liste des catégories admin
- création de catégorie
- modification de catégorie
- suppression de catégorie
- validations strictes côté serveur
- persistance base de données
- formulaires simples pour admin non technique
- gestion explicite des erreurs
- refus de suppression si la catégorie est liée à au moins un produit

## Exclure

- produits
- variantes
- blog
- homepage
- SEO avancé
- recherche
- pagination
- bulk actions
- drag and drop
- UI publique

## Contraintes

- respecter strictement `copilot-instructions.md`
- rester dans le périmètre V1
- ne pas ajouter de dépendance inutile
- TypeScript strict
- pas de `any`
- pas de sur-architecture
- pas de logique métier dans les composants UI
- Server Components par défaut
- Client Components seulement si nécessaire
- Server Actions seulement si elles simplifient réellement le flux
- priorité à la simplicité, la lisibilité et la maintenabilité

## Règles métier

- `name` obligatoire
- `slug` obligatoire
- `slug` unique
- normalisation serveur du slug
- `description` optionnelle
- `is_featured` booléen
- message admin clair si suppression impossible car la catégorie est encore utilisée

## Sortie attendue

- liste des fichiers créés/modifiés
- code complet
- variables d’environnement si nécessaire
- commandes de test
- vérification manuelle
