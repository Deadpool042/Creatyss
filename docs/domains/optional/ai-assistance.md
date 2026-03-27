# Assistance IA

## Rôle

Le domaine `ai-assistance` porte les usages d’assistance IA explicitement modélisés dans le système.

Il définit :

- ce qu’est une assistance IA du point de vue du système ;
- comment une aide, suggestion, génération, reformulation ou proposition assistée est produite dans un cadre gouverné ;
- comment ce domaine se distingue du contenu éditorial, du search, du support, du CRM, du marketing et des intégrations techniques ;
- comment le système reste maître de sa vérité interne sur les interactions, artefacts et décisions assistées.

Le domaine existe pour fournir une représentation explicite des usages d’assistance IA, distincte :

- du contenu éditorial porté par `pages`, `blog` ou `homepage-editorial` ;
- de la recherche portée par `search` ;
- du support porté par `support` ;
- du CRM porté par `crm` ;
- du marketing porté par `marketing` ;
- des DTO provider-specific portés par `integrations`.

---

## Classification

### Catégorie documentaire

`optional`

### Criticité architecturale

`optionnel sensible`

### Activable

`oui`

Le domaine `ai-assistance` est activable.
Lorsqu’il est activé, il devient structurant pour certains parcours d’assistance, de productivité, de modération, de rédaction ou d’aide opératoire.

---

## Source de vérité

Le domaine `ai-assistance` est la source de vérité pour :

- la définition interne d’un usage d’assistance IA ;
- les interactions structurées explicitement portées par le système ;
- les artefacts générés ou proposés lorsque leur persistance est gouvernée ici ;
- les statuts, validations, rejets ou décisions d’acceptation explicitement modélisés ;
- les lectures structurées consommables par les domaines autorisés.

Le domaine `ai-assistance` n’est pas la source de vérité pour :

- le contenu métier final publié dans les autres domaines ;
- le search, qui relève de `search` ;
- le support, qui relève de `support` ;
- le CRM, qui relève de `crm` ;
- le marketing, qui relève de `marketing` ;
- le provider IA externe, qui relève de `integrations`.

Une assistance IA est un mécanisme gouverné d’aide ou de génération.
Elle ne doit pas être confondue avec :

- un contenu final validé ;
- un moteur de recherche ;
- un chatbot support complet ;
- un workflow éditorial entier ;
- une intégration provider brute.

---

## Responsabilités

Le domaine `ai-assistance` est responsable de :

- définir ce qu’est une assistance IA dans le système ;
- porter les usages autorisés d’assistance IA ;
- porter les interactions ou sessions explicitement modélisées ;
- porter les propositions, suggestions ou artefacts assistés lorsque leur persistance est gouvernée ici ;
- exposer une lecture gouvernée des résultats acceptés, rejetés, expirés ou archivés ;
- publier les événements significatifs liés à la vie d’une assistance IA ;
- protéger le système contre les usages implicites, opaques ou non gouvernés de l’IA.

Selon le périmètre exact du projet, le domaine peut également être responsable de :

- suggestions de rédaction ;
- reformulation de contenu ;
- assistance catalogue ;
- assistance SEO ;
- assistance support opérateur ;
- classification ou extraction assistée ;
- brouillons générés soumis à validation ;
- journalisation métier des décisions d’acceptation ou de rejet.

---

## Non-responsabilités

Le domaine `ai-assistance` n’est pas responsable de :

- publier directement les contenus finaux des autres domaines ;
- porter tout le support client ;
- porter tout le CRM ;
- porter tout le marketing ;
- exécuter directement les appels provider-specific ;
- devenir un moteur générique pour toutes les décisions du système.

Le domaine `ai-assistance` ne doit pas devenir :

- un doublon de `support` ;
- un doublon de `search` ;
- un doublon de `marketing` ;
- un conteneur vague de “features IA” sans gouvernance métier.

---

## Invariants

Les invariants minimaux sont les suivants :

