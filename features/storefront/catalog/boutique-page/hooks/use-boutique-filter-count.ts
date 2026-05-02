import { useEffect, useState } from "react";

import { eurosInputToCents } from "@/features/storefront/catalog/boutique-page/model/price-input-utils";
import type { BoutiqueSortValue } from "@/features/storefront/catalog/boutique-page/types";

type UseBoutiqueFilterCountParams = {
  searchQuery: string;
  selectedSort: BoutiqueSortValue;
  selectedCategorySlug: string;
  selectedAvailability: string;
  selectedMinPriceEuros: string;
  selectedMaxPriceEuros: string;
  initialCount?: number;
};

type UseBoutiqueFilterCountResult = {
  count: number;
  countFetchFailed: boolean;
};

/**
 * Hook to fetch and track the product count based on filter parameters
 */
export function useBoutiqueFilterCount({
  searchQuery,
  selectedSort,
  selectedCategorySlug,
  selectedAvailability,
  selectedMinPriceEuros,
  selectedMaxPriceEuros,
  initialCount = 0,
}: UseBoutiqueFilterCountParams): UseBoutiqueFilterCountResult {
  const [count, setCount] = useState(initialCount);
  const [countFetchFailed, setCountFetchFailed] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(async () => {
      try {
        const params = new URLSearchParams();

        if (searchQuery.trim().length > 0) {
          params.set("q", searchQuery.trim());
        }

        if (selectedCategorySlug.trim().length > 0) {
          params.set("category", selectedCategorySlug.trim());
        }

        if (selectedAvailability !== "") {
          params.set("availability", selectedAvailability);
        }

        const minPriceCents = eurosInputToCents(selectedMinPriceEuros);
        const maxPriceCents = eurosInputToCents(selectedMaxPriceEuros);

        if (minPriceCents !== null) {
          params.set("minPrice", String(minPriceCents));
        }

        if (maxPriceCents !== null) {
          params.set("maxPrice", String(maxPriceCents));
        }

        if (selectedSort !== "featured") {
          params.set("sort", selectedSort);
        }

        const query = params.toString();
        const url =
          query.length > 0
            ? `/api/storefront/catalog/count?${query}`
            : "/api/storefront/catalog/count";

        const response = await fetch(url, {
          method: "GET",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("catalog_count_request_failed");
        }

        const payload: unknown = await response.json();

        if (
          typeof payload === "object" &&
          payload !== null &&
          "count" in payload &&
          typeof payload.count === "number" &&
          Number.isFinite(payload.count)
        ) {
          setCount(Math.max(0, Math.trunc(payload.count)));
          setCountFetchFailed(false);
        } else {
          throw new Error("catalog_count_invalid_payload");
        }
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        console.error("boutique_filters_count_failed", error);
        setCountFetchFailed(true);
      }
    }, 220);

    return () => {
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, [
    searchQuery,
    selectedSort,
    selectedAvailability,
    selectedCategorySlug,
    selectedMinPriceEuros,
    selectedMaxPriceEuros,
  ]);

  return { count, countFetchFailed };
}
