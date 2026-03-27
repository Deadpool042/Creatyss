# Gifting

## Rôle

Le domaine `gifting` porte les mécanismes de cadeau explicitement modélisés dans le système.

Il définit :

- ce qu’est un achat, une attribution ou une consommation en mode cadeau ;
- comment un cadeau se distingue d’une simple commande standard ;
- comment sont portés le bénéficiaire, le donneur, le message, le contexte de remise ou les contraintes spécifiques au cadeau ;
- comment ce domaine se distingue des bundles, des cartes cadeaux, de la fidélité, des remises et du checkout standard ;
- comment le système reste maître de sa vérité interne sur les usages cadeau.

Le domaine existe pour fournir une représentation explicite des usages cadeau, distincte :

- des commandes standard portées par `orders` ;
- des bundles commerciaux portés par `bundles` ;
- des cartes cadeaux portées par `gift-cards` si ce domaine existe ;
- des remises portées par `discounts` ;
- des programmes de fidélité portés par `loyalty` si ce domaine existe ;
- des DTO provider-specific portés par `integrations`.

---

## Classification

### Catégorie documentaire

`satellites`

### Criticité architecturale

`satellite optionnel structurant`

### Activable

`oui`

Le domaine `gifting` est activable.
Lorsqu’il est activé, il devient structurant pour certains parcours panier, checkout, email, commande et expérience client.

---

## Source de vérité

Le domaine `gifting` est la source de vérité pour :

- la définition interne d’un usage cadeau ;
- les statuts spécifiques d’un cadeau modélisé ;
- les métadonnées cadeau portées par le système ;
- les relations explicites entre donneur, bénéficiaire et objet cadeau si elles sont modélisées ici ;
- les lectures structurées cadeau consommables par les domaines autorisés.

Le domaine `gifting` n’est pas la source de vérité pour :

- la commande standard, qui relève de `orders` ;
- le pricing, qui relève de `pricing` ;
- les remises, qui relèvent de `discounts` ;
- les cartes cadeaux, qui relèvent de `gift-cards` si elles existent comme domaine distinct ;
- les bundles commerciaux, qui relèvent de `bundles` ;
- les DTO providers externes, qui relèvent de `integrations`.

Un cadeau est un usage métier explicite.
Il ne doit pas être confondu avec :

- une simple note de commande ;
- une remise commerciale ;
- un bundle ;
- une carte cadeau ;
- un message libre sans statut ni structure métier.

---

## Responsabilités

Le domaine `gifting` est responsable de :

- définir ce qu’est un usage cadeau dans le système ;
- porter les données métier spécifiques au cadeau ;
- porter les statuts propres au cadeau ;
- exposer une lecture cadeau gouvernée aux domaines consommateurs ;
- publier les événements significatifs liés à la vie d’un cadeau ;
- protéger le système contre les usages cadeau implicites ou contradictoires.

Selon le périmètre exact du projet, le domaine peut également être responsable de :

- message cadeau ;
- identité ou coordonnées du bénéficiaire ;
- différenciation entre acheteur et bénéficiaire ;
- options de remise cadeau ;
- emballage cadeau ;
- date ou contexte de remise ;
- état “préparé / remis / consommé” si ce modèle est explicitement porté ici.

---

## Non-responsabilités

Le domaine `gifting` n’est pas responsable de :

- définir le catalogue source ;
- définir les bundles commerciaux ;
- calculer les prix, remises, taxes ou totaux ;
- porter la logique complète du checkout ou de la commande ;
- remplacer un domaine `gift-cards` si celui-ci existe ;
- porter la fidélité ;
- exécuter les intégrations provider-specific ;
- devenir un fourre-tout d’options émotionnelles ou éditoriales non structurées.

Le domaine `gifting` ne doit pas devenir :

- un doublon de `orders` ;
- un doublon de `gift-cards` ;
- un doublon de `bundles` ;
- un conteneur vague de “petites options cadeau” sans modèle métier.

---

## Invariants

Les invariants minimaux sont les suivants :

