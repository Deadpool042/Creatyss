<!-- docs/roadmap/projet-creatyss.md -->

# Roadmap projet — Creatyss

## Intention produit

Creatyss est la boutique en ligne d'une créatrice de sacs artisanaux uniques.

L'objectif n'est pas de construire une plateforme.
C'est de livrer un outil sobre, fiable et premium, taillé pour une seule boutique, exploitable par une seule personne non technique.

Le produit Creatyss est la première instanciation d'un **socle e-commerce modulaire réutilisable** (cf. `AGENTS.md`) : un clone du repo doit pouvoir devenir une autre boutique en ne changeant que la présentation storefront, le contenu et la configuration. Les fonctionnalités au-delà du cœur sont des capacités optionnelles, activables explicitement et, quand c'est pertinent, graduées par niveaux — gouvernées selon `docs/domains/cross-cutting/feature-governance.md`. Ni site-factory, ni multi-tenant.

Chaque décision technique se justifie par rapport à ces deux objectifs : la boutique d'abord, la réutilisabilité du socle comme discipline.

---

## Principes de trajectoire

- Livrer de la valeur visible avant d'optimiser l'invisible.
- Avancer par horizons courts, vérifiables et réversibles.
- Consolider avant d'étendre.
- Ne pas ouvrir un horizon sans avoir stabilisé le précédent.
- Rester dans le périmètre d'une boutique artisanale — pas d'une plateforme.

**Direction d'interface :** discipline inspirée Apple — respiration, hiérarchie, précision, fluidité.
Cette inspiration ne doit pas produire une esthétique froide, technologique ou gadget.
Le rendu reste artisanal, chaleureux et premium.

---

## État actuel du socle

### Stable

- Architecture doctrine + domaines + frontières documentée (`AGENTS.md`, `docs/architecture/`, `docs/domains/`)
- Environnement local natif reproductible (`pnpm dev`, PostgreSQL `localhost:5434`)
- Schéma Prisma multi-fichiers cohérent avec la doctrine
- Catalogue : produits, variantes, options, images, catégories, prix
- Storefront : boutique, fiche produit, blog, homepage éditable
- Admin : blog implémenté (création, édition, publication, suppression — recette manuelle ouverte, cf. validation Horizon 1), bibliothèque médias avec archivage
- Server Actions sécurisées sur les flux admin critiques
- Fallback images locales absentes côté serveur (`localUploadExists`)

### En consolidation

- SEO storefront (balises, canonicals, sitemap — socle posé, affinement ouvert)
- Liens de navigation storefront "Bientôt" (périmètre commerce non encore ouvert)
- Tests automatisés : infrastructure présente, couverture à renforcer sur les flux critiques

---

## Check-list de validation

Les cases ne sont cochées qu'après vérification réelle.
Une case non vérifiée reste ouverte — pas d'auto-validation.

La validation finale est factuelle : `typecheck`, `lint`, test manuel, capture ou revue humaine.
L'IA peut proposer et vérifier ; elle ne valide pas à la place de l'humain.

Trois états distincts, à ne pas confondre :

- **implémenté** : le code existe et passe typecheck/lint ;
- **recetté** : vérifié manuellement par un humain ;
- **testé e2e** : couvert par un test automatisé de bout en bout.

Une case n'est cochée qu'au stade « recetté » minimum.

---

## Horizon 1 — V1 éditoriale et catalogue exploitable

**Objectif :** la boutique peut être mise en ligne avec un catalogue réel, un blog actif et un admin utilisable au quotidien.

**Périmètre :**

- Catalogue complet : produits publiés, variantes, galerie, SEO produit
- Homepage éditable : hero, produits mis en avant, catégories, article en vedette
- Blog : articles publiés avec image principale et couverture
- Admin : gestion produits, images, blog, paramètres boutique de base
- SEO : titres, descriptions, sitemap, robots
- Responsive mobile / tablette / desktop soigné

**Critères de sortie :**

- Une utilisatrice non technique peut gérer le catalogue et le blog sans intervention technique.
- Le storefront est publiquement navigable sans erreur visible.
- Aucune image manquante ne produit une erreur réseau côté client.
- Le typecheck et le lint passent sans erreur.

**Validation :**

- [x] Catalogue public lisible sur mobile, tablette, desktop
- [x] Fiche produit claire et cohérente sur mobile, tablette, desktop
- [x] Blog public lisible avec listing et détail
- [x] Homepage éditable sans intervention développeur
- [x] Admin produits utilisable par une non-technicienne
- [x] Admin catégories utilisable — recetté manuellement (création parent/enfant, édition, retrait du parent, archivage, filtre archives, détail archivé dans le shell admin sans 404 globale, restauration, retour liste active) le 2026-06-12
- [x] Admin médias utilisable avec archivage
- [x] Admin blog créer / modifier / publier opérationnel — recetté manuellement le 2026-06-12 (création brouillon, édition, publication, rendu public, SEO de base via title, dépublication, 404 publique après dépublication)
- [x] Erreurs principales visibles et compréhensibles — recetté manuellement le 2026-06-12 (404 admin dans l’expérience admin, retour tableau de bord OK, boundary runtime admin dédiée, pas de stack technique affichée, Réessayer fonctionnel)
- [x] `pnpm run typecheck` passe
- [x] `pnpm run lint` passe

