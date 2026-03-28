import path from "node:path";
import { z } from "zod";
import { DEFAULT_UPLOADS_DIR } from "./constants";

const importWooCommerceEnvSchema = z.object({
  WC_BASE_URL: z
    .string()
    .trim()
    .min(1)
    .transform((value) => value.replace(/\/$/, "")),
  WC_CONSUMER_KEY: z.string().trim().min(1),
  WC_CONSUMER_SECRET: z.string().trim().min(1),
  UPLOADS_DIR: z
    .string()
    .trim()
    .min(1)
    .optional()
    .default(DEFAULT_UPLOADS_DIR)
    .transform((value) => value.replace(/\/$/, "")),
});

export type ImportWooCommerceEnv = {
  wcBaseUrl: string;
  wcConsumerKey: string;
  wcConsumerSecret: string;
  uploadsDir: string;
  uploadsAbsoluteDir: string;
};

export function readImportWooCommerceEnv(): ImportWooCommerceEnv {
  const parsed = importWooCommerceEnvSchema.parse(process.env);

  return {
    wcBaseUrl: parsed.WC_BASE_URL,
    wcConsumerKey: parsed.WC_CONSUMER_KEY,
    wcConsumerSecret: parsed.WC_CONSUMER_SECRET,
    uploadsDir: parsed.UPLOADS_DIR,
    uploadsAbsoluteDir: path.join(process.cwd(), parsed.UPLOADS_DIR),
  };
}
