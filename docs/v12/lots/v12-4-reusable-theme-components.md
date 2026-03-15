# V12-4 — First reusable theme components

## Objectif du lot

Le lot V12-4 consolide la couche `components/theme` après le premier écran pilote de V12-3.

Si V12-3 valide l’approche sur le login admin, V12-4 a pour objectif de faire émerger les premiers composants de thème réellement réutilisables à l’échelle du projet.

Ce lot ne vise pas à créer une bibliothèque exhaustive. Il sert à identifier, extraire et stabiliser quelques patterns visuels premium déjà suffisamment clairs pour être mutualisés.

## Résultat attendu

À l’issue de V12-4, le projet doit disposer de plusieurs briques de thème réutilisables et cohérentes, utilisables dans différentes zones du projet sans dépendance au métier Creatyss.

Le résultat attendu est :

- une couche `components/theme` réellement utile
- moins de duplication de patterns visuels entre écrans
- une meilleure cohérence entre admin et storefront
- une base plus crédible pour une future extraction partielle vers `registry/*`

## Ce que couvre ce lot

V12-4 couvre :

- l’identification de patterns déjà visibles dans plusieurs écrans
- l’extraction de premiers composants de thème réutilisables
- l’intégration progressive de ces composants sur les écrans déjà compatibles
- la réduction de duplications visuelles évidentes
- la consolidation d’une grammaire premium commune

## Ce que ce lot ne couvre pas

V12-4 ne couvre pas :

- la généralisation de tout le design system
- un registry exportable prêt à l’emploi
- une refonte métier
- le déplacement de logique métier hors des features
- une migration massive de tous les écrans du projet

## Positionnement dans la V12

Ce lot intervient après :

- V12-1 — doctrine
- V12-2 — tokens et base de thème
- V12-3 — premier écran pilote (login admin)

La logique est la suivante :

1. définir la structure
2. poser les tokens
3. valider un premier écran réel
4. extraire les patterns devenus évidents

V12-4 est donc le lot où `components/theme` commence réellement à devenir une couche stable et utile.

## Intention

L’objectif de V12-4 est de sortir du cas particulier du login admin.

Un composant de thème n’est légitime que s’il apporte une vraie valeur de réutilisation.

On cherche donc à extraire uniquement les patterns qui sont :

- visuellement stables
- suffisamment génériques
- déjà visibles ou imminents dans plusieurs écrans
- indépendants du métier Creatyss strict

## Types de composants attendus

Les premiers composants ciblés peuvent être de ce type :

### 1. Surfaces

Exemples :

- `premium-surface`
- `section-surface`
- `auth-surface`
- `admin-section-card`

Ces composants servent à stabiliser :

- les bordures
- les rayons
- les fonds
- les ombres
- la densité visuelle

### 2. Hiérarchie typographique

Exemples :

- `section-eyebrow`
- `section-heading`
- `section-description`

Ces composants servent à homogénéiser :

- les niveaux de lecture
- la structure visuelle des sections
- les conventions de titres et sous-titres

### 3. Shells ou wrappers de composition

Exemples :

- `auth-shell`
- `admin-page-shell`
- `content-shell`

Ces composants servent à structurer :

- la page
- l’espace
- les zones principales
- la densité globale

### 4. Patterns admin réutilisables

Exemples :

- section card admin
- bloc d’introduction de page
- composition récurrente titre / description / action

## Critères de sélection d’un composant de thème

Un pattern ne doit être extrait vers `components/theme` que s’il vérifie la plupart des critères suivants :

- il n’est pas spécifique à un seul écran métier
- il n’embarque pas de logique de données
- il exprime un pattern visuel stable
- il a déjà plusieurs usages ou un second usage très proche est immédiatement prévisible
- il peut être repris dans un autre e-commerce avec adaptation minimale du contenu

## Règle d’extraction

### Extraction autorisée

On extrait si :

- le composant réduit une duplication réelle
- la structure est stable
- le pattern est avant tout visuel
- l’abstraction reste simple

### Extraction refusée

