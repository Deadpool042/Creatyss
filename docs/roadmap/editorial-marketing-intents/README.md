# DomainEvent éditorial vers MarketingIntent

## Statut

- Cadrage validé.
- Lot `modèle + policy pure` implémenté.
- Projection runtime `DomainEvent -> MarketingIntent` non implémentée.
- Aucun envoi automatique.

Ce document fixe la frontière entre les faits éditoriaux déjà enregistrés et
les futures propositions de communication marketing.

## Objectif

La phase cible doit :

- transformer certains `DomainEvent` éditoriaux en `MarketingIntent` au statut
  `PROPOSED` ;
- préparer une future revue admin explicite ;
- permettre, dans des lots ultérieurs, de matérialiser un intent approuvé en
  brouillon newsletter ou social.

Un `DomainEvent` exprime un fait métier durable déjà arrivé.
Un `MarketingIntent` exprime une proposition de communication marketing qui
doit encore être examinée.

`NewsletterCampaign` et `SocialPublication` restent des brouillons propres à
un canal. Ils ne constituent pas l'intention multicanale source.

Creatyss reste la source de vérité. Les actions éditoriales ne doivent connaître
ni newsletter, ni social, ni provider externe.

## État réel observé

- Le socle `DomainEvent` durable existe pour le blog, la homepage et les pages
  légales ou éditoriales.
- `DomainEventDelivery` existe dans le modèle de données et peut porter le suivi
  idempotent d'un consommateur futur.
- `NewsletterCampaign` existe comme objet de campagne email avec un statut
  initial `DRAFT`.
- `SocialPublication` existe comme objet de diffusion sociale avec un statut
  initial `DRAFT`.
- `MarketingIntent` existe dans le schéma Prisma avec ses statuts, types,
  canaux suggérés et références vers les `DomainEvent` source.
- La policy pure `resolveEditorialMarketingIntentPolicy` existe et couvre les
  événements éditoriaux retenus.
- Aucune projection runtime `DomainEvent -> MarketingIntent` n'existe
  actuellement.
- Aucune UI admin dédiée à la revue de `MarketingIntent` n'existe actuellement.
- Aucun provider, aucun job et aucun webhook ne sont branchés pour ce flux
  `MarketingIntent`.

## Hors périmètre

Ce cadrage n'introduit pas :

- Brevo ;
- Meta, Facebook ou Instagram ;
- n8n ;
- OpenClaw ;
- webhook ;
- job d'envoi ;
- publication automatique ;
- création automatique de `NewsletterCampaign` ;
- création automatique de `SocialPublication` ;
- dépendance externe nouvelle.

n8n et OpenClaw pourront devenir des consommateurs ou orchestrateurs futurs.
Ils ne doivent pas devenir des dépendances métier de la production des intents.

## Politique par DomainEvent

| DomainEvent | Politique recommandée |
| --- | --- |
| `content.blog_post.published` | Créer par défaut un intent `PROPOSED` avec `NEWSLETTER` et `SOCIAL` comme canaux suggérés. |
| `content.blog_post.updated_visible` | Fusion optionnelle avec l'intent encore ouvert du cycle de publication. Ne pas créer une suggestion à chaque mise à jour. |
| `content.blog_post.unpublished` | Ne créer aucun intent marketing. |
| `content.blog_post.archived` | Ne créer aucun intent marketing. |
| `content.homepage.published` | Créer au plus une suggestion légère, orientée `SOCIAL`. Ne pas suggérer `NEWSLETTER` par défaut. |
| `content.homepage.updated_visible` | Traitement optionnel et dédupliqué dans le cycle de publication courant. |
| `content.editorial_page.published` | Éligible de manière optionnelle à une revue admin, sans canal obligatoire. |
| `content.editorial_page.updated` | Éligible de manière optionnelle et dédupliquée. |
| `content.editorial_page.unpublished` | Ne créer aucun intent marketing. |
| `content.legal_page.published` | Ne créer aucun intent marketing. |
| `content.legal_page.unpublished` | Ne créer aucun intent marketing. |
| `content.legal_page.updated` | Ne créer aucun intent marketing. |

Une politique optionnelle signifie qu'aucune diffusion ne découle directement
du `DomainEvent`. Elle peut produire une suggestion révisable uniquement si la
politique future de projection le décide explicitement.

## Pages légales

Les événements relatifs aux pages légales restent utiles pour la traçabilité,
l'audit et l'explicabilité des changements.

Ils ne doivent pas être assimilés par défaut à des opportunités marketing.

Une éventuelle communication réglementaire future relèverait d'un flux dédié
aux responsabilités juridiques, au consentement ou à la communication
opérationnelle. Elle ne doit pas être modélisée comme une promotion marketing
implicite.

## Modèle cible recommandé

Le modèle conceptuel cible est `MarketingIntent`.
Il est ajouté au schéma Prisma dans le lot `modèle + policy pure`.

Le runtime associé reste partiel à ce stade :

- le stockage existe ;
- la policy pure existe ;
- la projection depuis les `DomainEvent` reste à implémenter ;
- la revue admin et la matérialisation newsletter/social restent à implémenter.

Champs recommandés :

