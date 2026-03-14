import { execFileSync } from "node:child_process";

type LegacyVariantSeedInput = {
  productSlug: string;
  name: string;
  colorName: string;
  colorHex: string | null;
  sku: string;
  price: string;
  compareAtPrice: string | null;
  stockQuantity: number;
  isDefault: boolean;
  status: "draft" | "published";
};

function escapeSqlLiteral(value: string): string {
  return value.replace(/'/g, "''");
}

function assertValidProductSlug(slug: string): void {
  if (!/^[a-z0-9-]+$/.test(slug)) {
    throw new Error(`Invalid product slug: ${slug}`);
  }
}

function assertValidMoneyValue(value: string): void {
  if (!/^\d+(?:\.\d{1,2})?$/.test(value)) {
    throw new Error(`Invalid money value: ${value}`);
  }
}

function assertValidStockQuantity(value: number): void {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new Error(`Invalid stock quantity: ${value}`);
  }
}

function runProductDatabaseSql(sql: string): void {
  execFileSync("docker", [
    "compose",
    "--env-file",
    ".env.local",
    "exec",
    "-T",
    "db",
    "psql",
    "-U",
    "creatyss",
    "-d",
    "creatyss",
    "-c",
    sql
  ]);
}

function toSqlNullableText(value: string | null): string {
  if (value === null) {
    return "null";
  }

  return `'${escapeSqlLiteral(value)}'`;
}

export function createSimpleProductDraft(input: {
  slug: string;
  name: string;
}): void {
  assertValidProductSlug(input.slug);

  runProductDatabaseSql(`
      insert into products (name, slug, status, product_type, is_featured)
      values (
        '${escapeSqlLiteral(input.name)}',
        '${escapeSqlLiteral(input.slug)}',
        'draft',
        'simple',
        false
      )
      on conflict (slug) do nothing;
    `);
}

export function deleteProductBySlug(slug: string): void {
  assertValidProductSlug(slug);

  runProductDatabaseSql(`
      delete from products where slug = '${escapeSqlLiteral(slug)}';
    `);
}

export function createLegacyVariantForProduct(
  input: LegacyVariantSeedInput
): void {
  assertValidProductSlug(input.productSlug);
  assertValidMoneyValue(input.price);
  assertValidStockQuantity(input.stockQuantity);

  if (input.compareAtPrice !== null) {
    assertValidMoneyValue(input.compareAtPrice);
  }

  runProductDatabaseSql(`
      insert into product_variants (
        product_id,
        name,
        color_name,
        color_hex,
        sku,
        price,
        compare_at_price,
        stock_quantity,
        is_default,
        status
      )
      values (
        (
          select id
          from products
          where slug = '${escapeSqlLiteral(input.productSlug)}'
        ),
        '${escapeSqlLiteral(input.name)}',
        '${escapeSqlLiteral(input.colorName)}',
        ${toSqlNullableText(input.colorHex)},
        '${escapeSqlLiteral(input.sku)}',
        ${input.price}::numeric,
        ${input.compareAtPrice === null ? "null" : `${input.compareAtPrice}::numeric`},
        ${input.stockQuantity},
        ${input.isDefault ? "true" : "false"},
        '${input.status}'
      );
    `);
}
