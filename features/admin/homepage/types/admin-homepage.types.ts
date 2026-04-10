import type {
  HomepageFeaturedBlogPostSelection,
  HomepageFeaturedCategorySelection,
  HomepageFeaturedProductSelection,
} from "@/entities/homepage/homepage-input";

export type AdminHomepageFeaturedProductSelection = HomepageFeaturedProductSelection;
export type AdminHomepageFeaturedCategorySelection = HomepageFeaturedCategorySelection;
export type AdminHomepageFeaturedBlogPostSelection = HomepageFeaturedBlogPostSelection;

export type AdminHomepageEditorState = {
  id: string;
  heroTitle: string | null;
  heroText: string | null;
  heroImagePath: string | null;
  editorialTitle: string | null;
  editorialText: string | null;
  featuredProducts: readonly AdminHomepageFeaturedProductSelection[];
  featuredCategories: readonly AdminHomepageFeaturedCategorySelection[];
  featuredBlogPosts: readonly AdminHomepageFeaturedBlogPostSelection[];
};

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

export type AdminHomepageEditorData = {
  homepage: AdminHomepageEditorState;
  productOptions: readonly AdminHomepageProductOption[];
  categoryOptions: readonly AdminHomepageCategoryOption[];
  blogPostOptions: readonly AdminHomepageBlogPostOption[];
};

export type UpdateAdminHomepageInput = {
  id: string;
  heroTitle: string | null;
  heroText: string | null;
  heroImagePath: string | null;
  editorialTitle: string | null;
  editorialText: string | null;
  featuredProducts: readonly HomepageFeaturedProductSelection[];
  featuredCategories: readonly HomepageFeaturedCategorySelection[];
  featuredBlogPosts: readonly HomepageFeaturedBlogPostSelection[];
};

export type AdminHomepageServiceErrorCode =
  | "homepage_missing"
  | "product_missing"
  | "category_missing"
  | "blog_post_missing";

export class AdminHomepageServiceError extends Error {
  readonly code: AdminHomepageServiceErrorCode;

  constructor(code: AdminHomepageServiceErrorCode, message?: string) {
    super(message ?? code);
    this.name = "AdminHomepageServiceError";
    this.code = code;
  }
}
