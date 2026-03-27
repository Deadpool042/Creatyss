# Abonnements

## Rôle

Le domaine `subscriptions` porte les abonnements explicitement modélisés dans le système.

Il définit :

- ce qu’est un abonnement du point de vue du système ;
- comment un client souscrit, renouvelle, suspend, résilie ou réactive un abonnement ;
- comment ce domaine se distingue des commandes ponctuelles, du pricing catalogue, des paiements standards et de la fidélité ;
- comment le système reste maître de sa vérité interne sur les cycles, statuts, engagements et renouvellements d’abonnement.

Le domaine existe pour fournir une représentation explicite des abonnements, distincte :

- des commandes ponctuelles portées par `orders` ;
- des prix catalogue portés par `pricing` ;
- des paiements standards portés par `payments` ;
- de la fidélité portée par `loyalty` ;
- des DTO provider-specific portés par `integrations`.

---

## Classification

### Catégorie documentaire

`optional`

### Criticité architecturale

`optionnel structurant`

### Activable

`oui`

Le domaine `subscriptions` est activable.
Lorsqu’il est activé, il devient structurant pour certains parcours checkout, paiement, relation client, facturation récurrente et exploitation commerciale.

---

## Source de vérité

Le domaine `subscriptions` est la source de vérité pour :

- la définition interne d’un abonnement ;
- ses statuts ;
- ses cycles, échéances et renouvellements ;
- ses métadonnées contractuelles ou opératoires explicitement portées ;
- les lectures structurées d’abonnement consommables par les domaines autorisés.

Le domaine `subscriptions` n’est pas la source de vérité pour :

- la commande ponctuelle, qui relève de `orders` ;
- le pricing catalogue générique, qui relève de `pricing` ;
- le paiement standard, qui relève de `payments` ;
- la fidélité, qui relève de `loyalty` ;
- les DTO providers externes, qui relèvent de `integrations`.

Un abonnement est une relation commerciale récurrente explicitement modélisée.
Il ne doit pas être confondu avec :

- une simple commande répétée ;
- un échéancier technique sans sémantique métier ;
- un plan tarifaire seul ;
- une préférence client ;
- un contrat externe non maîtrisé par le système.

---

## Responsabilités

Le domaine `subscriptions` est responsable de :

- définir ce qu’est un abonnement dans le système ;
- porter les statuts et cycles d’abonnement ;
- porter les renouvellements, suspensions, résiliations ou réactivations explicitement modélisés ;
- exposer une lecture gouvernée des abonnements actifs, suspendus, expirés ou résiliés ;
- publier les événements significatifs liés à la vie d’un abonnement ;
- protéger le système contre les usages implicites, incohérents ou opaques de l’abonnement.

Selon le périmètre exact du projet, le domaine peut également être responsable de :

- abonnements mensuels ou annuels ;
- périodes d’essai ;
- engagement minimal ;
- renouvellement automatique ;
- suspension temporaire ;
- migration de plan ;
- fin de période ;
- rattachement à un produit, une offre ou un service récurrent.

---

## Non-responsabilités

Le domaine `subscriptions` n’est pas responsable de :

- définir le catalogue produit général ;
- porter les prix catalogue de base ;
- exécuter le paiement standard ;
- porter toute la logique de commande ponctuelle ;
- porter la fidélité ;
- exécuter les intégrations provider-specific ;
- devenir un fourre-tout de relations commerciales récurrentes sans gouvernance explicite.

Le domaine `subscriptions` ne doit pas devenir :

- un doublon de `orders` ;
- un doublon de `payments` ;
- un doublon de `pricing` ;
- un conteneur vague pour toute relation long terme non qualifiée.

---

## Invariants

Les invariants minimaux sont les suivants :

- un abonnement possède une identité stable ;
- un abonnement possède un statut explicite ;
- un abonnement possède un cycle ou une périodicité explicite ;
- un abonnement résilié ne doit pas être traité comme actif sans règle explicite ;
- un renouvellement doit être traçable ;
- un même événement rejoué ne doit pas créer silencieusement plusieurs renouvellements contradictoires ;
- les domaines consommateurs ne doivent pas recréer librement leur propre vérité divergente d’abonnement quand le cadre commun existe.

