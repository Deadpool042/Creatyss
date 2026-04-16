---
name: creatyss-implementation
description: Discipline d’implémentation, garde-fous d’exécution et format de livraison pour les changements sur Creatyss.
---

`AGENTS.md` est la doctrine canonique du dépôt.
Ce skill ne la recopie pas.
Il définit uniquement la discipline d’implémentation et le format de sortie attendu quand une modification est proposée.

## Règle d’exécution

Quand tu implémentes sur Creatyss, tu dois produire une réponse exploitable, locale, bornée et cohérente avec le dépôt réel.

Tu dois toujours :

- rester strictement dans le périmètre demandé ;
- procéder par petits incréments sûrs ;
- limiter les changements au strict nécessaire ;
- préférer la solution la plus simple qui satisfait correctement le besoin ;
- préserver la lisibilité générale du repo ;
- nommer clairement fichiers, fonctions, types et responsabilités ;
- signaler toute hypothèse importante au lieu de l’introduire silencieusement.

## Ce que tu ne dois jamais faire

Ne jamais :

- sur-architecturer ;
- ajouter une couche ou une abstraction sans besoin réel ;
- introduire une dépendance sans justification claire ;
- mélanger logique métier et présentation ;
- élargir discrètement le périmètre ;
- modifier silencieusement une convention structurante du dépôt ;
- présenter une implémentation générique comme si elle était alignée sur le repo.

## Discipline de qualité

Le code proposé doit être :

- typé strictement ;
- lisible ;
- explicite ;
- prévisible ;
- modulaire ;
- cohérent avec le dépôt ;
- compatible avec le runtime local Docker.

Toujours :

- typer les entrées et sorties ;
- valider côté serveur quand nécessaire ;
- gérer les erreurs de façon claire ;
- éviter la magie ;
- éviter les abstractions prématurées ;
- éviter la duplication inutile ;
- préférer une extraction locale simple à une refonte publique.

## Garde-fous Next.js

Pour une implémentation Next.js :

- Server Components par défaut ;
- Client Components seulement si nécessaire ;
- Server Actions seulement quand elles simplifient réellement le flux ;
- Route Handlers pour les besoins API ;
- pas de logique métier directement dans les composants UI ;
- pas d’accès DB direct depuis la présentation.

## Garde-fous persistance

Si la tâche touche la persistance :

- rester cohérent avec PostgreSQL et Prisma ;
- préserver des noms clairs et stables ;
- garder des relations propres ;
- garder des contraintes cohérentes ;
- éviter les colonnes ambiguës ;
- ne pas supprimer silencieusement tables, colonnes, index ou contraintes ;
- signaler explicitement tout impact DB.

## Garde-fous sécurité

Toujours :

- ne jamais faire confiance aux entrées utilisateur ;
- valider côté serveur ;
- ne jamais exposer un secret côté client ;
- éviter toute crédential hardcodée ;
- limiter les permissions au strict nécessaire ;
- préserver une posture compatible avec un déploiement VPS classique.

## Compatibilité locale

Toute proposition doit rester compatible avec un usage local simple via Docker Compose.

Quand c’est pertinent, expliciter :

- l’impact sur les variables d’environnement ;
- l’impact Docker ;
- l’impact DB ;
- les validations locales à exécuter ;
- les vérifications manuelles utiles.

## Format de livraison attendu

Quand tu proposes une implémentation, terminer systématiquement par :

1. Fichiers créés ou modifiés
2. Variables d’environnement nécessaires
3. Commandes de validation/test
4. Vérification manuelle à effectuer

## Choix non évidents

Quand un choix technique n’est pas trivial :

- expliquer brièvement le choix retenu ;
- indiquer pourquoi une option plus lourde n’est pas nécessaire ;
- relier ce choix aux contraintes du dépôt si pertinent.

## Gestion des hypothèses

Si une information manque :

- ne pas l’inventer silencieusement ;
- choisir l’option la plus simple et la plus robuste pour une V1 ;
- signaler clairement qu’il s’agit d’une hypothèse ;
- éviter de faire dériver le projet à partir de cette hypothèse.

## Critère final

Une bonne implémentation sur Creatyss doit être :

- fidèle au dépôt ;
- strictement dans le périmètre ;
- simple ;
- robuste ;
- lisible ;
- maintenable ;
- compatible avec le mode local Docker ;
- exploitable immédiatement.
