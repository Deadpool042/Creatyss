---
name: creatyss-doc-routing
description: Protocole obligatoire de lecture, de routage documentaire et d’arbitrage des sources avant toute proposition sur Creatyss.
---

`AGENTS.md` est la doctrine canonique du dépôt.
Ce skill ne la recopie pas.
Il définit uniquement comment identifier, lire et arbitrer les bonnes sources avant de proposer du code, une structure, un schéma, un refactor ou une décision technique.

## Règle générale

Ne jamais proposer directement une solution si les sources projet pertinentes n’ont pas été identifiées puis consultées.

Sur Creatyss, la documentation du dépôt n’est pas un décor.
Elle doit servir de base explicite au raisonnement.

## Séquence obligatoire avant réponse

Avant toute proposition, suivre cette séquence :

1. identifier la nature exacte de la demande ;
2. déterminer les zones du dépôt concernées ;
3. lire les sources pertinentes ;
4. extraire les contraintes applicables ;
5. signaler les ambiguïtés ou contradictions détectées ;
6. proposer la solution la plus simple et la plus fidèle au dépôt.

## Routage documentaire par type de demande

### Architecture, structure et boundaries

Pour toute demande liée à :

- architecture applicative ;
- structure de fichiers ;
- séparation des couches ;
- frontières de modules ;
- façades ;
- services ;
- organisation technique ;
- conventions de placement ;
- refactor structurel ;

consulter en priorité :

- `docs/architecture/**`

### Métier et règles fonctionnelles

Pour toute demande liée à :

- vocabulaire métier ;
- invariants métier ;
- catalogue ;
- produits ;
- variantes ;
- images ;
- catégories ;
- homepage ;
- blog ;
- admin ;
- périmètre fonctionnel V1 ;

consulter en priorité :

- `docs/domains/**`

### Persistance, schéma et Prisma

Pour toute demande liée à :

- Prisma ;
- PostgreSQL ;
- schéma ;
- relations ;
- migrations ;
- modélisation de données ;
- cohérence de persistance ;
- classification dans `prisma/**` ;

consulter en priorité :

- `prisma/**`

### Workflow, agents et conventions d’outillage

Pour toute demande liée à :

- comportement attendu des assistants ;
- workflows de contribution ;
- conventions de livraison ;
- règles d’agents ;
- fichiers d’instructions IA ;

consulter si pertinent :

- `.claude/**`
- `.codex/**`
- `.github/**`

## Cas multi-domaines

Si la demande touche plusieurs dimensions, croiser les sources avant de conclure.

Exemples :

- feature produit avec impact admin et DB → `docs/domains/**` + `docs/architecture/**` + `prisma/**`
- refactor de façades ou repositories → `docs/architecture/**` + code réel concerné
- homepage éditable avec admin → `docs/domains/**` + `docs/architecture/**`
- modification Prisma avec impact doctrine → `prisma/**` + `docs/architecture/**` + `docs/domains/**` si nécessaire

## Arbitrage entre sources

Quand plusieurs sources existent, appliquer cet ordre :

1. la source la plus spécifique au sujet traité ;
2. une décision explicite plutôt qu’une convention implicite ;
3. la documentation projet plutôt qu’une préférence générique ;
4. la structure réelle du repo plutôt qu’un modèle théorique externe.

Ne jamais choisir silencieusement si deux sources du dépôt divergent.

## Gestion des écarts

### Si la documentation est plus précise que le code local

- signaler explicitement l’écart ;
- traiter la documentation structurante comme règle de référence pour la tâche ;
- ne pas légitimer une implémentation incohérente uniquement parce qu’elle existe déjà.

### Si le code local paraît plus avancé que la documentation

- signaler explicitement l’écart ;
- ne pas prétendre que la documentation couvre déjà ce point ;
- éviter d’inventer une justification après coup.

### Si plusieurs documents du dépôt divergent

- signaler la divergence ;
- identifier la source la plus structurante pour la tâche en cours ;
- éviter toute synthèse floue qui efface une contrainte explicite.

## Si aucune source pertinente n’est trouvée

Quand aucune source projet utile n’existe :

1. le dire explicitement ;
2. ne pas faire semblant qu’une règle projet existe ;
3. choisir l’option la plus simple, robuste et maintenable pour une V1 locale dockerisée ;
4. signaler clairement qu’il s’agit d’un choix par défaut faute de source explicite.

## Règle de sortie

Une bonne réponse sur Creatyss doit être visiblement ancrée dans les sources du dépôt.

Avant toute proposition, il faut pouvoir répondre clairement à ces questions :

- quelle est la nature exacte de la demande ?
- quelles sources ont été consultées ?
- quelles contraintes explicites ont été trouvées ?
- y a-t-il un écart entre doc, code et demande ?
- quelle solution minimale reste fidèle au dépôt ?
