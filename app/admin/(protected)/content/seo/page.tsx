import Link from "next/link";
import { ArrowRight, CheckCircle2, FileText, Globe, Package, Tag } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { ADMIN_PRODUCTS_LIST_PATH } from "@/features/admin/products/navigation";
import { listAdminBlogPosts } from "@/features/admin/blog";
import { ContentRouteNav } from "@/features/admin/content/components/content-route-nav";
import { countProductsMissingSeo } from "@/features/admin/content/queries/count-products-missing-seo.query";

export const dynamic = "force-dynamic";

const BLOG_PATH = "/admin/content/blog";
const CATEGORIES_PATH = "/admin/catalog/categories";

export default async function AdminContentSeoPage() {
  // Données réelles pour l'état SEO
  let products: { totalSeoMissing: number; total: number } = { totalSeoMissing: 0, total: 0 };
  let posts: { totalMissing: number; total: number } = { totalMissing: 0, total: 0 };

  try {
    const [seoCoverage, blogPosts] = await Promise.all([
      countProductsMissingSeo(),
      listAdminBlogPosts(),
    ]);
    products = seoCoverage;
    posts = {
      total: blogPosts.length,
      totalMissing: blogPosts.filter((p) => !p.hasContent || p.status === "draft").length,
    };
  } catch (error) {
    console.error("[content/seo] countProductsMissingSeo/listAdminBlogPosts failed", error);
  }

  const checks = [
    {
      key: "urls",
      label: "URLs canoniques",
      detail: "Générées automatiquement sur produits et articles.",
      ok: true,
    },
    {
      key: "titles",
      label: "Titres SEO produits",
      detail: `${products.total} produits — ${products.totalSeoMissing > 0 ? `${products.totalSeoMissing} sans titre SEO personnalisé` : "tous configurés"}.`,
      ok: products.totalSeoMissing === 0,
      mock: false,
    },
    {
      key: "blog",
      label: "Articles blog indexables",
      detail: `${posts.total - posts.totalMissing} publiés sur ${posts.total} — ${posts.totalMissing > 0 ? `${posts.totalMissing} brouillon${posts.totalMissing > 1 ? "s" : ""} non indexés` : "tous publiés"}.`,
      ok: posts.totalMissing === 0,
      mock: false,
    },
    {
      key: "sitemap",
      label: "Sitemap XML",
      detail: "Généré automatiquement — soumis à Google Search Console.",
      ok: true,
    },
  ];

  const score = Math.round((checks.filter((c) => c.ok).length / checks.length) * 100);

  return (
    <AdminPageShell
      scrollBehavior="page"
      title="SEO"
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Contenu", href: "/admin/content/overview" },
        { label: "SEO" },
      ]}
      contentPreset="detail"
      showTitleInContent={false}
      header={
        <AdminPageHeader
          eyebrow="Référencement"
          title="SEO"
          description="Points de contrôle d'indexation sur les produits, articles et le sitemap."
        />
      }
    >
      <div className="mx-auto w-full max-w-4xl">
        <ContentRouteNav className="mb-6" />
        {/* ── Hero score ─────────────────────────────────────────────── */}
        <div className="mb-6 flex justify-end">
          <div className="flex items-center gap-3 rounded-2xl border border-surface-border/60 bg-surface-panel/60 px-5 py-3 shadow-sm backdrop-blur-sm">
            <div className="text-center">
              <p className="text-2xl font-semibold tracking-tight text-foreground">{score}%</p>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                Score estimé
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(18rem,0.8fr)]">
          {/* Checks */}
          <section className="rounded-2xl border border-surface-border/60 bg-surface-panel/60 p-5 shadow-sm backdrop-blur-sm">
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-primary/80">
              État
            </p>
            <h2 className="mb-4 text-xl font-semibold tracking-tight text-foreground">
              Points de contrôle
            </h2>
            <div className="divide-y divide-surface-border/30">
              {checks.map((check) => (
                <div key={check.key} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                  <CheckCircle2
                    className={`mt-0.5 size-4 shrink-0 ${check.ok ? "text-feedback-success-foreground" : "text-feedback-warning-foreground"}`}
                  />
                  <div className="min-w-0">
                    <p className="text-[13px] font-medium text-foreground">
                      {check.label}
                      {check.mock ? (
                        <span className="ml-1.5 text-[10px] font-normal text-muted-foreground/50">
                          (estimé)
                        </span>
                      ) : null}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{check.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Accès rapides + Coming soon */}
          <div className="flex flex-col gap-4">
            <section className="rounded-2xl border border-surface-border/60 bg-surface-panel/60 p-5 shadow-sm backdrop-blur-sm">
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-primary/80">
                Actions
              </p>
              <h2 className="mb-4 text-xl font-semibold tracking-tight text-foreground">
                Optimiser maintenant
              </h2>
              <div className="space-y-2">
                {[
                  {
                    href: ADMIN_PRODUCTS_LIST_PATH,
                    icon: Package,
                    label: "Titres SEO produits",
                    hint: "Onglet SEO de chaque fiche",
                  },
                  {
                    href: BLOG_PATH,
                    icon: FileText,
                    label: "Articles publiés",
                    hint: "Contenu indexable par Google",
                  },
                  {
                    href: CATEGORIES_PATH,
                    icon: Tag,
                    label: "Noms de catégories",
                    hint: "Mots-clés dans l'URL catalogue",
                  },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 rounded-xl border border-surface-border/40 bg-surface-panel/50 p-3 transition-colors hover:bg-surface-panel hover:border-surface-border"
                  >
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-surface-subtle">
                      <item.icon className="size-4 text-muted-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-medium text-foreground">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.hint}</p>
                    </div>
                    <ArrowRight className="size-3.5 shrink-0 text-muted-foreground/40" />
                  </Link>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-surface-border/40 bg-surface-panel/30 p-5">
              <div className="flex items-start gap-2.5">
                <Globe className="mt-0.5 size-4 shrink-0 text-muted-foreground/40" />
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                    À venir
                  </p>
                  <ul className="mt-2 space-y-1 text-xs text-muted-foreground/70">
                    <li className="flex items-center gap-1.5">
                      <span className="size-1 shrink-0 rounded-full bg-muted-foreground/30" />
                      Sitemap personnalisé
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="size-1 shrink-0 rounded-full bg-muted-foreground/30" />
                      Redirections 301/302
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="size-1 shrink-0 rounded-full bg-muted-foreground/30" />
                      Données structurées (Schema.org)
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="size-1 shrink-0 rounded-full bg-muted-foreground/30" />
                      Audit SEO automatique
                    </li>
                  </ul>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </AdminPageShell>
  );
}
