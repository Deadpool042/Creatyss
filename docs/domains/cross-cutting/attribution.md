# Attribution

## Rôle

Le domaine `attribution` porte l’attribution marketing et commerciale du système.

Il définit :

- ce qu’est une lecture d’attribution du point de vue du système ;
- comment sont structurés les liens entre sources, canaux, campagnes, interactions et événements métier attribuables ;
- comment ce domaine se distingue du tracking brut, de l’analytics consolidée, des campagnes marketing elles-mêmes et des providers externes ;
- comment le système reste maître de sa vérité interne sur les lectures d’attribution.

Le domaine existe pour fournir une représentation explicite de l’attribution, distincte :

- du tracking brut porté par `tracking` ;
- de l’analytics consolidée portée par `analytics` ;
- des campagnes marketing portées par `marketing` ;
- des DTO providers externes portés par `integrations`.

---

## Classification

### Catégorie documentaire

`cross-cutting`

### Criticité architecturale

`transverse structurant`

### Activable

`oui`

Le domaine `attribution` est activable.
Lorsqu’il est activé, il devient structurant pour les lectures de provenance, de contribution et de crédit marketing ou commercial.

---

## Source de vérité

Le domaine `attribution` est la source de vérité pour :

- les lectures d’attribution structurées ;
- les sources et canaux d’acquisition portés par le système ;
- les modèles d’attribution retenus ;
- les crédits d’attribution appliqués à des événements métier pertinents ;
- les périmètres de lecture d’attribution ;
- ses lectures structurées consommables par les domaines autorisés.

Le domaine `attribution` n’est pas la source de vérité pour :

- les signaux de mesure bruts, qui relèvent de `tracking` ;
- les vues analytiques consolidées, qui relèvent de `analytics` ;
- les campagnes marketing elles-mêmes, qui relèvent de `marketing` ;
- les providers publicitaires ou analytics externes, qui relèvent de `integrations` ;
- les vérités métier source des domaines coeur ;
- les DTO providers externes.

Une attribution est une lecture gouvernée de contribution ou de provenance.
Elle ne doit pas être confondue avec :

- un signal brut ;
- une vue analytique globale ;
- une campagne marketing ;
- un provider externe ;
- une vérité métier primaire ;
- un calcul opaque sans langage métier explicite.

---

## Responsabilités

Le domaine `attribution` est responsable de :

- définir ce qu’est une lecture d’attribution dans le système ;
- porter les sources et canaux d’acquisition gouvernés par le système ;
- porter les modèles d’attribution retenus ;
- porter les crédits d’attribution ;
- exposer une lecture gouvernée des contributions de source, canal ou campagne ;
- publier les événements significatifs liés à la vie d’une lecture ou d’un modèle d’attribution ;
- protéger le système contre les attributions implicites, opaques ou contradictoires.

Selon le périmètre exact du projet, le domaine peut également être responsable de :

- attribution de commande ;
- attribution d’inscription newsletter ;
- attribution d’inscription événementielle ;
- modèles first touch, last touch ou autres modèles gouvernés ;
- règles de neutralisation ou d’indétermination ;
- lectures par boutique, période, campagne ou source ;
- politiques locales d’attribution.

---

## Non-responsabilités

Le domaine `attribution` n’est pas responsable de :

- porter les signaux bruts de mesure ;
- porter les vues analytiques consolidées ;
- porter les campagnes marketing elles-mêmes ;
- porter les providers externes analytics ou publicitaires ;
- exécuter les intégrations provider-specific ;
- devenir un moteur opaque mélangeant heuristiques, reporting et tracking sans langage métier clair ;
- redéfinir les vérités métier source des domaines coeur.

Le domaine `attribution` ne doit pas devenir :

- un doublon de `tracking` ;
- un doublon de `analytics` ;
- un doublon de `marketing` ;
- un doublon de `integrations` ;
- un conteneur flou de heuristiques sans gouvernance métier.

---

## Invariants

Les invariants minimaux sont les suivants :

