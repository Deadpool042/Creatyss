import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getUploadsPublicPath } from "@/core/uploads";
import { getPublishedBlogPostBySlug } from "@/features/storefront/content/blog";

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
    <div className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-12 md:px-6 md:py-16 xl:px-12">
      <Link
        href="/blog"
        className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
      >
        ← Journal de l&apos;atelier
      </Link>

      <article className="flex flex-col gap-6">
        <header className="flex flex-col gap-3">
          <p className="text-xs font-medium uppercase tracking-[0.32em] text-brand">
            Blog
          </p>
          <h1 className="font-serif text-3xl font-normal tracking-tight text-foreground min-[700px]:text-[2.4rem]">
            {post.title}
          </h1>
          {post.publishedAt ? (
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">
              {blogDateFormatter.format(new Date(post.publishedAt))}
            </p>
          ) : null}
          {post.excerpt ? (
            <p className="text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p>
          ) : null}
        </header>

        {coverImagePath ? (
          <figure className="overflow-hidden rounded-lg bg-media-surface">
            <Image
              alt={post.title}
              src={coverImagePath}
              width={900}
              height={450}
              className="block w-full h-full object-cover"
            />
          </figure>
        ) : null}

        <div className="leading-[1.75] whitespace-pre-wrap text-foreground/85">
          {post.content ?? "Cet article ne contient pas encore de contenu."}
        </div>
      </article>
    </div>
  );
}
