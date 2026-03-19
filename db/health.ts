import { prisma } from "@/db/prisma-client";
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
    await prisma.$connect();

    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      message: getErrorMessage(error),
    };
  }
}
