# Transactions and consistency

## Objectif

Ce document définit la doctrine de cohérence applicative du socle.

Il formalise :

- les frontières transactionnelles ;
- la différence entre mutation métier et effets secondaires ;
- la relation entre écriture métier et outbox ;
- les règles d’idempotence ;
- les règles de concurrence ;
- les règles de retry ;
- les anti-patterns à éviter.

L’objectif est simple :
un système réutilisable, modulaire et agressif en coût initial ne doit jamais devenir incohérent ou fragile sur ses flux critiques.

---

## Principe directeur

Toute mutation métier importante doit être pensée d’abord en termes de cohérence, ensuite seulement en termes d’implémentation.

Le bon ordre de réflexion est :

1. quel est le fait métier à valider ;
2. qu’est-ce qui doit réussir ou échouer ensemble ;
3. qu’est-ce qui peut partir après commit ;
4. quel est le risque en cas de retry ;
5. quel est le risque en cas de concurrence ;
6. quel événement durable doit être écrit ;
7. quel traitement externe ne doit surtout pas être dans la transaction.

Le socle ne repose pas sur “mettre quelques transactions Prisma”.
Il repose sur une doctrine explicite.

---

## Principes fondamentaux

### 1. Toute écriture métier critique doit être atomique

Quand plusieurs écritures participent au même invariant métier, elles doivent réussir ou échouer ensemble.

Exemples :

- conversion d’un panier en commande ;
- création de commande et figement des lignes ;
- écriture du paiement interne initial ;
- réservation ou décrément de stock ;
- transition métier sensible de statut ;
- écriture d’un événement durable représentant le fait métier.

---

### 2. Les effets externes ne font jamais partie de la transaction DB

Les appels externes ne doivent jamais être inclus dans la transaction principale.

Sont hors transaction :

- appels PSP ;
- emails transactionnels ;
- webhooks sortants ;
- synchronisations ERP / comptabilité ;
- appels transporteurs ;
- analytics externes ;
- appels IA externes.

La transaction locale valide la vérité interne.
Le reste se fait après commit.

---

### 3. Les événements durables sont écrits dans la même transaction que la mutation source

Quand un fait métier doit être diffusé durablement, l’événement correspondant est écrit dans l’outbox dans la même transaction que la mutation source.

Cela garantit qu’on n’a jamais :

- un état métier validé sans événement durable ;
- un événement durable alors que la mutation n’a pas été validée ;
- un système dépendant d’une publication volatile en mémoire.

---

### 4. Les traitements secondaires partent après commit

Une fois le commit métier réussi, les traitements aval peuvent démarrer :

- dispatch d’événements ;
- jobs ;
- notifications ;
- intégrations externes ;
- projections ;
- relances.

L’échec d’un traitement aval ne doit pas invalider rétroactivement le commit métier déjà effectué.

---

### 5. Toute commande réessayable doit être idempotente

Si une commande peut être relancée par :

- le client ;
- un retry technique ;
- un opérateur ;
- un callback dupliqué ;
- un job rejoué ;

alors elle doit disposer d’une stratégie d’idempotence explicite.

Une même intention métier ne doit pas produire plusieurs effets durables incompatibles.

---

### 6. Toute zone critique doit documenter sa stratégie de concurrence

Un système robuste ne suppose pas que deux écritures concurrentes “n’arriveront probablement pas”.

Il faut documenter :

- les conflits possibles ;
- la stratégie retenue ;
- les cas de refus ;
- les cas de reprise ;
- la clé ou la garde utilisée.

---

## Typologie des opérations

---

## 1. Lecture seule

Une lecture seule ne nécessite pas forcément de transaction métier dédiée.

Elle peut rester simple si elle ne sert pas à protéger un invariant d’écriture critique.

Exemples :

- consultation catalogue ;
- lecture d’un dashboard ;
- consultation d’une commande ;
- lecture d’un blog post.

---

## 2. Écriture locale simple

Une écriture locale simple peut être portée par une mutation ciblée, à condition que l’invariant concerné reste réellement local et clair.

Exemples :

- mise à jour d’un libellé éditorial ;
- activation / désactivation d’une ressource locale ;
- mutation simple sans coordination de plusieurs éléments critiques.

Même dans ce cas, les validations métier restent côté serveur.

---

## 3. Écriture métier critique mono-agrégat

