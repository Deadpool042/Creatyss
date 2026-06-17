# Cadrage — `commerce.discounts` niveau `automation`

**Date :** 2026-06-15
**Statut :** cadrage court + lot borné exécuté

## Objectif

Brancher la première marche fonctionnelle du niveau `automation` sans élargir
le modèle de remises déjà câblé au niveau `rules`.

Le but est d'autoriser une **remise `ORDER` appliquée automatiquement au
checkout et à la commande**, tout en conservant un comportement explicable,
déterministe et non cumulatif.

## Périmètre retenu

- une seule remise automatique retenue à la fois ;
- types supportés :
  - `PERCENTAGE`
  - `FIXED_AMOUNT`
- scope supporté :
  - `ORDER`
- priorité de résolution :
  - code manuel valide saisi par l'utilisateur ;
  - sinon remise automatique active la plus prioritaire ;
- persistance inchangée :
  - `discountAmount` sur la commande ;
  - `DiscountRedemption` si une remise est effectivement appliquée.

## Ce qui change réellement

### Métier

- le domaine `discounts` sait maintenant résoudre :
  - un code manuel ;
  - ou, à défaut, une remise automatique ;
- les remises automatiques respectent les mêmes garde-fous que les codes :
  - fenêtre d'activité ;
  - types supportés ;
  - borne du montant ;
  - limite `maxRedemptions` ;
  - cohérence devise pour `FIXED_AMOUNT`.

### Checkout

- le checkout affiche toujours le champ `Code promo` au niveau `rules` ;
- si aucun code n'est saisi et que le niveau effectif atteint `automation`,
  une remise automatique peut apparaître dans le récapitulatif ;
- si un code manuel invalide est saisi, on ne bascule pas silencieusement sur
  une remise automatique.

### Admin

- l'admin peut marquer une remise comme `Application automatique` seulement si
  le niveau effectif atteint `automation` ;
- la liste admin distingue les remises manuelles et automatiques.

## Invariants

- jamais plus d'une remise à la fois ;
- aucun cumul silencieux ;
- le code manuel garde priorité s'il est valide ;
- une remise automatique n'est jamais utilisée pour masquer un code invalide ;
- le total affiché au checkout doit rester aligné avec le total persisté.

## Hors périmètre

- `FREE_SHIPPING` ;
- ciblage `PRODUCT`, `PRODUCT_VARIANT`, `CATEGORY` ;
- UI admin de gestion de priorité ;
- cumul de plusieurs remises automatiques ;
- personnalisation par segment ou canal ;
- moteur de campagnes promotionnelles plus large.

## Vérifications attendues

- `pnpm run typecheck`
- test manuel checkout avec remise automatique seule
- test manuel checkout avec code valide prioritaire
- test manuel checkout avec code invalide sans fallback silencieux

## Bilan d'exécution

Le lot `automation` borné a été implémenté.

### Ce qui est maintenant branché

- l'admin peut cocher `Application automatique` sur une remise seulement si le
  niveau effectif atteint `automation` ;
- la liste admin distingue les remises manuelles et automatiques ;
- `resolveApplicableOrderDiscount()` conserve la priorité suivante :
  - code manuel valide ;
  - sinon remise automatique active la plus prioritaire ;
- si un code manuel invalide est saisi, aucun fallback silencieux ne bascule
  vers une remise automatique ;
- la commande persiste toujours `discountAmount` et une
  `DiscountRedemption` minimale quand une remise est effectivement appliquée.

### Ce qui reste explicitement hors lot

- `FREE_SHIPPING` automatique ;
- ciblage `PRODUCT`, `PRODUCT_VARIANT`, `CATEGORY` pour les remises automatiques ;
- UI admin de gestion de `priority` ;
- cumul de plusieurs remises automatiques ;
- personnalisation par segment ou canal.

### Vérification exécutée

- typecheck natif : OK
