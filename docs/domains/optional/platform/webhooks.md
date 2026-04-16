# Webhooks

## Rôle

Le domaine `webhooks` porte la réception, la validation, la normalisation et le traitement encadré des webhooks entrants.

Il définit :

- comment un signal externe reçu par webhook est reconnu ;
- comment il est validé, authentifié et interprété ;
- comment il est traduit vers le langage interne du système ;
- comment le système gère les duplications, retards, désordre et rejets ;
- comment les traitements issus d’un webhook restent cohérents avec la doctrine d’intégration.

Le domaine existe pour isoler un mécanisme d’entrée particulièrement fragile et exposé, distinct :

- des intégrations au sens large ;
- des domaines métier qui consomment les faits normalisés ;
- des clients API ;
- des traitements asynchrones génériques.

---

## Classification

### Catégorie documentaire

`core`

### Criticité architecturale

`coeur structurel`

### Activable

`non`

Le domaine `webhooks` est non optionnel dès lors que le système reçoit des signaux externes structurants via ce mécanisme.

---

## Source de vérité

Le domaine `webhooks` est la source de vérité pour :

- la politique interne de traitement des webhooks ;
- la réception et la validation des signaux entrants de type webhook ;
- la normalisation de ces signaux vers des représentations internes exploitables ;
- la gestion des duplications, retries, rejets et états de traitement associés ;
- la traçabilité spécifique aux entrées webhook.

Le domaine `webhooks` n’est pas la source de vérité pour :

- la vérité métier d’un paiement, d’une commande, d’une expédition ou d’un autre domaine coeur ;
- la politique générale d’intégration au sens large, qui relève de `integrations` ;
- les fournisseurs externes eux-mêmes ;
- les sessions, utilisateurs ou autorisations ;
- les clients API sortants.

Le webhook est un mécanisme d’entrée.
Il n’est pas, à lui seul, un domaine métier.

---

## Responsabilités

Le domaine `webhooks` est responsable de :

- recevoir les webhooks ;
- valider leur authenticité et leur structure ;
- normaliser leur contenu ;
- rejeter les entrées invalides ;
- protéger le système contre les duplications et le désordre ;
- publier ou transmettre des faits exploitables au reste du système ;
- tracer les états de traitement des webhooks ;
- encadrer la robustesse et l’idempotence spécifiques à ce mécanisme.

Selon le périmètre exact du projet, le domaine peut également être responsable de :

- signature verification ;
- déduplication ;
- replay protection ;
- file d’attente de traitement ;
- état reçu / validé / rejeté / traité / échoué ;
- reprise opératoire sur webhook.

---

## Non-responsabilités

Le domaine `webhooks` n’est pas responsable de :

- définir la logique métier d’un paiement, d’une commande ou d’une expédition ;
- structurer toute la politique d’intégration du système ;
- exécuter tous les appels sortants vers les fournisseurs ;
- gouverner les rôles, permissions ou utilisateurs ;
- porter la vérité métier finale des objets impactés ;
- remplacer les domaines consommateurs par des statuts techniques de webhook.

Le domaine `webhooks` ne doit pas devenir :

- un proxy direct fournisseur → métier ;
- ni un fourre-tout pour “tout ce qui arrive de l’extérieur”.

---

## Invariants

Les invariants minimaux du domaine sont les suivants :

- tout webhook reçu doit être traçable ;
- un webhook invalide doit être rejeté explicitement ;
- un webhook dupliqué ne doit pas provoquer un traitement incohérent ;
- un webhook ne doit pas être interprété comme vérité métier brute sans normalisation ;
- les transitions d’état de traitement d’un webhook doivent être cohérentes ;
- un signal externe ne doit pas contourner silencieusement les frontières internes ;
- un traitement webhook rejouable doit être idempotent ou neutralisé.

Le domaine protège le système contre la fragilité intrinsèque des webhooks.

---

## Dépendances

### Dépendances métier

Le domaine `webhooks` interagit avec les domaines consommateurs concernés, notamment :

- `payments`
- `orders`
- `shipping`
- `fulfillment`
- `inventory`
- `customers`
- `auth`, selon les fournisseurs

### Dépendances transverses

Le domaine dépend également de :

- audit ;
- observabilité ;
- jobs ;
- intégrations ;
- sécurité ;
- idempotence / retry.

### Dépendances externes

Le domaine peut recevoir des signaux issus de :

- PSP ;
- transporteurs ;
- ERP ;
- OMS ;
- WMS ;
- CRM ;
- providers d’identité ;
- autres plateformes tierces.

### Règle de frontière

Le domaine `webhooks` reçoit, valide et normalise.
Il ne doit pas absorber la vérité métier des domaines consommateurs.

---

## Événements significatifs

Le domaine `webhooks` publie ou peut publier des événements significatifs tels que :

- webhook reçu ;
- webhook validé ;
- webhook rejeté ;
- webhook normalisé ;
- webhook dupliqué détecté ;
- webhook traité ;
- webhook en échec ;
- webhook rejoué ;
- divergence webhook détectée.

