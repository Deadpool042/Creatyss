# V14-2 — Storefront text/meta cleanup

## Objectif du lot

Le lot V14-2 prend le relais après V14-1.

Si V14-1 traite spécifiquement `.meta-label`, V14-2 a pour rôle de poursuivre la réduction du CSS custom sur les patterns de texte et de métadonnées encore globaux côté storefront.

L’objectif n’est pas de rouvrir une refonte d’écran, mais de traiter une famille cohérente de classes encore simples à comprendre et potentiellement remplaçables proprement par du Tailwind local explicite.

## Intention

V14-2 vise les styles typographiques partagés qui restent actifs sur les cartes, variantes et zones de contenu storefront.

Le but est de vérifier si ces classes globales apportent encore une vraie valeur de centralisation, ou si elles peuvent désormais être remplacées localement sans perte de lisibilité ni explosion du markup.

## Résultat attendu

À l’issue de V14-2, le projet doit idéalement :

- réduire les classes globales de texte et de métadonnées encore présentes côté storefront
- conserver une cohérence visuelle entre cartes, variantes et blocs de contenu
- garder un markup lisible
- supprimer uniquement les règles CSS devenues réellement mortes
- ne provoquer aucun changement métier ni aucune régression structurelle

## Ce que couvre ce lot

V14-2 couvre :

- l’audit des classes de texte et de métadonnées encore globales côté storefront
- leur qualification par famille
- leur remplacement local si le ratio gain / risque est bon
- l’harmonisation minimale nécessaire entre les contextes concernés
- le cleanup CSS uniquement si une règle devient réellement morte

## Ce que ce lot ne couvre pas

V14-2 ne couvre pas :

- les classes de layout structurel dense
- la refonte des structures `.product-*`, `.variant-*`, `.cart-*`, `.checkout-*`
- une nouvelle abstraction de composant
- des changements métier ou serveur
- une passe opportuniste sur d’autres familles non liées

## Cibles probables

Les familles les plus probables dans ce lot sont :

- `.card-kicker`
- `.card-meta`
- `.card-copy`
- `.variant-meta`

Cette liste doit être confirmée par l’état réel du repo.

## Nature des patterns ciblés

Ces classes relèvent d’une zone intermédiaire :

- plus simples que des classes de layout
- plus diffuses qu’un pattern isolé comme `.meta-label`
- encore suffisamment homogènes pour être auditées par famille

Elles sont donc de bons candidats à une réduction progressive, à condition de ne pas introduire de variations visuelles arbitraires.

## Questions auxquelles le lot doit répondre

### 1. Les usages sont-ils homogènes ?

Si une même classe produit réellement le même effet dans plusieurs contextes, son remplacement local peut être cohérent.

### 2. La classe porte-t-elle encore une vraie mutualisation utile ?

Si une classe reste très utile comme convention partagée, il peut être raisonnable de la conserver.

### 3. Le remplacement local reste-t-il lisible ?

Si le markup devient trop verbeux ou trop hétérogène, le cleanup n’est pas forcément un gain.

### 4. La règle CSS devient-elle totalement morte ?

Une suppression CSS ne doit être faite que si tous les usages réels ont disparu.

## Principes de décision

### 1. Traiter par famille, pas par opportunité locale

Le lot doit rester cohérent. On évite de remplacer une occurrence isolée si toute la famille n’a pas été auditée.

### 2. Cohérence visuelle storefront avant tout

Les cartes, variantes et blocs concernés doivent rester homogènes après remplacement.

### 3. Pas de nouveau composant

Le bon niveau de réponse ici reste le remplacement local explicite ou la conservation assumée de la classe globale.

### 4. Pas de faux cleanup

Si une classe reste utile ou encore largement homogène, mieux vaut la conserver que produire une dispersion inutile dans le markup.

## Méthode recommandée

Le déroulé recommandé est :

1. lister les occurrences de chaque famille visée
2. comparer les contextes réels d’usage
3. qualifier chaque famille :
   - à remplacer maintenant
   - à conserver
   - à repousser
4. appliquer les remplacements seulement sur les familles réellement prêtes
5. vérifier si une règle CSS devient morte
6. supprimer uniquement ce qui est prouvé inutile
7. lancer le typecheck
8. documenter les choix

## Validation attendue

### Validation technique

- `pnpm run typecheck`
- aucune suppression CSS injustifiée
- aucun changement de comportement

### Validation visuelle

Vérifier que les contextes touchés restent :

- cohérents
- sobres
- lisibles
- sans fragmentation typographique

### Validation fonctionnelle

Vérifier que les écrans storefront concernés restent inchangés fonctionnellement.

## Anti-patterns à éviter

### 1. Mélanger plusieurs familles trop différentes

Le lot doit rester ciblé sur les classes texte/méta.

### 2. Introduire des styles inline divergents

Le remplacement local doit rester cohérent entre les occurrences.

### 3. Nettoyer pour nettoyer

Si une classe reste utile, stable et claire, elle peut être conservée.

### 4. Déborder sur les layouts structurels

Si le travail commence à toucher profondément `.product-*`, `.cart-*` ou `.checkout-*`, on sort du périmètre.

## Livrables attendus

Le lot doit idéalement produire :

- un audit par famille
- un petit nombre de fichiers modifiés
- la suppression éventuelle de règles devenues mortes
- une justification explicite des familles laissées en place

## Suite logique

Une fois V14-2 terminé, la suite logique est :

### V14-3 — Simple public layout helpers cleanup

Ce lot pourra s’attaquer à des helpers publics encore globaux comme `.empty-state`, `.card-grid` et éventuellement `.store-card`, si leur remplacement reste propre.

## Résumé

V14-2 est un lot de réduction méthodique des styles texte/méta encore globaux côté storefront.

Il ne vise pas à refaire les écrans, mais à décider proprement ce qui peut disparaître, ce qui peut rester, et ce qui ne mérite pas encore d’être touché.
