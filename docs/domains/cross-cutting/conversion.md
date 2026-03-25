# Conversion

## Rôle

Le domaine `conversion` porte les mécaniques de conversion du système.

Il définit :

- ce qu’est un dispositif de conversion du point de vue du système ;
- comment sont structurés les mécanismes de relance, d’upsell, de cross-sell, de seuils de progression et d’exposition dans le parcours d’achat ;
- comment ce domaine se distingue des remises, des campagnes marketing, de la newsletter, du CRM, du tracking et des recommandations catalogue génériques ;
- comment le système reste maître de sa vérité interne sur les dispositifs de conversion.

Le domaine existe pour fournir une représentation explicite des mécanismes de conversion, distincte :

- des remises et coupons portés par `discounts` ;
- des campagnes marketing portées par `marketing` ;
- de la newsletter portée par `newsletter` ;
- du CRM enrichi porté par `crm` ;
- du tracking, du comportement et de l’analytics ;
- des recommandations catalogue génériques portées par `recommendations`.

---

## Classification

### Catégorie documentaire

`cross-cutting`

### Criticité architecturale

`transverse structurant`

### Activable

`oui`

Le domaine `conversion` est activable.
Lorsqu’il est activé, il devient structurant pour les mécanismes de relance, de progression commerciale et d’augmentation de conversion dans le parcours d’achat.

---

## Source de vérité

Le domaine `conversion` est la source de vérité pour :

- les dispositifs structurés de conversion ;
- les règles de récupération de panier lorsqu’elles sont portées ici ;
- les propositions d’upsell et de cross-sell gouvernées par ce domaine ;
- les seuils de progression et bénéfices commerciaux portés ici ;
- les expositions effectives des mécanismes de conversion lorsqu’elles sont modélisées ici ;
- ses lectures structurées consommables par les domaines autorisés.

Le domaine `conversion` n’est pas la source de vérité pour :

- les remises et coupons, qui relèvent de `discounts` ;
- les campagnes marketing, qui relèvent de `marketing` ;
- le CRM enrichi, qui relève de `crm` ;
- les recommandations catalogue génériques, qui relèvent de `recommendations` ;
- le tracking brut, qui relève de `tracking` ;
- l’analyse comportementale, qui relève de `behavior` ;
- l’analytics consolidée, qui relève de `analytics` ;
- les DTO providers externes, qui relèvent de `integrations`.

Un dispositif de conversion est un mécanisme métier gouverné du parcours.
Il ne doit pas être confondu avec :

- une réduction commerciale ;
- une campagne marketing ;
- une newsletter ;
- une recommandation catalogue générique ;
- un signal de tracking ;
- une automation provider externe.

---

## Responsabilités

Le domaine `conversion` est responsable de :

- définir ce qu’est un dispositif de conversion dans le système ;
- porter les relances de récupération de panier au niveau métier ;
- porter les seuils de conversion comme le franco de port ou d’autres paliers explicites ;
- porter les propositions d’upsell et de cross-sell gouvernées ici ;
- exposer une lecture gouvernée des dispositifs actifs, inactifs, applicables ou non applicables ;
- publier les événements significatifs liés à la vie d’un mécanisme de conversion ;
- protéger le système contre les dispositifs implicites, opaques ou contradictoires.

Selon le périmètre exact du projet, le domaine peut également être responsable de :

- relances de panier abandonné ;
- seuils de progression commerciale ;
- offres d’upsell contextuelles ;
- offres de cross-sell contextuelles ;
- nudges commerciaux explicites ;
- politiques locales de conversion par boutique ;
- expositions différenciées selon contexte panier ou client ;
- règles de priorité entre plusieurs dispositifs.

---

## Non-responsabilités

Le domaine `conversion` n’est pas responsable de :

- porter les remises et coupons ;
- porter les campagnes marketing ;
- porter le CRM enrichi ;
- porter les recommandations catalogue génériques ;
- porter le tracking ou l’analyse comportementale ;
- porter la newsletter ;
- exécuter les intégrations provider-specific ;
- devenir un fourre-tout mélangeant persuasion, pricing, contenu et diffusion.

Le domaine `conversion` ne doit pas devenir :

- un doublon de `discounts` ;
- un doublon de `marketing` ;
- un doublon de `newsletter` ;
- un doublon de `recommendations` ;
- un conteneur flou de règles commerciales sans frontière claire.

---

## Invariants

Les invariants minimaux sont les suivants :

