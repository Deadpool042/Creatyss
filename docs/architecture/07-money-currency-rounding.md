# Money, devises et règles d’arrondi

## Objectif

Ce document fixe les principes monétaires du socle e-commerce premium+++.

Il définit :

- la façon de représenter l’argent dans le socle
- la place des devises
- la différence entre devise boutique, devise d’affichage et devise de calcul
- les règles d’arrondi
- les invariants à respecter dans tous les domaines manipulant des montants

Ce document est structurant pour :

- `pricing`
- `discounts`
- `taxation`
- `shipping`
- `checkout`
- `orders`
- `documents`
- `analytics`
- certaines `integrations`

## Principe fondamental

Le socle ne manipule jamais un montant monétaire comme un simple nombre isolé.

Un montant doit toujours être porté avec sa devise explicite.

Le socle ne doit jamais reposer sur des hypothèses implicites du type :

- « tous les montants sont en EUR »
- « un nombre suffit à représenter un prix »
- « l’arrondi peut être laissé au hasard du runtime »

## Représentation de l’argent

## Règle principale

Les montants sont représentés en unité entière minimale.

Exemple :

- euro → centimes
- dollar → cents

Cela évite les imprécisions liées aux flottants.

## Type conceptuel recommandé

```ts
export type Money = {
  amountMinor: number;
  currencyCode: string;
};
```

### Règle

- `amountMinor` est toujours un entier
- `currencyCode` est toujours explicite

## Représentations interdites

### Interdit

```ts
const price = 12.99;
```

### Interdit

```ts
type Total = {
  subtotal: number;
};
```

### Autorisé

```ts
type Total = {
  subtotal: Money;
};
```

## Devise boutique, devise de calcul, devise d’affichage

Le socle doit distinguer plusieurs notions.

### Devise boutique par défaut

C’est la devise principale de la boutique.

Exemple :

- EUR pour Creatyss

Elle est portée par `store`.

### Devise de calcul

C’est la devise réellement utilisée pour un calcul donné.

Exemple :

- un pricing panier en EUR
- un flux international en USD si la capability multi-devises est activée

### Devise d’affichage

C’est la devise affichée à l’utilisateur.

Dans certains cas, elle peut coïncider avec la devise de calcul.
Dans d’autres, le socle doit prévoir leur distinction si le modèle l’exige.

## Capability multi-devises

La capacité multi-devises doit être pilotée par :

- `store`
- la capability `multiCurrency`

### Si `multiCurrency = false`

- une seule devise est autorisée pour la boutique
- tous les montants runtime utilisent cette devise
- aucun choix de devise n’est exposé
- aucune conversion dynamique n’est autorisée

### Si `multiCurrency = true`

Le socle doit être capable de porter :

- devise par boutique
- devises supportées
- devise de calcul
- devise d’affichage
- règles de conversion
- politique d’arrondi associée

## Domaines concernés

## `pricing`

Responsable de l’orchestration monétaire.

Il assemble :

- subtotal
- discounts
- shipping
- taxes
- accises
- total estimé

Tous les agrégats doivent être monétaires et cohérents en devise.

## `discounts`

Les remises doivent être exprimées :

- soit en pourcentage
- soit en montant fixe avec devise explicite

Un montant fixe sans devise explicite est interdit.

## `shipping`

Les quotes de livraison doivent être monétaires.

Exemple :

```ts
export type ShippingQuote = {
  methodCode: string;
  amount: Money;
};
```

## `taxation`

Les breakdowns fiscaux doivent être monétaires.

## `orders`

La commande figée doit conserver les montants définitifs avec devise explicite.

## `documents`

Les factures, avoirs et exports doivent s’appuyer sur des montants cohérents avec la devise de la commande ou du document.

## Règles d’arrondi

## Principe

Les règles d’arrondi doivent être déterministes, centralisées et explicites.

Il ne doit jamais exister :

- d’arrondi implicite dispersé dans différents domaines
- d’écart non expliqué entre UI, checkout, documents et analytics

## Niveaux d’arrondi à distinguer

### 1. Arrondi de montant unitaire

Exemple :

- prix unitaire calculé ou converti

### 2. Arrondi par ligne

Exemple :

- prix unitaire × quantité

### 3. Arrondi de total agrégé

Exemple :

- sous-total panier
- total taxes
- total commande

### 4. Arrondi documentaire

Exemple :

