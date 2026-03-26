# Intégrations

## Rôle

Le domaine `integrations` porte la politique d’intégration du système avec les systèmes externes.

Il définit :

- comment le système échange avec des fournisseurs, plateformes ou satellites ;
- comment les flux entrants et sortants sont structurés ;
- comment les dépendances externes sont isolées ;
- comment les signaux externes sont traduits dans le langage interne ;
- comment la robustesse, l’idempotence et la traçabilité des échanges sont garanties.

Le domaine existe pour fournir une couche structurée d’intégration, distincte :

- des domaines coeur métier ;
- des fournisseurs externes eux-mêmes ;
- des webhooks comme mécanisme technique spécifique ;
- des clients API bas niveau.

---

## Classification

### Catégorie documentaire

`core`

### Criticité architecturale

`coeur structurel`

### Activable

`non`

Le domaine `integrations` est non optionnel dès lors que le système échange avec des dépendances externes structurantes.

---

## Source de vérité

Le domaine `integrations` est la source de vérité pour :

- la politique d’intégration interne ;
- la représentation des flux d’intégration au niveau du système ;
- les règles de traduction entre langage externe et langage interne ;
- les conventions de robustesse applicables aux échanges ;
- les statuts ou états d’intégration si le modèle en porte.

Le domaine `integrations` n’est pas la source de vérité pour :

- la vérité métier des domaines coeur ;
- les détails fonctionnels d’un PSP, ERP, transporteur ou CRM ;
- les objets métier internes comme `orders`, `payments` ou `products` ;
- les webhooks comme mécanisme spécialisé lorsqu’ils sont traités séparément ;
- les appels réseau de bas niveau d’un client API isolé.

Le domaine `integrations` gouverne la relation structurée avec l’extérieur.
Il ne devient pas le coeur métier.

---

## Responsabilités

Le domaine `integrations` est responsable de :

- définir la manière correcte d’intégrer des systèmes externes ;
- structurer les flux entrants et sortants ;
- isoler les dépendances externes derrière des adaptateurs ou contrats explicites ;
- normaliser les entrées externes dans le langage interne ;
- normaliser les sorties internes vers les formats attendus ;
- encadrer la robustesse des échanges ;
- publier les événements significatifs liés à l’intégration ;
- protéger le coeur métier contre la contamination du modèle externe ;
- fournir un cadre commun aux intégrations transverses du système.

Selon le périmètre exact du projet, le domaine peut également être responsable de :

- synchronisations ;
- projections externes ;
- politiques de retry ;
- stratégies de compensation ;
- contrats d’échange ;
- gouvernance d’anti-corruption layer ;
- supervision des échanges structurants.

---

## Non-responsabilités

Le domaine `integrations` n’est pas responsable de :

- définir la vérité métier d’un domaine coeur ;
- porter la logique métier de `orders`, `payments`, `products`, `customers`, etc. ;
- remplacer les domaines métier par des contrats externes ;
- gérer l’authentification des utilisateurs ;
- porter les rôles et permissions ;
- exécuter tous les détails techniques d’un webhook spécialisé ;
- devenir un fourre-tout de “tout ce qui parle à l’extérieur”.

Le domaine `integrations` ne doit pas devenir :

- un alias de “providers” ;
- un simple dossier d’SDK ;
- un proxy direct des systèmes externes vers le coeur.

---

## Invariants

Les invariants minimaux du domaine sont les suivants :

- tout échange structurant avec l’extérieur doit être traçable ;
- une entrée externe doit être interprétable dans le langage interne ;
- une sortie externe doit être produite par un contrat explicite ;
- un système externe ne doit pas imposer directement sa structure conceptuelle au coeur ;
- une intégration critique doit avoir une stratégie de robustesse définie ;
- un flux rejouable doit être idempotent ou neutralisé ;
- une erreur d’intégration ne doit pas corrompre silencieusement la vérité métier interne ;
- la hiérarchie d’autorité entre interne et externe doit être explicite.

Le domaine protège l’intégrité du système face aux dépendances externes.

---

## Dépendances

### Dépendances métier

Le domaine `integrations` interagit fortement avec :

- `products`
- `pricing`
- `orders`
- `payments`
- `customers`
- `shipping`
- `availability`
- `inventory`
- `fulfillment`

### Dépendances transverses

Le domaine dépend également de :

- audit ;
- observabilité ;
- jobs ;
- webhooks ;
- sécurité ;
- idempotence / retry ;
- import / export.

### Dépendances externes

Le domaine peut interagir avec :

- PSP ;
- ERP ;
- OMS ;
- WMS ;
- CRM ;
- CMS ;
- transporteurs ;
- places de marché ;
- identity providers ;
- services analytiques ou juridiques.

### Règle de frontière

Le domaine `integrations` gouverne l’échange avec l’extérieur.
Il ne doit pas absorber la responsabilité métier locale des domaines consommateurs.

---

## Événements significatifs

Le domaine `integrations` publie ou peut publier des événements significatifs tels que :

- synchronisation démarrée ;
- synchronisation réussie ;
- synchronisation échouée ;
- projection externe envoyée ;
- projection externe rejetée ;
- flux entrant normalisé ;
- flux entrant rejeté ;
- contrat d’intégration modifié ;
- divergence externe détectée ;
- réconciliation d’intégration effectuée.

