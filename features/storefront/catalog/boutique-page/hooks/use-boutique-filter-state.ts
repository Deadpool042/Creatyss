"use client";

import { useCallback, useState } from "react";
import { useSearchParams } from "next/navigation";

import { buildBoutiqueUrl } from "@/features/storefront/catalog/boutique-page/model/build-boutique-url";
import { normalizeAvailabilityParam } from "@/features/storefront/catalog/boutique-page/model/availability-filter.utils";
import {
  centsToEurosInputValue,
  eurosInputToCents,
} from "@/features/storefront/catalog/boutique-page/model/price-input-utils";
import type {
  BoutiqueAvailabilityValue,
  BoutiquePageViewModel,
} from "@/features/storefront/catalog/boutique-page/types";
import { useBoutiqueFilterCount } from "@/features/storefront/catalog/boutique-page/hooks/use-boutique-filter-count";

type AvailabilityState = "" | BoutiqueAvailabilityValue;

type UseBoutiqueFilterStateInput = {
  model: BoutiquePageViewModel;
};

export type UseBoutiqueFilterStateResult = {
  selectedCategorySlugs: string[];
  selectedAvailability: AvailabilityState;
  selectedMinPriceEuros: string;
  selectedMaxPriceEuros: string;
  toggleCategory: (slug: string, childSlugs?: string[], parentSlug?: string) => void;
  setSelectedAvailability: (value: AvailabilityState) => void;
  setSelectedMinPriceEuros: (value: string) => void;
  setSelectedMaxPriceEuros: (value: string) => void;
  resultCount: number;
  countFetchFailed: boolean;
  buildApplyHref: () => string;
  resetState: () => void;
};

export function useBoutiqueFilterState({
  model,
}: UseBoutiqueFilterStateInput): UseBoutiqueFilterStateResult {
  const searchParams = useSearchParams();

  const [selectedCategorySlugs, setSelectedCategorySlugs] = useState<string[]>(
    model.selectedCategorySlugs
  );
  const [selectedAvailability, setSelectedAvailability] = useState<AvailabilityState>(
    normalizeAvailabilityParam(searchParams.get("availability")) ||
      (model.onlyAvailable ? "in-stock" : "")
  );
  const [selectedMinPriceEuros, setSelectedMinPriceEuros] = useState(
    centsToEurosInputValue(model.selectedMinPriceCents)
  );
  const [selectedMaxPriceEuros, setSelectedMaxPriceEuros] = useState(
    centsToEurosInputValue(model.selectedMaxPriceCents)
  );

  const { count: resultCount, countFetchFailed } = useBoutiqueFilterCount({
    searchQuery: model.searchQuery,
    selectedSort: model.selectedSort,
    selectedCategorySlugs,
    selectedAvailability,
    selectedMinPriceEuros,
    selectedMaxPriceEuros,
    initialCount: model.totalProductCount,
  });

  const toggleCategory = useCallback(
    (slug: string, childSlugs: string[] = [], parentSlug?: string) => {
      if (slug === "") {
        setSelectedCategorySlugs([]);
        return;
      }
      setSelectedCategorySlugs((prev) => {
        const isActive = prev.includes(slug);
        const childSet = new Set(childSlugs);
        if (isActive) {
          return prev.filter((s) => s !== slug && !childSet.has(s));
        }
        if (parentSlug !== undefined && prev.includes(parentSlug)) {
          return [...prev.filter((s) => s !== parentSlug), slug];
        }
        return [...prev.filter((s) => !childSet.has(s)), slug];
      });
    },
    []
  );

  const buildApplyHref = useCallback(
    () => {
      const rawMin = eurosInputToCents(selectedMinPriceEuros);
      const rawMax = eurosInputToCents(selectedMaxPriceEuros);
      const minPrice = rawMin !== null && rawMax !== null && rawMin > rawMax ? rawMax : rawMin;
      const maxPrice = rawMin !== null && rawMax !== null && rawMin > rawMax ? rawMin : rawMax;
      return buildBoutiqueUrl({
        q: model.searchQuery,
        categories: selectedCategorySlugs,
        availability: selectedAvailability === "" ? null : selectedAvailability,
        minPrice,
        maxPrice,
        sort: model.selectedSort,
      });
    },
    [
      model.searchQuery,
      model.selectedSort,
      selectedCategorySlugs,
      selectedAvailability,
      selectedMinPriceEuros,
      selectedMaxPriceEuros,
    ]
  );

  const resetState = useCallback(() => {
    setSelectedCategorySlugs([]);
    setSelectedAvailability("");
    setSelectedMinPriceEuros("");
    setSelectedMaxPriceEuros("");
  }, []);

  return {
    selectedCategorySlugs,
    selectedAvailability,
    selectedMinPriceEuros,
    selectedMaxPriceEuros,
    toggleCategory,
    setSelectedAvailability,
    setSelectedMinPriceEuros,
    setSelectedMaxPriceEuros,
    resultCount,
    countFetchFailed,
    buildApplyHref,
    resetState,
  };
}