- facture
- avoir
- export comptable

Le socle doit définir une politique cohérente entre ces niveaux.

## Politique recommandée

### Règle 1

Tous les calculs intermédiaires évitent les flottants et restent dans des représentations contrôlées.

### Règle 2

Le socle centralise les arrondis dans `pricing` ou dans une couche monétaire dédiée.

### Règle 3

`orders` et `documents` ne recalculent pas librement des montants déjà figés. Ils consomment les montants validés et figés.

### Règle 4

Les domaines périphériques ne doivent pas inventer leurs propres règles d’arrondi.

## Type conceptuel recommandé pour la politique monétaire

```ts
export type MoneyRoundingPolicy = {
  currencyCode: string;
  scale: number;
  roundingMode: "half_up";
};
```

## Convention minimale de départ

Pour la V1 du socle :

- arrondi décimal classique de type `half_up`
- représentation en minor units entières
- un seul comportement d’arrondi de référence par devise

## Taxes et arrondis

Les taxes sont une source fréquente d’écarts.

Le socle doit éviter :

- de recalculer différemment les taxes au panier, au checkout et au document final
- d’avoir des règles divergentes entre runtime et documents

### Règle

Le calcul de taxes doit passer par une logique centralisée.

Le résultat retenu pour la commande doit ensuite être figé.

## Discounts et arrondis

Les remises en pourcentage doivent avoir une politique explicite d’arrondi.

Exemple :

- remise calculée sur une ligne
- remise calculée sur le total panier

Le socle doit choisir un modèle et s’y tenir.

### Règle

La logique de discount ne doit pas arrondir de manière arbitraire localement.
Elle doit passer par la politique monétaire commune.

## Conversion de devise

Si le multi-devises est activé, la conversion de devise doit être traitée explicitement.

### Le socle doit distinguer :

- montant source
- devise source
- devise cible
- taux appliqué
- date ou contexte du taux
- politique d’arrondi post-conversion

## Interdictions

### Interdit

Convertir un montant sans tracer la devise source et la devise cible.

### Interdit

Appliquer des conversions implicites dans des composants UI.

### Interdit

Laisser chaque domaine faire sa propre conversion librement.

## Invariants monétaires

- un montant n’existe jamais sans devise explicite
- les montants sont représentés en unités mineures entières
- les règles d’arrondi sont centralisées
- les domaines périphériques ne définissent pas leurs propres règles d’arrondi métier
- la devise boutique par défaut est portée par `store`
- le multi-devises dépend d’une capability explicite
- les montants figés de commande ne sont pas recalculés librement par d’autres domaines

## Cas concrets de référence

### Panier simple en devise unique

- devise boutique : EUR
- `multiCurrency = false`
- subtotal, shipping, taxes et total sont tous en EUR
- aucune conversion n’est autorisée

### Boutique multi-devises

- devise par défaut : EUR
- devises supportées : EUR, USD
- capability `multiCurrency = true`
- le pricing doit expliciter la devise de calcul
- les documents et commandes doivent conserver la devise réellement retenue

### Remise fixe

Une remise fixe doit toujours être attachée à une devise.

Exemple correct :

```ts
const discount = {
  amount: {
    amountMinor: 1000,
    currencyCode: "EUR",
  },
};
```

### Quote de livraison

Une quote de livraison doit être monétaire.

Exemple correct :

```ts
const quote = {
  methodCode: "colissimo_home",
  amount: {
    amountMinor: 790,
    currencyCode: "EUR",
  },
};
```

## Anti-patterns interdits

### 1. Utiliser des flottants pour les montants métier

Exemple interdit :

- `12.99`

### 2. Oublier la devise

Exemple interdit :

- `subtotal = 10990`

### 3. Mélanger montants de devises différentes dans un même agrégat

Sans conversion explicite, c’est interdit.

### 4. Laisser le frontend décider de l’arrondi final

Le frontend affiche. Il ne décide pas la règle métier finale.

### 5. Recalculer librement les totaux au moment des documents

Les documents doivent consommer les montants figés ou la même logique centrale validée.

## Décisions closes

- l’argent est représenté en unités mineures entières
- un montant est toujours associé à une devise explicite
- les arrondis sont centralisés et déterministes
- `store` porte la devise par défaut de la boutique
- le multi-devises dépend d’une capability explicite
- les règles monétaires doivent être cohérentes entre pricing, checkout, orders et documents
