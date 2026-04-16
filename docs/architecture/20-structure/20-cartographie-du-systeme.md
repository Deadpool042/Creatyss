# Cartographie du système

## Objectif

Ce document présente la carte de haut niveau du système.

Il ne remplace pas les fiches de domaine.
Il sert à rendre visibles les grands blocs architecturaux et leurs relations de principe.

---

## Vue logique

Le système est structuré autour de quatre ensembles :

1. les domaines coeur ;
2. les capacités optionnelles ;
3. les systèmes externes et satellites ;
4. les préoccupations transverses.

---

## Lecture architecturale de Creatyss

À l’état actuel de la doctrine, Creatyss s’organise autour des blocs suivants :

### Domaines coeur explicitement stabilisés

- coeur métier : `products`, `orders`, `customers`, `pricing`, `availability` ;
- coeur structurel : `auth`, `users`, `roles`, `permissions`.

### Préoccupations transverses explicitement structurantes

- audit ;
- observabilité ;
- jobs ;
- backbone événementiel ;
- intégrations structurantes.

### Capacités optionnelles

Les capacités optionnelles doivent enrichir le produit sans redéfinir le coeur.
Leur liste canonique doit être maintenue dans `docs/domains/optional/` et reflétée ici lorsqu’elle est stabilisée.

### Systèmes externes et satellites

Les fournisseurs et systèmes tiers restent hors du coeur.
Ils doivent être traités comme dépendances externes encapsulées.

---

## Carte de principe

```text
                           +----------------------------------+
                           |  Systèmes externes / satellites  |
                           |  paiements, email, ERP, etc.     |
                           +----------------+-----------------+
                                            |
                                            | adaptateurs / intégrations
                                            v
+--------------------------------------------------------------------------+
|                               Coeur interne                               |
|                                                                          |
|   +------------------+      +------------------+      +--------------+   |
|   |   Products       |<---->|    Orders        |<---->|  Customers   |   |
|   +------------------+      +------------------+      +--------------+   |
|            ^                          ^                       ^           |
|            |                          |                       |           |
|   +------------------+      +------------------+      +--------------+   |
|   |    Pricing       |<---->|   Availability   |      | Auth/Users/  |   |
|   +------------------+      +------------------+      | Roles/Perms  |   |
|                                                       +--------------+   |
|                                                                          |
|          +----------- capacités optionnelles ----------------------------+
|                                                                          |
+--------------------------------------------------------------------------+

+--------------------------------------------------------------------------+
|                    Préoccupations transverses structurantes              |
|         audit · observabilité · jobs · événements · politiques globales  |
+--------------------------------------------------------------------------+
```

---

## Règles de lecture

### Domaines coeur

Les domaines coeur portent la vérité métier indispensable.

### Capacités optionnelles

Les capacités optionnelles s’ancrent sur le coeur sans le redéfinir.

### Systèmes externes

Les systèmes externes fournissent des services ou des échanges, sans imposer leur modèle au coeur.

### Préoccupations transverses

Les préoccupations transverses traversent plusieurs blocs et doivent être gouvernées explicitement.

---

## Limites de cette cartographie

Cette cartographie :

- donne une vue de structure ;
- ne détaille pas les invariants ;
- ne remplace pas les fiches domaine ;
- ne remplace pas les règles d’exécution ;
- ne remplace pas les règles d’exploitation.

Pour les règles détaillées, lire :

- `../10-fondations/*`
- `../30-execution/*`
- `../40-exploitation/*`

---

## Documents liés

- `21-domaines-coeur.md`
- `22-capacites-optionnelles.md`
- `23-systemes-externes-et-satellites.md`
- `24-preoccupations-transverses.md`