- une lecture d’attribution s’appuie sur des sources identifiées et explicites ;
- `attribution` ne se confond pas avec `tracking` ;
- `attribution` ne se confond pas avec `analytics` ;
- `attribution` ne se confond pas avec `marketing` ;
- les crédits d’attribution ne doivent pas redéfinir de manière divergente les vérités métier source ;
- les autres domaines ne doivent pas recréer leur propre vérité divergente des lectures d’attribution lorsqu’une lecture commune existe ;
- une attribution identique à contexte identique doit rester déterministe selon le modèle retenu ;
- une attribution absente, neutralisée ou indéterminée doit pouvoir être explicitée.

Le domaine protège la cohérence de la lecture d’attribution, pas la vérité primaire des signaux source.

---

## Dépendances

### Dépendances métier

Le domaine `attribution` interagit fortement avec :

- `tracking`
- `orders`
- `newsletter`
- `events`
- `marketing`
- `stores`

### Dépendances transverses

Le domaine dépend également de :

- `analytics`
- `conversion`
- `dashboarding`
- `audit`, pour certaines corrélations sensibles si nécessaire
- `observability`, pour expliquer pourquoi une attribution a été retenue, neutralisée ou laissée indéterminée
- `jobs`, si certaines régénérations ou recalculs sont différés

### Dépendances externes

Le domaine peut être relié indirectement à :

- plateformes publicitaires ;
- outils analytics externes ;
- outils de marketing automation ;
- data warehouses externes ;
- autres systèmes via `integrations`.

### Règle de frontière

Le domaine `attribution` porte la lecture d’attribution.
Il ne doit pas absorber :

- les signaux bruts ;
- l’analytics consolidée ;
- les campagnes marketing ;
- les providers externes ;
- ni les DTO providers externes.

---

## Événements significatifs

Le domaine `attribution` publie ou peut publier des événements significatifs tels que :

- modèle d’attribution mis à jour ;
- crédit d’attribution assigné ;
- lecture d’attribution rafraîchie ;
- politique d’attribution modifiée ;
- périmètre d’attribution modifié.

Le domaine peut consommer des signaux liés à :

- événement de tracking créé ;
- commande créée ;
- inscription newsletter créée ;
- inscription événementielle créée ;
- campagne marketing activée ;
- capability boutique modifiée ;
- action administrative structurée ;
- recalcul ou correction validée.

Les noms exacts doivent rester dans le langage interne du système.

---

## Cycle de vie

Le domaine `attribution` possède un cycle de vie partiel au niveau des lectures, crédits et modèles qu’il porte.

Le cycle exact dépend du projet, mais il doit au minimum distinguer :

- calculé ;
- rafraîchi ;
- neutralisé, si pertinent ;
- archivé, si pertinent.

Des états supplémentaires peuvent exister :

- en attente ;
- indéterminé ;
- restreint ;
- recalculé.

Le domaine doit éviter :

- les attributions “fantômes” ;
- les crédits non expliqués ;
- les changements silencieux de modèle ;
- les états purement techniques non interprétables métier.

---

## Interfaces et échanges

Le domaine `attribution` expose principalement :

- des lectures d’attribution structurées ;
- des sources et canaux attribués ;
- des crédits d’attribution consolidés ;
- des vues exploitables par `analytics`, `marketing`, `conversion`, `dashboarding` et certaines couches d’administration ;
- des structures d’attribution prêtes à être consommées par les domaines autorisés.

Le domaine reçoit principalement :

- des signaux structurés issus de `tracking` ;
- des contextes de parcours, session, campagne ou canal ;
- des événements métier pertinents comme une commande, une inscription newsletter ou une inscription à un événement ;
- des demandes de lecture d’attribution par période, canal, campagne ou objet métier ;
- les capabilities actives et le contexte boutique.

Le domaine ne doit pas exposer un contrat canonique dicté par un provider externe.

---

## Contraintes d’intégration

Le domaine `attribution` peut être exposé à des contraintes telles que :

- multi-boutiques ;
- modèles multiples ;
- dépendance au consentement ;
- recalcul différé ;
- sources partielles ;
- campagnes multi-canaux ;
- projection vers systèmes externes ;
- rétrocompatibilité des modèles ou sources.

Règles minimales :

- la hiérarchie d’autorité doit être explicite ;
- la vérité interne d’attribution reste dans `attribution` ;
- les DTO providers restent dans `integrations` ;
- les traitements rejouables doivent être idempotents ou neutralisés ;
- un signal manquant ou ambigu ne doit pas produire silencieusement une attribution trompeuse ;
- les conflits entre modèle, source, campagne, consentement et événement métier doivent être explicables.

