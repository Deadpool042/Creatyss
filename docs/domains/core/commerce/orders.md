# Commandes

## Rôle

Le domaine `orders` porte le cycle de vie métier de la commande.

Il définit :

- ce qu’est une commande du point de vue du système ;
- comment une intention d’achat validée devient un engagement métier structuré ;
- comment la commande évolue dans le temps ;
- quelles transitions d’état sont autorisées ;
- quels faits métier significatifs doivent être publiés au reste du système.

Le domaine existe pour fournir une représentation fiable, traçable et exploitable de la commande, indépendante des mécanismes techniques d’intégration ou d’exécution.

---

## Classification

### Catégorie documentaire

`core`

### Criticité architecturale

`coeur`

### Activable

`non`

Le domaine `orders` est non optionnel.
Sans lui, le système ne peut pas formaliser correctement l’engagement d’achat ni structurer les flux métier aval.

---

## Source de vérité

Le domaine `orders` est la source de vérité pour :

- l’identité interne de la commande ;
- la représentation métier de la commande ;
- les lignes de commande au moment de la confirmation métier ;
- les états métier de la commande ;
- les transitions d’état autorisées ;
- les décisions locales relevant du cycle de vie de la commande ;
- les événements significatifs publiés à partir de la vie de la commande.

Le domaine `orders` n’est pas la source de vérité pour :

- le panier en cours avant confirmation, qui relève de `cart` ;
- le calcul des prix et montants avant validation, qui relève de `pricing` ;
- l’authentification, les rôles ou les permissions ;
- le paiement en tant que domaine spécialisé, si `payments` porte sa propre vérité ;
- le stock réel ou la disponibilité vendable, qui relèvent d’autres domaines ;
- l’exécution logistique détaillée, si celle-ci relève de `shipping` / `fulfillment` ;
- les projections vers des systèmes externes ;
- les statuts techniques de synchronisation ou de webhook.

Une commande ne doit pas dériver silencieusement de plusieurs autorités concurrentes.

---

## Responsabilités

Le domaine `orders` est responsable de :

- créer la commande à partir d’un flux de validation cohérent ;
- attribuer et maintenir l’identité interne de la commande ;
- figer la représentation métier de ce qui a été commandé au moment pertinent ;
- porter les états métier de la commande ;
- autoriser ou refuser les transitions d’état ;
- garantir la cohérence interne de la commande ;
- exposer un référentiel de commande fiable aux domaines et processus consommateurs ;
- publier les événements significatifs liés à la vie de la commande ;
- encadrer les mutations autorisées sur la commande ;
- servir de point d’ancrage métier pour les flux avals de paiement, d’exécution, de notification, d’audit et d’exploitation.

Selon le périmètre retenu, le domaine peut également être responsable de :

- certains agrégats financiers figés au moment de la commande ;
- l’adresse ou les informations de contexte figées avec la commande ;
- des sous-états métier utiles au pilotage interne ;
- des indicateurs métier nécessaires à l’exploitation de la commande.

---

## Non-responsabilités

Le domaine `orders` n’est pas responsable de :

- maintenir le panier avant validation ;
- déterminer la politique globale de prix ;
- gérer la logique complète du paiement si un domaine `payments` existe séparément ;
- exécuter les captures, remboursements ou échanges avec un PSP ;
- décider des niveaux de stock réels ;
- calculer la fiscalité en dehors de la représentation figée portée par la commande ;
- exécuter les synchronisations externes ;
- transporter les webhooks ;
- gérer les autorisations d’accès ;
- gouverner l’observabilité ou l’audit à eux seuls ;
- gérer les projections SEO, analytics ou marketing.

Le domaine `orders` ne doit pas devenir un conteneur générique pour toute conséquence technique produite après la validation d’un achat.

---

## Invariants

Les invariants minimaux du domaine sont les suivants :

