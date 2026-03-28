export type ImportWarning = {
  code: string;
  message: string;
};

export type ImportCounters = {
  categories: number;
  products: number;
  variants: number;
  blogPosts: number;
  archivedBlogPosts: number;
  images: number;
  reusedImages: number;
  missingImages: number;
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
      blogPosts: 0,
      archivedBlogPosts: 0,
      images: 0,
      reusedImages: 0,
      missingImages: 0,
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
