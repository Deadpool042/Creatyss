# Domaine `taxation`

## Objectif

Ce document décrit le domaine `taxation` dans la doctrine courante du socle.

Il précise :

- le rôle du domaine ;
- sa place dans la modularité du socle ;
- sa source de vérité ;
- ses capabilities activables ;
- ses niveaux de sophistication ;
- ses objets métier ;
- ses invariants ;
- son cycle de vie ;
- ses règles de cohérence ;
- ses frontières externes ;
- ses implications de maintenance, d’exploitation et de coût.

Le domaine `taxation` est structurant pour la réutilisabilité du socle, car il porte une complexité qui varie fortement d’un projet à l’autre.

Creatyss n’a pas besoin d’un niveau fiscal avancé dès maintenant, mais le socle doit être capable de porter plus tard des projets :

- multi-pays UE ;
- UE + hors UE ;
- avec règles documentaires plus riches ;
- avec accises ;
- avec obligations de validation ou de conformité plus fortes.

---

## Position dans la doctrine de modularité

Le domaine `taxation` est classé comme :

- `domaine coeur à capabilities toggleables`

Le domaine existe comme responsabilité métier du socle dès qu’un commerce opère réellement des ventes soumises à des règles fiscales ou parafiscales.
En revanche, son niveau de sophistication varie fortement selon les projets.

### Ce qui n’est jamais désactivé

Le domaine conserve toujours :

- une responsabilité explicite sur les règles fiscales du commerce ;
- une source de vérité interne sur la logique de taxation retenue ;
- un langage interne stable pour représenter les décisions fiscales applicables ;
- une séparation claire entre coeur métier et providers éventuels de calcul ou de conformité.

### Ce qui est activable / désactivable par capability

Le domaine `taxation` est lié aux capabilities suivantes :

- `taxation`
- `multiCountryTaxation`
- `euSelling`
- `nonEuSelling`
- `vatValidation`
- `electronicInvoicing`
- `exciseTax`
- `customsData`
- `b2bCommerce`

### Ce qui relève d’un niveau

Le domaine porte explicitement plusieurs niveaux de sophistication fiscale.

### Ce qui relève d’un provider ou d’une intégration externe

Relèvent de `integrations` et non du coeur de `taxation` :

- les API ou services externes de calcul fiscal ;
- les connecteurs de validation TVA ;
- les connecteurs de facturation électronique ;
- les systèmes externes de conformité documentaire ;
- les outils de déclaration ou d’export réglementaire.

Le domaine `taxation` garde la logique métier interne.
Les providers éventuels ne font que l’assister ou la prolonger.

---

## Rôle

Le domaine `taxation` porte les règles fiscales applicables aux ventes du socle.

Il constitue la source de vérité interne pour :

- l’applicabilité d’une règle fiscale ;
- la qualification fiscale d’un contexte de vente ;
- la décision de taxation retenue ;
- le niveau de détail nécessaire pour produire un breakdown fiscal cohérent.

Le domaine est distinct :

- de `pricing`, qui porte la structure de prix ;
- de `checkout`, qui consolide un contexte de vente prêt à être commandé ;
- de `orders`, qui fige les montants et snapshots retenus ;
- de `payments`, qui porte le paiement interne ;
- de `integrations`, qui traite les providers externes de conformité ou de facturation.

---

## Responsabilités

Le domaine `taxation` prend en charge :

- la modélisation des règles fiscales applicables au commerce ;
- la qualification d’un contexte de vente du point de vue fiscal ;
- la détermination des composantes fiscales applicables ;
- la production d’un résultat de taxation interne exploitable par `checkout` et `orders` ;
- la séparation entre logique fiscale simple et logique fiscale avancée ;
- la distinction entre taxation standard, multi-zone et taxation avec obligations supplémentaires ;
- la possibilité d’activer des capacités plus avancées comme la validation TVA, la facturation électronique ou les accises.

---

## Ce que le domaine ne doit pas faire

Le domaine `taxation` ne doit pas :

