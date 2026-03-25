# Email

## Rôle

Le domaine `email` porte la communication email structurée du système au niveau message et canal interne.

Il définit :

- ce qu’est un email du point de vue du système ;
- comment un email est préparé, catégorisé, différé, annulé, émis ou marqué en échec au niveau interne ;
- comment ce domaine se distingue des notifications transactionnelles, de la newsletter, des templates réutilisables et des providers emailing externes ;
- comment le système reste maître de sa vérité interne sur les messages email structurés.

Le domaine existe pour fournir une représentation explicite des emails métier, distincte :

- des notifications portées par `notifications` ;
- de la newsletter portée par `newsletter` ;
- des templates réutilisables portés par `template-system` ;
- des providers emailing externes portés par `integrations` ;
- des DTO providers externes.

---

## Classification

### Catégorie documentaire

`cross-cutting`

### Criticité architecturale

`transverse structurant`

### Activable

`non`

Le domaine `email` est structurel dès lors qu’une communication email interne structurée existe dans le système.

---

## Source de vérité

Le domaine `email` est la source de vérité pour :

- la définition interne d’un message email structuré ;
- sa catégorie métier ;
- son statut interne ;
- ses destinataires logiques ;
- son contexte métier source lorsqu’il est rattaché ici ;
- ses lectures structurées consommables par les domaines autorisés.

Le domaine `email` n’est pas la source de vérité pour :

- les notifications transactionnelles au sens global, qui relèvent de `notifications` ;
- les campagnes newsletter, qui relèvent de `newsletter` ;
- les templates réutilisables, qui relèvent de `template-system` ;
- les providers emailing externes, qui relèvent de `integrations` ;
- les DTO providers externes.

Un email est un message interne structuré.
Il ne doit pas être confondu avec :

- une notification globale ;
- une campagne newsletter ;
- un template réutilisable ;
- un log SMTP brut ;
- une réponse provider externe ;
- un simple contenu textuel sans contexte métier.

---

## Responsabilités

Le domaine `email` est responsable de :

- définir ce qu’est un email dans le système ;
- porter les messages email structurés ;
- porter leurs catégories métier ;
- porter leurs statuts internes ;
- porter leurs destinataires logiques ;
- exposer une lecture gouvernée des emails émis, en attente, différés, annulés ou échoués ;
- publier les événements significatifs liés à la vie d’un email ;
- protéger le système contre les messages email implicites, opaques ou contradictoires.

Selon le périmètre exact du projet, le domaine peut également être responsable de :

- emails commande ;
- emails documentaires ;
- emails support ;
- emails événementiels ;
- catégorisation email ;
- règles locales d’émission ;
- remappage métier de certains retours d’exécution ;
- lecture admin ou support des emails liés à un contexte métier.

---

## Non-responsabilités

Le domaine `email` n’est pas responsable de :

- porter la responsabilité globale des notifications transactionnelles ;
- porter les campagnes newsletter ;
- porter les templates réutilisables ;
- porter les providers emailing externes ;
- devenir un simple journal SMTP technique sans langage métier explicite ;
- absorber toute communication sortante du système sans distinction de finalité.

Le domaine `email` ne doit pas devenir :

- un doublon de `notifications` ;
- un doublon de `newsletter` ;
- un doublon de `template-system` ;
- un doublon de `integrations` ;
- un conteneur flou de messages sans modèle métier.

---

## Invariants

Les invariants minimaux sont les suivants :

- un email possède un identifiant stable, une catégorie explicite et un statut explicite ;
- un destinataire logique est rattaché à un email explicite ;
- `email` ne se confond pas avec `notifications` ;
- `email` ne se confond pas avec `newsletter` ;
- `email` ne se confond pas avec `template-system` ;
- `email` ne se confond pas avec `integrations` ;
- les autres domaines ne doivent pas recréer librement leur propre vérité divergente de message email interne quand le cadre commun `email` existe ;
- un statut provider externe ne doit pas devenir directement la vérité métier interne sans traduction explicite ;
- un email annulé, incomplet ou non émissible ne doit pas être traité comme prêt à partir sans règle explicite.

