#!/usr/bin/env bash
# scripts/healthcheck.sh — Vérification de l'état de Creatyss en production.
#
# Contrôles effectués :
#   1. Présence des conteneurs dans docker compose ps
#   2. creatyss-db : healthcheck Docker natif (pg_isready)
#   3. creatyss-app : état running (HTTP vérifié via HTTPS public §5)
#   4. creatyss-caddy : état running
#   5. HTTPS : réponse du domaine public (curl)
#   6. En-tête HSTS présent dans la réponse
#
# Retour :
#   exit 0  — tout OK (affiche "OK")
#   exit 1  — au moins une vérification échouée (liste les erreurs)
#
# Usage :
#   bash scripts/healthcheck.sh
#   bash scripts/healthcheck.sh ; echo "exit: $?"
#
# Note : pas de set -e — on veut collecter toutes les erreurs, pas s'arrêter
# au premier échec. On utilise 'set -uo pipefail' pour les autres protections.

set -uo pipefail

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

# Tableau d'erreurs accumulées (bash array — non POSIX sh).
ERRORS=()
ok()   { printf "${C_GREEN}  ✓${C_RESET} %s\n" "$*"; }
fail() { printf "${C_RED}  ✗${C_RESET} %s\n" "$*"; ERRORS+=("$*"); }
warn() { printf "${C_YELLOW}  ⚠${C_RESET} %s\n" "$*"; }

printf "\n${C_BOLD}Healthcheck Creatyss${C_RESET} — $(date '+%Y-%m-%d %H:%M:%S')\n\n"

# ── Lecture .env ──────────────────────────────────────────────────────────────
APP_DOMAIN=""
if [ ! -f "${ENV_FILE}" ]; then
  fail ".env absent de ${PROJECT_DIR} — APP_DOMAIN inconnu"
else
  env_get() {
    grep -E "^${1}=" "${ENV_FILE}" | head -1 | cut -d'=' -f2- | tr -d '"' | tr -d "'"
  }
  APP_DOMAIN="$(env_get APP_DOMAIN || true)"
  [ -n "${APP_DOMAIN}" ] || fail "APP_DOMAIN non définie dans .env"
fi

# ── 1. Conteneurs actifs ──────────────────────────────────────────────────────
printf "${C_BOLD}Conteneurs${C_RESET}\n"
if [ -f "${COMPOSE_FILE}" ]; then
  if ! docker compose -f "${COMPOSE_FILE}" ps 2>/dev/null | grep -q "creatyss"; then
    fail "Aucun conteneur Creatyss actif (docker compose ps vide)"
  fi
else
  fail "docker-compose.prod.yml absent — impossible de vérifier les services"
fi

# ── 2. Base de données ────────────────────────────────────────────────────────
# La DB a un healthcheck natif dans le compose (pg_isready).
DB_STATE=$(docker inspect creatyss-db --format '{{.State.Status}}' 2>/dev/null || echo "absent")
DB_HEALTH=$(docker inspect creatyss-db --format '{{.State.Health.Status}}' 2>/dev/null || echo "no-healthcheck")

case "${DB_HEALTH}" in
  healthy)  ok "creatyss-db : healthy" ;;
  starting) warn "creatyss-db : démarrage en cours (starting)" ;;
  "")
    # Pas de healthcheck configuré ou conteneur non trouvé
    [ "${DB_STATE}" = "running" ] && ok "creatyss-db : running (pas de healthcheck natif)" \
                                   || fail "creatyss-db : ${DB_STATE} (attendu : running)" ;;
  *)
    fail "creatyss-db : health=${DB_HEALTH}, state=${DB_STATE} (attendu : healthy)" ;;
esac

# ── 3. Application ────────────────────────────────────────────────────────────
# Le port 3000 n'est pas publié sur l'hôte (seul Caddy accède à app:3000 via
# le réseau Docker). La disponibilité HTTP est vérifiée à l'étape HTTPS (§5).
APP_STATE=$(docker inspect creatyss-app --format '{{.State.Status}}' 2>/dev/null || echo "absent")
if [ "${APP_STATE}" = "running" ]; then
  ok "creatyss-app : running"
else
  fail "creatyss-app : ${APP_STATE} (attendu : running)"
fi

# ── 4. Caddy ──────────────────────────────────────────────────────────────────
CADDY_STATE=$(docker inspect creatyss-caddy --format '{{.State.Status}}' 2>/dev/null || echo "absent")
if [ "${CADDY_STATE}" = "running" ]; then
  ok "creatyss-caddy : running"
else
  fail "creatyss-caddy : ${CADDY_STATE} (attendu : running)"
fi

# ── 5. HTTPS + domaine ────────────────────────────────────────────────────────
printf "\n${C_BOLD}HTTPS${C_RESET}\n"
if [ -n "${APP_DOMAIN}" ]; then
  if command -v curl >/dev/null 2>&1; then
    # -sI : headers uniquement, silencieux. --max-time : évite de bloquer.
    HTTP_HEADERS=$(curl -sI --max-time 15 "https://${APP_DOMAIN}/" 2>/dev/null || echo "")
    HTTP_CODE=$(printf '%s' "${HTTP_HEADERS}" | head -1 | awk '{print $2}')

    if [ -n "${HTTP_CODE}" ] && [ "${HTTP_CODE}" -ge 200 ] && [ "${HTTP_CODE}" -lt 400 ] 2>/dev/null; then
      ok "HTTPS : HTTP ${HTTP_CODE} — https://${APP_DOMAIN}/"
    else
      fail "HTTPS : réponse ${HTTP_CODE:-aucune} — https://${APP_DOMAIN}/ (DNS propagé ? Caddy démarré ?)"
    fi

    # En-tête HSTS (Caddyfile injecte Strict-Transport-Security).
    if printf '%s' "${HTTP_HEADERS}" | grep -qi "strict-transport-security"; then
      ok "HSTS : Strict-Transport-Security présent"
    else
      warn "HSTS : en-tête Strict-Transport-Security absent — Caddy correctement configuré ?"
    fi
  else
    warn "curl absent sur l'hôte — vérification HTTPS ignorée"
    warn "Installer curl : apt install curl  ou  yum install curl"
  fi
else
  warn "APP_DOMAIN non disponible — vérification HTTPS ignorée"
fi

# ── Résultat ──────────────────────────────────────────────────────────────────
printf "\n"
if [ ${#ERRORS[@]} -eq 0 ]; then
  printf "${C_GREEN}${C_BOLD}OK${C_RESET}\n\n"
  exit 0
else
  printf "${C_RED}${C_BOLD}ERREURS DÉTECTÉES (%d)${C_RESET}\n" "${#ERRORS[@]}"
  for err in "${ERRORS[@]}"; do
    printf "  — %s\n" "${err}"
  done
  printf "\n"
  exit 1
fi
