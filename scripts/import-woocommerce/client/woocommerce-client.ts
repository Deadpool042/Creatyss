import type { ZodType } from "zod";
import { WOO_PER_PAGE } from "../constants";
import type { ImportWooCommerceEnv } from "../env";
import {
  wooCategorySchema,
  wooProductSchema,
  wooVariationSchema,
  wordPressMediaSchema,
  wordPressPostSchema,
  type WooCategory,
  type WooProduct,
  type WooVariation,
  type WordPressMedia,
  type WordPressPost,
} from "../schemas";

export class WooCommerceClient {
  constructor(private readonly env: ImportWooCommerceEnv) {}

  private async fetchJson<T>(url: string, schema: ZodType<T>): Promise<T> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30_000);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
      });

      if (!response.ok) {
        const body = await response.text();
        throw new Error(`HTTP request failed (${response.status}) for ${url}: ${body}`);
      }

      const json = await response.json();
      return schema.parse(json);
    } catch (error: unknown) {
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error(`HTTP request timed out for ${url}`);
      }

      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }

  private buildUrl(pathname: string, params?: Record<string, string | number>): string {
    const url = new URL(`${this.env.wcBaseUrl}/wp-json/wc/v3/${pathname.replace(/^\//, "")}`);

    url.searchParams.set("consumer_key", this.env.wcConsumerKey);
    url.searchParams.set("consumer_secret", this.env.wcConsumerSecret);

    for (const [key, value] of Object.entries(params ?? {})) {
      url.searchParams.set(key, String(value));
    }

    return url.toString();
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

  private buildWordPressUrl(pathname: string, params?: Record<string, string | number>): string {
    const url = new URL(`${this.env.wcBaseUrl}/wp-json/wp/v2/${pathname.replace(/^\//, "")}`);

    for (const [key, value] of Object.entries(params ?? {})) {
      url.searchParams.set(key, String(value));
    }

    return url.toString();
  }

  private async fetchWordPressPagedCollection<T>(
    pathname: string,
    itemSchema: ZodType<T>
  ): Promise<T[]> {
    const results: T[] = [];
    let page = 1;

    while (true) {
      const url = this.buildWordPressUrl(pathname, {
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

  fetchWordPressPosts(): Promise<WordPressPost[]> {
    return this.fetchWordPressPagedCollection("posts", wordPressPostSchema);
  }

  async fetchWordPressMediaById(mediaId: number): Promise<WordPressMedia | null> {
    if (mediaId <= 0) {
      return null;
    }

    const url = this.buildWordPressUrl(`media/${mediaId}`);

    try {
      return await this.fetchJson(url, wordPressMediaSchema);
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes("HTTP request failed (404)")) {
        return null;
      }

      throw error;
    }
  }
}
