# V12-5 — Progressive screen migration

## Objectif du lot

Le lot V12-5 marque l’entrée de la V12 dans une phase de diffusion contrôlée.

Après :

- V12-1 — doctrine
- V12-2 — tokens et base de thème
- V12-3 — premier écran pilote (login admin)
- V12-4 — premiers composants de thème réutilisables

ce lot a pour objectif d’appliquer progressivement la nouvelle architecture UI à plusieurs écrans réels du projet.

## Rôle du lot

V12-5 n’est pas une refonte globale du front.

C’est un lot de migration incrémentale qui doit permettre de :

- diffuser les composants de thème déjà stabilisés
- harmoniser peu à peu l’admin et le storefront
- réduire la duplication visuelle écran par écran
- confirmer quels patterns sont vraiment réutilisables
- éviter une refonte brutale difficile à contrôler

## Résultat attendu

À l’issue de V12-5, plusieurs écrans du projet doivent avoir adopté la nouvelle grammaire visuelle V12 sans régression fonctionnelle.

Le résultat attendu est :

- une cohérence visuelle plus visible à l’échelle du projet
- plusieurs usages réels des composants `components/theme`
- une meilleure lisibilité des écrans clés
- une base suffisamment éprouvée pour décider ensuite ce qui mérite une stabilisation longue durée ou une future extraction partielle

## Ce que couvre ce lot

V12-5 couvre :

- la migration progressive de plusieurs écrans admin et storefront
- la réutilisation effective des composants de thème extraits en V12-4
- l’ajustement limité de certains composants de thème si un usage réel le justifie
- l’amélioration de la cohérence visuelle entre plusieurs zones du projet

## Ce que ce lot ne couvre pas

V12-5 ne couvre pas :

- une refonte complète de toutes les pages en une seule passe
- un redesign métier du catalogue ou du checkout
- une réécriture des workflows métier
- un packaging registry complet
- une industrialisation prématurée de tous les patterns UI

## Principe de migration

La migration doit rester progressive et contrôlée.

Chaque écran migré doit être traité comme un incrément autonome.

L’ordre doit toujours être :

1. choisir un écran cible
2. identifier les composants de thème déjà disponibles
3. réutiliser au maximum l’existant
4. extraire seulement si un vrai pattern commun apparaît
5. valider le comportement et l’apparence
6. passer à l’écran suivant

## Règle de périmètre

Un lot V12-5 ne doit pas migrer trop d’écrans à la fois.

On privilégie des sous-lots sobres, par exemple :

- 1 écran important
- ou 2 petits écrans proches
- ou une même famille d’écrans homogènes

Le but est de garder :

- des changements lisibles
- des validations réalistes
- un historique de migration compréhensible

## Ordre recommandé des écrans

### Phase 1 — Admin

L’admin reste prioritaire dans la diffusion initiale de V12.

Ordre recommandé :

1. `/admin/login`
2. `/admin/homepage`
3. `/admin/products`
4. `/admin/products/[id]`
5. `/admin/orders`
6. `/admin/orders/[id]`
7. `/admin/blog`
8. `/admin/categories`
9. `/admin/media`

### Pourquoi commencer par l’admin

- structure des écrans plus prévisible
- usages plus réguliers des sections et surfaces
- meilleure lisibilité des répétitions de patterns
- risque visuel plus contrôlable

### Phase 2 — Storefront

Une fois plusieurs écrans admin migrés, la logique V12 peut se diffuser progressivement vers le storefront.

Ordre recommandé :

1. `/`
2. `/boutique`
3. `/boutique/[slug]`
4. `/panier`
5. `/checkout`
6. `/checkout/confirmation/[reference]`
7. `/blog`
8. `/blog/[slug]`

## Types de patterns à réutiliser pendant V12-5

Pendant cette phase, il faut prioritairement réutiliser les patterns déjà extraits, par exemple :

- `auth-shell`
- `premium-surface`
- `section-eyebrow`
- `section-heading`
- `section-description`
- `admin-section-card`
- `admin-page-shell`

L’objectif n’est pas d’inventer un nouveau pattern par écran, mais d’appliquer et éprouver ceux déjà posés.

## Règles de décision pendant la migration

### 1. Réutiliser avant d’extraire

Si un composant de thème existant couvre 80% du besoin, on l’utilise et on l’ajuste légèrement si nécessaire.

On n’extrait un nouveau composant que si :

