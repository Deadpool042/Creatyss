# Domaine fraud-risk

## Rôle

Le domaine `fraud-risk` porte l’évaluation structurée du risque de fraude du socle.

Il organise les signaux, évaluations, niveaux de risque, blocages, revues et décisions préventives liés à des comportements, transactions ou opérations potentiellement frauduleux, sans absorber le paiement, la commande, les permissions, l’audit, le tracking brut ou les providers externes spécialisés.

## Responsabilités

Le domaine `fraud-risk` prend en charge :

- les signaux internes de risque de fraude
- les évaluations structurées de risque
- les niveaux ou scores de risque au niveau métier
- les décisions de blocage, de mise en revue ou d’autorisation conditionnelle
- les cas ou dossiers de revue fraude si le modèle retenu le prévoit
- la lecture gouvernée du risque applicable à une opération ou un acteur
- la base fraude consommable par `orders`, `payments`, `customers`, `checkout`, `dashboarding`, `observability` et certaines couches d’administration

## Ce que le domaine ne doit pas faire

Le domaine `fraud-risk` ne doit pas :

- porter les paiements, qui relèvent de `payments`
- porter la commande durable, qui relève de `orders`
- porter les permissions ou droits d’accès, qui relèvent de `permissions`
- porter l’audit sensible, qui relève de `audit`
- porter les signaux bruts de mesure, qui relèvent de `tracking`
- porter les providers antifraude spécialisés, qui relèvent de `integrations`
- devenir un moteur opaque sans langage métier explicite ni capacité d’explication interne

Le domaine `fraud-risk` porte l’évaluation structurée du risque de fraude. Il ne remplace ni `payments`, ni `orders`, ni `permissions`, ni `audit`, ni `tracking`, ni `integrations`.

## Sous-domaines

- `signals` : signaux internes de risque
- `assessments` : évaluations structurées de risque fraude
- `reviews` : cas de revue ou d’investigation antifraude
- `decisions` : décisions métier de blocage, d’escalade ou d’autorisation conditionnelle
- `policies` : règles d’évaluation, de seuil, d’exposition ou de traitement du risque

## Entrées

Le domaine reçoit principalement :

- des signaux issus de `checkout`, `orders`, `payments`, `customers`, `tracking` ou d’autres domaines autorisés
- des demandes d’évaluation de risque sur une opération, une commande, un paiement ou un acteur
- des demandes de lecture d’un état de risque ou d’un dossier de revue fraude
- des changements de politique, de seuil ou de décision antifraude
- des contextes de boutique, acteur, session, transaction, commande, canal ou surface d’exposition
- des signaux internes utiles à l’escalade, au blocage ou à la levée d’un risque

## Sorties

Le domaine expose principalement :

- des évaluations structurées de risque fraude
- des signaux et niveaux de risque consolidés
- des décisions de blocage, revue ou autorisation conditionnelle
- des lectures exploitables par `orders`, `payments`, `customers`, `checkout`, `dashboarding`, `observability` et certaines couches d’administration
- des structures de risque prêtes à être consommées par les domaines opérationnels autorisés

## Dépendances vers autres domaines

Le domaine `fraud-risk` peut dépendre de :

- `orders` pour certains contextes de commande à risque
- `payments` pour certains contextes de paiement à risque
- `customers` pour certains contextes de compte ou d’historique client
- `checkout` pour certains signaux amont de parcours transactionnel
- `tracking` pour certains signaux de comportement ou d’environnement lorsque cela est autorisé
- `consent` si certains enrichissements de signal dépendent d’un cadre de traitement autorisé
- `approval` si certaines décisions sensibles nécessitent validation humaine ou escalade
- `audit` pour tracer certaines décisions ou interventions sensibles
- `observability` pour expliquer pourquoi un niveau de risque, un blocage ou une revue a été appliqué
- `stores` pour le contexte boutique et certaines politiques locales antifraude

Les domaines suivants peuvent dépendre de `fraud-risk` :

- `orders`
- `payments`
- `checkout`
- `dashboarding`
- `observability`
- `support`
- certaines couches d’administration plateforme et boutique

## Capabilities activables liées

Le domaine `fraud-risk` n’est pas une capability métier optionnelle au sens strict du noyau, mais il devient particulièrement important dès qu’un flux transactionnel ou financier existe.

Exemples de capabilities liées :

- `tracking`
- `behavioralAnalytics`
- `advancedPermissions`
- `auditTrail`

### Règle

Le domaine `fraud-risk` reste structurellement présent même si les politiques antifraude restent sobres en V1.

Il constitue le cadre commun d’évaluation et de gouvernance du risque fraude, distinct des paiements, commandes et providers spécialisés.

## Rôles/permissions concernés

### Rôles

Les rôles principalement concernés sont :

- `platform_owner`
- `platform_engineer`
- `store_owner`
- `store_manager`
- `order_manager` en lecture ou action partielle selon la politique retenue
- `customer_support` en lecture très encadrée selon la politique retenue
- certains rôles fraude, revue ou conformité selon l’organisation retenue

### Permissions

Exemples de permissions concernées :

- `fraud_risk.read`
- `fraud_risk.write`
- `orders.read`
- `payments.read`
- `customers.read`
- `tracking.read`
- `audit.read`
- `approval.read`

## Événements émis

Le domaine peut émettre des domain events internes du type :