- un cadeau modélisé possède une identité stable ;
- un cadeau possède un statut explicite ;
- un bénéficiaire explicite ne doit pas être ambigu ;
- un usage cadeau ne se confond pas avec la commande standard ;
- une mutation significative de statut ou d’attribution doit être traçable ;
- un cadeau archivé ou annulé ne doit pas être traité comme actif sans règle explicite ;
- les domaines consommateurs ne doivent pas recréer librement leur propre vérité divergente du cadeau quand le cadre commun existe.

Le domaine protège la cohérence métier des usages cadeau.

---

## Dépendances

### Dépendances métier

Le domaine `gifting` interagit fortement avec :

- `orders`
- `checkout`
- `customers`
- `products`
- `bundles`
- `stores`

### Dépendances transverses

Le domaine dépend également de :

- `audit`
- `observability`
- `notifications`
- `email`
- `jobs`, si certaines remises ou notifications sont différées
- `approval`, si certains usages cadeaux nécessitent validation dans un contexte spécifique

### Dépendances externes

Le domaine peut être projeté vers :

- systèmes CRM ;
- ERP ;
- systèmes de notification ;
- autres systèmes via `integrations`.

### Règle de frontière

Le domaine `gifting` porte les usages cadeau explicitement modélisés.
Il ne doit pas absorber :

- la commande standard ;
- la tarification ;
- les cartes cadeaux ;
- la fidélité ;
- ni les DTO providers externes.

---

## Événements significatifs

Le domaine `gifting` publie ou peut publier des événements significatifs tels que :

- cadeau créé ;
- message cadeau ajouté ;
- bénéficiaire cadeau renseigné ;
- statut cadeau modifié ;
- cadeau annulé ;
- cadeau remis ;
- cadeau consommé, si ce statut existe.

Le domaine peut consommer des signaux liés à :

- checkout confirmé ;
- commande créée ;
- commande annulée ;
- notification envoyée ;
- action administrative structurée ;
- capability boutique modifiée.

Les noms exacts doivent rester dans le langage interne du système.

---

## Cycle de vie

Le domaine `gifting` possède un cycle de vie explicite.

Le cycle exact dépend du projet, mais il doit au minimum distinguer :

- créé ;
- actif ;
- annulé, si pertinent ;
- archivé, si pertinent.

Des états supplémentaires peuvent exister :

- brouillon ;
- prêt ;
- remis ;
- consommé ;
- expiré.

Le domaine doit éviter :

- les cadeaux “fantômes” ;
- les changements silencieux d’attribution ;
- les états purement techniques non interprétables métier.

---

## Interfaces et échanges

Le domaine `gifting` expose principalement :

- des lectures de cadeaux structurés ;
- des données de bénéficiaire, de message ou de contexte cadeau si elles sont modélisées ;
- des lectures exploitables par `checkout`, `orders`, `notifications`, `email` et certaines couches d’administration ;
- des structures cadeau prêtes à être consommées par les domaines autorisés.

Le domaine reçoit principalement :

- des créations ou mises à jour de cadeaux ;
- des changements d’attribution ou de message ;
- des demandes de lecture d’un contexte cadeau ;
- des contextes de boutique, client, commande ou usage ;
- des signaux internes utiles à l’évolution du cadeau.

Le domaine ne doit pas exposer un contrat canonique dicté par un provider externe.

---

## Contraintes d’intégration

Le domaine `gifting` peut être exposé à des contraintes telles que :

- boutiques multi-marques ;
- usages cadeau optionnels ;
- différenciation acheteur / bénéficiaire ;
- notifications différées ;
- dépendance à des parcours checkout ;
- besoins de confidentialité ;
- projections vers CRM ou email ;
- besoin de rétrocompatibilité des statuts.

Règles minimales :

- la hiérarchie d’autorité doit être explicite ;
- la vérité interne du cadeau reste dans `gifting` ;
- les DTO providers restent dans `integrations` ;
- les traitements rejouables doivent être idempotents ou neutralisés ;
- une attribution incohérente ne doit pas être promue silencieusement ;
- les conflits entre commande, bénéficiaire et statut cadeau doivent être explicables.

