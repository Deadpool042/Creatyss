#!/usr/bin/env bash
# scripts/deploy.sh — Déploiement Creatyss (mise à jour production).
#
# Usage (depuis la racine du projet sur le VPS) :
#   bash scripts/deploy.sh
#
# Ce script exécute dans l'ordre :
#   1. Vérification des prérequis
#   2. git pull (fast-forward uniquement)
#   3. Reconstruction de l'image avec tag daté (permet rollback)
#   4. Sauvegarde complète (DB + volumes) avant modification de schéma
#   5. Synchronisation du schéma Prisma (db:push)
#   6. Recréation du conteneur app sur la nouvelle image
#   7. Attente de disponibilité (max 60 s)
#   8. Vérification HTTPS
#   9. Résumé
#
# S'arrête immédiatement sur toute erreur (set -Eeuo pipefail).

set -Eeuo pipefail

# ── Répertoires ───────────────────────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
COMPOSE_FILE="${PROJECT_DIR}/docker-compose.prod.yml"
ENV_FILE="${PROJECT_DIR}/.env"

# ── Affichage ─────────────────────────────────────────────────────────────────
if [ -t 1 ]; then
  C_GREEN='\033[0;32m'; C_YELLOW='\033[1;33m'; C_RED='\033[0;31m'
  C_BOLD='\033[1m'; C_RESET='\033[0m'
else
  C_GREEN=''; C_YELLOW=''; C_RED=''; C_BOLD=''; C_RESET=''
fi
step() { printf "\n${C_BOLD}[%s]${C_RESET} %s\n" "$(date +%H:%M:%S)" "$*"; }
ok()   { printf "${C_GREEN}  ✓${C_RESET} %s\n" "$*"; }
warn() { printf "${C_YELLOW}  ⚠${C_RESET} %s\n" "$*" >&2; }
die()  { printf "${C_RED}  ✗${C_RESET} %s\n" "$*" >&2; exit 1; }

# ── Lecture .env ──────────────────────────────────────────────────────────────
# Extrait une variable par nom sans sourcer le fichier entier (sécurité).
env_get() {
  grep -E "^${1}=" "${ENV_FILE}" | head -1 | cut -d'=' -f2- | tr -d '"' | tr -d "'"
}

# ── 0. Prérequis ──────────────────────────────────────────────────────────────
step "Vérification des prérequis"

command -v docker      >/dev/null 2>&1 || die "docker non trouvé sur PATH"
docker compose version >/dev/null 2>&1 || die "plugin docker compose non disponible"
command -v git         >/dev/null 2>&1 || die "git non trouvé sur PATH"
[ -f "${ENV_FILE}" ]    || die ".env absent de ${PROJECT_DIR} — copier .env.example et renseigner"
[ -f "${COMPOSE_FILE}" ] || die "docker-compose.prod.yml absent de ${PROJECT_DIR}"

APP_DOMAIN="$(env_get APP_DOMAIN)"
[ -n "${APP_DOMAIN}" ] || die "APP_DOMAIN non définie dans .env"

ok "Docker $(docker --version | awk '{print $3}' | tr -d ',')"
ok "Compose $(docker compose version --short 2>/dev/null || echo 'ok')"
ok ".env présent (APP_DOMAIN=${APP_DOMAIN})"

DATESTAMP="$(date +%Y%m%d-%H%M%S)"
IMAGE_TAG="creatyss:prod-${DATESTAMP}"
cd "${PROJECT_DIR}"

# ── 1. git pull ───────────────────────────────────────────────────────────────
step "Récupération des sources (git pull)"
# --ff-only refuse les merges implicites : oblige à résoudre manuellement.
git pull --ff-only || die "git pull a échoué — résoudre le conflit manuellement"
ok "Sources à jour : $(git log -1 --format='%h — %s')"

# ── 2. Construction de l'image ────────────────────────────────────────────────
step "Construction de l'image Docker"
# Le build compose produit 'creatyss:prod' (image: définie dans le compose).
docker compose -f "${COMPOSE_FILE}" build
# Tag daté : conservé pour rollback manuel (docker run creatyss:prod-YYYYMMDD…).
docker tag creatyss:prod "${IMAGE_TAG}"
ok "Image creatyss:prod construite"
ok "Tag de rollback : ${IMAGE_TAG}"

