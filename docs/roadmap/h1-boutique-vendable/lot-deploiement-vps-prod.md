# Lot — Déploiement VPS production

## Statut

En cours (partiellement documenté, non validé en production)

## Objectif

Valider le build de l'image Docker et rendre le déploiement VPS répétable depuis zéro, de sorte que la boutique soit accessible publiquement sur le VPS OVH avec HTTPS.

## Périmètre

Proposition — état partiel observé, reste à valider :

- `Dockerfile.prod` — écrit (observé dans `projet-creatyss.md`), build image non validé (case non cochée)
- `docker-compose.prod.yml` — présence documentée, validation runtime non observée
- `docker/caddy/Caddyfile` — Caddy retenu comme reverse proxy (documenté 2026-06-12)
- `docs/exploitation/` — documentation complète observée (variables d'environnement, sauvegardes, médias, mise à jour/rollback, clonage instance)
- Procédure de premier déploiement depuis zéro sur VPS OVH
- Validation HTTPS et certificat TLS automatique (Caddy)
- Configuration des variables d'environnement de production (`.env.prod` ou équivalent)
- Test de la procédure de sauvegarde et restauration DB en conditions réelles

## Hors périmètre

- CDN
- Auto-scaling ou multi-instance
- CI/CD automatisé (pipeline GitHub Actions ou équivalent)
- Monitoring avancé (couvert par `maintenance.observability` déjà L3)

## Dépendances

- VPS OVH provisionné avec Docker installé
- DNS configuré et pointant vers le VPS
- Certificat TLS (géré automatiquement par Caddy si DNS correct)
- `pnpm run build` passe localement (observé comme vrai)

## Invariants

- `db:push --accept-data-loss` ne doit jamais être exécuté en production sans sauvegarde préalable (point d'attention documenté dans `projet-creatyss.md`)
- Les secrets ne doivent pas être committés dans le repo
- La procédure doit être exécutable par une seule personne depuis zéro en moins d'une heure (critère H3 initial)

## Risques

- `--accept-data-loss` dans `db:push` : dangereux en production — toujours sauvegarder avant
- Absence de migrations Prisma formelles : le schéma est géré par `db:push`, ce qui est acceptable pour une boutique single-instance mais risqué sans sauvegarde systématique
- Médias persistants : le volume Docker pour `/public/uploads` doit être monté correctement, sinon les images sont perdues à chaque redéploiement
- Caddy et le certificat TLS nécessitent que le port 80/443 soit accessible depuis l'extérieur — vérifier les règles de pare-feu OVH

## Vérifications

- Build image Docker : `docker build -f Dockerfile.prod -t creatyss-prod .` sans erreur
- `docker-compose.prod.yml up` démarre l'application sans erreur
- HTTPS accessible sur le domaine cible
- Sauvegarde DB testée et restauration vérifiée sur données réelles
- Redéploiement répété (update → restart) sans perte de données

## Critères de fin

- L'image Docker se build sans erreur
- La boutique est accessible publiquement via HTTPS sur le domaine de production
- Un redéploiement depuis zéro est exécutable en moins d'une heure en suivant `docs/exploitation/`
- La sauvegarde et la restauration DB ont été testées une fois en conditions réelles
- Les cases non cochées dans `projet-creatyss.md` (build Docker, déploiement VPS répétable) peuvent être cochées

## Agent recommandé

`repo-refactor` pour la validation et l'ajustement des fichiers Docker/Caddy. Validation humaine obligatoire pour les étapes de déploiement réel.
