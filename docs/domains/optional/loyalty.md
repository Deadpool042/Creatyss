# Fidélité

## Rôle

Le domaine `loyalty` porte les mécanismes de fidélisation explicitement modélisés dans le système.

Il définit :

- ce qu’est un avantage de fidélité du point de vue du système ;
- comment sont portés les points, statuts, paliers, récompenses ou droits spécifiques liés à la fidélité ;
- comment ce domaine se distingue des remises, des cartes cadeaux, des prix et des paiements ;
- comment le système reste maître de sa vérité interne sur les droits, soldes, gains et consommations de fidélité.

Le domaine existe pour fournir une représentation explicite de la fidélité, distincte :

- des remises portées par `discounts` ;
- des cartes cadeaux portées par `gift-cards` ;
- des prix portés par `pricing` ;
- des paiements standards portés par `payments` ;
- des usages cadeau portés par `gifting` ;
- des DTO provider-specific portés par `integrations`.

---

## Classification

### Catégorie documentaire

`optional`

### Criticité architecturale

`optionnel structurant`

### Activable

`oui`

Le domaine `loyalty` est activable.
Lorsqu’il est activé, il devient structurant pour certains parcours client, panier, checkout, marketing relationnel et service client.

---

## Source de vérité

Le domaine `loyalty` est la source de vérité pour :

- la définition interne des comptes ou profils de fidélité ;
- les soldes, points ou avantages explicitement portés par le système ;
- les statuts et paliers de fidélité ;
- les gains, consommations, annulations ou expirations de droits de fidélité ;
- les règles internes de calcul, d’attribution ou d’éligibilité portées par le système ;
- les lectures structurées de fidélité consommables par les domaines autorisés.

Le domaine `loyalty` n’est pas la source de vérité pour :

- les prix catalogue, qui relèvent de `pricing` ;
- les remises promotionnelles, qui relèvent de `discounts` ;
- les cartes cadeaux, qui relèvent de `gift-cards` ;
- les paiements standards, qui relèvent de `payments` ;
- la relation CRM au sens large, qui relève de `crm` ;
- les DTO providers externes, qui relèvent de `integrations`.

La fidélité est un mécanisme relationnel et économique explicite.
Elle ne doit pas être confondue avec :

- une remise promotionnelle ponctuelle ;
- une carte cadeau ;
- un moyen de paiement ;
- un simple tag CRM ;
- un bonus implicite non gouverné.

---

## Responsabilités

Le domaine `loyalty` est responsable de :

- définir ce qu’est un droit ou avantage de fidélité dans le système ;
- porter les soldes, points, récompenses ou paliers si ce modèle est retenu ;
- porter les gains et consommations de fidélité ;
- exposer une lecture gouvernée des statuts et soldes de fidélité ;
- publier les événements significatifs liés à la vie d’un droit de fidélité ;
- protéger le système contre les usages implicites, incohérents ou opaques de la fidélité.

Selon le périmètre exact du projet, le domaine peut également être responsable de :

- programmes à points ;
- paliers de fidélité ;
- récompenses débloquées ;
- avantages récurrents ;
- expirations de points ;
- consommation partielle ou totale de droits ;
- attribution post-commande ;
- annulation de gains en cas de remboursement ou d’annulation encadrée.

---

## Non-responsabilités

Le domaine `loyalty` n’est pas responsable de :

- définir le catalogue produit ;
- définir les remises promotionnelles globales ;
- définir les cartes cadeaux ;
- calculer les prix catalogue ;
- porter la logique complète du paiement ;
- porter toute la relation CRM ;
- exécuter les intégrations provider-specific ;
- devenir un fourre-tout de “bonus client” sans gouvernance claire.

Le domaine `loyalty` ne doit pas devenir :

- un doublon de `discounts` ;
- un doublon de `gift-cards` ;
- un doublon de `crm` ;
- un conteneur vague pour n’importe quel crédit utilisateur.

---

## Invariants

Les invariants minimaux sont les suivants :

- un compte ou profil de fidélité possède une identité stable ;
- un droit ou avantage de fidélité possède un statut explicite ;
- un solde ou nombre de points ne doit pas devenir incohérent ;
- une consommation de fidélité doit être traçable ;
- une attribution identique rejouée ne doit pas produire un double gain silencieux ;
- un droit expiré ou désactivé ne doit pas être utilisé comme actif sans règle explicite ;
- les domaines consommateurs ne doivent pas recréer librement leur propre vérité divergente de fidélité quand le cadre commun existe.

