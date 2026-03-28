import { Badge } from "@/components/ui/badge";

export type ProductStatus = "draft" | "published" | "archived";

const statusConfig: Record<
  ProductStatus,
  { label: string; variant: "default" | "secondary" | "outline" }
> = {
  published: { label: "Publié", variant: "default" },
  draft: { label: "Brouillon", variant: "outline" },
  archived: { label: "Archivé", variant: "secondary" },
};

type ProductStatusBadgeProps = {
  status: ProductStatus;
  className?: string;
};

export function ProductStatusBadge({ status, className }: ProductStatusBadgeProps) {
  const { label, variant } = statusConfig[status];
  return (
    <Badge variant={variant} className={className}>
      {label}
    </Badge>
  );
}
