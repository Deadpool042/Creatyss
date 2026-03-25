# Avis

## Rôle

Le domaine `reviews` porte les avis explicitement modélisés dans le système.

Il définit :

- ce qu’est un avis du point de vue du système ;
- comment un client, un acheteur vérifié ou un contexte autorisé publie, modifie, retire ou voit modérer un avis ;
- comment ce domaine se distingue du contenu éditorial, du support, du CRM et du marketing ;
- comment le système reste maître de sa vérité interne sur les avis, notes et statuts de modération.

Le domaine existe pour fournir une représentation explicite des avis, distincte :

- du catalogue produit porté par `products` ;
- du contenu éditorial porté par d’autres domaines ;
- des tickets ou conversations de support portés par `support` ;
- de la relation client structurée portée par `crm` ;
- du marketing porté par `marketing` ;
- des DTO provider-specific portés par `integrations`.

---

## Classification

### Catégorie documentaire

`optional`

### Criticité architecturale

`optionnel structurant`

### Activable

`oui`

Le domaine `reviews` est activable.
Lorsqu’il est activé, il devient structurant pour certains parcours storefront, réassurance commerciale, modération et relation client.

---

## Source de vérité

Le domaine `reviews` est la source de vérité pour :

- la définition interne d’un avis ;
- sa note, son contenu et ses métadonnées explicitement portées ;
- son statut de modération ou de publication ;
- son rattachement explicite à un objet noté ;
- ses lectures structurées consommables par les domaines autorisés.

Le domaine `reviews` n’est pas la source de vérité pour :

- le produit publié, qui relève de `products` ;
- le contenu éditorial global ;
- le support client, qui relève de `support` ;
- la relation CRM complète, qui relève de `crm` ;
- les campagnes marketing, qui relèvent de `marketing` ;
- les DTO providers externes, qui relèvent de `integrations`.

Un avis est un retour structuré et gouverné.
Il ne doit pas être confondu avec :

- un commentaire libre sans statut ;
- un ticket support ;
- une campagne marketing ;
- un signal analytics ;
- un simple bloc de contenu storefront.

---

## Responsabilités

Le domaine `reviews` est responsable de :

- définir ce qu’est un avis dans le système ;
- porter les notes et contenus d’avis ;
- porter les statuts de modération, publication ou retrait ;
- exposer une lecture gouvernée des avis publiés, en attente, refusés ou archivés ;
- publier les événements significatifs liés à la vie d’un avis ;
- protéger le système contre les avis implicites, opaques ou contradictoires.

Selon le périmètre exact du projet, le domaine peut également être responsable de :

- avis produit ;
- avis bundle ;
- notes agrégées si ce modèle est explicitement porté ici ;
- vérification “achat confirmé” ;
- modération humaine ou semi-automatique ;
- réponse marchande à un avis si ce modèle est retenu ;
- signalement d’avis.

---

## Non-responsabilités

Le domaine `reviews` n’est pas responsable de :

- définir le catalogue produit ;
- définir le support client ;
- porter toute la logique CRM ;
- porter toute la logique marketing ;
- exécuter les intégrations provider-specific ;
- devenir un système générique de discussion ou forum.

Le domaine `reviews` ne doit pas devenir :

- un doublon de `support` ;
- un doublon de `crm` ;
- un doublon de `marketing` ;
- un conteneur flou de commentaires sans gouvernance.

---

## Invariants

Les invariants minimaux sont les suivants :

- un avis possède une identité stable ;
- un avis possède un statut explicite ;
- un avis est rattaché explicitement à un objet noté ;
- un avis non publié ne doit pas être servi comme publié sans règle explicite ;
- une mutation significative de contenu, note ou statut doit être traçable ;
- une note agrégée, si elle existe, ne doit pas devenir incohérente avec les avis sources ;
- les domaines consommateurs ne doivent pas recréer librement leur propre vérité divergente d’avis quand le cadre commun existe.

Le domaine protège la cohérence des avis explicites du système.

---

## Dépendances

### Dépendances métier

Le domaine `reviews` interagit fortement avec :

- `products`
- `orders`
- `customers`
- `crm`
- `marketing`
- `stores`

### Dépendances transverses

Le domaine dépend également de :

- `audit`
- `observability`
- `notifications`, si certaines alertes de modération ou réponses sont explicitement portées
- `jobs`, si certaines agrégations ou modérations sont différées
- `fraud-risk`, si certains contrôles anti-abus sont modélisés
- `legal`, si certaines obligations de publication ou retrait doivent être cadrées explicitement

### Dépendances externes

Le domaine peut être projeté vers :

- plateformes d’avis externes ;
- CRM ;
- backoffice de modération ;
- autres systèmes via `integrations`.

### Règle de frontière

Le domaine `reviews` porte les avis explicitement modélisés.
Il ne doit pas absorber :

- le support ;
- le CRM complet ;
- le marketing ;
- ni les DTO providers externes.

---

## Événements significatifs

Le domaine `reviews` publie ou peut publier des événements significatifs tels que :

- avis créé ;
- avis soumis ;
- avis publié ;
- avis refusé ;
- avis retiré ;
- note modifiée ;
- réponse à avis ajoutée, si ce cas existe ;
- statut de modération modifié.

Le domaine peut consommer des signaux liés à :

- commande confirmée ;
- client identifié ;
- objet noté archivé ou retiré ;
- action administrative structurée ;
- capability boutique modifiée.

Les noms exacts doivent rester dans le langage interne du système.

---

## Cycle de vie

Le domaine `reviews` possède un cycle de vie explicite.

