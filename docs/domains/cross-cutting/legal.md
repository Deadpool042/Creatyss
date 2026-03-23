# Domaine legal

## Rôle

Le domaine `legal` porte les éléments juridiques structurés du socle.

Il organise les contenus, versions, acceptations, obligations et statuts juridiques nécessaires au fonctionnement de la boutique et de la plateforme, sans absorber les consentements réglementés, l’audit, les documents métier durables, les paiements, les notifications ou les intégrations providers externes.

## Responsabilités

Le domaine `legal` prend en charge :

- les contenus juridiques structurés
- les versions de documents juridiques applicables
- les statuts d’activation ou d’applicabilité de contenus juridiques
- les acceptations juridiques lorsqu’elles relèvent d’un cadre contractuel ou d’usage du socle
- la lecture gouvernée des obligations ou références juridiques applicables
- la base juridique consommable par `stores`, `customers`, `checkout`, `consent`, `audit`, `dashboarding` et certaines couches d’administration

## Ce que le domaine ne doit pas faire

Le domaine `legal` ne doit pas :

- porter les consentements réglementés, qui relèvent de `consent`
- porter l’audit sensible, qui relève de `audit`
- porter les documents métier durables comme facture ou avoir, qui relèvent de `documents`
- porter les paiements, qui relèvent de `payments`
- porter les notifications, qui relèvent de `notifications`
- porter les providers de signature, coffre ou conformité externes, qui relèvent de `integrations`
- devenir un simple dossier de fichiers statiques sans langage métier explicite

Le domaine `legal` porte les éléments juridiques structurés du socle. Il ne remplace ni `consent`, ni `audit`, ni `documents`, ni `payments`, ni `integrations`.

## Sous-domaines

- `documents` : contenus juridiques structurés
- `versions` : versions applicables des contenus juridiques
- `acceptance` : acceptations juridiques ou contractuelles lorsque le socle doit les tracer au niveau métier
- `policies` : règles d’applicabilité, de publication, de rétention ou d’exposition des contenus juridiques

## Entrées

Le domaine reçoit principalement :

- des créations ou mises à jour de contenus juridiques
- des changements de version ou de statut d’applicabilité
- des demandes de lecture d’un contenu juridique applicable
- des acceptations juridiques ou contractuelles émises par un acteur dans un contexte donné
- des contextes de boutique, acteur, pays, langue, canal, version ou surface d’exposition
- des signaux internes utiles à l’activation, à l’expiration ou à la substitution d’un contenu juridique

## Sorties

Le domaine expose principalement :

- des contenus juridiques structurés
- des versions juridiques applicables
- des acceptations juridiques lorsqu’elles sont portées par le socle
- des lectures exploitables par `stores`, `customers`, `checkout`, `consent`, `audit`, `dashboarding` et certaines couches d’administration
- des structures juridiques prêtes à être consommées par les couches UI ou domaines opérationnels autorisés

## Dépendances vers autres domaines

Le domaine `legal` peut dépendre de :

- `stores` pour le contexte boutique, pays, langue ou politiques locales
- `customers` ou `users` pour certains contextes d’acceptation ou de lecture applicables à un acteur
- `consent` pour articuler certaines obligations d’information sans absorber sa responsabilité
- `approval` si certaines publications juridiques nécessitent validation préalable
- `workflow` si le cycle de vie d’un contenu juridique suit un processus structuré
- `audit` pour tracer certaines publications, substitutions ou acceptations sensibles
- `observability` pour expliquer pourquoi une version juridique est applicable, remplacée, expirée ou non exposée

Les domaines suivants peuvent dépendre de `legal` :

- `stores`
- `customers`
- `checkout`
- `consent`
- `audit`
- `dashboarding`
- certaines couches storefront et d’administration

## Capabilities activables liées

Le domaine `legal` n’est pas une capability métier optionnelle au sens strict du noyau, mais il devient particulièrement important dès qu’une boutique expose des obligations contractuelles, informatives ou réglementaires structurées.

Exemples de capabilities liées :

- `multiLanguage`
- `electronicInvoicing`
- `publicEvents`
- `newsletter`

### Règle

Le domaine `legal` reste structurellement présent même si la V1 garde un périmètre juridique sobre.

Il constitue le cadre commun des contenus et versions juridiques applicables du socle.

## Rôles/permissions concernés

### Rôles

Les rôles principalement concernés sont :

- `platform_owner`
- `platform_engineer`
- `store_owner`
- `store_manager`
- `content_editor` en contribution encadrée selon la politique retenue
- `customer` pour ses propres acceptations ou lectures applicables selon le scope retenu

### Permissions

Exemples de permissions concernées :

- `legal.read`
- `legal.write`
- `customers.read`
- `consent.read`
- `store.settings.read`
- `audit.read`

## Événements émis

Le domaine peut émettre des domain events internes du type :

- `legal.document.created`
- `legal.document.updated`
- `legal.version.published`
- `legal.version.archived`
- `legal.acceptance.recorded`
- `legal.policy.updated`
- `legal.status.changed`

