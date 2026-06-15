<!-- docs/lots/2026-06-14-commerce-taxation-cadrage.md -->

# Cadrage — `commerce.taxation` (TVA par territoire)

> Prérequis bloquant du chantier factures
> (`docs/lots/2026-06-14-commerce-factures-cadrage.md`, section « Constat
> bloquant »). Aujourd'hui le système n'applique **aucune** TVA.
>
> **Nature : cadrage uniquement.** Aucune implémentation, aucune migration. Les
> décisions de schéma relèvent de `prisma-architect`, les arbitrages fiscaux de
> l'expert-comptable. Réserve : ce document n'est pas un conseil fiscal.

## Contexte

Décidé en amont (cadrage factures) : Creatyss vend **B2C**, en **métropole +
DOM-TOM** aujourd'hui, avec ambition **UE + hors-UE**. Les DOM-TOM imposent un
système **multi-taux et multi-territoire dès le départ**. La facture figera la
TVA ; encore faut-il que la commande la calcule. C'est l'objet de ce chantier.

## État actuel (audit)

### Aucune TVA calculée

`features/commerce/orders/lib/order.repository.ts` (création de commande) :
`taxAmount: 0`, `lineTaxAmount: 0`, `discountAmount: 0` **codés en dur**.
`lineSubtotalAmount = lineTotalAmount = unitPriceAmount × quantity`. Aucun appel
à un calcul fiscal. `commerce.taxation` : **L0 pur** — modèle Prisma seul,
`TaxRule` jamais référencé hors schéma, aucun code applicatif, aucun seed, aucune
UI admin. `feature-catalog.ts` ligne 46 : `key: "commerce.taxation"`.

### Modèle Prisma déjà adapté (pas de refonte nécessaire a priori)

`prisma/optional/commerce/taxation.prisma` (`L2`,
`DependsOn: foundation.store, catalog.products, catalog.pricing, commerce.orders`) :

- `TaxRule` : `countryCode` + `regionCode` (→ peut distinguer métropole vs DOM
  via région), `ratePercent Decimal(7,4)`, `isIncludedInPrice` (HT vs TTC),
  `scopeType` (`STORE|CATEGORY|PRODUCT|PRODUCT_VARIANT`), `status`
  (`DRAFT|ACTIVE|INACTIVE|ARCHIVED`), `startsAt`/`endsAt` (validité temporelle),
  `@@unique([storeId, code])`, index sur `(countryCode, regionCode, status)`.
- Ciblages : `TaxRuleProductTarget` / `TaxRuleVariantTarget` /
  `TaxRuleCategoryTarget`.
- **Le modèle couvre déjà multi-pays, multi-taux, ciblage et HT/TTC.** Le manque
  est applicatif (déterminer + calculer + persister), pas structurel — sauf la
  capture du résultat sur la commande (cf. D4).

### Modèle de prix : assiette ambiguë

`catalog/pricing.prisma` : `ProductPrice.amount` / `ProductVariantPrice.amount`
= un seul `Decimal(12,2)`, **sans marqueur HT/TTC**. La doctrine
(`docs/domains/optional/commerce/taxation.md`) pose `pricing` = **prix hors
taxe** (« n'est pas source de vérité pour les prix hors taxe (pricing) »,
« exposer les montants TTC/HT cohérents »), et `TaxRule.isIncludedInPrice`
défaut `false` va dans ce sens. Mais un e-commerce B2C FR affiche légalement des
prix **TTC** au consommateur. → **assiette à trancher (D1)**, c'est la décision
la plus structurante côté tarification.

### Doctrine

