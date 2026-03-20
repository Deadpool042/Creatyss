# Décisions V21-2B

## Décision 1 — Fonctions hors périmètre d'extraction V21-2B

### Décision prise

Les critères de fin de V21-2B nomment exclusivement cinq fonctions à extraire :

- `listPublishedProducts`
- `getPublishedProductBySlug`
- `loadPublishedVariantOffersByProductIds`
- `buildPublishedProductsWhere`
- `getPublishedProductsOrderBy`

Toute extraction au-delà de ce périmètre doit faire l'objet d'un lot explicite avec ses propres critères de fin.

Les quatre fonctions suivantes sont hors périmètre d'extraction au sens des critères de fin, mais leur traitement diffère structurellement. Elles se répartissent en deux sous-groupes.

### Sous-groupe 1 — reste dans la façade après V21-2B

- `mapFeaturedCategoryRecord` — reste dans `catalog.repository.ts`. Son seul appelant (`listHomepageFeaturedCategories`) reste également dans la façade. Aucun cycle de dépendance. Extraction reportée à un lot ultérieur explicite si le besoin est démontré.

### Sous-groupe 2 — quitte la façade comme effet de bord structurel nécessaire

Ces trois fonctions ne font PAS partie des critères de fin de V21-2B. Elles ne constituent pas une extension de périmètre. Elles se déplacent uniquement parce que garder ces fonctions dans `catalog.repository.ts` tout en extrayant leurs appelants créerait un cycle de dépendance interne → façade, interdit par la Décision 3 (règle d'import interne).

- `getNativeSimpleOfferFields` — se déplace dans le(s) fichier(s) `queries/` qui accueille(nt) `listPublishedProducts` et `getPublishedProductBySlug`. Ses deux seuls appelants sont ces deux fonctions à extraire. Déplacement contraint.
- `getPublishedProductIdsMatchingVariantColor` — se déplace dans le fichier `queries/` qui accueille `buildPublishedProductsWhere`. Son seul appelant est cette fonction à extraire. Fait une requête Prisma → appartient à `queries/` selon la doctrine. Déplacement contraint.
- `mapPublishedProductSummaryRecord` — extraite dans un nouveau fichier `helpers/product-summary.ts`. Ses appelants sont répartis : `listPublishedProducts` et `getPublishedProductBySlug` (à extraire) ET `listHomepageFeaturedProducts` et `listRecentPublishedProducts` (restent dans la façade). L'extraction dans `helpers/` est la seule résolution sans cycle : la façade et les fichiers `queries/` importent tous depuis `helpers/` (sens valide dans les deux cas).

### Conséquence

`mapFeaturedCategoryRecord` reste dans la façade. Les trois autres fonctions (`getNativeSimpleOfferFields`, `getPublishedProductIdsMatchingVariantColor`, `mapPublishedProductSummaryRecord`) quittent `catalog.repository.ts` dans le cadre de V21-2B, uniquement comme conséquence du déplacement de leurs appelants directs. Ces déplacements ne modifient pas les critères de fin, ne modifient pas les exports publics, et ne constituent pas une extension de périmètre.

## Décision 2 — Duplication locale de `uniqueBigIntIds` et `toDbId`

### Décision prise

Les fonctions `uniqueBigIntIds` et `toDbId` sont dupliquées localement dans les fichiers qui en ont besoin. Elles ne sont pas extraites dans un fichier partagé dans ce lot.

### Raison

Ces fonctions sont déjà dupliquées entre `catalog.repository.ts`, `helpers/primary-image.ts` et `helpers/category-representative-image.ts` après V21-2A. La création d'un fichier partagé pour deux petites fonctions utilitaires n'est pas listée dans le périmètre de V21-2B et introduirait un couplage supplémentaire entre les fichiers internes de la façade.

### Conséquence

Si un nouveau fichier créé dans `queries/` lors de V21-2B utilise ces fonctions, il peut les dupliquer localement. Cette décision est locale au domaine `catalog` et ne préjuge pas du traitement des autres domaines. Elle pourra être reconsidérée dans un lot ultérieur dédié.

## Décision 3 — Règle d'import interne pour les fichiers extraits

### Décision prise

Les fichiers extraits dans `queries/` et `helpers/` importent leurs types depuis `./types/outputs.ts` (ou `../types/outputs.ts` selon la profondeur), jamais depuis `catalog.types.ts`.

### Raison

`catalog.types.ts` est la façade publique de types. Elle ré-exporte depuis `types/outputs.ts`. Les fichiers internes ne doivent pas importer depuis la façade publique : ils doivent importer depuis la source de vérité interne.

Référence : doctrine V21, section "Règle d'import interne".

### Conséquence

Les imports internes pointent vers `db/repositories/catalog/types/outputs.ts`. Aucun fichier créé en V21-2B ne doit introduire d'import depuis `catalog.types.ts`.

## Décision 4 — `catalog.mappers.ts` hors périmètre

### Décision explicitement non prise

Le lot ne déplace pas, ne modifie pas, ne réorganise pas `db/repositories/catalog/catalog.mappers.ts`.

### Raison

`catalog.mappers.ts` n'est pas nécessaire pour atteindre les critères de fin de V21-2B. Son redécoupage ne figure pas dans le périmètre du lot. Le traiter dans ce lot introduirait un risque supplémentaire sans bénéfice documenté.

### Conséquence

`catalog.mappers.ts` reste à sa position actuelle après V21-2B. Sa clarification est reportée à un lot ultérieur explicite si le besoin est démontré.

## Décision 5 — Façade publique inchangée

### Décision prise

Les exports publics de `catalog.repository.ts` et `catalog.types.ts` restent identiques avant et après le lot.

### Raison

V21-2B est un refactoring interne de la façade de lecture. Il ne modifie pas les contrats publics. Les consumers dans `app/`, `features/` et `components/` ne doivent nécessiter aucun recâblage.

### Conséquence

Les fonctions `listPublishedProducts`, `getPublishedProductBySlug`, etc. restent exportées depuis `catalog.repository.ts`. Elles sont déléguées vers les nouveaux fichiers internes, mais le point d'entrée public reste stable. Aucune modification de consumer n'est requise ni autorisée dans ce lot.

## Règles de compatibilité retenues

Règles appliquées pendant le lot :

- aucun changement de chemin public
- aucun changement de signature runtime
- aucun changement de contrat public exporté
- aucun changement de comportement sur le listing catalogue
- aucun changement de comportement sur le détail produit
- aucun changement sur l'ordering actuel de `listPublishedProducts`
- aucun changement sur le filtrage `onlyAvailable` en mémoire
- aucun changement sur la dérivation de `simpleOffer`
- aucun changement sur la dérivation de `isAvailable`
- aucune introduction de N+1

## Hypothèses explicites retenues dans cette documentation

- V21-2A a été réalisé avant V21-2B
- V21-2B ne modifie pas les consumers hors `catalog/**`
- les critères de fin de V21-2B sont ceux documentés dans `docs/v21/lots/v21-2b-catalog-coeur.md`
- toute extraction supplémentaire au-delà des cinq fonctions listées dans les critères de fin nécessite un lot dédié
