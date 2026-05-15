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
  triggerTestId?: string;
};

export function BoutiqueFiltersDrawer({
  model,
  label = "Filtres",
  className,
  triggerTestId,
}: BoutiqueFiltersDrawerProps) {
  return (
    <Drawer direction="left">
      <DrawerTrigger asChild>
        <button type="button" className={className} data-testid={triggerTestId}>
          {label}
        </button>
      </DrawerTrigger>

      <DrawerContent className="w-[19rem] max-w-[82vw] border-surface-border-subtle/70 bg-surface-floating/94 shadow-overlay p-0 backdrop-blur-[24px]">
        <DrawerHeader className="flex items-center justify-between border-b border-surface-border-subtle/70 px-4 pt-3 pb-[0.7rem]">
          <div className="grid gap-0.5">
            <DrawerTitle>Filtres</DrawerTitle>
            <DrawerDescription className="m-0 text-xs leading-[1.3] text-text-muted-strong/82">
              Affinez la sélection boutique.
            </DrawerDescription>
          </div>

          <DrawerClose asChild>
            <Button aria-label="Fermer les filtres" size="icon-sm" type="button" variant="ghost">
              <XIcon />
            </Button>
          </DrawerClose>
        </DrawerHeader>

        <div className="grid gap-2 max-h-[min(calc(100dvh-5.5rem),42rem)] overflow-y-auto p-4 pb-[1.15rem]">
          <BoutiqueFiltersContent
            model={model}
            className="grid gap-2"
            variant="drawer"
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
