# Consentement

## Rôle

Le domaine `consent` porte la gestion des consentements et refus explicites dans le système.

Il définit :

- quels consentements existent ;
- à quoi ils s’appliquent ;
- comment ils sont recueillis ;
- comment ils sont retirés ;
- comment leur état est représenté ;
- comment ils sont consultés et opposables dans le système.

Le domaine existe pour fournir une vérité exploitable sur l’expression de volonté d’un acteur concernant certains usages, distincte :

- des préférences UI ;
- de l’authentification ;
- des rôles et permissions ;
- des actions marketing elles-mêmes ;
- des projections CRM ou analytics.

---

## Classification

### Catégorie documentaire

`cross-cutting`

### Criticité architecturale

`transverse critique`

### Activable

`non`

Le domaine `consent` est structurel dès lors que le système :

- collecte des données personnelles ;
- exécute des actions soumises à consentement ;
- ou doit démontrer la légitimité d’un usage.

---

## Source de vérité

Le domaine `consent` est la source de vérité pour :

- l’état d’un consentement donné, refusé, retiré ou expiré selon le modèle retenu ;
- la représentation interne d’un consentement ;
- le lien entre un consentement, un acteur, un périmètre et un horodatage ;
- les règles de traçabilité applicables aux consentements ;
- l’opposabilité interne de cet état.

Le domaine `consent` n’est pas la source de vérité pour :

- l’identité métier du client, qui relève de `customers` ;
- l’authentification, qui relève de `auth` ;
- les campagnes marketing ;
- les projections CRM ;
- l’audit global du système, même s’il doit s’y articuler ;
- les obligations légales générales, qui relèvent plus largement de `legal`.

Le consentement décrit une volonté exprimée sur un périmètre donné.
Il ne doit pas être réduit à un simple booléen sans contexte.

---

## Responsabilités

Le domaine `consent` est responsable de :

- définir les types de consentement reconnus par le système ;
- représenter l’état d’un consentement ;
- enregistrer l’expression, le retrait ou la mise à jour d’un consentement ;
- associer un consentement à un acteur ou à un contexte identifiable ;
- garantir la traçabilité minimale de cet état ;
- exposer un état de consentement exploitable aux domaines consommateurs ;
- publier les événements significatifs liés au consentement ;
- protéger le système contre l’usage d’un consentement ambigu, absent ou obsolète.

Selon le périmètre exact du projet, le domaine peut également être responsable de :

- consentement marketing ;
- consentement cookies ou tracking ;
- consentement contact ;
- consentement communication transactionnelle ou non transactionnelle ;
- preuve de version du texte consenti ;
- expiration ou requalification de consentement.

---

## Non-responsabilités

Le domaine `consent` n’est pas responsable de :

- définir l’identité de l’acteur ;
- authentifier un utilisateur ;
- exécuter les campagnes marketing ;
- piloter les outils CRM ;
- porter la politique légale complète ;
- gérer les rôles et permissions ;
- porter l’observabilité globale ;
- remplacer l’audit ;
- devenir une zone générique de préférences utilisateur.

Le domaine `consent` ne doit pas devenir :

- un simple champ “opt-in” éparpillé dans plusieurs tables ;
- un dump de préférences diverses ;
- un alibi documentaire sans opposabilité réelle.

---

## Invariants

Les invariants minimaux sont les suivants :

- un consentement doit être rattaché à un périmètre explicite ;
- un consentement doit être rattaché à un acteur ou contexte identifiable ;
- un consentement doit être horodaté ;
- un consentement ne doit pas être ambigu sur ce qu’il autorise ou refuse ;
- un retrait de consentement doit être visible comme tel ;
- un consentement obsolète ne doit pas être utilisé comme s’il était encore valide sans règle explicite ;
- un consentement ne doit pas être modifié rétroactivement sans traçabilité ;
- un usage soumis à consentement ne doit pas ignorer silencieusement l’absence ou le retrait de ce consentement.

Le domaine protège l’opposabilité du consentement.

---

## Dépendances

### Dépendances métier

Le domaine `consent` interagit fortement avec :

- `customers`
- `users`, si certains acteurs internes ou hybrides sont concernés
- `marketing`
- `newsletter`
- `tracking`
- `analytics`
- `crm`

### Dépendances transverses

Le domaine dépend également de :

- `audit`
- `observability`
- `legal`
- `jobs`, si certaines mises à jour ou propagations sont différées
- `integrations`, si le consentement doit être synchronisé avec des systèmes externes

### Dépendances externes

Le domaine peut interagir avec :

- CMP ;
- CRM ;
- plateformes emailing ;
- outils analytics ;
- outils de gestion de préférences.

### Règle de frontière

Le domaine `consent` porte la vérité du consentement.
Il ne doit pas absorber :

- la logique métier des outils consommateurs ;
- la politique légale complète ;
- ni la relation client dans son ensemble.

---

## Événements significatifs

Le domaine `consent` publie ou peut publier des événements significatifs tels que :

