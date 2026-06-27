#!/usr/bin/env bash
# scripts/backup.sh — Sauvegarde complète Creatyss (DB + uploads + documents).
#
# Usage :
#   bash scripts/backup.sh
#   BACKUP_DIR=/mnt/nas/creatyss bash scripts/backup.sh
#
# Produit dans BACKUP_DIR avec horodatage commun :
#   creatyss-YYYYMMDD-HHMMSS.dump        — dump PostgreSQL (format custom -Fc)
#   uploads-YYYYMMDD-HHMMSS.tar.gz       — volume uploads_data (images, médias)
#   documents-YYYYMMDD-HHMMSS.tar.gz     — volume documents_data (PDFs Factur-X)
#
# Les volumes sont accédés via un conteneur alpine éphémère : le chemin hôte
# n'existe pas en dehors du conteneur (volumes Docker nommés, pas bind-mounts).
#
# Variables d'environnement :
#   BACKUP_DIR   — destination (défaut : /opt/backups/creatyss)
#
# Prérequis :
#   — docker disponible sur PATH
#   — conteneurs creatyss-db et creatyss-app en cours d'exécution
#   — .env présent avec POSTGRES_USER et POSTGRES_DB
#   — image alpine:3 disponible (docker pull alpine:3 si besoin)

set -Eeuo pipefail

# ── Répertoires ───────────────────────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
ENV_FILE="${PROJECT_DIR}/.env"
BACKUP_DIR="${BACKUP_DIR:-/opt/backups/creatyss}"

# ── Affichage ─────────────────────────────────────────────────────────────────
if [ -t 1 ]; then
  C_GREEN='\033[0;32m'; C_YELLOW='\033[1;33m'; C_RED='\033[0;31m'
  C_BOLD='\033[1m'; C_RESET='\033[0m'
else
  C_GREEN=''; C_YELLOW=''; C_RED=''; C_BOLD=''; C_RESET=''
fi
ok()   { printf "${C_GREEN}  ✓${C_RESET} %s\n" "$*"; }
warn() { printf "${C_YELLOW}  ⚠${C_RESET} %s\n" "$*" >&2; }
die()  { printf "${C_RED}  ✗${C_RESET} %s\n" "$*" >&2; exit 1; }

# ── Lecture .env ──────────────────────────────────────────────────────────────
[ -f "${ENV_FILE}" ] || die ".env absent de ${PROJECT_DIR}"
env_get() {
  grep -E "^${1}=" "${ENV_FILE}" | head -1 | cut -d'=' -f2- | tr -d '"' | tr -d "'"
}

POSTGRES_USER="$(env_get POSTGRES_USER)"
POSTGRES_DB="$(env_get POSTGRES_DB)"
[ -n "${POSTGRES_USER}" ] || die "POSTGRES_USER non définie dans .env"
[ -n "${POSTGRES_DB}" ]   || die "POSTGRES_DB non définie dans .env"

# ── Prérequis runtime ─────────────────────────────────────────────────────────
command -v docker >/dev/null 2>&1 || die "docker non trouvé sur PATH"
docker inspect creatyss-db >/dev/null 2>&1  || die "conteneur creatyss-db non trouvé — DB en cours d'exécution ?"
docker inspect creatyss-app >/dev/null 2>&1 || warn "conteneur creatyss-app absent — backup volumes ignoré"

# ── Initialisation ────────────────────────────────────────────────────────────
DATESTAMP="$(date +%Y%m%d-%H%M%S)"
mkdir -p "${BACKUP_DIR}"

printf "\n${C_BOLD}Sauvegarde Creatyss — %s${C_RESET}\n" "${DATESTAMP}"
printf "  Destination : %s\n\n" "${BACKUP_DIR}"

