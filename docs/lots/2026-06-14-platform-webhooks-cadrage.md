<!-- docs/lots/2026-06-14-platform-webhooks-cadrage.md -->

# Cadrage — `platform.webhooks` (lecture admin)

> Roadmap point 6. Lot borne conforme `AGENTS.md` : objectif / perimetre /
> hors perimetre / invariants / risques / verifications / criteres de fin.

## Objectif

Ouvrir `platform.webhooks` par un premier increment **lecture seule** sur le
modele Prisma reel disponible, tout en explicitant l'ecart entre la doctrine
actuelle (`webhooks entrants`) et le referentiel existant
`WebhookEndpoint` / `WebhookDelivery`.

## Etat reel (audit)

- **Modele Prisma deja pose** (`prisma/optional/platform/webhooks.prisma`, `Level: L2`) :
  - `WebhookEndpoint` : cible URL, secret redactable, `eventType`, timeouts,
    compteurs de tentative implicites ;
  - `WebhookDelivery` : requete, tentative, reponse, erreurs, planification.
- **Lecture du modele** : il ressemble davantage a un mecanisme de
  **delivery vers des endpoints** qu'a un journal de webhooks entrants
  validates/normalises.
- **Doctrine existante** (`docs/domains/optional/platform/webhooks.md`) :
  decrit au contraire un domaine de **reception entrante**, validation,
  normalisation et deduplication.
- **Aucun code applicatif dedie** : pas de seed feature flag, pas de gating,
  pas de page admin.

## Frontieres a preserver

- ce lot observe le **referentiel reel present** ;
- il **ne tranche pas** la sémantique cible du domaine ;
- il **ne requalifie pas silencieusement** un modele sortant en doctrine
  entrante.

## Perimetre retenu (V1)

1. Seed `FeatureFlag platform.webhooks` (`DRAFT`, inactif par defaut).
2. Query de gating admin.
3. Lecture admin du referentiel actuel :
   - compteurs endpoints / deliveries ;
   - derniers `WebhookEndpoint` ;
   - dernieres `WebhookDelivery`.
4. Page discrète `/admin/settings/webhooks`, reliee au flag actif dans
   `/admin/settings/advanced`.
5. Mise a jour doc domaine + roadmap + etat des lieux avec mention explicite
   de la divergence doctrine/modele.

## Hors perimetre

- reception effective de webhooks entrants ;
- verification de signature ;
- deduplication / idempotence ;
- normalisation vers faits internes ;
- emission runtime ou retry ;
- refactor de schema ;
- renommage du domaine.

## Decisions retenues

- **D1 — Source verifiable** : le lot suit la source executable actuelle
  (`WebhookEndpoint` / `WebhookDelivery`) sans la travestir.
- **D2 — Doctrine** : l'ecart est documente, pas resolu.
- **D3 — UI** : page discrète `/admin/settings/webhooks`, protegee par
  `admin.settings.advanced.read`.

## Invariants a preserver

- aucun secret brut n'est expose ;
- aucun comportement runtime webhook n'est ajoute ;
- aucun changement de schema Prisma ;
- aucune promesse de pipeline entrant n'est suggeree par l'UI.

## Risques

- forte ambiguite semantique si la divergence doctrine/modele n'est pas lue ;
- utilite immediate limitee si les tables sont vides ;
- risque de refactor structurel futur si la doctrine entrante est confirmee.

## Verifications

- `pnpm run typecheck`
- `pnpm run lint`

## Criteres de fin

- `platform.webhooks` peut etre active depuis `settings/advanced` ;
- une page admin expose l'etat reel des endpoints et deliveries ;
- la divergence doctrine/modele est explicitement visible dans la doc ;
- aucune regression sur le reste de l'admin.
