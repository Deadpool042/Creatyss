"use client";

import { Star } from "lucide-react";
import { useTransition, type JSX } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ProductFeaturedToggleProps = {
  productId: string;
  isFeatured: boolean;
  onToggle: (productId: string) => Promise<unknown>;
};

export function ProductFeaturedToggle({
  productId,
  isFeatured,
  onToggle,
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
        isFeatured
          ? "border border-primary/30 bg-primary/10 text-primary hover:bg-primary/15"
          : "border border-border/60 bg-background/20 text-muted-foreground hover:bg-background/35"
      )}
      title={isFeatured ? "Retirer de la mise en avant" : "Mettre en avant"}
      aria-label={isFeatured ? "Retirer de la mise en avant" : "Mettre en avant"}
      aria-pressed={isFeatured}
    >
      <Star
        className={cn(
          "h-4 w-4 transition-colors",
          isFeatured ? "fill-current text-primary" : "text-muted-foreground"
        )}
      />
    </Button>
  );
}
