import { fileURLToPath } from "node:url";
import { createScriptPrismaClient } from "../helpers/prisma-client";
import { parseCliOptions } from "./cli";
import { ensureDefaultPriceList } from "./bootstrap/ensure-price-list";
import { ensureStore } from "./bootstrap/ensure-store";
import { ensureWooImportedProductType } from "./bootstrap/ensure-product-type";
import { importBlogPosts } from "./blog/blog-import.service";
import { importCategories } from "./categories/category-import.service";
import { WooCommerceClient } from "./client/woocommerce-client";
import { readImportWooCommerceEnv } from "./env";
import { importProducts } from "./products/product-import.service";
import { resetImportedCatalog } from "./reset/reset-imported-catalog";
import type { PreparedWooProduct, WordPressMedia } from "./schemas";
import {
  endProgress,
  failSpinner,
  logError,
  logProgress,
  logStep,
  logSuccess,
  startSpinner,
  succeedSpinner,
} from "./shared/logging";
import { createEmptyImportResult, incrementCounter } from "./shared/result";
import { importVariants } from "./variants/variant-import.service";

function pluralize(count: number, singular: string, plural: string): string {
  return count > 1 ? plural : singular;
}

export async function runImportWooCommerceCatalog(argv: readonly string[]): Promise<void> {
  const options = parseCliOptions(argv);
  const env = readImportWooCommerceEnv();
  const prisma = createScriptPrismaClient();
  const wooClient = new WooCommerceClient(env);
  const result = createEmptyImportResult();

  try {
    logStep("Fetching categories from WooCommerce");
    startSpinner("Fetching categories");
    const categories = await wooClient.fetchCategories();
    succeedSpinner(`Fetched ${categories.length} categories`);

    logStep("Fetching products from WooCommerce");
    startSpinner("Fetching products");
    const products = await wooClient.fetchProducts();
    succeedSpinner(`Fetched ${products.length} products`);

    logStep("Fetching WordPress blog posts");
    startSpinner("Fetching blog posts");
    const blogPosts = await wooClient.fetchWordPressPosts();
    succeedSpinner(`Fetched ${blogPosts.length} blog posts`);

    const featuredMediaByPostId = new Map<number, WordPressMedia | null>();

    if (!options.skipImages && blogPosts.length > 0) {
      logStep("Fetching WordPress featured media");

      for (const [index, post] of blogPosts.entries()) {
        logProgress(index + 1, blogPosts.length, "Fetching featured media");

        const media =
          post.featured_media && post.featured_media > 0
            ? await wooClient.fetchWordPressMediaById(post.featured_media)
            : null;

        featuredMediaByPostId.set(post.id, media);
      }

      endProgress(`Fetched featured media for ${blogPosts.length} blog posts`);
    }

    const preparedProducts: PreparedWooProduct[] = [];

    logStep("Preparing WooCommerce products");

    for (const [index, product] of products.entries()) {
      logProgress(index + 1, products.length, "Preparing products");

      const variations =
        product.type === "variable" ? await wooClient.fetchVariations(product.id) : [];

      preparedProducts.push({
        product,
        variations,
      });
    }

    if (products.length > 0) {
      endProgress(`Prepared ${preparedProducts.length} WooCommerce products`);
    }

    const store = await ensureStore(prisma);
    const priceList = await ensureDefaultPriceList(prisma, store.id);
    const productType = await ensureWooImportedProductType(prisma, store.id);

    if (options.resetCatalog) {
      logStep("Resetting imported catalog");
      startSpinner("Resetting catalog");
      await resetImportedCatalog(prisma, store.id);
      succeedSpinner("Catalog reset completed");
    } else {
      logStep("Running import without reset");
    }

    logStep("Importing categories");
    const categoriesResult = await importCategories(prisma, {
      env,
      storeId: store.id,
      categories,
      skipImages: options.skipImages,
    });
    incrementCounter(result, "categories", categoriesResult.categoryIdByExternalId.size);
    incrementCounter(result, "images", categoriesResult.importedImages);
    incrementCounter(result, "missingImages", categoriesResult.skippedImages);
    incrementCounter(result, "failedImages", categoriesResult.failedImages);
    incrementCounter(result, "reusedImages", categoriesResult.reusedImages);

    logStep("Importing products");
    const importedProducts = await importProducts(prisma, {
      env,
      storeId: store.id,
      priceListId: priceList.id,
      productTypeId: productType.id,
      preparedProducts,
      categoryIdByExternalId: categoriesResult.categoryIdByExternalId,
      skipImages: options.skipImages,
    });
    incrementCounter(result, "products", importedProducts.importedProducts.length);
    incrementCounter(result, "archivedProducts", importedProducts.archivedProducts);
    incrementCounter(result, "images", importedProducts.importedImages);
    incrementCounter(result, "reusedImages", importedProducts.reusedImages);
    incrementCounter(result, "missingImages", importedProducts.skippedImages);
    incrementCounter(result, "failedImages", importedProducts.failedImages);

    logStep("Importing variants");
    const importedVariants = await importVariants(prisma, {
      env,
      priceListId: priceList.id,
      preparedProducts,
      productIdByExternalId: importedProducts.productIdByExternalId,
      primaryImageIdByProductId: importedProducts.primaryImageIdByProductId,
      skipImages: options.skipImages,
    });
    incrementCounter(result, "variants", importedVariants.importedVariants.length);
    incrementCounter(result, "images", importedVariants.importedImages);
    incrementCounter(result, "missingImages", importedVariants.skippedImages);
    incrementCounter(result, "failedImages", importedVariants.failedImages);
    incrementCounter(result, "reusedImages", importedVariants.reusedImages);

    logStep("Importing blog posts");
    const importedBlogPosts = await importBlogPosts(prisma, {
      env,
      storeId: store.id,
      posts: blogPosts,
      featuredMediaByPostId,
      skipImages: options.skipImages,
    });
    incrementCounter(result, "blogPosts", importedBlogPosts.importedBlogPosts.length);
    incrementCounter(result, "archivedBlogPosts", importedBlogPosts.archivedBlogPosts);
    incrementCounter(result, "images", importedBlogPosts.importedImages);
    incrementCounter(result, "missingImages", importedBlogPosts.skippedImages);
    incrementCounter(result, "failedImages", importedBlogPosts.failedImages);
    incrementCounter(result, "reusedImages", importedBlogPosts.reusedImages);

    logSuccess(
      [
        "Import terminé",
        `${result.counters.categories} ${pluralize(result.counters.categories, "catégorie", "catégories")}`,
        `${result.counters.products} ${pluralize(result.counters.products, "produit", "produits")}`,
        `${result.counters.archivedProducts} ${pluralize(result.counters.archivedProducts, "produit archivé", "produits archivés")}`,
        `${result.counters.variants} ${pluralize(result.counters.variants, "variante", "variantes")}`,
        `${result.counters.blogPosts} ${pluralize(result.counters.blogPosts, "article", "articles")}`,
        `${result.counters.archivedBlogPosts} ${pluralize(result.counters.archivedBlogPosts, "article archivé", "articles archivés")}`,
        `${result.counters.images} ${pluralize(result.counters.images, "image importée", "images importées")}`,
        `${result.counters.missingImages} ${pluralize(result.counters.missingImages, "image absente", "images absentes")}`,
        `${result.counters.failedImages} ${pluralize(result.counters.failedImages, "image en erreur", "images en erreur")}`,
        `${result.counters.reusedImages} ${pluralize(result.counters.reusedImages, "image réutilisée", "images réutilisées")}`,
      ].join(", ")
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown WooCommerce import error.";
    failSpinner(message);
    logError(message);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

async function main(): Promise<void> {
  await runImportWooCommerceCatalog(process.argv.slice(2));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch(() => {
    process.exitCode = 1;
  });
}
