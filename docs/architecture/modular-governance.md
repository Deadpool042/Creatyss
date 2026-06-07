# Modular Governance

## 1. Objectif

Creatyss est modulaire, progressive et feature-toggleable.

Le système est piloté par `settings/advanced` et extensible sans sur-architecture.
Les modules sont activables indépendamment ; leur absence ne bloque pas le core.

Ce document définit les règles de gouvernance des modules : comment les ajouter, les faire évoluer et les supprimer sans dériver.

Pour le détail du cycle de vie technique et les règles d'implémentation de `settings/advanced`, voir `docs/admin/settings-advanced-feature-system.md`.

---

## 2. États d'une feature

Six états distincts, dans l'ordre de maturité croissante :

1. **Modèle Prisma existant** — la table est définie, les données peuvent exister
2. **Feature cataloguée** — entrée dans `FEATURE_CATALOG`, connue du système de pilotage
3. **Visible dans settings/advanced** — automatique dès qu'elle est dans le catalogue
4. **Activable** — `mutability` autorise l'activation, `defaultState` peut être `inactive`
5. **Réellement implémentée** — composants, pages et actions métier en place
6. **Production-ready** — testée, documentée, livrée

Point clé : une feature peut exister architecturalement avant d'exister fonctionnellement.
Ces états sont indépendants. Ne pas les confondre.

---

## 3. Règles d'ajout de feature

Avant d'ajouter une feature, vérifier :

- le domaine métier : `core` / `optional` / `cross_cutting` / `satellite`
- la cohérence Prisma : schéma existant à réutiliser ou à créer ?
- le besoin réel : éviter les features spéculatives
- préférer un placeholder propre (`AdminComingSoon`) à une implémentation partielle

Quand ajouter dans `FEATURE_CATALOG` :

- quand le module est identifié clairement
- même si l'UI n'existe pas encore
- avant l'implémentation métier complète
- avec `defaultState: "inactive"` si non prête

---

## 4. Règles de suppression

Ne jamais supprimer un modèle Prisma uniquement parce qu'il n'a pas d'UI, n'est pas branché, ou n'est pas activé.

Classifier avant toute suppression :

| Tag | Signification |
|-----|---------------|
| `KEEP_NOW` | Modèle actif, UI branchée |
| `KEEP_SOON` | Modèle prévu, lot planifié |
| `PLACEHOLDER_VALID` | Modèle documenté, pas encore implémenté |
| `REVIEW` | Modèle non documenté, usage incertain |
| `REMOVE_CANDIDATE` | Doublon ou orphelin confirmé |

---

## 5. Placeholders (`AdminComingSoon`)

Les placeholders existent pour :

- rendre visible ce qui est préparé sans être livré
- éviter le code mort implicite
- préparer la modularité sans bloquer le déploiement

Conventions :

- `docRef` valide (chemin réel dans `docs/`)
- `requirements` explicites et lisibles
- `description` métier claire
- aucune logique métier cachée

---

## 6. États runtime d'une feature

Les états runtime déclarés dans `FeatureRuntimeState` sont :

- `active` — feature activée
- `inactive` — feature désactivée (défaut pour les modules non prêts)
- `archived` — feature désactivée définitivement, conservée pour historique
- `maintenance` — feature temporairement indisponible
- `experimental` — feature en cours d'évaluation
- `deprecated` — feature en fin de vie

Règles :

- une feature peut exister dans le catalogue sans être active
- les features `readonly` ne peuvent pas être modifiées depuis l'UI
- les modules `core` actifs ne sont pas désactivables depuis l'UI

La mutabilité est contrôlée par `FeatureMutability` : `readonly`, `toggleable`, `configurable`, `level_selectable`.
Certains modules exposent des niveaux métier spécifiques (`levels`) définis dans `FEATURE_LEVELS`.

---

## 7. Gouvernance des micro-lots

Chaque micro-lot doit :

- rester petit et réversible
- éviter les refactors massifs et les dépendances inutiles
- préserver TypeScript strict (aucun `any`)
- préserver la séparation métier / UI
- ne pas modifier Prisma sans analyse d'impact
- documenter ce qui est préparé mais non livré

---

## 8. Checklist avant merge

- [ ] `pnpm exec tsc --noEmit` passe sans erreur
- [ ] Aucun `any` introduit
- [ ] Aucun schéma Prisma cassé ou migration manquante
- [ ] Aucun placeholder avec `docRef` invalide
- [ ] Navigation cohérente avec les nouvelles routes
- [ ] Aucune logique métier dans les composants UI
- [ ] `FEATURE_CATALOG` sans doublon de clé
- [ ] `defaultState: "inactive"` pour toute feature non prête
