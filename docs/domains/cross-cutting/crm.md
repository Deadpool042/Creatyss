# CRM

## Rôle

Le domaine `crm` porte la relation client structurée lorsqu’elle dépasse la simple identité métier du client.

Il définit :

- comment le système représente la relation client exploitable ;
- quelles informations relationnelles, commerciales ou opérationnelles sont portées par ce bloc ;
- comment il se distingue du client métier (`customers`) ;
- comment il s’articule avec les outils externes de CRM ;
- comment il expose une vision relationnelle cohérente aux autres domaines consommateurs.

Le domaine existe pour fournir une représentation structurée de la relation client, distincte :

- de l’identité client portée par `customers` ;
- du consentement ;
- des campagnes marketing ;
- des outils CRM externes ;
- des préférences purement UI ;
- des signaux analytics ou tracking.

---

## Classification

### Catégorie documentaire

`cross-cutting`

### Criticité architecturale

`transverse optionnelle`

### Activable

`oui`

Le domaine `crm` est optionnel du point de vue produit, mais il devient structurant dès lors que le système :

- suit l’historique relationnel ;
- enrichit la connaissance client ;
- synchronise ou consomme un CRM externe ;
- ou structure des actions de relation client au-delà du transactionnel de base.

---

## Source de vérité

Le domaine `crm` est la source de vérité pour :

- la représentation relationnelle du client portée dans le système ;
- les attributs CRM explicitement reconnus comme internes ;
- l’état de certains segments, scores, statuts relationnels ou contextes CRM si cette responsabilité est portée ici ;
- la structuration des interactions CRM internes ;
- la relation entre le système et une vue CRM exploitable lorsqu’elle est gouvernée en interne.

Le domaine `crm` n’est pas la source de vérité pour :

- l’identité métier du client, qui relève de `customers` ;
- le consentement, qui relève de `consent` ;
- la politique juridique, qui relève de `legal` ;
- les campagnes marketing ;
- les signaux de tracking ;
- l’outil CRM externe en tant que tel, sauf si le projet l’assume explicitement comme source partielle d’autorité ;
- les commandes, paiements et autres vérités coeur.

Le domaine `crm` porte la relation client structurée.
Il ne doit pas absorber toute la vérité client ni devenir un miroir brut d’un fournisseur externe.

---

## Responsabilités

Le domaine `crm` est responsable de :

- définir ce qui relève du CRM dans le système ;
- structurer les attributs relationnels et contextes CRM explicitement reconnus ;
- exposer une vue CRM exploitable aux domaines consommateurs ;
- encadrer les mutations CRM internes ;
- publier les événements significatifs liés à la relation CRM ;
- protéger le système contre la dispersion des données relationnelles dans plusieurs domaines sans gouvernance ;
- servir de point de synchronisation avec des outils externes lorsque cette responsabilité est activée.

Selon le périmètre exact du projet, le domaine peut également être responsable de :

- statuts relationnels ;
- segments CRM ;
- scores relationnels ;
- origine de contact ;
- historique relationnel structuré ;
- enrichissements commerciaux non transactionnels ;
- rattachement à des listes, cohortes ou workflows CRM.

---

## Non-responsabilités

Le domaine `crm` n’est pas responsable de :

- définir l’identité métier du client ;
- authentifier un utilisateur ;
- recueillir le consentement ;
- définir la politique juridique ;
- exécuter les campagnes marketing ;
- gérer la newsletter comme objet autonome ;
- produire les signaux de tracking ;
- gouverner les intégrations dans leur ensemble ;
- définir la vérité des commandes, paiements ou produits.

Le domaine `crm` ne doit pas devenir :

- un doublon de `customers` ;
- un simple cache local d’un outil externe ;
- un sac de champs relationnels hétérogènes sans modèle.

---

## Invariants

Les invariants minimaux sont les suivants :

- une donnée CRM interne doit avoir un sens explicite ;
- une mutation CRM doit être traçable ;
- une donnée relationnelle ne doit pas contredire silencieusement la vérité de `customers` ;
- un segment ou statut CRM doit être interprétable sans ambiguïté ;
- une synchronisation externe ne doit pas rendre la vue CRM interne incohérente sans visibilité ;
- un rattachement CRM à un client doit rester cohérent ;
- une donnée CRM obsolète ne doit pas être traitée comme vérité actuelle sans règle explicite.

Le domaine protège la cohérence de la relation client structurée.

---

## Dépendances

### Dépendances métier

Le domaine `crm` interagit fortement avec :

- `customers`
- `orders`
- `payments`
- `newsletter`
- `marketing`
- `consent`
- `tracking`

### Dépendances transverses

Le domaine dépend également de :

- `audit`
- `observability`
- `jobs`
- `integrations`
- `legal`, selon la nature des données portées

### Dépendances externes

Le domaine peut interagir avec :

- CRM externes ;
- CDP ;
- outils de support ;
- outils de marketing automation ;
- systèmes de vente ou relation commerciale.

### Règle de frontière

Le domaine `crm` porte la relation client structurée.
Il ne doit pas absorber :

- l’identité client coeur ;
- le consentement ;
- le marketing ;
- ni la logique des outils externes.

---

## Événements significatifs

Le domaine `crm` publie ou peut publier des événements significatifs tels que :

