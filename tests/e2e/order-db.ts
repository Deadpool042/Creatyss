import { execFileSync } from "node:child_process";

function assertValidOrderReference(reference: string): void {
  if (!/^CRY-[A-Z0-9]{10}$/.test(reference)) {
    throw new Error(`Invalid order reference: ${reference}`);
  }
}

function runDatabaseSql(sql: string): void {
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
    sql,
  ]);
}

export function markOrderAsPaid(reference: string): void {
  assertValidOrderReference(reference);

  runDatabaseSql(`
      update orders
      set status = 'paid'
      where reference = '${reference}';

      update payments
      set status = 'succeeded'
      where order_id = (
        select id from orders where reference = '${reference}'
      );
    `);
}

export function resetSimpleProductCatalogState(): void {
  runDatabaseSql(`
      update products
      set product_type = 'simple'
      where slug in ('pochette-sable', 'besace-nuit');

      update product_variants as pv
      set
        status = 'published',
        stock_quantity = case
          when p.slug = 'pochette-sable' then 12
          when p.slug = 'besace-nuit' then 0
          else pv.stock_quantity
        end
      from products as p
      where pv.product_id = p.id
        and p.slug in ('pochette-sable', 'besace-nuit');
    `);
}
