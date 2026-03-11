import { execFileSync } from "node:child_process";

function assertValidOrderReference(reference: string): void {
  if (!/^CRY-[A-Z0-9]{10}$/.test(reference)) {
    throw new Error(`Invalid order reference: ${reference}`);
  }
}

export function markOrderAsPaid(reference: string): void {
  assertValidOrderReference(reference);

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
    `
      update orders
      set status = 'paid'
      where reference = '${reference}';

      update payments
      set status = 'succeeded'
      where order_id = (
        select id from orders where reference = '${reference}'
      );
    `
  ]);
}
