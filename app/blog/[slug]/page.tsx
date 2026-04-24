import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getUploadsPublicPath } from "@/core/uploads";
import { getPublishedBlogPostBySlug } from "@/features/storefront/catalog";

export const dynamic = "force-dynamic";

const blogDateFormatter = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "long",
});

type BlogPostPageProps = Readonly<{
  params: Promise<{
    slug: string;
  }>;
}>;

type BlogPostMetadataSource = NonNullable<Awaited<ReturnType<typeof getPublishedBlogPostBySlug>>>;

function truncateMetadataDescription(value: string): string {
  const normalizedValue = value.replace(/\s+/g, " ").trim();

  if (normalizedValue.length <= 160) {
    return normalizedValue;
  }

  return `${normalizedValue.slice(0, 157).trimEnd()}...`;
}

function getBlogPostMetadataDescription(blogPost: BlogPostMetadataSource): string {
  if (blogPost.seoDescription) {
    return blogPost.seoDescription;
  }

  if (blogPost.excerpt) {
    return blogPost.excerpt;
  }

  if (blogPost.content) {
    return truncateMetadataDescription(blogPost.content);
  }

  return "Article Creatyss.";
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedBlogPostBySlug(slug);

  if (post === null) {
    return {
      title: "Article Creatyss",
      description: "Article Creatyss.",
    };
  }

  return {
    title: post.seoTitle ?? post.title,
    description: getBlogPostMetadataDescription(post),
  };
}

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
    <div className="grid gap-8">
      <article className="w-full border border-shell-border rounded-lg bg-shell-surface shadow-soft p-7 grid gap-3 max-w-208">
        <p className="text-sm font-bold uppercase tracking-[0.08em] text-brand">Blog</p>
        <h1 className="m-0">{post.title}</h1>

        {post.publishedAt ? (
          <p className="text-[0.95rem] text-foreground/68">
            {blogDateFormatter.format(new Date(post.publishedAt))}
          </p>
        ) : null}

        {post.excerpt ? <p className="mt-4 leading-relaxed">{post.excerpt}</p> : null}

        {coverImagePath ? (
          <figure className="overflow-hidden rounded-lg bg-media-surface min-h-56">
            <Image
              alt={post.title}
              src={coverImagePath}
              width={900}
              height={450}
              className="block w-full h-full object-cover"
            />
          </figure>
        ) : (
          <div className="grid place-items-center min-h-64 rounded-lg bg-media-surface p-4 text-media-foreground text-center">
            Aucun visuel de couverture.
          </div>
        )}

        <div className="leading-[1.65] whitespace-pre-wrap">
          {post.content ?? "Cet article ne contient pas encore de contenu."}
        </div>
      </article>
    </div>
  );
}
