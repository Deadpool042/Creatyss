//core/config/env/server.ts
import { z } from "zod";

import { nodeEnvSchema, nonEmptyStringSchema } from "./shared";

const serverEnvSchema = z.object({
  NODE_ENV: nodeEnvSchema,

  APP_URL: z.url().trim().default("http://localhost:3000"),

  DATABASE_URL: nonEmptyStringSchema,

  ADMIN_SESSION_SECRET: nonEmptyStringSchema,
  CART_SESSION_SECRET: nonEmptyStringSchema,

  STRIPE_SECRET_KEY: nonEmptyStringSchema.refine(
    (value) => value !== "sk_test_change_me",
    "Invalid placeholder value for STRIPE_SECRET_KEY"
  ),

  STRIPE_WEBHOOK_SECRET: nonEmptyStringSchema.refine(
    (value) => value !== "whsec_change_me",
    "Invalid placeholder value for STRIPE_WEBHOOK_SECRET"
  ),

  BREVO_API_KEY: nonEmptyStringSchema.refine(
    (value) => value !== "brevo_api_key_change_me",
    "Invalid placeholder value for BREVO_API_KEY"
  ),

  EMAIL_FROM: nonEmptyStringSchema,

  UPLOADS_DIR: nonEmptyStringSchema.default("public/uploads"),
  MEDIA_IMAGE_PLACEHOLDER: nonEmptyStringSchema.default("creatyss.webp"),
});

const parsedServerEnv = serverEnvSchema.safeParse(process.env);

if (!parsedServerEnv.success) {
  const issues = parsedServerEnv.error.issues
    .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
    .join("\n");

  throw new Error(`Invalid server environment variables:\n${issues}`);
}

export const serverEnv = {
  nodeEnv: parsedServerEnv.data.NODE_ENV,
  appUrl: parsedServerEnv.data.APP_URL,
  databaseUrl: parsedServerEnv.data.DATABASE_URL,
  adminSessionSecret: parsedServerEnv.data.ADMIN_SESSION_SECRET,
  cartSessionSecret: parsedServerEnv.data.CART_SESSION_SECRET,
  stripeSecretKey: parsedServerEnv.data.STRIPE_SECRET_KEY,
  stripeWebhookSecret: parsedServerEnv.data.STRIPE_WEBHOOK_SECRET,
  brevoApiKey: parsedServerEnv.data.BREVO_API_KEY,
  emailFrom: parsedServerEnv.data.EMAIL_FROM,
  uploadsDir: parsedServerEnv.data.UPLOADS_DIR,
  mediaImagePlaceholder: parsedServerEnv.data.MEDIA_IMAGE_PLACEHOLDER,
} as const;
