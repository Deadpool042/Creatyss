import type { ZodType } from "zod";
import { WOO_PER_PAGE } from "../constants";
import type { ImportWooCommerceEnv } from "../env";
import {
  wooCategorySchema,
  wooProductSchema,
  wooVariationSchema,
  type WooCategory,
  type WooProduct,
  type WooVariation,
} from "../schemas";

export class WooCommerceClient {
  constructor(private readonly env: ImportWooCommerceEnv) {}

  private buildUrl(pathname: string, params?: Record<string, string | number>): string {
    const url = new URL(`${this.env.wcBaseUrl}/wp-json/wc/v3/${pathname.replace(/^\//, "")}`);

    url.searchParams.set("consumer_key", this.env.wcConsumerKey);
    url.searchParams.set("consumer_secret", this.env.wcConsumerSecret);

    for (const [key, value] of Object.entries(params ?? {})) {
      url.searchParams.set(key, String(value));
    }

    return url.toString();
  }

  private async fetchJson<T>(url: string, schema: ZodType<T>): Promise<T> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30_000);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
      });

      if (!response.ok) {
        const body = await response.text();
        throw new Error(`WooCommerce request failed (${response.status}) for ${url}: ${body}`);
      }

      const json = await response.json();
      return schema.parse(json);
    } catch (error: unknown) {
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error(`WooCommerce request timed out for ${url}`);
      }

      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }

  private async fetchPagedCollection<T>(pathname: string, itemSchema: ZodType<T>): Promise<T[]> {
    const results: T[] = [];
    let page = 1;

    while (true) {
      const url = this.buildUrl(pathname, {
        per_page: WOO_PER_PAGE,
        page,
      });

      const batch = await this.fetchJson(url, itemSchema.array());

      if (batch.length === 0) {
        break;
      }

      results.push(...batch);

      if (batch.length < WOO_PER_PAGE) {
        break;
      }

      page += 1;
    }

    return results;
  }

  fetchCategories(): Promise<WooCategory[]> {
    return this.fetchPagedCollection("products/categories", wooCategorySchema);
  }

  fetchProducts(): Promise<WooProduct[]> {
    return this.fetchPagedCollection("products", wooProductSchema);
  }

  fetchVariations(productId: number): Promise<WooVariation[]> {
    return this.fetchPagedCollection(`products/${productId}/variations`, wooVariationSchema);
  }
}
