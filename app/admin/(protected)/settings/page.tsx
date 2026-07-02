import Link from "next/link";
import {
  Bell,
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
      showBreadcrumbsInContent={false}
      showTitleInContent={false}
      contentPreset="overview"
    >
      <div className="space-y-6">
        {/* En-tête */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-primary/80">
            Administration
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">Réglages</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Configurez votre boutique, les intégrations et les accès.
          </p>
        </div>

        {/* Grille de cartes */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => {
            const meta = getSettingsCardMeta(card);

            return (
              <Link
                key={card.key}
                href={card.href}
                className="flex items-start gap-4 rounded-2xl border border-surface-border/60 bg-surface-panel/60 p-4 shadow-sm backdrop-blur-sm transition-colors hover:border-surface-border hover:bg-surface-panel"
              >
                <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-surface-subtle">
                  <meta.icon className="size-4 text-muted-foreground" />
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] font-medium text-foreground">{card.label}</p>
                  <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
                    {meta.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </AdminPageShell>
  );
}
