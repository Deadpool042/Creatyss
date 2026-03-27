# Template System

## Rôle

Le domaine `template-system` porte les gabarits structurés réutilisables du système.

Il définit :

- ce qu’est un template du point de vue du système ;
- comment des modèles de contenu, de message, de mise en forme ou de composition réutilisables sont structurés, variantés, activés, publiés ou archivés ;
- comment ce domaine se distingue des contenus source, des notifications, de la newsletter, du social, du marketing, du rendu UI complet et des providers externes ;
- comment le système reste maître de sa vérité interne sur les gabarits réutilisables.

Le domaine existe pour fournir une représentation explicite des templates réutilisables, distincte :

- des contenus éditoriaux source portés par `pages`, `blog` ou `events` ;
- des notifications portées par `notifications` ;
- de la newsletter portée par `newsletter` ;
- des publications sociales portées par `social` ;
- des campagnes marketing portées par `marketing` ;
- des DTO providers externes portés par `integrations`.

---

## Classification

### Catégorie documentaire

`cross-cutting`

### Criticité architecturale

`transverse structurant`

### Activable

`non`

Le domaine `template-system` est structurel dès lors que plusieurs usages partagent des gabarits communs gouvernés.

---

## Source de vérité

Le domaine `template-system` est la source de vérité pour :

- les définitions internes de templates structurés ;
- leurs variantes ;
- leurs slots, paramètres ou zones configurables ;
- leurs règles de sélection ;
- leurs statuts d’activation, de publication ou d’archivage ;
- leurs lectures structurées consommables par les domaines autorisés.

Le domaine `template-system` n’est pas la source de vérité pour :

- les contenus éditoriaux source, qui relèvent de `pages`, `blog`, `events` ou d’autres domaines métier ;
- les notifications transactionnelles, qui relèvent de `notifications` ;
- les campagnes newsletter, qui relèvent de `newsletter` ;
- les publications sociales, qui relèvent de `social` ;
- les campagnes marketing, qui relèvent de `marketing` ;
- le rendu UI applicatif complet ;
- les DTO providers externes.

Un template est un gabarit gouverné réutilisable.
Il ne doit pas être confondu avec :

- un contenu final ;
- une notification ;
- une newsletter ;
- une campagne marketing ;
- un composant UI complet ;
- un simple stockage de HTML arbitraire sans modèle structuré.

---

## Responsabilités

Le domaine `template-system` est responsable de :

- définir ce qu’est un template dans le système ;
- porter les définitions de templates structurés ;
- porter leurs variantes selon contexte, langue, canal ou usage si le modèle les expose ;
- porter les slots, sections ou paramètres configurables ;
- porter les règles de sélection du template applicable ;
- exposer une lecture gouvernée des templates actifs, publiés, archivés ou filtrés ;
- publier les événements significatifs liés à la vie d’un template ;
- protéger le système contre les gabarits implicites, opaques ou contradictoires.

Selon le périmètre exact du projet, le domaine peut également être responsable de :

- templates email transactionnels ;
- templates newsletter ;
- templates de publication sociale ;
- templates marketing ;
- variantes multi-langues ;
- variantes par boutique ou branding ;
- politiques locales d’activation ou de publication ;
- règles de fallback entre variantes.

---

## Non-responsabilités

Le domaine `template-system` n’est pas responsable de :

- porter les contenus éditoriaux source ;
- porter les notifications transactionnelles ;
- porter les campagnes newsletter ;
- porter les publications sociales ;
- porter les campagnes marketing ;
- exécuter les intégrations provider-specific ;
- devenir un CMS générique ou un moteur de rendu total absorbant la logique UI et métier.

Le domaine `template-system` ne doit pas devenir :

- un doublon de `notifications` ;
- un doublon de `newsletter` ;
- un doublon de `social` ;
- un doublon de `marketing` ;
- un conteneur flou de HTML ou de fragments non gouvernés.

---

## Invariants

Les invariants minimaux sont les suivants :

