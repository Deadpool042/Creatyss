import { Pool, type QueryResultRow } from "pg";
import { env } from "../lib/env";

declare global {
  var __creatyssPool__: Pool | undefined;
}

function createPool() {
  return new Pool({
    connectionString: env.databaseUrl,
  });
}

export const db = globalThis.__creatyssPool__ ?? createPool();

export async function queryRows<Row extends QueryResultRow>(
  sql: string,
  values?: readonly unknown[]
): Promise<Row[]> {
  const result = await db.query<Row>(sql, values ? [...values] : []);

  return result.rows;
}

export async function queryFirst<Row extends QueryResultRow>(
  sql: string,
  values?: readonly unknown[]
): Promise<Row | null> {
  const rows = await queryRows<Row>(sql, values);

  return rows[0] ?? null;
}

if (env.nodeEnv !== "production") {
  globalThis.__creatyssPool__ = db;
}
