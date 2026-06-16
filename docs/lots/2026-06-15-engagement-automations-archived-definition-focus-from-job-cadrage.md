<!-- docs/lots/2026-06-15-engagement-automations-archived-definition-focus-from-job-cadrage.md -->

# Cadrage — `engagement.automations` focus local d'une définition archivée depuis un job

## Objectif

Permettre, depuis un job archivé visible dans
`/admin/marketing/automations`, de revenir directement à l'automation archivée
liée sans quitter la page.

## Périmètre

- lien local depuis une ligne de job archivé vers la sous-section
  `Automations archivées` ;
- conservation des autres filtres utiles déjà actifs ;
- indication visuelle quand le focus définition correspondant est déjà actif.

## Hors périmètre

- nouvelle vue détaillée des jobs archivés ;
- route dédiée par automation archivée ;
- modification des actions de restauration ;
- fusion entre liste des définitions et liste des jobs.

## Invariants

- la route canonique reste `/admin/marketing/automations` ;
- la navigation reste strictement locale à la même page ;
- la distinction entre définition et exécution reste lisible ;
- aucun cockpit transverse `jobs` n'est introduit.

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`

## Critères de fin

- un job archivé peut ouvrir sa définition archivée liée ;
- le focus correspondant reste visible dans `Automations archivées` ;
- les filtres déjà actifs de la page restent conservés.

## Statut — déjà implémenté

Tous les critères de fin sont déjà satisfaits par le code existant, vérifié le
2026-06-15 :

- `ArchivedAutomationJobRow` (`admin-archived-automation-jobs-list.tsx`)
  affiche le code de l'automation comme `Link` vers
  `buildAutomationsPageHref({ archivedAutomationId: job.automationId,
  hash: "archived-automations" })` quand `job.automationId !== null`.
- `isArchivedAutomationFocused` souligne le code et le rend non cliquable
  visuellement (`underline`) quand le focus correspondant est déjà actif.
- `buildAutomationsPageHref` propage `selectedAutomationId`,
  `selectedJobStatus`, `selectedDefinitionFilter`,
  `selectedArchivedJobStatus` et `selectedArchivedDefinitionFilter`, donc les
  filtres actifs de la page sont conservés.

Aucun code à écrire pour ce lot.
