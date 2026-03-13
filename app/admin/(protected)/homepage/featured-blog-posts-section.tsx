import { Card } from "@/components/ui/card";
import { Notice } from "@/components/notice";
import { SectionIntro } from "@/components/section-intro";
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
    <AdminFormSection>
      <SectionIntro
        className="stack"
        description="En complément, choisissez les articles publiés à afficher sur la page d'accueil."
        eyebrow="Articles"
        title="Articles mis en avant"
      />

      {blogPostOptions.length > 0 ? (
        <div className="admin-homepage-option-grid">
          {blogPostOptions.map(post => (
            <Card
              className="store-card admin-homepage-option"
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

              <label className="admin-field admin-selection-order">
                <span className="meta-label">Ordre</span>
                <input
                  className="admin-input"
                  defaultValue={
                    blogPostSelectionMap.get(post.id)?.toString() ?? ""
                  }
                  min="0"
                  name={`featuredBlogPostSortOrder:${post.id}`}
                  type="number"
                />
              </label>
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
