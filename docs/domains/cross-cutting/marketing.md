# Marketing

## Rôle

Le domaine `marketing` porte les mécanismes, objets et règles liés à l’activation marketing du système.

Il définit :

- comment le système structure certaines actions marketing ;
- quels objets ou périmètres relèvent du marketing ;
- comment le marketing consomme des signaux issus d’autres domaines ;
- comment il se distingue du CRM, du consentement, du tracking et de la newsletter ;
- comment les activations marketing restent gouvernées et compréhensibles.

Le domaine existe pour fournir une couche marketing explicite et structurée, distincte :

- de la relation client portée par `crm` ;
- du consentement porté par `consent` ;
- des signaux de tracking ;
- des campagnes emailing elles-mêmes si elles sont externalisées ;
- des outils externes de marketing automation.

---

## Classification

### Catégorie documentaire

`cross-cutting`

### Criticité architecturale

`transverse optionnelle`

### Activable

`oui`

Le domaine `marketing` est optionnel du point de vue produit, mais il devient structurant dès lors que le système porte réellement :

- des activations marketing ;
- des segments exploitables ;
- des logiques de diffusion ou d’orchestration marketing ;
- des interactions avec des outils externes de marketing.

---

## Source de vérité

Le domaine `marketing` est la source de vérité pour :

- les objets marketing explicitement reconnus par le système ;
- les règles marketing internes portées dans le produit ;
- la représentation des activations marketing lorsqu’elles sont gouvernées en interne ;
- les statuts ou états d’objets marketing si le modèle les porte ;
- les événements significatifs liés aux mécanismes marketing internes.

Le domaine `marketing` n’est pas la source de vérité pour :

- le client métier, qui relève de `customers` ;
- la relation client structurée, qui relève de `crm` ;
- le consentement, qui relève de `consent` ;
- la politique juridique, qui relève de `legal` ;
- les signaux de tracking, qui relèvent de `tracking` ;
- les campagnes ou outils externes de marketing automation en tant que tels ;
- les commandes, paiements, produits et autres vérités coeur.

Le domaine `marketing` porte la couche marketing interne reconnue par le système.
Il ne doit pas devenir une étiquette vague pour toute action de communication ou d’acquisition.

---

## Responsabilités

Le domaine `marketing` est responsable de :

- définir ce qui relève du marketing dans le système ;
- structurer les objets marketing explicitement portés ;
- exposer une vue marketing exploitable aux domaines consommateurs autorisés ;
- encadrer les mutations marketing internes ;
- publier les événements significatifs liés aux actions ou objets marketing ;
- protéger le système contre la dispersion des règles marketing dans plusieurs zones sans gouvernance claire.

Selon le périmètre exact du projet, le domaine peut également être responsable de :

- segments marketing ;
- audiences ;
- activations marketing internes ;
- campagnes internes si le système les porte réellement ;
- règles d’éligibilité marketing ;
- rattachement entre signaux de tracking, CRM et objets marketing ;
- statuts d’activation ou d’exécution marketing ;
- cohérence entre activation marketing et consentement applicable.

---

## Non-responsabilités

Le domaine `marketing` n’est pas responsable de :

- définir l’identité client ;
- structurer le CRM complet ;
- recueillir le consentement ;
- porter la politique juridique ;
- produire les signaux de tracking ;
- gérer la newsletter comme objet autonome ;
- gouverner les intégrations dans leur ensemble ;
- définir la logique métier coeur ;
- devenir un simple miroir d’un outil externe de marketing automation.

Le domaine `marketing` ne doit pas devenir :

- un fourre-tout pour tout ce qui touche à l’acquisition, à la communication ou à la personnalisation ;
- un doublon de `crm` ;
- un doublon de `tracking` ;
- un alias de campagnes externes sans modèle interne.

---

## Invariants

Les invariants minimaux sont les suivants :

- un objet marketing interne doit avoir un sens explicite ;
- un segment ou une audience doit être interprétable sans ambiguïté ;
- une activation marketing doit rester traçable ;
- une règle marketing ne doit pas contredire silencieusement le consentement applicable ;
- une mutation marketing ne doit pas rendre le modèle interne incohérent ;
- une synchronisation externe ne doit pas écraser silencieusement la vérité interne sans visibilité ;
- les objets marketing internes ne doivent pas mélanger plusieurs responsabilités contradictoires.

Le domaine protège la cohérence de la couche marketing interne.

---

## Dépendances

### Dépendances métier

Le domaine `marketing` interagit fortement avec :

- `customers`
- `crm`
- `newsletter`
- `tracking`
- `consent`
- `legal`
- `products`
- `orders`, si certaines activations dépendent d’états transactionnels

### Dépendances transverses

Le domaine dépend également de :

- `audit`
- `observability`
- `jobs`
- `integrations`

### Dépendances externes

Le domaine peut interagir avec :

- outils de marketing automation ;
- CDP ;
- CRM ;
- outils d’acquisition ;
- outils emailing ;
- plateformes publicitaires ;
- CMS ou systèmes éditoriaux.

### Règle de frontière

Le domaine `marketing` porte la couche marketing interne.
Il ne doit pas absorber :

- la relation client complète ;
- le consentement ;
- la conformité juridique ;
- les outils externes ;
- la vérité métier coeur.

---

## Événements significatifs

Le domaine `marketing` publie ou peut publier des événements significatifs tels que :

- segment marketing créé ;
- segment marketing modifié ;
- audience marketing calculée ;
- activation marketing créée ;
- activation marketing déclenchée ;
- activation marketing suspendue ;
- activation marketing terminée ;
- synchronisation marketing réussie ;
- synchronisation marketing échouée.

