import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { ProductTable } from "@/features/admin/products/components/list/product-table";
import { mapProductTableItem } from "@/features/admin/products/list/mappers/server";
import { listAdminProducts } from "@/features/admin/products/list/queries/list-admin-products.query";
import { listProductFilterCategories } from "@/features/admin/products/list/queries/list-product-filter-categories.query";
import { ProductCreateTopbarMenu } from "@/features/admin/products/components";

export default async function AdminProductsPage() {
  const [rawProducts, categoryOptions] = await Promise.all([
    listAdminProducts(),
    listProductFilterCategories(),
  ]);

  const products = rawProducts.map(mapProductTableItem);

  return (
    <AdminPageShell
      headerVisibility="desktop"
      eyebrow="Catalogue"
      title="Produits"
      description="Pilotage du catalogue."
      topbarAction={<ProductCreateTopbarMenu productId="" />}
      navigation={{ label: "Accueil", href: "/admin" }}
      breadcrumbs={[
        { label: "Accueil", href: "/admin" },
        { label: "Produits", href: "/admin/products" },
      ]}
      viewportClassName="!h-full"
      contentClassName="lg:px-6 lg:pb-6"
    >
      <ProductTable
        products={products}
        categoryOptions={categoryOptions}
        initialMobileFeed={{
          items: [],
          nextCursor: null,
          hasMore: false,
        }}
      />
    </AdminPageShell>
  );
}