- un dispositif de conversion possède un identifiant stable et un état explicite ;
- `conversion` ne se confond pas avec `discounts`, `marketing`, `newsletter` ou `recommendations` ;
- un mécanisme de conversion ne vaut pas exécution directe d’un email ou d’une notification sans passage par les domaines concernés ;
- les autres domaines ne doivent pas recréer leur propre vérité divergente des dispositifs de conversion structurés quand le cadre commun `conversion` existe ;
- les seuils et expositions doivent rester explicites et observables ;
- un dispositif inactif ou non applicable ne doit pas être exposé hors règle explicite ;
- deux dispositifs incompatibles ne doivent pas s’appliquer silencieusement sans règle de priorité.

Le domaine protège la cohérence des mécanismes de conversion, pas l’exécution des canaux aval.

---

## Dépendances

### Dépendances métier

Le domaine `conversion` interagit fortement avec :

- `cart`
- `customers`
- `products`
- `marketing`
- `discounts`
- `stores`
- `recommendations`

### Dépendances transverses

Le domaine dépend également de :

- `notifications`
- `newsletter`
- `analytics`
- `dashboarding`
- `audit`
- `observability`

### Dépendances externes

Le domaine peut être relié indirectement à :

- plateformes emailing ;
- providers de notifications ;
- outils marketing automation ;
- providers publicitaires ;
- autres systèmes via `integrations`.

### Règle de frontière

Le domaine `conversion` porte les dispositifs de conversion du parcours.
Il ne doit pas absorber :

- les remises ;
- les campagnes marketing ;
- la newsletter ;
- le CRM ;
- les recommandations génériques ;
- ni les DTO providers externes.

---

## Événements significatifs

Le domaine `conversion` publie ou peut publier des événements significatifs tels que :

- dispositif de conversion créé ;
- dispositif de conversion mis à jour ;
- relance de récupération déclenchée ;
- seuil de conversion atteint ;
- offre de conversion exposée ;
- statut de conversion modifié.

Le domaine peut consommer des signaux liés à :

- panier mis à jour ;
- panier abandonné, si ce signal est formalisé ;
- commande créée ;
- produit publié ;
- campagne marketing activée ;
- capability boutique modifiée ;
- action administrative structurée ;
- recommandation rendue disponible si ce couplage est explicitement retenu.

Les noms exacts doivent rester dans le langage interne du système.

---

## Cycle de vie

Le domaine `conversion` possède un cycle de vie explicite.

Le cycle exact dépend du projet, mais il doit au minimum distinguer :

- brouillon ;
- actif ;
- inactif ;
- archivé.

Des états supplémentaires peuvent exister :

- planifié ;
- suspendu ;
- expiré ;
- restreint.

Le domaine doit éviter :

- les dispositifs “fantômes” ;
- les changements silencieux d’exposition ;
- les états purement techniques non interprétables métier.

---

## Interfaces et échanges

Le domaine `conversion` expose principalement :

- des dispositifs de relance ou de récupération ;
- des suggestions d’upsell structurées ;
- des suggestions de cross-sell structurées ;
- des seuils et messages de progression exploitables côté parcours d’achat ;
- une lecture exploitable par `notifications`, `newsletter`, `analytics`, `dashboarding` et le storefront.

Le domaine reçoit principalement :

- un contexte panier issu de `cart` ;
- un contexte client issu de `customers` si applicable ;
- des lectures produit ou catalogue issues de `products` ;
- des lectures de contexte commercial issues de `marketing` ou `discounts` si nécessaire ;
- des signaux comportementaux ou analytiques issus de domaines spécialisés, sans les absorber ;
- des demandes de lecture des dispositifs de conversion actifs.

Le domaine ne doit pas exposer un contrat canonique dicté par un provider externe.

---

## Contraintes d’intégration

Le domaine `conversion` peut être exposé à des contraintes telles que :

- parcours multi-boutiques ;
- dépendance à capabilities activables ;
- expositions contextuelles selon panier ou client ;
- relances différées ;
- coexistence avec remises ou campagnes ;
- consommation de recommandations ;
- projection vers canaux aval ;
- rétrocompatibilité des seuils ou règles de priorité.

Règles minimales :

- la hiérarchie d’autorité doit être explicite ;
- la vérité interne des dispositifs de conversion reste dans `conversion` ;
- les DTO providers restent dans `integrations` ;
- les traitements rejouables doivent être idempotents ou neutralisés ;
- un dispositif incohérent ne doit pas être promu silencieusement ;
- les conflits entre contexte panier, seuil, campagne, remise et canal aval doivent être explicables.

