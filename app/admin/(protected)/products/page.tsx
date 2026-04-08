import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { ProductTable } from "@/features/admin/products/components/list/product-table";
import { parseProductsPageParams } from "@/features/admin/products/navigation";
import { mapProductTableItem } from "@/features/admin/products/list/mappers/server";
import { getAdminProductsFeed } from "@/features/admin/products/list/queries/get-admin-products-feed.query";
import { listAdminProducts } from "@/features/admin/products/list/queries/list-admin-products.query";
import { listProductFilterCategories } from "@/features/admin/products/list/queries/list-product-filter-categories.query";
import { ProductCreateTopbarMenu } from "@/features/admin/products/components";

export default async function AdminProductsPage() {
  const params = parseProductsPageParams(undefined);

  const [rawProducts, categoryOptions, initialMobileFeed] = await Promise.all([
    listAdminProducts(params),
    listProductFilterCategories(),
    getAdminProductsFeed({
      limit: 12,
      cursor: null,
      ...(params.search.trim().length > 0 ? { search: params.search } : {}),
    }),
  ]);

  const products = rawProducts.map(mapProductTableItem);

  return (
    <AdminPageShell
      headerVisibility="desktop"
      eyebrow="Catalogue"
      title="Produits"
      description="Pilotez le catalogue et affinez rapidement la liste."
      topbarAction={<ProductCreateTopbarMenu productId="" />}
      navigation={{ label: "Accueil", href: "/admin" }}
      breadcrumbs={[
        { label: "Accueil", href: "/admin" },
        { label: "Produits", href: "/admin/products" },
      ]}
      viewportClassName="!h-full"
      contentClassName={["lg:px-6", "lg:pb-6"].join(" ")}
    >
      <ProductTable
        products={products}
        categoryOptions={categoryOptions}
        initialMobileFeed={initialMobileFeed}
      />
    </AdminPageShell>
  );
}
