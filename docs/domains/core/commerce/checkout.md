# Checkout

## Rôle

Le domaine `checkout` porte la phase de validation structurée entre le panier et la commande.

Il définit :

- comment un panier exploitable devient une intention d’achat prête à être confirmée ;
- quelles vérifications, consolidations et sélections doivent être effectuées avant création de la commande ;
- quelles informations doivent être figées ou validées au moment du passage à l’engagement ;
- quelles erreurs ou blocages doivent empêcher la confirmation.

Le domaine existe pour encadrer le passage critique entre :

- un état préparatoire mutable (`cart`) ;
- et un engagement métier structuré (`orders`).

---

## Classification

### Catégorie documentaire

`core`

### Criticité architecturale

`coeur`

### Activable

`non`

Le domaine `checkout` est non optionnel dans un parcours commerce standard.
Sans lui, le système ne dispose pas d’un espace clair de validation avant la création de la commande.

---

## Source de vérité

Le domaine `checkout` est la source de vérité pour :

- l’état de validation du checkout ;
- les choix opérés pendant la phase de confirmation ;
- les informations consolidées nécessaires au passage à la commande ;
- les vérifications bloquantes de pré-confirmation ;
- les états métier du checkout ;
- la décision locale de savoir si un checkout est prêt, bloqué ou invalidé.

Le domaine `checkout` n’est pas la source de vérité pour :

- le contenu préparatoire brut du panier, qui relève de `cart` ;
- la commande confirmée, qui relève de `orders` ;
- la vérité tarifaire, qui relève de `pricing` ;
- la fiscalité, qui relève de `taxation` ;
- le paiement comme domaine autonome, si `payments` existe ;
- la disponibilité ou le stock réel ;
- les mécanismes d’intégration, webhooks ou projections externes.

Le checkout ne doit pas devenir un panier enrichi ni une commande déjà créée mais pas encore nommée.

---

## Responsabilités

Le domaine `checkout` est responsable de :

- recevoir un panier ou une intention d’achat préparée ;
- consolider les informations nécessaires à la confirmation ;
- vérifier les préconditions de passage à la commande ;
- porter les choix effectués pendant la phase de validation ;
- exposer un état clair : prêt, incomplet, bloqué, invalide, confirmé ;
- encadrer la transition vers `orders` ;
- publier les événements significatifs liés à la vie du checkout ;
- empêcher la confirmation lorsqu’une contrainte bloquante n’est pas satisfaite.

Selon le périmètre exact du projet, le domaine peut également être responsable de :

- l’adresse de livraison ou de facturation choisie ;
- le mode d’expédition sélectionné ;
- le mode de paiement choisi ;
- certains montants consolidés au moment de la validation ;
- la validation finale du contexte client ;
- l’acceptation des conditions nécessaires à la confirmation.

---

## Non-responsabilités

Le domaine `checkout` n’est pas responsable de :

- maintenir le panier de manière ouverte et durable ;
- définir ce qu’est un produit ;
- calculer seul la vérité du prix ;
- porter la politique fiscale ;
- confirmer ou exécuter le paiement comme domaine complet ;
- gérer le cycle de vie de la commande après création ;
- gérer l’exécution logistique ;
- porter les mécanismes d’intégration ;
- gouverner les webhooks ;
- gérer l’authentification ou les autorisations ;
- maintenir les projections analytics, CRM ou marketing.

Le domaine `checkout` ne doit pas devenir un deuxième `orders`, ni un simple écran procédural sans responsabilité métier propre.

---

## Invariants

Les invariants minimaux du domaine sont les suivants :

- un checkout doit avoir une identité interne stable ;
- un checkout ne doit pas être confirmable sans informations minimales requises ;
- un checkout prêt à être confirmé doit être interprétable sans ambiguïté ;
- un checkout confirmé ne doit pas redevenir un état préparatoire ordinaire sans règle explicite ;
- les choix critiques du checkout doivent rester cohérents avec les données qui les rendent valides ;
- un checkout ne doit pas porter simultanément des états métier incompatibles ;
- la transition checkout → commande ne doit pas produire plusieurs commandes concurrentes sans règle explicite ;
- un checkout ne doit pas confirmer silencieusement un contexte invalide.

Le checkout porte une responsabilité de validation.
Il ne doit donc pas tolérer l’ambiguïté structurelle.

---

## Dépendances

### Dépendances métier

Le domaine `checkout` interagit fortement avec :

- `cart`
- `pricing`
- `taxation`
- `payments`
- `orders`
- `customers`
- `shipping`
- `availability`

### Dépendances transverses

Le domaine dépend également de :

- audit ;
- observabilité ;
- jobs, si certaines validations sont différées ;
- notifications, selon le périmètre ;
- intégrations, si certaines vérifications s’appuient sur des systèmes externes.

### Règle de frontière

Le domaine `checkout` agrège, consolide et valide.
Il ne doit pas absorber la responsabilité complète des domaines qu’il consulte.

---

## Événements significatifs

Le domaine `checkout` publie ou peut publier des événements significatifs tels que :

- checkout créé ;
- checkout mis à jour ;
- checkout prêt à être confirmé ;
- checkout bloqué ;
- checkout invalidé ;
- mode de paiement sélectionné ;
- mode de livraison sélectionné ;
- checkout confirmé ;
- checkout expiré ;
- checkout abandonné, si le modèle le porte.

Le domaine peut consommer des signaux liés à :

