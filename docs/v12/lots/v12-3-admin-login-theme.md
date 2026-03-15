# V12-3 — Admin login as first pilot screen

## Objectif du lot

Le lot V12-3 est le premier lot V12 appliqué à un écran réel.

Après V12-1 (documentation) et V12-2 (base de thème et tokens), ce lot a pour objectif de valider concrètement la nouvelle architecture UI sur un écran simple, isolé et à faible risque fonctionnel : la page de connexion admin.

## Pourquoi le login admin est l’écran pilote

La page `/admin/login` est le meilleur premier candidat pour la migration V12 car elle présente plusieurs avantages :

- surface fonctionnelle limitée
- logique déjà bien isolée dans la page
- absence de complexité métier forte
- très bon terrain pour valider les premiers composants de thème
- excellent point d’entrée pour définir le ton premium du projet

L’objectif n’est pas seulement d’améliorer l’apparence du login, mais de vérifier que la nouvelle séparation entre logique, thème et feature fonctionne réellement dans le code.

## Résultat attendu

À l’issue de V12-3, le projet doit disposer :

- d’un premier écran migré vers la logique V12
- d’une séparation explicite entre logique serveur, composant de formulaire et shell visuel
- d’un premier composant de thème réellement utile
- d’une base réutilisable pour d’autres écrans d’authentification ou d’accès restreint

## Ce que couvre ce lot

V12-3 couvre :

- la migration visuelle de la page `/admin/login`
- la création du premier shell premium d’authentification
- l’adaptation du composant de formulaire admin login
- l’usage concret des tokens posés en V12-2
- la validation du découplage entre UI et logique serveur

## Ce que ce lot ne couvre pas

V12-3 ne couvre pas :

- un changement de logique d’authentification
- une évolution des sessions admin
- un changement de workflow de login
- l’ajout de OAuth, mot de passe oublié ou signup
- la migration d’autres écrans admin
- une extraction `registry/*`

## Règle fonctionnelle impérative

La logique existante de la page de login doit être conservée.

En particulier, doivent rester inchangés :

- la `server action` de login
- la validation des identifiants
- la gestion des erreurs via `searchParams`
- la création de session
- la redirection vers `/admin`
- la redirection éventuelle vers `/admin/session-invalid`

V12-3 est un lot de migration UI, pas un lot d’authentification.

## Cible d’architecture

La structure cible pour ce lot est la suivante :

- `app/admin/login/page.tsx` conserve la logique serveur
- `features/admin/auth/components/login-form.tsx` porte la structure fonctionnelle du formulaire
- `components/theme/auth/auth-shell.tsx` porte le shell visuel premium
- les primitives utilisées continuent de venir de `components/ui`

## Répartition attendue des responsabilités

### `app/admin/login/page.tsx`

Doit continuer à gérer :

- `searchParams`
- la redirection si déjà connecté
- la redirection si session invalide
- la `loginAction`
- le calcul de `showError`
- la composition finale de la page

Cette page ne doit pas redevenir un gros bloc de styling.

### `features/admin/auth/components/login-form.tsx`

Doit gérer :

- les champs email et mot de passe
- l’erreur d’identifiants invalide
- le bouton de soumission
- la structure du formulaire
- l’utilisation des primitives UI

Le formulaire reste spécifique à l’auth admin, mais il ne doit pas embarquer à lui seul toute la composition visuelle de l’écran.

### `components/theme/auth/auth-shell.tsx`

Doit gérer :

- la mise en page générale du login
- le fond
- la composition premium éventuelle en deux colonnes
- la surface visuelle de connexion
- la hiérarchie de marque / contexte / ton visuel

Ce shell doit être pensé comme un pattern réutilisable pour d’autres écrans proches si nécessaire.

## Intention visuelle

Le login doit donner le ton du thème Creatyss V12.

Les qualités attendues sont :

- premium
- sobre
- lisible
- rassurant
- structuré
- non démonstratif

