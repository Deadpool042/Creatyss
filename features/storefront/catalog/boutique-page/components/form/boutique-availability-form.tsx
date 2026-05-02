import Link from "next/link";

import { buildBoutiqueUrl } from "@/features/storefront/catalog/boutique-page/model/build-boutique-url";
import type { BoutiquePageViewModel } from "@/features/storefront/catalog/boutique-page/types";

type BoutiqueAvailabilityFormProps = {
  searchQuery: BoutiquePageViewModel["searchQuery"];
  selectedCategorySlug: BoutiquePageViewModel["selectedCategorySlug"];
  selectedSort: BoutiquePageViewModel["selectedSort"];
  selectedAvailabilityStatus: BoutiquePageViewModel["selectedAvailabilityStatus"];
  availabilityOptions: BoutiquePageViewModel["availabilityOptions"];
};

export function BoutiqueAvailabilityForm({
  searchQuery,
  selectedCategorySlug,
  selectedSort,
  selectedAvailabilityStatus,
  availabilityOptions,
}: BoutiqueAvailabilityFormProps) {
  return (
    <div className="grid gap-1.5">
      <Link
        href={buildBoutiqueUrl({
          q: searchQuery,
          category: selectedCategorySlug,
          availability: null,
          sort: selectedSort,
        })}
        aria-current={selectedAvailabilityStatus === null ? "page" : undefined}
        className={[
          "rounded-md px-2 py-1.5 text-sm transition-colors",
          selectedAvailabilityStatus === null
            ? "bg-surface-panel/60 text-foreground"
            : "text-text-muted-strong hover:bg-surface-panel/42 hover:text-foreground",
        ].join(" ")}
      >
        Toutes les disponibilités
      </Link>

      {availabilityOptions.map((option) => (
        <Link
          key={option.id}
          href={buildBoutiqueUrl({
            q: searchQuery,
            category: selectedCategorySlug,
            availability: option.id,
            sort: selectedSort,
          })}
          aria-current={selectedAvailabilityStatus === option.id ? "page" : undefined}
          className={[
            "rounded-md px-2 py-1.5 text-sm transition-colors",
            selectedAvailabilityStatus === option.id
              ? "bg-surface-panel/60 text-foreground"
              : "text-text-muted-strong hover:bg-surface-panel/42 hover:text-foreground",
          ].join(" ")}
        >
          {option.label}
        </Link>
      ))}
    </div>
  );
}