- porter la logique de prix catalogue brute, qui relève de `pricing` ;
- porter à lui seul le checkout, la commande ou le paiement ;
- laisser un provider externe devenir la vérité interne ;
- imposer une sophistication fiscale à tous les projets ;
- mélanger règles fiscales, facturation électronique, transport et comptabilité dans un seul bloc indistinct ;
- devenir un simple wrapper d’API externe.

---

## Source de vérité

Le domaine `taxation` est la source de vérité pour :

- les règles fiscales activées dans le socle ;
- le niveau de sophistication fiscale retenu ;
- les décisions fiscales internes produites pour un contexte de vente ;
- les breakdowns fiscaux internes transmis au checkout et à la commande.

Le domaine n’est pas la source de vérité pour :

- le prix catalogue brut ;
- l’état du panier ;
- le statut du checkout ;
- la commande durable ;
- le paiement ;
- les documents externes ;
- les déclarations ou exports réglementaires finaux.

---

## Objets métier principaux

Les principaux objets métier portés par le domaine sont :

- `TaxRule`
- `TaxProfile`
- `TaxContext`
- `TaxDecision`
- `TaxBreakdown`
- `TaxZone`
- `TaxClass`
- `VatValidationResult`
- `ExcisePolicy`
- `ExciseDecision`

---

## Capabilities activables liées

Le domaine `taxation` est lié aux capabilities suivantes :

- `taxation`
- `multiCountryTaxation`
- `euSelling`
- `nonEuSelling`
- `vatValidation`
- `electronicInvoicing`
- `exciseTax`
- `customsData`
- `b2bCommerce`

### Effet si `taxation` est activée

Le domaine produit un résultat fiscal interne exploitable par `checkout` et `orders`.

### Effet si `multiCountryTaxation` est activée

Le domaine prend en compte plusieurs zones de vente et une logique plus riche de qualification fiscale.

### Effet si `euSelling` est activée

Le domaine prend en charge les règles nécessaires à un commerce UE.

### Effet si `nonEuSelling` est activée

Le domaine élargit son modèle à des contextes hors UE, avec impacts potentiels sur douanes, documents et règles de calcul.

### Effet si `vatValidation` est activée

Le domaine peut intégrer une validation structurée de numéro TVA pour des parcours B2B ou assimilés.

### Effet si `electronicInvoicing` est activée

Le domaine fournit les éléments fiscaux et structurels nécessaires à une facturation électronique plus riche, sans devenir lui-même le domaine documentaire.

### Effet si `exciseTax` est activée

Le domaine prend en charge une couche supplémentaire de règles fiscales ou parafiscales spécialisées.

### Effet si `customsData` est activée

Le domaine peut enrichir certains contextes avec des données utiles à des flux plus internationaux.

### Effet si `b2bCommerce` est activée

Le domaine distingue plus finement les cas B2B et B2C lorsqu’ils impactent la fiscalité applicable.

---

## Niveaux de sophistication du domaine

Le domaine `taxation` porte explicitement les niveaux suivants.

### Niveau 1 — essentiel

Le domaine couvre une logique fiscale simple, centrée sur une zone principale ou un ensemble réduit de cas.

Ce niveau convient à :

- commerce local ;
- commerce simple ;
- projet avec peu de contraintes fiscales spécifiques.

### Niveau 2 — standard

Le domaine couvre plusieurs cas usuels, notamment sur plusieurs pays d’une même zone économique comme l’UE.

Ce niveau convient à :

- commerce UE standard ;
- règles plus variées ;
- besoin d’un breakdown fiscal plus structuré.

### Niveau 3 — avancé

Le domaine couvre des contextes multi-zones plus riches, avec davantage de cas, de validations, de dépendances et d’intégrations.

Ce niveau convient à :

- commerce UE + hors UE ;
- B2B plus structuré ;
- besoin documentaire ou de validation plus marqué.

### Niveau 4 — expert / réglementé / multi-contraintes

Le domaine couvre des contextes plus sensibles :

- accises ;
- contraintes documentaires avancées ;
- règles spécialisées ;
- dépendances réglementaires plus fortes ;
- besoins de contrôle et de maintenance plus élevés.