- consentement donné ;
- consentement refusé ;
- consentement retiré ;
- consentement mis à jour ;
- consentement expiré ;
- version de consentement changée ;
- préférence soumise à consentement révoquée.

Le domaine peut consommer des signaux liés à :

- création de client ;
- mise à jour d’identité ;
- changement de texte légal ou version de politique ;
- synchronisation CRM ;
- action utilisateur sur une bannière ou un centre de préférences.

Les noms exacts doivent rester compréhensibles dans le langage interne du système.

---

## Cycle de vie

Le domaine `consent` possède un cycle de vie explicite.

Le cycle exact dépend du modèle retenu, mais il doit au minimum distinguer :

- donné ;
- refusé ;
- retiré ;
- expiré, si pertinent ;
- archivé, si pertinent.

Des états supplémentaires peuvent exister :

- en attente ;
- à renouveler ;
- invalide ;
- remplacé par une version ultérieure.

Le domaine doit éviter :

- les statuts implicites ;
- les consentements “par défaut” non justifiés ;
- les changements silencieux de sens.

---

## Interfaces et échanges

Le domaine `consent` expose principalement :

- des commandes d’enregistrement et de retrait ;
- des lectures d’état de consentement ;
- des lectures de preuve ou d’opposabilité, si le modèle les porte ;
- des événements significatifs liés au consentement.

Le domaine reçoit principalement :

- des actions utilisateur ;
- des mises à jour de politique ou version ;
- des synchronisations externes ;
- des actions opératoires encadrées.

Le domaine ne doit pas exposer un contrat flou où “consentement”, “préférence” et “abonnement” sont confondus.

---

## Contraintes d’intégration

Le domaine `consent` peut être exposé à des contraintes telles que :

- synchronisation CRM ;
- propagation à plusieurs outils externes ;
- désalignement entre systèmes ;
- versionnement des textes ;
- retrait tardif ;
- duplication de signaux ;
- ordre de réception non garanti ;
- nécessité de preuve.

Règles minimales :

- toute mutation doit être traçable ;
- la hiérarchie d’autorité doit être explicite ;
- une synchronisation externe ne doit pas écraser silencieusement la vérité interne ;
- les traitements rejouables doivent être idempotents ou neutralisés ;
- une absence de consentement exploitable doit être traitée explicitement.

---

## Observabilité et audit

Le domaine `consent` doit rendre visibles au minimum :

- les créations et mises à jour significatives ;
- les retraits ;
- les expirations ;
- les échecs de synchronisation ;
- les divergences externes ;
- les événements significatifs publiés.

L’audit doit permettre de répondre à des questions comme :

- quel consentement a été donné, refusé ou retiré ;
- quand ;
- par quel acteur ;
- sur quel périmètre ;
- selon quelle version ;
- avec quel impact sur les usages aval.

L’observabilité doit distinguer :

- erreur de modèle ;
- erreur technique ;
- divergence externe ;
- absence de preuve exploitable ;
- rejet ou échec de propagation.

---

## Impact de maintenance / exploitation

Le domaine `consent` a un impact d’exploitation élevé.

Raisons :

- il influence directement la légitimité de certains usages ;
- il peut avoir des implications légales et réputationnelles fortes ;
- il peut être synchronisé avec plusieurs outils externes ;
- ses erreurs sont parfois silencieuses mais coûteuses.

En exploitation, une attention particulière doit être portée à :

- la cohérence des états ;
- la traçabilité ;
- les divergences avec les outils externes ;
- les retraits non propagés ;
- la lisibilité de la version applicable ;
- l’opposabilité réelle du consentement.

Le domaine doit être considéré comme critique pour la conformité opérationnelle.

---

## Limites du domaine

Le domaine `consent` s’arrête :

- avant la politique légale générale ;
- avant la relation client complète ;
- avant les actions marketing elles-mêmes ;
- avant l’authentification ;
- avant les préférences purement UI ;
- avant les intégrations techniques non spécifiques.

Le domaine `consent` porte l’expression opposable d’un consentement.
Il ne doit pas absorber toute la conformité ni toute la relation utilisateur.

---

## Questions ouvertes

À confirmer explicitement dans le projet :

- la frontière exacte entre `consent` et `legal` ;
- la frontière exacte entre `consent` et `newsletter` ;
- la frontière exacte entre `consent` et `tracking` ;
- la liste canonique des consentements réellement supportés ;
- la stratégie de versionnement des textes ;
- la hiérarchie entre système interne et outils externes ;
- la politique de preuve et de rétention ;
- la gestion des consentements anonymes puis rattachés.

Si ces points sont déjà tranchés ailleurs, ils doivent être réinjectés ici et sortir de cette section.

---

## Documents liés

- `../../architecture/10-fondations/12-frontieres-et-responsabilites.md`
- `audit.md`
- `observability.md`
- `legal.md`
- `../core/commerce/customers.md`
- `crm.md`
- `newsletter.md`
- `tracking.md`