- mutation du panier ;
- changement de prix ;
- changement fiscal ;
- indisponibilité ;
- échec ou validation de paiement ;
- changement de contexte client ;
- expiration d’une validité temporaire.

Les noms exacts doivent rester dans le langage métier du système.

---

## Cycle de vie

Le domaine `checkout` possède un cycle de vie métier.

Le cycle exact dépend du produit, mais il doit au minimum distinguer :

- créé ;
- en cours de validation ;
- incomplet ;
- prêt à confirmer ;
- confirmé ;
- expiré ;
- abandonné ou invalidé.

Exemples de transitions structurantes :

- création à partir d’un panier ;
- enrichissement progressif ;
- validation des informations requises ;
- blocage si une contrainte n’est pas satisfaite ;
- confirmation ;
- expiration ;
- abandon.

Le domaine doit éviter les statuts purement UI ou purement techniques lorsqu’un statut métier est attendu.

---

## Interfaces et échanges

Le domaine `checkout` expose principalement :

- des commandes de création ou d’initialisation ;
- des commandes de mise à jour des choix de validation ;
- des commandes de confirmation ;
- des lectures du checkout courant ;
- des sorties structurées vers `orders` ;
- des événements significatifs liés au cycle de vie du checkout.

Le domaine reçoit principalement :

- un panier exploitable ;
- des informations client ;
- des sorties de `pricing` et `taxation` ;
- des choix de mode de paiement et de livraison ;
- des validations de disponibilité ;
- des signaux d’échec ou de confirmation liés aux dépendances.

Le domaine ne doit pas exposer un flux de confirmation implicite ou dispersé.

---

## Contraintes d’intégration

Le domaine `checkout` peut être exposé à des contraintes fortes :

- recalcul de prix au dernier moment ;
- évolution de disponibilité ;
- expiration d’un contexte de validation ;
- répétition de demandes de confirmation ;
- signaux asynchrones liés au paiement ;
- dépendance à des systèmes externes de livraison, taxation ou paiement ;
- ordre de réception non garanti ;
- échec partiel pendant la confirmation.

Règles minimales :

- la confirmation doit être protégée contre les duplications ;
- les vérifications bloquantes doivent être explicites ;
- une demande répétée ne doit pas produire des créations concurrentes non contrôlées ;
- un échec partiel doit avoir une stratégie claire ;
- le checkout ne doit pas confirmer une situation incohérente par simple opportunisme technique.

---

## Observabilité et audit

Le domaine `checkout` doit rendre visibles au minimum :

- la création du checkout ;
- les changements d’état significatifs ;
- les blocages ;
- les invalidations ;
- les confirmations ;
- les échecs de confirmation ;
- les expirations ;
- les événements significatifs publiés.

L’audit doit permettre de répondre à des questions comme :

- quel checkout a été confirmé, bloqué ou invalidé ;
- quand ;
- pour quelle cause ;
- à partir de quel panier ;
- avec quel impact sur la commande ;
- avec quel contexte de validation.

L’observabilité doit distinguer :

- erreur métier de validation ;
- erreur technique ;
- duplication de confirmation ;
- écart prix/disponibilité ;
- dépendance externe défaillante.

---

## Impact de maintenance / exploitation

Le domaine `checkout` a un impact d’exploitation très élevé.

Raisons :

- il constitue la zone de bascule entre intention et engagement ;
- il concentre plusieurs dépendances critiques ;
- une erreur à ce niveau casse directement la conversion et peut corrompre la création de commande ;
- il est exposé aux duplications, expirations et incohérences de contexte.

En exploitation, une attention particulière doit être portée à :

- la lisibilité des blocages ;
- la traçabilité des confirmations ;
- les confirmations dupliquées ;
- les échecs partiels ;
- les checkouts expirés ou abandonnés ;
- les écarts entre panier, checkout et commande ;
- les dépendances externes impliquées dans la validation.

Le domaine doit être considéré comme critique pour la conversion et la robustesse du parcours d’achat.

---

## Limites du domaine

Le domaine `checkout` s’arrête :

- avant la gestion libre du panier ;
- avant le cycle de vie complet de la commande ;
- avant l’exécution complète du paiement ;
- avant l’exécution logistique ;
- avant les mécanismes techniques d’intégration et de webhook ;
- avant les projections externes ;
- avant la gouvernance des autorisations.

Le checkout valide et prépare l’engagement.
Il ne remplace ni le panier ni la commande.

---

## Questions ouvertes

À confirmer explicitement dans le projet :

- la frontière exacte entre `cart` et `checkout` ;
- la frontière exacte entre `checkout` et `orders` ;
- la politique de création de commande : immédiate, transactionnelle, différée, hybride ;
- la dépendance exacte à `payments` pour confirmer un checkout ;
- le niveau de figement des montants au checkout ;
- la gestion des expirations et confirmations répétées ;
- la politique de blocage en cas d’écart prix/disponibilité.

Si ces points sont déjà tranchés ailleurs, ils doivent être réinjectés ici et sortir de cette section.

---

## Documents liés

- `../../../architecture/10-fondations/10-principes-d-architecture.md`
- `../../../architecture/10-fondations/11-modele-de-classification.md`
- `../../../architecture/10-fondations/12-frontieres-et-responsabilites.md`
- `cart.md`
- `pricing.md`
- `orders.md`
- `../../optional/commerce/payments.md`
- `customers.md`
- `../../optional/commerce/shipping.md`
- `../../optional/commerce/taxation.md`
- `../catalog/availability.md`
