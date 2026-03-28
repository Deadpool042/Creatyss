export type ImportWarning = {
  code: string;
  message: string;
};

export type ImportCounters = {
  categories: number;
  products: number;
  variants: number;
  images: number;
  skippedImages: number;
  failedImages: number;
};

export type ImportResult = {
  counters: ImportCounters;
  warnings: ImportWarning[];
};

export function createEmptyImportResult(): ImportResult {
  return {
    counters: {
      categories: 0,
      products: 0,
      variants: 0,
      images: 0,
      skippedImages: 0,
      failedImages: 0,
    },
    warnings: [],
  };
}

export function addWarning(result: ImportResult, warning: ImportWarning): void {
  result.warnings.push(warning);
}

export function incrementCounter(
  result: ImportResult,
  counter: keyof ImportCounters,
  amount = 1
): void {
  result.counters[counter] += amount;
}
