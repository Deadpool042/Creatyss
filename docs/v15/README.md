# V15 — Registry extraction and theming foundation

## Contexte

La V12 a permis de poser une base UI plus cohérente sur le projet.

La V13 a servi à consolider cette base et à clarifier ce qui relevait encore d’un cleanup UI utile.

La V14 a prolongé ce travail en réduisant progressivement une partie du CSS custom encore actif, avec une logique de nettoyage par familles.

À ce stade, une conclusion importante s’impose :

le prochain gain principal ne vient plus d’une simple suppression ligne à ligne du CSS global.

Le prochain gain vient d’une meilleure séparation entre :

- ce qui doit être **réutilisable d’un projet à l’autre**
- ce qui doit être **thémable**
- ce qui doit rester **spécifique au storefront d’un client**

C’est le rôle de la V15.

---

## Objectif de V15

La V15 vise à transformer Creatyss en **base réutilisable multi-projets**, avec une architecture claire entre :

- un **admin largement réutilisable**
- une **foundation de thème** pilotée par tokens
- un **storefront adaptable** selon le client et le projet
- un **registry compatible shadcn** pour réinstaller et faire évoluer les patterns stabilisés

L’objectif n’est pas seulement d’avoir “moins de CSS”.

L’objectif est d’avoir une base capable de servir à plusieurs projets sans repartir de zéro.

---

## Intuition directrice

Le projet n’a pas le même niveau de réutilisabilité selon ses zones.

### Admin

L’admin a vocation à rester très proche d’un projet à l’autre.

Les différences attendues sont surtout :

- la palette
- quelques labels métier
- certains modules activés ou non
- quelques détails de wording ou de workflow

En revanche, les grands patterns d’interface admin ont une forte stabilité.

L’admin doit donc devenir une couche **presque produit interne**, réutilisable entre plusieurs projets.

### Public / storefront

Le storefront dépend beaucoup plus :

- du client
- du positionnement de marque
- du contenu
- de la narration visuelle
- du niveau de sophistication attendu
- des besoins spécifiques du catalogue

Le storefront ne doit donc pas être extrait comme un bloc rigide.

Il doit être conçu comme une couche plus adaptable, appuyée sur :

- des primitives
- des surfaces
- des patterns de sections
- quelques blocs réutilisables
- mais pas une structure complète figée pour tous les projets

### Thème

Le vrai point commun transverse entre projets est surtout le **thème** :

- couleurs
- contrastes
- surfaces
- rayon des cards
- traitement des fonds
- densité visuelle
- personnalité de la marque

La V15 doit donc faire du **theming** un axe central.

---

## Ce que V15 n’est pas

La V15 n’est pas :

- une nouvelle vague de nettoyage CSS isolé
- une refonte complète du storefront
- une extraction prématurée de tout le projet
- une réécriture de la logique métier
- une industrialisation excessive
- une architecture “framework de framework”

La V15 doit rester simple, lisible, pragmatique et directement utile.

---

## Objectifs concrets

La V15 doit permettre de répondre clairement à ces questions :

### 1. Qu’est-ce qui doit sortir en registry ?

Il faut identifier les patterns suffisamment stables pour être réinstallables d’un projet à l’autre.

### 2. Qu’est-ce qui doit rester dans le projet local ?

Tout ce qui dépend fortement du client ou du storefront cible doit rester local.

### 3. Qu’est-ce qui doit être piloté par les tokens ?

Tout ce qui relève de l’identité visuelle doit être déplacé autant que possible vers la couche thème.

### 4. Comment utiliser shadcn MCP utilement ?

Le MCP ne doit pas être utilisé comme gadget.
Il doit servir à :

- naviguer dans le registry
- réinstaller des patterns stabilisés
- accélérer la composition d’un nouveau projet
- aider à garder la cohérence entre projets

---

## Découpage cible

La V15 doit clarifier une architecture en trois couches.

### Couche A — Foundation thème

Cette couche reste la base du projet.

Elle comprend :

- `:root`
- `.dark`
- tokens sémantiques
- alias de couleur
- radius
- surfaces
- sidebar tones
- variables brand
- configuration `@theme inline`
- règles de base minimales

Cette couche ne doit pas être confondue avec du legacy CSS.
C’est le socle du système visuel.

### Couche B — Registry réutilisable

Cette couche contient les éléments réinstallables d’un projet à l’autre.

Exemples attendus :

- shells admin
- sections admin
- actions admin
- notices
- cards admin
- surfaces publiques réutilisables
- blocs de structure premium sobres
- patterns de layout réellement stables

