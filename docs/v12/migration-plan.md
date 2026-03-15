# Plan de migration V12

## Objectif du plan

Ce document décrit la manière de déployer la V12 dans le projet sans refonte brutale.

La migration V12 doit :

- améliorer la cohérence visuelle
- clarifier l’architecture UI
- renforcer la réutilisabilité des patterns de thème
- rester compatible avec le fonctionnement actuel de l’application
- préserver un rythme de migration sûr et incrémental

Ce plan n’a pas pour but d’imposer une réécriture du front d’un seul bloc.

## Principe de migration

La V12 repose sur une stratégie simple :

1. documenter avant de migrer
2. poser les fondations de thème avant de les diffuser
3. choisir un écran pilote
4. migrer écran par écran
5. valider systématiquement après chaque incrément

Chaque étape doit être suffisamment petite pour :

- être relue facilement
- être testée rapidement
- être rollbackable si nécessaire

## Règles de sécurité

Pendant toute la migration :

- aucun changement métier non demandé
- aucune réécriture globale du front en une seule PR
- aucune abstraction générique sans second usage crédible
- pas de refactor visuel qui mélange en même temps architecture, métier et data
- les écrans existants doivent rester fonctionnels pendant toute la transition

## Critères de validation pour chaque lot

Chaque lot V12 doit préciser :

- les fichiers créés
- les fichiers modifiés
- le périmètre exact
- ce qui est déplacé, si déplacement il y a
- les commandes de validation
- la vérification manuelle attendue

Validation minimale recommandée à chaque lot :

- `pnpm run typecheck`
- les tests e2e concernés par la zone modifiée
- un contrôle visuel manuel de l’écran migré

## Ordre de migration recommandé

### Étape 1 — Documentation

But : figer la cible avant les refactors.

Livrables :

- `docs/v12/README.md`
- `docs/v12/doctrine.md`
- `docs/v12/migration-plan.md`

Résultat attendu :

- la structure cible est claire
- les rôles de `components/ui`, `components/theme`, `features/*`, `entities/*` et `registry/*` sont documentés
- le rôle de `global.css` et des tokens est stabilisé conceptuellement

### Étape 2 — Base de thème et tokens

But : préparer la source de vérité visuelle.

Contenu possible :

- audit de `global.css`
- clarification des variables existantes
- ajout ou nettoyage des tokens sémantiques
- réduction des couleurs hardcodées inutiles
- normalisation des surfaces, border, foreground, radius

Résultat attendu :

- les composants peuvent s’appuyer sur des classes sémantiques stables
- le thème est piloté par des tokens plutôt que par des styles page par page

### Étape 3 — Premier écran pilote : login admin

But : valider la méthode sur un écran simple et isolé.

Contenu possible :

- création de `components/theme/auth/auth-shell.tsx`
- adaptation de `features/admin/auth/components/login-form.tsx`
- conservation de toute la logique serveur dans `app/admin/login/page.tsx`
- amélioration visuelle sans changement fonctionnel d’authentification

Résultat attendu :

- premier écran réellement migré vers la nouvelle architecture UI
- séparation claire entre shell visuel, composant de formulaire et logique de page

Validation recommandée :

- `pnpm run typecheck`
- contrôle manuel de `/admin/login`
- vérification du submit, de l’erreur d’identifiants et des redirects

### Étape 4 — Premiers composants de thème réutilisables

But : éviter que la migration reste limitée à un seul écran.

Contenu possible :

- extraction de `premium-surface`
- extraction de `section-eyebrow`
- extraction de `section-heading`
- extraction d’un premier pattern de section admin

Résultat attendu :

- premiers patterns réellement réutilisables
- langage visuel premium plus cohérent
- baisse de la duplication visuelle

### Étape 5 — Migration progressive des écrans admin

But : diffuser la nouvelle grammaire visuelle là où elle est la plus utile.

Ordre recommandé :

1. login admin
2. homepage admin
3. produits admin
4. commandes admin
5. blog admin
6. catégories admin

Pourquoi commencer par l’admin :

- le périmètre est plus maîtrisé
- les composants sont plus structurés
- les gains de cohérence sont rapides à observer

### Étape 6 — Migration progressive du storefront

But : appliquer les patterns stabilisés à la boutique publique.

Ordre recommandé :

1. home publique
2. grille catalogue
3. fiche produit
4. panier
5. checkout
6. confirmation de commande

Résultat attendu :

- cohérence visuelle entre admin et storefront
- réutilisation accrue des composants de thème
- meilleure base pour un second projet e-commerce

## Ce qui doit être réutilisable

La migration V12 doit progressivement faire émerger un socle réutilisable sur les aspects suivants :

- shells de page
- surfaces premium
- patterns de section
- hiérarchie visuelle
- composants de support d’auth
- certains patterns catalogue
- certaines cartes ou blocs admin réutilisables

## Ce qui ne doit pas être généralisé trop tôt

Il ne faut pas chercher à rendre générique immédiatement :

- les repositories
- les actions serveur métier
- la structure du domaine produit Creatyss
- les règles de publication métier
- les spécificités commandes ou homepage du projet

La V12 concerne d’abord l’architecture UI, pas la généralisation complète du métier e-commerce.

## Politique de création de composants

Avant de créer un nouveau composant, appliquer cet ordre de décision :

### Cas 1 — primitive UI

Créer dans `components/ui` si :

- le besoin est générique
- le composant n’exprime pas un pattern Creatyss spécifique
- il peut servir dans plusieurs contextes sans hypothèse métier

### Cas 2 — composant de thème

Créer dans `components/theme` si :

- le besoin est plus riche qu’une primitive
- le composant exprime un pattern premium réutilisable
- il peut être utilisé dans plusieurs écrans et potentiellement dans plusieurs projets

### Cas 3 — composant de feature

Créer dans `features/*` si :

- le composant est propre à un workflow
- il dépend directement d’un écran métier
- il n’a pas de valeur claire hors de sa feature

## Politique de refactor

### Refactor autorisé

- déplacer un composant vers `components/theme`
- simplifier des classes répétées
- remplacer des styles hardcodés par des tokens sémantiques
- extraire un pattern clairement réutilisé
- clarifier les imports et la structure

### Refactor non souhaité dans V12

- refaire toute la structure du projet en une fois
- déplacer massivement des fichiers sans bénéfice clair immédiat
- inventer des couches supplémentaires sans besoin validé
- créer un registry complet avant d’avoir des composants réellement stabilisés

## Vision cible à moyen terme

À moyen terme, Creatyss doit obtenir :

- un `global.css` ou équivalent qui porte les tokens du thème
- des primitives UI stables
- une couche `components/theme` réellement utile
- des features plus légères visuellement car appuyées sur des patterns réutilisables
- un ensemble de composants suffisamment mûrs pour envisager une extraction partielle vers `registry/*`

## Signaux qu’un composant peut migrer vers `registry/*`

Un composant ou pattern peut être candidat à une future extraction si :

- il a plusieurs usages réels
- il ne dépend pas du métier Creatyss
- il exprime un pattern visuel stable
- il n’a pas besoin d’un repository ou d’une règle métier spécifique
- il peut être repris dans un autre e-commerce avec changement de thème et de contenu seulement

## Résumé opérationnel

La migration V12 doit toujours suivre ce rythme :

1. définir la règle
2. créer ou ajuster les tokens
3. migrer un écran réel
4. extraire ce qui mérite de l’être
5. valider
6. passer à l’écran suivant

La V12 n’est pas une refonte brutale.

C’est une migration progressive vers un système d’interface plus clair, plus premium et plus réutilisable.