Le domaine peut consommer des signaux liés à :

- configuration d’intégration ;
- reprise opératoire ;
- changement de contrat externe ;
- jobs de réconciliation.

Les noms exacts doivent rester compréhensibles dans le langage interne du système.

---

## Cycle de vie

Le domaine `webhooks` possède un cycle de vie technique/structurel explicite.

Le cycle exact dépend du projet, mais il doit au minimum distinguer :

- reçu ;
- validé ;
- rejeté ;
- normalisé ;
- traité ;
- échoué ;
- rejoué, si applicable ;
- archivé, si applicable.

Le domaine doit éviter :

- les états implicites ;
- les transitions silencieuses ;
- les webhooks “perdus” sans statut observable.

---

## Interfaces et échanges

Le domaine `webhooks` expose principalement :

- des points d’entrée de réception ;
- des représentations internes normalisées ;
- des événements significatifs de traitement ;
- des lectures ou traces d’état si le modèle le porte.

Le domaine reçoit principalement :

- des payloads externes ;
- des signatures ou preuves d’origine ;
- des retries externes ;
- des demandes opératoires de reprise.

Le domaine ne doit pas exposer directement les payloads fournisseurs comme contrat interne stable.

---

## Contraintes d’intégration

Le domaine `webhooks` est exposé à des contraintes fortes et spécifiques :

- duplication ;
- ordre de réception non garanti ;
- retard ;
- payload partiel ou malformé ;
- falsification potentielle ;
- retries externes ;
- divergence entre webhook et état fournisseur réel ;
- besoin de réconciliation ;
- nécessité d’idempotence.

Règles minimales :

- chaque webhook doit être validé ;
- la signature ou la preuve d’origine doit être vérifiée si applicable ;
- la normalisation doit être explicite ;
- les traitements rejouables doivent être idempotents ou neutralisés ;
- les erreurs doivent être visibles ;
- un webhook ne doit jamais être traité comme une vérité métier immédiate sans garde-fous ;
- les stratégies de reprise et de réconciliation doivent être explicites.

---

## Observabilité et audit

Le domaine `webhooks` doit rendre visibles au minimum :

- les réceptions ;
- les validations ;
- les rejets ;
- les duplications ;
- les retries ;
- les échecs ;
- les traitements réussis ;
- les divergences détectées ;
- les actions opératoires de reprise.

L’audit doit permettre de répondre à des questions comme :

- quel webhook a été reçu ;
- quand ;
- depuis quelle origine ;
- avec quel statut ;
- avec quelle traduction interne ;
- avec quel impact métier visible ;
- avec quelle reprise éventuelle.

L’observabilité doit distinguer :

- rejet de validation ;
- erreur technique ;
- duplication ;
- désordre de réception ;
- échec de traitement ;
- divergence métier.

---

## Impact de maintenance / exploitation

Le domaine `webhooks` a un impact d’exploitation très élevé.

Raisons :

- il constitue une porte d’entrée critique de signaux externes ;
- il est exposé à des comportements non fiables ;
- il peut contaminer plusieurs domaines coeur ;
- ses erreurs sont souvent silencieuses si la traçabilité est faible ;
- il nécessite une discipline stricte de robustesse.

En exploitation, une attention particulière doit être portée à :

- la réception réelle vs attendue ;
- les duplications ;
- les rejets ;
- les files d’échec ;
- les reprises ;
- les divergences avec l’état fournisseur ;
- les actions manuelles de correction.

Le domaine doit être considéré comme critique pour la robustesse des échanges entrants.

---

## Limites du domaine

Le domaine `webhooks` s’arrête :

- avant la vérité métier finale des domaines consommateurs ;
- avant la politique d’intégration globale (`integrations`) ;
- avant les clients API sortants ;
- avant les mécanismes de sécurité non spécifiques aux webhooks ;
- avant les UI ou outils opératoires de haut niveau, sauf si leur documentation dépend explicitement de ce domaine.

Le domaine `webhooks` gouverne un mécanisme d’entrée.
Il ne doit pas absorber toute la relation d’intégration du système.

---

## Questions ouvertes

À confirmer explicitement dans le projet :

- la frontière exacte entre `webhooks` et `integrations` ;
- la stratégie canonique de déduplication ;
- la localisation de l’idempotence ;
- la politique de retry interne ;
- la stratégie de réconciliation avec les APIs fournisseurs ;
- la persistance ou non d’un journal de webhook ;
- la séparation exacte entre traitement synchrone et traitement différé.

Si ces points sont déjà tranchés ailleurs, ils doivent être réinjectés ici et sortir de cette section.

---

## Documents liés

- `../../../architecture/30-execution/32-integrations-et-adaptateurs-fournisseurs.md`
- `../../../architecture/30-execution/33-modele-de-defaillance-et-idempotence.md`
- `integrations.md`
- `../commerce/payments.md`
- `../../core/commerce/orders.md`
- `../commerce/shipping.md`
- `../../cross-cutting/jobs.md`
- `../../cross-cutting/observability.md`
