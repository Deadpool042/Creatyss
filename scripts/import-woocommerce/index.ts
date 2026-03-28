import { fileURLToPath } from "node:url";
import { createScriptPrismaClient } from "../helpers/prisma-client";
import { parseCliOptions } from "./cli";
import { ensureDefaultPriceList } from "./bootstrap/ensure-price-list";
import { ensureStore } from "./bootstrap/ensure-store";
import { ensureWooImportedProductType } from "./bootstrap/ensure-product-type";
import { WooCommerceClient } from "./client/woocommerce-client";
import { readImportWooCommerceEnv } from "./env";
import { importCategories } from "./categories/category-import.service";
import { importProducts } from "./products/product-import.service";
import { importVariants } from "./variants/variant-import.service";
import { resetImportedCatalog } from "./reset/reset-imported-catalog";
import type { PreparedWooProduct } from "./schemas";

export async function runImportWooCommerceCatalog(argv: readonly string[]): Promise<void> {
  const options = parseCliOptions(argv);
  const env = readImportWooCommerceEnv();
  const prisma = createScriptPrismaClient();
  const wooClient = new WooCommerceClient(env);

  try {
    process.stdout.write("Fetching categories from WooCommerce...\n");
    const categories = await wooClient.fetchCategories();

    process.stdout.write("Fetching products from WooCommerce...\n");
    const products = await wooClient.fetchProducts();

    const preparedProducts: PreparedWooProduct[] = [];

    process.stdout.write(`Preparing ${products.length} WooCommerce products...\n`);

    for (const [index, product] of products.entries()) {
      process.stdout.write(
        `[prepare ${index + 1}/${products.length}] ${product.slug} (${product.type})\n`
      );

      const variations =
        product.type === "variable" ? await wooClient.fetchVariations(product.id) : [];

      if (product.type === "variable") {
        process.stdout.write(
          `[prepare ${index + 1}/${products.length}] ${product.slug}: ${variations.length} variations\n`
        );
      }

      preparedProducts.push({
        product,
        variations,
      });
    }

    const store = await ensureStore(prisma);
    const priceList = await ensureDefaultPriceList(prisma, store.id);
    const productType = await ensureWooImportedProductType(prisma, store.id);

    if (options.resetCatalog) {
      process.stdout.write("Resetting imported catalog...\n");
      await resetImportedCatalog(prisma, store.id);
    }

    process.stdout.write("Importing categories...\n");
    const categoryIdByExternalId = await importCategories(prisma, {
      env,
      storeId: store.id,
      categories,
      skipImages: options.skipImages,
    });

    process.stdout.write("Importing products...\n");
    const importedProducts = await importProducts(prisma, {
      env,
      storeId: store.id,
      priceListId: priceList.id,
      productTypeId: productType.id,
      preparedProducts,
      categoryIdByExternalId,
      skipImages: options.skipImages,
    });

    process.stdout.write("Importing variants...\n");
    const importedVariants = await importVariants(prisma, {
      env,
      priceListId: priceList.id,
      preparedProducts,
      productIdByExternalId: importedProducts.productIdByExternalId,
      primaryImageIdByProductId: importedProducts.primaryImageIdByProductId,
      skipImages: options.skipImages,
    });

    process.stdout.write(
      `Imported ${categoryIdByExternalId.size} categories, ${importedProducts.importedProducts.length} products, ${importedVariants.importedVariants.length} variants.\n`
    );
  } finally {
    await prisma.$disconnect();
  }
}

async function main(): Promise<void> {
  await runImportWooCommerceCatalog(process.argv.slice(2));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((error: unknown) => {
    const message = error instanceof Error ? error.message : "Unknown WooCommerce import error.";
    process.stderr.write(`${message}\n`);
    process.exitCode = 1;
  });
}
