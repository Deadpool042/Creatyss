import Link from "next/link";
import {
  Bell,
  CreditCard,
  Image,
  Key,
  Package,
  Search,
  Settings,
  ShoppingCart,
  Sliders,
  Store,
  Truck,
  UserCog,
  Users,
} from "lucide-react";

import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";

// ── Types ──────────────────────────────────────────────────────────────────

type SettingsCard = {
  href: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
};

// ── Cartes ─────────────────────────────────────────────────────────────────

const SETTINGS_CARDS: ReadonlyArray<SettingsCard> = [
  {
    href: "/admin/settings/general",
    title: "Général",
    description: "Identité, support et paramètres régionaux de la boutique.",
    icon: Settings,
  },
  {
    href: "/admin/settings/store",
    title: "Boutique",
    description: "Adresse, devise, fuseau horaire et coordonnées légales.",
    icon: Store,
  },
  {
    href: "/admin/settings/catalog",
    title: "Catalogue",
    description: "Options d'affichage des produits et fonctionnalités catalogue.",
    icon: Package,
  },
  {
    href: "/admin/settings/orders",
    title: "Commandes",
    description: "Traitement des commandes, retours et règles fiscales.",
    icon: ShoppingCart,
  },
  {
    href: "/admin/settings/payments",
    title: "Paiements",
    description: "Méthodes de paiement acceptées et configuration des prestataires.",
    icon: CreditCard,
  },
  {
    href: "/admin/settings/shipping",
    title: "Livraison",
    description: "Transporteurs, zones de livraison et frais de port.",
    icon: Truck,
  },
  {
    href: "/admin/settings/media",
    title: "Médias",
    description: "Stockage des images, formats acceptés et optimisation.",
    icon: Image,
  },
  {
    href: "/admin/settings/notifications",
    title: "Notifications",
    description: "Emails transactionnels et adresse de réponse de la boutique.",
    icon: Bell,
  },
  {
    href: "/admin/settings/seo",
    title: "SEO",
    description: "Métadonnées globales, sitemap et balises par défaut.",
    icon: Search,
  },
  {
    href: "/admin/settings/customers",
    title: "Clients",
    description: "Politiques de compte client et durée de rétention des données.",
    icon: UserCog,
  },
  {
    href: "/admin/settings/team",
    title: "Équipe",
    description: "Membres, rôles et permissions d'accès à l'administration.",
    icon: Users,
  },
  {
    href: "/admin/settings/api-clients",
    title: "API clients",
    description: "Clés d'API et accès programmatiques à la boutique.",
    icon: Key,
  },
  {
    href: "/admin/settings/advanced/overview",
    title: "Avancé",
    description: "Feature flags, variables système et options de débogage.",
    icon: Sliders,
  },
];

// ── Page ───────────────────────────────────────────────────────────────────

export default function AdminSettingsPage() {
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
          {SETTINGS_CARDS.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="flex items-start gap-4 rounded-2xl border border-surface-border/60 bg-surface-panel/60 p-4 shadow-sm backdrop-blur-sm transition-colors hover:border-surface-border hover:bg-surface-panel"
            >
              <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-surface-subtle">
                <card.icon className="size-4 text-muted-foreground" />
              </div>
              <div className="min-w-0">
                <p className="text-[13px] font-medium text-foreground">{card.title}</p>
                <p className="mt-0.5 text-xs leading-5 text-muted-foreground">{card.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AdminPageShell>
  );
}