Une mutation peut porter sur un agrégat principal, mais rester critique.

Exemples :

- changement de statut de commande ;
- changement de statut de paiement ;
- activation MFA ;
- révocation d’une session.

Dans ces cas, une transaction explicite reste souhaitable dès qu’il existe :

- un audit ;
- un domain event ;
- une garde de transition ;
- une trace corrélée ;
- plusieurs écritures dans le même invariant.

---

## 4. Écriture métier critique multi-agrégat

C’est le cas le plus important.

Exemples :

- cart -> checkout -> order ;
- order + payment initial ;
- order + inventory ;
- payment + order status ;
- auth identity + credential + session ;
- delivery + order state.

Ici, la transaction applicative explicite est obligatoire.

---

## 5. Effets secondaires

Les effets secondaires regroupent :

- notifications ;
- intégrations ;
- projections ;
- enrichissements ;
- relances ;
- analytics ;
- traitements non bloquants.

Ils ne doivent jamais décider de la validité du commit métier initial.

---

## Règles transactionnelles du socle

---

## Règle A — transaction courte

Une transaction doit rester :

- courte ;
- locale ;
- explicable ;
- ciblée.

Elle ne doit pas embarquer :

- des appels réseau ;
- des calculs non nécessaires ;
- des traitements lourds ;
- des arbitrages complexes qui pourraient être faits avant ou après.

Une transaction trop longue augmente :

- la contention ;
- les risques de timeout ;
- la complexité de diagnostic ;
- le coût des retries.

---

## Règle B — transaction explicite sur les mutations critiques

Les flux critiques ne doivent pas reposer sur une suite implicite de mutations dispersées.

Le socle privilégie une frontière transactionnelle explicite pour :

- les créations durables ;
- les conversions ;
- les transitions sensibles ;
- les changements d’état irréversibles ;
- les mutations avec outbox.

---

## Règle C — mutation source + outbox atomiques

Quand un domain event durable est requis, l’écriture de l’event et la mutation source doivent être atomiques.

Exemples :

- `order.created`
- `order.status.changed`
- `payment.captured`
- `cart.abandoned`
- `auth.password.changed`

Le système ne s’appuie pas sur une publication opportuniste ou mémoire pour représenter durablement un fait métier.

---

## Règle D — intégrations hors transaction

Le coeur ne dépend jamais d’un provider externe pour valider son commit.

Les providers peuvent :

- recevoir un événement après commit ;
- recevoir un ordre de traitement après commit ;
- renvoyer plus tard un callback ou un résultat traduit.

Ils ne doivent pas vivre dans la transaction métier locale.

---

## Règle E — transitions de statut gardées

Toute transition sensible repose sur :

- un état courant connu ;
- une cible autorisée ;
- une garde explicite ;
- une écriture atomique ;
- une traçabilité.

Exemples :

- `ACTIVE -> READY`
- `READY -> COMPLETED`
- `PENDING -> CAPTURED`
- `ACTIVE -> ABANDONED`
- `ACTIVE -> LOCKED`

---

## Règle F — suppression implicite interdite pour les objets critiques

Un objet critique ne doit pas être supprimé “pour simplifier le code” quand un statut explicite ou une conservation utile est préférable.

Exemples :

- panier converti conservé avec `CONVERTED` ;
- panier abandonné conservé avec `ABANDONED` ;
- événements durables conservés ;
- sessions révoquées traçables.

Le lifecycle doit rester lisible.

---

## Outbox : règles officielles

---

## 1. Rôle de l’outbox

L’outbox porte les faits métier validés que le système doit pouvoir diffuser de manière fiable.

Elle ne remplace pas la vérité métier primaire.
Elle la reflète durablement.

---

## 2. Quand écrire un event durable

On écrit un event durable lorsqu’un fait métier doit être :

- consommé par un autre domaine ;
- diffusé à une intégration ;
- observé plus tard ;
- rejoué ou repris ;
- transformé en jobs ou projections.

---

## 3. Ce que l’outbox ne doit pas devenir

L’outbox ne doit pas devenir :

- un simple log technique ;
- un fourre-tout de debug ;
- la source de vérité du domaine ;
- un moyen de contourner une modélisation métier absente.

---

## 4. Dispatch

Le dispatch :

