import "./helpers/load-env";

import { db } from "@/core/db";
import {
  executeAutomationJob,
  ExecuteAutomationJobError,
} from "@/features/automations/services/execute-automation-job.service";
import { AUTOMATION_NEWSLETTER_SUBSCRIBED_JOB_TYPE } from "@/features/automations/shared/automation-job.constants";

const DEFAULT_BATCH_SIZE = 50;

function readBatchSize(): number {
  const argument = process.argv.find((value) => value.startsWith("--batch-size="));

  if (!argument) {
    return DEFAULT_BATCH_SIZE;
  }

  const rawValue = argument.slice("--batch-size=".length);
  const parsedValue = Number.parseInt(rawValue, 10);

  if (!Number.isSafeInteger(parsedValue) || parsedValue <= 0) {
    throw new Error(`Invalid --batch-size value: "${rawValue}"`);
  }

  return parsedValue;
}

type RunStats = {
  selected: number;
  succeeded: number;
  failed: number;
};

function formatExecutionError(error: unknown): string {
  if (error instanceof ExecuteAutomationJobError) {
    return `${error.code}: ${error.message}`;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Erreur inattendue.";
}

/**
 * Exécution automatique bornée des jobs `PENDING` dus du flux
 * `NEWSLETTER_SUBSCRIBED`. Réutilise strictement `executeAutomationJob`
 * (claim atomique PENDING -> RUNNING), ce qui rend ce script sûr à rejouer ou
 * à chevaucher (ex. cron système).
 */
async function main(): Promise<void> {
  const batchSize = readBatchSize();
  const now = new Date();

  const dueJobs = await db.job.findMany({
    where: {
      typeCode: AUTOMATION_NEWSLETTER_SUBSCRIBED_JOB_TYPE,
      status: "PENDING",
      archivedAt: null,
      scheduledAt: { lte: now },
    },
    select: { id: true, storeId: true },
    orderBy: { scheduledAt: "asc" },
    take: batchSize,
  });

  const stats: RunStats = {
    selected: dueJobs.length,
    succeeded: 0,
    failed: 0,
  };

  for (const job of dueJobs) {
    if (!job.storeId) {
      stats.failed += 1;
      process.stderr.write(`Job ${job.id} ignoré : storeId manquant.\n`);
      continue;
    }

    try {
      await executeAutomationJob({ jobId: job.id, storeId: job.storeId });
      stats.succeeded += 1;
    } catch (error) {
      stats.failed += 1;
      process.stderr.write(`Job ${job.id} en échec : ${formatExecutionError(error)}\n`);
    }
  }

  process.stdout.write("\nExécution automatique des jobs d'automation\n");
  process.stdout.write(`- lot maximum : ${batchSize}\n`);
  process.stdout.write(`- jobs sélectionnés : ${stats.selected}\n`);
  process.stdout.write(`- jobs réussis : ${stats.succeeded}\n`);
  process.stdout.write(`- jobs en échec : ${stats.failed}\n`);
}

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error(error);
    await db.$disconnect();
    process.exit(1);
  });
