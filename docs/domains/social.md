# Domaine social

## Rôle

Le domaine `social` porte la diffusion sociale du socle.

Il structure les publications, diffusions et actions sociales dérivées des contenus ou objets métier de la boutique, sans absorber les campagnes marketing globales, la newsletter, les notifications transactionnelles, le domaine `events` ou les intégrations providers externes.

## Responsabilités

Le domaine `social` prend en charge :

- les publications sociales
- les statuts métier de publication sociale
- les contenus sociaux dérivés d’objets métier internes
- la planification métier d’une publication sociale si elle relève du périmètre social
- la lecture des publications sociales émises, planifiées, publiées, échouées ou annulées au niveau métier
- la base sociale exploitable par l’admin, `marketing`, `events`, `newsletter`, `analytics`, `dashboarding` et d’autres domaines consommateurs

## Ce que le domaine ne doit pas faire

Le domaine `social` ne doit pas :

- porter les campagnes marketing globales, qui relèvent de `marketing`
- porter la newsletter, qui relève de `newsletter`
- porter les notifications transactionnelles, qui relèvent de `notifications`
- porter les événements publics eux-mêmes, qui relèvent de `events`
- porter le scheduling transverse du socle, qui relève de `scheduling`
- porter directement les providers sociaux externes, ce qui relève de `integrations`
- devenir un fourre-tout regroupant toute communication sortante ou tout contenu promotionnel

Le domaine `social` porte la diffusion sociale métier du socle. Il ne remplace ni `marketing`, ni `newsletter`, ni `events`, ni `integrations`.

## Sous-domaines

- `publications` : publications sociales structurées
- `planning` : planification métier des publications sociales
- `sources` : rattachement des publications à des objets métier source

## Entrées

Le domaine reçoit principalement :

- des demandes explicites de création de publication sociale
- des objets source issus de `marketing`, `products`, `blog` ou `events`
- des demandes de planification ou d’annulation de publication
- des demandes de lecture des publications et de leur état
- un contexte boutique, temporel et de capability utile à la diffusion sociale

## Sorties

Le domaine expose principalement :

- des publications sociales structurées
- des statuts de publication sociale
- des liaisons explicites vers les objets source
- une lecture exploitable par l’admin, `marketing`, `newsletter`, `events`, `analytics`, `dashboarding` et d’autres domaines consommateurs
- des messages préparés pour exécution aval par `integrations` ou `jobs`

## Dépendances vers autres domaines

Le domaine `social` peut dépendre de :

- `marketing` pour certaines campagnes ou opérations amont à diffuser socialement
- `products` pour certaines nouveautés ou mises en avant produit
- `blog` pour certaines publications éditoriales
- `events` pour certaines annonces événementielles
- `store` pour le contexte boutique et les capabilities actives
- `template-system` pour certains gabarits réutilisables si le modèle final l’exige
- `audit` pour tracer les changements sensibles
- `observability` pour expliquer pourquoi une publication sociale a été créée, planifiée, publiée, annulée ou ignorée

Les domaines suivants peuvent dépendre de `social` :

- `analytics`
- `dashboarding`
- `marketing`
- `events`
- `newsletter`

## Capabilities activables liées

Le domaine `social` est directement lié à :

- `socialPublishing`
- `automaticSocialPosting`
- `marketingCampaigns`
- `publicEvents`

### Effet si `socialPublishing` est activée

Le domaine devient pleinement exploitable pour gérer des publications sociales structurées.

### Effet si `socialPublishing` est désactivée

Le domaine reste structurellement présent, mais aucune publication sociale ne doit être pilotée côté boutique.

### Effet si `automaticSocialPosting` est activée

Le domaine peut consommer certains objets source ou domain events pour déclencher automatiquement des publications sociales, en restant distinct des providers externes.

### Effet si `marketingCampaigns` ou `publicEvents` est activée

Le domaine peut consommer des objets marketing ou événementiels utiles à la construction de publications sociales.

## Rôles/permissions concernés

### Rôles

Les rôles principalement concernés sont :

- `platform_owner`
- `platform_engineer`
- `store_owner`
- `store_manager`
- `marketing_manager`
- `content_editor` en lecture ou contribution partielle selon la politique retenue

### Permissions

Exemples de permissions concernées :

