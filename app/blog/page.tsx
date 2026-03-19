import Link from "next/link";
import { listPublishedBlogPosts } from "@/db/catalog";

export const dynamic = "force-dynamic";

const blogDateFormatter = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "long",
});

export default async function BlogPage() {
  const posts = await listPublishedBlogPosts();

  return (
    <div className="grid gap-10">
      <section className="w-full rounded-xl border border-shell-border bg-shell-surface p-8 shadow-soft min-[700px]:p-10">
        <div className="mb-8 grid gap-2">
          <p className="text-sm font-bold uppercase tracking-widest text-brand">Blog</p>
          <h1 className="m-0">Articles publiés</h1>
        </div>

        {posts.length > 0 ? (
          <div className="grid gap-5 min-[700px]:grid-cols-3">
            {posts.map((post) => (
              <article
                className="grid gap-4 rounded-lg border border-surface-border bg-surface-panel-soft p-6 shadow-card"
                key={post.id}
              >
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Article
                </p>
                <h3>
                  <Link className="transition-colors hover:text-brand" href={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </h3>
                {post.publishedAt ? (
                  <p className="text-sm text-muted-foreground">
                    {blogDateFormatter.format(new Date(post.publishedAt))}
                  </p>
                ) : null}
                <p className="leading-relaxed">
                  {post.excerpt ?? "Aucun extrait n'est disponible."}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 rounded-lg border border-surface-border bg-surface-panel-soft p-6">
            <p className="text-sm font-bold uppercase tracking-widest text-brand">Blog vide</p>
            <h2>Aucun article publié</h2>
            <p className="leading-relaxed text-muted-foreground">
              Les articles publics apparaîtront ici dès qu&apos;ils seront publiés.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
