# Social

## Rôle

Le domaine `social` porte la diffusion sociale du système.

Il définit :

- ce qu’est une publication sociale du point de vue du système ;
- comment une publication est créée, planifiée, publiée, annulée, échouée ou archivée au niveau métier ;
- comment ce domaine se distingue des campagnes marketing globales, de la newsletter, des notifications transactionnelles, des événements publics et des providers externes ;
- comment le système reste maître de sa vérité interne sur les publications sociales.

Le domaine existe pour fournir une représentation explicite de la diffusion sociale, distincte :

- des campagnes marketing portées par `marketing` ;
- de la newsletter portée par `newsletter` ;
- des notifications transactionnelles portées par `notifications` ;
- des événements publics portés par `events` ;
- du scheduling transverse porté par `scheduling` ;
- des DTO providers externes portés par `integrations`.

---

## Classification

### Catégorie documentaire

`cross-cutting`

### Criticité architecturale

`transverse structurant`

### Activable

`oui`

Le domaine `social` est activable.
Lorsqu’il est activé, il devient structurant pour les publications sociales gouvernées, leur planification métier et leur articulation avec les objets source internes.

---

## Source de vérité

Le domaine `social` est la source de vérité pour :

- la définition interne d’une publication sociale ;
- son statut métier ;
- sa planification métier lorsqu’elle est portée ici ;
- son rattachement à un objet source interne lorsqu’il existe ;
- ses cibles sociales logiques portées par le système ;
- ses lectures structurées consommables par les domaines autorisés.

Le domaine `social` n’est pas la source de vérité pour :

- les campagnes marketing globales, qui relèvent de `marketing` ;
- la newsletter, qui relève de `newsletter` ;
- les notifications transactionnelles, qui relèvent de `notifications` ;
- les événements publics eux-mêmes, qui relèvent de `events` ;
- le scheduling transverse, qui relève de `scheduling` ;
- les providers sociaux externes, qui relèvent de `integrations` ;
- les DTO providers externes.

Une publication sociale est un objet de diffusion métier gouverné.
Elle ne doit pas être confondue avec :

- une campagne marketing complète ;
- une newsletter ;
- une notification ;
- un événement public ;
- un cron technique ;
- un post provider externe non remappé.

---

## Responsabilités

Le domaine `social` est responsable de :

- définir ce qu’est une publication sociale dans le système ;
- porter les publications sociales structurées ;
- porter leurs statuts métier ;
- porter leur planification métier si elle relève du périmètre social ;
- porter les contenus sociaux dérivés d’objets métier internes lorsqu’ils sont gouvernés ici ;
- exposer une lecture gouvernée des publications sociales émises, planifiées, publiées, échouées ou annulées ;
- publier les événements significatifs liés à la vie d’une publication sociale ;
- protéger le système contre les publications implicites, opaques ou contradictoires.

Selon le périmètre exact du projet, le domaine peut également être responsable de :

- publications produit ;
- publications blog ;
- publications événementielles ;
- auto-posting gouverné ;
- règles locales par boutique ;
- fenêtres de planification ;
- cibles sociales logiques ;
- politiques d’activation ou de publication.

---

## Non-responsabilités

Le domaine `social` n’est pas responsable de :

- porter les campagnes marketing globales ;
- porter la newsletter ;
- porter les notifications transactionnelles ;
- porter les événements publics eux-mêmes ;
- porter le scheduling transverse du système ;
- exécuter directement les providers sociaux externes ;
- devenir un fourre-tout regroupant toute communication sortante ou tout contenu promotionnel.

Le domaine `social` ne doit pas devenir :

- un doublon de `marketing` ;
- un doublon de `newsletter` ;
- un doublon de `events` ;
- un doublon de `integrations` ;
- un conteneur flou de contenus promotionnels sans gouvernance métier.

---

## Invariants

Les invariants minimaux sont les suivants :