# ── 1. PostgreSQL (format custom compressé) ───────────────────────────────────
DB_FILE="${BACKUP_DIR}/creatyss-${DATESTAMP}.dump"
printf "  Base de données (%s/%s)…\n" "${POSTGRES_USER}" "${POSTGRES_DB}"
# pg_dump -Fc : format custom, compressé, restauration sélective possible.
# On passe par docker exec pour rester dans le réseau compose — pg n'expose
# aucun port hôte en production.
docker exec creatyss-db pg_dump -Fc \
  -U "${POSTGRES_USER}" \
  -d "${POSTGRES_DB}" \
  > "${DB_FILE}"
[ -s "${DB_FILE}" ] || die "Dump PostgreSQL vide ou absent — vérifier l'état de creatyss-db"
ok "Base : $(du -sh "${DB_FILE}" | cut -f1)  →  $(basename "${DB_FILE}")"

# ── 2. Uploads (volume Docker nommé) ──────────────────────────────────────────
APP_UP=0
docker inspect creatyss-app >/dev/null 2>&1 && APP_UP=1

if [ "${APP_UP}" -eq 1 ]; then
  # Résolution dynamique du nom du volume : évite d'assumer le nom du projet
  # compose (dépend du nom du répertoire de déploiement).
  UPLOADS_VOLUME="$(docker inspect creatyss-app \
    --format '{{range .Mounts}}{{if eq .Destination "/app/public/uploads"}}{{.Name}}{{end}}{{end}}')"
  DOCUMENTS_VOLUME="$(docker inspect creatyss-app \
    --format '{{range .Mounts}}{{if eq .Destination "/app/storage/documents"}}{{.Name}}{{end}}{{end}}')"

  # ── Uploads ────────────────────────────────────────────────────────────────
  UPLOADS_FILE="${BACKUP_DIR}/uploads-${DATESTAMP}.tar.gz"
  if [ -n "${UPLOADS_VOLUME}" ]; then
    printf "  Uploads (volume : %s)…\n" "${UPLOADS_VOLUME}"
    # Conteneur alpine éphémère : monte le volume en lecture seule, écrit
    # l'archive dans BACKUP_DIR monté en écriture sur /backup.
    docker run --rm \
      -v "${UPLOADS_VOLUME}:/data:ro" \
      -v "${BACKUP_DIR}:/backup" \
      alpine:3 \
      tar -czf "/backup/uploads-${DATESTAMP}.tar.gz" -C /data .
    ok "Uploads : $(du -sh "${UPLOADS_FILE}" | cut -f1)  →  $(basename "${UPLOADS_FILE}")"
  else
    warn "Volume uploads introuvable sur creatyss-app — ignoré"
  fi

  # ── Documents Factur-X ─────────────────────────────────────────────────────
  DOCUMENTS_FILE="${BACKUP_DIR}/documents-${DATESTAMP}.tar.gz"
  if [ -n "${DOCUMENTS_VOLUME}" ]; then
    printf "  Documents Factur-X (volume : %s)…\n" "${DOCUMENTS_VOLUME}"
    docker run --rm \
      -v "${DOCUMENTS_VOLUME}:/data:ro" \
      -v "${BACKUP_DIR}:/backup" \
      alpine:3 \
      tar -czf "/backup/documents-${DATESTAMP}.tar.gz" -C /data .
    ok "Documents : $(du -sh "${DOCUMENTS_FILE}" | cut -f1)  →  $(basename "${DOCUMENTS_FILE}")"
  else
    warn "Volume documents introuvable sur creatyss-app — ignoré"
  fi
else
  warn "creatyss-app absent — backup volumes (uploads, documents) ignoré"
fi

# ── Résumé ────────────────────────────────────────────────────────────────────
printf "\n${C_GREEN}${C_BOLD}Sauvegarde complète${C_RESET} — %s\n" "${DATESTAMP}"
printf "  Emplacement : %s\n\n" "${BACKUP_DIR}"
printf "  Rappel : copier la sauvegarde hors du VPS (scp, rsync…)\n"
printf "  cf. docs/exploitation/02-sauvegarde-restauration-db.md\n\n"
