# Admin UI Creatyss

Utiliser ce skill pour toute intervention sur l'administration.

## Objectif

Construire une interface admin :

- simple
- rapide
- cohérente
- maintenable
- adaptée à une administratrice non technique

## Priorités

- compréhension immédiate
- faible friction
- responsive robuste
- cohérence visuelle
- réutilisation des composants existants

## Règles

Toujours :

- partir des composants existants
- respecter les patterns déjà présents
- utiliser les tokens du projet
- privilégier les composants partagés
- conserver les comportements existants

Ne jamais :

- introduire de logique métier dans l'UI
- créer un système parallèle
- dupliquer un composant existant
- refondre une feature hors périmètre
- ajouter de la complexité visuelle sans besoin réel

## Mobile

Vérifier systématiquement :

- scroll
- safe areas
- sticky headers
- sticky actions
- split view
- orientation paysage

## Validation UI

Quand Playwright MCP est disponible :

- vérifier desktop
- vérifier mobile
- vérifier orientation paysage
- vérifier safe areas
- vérifier split view
- vérifier sticky headers
- vérifier sticky actions
- vérifier les débordements horizontaux

Ne pas conclure à la qualité responsive sans observation Playwright.

## Restitution

Toujours préciser :

- composants modifiés
- impacts UX
- impacts responsive
- vérifications réalisées
- vérifications non réalisées