---

## Horizon 2 — Commerce minimal

**Objectif :** une cliente peut commander un produit de bout en bout.

**Périmètre :**

- Panier persistant
- Checkout avec adresse de livraison
- Commandes enregistrées côté admin
- Gestion minimale clients (historique commande)
- Prix et disponibilité cohérents avec le catalogue
- Validations métier sur les flux critiques (stock, statut produit)

**Hors périmètre pour cet horizon :**

- Paiement en ligne (intégration à confirmer selon contraintes réelles)
- Retours et remboursements
- Taxes complexes

**Critères de sortie :**

- Une commande peut être passée, reçue côté admin et suivie jusqu'à son traitement.
- Le flux panier → commande ne contient aucun état incohérent.
- L'admin peut voir, filtrer et mettre à jour les commandes.

**État 2026-06-12 :** le flux Checkout V1 est implémenté de bout en bout (panier cookie signé, checkout invité, transaction atomique, email non fatal, confirmation, admin paiements) — référence : `docs/lots/2026-06-10-checkout-v1-reference.md`.

**Mise à jour 2026-06-12 (smoke E2E) :** le smoke `tests/e2e/public/commerce-smoke.spec.ts` passe localement. Parcours couvert : produit test vendable → ajout panier → panier visible → checkout invité (informations enregistrées) → livraison sélectionnée → paiement `Virement bancaire` → création commande → confirmation publique (référence `CMD-*`, email client, paiement en attente) → panier vidé → connexion admin → commande visible dans la vue d'ensemble → détail admin (email client, statut paiement, méthode `Virement bancaire`).

Limites du smoke : paiement limité à `Virement bancaire` (pas de paiement en ligne, conforme au hors périmètre H2) ; l'email transactionnel est non fatal — le smoke vérifie l'enregistrement de l'événement `order_created` en DB (destinataire, statut), pas la délivrance réelle. La contrainte de disponibilité/stock est couverte séparément par `tests/e2e/public/commerce-availability.spec.ts` (refus `insufficient_stock`, panier inchangé), vert localement le 2026-06-12. `cart.spec.ts` et `checkout.spec.ts` sont alignés sur les fixtures auto-provisionnées et les contrats UI actuels, verts localement le 2026-06-12.

**Validation :**