## Événements consommés

Le domaine peut consommer certains événements internes du type :

- `store.capabilities.updated`
- `customer.created`
- `checkout.readiness.changed`
- `approval.approved`
- `workflow.completed`
- certaines actions administratives structurées de publication, remplacement ou retrait d’un contenu juridique

Il doit toutefois rester maître de sa propre logique juridique structurée.

## Intégrations externes

Le domaine `legal` ne doit pas devenir un domaine d’intégration provider-specific.

Il peut être appuyé par `integrations` vers certains outils externes de conformité, signature ou archivage, mais :

- la vérité des contenus juridiques internes reste dans `legal`
- les DTO providers externes restent dans `integrations`
- les acceptations métier internes restent exprimées dans le langage du socle

## Données sensibles / sécurité

Le domaine `legal` manipule des contenus et traces sensibles à portée contractuelle ou réglementaire.

Points de vigilance :

- contrôle strict des droits de lecture et d’écriture
- séparation claire entre contenu juridique, version applicable, acceptation et preuve associée
- protection des acceptations sensibles et des historiques applicables
- limitation de l’exposition selon le rôle, le scope, le pays, la langue et la version
- audit des publications, substitutions, acceptations et consultations sensibles

## Observability / audit

### Observability

Il faut pouvoir comprendre :

- quel contenu juridique est applicable
- quelle version est en vigueur
- pourquoi une version a été publiée, remplacée, archivée ou rendue non applicable
- quel acteur a accepté quel contenu lorsque cette acceptation est portée par le socle
- si une absence d’exposition vient d’un statut inactif, d’une capability off, d’un contexte non compatible ou d’une règle applicable

### Audit

Il faut tracer :

- la création ou la publication d’un contenu juridique sensible
- les changements de version applicables
- les acceptations juridiques sensibles lorsque le modèle final les retient
- certaines consultations sensibles si le modèle final les retient explicitement
- certaines modifications manuelles importantes des politiques d’applicabilité ou d’exposition

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `LegalDocument` : contenu juridique structuré
- `LegalDocumentVersion` : version applicable d’un contenu juridique
- `LegalAcceptance` : acceptation juridique ou contractuelle enregistrée
- `LegalStatus` : état d’applicabilité ou de publication
- `LegalPolicy` : règle d’exposition, de rétention ou d’applicabilité
- `LegalSubjectRef` : référence vers la boutique, l’acteur, le checkout ou l’objet concerné

## Invariants métier

Les règles suivantes doivent toujours rester vraies :

- un contenu juridique possède un identifiant stable et une version explicite
- une acceptation juridique est rattachée à un contenu, une version et un contexte explicites
- `legal` ne se confond pas avec `consent`
- `legal` ne se confond pas avec `audit`
- `legal` ne se confond pas avec `documents`
- `legal` ne se confond pas avec `payments`
- les autres domaines ne doivent pas recréer librement leur propre vérité divergente de contenu juridique applicable quand le cadre commun `legal` existe
- une version non applicable, archivée ou remplacée ne doit pas être exposée comme version en vigueur hors règle explicite

## Cas d’usage principaux

1. Publier une nouvelle version des CGV ou d’une politique juridique
2. Exposer le contenu juridique applicable à un checkout ou à un compte client
3. Enregistrer une acceptation juridique lorsqu’elle doit être portée par le socle
4. Maintenir plusieurs versions selon le contexte, la langue ou le pays si le modèle le prévoit
5. Fournir à `checkout`, `stores` ou `customers` une lecture fiable du cadre juridique applicable
6. Exposer à l’admin une lecture claire des contenus, versions et acceptations juridiques

## Cas limites / erreurs métier

Quelques cas d’erreur typiques :

- contenu juridique introuvable
- version juridique invalide ou incompatible
- acceptation juridique incomplète ou non recevable
- contexte d’applicabilité invalide
- tentative de publication ou de remplacement non autorisée
- permission ou scope insuffisant
- conflit entre plusieurs règles d’applicabilité, de version ou d’exposition

## Décisions d’architecture

Les choix structurants du domaine sont :

- `legal` porte les éléments juridiques structurés du socle
- `legal` est distinct de `consent`
- `legal` est distinct de `audit`
- `legal` est distinct de `documents`
- `legal` est distinct de `payments`
- les domaines consommateurs lisent la vérité juridique via `legal`, sans la recréer localement
- les contenus, versions, acceptations et politiques sensibles doivent être observables et auditables

## Questions explicitement closes

Les points suivants sont considérés comme décidés :

- les contenus et versions juridiques structurés relèvent de `legal`
- les consentements réglementés relèvent de `consent`
- la traçabilité sensible relève de `audit`
- les documents métier durables relèvent de `documents`
- les paiements relèvent de `payments`
- `legal` ne remplace ni `consent`, ni `audit`, ni `documents`, ni `payments`, ni `integrations`
