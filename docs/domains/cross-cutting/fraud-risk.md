# Fraud Risk

## Rôle

Le domaine `fraud-risk` porte l’évaluation structurée du risque de fraude du système.

Il définit :

- ce qu’est un risque fraude du point de vue du système ;
- comment sont structurés les signaux, évaluations, niveaux de risque, revues et décisions antifraude ;
- comment ce domaine se distingue du paiement, de la commande, des permissions, de l’audit, du tracking brut et des providers externes spécialisés ;
- comment le système reste maître de sa vérité interne sur les décisions et lectures antifraude.

Le domaine existe pour fournir une représentation explicite du risque fraude, distincte :

- des paiements portés par `payments` ;
- des commandes portées par `orders` ;
- des permissions portées par `permissions` ;
- de l’audit porté par `audit` ;
- du tracking brut porté par `tracking` ;
- des DTO providers externes portés par `integrations`.

---

## Classification

### Catégorie documentaire

`cross-cutting`

### Criticité architecturale

`transverse structurant`

### Activable

`non`

Le domaine `fraud-risk` est structurel dès lors qu’un flux transactionnel, financier ou sensible existe dans le système.

---

## Source de vérité

Le domaine `fraud-risk` est la source de vérité pour :

- les signaux internes de risque fraude portés par le système ;
- les évaluations structurées de risque ;
- les niveaux de risque métier ;
- les décisions de blocage, revue, escalade ou autorisation conditionnelle ;
- les dossiers ou cas de revue antifraude lorsqu’ils sont modélisés ici ;
- ses lectures structurées consommables par les domaines autorisés.

Le domaine `fraud-risk` n’est pas la source de vérité pour :

- les paiements, qui relèvent de `payments` ;
- les commandes, qui relèvent de `orders` ;
- les permissions ou droits d’accès, qui relèvent de `permissions` ;
- l’audit sensible, qui relève de `audit` ;
- les signaux bruts de mesure, qui relèvent de `tracking` ;
- les providers antifraude externes, qui relèvent de `integrations` ;
- les DTO providers externes.

Un risque fraude est une lecture métier gouvernée de suspicion ou de danger transactionnel.
Il ne doit pas être confondu avec :

- un paiement ;
- une commande ;
- un droit d’accès ;
- un score brut provider ;
- un event de tracking ;
- un log d’audit.

---

## Responsabilités

Le domaine `fraud-risk` est responsable de :

- définir ce qu’est une évaluation de risque fraude dans le système ;
- porter les signaux internes de risque ;
- porter les évaluations structurées de risque ;
- porter les niveaux de risque métier ;
- porter les décisions de blocage, revue ou autorisation conditionnelle ;
- exposer une lecture gouvernée du risque applicable à une opération, une commande, un paiement ou un acteur ;
- publier les événements significatifs liés à la vie d’une évaluation ou d’une revue antifraude ;
- protéger le système contre les décisions antifraude implicites, opaques ou contradictoires.

Selon le périmètre exact du projet, le domaine peut également être responsable de :

- revues manuelles antifraude ;
- escalades antifraude ;
- autorisations conditionnelles ;
- politiques locales par boutique ;
- règles de seuil ;
- neutralisation ou levée de risque ;
- signaux issus de parcours transactionnels ;
- coordination avec approbation sur certaines décisions sensibles.

---

## Non-responsabilités

Le domaine `fraud-risk` n’est pas responsable de :

- porter les paiements ;
- porter les commandes ;
- porter les permissions ou droits d’accès ;
- porter l’audit sensible ;
- porter les signaux bruts de mesure ;
- exécuter les providers antifraude spécialisés ;
- devenir un moteur opaque sans langage métier explicite ni capacité d’explication interne.

Le domaine `fraud-risk` ne doit pas devenir :

- un doublon de `payments` ;
- un doublon de `orders` ;
- un doublon de `tracking` ;
- un doublon de `integrations` ;
- un conteneur flou de scores ou signaux sans gouvernance métier.

---

## Invariants

Les invariants minimaux sont les suivants :

- une évaluation de risque est rattachée à un sujet explicite ;
- un niveau de risque possède une signification métier explicite ;
- une décision de risque est distincte du paiement, de la commande et des permissions ;
- `fraud-risk` ne se confond pas avec `payments` ;
- `fraud-risk` ne se confond pas avec `orders` ;
- `fraud-risk` ne se confond pas avec `tracking` ;
- `fraud-risk` ne se confond pas avec `integrations` ;
- les autres domaines ne doivent pas recréer librement leur propre vérité divergente d’évaluation antifraude quand le cadre commun `fraud-risk` existe ;
- une décision provider externe ou un score brut ne doit pas devenir directement la vérité métier interne sans traduction explicite ;
- une opération bloquée, escaladée ou mise en revue doit pouvoir être expliquée.

