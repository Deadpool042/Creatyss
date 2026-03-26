# Événements de domaine

## Rôle

Le domaine `domain-events` porte l’expression, la publication et la consommation des faits métier significatifs à l’intérieur du système.

Il définit :

- ce qu’est un événement de domaine du point de vue du système ;
- comment un fait métier est exprimé dans le langage interne ;
- comment ces faits sont publiés, propagés et consommés ;
- comment le système distingue un événement métier d’un signal technique ;
- comment les traitements asynchrones restent cohérents avec la vérité métier.

Le domaine existe pour fournir un backbone événementiel interne structuré, distinct :

- des événements métier publics portés par un domaine fonctionnel comme `events` ;
- des webhooks ;
- des intégrations externes ;
- des jobs ;
- des messages techniques sans sémantique métier.

---

## Classification

### Catégorie documentaire

`core`

### Criticité architecturale

`coeur structurel`

### Activable

`non`

Le domaine `domain-events` est non optionnel dès lors que le système s’appuie sur des faits métier publiés pour découpler des réactions internes, orchestrer des traitements différés ou propager des changements significatifs.

---

## Source de vérité

Le domaine `domain-events` est la source de vérité pour :

- le modèle d’événements de domaine internes ;
- la sémantique des faits métier publiés dans le système ;
- les conventions de publication et de consommation des événements internes ;
- la représentation des événements métier comme faits établis ;
- les règles de robustesse et de propagation propres à ces événements.

Le domaine `domain-events` n’est pas la source de vérité pour :

- la vérité métier des domaines producteurs eux-mêmes ;
- les webhooks et flux externes ;
- la politique générale d’intégration, qui relève de `integrations` ;
- les jobs comme unités de travail ;
- les événements métier publics d’un domaine fonctionnel nommé `events` ;
- les signaux purement techniques ou d’observabilité.

Un événement de domaine n’est pas une commande.
Un événement de domaine n’est pas un webhook.
Un événement de domaine n’est pas un simple log.

---

## Responsabilités

Le domaine `domain-events` est responsable de :

- définir ce qu’est un événement de domaine interne ;
- encadrer le vocabulaire des événements métier ;
- exprimer les faits métier significatifs dans le langage du système ;
- porter les conventions de publication et de consommation ;
- protéger le système contre la dérive vers des événements techniques sans sémantique claire ;
- structurer la propagation asynchrone des faits métier ;
- publier les événements significatifs issus des domaines producteurs ;
- garantir la traçabilité et la cohérence du backbone événementiel interne ;
- fournir un cadre lisible aux domaines consommateurs et aux traitements secondaires.

Selon le périmètre exact du projet, le domaine peut également être responsable de :

- l’enveloppe canonique d’un événement interne ;
- les métadonnées minimales d’un événement ;
- la persistance transactionnelle d’événements en attente de publication ;
- la politique de dispatch interne ;
- la gouvernance des consommateurs ;
- les règles de rejeu et d’idempotence au niveau événementiel.

---

## Non-responsabilités

Le domaine `domain-events` n’est pas responsable de :

- définir la vérité métier locale de `orders`, `payments`, `products`, etc. ;
- remplacer les domaines producteurs ;
- gouverner les webhooks ou autres flux externes ;
- gouverner les clients API ;
- définir la politique générale d’intégration externe ;
- remplacer les jobs comme unités de travail ;
- porter les logs, métriques ou traces d’observabilité ;
- représenter les événements publics d’un domaine fonctionnel métier.

Le domaine `domain-events` ne doit pas devenir :

- un bus fourre-tout ;
- un système de message purement technique ;
- un substitut à une mauvaise modélisation de frontière.

---

## Invariants

Les invariants minimaux du domaine sont les suivants :

- un événement de domaine doit exprimer un fait métier établi ;
- un événement de domaine doit être nommé dans le langage du système ;
- un événement de domaine ne doit pas être ambigu sur ce qui s’est produit ;
- un événement publié ne doit pas contredire la vérité métier du domaine producteur ;
- un événement consommable doit rester interprétable sans dépendre d’un détail de fournisseur externe ;
- un rejeu ou un retraitement ne doit pas produire un état incohérent sans garde-fous explicites ;
- la distinction entre événement métier et signal technique doit rester claire ;
- la publication d’un événement ne doit pas masquer une transaction métier incomplète.

Le domaine protège la sémantique du fait métier publié.

---

## Dépendances

### Dépendances métier

Le domaine `domain-events` interagit fortement avec les domaines producteurs et consommateurs, notamment :

- `products`
- `pricing`
- `cart`
- `checkout`
- `orders`
- `payments`
- `customers`
- `availability`
- `shipping`
- `stores`

### Dépendances transverses

Le domaine dépend également de :

- jobs ;
- observabilité ;
- audit ;
- intégrations ;
- webhooks, lorsque des faits externes doivent être traduits puis éventuellement republiés en faits internes ;
- mécanismes d’idempotence et de retry.

### Dépendances externes

Le domaine n’est pas directement centré sur l’externe, mais il peut être alimenté indirectement par :

- signaux normalisés provenant d’intégrations ;
- traitements de réconciliation ;
- entrées externes traduites dans le langage interne.

### Règle de frontière

Le domaine `domain-events` porte le modèle des faits internes publiés.
Il ne doit pas absorber :

- la vérité métier locale des domaines producteurs ;
- la politique d’intégration externe ;
- la mécanique des jobs ;
- ni la logique purement technique de transport.

---

## Événements significatifs

Le domaine `domain-events` porte ou peut porter des événements significatifs tels que :

