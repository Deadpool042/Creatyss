import Link from "next/link";
import {
  Bell,
  ChevronRight,
  Globe,
  Key,
  Link as LinkIcon,
  Megaphone,
  Search,
  Settings,
  Sliders,
  Store,
  Users,
  Zap,
} from "lucide-react";

import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { requireAuthenticatedAdmin } from "@/core/auth/admin/guard";
import { db } from "@/core/db";
import { adminNavigationItems, type AdminNavigationItem } from "@/features/admin/navigation";
import {
  buildAdminSettingsHubItems,
  getAdminNavigationContext,
} from "@/features/admin/navigation/server";

// ── Métadonnées locales (icônes + descriptions des cartes) ─────────────────
//
// Ces métadonnées d'affichage sont propres au hub `/admin/settings` et n'ont
// pas vocation à vivre dans `admin-navigation.data.ts` (qui ne porte que les
// libellés courts et icônes de navigation, partagés avec la sidebar). Seule
// la liste des items et leurs capabilities vient de la source unique.

type SettingsCardMeta = {
  description: string;
  icon: React.ComponentType<{ className?: string }>;
};

const SETTINGS_CARD_META: Record<string, SettingsCardMeta> = {
  "general-settings": {
    description: "Identité, support et paramètres régionaux de la boutique.",
    icon: Settings,
  },
  "store-settings": {
    description: "Adresse, devise, fuseau horaire et coordonnées légales.",
    icon: Store,
  },
  "notifications-settings": {
    description: "Emails transactionnels et adresse de réponse de la boutique.",
    icon: Bell,
  },
  "seo-settings": {
    description: "Métadonnées globales, sitemap et balises par défaut.",
    icon: Search,
  },
  "team-settings": {
    description: "Membres, rôles et permissions d'accès à l'administration.",
    icon: Users,
  },
  "api-clients-settings": {
    description: "Clés d'API et accès programmatiques à la boutique.",
    icon: Key,
  },
  "integrations-settings": {
    description: "Connexions aux services tiers et états de synchronisation.",
    icon: LinkIcon,
  },
  "webhooks-settings": {
    description: "Endpoints sortants et deliveries webhook.",
    icon: LinkIcon,
  },
  "search-settings": {
    description: "Index de recherche et documents indexables.",
    icon: Search,
  },
  "channels-settings": {
    description: "Canaux de diffusion et états de publication.",
    icon: Megaphone,
  },
  "localization-settings": {
    description: "Langues, traductions et paramètres de localisation.",
    icon: Globe,
  },
  "ai-settings": {
    description: "Providers IA, tâches et usages assistés.",
    icon: Zap,
  },
  "advanced-settings": {
    description: "Feature flags, variables système et options de débogage.",
    icon: Sliders,
  },
};

function getSettingsCardMeta(item: AdminNavigationItem): SettingsCardMeta {
  return SETTINGS_CARD_META[item.key] ?? { description: "", icon: Settings };
}

// Regroupement façon macOS System Settings — métadonnée d'affichage locale au hub,
// même statut que SETTINGS_CARD_META. Tout item hors groupe tombe dans "Autres".
const SETTINGS_GROUPS: readonly { title: string; itemKeys: readonly string[] }[] = [
  {
    title: "Boutique",
    itemKeys: ["general-settings", "store-settings", "seo-settings", "localization-settings"],
  },
  { title: "Communication", itemKeys: ["notifications-settings", "channels-settings"] },
  { title: "Accès & sécurité", itemKeys: ["team-settings", "api-clients-settings"] },
  { title: "Connexions", itemKeys: ["integrations-settings", "webhooks-settings"] },
  { title: "Plateforme", itemKeys: ["search-settings", "ai-settings", "advanced-settings"] },
];

function groupSettingsCards(
  cards: readonly AdminNavigationItem[]
): { title: string; items: AdminNavigationItem[] }[] {
  const byKey = new Map(cards.map((card) => [card.key, card]));
  const grouped = SETTINGS_GROUPS.map((group) => ({
    title: group.title,
    items: group.itemKeys
      .map((key) => byKey.get(key))
      .filter((item): item is AdminNavigationItem => item !== undefined),
  }));

  const knownKeys = new Set(SETTINGS_GROUPS.flatMap((group) => group.itemKeys));
  const others = cards.filter(
    (card) => !knownKeys.has(card.key) && card.key !== "settings-overview"
  );

  if (others.length > 0) {
    grouped.push({ title: "Autres", items: [...others] });
  }

  return grouped.filter((group) => group.items.length > 0);
}

// ── Page ───────────────────────────────────────────────────────────────────

export default async function AdminSettingsPage() {
  const admin = await requireAuthenticatedAdmin();

  const navigationContext = await getAdminNavigationContext({
    db,
    admin: {
      id: admin.id,
      email: admin.email,
    },
  });

  const cards = buildAdminSettingsHubItems(adminNavigationItems, navigationContext);

  return (
    <AdminPageShell
      scrollBehavior="page"
      title="Réglages"
      breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Réglages" }]}
      showTitleInContent={false}
      contentPreset="overview"
      header={
        <AdminPageHeader
          eyebrow="Administration"
          title="Réglages"
          description="Configurez votre boutique, les intégrations et les accès."
        />
      }
    >
      <div className="space-y-6">
        {/* Navigation groupée façon System Settings */}
        <div className="mx-auto grid w-full max-w-3xl gap-6">
          {groupSettingsCards(cards).map((group) => (
            <section key={group.title} className="grid gap-2">
              <h2 className="px-1 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                {group.title}
              </h2>
              <div className="divide-y divide-surface-border/50 overflow-hidden rounded-2xl border border-surface-border/60 bg-surface-panel/60 shadow-sm backdrop-blur-sm">
                {group.items.map((card) => {
                  const meta = getSettingsCardMeta(card);

                  return (
                    <Link
                      key={card.key}
                      href={card.href}
                      className="group flex items-center gap-3.5 px-4 py-3 transition-colors hover:bg-surface-subtle/50"
                    >
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-surface-subtle">
                        <meta.icon className="size-4 text-muted-foreground" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-medium text-foreground">{card.label}</p>
                        {meta.description ? (
                          <p className="mt-0.5 truncate text-xs leading-5 text-muted-foreground">
                            {meta.description}
                          </p>
                        ) : null}
                      </div>
                      <ChevronRight className="size-4 shrink-0 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </AdminPageShell>
  );
}
