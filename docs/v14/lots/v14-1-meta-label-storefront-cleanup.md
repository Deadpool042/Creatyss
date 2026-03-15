# V14-1 — `.meta-label` storefront cleanup

## Objectif du lot

Le lot V14-1 ouvre la V14 avec un sujet volontairement unique et clairement délimité : la suppression de `.meta-label` côté storefront.

Après la V13, `.meta-label` a été explicitement identifiée comme l’une des dernières classes globales simples encore largement utilisées sur les écrans storefront.

Elle reste compréhensible, lisible et techniquement traitable, mais sa suppression n’était pas adaptée aux petits lots de clôture V13 parce qu’elle touchait plusieurs écrans de flux en même temps.

La V14 ouvre donc logiquement par ce chantier précis.

## Intention

Ce lot ne cherche pas à refaire les pages storefront.

Il vise uniquement à remplacer les usages de `.meta-label` par des styles locaux explicites, cohérents et suffisamment sobres pour que la règle CSS globale puisse disparaître si elle devient réellement morte.

Le but n’est pas de transformer le rendu, mais de faire tomber une classe globale encore diffuse.

## Résultat attendu

À l’issue de V14-1, le projet doit idéalement :

- ne plus dépendre de `.meta-label` côté storefront
- utiliser un style local explicite pour les libellés de métadonnées
- conserver une cohérence visuelle entre les écrans touchés
- pouvoir supprimer la règle CSS `.meta-label` si elle n’a plus aucun usage réel
- ne subir aucun changement métier ni aucune régression structurelle

## Ce que couvre ce lot

V14-1 couvre :

- l’audit de tous les usages storefront de `.meta-label`
- leur remplacement local par Tailwind explicite ou équivalent sobre déjà en place
- l’harmonisation minimale nécessaire entre les écrans concernés
- la suppression de la règle CSS `.meta-label` uniquement si elle devient réellement morte

## Ce que ce lot ne couvre pas

V14-1 ne couvre pas :

- la refonte des structures `.product-*`, `.variant-*`, `.cart-*`, `.checkout-*`
- une nouvelle abstraction de composant
- une passe générale sur toutes les métadonnées du projet
- des changements métier ou serveur
- le nettoyage d’autres familles de classes dans le même lot

## Périmètre attendu

Les écrans storefront potentiellement concernés sont :

- `/boutique/[slug]`
- `/panier`
- `/checkout`
- `/checkout/confirmation/[reference]`

Le lot doit partir de l’état réel du repo, mais son sujet doit rester strictement centré sur `.meta-label`.

## Nature du pattern ciblé

`.meta-label` n’est pas une classe de layout lourd.

C’est une classe de présentation textuelle utilisée comme libellé de métadonnées dans plusieurs contextes storefront.

Elle relève donc d’un bon candidat pour la V14 parce que :

- son intention est simple
- sa grammaire visuelle est répétée
- son remplacement local est compréhensible
- sa suppression n’impose pas de réécrire la structure globale des écrans

## Hypothèse de remplacement

Le style local de remplacement attendu doit rester cohérent avec le storefront et avec les conventions déjà présentes dans le projet.

Une base du type suivant est probable :

- `text-[0.72rem]`
- `font-bold`
- `uppercase`
- `tracking-[0.08em]`
- `text-muted-foreground`

Cette base doit être confirmée ou ajustée selon les usages réels du repo.

## Questions auxquelles le lot doit répondre

Le lot doit répondre aux questions suivantes :

### 1. Tous les usages storefront de `.meta-label` sont-ils réellement homogènes ?

Si oui, un remplacement uniforme sera possible.

Si non, il faudra documenter les écarts et choisir une approche minimale.

### 2. Le remplacement local reste-t-il lisible dans le markup ?

Si l’ajout des classes Tailwind reste simple et compréhensible, le cleanup est légitime.

### 3. La règle CSS devient-elle totalement morte ?

La suppression ne doit être faite que si aucun usage réel ne subsiste.

### 4. Le rendu reste-t-il cohérent entre boutique, panier, checkout et confirmation ?

Le lot ne doit pas produire de fragmentation visuelle.

## Principes de décision

### 1. Uniformité storefront avant tout

Même si les contextes diffèrent légèrement, la suppression de `.meta-label` doit préserver une lecture homogène des métadonnées storefront.

### 2. Aucun débordement de périmètre

Si, en avançant, il apparaît que le chantier implique une refonte des structures `.product-*`, `.cart-*` ou `.checkout-*`, il faut s’arrêter et rester sur le minimum viable.

### 3. Pas de nouveau composant

Le bon niveau ici est un remplacement local explicite, pas une nouvelle abstraction.

### 4. Pas de demi-nettoyage

Si `.meta-label` disparaît du markup storefront et n’a plus d’usage réel, la règle CSS doit être supprimée.

Si elle reste encore utilisée quelque part, la règle doit rester.

## Méthode recommandée

Le déroulé recommandé est :

1. repérer toutes les occurrences storefront de `.meta-label`
2. vérifier les variations réelles de rendu et de contexte
3. choisir un remplacement local cohérent
4. appliquer les changements de façon homogène
5. vérifier si la règle CSS devient morte
6. supprimer la règle uniquement si c’est prouvé
7. lancer le typecheck
8. documenter précisément ce qui a été fait et ce qui a été laissé en place

## Validation attendue

### Validation technique

- `pnpm run typecheck`
- aucun changement de comportement
- aucune suppression CSS injustifiée

### Validation visuelle

Vérifier que les libellés de métadonnées restent :

- lisibles
- sobres
- cohérents entre les écrans storefront concernés
- sans variation arbitraire de taille, casse ou contraste

### Validation fonctionnelle

Vérifier que les flux concernés restent identiques :

- ajout au panier
- panier
- checkout
- confirmation de commande

## Anti-patterns à éviter

### 1. Profiter du lot pour nettoyer d’autres classes

V14-1 doit rester centré sur `.meta-label`.

### 2. Réécrire la structure des écrans

Le lot concerne les libellés de métadonnées, pas les layouts produits, panier ou checkout.

### 3. Créer une abstraction inutile

Un simple remplacement local est préférable à un nouveau composant si cela reste lisible.

### 4. Introduire plusieurs variantes visuelles sans nécessité

Le but est de réduire le global CSS, pas de créer de nouvelles divergences.

## Livrables attendus

Le lot doit idéalement produire :

- un petit nombre de fichiers storefront modifiés
- un remplacement homogène des usages de `.meta-label`
- la suppression éventuelle de la règle CSS si elle devient morte
- un résumé clair des usages laissés ou supprimés

## Suite logique

Une fois V14-1 terminé, la suite logique est :

### V14-2 — Storefront text/meta cleanup

Ce lot pourra reprendre d’autres classes de texte et de métadonnées encore globales, une fois `.meta-label` éliminée ou clarifiée.

## Résumé

V14-1 est un lot simple, visible et méthodique.

Il sert à faire tomber une classe CSS globale encore très présente côté storefront, sans rouvrir le chantier structurel des écrans.

Le principe est clair :

- un seul pattern
- plusieurs écrans ciblés
- remplacement local cohérent
- suppression CSS seulement si la preuve est complète
