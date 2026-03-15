# V13-1 — Stable pattern cleanup

## Objectif du lot

Le lot V13-1 ouvre la V13 avec un périmètre volontairement limité.

Après la V12 et son audit final, le projet n’est plus dans une phase de migration UI massive. La base visuelle est globalement stabilisée, les composants principaux sont en place, et le CSS global restant est majoritairement vivant et assumé.

L’objectif de V13-1 n’est donc pas de relancer une refonte générale, mais de traiter les derniers patterns globaux simples qui peuvent encore être réduits proprement sans risque important.

## Intention

Ce lot sert à faire les derniers nettoyages UI à faible coût et à fort niveau de confiance.

On ne cherche pas ici à supprimer du CSS structurel complexe. On cible seulement des patterns encore globaux mais désormais assez isolés pour être remplacés par des styles locaux explicites ou par des composants UI déjà stabilisés.

## Résultat attendu

À l’issue de V13-1, le projet doit gagner en clarté sur les derniers détails de présentation encore partagés inutilement, tout en conservant une base très stable.

Le résultat attendu est :

- moins de petits patterns globaux ambigus
- plus de styles locaux explicites là où le coût est faible
- aucun changement métier
- aucune régression visuelle notable
- aucune abstraction supplémentaire non nécessaire

## Ce que couvre ce lot

V13-1 couvre :

- les derniers patterns globaux simples encore présents
- les petits remplacements locaux sûrs
- le cleanup de règles CSS réellement mortes après migration
- les harmonisations finales de détail quand elles sont clairement bénéfiques

## Ce que ce lot ne couvre pas

V13-1 ne couvre pas :

- la refonte des layouts storefront structurels
- la suppression systématique de tout le CSS global restant
- la création de nouveaux composants de thème abstraits
- une nouvelle vague de migration écran par écran
- des changements métier ou serveur

## Cibles probables

Les cibles typiques de ce lot peuvent être :

- `.meta-label` côté storefront, si certains usages peuvent être remplacés localement sans bruit
- `.eyebrow` dans les derniers composants résiduels encore dépendants du CSS global
- `.lead` sur des usages très isolés où un style inline explicite suffit
- quelques labels implicites ou petits helpers de formulaire encore hétérogènes côté storefront

Cette liste n’est pas une obligation exhaustive. Le lot doit partir de l’état réel du repo.

## Règle principale

On ne traite dans V13-1 que ce qui respecte les trois conditions suivantes :

1. le pattern est simple
2. le gain de clarté est réel
3. le risque de régression est faible

Si un pattern est encore fortement couplé à une structure d’écran, il ne relève plus de V13-1.

## Philosophie d’intervention

### 1. Précision avant volume

Le but n’est pas de multiplier les fichiers modifiés.

Un très petit lot ciblé, avec deux ou trois remplacements propres et une ou deux suppressions CSS sûres, est préférable à une passe large et bruyante.

### 2. Local explicite avant global résiduel

Quand un style n’a plus que très peu d’usages et qu’un remplacement local est lisible, il est préférable de le rendre explicite directement dans le composant concerné.

### 3. Aucune abstraction nouvelle sans besoin réel

V13-1 n’est pas un lot de création de nouveaux composants.

On réutilise ce qui existe déjà. On simplifie. On ne sur-construit rien.

## Exemples de décisions attendues

### Cas à traiter

- un `p.eyebrow` encore utilisé dans un seul composant, alors que le pattern brand inline est déjà standardisé ailleurs
- un `p.lead` isolé alors que le style peut être rendu localement de façon claire
- un dernier label implicite de formulaire storefront facile à remplacer par `Label`
- une règle CSS globale restante devenue morte après remplacement

### Cas à ne pas traiter

- un ensemble de classes `.product-*` ou `.checkout-*` encore structurellement utiles
- un bloc fortement couplé à la mise en page d’une fiche produit ou d’un tunnel de commande
- un pattern dont la migration demanderait de toucher plusieurs écrans complexes pour un gain mineur

## Méthode recommandée

Le déroulé recommandé est :

1. auditer les derniers patterns globaux simples encore actifs
2. choisir ceux qui ont le meilleur ratio gain / risque
3. faire un remplacement local minimal
4. vérifier s’il reste des règles CSS réellement mortes
5. supprimer uniquement ce qui est prouvé inutile
6. valider le typecheck et les écrans touchés

## Validation attendue

### Validation technique

- `pnpm run typecheck`
- aucune erreur runtime évidente
- aucune suppression CSS non justifiée

### Validation visuelle

Vérifier que les écrans touchés restent :

- cohérents avec les écrans déjà migrés
- lisibles
- sobres
- sans régression d’espacement ou de hiérarchie

### Validation fonctionnelle

Vérifier que les écrans touchés n’ont subi aucun changement de comportement.

## Anti-patterns à éviter

### 1. Ouvrir un faux grand chantier

V13-1 ne doit pas devenir une V12-bis.

### 2. Supprimer du CSS encore vivant

Le fait qu’une classe soit ancienne ne suffit pas à la supprimer. Elle doit être réellement inutile.

### 3. Forcer l’usage de composants partout

Si un style inline clair suffit, il est parfois préférable à une nouvelle abstraction.

### 4. Chercher l’uniformité absolue

Le but est la clarté et la stabilité, pas la disparition totale du CSS global.

## Livrables attendus

Le lot doit idéalement produire :

- un très petit nombre de fichiers modifiés
- un éventuel cleanup CSS limité et sûr
- un résumé précis des patterns traités
- une justification claire des patterns laissés en place

## Suite logique

Une fois V13-1 terminé, la suite logique est :

### V13-2 — Structural storefront CSS audit

Ce lot devra prendre le relais sur les classes encore structurelles, non plus pour les supprimer automatiquement, mais pour documenter clairement ce qui est désormais considéré comme du CSS storefront stable et assumé.

## Résumé

V13-1 est un lot de finition ciblée.

Il ne vise pas à transformer encore fortement le projet, mais à faire disparaître les derniers petits patterns globaux qui n’ont plus de raison claire d’exister, tout en conservant une base stable, lisible et explicitement maîtrisée.