---

## Données sensibles / sécurité

Le domaine `gifting` peut manipuler des données sensibles liées à des tiers bénéficiaires.

Points de vigilance :

- contrôle strict des droits de lecture et d’écriture ;
- séparation claire entre acheteur, bénéficiaire et opérateur interne ;
- protection des messages cadeau et données personnelles associées ;
- limitation de l’exposition selon le rôle, le scope et le besoin métier ;
- audit des changements significatifs de statut, bénéficiaire ou message.

---

## Observabilité et audit

Le domaine `gifting` doit rendre visibles au minimum :

- quel cadeau est en vigueur ;
- quel bénéficiaire ou message est actif si le modèle le porte ;
- pourquoi un cadeau est accepté, bloqué, annulé ou archivé ;
- si une évolution de cadeau est bloquée à cause d’une règle, d’un statut de commande ou d’une incompatibilité.

L’audit doit permettre de répondre à des questions comme :

- quel cadeau a été créé ou modifié ;
- quand ;
- selon quelle origine ;
- avec quel bénéficiaire ou message affecté ;
- avec quel changement de statut ;
- avec quel impact sur les notifications ou la commande.

L’observabilité doit distinguer :

- erreur de modèle ;
- erreur technique ;
- attribution invalide ;
- statut incohérent ;
- notification échouée ;
- évolution non autorisée.

---

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `GiftContext` : contexte cadeau structuré ;
- `GiftRecipient` : bénéficiaire explicite ;
- `GiftMessage` : message cadeau ;
- `GiftStatus` : état du cadeau ;
- `GiftPolicy` : règle de gouvernance ou de validation cadeau.

---

## Impact de maintenance / exploitation

Le domaine `gifting` a un impact d’exploitation moyen lorsqu’il est activé.

Raisons :

- il affecte certains parcours checkout et commande ;
- il manipule potentiellement des données de tiers ;
- il dépend de notifications ou d’emails ;
- ses erreurs dégradent l’expérience cadeau et la confiance client ;
- il nécessite une bonne explicabilité des attributions et statuts.

En exploitation, une attention particulière doit être portée à :

- la clarté des attributions ;
- la stabilité des statuts ;
- la confidentialité des données bénéficiaires ;
- la cohérence avec la commande et les notifications ;
- la traçabilité des changements ;
- les effets de bord sur le service client.

Le domaine doit être considéré comme sensible dès qu’un parcours cadeau réel existe.

---

## Limites du domaine

Le domaine `gifting` s’arrête :

- avant la commande standard ;
- avant les bundles commerciaux ;
- avant le pricing ;
- avant les remises ;
- avant les cartes cadeaux ;
- avant la fidélité ;
- avant les DTO providers externes.

Le domaine `gifting` porte les usages cadeau explicites.
Il ne doit pas devenir un doublon de commande ni un conteneur générique d’options émotionnelles.

---

## Questions ouvertes

À confirmer explicitement dans le projet :

- la frontière exacte entre `gifting` et `gift-cards` ;
- la frontière exacte entre `gifting` et `bundles` ;
- la part exacte des données bénéficiaires réellement stockées ;
- la gouvernance des notifications via `email` ou `notifications` ;
- la stratégie de confidentialité et de rétention ;
- la hiérarchie entre vérité interne et projection externe éventuelle.

Si ces points sont déjà tranchés ailleurs, ils doivent être réinjectés ici et sortir de cette section.

---

## Documents liés

- `../../architecture/10-fondations/11-modele-de-classification.md`
- `../../architecture/10-fondations/12-frontieres-et-responsabilites.md`
- `../core/commerce/orders.md`
- `../core/commerce/checkout.md`
- `../core/commerce/customers.md`
- `../core/catalog/products.md`
- `bundles.md`
- `../optional/gift-cards.md`
- `../cross-cutting/email.md`
- `../cross-cutting/notifications.md`
- `../cross-cutting/audit.md`
- `../cross-cutting/observability.md`
- `../optional/platform/integrations.md`
