# Settings / Advanced — Système de features modulaires

## 1. Rôle de `settings/advanced`

La section `settings/advanced` de l'admin affiche l'ensemble des features déclarées dans `FEATURE_CATALOG`.
Pour chaque entrée : label, description, famille (`core`, `optional`, `satellite`, `cross_cutting`), état courant et mutabilité.

C'est le point d'entrée pour consulter et, selon la mutabilité, activer ou désactiver un module.
La page se construit dynamiquement à partir du catalogue — aucune modification de route n'est requise pour y faire apparaître une nouvelle entrée.

---

## 2. Quatre états distincts à ne pas confondre

| État | Signification |
|---|---|
| **Modèle Prisma existant** | La table existe en base, le schéma est défini. Aucune UI ne l'exploite encore. |
| **Feature cataloguée** | Une entrée est présente dans `FEATURE_CATALOG`. Le système de pilotage connaît le module. |
| **Feature activée** | `status = ACTIVE` en base. Le module est activé. L'UI peut ne pas encore exister. |
| **UI implémentée** | Les composants, pages et actions métier sont réellement en place et utilisables. |

Ces états sont indépendants. Une feature peut être cataloguée et activable sans que son UI soit développée.
Un modèle Prisma peut exister en base sans feature correspondante dans le catalogue.

---

## 3. Cycle de vie d'une feature

Étapes dans l'ordre :

1. **Prisma** — définir le schéma si une nouvelle table est nécessaire, ou identifier le modèle existant à réutiliser.
2. **`FEATURE_CATALOG`** — ajouter l'entrée avec les champs obligatoires : `key`, `label`, `description`, `family`, `module`, `defaultState: "inactive"`, `mutability`, `scopes`.
3. **`settings/advanced`** — l'entrée apparaît automatiquement. Aucune modification de route ou de composant n'est nécessaire.
4. **Placeholder admin** — si une section settings dédiée est prévue, créer une page `AdminComingSoon` pour signaler que le module est préparé mais pas encore implémenté.
5. **Activation future** — passer `defaultState` à `"active"` ou activer directement en base selon la `mutability` de l'entrée.
6. **Implémentation métier** — développer la logique, les queries, les actions et les composants uniquement quand la feature est prête à livrer.

---

## 4. Règles à respecter

- Ne pas supprimer un modèle Prisma non utilisé côté UI sans analyser les données existantes et l'impact sur les relations.
- Ne pas implémenter directement la logique métier d'une feature sans l'avoir d'abord déclarée dans `FEATURE_CATALOG`.
- Utiliser `AdminComingSoon` pour les modules préparés mais non encore implémentés (cf. `settings/orders`).
- Garder `defaultState: "inactive"` pour toute feature non prête à livrer.
- Un module peut être classé `optional` dans Prisma (activabilité technique) et `cross-cutting` dans la documentation (portée fonctionnelle). Ces deux axes sont orthogonaux et ne se contredisent pas — cf. `docs/architecture/10-fondations/11-modele-de-classification.md`.
- Ne pas créer de fichier Prisma vide comme placeholder. Si un domaine n'a pas encore de matérialisation DB réelle, sa place est dans `docs/domains/`.

---

## 5. Exemples concrets

### `commerce.documents`
```ts
{
  key: "commerce.documents",
  label: "Documents commerciaux",
  family: "satellite",
  module: "commerce",
  defaultState: "inactive",
  mutability: "toggleable",
  scopes: ["store"],
}
```
Schéma Prisma préparé. Feature cataloguée. Placeholder `settings/orders` en place via `AdminComingSoon`. UI non implémentée.

---

### `platform.notifications`
```ts
{
  key: "platform.notifications",
  label: "Notifications",
  family: "optional",
  module: "platform",
  defaultState: "inactive",
  mutability: "toggleable",
  scopes: ["store"],
}
```
Feature cataloguée. Pas de placeholder settings. UI non implémentée.

---

### `satellite.search`
```ts
{
  key: "satellite.search",
  label: "Recherche avancée",
  family: "satellite",
  module: "satellite",
  defaultState: "inactive",
  mutability: "toggleable",
  scopes: ["store"],
}
```
Feature cataloguée. Module satellite optionnel. Pas de placeholder settings. UI non implémentée.

---

## 6. Checklist avant d'ajouter une feature

- [ ] Vérifier si un modèle Prisma existant peut être réutilisé ou si un nouveau schéma est nécessaire
- [ ] Choisir la `family` correcte : `core`, `optional`, `satellite`, `cross_cutting`
- [ ] Choisir la `mutability` : `readonly`, `toggleable`, `level_selectable`
- [ ] Définir `defaultState: "inactive"` si la feature n'est pas prête à livrer
- [ ] Ajouter l'entrée dans `FEATURE_CATALOG` avant toute implémentation UI
- [ ] Vérifier que `settings/advanced` affiche bien la nouvelle entrée sans modification de route
- [ ] Créer une page `AdminComingSoon` si une section settings dédiée est prévue
- [ ] Ne développer la logique métier qu'une fois le catalogue et le schéma stabilisés