On cherche une sensation de qualité, pas un écran spectaculaire.

## Règles de design pour ce lot

### 1. Sobriété avant effet

On évite :

- les gradients agressifs
- les effets décoratifs trop présents
- les contrastes brutaux sans nécessité
- les artifices qui nuisent à la lecture du formulaire

### 2. Hiérarchie claire

Le login doit rendre immédiatement lisibles :

- le contexte admin
- l’action attendue
- l’état d’erreur éventuel
- l’action principale de soumission

### 3. Cohérence avec les tokens

Le composant doit consommer en priorité les classes sémantiques issues des tokens plutôt que multiplier les couleurs hardcodées locales.

### 4. Pas de fausse complétude fonctionnelle

Aucun ajout de liens ou d’actions non demandés comme :

- mot de passe oublié
- connexion Google
- création de compte

Le login admin reste un écran fermé, simple et orienté usage interne.

## Travaux attendus

Les travaux de V12-3 peuvent inclure :

### 1. Création du shell auth

Créer un composant de thème de type `auth-shell` ou équivalent.

Ce shell doit :

- être réutilisable
- rester indépendant du métier Creatyss strict
- s’appuyer sur les tokens du thème
- encapsuler la composition visuelle principale de l’écran

### 2. Révision du composant `LoginForm`

Le formulaire doit être adapté pour :

- mieux utiliser les primitives UI
- mieux s’intégrer dans le shell premium
- conserver les champs et conventions nécessaires à la `server action`
- afficher proprement l’erreur d’identifiants invalides

### 3. Allègement du `page.tsx`

Le `page.tsx` doit rester responsable de la logique, mais déléguer la présentation autant que possible.

## Livrables attendus

Le lot V12-3 doit produire au minimum :

- un composant `AuthShell` ou équivalent dans `components/theme/auth`
- une adaptation propre de `features/admin/auth/components/login-form.tsx`
- un `app/admin/login/page.tsx` qui conserve la logique tout en s’appuyant sur la nouvelle composition

## Validation attendue

### Validation technique

- `pnpm run typecheck`
- build sans erreur évidente

### Validation fonctionnelle

Vérifier manuellement :

- accès à `/admin/login`
- affichage correct du formulaire
- soumission valide → redirection vers `/admin`
- soumission invalide → retour sur `/admin/login?error=invalid_credentials`
- affichage correct de l’erreur d’identifiants
- redirection correcte si admin déjà authentifié

### Validation visuelle

Vérifier manuellement :

- meilleure hiérarchie visuelle
- meilleur contraste et meilleure présence de marque
- absence d’effet trop démonstratif
- cohérence générale avec la direction premium définie en V12

## Anti-patterns à éviter dans ce lot

### 1. Refaire toute l’auth

Le lot ne doit pas dériver vers une refonte fonctionnelle.

### 2. Laisser toute la mise en page dans `page.tsx`

Le but du lot est précisément d’introduire un premier composant de thème réellement utile.

### 3. Copier un block shadcn brut sans adaptation

Le block peut servir de base d’inspiration, mais doit être adapté :

- au périmètre admin réel
- au ton Creatyss
- au système de tokens du projet
- à la logique serveur existante

### 4. Hardcoder partout la palette finale

Le thème doit continuer à s’appuyer d’abord sur les tokens.

## Suite logique après V12-3

Une fois le login migré, le lot suivant recommandé est :

### V12-4 — First reusable theme components

Ce lot devra consolider et élargir la couche `components/theme`, par exemple avec :

- `premium-surface`
- `section-heading`
- `section-eyebrow`
- premiers patterns admin réutilisables

## Résumé

V12-3 est le premier lot de migration visuelle concrète.

Il sert à prouver que la V12 n’est pas seulement une doctrine documentaire, mais une architecture réellement applicable :

- logique serveur conservée
- UI mieux structurée
- thème mieux isolé
- premier pattern premium réutilisable introduit proprement.
