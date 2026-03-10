import { notFound } from "next/navigation";
import { getPublishedBlogPostBySlug } from "@/db/catalog";
import { getUploadsPublicPath } from "@/lib/uploads";

export const dynamic = "force-dynamic";

const blogDateFormatter = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "long"
});

type BlogPostPageProps = Readonly<{
  params: Promise<{
    slug: string;
  }>;
}>;

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPublishedBlogPostBySlug(slug);

  if (post === null) {
    notFound();
  }

  const uploadsPublicPath = getUploadsPublicPath();
  const coverImagePath = post.coverImagePath
    ? `${uploadsPublicPath}/${post.coverImagePath.replace(/^\/+/, "")}`
    : null;

  return (
    <div className="page">
      <article className="section article-layout">
        <p className="eyebrow">Blog</p>
        <h1>{post.title}</h1>

        {post.publishedAt ? (
          <p className="meta-line">
            {blogDateFormatter.format(new Date(post.publishedAt))}
          </p>
        ) : null}

        {post.excerpt ? <p className="lead">{post.excerpt}</p> : null}

        {coverImagePath ? (
          <figure className="article-cover">
            <img alt={post.title} src={coverImagePath} />
          </figure>
        ) : (
          <div className="media-placeholder">Aucun visuel de couverture.</div>
        )}

        <div className="article-content">
          {post.content ?? "Cet article ne contient pas encore de contenu."}
        </div>
      </article>
    </div>
  );
}
