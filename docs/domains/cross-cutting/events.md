# Événements

## Rôle

Le domaine `events` porte les événements publics explicitement modélisés dans le système.

Il définit :

- ce qu’est un événement public du point de vue du système ;
- comment un événement est créé, planifié, publié, dépublié, annulé, clôturé ou archivé ;
- comment sont portés les inscriptions, réservations ou ouvertures au public lorsque ces capacités sont activées ;
- comment ce domaine se distingue des domain events internes, des notifications, de la newsletter, du social, du scheduling transverse et des intégrations provider-specific ;
- comment le système reste maître de sa vérité interne sur les événements publics.

Le domaine existe pour fournir une représentation explicite des événements publics, distincte :

- des domain events internes ;
- des notifications portées par `notifications` ;
- de la newsletter portée par `newsletter` ;
- de la diffusion sociale portée par `social` ;
- du scheduling transverse porté par `scheduling` ;
- des intégrations provider-specific portées par `integrations`.

---

## Classification

### Catégorie documentaire

`cross-cutting`

### Criticité architecturale

`transverse structurant`

### Activable

`oui`

Le domaine `events` est activable.
Lorsqu’il est activé, il devient structurant pour les parcours événementiels publics, leurs publications, leurs ouvertures au public et leurs usages aval.

---

## Source de vérité

Le domaine `events` est la source de vérité pour :

- la définition interne d’un événement public ;
- son identité ;
- son statut public ;
- ses dates, horaires et lieux si ces éléments sont portés ici ;
- ses inscriptions et réservations si ces modèles sont activés ;
- ses lectures structurées consommables par les domaines autorisés.

Le domaine `events` n’est pas la source de vérité pour :

- les domain events internes ;
- les notifications transactionnelles, qui relèvent de `notifications` ;
- la newsletter, qui relève de `newsletter` ;
- la publication sociale, qui relève de `social` ;
- le scheduling transverse global, qui relève de `scheduling` ;
- les DTO providers externes, qui relèvent de `integrations`.

Un événement est un objet métier public structuré.
Il ne doit pas être confondu avec :

- un domain event interne ;
- une notification ;
- une campagne newsletter ;
- une publication sociale ;
- un simple créneau technique de planification ;
- une fiche CMS non gouvernée métier.

---

## Responsabilités

Le domaine `events` est responsable de :

- définir ce qu’est un événement public dans le système ;
- porter les événements publics structurés ;
- porter leurs statuts métier ;
- porter les inscriptions lorsqu’elles sont activées ;
- porter les réservations lorsqu’elles sont activées ;
- exposer une lecture gouvernée des événements actifs, passés, annulés, clôturés ou archivés ;
- publier les événements significatifs liés à la vie d’un événement public ;
- protéger le système contre les événements implicites, opaques ou contradictoires.

Selon le périmètre exact du projet, le domaine peut également être responsable de :

- ateliers ;
- marchés ;
- salons ;
- lancements ;
- événements à capacité limitée ;
- événements avec inscription ;
- événements avec réservation ;
- ouverture ou fermeture des accès publics à un événement ;
- politiques locales d’exposition ou de disponibilité.

---

## Non-responsabilités

Le domaine `events` n’est pas responsable de :

- porter les domain events internes ;
- porter les notifications transactionnelles ;
- porter la newsletter ;
- porter la diffusion sociale ;
- porter le scheduling transverse global ;
- exécuter les intégrations provider-specific ;
- devenir un CMS générique ou un agenda technique sans responsabilité métier claire.

Le domaine `events` ne doit pas devenir :

- un doublon de `notifications` ;
- un doublon de `newsletter` ;
- un doublon de `social` ;
- un doublon de `scheduling` ;
- un conteneur flou de dates, rappels ou campagnes sans structure métier claire.

---

## Invariants

Les invariants minimaux sont les suivants :

- un événement public possède un identifiant stable et un statut explicite ;
- un événement public ne se confond pas avec un domain event interne ;
- une inscription ou réservation est rattachée explicitement à un événement valide lorsqu’elle est activée ;
- un événement non publié ne doit pas être exposé hors règle explicite ;
- une mutation significative de statut, ouverture, fermeture, inscription ou réservation doit être traçable ;
- les domaines consommateurs ne doivent pas recréer librement leur propre vérité divergente des événements publics quand le cadre commun existe ;
- les diffusions aval restent distinctes de la vérité interne événementielle.

