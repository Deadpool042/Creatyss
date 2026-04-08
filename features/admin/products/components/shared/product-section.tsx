import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type ProductSectionProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
};

export function ProductSection({ title, children, className }: ProductSectionProps) {
  return (
    <section className={cn("space-y-3", className)}>
      <div className="space-y-1.5">
        <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {title}
        </h3>
        <Separator />
      </div>
      <div>{children}</div>
    </section>
  );
}
