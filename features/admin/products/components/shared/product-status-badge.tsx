import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type ProductStatusBadgeProps = {
  status: string;
  className?: string;
};

const statusConfig = {
  draft: {
    label: "Brouillon",
    className: "border-transparent bg-muted text-muted-foreground",
  },
  published: {
    label: "Publié",
    className: "border-transparent bg-primary/10 text-foreground",
  },
  archived: {
    label: "Archivé",
    className: "border-border/60 bg-background/40 text-muted-foreground",
  },
};

export function ProductStatusBadge({ status, className }: ProductStatusBadgeProps) {
  const config = statusConfig[status as keyof typeof statusConfig] ?? statusConfig.draft;

  return (
    <Badge
      variant="outline"
      className={cn(
        "inline-flex h-7 items-center rounded-full px-2.5 text-[12px] font-medium leading-none",
        config.className,
        className
      )}
    >
      {config.label}
    </Badge>
  );
}
