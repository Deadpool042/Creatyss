<!-- docs/lots/2026-06-15-engagement-automations-restore-archived-cadrage.md -->

# Cadrage — `engagement.automations` restauration locale des définitions archivées

## Objectif

Permettre, depuis `/admin/marketing/automations`, de relire les définitions
archivées et d'en restaurer une sans ouvrir de route secondaire ni perdre la
logique canonique actuelle du cockpit.

## Périmètre

- lecture locale des `Automation` archivées ;
- restauration d'une définition archivée depuis la même page ;
- restauration batch des définitions archivées déjà visibles ;
- confirmation opératoire avant restauration simple ou batch ;
- retour de la définition restaurée en `INACTIVE` ;
- gestion locale d'un conflit de code si le code d'origine a été réutilisé.

## Hors périmètre

- nouvelle route "corbeille" dédiée ;
- suppression physique d'une définition ;
- restauration d'un job archivé ;
- refonte du cockpit `jobs`.

## Invariants

- la route canonique reste `/admin/marketing/automations` ;
- une restauration ne doit pas casser l'unicité `(storeId, code)` ;
- une définition restaurée revient en `INACTIVE` ;
- aucun worker transverse, aucun run model, aucun nouveau contrat public.

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`

## Critères de fin

- les définitions archivées sont visibles localement dans le cockpit ;
- un opérateur peut restaurer une définition archivée ;
- un opérateur peut aussi restaurer en lot les définitions archivées visibles ;
- si le code initial a été repris, la restauration garde un code de repli lisible ;
- la navigation et les liens canoniques existants restent inchangés.

## Statut — déjà implémenté

Tous les critères de fin sont déjà satisfaits par le code existant, vérifié le
2026-06-15 :

- `AdminArchivedAutomationsSection` + `AdminArchivedAutomationsList` affichent
  les définitions archivées dans `/admin/marketing/automations#archives`.
- `restoreAutomationAction` → `restoreAutomationDefinition` restaure une
  définition (bouton "Restaurer" par ligne), `restoreAutomationsBatchAction`
  restaure en lot les définitions visibles.
- `restoreAutomationDefinition` (`features/automations/services/`) repasse la
  définition en `INACTIVE`, vérifie l'unicité `(storeId, code)` sur les
  automations actives et applique `buildRestoredAutomationCode` (suffixe
  `__restored__<id6>` lisible) en cas de conflit ; `usedFallbackCode` est
  remonté à l'UI ("Code libéré pour recréation", message de restauration).
- Route canonique et ancres (`#archives`, `#archived-automations`) inchangées.

Aucun code à écrire pour ce lot.
