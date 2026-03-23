# Maintenance and operating levels

## Objectif

Ce document définit les niveaux de maintenance technique et d’exploitation du socle.

Le niveau fonctionnel d’un projet ne suffit pas à qualifier son coût réel ni son niveau de risque.
Deux projets avec des capabilities proches peuvent exiger des niveaux de maintenance très différents selon :

- leur exposition métier ;
- leur dépendance au chiffre d’affaires ;
- leurs intégrations ;
- leurs contraintes réglementaires ;
- leur criticité opérationnelle ;
- leur tolérance à l’incident.

Le socle doit donc qualifier explicitement :

- la maintenance ;
- l’exploitation ;
- le suivi ;
- la reprise ;
- la supervision ;
- la discipline technique associée.

---

## Principe directeur

La maintenance est un axe autonome.

Elle ne se confond ni avec :

- la quantité de fonctionnalités ;
- le volume du catalogue ;
- le design ;
- la taille apparente du projet.

Un projet simple peut exiger une maintenance sérieuse.
Un projet fonctionnellement riche peut rester viable si sa maintenance est alignée sur son niveau réel de risque.

La maintenance est donc un paramètre de projet à part entière.

---

## Ce qui reste non négociable

Même au niveau le plus économique réellement exploitable, le socle impose :

- secrets hors dépôt ;
- séparation minimale des environnements ;
- sauvegardes régulières ;
- restauration possible ;
- mises à jour de sécurité planifiées ;
- observability minimale ;
- healthchecks ;
- logs exploitables ;
- audit minimal des mutations critiques ;
- cohérence transactionnelle sur les flux importants ;
- documentation minimale d’exploitation.

Un niveau de maintenance bas ne signifie jamais “site fragile”.

---

## Échelle officielle des niveaux de maintenance

---

## M0 — prototype / exploration

### Définition

Niveau réservé à un prototype, un démonstrateur, un lot d’exploration ou un environnement non destiné à une production sérieuse durable.

### Caractéristiques

- faible formalisation opératoire ;
- peu de promesses de continuité ;
- effort minimal d’exploitation ;
- usage interne ou pré-cadrage ;
- peu d’engagement sur la reprise.

### Rôle

Le niveau M0 peut exister pour :

- tester une direction ;
- valider une idée ;
- faire une démo ;
- préparer un futur lot.

### Limite

M0 n’est pas une cible de production pérenne.

---

## M1 — exploitation essentielle

### Définition

Niveau minimal de production sérieuse à coût maîtrisé.

### Objectif

Permettre un lancement propre et exploitable sans surcharger la structure technique ou le budget.

### Couverture attendue

- secrets correctement gérés ;
- environnement de prod distinct ;
- sauvegarde régulière ;
- possibilité réelle de restauration ;
- patching de sécurité planifié ;
- monitoring minimal ;
- logs utiles ;
- healthchecks ;
- redémarrage et reprise simples ;
- documentation d’exploitation courte mais suffisante.

### Positionnement

M1 est le plus petit niveau acceptable pour une production sérieuse.

---

## M2 — exploitation standard

### Définition

Niveau recommandé pour un commerce réellement exploité dans la durée.

### Objectif

Réduire le risque opérationnel, améliorer le support, rendre les évolutions plus confortables.

### Couverture attendue

- supervision plus structurée ;
- meilleure visibilité sur jobs, intégrations et erreurs ;
- restauration plus fiable ;
- revue plus régulière des dépendances ;
- discipline de release plus propre ;
- meilleure visibilité sur la performance ;
- documentation d’exploitation enrichie ;
- meilleure compréhension des incidents.

### Positionnement

M2 devient la cible naturelle dès qu’un projet commence à compter sérieusement pour l’activité du client.

---

## M3 — exploitation avancée

### Définition

Niveau adapté aux projets plus exposés, plus intégrés, plus rentables ou plus sensibles.

