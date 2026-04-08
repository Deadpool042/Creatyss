//app/admin/(protected)/products/[slug]/edit/page.tsx
import Link from "next/link";

import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { Button } from "@/components/ui/button";
import { db } from "@/core/db";
import {
  attachProductImagesAction,
  createProductVariantAction,
  deleteProductImageAction,
  deleteProductVariantAction,
  listAttachableMediaAssets,
  readAdminPriceLists,
  readAdminProductEditorBySlug,
  readAdminProductImages,
  readAdminProductVariants,
  reorderProductImageAction,
  setDefaultProductVariantAction,
  setProductPrimaryImageAction,
  updateProductCategoriesAction,
  updateProductGeneralAction,
  updateProductImageAltTextAction,
  updateProductSeoAction,
  updateProductVariantAction,
  uploadProductImagesAction,
} from "@/features/admin/products/editor";
import { ProductEditorTopbarMenu, ProductEditorPanel } from "@/features/admin/products/components";
import { DeleteProductButton } from "@/features/admin/products/components/editor/delete-product-button";

export default async function ProductEditorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const [editor, availableCategories, priceLists] = await Promise.all([
    readAdminProductEditorBySlug(slug),
    db.category.findMany({
      where: { status: "ACTIVE" },
      orderBy: [{ parentId: "asc" }, { sortOrder: "asc" }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        slug: true,
        parentId: true,
        parent: {
          select: {
            name: true,
          },
        },
      },
    }),
    readAdminPriceLists(),
  ]);

  if (!editor) {
    return (
      <div className="rounded-2xl border bg-card p-6 text-sm text-muted-foreground">
        Le produit demandé est introuvable. Veuillez retourner à la liste des produits et
        sélectionner un produit existant pour l’édition.
        <Button variant="outline" size="sm" className="mt-4" asChild>
          <Link className="inline-flex items-center gap-2" href="/admin/products">
            Retour à la liste des produits
          </Link>
        </Button>
      </div>
    );
  }

  const [variantsData, imagesData, attachableMediaData] = await Promise.all([
    readAdminProductVariants(editor.id),
    readAdminProductImages(editor.id),
    listAttachableMediaAssets(editor.id),
  ]);

  return (
    <AdminPageShell
      title={editor.name}
      eyebrow="Produits"
      description="Modifiez les détails du produit, gérez les variantes, les images et les catégories."
      viewportClassName="!h-full"
      navigation={{ label: "Produits", href: "/admin/products" }}
      breadcrumbs={[
        {
          label: "Accueil",
          href: "/admin",
        },
        {
          label: "Produits",
          href: "/admin/products",
        },
      ]}
      topbarAction={<ProductEditorTopbarMenu productId={editor.id} />}
      contentClassName={["lg:px-6", "lg:pb-6"].join(" ")}
      actions={
        <div className="flex items-center gap-2">
          <div className="hidden lg:flex lg:items-center lg:gap-2">
            <DeleteProductButton productId={editor.id} />

            <Button asChild size="sm" className="lg:min-w-40">
              <Link href="/admin/products/new">Nouveau produit</Link>
            </Button>
          </div>
        </div>
      }
      headerVisibility="desktop"
    >
      <ProductEditorPanel
        generalAction={updateProductGeneralAction}
        seoAction={updateProductSeoAction}
        categoriesAction={updateProductCategoriesAction}
        createVariantAction={createProductVariantAction}
        updateVariantAction={updateProductVariantAction}
        setDefaultVariantAction={setDefaultProductVariantAction}
        deleteVariantAction={deleteProductVariantAction}
        setPrimaryImageAction={setProductPrimaryImageAction}
        deleteImageAction={deleteProductImageAction}
        updateAltTextAction={updateProductImageAltTextAction}
        reorderImageAction={reorderProductImageAction}
        attachImagesAction={attachProductImagesAction}
        uploadImagesAction={uploadProductImagesAction}
        availableCategories={availableCategories.map((category) => ({
          id: category.id,
          name: category.name,
          slug: category.slug,
          parentId: category.parentId,
          parentName: category.parent?.name ?? null,
        }))}
        variants={variantsData?.variants ?? []}
        images={imagesData?.images ?? []}
        attachableMediaItems={attachableMediaData?.items ?? []}
        priceLists={priceLists}
        product={editor}
      />
    </AdminPageShell>
  );
}
