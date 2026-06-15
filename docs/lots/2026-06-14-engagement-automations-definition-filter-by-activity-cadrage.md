# Cadrage — `engagement.automations` filtre local des définitions par activité

## Objectif

Permettre à un opérateur de restreindre localement la liste des définitions
`Automation` selon l'activité jobs déjà visible dans le même cockpit.

## Périmètre

- ajouter un filtre local sur la liste des définitions ;
- proposer des vues bornées : avec jobs, avec attente, avec exécutions en
  cours, avec échecs, sans job ;
- préserver les filtres jobs existants sur la même page.

## Hors périmètre

- nouvelle route dédiée ;
- recherche libre ;
- filtres multicritères globaux ;
- vue transverse de file.

## Invariants

- le filtre reste borné à `/admin/marketing/automations` ;
- la section jobs garde sa logique propre ;
- aucune route canonique hors module n'est modifiée ;
- aucun worker global ni run model n'est ajouté.

## Risques

- confusion entre filtre local de définitions et vérité exhaustive des jobs ;
- état de vue plus dense si trop de combinaisons locales sont actives.

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`

## Critères de fin

- l'opérateur peut filtrer la liste des définitions par activité jobs ;
- un état vide explicite existe quand aucun résultat ne correspond ;
- les liens vers la section jobs conservent ce contexte local sans changer de
  page.
