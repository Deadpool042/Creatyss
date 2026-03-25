# Support

## Rôle

Le domaine `support` porte l’assistance opérationnelle et relationnelle du système.

Il définit :

- ce qu’est une demande support du point de vue du système ;
- comment un ticket, une conversation, une assignation, une résolution ou une clôture sont structurés ;
- comment ce domaine se distingue du CRM, des retours, des commandes, des notifications transactionnelles et de l’observabilité technique ;
- comment le système reste maître de sa vérité interne sur le traitement support.

Le domaine existe pour fournir une représentation explicite des demandes d’assistance, distincte :

- de la relation client enrichie portée par `crm` ;
- des retours portés par `returns` ;
- des commandes portées par `orders` ;
- des notifications portées par `notifications` ;
- de l’observabilité technique portée par `observability` ;
- des DTO provider-specific portés par `integrations`.

---

## Classification

### Catégorie documentaire

`cross-cutting`

### Criticité architecturale

`transverse structurant`

### Activable

`non`

Le domaine `support` est structurel dès lors qu’un traitement gouverné des demandes d’assistance existe dans le système.

---

## Source de vérité

Le domaine `support` est la source de vérité pour :

- la définition interne d’un ticket ou d’une demande support ;
- ses conversations ;
- ses assignations ;
- ses statuts de traitement ;
- ses résolutions et clôtures ;
- ses lectures structurées consommables par les domaines autorisés.

Le domaine `support` n’est pas la source de vérité pour :

- la relation client enrichie, qui relève de `crm` ;
- les retours métier, qui relèvent de `returns` ;
- la commande durable, qui relève de `orders` ;
- les notifications transactionnelles, qui relèvent de `notifications` ;
- l’observabilité technique, qui relève de `observability` ;
- les DTO providers externes, qui relèvent de `integrations`.

Une demande support est un objet relationnel et opérationnel gouverné.
Elle ne doit pas être confondue avec :

- une fiche CRM ;
- un retour métier ;
- une commande ;
- une notification ;
- un ticket purement technique d’observabilité ;
- un ticket provider externe non remappé.

---

## Responsabilités

Le domaine `support` est responsable de :

- définir ce qu’est une demande support dans le système ;
- porter les tickets support ;
- porter les conversations support ;
- porter les assignations ;
- porter les statuts de prise en charge ;
- porter les résolutions et clôtures ;
- exposer une lecture gouvernée des demandes ouvertes, assignées, résolues ou clôturées ;
- publier les événements significatifs liés à la vie d’une demande support ;
- protéger le système contre les traitements support implicites, opaques ou contradictoires.

Selon le périmètre exact du projet, le domaine peut également être responsable de :

- demandes SAV ;
- demandes liées à une commande ;
- demandes liées à un retour ;
- demandes liées à un paiement ou un document ;
- notes internes de traitement ;
- catégories et motifs de demande ;
- politiques locales d’exposition ou d’escalade.

---

## Non-responsabilités

Le domaine `support` n’est pas responsable de :

- porter la relation client enrichie ;
- porter les retours métier ;
- porter la commande durable ;
- porter les notifications transactionnelles ;
- porter l’observabilité technique ;
- exécuter les intégrations provider-specific ;
- devenir un fourre-tout mélangeant SAV, CRM, audit, support technique interne et ticketing externe sans frontière claire.

Le domaine `support` ne doit pas devenir :

- un doublon de `crm` ;
- un doublon de `returns` ;
- un doublon de `orders` ;
- un doublon de `observability` ;
- un conteneur flou de conversations et incidents sans structure métier.

---

## Invariants

Les invariants minimaux sont les suivants :

- une demande support possède un identifiant stable et un statut explicite ;
- une conversation support est rattachée explicitement à une demande valide ;
- une assignation support est rattachée explicitement à une demande valide ;
- `support` ne se confond pas avec `crm` ;
- `support` ne se confond pas avec `returns` ;
- `support` ne se confond pas avec `observability` ;
- les autres domaines ne doivent pas recréer librement leur propre vérité divergente du traitement support quand le cadre commun `support` existe ;
- les notes ou éléments internes sensibles ne doivent pas être exposés au mauvais acteur ;
- une demande clôturée ne doit pas être traitée comme active sans règle explicite.

