/**
 * get-content-overview-stats.query.ts
 *
 * Agrège l'état éditorial de la boutique pour le cockpit content/overview.
 *
 * Données réelles : blog, homepage, pages.
 * Données partiellement estimées : SEO global, faute de lecture transverse consolidée.
 */
import { listAdminBlogPosts } from "@/features/admin/blog/queries";
import { countProductsMissingSeo } from "@/features/admin/content/queries/count-products-missing-seo.query";
import { getAdminHomepageEditorData } from "@/features/admin/homepage";
import { getAdminPagesList } from "@/features/admin/pages";

// ── Types ──────────────────────────────────────────────────────────────────

export type ContentReadinessItem = {
  key: string;
  label: string;
  detail: string;
  /** 0-100 */
  progress: number;
  toneClassName: string;
  /** true si la donnée vient du backend, false si mock assumé */
  isMock?: boolean;
};

export type ContentSignal = {
  key: string;
  label: string;
  detail: string;
  tone: "warning" | "error" | "info" | "success";
  isMock?: boolean;
};

export type ContentRecentPost = {
  id: string;
  title: string;
  status: "draft" | "published" | "inactive" | "archived";
  publishedAt: string | null;
  hasContent: boolean;
};

export type ContentOverviewStats = {
  // Blog — réel
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  recentPosts: ContentRecentPost[];

  // Homepage — réel
  homepagePublished: boolean;
  homepageSectionsCount: number;

  // Pages — réel
  totalPages: number;
  publishedPages: number;

  // SEO — mock (domaine seo cross-cutting, metadata partielle)
  seoOverallScore: number; // 0-100

  // Synthèse
  readinessItems: ContentReadinessItem[];
  signals: ContentSignal[];
};

// ── Helpers ────────────────────────────────────────────────────────────────

function blogReadiness(published: number, total: number): ContentReadinessItem {
  const progress = total === 0 ? 0 : Math.min(100, Math.round((published / total) * 100));
  return {
    key: "blog",
    label: "Blog",
    detail:
      total === 0
        ? "Aucun article rédigé"
        : `${published} publié${published > 1 ? "s" : ""} sur ${total}`,
    progress,
    toneClassName:
      progress >= 60
        ? "text-feedback-success-foreground"
        : progress >= 30
          ? "text-feedback-warning-foreground"
          : "text-muted-foreground",
    isMock: false,
  };
}

// ── Query principale ───────────────────────────────────────────────────────