- `fraud_risk.signal.detected`
- `fraud_risk.assessed`
- `fraud_risk.review.created`
- `fraud_risk.review.updated`
- `fraud_risk.decision.changed`
- `fraud_risk.blocked`
- `fraud_risk.cleared`

## Événements consommés

Le domaine peut consommer certains événements internes du type :

- `checkout.readiness.changed`
- `order.created`
- `payment.authorized`
- `payment.failed`
- `customer.created`
- `tracking.event.created`
- `approval.approved`
- `store.capabilities.updated`
- certaines actions administratives structurées de revue, blocage ou levée de risque

Il doit toutefois rester maître de sa propre logique d’évaluation antifraude.

## Intégrations externes

Le domaine `fraud-risk` ne doit pas devenir un domaine d’intégration provider-specific.

Il peut être enrichi par `integrations` vers des outils antifraude externes, mais :

- la vérité du risque fraude interne reste dans `fraud-risk`
- les DTO providers externes restent dans `integrations`
- les décisions métier internes restent exprimées dans le langage du socle

## Données sensibles / sécurité

Le domaine `fraud-risk` manipule des signaux hautement sensibles liés à la sécurité économique et à la confiance transactionnelle.

Points de vigilance :

- contrôle strict des droits de lecture et d’écriture
- séparation claire entre signal brut, évaluation de risque, décision et revue humaine
- protection des signaux sensibles, motifs de suspicion et décisions de blocage
- limitation de l’exposition selon le rôle, le scope et le besoin métier
- audit des évaluations, décisions et consultations sensibles

## Observability / audit

### Observability

Il faut pouvoir comprendre :

- quel risque fraude a été évalué
- quels signaux ou contextes ont contribué à l’évaluation
- quel niveau, quelle décision ou quelle revue est en vigueur
- pourquoi une opération est bloquée, mise en revue ou autorisée conditionnellement
- si une évaluation est absente à cause d’une capability off, d’un signal manquant, d’une policy restrictive ou d’une règle applicable

### Audit

Il faut tracer :

- la création d’une évaluation sensible de risque
- la création ou mise à jour d’une revue fraude
- les décisions de blocage, de levée ou d’escalade sensibles
- certaines consultations sensibles si le modèle final les retient explicitement
- certaines modifications manuelles importantes des politiques ou seuils antifraude

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `FraudRiskSignal` : signal de risque fraude structuré
- `FraudRiskAssessment` : évaluation consolidée de risque
- `FraudRiskLevel` : niveau de risque applicable
- `FraudRiskDecision` : décision métier associée au risque
- `FraudRiskReview` : revue ou cas d’investigation antifraude
- `FraudRiskPolicy` : règle d’évaluation, de seuil ou de traitement
- `FraudRiskSubjectRef` : référence vers l’opération, la commande, le paiement ou l’acteur concerné

## Invariants métier

Les règles suivantes doivent toujours rester vraies :

- une évaluation de risque est rattachée à un sujet explicite
- un niveau de risque possède une signification métier explicite
- une décision de risque est distincte du paiement, de la commande et des permissions
- `fraud-risk` ne se confond pas avec `payments`
- `fraud-risk` ne se confond pas avec `orders`
- `fraud-risk` ne se confond pas avec `tracking`
- `fraud-risk` ne se confond pas avec `integrations`
- les autres domaines ne doivent pas recréer librement leur propre vérité divergente d’évaluation antifraude quand le cadre commun `fraud-risk` existe
- une décision provider externe ou un score brut ne doit pas devenir directement la vérité métier interne sans traduction explicite

## Cas d’usage principaux

1. Évaluer le risque fraude d’une commande ou d’un paiement
2. Déclencher une revue manuelle sur une opération sensible
3. Bloquer ou autoriser conditionnellement un flux transactionnel
4. Alimenter `orders` ou `payments` avec une décision de risque exploitable
5. Exposer à l’admin une lecture claire des signaux, évaluations et revues fraude
6. Encadrer la traçabilité et l’explicabilité des décisions antifraude sensibles

## Cas limites / erreurs métier

Quelques cas d’erreur typiques :

- sujet de risque introuvable
- signal antifraude invalide ou incohérent
- évaluation de risque impossible ou incomplète
- politique ou seuil antifraude invalide
- tentative de décision non autorisée
- permission ou scope insuffisant
- conflit entre plusieurs règles d’évaluation, d’escalade ou de blocage

## Décisions d’architecture

Les choix structurants du domaine sont :

- `fraud-risk` porte l’évaluation structurée du risque de fraude du socle
- `fraud-risk` est distinct de `payments`
- `fraud-risk` est distinct de `orders`
- `fraud-risk` est distinct de `tracking`
- `fraud-risk` est distinct de `integrations`
- les domaines consommateurs lisent la vérité antifraude via `fraud-risk`, sans la recréer localement
- les signaux, évaluations, décisions et revues sensibles doivent être observables et auditables

## Questions explicitement closes

Les points suivants sont considérés comme décidés :

- l’évaluation structurée du risque fraude relève de `fraud-risk`
- les paiements relèvent de `payments`
- les commandes relèvent de `orders`
- les signaux bruts de mesure relèvent de `tracking`
- les providers antifraude externes relèvent de `integrations`
- `fraud-risk` ne remplace ni `payments`, ni `orders`, ni `tracking`, ni `integrations`, ni `audit`, ni `permissions`
