# Lot — TVA : validation production

## Statut

En attente — implémentation technique observée et validée (tests verts, typecheck propre). Bloqué sur la confirmation des taux par expert-comptable avant activation production.

## Objectif

Valider la conformité légale des taux TVA implémentés avant activation en production. Le moteur TVA est observé comme fonctionnel (L3, observé dans `2026-06-13-audit-catalogue-modules.md`) mais les taux n'ont pas été validés par un expert-comptable.

## Périmètre

- `entities/tax/` — logique pure de détermination territoire et ventilation TTC→HT/TVA (observé comme implémenté et testé)
- `features/commerce/taxation/` — résolution de taux et câblage checkout (observé comme implémenté)
- `prisma/seed/tax-rules.seed.ts` — taux seedés FR/DOM (observé comme implémenté)
- `docs/domains/optional/commerce/taxation.md` — fiche doctrine à mettre à jour après validation externe
- Validation externe : transmission des taux actuels à un expert-comptable pour confirmation

## Hors périmètre

- OSS UE (régime de TVA pour les ventes intracommunautaires)
- E-reporting PPF (facturation électronique B2B obligatoire, délai légal à confirmer)
- Facturation électronique B2B
- Taux réduits par ciblage catégorie produit (peut suivre si besoin validé)

## Dépendances

- Validation par un expert-comptable (prérequis externe, non technique)
- Confirmation de la décision d'assiette TTC documentée dans `docs/lots/2026-06-14-etat-des-lieux-session.md` section 6

## Invariants

- Ne pas activer `commerce.taxation` en production sans confirmation externe des taux
- Les tests unitaires existants dans `tests/unit/entities/tax/` ne doivent pas être modifiés sans raison explicite
- L'assiette TTC des prix (pricing stocke TTC, taxation dérive HT/TVA) est une décision tranchée — ne pas inverser sans cadrage `architect-review`

## Risques

- Obligation légale : facturer avec un mauvais taux TVA expose à un redressement fiscal
- Le taux DOM (Guyane/Mayotte exonérés) est une spécificité française — à faire vérifier explicitement
- La décision d'assiette TTC diverge de la prose historique "prix HT" dans certains documents — potentielle confusion si non clarifiée

## Vérifications

- `pnpm run typecheck`
- `pnpm run test` — vérifier que les tests unitaires `entities/tax/` restent verts après toute modification
- Revue humaine des taux seedés par rapport à la confirmation expert-comptable

## Critères de fin

- Un expert-comptable a confirmé par écrit les taux TVA métropole et DOM tels qu'ils sont seedés
- La fiche `docs/domains/optional/commerce/taxation.md` est mise à jour avec la date de validation et le résultat
- `commerce.taxation` peut être activé en production sans réserve légale

## Agent recommandé

`docs-keeper` pour la mise à jour de la doctrine après validation externe. Aucune implémentation technique attendue dans ce lot — c'est une démarche de validation externe.
