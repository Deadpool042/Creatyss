import {
  AvailabilityGovernancePanel,
  CatalogSeoGovernancePanel,
  CategoriesGovernancePanel,
  InventoryGovernancePanel,
  MediaGovernancePanel,
  PricingGovernancePanel,
  RelatedGovernancePanel,
  VariantsGovernancePanel,
} from "./governance-panels/catalog-governance-panels";
import {
  DiscountsGovernancePanel,
  DocumentsGovernancePanel,
  FulfillmentGovernancePanel,
  PaymentsGovernancePanel,
  ReturnsGovernancePanel,
  ShippingGovernancePanel,
  TaxationGovernancePanel,
} from "./governance-panels/commerce-governance-panels";
import {
  AnalyticsGovernancePanel,
  AutomationsGovernancePanel,
  NewsletterGovernancePanel,
} from "./governance-panels/engagement-governance-panels";
import {
  IntegrationsGovernancePanel,
  LocalizationGovernancePanel,
  NotificationsGovernancePanel,
  WebhooksGovernancePanel,
} from "./governance-panels/platform-governance-panels";
import {
  BlogGovernancePanel,
  ContentSeoGovernancePanel,
  HomepageGovernancePanel,
} from "./governance-panels/content-governance-panels";
import {
  ChannelsGovernancePanel,
  SearchGovernancePanel,
} from "./governance-panels/satellite-governance-panels";
import { AiGovernancePanel } from "./governance-panels/ai-governance-panel";
import {
  LogsGovernancePanel,
  ObservabilityGovernancePanel,
} from "./governance-panels/maintenance-governance-panels";

// ─── Router ───────────────────────────────────────────────────────────────────

type FlagGovernancePanelProps = Readonly<{ flagKey: string }>;

type GovernancePanelRenderer = () => ReturnType<typeof PricingGovernancePanel>;

const GOVERNANCE_PANEL_BY_FLAG: Readonly<Record<string, GovernancePanelRenderer>> = {
  "catalog.products.pricing": PricingGovernancePanel,
  "catalog.products.variants": VariantsGovernancePanel,
  "catalog.products.categories": CategoriesGovernancePanel,
  "catalog.products.availability": AvailabilityGovernancePanel,
  "catalog.products.seo": CatalogSeoGovernancePanel,
  "catalog.products.related": RelatedGovernancePanel,
  "catalog.products.inventory": InventoryGovernancePanel,
  "catalog.products.media": MediaGovernancePanel,
  "commerce.payments": PaymentsGovernancePanel,
  "commerce.discounts": DiscountsGovernancePanel,
  "commerce.shipping": ShippingGovernancePanel,
  "commerce.fulfillment": FulfillmentGovernancePanel,
  "commerce.returns": ReturnsGovernancePanel,
  "commerce.taxation": TaxationGovernancePanel,
  "commerce.documents": DocumentsGovernancePanel,
  "engagement.newsletter": NewsletterGovernancePanel,
  "engagement.automations": AutomationsGovernancePanel,
  "engagement.analytics": AnalyticsGovernancePanel,
  "platform.notifications": NotificationsGovernancePanel,
  "platform.integrations": IntegrationsGovernancePanel,
  "platform.webhooks": WebhooksGovernancePanel,
  "platform.localization": LocalizationGovernancePanel,
  "content.blog": BlogGovernancePanel,
  "content.homepage": HomepageGovernancePanel,
  "content.seo": ContentSeoGovernancePanel,
  "satellite.search": SearchGovernancePanel,
  "satellite.channels": ChannelsGovernancePanel,
  "ai.core": AiGovernancePanel,
  "maintenance.observability": ObservabilityGovernancePanel,
  "maintenance.logs": LogsGovernancePanel,
};

/**
 * Server Component — rendu d'un panneau de gouvernance contextuel par flag.
 * Chaque flag peut avoir sa propre section de contexte domaine et de stats live.
 * Retourne null si aucun panneau n'est défini pour ce flag.
 */
export async function FlagGovernancePanel({ flagKey }: FlagGovernancePanelProps) {
  const renderPanel = GOVERNANCE_PANEL_BY_FLAG[flagKey];

  return renderPanel === undefined ? null : renderPanel();
}