Le domaine protège la cohérence métier de la relation récurrente.

---

## Dépendances

### Dépendances métier

Le domaine `subscriptions` interagit fortement avec :

- `customers`
- `orders`
- `payments`
- `pricing`
- `stores`

### Dépendances transverses

Le domaine dépend également de :

- `audit`
- `observability`
- `notifications`
- `email`
- `jobs`, si certains renouvellements, expirations ou relances sont différés
- `legal`, si certaines clauses ou périodes d’engagement doivent être cadrées explicitement

### Dépendances externes

Le domaine peut être projeté vers :

- systèmes de facturation ;
- CRM ;
- ERP ;
- systèmes d’abonnements externes ;
- autres systèmes via `integrations`.

### Règle de frontière

Le domaine `subscriptions` porte les abonnements explicitement modélisés.
Il ne doit pas absorber :

- les commandes ponctuelles ;
- les paiements standards ;
- la fidélité ;
- ni les DTO providers externes.

---

## Événements significatifs

Le domaine `subscriptions` publie ou peut publier des événements significatifs tels que :

- abonnement créé ;
- abonnement activé ;
- abonnement renouvelé ;
- abonnement suspendu ;
- abonnement réactivé ;
- abonnement résilié ;
- échéance abonnement modifiée ;
- plan abonnement modifié.

Le domaine peut consommer des signaux liés à :

- paiement confirmé ;
- paiement échoué ;
- commande générée depuis abonnement, si ce cas existe ;
- action administrative structurée ;
- notification envoyée ;
- capability boutique modifiée.

Les noms exacts doivent rester dans le langage interne du système.

---

## Cycle de vie

Le domaine `subscriptions` possède un cycle de vie explicite.

Le cycle exact dépend du projet, mais il doit au minimum distinguer :

- créé ;
- actif ;
- suspendu, si pertinent ;
- résilié ;
- expiré, si pertinent ;
- archivé, si pertinent.

Des états supplémentaires peuvent exister :

- brouillon ;
- en essai ;
- en attente d’activation ;
- en défaut de paiement ;
- en fin de période.

Le domaine doit éviter :

- les abonnements “fantômes” ;
- les changements silencieux de cycle ;
- les statuts purement techniques non interprétables métier.

---

## Interfaces et échanges

Le domaine `subscriptions` expose principalement :

- des lectures d’abonnement structuré ;
- des lectures de statut, cycle et échéance ;
- des lectures exploitables par `checkout`, `payments`, `orders`, `notifications`, `email` et certaines couches d’administration ;
- des structures prêtes à être consommées par les domaines autorisés.

Le domaine reçoit principalement :

- des créations ou mises à jour d’abonnement ;
- des demandes de suspension, résiliation ou réactivation ;
- des demandes de lecture de statut ou échéance ;
- des contextes de client, boutique, offre ou usage ;
- des signaux internes utiles à l’évolution du cycle de vie.

Le domaine ne doit pas exposer un contrat canonique dicté par un provider externe.

---

## Contraintes d’intégration

Le domaine `subscriptions` peut être exposé à des contraintes telles que :

- renouvellement automatique ;
- dépendance au paiement récurrent ;
- périodes d’essai ;
- obligations d’engagement ;
- projection vers CRM, ERP ou facturation ;
- politiques de réactivation ;
- rétrocompatibilité des statuts ou plans.

Règles minimales :

- la hiérarchie d’autorité doit être explicite ;
- la vérité interne des abonnements reste dans `subscriptions` ;
- les DTO providers restent dans `integrations` ;
- les traitements rejouables doivent être idempotents ou neutralisés ;
- un renouvellement incohérent ne doit pas être promu silencieusement ;
- les conflits entre statut, échéance et paiement doivent être explicables.

---

## Données sensibles / sécurité

Le domaine `subscriptions` manipule une relation commerciale récurrente sensible.

Points de vigilance :

