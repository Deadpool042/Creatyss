# Retours

## Rôle

Le domaine `returns` porte les retours explicitement modélisés dans le système.

Il définit :

- ce qu’est un retour du point de vue du système ;
- comment une commande, une ligne de commande ou un article devient éligible à un retour ;
- comment ce domaine se distingue du support, de la logistique, du remboursement et de la commande elle-même ;
- comment le système reste maître de sa vérité interne sur les demandes, décisions, statuts et issues de retour.

Le domaine existe pour fournir une représentation explicite des retours, distincte :

- de la commande portée par `orders` ;
- de la logistique portée par `fulfillment` et `shipping` ;
- des remboursements portés par `payments` ou un sous-modèle dédié si explicite ;
- du support porté par `support` ;
- des DTO provider-specific portés par `integrations`.

---

## Classification

### Catégorie documentaire

`optional`

### Criticité architecturale

`optionnel structurant`

### Activable

`oui`

Le domaine `returns` est activable.
Lorsqu’il est activé, il devient structurant pour certains parcours service client, commande, logistique inverse et remboursement.

---

## Source de vérité

Le domaine `returns` est la source de vérité pour :

- la définition interne d’un retour ;
- les demandes de retour ;
- les statuts de retour ;
- les décisions d’acceptation, refus ou annulation ;
- les lignes, articles ou quantités explicitement rattachés à un retour ;
- les lectures structurées de retour consommables par les domaines autorisés.

Le domaine `returns` n’est pas la source de vérité pour :

- la commande source, qui relève de `orders` ;
- l’expédition aller, qui relève de `shipping` ;
- la préparation logistique standard, qui relève de `fulfillment` ;
- le support client global, qui relève de `support` ;
- le remboursement effectif, qui relève de `payments` ou d’un domaine comptable explicitement séparé ;
- les DTO providers externes, qui relèvent de `integrations`.

Un retour est un objet métier explicite.
Il ne doit pas être confondu avec :

- une réclamation support ;
- un remboursement direct ;
- une annulation de commande ;
- un mouvement logistique brut ;
- une note interne sans statut ni gouvernance.

---

## Responsabilités

Le domaine `returns` est responsable de :

- définir ce qu’est un retour dans le système ;
- porter les demandes de retour et leurs motifs ;
- porter les statuts et décisions de retour ;
- exposer une lecture gouvernée des retours actifs, refusés, clôturés ou archivés ;
- publier les événements significatifs liés à la vie d’un retour ;
- protéger le système contre les retours implicites, opaques ou contradictoires.

Selon le périmètre exact du projet, le domaine peut également être responsable de :

- retour partiel ;
- retour total ;
- retour par article ou par quantité ;
- motifs de retour ;
- fenêtre d’éligibilité au retour ;
- validation manuelle ou semi-automatique ;
- lien entre retour et remboursement attendu ;
- réception de retour, si cette étape est explicitement portée ici.

---

## Non-responsabilités

Le domaine `returns` n’est pas responsable de :

- définir la commande source ;
- porter la logistique standard ;
- exécuter le remboursement ;
- porter tout le support client ;
- exécuter les intégrations provider-specific ;
- devenir un moteur générique de litige ou de SAV complet.

Le domaine `returns` ne doit pas devenir :

- un doublon de `orders` ;
- un doublon de `support` ;
- un doublon de `payments` ;
- un conteneur flou d’incidents post-achat sans gouvernance.

---

## Invariants

Les invariants minimaux sont les suivants :

- un retour possède une identité stable ;
- un retour possède un statut explicite ;
- un retour est rattaché explicitement à une commande ou à une ligne éligible ;
- un retour refusé ne doit pas être traité comme accepté sans règle explicite ;
- une mutation significative de statut, motif ou quantité doit être traçable ;
- un même retour ne doit pas produire silencieusement plusieurs issues contradictoires ;
- les domaines consommateurs ne doivent pas recréer librement leur propre vérité divergente de retour quand le cadre commun existe.

Le domaine protège la cohérence des retours explicites du système.

---

## Dépendances

### Dépendances métier

Le domaine `returns` interagit fortement avec :

- `orders`
- `payments`
- `fulfillment`
- `shipping`
- `customers`
- `stores`

### Dépendances transverses

Le domaine dépend également de :

- `audit`
- `observability`
- `support`
- `notifications`
- `jobs`, si certaines validations, expirations ou relances sont différées
- `legal`, si certaines règles d’éligibilité ou obligations doivent être cadrées explicitement

### Dépendances externes

Le domaine peut être projeté vers :

- ERP ;
- systèmes SAV ;
- systèmes logistiques ;
- systèmes comptables ;
- autres systèmes via `integrations`.

### Règle de frontière

Le domaine `returns` porte les retours explicitement modélisés.
Il ne doit pas absorber :

- la commande ;
- le remboursement effectif ;
- la logistique complète ;
- le support global ;
- ni les DTO providers externes.

---

## Événements significatifs

Le domaine `returns` publie ou peut publier des événements significatifs tels que :

- retour créé ;
- retour demandé ;
- retour accepté ;
- retour refusé ;
- retour annulé ;
- retour reçu, si ce cas existe ;
- retour clôturé ;
- motif de retour modifié ;
- quantité de retour modifiée.

Le domaine peut consommer des signaux liés à :

- commande livrée ;
- commande annulée ;
- remboursement initié ou confirmé ;
- article reçu en logistique inverse ;
- action administrative structurée ;
- capability boutique modifiée.

Les noms exacts doivent rester dans le langage interne du système.

---

## Cycle de vie

Le domaine `returns` possède un cycle de vie explicite.

Le cycle exact dépend du projet, mais il doit au minimum distinguer :

