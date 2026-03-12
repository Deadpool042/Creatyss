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
      return "Page d’accueil enregistrée avec succès.";
    default:
      return null;
  }
}

function getErrorMessage(error: string | undefined): string | null {
  switch (error) {
    case "missing_homepage":
      return "La page d’accueil publiée est introuvable.";
    case "invalid_hero_image":
      return "La sélection de l’image principale est invalide.";
    case "hero_media_missing":
      return "Le média sélectionné pour l’image principale est introuvable.";
    case "invalid_product_selection":
      return "La sélection des produits mis en avant est invalide.";
    case "invalid_product_sort_order":
      return "Chaque produit mis en avant doit avoir un ordre entier positif ou nul.";
    case "duplicate_product_sort_order":
      return "Chaque produit mis en avant doit avoir un ordre unique.";
    case "product_missing":
      return "Au moins un produit mis en avant est introuvable ou n'est plus publié.";
    case "invalid_category_selection":
      return "La sélection des catégories mises en avant est invalide.";
    case "invalid_category_sort_order":
      return "Chaque catégorie mise en avant doit avoir un ordre entier positif ou nul.";
    case "duplicate_category_sort_order":
      return "Chaque catégorie mise en avant doit avoir un ordre unique.";
    case "category_missing":
      return "Au moins une catégorie mise en avant est introuvable.";
    case "invalid_blog_post_selection":
      return "La sélection des articles mis en avant est invalide.";
    case "invalid_blog_post_sort_order":
      return "Chaque article mis en avant doit avoir un ordre entier positif ou nul.";
    case "duplicate_blog_post_sort_order":
      return "Chaque article mis en avant doit avoir un ordre unique.";
    case "blog_post_missing":
      return "Au moins un article mis en avant est introuvable ou n'est plus publié.";
    case "save_failed":
      return "La page d’accueil n'a pas pu être enregistrée.";
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
            <p className="eyebrow">Accueil</p>
            <h1>Édition de la page d’accueil</h1>
            <p className="lead">
              La page d’accueil ne peut pas être modifiée tant qu&apos;aucune
              version publiée n&apos;existe.
            </p>
          </div>
        </div>

        <p className="admin-alert" role="alert">
          {explicitErrorMessage ?? "La page d’accueil publiée est introuvable."}
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
          <p className="eyebrow">Accueil</p>
          <h1>Édition de la page d’accueil</h1>
          <p className="lead">
            Commencez par la bannière principale, puis complétez le bloc
            éditorial et les sélections mises en avant.
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
            <p className="eyebrow">Mise en avant principale</p>
            <h2>Bannière principale</h2>
            <p className="card-copy">
              Renseignez ici le titre, le texte et l&apos;image visibles en
              haut de la page d&apos;accueil.
            </p>
          </div>

          {heroImageUrl ? (
            <div className="admin-homepage-hero-preview">
              <img
                alt={homepage.heroTitle ?? "Image principale actuelle"}
                src={heroImageUrl}
              />
            </div>
          ) : (
            <div className="admin-homepage-hero-preview admin-image-placeholder">
              Aucune image principale actuellement
            </div>
          )}

          <label className="admin-field">
            <span className="meta-label">Titre principal</span>
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
            <span className="meta-label">Image principale</span>
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
              <option value="">Aucune image principale</option>
              {mediaAssets.map((mediaAsset) => (
                <option key={mediaAsset.id} value={mediaAsset.id}>
                  {mediaAsset.originalName} · {mediaAsset.mimeType}
                </option>
              ))}
            </select>
          </label>

          {mediaAssets.length === 0 ? (
            <p className="admin-muted-note">
              Aucun média n&apos;est disponible. Vous pouvez en importer depuis{" "}
              <Link className="link" href="/admin/media">
                la bibliothèque médias
              </Link>
              .
            </p>
          ) : null}
        </section>

        <section className="admin-homepage-section">
          <div className="stack">
            <p className="eyebrow">Éditorial</p>
            <h2>Bloc éditorial</h2>
            <p className="card-copy">
              Complétez ensuite le texte éditorial affiché sous la bannière
              principale.
            </p>
          </div>

          <label className="admin-field">
            <span className="meta-label">Titre éditorial</span>
            <input
              className="admin-input"
              defaultValue={homepage.editorialTitle ?? ""}
              name="editorialTitle"
              type="text"
            />
          </label>

          <label className="admin-field">
            <span className="meta-label">Texte éditorial</span>
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
              En complément, choisissez les produits publiés à afficher sur la
              page d&apos;accueil.
            </p>
          </div>

          <p className="admin-muted-note">
            Ces sélections complètent la page après la bannière principale et
            le bloc éditorial.
          </p>

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
              Publiez d&apos;abord un produit pour l&apos;afficher ici.
            </p>
          )}
        </section>

        <section className="admin-homepage-section">
          <div className="stack">
            <p className="eyebrow">Catégories</p>
            <h2>Catégories mises en avant</h2>
            <p className="card-copy">
              En complément, choisissez les catégories à afficher sur la page
              d&apos;accueil.
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
              Créez ou publiez une catégorie pour l&apos;afficher ici.
            </p>
          )}
        </section>

        <section className="admin-homepage-section">
          <div className="stack">
            <p className="eyebrow">Articles</p>
            <h2>Articles mis en avant</h2>
            <p className="card-copy">
              En complément, choisissez les articles publiés à afficher sur la
              page d&apos;accueil.
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
              Publiez d&apos;abord un article pour l&apos;afficher ici.
            </p>
          )}
        </section>

        <div className="admin-actions">
          <button className="button" type="submit">
            Enregistrer la page d&apos;accueil
          </button>
        </div>
      </form>
    </section>
  );
}
