# Cadrage — `engagement.automations` visibilité locale de la trace email

## Objectif

Afficher dans `/admin/marketing/automations` la trace email déjà produite par
l'exécution bornée des jobs d'automation, sans ouvrir un cockpit transverse
`email_messages`.

## Périmètre

- relier un job d'automation à son `EmailMessage` via
  `subjectType = "automation_job"` et `subjectId = job.id` ;
- exposer localement les informations minimales utiles à l'opérateur :
  destinataire, statut email, provider, référence provider, erreur ;
- garder cette lecture dans la page existante
  `/admin/marketing/automations`.

## Hors périmètre

- page dédiée `EmailMessage` ;
- relance manuelle d'un email ;
- aperçu du body HTML/TXT ;
- filtres transverses email ;
- nouvelle mutation métier côté `email`.

## Invariants

- la vue reste locale au domaine `automations` ;
- `email` reste propriétaire du message et de son cycle interne ;
- aucune mutation `EmailMessage` n'est ajoutée dans ce lot ;
- aucun changement de route canonique admin n'est introduit.

## Risques

- plusieurs `EmailMessage` pour un même job : la lecture doit rester stable et
  prendre une trace cohérente ;
- confusion entre statut du job et statut de l'email : la UI doit les garder
  distincts.

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`

## Critères de fin

- un opérateur voit depuis `/admin/marketing/automations` si un job a produit
  un email ;
- la page affiche une trace minimale exploitable sans changer de module ;
- aucune surface transverse supplémentaire n'est ouverte.
