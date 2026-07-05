import Link from "next/link";
import { ArrowRight, CheckCircle2, Newspaper, Settings2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ADMIN_CONTENT_BLOG_PATH } from "@/features/admin/content/shared/admin-content-routes";
import { cn } from "@/lib/utils";

type ContentSettingsHubProps = Readonly<{
  blog: {
    draft: boolean;
    publish: boolean;
  };
}>;

type CapabilityTone = "active" | "upgrade" | "managed";

const TONE_STYLES: Record<CapabilityTone, string> = {
  active:
    "border-feedback-success-border/50 bg-feedback-success-surface/30 text-feedback-success-foreground",
  upgrade: "border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-200",
  managed: "border-sky-500/25 bg-sky-500/10 text-sky-800 dark:text-sky-200",
};

/**
 * Hub de configuration content — volontairement léger (décision D2,
 * docs/roadmap/doctrine-domaines-admin) : un seul levier gradué aujourd'hui
 * (content.blog draft/publish). Pas de sur-architecture tant que le domaine
 * n'expose pas d'autres niveaux.
 */
export function ContentSettingsHub({ blog }: ContentSettingsHubProps) {
  const blogLevelLabel = blog.publish ? "Publication" : blog.draft ? "Brouillon" : "Inactif";

  return (
    <div className="space-y-8">
      <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
        Centralisez ici les réglages du domaine contenu : le blog est le seul levier gradué, les
        pages, l&apos;accueil et le SEO se gèrent directement dans leurs modules.
      </p>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <section className="rounded-2xl border border-surface-border/60 bg-card p-5 shadow-card">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-2xl border border-surface-border/60 bg-surface-subtle/20">
              <Newspaper className="size-4 text-muted-foreground" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Éditorial
              </p>
              <h2 className="mt-1 text-lg font-semibold tracking-tight text-foreground">
                Blog — niveau {blogLevelLabel.toLowerCase()}
              </h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Rédaction des articles et diffusion storefront (content.blog).
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <CapabilityRow
              label="Brouillons"
              detail="Édition admin des articles, sans diffusion publique."
              tone={blog.draft ? "active" : "upgrade"}
              value={blog.draft ? "Actif" : "Niveau requis"}
            />
            <CapabilityRow
              label="Publication storefront"
              detail="Diffusion publique des articles et du listing blog."
              tone={blog.publish ? "active" : "upgrade"}
              value={blog.publish ? "Actif" : "Upgrade utile"}
            />

            <div className="flex flex-wrap gap-2 pt-1">
              <Button asChild size="sm">
                <Link href={ADMIN_CONTENT_BLOG_PATH}>
                  Ouvrir le blog
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-surface-border/60 bg-card p-5 shadow-card">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-2xl border border-surface-border/60 bg-surface-subtle/20">
              <Settings2 className="size-4 text-muted-foreground" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Lecture d&apos;exploitation
              </p>
              <h2 className="mt-1 text-lg font-semibold tracking-tight text-foreground">
                Repères intuitifs
              </h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Où agir sans chercher module par module.
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <CapabilityRow
              label="Niveaux de capacité"
              detail="S'activent dans les Réglages avancés, pas ici."
              tone="managed"
              value="Gouvernance"
            />
            <CapabilityRow
              label="Pages, accueil et SEO"
              detail="Se gèrent directement dans leurs modules dédiés."
              tone="managed"
              value="Module dédié"
            />

            <div className="flex flex-wrap gap-2 pt-1">
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/content/overview">Retour au pilotage</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function CapabilityRow({
  label,
  detail,
  value,
  tone,
}: Readonly<{
  label: string;
  detail: string;
  value: string;
  tone: CapabilityTone;
}>) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-2xl border border-surface-border/60 bg-surface-subtle/20 px-4 py-3">
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">{detail}</p>
      </div>
      <Badge variant="outline" className={cn("h-6 rounded-full px-2.5", TONE_STYLES[tone])}>
        {tone === "active" ? <CheckCircle2 className="size-3.5" /> : null}
        {value}
      </Badge>
    </div>
  );
}
