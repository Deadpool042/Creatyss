"use client";

import { useRouter } from "next/navigation";
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
import { useBoutiqueFilterState } from "@/features/storefront/catalog/boutique-page/hooks/use-boutique-filter-state";
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
  const router = useRouter();
  const {
    resultCount,
    countFetchFailed,
    buildApplyHref,
    resetState,
    setSelectedMinPriceEuros,
    setSelectedMaxPriceEuros,
  } = useBoutiqueFilterState({ model });

  const resultLabel = countFetchFailed
    ? "Voir les résultats"
    : `Voir ${resultCount} résultat${resultCount > 1 ? "s" : ""}`;

  return (
    <Drawer direction="left">
      <DrawerTrigger asChild>
        <button type="button" className={className} data-testid={triggerTestId}>
          {label}
        </button>
      </DrawerTrigger>

      <DrawerContent className="flex flex-col w-76 max-w-[82vw] border-surface-border-subtle/70 bg-surface-floating/94 shadow-overlay p-0 backdrop-blur-xl">
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

        <div className="flex-1 grid gap-2 overflow-y-auto px-5 py-4 pb-[1.15rem]">
          <BoutiqueFiltersContent
            model={model}
            className="grid gap-2"
            variant="drawer"
            onPriceMinChange={setSelectedMinPriceEuros}
            onPriceMaxChange={setSelectedMaxPriceEuros}
            wrapLink={(link, key) => (
              <DrawerClose asChild key={key}>
                {link}
              </DrawerClose>
            )}
          />
        </div>

        <div className="sticky bottom-0 grid gap-1.5 border-t border-surface-border-subtle/70 bg-surface-floating/96 px-4 pt-3 pb-4 backdrop-blur-md">
          <span aria-live="polite" aria-atomic="true" className="sr-only">
            {resultLabel}
          </span>
          <DrawerClose asChild>
            <Button className="h-10 w-full" onClick={() => router.push(buildApplyHref())}>
              {resultLabel}
            </Button>
          </DrawerClose>
          <DrawerClose asChild>
            <button
              type="button"
              onClick={() => {
                resetState();
                router.push(model.resetHref);
              }}
              className="inline-flex h-8 items-center justify-center text-xs text-text-muted-strong underline-offset-4 transition-colors hover:text-foreground hover:underline"
            >
              Réinitialiser
            </button>
          </DrawerClose>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