- une publication sociale possède un identifiant stable et un état explicite ;
- une publication sociale est rattachée explicitement à une source métier lorsqu’elle dérive d’un objet interne ;
- `social` ne se confond pas avec `marketing`, `newsletter`, `events` ou `integrations` ;
- l’exécution provider externe reste distincte de la vérité interne de publication sociale ;
- les autres domaines ne doivent pas recréer leur propre vérité divergente de la diffusion sociale structurée quand le cadre commun `social` existe ;
- une publication non autorisée, inactive ou incohérente ne doit pas être diffusée hors règle explicite ;
- une publication automatique sensible doit rester traçable.

Le domaine protège la cohérence de la diffusion sociale métier, pas l’exécution technique externe.

---

## Dépendances

### Dépendances métier

Le domaine `social` interagit fortement avec :

- `marketing`
- `products`
- `blog`
- `events`
- `stores`
- `template-system`

### Dépendances transverses

Le domaine dépend également de :

- `analytics`
- `dashboarding`
- `newsletter`
- `audit`
- `observability`
- `jobs`, si certaines publications sont exécutées de manière différée

### Dépendances externes

Le domaine peut être relié indirectement à :

- réseaux sociaux ;
- plateformes de publication sociale ;
- outils social media ;
- autres systèmes via `integrations`.

### Règle de frontière

Le domaine `social` porte la diffusion sociale métier.
Il ne doit pas absorber :

- les campagnes marketing globales ;
- la newsletter ;
- les notifications ;
- les événements eux-mêmes ;
- le scheduling transverse ;
- ni les DTO providers externes.

---

## Événements significatifs

Le domaine `social` publie ou peut publier des événements significatifs tels que :

- publication sociale créée ;
- publication sociale planifiée ;
- publication sociale publiée ;
- publication sociale échouée ;
- publication sociale annulée ;
- statut de publication sociale modifié ;
- source sociale rattachée.

Le domaine peut consommer des signaux liés à :

- produit publié ;
- article de blog publié ;
- événement publié ;
- campagne marketing activée ;
- capability boutique modifiée ;
- auto-post demandé, si ce signal est modélisé ;
- action administrative structurée.

Les noms exacts doivent rester dans le langage interne du système.

---

## Cycle de vie

Le domaine `social` possède un cycle de vie explicite.

Le cycle exact dépend du projet, mais il doit au minimum distinguer :

- brouillon ;
- planifié ;
- publié ;
- échoué ;
- annulé.

Des états supplémentaires peuvent exister :

- en attente ;
- archivé ;
- suspendu ;
- expiré ;
- restreint.

Le domaine doit éviter :

- les publications “fantômes” ;
- les changements silencieux de statut ;
- les états purement techniques non interprétables métier.

---

## Interfaces et échanges

Le domaine `social` expose principalement :

- des publications sociales structurées ;
- des statuts de publication sociale ;
- des liaisons explicites vers les objets source ;
- une lecture exploitable par l’admin, `marketing`, `newsletter`, `events`, `analytics`, `dashboarding` et d’autres domaines consommateurs ;
- des messages préparés pour exécution aval par `integrations` ou `jobs`.

Le domaine reçoit principalement :

- des demandes explicites de création de publication sociale ;
- des objets source issus de `marketing`, `products`, `blog` ou `events` ;
- des demandes de planification ou d’annulation de publication ;
- des demandes de lecture des publications et de leur état ;
- un contexte boutique, temporel et de capability utile à la diffusion sociale.

Le domaine ne doit pas exposer un contrat canonique dicté par un provider externe.

---

## Contraintes d’intégration

Le domaine `social` peut être exposé à des contraintes telles que :

- multi-boutiques ;
- planification différée ;
- auto-posting gouverné ;
- variantes de contenu selon canal ;
- dépendance à des capabilities activables ;
- exécution via jobs ;
- projection vers providers externes ;
- rétrocompatibilité des statuts ou cibles sociales.

Règles minimales :

- la hiérarchie d’autorité doit être explicite ;
- la vérité interne des publications sociales reste dans `social` ;
- les DTO providers restent dans `integrations` ;
- les traitements rejouables doivent être idempotents ou neutralisés ;
- une publication incohérente ne doit pas être promue silencieusement ;
- les conflits entre source, statut, planification, capability et cible doivent être explicables.

---

## Données sensibles / sécurité

