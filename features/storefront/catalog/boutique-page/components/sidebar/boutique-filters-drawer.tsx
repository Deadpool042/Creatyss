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

      <DrawerContent className="boutique-filters-drawer">
        <DrawerHeader className="boutique-filters-drawer-header">
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

        <div className="boutique-filters-drawer-content">
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
