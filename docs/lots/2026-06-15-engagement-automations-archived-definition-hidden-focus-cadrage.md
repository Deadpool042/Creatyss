<!-- docs/lots/2026-06-15-engagement-automations-archived-definition-hidden-focus-cadrage.md -->

# Cadrage — `engagement.automations` focus définition archivée masqué par filtre

## Objectif

Éviter, dans `Automations archivées`, qu'un focus local sur une définition
archivée semble incohérent quand un filtre d'archives masque justement cette
ligne.

## Périmètre

- détection locale d'un focus définition actif mais non visible dans la liste ;
- message explicite dans la section concernée ;
- raccourci local pour retirer le filtre d'archives masquant la ligne.

## Hors périmètre

- refonte du modèle de filtres ;
- changement de la navigation croisée existante ;
- suppression automatique du filtre ;
- nouvelle route ou nouvel état global.

## Invariants

- la route canonique reste `/admin/marketing/automations` ;
- le focus archivage reste local à la même page ;
- le retrait du filtre reste explicite et actionné par l'opérateur ;
- les autres filtres utiles restent conservés.

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`

## Critères de fin

- si le focus définition archivée est masqué par le filtre d'archives courant,
  la section l'explicite localement ;
- l'opérateur peut retirer ce filtre masquant sans perdre le focus définition ;
- la disparition de la ligne ciblée ne reste plus silencieuse.

## Statut — déjà implémenté

Tous les critères de fin sont déjà satisfaits par le code existant, vérifié le
2026-06-15 :

- `page.tsx` calcule `isSelectedArchivedAutomationVisible` (l'automation
  focalisée appartient-elle à `filteredArchivedAutomations` ?).
- `AdminArchivedAutomationsSection` affiche, quand
  `normalizedSelectedArchivedAutomation && selectedArchivedDefinitionLabel &&
  !isSelectedArchivedAutomationVisible`, un message « Le focus courant est
  masqué par le filtre `<label>`. » avec un lien « Retirer filtre
  automations archivées ».
- Ce lien pointe vers `buildAutomationsPageHref({ ...,
  archivedAutomationId: normalizedSelectedArchivedAutomation.id,
  archivedStatus: selectedArchivedJobStatus, hash: "archived-automations" })`
  (sans `archivedDefinition`), donc retire uniquement le filtre masquant en
  conservant le focus.

Aucun code à écrire pour ce lot.
