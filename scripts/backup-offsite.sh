#!/usr/bin/env bash
# scripts/backup-offsite.sh — Copie des sauvegardes Creatyss hors VPS.
#
# Mode : pull rsync SSH depuis la machine locale vers /opt/backups/creatyss
# sur le VPS. La machine locale initie la connexion (IP VPS stable).
#
# Usage :
#   bash scripts/backup-offsite.sh
#
# Variables d'environnement requises :
#   BACKUP_REMOTE_USER   — utilisateur SSH sur le VPS (ex : ubuntu)
#   BACKUP_REMOTE_HOST   — hostname ou IP du VPS
#   BACKUP_REMOTE_DIR    — répertoire backups sur le VPS (ex : /opt/backups/creatyss)
#   BACKUP_LOCAL_DIR     — destination locale (ex : $HOME/Backups/creatyss)
#   BACKUP_SSH_KEY       — clé SSH privée dédiée (ex : $HOME/.ssh/id_backup_creatyss)
#   BACKUP_KEEP_DAYS     — rétention locale en jours (défaut : 90)
#
# Ne jamais passer les variables via .env ou argument — les définir dans
# l'environnement local ou le cron, jamais dans Git.
#
# Prérequis VPS :
#   — clé publique ajoutée dans ~/.ssh/authorized_keys sur l'utilisateur BACKUP_REMOTE_USER
#   — rrsync configuré avec command= (recommandé) ou accès lecture à BACKUP_REMOTE_DIR
#   — cf. docs/exploitation/02-sauvegarde-restauration-db.md pour la procédure complète
#
# Ce script ne supprime rien côté VPS.
# Copie contrôlée depuis LP-INFRA — templates/infra/backup-offsite-template.sh

set -Eeuo pipefail

# ── Variables ─────────────────────────────────────────────────────────────────

BACKUP_REMOTE_USER="${BACKUP_REMOTE_USER:?Variable BACKUP_REMOTE_USER requise}"
BACKUP_REMOTE_HOST="${BACKUP_REMOTE_HOST:?Variable BACKUP_REMOTE_HOST requise}"
BACKUP_REMOTE_DIR="${BACKUP_REMOTE_DIR:?Variable BACKUP_REMOTE_DIR requise}"
BACKUP_LOCAL_DIR="${BACKUP_LOCAL_DIR:?Variable BACKUP_LOCAL_DIR requise}"
BACKUP_SSH_KEY="${BACKUP_SSH_KEY:?Variable BACKUP_SSH_KEY requise}"
BACKUP_KEEP_DAYS="${BACKUP_KEEP_DAYS:-90}"

LOG_DIR="${BACKUP_LOCAL_DIR}/logs"

# ── Affichage ─────────────────────────────────────────────────────────────────

if [ -t 1 ]; then
  C_GREEN='\033[0;32m'; C_YELLOW='\033[1;33m'; C_RED='\033[0;31m'
  C_BOLD='\033[1m'; C_RESET='\033[0m'
else
  C_GREEN=''; C_YELLOW=''; C_RED=''; C_BOLD=''; C_RESET=''
fi

log() {
  local ts
  ts="$(date -u '+%Y-%m-%dT%H:%M:%SZ')"
  printf "[%s] %s\n" "${ts}" "$*"
}
ok()   { printf "${C_GREEN}  ✓${C_RESET} %s\n" "$*"; log "OK    $*"; }
warn() { printf "${C_YELLOW}  ⚠${C_RESET} %s\n" "$*" >&2; log "WARN  $*" >&2; }
die()  { printf "${C_RED}  ✗${C_RESET} %s\n" "$*" >&2; log "ERROR $*" >&2; exit 1; }

# ── Validation ────────────────────────────────────────────────────────────────

validate() {
  log "INFO  Validation des prérequis…"

  [ -f "${BACKUP_SSH_KEY}" ] \
    || die "Clé SSH introuvable : ${BACKUP_SSH_KEY}"

  case "${BACKUP_KEEP_DAYS}" in
    ''|*[!0-9]*) die "BACKUP_KEEP_DAYS doit être un entier positif (valeur : ${BACKUP_KEEP_DAYS})" ;;
  esac
  [ "${BACKUP_KEEP_DAYS}" -ge 1 ] \
    || die "BACKUP_KEEP_DAYS doit être ≥ 1"

  command -v rsync >/dev/null 2>&1 \
    || die "rsync introuvable sur PATH"

  command -v ssh >/dev/null 2>&1 \
    || die "ssh introuvable sur PATH"

  ok "Prérequis validés"
}