- une commande doit avoir une identité interne stable ;
- une commande ne doit pas exister sans représentation métier minimale exploitable ;
- une commande confirmée ne doit pas redevenir un panier ;
- une transition d’état doit respecter le cycle de vie autorisé ;
- une ligne de commande figée ne doit pas changer silencieusement de signification métier ;
- une commande ne doit pas pouvoir porter simultanément des états métier incompatibles ;
- les montants ou éléments figés à la validation ne doivent pas être mutés sans règle explicite ;
- les événements publiés par le domaine doivent refléter un fait métier réellement survenu ;
- une mutation de commande ne doit pas casser les contrats attendus par les processus avals.

Le modèle exact des invariants doit être ajusté au projet, mais l’existence d’invariants forts fait partie de la nature même du domaine.

---

## Dépendances

### Dépendances métier

Le domaine `orders` interagit fortement avec :

- `cart`
- `checkout`
- `pricing`
- `payments`
- `customers`
- `products`
- `shipping`
- `taxation`
- `availability`

### Dépendances transverses

Le domaine dépend également de préoccupations telles que :

- audit ;
- observabilité ;
- jobs ;
- notifications ;
- intégrations ;
- webhooks ;
- events internes du système.

### Dépendances externes

Des systèmes externes peuvent consommer ou enrichir la commande via :

- PSP ;
- ERP ;
- OMS ;
- outils CRM ;
- systèmes logistiques ;
- systèmes de notification.

### Règle de frontière

Le domaine `orders` reste propriétaire du cycle de vie de la commande.
Les autres domaines interagissent avec lui, mais ne doivent pas lui imposer silencieusement leur propre modèle d’état.

---

## Événements significatifs

Le domaine `orders` publie ou peut publier des événements significatifs tels que :

- commande créée ;
- commande confirmée ;
- commande annulée ;
- commande marquée comme en attente ;
- commande payée ;
- commande prête pour traitement ;
- commande expédiée ;
- commande complétée ;
- commande remboursée ;
- ligne de commande ajustée, si le modèle autorise ce type de mutation ;
- statut de commande changé.

Les noms exacts doivent rester dans le langage métier du système.

Le domaine peut consommer des signaux liés à :

- validation du checkout ;
- confirmation ou échec de paiement ;
- disponibilité ou indisponibilité ;
- traitements d’exécution ;
- retours ou remboursements ;
- synchronisations externes.

Le domaine ne doit pas publier des événements purement techniques déguisés en faits métier.

---

## Cycle de vie

Le domaine `orders` possède un cycle de vie métier structurant.

Le cycle exact dépend du périmètre retenu, mais il doit au minimum distinguer :

- créée ;
- confirmée ;
- en attente de traitement ;
- en cours d’exécution ;
- complétée ;
- annulée.

Selon le modèle réel, des états supplémentaires peuvent exister, par exemple :

- en attente de paiement ;
- partiellement payée ;
- partiellement exécutée ;
- remboursée ;
- partiellement remboursée ;
- échouée ;
- clôturée.

Les transitions doivent être explicites et gouvernées.

Exemples de transitions structurantes :

- panier validé → commande créée ;
- commande créée → commande confirmée ;
- commande confirmée → commande annulée, si la règle métier le permet ;
- commande confirmée → commande en cours d’exécution ;
- commande en cours d’exécution → commande complétée ;
- commande payée → commande remboursée, selon politique explicite.

Le domaine doit éviter les statuts ambigus, les états purement techniques, et les transitions implicites.

---

## Interfaces et échanges

Le domaine `orders` expose principalement :

- des commandes de création de commande ;
- des commandes de transition d’état ;
- des lectures du référentiel commande ;
- des lectures adaptées aux consommateurs métier ;
- des événements significatifs liés au cycle de vie.

Le domaine reçoit principalement :

- des validations de checkout ;
- des demandes de mutation métier ;
- des confirmations ou incidents liés au paiement ;
- des signaux d’exécution logistique ;
- des demandes de reprise ou d’ajustement autorisées ;
- des retours de systèmes externes lorsque l’architecture le prévoit.

Le domaine ne doit pas exposer ses détails techniques internes comme contrat public implicite.

---

## Contraintes d’intégration

Le domaine `orders` est fortement exposé aux contraintes d’intégration.

Ces contraintes incluent typiquement :

