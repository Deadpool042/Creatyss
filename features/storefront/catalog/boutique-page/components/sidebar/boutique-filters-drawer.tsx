"use client";
import { XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { BoutiqueFiltersContent } from "@/features/storefront/catalog/boutique-page/components/filters/boutique-filters-content";
import type { BoutiquePageViewModel } from "@/features/storefront/catalog/boutique-page/types";

type BoutiqueFiltersDrawerProps = {
  model: BoutiquePageViewModel;
  label?: string;
  className?: string;
};

export function BoutiqueFiltersDrawer({
  model,
  label = "Filtres",
  className,
}: BoutiqueFiltersDrawerProps) {
  return (
    <Drawer direction="left">
      <DrawerTrigger asChild>
        <button type="button" className={className}>
          {label}
        </button>
      </DrawerTrigger>

      <DrawerContent className="w-76 max-w-[82vw] border-surface-border-subtle/70 bg-overlay-scrim p-0 shadow-overlay backdrop-blur-2xl">
        <DrawerHeader className="flex-row items-center justify-between border-b border-surface-border-subtle/70 px-4 py-3">
          <div className="grid gap-0.5">
            <DrawerTitle>Filtres</DrawerTitle>
            <DrawerDescription className="sr-only">
              Filtrez les produits par catégorie et disponibilité.
            </DrawerDescription>
          </div>

          <DrawerClose asChild>
            <Button aria-label="Fermer les filtres" size="icon-sm" type="button" variant="ghost">
              <XIcon />
            </Button>
          </DrawerClose>
        </DrawerHeader>

        <div className="overflow-y-auto px-4 py-5">
          <BoutiqueFiltersContent
            model={model}
            wrapLink={(link, key) => (
              <DrawerClose asChild key={key}>
                {link}
              </DrawerClose>
            )}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
