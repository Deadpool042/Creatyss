# Notifications

## Rôle

Le domaine `notifications` porte les notifications transactionnelles et opérationnelles du système.

Il définit :

- ce qu’est une notification du point de vue du système ;
- comment une notification est créée, préparée, exposée, envoyée, lue, ignorée, échouée ou archivée selon le modèle retenu ;
- comment ce domaine se distingue de la newsletter, des campagnes marketing, du social publishing, du template system global, du tracking et des providers externes ;
- comment le système reste maître de sa vérité interne sur les notifications structurées.

Le domaine existe pour fournir une représentation explicite des notifications transactionnelles et opérationnelles, distincte :

- de la newsletter portée par `newsletter` ;
- des campagnes marketing portées par `marketing` ;
- de la publication sociale portée par `social` ;
- des templates globaux portés par `template-system` ;
- du tracking, de l’analytics et de l’attribution ;
- des DTO provider-specific portés par `integrations`.

---

## Classification

### Catégorie documentaire

`cross-cutting`

### Criticité architecturale

`transverse structurant`

### Activable

`oui`

Le domaine `notifications` est activable.
Lorsqu’il est activé, il devient structurant pour les communications transactionnelles, opérationnelles et certains parcours de support ou d’administration.

---

## Source de vérité

Le domaine `notifications` est la source de vérité pour :

- la définition interne d’une notification structurée ;
- son destinataire logique ;
- son canal interne ;
- son statut ;
- ses préférences de notification lorsqu’elles sont portées ici ;
- ses lectures structurées consommables par les domaines autorisés.

Le domaine `notifications` n’est pas la source de vérité pour :

- la newsletter, qui relève de `newsletter` ;
- les campagnes marketing, qui relèvent de `marketing` ;
- la publication sociale, qui relève de `social` ;
- le template system global, qui relève de `template-system` ;
- les providers email, push ou realtime externes, qui relèvent de `integrations` ;
- les DTO providers externes.

Une notification est un message opérationnel ou transactionnel gouverné.
Elle ne doit pas être confondue avec :

- une newsletter ;
- une campagne marketing ;
- une publication sociale ;
- un simple event de tracking ;
- un appel provider externe ;
- un template global sans contexte d’émission.

---

## Responsabilités

Le domaine `notifications` est responsable de :

- définir ce qu’est une notification dans le système ;
- porter les notifications in-app, email transactionnelles ou realtime si ces canaux sont activés ;
- porter les préférences de notification lorsqu’elles sont gérées ici ;
- exposer une lecture gouvernée des notifications émises, lues, en attente, échouées ou archivées ;
- publier les événements significatifs liés à la vie d’une notification ;
- protéger le système contre les notifications implicites, opaques ou contradictoires.

Selon le périmètre exact du projet, le domaine peut également être responsable de :

- notifications client ;
- notifications admin ;
- préférences par sujet ;
- notifications critiques ;
- notifications temps réel ;
- notifications liées aux commandes, paiements, retours ou événements ;
- lecture support ou backoffice des statuts de notification ;
- remappage métier des résultats d’envoi utiles.

---

## Non-responsabilités

Le domaine `notifications` n’est pas responsable de :

- porter la newsletter ;
- porter les campagnes marketing ;
- porter la publication sociale ;
- porter le template system global ;
- porter le tracking ou l’analytics ;
- appeler directement les providers externes ;
- devenir un fourre-tout regroupant toute forme de communication sortante.

Le domaine `notifications` ne doit pas devenir :

- un doublon de `newsletter` ;
- un doublon de `marketing` ;
- un doublon de `social` ;
- un simple wrapper provider ;
- un conteneur flou de messages sans modèle métier.

---

## Invariants

Les invariants minimaux sont les suivants :

- une notification est rattachée à un destinataire explicite ;
- une notification possède un canal explicite ;
- une notification possède un statut explicite ;
- une notification transactionnelle ne se confond pas avec une newsletter ou une campagne marketing ;
- `notifications` ne se confond pas avec `newsletter`, `marketing` ou `social` ;
- les autres domaines ne doivent pas recréer leur propre vérité divergente des notifications structurées quand le cadre commun existe ;
- l’envoi provider externe reste distinct de la vérité interne de notification ;
- une notification non autorisée par préférence, capability ou règle métier ne doit pas être émise silencieusement.