### Objectif

Augmenter la solidité opérationnelle, raccourcir le diagnostic, améliorer la maîtrise des incidents et des dépendances externes.

### Couverture attendue

- alerting plus fin ;
- observability plus structurée ;
- meilleure surveillance des domaines critiques ;
- reprise mieux documentée ;
- runbooks plus solides ;
- discipline renforcée sur mises à jour et intégrations ;
- meilleure maîtrise des performances et des flux externes ;
- supervision plus active du système.

### Positionnement

M3 est recommandé pour les projets :

- plus intégrés ;
- plus complexes ;
- plus sensibles financièrement ;
- ou plus exposés réglementairement.

---

## M4 — exploitation critique / réglementée

### Définition

Niveau réservé aux projets les plus exigeants en contrôle, auditabilité, conformité, maîtrise des changements et traçabilité.

### Objectif

Encadrer durablement le risque technique et métier dans les contextes les plus exposés.

### Couverture attendue

- gouvernance renforcée ;
- contrôle plus poussé des accès, incidents, changements et intégrations ;
- auditabilité plus rigoureuse ;
- supervision plus exigeante ;
- discipline d’exploitation élevée ;
- exigences supérieures de traçabilité et de pilotage.

### Positionnement

M4 n’est pas un niveau par défaut.
Il est réservé aux projets qui en ont réellement besoin.

---

## Axes couverts par la maintenance

Le niveau de maintenance doit être évalué sur tous les axes suivants.

---

## 1. Sécurité opérationnelle

Inclut :

- gestion des secrets ;
- revue des accès ;
- sécurité des points d’entrée ;
- patching de sécurité ;
- isolation des environnements ;
- contrôle des surfaces exposées.

---

## 2. Sauvegarde et restauration

Inclut :

- fréquence des backups ;
- périmètre sauvegardé ;
- rétention ;
- restaurabilité ;
- simplicité ou robustesse de la reprise.

---

## 3. Mises à jour et dépendances

Inclut :

- runtime ;
- dépendances applicatives ;
- dépendances d’intégration ;
- images Docker ;
- base de données ;
- arbitrage entre stabilité et fraîcheur.

---

## 4. Observability

Inclut :

- logs ;
- healthchecks ;
- métriques ;
- visibilité sur jobs ;
- visibilité sur paiements ;
- visibilité sur intégrations ;
- visibilité sur erreurs métier critiques.

---

## 5. Gestion d’incident

Inclut :

- détection ;
- diagnostic ;
- correction ;
- reprise ;
- réduction du temps de rétablissement ;
- clarté des actions opératoires.

---

## 6. Performance et capacité

Inclut :

- temps de réponse ;
- surveillance des points chauds ;
- contention ;
- impacts des jobs ;
- impacts des intégrations ;
- capacité d’absorption raisonnable.

---

## 7. Lifecycle technique

Inclut :

- dépréciation ;
- archivage ;
- purge ;
- conservation ;
- évolution de schéma ;
- fin de vie des intégrations ou capabilities.

---

## 8. Exploitabilité

Inclut :

- commandes utiles ;
- runbooks ;
- procédures de relance ;
- procédures de reprise ;
- configuration lisible ;
- compréhension rapide de l’état du système.

---

## 9. Qualité de livraison

Inclut :

- build fiable ;
- typecheck ;
- tests ;
- release ;
- correction rapide ;
- discipline de changement.

---

## Ce que couvre chaque niveau

---

## M1 couvre obligatoirement

- séparation minimale prod / local ;
- gestion correcte des secrets ;
- sauvegarde régulière ;
- restauration possible ;
- patching de sécurité planifié ;
- logs exploitables ;
- healthchecks ;
- build et typecheck fiables ;
- documentation d’exploitation courte ;
- reprise pragmatique.

---

## M2 ajoute

