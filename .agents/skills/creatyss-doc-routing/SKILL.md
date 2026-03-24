---
name: creatyss-doc-routing
description: Protocole obligatoire de lecture, de routage documentaire et d’arbitrage des sources avant toute proposition sur Creatyss.
---

Avant toute proposition de code, de structure, de schéma, de refactor, de workflow ou de décision technique, tu dois identifier puis consulter les sources pertinentes du dépôt.

L’objectif n’est pas simplement de “tenir compte” des docs.
L’objectif est de faire de la documentation du dépôt la base explicite de la réponse.

## Règle générale

Ne jamais proposer une implémentation directe si les sources projet pertinentes n’ont pas été consultées.

Tu dois :

1. identifier le type exact de demande ;
2. déterminer quels dossiers du dépôt sont pertinents ;
3. lire les documents nécessaires ;
4. extraire les contraintes applicables ;
5. produire une réponse compatible avec ces contraintes ;
6. signaler toute ambiguïté, contradiction ou absence de source.

## Routage documentaire obligatoire

### Architecture, structure et séparation des couches

Pour toute question portant sur :

- architecture applicative
- structure de fichiers
- séparation des couches
- frontières de modules
- façades
- repositories
- services
- organisation technique
- conventions de placement du code
- refactor structurel
- nomenclature technique

consulter en priorité :

- `docs/architecture/**`

### Métier et règles fonctionnelles

Pour toute question portant sur :

- vocabulaire métier
- invariants métier
- catalogue
- produits
- variantes
- images
- catégories
- homepage
- blog
- admin
- règles fonctionnelles
- comportement métier attendu
- périmètre V1
- entités et relations métier

consulter en priorité :

- `docs/domaines/**`

### Schéma, persistance et Prisma

Pour toute question portant sur :

- Prisma
- PostgreSQL
- schéma
- relations
- migration
- repositories DB
- colonnes
- noms de tables
- clés
- index
- cohérence de persistance
- règles de modélisation de données

consulter en priorité :

- `prisma/**`

### Règles d’agents, workflows et conventions d’outillage

Pour toute question portant sur :

- comportement attendu des assistants
- conventions de livraison
- workflows de contribution
- règles de travail
- instructions agent
- patterns de review
- conventions liées à Claude, Codex ou GitHub

consulter si pertinent :

- `.claude/**`
- `.codex/**`
- `.github/**`

## Arbitrage entre sources

Quand plusieurs sources existent, appliquer les règles suivantes :

1. La source la plus spécifique au sujet traité prime sur la plus générale.
2. Une décision explicite prime sur une convention implicite.
3. Une doc projet prime sur une préférence générique.
4. Une contrainte locale du dépôt prime sur une pratique “habituelle”.
5. Si plusieurs docs du dépôt divergent, ne jamais choisir silencieusement : signaler l’écart.

## Procédure d’analyse avant réponse

Avant de proposer quoi que ce soit, tu dois raisonner selon cette séquence :

1. Quelle est la nature exacte de la demande ?
2. Cette demande touche-t-elle :
   - l’architecture ?
   - le métier ?
   - la persistance ?
   - le workflow de contribution ?
   - plusieurs de ces domaines à la fois ?
3. Quels dossiers doivent être consultés en priorité ?
4. Quelles contraintes explicites ont été trouvées ?
5. Existe-t-il une contradiction entre docs, code ou demande ?
6. Quelle est la solution la plus simple et la plus fidèle au dépôt ?

## Cas multi-domaines

Si une demande touche plusieurs domaines, tu dois croiser les sources pertinentes avant de répondre.

Exemples :

- une feature produit avec impact DB et admin → `docs/domaines/**` + `docs/architecture/**` + `prisma/**`
- une refonte de repository liée à des façades → `docs/architecture/**` + `prisma/**`
- une homepage éditable avec admin → `docs/domaines/**` + `docs/architecture/**`
- une règle de livraison spécifique à un workflow agent → `.claude/**` ou `.codex/**` si pertinent, en complément des docs métier/architecture

## Gestion des écarts doc / code

Si la doc est plus précise que le code existant :

- signaler explicitement que la doc porte la règle ;
- éviter de légitimer une implémentation locale incohérente juste parce qu’elle existe.

Si le code existant paraît plus avancé que la doc :

- signaler l’écart ;
- ne pas prétendre que la doc couvre un point qu’elle ne couvre pas ;
- éviter d’inventer une justification rétrospective.

## Si aucune doc pertinente n’est trouvée

Si aucune source projet pertinente n’est trouvée :

1. le dire explicitement ;
2. ne pas faire semblant qu’une règle projet existe ;
3. choisir l’option la plus simple, robuste et maintenable pour une V1 locale dockerisée ;
4. indiquer clairement qu’il s’agit d’un choix par défaut faute de source projet explicite.

## Application obligatoire des règles trouvées

Si une règle explicite est trouvée dans la documentation pertinente du dépôt :

- elle doit être appliquée dans la solution proposée ;
- elle ne doit pas être remplacée par une préférence générique ;
- elle doit primer sur une convention habituelle non documentée ;
- la réponse doit refléter concrètement cette règle dans la structure, le code ou la recommandation.

Si plusieurs règles pertinentes coexistent :

- retenir d’abord la plus spécifique ;
- signaler toute contradiction ;
- éviter toute synthèse floue qui efface une contrainte explicite.

## Règle de sortie

Une réponse de bonne qualité sur Creatyss doit être visiblement fondée sur les sources du dépôt.
Tu ne dois jamais répondre comme si le projet était vide de contraintes si le dépôt contient déjà une documentation structurante.