Le domaine protège la cohérence des notifications structurées, pas l’infrastructure de diffusion externe.

---

## Dépendances

### Dépendances métier

Le domaine `notifications` interagit fortement avec :

- `users`
- `customers`
- `subscriptions`
- `stores`
- `orders`
- `payments`
- `returns`
- `events`
- `conversion`

### Dépendances transverses

Le domaine dépend également de :

- `template-system`, si certains gabarits réutilisables sont utilisés
- `audit`
- `observability`
- `dashboarding`
- `analytics`
- `jobs`, si certains envois ou reprises sont différés

### Dépendances externes

Le domaine peut être relié indirectement à :

- providers email ;
- providers push ;
- providers realtime messaging ;
- autres systèmes via `integrations`.

### Règle de frontière

Le domaine `notifications` porte les messages transactionnels et opérationnels.
Il ne doit pas absorber :

- la newsletter ;
- le marketing ;
- la publication sociale ;
- les providers externes ;
- ni les DTO providers externes.

---

## Événements significatifs

Le domaine `notifications` publie ou peut publier des événements significatifs tels que :

- notification créée ;
- notification préparée ;
- notification envoyée ;
- notification lue ;
- notification échouée ;
- préférence de notification mise à jour ;
- statut de notification modifié.

Le domaine peut consommer des signaux liés à :

- commande créée ;
- statut de commande modifié ;
- paiement capturé ;
- paiement échoué ;
- retour demandé ;
- événement publié ;
- trigger de conversion ou de relance ;
- capability boutique modifiée.

Les noms exacts doivent rester dans le langage interne du système.

---

## Cycle de vie

Le domaine `notifications` possède un cycle de vie explicite.

Le cycle exact dépend du projet, mais il doit au minimum distinguer :

- créée ;
- en attente ;
- envoyée ;
- lue, si pertinent ;
- échouée ;
- archivée, si pertinent.

Des états supplémentaires peuvent exister :

- ignorée ;
- annulée ;
- expirée ;
- masquée ;
- supprimée logiquement.

Le domaine doit éviter :

- les notifications “fantômes” ;
- les changements silencieux de statut ;
- les états purement techniques non interprétables métier.

---

## Interfaces et échanges

Le domaine `notifications` expose principalement :

- des notifications structurées ;
- des statuts de notification ;
- des préférences de notification ;
- des lectures exploitables par le storefront, l’admin, le support, `dashboarding` et certains domaines consommateurs ;
- des messages préparés pour exécution aval par `integrations` ou d’autres briques dédiées.

Le domaine reçoit principalement :

- des domain events internes issus des domaines métier ;
- des demandes explicites de création de notification ;
- des préférences de notification par acteur ;
- des demandes de lecture, marquage lu/non lu ou archivage logique selon le modèle retenu ;
- un contexte boutique, utilisateur ou client.

Le domaine ne doit pas exposer un contrat canonique dicté par un provider externe.

---

## Contraintes d’intégration

Le domaine `notifications` peut être exposé à des contraintes telles que :

- canaux multiples ;
- realtime activable ;
- préférences par sujet ;
- capability notifications activable ;
- distribution différée ;
- échecs provider ;
- réémission contrôlée ;
- coexistence avec newsletter ou campagnes marketing.

Règles minimales :

- la hiérarchie d’autorité doit être explicite ;
- la vérité interne des notifications reste dans `notifications` ;
- les DTO providers restent dans `integrations` ;
- les traitements rejouables doivent être idempotents ou neutralisés ;
- un échec provider ne doit pas corrompre silencieusement la vérité interne ;
- les préférences, restrictions et règles métier doivent être explicables.

---

## Données sensibles / sécurité

Le domaine `notifications` manipule des données de communication potentiellement sensibles.

Points de vigilance :

