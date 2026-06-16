# Cadrage — `commerce.discounts` niveau `rules`

**Date :** 2026-06-15
**Statut :** cadrage court + premier lot borné exécuté

## Objectif

Définir la prochaine marche réelle de `commerce.discounts` après le niveau
`simple` déjà en place.

Le but du niveau `rules` n'est plus seulement de gérer un référentiel admin de
remises : il doit produire un **effet storefront/checkout observable** et
persisté sur la commande, tout en restant borné.

## État réel du repo

### Ce qui existe déjà

- `commerce.discounts` est seedé et pilotable par niveau.
- `/admin/marketing/discounts` expose un CRUD admin borné au niveau `simple`.
- Le modèle Prisma est déjà riche :
  - `Discount`
  - `DiscountCode`
  - `DiscountRedemption`
  - `DiscountProductTarget`
  - `DiscountVariantTarget`
  - `DiscountCategoryTarget`
- Les types `DiscountType` et `DiscountScopeType` couvrent déjà :
  - `PERCENTAGE`
  - `FIXED_AMOUNT`
  - `FREE_SHIPPING`
  - scopes `ORDER`, `PRODUCT`, `PRODUCT_VARIANT`, `CATEGORY`

### Ce qui n'existe pas encore

- aucune session checkout/cart dédiée à une remise ;
- aucun calcul intermédiaire de remise dans le panier ;
- `lineDiscountAmount` reste forcé à `0` sur toutes les lignes ;
- aucune utilisation de `DiscountCode` ;
- aucun support `FREE_SHIPPING` ;
- aucun ciblage `PRODUCT`, `PRODUCT_VARIANT` ou `CATEGORY`.

## Conséquence structurante

Le niveau `rules` n'est **pas** un micro-ajout local au module admin
`marketing/discounts`.

C'est un lot transverse qui touche au minimum :

- storefront checkout ;
- éventuellement référentiel/session panier ;
- résolution métier des remises ;
- création de commande ;
- affichage des montants.

## Recommandation de périmètre

Premier lot `rules` recommandé :

- **code promo manuel** saisi au checkout ;
- **scope `ORDER` uniquement** ;
- types couverts :
  - `PERCENTAGE`
  - `FIXED_AMOUNT`
- **une seule remise appliquée à la fois** ;
- aucune remise automatique ;
- aucun ciblage produit/variante/catégorie ;
- pas de `FREE_SHIPPING` dans cette première marche ;
- persistance d'un montant de remise global sur la commande ;
- alimentation minimale de `DiscountRedemption`.

Autrement dit : ouvrir l'effet métier réel le plus petit possible, sans essayer
de consommer d'un coup tout le schéma Prisma déjà disponible.

## Pourquoi ce cadrage

- le checkout public ne possède aujourd'hui aucun point d'entrée UI pour une
  remise ;
- la commande ne calcule encore aucune remise ;
- ouvrir d'emblée `PRODUCT` / `CATEGORY` imposerait aussi une ventilation ligne
  par ligne et donc un chantier plus risqué ;
- `FREE_SHIPPING` ajoute un second axe de calcul car la remise porte alors sur
  `shippingAmount`, pas seulement sur le sous-total ;
- la doctrine du domaine impose une application explicable, non incohérente et
  non cumulative par surprise.

## Points d'intégration à prévoir

### Storefront / checkout

- ajout d'un champ explicite `Code promo` dans `app/(public)/checkout/page.tsx` ;
- feedback opératoire clair :
  - code appliqué ;
  - code invalide ;
  - code expiré ;
  - code inactif ;
  - code non applicable ;
- récapitulatif des montants mis à jour avec ligne `Remise`.

### Session / état de checkout

Le repo n'a pas aujourd'hui de session dédiée à une remise. Il faut trancher un
support borné :

Décision prise dans ce lot :

- ne pas ajouter de champ `discountCode` à `Checkout` dans cette première
  marche ;
- porter le code promo via l'URL `/checkout?discount=...` et le relayer dans
  les formulaires serveur ;
- recalculer côté repo commande juste avant persistance.

Pourquoi :

- la saisie se fait au checkout ;
- le repo n'avait aucun contrat draft pour cette donnée ;
- on garde un lot petit, sans migration Prisma ni nouvelle session parallèle.

### Résolution métier

Créer un point d'accès dédié, par exemple côté `features/commerce/discounts`,
qui :

