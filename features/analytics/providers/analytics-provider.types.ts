export type AnalyticsProviderKind = "none" | "umami";

/**
 * Vocabulaire interne, indépendant du fournisseur. Un composant ou une
 * query ne doit jamais dépendre d'un type nommé d'après un provider
 * (`Umami*`, `Plausible*`, ...) — cf. `docs/architecture/30-execution/
 * 32-integrations-et-adaptateurs-fournisseurs.md`, Règle 1.
 */
export type AnalyticsTopPage = Readonly<{
  path: string;
  views: number;
  delta: number;
}>;

export interface AnalyticsProvider {
  /**
   * Top pages par visites sur une fenêtre récente. `null` si le provider
   * n'a pas de données à offrir (non configuré, non disponible, ou
   * `NoneAnalyticsProvider`) — jamais de throw.
   */
  getTopPages(): Promise<AnalyticsTopPage[] | null>;
}
