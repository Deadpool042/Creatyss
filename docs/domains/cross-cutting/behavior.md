# Behavior

## Rôle

Le domaine `behavior` porte la lecture comportementale structurée du système.

Il définit :

- ce qu’est une lecture comportementale du point de vue du système ;
- comment sont structurés les signaux dérivés, segments, états de parcours, profils comportementaux et règles de dérivation ;
- comment ce domaine se distingue du tracking brut, de l’attribution marketing, de l’analytics consolidée, du CRM relationnel et du consentement ;
- comment le système reste maître de sa vérité interne sur les lectures comportementales.

Le domaine existe pour fournir une représentation explicite du comportement observé, distincte :

- du tracking brut porté par `tracking` ;
- de l’attribution portée par `attribution` ;
- de l’analytics consolidée portée par `analytics` ;
- de la relation client enrichie portée par `crm` ;
- du consentement porté par `consent` ;
- des DTO providers externes portés par `integrations`.

---

## Classification

### Catégorie documentaire

`cross-cutting`

### Criticité architecturale

`transverse structurant`

### Activable

`oui`

Le domaine `behavior` est activable.
Lorsqu’il est activé, il devient structurant pour la segmentation comportementale, les états de parcours et certaines lectures d’intention ou de friction.

---

## Source de vérité

Le domaine `behavior` est la source de vérité pour :

- les lectures comportementales dérivées gouvernées par le système ;
- les segments comportementaux explicites ;
- les états de parcours observés portés par le système ;
- les profils comportementaux structurés ;
- les règles de dérivation ou d’exposition comportementale lorsqu’elles sont portées ici ;
- ses lectures structurées consommables par les domaines autorisés.

Le domaine `behavior` n’est pas la source de vérité pour :

- les signaux de mesure bruts, qui relèvent de `tracking` ;
- l’attribution marketing, qui relève de `attribution` ;
- l’analytics consolidée, qui relève de `analytics` ;
- la relation client enrichie, qui relève de `crm` ;
- les consentements, qui relèvent de `consent` ;
- les campagnes marketing ou dispositifs de conversion eux-mêmes ;
- les DTO providers externes.

Une lecture comportementale est une interprétation gouvernée de signaux et contextes.
Elle ne doit pas être confondue avec :

- un signal brut ;
- un score opaque ;
- une fiche CRM ;
- une règle de consentement ;
- une campagne marketing ;
- une vue analytique consolidée.

---

## Responsabilités

Le domaine `behavior` est responsable de :

- définir ce qu’est une lecture comportementale dans le système ;
- porter les signaux comportementaux dérivés ;
- porter les segments comportementaux ;
- porter les états de parcours observés ;
- porter les profils comportementaux structurés ;
- exposer une lecture gouvernée de segments, profils, états de parcours et signaux d’intention ;
- publier les événements significatifs liés à la vie d’une lecture comportementale ;
- protéger le système contre les interprétations implicites, opaques ou contradictoires.

Selon le périmètre exact du projet, le domaine peut également être responsable de :

- signaux d’intérêt produit ;
- détection de friction ;
- détection d’abandon de parcours ;
- segmentation visiteurs ou clients ;
- niveaux d’intention probables ;
- politiques locales de dérivation ;
- neutralisation de certaines lectures selon consentement ou capability ;
- profils comportementaux multi-sessions lorsque cela est autorisé.

---

## Non-responsabilités

Le domaine `behavior` n’est pas responsable de :

- porter les signaux bruts de mesure ;
- porter l’attribution marketing ;
- porter l’analytics consolidée ;
- porter la relation client enrichie ;
- porter les consentements ;
- porter les campagnes marketing ou les dispositifs de conversion eux-mêmes ;
- exécuter les intégrations provider-specific ;
- devenir un fourre-tout mélangeant tracking, scoring opaque, ciblage marketing et profilage sans langage métier clair.

Le domaine `behavior` ne doit pas devenir :

- un doublon de `tracking` ;
- un doublon de `analytics` ;
- un doublon de `crm` ;
- un doublon de `consent` ;
- un conteneur flou de segments ou scores sans gouvernance métier.

---

## Invariants

Les invariants minimaux sont les suivants :