- profil CRM créé ;
- profil CRM mis à jour ;
- segment CRM modifié ;
- score CRM recalculé ;
- statut relationnel modifié ;
- synchronisation CRM réussie ;
- synchronisation CRM échouée ;
- divergence CRM détectée.

Le domaine peut consommer des signaux liés à :

- création ou mise à jour de client ;
- commande créée ;
- commande complétée ;
- paiement capturé ;
- consentement modifié ;
- abonnement newsletter modifié ;
- tracking ou signaux relationnels autorisés ;
- synchronisations externes.

Les noms exacts doivent rester compréhensibles dans le langage interne du système.

---

## Cycle de vie

Le domaine `crm` possède un cycle de vie partiel.

Le cycle exact dépend du modèle retenu, mais il peut au minimum distinguer :

- créé ;
- actif ;
- enrichi ;
- désynchronisé, si pertinent ;
- archivé.

Des états supplémentaires peuvent exister :

- en attente de synchronisation ;
- fusionné ;
- obsolète ;
- à réconcilier.

Le domaine doit éviter :

- les statuts flous ;
- les profils CRM “fantômes” ;
- les changements silencieux de signification.

---

## Interfaces et échanges

Le domaine `crm` expose principalement :

- des lectures de profil CRM ;
- des lectures de segments ou statuts CRM ;
- des commandes de mutation CRM lorsque cette responsabilité est interne ;
- des événements significatifs liés aux mutations CRM ;
- des états de synchronisation si le modèle les porte.

Le domaine reçoit principalement :

- des mutations client ;
- des signaux transactionnels ;
- des signaux de consentement ;
- des données d’outils externes ;
- des actions opératoires encadrées.

Le domaine ne doit pas exposer un contrat purement calqué sur un outil CRM externe.

---

## Contraintes d’intégration

Le domaine `crm` peut être exposé à des contraintes telles que :

- synchronisation bidirectionnelle ou unidirectionnelle ;
- duplication de profils ;
- fusion de contacts ;
- divergence entre système interne et CRM externe ;
- ordre de réception non garanti ;
- propagation différée ;
- recalcul de segments ;
- enrichissements partiels ;
- nécessité de réconciliation.

Règles minimales :

- la hiérarchie d’autorité doit être explicite ;
- une synchronisation externe ne doit pas écraser silencieusement la vérité interne ;
- les mutations rejouables doivent être idempotentes ou neutralisées ;
- les divergences doivent être visibles ;
- une fusion doit être traçable ;
- la frontière entre CRM interne et CRM externe doit rester compréhensible.

---

## Observabilité et audit

Le domaine `crm` doit rendre visibles au minimum :

- les créations et mises à jour significatives ;
- les changements de segment ou statut ;
- les échecs de synchronisation ;
- les divergences externes ;
- les fusions ;
- les événements significatifs publiés.

L’audit doit permettre de répondre à des questions comme :

- quel profil CRM a changé ;
- quand ;
- selon quelle origine ;
- à la suite de quel signal ;
- avec quel impact relationnel visible ;
- avec quel statut de synchronisation.

L’observabilité doit distinguer :

- erreur de modèle ;
- erreur technique ;
- divergence externe ;
- duplication ;
- fusion ;
- désynchronisation.

---

## Impact de maintenance / exploitation

Le domaine `crm` a un impact d’exploitation moyen à élevé lorsqu’il est activé.

Raisons :

- il structure une partie de la relation client ;
- il peut dépendre d’outils externes ;
- ses erreurs sont souvent silencieuses mais coûteuses ;
- il peut contaminer marketing, support et exploitation relationnelle.

En exploitation, une attention particulière doit être portée à :

- la cohérence entre `customers` et `crm` ;
- les divergences avec les outils externes ;
- la qualité des segments ou statuts ;
- les profils dupliqués ;
- les fusions ;
- la traçabilité des enrichissements.

Le domaine doit être considéré comme sensible dès lors qu’il est activé.

---

## Limites du domaine

Le domaine `crm` s’arrête :

- avant l’identité client coeur ;
- avant le consentement ;
- avant la politique juridique ;
- avant les campagnes marketing ;
- avant la newsletter comme objet autonome ;
- avant les intégrations techniques non spécifiques ;
- avant la vérité des domaines transactionnels coeur.

Le domaine `crm` porte la relation client structurée.
Il ne doit pas absorber tout ce qui concerne un client dans le système.

---

## Questions ouvertes

À confirmer explicitement dans le projet :

- la frontière exacte entre `crm` et `customers` ;
- la frontière exacte entre `crm` et `marketing` ;
- la frontière exacte entre `crm` et `newsletter` ;
- la hiérarchie entre système interne et CRM externe ;
- la stratégie de fusion et déduplication ;
- la liste canonique des attributs CRM réellement portés en interne ;
- la stratégie de synchronisation unidirectionnelle ou bidirectionnelle ;
- la gouvernance des segments et scores.

Si ces points sont déjà tranchés ailleurs, ils doivent être réinjectés ici et sortir de cette section.

---

## Documents liés

- `../../domains/core/customers.md`
- `consent.md`
- `legal.md`
- `newsletter.md`
- `tracking.md`
- `marketing.md`
- `audit.md`
- `observability.md`
- `../../domains/core/integrations.md`
