# Cadrage — `engagement.newsletter` niveau `segmentation`

**Date :** 2026-06-15
**Statut :** cadrage court + lot borné exécuté (2026-06-15)

## Objectif

Définir la prochaine marche réelle de `engagement.newsletter` après le niveau
`basic` déjà ouvert.

Le niveau `segmentation` doit produire une capacité utile sur le référentiel des
abonnés, sans dériver vers l'exécution de campagnes, ni dépendre de domaines
de segmentation encore non branchés.

## État réel du repo

### Ce qui existe déjà

- `engagement.newsletter` est seedé avec niveaux
  `basic` / `segmentation` / `automation`.
- `/admin/marketing/newsletter` expose aujourd'hui :
  - ajout manuel d'abonné ;
  - lecture des abonnés non archivés ;
  - bascule `SUBSCRIBED` / `UNSUBSCRIBED`.
- `app/api/newsletter/route.ts` et
  `features/storefront/newsletter/services/subscribe-storefront-newsletter.service.ts`
  branchent désormais la souscription storefront sur `NewsletterSubscriber`.
- Le modèle Prisma newsletter existe déjà :
  - `NewsletterSubscriber`
  - `NewsletterCampaign`
  - `NewsletterCampaignRecipient`

### Ce qui n'existe pas encore

- aucun filtre admin sur les abonnés ;
- aucun segment sauvegardé ;
- aucune lecture croisée avec `BehaviorProfile`, `BehaviorSegment`, `CrmContact`
  ou `CrmTag` ;
- aucune campagne ;
- aucune prévisualisation de destinataires ;
- aucune synchronisation externe d'emailing.

### Point critique de vérité

Le repo contient bien des modèles `Behavior*` et `Crm*`, mais **aucune logique
newsletter ne les consomme aujourd'hui**.

Donc ouvrir `segmentation` sur ces domaines reviendrait à promettre une
capacité sans source de vérité réellement alimentée.

## Recommandation

Premier lot `segmentation` recommandé :

- **segmentation opératoire locale du référentiel d'abonnés** ;
- filtres et regroupements sur critères déjà réels dans `NewsletterSubscriber` ;
- aucun envoi de campagne ;
- aucun branchement sur `Behavior*` / `Crm*` ;
- aucune automation.

En pratique, cela veut dire :

- filtrer par `status` ;
- filtrer par `source` ;
- filtrer par période de souscription si le champ est disponible ;
- distinguer les abonnés liés ou non à un `customerId` si cette donnée est
  remontée ;
- afficher des compteurs par segment visible ;
- éventuellement permettre des segments prédéfinis purement dérivés de ces
  critères.

## Pourquoi ce cadrage

- la doctrine du domaine `newsletter` autorise une **segmentation minimale liée
  à l'abonnement** ;
- les données réellement fiables sont aujourd'hui dans `NewsletterSubscriber` ;
- cela ouvre un niveau `segmentation` qui a un effet métier/admin visible ;
- cela évite d'inventer une segmentation comportementale sans pipeline
  `analytics` / `behavior` réellement branché.

## Portée recommandée du niveau `segmentation`

### Capacité à ouvrir

- page `/admin/marketing/newsletter` enrichie par filtres locaux ou query params
  lisibles ;
- segments dérivés du référentiel réel :
  - abonnés actifs ;
  - désabonnés ;
  - rejetés ;
  - source `admin` vs `storefront` ;
  - abonnés avec rattachement client ;
  - souscriptions récentes.

### Effet attendu

- un opérateur peut isoler rapidement une population d'abonnés réelle ;
- la segmentation reste explicable ;
- le niveau `segmentation` a un effet concret sans encore créer de campagne.

## Ce qu'il ne faut pas ouvrir dans ce lot

- segmentation par comportement d'achat ;
- segmentation par tags CRM ;
- scoring ou segments calculés via `BehaviorProfileSegment` ;
- création de `NewsletterCampaign` ;
- envoi email ;
- import/export massif ;
- segments persistés complexes avec DSL/règles dynamiques.

## Points d'intégration recommandés

### Query

Faire évoluer la lecture admin des abonnés au lieu de créer un sous-système
parallèle :

- enrichir `listAdminNewsletterSubscribers` avec paramètres de filtres ;
- remonter les champs utiles encore absents :
  - `subscribedAt`
  - `unsubscribedAt`
  - `customerId`
  - `source`
- calculer éventuellement un résumé de compteurs par segment visible.

### UI

Rester sur `/admin/marketing/newsletter` :

- barre de filtres locale ;
- badges/compteurs ;
- état vide explicite selon filtre ;
- aucun écran de campagne séparé dans ce lot.

### Routing

Recommandation :

- privilégier des filtres lisibles en query params, pas un state client opaque ;
- rester cohérent avec les patterns déjà utilisés dans `automations`.

## Invariants

- la segmentation ne modifie pas l'état d'abonnement ;
- un segment visible doit être explicable à partir de données réelles ;
- aucun domaine non branché (`behavior`, `crm`) ne devient dépendance cachée ;
- aucune campagne ne peut être envoyée depuis ce niveau ;
- les abonnés archivés restent exclus par défaut sauf besoin explicitement
  cadré.

## Risques

- glissement implicite vers un mini-CRM ;
- confusion produit entre `segmentation` et `campagne` ;
- tentation d'utiliser `BehaviorSegment` alors qu'aucun pipeline ne l'alimente ;
- complexification inutile si on cherche des segments sauvegardés trop tôt.

## Vérifications attendues

- typecheck ;
- vérification manuelle des filtres sur `/admin/marketing/newsletter` ;
- vérification qu'un filtre n'altère aucune mutation de statut ;
- vérification que les compteurs correspondent bien à la liste visible ;
- vérification qu'aucune capacité campagne/email n'apparaît à ce niveau.

## Ordre recommandé de mise en oeuvre

1. enrichir la query admin newsletter avec critères réels ;
2. ajouter filtres lisibles sur la page ;
3. ajouter compteurs/résumés de segments visibles ;
4. documenter explicitement que `Behavior*` / `Crm*` restent hors lot ;
5. mettre à jour roadmap et doc domaine.

## Critère de fin

`engagement.newsletter` atteint un vrai niveau `segmentation` quand
`/admin/marketing/newsletter` permet de segmenter opérationnellement le
référentiel réel des abonnés à partir de données déjà fiables, sans encore
ouvrir la campagne, l'automation ni la segmentation comportementale.

## Bilan d'exécution (2026-06-15)

- `listAdminNewsletterSubscribers` accepte désormais des filtres bornés
  (`status`, `source`, `customerLink`, `recency`) et remonte les compteurs
  utiles au cockpit.
- `/admin/marketing/newsletter` ouvre un panneau de segmentation uniquement si
  `meetsFeatureLevel("engagement.newsletter", "segmentation")` est atteint ;
  sinon le module reste lisible au niveau `basic`, sans filtres opératoires.
- La liste admin expose aussi l'origine (`source`), le rattachement client et
  les dates utiles (`subscribedAt`, `unsubscribedAt`) sans changer les
  mutations existantes.
- Aucun envoi email, aucune campagne, aucun branchement `Behavior*` / `Crm*`
  n'ont été ajoutés dans ce lot.
