//core/db/health.ts
import { getErrorMessage } from "@core/shared/errors";
import { db } from "./client";

type DatabaseHealth = { ok: true } | { ok: false; message: string };

export async function checkDatabaseHealth(): Promise<DatabaseHealth> {
  try {
    await db.$queryRaw`SELECT 1`;

    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      message: getErrorMessage(error),
    };
  }
}