- contrôle strict des droits de lecture et d’écriture ;
- respect des préférences de notification ;
- séparation claire entre communication transactionnelle et communication marketing ;
- protection des contenus internes ou réservés à certains rôles ;
- audit des opérations sensibles ou manuelles importantes ;
- limitation de l’exposition selon le rôle, le scope et la nature du message.

---

## Observabilité et audit

Le domaine `notifications` doit rendre visibles au minimum :

- pourquoi une notification a été créée ou non ;
- quel événement métier l’a déclenchée ;
- pourquoi elle a été envoyée, ignorée, retardée ou échouée ;
- si une absence d’envoi vient d’une capability inactive, d’une préférence utilisateur, d’un problème d’intégration ou d’une règle métier ;
- quels changements significatifs ont affecté une notification ou une préférence.

L’audit doit permettre de répondre à des questions comme :

- quelle notification a été créée, envoyée, lue ou échouée ;
- quand ;
- selon quelle origine ;
- pour quel destinataire ;
- avec quel canal ;
- avec quelle intervention manuelle éventuelle.

L’observabilité doit distinguer :

- erreur de modèle ;
- erreur technique ;
- destinataire introuvable ;
- préférence restrictive ;
- capability inactive ;
- canal invalide ;
- échec provider externe.

---

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `Notification` : notification structurée ;
- `NotificationChannel` : canal interne de notification (`in_app`, `email`, `realtime`) ;
- `NotificationStatus` : état de la notification ;
- `NotificationPreference` : préférence de notification par acteur ou sujet ;
- `NotificationRecipient` : destinataire logique de la notification ;
- `NotificationPolicy` : règle de gouvernance, de filtrage ou d’émission.

---

## Impact de maintenance / exploitation

Le domaine `notifications` a un impact d’exploitation moyen à élevé lorsqu’il est activé.

Raisons :

- il touche la communication transactionnelle et opérationnelle ;
- ses erreurs dégradent confiance, support et lisibilité du système ;
- il se situe à la frontière entre métier et intégration ;
- il nécessite une forte explicabilité des statuts et préférences ;
- il peut dépendre de plusieurs canaux et providers externes.

En exploitation, une attention particulière doit être portée à :

- la cohérence des statuts ;
- le respect des préférences ;
- les échecs provider ;
- la traçabilité des changements ;
- la cohérence avec les domaines source ;
- les effets de bord sur support, analytics et pilotage opérationnel.

Le domaine doit être considéré comme structurant dès qu’une communication transactionnelle réelle existe.

---

## Limites du domaine

Le domaine `notifications` s’arrête :

- avant la newsletter ;
- avant les campagnes marketing ;
- avant la publication sociale ;
- avant les providers externes ;
- avant les DTO providers externes ;
- avant le template system global.

Le domaine `notifications` porte les notifications transactionnelles et opérationnelles.
Il ne doit pas devenir un moteur marketing, un simple wrapper provider ou un conteneur générique de communications sortantes.

---

## Questions ouvertes

À confirmer explicitement dans le projet :

- la frontière exacte entre `notifications` et `newsletter` ;
- la frontière exacte entre `notifications` et `marketing` ;
- la frontière exacte entre `notifications` et `template-system` ;
- la part exacte du realtime réellement supportée ;
- la gouvernance des préférences par sujet ;
- la hiérarchie entre vérité interne et providers externes éventuels.

Si ces points sont déjà tranchés ailleurs, ils doivent être réinjectés ici et sortir de cette section.

---

## Documents liés

- `../../architecture/10-fondations/11-modele-de-classification.md`
- `../../architecture/10-fondations/12-frontieres-et-responsabilites.md`
- `../core/users.md`
- `../core/customers.md`
- `../optional/subscriptions.md`
- `../core/stores.md`
- `../core/orders.md`
- `../core/payments.md`
- `../optional/returns.md`
- `events.md`
- `template-system.md`
- `newsletter.md`
- `marketing.md`
- `social.md`
- `conversion.md`
- `dashboarding.md`
- `analytics.md`
- `audit.md`
- `observability.md`
- `../core/integrations.md`
