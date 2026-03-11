---
name: schema-migration
description: Faire évoluer le schéma PostgreSQL de Creatyss via une migration SQL explicite, sobre, compatible avec l’existant et alignée sur le lot demandé.
---

# Quand utiliser ce skill

Utiliser ce skill quand une tâche implique :

- ajout ou modification de colonnes
- ajout ou modification de contraintes
- ajout ou modification d’index
- ajout ou modification de tables
- compatibilité transitoire entre ancien et nouveau modèle
- adaptation des types TypeScript ou des repositories après évolution SQL

## Règles impératives

- Toute modification de schéma doit passer par une migration SQL explicite.
- Ne jamais modifier silencieusement le schéma existant sans migration.
- Ne jamais supprimer table, colonne, contrainte ou index sans demande explicite.
- Préserver la compatibilité avec l’existant tant qu’une refonte complète n’est pas demandée.
- Garder des noms de tables et colonnes cohérents et stables.
- Ajouter des contraintes sobres et explicites.
- Ajouter des index seulement s’ils sont clairement utiles.

## Style SQL attendu

- SQL lisible et simple.
- Pas de magie implicite.
- Types PostgreSQL explicites.
- Clés primaires explicites.
- Timestamps systématiques quand pertinent.
- Slugs uniques quand nécessaire.
- Relations propres.
- `CHECK` sobres si utiles au domaine.

## Compatibilité applicative

Après la migration, vérifier les impacts applicatifs minimaux :

- types TypeScript serveur
- repositories
- logique de lecture/écriture impactée
- validations serveur associées
- éventuels seeds impactés

Ne pas étendre la modification au-delà du lot demandé.

## Discipline de modification

- Créer une migration dédiée, avec un nom cohérent avec le lot.
- Limiter les changements collatéraux.
- Ne pas refactorer d’autres zones sans nécessité directe.
- Préserver les chemins existants pour les produits ou flux non concernés.

## Format de réponse attendu

Quand tu livres une évolution de schéma :

1. résume l’objectif de la migration
2. liste les fichiers créés ou modifiés
3. fournis la migration SQL
4. fournis les adaptations TypeScript ou repository nécessaires
5. indique les commandes de vérification
6. indique la vérification manuelle attendue
7. précise les limites de compatibilité ou points laissés hors périmètre