Le domaine protège la cohérence des décisions antifraude, pas la vérité primaire des flux transactionnels.

---

## Dépendances

### Dépendances métier

Le domaine `fraud-risk` interagit fortement avec :

- `orders`
- `payments`
- `customers`
- `checkout`
- `stores`

### Dépendances transverses

Le domaine dépend également de :

- `tracking`, pour certains signaux de comportement ou d’environnement lorsque cela est autorisé
- `consent`, si certains enrichissements dépendent d’un cadre de traitement autorisé
- `approval`, si certaines décisions sensibles nécessitent validation humaine ou escalade
- `audit`
- `observability`
- `dashboarding`
- `support`

### Dépendances externes

Le domaine peut être relié indirectement à :

- outils antifraude externes ;
- moteurs de scoring ;
- PSP ou plateformes de paiement ;
- autres systèmes via `integrations`.

### Règle de frontière

Le domaine `fraud-risk` porte l’évaluation structurée du risque de fraude.
Il ne doit pas absorber :

- les paiements ;
- les commandes ;
- les permissions ;
- l’audit ;
- les signaux bruts ;
- ni les DTO providers externes.

---

## Événements significatifs

Le domaine `fraud-risk` publie ou peut publier des événements significatifs tels que :

- signal de risque détecté ;
- risque évalué ;
- revue fraude créée ;
- revue fraude mise à jour ;
- décision de risque modifiée ;
- blocage antifraude appliqué ;
- risque levé.

Le domaine peut consommer des signaux liés à :

- readiness checkout modifiée ;
- commande créée ;
- paiement autorisé ;
- paiement échoué ;
- client créé ;
- événement de tracking créé ;
- approbation accordée ;
- capability boutique modifiée ;
- action administrative structurée de revue, blocage ou levée de risque.

Les noms exacts doivent rester dans le langage interne du système.

---

## Cycle de vie

Le domaine `fraud-risk` possède un cycle de vie explicite.

Le cycle exact dépend du projet, mais il doit au minimum distinguer :

- détecté ;
- évalué ;
- en revue ;
- bloqué ;
- autorisé conditionnellement ;
- levé, si pertinent ;
- archivé, si pertinent.

Des états supplémentaires peuvent exister :

- indéterminé ;
- suspendu ;
- escaladé ;
- expiré.

Le domaine doit éviter :

- les évaluations “fantômes” ;
- les décisions silencieuses ;
- les états purement techniques non interprétables métier.

---

## Interfaces et échanges

Le domaine `fraud-risk` expose principalement :

- des évaluations structurées de risque fraude ;
- des signaux et niveaux de risque consolidés ;
- des décisions de blocage, revue ou autorisation conditionnelle ;
- des lectures exploitables par `orders`, `payments`, `customers`, `checkout`, `dashboarding`, `observability` et certaines couches d’administration ;
- des structures de risque prêtes à être consommées par les domaines opérationnels autorisés.

Le domaine reçoit principalement :

- des signaux issus de `checkout`, `orders`, `payments`, `customers`, `tracking` ou d’autres domaines autorisés ;
- des demandes d’évaluation de risque sur une opération, une commande, un paiement ou un acteur ;
- des demandes de lecture d’un état de risque ou d’un dossier de revue fraude ;
- des changements de politique, de seuil ou de décision antifraude ;
- des contextes de boutique, acteur, session, transaction, commande, canal ou surface d’exposition ;
- des signaux internes utiles à l’escalade, au blocage ou à la levée d’un risque.

Le domaine ne doit pas exposer un contrat canonique dicté par un provider externe.

---

## Contraintes d’intégration

Le domaine `fraud-risk` peut être exposé à des contraintes telles que :

- signaux multiples ;
- scoring différé ;
- enrichissements conditionnés au consentement ;
- revues manuelles ;
- politiques locales par boutique ;
- décisions à forte criticité ;
- projection vers outils externes ;
- rétrocompatibilité des niveaux ou décisions.

Règles minimales :

- la hiérarchie d’autorité doit être explicite ;
- la vérité interne du risque fraude reste dans `fraud-risk` ;
- les DTO providers restent dans `integrations` ;
- les traitements rejouables doivent être idempotents ou neutralisés ;
- un signal ambigu ou incomplet ne doit pas produire silencieusement une décision trompeuse ;
- les conflits entre signal, score, consentement, seuil et décision doivent être explicables.