Ce niveau n’est pas la valeur par défaut.
Il doit être activé pour un besoin réel.

---

## Entrées

Le domaine reçoit principalement :

- un contexte de vente ;
- une zone de vente ;
- un contexte client ou entreprise ;
- une adresse ou zone de livraison / facturation pertinente ;
- un type d’offre ou une classe fiscale ;
- des paramètres de boutique ;
- des capabilities activées ;
- éventuellement des résultats de validation ou d’intégration traduits.

---

## Sorties

Le domaine expose principalement :

- une décision fiscale interne ;
- un breakdown fiscal structuré ;
- une qualification du contexte du point de vue fiscal ;
- un ensemble de règles applicables ;
- des drapeaux de blocage ou d’avertissement pour `checkout` ;
- des éléments nécessaires au figement ultérieur dans `orders`.

---

## Dépendances vers autres domaines

Le domaine `taxation` dépend de :

- `stores` pour le contexte commercial et les capabilities activées ;
- `products` pour certaines classes ou qualifications d’offre ;
- `pricing` pour la base de calcul économique sur laquelle la taxation s’applique ;
- `customers` pour certains contextes B2B / B2C ;
- `checkout` pour le contexte final de vente ;
- `audit` pour les changements sensibles de configuration fiscale ;
- `observability` pour expliquer une décision fiscale ou un refus.

Les domaines suivants dépendent de `taxation` :

- `checkout`
- `orders`
- `documents`
- `integrations`
- `analytics`

---

## Dépendances vers providers / intégrations

Le domaine `taxation` ne doit pas dépendre directement d’un provider externe pour exister.

Si des providers existent pour :

- validation TVA ;
- facturation électronique ;
- calcul fiscal enrichi ;
- conformité documentaire ;

ils sont branchés via `integrations`.

Le domaine `taxation` :

- ne prend pas un résultat provider brut comme vérité ;
- ne laisse pas un schéma externe redéfinir son langage interne ;
- n’applique un résultat externe qu’après traduction, validation et intégration contrôlée.

---

## Rôles / permissions concernés

### Rôles

Les rôles principalement concernés sont :

- `platform_owner`
- `platform_engineer`
- `store_owner`
- `store_manager`
- `finance_manager`
- `compliance_manager`

### Permissions

Exemples de permissions concernées :

- `taxation.read`
- `taxation.write`
- `taxation.rules.manage`
- `taxation.config.manage`
- `documents.read`
- `audit.read`

---

## Événements émis

Le domaine émet les domain events internes suivants :

- `taxation.rule.created`
- `taxation.rule.updated`
- `taxation.profile.updated`
- `taxation.decision.produced`
- `taxation.vat.validation.completed`
- `taxation.excise.decision.produced`

---

## Événements consommés

Le domaine consomme les domain events internes suivants :

- `store.capabilities.updated`
- `product.updated`
- `customer.updated`
- `checkout.updated`
- `integration.tax.result.translated`
- `integration.vat.validation.translated`

---

## Données sensibles / sécurité

Le domaine `taxation` porte une donnée métier sensible à forte criticité fonctionnelle.

Points de vigilance :

- une erreur fiscale peut créer une erreur commerciale, comptable ou réglementaire ;
- les règles de taxation ne doivent pas être modifiées sans contrôle ;
- les validations externes doivent être traduites et vérifiées ;
- les configurations plus avancées doivent être auditables ;
- les données utiles à la qualification fiscale ne doivent pas fuiter inutilement.

---

## Observability / audit

### Observability

Il faut pouvoir comprendre :

- pourquoi une règle fiscale a été retenue ;
- pourquoi un contexte a été qualifié d’une certaine manière ;
- pourquoi un checkout est bloqué ou averti du point de vue fiscal ;
- quel niveau de taxation est activé sur le projet ;
- si une décision fiscale provient d’une règle interne ou d’un enrichissement externe traduit.

### Audit

Il faut tracer :

