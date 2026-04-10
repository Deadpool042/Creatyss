import { HomepageSectionType } from "@/prisma-generated/client";
import type { AdminHomepageEditorData } from "../types";

type HomepageSectionRecord = {
  id: string;
  code: string;
  type: HomepageSectionType;
  title: string | null;
  body: string | null;
  primaryImage: {
    storageKey: string;
  } | null;
  featuredProducts: Array<{
    productId: string;
    sortOrder: number;
  }>;
  featuredCategories: Array<{
    categoryId: string;
    sortOrder: number;
  }>;
  featuredPosts: Array<{
    blogPostId: string;
    sortOrder: number;
  }>;
};

type HomepageRecord = {
  id: string;
  sections: HomepageSectionRecord[];
};

type ProductOptionRecord = {
  id: string;
  name: string;
  slug: string;
};

type CategoryOptionRecord = {
  id: string;
  name: string;
  slug: string;
};

type BlogPostOptionRecord = {
  id: string;
  title: string;
  slug: string;
};

const HERO_SECTION_CODE = "hero";
const EDITORIAL_SECTION_CODE = "editorial";
const FEATURED_PRODUCTS_SECTION_CODE = "featured-products";
const FEATURED_CATEGORIES_SECTION_CODE = "featured-categories";
const FEATURED_BLOG_POSTS_SECTION_CODE = "featured-blog-posts";

export function mapAdminHomepageEditorData(params: {
  homepage: HomepageRecord;
  productOptions: readonly ProductOptionRecord[];
  categoryOptions: readonly CategoryOptionRecord[];
  blogPostOptions: readonly BlogPostOptionRecord[];
}): AdminHomepageEditorData {
  const { homepage, productOptions, categoryOptions, blogPostOptions } = params;

  const heroSection =
    homepage.sections.find(
      (section) =>
        section.code === HERO_SECTION_CODE || section.type === HomepageSectionType.HERO,
    ) ?? null;

  const editorialSection =
    homepage.sections.find(
      (section) =>
        section.code === EDITORIAL_SECTION_CODE || section.type === HomepageSectionType.EDITORIAL,
    ) ?? null;

  const featuredProductsSection =
    homepage.sections.find(
      (section) =>
        section.code === FEATURED_PRODUCTS_SECTION_CODE ||
        section.type === HomepageSectionType.FEATURED_PRODUCTS,
    ) ?? null;

  const featuredCategoriesSection =
    homepage.sections.find(
      (section) =>
        section.code === FEATURED_CATEGORIES_SECTION_CODE ||
        section.type === HomepageSectionType.FEATURED_CATEGORIES,
    ) ?? null;

  const featuredBlogPostsSection =
    homepage.sections.find(
      (section) =>
        section.code === FEATURED_BLOG_POSTS_SECTION_CODE ||
        section.type === HomepageSectionType.BLOG_POSTS,
    ) ?? null;

  return {
    homepage: {
      id: homepage.id,
      heroTitle: heroSection?.title ?? null,
      heroText: heroSection?.body ?? null,
      heroImagePath: heroSection?.primaryImage?.storageKey ?? null,
      editorialTitle: editorialSection?.title ?? null,
      editorialText: editorialSection?.body ?? null,
      featuredProducts: featuredProductsSection?.featuredProducts ?? [],
      featuredCategories: featuredCategoriesSection?.featuredCategories ?? [],
      featuredBlogPosts: featuredBlogPostsSection?.featuredPosts ?? [],
    },
    productOptions,
    categoryOptions,
    blogPostOptions,
  };
}
