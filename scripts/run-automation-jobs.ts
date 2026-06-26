import "./helpers/load-env";

import { db } from "@/core/db";
import { runAutomationJobsBatch } from "@/features/automations/services/run-automation-jobs-batch.service";

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

/**
 * Exécution automatique bornée des jobs `PENDING` dus des automations.
 * Délègue à `runAutomationJobsBatch` qui gère la recovery, le retry et le dispatch.
 * Sûr à rejouer ou à chevaucher (verrou atomique PENDING → RUNNING dans `executeAutomationJob`).
 */
async function main(): Promise<void> {
  const batchSize = readBatchSize();

  const stats = await runAutomationJobsBatch(batchSize);

  process.stdout.write("\nExécution automatique des jobs d'automation\n");
  process.stdout.write(`- lot maximum : ${batchSize}\n`);
  process.stdout.write(`- jobs récupérés (timeout) : ${stats.recovered}\n`);
  process.stdout.write(`- jobs remis en file (retry) : ${stats.requeued}\n`);
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
