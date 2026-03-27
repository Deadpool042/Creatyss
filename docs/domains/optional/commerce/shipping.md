# Expédition

## Rôle

Le domaine `shipping` porte la logique d’expédition des commandes.

Il définit :

- comment une commande est préparée pour être expédiée ;
- quels modes d’expédition sont disponibles ;
- comment une expédition est représentée ;
- quels états d’expédition sont reconnus ;
- comment le système suit l’avancement de la livraison.

Le domaine existe pour structurer la transformation d’une commande confirmée en livraison physique ou logique.

---

## Classification

### Catégorie documentaire

`optional`

### Criticité architecturale

`élevé`

### Activable

`non`

Le domaine `shipping` est optionnel dans un système sans livraison physique directe. Il est nécessaire dans tout déploiement impliquant une livraison.

---

## Source de vérité

Le domaine `shipping` est la source de vérité pour :

- la représentation des expéditions ;
- les états d’expédition ;
- les modes de livraison sélectionnés ;
- les informations de transport associées ;
- le suivi de livraison.

Le domaine `shipping` n’est pas la source de vérité pour :

- la commande (`orders`) ;
- le paiement (`payments`) ;
- le stock (`inventory`) ;
- la disponibilité (`availability`) ;
- les intégrations transporteurs ;
- les webhooks transporteurs.

---

## Responsabilités

Le domaine `shipping` est responsable de :

- représenter une expédition ;
- gérer les états d’expédition ;
- associer une expédition à une commande ;
- porter les informations de livraison ;
- exposer le statut de livraison ;
- publier les événements liés à l’expédition ;
- garantir la cohérence du cycle de livraison.

---

## Non-responsabilités

Le domaine `shipping` n’est pas responsable de :

- gérer la commande ;
- gérer le paiement ;
- gérer le stock ;
- exécuter physiquement la logistique (`fulfillment`) ;
- gérer les intégrations transporteurs ;
- gérer les webhooks ;
- porter la logique d’inventaire.

---

## Invariants

- une expédition doit être liée à une commande ;
- une expédition doit avoir un état valide ;
- un statut ne doit pas être contradictoire ;
- une expédition livrée ne doit pas redevenir en transit ;
- les informations de livraison doivent être cohérentes.

---

## Dépendances

### Dépendances métier

- `orders`
- `customers`
- `checkout`
- `pricing` (frais de livraison)

### Dépendances transverses

- audit
- observabilité
- jobs
- notifications

### Dépendances externes

- transporteurs
- API shipping
- systèmes logistiques

---

## Événements significatifs

- expédition créée
- expédition préparée
- expédition envoyée
- expédition en transit
- expédition livrée
- expédition échouée
- expédition annulée

---

## Cycle de vie

- créée
- en préparation
- expédiée
- en transit
- livrée
- échouée
- annulée

---

## Interfaces et échanges

Expose :

- statut d’expédition
- informations de livraison

Consomme :

- commande confirmée
- adresse client
- choix de livraison

---

## Contraintes d’intégration

- dépendance transporteurs
- tracking asynchrone
- délais
- erreurs de livraison
- statuts non synchrones

---

## Observabilité et audit

- changements de statut
- anomalies de livraison
- délais
- erreurs transporteur

---

## Impact de maintenance / exploitation

Impact élevé :

- satisfaction client
- suivi livraison
- dépendance systèmes externes

---

## Limites du domaine

Le domaine `shipping` s’arrête :

- avant le stock ;
- avant la logistique réelle (`fulfillment`) ;
- avant les intégrations techniques ;
- avant la commande ;
- avant le paiement.

---

## Questions ouvertes

- multi-colis ?
- livraison partielle ?
- tracking externe ?
- SLA transporteur ?

---

## Documents liés

- `orders.md`
- `customers.md`
- `checkout.md`
- `pricing.md`
- `fulfillment.md`