---

## Données sensibles / sécurité

Le domaine `fraud-risk` manipule des signaux hautement sensibles liés à la sécurité économique et à la confiance transactionnelle.

Points de vigilance :

- contrôle strict des droits de lecture et d’écriture ;
- séparation claire entre signal brut, évaluation de risque, décision et revue humaine ;
- protection des signaux sensibles, motifs de suspicion et décisions de blocage ;
- limitation de l’exposition selon le rôle, le scope et le besoin métier ;
- audit des évaluations, décisions et consultations sensibles.

---

## Observabilité et audit

Le domaine `fraud-risk` doit rendre visibles au minimum :

- quel risque fraude a été évalué ;
- quels signaux ou contextes ont contribué à l’évaluation ;
- quel niveau, quelle décision ou quelle revue est en vigueur ;
- pourquoi une opération est bloquée, mise en revue ou autorisée conditionnellement ;
- si une évaluation est absente à cause d’une capability inactive, d’un signal manquant, d’une policy restrictive ou d’une règle applicable.

L’audit doit permettre de répondre à des questions comme :

- quelle évaluation de risque a été créée ou modifiée ;
- quand ;
- selon quelle origine ;
- avec quels signaux ou seuils ;
- avec quelle décision prise ou revue créée ;
- avec quelle action manuelle significative.

L’observabilité doit distinguer :

- erreur de modèle ;
- erreur technique ;
- signal invalide ;
- évaluation incomplète ;
- politique incohérente ;
- décision non autorisée ;
- scope insuffisant.

---

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `FraudRiskSignal` : signal de risque fraude structuré ;
- `FraudRiskAssessment` : évaluation consolidée de risque ;
- `FraudRiskLevel` : niveau de risque applicable ;
- `FraudRiskDecision` : décision métier associée au risque ;
- `FraudRiskReview` : revue ou cas d’investigation antifraude ;
- `FraudRiskPolicy` : règle d’évaluation, de seuil ou de traitement ;
- `FraudRiskSubjectRef` : référence vers l’opération, la commande, le paiement ou l’acteur concerné.

---

## Impact de maintenance / exploitation

Le domaine `fraud-risk` a un impact d’exploitation élevé.

Raisons :

- il touche directement la sécurité économique et transactionnelle ;
- ses erreurs peuvent bloquer indûment ou laisser passer des opérations à risque ;
- il se situe à la frontière entre checkout, paiement, commande et sécurité ;
- il nécessite une forte explicabilité des décisions ;
- il peut dépendre de signaux sensibles et de politiques complexes.

En exploitation, une attention particulière doit être portée à :

- la qualité des signaux ;
- la cohérence des évaluations ;
- la traçabilité des décisions ;
- la cohérence avec orders, payments et checkout ;
- les effets de bord sur support, pilotage et expérience client ;
- la traduction correcte des enrichissements externes.

Le domaine doit être considéré comme structurant dès qu’un flux transactionnel réel existe.

---

## Limites du domaine

Le domaine `fraud-risk` s’arrête :

- avant les paiements ;
- avant les commandes ;
- avant les permissions ;
- avant l’audit ;
- avant les signaux de mesure bruts ;
- avant les providers externes ;
- avant les DTO providers externes.

Le domaine `fraud-risk` porte l’évaluation structurée du risque de fraude du système.
Il ne doit pas devenir un simple moteur de scoring opaque, un doublon des paiements ou un conteneur de signaux bruts sans gouvernance.

---

## Questions ouvertes

À confirmer explicitement dans le projet :

- la frontière exacte entre `fraud-risk` et `payments` ;
- la frontière exacte entre `fraud-risk` et `tracking` ;
- la part exacte des revues humaines réellement supportées ;
- la gouvernance des seuils et levées de risque ;
- la hiérarchie entre vérité interne et outils antifraude externes éventuels ;
- la place exacte du consentement dans les enrichissements antifraude.

Si ces points sont déjà tranchés ailleurs, ils doivent être réinjectés ici et sortir de cette section.

---

## Documents liés

- `../../architecture/10-fondations/11-modele-de-classification.md`
- `../../architecture/10-fondations/12-frontieres-et-responsabilites.md`
- `../optional/commerce/payments.md`
- `../core/commerce/orders.md`
- `permissions.md`
- `audit.md`
- `tracking.md`
- `../core/commerce/customers.md`
- `checkout.md`
- `consent.md`
- `approval.md`
- `observability.md`
- `dashboarding.md`
- `support.md`
- `../core/foundation/stores.md`
- `../optional/platform/integrations.md`
