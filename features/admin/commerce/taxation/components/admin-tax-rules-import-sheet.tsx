"use client";

import { AdminTaxRulesImport } from "./admin-tax-rules-import";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

type AdminTaxRulesImportSheetProps = Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
}>;

export function AdminTaxRulesImportSheet({ open, onOpenChange }: AdminTaxRulesImportSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>Import CSV</SheetTitle>
          <SheetDescription>
            Créez ou mettez à jour plusieurs règles de TVA à partir d'un fichier CSV.
          </SheetDescription>
        </SheetHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-1 pb-4">
          <AdminTaxRulesImport />
        </div>
      </SheetContent>
    </Sheet>
  );
}