Le domaine peut consommer des signaux liés à :

- événements métier internes ;
- webhooks ;
- jobs ;
- changements de configuration ;
- demandes opératoires ;
- mises à jour externes.

Les noms exacts doivent rester compréhensibles dans le langage du système.

---

## Cycle de vie

Le domaine `integrations` ne porte pas nécessairement un cycle de vie unique comparable à `orders` ou `payments`.

Cette section reste applicable via les états d’un flux ou d’une intégration, par exemple :

- configurée ;
- active ;
- suspendue ;
- dégradée ;
- en erreur ;
- en réconciliation ;
- archivée.

Si le modèle retenu ne porte pas un cycle de vie unifié, cela doit être assumé explicitement.

---

## Interfaces et échanges

Le domaine `integrations` expose principalement :

- des contrats d’entrée ;
- des contrats de sortie ;
- des points de traduction ;
- des événements significatifs d’intégration ;
- des lectures d’état ou de santé d’intégration si le modèle les porte.

Le domaine reçoit principalement :

- des événements métier internes ;
- des flux externes entrants ;
- des demandes de projection ;
- des synchronisations ;
- des actions opératoires de reprise ou de réconciliation.

Le domaine ne doit pas exposer un contrat interne dépendant directement d’un fournisseur spécifique sans couche d’isolation claire.

---

## Contraintes d’intégration

Le domaine `integrations` est, par nature, exposé à des contraintes fortes :

- indisponibilité externe ;
- timeouts ;
- erreurs partielles ;
- ordre de réception non garanti ;
- duplication ;
- retrys ;
- réponses contradictoires ;
- divergence temporaire ;
- nécessité de compensation ;
- dépendance à des contrats externes évolutifs.

Règles minimales :

- toute entrée doit être validée ;
- toute sortie doit être produite par un contrat explicite ;
- les traitements rejouables doivent être idempotents ou neutralisés ;
- les erreurs doivent être visibles ;
- les stratégies de retry et de compensation doivent être explicites ;
- un fournisseur externe ne doit pas imposer silencieusement l’état du coeur ;
- les points de traduction doivent être identifiables.

---

## Observabilité et audit

Le domaine `integrations` doit rendre visibles au minimum :

- les flux entrants structurants ;
- les flux sortants structurants ;
- les rejets ;
- les retries ;
- les divergences ;
- les réconciliations ;
- les erreurs terminales ;
- les événements significatifs publiés.

L’audit doit permettre de répondre à des questions comme :

- quel flux a été reçu ou émis ;
- quand ;
- avec quelle origine ou destination ;
- avec quel résultat ;
- avec quel impact métier visible ;
- avec quelle action opératoire éventuelle.

L’observabilité doit distinguer :

- erreur technique ;
- erreur de contrat ;
- divergence de données ;
- rejet de validation ;
- reprise opératoire ;
- indisponibilité externe.

---

## Impact de maintenance / exploitation

Le domaine `integrations` a un impact d’exploitation très élevé.

Raisons :

- il relie le système à ses dépendances structurantes ;
- il est exposé à des pannes externes ;
- il peut contaminer plusieurs domaines à la fois ;
- ses erreurs sont souvent différées, partielles ou ambiguës ;
- il nécessite une forte discipline de reprise et de traçabilité.

En exploitation, une attention particulière doit être portée à :

- la santé des flux ;
- les files en échec ;
- les divergences ;
- les répétitions ;
- les compensations ;
- les contrats externes ;
- les points de traduction ;
- les actions manuelles de reprise.

Le domaine doit être considéré comme critique pour la robustesse systémique.

---

## Limites du domaine

Le domaine `integrations` s’arrête :

- avant la vérité métier propre à chaque domaine coeur ;
- avant les clients API de bas niveau si ceux-ci sont documentés séparément ;
- avant le mécanisme webhook spécialisé si une doc séparée le porte ;
- avant la logique UI ou backoffice ;
- avant les politiques de sécurité globales non spécifiques à l’intégration.

Le domaine `integrations` gouverne l’échange structuré avec l’extérieur.
Il ne doit pas absorber tout ce qui est “technique” par facilité.

---

## Questions ouvertes

À confirmer explicitement dans le projet :

- la frontière exacte entre `integrations` et `webhooks` ;
- la frontière exacte entre `integrations` et `api-clients` ;
- la hiérarchie entre contrats internes, adaptateurs et fournisseurs ;
- la localisation canonique des stratégies de retry et compensation ;
- la gouvernance des réconciliations ;
- la stratégie de versionnement des contrats d’intégration ;
- la liste des intégrations réellement structurantes du projet.

Si ces points sont déjà tranchés ailleurs, ils doivent être réinjectés ici et sortir de cette section.

---

## Documents liés

- `../../architecture/30-execution/32-integrations-et-adaptateurs-fournisseurs.md`
- `../../architecture/30-execution/33-modele-de-defaillance-et-idempotence.md`
- `webhooks.md`
- `api-clients.md`
- `payments.md`
- `orders.md`
- `products.md`
- `customers.md`
- `../../domains/cross-cutting/jobs.md`
