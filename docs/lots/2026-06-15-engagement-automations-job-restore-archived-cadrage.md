<!-- docs/lots/2026-06-15-engagement-automations-job-restore-archived-cadrage.md -->

# Cadrage — `engagement.automations` restauration locale des jobs archivés

## Objectif

Permettre, depuis `/admin/marketing/automations`, de relire les jobs archivés
et d'en restaurer un sans ouvrir de cockpit transverse `jobs`.

## Périmètre

- lecture locale des jobs d'automation archivés ;
- restauration d'un job archivé depuis la même page ;
- restauration batch des jobs archivés déjà visibles ;
- confirmation opératoire avant restauration simple ou batch ;
- retour en `PENDING` pour un job supprimé alors qu'il était encore en attente,
  seulement si son automation liée reste `ACTIVE` ;
- simple réaffichage sinon, sans réarmement implicite.

## Hors périmètre

- nouvelle route dédiée aux archives jobs ;
- restauration batch ;
- édition du payload métier d'un job archivé ;
- worker transverse générique.

## Invariants

- la route canonique reste `/admin/marketing/automations` ;
- un job archivé ne doit pas être réarmé silencieusement si son automation liée
  n'est plus active ;
- la restauration reste bornée au type
  `AUTOMATION_NEWSLETTER_SUBSCRIBED` déjà ouvert ;
- aucun cockpit transverse `jobs` n'est introduit.

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`

## Critères de fin

- les jobs archivés sont visibles localement dans le cockpit ;
- un opérateur peut restaurer un job archivé ;
- un opérateur peut aussi restaurer en lot les jobs archivés visibles ;
- un ancien `PENDING` supprimé revient en attente seulement si sa définition le
  permet encore ;
- les liens et filtres canoniques existants restent inchangés.
