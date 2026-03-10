import Link from "next/link";
import { listAdminMediaAssets } from "@/db/admin-media";
import {
  getAdminHomepageEditorData,
  type AdminHomepageFeaturedBlogPostSelection,
  type AdminHomepageFeaturedCategorySelection,
  type AdminHomepageFeaturedProductSelection
} from "@/db/repositories/admin-homepage.repository";
import { updateHomepageAction } from "@/features/admin/homepage/actions/update-homepage-action";
import { getUploadsPublicPath } from "@/lib/uploads";

export const dynamic = "force-dynamic";

type AdminHomepagePageProps = Readonly<{
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}>;

function readSearchParam(
  searchParams: Record<string, string | string[] | undefined>,
  key: string
): string | undefined {
  const value = searchParams[key];

  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

function getStatusMessage(status: string | undefined): string | null {
  switch (status) {
    case "updated":
      return "Homepage enregistree avec succes.";
    default:
      return null;
  }
}

function getErrorMessage(error: string | undefined): string | null {
  switch (error) {
    case "missing_homepage":
      return "La homepage publiee est introuvable.";
    case "invalid_hero_image":
      return "La selection de l'image hero est invalide.";
    case "hero_media_missing":
      return "Le media selectionne pour le hero est introuvable.";
    case "invalid_product_selection":
      return "La selection des produits mis en avant est invalide.";
    case "invalid_product_sort_order":
      return "Chaque produit mis en avant doit avoir un ordre entier positif ou nul.";
    case "duplicate_product_sort_order":
      return "Chaque produit mis en avant doit avoir un ordre unique.";
    case "product_missing":
      return "Au moins un produit mis en avant est introuvable ou n'est plus publie.";
    case "invalid_category_selection":
      return "La selection des categories mises en avant est invalide.";
    case "invalid_category_sort_order":
      return "Chaque categorie mise en avant doit avoir un ordre entier positif ou nul.";
    case "duplicate_category_sort_order":
      return "Chaque categorie mise en avant doit avoir un ordre unique.";
    case "category_missing":
      return "Au moins une categorie mise en avant est introuvable.";
    case "invalid_blog_post_selection":
      return "La selection des articles mis en avant est invalide.";
    case "invalid_blog_post_sort_order":
      return "Chaque article mis en avant doit avoir un ordre entier positif ou nul.";
    case "duplicate_blog_post_sort_order":
      return "Chaque article mis en avant doit avoir un ordre unique.";
    case "blog_post_missing":
      return "Au moins un article mis en avant est introuvable ou n'est plus publie.";
    case "save_failed":
      return "La homepage n'a pas pu etre enregistree.";
    default:
      return null;
  }
}

function buildSelectionMap<TSelection extends { sortOrder: number }>(
  selections: readonly TSelection[],
  getId: (selection: TSelection) => string
): Map<string, number> {
  return new Map(
    selections.map((selection) => [getId(selection), selection.sortOrder])
  );
}

function getImageUrl(
  uploadsPublicPath: string,
  filePath: string | null
): string | null {
  if (typeof filePath !== "string") {
    return null;
  }

  const normalizedFilePath = filePath.trim().replace(/^\/+/, "");

  if (normalizedFilePath.length === 0) {
    return null;
  }

  return `${uploadsPublicPath}/${normalizedFilePath}`;
}

export default async function AdminHomepagePage({
  searchParams
}: AdminHomepagePageProps) {
  const [resolvedSearchParams, editorData, mediaAssets] = await Promise.all([
    searchParams,
    getAdminHomepageEditorData(),
    listAdminMediaAssets()
  ]);
  const successMessage = getStatusMessage(
    readSearchParam(resolvedSearchParams, "status")
  );
  const explicitErrorMessage = getErrorMessage(
    readSearchParam(resolvedSearchParams, "error")
  );

  if (editorData === null) {
    return (
      <section className="section admin-homepage-page">
        <div className="page-header">
          <div>
            <p className="eyebrow">Homepage</p>
            <h1>Edition homepage</h1>
            <p className="lead">
              La homepage admin ne peut pas etre editee tant qu&apos;aucune
              homepage publiee n&apos;existe.
            </p>
          </div>
        </div>

        <p className="admin-alert" role="alert">
          {explicitErrorMessage ?? "La homepage publiee est introuvable."}
        </p>
      </section>
    );
  }

  const { homepage, productOptions, categoryOptions, blogPostOptions } = editorData;
  const productSelectionMap = buildSelectionMap<
    AdminHomepageFeaturedProductSelection
  >(homepage.featuredProducts, (selection) => selection.productId);
  const categorySelectionMap = buildSelectionMap<
    AdminHomepageFeaturedCategorySelection
  >(homepage.featuredCategories, (selection) => selection.categoryId);
  const blogPostSelectionMap = buildSelectionMap<
    AdminHomepageFeaturedBlogPostSelection
  >(homepage.featuredBlogPosts, (selection) => selection.blogPostId);
  const uploadsPublicPath = getUploadsPublicPath();
  const heroImageUrl = getImageUrl(uploadsPublicPath, homepage.heroImagePath);
  const currentHeroMediaAsset =
    homepage.heroImagePath === null
      ? null
      : mediaAssets.find((asset) => asset.filePath === homepage.heroImagePath) ?? null;
  const heroImageSelectValue =
    currentHeroMediaAsset?.id ??
    (homepage.heroImagePath !== null ? "__keep_current__" : "");
  const pageErrorMessage = explicitErrorMessage;

  return (
    <section className="section admin-homepage-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Homepage</p>
          <h1>Edition homepage</h1>
          <p className="lead">
            Modifiez le hero, le bloc editorial et les selections mises en avant
            depuis une seule page admin.
          </p>
        </div>
      </div>

      {successMessage ? <p className="admin-success">{successMessage}</p> : null}
      {pageErrorMessage ? (
        <p className="admin-alert" role="alert">
          {pageErrorMessage}
        </p>
      ) : null}

      <form action={updateHomepageAction} className="admin-form admin-homepage-form">
        <input name="homepageId" type="hidden" value={homepage.id} />
        <input
          name="currentHeroImagePath"
          type="hidden"
          value={homepage.heroImagePath ?? ""}
        />

        <section className="admin-homepage-section">
          <div className="stack">
            <p className="eyebrow">Hero</p>
            <h2>Bloc hero</h2>
            <p className="card-copy">
              Le hero pilote le titre principal, le texte d&apos;accroche et
              l&apos;image de la homepage publique.
            </p>
          </div>

          {heroImageUrl ? (
            <div className="admin-homepage-hero-preview">
              <img
                alt={homepage.heroTitle ?? "Image hero actuelle"}
                src={heroImageUrl}
              />
            </div>
          ) : (
            <div className="admin-homepage-hero-preview admin-image-placeholder">
              Aucune image hero actuellement
            </div>
          )}

          <label className="admin-field">
            <span className="meta-label">Titre hero</span>
            <input
              className="admin-input"
              defaultValue={homepage.heroTitle ?? ""}
              name="heroTitle"
              type="text"
            />
          </label>

          <label className="admin-field">
            <span className="meta-label">Texte principal</span>
            <textarea
              className="admin-input admin-textarea"
              defaultValue={homepage.heroText ?? ""}
              name="heroText"
              rows={4}
            />
          </label>

          <label className="admin-field">
            <span className="meta-label">Image hero</span>
            <select
              className="admin-input"
              defaultValue={heroImageSelectValue}
              name="heroImageMediaAssetId"
            >
              {homepage.heroImagePath !== null && currentHeroMediaAsset === null ? (
                <option value="__keep_current__">
                  Conserver l&apos;image actuelle ({homepage.heroImagePath})
                </option>
              ) : null}
              <option value="">Aucune image hero</option>
              {mediaAssets.map((mediaAsset) => (
                <option key={mediaAsset.id} value={mediaAsset.id}>
                  {mediaAsset.originalName} · {mediaAsset.mimeType}
                </option>
              ))}
            </select>
          </label>

          {mediaAssets.length === 0 ? (
            <p className="admin-muted-note">
              Aucun media n&apos;est disponible. Vous pouvez en importer depuis{" "}
              <Link className="link" href="/admin/media">
                la bibliotheque media
              </Link>
              .
            </p>
          ) : null}
        </section>

        <section className="admin-homepage-section">
          <div className="stack">
            <p className="eyebrow">Editorial</p>
            <h2>Bloc editorial</h2>
            <p className="card-copy">
              Ce bloc alimente la section editoriale affichee sous le hero.
            </p>
          </div>

          <label className="admin-field">
            <span className="meta-label">Titre editorial</span>
            <input
              className="admin-input"
              defaultValue={homepage.editorialTitle ?? ""}
              name="editorialTitle"
              type="text"
            />
          </label>

          <label className="admin-field">
            <span className="meta-label">Texte editorial</span>
            <textarea
              className="admin-input admin-textarea"
              defaultValue={homepage.editorialText ?? ""}
              name="editorialText"
              rows={5}
            />
          </label>
        </section>

        <section className="admin-homepage-section">
          <div className="stack">
            <p className="eyebrow">Produits</p>
            <h2>Produits mis en avant</h2>
            <p className="card-copy">
              Selectionnez les produits publies a afficher sur la homepage.
            </p>
          </div>

          {productOptions.length > 0 ? (
            <div className="admin-homepage-option-grid">
              {productOptions.map((product) => (
                <div className="store-card admin-homepage-option" key={product.id}>
                  <label className="admin-checkbox">
                    <input
                      defaultChecked={productSelectionMap.has(product.id)}
                      name="featuredProductIds"
                      type="checkbox"
                      value={product.id}
                    />
                    <span>
                      {product.name}
                      <span className="card-meta"> · {product.slug}</span>
                    </span>
                  </label>

                  <label className="admin-field admin-selection-order">
                    <span className="meta-label">Ordre</span>
                    <input
                      className="admin-input"
                      defaultValue={
                        productSelectionMap.get(product.id)?.toString() ?? ""
                      }
                      min="0"
                      name={`featuredProductSortOrder:${product.id}`}
                      type="number"
                    />
                  </label>
                </div>
              ))}
            </div>
          ) : (
            <p className="admin-muted-note">
              Aucun produit publie n&apos;est disponible pour cette section.
            </p>
          )}
        </section>

        <section className="admin-homepage-section">
          <div className="stack">
            <p className="eyebrow">Categories</p>
            <h2>Categories mises en avant</h2>
            <p className="card-copy">
              Selectionnez les categories a afficher sur la homepage.
            </p>
          </div>

          {categoryOptions.length > 0 ? (
            <div className="admin-homepage-option-grid">
              {categoryOptions.map((category) => (
                <div className="store-card admin-homepage-option" key={category.id}>
                  <label className="admin-checkbox">
                    <input
                      defaultChecked={categorySelectionMap.has(category.id)}
                      name="featuredCategoryIds"
                      type="checkbox"
                      value={category.id}
                    />
                    <span>
                      {category.name}
                      <span className="card-meta"> · {category.slug}</span>
                    </span>
                  </label>

                  <label className="admin-field admin-selection-order">
                    <span className="meta-label">Ordre</span>
                    <input
                      className="admin-input"
                      defaultValue={
                        categorySelectionMap.get(category.id)?.toString() ?? ""
                      }
                      min="0"
                      name={`featuredCategorySortOrder:${category.id}`}
                      type="number"
                    />
                  </label>
                </div>
              ))}
            </div>
          ) : (
            <p className="admin-muted-note">
              Aucune categorie n&apos;est disponible pour cette section.
            </p>
          )}
        </section>

        <section className="admin-homepage-section">
          <div className="stack">
            <p className="eyebrow">Articles</p>
            <h2>Articles mis en avant</h2>
            <p className="card-copy">
              Selectionnez les articles publies a afficher sur la homepage.
            </p>
          </div>

          {blogPostOptions.length > 0 ? (
            <div className="admin-homepage-option-grid">
              {blogPostOptions.map((post) => (
                <div className="store-card admin-homepage-option" key={post.id}>
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
                </div>
              ))}
            </div>
          ) : (
            <p className="admin-muted-note">
              Aucun article publie n&apos;est disponible pour cette section.
            </p>
          )}
        </section>

        <div className="admin-actions">
          <button className="button" type="submit">
            Enregistrer la homepage
          </button>
        </div>
      </form>
    </section>
  );
}