---

## Données sensibles / sécurité

Le domaine `conversion` ne porte pas de secrets techniques par lui-même, mais il manipule des mécanismes influençant directement le parcours d’achat.

Points de vigilance :

- contrôle strict des droits d’écriture ;
- cohérence entre dispositifs de conversion et capabilities actives ;
- séparation nette entre conversion, réduction commerciale et tracking ;
- audit des modifications significatives de seuils, relances et expositions ;
- limitation des effets de bord sur des parcours sensibles.

---

## Observabilité et audit

Le domaine `conversion` doit rendre visibles au minimum :

- pourquoi un dispositif de conversion est actif ou non ;
- pourquoi un seuil a été atteint ou non ;
- pourquoi une relance de récupération a été déclenchée ou non ;
- quel contexte panier, client ou campagne a influencé la décision ;
- si une absence d’activation vient d’une capability inactive, d’une règle métier ou d’un workflow amont incomplet.

L’audit doit permettre de répondre à des questions comme :

- quel dispositif de conversion a été créé, modifié, activé ou désactivé ;
- quand ;
- selon quelle origine ;
- avec quel seuil, offre ou règle affectée ;
- avec quelle intervention manuelle significative ;
- avec quel impact sur les parcours exposés.

L’observabilité doit distinguer :

- erreur de modèle ;
- erreur technique ;
- dispositif invalide ;
- seuil incohérent ;
- contexte incompatible ;
- capability inactive ;
- conflit entre dispositifs.

---

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `ConversionFlow` : dispositif structuré de conversion ;
- `CartRecoveryRule` : règle de récupération de panier ;
- `UpsellOffer` : proposition d’upsell ;
- `CrossSellOffer` : proposition de cross-sell ;
- `ConversionThreshold` : seuil de progression ou de déclenchement ;
- `ConversionExposure` : exposition effective d’un mécanisme de conversion ;
- `ConversionPolicy` : règle de gouvernance, d’activation ou de priorité.

---

## Impact de maintenance / exploitation

Le domaine `conversion` a un impact d’exploitation moyen à élevé lorsqu’il est activé.

Raisons :

- il influence directement le parcours d’achat ;
- ses erreurs dégradent conversion, cohérence commerciale et expérience utilisateur ;
- il se situe à la frontière entre panier, catalogue, marketing et communication aval ;
- il nécessite une forte explicabilité des déclenchements et non-déclenchements ;
- il peut dépendre de plusieurs capabilities et domaines consommateurs.

En exploitation, une attention particulière doit être portée à :

- la cohérence des seuils ;
- la pertinence des expositions ;
- la traçabilité des changements ;
- la cohérence avec discounts, marketing et recommandations ;
- les effets de bord sur notifications, newsletter et analytics ;
- les conflits entre mécanismes simultanés.

Le domaine doit être considéré comme structurant dès qu’un pilotage réel de conversion existe.

---

## Limites du domaine

Le domaine `conversion` s’arrête :

- avant les remises et coupons ;
- avant les campagnes marketing ;
- avant la newsletter ;
- avant le CRM ;
- avant les recommandations catalogue génériques ;
- avant les intégrations externes ;
- avant les DTO providers externes.

Le domaine `conversion` porte les dispositifs de conversion du système.
Il ne doit pas devenir un moteur global de persuasion commerciale, un doublon des remises ou un conteneur flou d’automations.

---

## Questions ouvertes

À confirmer explicitement dans le projet :

- la frontière exacte entre `conversion` et `discounts` ;
- la frontière exacte entre `conversion` et `recommendations` ;
- la part exacte des relances réellement supportées ;
- la gouvernance des conflits entre dispositifs ;
- la hiérarchie entre vérité interne et automations externes éventuelles ;
- la place exacte des seuils de bénéfices commerciaux dans le modèle actuel.

Si ces points sont déjà tranchés ailleurs, ils doivent être réinjectés ici et sortir de cette section.

---

## Documents liés

- `../../architecture/10-fondations/11-modele-de-classification.md`
- `../../architecture/10-fondations/12-frontieres-et-responsabilites.md`
- `../core/cart.md`
- `../core/customers.md`
- `../core/products.md`
- `marketing.md`
- `discounts.md`
- `newsletter.md`
- `notifications.md`
- `analytics.md`
- `dashboarding.md`
- `recommendations.md`
- `audit.md`
- `observability.md`
- `../core/stores.md`
- `../core/integrations.md`