Le domaine protège la cohérence métier de la fidélité.

---

## Dépendances

### Dépendances métier

Le domaine `loyalty` interagit fortement avec :

- `customers`
- `orders`
- `checkout`
- `discounts`
- `marketing`
- `crm`
- `stores`

### Dépendances transverses

Le domaine dépend également de :

- `audit`
- `observability`
- `notifications`
- `email`
- `jobs`, si certaines attributions, expirations ou notifications sont différées
- `legal`, si certaines règles contractuelles ou d’expiration doivent être cadrées explicitement

### Dépendances externes

Le domaine peut être projeté vers :

- CRM ;
- ERP ;
- systèmes de caisse ;
- moteurs de fidélité externes ;
- autres systèmes via `integrations`.

### Règle de frontière

Le domaine `loyalty` porte la fidélité explicitement modélisée.
Il ne doit pas absorber :

- les remises promotionnelles globales ;
- les cartes cadeaux ;
- les paiements standards ;
- la relation CRM complète ;
- ni les DTO providers externes.

---

## Événements significatifs

Le domaine `loyalty` publie ou peut publier des événements significatifs tels que :

- compte fidélité créé ;
- solde fidélité modifié ;
- points attribués ;
- points consommés ;
- points expirés ;
- palier fidélité changé ;
- récompense débloquée ;
- récompense consommée ;
- droit fidélité désactivé.

Le domaine peut consommer des signaux liés à :

- commande confirmée ;
- commande annulée ;
- remboursement encadré ;
- action administrative structurée ;
- notification envoyée ;
- capability boutique modifiée ;
- statut client modifié.

Les noms exacts doivent rester dans le langage interne du système.

---

## Cycle de vie

Le domaine `loyalty` possède un cycle de vie explicite.

Le cycle exact dépend du projet, mais il doit au minimum distinguer :

- créé ;
- actif ;
- suspendu, si pertinent ;
- expiré, si pertinent ;
- archivé, si pertinent.

Des états supplémentaires peuvent exister :

- en attente ;
- partiellement consommé ;
- totalement consommé ;
- désactivé ;
- déprécié.

Le domaine doit éviter :

- les droits de fidélité “fantômes” ;
- les changements silencieux de solde ;
- les statuts purement techniques non interprétables métier.

---

## Interfaces et échanges

Le domaine `loyalty` expose principalement :

- des lectures de profil ou compte fidélité structuré ;
- des lectures de solde, points ou droits ;
- des lectures de statut ou palier ;
- des lectures exploitables par `checkout`, `marketing`, `crm`, `notifications`, `email` et certaines couches d’administration ;
- des structures prêtes à être consommées par les domaines autorisés.

Le domaine reçoit principalement :

- des créations ou mises à jour de profils fidélité ;
- des attributions ou consommations ;
- des demandes de lecture de statut ou solde ;
- des contextes de commande, client, boutique ou usage ;
- des signaux internes utiles à l’évolution du cycle de vie.

Le domaine ne doit pas exposer un contrat canonique dicté par un provider externe.

---

## Contraintes d’intégration

Le domaine `loyalty` peut être exposé à des contraintes telles que :

- programmes multi-boutiques ;
- paliers évolutifs ;
- expiration de droits ;
- dépendance à des parcours checkout ;
- projection vers CRM ou systèmes externes ;
- politiques de réversibilité ;
- rétrocompatibilité des statuts ou règles.

Règles minimales :

- la hiérarchie d’autorité doit être explicite ;
- la vérité interne de la fidélité reste dans `loyalty` ;
- les DTO providers restent dans `integrations` ;
- les traitements rejouables doivent être idempotents ou neutralisés ;
- une attribution ou consommation incohérente ne doit pas être promue silencieusement ;
- les conflits entre statut, solde et usage doivent être explicables.

---

## Données sensibles / sécurité

Le domaine `loyalty` manipule une valeur commerciale sensible.

Points de vigilance :

