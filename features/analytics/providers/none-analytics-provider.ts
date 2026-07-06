import type { AnalyticsProvider, AnalyticsTopPage } from "./analytics-provider.types";

/**
 * Provider par défaut : aucune source externe configurée. Retourne toujours
 * `null` — les appelants retombent sur leur mock existant. Garantit que le
 * cockpit admin ne dépend jamais conceptuellement d'un provider particulier.
 */
export class NoneAnalyticsProvider implements AnalyticsProvider {
  async getTopPages(): Promise<AnalyticsTopPage[] | null> {
    return null;
  }
}
