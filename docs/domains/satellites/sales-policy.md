# Politique de vente

## Rôle

Le domaine `sales-policy` porte la vendabilité contextuelle du système.

Il définit :

- ce qu’est une décision de vendabilité du point de vue du système ;
- comment un produit, une variante ou une offre devient vendable dans un contexte donné ;
- quelles règles métier, commerciales, géographiques, temporelles ou contextuelles conditionnent l’accès à la vente ;
- comment ce domaine se distingue du catalogue source, du stock quantitatif, du pricing, du checkout et des canaux ;
- comment le système reste maître de sa vérité interne de vendabilité.

Le domaine existe pour fournir une représentation explicite de la vendabilité, distincte :

- du catalogue source porté par `products` ;
- du stock quantitatif porté par `inventory` ;
- de la disponibilité vendable portée par `availability` lorsque celle-ci représente un état calculé ou exposé ;
- des prix, remises et taxes portés par `pricing`, `discounts` et `taxation` ;
- du panier et du checkout ;
- des canaux et des intégrations.

---

## Classification

### Catégorie documentaire

`satellites`

### Criticité architecturale

`satellite structurant`

### Activable

`non`

Le domaine `sales-policy` est structurel dès lors que le système ne réduit pas la vente à la simple existence d’un produit et d’un prix.

---

## Source de vérité

Le domaine `sales-policy` est la source de vérité pour :

- la définition interne de la vendabilité contextuelle ;
- les règles métier de vendabilité ;
- les décisions de vendabilité rendues dans un contexte donné ;
- les raisons explicites de refus, restriction ou acceptation conditionnelle ;
- les règles de politique de vente portées par le système ;
- les statuts métier de vendabilité si le modèle les expose explicitement.

Le domaine `sales-policy` n’est pas la source de vérité pour :

- le catalogue source, qui relève de `products` ;
- le stock quantitatif, qui relève de `inventory` ;
- le prix de référence, qui relève de `pricing` ;
- la fiscalité, qui relève de `taxation` ;
- les remises, qui relèvent de `discounts` ;
- la commande, le panier ou le paiement ;
- les canaux ;
- les intégrations externes.

La vendabilité est une décision métier contextuelle.
Elle ne doit pas être confondue avec :

- l’existence d’un produit ;
- la seule quantité disponible ;
- un prix calculé ;
- une capacité technique de publication ;
- une simple capability de boutique.

---

## Responsabilités

Le domaine `sales-policy` est responsable de :

- définir ce qu’est une décision de vendabilité dans le système ;
- structurer le contexte de vente utile à cette décision ;
- porter les règles métier qui conditionnent la vente ;
- rendre une décision explicite de type vendable, non vendable ou vendable sous conditions ;
- exposer les raisons explicites de refus, restriction ou condition ;
- coordonner la vendabilité avec `products`, `inventory`, `availability`, `customers`, `stores`, `pricing` et `channels` ;
- publier les événements significatifs liés aux changements de règles ou de décisions structurantes.

Selon le périmètre exact du projet, le domaine peut également être responsable de :

- règles par pays ou zone ;
- règles par type de client ;
- règles par groupe client ;
- règles temporelles de vente ;
- règles par capability active de boutique ;
- règles de catalogue conditionnant la vente ;
- restrictions par segment, scope, mode de vente ou stratégie commerciale.

---

## Non-responsabilités

Le domaine `sales-policy` n’est pas responsable de :

- définir le catalogue source ;
- porter le stock quantitatif ;
- calculer les prix, remises, taxes ou totaux ;
- porter la logique complète du panier, du checkout ou de la commande ;
- exécuter les intégrations externes ;
- porter les canaux eux-mêmes ;
- devenir un moteur générique de règles pour tout le système.

Le domaine `sales-policy` ne doit pas devenir :

- un doublon de `products` ;
- un doublon de `inventory` ;
- un doublon de `pricing` ;
- un agrégat flou de règles métier sans structure explicite ;
- un fourre-tout de “cas spéciaux” commerciaux sans gouvernance claire.

---

## Invariants

Les invariants minimaux sont les suivants :