On n’extrait pas si :

- le composant n’a encore qu’un usage trop spécifique
- le pattern dépend d’un wording métier fort
- la logique embarquée dépend d’un workflow produit, commande ou blog
- le niveau d’abstraction devient artificiel

## Architecture cible de la couche `components/theme`

À l’issue de V12-4, la structure peut commencer à ressembler à ceci :

```txt
components/theme/
  auth/
    auth-shell.tsx
    auth-surface.tsx
  surfaces/
    premium-surface.tsx
    section-surface.tsx
  typography/
    section-eyebrow.tsx
    section-heading.tsx
    section-description.tsx
  admin/
    admin-section-card.tsx
    admin-page-shell.tsx
```

Cette structure est indicative. Elle doit rester simple et évoluer seulement si les usages réels la justifient.

## Règles de conception

### 1. Le composant de thème compose, il ne décide pas du métier

Un composant `components/theme` :

- compose les primitives UI
- consomme les tokens
- fournit une structure visuelle
- ne décide pas du comportement métier

### 2. Les props doivent rester simples

On évite les composants thème sur-paramétrés.

On préfère :

- des props sobres
- des slots ou `children` simples
- une API de composition lisible

### 3. Les composants doivent rester proches de l’usage réel

On ne construit pas un “super composant premium universel”.

On construit des composants simples, alignés sur un vrai besoin observé.

### 4. Les composants doivent consommer les tokens

Leur style doit prioritairement s’appuyer sur :

- `bg-background`
- `bg-card`
- `text-foreground`
- `text-muted-foreground`
- `border-border`
- `bg-primary`
- `text-primary-foreground`

et non sur une palette hardcodée dans chaque composant.

## Travaux attendus

Les travaux de V12-4 peuvent inclure :

### 1. Audit des répétitions visuelles

Identifier :

- les surfaces récurrentes
- les structures de sections répétées
- les titres / descriptions / eyebrows récurrents
- les patterns admin fréquemment dupliqués

### 2. Extraction ciblée

Créer un nombre limité de composants de thème, par exemple 3 à 5 briques maximum dans ce lot.

### 3. Réintégration locale

Réutiliser ces composants dans un petit nombre d’écrans déjà compatibles afin de vérifier :

- la lisibilité
- la sobriété
- la stabilité des abstractions

## Validation attendue

### Validation technique

- `pnpm run typecheck`
- aucune régression évidente dans les imports
- aucune dépendance métier introduite dans `components/theme`

### Validation de structure

Vérifier que :

- les composants de thème restent découplés du métier
- la duplication baisse réellement
- les composants ne deviennent pas des blocs trop abstraits

### Validation visuelle

Vérifier que :

- la hiérarchie est plus cohérente
- les surfaces convergent vers un langage commun
- la sobriété est conservée
- l’interface reste lisible et non gadget

## Anti-patterns à éviter

### 1. Tout extraire trop vite

On ne transforme pas toute l’UI du projet en composants de thème dès le premier lot utile.

### 2. Créer une couche trop abstraite

Les composants doivent rester simples à lire et à utiliser.

### 3. Déplacer du métier dans `components/theme`

Les composants de thème ne doivent pas connaître le domaine produit, commande ou blog.

### 4. Multiplier les variantes non justifiées

On ne crée pas plusieurs versions du même composant tant qu’un besoin réel ne l’impose pas.

## Suite logique après V12-4

Après avoir posé les premiers composants de thème réutilisables, le lot suivant recommandé est :

### V12-5 — Progressive screen migration

Ce lot devra :

- appliquer progressivement les composants de thème sur plusieurs écrans admin
- commencer à diffuser la cohérence visuelle sur le storefront
- confirmer quels composants méritent vraiment d’être stabilisés à long terme

## Résumé

V12-4 transforme la V12 en couche réutilisable réelle.

Après la doctrine, les tokens et l’écran pilote, ce lot doit faire émerger les premiers composants de thème suffisamment solides pour réduire la duplication, améliorer la cohérence du projet et préparer une future réutilisation plus large.
