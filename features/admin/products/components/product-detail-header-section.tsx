import { Badge } from "@/components/ui/badge";

type ProductDetailHeaderSectionProps = Readonly<{
  summary: {
    statusLabel: string;
    typeLabel: string;
    featuredLabel: string;
    categoryLabel: string;
    sellableLabel: string;
  };
}>;

export function ProductDetailHeaderSection({ summary }: ProductDetailHeaderSectionProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge variant="outline">{summary.statusLabel}</Badge>
      <Badge variant="outline">{summary.typeLabel}</Badge>
      <Badge variant={summary.featuredLabel === "Mis en avant" ? "secondary" : "outline"}>
        {summary.featuredLabel}
      </Badge>
      <Badge variant="secondary">{summary.categoryLabel}</Badge>
      <Badge variant="secondary">{summary.sellableLabel}</Badge>
    </div>
  );
}