- la création et la modification des règles fiscales ;
- les changements de profile ou de configuration fiscale ;
- les activations de capabilities fiscales sensibles ;
- les corrections administratives impactant durablement le calcul fiscal ;
- les replays ou corrections exceptionnelles de certains résultats traduits.

---

## Invariants métier

Les règles suivantes doivent toujours rester vraies :

- le domaine `taxation` reste la source de vérité interne des décisions fiscales du socle ;
- une décision fiscale est produite dans un langage interne stable ;
- un provider externe ne remplace jamais la logique interne du domaine ;
- le niveau fiscal activé doit rester cohérent avec les capabilities de la boutique ;
- une capability avancée ne doit pas être considérée comme implicite ;
- un projet sans besoin fiscal avancé ne doit pas subir la complexité d’un niveau 4 ;
- un projet à contraintes avancées ne doit pas être forcé dans un niveau simple.

---

## Lifecycle et gouvernance des données

### États principaux

Pour les objets principaux du domaine, les états utiles sont notamment :

- `ACTIVE`
- `DISABLED`
- `ARCHIVED`

Selon les objets :

- une règle fiscale peut être active, désactivée ou archivée ;
- un profile fiscal peut être actif ou remplacé ;
- une décision fiscale peut être produite puis figée dans un autre domaine.

### Transitions autorisées

Exemples :

- `ACTIVE -> DISABLED`
- `DISABLED -> ACTIVE`
- `ACTIVE -> ARCHIVED`

### Transitions interdites

- une règle archivée ne redevient pas implicitement active sans action explicite ;
- une décision fiscale figée dans une commande n’est pas recalculée rétroactivement comme si elle n’avait jamais existé.

### Règles de conservation / archivage / suppression

- les règles fiscales et profils doivent être auditables ;
- les décisions fiscales ayant servi à un checkout ou à une commande doivent rester compréhensibles ;
- l’archivage est préférable à la suppression implicite pour les éléments structurants ;
- une suppression physique n’est acceptable que si elle n’affecte ni audit, ni support, ni compréhension métier.

---

## Transactions / cohérence / concurrence

### Ce qui doit être atomique

Les opérations suivantes doivent réussir ou échouer ensemble :

- création ou modification structurante d’une règle fiscale ;
- activation ou désactivation d’une configuration fiscale ;
- mise à jour d’un profil fiscal ;
- production d’une décision fiscale persistée si elle est stockée ;
- écriture des events `taxation.*` correspondants ;
- intégration d’un résultat externe traduit lorsqu’il a un impact durable sur la configuration ou le résultat interne.

### Ce qui peut être eventual consistency

Les traitements suivants peuvent partir après commit :

- projection analytics ;
- génération documentaire secondaire ;
- synchronisation externe ;
- export réglementaire ;
- notification ou monitoring opérationnel.

### Stratégie de concurrence

Le domaine protège explicitement ses invariants par :

- des mises à jour transactionnelles des configurations fiscales ;
- des gardes sur l’état actif / désactivé / archivé ;
- une lecture cohérente du contexte de taxation au moment de la décision ;
- une interdiction de faire de la logique externe une vérité concurrente ;
- une structuration explicite des changements sensibles.

Les conflits attendus sont :

- deux changements concurrents de règles fiscales ;
- changement de configuration pendant un calcul ou une validation de checkout ;
- double traitement d’un même résultat externe de validation ;
- activation concurrente de capabilities fiscales incompatibles ou mal alignées.

### Idempotence

Les commandes métier suivantes doivent être idempotentes :

- `upsert-tax-rule` : clé d’intention = `(storeId, taxRuleCode, changeIntentId)`
- `apply-vat-validation-result` : clé d’intention = `(providerName, externalValidationId)`
- `produce-tax-decision` : clé d’intention = `(taxContextId, taxationProfileVersion)`
- `apply-excise-decision` : clé d’intention = `(taxContextId, exciseProfileVersion, decisionIntentId)`

Un retry sur la même intention ne doit jamais produire deux décisions incompatibles ou deux changements divergents de configuration.

### Domain events écrits dans la même transaction

