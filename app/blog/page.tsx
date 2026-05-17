import type { Metadata } from "next";
import Link from "next/link";
import { listPublishedBlogPosts } from "@/features/storefront/catalog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Journal de l'atelier — Creatyss",
  description: "Actualités, coulisses et inspirations autour des créations de l'atelier Creatyss.",
};

const blogDateFormatter = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "long",
});

export default async function BlogPage() {
  const posts = await listPublishedBlogPosts();

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-12 md:px-6 md:py-16 xl:px-12">
      {/* Page header */}
      <header className="flex flex-col gap-2">
        <p className="text-[0.62rem] font-medium uppercase tracking-[0.32em] text-brand">
          Journal de l&apos;atelier
        </p>
        <h1 className="font-serif text-3xl font-normal tracking-tight text-foreground min-[700px]:text-[2.6rem]">
          Tous les articles
        </h1>
        <p className="mt-1 max-w-xl text-sm font-light leading-relaxed text-muted-foreground">
          Actualités, coulisses et inspirations autour des créations Creatyss.
        </p>
      </header>

      {posts.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 min-[700px]:grid-cols-2 min-[1000px]:grid-cols-3">
          {posts.map((post) => (
            <article key={post.id} className="group flex flex-col gap-3">
              {/* Image placeholder */}
              <div className="aspect-video overflow-hidden rounded-lg bg-surface-subtle" />

              {/* Date */}
              {post.publishedAt !== null ? (
                <p className="text-[0.68rem] font-medium uppercase tracking-[0.08em] text-muted-foreground">
                  {blogDateFormatter.format(new Date(post.publishedAt))}
                </p>
              ) : null}

              {/* Title */}
              <h3 className="font-serif text-[1.1rem] font-normal leading-snug text-foreground">
                <Link href={`/blog/${post.slug}`} className="transition-colors hover:text-brand">
                  {post.title}
                </Link>
              </h3>

              {/* Excerpt */}
              {post.excerpt !== null ? (
                <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                  {post.excerpt}
                </p>
              ) : null}

              {/* CTA */}
              <p className="mt-1 text-[0.72rem] font-medium uppercase tracking-widest text-brand">
                Lire l&apos;article →
              </p>
            </article>
          ))}
        </div>
      ) : (
        /* Empty state */
        <div className="mx-auto flex max-w-sm flex-col items-center gap-4 py-20 text-center">
          <p className="text-[0.62rem] font-medium uppercase tracking-[0.32em] text-brand">
            Journal de l&apos;atelier
          </p>
          <h2 className="font-serif text-2xl font-normal tracking-tight text-foreground">
            Aucun article pour l&apos;instant
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Les prochaines actualités de l&apos;atelier apparaîtront ici.
          </p>
          <Link
            href="/boutique"
            className="mt-2 text-[0.72rem] font-medium uppercase tracking-widest text-brand underline-offset-4 hover:underline"
          >
            Découvrir la boutique →
          </Link>
        </div>
      )}
    </div>
  );
}
