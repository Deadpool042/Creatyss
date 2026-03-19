# Repository admin `media`

## Rôle

`admin-media.repository.ts` gère la persistance minimale des médias admin :

- listing
- lecture par id
- création

Le domaine ne gère pas l'upload fichier lui-même. Il persiste les métadonnées du média.

## Structure actuelle

Fichiers :

- `admin-media.repository.ts`
- `admin-media.types.ts`

Contrats publics :

- `AdminMediaAsset`
- `CreateAdminMediaAssetInput`

## Fonctions publiques actuelles

- `listAdminMediaAssets()`
- `getAdminMediaAssetById(id)`
- `createAdminMediaAsset(input)`

## Comportements observables

- tri de listing par `created_at DESC`, puis `id DESC`
- conversion de `byte_size` en `string`
- conversion de `uploaded_by_admin_user_id` en `string | null`

## Limites actuelles

Le domaine est simple et lisible. La seule dette notable est l'absence de séparation stricte entre façade publique et mapper privé, mais le fichier reste court.

## Lecture V20

Ce domaine n'a pas besoin de modularisation immédiate.

Il sert de référence pour un repository simple :

- un contrat public clair
- peu d'exports
- peu de logique privée