- créé ;
- en attente ;
- accepté ;
- refusé ;
- clôturé ;
- archivé, si pertinent.

Des états supplémentaires peuvent exister :

- brouillon ;
- annulé ;
- reçu ;
- remboursé partiellement, si cette lecture est portée ici ;
- expiré.

Le domaine doit éviter :

- les retours “fantômes” ;
- les changements silencieux de décision ;
- les états purement techniques non interprétables métier.

---

## Interfaces et échanges

Le domaine `returns` expose principalement :

- des lectures de retour structuré ;
- des statuts et motifs de retour ;
- des lectures exploitables par `support`, `orders`, `payments`, `fulfillment` et certaines couches d’administration ;
- des structures prêtes à être consommées par les domaines autorisés.

Le domaine reçoit principalement :

- des créations ou mises à jour de retour ;
- des changements de statut ou de décision ;
- des demandes de lecture d’un retour ;
- des contextes de commande, client, boutique ou article ;
- des signaux internes utiles à l’évolution du retour.

Le domaine ne doit pas exposer un contrat canonique dicté par un provider externe.

---

## Contraintes d’intégration

Le domaine `returns` peut être exposé à des contraintes telles que :

- retours partiels ;
- fenêtres de retour ;
- validation manuelle ;
- logistique inverse ;
- dépendance à la livraison effective ;
- projection vers systèmes externes ;
- politiques locales par boutique ;
- rétrocompatibilité des statuts.

Règles minimales :

- la hiérarchie d’autorité doit être explicite ;
- la vérité interne des retours reste dans `returns` ;
- les DTO providers restent dans `integrations` ;
- les traitements rejouables doivent être idempotents ou neutralisés ;
- un retour incohérent ne doit pas être promu silencieusement ;
- les conflits entre commande, statut, quantité et issue doivent être explicables.

---

## Données sensibles / sécurité

Le domaine `returns` manipule des données post-achat sensibles.

Points de vigilance :

- contrôle strict des droits de lecture et d’écriture ;
- séparation claire entre demande client, décision interne et issue financière ;
- limitation de l’exposition selon le rôle, le scope et le besoin métier ;
- audit des changements significatifs de statut, motif, quantité ou décision ;
- prudence sur les usages frauduleux ou répétitions non maîtrisées.

---

## Observabilité et audit

Le domaine `returns` doit rendre visibles au minimum :

- quel retour est actif ;
- quel statut est en vigueur ;
- pourquoi un retour est accepté, refusé, annulé ou clôturé ;
- si une évolution est bloquée à cause d’une règle, d’un statut ou d’une incohérence ;
- si une projection externe ou une étape logistique a modifié l’état du retour.

L’audit doit permettre de répondre à des questions comme :

- quel retour a été créé ou modifié ;
- quand ;
- selon quelle origine ;
- avec quel motif ou quelle quantité affectée ;
- avec quel changement de statut ;
- avec quel impact sur commande, remboursement ou service client.

L’observabilité doit distinguer :

- erreur de modèle ;
- erreur technique ;
- retour invalide ;
- statut incohérent ;
- demande hors délai ;
- évolution non autorisée ;
- suspicion d’abus.

---

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `ReturnRequest` : demande de retour structurée ;
- `ReturnLine` : ligne ou quantité concernée par le retour ;
- `ReturnReason` : motif explicite ;
- `ReturnStatus` : état du retour ;
- `ReturnDecision` : décision d’acceptation ou de refus ;
- `ReturnPolicy` : règle de gouvernance, d’éligibilité ou de traitement.

---

## Impact de maintenance / exploitation

Le domaine `returns` a un impact d’exploitation moyen à élevé lorsqu’il est activé.

Raisons :

- il affecte commande, logistique inverse, remboursement et support ;
- ses erreurs créent des litiges ou des incohérences post-achat ;
- il nécessite une forte explicabilité des décisions ;
- il dépend souvent de plusieurs domaines et parfois d’intégrations externes ;
- il augmente la sensibilité opérationnelle du service client.

En exploitation, une attention particulière doit être portée à :

- la cohérence des statuts ;
- la traçabilité des décisions ;
- la cohérence avec commande, paiement et logistique ;
- les retours partiels ou complexes ;
- les effets de bord sur support et comptabilité ;
- la prévention des abus.

Le domaine doit être considéré comme sensible dès qu’un parcours de retour réel existe.

---

## Limites du domaine

Le domaine `returns` s’arrête :

- avant la commande source ;
- avant le remboursement effectif ;
- avant la logistique complète ;
- avant le support global ;
- avant les DTO providers externes.

Le domaine `returns` porte les retours explicites.
Il ne doit pas devenir un doublon de commande, de support ou de remboursement non gouverné.

---

## Questions ouvertes

À confirmer explicitement dans le projet :

- la frontière exacte entre `returns` et `support` ;
- la frontière exacte entre `returns` et `payments` ;
- la part exacte de la réception logistique portée ici ;
- la gouvernance des fenêtres de retour ;
- la hiérarchie entre vérité interne et projection externe éventuelle ;
- la place exacte des remboursements partiels ou avoirs associés.

Si ces points sont déjà tranchés ailleurs, ils doivent être réinjectés ici et sortir de cette section.

---

## Documents liés

- `../../architecture/10-fondations/11-modele-de-classification.md`
- `../../architecture/10-fondations/12-frontieres-et-responsabilites.md`
- `../core/orders.md`
- `../core/payments.md`
- `../core/customers.md`
- `commerce/fulfillment.md`
- `../core/shipping.md`
- `../cross-cutting/support.md`
- `../cross-cutting/notifications.md`
- `../cross-cutting/audit.md`
- `../cross-cutting/observability.md`
- `../core/integrations.md`
