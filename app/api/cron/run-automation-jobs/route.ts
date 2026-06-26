import { NextResponse } from "next/server";

import { serverEnv } from "@/core/config/env/server";
import { runAutomationJobsBatch } from "@/features/automations/services/run-automation-jobs-batch.service";

export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<NextResponse> {
  // Refuse toujours si CRON_SECRET n'est pas configuré
  if (!serverEnv.cronSecret) {
    return NextResponse.json({ error: "Cron non configuré." }, { status: 403 });
  }

  const authHeader = request.headers.get("authorization");
  const expectedHeader = `Bearer ${serverEnv.cronSecret}`;

  if (authHeader !== expectedHeader) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  try {
    const stats = await runAutomationJobsBatch(50);
    return NextResponse.json({ ok: true, stats });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur inattendue.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