- une interaction ou opération assistée possède une identité stable si elle est persistée ;
- un artefact assisté possède un statut explicite lorsqu’il est gouverné par le système ;
- une sortie IA non validée ne doit pas être traitée comme vérité métier finale sans règle explicite ;
- une mutation significative d’acceptation, de rejet ou de publication doit être traçable ;
- les domaines consommateurs ne doivent pas dissoudre silencieusement leurs responsabilités métier dans `ai-assistance` ;
- la séparation entre proposition IA et décision métier humaine ou gouvernée reste explicite.

Le domaine protège la gouvernance des usages IA, pas la vérité métier finale des autres domaines.

---

## Dépendances

### Dépendances métier

Le domaine `ai-assistance` interagit fortement avec :

- `pages`
- `blog`
- `homepage-editorial`
- `products`
- `support`
- `search`
- `seo`

### Dépendances transverses

Le domaine dépend également de :

- `audit`
- `observability`
- `legal`
- `approval`
- `workflow`
- `feature-flags`
- `jobs`, si certaines tâches assistées sont différées

### Dépendances externes

Le domaine peut être relié à :

- modèles IA externes ;
- moteurs d’embeddings ;
- services de classification ;
- services de modération ;
- autres systèmes via `integrations`.

### Règle de frontière

Le domaine `ai-assistance` porte les usages IA gouvernés.
Il ne doit pas absorber :

- la vérité métier finale des autres domaines ;
- les providers externes ;
- le support complet ;
- le search complet ;
- ni les workflows éditoriaux complets.

---

## Événements significatifs

Le domaine `ai-assistance` publie ou peut publier des événements significatifs tels que :

- assistance IA demandée ;
- suggestion IA générée ;
- suggestion IA acceptée ;
- suggestion IA rejetée ;
- artefact IA archivé ;
- politique d’assistance IA modifiée ;
- session d’assistance clôturée.

Le domaine peut consommer des signaux liés à :

- contenu source mis à jour ;
- validation accordée ;
- workflow terminé ;
- capability boutique modifiée ;
- action administrative structurée ;
- changement de politique de conformité.

Les noms exacts doivent rester dans le langage interne du système.

---

## Cycle de vie

Le domaine `ai-assistance` possède un cycle de vie explicite ou partiel selon le modèle retenu.

Le cycle exact dépend du projet, mais il doit au minimum distinguer :

- demandé ;
- généré ;
- accepté ;
- rejeté ;
- archivé.

Des états supplémentaires peuvent exister :

- brouillon ;
- en revue ;
- expiré ;
- suspendu ;
- invalide.

Le domaine doit éviter :

- les suggestions “fantômes” ;
- les acceptations silencieuses ;
- les états purement techniques non interprétables métier.

---

## Interfaces et échanges

Le domaine `ai-assistance` expose principalement :

- des lectures d’interactions assistées ;
- des lectures de suggestions ou artefacts générés ;
- des lectures de statut d’acceptation ou de rejet ;
- des lectures exploitables par `pages`, `blog`, `products`, `support`, `seo` et certaines couches d’administration ;
- des structures prêtes à être soumises à validation par les domaines autorisés.

Le domaine reçoit principalement :

- des demandes d’assistance ou de génération ;
- des contenus source ou contextes métier ;
- des demandes de lecture d’un résultat assisté ;
- des validations, rejets ou archivages ;
- des contextes de boutique, rôle, langue, audience ou usage ;
- des signaux internes utiles à l’évolution d’une opération assistée.

Le domaine ne doit pas exposer un contrat canonique dicté par un provider externe.

---

## Contraintes d’intégration

Le domaine `ai-assistance` peut être exposé à des contraintes telles que :

- providers multiples ;
- politiques de confidentialité ;
- validation humaine obligatoire ;
- journalisation obligatoire ;
- modération de sortie ;
- dépendance à des contenus sensibles ;
- projection vers systèmes externes ;
- rétrocompatibilité des politiques d’assistance.

Règles minimales :

- la hiérarchie d’autorité doit être explicite ;
- la vérité interne des opérations assistées reste dans `ai-assistance` ;
- les DTO providers restent dans `integrations` ;
- les traitements rejouables doivent être idempotents ou neutralisés ;
- une sortie incohérente ne doit pas être promue silencieusement ;
- les conflits entre suggestion, validation et publication doivent être explicables.

---

## Données sensibles / sécurité

Le domaine `ai-assistance` peut manipuler des données sensibles, des contenus non publics ou des instructions opératoires.

