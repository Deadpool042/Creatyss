/**
 * Table de transitions de statut autorisées, indexée par statut de départ.
 * Une clé absente équivaut à aucune transition sortante autorisée (état terminal).
 */
export type StatusTransitionMap<T extends string> = Partial<Record<T, readonly T[]>>;

export function isTransitionAllowed<T extends string>(
  transitions: StatusTransitionMap<T>,
  from: T,
  to: T
): boolean {
  return (transitions[from] ?? []).includes(to);
}