Le domaine `social` manipule des contenus de diffusion publique potentiellement sensibles pour l’image de la boutique.

Points de vigilance :

- contrôle strict des droits de lecture et d’écriture ;
- validation des contenus, états et planifications ;
- séparation claire entre publication sociale métier et exécution provider externe ;
- audit des publications sensibles ou automatiques ;
- protection contre les déclenchements non autorisés.

---

## Observabilité et audit

Le domaine `social` doit rendre visibles au minimum :

- pourquoi une publication sociale a été créée, planifiée ou non ;
- quel objet source a alimenté la publication ;
- pourquoi une publication a été publiée, annulée, ignorée ou a échoué ;
- si une absence de publication vient d’une capability inactive, d’une règle métier, d’un workflow incomplet ou d’un problème d’intégration aval ;
- quels changements significatifs ont affecté une publication ou une planification.

L’audit doit permettre de répondre à des questions comme :

- quelle publication sociale a été créée, modifiée, planifiée, publiée ou annulée ;
- quand ;
- selon quelle origine ;
- avec quelle source métier ;
- avec quelle intervention manuelle significative ;
- avec quel changement de statut ou de planification.

L’observabilité doit distinguer :

- erreur de modèle ;
- erreur technique ;
- source métier introuvable ;
- capability inactive ;
- publication non prête ;
- action non autorisée ;
- échec provider externe.

---

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `SocialPublication` : publication sociale structurée ;
- `SocialPublicationStatus` : état métier de la publication sociale ;
- `SocialSourceRef` : référence vers l’objet métier source ;
- `SocialPublicationSchedule` : planification métier de publication ;
- `SocialChannelTarget` : cible sociale logique au niveau métier ;
- `SocialPolicy` : règle d’activation, de diffusion ou de planification.

---

## Impact de maintenance / exploitation

Le domaine `social` a un impact d’exploitation moyen à élevé lorsqu’il est activé.

Raisons :

- il touche directement la diffusion publique et l’image de la boutique ;
- ses erreurs dégradent visibilité, cohérence et fiabilité des publications ;
- il se situe à la frontière entre contenu, marketing et exécution externe ;
- il nécessite une forte explicabilité des déclenchements et statuts ;
- il peut dépendre de plusieurs domaines source et capabilities.

En exploitation, une attention particulière doit être portée à :

- la cohérence des statuts ;
- la qualité des sources ;
- la traçabilité des changements ;
- la cohérence avec marketing, événements et blog ;
- les effets de bord sur analytics, dashboarding et communication aval ;
- les publications automatiques sensibles.

Le domaine doit être considéré comme structurant dès qu’une diffusion sociale gouvernée réelle existe.

---

## Limites du domaine

Le domaine `social` s’arrête :

- avant les campagnes marketing globales ;
- avant la newsletter ;
- avant les notifications transactionnelles ;
- avant les événements publics eux-mêmes ;
- avant le scheduling transverse ;
- avant les providers externes ;
- avant les DTO providers externes.

Le domaine `social` porte la diffusion sociale du système.
Il ne doit pas devenir un moteur global de communication sortante, un simple wrapper provider ou un doublon des domaines source.

---

## Questions ouvertes

À confirmer explicitement dans le projet :

- la frontière exacte entre `social` et `marketing` ;
- la frontière exacte entre `social` et `events` ;
- la part exacte de l’auto-posting réellement supportée ;
- la gouvernance des planifications et annulations ;
- la hiérarchie entre vérité interne et plateformes sociales externes éventuelles ;
- la place exacte des templates sociaux dans le modèle courant.

Si ces points sont déjà tranchés ailleurs, ils doivent être réinjectés ici et sortir de cette section.

---

## Documents liés

- `../../architecture/10-fondations/11-modele-de-classification.md`
- `../../architecture/10-fondations/12-frontieres-et-responsabilites.md`
- `marketing.md`
- `newsletter.md`
- `notifications.md`
- `events.md`
- `scheduling.md`
- `template-system.md`
- `analytics.md`
- `dashboarding.md`
- `audit.md`
- `observability.md`
- `../core/stores.md`
- `../core/products.md`
- `../optional/blog.md`
- `../core/integrations.md`