Le domaine peut consommer des signaux liés à :

- mise à jour client ;
- changement de statut CRM ;
- inscription ou désinscription newsletter ;
- changement de consentement ;
- événements de tracking autorisés ;
- événements transactionnels utilisés comme déclencheurs ;
- synchronisations externes.

Les noms exacts doivent rester compréhensibles dans le langage interne du système.

---

## Cycle de vie

Le domaine `marketing` possède un cycle de vie partiel.

Le cycle exact dépend des objets réellement portés par le système, mais il peut au minimum distinguer :

- créé ;
- actif ;
- suspendu ;
- terminé ;
- archivé.

Des états supplémentaires peuvent exister :

- brouillon ;
- planifié ;
- en cours de calcul ;
- en attente de synchronisation ;
- échoué.

Le domaine doit éviter :

- les objets marketing “fantômes” ;
- les activations sans état lisible ;
- les changements silencieux de signification.

---

## Interfaces et échanges

Le domaine `marketing` expose principalement :

- des lectures d’objets marketing internes ;
- des commandes de création ou de mutation lorsque cette responsabilité est portée en interne ;
- des lectures de segments ou audiences ;
- des événements significatifs liés aux mutations marketing ;
- des états de synchronisation ou d’exécution si le modèle les porte.

Le domaine reçoit principalement :

- des mises à jour client ou CRM ;
- des signaux de consentement ;
- des signaux de newsletter ;
- des signaux de tracking ;
- des événements transactionnels pertinents ;
- des synchronisations externes ;
- des actions opératoires encadrées.

Le domaine ne doit pas exposer comme contrat canonique le schéma natif d’un outil externe.

---

## Contraintes d’intégration

Le domaine `marketing` peut être exposé à des contraintes telles que :

- synchronisation avec plusieurs outils externes ;
- divergence entre modèle interne et plateforme externe ;
- recalcul d’audiences ;
- propagation différée ;
- duplication ;
- ordre de réception non garanti ;
- dépendance à l’état du consentement ;
- dépendance à des signaux de tracking ou CRM partiellement disponibles.

Règles minimales :

- la hiérarchie d’autorité doit être explicite ;
- les traitements rejouables doivent être idempotents ou neutralisés ;
- un outil externe ne doit pas redéfinir silencieusement le modèle interne ;
- les divergences doivent être visibles ;
- une activation marketing soumise à consentement doit rester bornée par une règle explicite ;
- le domaine ne doit pas devenir une tuyauterie opaque entre providers.

---

## Observabilité et audit

Le domaine `marketing` doit rendre visibles au minimum :

- les créations et mises à jour significatives ;
- les calculs d’audiences ;
- les déclenchements d’activations ;
- les échecs d’exécution ou de synchronisation ;
- les divergences externes ;
- les événements significatifs publiés.

L’audit doit permettre de répondre à des questions comme :

- quel objet marketing a changé ;
- quand ;
- selon quelle origine ;
- sur quel périmètre ;
- avec quel impact visible ;
- avec quel statut de synchronisation ou d’exécution.

L’observabilité doit distinguer :

- erreur de modèle ;
- erreur technique ;
- divergence externe ;
- échec de calcul ;
- propagation échouée ;
- activation bloquée par une contrainte de consentement ou de configuration.

---

## Impact de maintenance / exploitation

Le domaine `marketing` a un impact d’exploitation moyen à élevé lorsqu’il est activé.

Raisons :

- il agrège plusieurs signaux venant de domaines voisins ;
- il dépend souvent d’outils externes ;
- ses erreurs peuvent être diffuses mais coûteuses ;
- il est exposé aux ambiguïtés de frontière avec CRM, tracking, consentement et newsletter.

En exploitation, une attention particulière doit être portée à :

- la cohérence des objets marketing ;
- la lisibilité des segments et audiences ;
- les divergences avec les outils externes ;
- la traçabilité des activations ;
- la corrélation avec consentement, CRM et tracking ;
- la détection des angles morts ou doublons fonctionnels.

Le domaine doit être considéré comme sensible dès lors qu’il est activé.

---

## Limites du domaine

Le domaine `marketing` s’arrête :

- avant l’identité client coeur ;
- avant le consentement ;
- avant la politique juridique ;
- avant la newsletter comme objet autonome ;
- avant la production de tracking ;
- avant les intégrations techniques non spécifiques ;
- avant la vérité des domaines transactionnels coeur.

Le domaine `marketing` porte la couche marketing interne.
Il ne doit pas absorber toute la relation client, toute la conformité ni toute la logique provider.

---

## Questions ouvertes

À confirmer explicitement dans le projet :

- la frontière exacte entre `marketing` et `crm` ;
- la frontière exacte entre `marketing` et `tracking` ;
- la frontière exacte entre `marketing` et `newsletter` ;
- la liste canonique des objets marketing réellement portés par le système ;
- la hiérarchie entre modèle interne et plateformes externes ;
- la stratégie de calcul de segments et audiences ;
- la gouvernance des activations marketing soumises à consentement ;
- la part d’orchestration réellement assumée en interne.

Si ces points sont déjà tranchés ailleurs, ils doivent être réinjectés ici et sortir de cette section.

---

## Documents liés

- `../../domains/core/customers.md`
- `crm.md`
- `newsletter.md`
- `tracking.md`
- `consent.md`
- `legal.md`
- `audit.md`
- `observability.md`
- `../../domains/core/integrations.md`
