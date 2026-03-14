import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
    <section className="space-y-4">
      <PageHeader
        actions={
          <Button
            asChild
            size="sm"
            variant="outline">
            <Link href="/admin/products">Retour à la liste</Link>
          </Button>
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

      <div className="flex flex-wrap gap-2">
        <Badge variant="outline">{summary.statusLabel}</Badge>
        <Badge variant="outline">{summary.typeLabel}</Badge>
        <Badge
          variant={
            summary.featuredLabel === "Mis en avant" ? "secondary" : "outline"
          }>
          {summary.featuredLabel}
        </Badge>
        <Badge variant="secondary">{summary.categoryLabel}</Badge>
        <Badge variant="secondary">{summary.sellableLabel}</Badge>
      </div>
    </section>
  );
}
