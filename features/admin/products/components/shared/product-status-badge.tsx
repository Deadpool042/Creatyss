import { Badge } from "@/components/ui/badge";

type ProductStatusBadgeProps = {
  status: "draft" | "active" | "inactive" | "archived";
};

function getStatusLabel(status: ProductStatusBadgeProps["status"]): string {
  switch (status) {
    case "draft":
      return "Brouillon";
    case "active":
      return "Actif";
    case "inactive":
      return "Inactif";
    case "archived":
      return "Archivé";
  }
}

function getStatusVariant(status: ProductStatusBadgeProps["status"]) {
  switch (status) {
    case "active":
      return "secondary" as const;
    case "draft":
      return "outline" as const;
    case "inactive":
      return "outline" as const;
    case "archived":
      return "outline" as const;
  }
}

export function ProductStatusBadge({ status }: ProductStatusBadgeProps) {
  return <Badge variant={getStatusVariant(status)}>{getStatusLabel(status)}</Badge>;
}
