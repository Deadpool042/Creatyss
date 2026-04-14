import { AdminPageShell } from "@/components/admin/admin-page-shell";
import {
  createProductAction,
  listAdminCreatableProductTypeOptions,
} from "@/features/admin/products/create";
import { ProductCreatePanel } from "@/features/admin/products/components";

export default async function ProductCreatePage() {
  const productTypeOptions = await listAdminCreatableProductTypeOptions();

  return (
    <AdminPageShell
      title="Nouveau produit"
      eyebrow="Produits"
      description="Créez un produit, puis complétez ses informations dans l’éditeur."
      viewportClassName="!h-full"
      navigation={{ label: "Produits", href: "/admin/products" }}
      breadcrumbs={[
        { label: "Accueil", href: "/admin" },
        { label: "Produits", href: "/admin/products" },
        { label: "Nouveau produit" },
      ]}
      contentClassName="min-h-0 flex-1 overflow-hidden px-3 pt-16 pb-0 [@media(max-height:480px)]:px-2.5 [@media(max-height:480px)]:pt-12 lg:px-6 lg:pb-4 lg:pt-0"
      headerDensity="compact"
      compactMobileTitle
      hideDescriptionOnMobile
      headerVisibility="desktop"
    >
      <ProductCreatePanel action={createProductAction} productTypeOptions={productTypeOptions} />
    </AdminPageShell>
  );
}
