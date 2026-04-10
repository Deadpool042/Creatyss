import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { ProductTable } from "@/features/admin/products/components/list/product-table";
import { ProductCreateTopbarMenu } from "@/features/admin/products/components";
import { mapProductTableItem } from "@/features/admin/products/list/mappers/server";
import { listAdminProducts } from "@/features/admin/products/list/queries/list-admin-products.query";
import { listProductFilterCategories } from "@/features/admin/products/list/queries/list-product-filter-categories.query";

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
      contentClassName="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pt-14 pb-[calc(3.5rem+env(safe-area-inset-bottom)+1rem)] [@media(max-height:480px)]:px-2.5 [@media(max-height:480px)]:pt-12 [@media(max-height:480px)]:pb-[calc(2.75rem+env(safe-area-inset-bottom)+0.75rem)] md:overflow-hidden md:pb-6 md:pt-3 lg:px-6 lg:pb-8 lg:pt-4"
    >
      <ProductTable
        products={products}
        categoryOptions={categoryOptions}
      />
    </AdminPageShell>
  );
}