- charge la remise à partir d'un code ;
- vérifie son statut ;
- vérifie `startsAt` / `endsAt` ;
- vérifie que le scope est `ORDER` ;
- vérifie que le type est supporté par ce lot ;
- vérifie les plafonds simples si activés ;
- retourne un résultat explicable, pas seulement un booléen.

### Création de commande

`features/commerce/orders/lib/order.repository.ts` devra :

- relire le code promo sélectionné ;
- recalculer la remise de manière autoritative ;
- persister `discountAmount` ;
- recalculer `totalAmount` avec remise ;
- éventuellement répartir ou laisser `lineDiscountAmount` à `0` dans ce premier
  lot.

Recommandation :

- **laisser `lineDiscountAmount` à `0` dans cette première marche** si la
  commande supporte un montant global cohérent et explicable.

Cela garde le lot plus petit, tant que l'on reste en scope `ORDER`.

### Historique de rédemption

Premier minimum cohérent :

- créer une ligne `DiscountRedemption` lors de la création de commande si une
  remise est effectivement appliquée ;
- rattacher `discountId`, `discountCodeId`, `orderId`, `customerId` si
  disponible, `amountApplied`.

## Invariants

- une remise inactive, expirée ou hors fenêtre ne s'applique jamais ;
- une remise n'entraîne jamais un total négatif ;
- le total affiché au checkout et le total persisté en commande doivent
  correspondre ;
- une seule remise appliquée dans ce premier lot ;
- aucune application silencieuse d'une seconde règle ;
- la validation storefront n'est jamais source de vérité finale : le calcul
  autoritatif se fait à la création de commande.

## Hors périmètre

- ciblage `PRODUCT`, `PRODUCT_VARIANT`, `CATEGORY` ;
- remplissage des tables `*Target` ;
- `FREE_SHIPPING` ;
- remises automatiques (`isAutomatic`) ;
- priorité/cumul (`priority`) ;
- multi-remises ;
- back-office de suivi analytique des rédemptions ;
- saisie de code promo dès le panier si on choisit checkout-only ;
- ventilation ligne par ligne obligatoire.

## Risques

- dérive vers une refonte complète du checkout ;
- double calcul incohérent entre UI checkout et commande persistée ;
- mauvaise gestion des arrondis sur pourcentage ;
- ambiguïté sur le support des plafonds de rédemption ;
- tentation d'ouvrir `FREE_SHIPPING` ou ciblage catalogue dans le même lot.

## Vérifications attendues

- typecheck ;
- test manuel checkout avec code valide ;
- test manuel checkout avec code invalide / inactif / expiré ;
- vérification du montant `discountAmount` en détail commande admin ;
- vérification que `totalAmount = subtotalAmount + shippingAmount - discountAmount` ;
- vérification qu'une commande sans code promo garde le comportement actuel ;
- si `DiscountRedemption` est alimenté : vérification de la ligne créée.

## Ordre recommandé de mise en oeuvre

1. lecture/résolution métier bornée d'un code promo `ORDER` ;
2. support draft checkout pour le code sélectionné ;
3. UI checkout minimale `Code promo` + message de retour ;
4. recalcul autoritatif dans `order.repository.ts` ;
5. persistance `DiscountRedemption` ;
6. mise à jour doc domaine + roadmap.

## Critère de fin

`commerce.discounts` atteint un vrai niveau `rules` quand un code promo
`ORDER` saisi au checkout modifie réellement une commande persistée, de façon
explicable et bornée, sans encore ouvrir les remises automatiques ni le ciblage
catalogue.

## Bilan d'exécution

Le premier lot borné `rules` a été implémenté.

### Ce qui est maintenant branché

- `app/(public)/checkout/page.tsx` expose un bloc `Code promo` gated
  `meetsFeatureLevel("commerce.discounts", "rules")` ;
- le checkout prévisualise la remise côté serveur via
  `resolveCheckoutOrderDiscount()` ;
- `saveGuestCheckoutAction` et `createOrderAction` préservent le code promo dans
  les redirects checkout ;
- `createOrderFromGuestCartToken()` relit et recalcule la remise de manière
  autoritative avant création de commande ;
- `discountAmount` est désormais persisté au niveau `Order` ;
- une ligne `DiscountRedemption` est créée quand une remise est réellement
  appliquée.

### Ce qui reste explicitement hors lot

- `DiscountCode` ;
- remises automatiques ;
- `FREE_SHIPPING` ;
- ciblage catalogue ;
- ventilation ligne par ligne (`lineDiscountAmount`) ;
- saisie du code promo dès le panier.

### Vérification exécutée

- `pnpm run typecheck` : OK