- contrôle strict des droits de lecture et d’écriture ;
- protection des identifiants, droits et soldes exploitables ;
- séparation claire entre opérateur interne, client et systèmes tiers ;
- limitation de l’exposition selon le rôle, le scope et le besoin métier ;
- audit des changements significatifs de solde, statut, palier ou consommation ;
- prévention des usages frauduleux ou répétitions non maîtrisées.

---

## Observabilité et audit

Le domaine `loyalty` doit rendre visibles au minimum :

- quel compte fidélité est actif ;
- quel solde, palier ou droit est en vigueur ;
- pourquoi un droit de fidélité est utilisable, bloqué, expiré ou désactivé ;
- si une attribution ou consommation a été acceptée, rejetée ou rejouée ;
- si une évolution est bloquée à cause d’une règle, d’un statut ou d’une incohérence.

L’audit doit permettre de répondre à des questions comme :

- quel compte ou droit fidélité a été créé, attribué ou consommé ;
- quand ;
- selon quelle origine ;
- avec quel solde ou palier affecté ;
- avec quel changement de statut ;
- avec quel impact sur commande, marketing ou service client.

L’observabilité doit distinguer :

- erreur de modèle ;
- erreur technique ;
- solde incohérent ;
- consommation invalide ;
- droit expiré ;
- évolution non autorisée ;
- suspicion de fraude ou d’usage répété.

---

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `LoyaltyAccount` : compte ou profil fidélité structuré ;
- `LoyaltyBalance` : solde ou points disponibles ;
- `LoyaltyTransaction` : attribution, consommation, expiration ou annulation ;
- `LoyaltyTier` : palier ou niveau de fidélité ;
- `LoyaltyReward` : récompense ou avantage structuré ;
- `LoyaltyPolicy` : règle de gouvernance, d’attribution ou d’expiration.

---

## Impact de maintenance / exploitation

Le domaine `loyalty` a un impact d’exploitation moyen à élevé lorsqu’il est activé.

Raisons :

- il manipule de la valeur commerciale et relationnelle ;
- il affecte checkout, commande, CRM et marketing ;
- il nécessite une forte explicabilité des statuts et soldes ;
- ses erreurs peuvent créer des pertes commerciales, de la confusion client ou des litiges ;
- il dépend souvent de notifications, de backoffice et parfois d’intégrations externes.

En exploitation, une attention particulière doit être portée à :

- la cohérence des soldes ;
- la stabilité des statuts et paliers ;
- la confidentialité des droits exploitables ;
- la traçabilité des attributions et consommations ;
- la cohérence avec la commande, le marketing et le CRM ;
- les effets de bord sur le support client.

Le domaine doit être considéré comme sensible dès qu’un programme de fidélité réel existe.

---

## Limites du domaine

Le domaine `loyalty` s’arrête :

- avant les remises promotionnelles globales ;
- avant le pricing ;
- avant les paiements standards ;
- avant les cartes cadeaux ;
- avant la relation CRM complète ;
- avant les DTO providers externes.

Le domaine `loyalty` porte la fidélité explicite.
Il ne doit pas devenir un doublon de remise, de carte cadeau ou de crédit générique non gouverné.

---

## Questions ouvertes

À confirmer explicitement dans le projet :

- la frontière exacte entre `loyalty` et `discounts` ;
- la frontière exacte entre `loyalty` et `crm` ;
- la part exacte des usages en checkout ;
- la gouvernance des expirations ;
- la stratégie de confidentialité et de rétention ;
- la hiérarchie entre vérité interne et projection externe éventuelle ;
- la place exacte du rapprochement commercial ou comptable.

Si ces points sont déjà tranchés ailleurs, ils doivent être réinjectés ici et sortir de cette section.

---

## Documents liés

- `../../architecture/10-fondations/11-modele-de-classification.md`
- `../../architecture/10-fondations/12-frontieres-et-responsabilites.md`
- `../core/commerce/customers.md`
- `../core/commerce/orders.md`
- `../core/commerce/checkout.md`
- `../satellites/discounts.md`
- `gift-cards.md`
- `../cross-cutting/crm.md`
- `../cross-cutting/marketing.md`
- `../cross-cutting/email.md`
- `../cross-cutting/notifications.md`
- `../cross-cutting/audit.md`
- `../cross-cutting/observability.md`
- `../optional/platform/integrations.md`