# ── Initialisation ────────────────────────────────────────────────────────────

init_dirs() {
  mkdir -p "${BACKUP_LOCAL_DIR}"
  mkdir -p "${LOG_DIR}"
  log "INFO  Destination locale : ${BACKUP_LOCAL_DIR}"
}

# ── Pull rsync ────────────────────────────────────────────────────────────────
#
# Pas de -z/--compress : .dump (pg_dump -Fc) et .tar.gz sont déjà compressés.
# Pas de --delete : rsync ne supprime jamais de fichiers locaux sans option explicite.
# La rotation locale est gérée séparément par prune_local().
# --include/--exclude : seuls les patterns produits par backup.sh sont copiés.
# StrictHostKeyChecking=accept-new : accepte un nouvel hôte, rejette un hôte
# dont la clé a changé (protection contre MITM après première connexion).

pull_backups() {
  log "INFO  Connexion à ${BACKUP_REMOTE_USER}@${BACKUP_REMOTE_HOST}:${BACKUP_REMOTE_DIR}…"

  rsync -avh \
    --include='creatyss-*.dump' \
    --include='uploads-*.tar.gz' \
    --include='documents-*.tar.gz' \
    --exclude='*' \
    -e "ssh -i ${BACKUP_SSH_KEY} \
           -o BatchMode=yes \
           -o StrictHostKeyChecking=accept-new \
           -o ConnectTimeout=15" \
    "${BACKUP_REMOTE_USER}@${BACKUP_REMOTE_HOST}:./" \
    "${BACKUP_LOCAL_DIR}/" \
    || die "rsync échoué — VPS inaccessible, clé SSH invalide ou permission refusée"

  ok "Pull rsync terminé"
}

# ── Rotation locale ───────────────────────────────────────────────────────────
#
# Supprime les fichiers locaux plus anciens que BACKUP_KEEP_DAYS jours.
# -maxdepth 1 : jamais de suppression récursive dans les sous-répertoires.
# Patterns stricts : seuls les fichiers produits par backup.sh sont ciblés.
# Ne touche pas au VPS.

prune_local() {
  log "INFO  Rotation locale (rétention : ${BACKUP_KEEP_DAYS} jours)…"

  local deleted=0

  prune_pattern() {
    local pattern="$1"
    while IFS= read -r -d '' file; do
      warn "Suppression locale : $(basename "${file}")"
      rm -f "${file}"
      deleted=$((deleted + 1))
    done < <(find "${BACKUP_LOCAL_DIR}" -maxdepth 1 \
                 -name "${pattern}" \
                 -mtime "+${BACKUP_KEEP_DAYS}" \
                 -print0 2>/dev/null)
  }

  prune_pattern 'creatyss-*.dump'
  prune_pattern 'uploads-*.tar.gz'
  prune_pattern 'documents-*.tar.gz'

  if [ "${deleted}" -eq 0 ]; then
    ok "Aucun fichier local à supprimer (rétention : ${BACKUP_KEEP_DAYS} j)"
  else
    ok "${deleted} fichier(s) local/locaux supprimé(s) antérieur(s) à ${BACKUP_KEEP_DAYS} jours"
  fi
}

# ── Résumé ────────────────────────────────────────────────────────────────────

summary() {
  local remaining
  remaining=$(find "${BACKUP_LOCAL_DIR}" -maxdepth 1 \
    \( -name 'creatyss-*.dump' \
    -o -name 'uploads-*.tar.gz' \
    -o -name 'documents-*.tar.gz' \) \
    | wc -l | tr -d ' ')

  printf "\n${C_GREEN}${C_BOLD}Sauvegarde hors VPS complète${C_RESET}\n"
  printf "  Destination : %s\n" "${BACKUP_LOCAL_DIR}"
  printf "  Fichiers conservés localement : %s\n\n" "${remaining}"
  log "INFO  ${remaining} fichier(s) conservé(s) dans ${BACKUP_LOCAL_DIR}"
}

# ── Main ──────────────────────────────────────────────────────────────────────

main() {
  printf "\n${C_BOLD}Sauvegarde hors VPS Creatyss${C_RESET}\n"
  log "INFO  === début ==="

  validate
  init_dirs
  pull_backups
  prune_local
  summary

  log "INFO  === succès ==="
}

main "$@"
