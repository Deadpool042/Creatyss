"use client";

import { Star } from "lucide-react";
import { useTransition, type JSX } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ProductFeaturedToggleProps = {
  productId: string;
  isFeatured: boolean;
  onToggle: (productId: string) => Promise<unknown>;
  className?: string;
  iconClassName?: string;
};

export function ProductFeaturedToggle({
  productId,
  isFeatured,
  onToggle,
  className,
  iconClassName,
}: ProductFeaturedToggleProps): JSX.Element {
  const [isPending, startTransition] = useTransition();

  function handleToggle(): void {
    startTransition(() => {
      void onToggle(productId);
    });
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={handleToggle}
      disabled={isPending}
      className={cn(
        "h-8 w-8 rounded-full p-0 transition-colors",
        className,
        isFeatured
          ? "border border-surface-border-strong bg-interactive-selected text-foreground hover:bg-interactive-selected"
          : "border border-surface-border bg-card text-muted-foreground hover:bg-interactive-hover"
      )}
      title={isFeatured ? "Retirer de la mise en avant" : "Mettre en avant"}
      aria-label={isFeatured ? "Retirer de la mise en avant" : "Mettre en avant"}
      aria-pressed={isFeatured}
    >
      <Star
        className={cn(
          "h-4 w-4 transition-colors",
          iconClassName,
          isFeatured ? "fill-current text-foreground" : "text-muted-foreground"
        )}
      />
    </Button>
  );
}