Le domaine protège la cohérence du traitement support, pas la vérité métier des objets rattachés.

---

## Dépendances

### Dépendances métier

Le domaine `support` interagit fortement avec :

- `customers`
- `crm`
- `orders`
- `returns`
- `payments`
- `documents`
- `notifications`
- `stores`

### Dépendances transverses

Le domaine dépend également de :

- `audit`
- `observability`, pour certains diagnostics croisés sans absorber sa responsabilité
- `dashboarding`
- `analytics`

### Dépendances externes

Le domaine peut être relié indirectement à :

- outils de support externes ;
- helpdesks tiers ;
- CRM externes ;
- autres systèmes via `integrations`.

### Règle de frontière

Le domaine `support` porte le traitement des demandes d’assistance.
Il ne doit pas absorber :

- le CRM ;
- les retours ;
- les commandes ;
- l’observabilité technique ;
- ni les DTO providers externes.

---

## Événements significatifs

Le domaine `support` publie ou peut publier des événements significatifs tels que :

- ticket support créé ;
- ticket support mis à jour ;
- ticket support assigné ;
- ticket support résolu ;
- ticket support clôturé ;
- message support créé ;
- statut support modifié.

Le domaine peut consommer des signaux liés à :

- commande créée ;
- retour demandé ;
- paiement échoué ;
- statut de document modifié ;
- client créé ;
- capability boutique modifiée ;
- action administrative structurée.

Les noms exacts doivent rester dans le langage interne du système.

---

## Cycle de vie

Le domaine `support` possède un cycle de vie explicite.

Le cycle exact dépend du projet, mais il doit au minimum distinguer :

- créé ;
- ouvert ;
- assigné ;
- en traitement ;
- résolu ;
- clôturé.

Des états supplémentaires peuvent exister :

- en attente de réponse ;
- suspendu ;
- escaladé ;
- archivé.

Le domaine doit éviter :

- les tickets “fantômes” ;
- les changements silencieux de statut ;
- les états purement techniques non interprétables métier.

---

## Interfaces et échanges

Le domaine `support` expose principalement :

- des tickets support structurés ;
- des conversations support ;
- des statuts de traitement support ;
- des affectations et résolutions support ;
- une lecture exploitable par `crm`, `orders`, `returns`, `dashboarding`, `analytics`, `notifications` et certaines couches d’administration.

Le domaine reçoit principalement :

- des demandes d’assistance créées par un client, un support ou un utilisateur autorisé ;
- des messages ou réponses liés à une demande support ;
- des rattachements à une commande, un retour, un événement ou un autre objet métier si nécessaire ;
- des demandes d’assignation, de réassignation, de résolution ou de clôture ;
- des demandes de lecture d’un ticket, d’une conversation ou d’un historique support.

Le domaine ne doit pas exposer un contrat canonique dicté par un provider externe.

---

## Contraintes d’intégration

Le domaine `support` peut être exposé à des contraintes telles que :

- multi-boutiques ;
- visibilité différenciée client / support / plateforme ;
- escalade ;
- rattachement à plusieurs objets métier ;
- synchronisation avec outils externes ;
- coexistence avec CRM ;
- notifications de changement de statut ;
- rétrocompatibilité des statuts ou catégories support.

Règles minimales :

- la hiérarchie d’autorité doit être explicite ;
- la vérité interne du support reste dans `support` ;
- les DTO providers restent dans `integrations` ;
- les traitements rejouables doivent être idempotents ou neutralisés ;
- une demande incohérente ne doit pas être promue silencieusement ;
- les conflits entre statut, assignation, visibilité et résolution doivent être explicables.

---

## Données sensibles / sécurité

Le domaine `support` manipule des données relationnelles, commerciales et parfois sensibles.

Points de vigilance :

