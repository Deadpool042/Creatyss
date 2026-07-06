"use client";

import { AdminTaxRuleCreateForm } from "./admin-tax-rule-create-form";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

type AdminTaxRuleCreateSheetProps = Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  errorMessage: string | null;
}>;

export function AdminTaxRuleCreateSheet({
  open,
  onOpenChange,
  errorMessage,
}: AdminTaxRuleCreateSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>Nouvelle règle</SheetTitle>
          <SheetDescription>
            Taux standard par territoire (scope boutique, prix TTC). Les taux réduits par catégorie
            viendront ultérieurement.
          </SheetDescription>
        </SheetHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-1 pb-4">
          {errorMessage !== null ? (
            <p className="mb-4 rounded-lg bg-feedback-error-surface/60 px-3 py-2 text-[13px] text-feedback-error-foreground">
              {errorMessage}
            </p>
          ) : null}

          <AdminTaxRuleCreateForm />
        </div>
      </SheetContent>
    </Sheet>
  );
}
