"use client";

import { AdminDiscountCreateForm } from "./admin-discount-create-form";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

type AdminDiscountCreateSheetProps = Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  automationEnabled: boolean;
  rulesEnabled: boolean;
  products: ReadonlyArray<{ id: string; name: string; slug: string }>;
  variants: ReadonlyArray<{
    id: string;
    productName: string;
    variantName: string | null;
    sku: string;
  }>;
  categories: ReadonlyArray<{ id: string; name: string; slug: string }>;
  errorMessage: string | null;
}>;

export function AdminDiscountCreateSheet({
  open,
  onOpenChange,
  automationEnabled,
  rulesEnabled,
  products,
  variants,
  categories,
  errorMessage,
}: AdminDiscountCreateSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>{automationEnabled ? "Nouvelle remise" : "Nouveau code promo"}</SheetTitle>
          <SheetDescription>
            {automationEnabled
              ? "Pourcentage ou montant fixe, applicable au panier ou à une sélection catalogue. Une remise peut rester manuelle ou devenir automatique au checkout."
              : "Pourcentage ou montant fixe, applicable au panier. Les remises automatiques et le ciblage catalogue nécessitent des niveaux supérieurs."}
          </SheetDescription>
        </SheetHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-1 pb-4">
          {errorMessage !== null ? (
            <p className="mb-4 rounded-lg bg-feedback-error-surface/60 px-3 py-2 text-[13px] text-feedback-error-foreground">
              {errorMessage}
            </p>
          ) : null}

          <AdminDiscountCreateForm
            automationEnabled={automationEnabled}
            rulesEnabled={rulesEnabled}
            products={products}
            variants={variants}
            categories={categories}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
