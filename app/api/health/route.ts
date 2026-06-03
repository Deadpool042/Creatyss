import { NextResponse } from "next/server";

import { checkDatabaseHealth } from "@/core/db/health";

export const dynamic = "force-dynamic";

function getUploadsPublicPath(): string {
  const uploadsDir = process.env.UPLOADS_DIR ?? "public/uploads";

  return `/${uploadsDir.replace(/^public\//, "").replaceAll("\\", "/")}`;
}

export async function GET() {
  const database = await checkDatabaseHealth();

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
