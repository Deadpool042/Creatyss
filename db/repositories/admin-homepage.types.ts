import type {
  HomepageFeaturedBlogPostSelection,
  HomepageFeaturedCategorySelection,
  HomepageFeaturedProductSelection,
} from "@/entities/homepage/homepage-types";

export type AdminHomepageStatus = "draft" | "published";

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

export type UpdateAdminHomepageInput = {
  id: string;
  heroTitle: string | null;
  heroText: string | null;
  heroImagePath: string | null;
  editorialTitle: string | null;
  editorialText: string | null;
  featuredProducts: AdminHomepageFeaturedProductSelection[];
  featuredCategories: AdminHomepageFeaturedCategorySelection[];
  featuredBlogPosts: AdminHomepageFeaturedBlogPostSelection[];
};

export type AdminHomepageDetail = {
  id: string;
  heroTitle: string | null;
  heroText: string | null;
  heroImagePath: string | null;
  editorialTitle: string | null;
  editorialText: string | null;
  status: AdminHomepageStatus;
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

export type AdminHomepageRepositoryErrorCode =
  | "homepage_missing"
  | "product_missing"
  | "category_missing"
  | "blog_post_missing";

export class AdminHomepageRepositoryError extends Error {
  readonly code: AdminHomepageRepositoryErrorCode;

  constructor(code: AdminHomepageRepositoryErrorCode, message: string) {
    super(message);
    this.code = code;
  }
}
