import type { ComponentType, JSX } from "react";
import Link from "next/link";
import { FileText, FolderTree, Globe, ImageIcon, Package, ShoppingBag } from "lucide-react";

import { StatsCard } from "@/components/shared/stats-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { AdminDashboardStats } from "@/features/admin/dashboard";

type AdminQuickLink = {
  href: string;
  title: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
};

const quickLinks: AdminQuickLink[] = [
  {
    href: "/admin/products",
    title: "Produits",
    description: "Gérer le catalogue, les fiches produits et la base du merchandising.",
    icon: Package,
  },
  {
    href: "/admin/categories",
    title: "Catégories",
    description: "Organiser les produits dans une structure claire et maintenable.",
    icon: FolderTree,
  },
  {
    href: "/admin/orders",
    title: "Commandes",
    description: "Consulter les commandes et suivre les opérations de vente.",
    icon: ShoppingBag,
  },
  {
    href: "/admin/media",
    title: "Médias",
    description: "Centraliser les visuels produits et les contenus de la boutique.",
    icon: ImageIcon,
  },
  {
    href: "/admin/homepage",
    title: "Page d’accueil",
    description: "Piloter les blocs éditoriaux et les mises en avant principales.",
    icon: Globe,
  },
  {
    href: "/admin/blog",
    title: "Blog",
    description: "Gérer les articles, le contenu éditorial et la visibilité organique.",
    icon: FileText,
  },
];

type AdminDashboardSectionsProps = {
  stats: AdminDashboardStats;
};

export function AdminDashboardSections({ stats }: AdminDashboardSectionsProps): JSX.Element {
  return (
    <>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <StatsCard
          title="Produits"
          value={stats.productsCount}
          description="Produits actuellement enregistrés dans le catalogue."
          icon={Package}
        />
        <StatsCard
          title="Commandes"
          value={stats.ordersCount}
          description="Commandes présentes dans la base."
          icon={ShoppingBag}
        />
        <StatsCard
          title="Articles"
          value={stats.blogPostsCount}
          description="Articles de blog actuellement disponibles."
          icon={FileText}
        />
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {quickLinks.map((item) => {
          const Icon = item.icon;

          return (
            <Link key={item.href} href={item.href} className="block">
              <Card className="h-full transition hover:border-foreground/20 hover:shadow-sm">
                <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
                  <div className="space-y-1.5">
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <CardDescription className="text-sm leading-6">
                      {item.description}
                    </CardDescription>
                  </div>

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted">
                    <Icon className="h-5 w-5 text-foreground" />
                  </div>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Priorités immédiates</CardTitle>
            <CardDescription>
              Base recommandée pour continuer la mise en place de l’admin.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>• Finaliser le flux produits avec liste, détail et édition.</p>
            <p>• Stabiliser les catégories sur le même pattern que les produits.</p>
            <p>• Brancher les contenus homepage et blog sur une interface lisible.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>État de la base admin</CardTitle>
            <CardDescription>
              Le socle d’authentification admin est en place et opérationnel.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>• Login admin fonctionnel</p>
            <p>• Logout avec révocation de session</p>
            <p>• Protection des routes admin en place</p>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
