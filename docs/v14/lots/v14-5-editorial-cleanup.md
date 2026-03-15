# V14-5 — Editorial cleanup

## Objectif du lot

Le lot V14-5 traite la dernière zone storefront non transactionnelle encore susceptible de contenir du CSS custom simplifiable : l’éditorial.

Après les familles de texte/meta, les helpers publics et les structures storefront plus denses, ce lot vise les classes encore actives autour des pages de type article ou contenu éditorial.

L’objectif n’est pas d’ouvrir un redesign du blog, mais de vérifier si les classes éditoriales restantes peuvent être réduites proprement sans dégrader la lisibilité du contenu.

## Intention

V14-5 est un lot de cleanup ciblé et prudent.

Il concerne des classes souvent moins nombreuses, plus localisées et plus simples à raisonner que les grosses structures produit/panier/checkout, mais qui touchent directement à la lecture de contenu.

Cela implique une contrainte forte :

- toute simplification doit préserver le confort de lecture
- le rendu éditorial doit rester stable
- la sobriété doit primer sur la chasse absolue au CSS global

## Résultat attendu

À l’issue de V14-5, le projet doit idéalement :

- avoir clarifié le statut des classes éditoriales restantes
- avoir supprimé celles qui peuvent être remplacées localement sans perte de qualité
- avoir conservé explicitement celles qui restent utiles pour la lisibilité éditoriale
- ne provoquer aucune régression visuelle de lecture
- ne toucher ni au métier ni au contenu

## Ce que couvre ce lot

V14-5 couvre :

- l’audit des classes éditoriales encore actives
- leur qualification par famille
- leur remplacement local si le gain est réel
- la suppression de règles CSS réellement mortes
- la documentation des classes éditoriales conservées

## Ce que ce lot ne couvre pas

V14-5 ne couvre pas :

- la refonte du blog
- la réécriture des templates éditoriaux
- les structures transactionnelles storefront
- des changements métier ou serveur
- la création d’un nouveau composant abstrait sans nécessité forte

## Cibles probables

Les classes les plus probables dans ce lot sont :

- `.article-*`

Selon l’état réel du repo, cela peut inclure par exemple :

- wrappers d’article
- zones de contenu
- images de couverture
- rythmes de lecture ou blocs de texte encore gérés en CSS global

## Nature des patterns ciblés

Les classes éditoriales ont une spécificité importante :

- elles ne sont pas forcément très nombreuses
- elles peuvent être très localisées
- mais elles affectent directement le confort de lecture

Cela signifie qu’une simplification n’est légitime que si :

- elle ne dégrade pas la lisibilité
- elle ne rend pas le markup inutilement verbeux
- elle ne casse pas les rythmes verticaux
- elle ne produit pas une typographie incohérente

## Questions auxquelles le lot doit répondre

### 1. La classe est-elle encore réellement utile au confort éditorial ?

Si oui, sa conservation peut être préférable à un remplacement local trop pauvre.

### 2. Le remplacement local est-il plus clair que la classe globale ?

Si le remplacement introduit beaucoup de bruit JSX pour un gain minime, il n’est pas souhaitable.

### 3. La classe est-elle isolée à un ou deux écrans ?

Si oui, un remplacement local peut devenir crédible.

### 4. La règle CSS devient-elle réellement morte ?

La suppression ne doit être faite que si plus aucun usage réel ne subsiste.

## Principes de décision

### 1. La lecture prime sur le cleanup

Le confort de lecture éditoriale est prioritaire sur la suppression de quelques lignes de CSS.

### 2. Un style éditorial clair peut rester global

Si une classe rend bien un besoin éditorial stable et localisé, elle peut être conservée.

### 3. Pas de refonte opportuniste

Le lot ne doit pas devenir une réécriture du blog ou de ses templates.

### 4. Nettoyer seulement quand le gain est net

Le cleanup doit réellement simplifier le code ou réduire la dépendance au CSS global sans détériorer le rendu.

## Méthode recommandée

Le déroulé recommandé est :

1. lister les classes éditoriales encore actives
2. repérer leurs usages exacts
3. qualifier chaque classe :
   - à conserver
   - à remplacer maintenant
   - à repousser
4. remplacer seulement les classes réellement prêtes
5. vérifier si certaines règles deviennent mortes
6. supprimer uniquement les règles prouvées inutiles
7. lancer le typecheck
8. documenter clairement la décision prise

## Validation attendue

### Validation technique

- `pnpm run typecheck`
- aucune suppression CSS injustifiée
- aucun changement de comportement

### Validation visuelle

Vérifier en particulier :

- la lisibilité de l’article
- les espacements verticaux
- la cohérence des titres, extraits et contenus
- le rendu de la couverture
- le confort de lecture sur mobile et desktop

### Validation fonctionnelle

Vérifier que les pages éditoriales restent identiques fonctionnellement.

## Anti-patterns à éviter

### 1. Nettoyer des classes éditoriales encore très bonnes

Un style global simple et stable peut rester en place s’il sert bien la lecture.

### 2. Rendre le markup trop bruyant

Un article ne doit pas devenir un amas de classes locales illisibles.

### 3. Mélanger cleanup et redesign éditorial

Le lot doit rester purement structurel et prudent.

### 4. Forcer une cohérence artificielle avec les écrans transactionnels

Le blog n’a pas forcément les mêmes besoins de structure ou de rythme que le checkout ou le panier.

## Livrables attendus

Le lot doit idéalement produire :

- un audit des classes éditoriales encore présentes
- un petit nombre de fichiers modifiés
- la suppression éventuelle de règles devenues mortes
- une justification claire des classes éditoriales conservées

## Suite logique

Une fois V14-5 terminé, la suite logique est :

### V14-6 — Final audit

Ce lot devra établir l’état final du CSS custom restant après toute la séquence V14, et documenter ce qui subsiste comme base résiduelle assumée.

## Résumé

V14-5 est un lot de cleanup éditorial prudent.

Il sert à vérifier si les dernières classes dédiées au contenu peuvent encore être simplifiées, sans sacrifier la lisibilité ni rouvrir une refonte du blog.
