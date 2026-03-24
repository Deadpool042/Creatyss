# Nom du domaine

## Rôle

Décrire la finalité métier principale du domaine.

Le rôle doit répondre à la question :
**pourquoi ce domaine existe-t-il dans le système ?**

---

## Classification

### Catégorie documentaire

Indiquer l’une des catégories suivantes :

- `core`
- `optional`
- `cross-cutting`

### Criticité architecturale

Indiquer explicitement :

- `coeur`
- `optionnelle`
- `transverse non optionnelle`
- autre formulation strictement justifiée

### Activable

Indiquer :

- `oui`
- `non`

Préciser les conditions d’activation si applicable.

---

## Source de vérité

Indiquer clairement :

- quelle donnée ou décision relève de ce domaine ;
- où se situe l’autorité principale ;
- quelles données ne relèvent pas de lui.

S’il existe plusieurs systèmes impliqués, préciser la hiérarchie d’autorité.

---

## Responsabilités

Lister explicitement ce que le domaine :

- possède ;
- décide ;
- valide ;
- calcule ;
- orchestre ;
- expose.

Cette section doit rester centrée sur la responsabilité métier ou transverse réelle.

---

## Non-responsabilités

Lister explicitement ce que le domaine ne possède pas et ne décide pas.

Cette section est obligatoire.
Elle sert à protéger les frontières.

---

## Invariants

Lister les règles qui doivent rester vraies tant que le domaine est cohérent.

S’il n’existe pas d’invariant structurant, l’indiquer explicitement et justifier pourquoi.

---

## Dépendances

Documenter :

- les dépendances vers d’autres domaines ;
- les dépendances vers des systèmes externes ;
- les dépendances vers des préoccupations transverses ;
- la nature de chaque dépendance.

Distinguer autant que possible :

- dépendance métier ;
- dépendance technique ;
- dépendance d’intégration.

---

## Événements significatifs

Lister les événements métier ou transverses significatifs :

- publiés ;
- consommés ;
- ou pertinents pour le domaine.

Préciser uniquement les événements utiles à la compréhension du domaine.

---

## Cycle de vie

Décrire :

- les états importants ;
- les transitions structurantes ;
- ou indiquer explicitement que la notion de cycle de vie n’est pas applicable.

Cette section est obligatoire, même si la réponse est “non applicable”.

---

## Interfaces et échanges

Décrire les principaux points d’entrée et de sortie du domaine :

- commandes ;
- lectures ;
- projections ;
- événements ;
- synchronisations ;
- interfaces externes.

Ne pas transformer cette section en documentation d’API exhaustive.
Elle doit rester architecturale.

---

## Contraintes d’intégration

Décrire les contraintes spécifiques si le domaine interagit avec :

- un fournisseur externe ;
- des webhooks ;
- des synchronisations ;
- des jobs ;
- des traitements asynchrones ;
- des exigences d’idempotence.

Si non applicable, l’indiquer explicitement.

---

## Observabilité et audit

Décrire ce qui doit être visible ou traçable pour ce domaine :

- changements d’état ;
- erreurs significatives ;
- actions opératoires ;
- événements importants ;
- reprises éventuelles.

Si le domaine n’a pas d’exigence particulière, l’indiquer explicitement.

---

## Impact de maintenance / exploitation

Décrire :

- le niveau d’attention opératoire attendu ;
- les risques majeurs ;
- les points de supervision ;
- les besoins de reprise éventuels ;
- les sensibilités particulières.

Cette section ne doit pas être omise.

---

## Limites du domaine

Décrire explicitement où s’arrête le domaine :

- quelles responsabilités restent ailleurs ;
- quelles ambiguïtés doivent être évitées ;
- quelles frontières doivent être protégées.

---

## Questions ouvertes

Utiliser cette section uniquement pour les points réellement non stabilisés.

Ne pas y déplacer des éléments qui devraient déjà être tranchés.

Si aucune question ouverte n’existe, l’indiquer explicitement.

---

## Documents liés

Lister les documents utiles :

- architecture ;
- domaines voisins ;
- testing ;
- exploitation ;
- intégrations ;
- décisions associées.
