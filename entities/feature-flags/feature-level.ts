/**
 * Règles pures de gradation des features (cf.
 * docs/domains/cross-cutting/feature-governance.md, « Niveaux fonctionnels
 * gradués », et feature-flags.md pour le mécanisme).
 *
 * Une feature graduée déclare ses niveaux autorisés, ordonnés du plus bas au
 * plus élevé (`FeatureFlag.allowedLevels`). Le niveau effectif vient de
 * l'override applicable, sinon du défaut (`defaultLevel`). Un guard compare
 * le niveau effectif au niveau requis par la fonction protégée.
 */

type ResolveEffectiveLevelInput = {
  /** Niveaux autorisés, ordonnés du plus bas au plus élevé. */
  allowedLevels: readonly string[];
  /** Niveau par défaut du flag (FeatureFlag.defaultLevel). */
  defaultLevel: string | null;
  /** Niveau imposé par l'override applicable, le cas échéant. */
  overrideLevel?: string | null;
};

/**
 * Résout le niveau effectif d'une feature graduée.
 * Retourne null si la feature n'est pas graduée ou si le niveau candidat
 * n'appartient pas aux niveaux autorisés (configuration invalide → prudence).
 */
export function resolveEffectiveLevel(input: ResolveEffectiveLevelInput): string | null {
  if (input.allowedLevels.length === 0) {
    return null;
  }

  const candidate = input.overrideLevel ?? input.defaultLevel;

  if (candidate === null || candidate === undefined) {
    return null;
  }

  return input.allowedLevels.includes(candidate) ? candidate : null;
}

type MeetsRequiredLevelInput = {
  /** Niveaux autorisés, ordonnés du plus bas au plus élevé. */
  allowedLevels: readonly string[];
  /** Niveau effectif résolu (cf. resolveEffectiveLevel). */
  activeLevel: string | null;
  /** Niveau minimal requis par la fonction protégée. */
  requiredLevel: string;
};

/**
 * Vérifie que le niveau actif autorise une fonction exigeant `requiredLevel`.
 * Comparaison par position dans `allowedLevels`. Retourne false si l'un des
 * niveaux est inconnu ou si la feature n'a pas de niveau actif.
 */
export function meetsRequiredLevel(input: MeetsRequiredLevelInput): boolean {
  if (input.activeLevel === null) {
    return false;
  }

  const activeIndex = input.allowedLevels.indexOf(input.activeLevel);
  const requiredIndex = input.allowedLevels.indexOf(input.requiredLevel);

  if (activeIndex === -1 || requiredIndex === -1) {
    return false;
  }

  return activeIndex >= requiredIndex;
}
