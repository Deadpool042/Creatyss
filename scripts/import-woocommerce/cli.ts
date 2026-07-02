import { z } from "zod";

const cliOptionsSchema = z.object({
  skipImages: z.boolean(),
  resetCatalog: z.boolean(),
  skipCustomersOrders: z.boolean(),
});

export type ImportWooCommerceCliOptions = z.infer<typeof cliOptionsSchema>;

export function parseCliOptions(argv: readonly string[]): ImportWooCommerceCliOptions {
  const hasNoReset = argv.includes("--no-reset");
  const hasReset = argv.includes("--reset");

  return cliOptionsSchema.parse({
    skipImages: argv.includes("--skip-images"),
    resetCatalog: hasReset || !hasNoReset,
    // Clients et commandes sont couplés : orders dépend de la résolution des
    // clients importés, il n'y a pas de skip indépendant pour l'un des deux.
    skipCustomersOrders: argv.includes("--skip-customers-orders"),
  });
}
