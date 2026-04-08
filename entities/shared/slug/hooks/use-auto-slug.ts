"use client";

import { useCallback, useMemo, useState } from "react";
import { slugifyLabel } from "@/entities/shared/slug";

type UseAutoSlugInput = {
  initialSourceValue?: string;
  initialSlugValue?: string;
};

type UseAutoSlugResult = {
  sourceValue: string;
  slugValue: string;
  isSlugTouched: boolean;
  setSourceValue: (value: string) => void;
  setSlugValue: (value: string) => void;
  resetAutoSlug: (input: UseAutoSlugInput) => void;
};

function shouldTreatSlugAsTouched(input: UseAutoSlugInput): boolean {
  const sourceValue = input.initialSourceValue ?? "";
  const slugValue = (input.initialSlugValue ?? "").trim();

  if (slugValue.length === 0) {
    return false;
  }

  return slugValue !== slugifyLabel(sourceValue);
}

export function useAutoSlug(input: UseAutoSlugInput = {}): UseAutoSlugResult {
  const [sourceValue, setSourceValue] = useState(input.initialSourceValue ?? "");
  const [manualSlugValue, setManualSlugValue] = useState(input.initialSlugValue ?? "");
  const [isSlugTouched, setIsSlugTouched] = useState(shouldTreatSlugAsTouched(input));

  const slugValue = useMemo(() => {
    if (!isSlugTouched || manualSlugValue.trim().length === 0) {
      return slugifyLabel(sourceValue);
    }

    return manualSlugValue;
  }, [sourceValue, manualSlugValue, isSlugTouched]);

  const handleSetSlugValue = useCallback((value: string): void => {
    const normalizedSlug = slugifyLabel(value);

    setManualSlugValue(normalizedSlug);

    if (normalizedSlug.length === 0) {
      setIsSlugTouched(false);
      return;
    }

    setIsSlugTouched(true);
  }, []);

  const resetAutoSlug = useCallback((nextInput: UseAutoSlugInput): void => {
    const nextSourceValue = nextInput.initialSourceValue ?? "";
    const nextSlugValue = nextInput.initialSlugValue ?? "";

    setSourceValue(nextSourceValue);
    setManualSlugValue(nextSlugValue);
    setIsSlugTouched(shouldTreatSlugAsTouched(nextInput));
  }, []);

  return {
    sourceValue,
    slugValue,
    isSlugTouched,
    setSourceValue,
    setSlugValue: handleSetSlugValue,
    resetAutoSlug,
  };
}
