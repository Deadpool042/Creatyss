# Tracking

## Rôle

Le domaine `tracking` porte la collecte, la structuration et l’exposition des signaux de suivi comportemental ou d’interaction du système.

Il définit :

- quels événements de tracking existent ;
- dans quels contextes ils peuvent être émis ;
- comment ils sont structurés ;
- comment ils se distinguent des événements de domaine, des logs techniques et de l’audit ;
- comment ils sont rendus exploitables pour les usages aval autorisés.

Le domaine existe pour fournir une vérité interne sur les signaux de tracking, distincte :

- des faits métier portés par `domain-events` ;
- des logs et métriques portés par `observability` ;
- de l’audit ;
- des outils analytics ou marketing externes ;
- du consentement, qui conditionne certains usages mais ne constitue pas le tracking lui-même.

---

## Classification

### Catégorie documentaire

`cross-cutting`

### Criticité architecturale

`transverse optionnelle`

### Activable

`oui`

Le domaine `tracking` est optionnel du point de vue produit, mais il devient structurant dès lors qu’il est activé et relié à des usages analytics, attribution, marketing ou optimisation.

---

## Source de vérité

Le domaine `tracking` est la source de vérité pour :

- la représentation interne des événements de tracking ;
- le vocabulaire des signaux de tracking reconnus par le système ;
- la structure minimale des événements collectés ;
- les règles internes de production et d’acheminement de ces signaux ;
- l’état de certains signaux de tracking si le modèle le porte.

Le domaine `tracking` n’est pas la source de vérité pour :

- les faits métier, qui relèvent de `domain-events` ;
- les logs techniques, qui relèvent d’`observability` ;
- les actions significatives opposables, qui relèvent d’`audit` ;
- le consentement, qui relève de `consent` ;
- la politique juridique générale, qui relève de `legal` ;
- l’outil analytics externe ;
- les campagnes marketing.

Le tracking décrit des signaux d’interaction ou de comportement.
Il ne doit pas être confondu avec la vérité métier.

---

## Responsabilités

Le domaine `tracking` est responsable de :

- définir les événements de tracking reconnus par le système ;
- structurer les payloads internes de tracking ;
- encadrer la production de signaux de tracking ;
- distinguer les signaux exploitables des signaux interdits ou non gouvernés ;
- exposer des événements de tracking cohérents aux consommateurs autorisés ;
- publier les événements significatifs liés au tracking ;
- protéger le système contre la dérive vers un tracking implicite, opaque ou non gouverné.

Selon le périmètre exact du projet, le domaine peut également être responsable de :

- page views ;
- interactions UI significatives ;
- conversions marketing ou produit ;
- événements de funnel ;
- corrélation minimale entre parcours et sources de trafic ;
- enrichissement contextuel minimal autorisé ;
- statut de transmission à un outil externe si le modèle le porte.

---

## Non-responsabilités

Le domaine `tracking` n’est pas responsable de :

- définir les faits métier ;
- gouverner l’observabilité technique ;
- remplacer l’audit ;
- porter le consentement ;
- définir la politique juridique ;
- exécuter les campagnes marketing ;
- définir la relation client complète ;
- porter toute la logique analytics ou attribution à lui seul ;
- devenir un conteneur générique pour tout événement du système.

Le domaine `tracking` ne doit pas devenir :

- un miroir brut d’un provider externe ;
- un bus événementiel parallèle non gouverné ;
- une collecte opportuniste sans cadre explicite.

---

## Invariants

Les invariants minimaux sont les suivants :

- un événement de tracking doit avoir un type explicite ;
- un événement de tracking doit être interprétable sans ambiguïté ;
- un événement de tracking ne doit pas être confondu avec un fait métier ;
- la structure d’un événement de tracking doit rester cohérente ;
- un signal soumis à consentement ne doit pas être émis comme si le consentement était acquis sans règle explicite ;
- une mutation du modèle de tracking doit être traçable ;
- un événement de tracking ne doit pas porter plus d’information que ce que le domaine autorise explicitement.

Le domaine protège la cohérence et la gouvernance du signal de tracking.

---

## Dépendances

### Dépendances métier

Le domaine `tracking` interagit fortement avec :

- `consent`
- `legal`
- `marketing`
- `analytics`
- `conversion`
- `attribution`
- `customers`, selon le niveau de rattachement autorisé
- `products`, `cart`, `checkout`, `orders`, si certains événements de parcours sont suivis

### Dépendances transverses

Le domaine dépend également de :

- `observability`
- `audit`
- `jobs`
- `integrations`

### Dépendances externes

Le domaine peut interagir avec :

- outils analytics ;
- outils d’attribution ;
- CDP ;
- plateformes marketing ;
- gestionnaires de tags.

### Règle de frontière

Le domaine `tracking` porte le signal de tracking.
Il ne doit pas absorber :

- la vérité métier ;
- la conformité juridique complète ;
- la logique des outils externes ;
- ni l’ensemble de l’analytics.

---

## Événements significatifs

Le domaine `tracking` publie ou peut publier des événements significatifs tels que :

- événement de tracking émis ;
- événement de tracking rejeté ;
- modèle d’événement de tracking modifié ;
- transmission de tracking réussie ;
- transmission de tracking échouée ;
- tracking désactivé sur un périmètre ;
- tracking réactivé sur un périmètre.

