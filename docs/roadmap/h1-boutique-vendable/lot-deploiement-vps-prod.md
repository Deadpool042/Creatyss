# Lot — Déploiement VPS production

## Statut

Clos (staging) — déploiement complet via `scripts/deploy.sh` validé le 2026-06-29 sur `https://staging.creatyss.lpwebstudio.fr`.

Production finale `creatyss.fr` : non encore basculée — non validée.

## Objectif

Valider le build de l'image Docker et rendre le déploiement VPS répétable depuis zéro, de sorte que la boutique soit accessible publiquement sur le VPS OVH avec HTTPS.

## Preuves — test du 2026-06-29

Exécution complète de `scripts/deploy.sh` sur VPS OVH :

- URL staging : `https://staging.creatyss.lpwebstudio.fr` — HTTPS : HTTP/2 200
- Healthcheck interne : `{"app":"ok","database":"ok","uploads":"ready",...}`
- Commit déployé : `062b2d4c` — `fix(deploy): use IPv4 loopback for container healthcheck`
- Image rollback disponible : `creatyss:prod-20260629-084301`
- Log de déploiement : `/tmp/creatyss-deploy-20260629-084301.log`
- Sauvegardes produites :
  - `/opt/backups/creatyss/creatyss-20260629-084532.dump`
  - `/opt/backups/creatyss/uploads-20260629-084532.tar.gz`
  - `/opt/backups/creatyss/documents-20260629-084532.tar.gz`
- Conteneurs après test : `creatyss-app` up · `creatyss-db` healthy · `creatyss-caddy` up

## Preuves — recette commerce staging du 2026-06-29

Déploiement de `47aefc40` sur staging, recette commerce exécutée :

- Commit déployé : `47aefc40` — `fix(seed): populate catalog prices for variable products`
- Backup pré-déploiement : `20260629-205224`
- Image rollback : `creatyss:prod-20260629-204948`
- Feature flags : 32/32 matérialisés après `db:seed`
- Prix canoniques vérifiés en DB (4 produits : mini-sac-clarte 9 900 c / 99,00 EUR, bandouliere-rivoli 12 900 c / 129,00 EUR, pochette-nocturne 5 900 c / 59,00 EUR, cabas-atelier 15 900 c / 159,00 EUR)
- Parcours virement validé : boutique → fiche produit → panier → checkout → livraison standard → virement → commande créée
- Commandes DB : `CRY-XPDCA6TTXG` 105,90 EUR · `CRY-6DCG97F94E` 135,90 EUR
- Stripe non configuré sur staging — recette Stripe non exécutée
- Détail : `docs/exploitation/06-recette-commerce-complete.md`

---

## À surveiller

Points non bloquants observés lors du test du 2026-06-29 :

1. ~~**Image manquante** : log app signale `image invalide ou absente pour /uploads/savoir-faire-placeholder.webp`~~ — **résolu** : l'image placeholder est versionnée dans le repo (`/uploads/savoir-faire-placeholder.webp` remplacé par un asset versionné), les médias dynamiques sont maintenant servis via Caddy (volume `uploads_data` monté en `:ro` dans Caddy, handle_path `/uploads/*`).
2. **Propriétaire des backups** : les archives uploads et documents sont générées avec `root:root` sur le VPS — à surveiller si la rotation automatique tourne sous un utilisateur non-root.

---

## Périmètre

Validé en staging (2026-06-28) :

- `Dockerfile.prod` — build image validé sur VPS OVH
- `docker-compose.prod.yml` — démarrage runtime validé, PostgreSQL healthy
- `docker/caddy/Caddyfile` — Caddy actif, certificat Let's Encrypt obtenu
- `docs/exploitation/` — documentation complète (variables d'environnement, sauvegardes, médias, mise à jour/rollback, clonage instance)
- Premier déploiement depuis zéro exécuté sur VPS OVH, store/admin bootstrapés, mot de passe admin changé
- HTTPS validé : HTTP/2 200 + HSTS sur `https://staging.creatyss.lpwebstudio.fr`
- Scripts d'exploitation validés : `scripts/deploy.sh`, `scripts/backup.sh`, `scripts/prune-backups.sh`, `scripts/healthcheck.sh`
- Sauvegardes manuelles validées, cron sauvegarde/rotation configuré
- Sécurité : UFW, Fail2Ban, unattended-upgrades, swap configurés

Restauration DB isolée validée (2026-06-28) :

- Dump `creatyss-20260627-150330.dump` restauré dans une base temporaire `creatyss_restore_test`
- 173 tables présentes après restauration
- Base principale `creatyss` non touchée
- Base temporaire supprimée après vérification

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

- [x] L'image Docker se build sans erreur — validé sur VPS (2026-06-28)
- [x] La boutique est accessible publiquement via HTTPS — staging opérationnel (2026-06-28)
- [x] Un redéploiement depuis zéro est exécutable en moins d'une heure en suivant `docs/exploitation/`
- [x] Restauration DB isolée validée — dump → `creatyss_restore_test`, 173 tables, base principale intacte (2026-06-28)
- [x] Les cases dans `projet-creatyss.md` (build Docker, déploiement VPS répétable) cochées (2026-06-28)
- [x] Déploiement complet via `scripts/deploy.sh` validé sur staging (2026-06-29) — cf. section Preuves
- [ ] Bascule production finale `creatyss.fr` — non encore exécutée

## Agent recommandé

`repo-refactor` pour la validation et l'ajustement des fichiers Docker/Caddy. Validation humaine obligatoire pour les étapes de déploiement réel.