- la vendabilité contextuelle est décidée par `sales-policy` ;
- la vendabilité ne se confond pas avec le catalogue source ;
- la vendabilité ne se confond pas avec la seule quantité disponible ;
- une décision de vendabilité doit pouvoir être expliquée ;
- les autres domaines ne doivent pas réinventer leur propre vérité divergente de vendabilité ;
- une règle de vendabilité doit être interprétable sans ambiguïté ;
- une décision identique rendue dans un contexte identique doit rester déterministe ;
- les capabilities actives de la boutique peuvent influencer la vendabilité sans dissoudre la structure du domaine.

Le domaine protège la cohérence de la vente autorisée, pas simplement un booléen d’accès.

---

## Dépendances

### Dépendances métier

Le domaine `sales-policy` interagit fortement avec :

- `products`
- `inventory`
- `availability`
- `customers`
- `stores`
- `pricing`
- `channels`

### Dépendances transverses

Le domaine dépend également de :

- `audit`
- `observability`
- `jobs`, si certaines évaluations ou reconstructions sont différées
- `feature-flags`, si certaines politiques sont activées progressivement

### Dépendances externes

Le domaine peut être alimenté indirectement par :

- ERP ;
- moteurs de règles externes ;
- systèmes commerciaux ;
- projections ou référentiels importés via `integrations`.

### Règle de frontière

Le domaine `sales-policy` porte la vendabilité contextuelle.
Il ne doit pas absorber :

- le catalogue source ;
- la quantité de stock ;
- la tarification ;
- la logique de commande ;
- ni la projection canal.

---

## Événements significatifs

Le domaine `sales-policy` publie ou peut publier des événements significatifs tels que :

- règle de politique de vente mise à jour ;
- décision de vendabilité modifiée ;
- item devenu vendable ;
- item devenu non vendable ;
- restriction de vente ajoutée ;
- restriction de vente levée.

Le domaine peut consommer des signaux liés à :

- produit mis à jour ;
- produit publié ;
- stock mis à jour ;
- disponibilité modifiée ;
- type de client modifié ;
- capabilities de boutique modifiées ;
- contexte commercial modifié.

Les noms exacts doivent rester dans le langage interne du système.

---

## Cycle de vie

Le domaine `sales-policy` possède un cycle de vie partiel au niveau des règles et décisions qu’il porte.

Le cycle exact dépend du projet, mais il doit au minimum distinguer :

- actif ;
- inactif ;
- suspendu, si pertinent ;
- archivé, si pertinent.

Pour les décisions de vendabilité, le domaine doit au minimum distinguer :

- vendable ;
- non vendable ;
- vendable sous conditions.

Le domaine doit éviter :

- les décisions implicites ;
- les refus non explicables ;
- les changements silencieux de règle ;
- les statuts purement techniques non interprétables côté métier.

---

## Interfaces et échanges

Le domaine `sales-policy` expose principalement :

- des lectures de décision de vendabilité ;
- des raisons explicites de refus ou restriction ;
- des lectures exploitables par `cart`, `checkout`, `channels`, `recommendations`, `search` ou d’autres domaines consommateurs ;
- des règles ou profils de politique de vente lorsqu’ils sont modélisés explicitement.

Le domaine reçoit principalement :

- un produit ou une variante catalogue ;
- un contexte client ;
- un contexte boutique ;
- un contexte géographique ;
- un contexte temporel ;
- des lectures de stock ou de disponibilité si elles influencent la décision ;
- les capabilities actives de la boutique.

Le domaine ne doit pas exposer un contrat canonique dicté par une intégration externe.

---

## Contraintes d’intégration

Le domaine `sales-policy` peut être exposé à des contraintes telles que :

- vente multi-pays ;
- vente B2C / B2B ;
- fenêtres temporelles ;
- capabilities activables ;
- précommandes ou backorders ;
- règles de catalogue spécifiques ;
- dépendance à des référentiels externes ;
- diffusion de certaines décisions vers des canaux.

Règles minimales :

- la hiérarchie d’autorité doit être explicite ;
- les règles doivent être déterministes à contexte identique ;
- les traitements rejouables doivent être idempotents ou neutralisés ;
- une dépendance externe ne doit pas corrompre silencieusement la vérité interne ;
- une restriction doit être explicitée ;
- une capability active ne doit pas rendre les décisions opaques.