Le domaine peut consommer des signaux liés à :

- actions UI significatives ;
- changements de consentement ;
- changements de politique légale ;
- synchronisations avec des outils externes ;
- événements métier transformés en signaux de tracking lorsqu’une telle projection est explicitement autorisée.

Les noms exacts doivent rester compréhensibles dans le langage interne du système.

---

## Cycle de vie

Le domaine `tracking` ne porte pas nécessairement un cycle de vie métier unique comparable à `orders`.

Cette section reste applicable via les états d’un signal ou de sa transmission, par exemple :

- produit ;
- validé ;
- rejeté ;
- transmis ;
- échoué ;
- archivé, si pertinent.

Si le modèle retenu ne porte pas un cycle de vie unifié, cela doit être assumé explicitement.

Le domaine doit éviter :

- les signaux “fantômes” ;
- les statuts implicites ;
- les transmissions silencieusement perdues sans visibilité.

---

## Interfaces et échanges

Le domaine `tracking` expose principalement :

- des commandes ou points d’émission de signaux de tracking ;
- des représentations internes d’événements de tracking ;
- des lectures d’état de transmission si le modèle les porte ;
- des événements significatifs liés au tracking.

Le domaine reçoit principalement :

- des interactions UI ou applicatives ;
- des signaux de consentement ;
- des règles de configuration ;
- des demandes de transmission ou de synchronisation ;
- des retours d’outils externes lorsque l’architecture le prévoit.

Le domaine ne doit pas exposer comme contrat interne canonique le schéma natif d’un provider externe.

---

## Contraintes d’intégration

Le domaine `tracking` peut être exposé à des contraintes telles que :

- consentement absent, retiré ou ambigu ;
- volume élevé ;
- transmission asynchrone ;
- pertes partielles ;
- duplication ;
- divergence entre modèle interne et outil externe ;
- retard de propagation ;
- filtrage ou transformation avant transmission.

Règles minimales :

- la hiérarchie d’autorité entre état interne et outil externe doit être explicite ;
- les signaux soumis à consentement doivent être gouvernés par une règle explicite ;
- les traitements rejouables doivent être idempotents ou neutralisés ;
- un provider externe ne doit pas redéfinir silencieusement le vocabulaire interne ;
- les échecs de transmission significatifs doivent être visibles ;
- le domaine ne doit pas devenir une simple tuyauterie opaque.

---

## Observabilité et audit

Le domaine `tracking` doit rendre visibles au minimum :

- les émissions significatives ;
- les rejets ;
- les erreurs de transformation ;
- les erreurs de transmission ;
- les divergences externes ;
- les désactivations liées au consentement ou à la politique ;
- les événements significatifs publiés.

L’audit doit permettre de répondre à des questions comme :

- quel type de signal a été émis ;
- quand ;
- dans quel contexte ;
- sous quelle règle de consentement ou de configuration ;
- avec quelle destination ;
- avec quel résultat de transmission.

L’observabilité doit distinguer :

- erreur de modèle ;
- erreur technique ;
- rejet lié au consentement ;
- divergence provider ;
- perte ou retard de transmission.

---

## Impact de maintenance / exploitation

Le domaine `tracking` a un impact d’exploitation moyen à élevé lorsqu’il est activé.

Raisons :

- il touche à la conformité opérationnelle ;
- il alimente potentiellement plusieurs outils externes ;
- il peut générer beaucoup de volume ;
- ses erreurs sont souvent silencieuses mais structurantes ;
- il influence la qualité des usages analytics et marketing.

En exploitation, une attention particulière doit être portée à :

- la cohérence du vocabulaire de tracking ;
- la qualité des payloads ;
- les divergences avec les outils externes ;
- la corrélation avec `consent` et `legal` ;
- le bruit et le volume ;
- les pertes de signal importantes.

Le domaine doit être considéré comme sensible dès lors qu’il est activé.

---

## Limites du domaine

Le domaine `tracking` s’arrête :

- avant la vérité métier ;
- avant le consentement ;
- avant la politique juridique générale ;
- avant l’observabilité technique générale ;
- avant les campagnes marketing ;
- avant l’analytics au sens large ;
- avant les intégrations techniques non spécifiques.

Le domaine `tracking` porte le signal de tracking.
Il ne doit pas absorber toute la mesure, toute la conformité ni toute la logique marketing.

---

## Questions ouvertes

À confirmer explicitement dans le projet :

- la frontière exacte entre `tracking` et `analytics` ;
- la frontière exacte entre `tracking` et `attribution` ;
- la frontière exacte entre `tracking` et `consent` ;
- la liste canonique des événements réellement supportés ;
- la hiérarchie entre modèle interne et providers externes ;
- la politique de rétention ;
- la politique de corrélation avec des identités connues ;
- la stratégie de transmission synchrone vs différée.

Si ces points sont déjà tranchés ailleurs, ils doivent être réinjectés ici et sortir de cette section.

---

## Documents liés

- `consent.md`
- `legal.md`
- `analytics.md`
- `attribution.md`
- `conversion.md`
- `marketing.md`
- `observability.md`
- `audit.md`
- `../../domains/core/integrations.md`
- `../../domains/core/domain-events.md`
