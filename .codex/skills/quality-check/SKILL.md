---
name: quality-check
description: Vérifier un lot Creatyss avant livraison avec une check-list courte, locale, orientée TypeScript strict, Docker et absence de régression hors périmètre.
---

# Quand utiliser ce skill

Utiliser ce skill à la fin d’un lot, avant de considérer l’implémentation comme livrable.

## Objectif

S’assurer que la proposition reste :

- dans le périmètre demandé
- cohérente avec TypeScript strict
- compatible avec le fonctionnement local via Docker
- lisible et maintenable
- sans dépendance inutile
- sans régression évidente hors périmètre

## Vérifications minimales

### Périmètre

- vérifier qu’aucune fonctionnalité non demandée n’a été ajoutée
- vérifier qu’aucune zone non concernée n’a été refactorée inutilement
- vérifier que le lot suit bien le document `docs/vX/*.md` ciblé

### Code

- vérifier l’absence de `any` non justifié
- vérifier la cohérence des types d’entrée et de sortie
- vérifier la séparation entre UI, métier, validation et données
- vérifier que la solution reste simple et lisible

### Base de données

Si le lot touche la base :

- vérifier la présence d’une migration SQL explicite
- vérifier la cohérence des contraintes ajoutées
- vérifier les impacts sur types, repositories et seeds

### Exécution locale

Proposer les commandes pertinentes selon le lot, par exemple :

- `make up`
- commande de test ciblée si disponible
- commande de typecheck si disponible
- commande liée à la migration ou au schéma si le projet en possède une

### Sortie attendue

Toujours finir par :

1. la liste des fichiers modifiés
2. les commandes de vérification
3. la vérification manuelle attendue
4. les points volontairement hors périmètre