# ── 3. Sauvegarde pré-déploiement ─────────────────────────────────────────────
step "Sauvegarde pré-déploiement (DB + volumes)"
# Obligatoire avant db:push — pas de rollback de schéma sans elle.
BACKUP_SCRIPT="${SCRIPT_DIR}/backup.sh"
if [ -x "${BACKUP_SCRIPT}" ]; then
  bash "${BACKUP_SCRIPT}" || die "Sauvegarde échouée — déploiement annulé"
  ok "Sauvegarde réalisée"
else
  warn "backup.sh absent ou non exécutable — sauvegarde ignorée (RISQUE)"
  warn "Continuer sans sauvegarde ? Ctrl-C pour annuler, Entrée pour forcer (timeout 30 s)."
  if ! read -r -t 30; then
    die "Pas de réponse — déploiement annulé"
  fi
fi

# ── 4. Synchronisation du schéma Prisma ──────────────────────────────────────
step "Synchronisation du schéma Prisma (db:push)"
# Le service db-push est sous profile jobs — ne démarre pas avec 'up' standard.
# --accept-data-loss est embarqué dans le script package.json (cf. doc 04).
docker compose -f "${COMPOSE_FILE}" --profile jobs run --rm db-push
ok "Schéma synchronisé"

# ── 5. Recréation du conteneur app ───────────────────────────────────────────
step "Redémarrage de l'application"
# --force-recreate recharge les variables .env et l'image fraîchement buildée.
docker compose -f "${COMPOSE_FILE}" up -d --force-recreate app
ok "Conteneur app recréé"

# ── 6. Attente de disponibilité ───────────────────────────────────────────────
step "Attente de disponibilité (max 60 s)"
# L'app n'expose pas de port hôte : on passe par docker exec.
# node:22-alpine dispose de wget (busybox) — pas de curl dans l'image.
READY=0
for i in $(seq 1 30); do
  if docker exec creatyss-app sh -lc 'wget -qO- http://127.0.0.1:3000/api/health | grep -q "\"app\":\"ok\""' 2>/dev/null; then
    READY=1
    break
  fi
  printf "    … tentative %d/30\r" "${i}"
  sleep 2
done
printf "\n"
[ "${READY}" -eq 1 ] || die "L'application n'a pas répondu après 60 s — consulter : docker compose -f docker-compose.prod.yml logs app"
ok "Application prête — /api/health OK"

# ── 7. Vérification HTTPS ─────────────────────────────────────────────────────
step "Vérification HTTPS (https://${APP_DOMAIN}/)"
if command -v curl >/dev/null 2>&1; then
  HTTP_CODE="$(curl -s -o /dev/null -w "%{http_code}" --max-time 15 "https://${APP_DOMAIN}/" || echo '000')"
  if [ "${HTTP_CODE}" -ge 200 ] && [ "${HTTP_CODE}" -lt 400 ] 2>/dev/null; then
    ok "HTTPS répond : HTTP ${HTTP_CODE}"
  else
    # Non bloquant : Caddy peut encore négocier le certificat (< 30 s).
    warn "Réponse HTTP : ${HTTP_CODE} — Caddy peut encore être en cours de négociation TLS"
    warn "Vérifier : docker compose -f docker-compose.prod.yml logs caddy"
  fi
else
  warn "curl absent — vérification HTTPS ignorée"
  warn "Vérifier manuellement : curl -I https://${APP_DOMAIN}/"
fi

# ── Résumé ────────────────────────────────────────────────────────────────────
printf "\n${C_GREEN}${C_BOLD}══════════════════════════════════════════${C_RESET}\n"
printf "${C_GREEN}${C_BOLD}  Déploiement terminé${C_RESET}  %s\n" "$(date '+%Y-%m-%d %H:%M:%S')"
printf "${C_GREEN}${C_BOLD}══════════════════════════════════════════${C_RESET}\n"
printf "  Image     : %s\n"  "${IMAGE_TAG}"
printf "  Commit    : %s\n"  "$(git log -1 --format='%h — %s')"
printf "  URL       : https://%s/\n" "${APP_DOMAIN}"
printf "\n"
printf "  En cas de problème :\n"
printf "    docker compose -f docker-compose.prod.yml logs -f app\n"
printf "    docker compose -f docker-compose.prod.yml logs -f caddy\n"
printf "\n"
