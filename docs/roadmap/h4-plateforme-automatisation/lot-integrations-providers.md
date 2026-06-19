# Lot — Intégrations : premier provider concret

## Statut

A faire

## Objectif

Brancher un premier adaptateur concret sur le modèle `Integration` pour valider le pattern d'intégration de bout en bout. Le modèle est observé en Prisma et la page admin de lecture est observée, mais aucun adaptateur provider n'existe.

## Périmètre

Proposition — non observé comme implémenté à ce jour :

- `prisma/optional/platform/integrations.prisma` — modèles `Integration`, `IntegrationCredential` et `IntegrationSyncState` déjà posés (observés)
- `features/admin/settings/integrations/` — extension de la page lecture existante :
  - Formulaire de connexion pour le provider cible (OAuth ou clé API)
  - Stockage chiffré des credentials dans `IntegrationCredential`
  - Affichage de l'état de synchronisation `IntegrationSyncState`
  - Action de test de connexion
- Adaptateur concret : implémentation spécifique au provider retenu (à définir en `architect-review`)

## Hors périmètre

- Marketplace d'intégrations (plusieurs providers simultanés)
- SDK tiers multiples dans le même lot
- Interface de configuration avancée par provider (peut suivre lot par lot)

## Dépendances

- Décision produit sur le premier provider cible (externe, non technique) — sans cette décision, le lot ne peut pas démarrer
- `lot-webhooks-sortants` peut être un prérequis si le provider utilise des webhooks pour notifier des changements d'état

## Invariants

- Les credentials ne doivent jamais être exposés en clair dans l'UI ou dans les logs — le chiffrement de `IntegrationCredential` est un invariant absolu
- L'adaptateur doit utiliser `IntegrationSyncState` pour tracer l'état de la dernière synchronisation
- Un adaptateur défaillant ne doit pas impacter le fonctionnement de la boutique (isolation des erreurs)

## Risques

- Dépendance externe : l'API du provider peut changer, être dépréciée ou imposer des limites de quota
- Credentials chiffrés : la clé de chiffrement doit être dans les variables d'environnement, jamais en DB — sa perte rend les credentials irrécupérables
- Absence de décision provider : ce lot est entièrement conditionné à une décision produit externe

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`
- Test manuel : connexion au provider, test de connexion, affichage de l'état `IntegrationSyncState`

## Critères de fin

- Un premier adaptateur provider est fonctionnel et testé
- Les credentials sont stockés chiffrés et jamais exposés en clair
- L'état de synchronisation est visible dans l'admin
- `typecheck` et `lint` passent sans erreur

## Agent recommandé

`architect-review` pour la décision provider et la conception du pattern d'adaptateur.
