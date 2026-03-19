# Repository admin `users`

## Rôle

`admin-users.repository.ts` gère la persistance minimale des comptes admin utilisés par l'authentification interne.

Le domaine couvre :

- recherche par email
- recherche par id
- création

## Structure actuelle

Fichiers :

- `admin-users.repository.ts`
- `admin-users.types.ts`

Contrats publics :

- `AdminUser`
- `AdminUserWithPassword`
- `CreateAdminUserInput`

## Fonctions publiques actuelles

- `findAdminUserByEmail(email)`
- `findAdminUserById(id)`
- `createAdminUser(input)`

## Comportements observables

- recherche email insensible à la casse
- mapping explicite `display_name` → `displayName`
- exposition de `passwordHash` uniquement via `AdminUserWithPassword`

## Limites actuelles

Le domaine est volontairement minimal.

Il n'expose pas d'erreur publique dédiée et ne contient pas de transaction. Le fichier reste donc simple, mais non encore modulé.

## Lecture V20

Ce domaine peut rester monolithique tant qu'il garde cette taille.

Le seul garde-fou important est de ne pas élargir ce repository au-delà de sa responsabilité d'authentification admin.