- [x] Panier fonctionnel — implémenté, couvert par le smoke E2E minimal (2026-06-12)
- [x] Checkout minimal fonctionnel — implémenté, couvert par le smoke E2E minimal (invité, `Virement bancaire` uniquement) (2026-06-12)
- [x] Commande créée et consultable en admin — implémenté, couvert par le smoke E2E minimal (vue d'ensemble + détail) (2026-06-12)
- [x] Disponibilité produit respectée — implémenté, couvert par test E2E ciblé `insufficient_stock` (`commerce-availability.spec.ts`, 2026-06-12)
- [x] Emails ou confirmations minimales cadrées — confirmation publique couverte par le smoke ; événement email `order_created` vérifié en DB par le smoke (destinataire correct, statut tracé) ; email non fatal, envoi réel non garanti par le test (2026-06-12)
- [x] Parcours testé de bout en bout — smoke E2E minimal vert localement (2026-06-12)

---

## Horizon 3 — Exploitation VPS

**Objectif :** le projet tourne en production sur un VPS simple, de façon stable et maintenable.

**Périmètre :**

- Déploiement Docker Compose production (`docker-compose.prod.yml`)
- Configuration HTTPS, reverse proxy — Caddy retenu (2026-06-12, `docker/caddy/Caddyfile`)
- Variables d'environnement et secrets externalisés
- Sauvegardes base de données
- Logs applicatifs lisibles
- Procédure de mise à jour documentée

**Critères de sortie :**

- Le projet peut être redéployé depuis zéro en moins d'une heure.
- Un incident courant (crash, redémarrage) se résout sans intervention code.
- Les sauvegardes sont testées et restaurables.

**Validation :**

**État 2026-06-12 :** `pnpm run build` passe en local. `Dockerfile.prod` écrit (multi-stage, non-root), build d'image non validé faute de Docker disponible. Documentation d'exploitation initiée dans `docs/exploitation/` (env, sauvegardes, médias, mise à jour/rollback). Point d'attention tracé : pas de migrations Prisma, `db:push` embarque `--accept-data-loss` — sauvegarde obligatoire avant tout push en production.

- [ ] Build production validé — `next build` local OK ; build image Docker restant à valider
- [x] Variables d'environnement documentées — `docs/exploitation/01-variables-d-environnement.md` (2026-06-12)
- [x] Sauvegarde DB documentée — `docs/exploitation/02-sauvegarde-restauration-db.md` ; test réel sauvegarde → restauration encore à exécuter (2026-06-12)
- [x] Médias persistants documentés — `docs/exploitation/03-medias-persistants.md` (2026-06-12)
- [ ] Déploiement VPS répétable
- [x] Procédure rollback minimale documentée — `docs/exploitation/04-mise-a-jour-et-rollback.md` ; limites de `db push` explicitées (2026-06-12)

---

## Horizon 4 — Socle clonable et gouvernance des features

**Objectif :** rendre opérationnelle l'identité « socle réutilisable » — un clone du repo devient une autre boutique sans toucher au cœur — et doter le mécanisme d'activation des niveaux nécessaires aux capacités graduées.

Référence : `docs/audit/audit-clonabilite-2026-06-12.md` (inventaire des spécificités Creatyss dans le socle) et `docs/domains/cross-cutting/feature-governance.md` (doctrine modules / capabilities / niveaux / guards).

**Pattern canonique pour toute capacité optionnelle :**

1. prérequis socle (ce qui doit exister dans le cœur pour que l'option soit activable sans refonte) ;
2. activation explicite (toggle DB via `FeatureFlag`, jamais par effet de bord) ;
3. niveaux si la capacité est graduée (ex. localization : 1 langue → N langues + routing) ;
4. fiche domaine à jour, testabilité indépendante, invariants cœur préservés.

**Lots, par ordre de dépendance :**

- Copy/config storefront (R1) : composants config-driven selon la convention existante `features/<domaine>/config/*.config.ts` ; source de marque unique consommée par metadata, footer, topbar, emails, JSON-LD. Prérequis de la clonabilité **et** du multilangue.
- Gradation du mécanisme feature-flags : ajout du niveau dans `FeatureFlag` et sa résolution (lot `prisma-architect` — le modèle actuel est booléen alors que la gouvernance prévoit des features graduées).
- Pages de contenu unifiées (R2) : `a-propos`, `les-marchés`, `contact` basculent vers le domaine `pages`, comme les pages légales.
- Résolution de boutique unique (R5) : supprimer la double convention (`CANONICAL_STORE_CODE` en dur vs premier store).
- Redirects d'instance hors du socle (R6) ; statut bootstrap explicite de l'outillage Woo (R4) — l'import durable des clones est l'import en masse générique (CSV), capacité optionnelle déjà modélisée.
- `localization` comme première capacité graduée de référence : valide le pattern complet (toggle + niveaux + routing + traduction du contenu métier, distincte du copy UI).

**Décision d'architecture préalable à toute extension commerce :** frontière `availability`/`inventory` — le flux panier calcule la disponibilité depuis `inventory` sans consulter `availabilityRecord`, et le cœur commerce dépend d'un module classé optionnel (cf. audit). À trancher en `architect-review` avant d'activer de nouvelles capacités commerce.

**Validation :**

- [ ] Copy/config storefront en place — plus de marque en dur dans les composants du socle
- [ ] `FeatureFlag` gradué (niveau porté par le mécanisme et résolu par les guards)
- [ ] Pages de contenu servies par le domaine `pages`
- [ ] Résolution de boutique unifiée
- [ ] Décision `availability`/`inventory` documentée
- [ ] Clone à blanc : repo cloné, marque/contenu/config changés, boutique fonctionnelle sans modification du cœur

---

## Plus tard — uniquement sur besoin validé

Capacités optionnelles déjà modélisées dans `prisma/optional/` et `docs/domains/optional/` : leur ouverture est une **activation gouvernée** (pattern Horizon 4), pas une construction. À ouvrir uniquement si un besoin réel et explicite l'impose :

- Retours et échanges
- Cartes cadeaux
- Programme fidélité
- Expédition avancée (transporteurs, suivi)
- Taxation plus riche
- Extensions de paiement supplémentaires (paiement en ligne inclus)
- Recommandations produits
- Enrichissements marketing (codes promo, bundles)
- Import en masse générique (CSV ou autre)
- Multi-langue (`localization` graduée — cadrée en Horizon 4)

---

## Hors périmètre assumé

Sans validation explicite et contraire à l'intention produit :

- Multi-tenant ou site-factory
- Microservices
- IA produit
- Analytics complexes
- Multi-devise
- Moteur de règles complexe
- Migration vers Shopify, WordPress ou toute plateforme externe
