# Authentification

## Rôle

Le domaine `auth` porte la gestion de l’identité et de l’authentification dans le système.

Il définit :

- comment une identité est reconnue ;
- comment un acteur s’authentifie ;
- comment une session ou un contexte d’accès est établi ;
- comment le système distingue un acteur authentifié d’un acteur anonyme.

Le domaine existe pour fournir une base fiable d’identification, indépendante :

- des clients (`customers`) ;
- des utilisateurs internes (`users`) ;
- des rôles et permissions ;
- des mécanismes métier.

---

## Classification

### Catégorie documentaire

`core`

### Criticité architecturale

`coeur structurel`

### Activable

`non`

Le domaine `auth` est non optionnel.

Sans lui, le système ne peut pas :

- identifier les acteurs ;
- sécuriser les accès ;
- structurer les interactions.

---

## Source de vérité

Le domaine `auth` est la source de vérité pour :

- l’identité authentifiée ;
- les mécanismes d’authentification ;
- les sessions ;
- les tokens ou équivalents ;
- le statut d’authentification d’un acteur.

Le domaine `auth` n’est pas la source de vérité pour :

- le client métier (`customers`) ;
- les utilisateurs métier (`users`) ;
- les rôles (`roles`) ;
- les permissions (`permissions`) ;
- les données personnelles métier ;
- les décisions d’autorisation.

👉 Auth = **qui tu es**
👉 Pas = **ce que tu peux faire**

---

## Responsabilités

Le domaine `auth` est responsable de :

- identifier un acteur ;
- authentifier un acteur ;
- gérer les sessions ;
- gérer les tokens ou équivalents ;
- garantir l’intégrité des mécanismes d’authentification ;
- exposer un contexte d’identité exploitable ;
- protéger contre les accès non autorisés ;
- publier les événements liés à l’authentification.

Selon le périmètre, il peut aussi gérer :

- login / logout ;
- refresh de session ;
- invalidation ;
- multi-device ;
- authentification externe (OAuth, SSO).

---

## Non-responsabilités

Le domaine `auth` n’est pas responsable de :

- décider des permissions ;
- gérer les rôles ;
- définir les droits ;
- porter la logique métier du client ;
- gérer les données métier ;
- gérer les commandes ;
- gérer les paiements ;
- gérer les intégrations ;
- gérer les webhooks.

👉 Toute confusion ici = dette technique massive

---

## Invariants

- une identité authentifiée doit être valide ;
- une session doit être traçable ;
- un token ne doit pas être ambigu ;
- une session invalide ne doit pas être acceptée ;
- un acteur ne doit pas être simultanément authentifié et invalide ;
- une mutation d’état d’auth doit être cohérente.

---

## Dépendances

### Dépendances métier

- `users`
- `customers`

### Dépendances transverses

- audit
- observabilité
- security
- consent (selon cas)

### Dépendances externes

- providers d’auth (OAuth, SSO)
- identity providers
- systèmes de sécurité

---

## Événements significatifs

- utilisateur authentifié
- session créée
- session expirée
- session invalidée
- login réussi
- login échoué
- token rafraîchi
- déconnexion

---

## Cycle de vie

- non authentifié
- authentifié
- session active
- session expirée
- session invalidée

---

## Interfaces et échanges

Expose :

- authentification
- validation d’identité
- état de session

Consomme :

- credentials
- tokens externes
- signaux de sécurité

---

## Contraintes d’intégration

- sécurité critique
- gestion des tokens
- expiration
- duplication de requêtes
- replay attacks
- intégration providers externes

---

## Observabilité et audit

- tentatives de login
- échecs
- succès
- invalidations
- anomalies
- accès suspects

---

## Impact de maintenance / exploitation

Impact critique :

- sécurité du système
- accès utilisateur
- exposition aux attaques
- dépendance à providers externes

---

## Limites du domaine

Le domaine `auth` s’arrête :

- avant les permissions ;
- avant les rôles ;
- avant les décisions d’accès ;
- avant les données métier ;
- avant les logiques applicatives.

---

## Questions ouvertes

- stratégie JWT vs session ?
- multi-device ?
- SSO ?
- external providers ?
- gestion sécurité avancée ?

---

## Documents liés

- `users.md`
- `../commerce/customers.md`
- `permissions.md`
- `roles.md`
- `../../../architecture/10-fondations/12-frontieres-et-responsabilites.md`
