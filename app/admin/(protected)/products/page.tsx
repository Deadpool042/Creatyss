import Link from "next/link";
import { Notice } from "@/components/notice";
import { PageHeader } from "@/components/page-header";
import { AdminEmptyState } from "@/components/admin";
import { listAdminProducts } from "@/db/repositories/admin-product.repository";
import { ProductsListTable } from "@/features/admin/products/components";

export const dynamic = "force-dynamic";

type AdminProductsPageProps = Readonly<{
  searchParams: Promise<{
    error?: string | string[];
    status?: string | string[];
  }>;
}>;

function getStatusMessage(status: string | undefined): string | null {
  switch (status) {
    case "deleted":
      return "Produit supprimé avec succès.";
    default:
      return null;
  }
}

function getErrorMessage(error: string | undefined): string | null {
  switch (error) {
    case "missing_product":
      return "Le produit demandé est introuvable.";
    default:
      return null;
  }
}

export default async function AdminProductsPage({
  searchParams
}: AdminProductsPageProps) {
  const resolvedSearchParams = await searchParams;
  const statusParam = Array.isArray(resolvedSearchParams.status)
    ? resolvedSearchParams.status[0]
    : resolvedSearchParams.status;
  const errorParam = Array.isArray(resolvedSearchParams.error)
    ? resolvedSearchParams.error[0]
    : resolvedSearchParams.error;
  const successMessage = getStatusMessage(statusParam);
  const errorMessage = getErrorMessage(errorParam);
  const products = await listAdminProducts();

  return (
    <div className="grid gap-6">
      <section className="grid gap-6">
        <PageHeader
          actions={
            <Link
              className="button"
              href="/admin/products/new">
              Nouveau produit
            </Link>
          }
          description="Gérez les produits, leurs catégories, leurs déclinaisons et leurs images depuis un seul espace."
          eyebrow="Produits"
          title="Produits"
        />

        {successMessage ? (
          <Notice tone="success">{successMessage}</Notice>
        ) : null}
        {errorMessage ? <Notice tone="alert">{errorMessage}</Notice> : null}

        {products.length > 0 ? (
          <ProductsListTable products={products} />
        ) : (
          <AdminEmptyState
            eyebrow="Aucun produit"
            title="Le catalogue ne contient pas encore de produit"
            description="Créez un premier produit pour commencer à structurer le catalogue."
          />
        )}
      </section>
    </div>
  );
}
