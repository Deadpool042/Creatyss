import { NextResponse } from "next/server";

import { checkDatabaseHealth } from "@/core/db/health";
import { ensureUploadsDirectory, getUploadsPublicPath } from "@/core/uploads";

export const dynamic = "force-dynamic";

export async function GET() {
  const database = await checkDatabaseHealth();

  await ensureUploadsDirectory();

  const body = {
    app: "ok",
    database: database.ok ? "ok" : "unavailable",
    uploads: "ready",
    uploadsPublicPath: getUploadsPublicPath(),
    timestamp: new Date().toISOString(),
  };

  if (!database.ok) {
    return NextResponse.json(
      {
        ...body,
        error: "database_connection_failed",
      },
      { status: 503 }
    );
  }

  return NextResponse.json(body);
}
