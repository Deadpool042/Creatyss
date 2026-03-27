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

## Documents liés

- `pricing.md`
- `orders.md`
- `checkout.md`
- `customers.md`
- `products.md`