`docs/domains/optional/commerce/taxation.md` : taxation = source de vérité des
règles/taux/montants fiscaux ; consomme contexte produit/client/**géographique**
+ montants `pricing` ; expose HT/TTC cohérents ; invariants « taxe explicable »,
« cohérence contexte ». Questions ouvertes du doc (« multi-pays ? multi-taux ? »)
→ **tranchées ici : oui aux deux.**

## Taux de référence (vérifié web 2026-06-14, à valider expert-comptable)

- Métropole : 20 % (normal) / 10 / 5,5 / 2,1 %.
- Guadeloupe, Martinique, Réunion : **8,5 %** (normal) / 2,1 / 1,75 / 1,05 %.
- Guyane, Mayotte : **TVA non applicable** (exonéré, 0 %).
- Futur UE B2C : taux du pays de destination via OSS au-delà du seuil 10 000 € ;
  en deçà, taux FR. Hors-UE : exonération (export).

## Décisions verrouillées (2026-06-14, déléguées par Laurent)

Laurent ne maîtrisant pas la TVA, défauts B2C tranchés ci-dessous. **Les taux et
exonérations restent à valider par l'expert-comptable avant production.**

- **D1 — Assiette = TTC.** Prix produit = prix de vente consommateur (TTC),
  **identique sur tous les territoires**. `taxation` dérive HT et TVA par
  territoire via `isIncludedInPrice = true`. Le prix affiché ne change pas ; seule
  la ventilation HT/TVA varie (et la marge en DOM-TOM/exonéré).
  - ⚠️ **Divergence doctrine** : `taxation.md` pose « pricing = prix HT ». Le
    schéma supporte le TTC (`isIncludedInPrice`), mais la prose doctrinale doit
    être entérinée (`docs-keeper`). Signalé, non masqué.
- **D2 — Territoire = adresse de LIVRAISON, par code postal FR** (971 GP, 972 MQ,
  973 GF, 974 RE, 976 YT → DOM ; sinon métropole). Future UE/hors-UE par
  `countryCode`.
- **D3 — Résolution par spécificité** : `PRODUCT_VARIANT` > `PRODUCT` >
  `CATEGORY` > `STORE`, filtrée `(countryCode, regionCode)` + fenêtre de validité
  + `status = ACTIVE`. **Fallback = erreur bloquante** (pas de TVA à 0
  silencieuse), sauf territoires exonérés (règle 0 % explicite seedée).
- **D5 — Arrondi par ligne**, demi-supérieur, 2 décimales ; total = somme des
  lignes. (À confirmer expert-comptable.)
- **D6 — Guyane/Mayotte = règle d'exonération 0 % explicite avec mention.**
  OSS UE / export hors-UE : conçus pour, non implémentés.

## Décisions à trancher

### D1 — Assiette : prix HT ou TTC

1. **Prix stockés HT, TVA ajoutée par `taxation`** (conforme doctrine) : TTC =
   HT × (1 + taux). Même prix HT → TTC variable par territoire (DOM-TOM, UE).
   Affichage storefront TTC dérivé. Le plus propre pour le multi-territoire.
2. Prix stockés TTC (`isIncludedInPrice = true`) : HT/taxe dérivés à rebours.
   Plus intuitif pour saisir des prix consommateur, mais TTC figé en métropole
   se traduit mal en DOM-TOM (faut-il garder le TTC ou le HT constant ?).

À trancher avec Laurent : saisit-il ses prix en HT ou en TTC ? Comportement
voulu en DOM-TOM (même HT, ou même TTC) ?

### D2 — Détermination du territoire fiscal

Mapper l'adresse de commande → territoire fiscal. `OrderAddress` porte
`countryCode`, `region` (String?), `postalCode`, `city`.

1. **Par code postal pour la France** (recommandé) : 971 Guadeloupe, 972
   Martinique, 973 Guyane, 974 Réunion, 976 Mayotte ; sinon métropole. Fiable et
   indépendant de la saisie libre `region`.
2. Par `countryCode`/`region` : suppose une saisie normalisée non garantie.

À cadrer : adresse de référence = **livraison** (SHIPPING) pour la TVA B2C biens.
Future UE/hors-UE : extension par `countryCode`.

### D3 — Résolution de la règle applicable

Plusieurs `TaxRule` peuvent matcher. Définir la priorité :

1. **Spécificité décroissante** (recommandé) : `PRODUCT_VARIANT` > `PRODUCT` >
   `CATEGORY` > `STORE`, filtré par `(countryCode, regionCode)` et fenêtre
   `startsAt/endsAt`, `status = ACTIVE`. Règle unique retenue par ligne.
2. Détailler les cas de conflit/égalité et le fallback (aucune règle → 0 ou
   erreur bloquante ? recommandation : **erreur explicite** plutôt que TVA
   silencieuse à 0, sauf territoires exonérés Guyane/Mayotte).

### D4 — Capture du résultat sur la commande (schéma)

Pour que la facture puisse figer la TVA, la commande doit **persister le taux et
son origine par ligne**, pas seulement le montant.

1. **Ajouter sur `OrderLine`** (recommandé, `prisma-architect`) : `taxRatePercent`
   (Decimal), et traçabilité de l'origine (territoire + référence règle). Au
   niveau `Order` : `taxAmount` réellement renseigné. Non rétro-actif → à faire
   tôt.
2. Recalcul à la lecture : rejeté (les taux changent ; perte d'auditabilité ;
   contredit l'invariant « taxe explicable »).

### D5 — Arrondis

Règle d'arrondi (par ligne puis somme, ou sur total) et précision. Impact direct
sur la cohérence HT+TVA=TTC et sur les factures. À fixer une fois, explicitement.

### D6 — Exonérations & hors-champ

- Guyane/Mayotte : TVA non applicable → ligne à 0 avec **mention** (pas un oubli).
- Future : OSS UE (taux destination), exonération export hors-UE. Concevoir la
  détermination et la capture pour les accueillir **sans refonte** (pas
  d'implémentation maintenant).

### D7 — Administration & seed

- UI admin de gestion des `TaxRule` (`next-admin-ui-builder`) : liste, création,
  activation, ciblage.
- Seed des taux FR métropole + DOM-TOM (référence ci-dessus), `status` adéquat.
- Gating feature `commerce.taxation` (seed `FeatureFlag` comme les autres modules).

## Sous-lots proposés (indicatif, après D1–D6)

1. **Schéma** (`prisma-architect`) : capture taux/origine sur `OrderLine`,
   `taxAmount` commande, éventuel marqueur HT/TTC sur pricing si D1 l'exige.
   `prisma validate` + migration.
2. **Service de détermination + calcul** : résolution règle (D3) par territoire
   (D2), calcul HT/TVA/TTC (D1, D5), exonérations (D6). Tests unitaires (cas
   métropole, Antilles/Réunion 8,5 %, Guyane/Mayotte 0).
3. **Câblage checkout/commande** : remplacer les `0` codés en dur par le calcul ;
   peupler lignes + totaux.
4. **UI admin TaxRule** + seed taux (D7).
5. **Gating + doc** : seed `FeatureFlag`, `taxation.md` (décisions tranchées,
   questions ouvertes résolues), roadmap audit, bilan.

## Hors périmètre

- Implémentation OSS UE / exonération export (conçu pour, pas codé).
- E-reporting des transactions B2C vers PPF (chantier conformité séparé).
- Refonte de `pricing` (au plus un marqueur d'assiette si D1 l'impose).
- Le chantier factures lui-même (suit, une fois la TVA réelle sur les commandes).

## Prérequis de décision (à confirmer avant ouverture)

1. **D1** : prix saisis en HT ou TTC ? comportement DOM-TOM (même HT ou même TTC) ?
2. **D2** : confirmer territoire = adresse de **livraison** ; détermination par
   code postal pour la France.
3. **D3** : fallback si aucune règle (erreur bloquante recommandée).
4. **D5** : règle d'arrondi.

## Sources (vérifié 2026-06-14)

- Taux DOM : impots.gouv.fr — « Quels sont les différents taux de TVA applicables
  dans les DOM ? »
- Eurofiscalis — « Opérations avec les DOM 2026 : règles de TVA ».
