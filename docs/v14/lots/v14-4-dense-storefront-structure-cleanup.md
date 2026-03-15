# V14-4 — Dense storefront structure cleanup

## Objectif du lot

Le lot V14-4 marque l’entrée dans la zone la plus sensible de la V14.

Après les familles de texte, métadonnées et helpers simples, ce lot s’intéresse aux classes storefront plus denses et plus structurelles, là où le CSS custom restant porte encore une part importante de l’organisation visuelle de l’interface.

L’objectif n’est pas de forcer leur suppression, mais d’évaluer jusqu’où il est raisonnable de les remplacer sans dégrader la lisibilité du code ni rouvrir une refonte large du storefront.

## Intention

V14-4 est un lot de cleanup prudent sur les structures denses.

Il vise à traiter, sous-famille par sous-famille, les classes encore très présentes dans des écrans centraux comme :

- la fiche produit
- le panier
- le checkout
- les déclinaisons produit

Ce lot doit rester gouverné par un principe simple :

> si le remplacement local est propre, stable et lisible, il peut être fait ; sinon, la classe doit être conservée comme structure encore légitime.

## Résultat attendu

À l’issue de V14-4, le projet doit idéalement :

- avoir clarifié le statut des grandes familles structurelles storefront
- avoir supprimé les sous-familles vraiment remplaçables proprement
- avoir conservé explicitement celles qui restent plus lisibles en CSS global
- éviter toute régression de layout ou de responsive
- ne produire aucun changement métier

## Ce que couvre ce lot

V14-4 couvre :

- l’audit des classes storefront structurelles denses
- leur qualification par sous-famille
- leur remplacement local si le gain est réel et le coût acceptable
- la suppression de règles CSS réellement mortes
- la documentation des sous-familles laissées en place

## Ce que ce lot ne couvre pas

V14-4 ne couvre pas :

- une refonte générale du storefront
- une réécriture complète des pages produit, panier ou checkout
- la création d’un nouveau design system
- des changements métier ou serveur
- une passe opportuniste sur des zones éditoriales non liées

## Cibles probables

Les familles les plus probables dans ce lot sont :

- `.product-*`
- `.variant-*`
- `.cart-*`
- `.checkout-*`

L’audit doit partir de l’état réel du repo, et le lot doit procéder par sous-familles cohérentes, pas en bloc global.

## Nature des patterns ciblés

Ces classes ne sont plus de simples styles de texte ni de petits helpers.

Elles portent souvent :

- des grilles
- des groupes de blocs
- des espacements structurants
- des wrappers de formulaires
- des sous-sections entières de pages storefront

Cela signifie que leur remplacement est possible seulement si :

- il reste lisible
- il ne fragilise pas le responsive
- il n’introduit pas trop de bruit dans le markup
- il ne crée pas une duplication excessive

## Questions auxquelles le lot doit répondre

### 1. La famille est-elle monolithique ou divisible ?

Une famille comme `.product-*` peut contenir des sous-classes très différentes. Le lot doit repérer ce qui peut être traité séparément.

### 2. Certaines sous-familles sont-elles déjà presque locales ?

Si certaines règles n’ont plus qu’un petit nombre d’usages très homogènes, elles peuvent devenir de bons candidats à suppression.

### 3. Le remplacement local rend-il le code plus clair ?

Si le résultat alourdit fortement le markup ou disperse des conventions utiles, le cleanup n’est pas un gain.

### 4. Le responsive reste-t-il parfaitement contrôlé ?

Une structure storefront dense ne doit jamais être simplifiée au prix d’une régression subtile sur mobile ou tablette.

### 5. La règle CSS devient-elle réellement morte ?

La suppression ne doit intervenir que lorsque les usages ont réellement disparu.

## Principes de décision

### 1. Traiter par sous-famille, jamais en bloc

Par exemple :

- une sous-famille liée à une grille de résumé peut être traitée
- une autre sous-famille liée à la structure profonde d’une page peut être conservée

### 2. Conserver ce qui reste meilleur en CSS global

Une structure encore claire, stable et concise en CSS global n’a pas à être sacrifiée si son remplacement dégrade la maintenabilité.

### 3. Nettoyer seulement quand le gain est net

Le gain doit être visible en clarté, en cohérence ou en réduction réelle de dépendance au global CSS.

### 4. Ne pas rouvrir un écran complet sans nécessité

Si traiter une sous-famille impose de refaire tout un écran, elle n’est probablement pas prête pour ce lot.

## Méthode recommandée

Le déroulé recommandé est :

1. lister les familles structurelles denses encore actives
2. les découper en sous-familles réelles
3. qualifier chaque sous-famille :
   - à conserver
   - à remplacer maintenant
   - à repousser
4. choisir seulement les sous-familles au meilleur ratio gain / risque
5. appliquer les remplacements localement
6. vérifier si certaines règles deviennent mortes
7. supprimer uniquement les règles prouvées inutiles
8. lancer le typecheck
9. documenter clairement les décisions

## Validation attendue

### Validation technique

- `pnpm run typecheck`
- aucune suppression CSS injustifiée
- aucun changement de comportement métier

### Validation visuelle

Vérifier en particulier :

- le responsive mobile
- les layouts tablette
- les zones panier / checkout / produit
- les espacements structurants
- la lisibilité générale

### Validation fonctionnelle

Vérifier que les flux critiques restent identiques :

- ajout au panier
- modification quantité
- checkout
- confirmation de commande
- affichage des variantes

## Anti-patterns à éviter

### 1. Confondre cleanup et refonte

Si le lot commence à redessiner les écrans, il sort de son périmètre.

### 2. Toucher plusieurs grandes familles sans hiérarchie

Le lot doit rester lisible et fragmenté par sous-famille.

### 3. Dégrader le responsive pour gagner quelques lignes de CSS

Ce serait un mauvais échange.

### 4. Introduire du Tailwind inline excessif

Le but n’est pas de remplacer un CSS global propre par une surcharge illisible dans le JSX.

## Livrables attendus

Le lot doit idéalement produire :

- un audit par sous-famille
- un petit nombre de remplacements réellement justifiés
- la suppression éventuelle de règles devenues mortes
- une documentation explicite des sous-familles conservées

## Suite logique

Une fois V14-4 terminé, la suite logique est :

### V14-5 — Editorial cleanup

Ce lot pourra traiter les classes éditoriales restantes si elles sont peu nombreuses et encore simplifiables.

## Résumé

V14-4 est le lot le plus sensible de la V14.

Il ne vise pas à faire disparaître coûte que coûte les structures storefront encore denses, mais à déterminer jusqu’où leur cleanup reste raisonnable, utile et maintenable.

Le principe doit rester :

- sous-famille par sous-famille
- nettoyage seulement si le gain est net
- conservation explicite quand le CSS global reste la meilleure option
