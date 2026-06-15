<!-- docs/lots/2026-06-14-platform-integrations-cadrage.md -->

# Cadrage — `platform.integrations` (lecture admin)

> Roadmap point 6. Lot borne conforme `AGENTS.md` : objectif / perimetre /
> hors perimetre / invariants / risques / verifications / criteres de fin.

## Objectif

Ouvrir `platform.integrations` par un premier increment **lecture seule** :
activation gouvernee, lecture admin de `Integration`, `IntegrationCredential`
et `IntegrationSyncState`, sans action de reprise, sans adaptateur provider et
sans exposition de secrets.

## Etat reel (audit)

- **Modele Prisma deja pose** (`prisma/optional/platform/integrations.prisma`, `Level: L2`) :
  - `Integration` : identite, type, provider, statut, URLs, mode sandbox ;
  - `IntegrationCredential` : metadonnees de secret (`secretPrefix`, `valueHint`,
    statut, expiration), sans necessite d'exposer `secretHash` ;
  - `IntegrationSyncState` : scope, statut, dernier job, succes/echec, erreurs.
- **Aucun code applicatif dedie** : pas de seed feature flag, pas de gating,
  pas de page admin.
- **Question ouverte maintenue** : frontiere exacte avec `platform.webhooks`,
  explicitement non tranchee dans ce lot.

## Frontieres a preserver

- `integrations` porte ici le **referentiel interne d'integration** et ses
  etats operatoires lisibles.
- `integrations` **ne porte pas** dans ce lot :
  - les secrets bruts ;
  - les providers SDK ;
  - les appels reseau ;
  - les webhooks ;
  - les reprises operatoires ;
  - les contrats d'echange runtime.

## Perimetre retenu (V1)

1. Seed `FeatureFlag platform.integrations` (`DRAFT`, inactif par defaut).
2. Query de gating admin.
3. Lecture admin du referentiel :
   - compteurs simples ;
   - dernieres `Integration` ;
   - dernieres `IntegrationCredential` redacées ;
   - derniers `IntegrationSyncState`.
4. Page discrète `/admin/settings/integrations`, reliee au flag actif dans
   `/admin/settings/advanced`.
5. Mise a jour doc domaine + roadmap + etat des lieux.

## Hors perimetre

- creation / edition / suppression d'integrations ;
- revélation ou rotation de secrets ;
- actions de retry, reconciliation ou compensation ;
- adaptateurs providers ;
- webhooks ;
- audit detaille ou observabilite avancee.

## Decisions retenues

- **D1 — Point d'entree UI** : page discrète `/admin/settings/integrations`,
  protegee par `admin.settings.advanced.read`.
- **D2 — Secrets** : aucune exposition de `secretHash`, uniquement
  `secretPrefix` et `valueHint` si presents.
- **D3 — Frontiere webhooks** : explicitemement laissee hors lot.

## Invariants a preserver

- aucun secret brut n'est expose ;
- aucune action provider n'est introduite ;
- aucun changement de schema Prisma ;
- aucune promesse de reprise operatoire n'est suggeree par l'UI.

## Risques

- utilite immediate limitee si tables vides ;
- confusion possible entre observabilite d'integration et execution reelle ;
- risque de glissement vers `webhooks` si la frontiere n'est pas preservee.

## Verifications

- `pnpm run typecheck`
- `pnpm run lint`

## Criteres de fin

- `platform.integrations` peut etre active depuis `settings/advanced` ;
- une page admin expose l'etat reel du referentiel etat/capacite/sync ;
- aucun secret brut ni action runtime n'apparait ;
- la doc reflète explicitement l'etat reel et la frontiere laissee ouverte avec `webhooks`.
