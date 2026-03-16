# V15-1 — Registry strategy

## Objectif du lot

Le lot V15-1 ouvre la V15.

Son rôle n’est pas encore d’extraire massivement des composants, mais de définir la stratégie correcte pour transformer Creatyss en base réutilisable multi-projets.

Après les V12 à V14, le projet a déjà une base UI plus cohérente, un admin largement stabilisé et un système de thème suffisamment avancé pour servir de socle. Mais sans doctrine claire, une extraction registry risquerait d’être trop large, trop floue ou trop locale pour être réellement utile.

La priorité de V15-1 est donc de répondre à une question simple :

> qu’est-ce qui doit devenir réutilisable via registry, qu’est-ce qui doit rester local au projet, et qu’est-ce qui doit être piloté par le thème ?

## Intention

V15-1 est un lot de cadrage et de stratégie.

Il doit empêcher trois erreurs fréquentes :

- extraire trop tôt des patterns encore instables
- confondre réutilisable et spécifique projet
- mélanger structure, thème et storefront client dans un même niveau d’abstraction

Ce lot doit poser une doctrine suffisamment claire pour que les lots suivants puissent extraire peu, mais bien.

## Résultat attendu

À l’issue de V15-1, le projet doit disposer d’une stratégie explicite sur :

- les patterns à sortir en registry
- les patterns à garder dans le repo local
- la frontière entre structure réutilisable et storefront spécifique
- le rôle exact du thème
- le rôle du MCP shadcn dans le workflow futur

Le résultat attendu n’est pas encore un gros volume de code extrait.

Le résultat attendu est une **direction juste**, qui rend les extractions suivantes propres, relisibles et réellement réutilisables.

## Ce que couvre ce lot

V15-1 couvre :

- l’analyse des patterns stabilisés du projet
- la séparation admin / public / thème
- la définition des critères d’extraction registry
- la définition des conventions de nommage initiales
- la définition des namespaces ou familles d’items
- le cadrage du rôle du MCP shadcn
- la formalisation du périmètre des premiers lots V15

## Ce que ce lot ne couvre pas

V15-1 ne couvre pas :

- l’extraction effective d’un grand nombre d’items
- une refonte de l’admin
- une refonte du storefront
- des changements métier
- une migration technique lourde
- la création d’un registry surdimensionné dès le départ

## Problème à résoudre

Le projet vise une réutilisation multi-projets.

Mais tous les morceaux du projet n’ont pas le même niveau de stabilité ni le même niveau d’intérêt en termes de mutualisation.

### Ce qui est naturellement mutualisable

L’admin est la zone la plus stable d’un projet à l’autre.

On s’attend à y retrouver, projet après projet :

- des shells de pages admin
- des sections de formulaires
- des champs admin
- des actions de formulaires
- des notices
- des cards admin
- des écrans de CRUD très proches dans leur structure

### Ce qui est partiellement mutualisable

Certaines surfaces publiques, wrappers ou blocs neutres peuvent être réutilisés si leur structure reste suffisamment générique.

Mais cette extraction doit rester limitée et sélective.

### Ce qui doit rester local

Le storefront complet, la narration, les sections marketing et les compositions propres à un client doivent en grande partie rester dans le projet local.

La V15 ne doit pas chercher à rendre tout le front public générique.

## Hypothèse structurante

Le projet doit être pensé en trois couches.

### Couche A — Foundation thème

Cette couche comprend :

- tokens `:root`
- `.dark`
- aliases sémantiques
- surfaces
- radius
- couleurs sidebar
- brand
- configuration `@theme inline`
- règles de base minimales

Cette couche ne doit pas être sortie en registry comme un simple composant.

Elle constitue la fondation thémable du projet.

### Couche B — Registry réutilisable

Cette couche contient les patterns stables réinstallables entre projets.

La priorité va à l’admin.

Elle peut contenir :

- composants
- blocs
- wrappers
- surfaces
- fichiers de config liés au design system
- éventuellement pages ou patterns de page si leur stabilité est réelle

### Couche C — Projet client

Cette couche regroupe :

