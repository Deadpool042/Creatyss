---
name: creatyss-implementation
description: Discipline d’implémentation, format de livraison, critères de qualité et garde-fous de production pour Creatyss.
---

Quand tu proposes une implémentation sur Creatyss, tu dois produire une réponse exploitable, concrète, disciplinée, strictement alignée sur le dépôt, et compatible avec une base réelle.

## Règles de mise en œuvre

Tu dois toujours :

- rester strictement dans le périmètre demandé ;
- procéder par petits incréments sûrs ;
- limiter les changements au strict nécessaire ;
- préférer une solution simple si elle satisfait correctement le besoin ;
- produire du code réel quand le code est attendu ;
- éviter les réponses vagues, abstraites ou uniquement conceptuelles si l’utilisateur attend une implémentation ;
- respecter les contraintes des documents du dépôt ;
- préserver la lisibilité générale du projet ;
- nommer clairement les fichiers, fonctions, types et responsabilités.

Tu ne dois jamais :

- sur-architecturer ;
- ajouter des couches inutiles ;
- introduire une dépendance sans nécessité claire ;
- mélanger logique métier et présentation ;
- cacher une hypothèse importante ;
- diluer le besoin dans une réponse trop large ;
- traiter comme “petite amélioration” un changement qui modifie fortement l’architecture ou le domaine ;
- modifier silencieusement une convention structurante du projet.

## Discipline de qualité

Le code proposé doit être :

- typé strictement ;
- lisible ;
- explicite ;
- prévisible ;
- modulaire ;
- cohérent avec le dépôt ;
- cohérent avec le runtime local Docker ;
- cohérent avec PostgreSQL et Prisma si la persistance est concernée.

Toujours :

- typer les entrées et sorties ;
- valider les payloads côté serveur quand c’est nécessaire ;
- gérer les erreurs de façon claire et prévisible ;
- éviter la magie ;
- éviter les abstractions prématurées ;
- éviter les gros fichiers si une découpe simple améliore la lisibilité ;
- éviter la duplication inutile ;
- préférer des fonctions pures quand c’est pertinent ;
- utiliser des noms précis ;
- commenter seulement si cela apporte une vraie clarification.

## Contraintes Next.js

Respecter les règles suivantes :

- Server Components par défaut ;
- Client Components uniquement si nécessaire ;
- Server Actions seulement quand elles ont un vrai sens ;
- Route Handlers pour les besoins API ;
- pas de logique métier directement dans les composants UI ;
- pas d’accès DB direct depuis la présentation ;
- pas de confusion entre logique serveur et composants visuels.

## Contraintes base de données

Si la tâche touche la persistance :

- PostgreSQL uniquement ;
- cohérence avec Prisma ;
- clés primaires explicites ;
- timestamps systématiques ;
- slugs uniques quand nécessaire ;
- relations propres ;
- index si pertinent ;
- noms de tables et colonnes cohérents et stables ;
- éviter les colonnes ambiguës ;
- éviter les relations inutiles ;
- ne pas mélanger les invariants métier complexes avec des décisions de persistance mal placées.

## Contraintes sécurité

Toujours :

- ne jamais faire confiance aux entrées utilisateur ;
- valider côté serveur ;
- protéger l’admin si la tâche est concernée ;
- ne jamais exposer de secret côté client ;
- limiter les permissions ;
- éviter toute crédential hardcodée ;
- conserver une posture compatible avec un déploiement VPS classique.

## Contraintes locales et livraison

Le projet doit rester exploitable localement avec Docker Compose.
Toute proposition doit rester compatible avec un lancement local simple.

Quand c’est pertinent, tu dois expliciter :

- les variables d’environnement nécessaires ;
- l’impact Docker ;
- l’impact DB ;
- les validations locales ;
- les points de vérification manuelle.

## Protocole de réponse attendu

Quand tu proposes une implémentation, tu dois structurer ta sortie pour qu’elle soit directement exploitable.

À la fin de chaque proposition, fournir systématiquement :

1. Fichiers créés ou modifiés
2. Variables d’environnement nécessaires
3. Commandes de validation/test
4. Vérification manuelle à effectuer

Quand la tâche implique un choix non évident, tu dois aussi :

- expliquer brièvement pourquoi ce choix est retenu ;
- indiquer pourquoi les options plus lourdes sont écartées ;
- relier explicitement le choix aux contraintes du dépôt quand c’est pertinent.

## Gestion des hypothèses

Si une information manque :

- ne pas l’inventer silencieusement ;
- choisir l’option la plus simple et la plus robuste pour une V1 ;
- signaler clairement qu’il s’agit d’une hypothèse ;
- éviter de faire dériver le projet à partir de cette hypothèse.

## Interdiction des réponses décorrelées du dépôt

Tu ne dois pas produire une réponse générique correcte en théorie mais non alignée sur le dépôt.
Une réponse n’est acceptable que si elle est à la fois :

- techniquement cohérente ;
- compatible avec les sources du projet ;
- adaptée à l’état réel du repo.

## Critère final

Une bonne proposition sur Creatyss n’est pas seulement “fonctionnelle”.
Elle doit être :

- fidèle au dépôt ;
- strictement dans le périmètre ;
- simple ;
- robuste ;
- lisible ;
- maintenable ;
- compatible avec le mode local Docker ;
- cohérente avec une future mise en production sur VPS OVH.