- confirmations de paiement retardées ;
- duplications de webhooks ;
- synchronisations ERP/OMS ;
- exécution partielle ;
- annulations tardives ;
- remboursements ;
- retries ;
- ordre de réception non garanti ;
- divergence temporaire entre système interne et systèmes externes.

Règles minimales :

- les flux entrants doivent être validés et authentifiés lorsque nécessaire ;
- les signaux rejouables doivent être idempotents ou neutralisés ;
- l’état métier de la commande doit rester gouverné par le domaine ;
- un système externe ne doit pas imposer directement un état incohérent ;
- les échecs partiels doivent avoir une stratégie explicite de reprise, compensation ou marquage.

---

## Observabilité et audit

Le domaine `orders` doit rendre visibles au minimum :

- la création de commande ;
- les changements d’état significatifs ;
- les annulations ;
- les remboursements ;
- les échecs de transition ;
- les rejets métier ;
- les reprises opératoires ;
- les événements significatifs publiés ;
- les désalignements critiques avec les systèmes externes.

L’audit doit permettre de répondre à des questions comme :

- quelle commande a changé ;
- quand ;
- sous quel déclencheur ;
- avec quel impact métier ;
- par quelle origine de mutation ;
- à la suite de quel événement ou signal externe.

L’observabilité doit distinguer :

- l’erreur métier ;
- l’erreur technique ;
- le retard d’intégration ;
- l’incohérence temporaire ;
- la reprise opératoire.

---

## Impact de maintenance / exploitation

Le domaine `orders` a un impact d’exploitation très élevé.

Raisons :

- il constitue un axe central du système ;
- il relie plusieurs domaines coeur ;
- il conditionne la bonne exécution des flux avals ;
- ses erreurs ont un impact métier immédiat ;
- il est fortement exposé aux intégrations, retries et échecs partiels.

En exploitation, une attention particulière doit être portée à :

- la lisibilité des états ;
- la cohérence des transitions ;
- la qualité des flux entrants ;
- la gestion des duplications ;
- la reprise des incidents ;
- les écarts entre état interne et systèmes externes ;
- l’audit des actions manuelles ;
- les commandes bloquées ou incohérentes.

Le domaine doit être considéré comme critique pour le pilotage métier et opérationnel.

---

## Limites du domaine

Le domaine `orders` s’arrête :

- avant le panier non confirmé ;
- avant la stratégie globale de prix ;
- avant l’authentification et les accès ;
- avant la logique d’intégration elle-même ;
- avant la gestion complète du paiement si celle-ci appartient à `payments` ;
- avant l’exécution logistique détaillée si celle-ci appartient à un autre domaine ;
- avant les projections marketing, SEO, analytics ou CRM ;
- avant les mécanismes techniques de webhook, retry ou transport de messages.

Le domaine `orders` porte la commande comme objet métier central.
Il ne doit pas absorber toutes les conséquences techniques ou périphériques de l’acte de commande.

---

## Questions ouvertes

À confirmer explicitement dans le projet :

- la frontière exacte entre `cart`, `checkout` et `orders` ;
- la frontière exacte entre `orders` et `payments` ;
- la politique de transition d’état canonique ;
- le niveau de granularité des statuts de commande ;
- la gestion des commandes partiellement payées ou partiellement exécutées ;
- la frontière exacte entre `orders` et `returns` si cette capacité existe ;
- la part d’autorité des systèmes externes sur certains signaux avals.

Si ces points sont déjà tranchés ailleurs, ils doivent être réinjectés ici et sortir de cette section.

---

## Documents liés

- `../../architecture/10-fondations/10-principes-d-architecture.md`
- `../../architecture/10-fondations/11-modele-de-classification.md`
- `../../architecture/10-fondations/12-frontieres-et-responsabilites.md`
- `../../architecture/20-structure/21-domaines-coeur.md`
- `../../architecture/30-execution/30-evenements-de-domaine-et-flux-asynchrones.md`
- `../../architecture/30-execution/33-modele-de-defaillance-et-idempotence.md`
- `products.md`
- `pricing.md`
- `cart.md`
- `checkout.md`
- `payments.md`
- `customers.md`
- `shipping.md`
- `taxation.md`
