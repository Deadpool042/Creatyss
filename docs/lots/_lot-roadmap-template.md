# Titre du lot

## Objectif

Décrire en une phrase ce que le lot doit accomplir.

---

## Périmètre

Décrire précisément ce qui est inclus.

Exemples :

- route ou zone exacte
- composants exacts
- services exacts
- schémas exacts

---

## Hors périmètre

Lister explicitement ce qui ne doit pas être touché.

---

## Source de vérité

Lister les documents et zones du repo à lire avant exécution.

- `AGENTS.md`
- doc architecture ciblée
- doc domaine ciblée
- zone code concernée

---

## Invariants

Lister ce qui doit rester vrai pendant et après le lot.

Exemples :

- aucun changement métier
- aucun changement Prisma
- aucun changement de contrat public
- aucune nouvelle dépendance

---

## Fichiers concernés

### À modifier

- `path/to/file`

### À lire seulement

- `path/to/file`

### Explicitement intouchables

- `path/to/file`

---

## Risques

Lister les risques réels du lot.

Pour chaque risque, préciser :

- cause
- impact
- mitigation

---

## Plan d'exécution

1. étape 1
2. étape 2
3. étape 3

---

## Vérifications

Lister les vérifications attendues à la fin du lot.

Exemples :

- `pnpm run typecheck`
- `pnpm run lint`
- tests ciblés
- vérification manuelle ciblée

Préciser aussi les vérifications non faites si elles sont hors périmètre ou bloquées.

---

## Critères de fin

Le lot est terminé uniquement si :

- critère 1
- critère 2
- critère 3

---

## Notes de livraison

Conserver cet espace pour :

- écarts assumés
- blocages
- décisions locales prises pendant le lot
