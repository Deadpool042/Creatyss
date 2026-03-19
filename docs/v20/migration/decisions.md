# Décisions structurantes V20

## Décision 1 — Garder le repository comme façade publique

### Décision

Le repository reste l'entrée publique du domaine.

### Pourquoi

Le code actuel et les consumers `app/` / `features/` sont déjà structurés autour de cette façade.

### Conséquence

La modularisation V20 est interne au domaine. Elle ne remplace pas le pattern repository.

## Décision 2 — Introduire `queries` uniquement comme détail interne

### Décision

Une couche `queries` pourra être introduite pour les gros domaines.

### Pourquoi

Les gros fichiers actuels contiennent trop de lecture Prisma pure et de `select` réutilisables.

### Conséquence

`queries` ne doit jamais devenir une nouvelle API publique pour les features.

## Décision 3 — Garder les transactions dans le repository

### Décision

Les transactions restent orchestrées au niveau repository.

### Pourquoi

Les transactions actuelles couvrent des flows métiers-techniques complets :

- checkout commande
- webhooks paiement
- mise à jour homepage
- synchronisations produit

### Conséquence

Les queries extraites peuvent accepter `tx`, mais ne doivent pas porter la stratégie transactionnelle.

## Décision 4 — Conserver `entities/` comme source des règles métier

### Décision

V20 ne déplace aucune règle métier vers `db/`.

### Pourquoi

Le code actuel s'appuie déjà sur `entities/` pour :

- transitions de statut de commande
- règles produit simple / produit avec déclinaisons
- offre simple

### Conséquence

Une extraction interne dans `db/` ne doit jamais être l'occasion de replanter une logique métier locale.

## Décision 5 — Découper les types seulement là où le gain est réel

### Décision

Le découpage `types/inputs.ts`, `outputs.ts`, `errors.ts`, `status.ts` est une cible de gros domaine, pas une obligation universelle.

### Pourquoi

Plusieurs domaines actuels restent petits et lisibles avec un seul `*.types.ts`.

### Conséquence

Le découpage V20 doit être proportionné à la taille réelle du domaine.

## Décision 6 — Préserver les règles techniques déjà normalisées

### Décision

Les règles introduites en V19 deviennent des invariants techniques :

- sélection d'image primaire produit
- `representativeImage` batchée
- absence de raw Prisma
- `onlyAvailable` en mémoire dans le catalogue

### Pourquoi

Ces règles sont déjà en production dans le code actuel.

### Conséquence

Toute extraction interne doit les conserver à l'identique.