- la duplication est réelle
- le pattern se répète déjà
- le besoin est visuel et transversal

### 2. Le métier reste dans les features

Même pendant la migration, il ne faut pas déplacer vers `components/theme` :

- la logique de formulaires métier
- les règles de publication
- les actions serveur
- les helpers métier
- les dépendances aux repositories

### 3. Les tokens restent la base

Les écrans migrés doivent s’appuyer autant que possible sur les classes sémantiques dérivées des tokens.

On cherche à réduire progressivement les styles locaux trop spécifiques et les couleurs hardcodées répétées.

### 4. Pas de refonte décorative gratuite

Chaque migration doit améliorer :

- la hiérarchie
- la lisibilité
- la cohérence
- la densité visuelle

et non ajouter seulement des effets visuels.

## Exemples de sous-lots possibles

### V12-5A — Homepage admin

But : appliquer les surfaces, headings et structures premium à la page d’édition de homepage.

### V12-5B — Produits admin liste

But : harmoniser l’introduction de page, la liste, les surfaces et certaines sections de contrôle.

### V12-5C — Produit admin détail

But : appliquer les surfaces et titres de section sur un écran métier plus dense.

### V12-5D — Orders admin

But : appliquer la cohérence V12 à la liste et au détail des commandes.

### V12-5E — Storefront catalogue

But : commencer la diffusion sur la boutique publique avec un premier écran très visible.

Ces sous-lots sont indicatifs. Leur ordre exact peut évoluer selon les priorités du projet.

## Validation attendue pour chaque écran migré

### Validation technique

- `pnpm run typecheck`
- tests e2e concernés relancés
- absence d’erreur runtime évidente

### Validation fonctionnelle

Vérifier que la migration ne modifie pas le comportement attendu :

- formulaires toujours soumis correctement
- messages d’erreur toujours visibles
- actions toujours disponibles
- redirections inchangées
- états métier inchangés

### Validation visuelle

Vérifier que l’écran migré gagne réellement en :

- hiérarchie
- cohérence
- lisibilité
- sobriété premium

sans tomber dans :

- l’effet décoratif excessif
- le contraste mal calibré
- la surcharge visuelle

## Signaux qu’un composant de thème est confirmé

Pendant V12-5, un composant de thème peut être considéré comme confirmé s’il :

- a été utilisé sur plusieurs écrans réels
- reste simple à intégrer
- n’a pas besoin d’une API complexe
- améliore clairement la cohérence
- ne dépend pas du métier Creatyss

Ces composants seront les meilleurs candidats à une stabilisation longue durée, voire plus tard à une extraction partielle vers `registry/*`.

## Signaux qu’un composant de thème doit être revu

Pendant V12-5, un composant doit être revu si :

- il exige trop de props pour fonctionner
- il devient trop spécifique à un seul écran
- il masque mal la structure réelle du contenu
- il pousse à contourner les tokens
- il ne réduit pas réellement la duplication

Dans ce cas, il faut simplifier, voire revenir à une composition plus locale.

## Anti-patterns à éviter

### 1. Migrer trop d’écrans dans un même incrément

Cela réduit fortement la lisibilité du travail et rend les validations plus fragiles.

### 2. Refaire la logique en même temps que le style

V12-5 est un lot de diffusion de la couche UI, pas un lot de refonte métier.

### 3. Ajouter des composants de thème à usage unique

Si un composant n’a qu’un usage écran très local, il doit rester dans la feature jusqu’à preuve du contraire.

### 4. Casser la sobriété du projet

Le projet doit devenir plus premium, pas plus chargé.

### 5. Transformer V12-5 en faux registry

Le but est d’éprouver les patterns dans le produit réel, pas de les empaqueter trop tôt.

## Suite logique après V12-5

Après une première vague de migration progressive, la suite logique pourra être :

- consolidation des composants de thème confirmés
- nettoyage de certaines duplications résiduelles
- décision sur une extraction partielle ou non de certains patterns vers `registry/*`
- nouveaux lots UI si une zone du projet reste visuellement en retard

## Résumé

V12-5 est le lot qui diffuse réellement la V12 dans le produit.

Il ne s’agit pas d’une refonte massive, mais d’une série d’incréments sûrs visant à :

- appliquer les composants de thème sur des écrans réels
- renforcer la cohérence visuelle du projet
- confirmer ce qui mérite d’être durablement réutilisé
- préparer, sans précipitation, un socle e-commerce plus propre et plus réutilisable.
