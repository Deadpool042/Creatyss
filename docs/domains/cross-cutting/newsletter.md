# Newsletter

## Rôle

Le domaine `newsletter` porte la gestion des abonnements et désabonnements à la newsletter du système.

Il définit :

- ce qu’est un abonnement newsletter ;
- comment il est créé, confirmé, retiré ou réactivé ;
- comment il se distingue d’un consentement général ;
- comment il est exposé aux autres domaines et aux outils externes ;
- comment il reste opposable, traçable et exploitable.

Le domaine existe pour fournir une vérité interne sur l’abonnement newsletter, distincte :

- du consentement au sens large ;
- du CRM ;
- des campagnes marketing ;
- des outils d’emailing ;
- des préférences UI.

---

## Classification

### Catégorie documentaire

`cross-cutting`

### Criticité architecturale

`transverse optionnelle`

### Activable

`oui`

Le domaine `newsletter` est optionnel du point de vue produit, mais il devient structurant dès lors qu’il est activé et connecté à des parcours d’inscription, de désinscription ou de synchronisation externe.

---

## Source de vérité

Le domaine `newsletter` est la source de vérité pour :

- l’état d’abonnement newsletter dans le système ;
- la représentation interne d’un abonnement ;
- la relation entre un abonnement, un acteur ou un point de contact ;
- les statuts d’abonnement, désabonnement, confirmation ou réactivation si le modèle les porte ;
- les événements significatifs liés à la vie de l’abonnement.

Le domaine `newsletter` n’est pas la source de vérité pour :

- le consentement général, qui relève de `consent` ;
- l’identité complète du client, qui relève de `customers` ;
- l’outil d’emailing externe ;
- les campagnes marketing ;
- les préférences de tracking ou analytics ;
- la politique juridique générale, qui relève de `legal`.

Un abonnement newsletter n’est pas un consentement générique.
C’est un objet produit et opérationnel plus spécifique.

---

## Responsabilités

Le domaine `newsletter` est responsable de :

- définir ce qu’est un abonnement newsletter dans le système ;
- représenter son état ;
- enregistrer les inscriptions, confirmations, désinscriptions et réactivations ;
- exposer un état exploitable aux autres domaines consommateurs ;
- publier les événements significatifs liés à la vie de l’abonnement ;
- protéger le système contre les ambiguïtés entre abonnement, refus et retrait ;
- servir de point d’ancrage pour les synchronisations avec des outils externes d’emailing lorsque cette responsabilité est activée.

Selon le périmètre exact du projet, le domaine peut également être responsable de :

- double opt-in ;
- origine de souscription ;
- segmentation minimale liée à l’abonnement ;
- rattachement à un client connu ou à un contact isolé ;
- statut de confirmation ;
- statut de synchronisation.

---

## Non-responsabilités

Le domaine `newsletter` n’est pas responsable de :

- définir la politique juridique globale ;
- gouverner le consentement général ;
- exécuter les campagnes emailing ;
- définir la logique CRM complète ;
- gérer l’authentification ;
- gérer les rôles et permissions ;
- porter l’observabilité globale ;
- remplacer `marketing` ou `crm`.

Le domaine `newsletter` ne doit pas devenir :

- un simple champ booléen dispersé ;
- un alias de `consent` ;
- un miroir brut d’un fournisseur externe.

---

## Invariants

Les invariants minimaux sont les suivants :

- un abonnement newsletter doit être rattaché à un contact ou acteur identifiable selon le modèle retenu ;
- un état d’abonnement doit être interprétable sans ambiguïté ;
- une désinscription doit être visible comme telle ;
- une confirmation, si elle existe, doit être distinguée d’une simple intention ;
- un abonnement ne doit pas être simultanément confirmé et retiré ;
- une mutation d’état doit être traçable ;
- une synchronisation externe ne doit pas rendre l’état interne incohérent sans visibilité.

Le domaine protège la cohérence de l’abonnement newsletter, pas seulement une préférence approximative.

---

## Dépendances

### Dépendances métier

Le domaine `newsletter` interagit fortement avec :

- `customers`
- `consent`
- `legal`
- `crm`
- `marketing`

### Dépendances transverses

Le domaine dépend également de :

- `audit`
- `observability`
- `jobs`
- `integrations`

### Dépendances externes

Le domaine peut interagir avec :

- plateformes emailing ;
- CRM ;
- CMP ;
- outils marketing automation.

### Règle de frontière

Le domaine `newsletter` porte la vérité de l’abonnement newsletter.
Il ne doit pas absorber :

- le consentement générique ;
- la logique des campagnes ;
- la relation client complète ;
- la politique juridique générale.

---

## Événements significatifs

Le domaine `newsletter` publie ou peut publier des événements significatifs tels que :

