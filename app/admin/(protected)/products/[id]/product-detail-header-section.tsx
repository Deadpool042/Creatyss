import Link from "next/link";
import { PageHeader } from "@/components/page-header";

type ProductDetailHeaderSectionProps = Readonly<{
  summary: {
    statusLabel: string;
    typeLabel: string;
    featuredLabel: string;
    categoryLabel: string;
    sellableLabel: string;
  };
}>;

export function ProductDetailHeaderSection({
  summary
}: ProductDetailHeaderSectionProps) {
  return (
    <section className="section admin-product-section">
      <PageHeader
        actions={
          <Link
            className="link-subtle button"
            href="/admin/products">
            Retour à la liste
          </Link>
        }
        description={
          <>
            Commencez par les informations générales, puis complétez les
            informations de vente ou les déclinaisons selon le type du produit.
          </>
        }
        eyebrow="Produits"
        title="Modifier le produit"
      />

      <div className="admin-product-tags">
        <span className="admin-chip">{summary.statusLabel}</span>
        <span className="admin-chip">{summary.typeLabel}</span>
        <span className="admin-chip">{summary.featuredLabel}</span>
        <span className="admin-chip">{summary.categoryLabel}</span>
        <span className="admin-chip">{summary.sellableLabel}</span>
      </div>
    </section>
  );
}