| Champ | Rôle |
| --- | --- |
| `storeId` | Boutique propriétaire de l'intention. |
| `status` | `PROPOSED`, `APPROVED`, `REJECTED` ou `ARCHIVED`. |
| `intentType` | Nature métier de la proposition de communication. |
| `subjectType` | Type de contenu source, sans vocabulaire de provider. |
| `subjectId` | Identifiant stable du contenu source. |
| `suggestedChannels` | Canaux internes suggérés, notamment `NEWSLETTER` et `SOCIAL`. |
| `deduplicationKey` | Clé stable et unique de déduplication métier. |
| `sourceDomainEventId` | Premier événement à l'origine de l'intention. |
| `lastSourceDomainEventId` | Dernier événement fusionné dans l'intention ouverte. |
| `contextJson` | Contexte borné utile à la revue, sans corps complet ni donnée abonné. |
| `reviewedAt` | Date de la décision admin. |
| `reviewedByUserId` | Admin ayant pris la décision. |
| `createdAt` | Date de création. |
| `updatedAt` | Date de dernière évolution. |

Le contexte peut contenir des références comme le titre, le slug, le type de
contenu, les champs visibles modifiés et les dates éditoriales utiles.
Il ne doit contenir ni secret, ni destinataire, ni payload provider.

## Idempotence et déduplication

Le futur lot de projection doit respecter les règles suivantes :

- utiliser `DomainEventDelivery` avec un `consumerCode` stable et versionné ;
- garantir l'unicité de `deduplicationKey` côté `MarketingIntent` ;
- traiter plusieurs exécutions du même consommateur sans créer de doublon ;
- fusionner les mises à jour visibles compatibles dans un intent encore
  `PROPOSED` ;
- ne pas rouvrir silencieusement un intent `APPROVED` ou `REJECTED` ;
- permettre à une republication réelle d'ouvrir un nouveau cycle et donc un
  nouvel intent ;
- conserver une trace du premier et du dernier `DomainEvent` pris en compte.

La déduplication doit reposer sur le cycle éditorial et l'identité du sujet,
pas sur une fenêtre temporelle arbitraire.

## Préparation future

Après approbation explicite d'un intent :

- un lot dédié pourra créer une `NewsletterCampaign` au statut `DRAFT` ;
- un autre lot dédié pourra créer une `SocialPublication` au statut `DRAFT` ;
- aucune audience newsletter ne devra être figée au niveau de l'intent ;
- les abonnés actifs et désinscrits devront être réévalués au moment de l'envoi ;
- n8n ou OpenClaw pourront consommer des états internes stabilisés sans devenir
  la source de vérité ;
- les adaptateurs Brevo ou Meta resteront isolés dans leurs propres lots.

L'approbation d'un intent ne doit jamais équivaloir implicitement à un envoi ou
à une publication.

## Roadmap par micro-lots

### Lot 1 - Modèle et policy pure

- ajouter le modèle `MarketingIntent` ;
- définir les statuts et canaux internes ;
- implémenter une policy pure couvrant tous les événements éditoriaux ;
- tester les décisions sans projection runtime.

Statut observé : implémenté.

### Lot 2 - Projection DomainEvent vers MarketingIntent

- consommer les événements éligibles ;
- créer ou fusionner les intents `PROPOSED` ;
- utiliser `DomainEventDelivery` et un `consumerCode` stable ;
- garantir idempotence et déduplication.

### Lot 3 - Revue admin

- lister les intents proposés ;
- afficher leur origine et leurs canaux suggérés ;
- permettre approbation, rejet et archivage ;
- éviter les enregistrements invisibles sans capacité de traitement.

### Lot 4 - Matérialisation newsletter

- convertir explicitement un intent approuvé en
  `NewsletterCampaign DRAFT` ;
- ne créer aucun destinataire et ne déclencher aucun envoi.

### Lot 5 - Matérialisation sociale

- convertir explicitement un intent approuvé en
  `SocialPublication DRAFT` ;
- ne contacter aucune plateforme externe.

### Lots ultérieurs - Orchestration et providers

- cadrer séparément n8n et OpenClaw comme consommateurs ;
- ajouter les providers externes derrière des adaptateurs dédiés ;
- introduire jobs, retries ou webhooks uniquement si un besoin opératoire réel
  les justifie.

## Risques

### Spam marketing

Créer une intention pour chaque mise à jour visible produirait du bruit.
Les événements de mise à jour doivent être fusionnés ou ignorés selon l'état du
cycle éditorial.

### Confusion entre légal et marketing

Une modification juridique n'est pas une opportunité promotionnelle.
Les événements `legal_page.*` doivent rester exclus par défaut.

### Confusion entre intention et objet de canal

Un `MarketingIntent` propose une communication.
Une `NewsletterCampaign` ou une `SocialPublication` prépare un canal précis.
Ces responsabilités ne doivent pas être fusionnées.

### Enregistrements fantômes

Une projection sans future surface de revue admin créerait des propositions
inexploitables. Le lot de projection doit donc rester coordonné avec le lot de
revue admin.

### Couplage aux providers

Les noms, statuts, identifiants et payloads de providers ne doivent pas entrer
dans le modèle métier des intents. Les providers restent des dépendances
externes encapsulées.

## Critères de fin du cadrage

- la distinction entre fait, intention et brouillon de canal est explicite ;
- chaque événement éditorial possède une politique documentée ;
- les pages légales sont exclues du marketing par défaut ;
- le modèle cible et ses règles d'idempotence sont décrits sans implémentation ;
- les lots futurs restent bornés et n'impliquent aucun envoi automatique.
