import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Notice } from "@/components/shared/notice";
import { AdminFormField } from "@/components/admin/forms/admin-form-field";
import { AdminFormSection } from "@/components/admin/forms/admin-form-section";

const checkboxClassName =
  "mt-0.5 size-4 rounded border-input text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30";

type BlogPostOption = {
  id: string;
  title: string;
  slug: string;
};

type FeaturedBlogPostsSectionProps = {
  blogPostOptions: readonly BlogPostOption[];
  blogPostSelectionMap: Map<string, number>;
};

export function FeaturedBlogPostsSection({
  blogPostOptions,
  blogPostSelectionMap,
}: FeaturedBlogPostsSectionProps) {
  return (
    <AdminFormSection
      contentClassName="gap-5"
      description="En complément, choisissez les articles publiés à afficher sur la page d'accueil."
      eyebrow="Articles"
      title="Articles mis en avant"
    >
      {blogPostOptions.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {blogPostOptions.map((post) => (
            <Card
              className="rounded-xl border border-border/70 bg-card/95 text-card-foreground shadow-sm"
              key={post.id}
            >
              <div className="grid gap-4 px-3">
                <label className="flex items-start gap-3 text-sm leading-6 text-foreground">
                  <input
                    className={checkboxClassName}
                    defaultChecked={blogPostSelectionMap.has(post.id)}
                    name="featuredBlogPostIds"
                    type="checkbox"
                    value={post.id}
                  />
                  <span className="grid gap-1">
                    <span className="font-medium text-foreground">{post.title}</span>
                    <span className="text-sm text-muted-foreground">{post.slug}</span>
                  </span>
                </label>

                <AdminFormField
                  className="max-w-28"
                  htmlFor={`homepage-featured-blog-post-sort-order-${post.id}`}
                  label="Ordre"
                >
                  <Input
                    defaultValue={blogPostSelectionMap.get(post.id)?.toString() ?? ""}
                    id={`homepage-featured-blog-post-sort-order-${post.id}`}
                    min="0"
                    name={`featuredBlogPostSortOrder:${post.id}`}
                    type="number"
                  />
                </AdminFormField>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Notice tone="note">Publiez d&apos;abord un article pour l&apos;afficher ici.</Notice>
      )}
    </AdminFormSection>
  );
}
