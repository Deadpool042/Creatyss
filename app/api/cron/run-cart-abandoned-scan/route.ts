import { NextResponse } from "next/server";

import { serverEnv } from "@/core/config/env/server";
import { queueCartAbandonedAutomationJobs } from "@/features/automations/services/queue-cart-abandoned-automation-jobs.service";

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
    const stats = await queueCartAbandonedAutomationJobs();
    return NextResponse.json({ ok: true, stats });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur inattendue.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
