# Cadrage — `engagement.newsletter` niveau `automation`

**Date :** 2026-06-16
**Statut :** cadrage court + lot borné exécuté

## Objectif

Donner un effet fonctionnel réel au niveau `automation` de
`engagement.newsletter`, sans ouvrir de campagnes ni de nouveau moteur
d'automation.

Le niveau doit gouverner explicitement le pont déjà existant entre :

- la souscription newsletter storefront ;
- le déclencheur `NEWSLETTER_SUBSCRIBED` ;
- la planification de jobs dans le domaine `automations`.

## Périmètre retenu

- la planification de jobs `NEWSLETTER_SUBSCRIBED` n'a lieu que si :
  - `engagement.newsletter` atteint le niveau `automation` ;
  - `engagement.automations` est actif ;
- `/admin/marketing/newsletter` expose une lecture locale de cet état
  opératoire ;
- aucun changement de moteur d'exécution ;
- aucune campagne ;
- aucun nouveau déclencheur.

## Ce qui change réellement

### Runtime storefront

- une inscription newsletter reste possible dès le niveau `basic` ;
- mais la création de jobs d'automation n'est plus implicite :
  elle dépend maintenant du niveau `automation` de la feature newsletter.

### Admin newsletter

- la page newsletter peut maintenant afficher :
  - si le pont vers `automations` est actif ;
  - combien d'automations `NEWSLETTER_SUBSCRIBED` sont actives ;
  - combien de jobs sont en attente ;
  - combien sont prêts à s'exécuter.

## Invariants

- une souscription newsletter reste valide sans automation ;
- aucun job n'est planifié si le niveau `automation` n'est pas atteint ;
- aucun job n'est planifié si le module `engagement.automations` est inactif ;
- le lot reste borné au déclencheur `NEWSLETTER_SUBSCRIBED`.

## Hors périmètre

- campagnes newsletter ;
- éditeur de templates ;
- nouveaux déclencheurs d'automation ;
- orchestration multi-domaines ;
- automation conditionnelle par segment.

## Vérifications attendues

- `pnpm run typecheck`
- vérification manuelle du panneau newsletter admin
- vérification qu'une inscription storefront renvoie encore `ok`
- vérification que `queuedAutomationJobs` reste à `0` hors niveau `automation`