- produit créé ;
- produit mis à jour ;
- prix modifié ;
- panier validé ;
- checkout confirmé ;
- commande créée ;
- commande annulée ;
- paiement autorisé ;
- paiement capturé ;
- client créé ;
- disponibilité modifiée ;
- boutique activée ;
- expédition créée ;
- fulfillment complété.

Le domaine peut consommer des signaux liés à :

- publication d’événements producteurs ;
- reprise de dispatch ;
- retry ;
- rejet de consommation ;
- réconciliation suite à incident.

Les noms exacts doivent rester dans le langage métier du système.
Ils ne doivent pas refléter une topologie technique ou un fournisseur externe.

---

## Cycle de vie

Le domaine `domain-events` ne porte pas nécessairement un cycle de vie métier unique comparable à `orders` ou `payments`.

Cette section reste applicable via les états d’un événement ou de sa publication, par exemple :

- enregistré ;
- prêt à publier ;
- publié ;
- consommé ;
- en échec ;
- rejoué ;
- archivé.

Si le modèle retenu ne porte pas un cycle de vie unifié, cela doit être assumé explicitement.

Le domaine doit éviter :

- les événements “fantômes” sans statut lisible ;
- les publications silencieusement perdues ;
- les traitements secondaires sans traçabilité.

---

## Interfaces et échanges

Le domaine `domain-events` expose principalement :

- des conventions de publication ;
- des événements internes structurés ;
- des points de consommation ou de souscription selon le modèle retenu ;
- des états de publication ou de dispatch si le modèle les porte.

Le domaine reçoit principalement :

- des faits issus des domaines producteurs ;
- des demandes de publication ;
- des rejets ou signaux de retry ;
- des actions opératoires de reprise.

Le domaine ne doit pas exposer comme contrat canonique un format trop dépendant d’une infrastructure particulière.

---

## Contraintes d’intégration

Le domaine `domain-events` peut être exposé à des contraintes telles que :

- publication différée ;
- retry ;
- duplication ;
- ordre de traitement non garanti ;
- consommateurs multiples ;
- consommation partielle ;
- divergence entre événement publié et traitement aval ;
- nécessité d’idempotence ;
- rejouabilité après incident.

Règles minimales :

- un événement doit être publié comme fait métier, pas comme intention floue ;
- les traitements rejouables doivent être idempotents ou neutralisés ;
- les erreurs de dispatch doivent être visibles ;
- un événement ne doit pas être utilisé pour compenser une mauvaise frontière de domaine ;
- la relation entre transaction métier et publication d’événement doit être explicite ;
- un rejet de consommation ne doit pas corrompre silencieusement la vérité du système.

---

## Observabilité et audit

Le domaine `domain-events` doit rendre visibles au minimum :

- les événements publiés ;
- les événements rejetés ;
- les échecs de dispatch ;
- les retries ;
- les événements rejoués ;
- les consommateurs en erreur ;
- les divergences critiques entre publication et traitement aval ;
- les actions opératoires de reprise.

L’audit doit permettre de répondre à des questions comme :

- quel fait métier a été publié ;
- quand ;
- par quel domaine producteur ;
- avec quel identifiant corrélable ;
- avec quel résultat de publication ;
- avec quels consommateurs affectés ;
- avec quelle reprise éventuelle.

L’observabilité doit distinguer :

- erreur de publication ;
- erreur de consommation ;
- duplication ;
- désordre de traitement ;
- divergence métier ;
- reprise opératoire.

---

## Impact de maintenance / exploitation

Le domaine `domain-events` a un impact d’exploitation très élevé.

Raisons :

- il relie plusieurs domaines entre eux ;
- il influence les flux asynchrones internes ;
- ses erreurs peuvent contaminer plusieurs zones du système ;
- il nécessite une discipline forte de robustesse, idempotence et traçabilité ;
- il peut rendre la dérive architecturelle invisible s’il est mal gouverné.

En exploitation, une attention particulière doit être portée à :

- la visibilité des publications ;
- les consommateurs en échec ;
- les rejeux ;
- les duplications ;
- les divergences entre fait publié et état aval ;
- la clarté des conventions de nommage et de corrélation ;
- les actions manuelles de reprise.

Le domaine doit être considéré comme critique pour la cohérence systémique interne.

---

## Limites du domaine

Le domaine `domain-events` s’arrête :

- avant la vérité métier locale de chaque domaine producteur ;
- avant les jobs comme unités de travail ;
- avant les webhooks ;
- avant les intégrations externes ;
- avant l’observabilité au sens large ;
- avant les événements métier publics portés par un autre domaine comme `events`.

Le domaine `domain-events` porte le backbone de faits métier internes.
Il ne doit pas absorber toute la mécanique asynchrone ou toute la messagerie du système.

---

## Questions ouvertes

À confirmer explicitement dans le projet :

- la frontière exacte entre `domain-events` et `jobs` ;
- la frontière exacte entre `domain-events` et `integrations` ;
- la frontière exacte entre `domain-events` et `webhooks` ;
- la politique canonique de publication transactionnelle ;
- la stratégie de rejeu ;
- la localisation de l’idempotence ;
- la structure minimale canonique d’un événement ;
- la liste des événements réellement structurants du système.

Si ces points sont déjà tranchés ailleurs, ils doivent être réinjectés ici et sortir de cette section.

---

## Documents liés

- `../../architecture/30-execution/30-evenements-de-domaine-et-flux-asynchrones.md`
- `../../architecture/30-execution/31-jobs-et-traitements-en-arriere-plan.md`
- `../../architecture/30-execution/33-modele-de-defaillance-et-idempotence.md`
- `integrations.md`
- `webhooks.md`
- `payments.md`
- `orders.md`
- `products.md`
- `../../domains/cross-cutting/jobs.md`
- `../../domains/cross-cutting/events.md`