- un template possède un identifiant stable et un statut explicite ;
- une variante de template est rattachée à une définition explicite ;
- un slot ou paramètre est rattaché à un template explicite ;
- `template-system` ne se confond pas avec `notifications` ;
- `template-system` ne se confond pas avec `newsletter` ;
- `template-system` ne se confond pas avec `social` ;
- `template-system` ne se confond pas avec `marketing` ;
- les autres domaines ne doivent pas recréer librement leur propre vérité divergente de gabarit réutilisable quand le cadre commun `template-system` existe ;
- un template non actif ou non publié ne doit pas être sélectionné hors règle explicite.

Le domaine protège la cohérence des gabarits réutilisables, pas le contenu final injecté.

---

## Dépendances

### Dépendances métier

Le domaine `template-system` interagit fortement avec :

- `notifications`
- `newsletter`
- `social`
- `marketing`
- `events`
- `pages`
- `documents`
- `stores`

### Dépendances transverses

Le domaine dépend également de :

- `approval`, si certaines publications de templates nécessitent validation préalable
- `workflow`, si le cycle de vie d’un template suit un processus structuré
- `audit`
- `observability`

### Dépendances externes

Le domaine peut être relié indirectement à :

- moteurs de rendu ;
- systèmes de messaging ;
- outils de composition externe ;
- autres systèmes via `integrations`.

### Règle de frontière

Le domaine `template-system` porte les gabarits réutilisables.
Il ne doit pas absorber :

- les contenus source ;
- les notifications ;
- la newsletter ;
- le social ;
- le marketing ;
- ni les DTO providers externes.

---

## Événements significatifs

Le domaine `template-system` publie ou peut publier des événements significatifs tels que :

- template créé ;
- template mis à jour ;
- template publié ;
- template archivé ;
- variante de template mise à jour ;
- règle de sélection de template modifiée ;
- statut de template modifié.

Le domaine peut consommer des signaux liés à :

- capability boutique modifiée ;
- approbation accordée ;
- workflow terminé ;
- action administrative structurée de publication, activation ou archivage ;
- changement de contexte de branding ou de langue.

Les noms exacts doivent rester dans le langage interne du système.

---

## Cycle de vie

Le domaine `template-system` possède un cycle de vie explicite.

Le cycle exact dépend du projet, mais il doit au minimum distinguer :

- brouillon ;
- actif ;
- publié ;
- archivé.

Des états supplémentaires peuvent exister :

- en revue ;
- désactivé ;
- expiré ;
- restreint.

Le domaine doit éviter :

- les templates “fantômes” ;
- les changements silencieux de sélection ;
- les états purement techniques non interprétables métier.

---

## Interfaces et échanges

Le domaine `template-system` expose principalement :

- des templates structurés ;
- des variantes de template ;
- des sélections de template applicables à un contexte donné ;
- des lectures exploitables par `notifications`, `newsletter`, `social`, `marketing`, `events`, `pages`, `documents` et certaines couches d’administration ;
- des structures de gabarit prêtes à être alimentées par les domaines consommateurs autorisés.

Le domaine reçoit principalement :

- des créations ou mises à jour de templates ;
- des demandes de lecture d’un template applicable dans un contexte donné ;
- des changements de variantes, de slots ou de paramètres ;
- des contextes de canal, langue, boutique, acteur ou domaine consommateur ;
- des demandes de publication, activation, désactivation ou archivage d’un template.

Le domaine ne doit pas exposer un contrat canonique dicté par un provider externe.

---

## Contraintes d’intégration

Le domaine `template-system` peut être exposé à des contraintes telles que :

- multi-langues ;
- multi-boutiques ;
- branding local ;
- variantes par canal ;
- fallback de sélection ;
- publication différée ;
- dépendance à des contextes métier externes ;
- rétrocompatibilité des définitions ou variantes.

Règles minimales :

- la hiérarchie d’autorité doit être explicite ;
- la vérité interne des templates reste dans `template-system` ;
- les DTO providers restent dans `integrations` ;
- les traitements rejouables doivent être idempotents ou neutralisés ;
- un template incohérent ne doit pas être promu silencieusement ;
- les conflits entre statut, variante, contexte et sélection doivent être explicables.

---

## Données sensibles / sécurité