- abonnement newsletter demandé ;
- abonnement newsletter confirmé ;
- abonnement newsletter activé ;
- abonnement newsletter retiré ;
- abonnement newsletter réactivé ;
- synchronisation newsletter échouée ;
- synchronisation newsletter réussie.

Le domaine peut consommer des signaux liés à :

- création de client ;
- retrait de consentement ;
- mise à jour CRM ;
- action utilisateur sur formulaire ou centre de préférences ;
- changement de version juridique applicable, si pertinent.

Les noms exacts doivent rester compréhensibles dans le langage interne du système.

---

## Cycle de vie

Le domaine `newsletter` possède un cycle de vie explicite.

Le cycle exact dépend du modèle retenu, mais il doit au minimum distinguer :

- demandé ;
- confirmé, si double opt-in ;
- actif ;
- retiré ;
- réactivé, si le modèle le permet ;
- archivé, si pertinent.

Le domaine doit éviter :

- les statuts flous ;
- les abonnements implicites ;
- les changements silencieux de signification.

---

## Interfaces et échanges

Le domaine `newsletter` expose principalement :

- des commandes d’inscription, confirmation, retrait et réactivation ;
- des lectures d’état d’abonnement ;
- des événements significatifs liés à l’abonnement ;
- éventuellement des lectures d’état de synchronisation si le modèle les porte.

Le domaine reçoit principalement :

- des actions utilisateur ;
- des mises à jour client ;
- des signaux de consentement ;
- des synchronisations externes ;
- des actions opératoires encadrées.

Le domaine ne doit pas exposer un contrat confondant consentement, abonnement et campagne.

---

## Contraintes d’intégration

Le domaine `newsletter` peut être exposé à des contraintes telles que :

- double opt-in ;
- désinscription externe ;
- resynchronisation ;
- duplication de contacts ;
- divergence entre système interne et outil emailing ;
- ordre de réception non garanti ;
- propagation différée ;
- nécessité de preuve minimale.

Règles minimales :

- toute mutation doit être traçable ;
- la hiérarchie d’autorité doit être explicite ;
- un fournisseur externe ne doit pas écraser silencieusement la vérité interne ;
- les traitements rejouables doivent être idempotents ou neutralisés ;
- un état ambigu doit être rendu visible.

---

## Observabilité et audit

Le domaine `newsletter` doit rendre visibles au minimum :

- les inscriptions ;
- les confirmations ;
- les désinscriptions ;
- les réactivations ;
- les erreurs de synchronisation ;
- les divergences externes ;
- les événements significatifs publiés.

L’audit doit permettre de répondre à des questions comme :

- qui s’est abonné ou désabonné ;
- quand ;
- par quel point d’entrée ;
- avec quel statut ;
- avec quelle origine de mutation ;
- avec quel impact sur les outils aval.

L’observabilité doit distinguer :

- erreur de modèle ;
- erreur technique ;
- divergence externe ;
- duplication ;
- propagation échouée.

---

## Impact de maintenance / exploitation

Le domaine `newsletter` a un impact d’exploitation moyen à élevé lorsqu’il est activé.

Raisons :

- il touche à la conformité opérationnelle ;
- il influence la relation marketing ;
- il est souvent synchronisé avec des outils externes ;
- ses erreurs peuvent être discrètes mais coûteuses.

En exploitation, une attention particulière doit être portée à :

- la cohérence des statuts ;
- les désinscriptions non propagées ;
- les divergences avec le fournisseur emailing ;
- la lisibilité des points d’entrée ;
- la corrélation avec `consent` et `legal`.

Le domaine doit être considéré comme sensible dès lors qu’il est activé.

---

## Limites du domaine

Le domaine `newsletter` s’arrête :

- avant le consentement générique ;
- avant la politique juridique générale ;
- avant la gestion de campagne ;
- avant le CRM complet ;
- avant les intégrations techniques non spécifiques ;
- avant la relation client dans son ensemble.

Le domaine `newsletter` porte l’abonnement à la newsletter.
Il ne doit pas absorber toute la logique marketing ni toute la conformité.

---

## Questions ouvertes

À confirmer explicitement dans le projet :

- la frontière exacte entre `newsletter` et `consent` ;
- la frontière exacte entre `newsletter` et `crm` ;
- l’existence d’un double opt-in obligatoire ;
- la hiérarchie entre système interne et fournisseur emailing ;
- la gestion des contacts anonymes puis rattachés ;
- la politique de réactivation ;
- la stratégie de preuve minimale.

Si ces points sont déjà tranchés ailleurs, ils doivent être réinjectés ici et sortir de cette section.

---

## Documents liés

- `consent.md`
- `legal.md`
- `crm.md`
- `marketing.md`
- `audit.md`
- `observability.md`
- `../core/commerce/customers.md`
- `../optional/platform/integrations.md`