Le domaine protège la cohérence des messages email structurés, pas l’infrastructure emailing externe.

---

## Dépendances

### Dépendances métier

Le domaine `email` interagit fortement avec :

- `notifications`
- `newsletter`
- `customers`
- `users`
- `stores`
- `orders`
- `documents`
- `support`

### Dépendances transverses

Le domaine dépend également de :

- `template-system`, si certains gabarits réutilisables sont utilisés
- `audit`
- `observability`
- `dashboarding`
- `jobs`, si certaines émissions ou reprises sont différées

### Dépendances externes

Le domaine peut être relié indirectement à :

- providers emailing ;
- infrastructures SMTP ;
- systèmes de délivrabilité ;
- autres systèmes via `integrations`.

### Règle de frontière

Le domaine `email` porte les messages email structurés.
Il ne doit pas absorber :

- la responsabilité globale des notifications ;
- la newsletter ;
- les templates réutilisables ;
- les providers externes ;
- ni les DTO providers externes.

---

## Événements significatifs

Le domaine `email` publie ou peut publier des événements significatifs tels que :

- email créé ;
- email préparé ;
- email émis ;
- email échoué ;
- email annulé ;
- statut email modifié ;
- destinataire email modifié.

Le domaine peut consommer des signaux liés à :

- notification créée ;
- campagne newsletter créée ;
- commande créée ;
- document généré ;
- message support créé ;
- capability boutique modifiée ;
- action administrative structurée de préparation, annulation ou reprise.

Les noms exacts doivent rester dans le langage interne du système.

---

## Cycle de vie

Le domaine `email` possède un cycle de vie explicite.

Le cycle exact dépend du projet, mais il doit au minimum distinguer :

- créé ;
- préparé ;
- émis ;
- échoué ;
- annulé.

Des états supplémentaires peuvent exister :

- différé ;
- en attente ;
- archivé ;
- réémis ;
- restreint.

Le domaine doit éviter :

- les emails “fantômes” ;
- les changements silencieux de statut ;
- les états purement techniques non interprétables métier.

---

## Interfaces et échanges

Le domaine `email` expose principalement :

- des emails structurés ;
- des destinataires logiques d’emails ;
- des états internes d’émission email ;
- des lectures exploitables par `notifications`, `newsletter`, `support`, `orders`, `documents`, `dashboarding`, `observability` et certaines couches d’administration ;
- des structures email prêtes à être rendues ou transmises aux couches d’exécution autorisées.

Le domaine reçoit principalement :

- des demandes de préparation ou d’émission d’un email issues de domaines consommateurs autorisés ;
- des contextes métier issus de `orders`, `documents`, `support`, `events`, `notifications` ou d’autres domaines autorisés ;
- des demandes de lecture d’un email ou d’un historique email interne ;
- des changements d’état d’émission ou de préparation ;
- des contextes de boutique, langue, canal, audience ou acteur destinataire ;
- des signaux internes utiles à la catégorisation ou à la mise à jour de statut d’un email.

Le domaine ne doit pas exposer un contrat canonique dicté par un provider externe.

---

## Contraintes d’intégration

Le domaine `email` peut être exposé à des contraintes telles que :

- multi-boutiques ;
- multi-langues ;
- branding local ;
- émissions différées ;
- coexistence avec notifications et newsletter ;
- providers multiples ;
- échecs d’émission externes ;
- rétrocompatibilité des catégories ou statuts email.

Règles minimales :

- la hiérarchie d’autorité doit être explicite ;
- la vérité interne des emails reste dans `email` ;
- les DTO providers restent dans `integrations` ;
- les traitements rejouables doivent être idempotents ou neutralisés ;
- un échec provider ne doit pas corrompre silencieusement la vérité interne ;
- les conflits entre statut, catégorie, destinataire et règle d’émission doivent être explicables.

---

## Données sensibles / sécurité

Le domaine `email` manipule des contenus de communication et des destinataires potentiellement sensibles.