- une lecture comportementale s’appuie sur des sources identifiées et explicites ;
- `behavior` ne se confond pas avec `tracking` ;
- `behavior` ne se confond pas avec `analytics` ;
- `behavior` ne se confond pas avec `crm` ;
- `behavior` ne se confond pas avec `consent` ;
- les autres domaines ne doivent pas recréer librement leur propre vérité divergente de lecture comportementale quand le cadre commun `behavior` existe ;
- une dérivation comportementale peut être neutralisée par les règles de consentement, de capability ou d’exposition sans supprimer la structure du domaine ;
- une lecture comportementale identique à contexte identique doit rester déterministe selon les règles retenues ;
- une lecture absente, neutralisée ou non calculée doit pouvoir être expliquée.

Le domaine protège la cohérence de l’interprétation comportementale, pas la vérité primaire des signaux source.

---

## Dépendances

### Dépendances métier

Le domaine `behavior` interagit fortement avec :

- `tracking`
- `customers`
- `users`
- `stores`

### Dépendances transverses

Le domaine dépend également de :

- `consent`, pour vérifier si certaines dérivations comportementales sont autorisées
- `conversion`
- `crm`
- `marketing`
- `recommendations`
- `analytics`
- `dashboarding`
- `audit`
- `observability`

### Dépendances externes

Le domaine peut être relié indirectement à :

- plateformes de collecte comportementale ;
- moteurs de segmentation externes ;
- CDP ou outils d’activation ;
- autres systèmes via `integrations`.

### Règle de frontière

Le domaine `behavior` porte l’interprétation comportementale structurée.
Il ne doit pas absorber :

- les signaux bruts ;
- l’attribution ;
- l’analytics consolidée ;
- le CRM ;
- le consentement ;
- ni les DTO providers externes.

---

## Événements significatifs

Le domaine `behavior` publie ou peut publier des événements significatifs tels que :

- segment comportemental attribué ;
- profil comportemental mis à jour ;
- état de parcours modifié ;
- signal comportemental dérivé ;
- politique comportementale mise à jour.

Le domaine peut consommer des signaux liés à :

- événement de tracking créé ;
- panier mis à jour ;
- readiness checkout modifiée ;
- commande créée ;
- inscription newsletter créée ;
- inscription événementielle créée ;
- capability boutique modifiée ;
- action structurée de recalcul ou de réévaluation comportementale.

Les noms exacts doivent rester dans le langage interne du système.

---

## Cycle de vie

Le domaine `behavior` possède un cycle de vie partiel au niveau des lectures, segments et profils qu’il porte.

Le cycle exact dépend du projet, mais il doit au minimum distinguer :

- calculé ;
- actif ;
- neutralisé, si pertinent ;
- archivé, si pertinent.

Des états supplémentaires peuvent exister :

- en attente ;
- indéterminé ;
- restreint ;
- recalculé ;
- expiré.

Le domaine doit éviter :

- les profils “fantômes” ;
- les changements silencieux de segmentation ;
- les états purement techniques non interprétables métier.

---

## Interfaces et échanges

Le domaine `behavior` expose principalement :

- des segments comportementaux ;
- des profils comportementaux structurés ;
- des états de parcours observés ;
- des signaux d’intention ou de friction dérivés ;
- des lectures exploitables par `conversion`, `crm`, `marketing`, `recommendations`, `analytics`, `dashboarding` et certaines couches d’administration.

Le domaine reçoit principalement :

- des signaux structurés issus de `tracking` ;
- des contextes de session, parcours, boutique, canal ou acteur ;
- des événements métier utiles à l’interprétation comportementale comme vues produit, interactions panier, débuts ou abandons de checkout, inscriptions ou retours de visite ;
- des demandes de lecture de segment ou de profil comportemental ;
- des demandes d’évaluation d’un état de parcours ou d’un niveau d’intérêt comportemental.

Le domaine ne doit pas exposer un contrat canonique dicté par un provider externe.

---

## Contraintes d’intégration

Le domaine `behavior` peut être exposé à des contraintes telles que :

- multi-sessions ;
- signaux partiels ;
- dépendance au consentement ;
- capabilities activables ;
- recalcul différé ;
- segmentation multi-boutiques ;
- projection vers systèmes externes ;
- rétrocompatibilité des segments ou profils.

Règles minimales :

- la hiérarchie d’autorité doit être explicite ;
- la vérité comportementale interne reste dans `behavior` ;
- les DTO providers restent dans `integrations` ;
- les traitements rejouables doivent être idempotents ou neutralisés ;
- un signal insuffisant ou ambigu ne doit pas produire silencieusement une lecture trompeuse ;
- les conflits entre signal, contexte, consentement, capability et politique doivent être explicables.