- lit les événements durables ;
- tente leur diffusion ;
- marque succès ou échec ;
- incrémente les retries ;
- conserve les erreurs utiles.

Le dispatch ne réexécute pas la mutation métier source.

---

## Idempotence

---

## Objectif

L’idempotence empêche qu’une même intention métier provoque plusieurs effets durables divergents.

---

## Situations concernées

L’idempotence doit être explicitement prévue pour :

- création de commande ;
- finalisation de checkout ;
- update de paiement depuis provider ;
- capture / annulation / remboursement ;
- abandon ou reprise de panier ;
- rotation de credentials ;
- callbacks externes ;
- jobs rejouables.

---

## Stratégies admises

### 1. Clé d’intention métier

Exemple :
`checkoutId`, `cartId`, `paymentIntentId`, `providerEventId`, `recoveryRequestId`

### 2. Contrainte d’unicité

Exemple :
une seule commande pour une même intention stable.

### 3. Déduplication applicative

Lecture d’un état déjà validé avant réexécution.

### 4. Garde de transition

Refuser une transition déjà effectuée ou incompatible.

---

## Résultat attendu

Quand une même intention est rejouée, le système doit :

- retourner le même résultat stable ;
- ou constater que l’opération est déjà appliquée ;
- ou refuser proprement un conflit explicite.

Il ne doit jamais produire un deuxième effet durable incompatible.

---

## Concurrence

---

## Objectif

La concurrence doit être traitée comme un risque normal, pas comme un cas théorique.

---

## Exemples de conflits attendus

- double soumission checkout ;
- double conversion d’un panier ;
- deux réservations de stock sur la même variante ;
- callbacks provider dupliqués ;
- deux remboursements concurrents ;
- deux changements de mot de passe ;
- deux workers sur la même livraison webhook.

---

## Stratégies autorisées

### 1. Garde métier

Vérifier l’état courant avant mutation.

### 2. Contrainte unique

Empêcher la duplication durable d’une intention.

### 3. Version / optimistic locking

Selon les cas où la version d’état est pertinente.

### 4. Ordre strict de mise à jour

Quand plusieurs écritures doivent suivre un séquencement stable.

### 5. Clé d’idempotence

Quand le risque porte sur la répétition logique d’une même intention.

---

## Anti-patterns interdits

Sont interdits :

- appel PSP dans une transaction DB ;
- envoi email dans une transaction DB ;
- publication d’événement durable hors transaction source ;
- suppression simplificatrice d’un objet critique encore utile ;
- retry aveugle sans clé d’intention ;
- provider externe comme source de vérité primaire ;
- mutation multi-étapes critiques sans frontière transactionnelle claire ;
- reconstruction de vérité métier depuis des callbacks bruts.

---

## Exigences par domaine

Chaque domaine critique doit documenter explicitement :

- ce qui doit être atomique ;
- ce qui peut être différé après commit ;
- la stratégie de concurrence ;
- la stratégie d’idempotence ;
- les events écrits dans la même transaction ;
- les effets secondaires après commit.

Cette exigence est obligatoire pour les domaines comme :

- `cart`
- `checkout`
- `orders`
- `payments`
- `inventory` / `availability`
- `auth`
- `domain-events`
- `webhooks`
- `integrations`

---

## Règle de décision rapide

Avant d’implémenter une mutation critique, il faut répondre à ces questions :

1. quel est le fait métier source ;
2. quelles écritures doivent réussir ou échouer ensemble ;
3. quel est l’event durable à produire ;
4. qu’est-ce qui peut partir après commit ;
5. quelle clé d’intention ou garde protège du retry ;
6. quel conflit concurrent doit être anticipé ;
7. quel provider externe doit rester hors transaction.

Si ces questions n’ont pas de réponse claire, le flux n’est pas encore prêt.

---

## Décisions structurantes

Les points suivants sont considérés comme décidés :

- les mutations critiques passent par des frontières transactionnelles explicites ;
- les effets externes sont hors transaction ;
- les événements durables sont écrits dans la même transaction que la mutation source ;
- l’idempotence est obligatoire sur les flux réessayables ;
- la concurrence doit être pensée explicitement ;
- les suppressions implicites d’objets critiques sont évitées au profit d’un lifecycle lisible ;
- la robustesse du socle dépend d’une cohérence explicite, pas d’une simple discipline implicite.