Cette couche est la vraie cible du registry.

### Couche C — Projet client

Cette couche reste spécifique au projet.

Elle comprend :

- le storefront propre au client
- les sections marketing propres au projet
- la narration éditoriale
- les variations UX spécifiques
- les adaptations catalogue propres au client
- les choix de composition finaux

---

## Doctrine de décision

### 1. Extraire seulement ce qui est vraiment stable

Un pattern ne doit sortir en registry que s’il :

- a déjà plusieurs usages réels
- reste simple à intégrer
- ne dépend pas fortement du métier local
- apporte un vrai gain de réutilisation

### 2. Ne pas extraire le storefront complet

Le storefront public doit rester plus souple.

On peut extraire :

- des primitives
- des surfaces
- des sections
- des wrappers
- quelques blocs

Mais pas figer toute la couche publique comme si elle devait être identique sur tous les projets.

### 3. L’admin est la priorité de réutilisation

L’admin est la zone la plus naturellement mutualisable.

La V15 doit donc commencer par lui.

### 4. Le thème doit être séparé de la structure

Le but est de pouvoir changer l’identité visuelle d’un projet sans avoir à réécrire les patterns d’interface.

---

## Ce que la V15 doit produire

À la fin de la V15, le projet doit idéalement disposer :

- d’une stratégie claire de registry
- d’un premier registry compatible shadcn
- d’un premier lot de patterns admin extraits
- d’une base de theming plus explicite
- d’au moins deux identités visuelles testables sur la même base
- d’une séparation plus nette entre structure réutilisable et surface spécifique projet

---

## Périmètre prioritaire

### Priorité 1 — Admin réutilisable

Cibles naturelles :

- `AdminPageShell`
- `AdminFormSection`
- `AdminFormField`
- `AdminFormActions`
- `Notice`
- cards admin
- layouts d’édition
- wrappers d’entités admin

### Priorité 2 — Surfaces et patterns transverses

Cibles possibles :

- sections publiques sobres
- panels / surfaces premium
- empty states
- wrappers de contenu
- blocs neutres réutilisables

### Priorité 3 — Theme packs

Il faut valider qu’un même socle peut supporter plusieurs identités.

Exemples :

- thème Creatyss
- thème “client B” fictif
- variations de brand / surface / sidebar / radius

---

## Structure recommandée de la V15

### V15-1 — Registry strategy

Définir :

- ce qui sort en registry
- ce qui reste local
- les conventions de nommage
- les namespaces
- les frontières admin / public / thème

### V15-2 — First admin registry extraction

Extraire un premier lot très stable de patterns admin.

Objectif :

- produire les premiers items réutilisables
- préparer le registry sans sur-architecture

### V15-3 — Theme packs foundation

Créer au moins deux thèmes exploitables sur le même socle.

Objectif :

- prouver que la structure reste stable
- faire varier l’identité sans réécrire l’admin

### V15-4 — MCP workflow validation

Valider un vrai usage du MCP shadcn sur le registry produit :

- navigation
- recherche
- réinstallation
- composition
- maintien de cohérence

---

## Ce que l’on cherche à éviter

### 1. Transformer le registry en dumping de composants

Le registry ne doit pas devenir un dossier où l’on jette tout ce qui existe.

### 2. Sortir des patterns encore immatures

Un composant instable ou trop local doit rester dans le projet.

### 3. Mélanger le thème et la structure

Le thème doit piloter l’identité, pas porter la structure métier.

### 4. Refondre le storefront par anticipation

Le storefront doit garder sa flexibilité projet.

### 5. Réintroduire de la complexité inutile

La V15 doit être un gain de réutilisabilité, pas une couche de sophistication abstraite.

---

## Résultat attendu

À la fin de la V15, Creatyss doit être plus qu’un projet e-commerce spécifique.

Il doit devenir une **base réutilisable premium**, avec :

- un admin largement mutualisable
- un système de thème plus explicite
- un storefront encore adaptable
- un registry capable de distribuer les patterns stabilisés
- un workflow compatible avec le MCP shadcn

---

## Résumé

La V15 ne cherche pas seulement à “finir le cleanup CSS”.

Elle cherche à transformer Creatyss en base multi-projets cohérente, où :

- l’admin devient réutilisable
- le thème devient la vraie variable principale d’un projet à l’autre
- le storefront reste adaptable
- le registry devient le point d’ancrage de cette réutilisation