Le domaine `template-system` peut manipuler des modèles de messages ou de contenus sensibles pour l’image, la conformité ou la cohérence de la boutique.

Points de vigilance :

- contrôle strict des droits de lecture et d’écriture ;
- séparation claire entre template, contenu injecté et diffusion effective ;
- protection des variantes sensibles ou non publiées ;
- limitation de l’exposition selon le rôle, le scope et le statut du template ;
- audit des changements significatifs de structure, de publication ou de sélection.

---

## Observabilité et audit

Le domaine `template-system` doit rendre visibles au minimum :

- quel template a été sélectionné ;
- à partir de quel contexte de canal, langue ou usage ;
- quelles variantes ou slots ont été retenus ;
- pourquoi un template a été publié, filtré, archivé ou ignoré ;
- si une absence de sélection vient d’une capability inactive, d’un statut non publié, d’un contexte non compatible ou d’une règle applicable.

L’audit doit permettre de répondre à des questions comme :

- quel template a été créé, modifié, publié ou archivé ;
- quand ;
- selon quelle origine ;
- avec quelle variante ou règle de sélection affectée ;
- avec quelle action humaine significative ;
- avec quel impact sur les domaines consommateurs.

L’observabilité doit distinguer :

- erreur de modèle ;
- erreur technique ;
- template introuvable ;
- variante incompatible ;
- sélection impossible ;
- statut incohérent ;
- évolution non autorisée.

---

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `TemplateDefinition` : définition structurée d’un template ;
- `TemplateVariant` : variante applicable selon un contexte donné ;
- `TemplateSlot` : zone ou paramètre configurable du template ;
- `TemplateSelection` : résultat de sélection du template applicable ;
- `TemplatePolicy` : règle d’activation, de publication ou d’exposition ;
- `TemplateUsageRef` : référence vers le domaine ou l’usage consommateur.

---

## Impact de maintenance / exploitation

Le domaine `template-system` a un impact d’exploitation moyen à élevé.

Raisons :

- il est partagé par plusieurs domaines ;
- ses erreurs dégradent cohérence, branding et qualité de rendu final ;
- il se situe à la frontière entre contenu, diffusion et contexte métier ;
- il nécessite une forte explicabilité des sélections ;
- il peut dépendre de variantes multiples et de règles locales.

En exploitation, une attention particulière doit être portée à :

- la cohérence des statuts ;
- la validité des variantes ;
- la traçabilité des changements ;
- la cohérence avec les domaines consommateurs ;
- les effets de bord sur notifications, newsletter, social et documents ;
- les règles de fallback et de sélection.

Le domaine doit être considéré comme structurant dès qu’une réutilisation réelle de gabarits existe.

---

## Limites du domaine

Le domaine `template-system` s’arrête :

- avant les contenus source ;
- avant les notifications ;
- avant la newsletter ;
- avant le social ;
- avant le marketing ;
- avant les intégrations externes ;
- avant les DTO providers externes.

Le domaine `template-system` porte les gabarits réutilisables du système.
Il ne doit pas devenir un CMS générique, un moteur de rendu total ni un doublon des domaines consommateurs.

---

## Questions ouvertes

À confirmer explicitement dans le projet :

- la frontière exacte entre `template-system` et `notifications` ;
- la frontière exacte entre `template-system` et `newsletter` ;
- la frontière exacte entre `template-system` et `pages` ;
- la part exacte des variantes multi-langues et multi-boutiques ;
- la gouvernance des fallback de sélection ;
- la hiérarchie entre vérité interne et moteurs externes de rendu éventuels.

Si ces points sont déjà tranchés ailleurs, ils doivent être réinjectés ici et sortir de cette section.

---

## Documents liés

- `../../architecture/10-fondations/11-modele-de-classification.md`
- `../../architecture/10-fondations/12-frontieres-et-responsabilites.md`
- `notifications.md`
- `newsletter.md`
- `social.md`
- `marketing.md`
- `events.md`
- `../optional/pages.md`
- `../satellites/documents.md`
- `../core/foundation/stores.md`
- `approval.md`
- `workflow.md`
- `audit.md`
- `observability.md`
- `../optional/platform/integrations.md`
