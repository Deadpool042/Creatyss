# Cadrage — `engagement.automations` filtre local des jobs par statut

## Objectif

Permettre à un opérateur de focaliser la section jobs locale sur un statut
précis (`PENDING`, `RUNNING`, `FAILED`, `SUCCEEDED`, `CANCELLED`) sans quitter
`/admin/marketing/automations`.

## Périmètre

- ajouter un filtre local par statut sur la section jobs ;
- permettre la combinaison avec le focus par définition déjà présent ;
- garder le retour à la vue globale dans la même page.

## Hors périmètre

- recherche libre ;
- filtres multicritères avancés ;
- vue transverse de file ;
- nouvelle route dédiée.

## Invariants

- le filtre reste local au cockpit `automations` ;
- la lecture reste bornée au flux `NEWSLETTER_SUBSCRIBED` déjà ouvert ;
- aucune route canonique hors module n'est modifiée ;
- aucun nouveau contrôle runtime n'est ajouté dans ce lot.

## Risques

- confusion entre état de vue local et vérité exhaustive de la file globale ;
- surcharge visuelle si les filtres deviennent trop nombreux.

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`

## Critères de fin

- la section jobs peut être filtrée localement par statut ;
- l'opérateur voit clairement quel statut est actif ;
- la combinaison avec le focus automation reste exploitable dans la même page.
