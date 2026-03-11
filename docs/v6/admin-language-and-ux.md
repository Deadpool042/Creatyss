# V6 — Langage admin et UX produit

## Objectif

Définir un langage admin simple, stable et compréhensible, ainsi qu’une structure d’écran produit claire pour l’administration Creatyss.

Ce document sert de référence pour :

- les libellés visibles dans l’admin
- la structure des écrans produit
- le vocabulaire métier autorisé
- les termes techniques à ne pas exposer
- la lisibilité du code lié à l’admin produit

Ce document complète `AGENTS.md` et doit guider les lots V6 qui touchent :

- l’admin produit
- les formulaires produit
- les lectures/écritures admin
- les libellés UI
- les cas de compatibilité transitoire

## Principe directeur

L’admin doit rester compréhensible par une utilisatrice non technique.

Le modèle visible dans l’interface doit suivre le métier, pas la structure technique interne.

Autrement dit :

- l’admin montre un **produit**
- un produit peut être **simple** ou **avec déclinaisons**
- un produit simple se gère via ses **informations de vente**
- un produit avec déclinaisons se gère via ses **déclinaisons**
- les notions internes de compatibilité ou de transition ne doivent pas structurer le parcours principal

## Vocabulaire officiel admin

### Types de produit

- **Produit simple**
- **Produit avec déclinaisons**

### Sections d’écran

- **Informations générales**
- **Informations de vente**
- **Déclinaisons**
- **Images**
- **Organisation**
- **Publication**
- **SEO**

### Champs métier

- **Nom du produit**
- **Slug**
- **Description**
- **Référence**
- **Prix**
- **Prix barré**
- **Stock**
- **Catégorie**
- **Image principale**
- **Galerie**
- **Couleur**
  si le produit possède des déclinaisons couleur

## Termes interdits dans l’UI principale

Ne pas exposer comme vocabulaire normal de l’admin :

- produit parent
- produit vendable
- variante technique
- compatibilité legacy
- fallback
- compareAtPrice
- simpleOffer
- product_variants
- lecture native
- compatibilité transitoire

Ces notions peuvent exister dans le code, dans des commentaires techniques ciblés ou dans un encart de maintenance exceptionnel, mais jamais comme chemin principal d’édition.

## Règles de formulation UI

- Utiliser un vocabulaire simple, direct et métier.
- Préférer les libellés courts.
- Éviter tout terme d’architecture interne.
- Préférer **prix barré** à **prix comparé**.
- Préférer **produit avec déclinaisons** à **produit variable** dans l’interface visible.
- Préférer **informations de vente** à des formulations techniques liées au modèle de données.

## Structure cible — Création produit

La création d’un produit doit commencer par un choix clair de type :

### Type de produit

- **Produit simple**
  Un seul prix, un seul stock, une seule offre de vente.

- **Produit avec déclinaisons**
  Plusieurs déclinaisons, par exemple par couleur, avec prix, stock et images selon chaque déclinaison.

### Règles UX

- Ce choix doit être explicite dès le départ.
- Le choix doit orienter les écrans suivants.
- L’admin ne doit pas avoir à comprendre une structure parent / vendable.
- Aucun terme technique de compatibilité ne doit être affiché à cette étape.

## Structure cible — Détail produit simple

Un produit simple doit être édité via une structure simple et directe.

### Sections recommandées

1. **Informations générales**
2. **Images**
3. **Organisation**
4. **Informations de vente**
5. **Publication**
6. **SEO**

### Informations de vente

Pour un produit simple, cette section doit contenir au minimum :

- Référence
- Prix
- Prix barré
- Stock

### Règles UX

- Les informations de vente sont le chemin principal.
- L’utilisatrice doit pouvoir comprendre immédiatement où modifier le prix et le stock.
- Aucun bloc technique de variante ne doit être le point d’entrée principal d’édition.
- Si une compatibilité interne existe encore, elle doit rester secondaire.

## Structure cible — Détail produit avec déclinaisons

Un produit avec déclinaisons doit être édité via une structure orientée déclinaisons.

### Sections recommandées

1. **Informations générales**
2. **Images**
3. **Organisation**
4. **Déclinaisons**
5. **Publication**
6. **SEO**

### Déclinaisons

Chaque déclinaison doit pouvoir exposer clairement :

- Couleur
- Référence
- Prix
- Prix barré
- Stock
- Images associées

### Règles UX

- Les déclinaisons sont le chemin principal d’édition.
- Le produit lui-même ne doit pas afficher une structure ambiguë entre parent et vendable.
- L’écran doit faire comprendre rapidement qu’on gère plusieurs variantes commerciales d’un même produit.

## Règles de compatibilité transitoire

Pendant la V6, certaines compatibilités internes peuvent encore exister.

Ces compatibilités doivent respecter les règles suivantes :

- ne pas structurer le parcours principal
- ne pas imposer de vocabulaire technique à l’utilisatrice
- ne pas compliquer l’écran principal
- rester secondaires et clairement séparées
- être visibles seulement quand elles sont utiles pour comprendre une limitation ou corriger un état incohérent

## États incohérents

Si un produit se trouve dans un état technique incohérent, l’admin doit :

- afficher un message clair
- expliquer simplement le problème
- éviter les termes internes inutiles
- ne jamais résoudre silencieusement un cas ambigu
- proposer un chemin d’action compréhensible quand c’est possible

L’objectif n’est pas de masquer l’état incohérent, mais de l’exprimer sans jargon technique inutile.

## Lisibilité attendue côté code

Le code qui porte l’admin produit doit suivre l’intention métier visible dans l’interface.

### Principes

- privilégier les noms métier explicites
- garder des responsabilités claires
- éviter les gros fichiers
- séparer validation, lecture/écriture, métier et UI
- isoler la compatibilité transitoire dans des zones identifiables

### Exemples de noms souhaitables

- `getAdminProductDetail`
- `updateSimpleProductOffer`
- `updateVariantOffer`
- `resolveSimpleProductOffer`
- `syncLegacySimpleVariant`

### Exemples de noms à éviter

- `handleProductData`
- `processSellable`
- `resolveParentState`
- `buildLegacyPayload`
- `syncCommercialNode`

## Règles pour les prochains lots V6

Tout lot V6 qui touche l’admin produit doit vérifier explicitement :

- que le vocabulaire UI reste métier et compréhensible
- que le produit simple se gère par ses informations de vente
- que le produit avec déclinaisons se gère par ses déclinaisons
- que les notions techniques internes ne deviennent pas le chemin principal
- que la compatibilité transitoire reste secondaire et isolée
- que le code reste lisible par intention métier

## Résumé opérationnel

La norme admin V6 est la suivante :

- un **produit simple** se gère directement via ses **informations de vente**
- un **produit avec déclinaisons** se gère via ses **déclinaisons**
- l’admin parle un langage métier simple
- les détails techniques internes ne doivent pas piloter l’expérience principale
- la lisibilité métier doit guider à la fois l’UI et le code