Le domaine protège la cohérence des événements publics structurés.

---

## Dépendances

### Dépendances métier

Le domaine `events` interagit fortement avec :

- `stores`
- `customers`
- `users`
- `pages`
- `media`

### Dépendances transverses

Le domaine dépend également de :

- `workflow`, si certaines publications ou clôtures suivent un processus structuré
- `approval`, si certaines publications nécessitent validation
- `audit`
- `observability`
- `notifications`, comme domaine consommateur aval
- `newsletter`, comme domaine consommateur aval
- `social`, comme domaine consommateur aval
- `analytics`
- `dashboarding`

### Dépendances externes

Le domaine peut être relié à :

- plateformes d’événementiel ;
- systèmes de réservation externes ;
- CRM externes ;
- providers emailing ou social ;
- autres systèmes via `integrations`.

### Règle de frontière

Le domaine `events` porte les événements publics métier.
Il ne doit pas absorber :

- les domain events internes ;
- les notifications ;
- la newsletter ;
- la diffusion sociale ;
- le scheduling transverse ;
- ni les DTO providers externes.

---

## Événements significatifs

Le domaine `events` publie ou peut publier des événements significatifs tels que :

- événement créé ;
- événement mis à jour ;
- événement publié ;
- événement dépublié ;
- événement annulé ;
- inscription créée ;
- inscription annulée ;
- réservation créée ;
- réservation annulée ;
- ouverture événementielle modifiée.

Le domaine peut consommer des signaux liés à :

- subscription créée, si certains abonnements concernent les nouveautés événementielles ;
- capability boutique modifiée ;
- workflow terminé ;
- approbation accordée ;
- action administrative structurée ;
- signal de scheduling appliqué à un événement public.

Les noms exacts doivent rester dans le langage interne du système.

---

## Cycle de vie

Le domaine `events` possède un cycle de vie explicite.

Le cycle exact dépend du projet, mais il doit au minimum distinguer :

- brouillon ;
- publié ;
- clôturé, si pertinent ;
- annulé, si pertinent ;
- archivé, si pertinent.

Des états supplémentaires peuvent exister :

- planifié ;
- complet ;
- dépublié ;
- ouvert aux inscriptions ;
- fermé aux inscriptions ;
- ouvert aux réservations ;
- fermé aux réservations.

Le domaine doit éviter :

- les événements “fantômes” ;
- les changements silencieux de publication ;
- les états purement techniques non interprétables métier.

---

## Interfaces et échanges

Le domaine `events` expose principalement :

- des lectures d’événements publics structurés ;
- des statuts d’événement ;
- des lectures d’inscriptions et réservations lorsqu’elles sont activées ;
- des lectures exploitables par le storefront, l’admin, `notifications`, `newsletter`, `social`, `analytics`, `dashboarding`, `crm` et d’autres domaines consommateurs ;
- des structures prêtes à être consommées par les domaines autorisés.

Le domaine reçoit principalement :

- des créations ou mises à jour d’événements publics ;
- des créations ou mises à jour d’inscriptions ;
- des créations ou mises à jour de réservations ;
- des demandes de lecture des événements actifs ou passés ;
- des demandes de publication ou dépublication d’événements ;
- des contextes boutique, client, utilisateur, temporel ou de capacité utile au fonctionnement événementiel.

Le domaine ne doit pas exposer un contrat canonique dicté par un provider externe.

---

## Contraintes d’intégration

Le domaine `events` peut être exposé à des contraintes telles que :

- publication d’événements publics ;
- inscriptions activables ;
- réservations activables ;
- capacités limitées ;
- dépendance à des workflows ;
- diffusion vers newsletter, social ou notifications ;
- synchronisation avec systèmes externes ;
- rétrocompatibilité de statuts ou d’identifiants événementiels.

Règles minimales :

- la hiérarchie d’autorité doit être explicite ;
- la vérité interne des événements reste dans `events` ;
- les DTO providers restent dans `integrations` ;
- les traitements rejouables doivent être idempotents ou neutralisés ;
- un événement incohérent ne doit pas être promu silencieusement ;
- les conflits entre statut, capacité, ouverture publique et diffusion doivent être explicables.

---

## Données sensibles / sécurité

Le domaine `events` manipule des données publiques et relationnelles potentiellement sensibles, notamment via les inscriptions ou réservations.

