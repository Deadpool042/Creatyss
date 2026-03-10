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
        <div className="page-header">
          <div>
            <p className="eyebrow">Blog</p>
            <h1>Articles publies</h1>
          </div>
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
            <p className="eyebrow">Blog vide</p>
            <h2>Aucun article publie</h2>
            <p className="card-copy">
              Les articles publics apparaitront ici des qu&apos;ils seront
              publies.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
