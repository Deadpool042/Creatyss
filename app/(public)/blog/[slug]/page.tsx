import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { clientEnv } from "@/core/config/env";
import { getUploadsPublicPath } from "@/core/uploads";
import { buildSeoDescription, pickSeoText } from "@/entities/product/seo-text";
import { getSeoRobotsFlags } from "@/entities/seo";
import { getPublishedBlogPostBySlug } from "@/features/storefront/content/blog";
import { buildBlogPostJsonLd } from "@/features/storefront/content/blog/model/build-blog-post-json-ld";

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

function getBlogPostMetadataDescription(blogPost: BlogPostMetadataSource): string {
  return buildSeoDescription({
    candidates: [blogPost.seoDescription, blogPost.excerpt, blogPost.content],
    defaultValue: "Article Creatyss.",
    maxLength: 160,
  });
}

function getBlogPostCoverImageUrl(blogPost: BlogPostMetadataSource): string | null {
  if (blogPost.coverImagePath === null) {
    return null;
  }

  const uploadsPublicPath = getUploadsPublicPath();
  return `${uploadsPublicPath}/${blogPost.coverImagePath.replace(/^\/+/, "")}`;
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

  const robots = getSeoRobotsFlags(post.seoIndexingMode);

  const canonicalPath = pickSeoText(post.seoCanonicalPath) ?? `/blog/${post.slug}`;
  const canonical = `${clientEnv.appUrl}${canonicalPath}`;

  const metaDescription = getBlogPostMetadataDescription(post);
  const metaTitle = pickSeoText(post.seoTitle, post.title) ?? post.title;

  const coverImageUrl = getBlogPostCoverImageUrl(post);

  const ogTitle = pickSeoText(post.seoOpenGraphTitle, post.seoTitle, post.title) ?? metaTitle;
  const ogDescription = buildSeoDescription({
    candidates: [post.seoOpenGraphDescription, metaDescription],
    defaultValue: metaDescription,
    maxLength: 200,
  });
  const ogImageUrl = post.seoOpenGraphImageUrl ?? coverImageUrl ?? undefined;

  const twitterTitle =
    pickSeoText(post.seoTwitterTitle, post.seoOpenGraphTitle, post.seoTitle, post.title) ??
    metaTitle;
  const twitterDescription = buildSeoDescription({
    candidates: [post.seoTwitterDescription, post.seoOpenGraphDescription, metaDescription],
    defaultValue: metaDescription,
    maxLength: 200,
  });
  const twitterImageUrl = post.seoTwitterImageUrl ?? post.seoOpenGraphImageUrl ?? ogImageUrl;

  return {
    title: metaTitle,
    description: metaDescription,
    ...(robots !== undefined && { robots }),
    alternates: {
      canonical,
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      ...(ogImageUrl !== undefined && { images: [{ url: ogImageUrl }] }),
    },
    twitter: {
      card: "summary_large_image",
      title: twitterTitle,
      description: twitterDescription,
      ...(twitterImageUrl !== undefined && { images: [twitterImageUrl] }),
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPublishedBlogPostBySlug(slug);

  if (post === null) {
    notFound();
  }

  const coverImagePath = getBlogPostCoverImageUrl(post);

  const blogPostJsonLd = buildBlogPostJsonLd({
    post: {
      slug: post.slug,
      title: post.title,
      seoDescription: post.seoDescription,
      excerpt: post.excerpt,
      content: post.content,
      authorName: post.authorName,
      publishedAt: post.publishedAt,
      updatedAt: post.updatedAt,
      imageUrl: post.seoOpenGraphImageUrl ?? coverImagePath,
    },
    appUrl: clientEnv.appUrl,
    jsonLdDefaultDescription: "Article Creatyss.",
  });

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-12 md:px-6 md:py-16 xl:px-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostJsonLd) }}
      />
      <Link
        href="/blog"
        className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
      >
        ← Journal de l&apos;atelier
      </Link>

      <article className="flex flex-col gap-6">
        <header className="flex flex-col gap-3">
          <p className="text-xs font-medium uppercase tracking-[0.32em] text-brand">Blog</p>
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
