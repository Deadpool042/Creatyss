# V12-2 — Theme tokens and base theme

## Objectif du lot

Le lot V12-2 pose la base technique du thème V12.

Après la documentation de V12-1, ce lot a pour but de préparer la source de vérité visuelle du projet afin de rendre possible une migration progressive des écrans.

Le focus de V12-2 n’est pas encore la refonte d’un écran complet. Il consiste à stabiliser les fondations de thème qui seront consommées ensuite par :

- les primitives UI
- les composants de thème
- les features migrées progressivement

## Résultat attendu

À l’issue de V12-2, le projet doit disposer d’une base de thème plus claire et plus pilotable.

Cela implique :

- un `global.css` mieux cadré
- des tokens visuels plus explicites
- une meilleure séparation entre tokens et styles locaux d’écran
- une base cohérente pour construire les premiers composants `components/theme`

## Ce que couvre ce lot

V12-2 couvre :

- l’audit et le nettoyage de la base de thème existante
- la clarification de la hiérarchie des tokens dans `global.css`
- l’ajout ou l’ajustement de tokens sémantiques si nécessaire
- la réduction des styles visuels trop spécifiques recopiés localement
- la préparation de la future migration du login admin

## Ce que ce lot ne couvre pas

V12-2 ne couvre pas :

- la migration complète d’un écran métier
- la refonte du login admin en tant qu’écran pilote
- la création d’un registry exportable
- la réécriture des primitives UI si aucun besoin concret ne le justifie
- les changements métier

## Motivation

Sans une base de tokens stable, chaque écran tend à porter sa propre logique visuelle.

Cela crée :

- des répétitions de classes Tailwind
- des variantes de surfaces incohérentes
- des couleurs hardcodées localement
- une difficulté à faire évoluer l’identité visuelle du projet
- une base peu réutilisable dans un autre e-commerce

Le but de V12-2 est donc de faire en sorte que le thème soit défini par des **tokens** plutôt que par une accumulation de styles de page.

## Cible technique

La cible du lot est la suivante :

- `global.css` devient la source de vérité principale du thème
- les couleurs et surfaces utiles sont exprimées via des variables sémantiques
- les composants utilisent des classes sémantiques avant d’utiliser des couleurs hardcodées
- les futures briques `components/theme` peuvent être construites sur une base stable

## Rôle de `global.css` dans V12-2

Dans le cadre de V12, `global.css` porte en priorité :

- `background`
- `foreground`
- `card`
- `card-foreground`
- `popover`
- `popover-foreground`
- `primary`
- `primary-foreground`
- `secondary`
- `secondary-foreground`
- `muted`
- `muted-foreground`
- `border`
- `input`
- `ring`
- `radius`

Selon le besoin réel du projet, V12-2 peut aussi introduire quelques variables brand supplémentaires, à condition qu’elles soient :

- réellement réutilisables
- limitées en nombre
- justifiées par plusieurs usages

## Règle de décision sur les tokens

Avant d’ajouter un nouveau token, il faut vérifier :

1. qu’un token sémantique existant ne couvre pas déjà le besoin
2. que le besoin ne relève pas d’un simple composant local
3. que le token correspond à une intention stable et non à une exception ponctuelle

On évite donc d’ajouter des tokens pour :

- corriger un seul écran isolé
- contourner un problème de composition local
- encoder directement un cas métier dans le thème

## Conventions recommandées

### Priorité aux classes sémantiques

Dans les composants, on privilégie :

- `bg-background`
- `text-foreground`
- `bg-card`
- `text-card-foreground`
- `border-border`
- `bg-primary`
- `text-primary-foreground`
- `text-muted-foreground`

### Réduction des couleurs hardcodées

On cherche à réduire les usages répétés de classes du type :

- `bg-stone-100`
- `bg-zinc-50`
- `text-stone-900`
- `border-stone-200`

Ces classes peuvent rester tolérées dans certains cas très ciblés de composition locale, mais elles ne doivent plus être la base du système.

### Radius et surfaces

Les rayons, ombres et surfaces doivent converger vers une logique commune.

L’objectif n’est pas d’uniformiser tous les composants brutalement, mais d’éviter les écarts arbitraires entre écrans équivalents.

## Travaux attendus dans le lot

Les travaux de V12-2 peuvent inclure, selon l’état réel du repo :

### 1. Audit du thème actuel

- relever les tokens existants
- identifier les variables déjà en place
- repérer les zones de duplication visuelle
- repérer les usages trop fréquents de couleurs hardcodées

### 2. Clarification de `global.css`

- restructurer les variables si la lecture est confuse
- harmoniser les noms si nécessaire
- éviter les doublons ou alias peu utiles
- documenter implicitement une hiérarchie plus propre dans le fichier

### 3. Préparation des usages futurs

- s’assurer que les tokens actuels suffisent pour un `AuthShell`
- s’assurer qu’ils suffisent pour une `premium-surface`
- s’assurer qu’ils suffisent pour les futures sections admin premium

## Point d’attention

V12-2 ne doit pas dériver vers une refonte visuelle massive.

Si un besoin d’amélioration UI apparaît pendant ce lot, la bonne réponse est généralement :

- poser le token
- préparer le terrain
- remettre la migration d’écran au lot suivant

Le lot suivant naturel pour appliquer la base ainsi posée est V12-3, avec le login admin comme premier écran pilote.

## Livrables attendus

Le lot V12-2 doit produire :

- un état plus propre de `global.css`
- éventuellement des ajustements mineurs dans les primitives si un token doit être consommé proprement
- un lot documenté avec périmètre clair
- aucune modification métier

## Validation du lot

Validation minimale attendue :

- `pnpm run typecheck`
- build CSS/Next sans erreur évidente
- vérification manuelle rapide des écrans déjà existants pour s’assurer qu’aucune régression visuelle majeure n’a été introduite

Écrans à vérifier au minimum après V12-2 :

- `/admin/login`
- un écran admin existant
- `/boutique`
- une fiche produit publique

## Suite logique après V12-2

Après stabilisation des tokens et de la base de thème, le lot suivant recommandé est :

### V12-3 — Admin login as first pilot screen

Ce lot devra :

- créer les premiers composants `components/theme`
- migrer `app/admin/login/page.tsx` sans changement fonctionnel d’authentification
- valider que la base tokens + theme supporte correctement un écran premium réel

## Résumé

V12-2 prépare le terrain.

Ce lot ne cherche pas à démontrer immédiatement tout le potentiel visuel de la V12. Il sert à construire un thème plus propre, plus stable et plus facilement composable, afin que les migrations d’écrans suivantes reposent sur une base réellement réutilisable.
