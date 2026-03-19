import { db } from "@/db/client";
import { getErrorMessage } from "@/lib/errors";

type DatabaseHealth =
  | {
      ok: true;
    }
  | {
      ok: false;
      message: string;
    };

export async function checkDatabaseHealth(): Promise<DatabaseHealth> {
  try {
    await db.query("select 1");

    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      message: getErrorMessage(error),
    };
  }
}