- contrôle strict des droits de lecture et d’écriture ;
- protection des identifiants, échéances et états exploitables ;
- séparation claire entre client, opérateur interne et systèmes tiers ;
- limitation de l’exposition selon le rôle, le scope et le besoin métier ;
- audit des changements significatifs de statut, échéance, plan ou résiliation ;
- prudence sur les résiliations, réactivations et défauts de paiement.

---

## Observabilité et audit

Le domaine `subscriptions` doit rendre visibles au minimum :

- quel abonnement est actif ;
- quelle échéance ou période est en vigueur ;
- pourquoi un abonnement est utilisable, suspendu, expiré ou résilié ;
- si un renouvellement a été accepté, rejeté ou rejoué ;
- si une évolution est bloquée à cause d’une règle, d’un statut ou d’une incohérence.

L’audit doit permettre de répondre à des questions comme :

- quel abonnement a été créé, renouvelé, suspendu ou résilié ;
- quand ;
- selon quelle origine ;
- avec quelle échéance ou quel plan affecté ;
- avec quel changement de statut ;
- avec quel impact sur paiement, commande ou relation client.

L’observabilité doit distinguer :

- erreur de modèle ;
- erreur technique ;
- échéance incohérente ;
- renouvellement invalide ;
- statut incompatible ;
- évolution non autorisée ;
- défaut de paiement structurant.

---

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `Subscription` : abonnement structuré ;
- `SubscriptionCycle` : cycle ou période de renouvellement ;
- `SubscriptionStatus` : état de l’abonnement ;
- `SubscriptionPlan` : plan ou offre récurrente explicite ;
- `SubscriptionRenewal` : renouvellement ou tentative structurée ;
- `SubscriptionPolicy` : règle de gouvernance, d’échéance ou de résiliation.

---

## Impact de maintenance / exploitation

Le domaine `subscriptions` a un impact d’exploitation élevé lorsqu’il est activé.

Raisons :

- il affecte paiement, commande, relation client et rétention ;
- il manipule une relation commerciale continue ;
- ses erreurs peuvent créer pertes commerciales, litiges ou churn ;
- il nécessite une forte explicabilité des statuts, échéances et renouvellements ;
- il dépend souvent de notifications, de backoffice et d’intégrations externes.

En exploitation, une attention particulière doit être portée à :

- la cohérence des échéances ;
- la stabilité des statuts ;
- la traçabilité des renouvellements, suspensions et résiliations ;
- la cohérence avec paiement, commande et relation client ;
- les effets de bord sur support et CRM ;
- la gestion des défauts de paiement.

Le domaine doit être considéré comme sensible dès qu’un parcours d’abonnement réel existe.

---

## Limites du domaine

Le domaine `subscriptions` s’arrête :

- avant les commandes ponctuelles ;
- avant les paiements standards ;
- avant la fidélité ;
- avant les DTO providers externes.

Le domaine `subscriptions` porte les abonnements explicites.
Il ne doit pas devenir un doublon de commande, de paiement ou de relation commerciale non gouvernée.

---

## Questions ouvertes

À confirmer explicitement dans le projet :

- la frontière exacte entre `subscriptions` et `orders` ;
- la frontière exacte entre `subscriptions` et `payments` ;
- la part exacte de la génération automatique de commande ;
- la gouvernance des périodes d’essai et engagements ;
- la hiérarchie entre vérité interne et moteur externe éventuel ;
- la place exacte de la facturation récurrente et du recouvrement.

Si ces points sont déjà tranchés ailleurs, ils doivent être réinjectés ici et sortir de cette section.

---

## Documents liés

- `../../architecture/10-fondations/11-modele-de-classification.md`
- `../../architecture/10-fondations/12-frontieres-et-responsabilites.md`
- `../core/commerce/customers.md`
- `../core/commerce/orders.md`
- `../optional/commerce/payments.md`
- `../core/commerce/pricing.md`
- `../cross-cutting/crm.md`
- `../cross-cutting/email.md`
- `../cross-cutting/notifications.md`
- `../cross-cutting/audit.md`
- `../cross-cutting/observability.md`
- `../optional/platform/integrations.md`
