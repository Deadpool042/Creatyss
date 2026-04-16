# Cartes cadeaux

## Rôle

Le domaine `gift-cards` porte les cartes cadeaux explicitement modélisées dans le système.

Il définit :

- ce qu’est une carte cadeau du point de vue du système ;
- comment une carte cadeau est créée, activée, attribuée, consommée, expirée ou désactivée ;
- comment elle se distingue d’un cadeau classique, d’une remise, d’un moyen de paiement standard ou d’un programme de fidélité ;
- comment le système reste maître de sa vérité interne sur les soldes, redemptions et statuts des cartes cadeaux.

Le domaine existe pour fournir une représentation explicite des cartes cadeaux, distincte :

- des usages cadeau portés par `gifting` ;
- des remises portées par `discounts` ;
- des prix portés par `pricing` ;
- des paiements standards portés par `payments` ;
- de la fidélité portée par `loyalty` si ce domaine existe ;
- des DTO provider-specific portés par `integrations`.

---

## Classification

### Catégorie documentaire

`optional`

### Criticité architecturale

`optionnel structurant`

### Activable

`oui`

Le domaine `gift-cards` est activable.
Lorsqu’il est activé, il devient structurant pour certains parcours checkout, paiement, service client, comptabilité commerciale et expérience cadeau.

---

## Source de vérité

Le domaine `gift-cards` est la source de vérité pour :

- la définition interne d’une carte cadeau ;
- son identifiant métier ;
- son solde ou sa valeur résiduelle si ce modèle est retenu ;
- ses statuts ;
- ses redemptions ou consommations ;
- ses règles internes d’activation, d’expiration, de désactivation ou d’utilisation ;
- ses lectures structurées consommables par les domaines autorisés.

Le domaine `gift-cards` n’est pas la source de vérité pour :

- la commande standard, qui relève de `orders` ;
- le pricing catalogue, qui relève de `pricing` ;
- les remises, qui relèvent de `discounts` ;
- les paiements standards, qui relèvent de `payments` ;
- les usages cadeau non monétaires, qui relèvent de `gifting` ;
- la fidélité, qui relève de `loyalty` si elle existe ;
- les DTO providers externes, qui relèvent de `integrations`.

Une carte cadeau est un instrument de valeur prépayée ou allouée explicitement modélisé.
Elle ne doit pas être confondue avec :

- une remise ;
- un avoir technique non gouverné ;
- un message cadeau ;
- un moyen de paiement standard ;
- un point de fidélité ;
- un simple code promo.

---

## Responsabilités

Le domaine `gift-cards` est responsable de :

- définir ce qu’est une carte cadeau dans le système ;
- porter ses statuts et son cycle de vie ;
- porter sa valeur ou son solde métier ;
- porter les consommations ou redemptions si elles sont modélisées ici ;
- exposer une lecture gouvernée des cartes cadeaux actives, expirées, désactivées ou consommées ;
- publier les événements significatifs liés à la vie d’une carte cadeau ;
- protéger le système contre les usages implicites, incohérents ou opaques des cartes cadeaux.

Selon le périmètre exact du projet, le domaine peut également être responsable de :

- émission de carte cadeau ;
- attribution à un acheteur ou bénéficiaire ;
- code de carte cadeau ;
- activation différée ;
- expiration ;
- carte partiellement consommable ;
- annulation ou invalidation ;
- politique de cumul avec d’autres instruments.

---

## Non-responsabilités

Le domaine `gift-cards` n’est pas responsable de :

- définir le catalogue produit ;
- définir les cadeaux non monétaires ;
- calculer les prix catalogue ;
- définir les remises promotionnelles ;
- porter toute la logique de paiement standard ;
- porter la fidélité ;
- exécuter les intégrations provider-specific ;
- devenir un fourre-tout de crédits commerciaux hétérogènes sans gouvernance claire.

Le domaine `gift-cards` ne doit pas devenir :

- un doublon de `discounts` ;
- un doublon de `payments` ;
- un doublon de `gifting` ;
- un conteneur vague pour n’importe quel solde utilisateur.

---

## Invariants

Les invariants minimaux sont les suivants :