---

## Données sensibles / sécurité

Le domaine `behavior` manipule des lectures potentiellement sensibles sur les parcours et comportements d’acteurs.

Points de vigilance :

- contrôle strict des droits de lecture et d’écriture ;
- respect du cadre de consentement applicable ;
- séparation claire entre signal brut, lecture comportementale et usage consommateur ;
- limitation de l’exposition selon le rôle, le scope et la sensibilité ;
- audit des changements sensibles de règles de segmentation ou de profilage comportemental.

---

## Observabilité et audit

Le domaine `behavior` doit rendre visibles au minimum :

- quel segment ou profil comportemental a été attribué ;
- à partir de quels signaux ou contextes ;
- pourquoi une lecture comportementale a été calculée, neutralisée ou non disponible ;
- si une absence de dérivation vient d’une capability inactive, d’un consentement absent, d’un signal insuffisant ou d’une règle applicable ;
- quels changements significatifs ont affecté les règles ou profils comportementaux.

L’audit doit permettre de répondre à des questions comme :

- quel segment, profil ou état de parcours a été créé ou modifié ;
- quand ;
- selon quelle origine ;
- avec quels signaux ou règles utilisés ;
- avec quelle action manuelle significative ;
- avec quel impact sur les lectures aval autorisées.

L’observabilité doit distinguer :

- erreur de modèle ;
- erreur technique ;
- signaux insuffisants ;
- capability inactive ;
- consentement absent ;
- exposition non autorisée ;
- conflit de règles de dérivation.

---

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `BehaviorSignal` : signal comportemental dérivé ;
- `BehaviorSegment` : segment comportemental explicite ;
- `BehaviorJourneyState` : état observé d’un parcours ;
- `BehaviorProfile` : profil comportemental structuré ;
- `BehaviorPolicy` : règle de dérivation ou d’exposition ;
- `BehaviorActorRef` : référence vers l’acteur concerné lorsque cela est autorisé.

---

## Impact de maintenance / exploitation

Le domaine `behavior` a un impact d’exploitation moyen à élevé lorsqu’il est activé.

Raisons :

- il influence segmentation, conversion, CRM et priorisation marketing ;
- ses erreurs dégradent interprétation, ciblage et cohérence des lectures aval ;
- il se situe à la frontière entre tracking, consentement et usages métier ;
- il nécessite une forte explicabilité des dérivations ;
- il peut dépendre de signaux sensibles et de règles strictes d’exposition.

En exploitation, une attention particulière doit être portée à :

- la qualité des signaux ;
- la cohérence des segments ;
- les neutralisations liées au consentement ;
- la traçabilité des changements ;
- la cohérence avec conversion, CRM et marketing ;
- les effets de bord sur analytics et dashboarding.

Le domaine doit être considéré comme structurant dès qu’une lecture comportementale gouvernée réelle existe.

---

## Limites du domaine

Le domaine `behavior` s’arrête :

- avant les signaux de mesure bruts ;
- avant l’attribution ;
- avant l’analytics consolidée ;
- avant le CRM ;
- avant le consentement ;
- avant les intégrations externes ;
- avant les DTO providers externes.

Le domaine `behavior` porte les lectures comportementales structurées du système.
Il ne doit pas devenir un moteur opaque de profilage, un doublon du tracking ou un conteneur flou de segments sans gouvernance.

---

## Questions ouvertes

À confirmer explicitement dans le projet :

- la frontière exacte entre `behavior` et `tracking` ;
- la frontière exacte entre `behavior` et `crm` ;
- la part exacte des profils persistés réellement supportés ;
- la gouvernance des recalculs et neutralisations ;
- la hiérarchie entre vérité interne et outils externes éventuels ;
- la place exacte des lectures comportementales autorisées en V1.

Si ces points sont déjà tranchés ailleurs, ils doivent être réinjectés ici et sortir de cette section.

---

## Documents liés

- `../../architecture/10-fondations/11-modele-de-classification.md`
- `../../architecture/10-fondations/12-frontieres-et-responsabilites.md`
- `tracking.md`
- `attribution.md`
- `analytics.md`
- `crm.md`
- `consent.md`
- `conversion.md`
- `marketing.md`
- `recommendations.md`
- `dashboarding.md`
- `audit.md`
- `observability.md`
- `../core/commerce/customers.md`
- `../core/foundation/users.md`
- `../core/foundation/stores.md`
- `../optional/platform/integrations.md`