- le storefront spécifique
- les compositions de pages publiques
- les sections marketing
- les choix narratifs
- les variations UX propres au client

Cette couche doit rester locale tant qu’un pattern n’a pas prouvé sa stabilité.

## Questions auxquelles le lot doit répondre

### 1. Quels patterns sont assez stables pour sortir en registry ?

Un pattern doit avoir plusieurs usages réels, une API simple et une indépendance raisonnable vis-à-vis du métier local.

### 2. Quels patterns doivent rester dans le projet ?

Tout ce qui dépend encore fortement du storefront Creatyss ou du contexte client doit rester local.

### 3. Quel rôle joue le thème ?

Le thème doit devenir la variable principale d’adaptation entre projets.

On doit pouvoir changer la personnalité visuelle sans réécrire les patterns admin extraits.

### 4. Quel rôle joue le MCP ?

Le MCP shadcn ne doit pas être un gadget.

Il doit servir à :

- naviguer dans le registry
- retrouver les patterns disponibles
- installer des items stabilisés
- accélérer la réutilisation sur d’autres projets

## Critères d’extraction recommandés

Un pattern ne doit sortir en registry que s’il remplit une majorité de ces critères :

- plusieurs usages réels déjà présents dans le projet
- faible dépendance à un écran unique
- API simple
- forte stabilité visuelle
- faible dépendance au métier Creatyss
- vrai intérêt de réinstallation dans un autre projet
- maintenance raisonnable

À l’inverse, un pattern doit rester local s’il :

- dépend fortement du storytelling public
- dépend d’un seul écran ou d’une seule feature très locale
- est encore en mouvement
- mélange fortement structure et logique métier spécifique

## Doctrine de nommage

V15-1 doit au moins poser des conventions initiales, par exemple :

- namespace admin dédié
- namespace public/surfaces limité
- namespace thème si nécessaire
- noms explicites basés sur le rôle, pas sur le projet

Exemples d’intentions de nommage :

- `admin-page-shell`
- `admin-form-section`
- `admin-form-field`
- `admin-form-actions`
- `notice`
- `public-section`
- `surface-panel`

Le lot n’a pas besoin de figer tous les noms définitifs, mais il doit cadrer la direction.

## Ce que la stratégie doit éviter

### 1. Registry fourre-tout

Le registry ne doit pas devenir un miroir du dossier `components/` ou `features/`.

### 2. Extraction prématurée du storefront

Le public reste plus variable et plus client-dépendant.

### 3. Confusion entre thème et structure

Changer la palette ou la surface ne doit pas imposer de reconfigurer les patterns admin.

### 4. Abstraction gratuite

Le but n’est pas de créer une surcouche sophistiquée, mais une base réutilisable simple.

## Livrables attendus

Le lot doit idéalement produire :

- une doctrine claire d’extraction
- une cartographie des zones réutilisables
- une première liste de candidats admin à extraire
- une première liste de patterns publics à garder locaux
- une clarification du rôle du thème
- un cadrage du rôle du MCP dans le workflow

## Validation attendue

### Validation documentaire

La stratégie produite doit permettre à un futur intervenant de comprendre rapidement :

- ce qui sort en registry
- ce qui reste local
- pourquoi
- dans quel ordre

### Validation projet

La sortie de V15-1 doit rendre les lots V15-2 à V15-4 plus faciles à exécuter, sans ambiguïté sur le périmètre.

## Suite logique

Une fois V15-1 terminé, la suite logique est :

### V15-2 — First admin registry extraction

Ce lot devra prendre un petit premier ensemble de patterns admin réellement stabilisés et les transformer en premiers items registry compatibles shadcn.

## Résumé

V15-1 est le lot de stratégie qui évite une mauvaise extraction.

Il sert à définir clairement comment Creatyss doit devenir une base réutilisable multi-projets, en séparant :

- la fondation thème
- les patterns réellement réutilisables
- le storefront spécifique au projet

C’est ce cadrage qui rendra l’usage du registry et du MCP shadcn réellement utile, au lieu d’être simplement décoratif.
