# Fiscalité

## Rôle

Le domaine `taxation` porte la logique fiscale du système.

Il définit :

- comment les taxes applicables sont déterminées ;
- quelles règles fiscales s’appliquent selon le contexte ;
- comment les montants fiscaux sont calculés ou interprétés ;
- quelles informations fiscales doivent être exposées au reste du système ;
- comment la conformité fiscale est maintenue.

Le domaine existe pour isoler la fiscalité de :

- la tarification (`pricing`) ;
- la commande (`orders`) ;
- le paiement (`payments`) ;
- et des projections externes.

---

## Classification

### Catégorie documentaire

`optional`

### Criticité architecturale

`élevé`

### Activable

`non`

Le domaine `taxation` est optionnel dans un déploiement sans règles fiscales actives. Il est nécessaire dans tout contexte commercial soumis à des obligations fiscales.

---

## Source de vérité

Le domaine `taxation` est la source de vérité pour :

- les règles fiscales applicables ;
- les taux de taxe ;
- la détermination des montants fiscaux ;
- la représentation interne des taxes ;
- l’interprétation fiscale des montants.

Le domaine `taxation` n’est pas la source de vérité pour :

- les prix hors taxe (`pricing`) ;
- les produits (`products`) ;
- les commandes (`orders`) ;
- le paiement (`payments`) ;
- les projections comptables externes.

---

## Responsabilités

Le domaine `taxation` est responsable de :

- déterminer les taxes applicables selon le contexte ;
- calculer les montants fiscaux ;
- exposer les montants TTC/HT cohérents ;
- garantir la cohérence fiscale des données ;
- publier les événements fiscaux pertinents ;
- protéger la conformité fiscale du système.

---

## Non-responsabilités

Le domaine `taxation` n’est pas responsable de :

- définir le prix ;
- gérer la commande ;
- gérer le paiement ;
- gérer le panier ;
- gérer les intégrations externes ;
- gérer les webhooks ;
- gouverner l’observabilité globale.

---

## Invariants

- une taxe appliquée doit être explicable ;
- un taux fiscal doit être cohérent avec le contexte ;
- un montant fiscal ne doit pas être ambigu ;
- une mutation fiscale doit être traçable ;
- les montants exposés doivent rester cohérents entre eux.

---

## Dépendances

### Dépendances métier

- `pricing`
- `checkout`
- `orders`
- `customers`
- `products`

### Dépendances transverses

- audit
- observabilité
- jobs

### Dépendances externes

- services fiscaux
- ERP
- systèmes de conformité

---

## Événements significatifs

- taxe calculée
- taux fiscal modifié
- règle fiscale mise à jour
- fiscalité appliquée à une commande

---

## Cycle de vie

Le domaine `taxation` possède un cycle de vie partiel :

- règle créée
- règle active
- règle inactive
- règle obsolète

---

## Interfaces et échanges

Le domaine expose :

- calculs fiscaux ;
- lectures fiscales ;
- événements fiscaux.

Il consomme :

- contexte produit ;
- contexte client ;
- contexte géographique ;
- montants issus de `pricing`.

---

## Contraintes d’intégration

- dépendance à des règles externes ;
- mise à jour des taux ;
- gestion multi-pays ;
- cohérence avec systèmes comptables.

---

## Observabilité et audit

- calculs fiscaux traçables ;
- modifications de règles ;
- écarts fiscaux ;
- erreurs de calcul.

---

## Impact de maintenance / exploitation

Impact élevé :

- conformité légale ;
- impact financier direct ;
- dépendance à des règles externes.

---

## Limites du domaine

Le domaine `taxation` s’arrête :

- avant la tarification ;
- avant la commande ;
- avant le paiement ;
- avant les intégrations techniques.

---

## Questions ouvertes

- multi-pays ?
- multi-taux ?
- règles dynamiques ?
- dépendance à API externe ?

---

## Décisions d'implémentation

### Cadrage 2026-06-14 (cf. `docs/lots/2026-06-14-commerce-taxation-cadrage.md`)

Réponses aux **questions ouvertes** ci-dessus, dans le contexte B2C Creatyss
(métropole + DOM-TOM, ambition UE/hors-UE) :

- **Multi-pays : oui.** Déterminé par l'adresse de livraison (`countryCode`, et
  code postal pour distinguer DOM-TOM de la métropole).
- **Multi-taux : oui.** Imposé par les DOM-TOM (métropole 20/10/5,5/2,1 % ;
  Guadeloupe/Martinique/Réunion 8,5 % ; Guyane/Mayotte exonéré). Résolution de
  règle par spécificité décroissante `PRODUCT_VARIANT > PRODUCT > CATEGORY >
  STORE`.
- **Règles dynamiques : via `TaxRule.startsAt/endsAt` + `status`.** Pas de moteur
  de règles externe en V1.
- **Dépendance API externe : non en V1.** Taux gérés en interne (`TaxRule`,
  seedés et administrables).

### Assiette TTC (à entériner)

Décision produit B2C : les prix `pricing` sont saisis et stockés **TTC** (prix de
vente consommateur, identique sur tous les territoires) ; `taxation` dérive HT et
TVA par territoire via `isIncludedInPrice = true`.

> ⚠️ Cette décision **diverge** de la prose actuelle (« source de vérité pour les
> prix hors taxe (pricing) »). Le schéma le permet (`TaxRule.isIncludedInPrice`).
> Divergence assumée et à entériner ; ne pas la traiter comme une erreur.

### Fallback

Absence de règle applicable → **erreur bloquante explicite** (invariant « taxe
explicable »), sauf territoires exonérés (Guyane/Mayotte) couverts par une règle
0 % dédiée.

### Bilan d'exécution (2026-06-14)

Moteur TVA par territoire implémenté (B2C métropole + DOM) :

- `entities/tax/tax-territory.ts` : territoire fiscal par code postal (DOM 971–976,
  exonération Guyane/Mayotte, COM hors champ → null). Testé.
- `entities/tax/tax-computation.ts` : ventilation TTC → HT/TVA, arrondi par ligne,
  HT + TVA = TTC exact. Testé (`tests/unit/entities/tax/`).
- `features/commerce/taxation/queries/resolve-tax-rate.query.ts` : résolution
  `TaxRule` par spécificité + territoire + validité, erreur bloquante si aucune.
- `features/commerce/taxation/queries/is-taxation-active.query.ts` + câblage
  `features/commerce/orders/lib/order.repository.ts` : calcul au checkout, capture
  `taxRatePercent`/`taxTerritory` par ligne + `Order.taxAmount`. **Gated** : TVA à 0
  tant que la feature est inactive.
- Schéma : `OrderLine.taxRatePercent`/`taxTerritory`
  (migration `20260614120000_add_order_line_tax_capture`).
- Seed taux FR/DOM (`prisma/seed/tax-rules.seed.ts`) + `FeatureFlag` DRAFT
  (`taxation-feature-flag.seed.ts`).
- UI admin lecture `/admin/commerce/taxation` + lien « Réglages » dans
  `settings/advanced`.

**Reste** : formulaire création/édition de règles (admin en lecture seule),
taux réduits par ciblage catégorie, OSS UE / export hors-UE, e-reporting PPF.
**Taux à valider par l'expert-comptable avant production.**

## Documents liés

- `../../core/commerce/pricing.md`
- `../../core/commerce/orders.md`
- `../../core/commerce/checkout.md`
- `../../core/commerce/customers.md`
- `../../core/catalog/products.md`
