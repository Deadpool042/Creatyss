import { z } from "zod";

const cliOptionsSchema = z.object({
  skipImages: z.boolean(),
  resetCatalog: z.boolean(),
});

export type ImportWooCommerceCliOptions = z.infer<typeof cliOptionsSchema>;

export function parseCliOptions(argv: readonly string[]): ImportWooCommerceCliOptions {
  return cliOptionsSchema.parse({
    skipImages: argv.includes("--skip-images"),
    resetCatalog: argv.includes("--reset"),
  });
}
