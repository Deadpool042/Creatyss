#!/usr/bin/env bash
# scripts/prune-backups.sh — Rotation automatique des sauvegardes Creatyss.
#
# Supprime les fichiers de sauvegarde plus anciens que KEEP_DAYS jours.
# Ne touche QU'AUX fichiers correspondant aux patterns de sauvegarde Creatyss :
#   creatyss-*.dump          — dumps PostgreSQL
#   uploads-*.tar.gz         — archives uploads
#   documents-*.tar.gz       — archives documents
#
# Usage :
#   bash scripts/prune-backups.sh
#   KEEP_DAYS=7  bash scripts/prune-backups.sh
#   BACKUP_DIR=/mnt/nas/creatyss KEEP_DAYS=90 bash scripts/prune-backups.sh
#
# Variables d'environnement :
#   KEEP_DAYS   — rétention en jours (défaut : 30)
#   BACKUP_DIR  — répertoire de sauvegarde (défaut : /opt/backups/creatyss)
#
# Sécurités :
#   -maxdepth 1 : jamais de suppression récursive dans les sous-répertoires
#   patterns stricts : seuls les fichiers nommés par backup.sh sont ciblés
#   -print0 / read -d '' : noms de fichiers avec espaces ou caractères spéciaux

set -Eeuo pipefail

KEEP_DAYS="${KEEP_DAYS:-30}"
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

# ── Garde-fous ────────────────────────────────────────────────────────────────
# Valider que KEEP_DAYS est un entier positif (évite -mtime +0 ou +abc).
case "${KEEP_DAYS}" in
  ''|*[!0-9]*) printf "${C_RED}  ✗${C_RESET} KEEP_DAYS doit être un entier positif (valeur : %s)\n" "${KEEP_DAYS}" >&2; exit 1 ;;
esac
[ "${KEEP_DAYS}" -ge 1 ] || { printf "${C_RED}  ✗${C_RESET} KEEP_DAYS doit être ≥ 1\n" >&2; exit 1; }

if [ ! -d "${BACKUP_DIR}" ]; then
  warn "Répertoire ${BACKUP_DIR} inexistant — rien à faire"
  exit 0
fi

printf "\n${C_BOLD}Rotation des sauvegardes${C_RESET}\n"
printf "  Répertoire  : %s\n" "${BACKUP_DIR}"
printf "  Rétention   : %s jours\n\n" "${KEEP_DAYS}"

DELETED=0

# ── Fonction de purge ─────────────────────────────────────────────────────────
# Parcourt find avec -print0 pour gérer les noms avec espaces.
# -maxdepth 1 : ne jamais descendre dans les sous-répertoires.
# -mtime +N   : modifié il y a plus de N jours (N+1 jours au plus tôt).
prune_pattern() {
  local pattern="$1"
  while IFS= read -r -d '' file; do
    printf "  Suppression : %s\n" "$(basename "${file}")"
    rm -f "${file}"
    DELETED=$((DELETED + 1))
  done < <(find "${BACKUP_DIR}" -maxdepth 1 -name "${pattern}" -mtime "+${KEEP_DAYS}" -print0 2>/dev/null)
}

# Dumps PostgreSQL produits par backup.sh
prune_pattern 'creatyss-*.dump'

# Archives uploads produits par backup.sh
prune_pattern 'uploads-*.tar.gz'

# Archives documents produits par backup.sh
prune_pattern 'documents-*.tar.gz'

# ── Résumé ────────────────────────────────────────────────────────────────────
if [ "${DELETED}" -eq 0 ]; then
  ok "Aucun fichier à supprimer (rétention : ${KEEP_DAYS} j)"
else
  ok "${DELETED} fichier(s) supprimé(s) antérieur(s) à ${KEEP_DAYS} jours"
fi

# Afficher ce qui reste
REMAINING=$(find "${BACKUP_DIR}" -maxdepth 1 \( -name 'creatyss-*.dump' -o -name 'uploads-*.tar.gz' -o -name 'documents-*.tar.gz' \) | wc -l | tr -d ' ')
printf "\n  %s fichier(s) conservé(s) dans %s\n\n" "${REMAINING}" "${BACKUP_DIR}"