Points de vigilance :

- contrôle strict des droits de lecture et d’écriture ;
- séparation claire entre suggestion, validation et publication ;
- protection des données sources envoyées aux providers ;
- limitation de l’exposition selon le rôle, le scope et le besoin métier ;
- audit des changements significatifs d’acceptation, rejet ou publication ;
- prudence sur les risques de fuite, hallucination, injection ou génération non conforme.

---

## Observabilité et audit

Le domaine `ai-assistance` doit rendre visibles au minimum :

- quelle assistance a été demandée ;
- quel statut est en vigueur ;
- pourquoi une suggestion est acceptée, rejetée, archivée ou bloquée ;
- si une opération est bloquée à cause d’une règle, d’un statut, d’un contexte ou d’une contrainte de conformité ;
- si une sortie a été modifiée, validée ou refusée avant usage.

L’audit doit permettre de répondre à des questions comme :

- quelle assistance a été déclenchée ;
- quand ;
- selon quelle origine ;
- avec quel contenu ou contexte affecté ;
- avec quel changement de statut ;
- avec quel impact sur un domaine consommateur.

L’observabilité doit distinguer :

- erreur de modèle ;
- erreur technique ;
- sortie invalide ;
- politique violée ;
- validation refusée ;
- évolution non autorisée ;
- risque de conformité ou de confidentialité.

---

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `AiAssistanceRequest` : demande d’assistance structurée ;
- `AiAssistanceSession` : session ou interaction assistée si ce modèle est retenu ;
- `AiSuggestion` : suggestion ou sortie structurée ;
- `AiSuggestionStatus` : état de la suggestion ;
- `AiAssistancePolicy` : règle de gouvernance, de validation ou d’usage ;
- `AiDecisionRecord` : trace d’acceptation, rejet ou archivage.

---

## Impact de maintenance / exploitation

Le domaine `ai-assistance` a un impact d’exploitation moyen à élevé lorsqu’il est activé.

Raisons :

- il peut affecter plusieurs domaines métier ;
- il introduit des risques de conformité, de qualité et de traçabilité ;
- ses erreurs peuvent dégrader contenu, support, SEO ou opérations ;
- il nécessite une gouvernance forte des validations et des usages ;
- il dépend souvent d’intégrations externes sensibles.

En exploitation, une attention particulière doit être portée à :

- la séparation entre suggestion et vérité métier ;
- la stabilité des politiques ;
- la traçabilité des validations ;
- la protection des données envoyées aux providers ;
- les effets de bord sur contenu, support et SEO ;
- la surveillance des usages non autorisés.

Le domaine doit être considéré comme sensible dès qu’un usage IA réel existe.

---

## Limites du domaine

Le domaine `ai-assistance` s’arrête :

- avant la vérité métier finale des autres domaines ;
- avant les providers externes ;
- avant le support complet ;
- avant le search complet ;
- avant les DTO providers externes.

Le domaine `ai-assistance` porte les usages IA gouvernés.
Il ne doit pas devenir un moteur global opaque ni un doublon des domaines métiers.

---

## Questions ouvertes

À confirmer explicitement dans le projet :

- la frontière exacte entre `ai-assistance` et `support` ;
- la frontière exacte entre `ai-assistance` et `search` ;
- la frontière exacte entre `ai-assistance` et `marketing` ;
- la part exacte des validations humaines obligatoires ;
- la gouvernance des politiques de confidentialité et de journalisation ;
- la hiérarchie entre vérité interne et provider externe éventuel.

Si ces points sont déjà tranchés ailleurs, ils doivent être réinjectés ici et sortir de cette section.

---

## Documents liés

- `../../architecture/10-fondations/11-modele-de-classification.md`
- `../../architecture/10-fondations/12-frontieres-et-responsabilites.md`
- `pages.md`
- `blog.md`
- `homepage-editorial.md`
- `../core/catalog/products.md`
- `../cross-cutting/support.md`
- `../cross-cutting/search.md`
- `../cross-cutting/seo.md`
- `../cross-cutting/legal.md`
- `../cross-cutting/audit.md`
- `../cross-cutting/observability.md`
- `../optional/platform/integrations.md`
