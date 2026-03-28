export type ImportWarning = {
  code: string;
  message: string;
};

export type ImportCounters = {
  categories: number;
  archivedCategories: number;
  products: number;
  archivedProducts: number;
  variants: number;
  archivedVariants: number;
  blogPosts: number;
  archivedBlogPosts: number;
  images: number;
  reusedImages: number;
  missingImages: number;
  failedImages: number;
  deletedMediaAssets: number;
};

export type ImportResult = {
  counters: ImportCounters;
  warnings: ImportWarning[];
};

export function createEmptyImportResult(): ImportResult {
  return {
    counters: {
      categories: 0,
      archivedCategories: 0,
      products: 0,
      archivedProducts: 0,
      variants: 0,
      archivedVariants: 0,
      blogPosts: 0,
      archivedBlogPosts: 0,
      images: 0,
      reusedImages: 0,
      missingImages: 0,
      failedImages: 0,
      deletedMediaAssets: 0,
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