export async function getContentOverviewStats(): Promise<ContentOverviewStats> {
  // ── Blog (réel) ──────────────────────────────────────────────────────────
  let posts: Awaited<ReturnType<typeof listAdminBlogPosts>> = [];
  try {
    posts = await listAdminBlogPosts();
  } catch (error) {
    console.error("[content-overview-stats] listAdminBlogPosts failed", error);
  }

  const publishedPosts = posts.filter((p) => p.status === "published").length;
  const draftPosts = posts.filter((p) => p.status === "draft").length;

  const recentPosts: ContentRecentPost[] = [...posts]
    .sort((a, b) => {
      const da = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const db_ = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return db_ - da;
    })
    .slice(0, 5)
    .map((p) => ({
      id: p.id,
      title: p.title,
      status: p.status,
      publishedAt: p.publishedAt,
      hasContent: p.hasContent,
    }));

  // ── Homepage réelle ──────────────────────────────────────────────────────
  let homepagePublished = false;
  let homepageSectionsCount = 0;

  try {
    const homepageData = await getAdminHomepageEditorData();
    if (homepageData !== null) {
      const { homepage } = homepageData;
      homepagePublished = homepage.status === "ACTIVE";
      homepageSectionsCount = [
        homepage.heroTitle,
        homepage.editorialTitle,
        homepage.featuredProducts.length > 0 ? "products" : null,
        homepage.featuredCategories.length > 0 ? "categories" : null,
        homepage.featuredBlogPosts.length > 0 ? "blog" : null,
      ].filter((value) => {
        if (typeof value === "string") return value.trim().length > 0;
        return Boolean(value);
      }).length;
    }
  } catch (error) {
    console.error("[content-overview-stats] getAdminHomepageEditorData failed", error);
  }

  // ── Pages réelles ────────────────────────────────────────────────────────
  let totalPages = 0;
  let publishedPages = 0;

  try {
    const pages = await getAdminPagesList();
    totalPages = pages.length;
    publishedPages = pages.filter((page) => page.status === "ACTIVE").length;
  } catch (error) {
    console.error("[content-overview-stats] getAdminPagesList failed", error);
  }

  // ── SEO réel : couverture des titres SEO produits (SeoMetadata) ─────────
  let seoOverallScore = 0;
  try {
    const seoCoverage = await countProductsMissingSeo();
    seoOverallScore =
      seoCoverage.total === 0
        ? 0
        : Math.round(((seoCoverage.total - seoCoverage.totalSeoMissing) / seoCoverage.total) * 100);
  } catch (error) {
    console.error("[content-overview-stats] countProductsMissingSeo failed", error);
  }

  // ── Readiness ────────────────────────────────────────────────────────────
  const readinessItems: ContentReadinessItem[] = [
    blogReadiness(publishedPosts, posts.length),
    {
      key: "homepage",
      label: "Page d'accueil",
      detail: homepagePublished
        ? `${homepageSectionsCount} sections configurées — publiée`
        : `${homepageSectionsCount} sections configurées — brouillon`,
      progress: homepagePublished ? 90 : 35,
      toneClassName: homepagePublished
        ? "text-feedback-success-foreground"
        : "text-feedback-warning-foreground",
      isMock: false,
    },
    {
      key: "pages",
      label: "Pages éditoriales",
      detail:
        publishedPages === 0
          ? `${totalPages} pages prévues — aucune publiée`
          : `${publishedPages} publiée${publishedPages > 1 ? "s" : ""} sur ${totalPages}`,
      progress: totalPages === 0 ? 0 : Math.round((publishedPages / totalPages) * 100),
      toneClassName:
        publishedPages === 0 ? "text-muted-foreground" : "text-feedback-success-foreground",
      isMock: false,
    },
    {
      key: "seo",
      label: "SEO",
      detail: `Couverture ${seoOverallScore}/100 — titres SEO produits personnalisés`,
      progress: seoOverallScore,
      toneClassName:
        seoOverallScore >= 70
          ? "text-feedback-success-foreground"
          : seoOverallScore >= 40
            ? "text-feedback-warning-foreground"
            : "text-feedback-error-foreground",
      isMock: false,
    },
  ];

  // ── Signals ──────────────────────────────────────────────────────────────
  const signals: ContentSignal[] = [];

  if (draftPosts > 0) {
    signals.push({
      key: "blog_drafts",
      label: `${draftPosts} article${draftPosts > 1 ? "s" : ""} en brouillon`,
      detail: "Relire, compléter et publier pour alimenter le blog.",
      tone: "info",
      isMock: false,
    });
  }

  if (!homepagePublished) {
    signals.push({
      key: "homepage_draft",
      label: "Page d'accueil non publiée",
      detail: "La boutique est visible mais sans page d'accueil éditoriale. Finaliser et publier.",
      tone: "warning",
      isMock: false,
    });
  }

  if (publishedPages === 0 && totalPages > 0) {
    signals.push({
      key: "pages_missing",
      label: "Aucune page légale publiée",
      detail: "CGV, Mentions légales, Politique de confidentialité — obligatoires avant lancement.",
      tone: "error",
      isMock: false,
    });
  }

  if (seoOverallScore < 50) {
    signals.push({
      key: "seo_low",
      label: "SEO incomplet",
      detail: "Moins de la moitié des produits actifs ont un titre SEO personnalisé.",
      tone: "warning",
      isMock: false,
    });
  }

  if (publishedPosts >= 3 && seoOverallScore >= 60) {
    signals.push({
      key: "content_ok",
      label: "Blog actif",
      detail: `${publishedPosts} article${publishedPosts > 1 ? "s" : ""} publié${publishedPosts > 1 ? "s" : ""} — bonne cadence éditoriale.`,
      tone: "success",
      isMock: false,
    });
  }

  return {
    totalPosts: posts.length,
    publishedPosts,
    draftPosts,
    recentPosts,
    homepagePublished,
    homepageSectionsCount,
    totalPages,
    publishedPages,
    seoOverallScore,
    readinessItems,
    signals,
  };
}