Points de vigilance :

- contrôle strict des droits de lecture et d’écriture ;
- validation stricte des statuts de publication ;
- protection des données d’inscription ou de réservation ;
- séparation claire entre événement public et communications aval ;
- audit des changements significatifs ;
- limitation de l’exposition selon le rôle, le scope et la finalité métier.

---

## Observabilité et audit

Le domaine `events` doit rendre visibles au minimum :

- pourquoi un événement est publié ou non ;
- pourquoi une inscription ou une réservation est acceptée, refusée ou clôturée ;
- quel capability ou contexte a influencé la disponibilité d’un événement ;
- si une absence de diffusion aval vient d’une capability inactive, d’une règle métier ou d’un domaine consommateur non activé ;
- quels changements significatifs ont affecté le cycle de vie de l’événement.

L’audit doit permettre de répondre à des questions comme :

- quel événement a été créé, modifié, publié ou annulé ;
- quand ;
- selon quelle origine ;
- avec quel changement de statut ;
- avec quelle inscription ou réservation affectée ;
- avec quelle intervention manuelle significative.

L’observabilité doit distinguer :

- erreur de modèle ;
- erreur technique ;
- événement invalide ;
- statut incohérent ;
- publication refusée ;
- capability inactive ;
- réservation ou inscription impossible dans l’état courant.

---

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `PublicEvent` : événement public structuré ;
- `EventPublicationStatus` : état public de l’événement ;
- `EventRegistration` : inscription à un événement ;
- `EventReservation` : réservation liée à un événement ;
- `EventAudienceStatus` : état d’ouverture ou de clôture des inscriptions/réservations ;
- `EventPolicy` : règle de gouvernance ou de disponibilité événementielle.

---

## Impact de maintenance / exploitation

Le domaine `events` a un impact d’exploitation moyen à élevé lorsqu’il est activé.

Raisons :

- il touche publication publique, inscriptions, réservations et diffusion aval ;
- ses erreurs dégradent expérience client, lisibilité publique et coordination marketing ;
- il nécessite une explicabilité forte des statuts et ouvertures ;
- il interagit avec plusieurs domaines consommateurs ;
- il peut dépendre d’intégrations externes sans leur déléguer la vérité métier.

En exploitation, une attention particulière doit être portée à :

- la cohérence des statuts ;
- la disponibilité réelle des inscriptions et réservations ;
- la traçabilité des changements ;
- la cohérence avec les capacités actives de la boutique ;
- les effets de bord sur notifications, newsletter, social, CRM et analytics ;
- la clôture ou annulation propre des événements sensibles.

Le domaine doit être considéré comme structurant dès qu’une activité événementielle publique réelle existe.

---

## Limites du domaine

Le domaine `events` s’arrête :

- avant les domain events internes ;
- avant les notifications ;
- avant la newsletter ;
- avant la diffusion sociale ;
- avant le scheduling transverse ;
- avant les intégrations externes ;
- avant les DTO providers externes.

Le domaine `events` porte les événements publics métier.
Il ne doit pas devenir un agenda technique global, un CMS générique ou un orchestrateur de diffusion externe.

---

## Questions ouvertes

À confirmer explicitement dans le projet :

- la frontière exacte entre `events` et `scheduling` ;
- la frontière exacte entre `events` et `notifications` ;
- la frontière exacte entre `events` et `newsletter` ;
- la part exacte des réservations et inscriptions réellement supportées ;
- la gouvernance des capacités et clôtures d’événements ;
- la hiérarchie entre vérité interne et systèmes d’événementiel externes éventuels.

Si ces points sont déjà tranchés ailleurs, ils doivent être réinjectés ici et sortir de cette section.

---

## Documents liés

- `../../architecture/10-fondations/11-modele-de-classification.md`
- `../../architecture/10-fondations/12-frontieres-et-responsabilites.md`
- `../core/foundation/stores.md`
- `../core/commerce/customers.md`
- `../core/foundation/users.md`
- `../optional/pages.md`
- `../satellites/media.md`
- `workflow.md`
- `approval.md`
- `notifications.md`
- `newsletter.md`
- `social.md`
- `analytics.md`
- `dashboarding.md`
- `crm.md`
- `scheduling.md`
- `audit.md`
- `observability.md`
- `../optional/platform/integrations.md`
