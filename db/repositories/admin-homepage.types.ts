import type {
  HomepageFeaturedBlogPostSelection,
  HomepageFeaturedCategorySelection,
  HomepageFeaturedProductSelection,
} from "@/entities/homepage/homepage-types";

type HomepageStatus = "draft" | "published";

export type AdminHomepageFeaturedProductSelection = HomepageFeaturedProductSelection;

export type AdminHomepageFeaturedCategorySelection = HomepageFeaturedCategorySelection;

export type AdminHomepageFeaturedBlogPostSelection = HomepageFeaturedBlogPostSelection;

export type AdminHomepageProductOption = {
  id: string;
  name: string;
  slug: string;
};

export type AdminHomepageCategoryOption = {
  id: string;
  name: string;
  slug: string;
};

export type AdminHomepageBlogPostOption = {
  id: string;
  title: string;
  slug: string;
};

export type AdminHomepageDetail = {
  id: string;
  heroTitle: string | null;
  heroText: string | null;
  heroImagePath: string | null;
  editorialTitle: string | null;
  editorialText: string | null;
  status: HomepageStatus;
  createdAt: string;
  updatedAt: string;
  featuredProducts: AdminHomepageFeaturedProductSelection[];
  featuredCategories: AdminHomepageFeaturedCategorySelection[];
  featuredBlogPosts: AdminHomepageFeaturedBlogPostSelection[];
};

export type AdminHomepageEditorData = {
  homepage: AdminHomepageDetail;
  productOptions: AdminHomepageProductOption[];
  categoryOptions: AdminHomepageCategoryOption[];
  blogPostOptions: AdminHomepageBlogPostOption[];
};

type HomepageRepositoryErrorCode =
  | "homepage_missing"
  | "product_missing"
  | "category_missing"
  | "blog_post_missing";

export class AdminHomepageRepositoryError extends Error {
  readonly code: HomepageRepositoryErrorCode;

  constructor(code: HomepageRepositoryErrorCode, message: string) {
    super(message);
    this.code = code;
  }
}
