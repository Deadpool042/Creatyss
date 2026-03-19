# V8-5 — Retrait Contrôlé du CSS Legacy

## Objectif

Retirer des fichiers CSS les règles devenues orphelines après les migrations V8-2, V8-3 et V8-4. Ce lot ne crée pas de nouvelle interface — il clôture proprement ce que les autres lots ont rendu possible.

## Prérequis

**Obligatoires — ce lot ne démarre pas avant :**

- V8-2 terminé : shell migré, `.admin-shell` et `.admin-nav` sans usage
- V8-3 terminé : composants cards migrés, `.admin-chip`, `.store-card`, `.empty-state` sans usage
- V8-4 terminé : pages haute visibilité migrées, `.admin-input`, `.admin-homepage-*` sans usage

## Périmètre strict

**In scope :**

- Retrait des règles CSS dont les sélecteurs ne sont plus utilisés dans `app/` et `components/`
- Retrait par bloc logique (classe + variantes, hover, media queries associées)

**Out of scope :**

- Variables CSS globales (`--brand`, `--sidebar-*`, `--background`, etc.) — à conserver
- Styles de reset, typographie de base, utilitaires partagés
- CSS côté front public non concerné par les migrations admin
- Toute règle dont l'usage n'a pas été confirmé comme absent

## Principe directeur

**On ne supprime que ce qui est vérifié absent.** La dette CSS passive (une règle présente mais inutilisée) est préférable à une régression visuelle causée par une suppression prématurée.

## Les trois stades de migration

Ce lot opère sur des composants déjà en stade 2 (désactivé) :

| Stade                 | État                                                         |
| --------------------- | ------------------------------------------------------------ |
| **1 — Coexistence**   | Classe legacy utilisée dans les composants ET définie en CSS |
| **2 — Désactivation** | Classe legacy absente des composants, encore définie en CSS  |
| **3 — Suppression**   | Classe retirée du CSS — ce que V8-5 fait                     |

V8-5 fait passer de 2 à 3 uniquement pour les classes vérifiées orphelines.

## Classes candidates à la suppression

Ces classes ont été identifiées lors des migrations précédentes. Leur orphelinité doit être confirmée par grep avant toute suppression.

| Classe                                       | Dépend de |
| -------------------------------------------- | --------- |
| `.admin-chip`                                | V8-3      |
| `.admin-product-card`, `.admin-product-tags` | V8-3      |
| `.admin-order-card`                          | V8-3      |
| `.store-card`                                | V8-3      |
| `.empty-state`                               | V8-3      |
| `.admin-shell`                               | V8-2      |
| `.admin-nav`                                 | V8-2      |
| `.admin-input`                               | V8-4      |
| `.admin-homepage-*`                          | V8-4      |

Cette liste n'est pas exhaustive. Un inventaire final par grep précède chaque suppression.

## Protocole de suppression

Pour chaque classe candidate :

**Étape 1 — Confirmer l'absence d'usage**

```bash
# Remplacer <classe> par le nom réel
grep -r "<classe>" app/ components/ --include="*.tsx" --include="*.ts" --include="*.css"
```

Si le grep retourne une occurrence dans `app/` ou `components/` : **ne pas supprimer**. La migration correspondante n'est pas complète.

**Étape 2 — Identifier le bloc CSS complet**

Localiser dans les fichiers CSS la règle principale et toutes ses satellites (`:hover`, `:focus`, `::before`, media queries, nesting, variantes de modificateurs). Supprimer le bloc entier, pas seulement la règle de base.

**Étape 3 — Supprimer et vérifier**

Après suppression :

```bash
pnpm run typecheck
```

Vérifier visuellement les pages qui utilisaient les composants migrés : le rendu doit être identique après suppression (la classe ne devait plus rien faire de visible).

## Inventaire final préalable

Avant de commencer, identifier les fichiers CSS à auditer :

```bash
find styles/ -name "*.css" | sort
ls app/ -la | grep ".css"
```

Les fichiers CSS globaux ou partagés doivent être traités avec précaution : une classe peut être utilisée dans un contexte non admin (front public). Le grep doit couvrir `app/` entier, pas seulement `app/admin/`.

## Résultat attendu

- Les classes listées ci-dessus sont retirées des fichiers CSS si confirmées orphelines
- Les fichiers CSS ne contiennent plus de règles sans usage actif dans `app/` et `components/`
- Aucune régression visuelle sur les pages admin ou publiques
- La cible finale n'est pas un CSS vide — les styles globaux légitimes (reset, variables, typographie) restent

## Vérifications de fin de lot

```bash
# Confirmer l'absence des classes dans les fichiers de style
grep -n "admin-chip\|store-card\|empty-state\|admin-shell\|admin-nav\|admin-input" styles/

# Confirmer qu'aucune valeur de marque en dur ne subsiste
grep -r "#8f5d2d" app/ components/ styles/

# Typecheck
pnpm run typecheck

# E2E
pnpm exec playwright test --grep "admin"
```

## Fichiers attendus modifiés

- Fichiers dans `styles/` contenant les règles orphelines (à confirmer par grep initial)
- Aucun fichier `app/` ou `components/` modifié dans ce lot
