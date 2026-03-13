import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Notice } from "@/components/notice";
import { AdminFormField } from "@/components/admin/admin-form-field";
import { AdminFormSection } from "@/components/admin/admin-form-section";

type BlogPostOption = {
  id: string;
  title: string;
  slug: string;
};

type FeaturedBlogPostsSectionProps = {
  blogPostOptions: BlogPostOption[];
  blogPostSelectionMap: Map<string, number>;
};

export function FeaturedBlogPostsSection({
  blogPostOptions,
  blogPostSelectionMap
}: FeaturedBlogPostsSectionProps) {
  return (
    <AdminFormSection
      description="En complément, choisissez les articles publiés à afficher sur la page d'accueil."
      eyebrow="Articles"
      title="Articles mis en avant">

      {blogPostOptions.length > 0 ? (
        <div className="admin-homepage-option-grid">
          {blogPostOptions.map(post => (
            <Card
              className="admin-homepage-option rounded-xl border border-border/70 bg-card text-card-foreground shadow-sm"
              key={post.id}>
              <label className="admin-checkbox">
                <input
                  defaultChecked={blogPostSelectionMap.has(post.id)}
                  name="featuredBlogPostIds"
                  type="checkbox"
                  value={post.id}
                />
                <span>
                  {post.title}
                  <span className="card-meta"> · {post.slug}</span>
                </span>
              </label>

              <AdminFormField
                className="admin-selection-order"
                htmlFor={`homepage-featured-blog-post-sort-order-${post.id}`}
                label="Ordre">
                <Input
                  defaultValue={
                    blogPostSelectionMap.get(post.id)?.toString() ?? ""
                  }
                  id={`homepage-featured-blog-post-sort-order-${post.id}`}
                  min="0"
                  name={`featuredBlogPostSortOrder:${post.id}`}
                  type="number"
                />
              </AdminFormField>
            </Card>
          ))}
        </div>
      ) : (
        <Notice tone="note">
          Publiez d&apos;abord un article pour l&apos;afficher ici.
        </Notice>
      )}
    </AdminFormSection>
  );
}