Points de vigilance :

- contrôle strict des droits de lecture et d’écriture ;
- séparation claire entre message email interne, template, diffusion transactionnelle et provider externe ;
- protection des contenus non encore envoyés ou sensibles ;
- limitation de l’exposition selon le rôle, le scope et la finalité ;
- audit des changements significatifs d’état, de destinataire ou de consultation sensible.

---

## Observabilité et audit

Le domaine `email` doit rendre visibles au minimum :

- quel email a été préparé ou émis ;
- quel contexte métier a déclenché sa création ;
- quel statut interne est en vigueur ;
- pourquoi un email a été différé, annulé ou marqué en échec ;
- si une absence d’émission vient d’une capability inactive, d’un blocage de policy, d’un destinataire invalide ou d’une règle applicable ;
- quels changements significatifs ont affecté un email ou son destinataire logique.

L’audit doit permettre de répondre à des questions comme :

- quel email a été créé, préparé, émis, échoué ou annulé ;
- quand ;
- selon quelle origine ;
- avec quel destinataire ;
- avec quel changement de statut ;
- avec quelle intervention manuelle éventuelle.

L’observabilité doit distinguer :

- erreur de modèle ;
- erreur technique ;
- destinataire invalide ;
- transition de statut invalide ;
- email incomplet ;
- évolution non autorisée ;
- échec provider externe.

---

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `EmailMessage` : message email structuré ;
- `EmailRecipient` : destinataire logique de l’email ;
- `EmailStatus` : état interne de l’email ;
- `EmailPolicy` : règle d’émission, de catégorisation ou d’exposition ;
- `EmailCategory` : catégorie métier d’email ;
- `EmailSubjectRef` : référence vers le contexte métier source de l’email.

---

## Impact de maintenance / exploitation

Le domaine `email` a un impact d’exploitation moyen à élevé.

Raisons :

- il touche des communications potentiellement sensibles ;
- ses erreurs dégradent support, expérience client et lisibilité des parcours ;
- il se situe à la frontière entre métier et exécution externe ;
- il nécessite une forte explicabilité des statuts ;
- il interagit avec notifications, newsletter, documents et support.

En exploitation, une attention particulière doit être portée à :

- la cohérence des statuts ;
- la validité des destinataires ;
- la traçabilité des changements ;
- la cohérence avec notifications, newsletter et documents ;
- les effets de bord sur support et pilotage opératoire ;
- la traduction correcte des retours provider.

Le domaine doit être considéré comme structurant dès qu’une communication email interne gouvernée existe réellement.

---

## Limites du domaine

Le domaine `email` s’arrête :

- avant la responsabilité globale des notifications ;
- avant la newsletter ;
- avant les templates réutilisables ;
- avant les providers emailing externes ;
- avant les DTO providers externes.

Le domaine `email` porte les messages email structurés du système.
Il ne doit pas devenir un moteur de campagne, un simple journal SMTP ou un doublon des autres domaines de communication.

---

## Questions ouvertes

À confirmer explicitement dans le projet :

- la frontière exacte entre `email` et `notifications` ;
- la frontière exacte entre `email` et `newsletter` ;
- la frontière exacte entre `email` et `template-system` ;
- la part exacte des emails réellement persistés ici ;
- la gouvernance des réémissions et annulations ;
- la hiérarchie entre vérité interne et providers externes éventuels.

Si ces points sont déjà tranchés ailleurs, ils doivent être réinjectés ici et sortir de cette section.

---

## Documents liés

- `../../architecture/10-fondations/11-modele-de-classification.md`
- `../../architecture/10-fondations/12-frontieres-et-responsabilites.md`
- `notifications.md`
- `newsletter.md`
- `template-system.md`
- `../core/customers.md`
- `../core/users.md`
- `../core/stores.md`
- `../core/orders.md`
- `../core/documents.md`
- `support.md`
- `events.md`
- `audit.md`
- `observability.md`
- `dashboarding.md`
- `../core/integrations.md`