- une carte cadeau possède une identité stable ;
- une carte cadeau possède un statut explicite ;
- une carte cadeau activable ne doit pas être utilisable avant activation sans règle explicite ;
- une carte cadeau expirée ou désactivée ne doit pas être utilisée comme active ;
- le solde ou la valeur résiduelle ne doit pas devenir incohérent ;
- une consommation doit être traçable ;
- une consommation identique rejouée ne doit pas produire une double déduction silencieuse ;
- les domaines consommateurs ne doivent pas recréer librement leur propre vérité divergente de carte cadeau quand le cadre commun existe.

Le domaine protège la cohérence métier de la valeur portée par les cartes cadeaux.

---

## Dépendances

### Dépendances métier

Le domaine `gift-cards` interagit fortement avec :

- `checkout`
- `payments`
- `orders`
- `customers`
- `gifting`
- `stores`

### Dépendances transverses

Le domaine dépend également de :

- `audit`
- `observability`
- `notifications`
- `email`
- `jobs`, si certaines activations, expirations ou notifications sont différées
- `legal`, si certaines règles contractuelles ou d’expiration doivent être cadrées explicitement

### Dépendances externes

Le domaine peut être projeté vers :

- ERP ;
- CRM ;
- systèmes de caisse ;
- systèmes comptables ;
- autres systèmes via `integrations`.

### Règle de frontière

Le domaine `gift-cards` porte les cartes cadeaux explicitement modélisées.
Il ne doit pas absorber :

- les remises ;
- les paiements standards ;
- les usages cadeau non monétaires ;
- la fidélité ;
- ni les DTO providers externes.

---

## Événements significatifs

Le domaine `gift-cards` publie ou peut publier des événements significatifs tels que :

- carte cadeau créée ;
- carte cadeau activée ;
- carte cadeau attribuée ;
- carte cadeau consommée ;
- carte cadeau partiellement consommée ;
- carte cadeau expirée ;
- carte cadeau désactivée ;
- carte cadeau réactivée, si ce cas existe ;
- solde carte cadeau modifié.

Le domaine peut consommer des signaux liés à :

- commande confirmée ;
- paiement confirmé ;
- remboursement ou annulation encadrée ;
- action administrative structurée ;
- notification envoyée ;
- capability boutique modifiée.

Les noms exacts doivent rester dans le langage interne du système.

---

## Cycle de vie

Le domaine `gift-cards` possède un cycle de vie explicite.

Le cycle exact dépend du projet, mais il doit au minimum distinguer :

- créée ;
- active ;
- désactivée, si pertinent ;
- expirée, si pertinent ;
- archivée, si pertinent.

Des états supplémentaires peuvent exister :

- brouillon ;
- en attente d’activation ;
- partiellement consommée ;
- totalement consommée ;
- annulée.

Le domaine doit éviter :

- les cartes cadeaux “fantômes” ;
- les changements silencieux de solde ;
- les statuts purement techniques non interprétables métier.

---

## Interfaces et échanges

Le domaine `gift-cards` expose principalement :

- des lectures de cartes cadeaux structurées ;
- des lectures de solde ou valeur résiduelle ;
- des lectures de statut ;
- des lectures exploitables par `checkout`, `payments`, `orders`, `notifications`, `email` et certaines couches d’administration ;
- des structures prêtes à être consommées par les domaines autorisés.

Le domaine reçoit principalement :

- des créations ou mises à jour de cartes cadeaux ;
- des demandes d’activation ou de désactivation ;
- des consommations ou redemptions ;
- des demandes de lecture de statut ou solde ;
- des contextes de commande, client, boutique ou usage ;
- des signaux internes utiles à l’évolution du cycle de vie.

Le domaine ne doit pas exposer un contrat canonique dicté par un provider externe.

---

## Contraintes d’intégration

Le domaine `gift-cards` peut être exposé à des contraintes telles que :

- activation différée ;
- solde partiellement consommable ;
- boutiques multiples ;
- politiques d’expiration ;
- projection vers systèmes comptables ou CRM ;
- dépendance à des parcours checkout ;
- besoin de confidentialité ;
- rétrocompatibilité des statuts ou codes.

Règles minimales :

- la hiérarchie d’autorité doit être explicite ;
- la vérité interne des cartes cadeaux reste dans `gift-cards` ;
- les DTO providers restent dans `integrations` ;
- les traitements rejouables doivent être idempotents ou neutralisés ;
- une consommation incohérente ne doit pas être promue silencieusement ;
- les conflits entre statut, solde et usage doivent être explicables.