- `social.read`
- `social.write`
- `marketing.read`
- `events.read`
- `blog.read`
- `catalog.read`
- `audit.read`

## Événements émis

Le domaine peut émettre des domain events internes du type :

- `social.publication.created`
- `social.publication.scheduled`
- `social.publication.published`
- `social.publication.failed`
- `social.publication.cancelled`

## Événements consommés

Le domaine peut consommer certains événements internes du type :

- `product.published`
- `blog.post.published`
- `event.published`
- `marketing.campaign.activated`
- `store.capabilities.updated`
- `social.auto_post.requested` si ce signal est modélisé comme un déclencheur intermédiaire

Il doit toutefois rester maître de sa propre vérité de publication sociale.

## Intégrations externes

Le domaine `social` ne doit pas parler directement aux providers sociaux externes.

Les interactions avec :

- réseaux sociaux
- plateformes de publication sociale
- outils social media externes

relèvent de :

- `integrations`
- éventuellement `jobs`

Le domaine `social` reste la source de vérité interne des publications sociales du socle au niveau métier.

## Données sensibles / sécurité

Le domaine `social` manipule des contenus de diffusion publique potentiellement sensibles pour l’image de la boutique.

Points de vigilance :

- contrôle strict des droits de lecture et d’écriture
- validation des contenus, états et planifications
- séparation claire entre publication sociale métier et exécution provider externe
- audit des publications sensibles ou automatiques
- protection contre les déclenchements non autorisés

## Observability / audit

### Observability

Il faut pouvoir comprendre :

- pourquoi une publication sociale a été créée, planifiée ou non
- quel objet source a alimenté la publication
- pourquoi une publication a été publiée, annulée, ignorée ou a échoué
- si une absence de publication vient d’une capability off, d’une règle métier, d’un workflow incomplet ou d’un problème d’intégration aval

### Audit

Il faut tracer :

- la création d’une publication sociale
- la modification significative d’une publication sociale
- la planification ou l’annulation d’une publication
- les publications automatiques sensibles
- les interventions manuelles importantes

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `SocialPublication` : publication sociale structurée
- `SocialPublicationStatus` : état métier de la publication sociale
- `SocialSourceRef` : référence vers l’objet métier source
- `SocialPublicationSchedule` : planification métier de publication
- `SocialChannelTarget` : cible sociale logique au niveau métier

## Invariants métier

Les règles suivantes doivent toujours rester vraies :

- une publication sociale possède un identifiant stable et un état explicite
- une publication sociale est rattachée explicitement à une source métier lorsqu’elle dérive d’un objet interne
- `social` ne se confond pas avec `marketing`, `newsletter`, `events` ou `integrations`
- l’exécution provider externe reste distincte de la vérité interne de publication sociale
- les autres domaines ne doivent pas recréer leur propre vérité divergente de la diffusion sociale structurée

## Cas d’usage principaux

1. Créer une publication sociale à partir d’un produit, d’un article ou d’un événement
2. Planifier une publication sociale
3. Annuler une publication sociale planifiée
4. Publier automatiquement une nouveauté si la capability correspondante est active
5. Lire les publications sociales et leur état
6. Exposer à l’admin une lecture claire des contenus sociaux diffusés, planifiés ou échoués

## Cas limites / erreurs métier

Quelques cas d’erreur typiques :

- publication sociale introuvable
- source métier introuvable ou invalide
- capability socialPublishing désactivée
- capability automaticSocialPosting désactivée pour un auto-post demandé
- publication non prête ou incohérente
- tentative d’action non autorisée
- échec aval d’intégration provider

## Décisions d’architecture

Les choix structurants du domaine sont :

- `social` porte les publications sociales structurées du socle
- `social` est distinct de `marketing`
- `social` est distinct de `newsletter`
- `social` est distinct de `events`
- `social` est distinct de `integrations`
- les providers externes sont appelés via `integrations`, puis les états utiles sont remappés dans le langage interne du domaine
- les publications sociales sensibles ou automatiques doivent être auditables et observables

## Questions explicitement closes

Les points suivants sont considérés comme décidés :

- la diffusion sociale relève de `social`
- les campagnes marketing globales relèvent de `marketing`
- la diffusion newsletter relève de `newsletter`
- les événements publics relèvent de `events`
- `social` ne remplace ni `marketing`, ni `newsletter`, ni `events`, ni `integrations`
