import Link from "next/link";
import { listPublishedBlogPosts } from "@/db/catalog";

export const dynamic = "force-dynamic";

const blogDateFormatter = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "long"
});

export default async function BlogPage() {
  const posts = await listPublishedBlogPosts();

  return (
    <div className="page">
      <section className="section">
        <div className="mb-6 grid gap-2">
          <p className="text-sm font-bold uppercase tracking-[0.08em] text-brand">
            Blog
          </p>
          <h1 className="m-0">Articles publiés</h1>
        </div>

        {posts.length > 0 ? (
          <div className="card-grid">
            {posts.map((post) => (
              <article className="store-card" key={post.id}>
                <p className="card-kicker">Article</p>
                <h3>
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>
                {post.publishedAt ? (
                  <p className="card-meta">
                    {blogDateFormatter.format(new Date(post.publishedAt))}
                  </p>
                ) : null}
                <p className="card-copy">
                  {post.excerpt ?? "Aucun extrait n'est disponible."}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p className="text-sm font-bold uppercase tracking-[0.08em] text-brand">
              Blog vide
            </p>
            <h2>Aucun article publié</h2>
            <p className="card-copy">
              Les articles publics apparaîtront ici dès qu&apos;ils seront
              publiés.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
