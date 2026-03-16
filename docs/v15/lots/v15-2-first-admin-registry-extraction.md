# V15-2 — First admin registry extraction

## Objectif du lot

Le lot V15-2 ouvre la phase d’extraction effective après le cadrage posé en V15-1.

Son rôle n’est pas encore de construire un registry complet, ni d’extraire une grande partie du projet. Son rôle est de prendre un premier ensemble très stable de patterns admin et de les transformer en premiers items réellement réutilisables dans un registry compatible shadcn.

L’idée centrale est simple : commencer petit, sur les patterns les plus mûrs, les plus transverses et les moins dépendants du métier local.

## Intention

V15-2 est un lot d’extraction pilote.

Il doit valider en conditions réelles :

- qu’un petit noyau admin est suffisamment stabilisé pour sortir du projet
- que la forme choisie pour le registry est correcte
- que l’intégration reste lisible
- que le coût de maintenance n’explose pas
- que le projet ne perd pas en clarté en séparant certains patterns

Le but n’est pas d’obtenir beaucoup d’items.

Le but est d’obtenir un **premier lot juste**, réutilisable et durable.

## Résultat attendu

À l’issue de V15-2, le projet doit idéalement disposer :

- d’une structure initiale de registry compatible shadcn
- de premiers items admin extraits
- d’une convention de packaging minimale mais propre
- d’une première validation qu’un autre projet pourrait réinstaller ces patterns
- d’une meilleure lisibilité sur ce qui doit ou non continuer à sortir en registry

## Ce que couvre ce lot

V15-2 couvre :

- la création de la structure initiale du registry
- l’extraction d’un premier lot réduit de patterns admin stabilisés
- la formalisation minimale des items registry
- l’ajustement éventuel de certains composants si nécessaire pour les rendre extractibles
- la vérification que les patterns extraits gardent une API simple
- la documentation des choix d’extraction initiaux

## Ce que ce lot ne couvre pas

V15-2 ne couvre pas :

- l’extraction de tout l’admin
- une extraction large du storefront
- une refonte des composants admin
- une généralisation prématurée de patterns encore locaux
- des changements métier ou serveur
- un registry trop complexe dès le départ

## Périmètre prioritaire

Le lot doit rester concentré sur les patterns admin les plus stables.

Les meilleurs candidats probables sont :

- `AdminPageShell`
- `AdminFormSection`
- `AdminFormField`
- `AdminFormActions`
- `Notice`

Selon l’état réel du repo, un ou deux items supplémentaires très stables peuvent être inclus, mais le lot doit rester volontairement petit.

## Pourquoi commencer par ces patterns

Ces composants ont plusieurs caractéristiques favorables :

- usages multiples déjà réels dans le projet
- stabilité visuelle confirmée par plusieurs écrans
- faible dépendance au storefront public
- rôle clair dans la structure admin
- API relativement simple
- bon potentiel de réinstallation dans d’autres projets e-commerce

Ce sont donc de bons candidats pour une première extraction pilote.

## Questions auxquelles le lot doit répondre

### 1. Quels composants sont réellement assez stables pour sortir maintenant ?

Même parmi les composants admin stabilisés, tous n’ont pas forcément le même niveau de maturité pour sortir en registry.

### 2. Quelle granularité d’item est la bonne ?

Il faut éviter deux extrêmes :

- extraire des items trop atomiques et peu utiles
- extraire des blocs trop gros, trop couplés ou trop spécifiques

### 3. Les composants extraits dépendent-ils encore trop du projet ?

Un composant qui dépend fortement d’un contexte local, d’une classe projet spécifique ou d’un métier Creatyss encore trop visible ne doit pas sortir trop vite.

### 4. Le packaging reste-t-il lisible ?

Le registry doit rester simple à comprendre et à maintenir.

### 5. Les patterns extraits restent-ils thémables ?

L’extraction ne doit pas figer l’identité Creatyss dans le composant. Les composants doivent rester suffisamment pilotés par les tokens et le thème.

## Critères de sélection recommandés

Un pattern admin est un bon candidat si :

- il a plusieurs usages réels
- il est stable visuellement
- il a peu de dépendances métier
- son API est simple
- il n’a pas besoin de beaucoup de contexte externe pour fonctionner
- il apporte un vrai gain de réinstallation dans un autre projet

À l’inverse, il doit rester local s’il :

- dépend trop d’une feature métier précise
- suppose un repository, une action serveur ou un schéma local implicite
- a une API encore mouvante
- sert principalement un écran unique

## Forme d’extraction attendue

Le lot doit viser une extraction compatible avec le modèle registry shadcn.

Cela implique notamment :

- une structure claire des items
- des métadonnées minimales propres
- des dépendances explicites
- une séparation correcte entre composants, fichiers de support et éventuelles variantes

Le lot n’a pas besoin de couvrir tous les types d’items du système shadcn.

Il doit seulement poser un premier lot cohérent et exploitable.

## Doctrine d’API

Les composants extraits doivent rester :

- sobres
- lisibles
- peu verbeux
- pilotés par les props strictement nécessaires
- peu couplés au projet d’origine

Le lot doit éviter de compenser une extraction trop tôt par une explosion de props ou de wrappers.

## Ce que le lot doit éviter

### 1. Extraire des composants encore trop Creatyss-spécifiques

Le registry doit contenir des patterns réutilisables, pas une copie maquillée du projet local.

### 2. Introduire des dépendances implicites

Tout ce dont un item a besoin doit être explicite et raisonnable.

### 3. Créer un registry trop large trop tôt

V15-2 est un pilote, pas une industrialisation complète.

### 4. Multiplier les variantes inutiles

Le premier lot doit rester réduit et clair.

### 5. Sur-abstraire l’admin

L’admin doit devenir réutilisable, pas devenir opaque ou difficile à maintenir.

## Livrables attendus

Le lot doit idéalement produire :

- la structure initiale du registry
- un petit premier lot d’items admin extraits
- une justification claire des composants inclus
- une justification claire des composants exclus ou repoussés
- une première validation que le thème reste la couche de variation principale

## Validation attendue

### Validation technique

- build/typecheck propre
- pas de régression évidente sur l’admin existant
- structure registry cohérente
- dépendances explicites

### Validation de réutilisabilité

Le lot doit permettre de répondre honnêtement à la question :

> est-ce qu’un autre projet pourrait réinstaller ce premier lot sans récupérer une dépendance forte au contexte Creatyss ?

### Validation de lisibilité

Le résultat doit rester plus clair qu’avant, pas plus opaque.

## Suite logique

Une fois V15-2 terminé, la suite logique est :

### V15-3 — Theme packs foundation

Ce lot devra s’assurer que les patterns extraits restent bien pilotés par le thème et que l’identité visuelle peut varier sans remettre en cause la structure admin.

## Résumé

V15-2 est le premier vrai test d’extraction.

Il sert à sortir un noyau admin réduit mais solide vers un registry compatible shadcn, afin de valider la réutilisabilité réelle du projet sans sur-extraire ni sur-abstraire.