---

## Données sensibles / sécurité

Le domaine `gift-cards` manipule une valeur commerciale sensible.

Points de vigilance :

- contrôle strict des droits de lecture et d’écriture ;
- protection des codes ou identifiants exploitables ;
- séparation claire entre opérateur interne, acheteur, bénéficiaire et consommateur ;
- limitation de l’exposition selon le rôle, le scope et le besoin métier ;
- audit des changements significatifs de solde, statut, attribution ou consommation ;
- prévention des usages frauduleux ou répétitions non maîtrisées.

---

## Observabilité et audit

Le domaine `gift-cards` doit rendre visibles au minimum :

- quelle carte cadeau est active ;
- quel solde est en vigueur ;
- pourquoi une carte cadeau est utilisable, bloquée, expirée ou désactivée ;
- si une consommation a été acceptée, rejetée ou rejouée ;
- si une évolution est bloquée à cause d’une règle, d’un statut ou d’une incohérence.

L’audit doit permettre de répondre à des questions comme :

- quelle carte cadeau a été créée, activée ou consommée ;
- quand ;
- selon quelle origine ;
- avec quel solde affecté ;
- avec quel changement de statut ;
- avec quel impact sur commande, notification ou service client.

L’observabilité doit distinguer :

- erreur de modèle ;
- erreur technique ;
- solde incohérent ;
- consommation invalide ;
- carte expirée ;
- évolution non autorisée ;
- suspicion de fraude ou d’usage répété.

---

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `GiftCard` : carte cadeau structurée ;
- `GiftCardBalance` : valeur ou solde disponible ;
- `GiftCardRedemption` : consommation ou redemption ;
- `GiftCardStatus` : état de la carte cadeau ;
- `GiftCardPolicy` : règle de gouvernance, d’activation ou d’expiration.

---

## Impact de maintenance / exploitation

Le domaine `gift-cards` a un impact d’exploitation moyen à élevé lorsqu’il est activé.

Raisons :

- il manipule de la valeur commerciale ;
- il affecte checkout, paiement, commande et service client ;
- il nécessite une forte explicabilité des statuts et soldes ;
- ses erreurs peuvent créer des pertes commerciales ou des litiges ;
- il dépend souvent de notifications, de backoffice et parfois d’intégrations comptables.

En exploitation, une attention particulière doit être portée à :

- la cohérence des soldes ;
- la stabilité des statuts ;
- la confidentialité des codes ou identifiants ;
- la traçabilité des consommations ;
- la cohérence avec la commande et les paiements ;
- les effets de bord sur le support client et la comptabilité commerciale.

Le domaine doit être considéré comme sensible dès qu’un parcours carte cadeau réel existe.

---

## Limites du domaine

Le domaine `gift-cards` s’arrête :

- avant la commande standard ;
- avant les remises ;
- avant le pricing ;
- avant les paiements standards ;
- avant les usages cadeau non monétaires ;
- avant la fidélité ;
- avant les DTO providers externes.

Le domaine `gift-cards` porte les cartes cadeaux explicites.
Il ne doit pas devenir un doublon de paiement, de remise ou de crédit générique non gouverné.

---

## Questions ouvertes

À confirmer explicitement dans le projet :

- la frontière exacte entre `gift-cards` et `gifting` ;
- la frontière exacte entre `gift-cards` et `payments` ;
- la part exacte des usages partiels ou multi-commandes ;
- la gouvernance des expirations ;
- la stratégie de confidentialité et de rétention ;
- la hiérarchie entre vérité interne et projection externe éventuelle ;
- la place exacte de la comptabilisation ou du rapprochement commercial.

Si ces points sont déjà tranchés ailleurs, ils doivent être réinjectés ici et sortir de cette section.

---

## Documents liés

- `../../architecture/10-fondations/11-modele-de-classification.md`
- `../../architecture/10-fondations/12-frontieres-et-responsabilites.md`
- `../core/commerce/checkout.md`
- `../optional/commerce/payments.md`
- `../core/commerce/orders.md`
- `../core/commerce/customers.md`
- `../satellites/gifting.md`
- `../satellites/discounts.md`
- `../cross-cutting/email.md`
- `../cross-cutting/notifications.md`
- `../cross-cutting/audit.md`
- `../cross-cutting/observability.md`
- `../optional/platform/integrations.md`