- meilleure supervision ;
- restauration mieux validée ;
- meilleure visibilité sur les flux critiques ;
- suivi plus clair des dépendances ;
- discipline de release renforcée ;
- visibilité plus utile sur la performance et les incidents.

---

## M3 ajoute

- alerting plus riche ;
- diagnostics plus rapides ;
- runbooks plus structurés ;
- meilleure maîtrise des intégrations et providers ;
- meilleure supervision des domaines critiques ;
- meilleure préparation aux incidents.

---

## M4 ajoute

- gouvernance et contrôle renforcés ;
- pilotage plus strict des changements ;
- exigences de traçabilité plus fortes ;
- surveillance et audit plus exigeants ;
- discipline technique supérieure.

---

## Compatibilité entre maintenance et capabilities

Certaines capabilities exigent un niveau de maintenance minimal.

### Compatibles avec M1

- catalogue simple ;
- panier standard ;
- checkout simple ;
- paiement mono-provider simple ;
- contenu éditorial simple.

### Recommandent M2

- plusieurs moyens de paiement ;
- plusieurs providers ;
- abandoned cart relaunch ;
- plusieurs intégrations utiles ;
- vente UE plus riche ;
- analytics enrichie ;
- automatisations métier simples.

### Recommandent M3

- accises ;
- fiscalité multi-zone avancée ;
- BNPL ;
- paiement en plusieurs fois ;
- orchestration plus dense d’intégrations ;
- documents réglementés ;
- dépendance forte à l’activité e-commerce.

### Recommandent M4

- contextes très réglementés ;
- exigences de contrôle élevées ;
- criticité métier particulièrement forte ;
- exposition importante ou auditabilité supérieure.

---

## Relation entre maintenance et coût

Le niveau de maintenance impacte directement :

- le coût récurrent ;
- le coût de support ;
- le coût de prévention ;
- la vitesse de diagnostic ;
- la vitesse de reprise ;
- le niveau de risque acceptable.

Le bon cadrage ne consiste pas à sous-vendre la maintenance.
Il consiste à choisir le niveau minimal compatible avec le risque réel du projet.

---

## Maintenance et coût d’entrée agressif

Le coût d’entrée du projet peut être agressif et maîtrisé.
Cela ne signifie pas :

- absence de maintenance ;
- production fragile ;
- sécurité minimale dégradée ;
- absence de restauration ;
- absence de logs ;
- exploitation improvisée.

Le bon compromis du socle est le suivant :

- build initial ciblé ;
- base technique sérieuse ;
- maintenance proportionnée ;
- montée progressive quand le projet gagne en valeur ou en complexité.

---

## Ce qu’un client achète réellement

Un client n’achète pas seulement :

- des pages ;
- un design ;
- des fonctionnalités.

Il achète aussi :

- un niveau de fiabilité ;
- un niveau de sécurité ;
- un niveau de suivi ;
- un niveau de reprise ;
- un niveau de stabilité ;
- un niveau d’évolutivité.

La maintenance fait donc partie intégrante de la valeur livrée.

---

## Règles de décision

### Règle 1

M1 est le minimum de production sérieuse.

### Règle 2

Une capability avancée peut imposer un niveau minimal supérieur.

### Règle 3

Le niveau de maintenance est choisi selon le risque, pas seulement selon le budget.

### Règle 4

Le niveau de maintenance doit rester compréhensible pour le client.

### Règle 5

Le niveau retenu doit permettre une montée progressive sans rupture d’architecture.

---

## Décisions structurantes

Les points suivants sont considérés comme décidés :

- la maintenance est un axe distinct du périmètre fonctionnel ;
- M0 n’est pas une cible de production durable ;
- M1 est le minimum sérieux de production ;
- certaines capabilities exigent M2, M3 ou M4 ;
- le coût d’entrée bas ne doit pas dégrader la robustesse ;
- la réutilisabilité du socle passe aussi par des niveaux de maintenance lisibles.
