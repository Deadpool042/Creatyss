# Roadmap V17 — Structure des features et introduction de Zod

## Vue d’ensemble

V17 se découpe en lots progressifs et sûrs.

L’objectif est d’obtenir :

- une structure `features/` plus explicite
- un usage réel de `zod`
- une séparation plus claire entre UI, mutation, lecture et validation
- une base saine avant toute migration Prisma

---

## V17-1 — Introduction de Zod et premiers branchements

### Objectif

Introduire `zod`, créer les premiers `schemas/` et brancher des cas réels prioritaires.

### Livrables

- ajout de la dépendance `zod`
- `features/admin/auth/schemas/login-schema.ts`
- `features/admin/auth/actions/login-action.ts`
- `features/admin/categories/schemas/category-form-schema.ts`
- branchement Zod sur les actions catégories
- schémas préparatoires documentés pour `products`, `blog`, `homepage`

### Critères d’acceptation

- `pnpm run typecheck` passe
- build Dockerisé passe
- `/admin/login` fonctionne
- création / édition de catégorie fonctionnent
- les schémas préparatoires sont explicitement marqués

### État

Réalisé.

---

## V17-2 — Products

### Objectif

Brancher `ProductFormSchema` sur les flux admin produits réellement utilisés.

### Attendus

- identifier les actions produit concernées
- remplacer prudemment la validation d’entrée par `zod` là où c’est raisonnable
- conserver les normalisations métier encore utiles côté `entities/` si nécessaire
- ne pas casser les cas variantes / images / flags de publication

### Critères d’acceptation

- `ProductFormSchema` n’est plus seulement préparatoire
- création / édition produit fonctionnent
- pas de régression sur la gestion des variantes et images

---

## V17-3 — Blog

### Objectif

Brancher `BlogPostFormSchema` sur les actions blog compatibles.

### Attendus

- migrer les validations texte simples
- traiter séparément les cas spécifiques de cover image si nécessaire
- conserver explicitement les parties encore gérées par le validator entity si elles sont plus complexes

### Critères d’acceptation

- le schéma blog est réellement utilisé
- création / édition article fonctionnent
- pas de régression sur le flux média

---

## V17-4 — Homepage

### Objectif

Brancher partiellement puis complètement `HomepageFormSchema` sur l’action homepage.

### Attendus

- commencer par les champs texte simples
- laisser les sélections complexes (produits / catégories / articles / sort orders) dans le validator entity tant qu’elles ne sont pas migrées proprement
- progresser sans casser l’édition homepage

### Critères d’acceptation

- validation homepage clarifiée
- aucun recul fonctionnel dans l’édition admin homepage

---

## V17-5 — Recul de `lib/`

### Objectif

Réduire progressivement l’usage de `lib/` dans les features prioritaires.

### Attendus

- déplacer les lectures vers `queries/`
- déplacer les transformations vers `mappers/`
- extraire les types purement feature-local dans `types/`
- ne pas faire de déplacement cosmétique sans gain réel

### Critères d’acceptation

- la responsabilité des fichiers devient plus lisible
- `lib/` recule sans créer de complexité inutile

---

## Hors périmètre de V17

- Prisma
- refonte ORM
- migration complète de tout le storefront
- réécriture du domaine métier
- couche service générique nouvelle

---

## Commandes de vérification

### Vérifications minimales

```bash
pnpm run typecheck
```