Le cycle exact dépend du projet, mais il doit au minimum distinguer :

- créé ;
- en attente ;
- publié ;
- refusé ;
- archivé, si pertinent.

Des états supplémentaires peuvent exister :

- brouillon ;
- signalé ;
- retiré ;
- suspendu.

Le domaine doit éviter :

- les avis “fantômes” ;
- les changements silencieux de note ;
- les états purement techniques non interprétables métier.

---

## Interfaces et échanges

Le domaine `reviews` expose principalement :

- des lectures d’avis structurés ;
- des lectures de notes ;
- des lectures exploitables par `storefront`, `crm`, `marketing` et certaines couches d’administration ;
- des structures prêtes à être consommées par les domaines autorisés.

Le domaine reçoit principalement :

- des créations ou mises à jour d’avis ;
- des changements de statut de modération ;
- des demandes de lecture d’avis ou de notes ;
- des contextes de client, commande, boutique ou objet noté ;
- des signaux internes utiles à l’évolution de l’avis.

Le domaine ne doit pas exposer un contrat canonique dicté par un provider externe.

---

## Contraintes d’intégration

Le domaine `reviews` peut être exposé à des contraintes telles que :

- modération préalable ;
- vérification d’achat ;
- projection externe ;
- agrégation de notes ;
- boutique multiple ;
- politiques de retrait ;
- lutte contre l’abus ;
- rétrocompatibilité des statuts.

Règles minimales :

- la hiérarchie d’autorité doit être explicite ;
- la vérité interne des avis reste dans `reviews` ;
- les DTO providers restent dans `integrations` ;
- les traitements rejouables doivent être idempotents ou neutralisés ;
- un avis incohérent ne doit pas être promu silencieusement ;
- les conflits entre contenu, statut et éligibilité doivent être explicables.

---

## Données sensibles / sécurité

Le domaine `reviews` peut manipuler des données personnelles, des contenus sensibles ou des signaux de réputation commerciale.

Points de vigilance :

- contrôle strict des droits de lecture et d’écriture ;
- séparation claire entre avis privé, en attente et publié ;
- limitation de l’exposition selon le rôle, le scope et le besoin métier ;
- audit des changements significatifs de contenu, note ou statut ;
- prudence sur les signaux anti-abus, la modération et les retraits.

---

## Observabilité et audit

Le domaine `reviews` doit rendre visibles au minimum :

- quel avis est publié ou non ;
- quelle note est en vigueur ;
- pourquoi un avis est accepté, bloqué, refusé ou retiré ;
- si une évolution est bloquée à cause d’un statut, d’une règle ou d’une incohérence ;
- si une modération ou une projection externe a modifié l’état de l’avis.

L’audit doit permettre de répondre à des questions comme :

- quel avis a été créé ou modifié ;
- quand ;
- selon quelle origine ;
- avec quelle note ou quel contenu affecté ;
- avec quel changement de statut ;
- avec quel impact sur storefront, CRM ou marketing.

L’observabilité doit distinguer :

- erreur de modèle ;
- erreur technique ;
- avis invalide ;
- statut incohérent ;
- publication refusée ;
- évolution non autorisée ;
- suspicion d’abus.

---

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `Review` : avis structuré ;
- `ReviewRating` : note explicite ;
- `ReviewTarget` : objet noté ;
- `ReviewStatus` : état de l’avis ;
- `ReviewModerationDecision` : décision de modération ;
- `ReviewPolicy` : règle de gouvernance, de publication ou de retrait.

---

## Impact de maintenance / exploitation

Le domaine `reviews` a un impact d’exploitation moyen lorsqu’il est activé.

Raisons :

- il influence la réassurance storefront ;
- il peut être consommé par CRM, marketing et modération ;
- ses erreurs dégradent confiance, réputation et expérience client ;
- il nécessite une explicabilité correcte des statuts ;
- il peut dépendre de modération, projection externe et lutte anti-abus.

En exploitation, une attention particulière doit être portée à :

- la cohérence des statuts ;
- la stabilité des notes ;
- la traçabilité des changements ;
- la cohérence avec les objets notés ;
- les effets de bord sur storefront, CRM et marketing ;
- la qualité de la modération.

Le domaine doit être considéré comme sensible dès qu’un système d’avis réel existe.

---

## Limites du domaine

Le domaine `reviews` s’arrête :

- avant le support ;
- avant le CRM complet ;
- avant le marketing ;
- avant les DTO providers externes.

Le domaine `reviews` porte les avis explicites.
Il ne doit pas devenir un doublon de support, de CRM ou de contenu générique non gouverné.

---

## Questions ouvertes

À confirmer explicitement dans le projet :

- la frontière exacte entre `reviews` et `support` ;
- la frontière exacte entre `reviews` et `crm` ;
- la frontière exacte entre `reviews` et `marketing` ;
- la part exacte de la vérification d’achat ;
- la gouvernance de la modération ;
- la hiérarchie entre vérité interne et projection externe éventuelle.

Si ces points sont déjà tranchés ailleurs, ils doivent être réinjectés ici et sortir de cette section.

---

## Documents liés

- `../../architecture/10-fondations/11-modele-de-classification.md`
- `../../architecture/10-fondations/12-frontieres-et-responsabilites.md`
- `../core/products.md`
- `../core/orders.md`
- `../core/customers.md`
- `../cross-cutting/crm.md`
- `../cross-cutting/marketing.md`
- `../cross-cutting/support.md`
- `../cross-cutting/fraud-risk.md`
- `../cross-cutting/audit.md`
- `../cross-cutting/observability.md`
- `../core/integrations.md`