- contrôle strict des droits de lecture et d’écriture ;
- séparation entre visibilité client, support boutique et plateforme ;
- protection des notes internes et des résolutions sensibles ;
- limitation de l’exposition selon le rôle, le scope et le besoin métier ;
- audit des interventions manuelles importantes.

---

## Observabilité et audit

Le domaine `support` doit rendre visibles au minimum :

- quel ticket a été créé ;
- quel client ou objet métier est concerné ;
- quel statut est en vigueur ;
- pourquoi une demande a été assignée, résolue ou clôturée ;
- si une action support est bloquée par un état métier source ou une permission insuffisante ;
- quelles interactions ont modifié significativement la demande.

L’audit doit permettre de répondre à des questions comme :

- quel ticket a été créé, modifié, assigné, résolu ou clôturé ;
- quand ;
- selon quelle origine ;
- avec quel objet métier rattaché ;
- avec quelle action manuelle significative ;
- avec quel changement de statut ou de résolution.

L’observabilité doit distinguer :

- erreur de modèle ;
- erreur technique ;
- ticket introuvable ;
- assignation invalide ;
- permission insuffisante ;
- résolution non autorisée ;
- exposition interdite d’un contenu sensible.

---

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `SupportTicket` : ticket ou demande support structurée ;
- `SupportConversation` : échange rattaché à une demande support ;
- `SupportAssignment` : assignation du traitement ;
- `SupportStatus` : état de traitement de la demande ;
- `SupportResolution` : résolution ou issue de la demande ;
- `SupportSubjectRef` : référence vers l’objet métier concerné si applicable ;
- `SupportPolicy` : règle d’exposition, d’escalade ou de traitement.

---

## Impact de maintenance / exploitation

Le domaine `support` a un impact d’exploitation moyen à élevé.

Raisons :

- il touche directement la relation opérationnelle avec le client ;
- ses erreurs dégradent traitement, confiance et coordination interne ;
- il se situe à la frontière entre plusieurs domaines métier ;
- il nécessite une forte explicabilité des statuts et résolutions ;
- il peut dépendre de rattachements complexes à commande, retour, paiement ou document.

En exploitation, une attention particulière doit être portée à :

- la cohérence des statuts ;
- la qualité des assignations ;
- la traçabilité des interventions ;
- la cohérence avec les objets métier rattachés ;
- les effets de bord sur CRM, notifications et pilotage support ;
- la protection des notes internes et données sensibles.

Le domaine doit être considéré comme structurant dès qu’un traitement support gouverné réel existe.

---

## Limites du domaine

Le domaine `support` s’arrête :

- avant le CRM ;
- avant les retours ;
- avant les commandes ;
- avant les notifications transactionnelles ;
- avant l’observabilité technique ;
- avant les intégrations externes ;
- avant les DTO providers externes.

Le domaine `support` porte l’assistance et le traitement des demandes support.
Il ne doit pas devenir un CRM, un ticketing technique global ou un doublon des domaines métier rattachés.

---

## Questions ouvertes

À confirmer explicitement dans le projet :

- la frontière exacte entre `support` et `crm` ;
- la frontière exacte entre `support` et `returns` ;
- la frontière exacte entre `support` et `observability` ;
- la part exacte des notes internes et escalades réellement supportées ;
- la gouvernance des synchronisations avec outils externes ;
- la hiérarchie entre vérité interne et helpdesk externe éventuel.

Si ces points sont déjà tranchés ailleurs, ils doivent être réinjectés ici et sortir de cette section.

---

## Documents liés

- `../../architecture/10-fondations/11-modele-de-classification.md`
- `../../architecture/10-fondations/12-frontieres-et-responsabilites.md`
- `../core/customers.md`
- `crm.md`
- `../core/orders.md`
- `../optional/returns.md`
- `../core/payments.md`
- `../core/documents.md`
- `notifications.md`
- `audit.md`
- `observability.md`
- `dashboarding.md`
- `analytics.md`
- `../core/stores.md`
- `../core/integrations.md`