---

## Données sensibles / sécurité

Le domaine `sales-policy` ne porte pas directement de secrets techniques, mais il porte une logique métier sensible car elle impacte la capacité réelle de vendre.

Points de vigilance :

- modifications réservées à des profils contrôlés ;
- traçabilité des changements de règles sensibles ;
- explicabilité des décisions de refus ou d’acceptation ;
- cohérence stricte avec les capabilities actives ;
- séparation claire entre gouvernance métier et exécution technique.

---

## Observabilité et audit

Le domaine `sales-policy` doit rendre visibles au minimum :

- pourquoi un item est vendable ou non ;
- quelle règle a bloqué ou autorisé la vente ;
- quel contexte client, géographique, temporel ou capability a influencé la décision ;
- quelle lecture de `inventory`, `availability` ou `products` a été consommée ;
- quels changements de politique ont modifié une décision structurante.

L’audit doit permettre de répondre à des questions comme :

- quelle règle a changé ;
- quand ;
- selon quelle origine ;
- avec quel impact sur la vendabilité ;
- quelle décision a été rendue ;
- avec quelle justification.

L’observabilité doit distinguer :

- erreur de modèle ;
- erreur technique ;
- contexte incohérent ;
- règle invalide ;
- capability conflictuelle ;
- item lisible mais non vendable.

---

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `SalesContext` : contexte de vente analysé ;
- `SellabilityDecision` : décision de vendabilité ;
- `SellabilityReason` : raison explicite de refus, restriction ou acceptation conditionnelle ;
- `SalesRule` : règle de politique de vente appliquée ;
- `SalesPolicyProfile` : profil ou regroupement de règles, si ce concept est porté explicitement.

---

## Impact de maintenance / exploitation

Le domaine `sales-policy` a un impact d’exploitation élevé.

Raisons :

- il détermine la capacité réelle de vendre ;
- ses erreurs affectent panier, checkout, canaux et commande ;
- il se situe à la frontière entre catalogue, disponibilité, client et boutique ;
- il augmente fortement la nécessité d’explicabilité ;
- il peut dépendre de capabilities ou de référentiels externes.

En exploitation, une attention particulière doit être portée à :

- la lisibilité des décisions ;
- les règles conflictuelles ;
- les faux positifs de non-vendabilité ;
- les restrictions géographiques ou client mal appliquées ;
- la cohérence avec les capabilities actives ;
- la traçabilité des changements de politique.

Le domaine doit être considéré comme structurant pour toute vente contextualisée.

---

## Limites du domaine

Le domaine `sales-policy` s’arrête :

- avant le catalogue source ;
- avant le stock quantitatif ;
- avant le prix, les remises et la fiscalité ;
- avant la logique de panier, checkout et commande ;
- avant les canaux eux-mêmes ;
- avant les intégrations externes.

Le domaine `sales-policy` porte la vendabilité contextuelle.
Il ne doit pas devenir un moteur universel de règles ni un doublon des autres domaines coeur.

---

## Questions ouvertes

À confirmer explicitement dans le projet :

- la frontière exacte entre `sales-policy` et `availability` ;
- la frontière exacte entre `sales-policy` et `channels` ;
- la part exacte des règles quantitatives dérivées de `inventory` ;
- la gouvernance des capabilities influençant la vente ;
- la place exacte des cas `professionalCustomers`, `backorders`, `preorders` et `productChannels` dans le modèle actuel ;
- la hiérarchie entre vérité interne et référentiel externe éventuel.

Si ces points sont déjà tranchés ailleurs, ils doivent être réinjectés ici et sortir de cette section.

---

## Documents liés

- `../../architecture/10-fondations/11-modele-de-classification.md`
- `../../architecture/10-fondations/12-frontieres-et-responsabilites.md`
- `../core/products.md`
- `inventory.md`
- `../core/availability.md`
- `../core/customers.md`
- `../core/stores.md`
- `../core/pricing.md`
- `discounts.md`
- `../core/taxation.md`
- `channels.md`
- `../cross-cutting/audit.md`
- `../cross-cutting/observability.md`
