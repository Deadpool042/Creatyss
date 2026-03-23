# Domaine `ai-assistance`

## Objectif

Ce document décrit le domaine `ai-assistance` dans la doctrine courante du socle.

Il porte les aides IA optionnelles du socle.

---

## Position dans la doctrine de modularité

Le domaine `ai-assistance` est classé comme :

- `domaine optionnel toggleable`

### Capabilities activables liées

- `aiAssistance`
- `aiContentHelp`
- `aiClassification`
- `aiAutomation`
- `aiSuggestions`
- `aiGovernance`

---

## Rôle

Le domaine `ai-assistance` porte la vérité interne des aides IA activées par le socle.

Il constitue la source de vérité pour :

- les demandes IA internes ;
- leurs résultats normalisés ;
- leur statut ;
- leur rattachement métier ;
- leur gouvernance locale.

Il reste distinct de :

- `blog`
- `products`
- `integrations`
- `analytics`

Le domaine ne doit pas devenir un fourre-tout “IA partout”.
Il doit rester un domaine d’assistance et d’automatisation contrôlée.

---

## Objets métier principaux

- `AiTask`
- `AiTaskStatus`
- `AiSuggestion`
- `AiClassificationResult`
- `AiAutomationRun`
- `AiGovernancePolicy`

---

## Invariants métier

- une aide IA reste rattachée à une source métier explicite ;
- un résultat IA n’est pas une vérité coeur par défaut ;
- un workflow IA sensible exige validation ou gouvernance explicite selon le niveau ;
- les providers IA externes restent dans `integrations`.

---

## Lifecycle et gouvernance des données

### États principaux

- `PENDING`
- `RUNNING`
- `SUCCEEDED`
- `FAILED`
- `REJECTED`
- `ACCEPTED` si une validation humaine existe

### Règles principales

- les résultats IA sensibles restent traçables ;
- la validation humaine est explicite quand la policy l’exige ;
- la suppression implicite de traces importantes est évitée.

---

## Transactions / cohérence / concurrence

### Ce qui doit être atomique

- création d’une tâche IA ;
- changement d’état local ;
- acceptation / rejet d’un résultat si le flux le prévoit ;
- écriture des événements `ai.*`.

### Ce qui peut être eventual consistency

- appel provider IA ;
- génération de contenu ;
- enrichissements ;
- notifications ;
- analytics.

### Idempotence

- `create-ai-task` : `(sourceRef, taskKind, taskIntentId)`
- `apply-ai-result` : `(aiTaskId, providerResultRef)`
- `accept-ai-suggestion` : `(aiSuggestionId, acceptIntentId)`

---

## Impact maintenance / exploitation

### Niveau de maintenance minimal recommandé

- `M2` pour aide rédactionnelle simple ;
- `M3` pour classification ou suggestions plus structurées ;
- `M4` pour automatisation IA sur flux sensibles.

### Impact coût / complexité

Le coût monte principalement avec :

- `aiContentHelp`
- `aiClassification`
- `aiAutomation`
- `aiSuggestions`
- `aiGovernance`

Lecture relative :

- niveau 1 : `C1`
- niveau 2 : `C2`
- niveau 3 : `C3`
- niveau 4 : `C4`

---

## Décisions d’architecture

- `ai-assistance` est un domaine optionnel toggleable ;
- les providers IA externes restent dans `integrations` ;
- l’IA n’est pas une vérité coeur par défaut ;
- la montée en sophistication se fait par niveaux ;
- les flux sensibles exigent gouvernance, audit et observability renforcés.