Les événements suivants sont persistés dans l’outbox dans la même transaction que la mutation source :

- `taxation.rule.created`
- `taxation.rule.updated`
- `taxation.profile.updated`
- `taxation.decision.produced`
- `taxation.vat.validation.completed`
- `taxation.excise.decision.produced`

### Effets secondaires après commit

Les traitements suivants ne doivent jamais être exécutés dans la transaction principale :

- appel à un provider externe ;
- validation TVA externe ;
- génération documentaire externe ;
- export réglementaire ;
- analytics ;
- notifications opératoires.

---

## Impact maintenance / exploitation

### Niveau de maintenance minimal recommandé

- `M1` pour un niveau fiscal simple et local ;
- `M2` pour un usage UE standard ;
- `M3` dès que plusieurs zones, validations externes ou règles plus riches interviennent ;
- `M4` pour les contextes très réglementés ou fortement contraints.

### Pourquoi

Le domaine `taxation` devient rapidement coûteux en erreur, en support et en conformité dès qu’il dépasse le cas simple.
Plus le niveau monte, plus il exige :

- traçabilité ;
- observability ;
- discipline de configuration ;
- qualité de reprise ;
- séparation nette entre coeur et intégrations.

### Points d’exploitation à surveiller

- changements de configuration fiscale ;
- dérive entre niveau projet et capacités activées ;
- résultats externes traduits ;
- cohérence entre taxation, checkout, orders et documents ;
- incidents ou rejets liés à la logique fiscale.

---

## Impact coût / complexité

Le coût du domaine `taxation` monte principalement avec :

- le nombre de zones gérées ;
- le passage de local à UE, puis UE + hors UE ;
- l’activation de `vatValidation` ;
- l’activation de `electronicInvoicing` ;
- l’activation de `exciseTax` ;
- la dépendance à des intégrations spécialisées ;
- la criticité documentaire ou réglementaire.

Lecture relative du coût :

- niveau 1 : `C1` à `C2`
- niveau 2 : `C2`
- niveau 3 : `C3`
- niveau 4 : `C4`

---

## Cas d’usage principaux

1. Déterminer la logique de taxation applicable à un contexte de vente
2. Produire un breakdown fiscal interne pour `checkout`
3. Préparer des éléments fiscaux à figer dans `orders`
4. Gérer un projet local simple sans surcomplexité
5. Gérer un projet multi-pays ou plus réglementé par montée de niveau
6. Intégrer proprement une validation TVA ou une conformité fiscale plus riche
7. Activer des capacités avancées comme les accises sans polluer les projets simples

---

## Cas limites / erreurs métier

Quelques cas d’erreur typiques :

- règle fiscale manquante ou incohérente ;
- configuration de boutique incompatible avec le niveau activé ;
- contexte de vente incomplet pour produire une décision fiable ;
- résultat externe de validation invalide ou dupliqué ;
- tentative d’utiliser une capability fiscale non activée ;
- mélange illégitime entre logique fiscale interne et payload provider brut ;
- changement de configuration en conflit avec un processus en cours.

---

## Décisions d’architecture

Les choix structurants du domaine sont :

- `taxation` est un domaine coeur à capabilities toggleables ;
- le domaine porte explicitement des niveaux de sophistication ;
- un projet simple ne paie pas d’emblée la complexité d’un projet réglementé ;
- le domaine reste la source de vérité interne des décisions fiscales ;
- les providers externes restent à la frontière via `integrations` ;
- les accises sont une capability spécialisée, pas la norme du domaine ;
- la montée de complexité fiscale doit rester additive et compatible avec le socle.

---

## Questions explicitement closes

Les points suivants sont considérés comme décidés :

- `taxation` appartient au coeur du socle ;
- sa sophistication varie par capability et par niveau ;
- Creatyss n’a pas besoin d’un niveau fiscal avancé au départ ;
- les accises ne sont pas activées par défaut ;
- les projets multi-pays ou réglementés montent en niveau sans exiger un autre socle ;
- les providers externes de calcul ou de conformité restent des intégrations, pas la vérité interne du domaine.