---

## Données sensibles / sécurité

Le domaine `attribution` manipule des données potentiellement sensibles de parcours, de source et de performance marketing.

Points de vigilance :

- contrôle strict des droits de lecture ;
- respect des capabilities actives et du cadre de consentement applicable ;
- séparation claire entre signal brut, modèle d’attribution et projection externe ;
- limitation des expositions selon le rôle et le scope ;
- audit des changements sensibles de modèles ou de règles d’attribution.

---

## Observabilité et audit

Le domaine `attribution` doit rendre visibles au minimum :

- pourquoi une source, un canal ou une campagne a été attribué ;
- quel modèle d’attribution a été utilisé ;
- quelles sources amont ont été prises en compte ;
- si une attribution est absente à cause d’une capability inactive, d’un signal manquant, d’une règle métier ou d’un cadre de consentement restrictif ;
- quels changements significatifs ont affecté un modèle ou une lecture d’attribution.

L’audit doit permettre de répondre à des questions comme :

- quel modèle d’attribution a changé ;
- quand ;
- selon quelle origine ;
- avec quel crédit attribué ou recalculé ;
- avec quelle règle appliquée ;
- avec quel impact sur les lectures aval.

L’observabilité doit distinguer :

- erreur de modèle ;
- erreur technique ;
- source inconnue ;
- signal insuffisant ;
- attribution indéterminée ;
- consentement restrictif ;
- scope non autorisé.

---

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `AttributionSource` : source ou canal d’acquisition ;
- `AttributionModel` : modèle d’attribution retenu ;
- `AttributionCredit` : crédit attribué à une source ou campagne ;
- `AttributionView` : lecture consolidée d’attribution ;
- `AttributionScope` : périmètre de lecture ou d’application de l’attribution ;
- `AttributionPolicy` : règle de gouvernance, de calcul ou de neutralisation.

---

## Impact de maintenance / exploitation

Le domaine `attribution` a un impact d’exploitation moyen à élevé lorsqu’il est activé.

Raisons :

- il influence directement la lecture des performances marketing ;
- ses erreurs dégradent pilotage, interprétation et arbitrages de campagne ;
- il se situe à la frontière entre tracking, marketing, conversion et analytics ;
- il nécessite une forte explicabilité des modèles et crédits ;
- il dépend souvent de signaux partiels ou sensibles.

En exploitation, une attention particulière doit être portée à :

- la qualité des sources ;
- la cohérence des modèles ;
- les attributions indéterminées ;
- la traçabilité des changements ;
- la cohérence avec tracking, marketing et conversion ;
- les effets de bord sur analytics et dashboarding.

Le domaine doit être considéré comme structurant dès qu’une lecture d’attribution réelle existe.

---

## Limites du domaine

Le domaine `attribution` s’arrête :

- avant les signaux de mesure bruts ;
- avant l’analytics consolidée ;
- avant les campagnes marketing elles-mêmes ;
- avant les providers externes ;
- avant les DTO providers externes.

Le domaine `attribution` porte les lectures d’attribution du système.
Il ne doit pas devenir un moteur opaque de tracking, un outil de reporting global ou un doublon des domaines source.

---

## Questions ouvertes

À confirmer explicitement dans le projet :

- la frontière exacte entre `attribution` et `tracking` ;
- la frontière exacte entre `attribution` et `analytics` ;
- la part exacte des modèles réellement supportés ;
- la gouvernance des recalculs ;
- la hiérarchie entre vérité interne et plateformes externes éventuelles ;
- la place exacte du consentement dans le modèle actuel.

Si ces points sont déjà tranchés ailleurs, ils doivent être réinjectés ici et sortir de cette section.

---

## Documents liés

- `../../architecture/10-fondations/11-modele-de-classification.md`
- `../../architecture/10-fondations/12-frontieres-et-responsabilites.md`
- `tracking.md`
- `analytics.md`
- `marketing.md`
- `conversion.md`
- `dashboarding.md`
- `newsletter.md`
- `events.md`
- `../core/orders.md`
- `../core/stores.md`
- `audit.md`
- `observability.md`
- `../core/integrations.md`
