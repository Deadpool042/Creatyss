import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SurfaceSection } from "@/components/storefront/surfaceSection";

const blogDateFormatter = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "long"
});

type HomepageFeaturedPost = {
  slug: string;
  title: string;
  excerpt: string | null;
  publishedAt: string | Date | null;
} | null;

type HomepageJournalSectionProps = {
  featuredPost: HomepageFeaturedPost;
};

export function HomepageJournalSection({
  featuredPost
}: HomepageJournalSectionProps) {
  return (
    <SurfaceSection
      eyebrow="Journal"
      title="Dans les coulisses de l'atelier"
      headerActions={
        <Link
          className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
          href="/blog">
          Tous les articles
        </Link>
      }>
      {featuredPost ? (
        <article className="grid gap-4 rounded-lg border border-surface-border bg-surface-panel-soft p-6 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Article
          </p>
          <h3>
            <Link
              className="transition-colors hover:text-brand"
              href={`/blog/${featuredPost.slug}`}>
              {featuredPost.title}
            </Link>
          </h3>
          {featuredPost.publishedAt ? (
            <p className="text-sm text-muted-foreground">
              {blogDateFormatter.format(new Date(featuredPost.publishedAt))}
            </p>
          ) : null}
          <p className="m-0 leading-relaxed">
            {featuredPost.excerpt ?? "Lire l'article complet."}
          </p>
        </article>
      ) : (
        <p className="leading-relaxed text-muted-foreground">
          Le journal de l'atelier sera bientôt enrichi de nouveaux contenus :
          inspirations, nouveautés et temps forts autour des créations Creatyss.
        </p>
      )}

      <div className="mt-5 flex flex-wrap gap-3">
        <Button
          asChild
          variant="outline">
          <Link href="https://www.facebook.com/creatyss">Facebook</Link>
        </Button>
        <Button
          asChild
          variant="outline">
          <Link href="https://www.instagram.com/creatyss">Instagram</Link>
        </Button>
      </div>
    </SurfaceSection>
  );
}
