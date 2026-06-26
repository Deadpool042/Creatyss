//core/config/env/server.ts
import "server-only";

import { z } from "zod";

import { nodeEnvSchema, nonEmptyStringSchema } from "./shared";

const serverEnvSchema = z.object({
  NODE_ENV: nodeEnvSchema,

  APP_URL: z.url().trim().default("http://localhost:3000"),

  DATABASE_URL: nonEmptyStringSchema,

  ADMIN_SESSION_SECRET: nonEmptyStringSchema,
  CART_SESSION_SECRET: nonEmptyStringSchema,
  FAVORITES_SESSION_SECRET: nonEmptyStringSchema,

  STRIPE_SECRET_KEY: nonEmptyStringSchema
    .refine(
      (value) => value !== "sk_test_change_me",
      "Invalid placeholder value for STRIPE_SECRET_KEY"
    )
    .optional(),

  STRIPE_WEBHOOK_SECRET: nonEmptyStringSchema
    .refine(
      (value) => value !== "whsec_change_me",
      "Invalid placeholder value for STRIPE_WEBHOOK_SECRET"
    )
    .optional(),

  EMAIL_PROVIDER: z.enum(["mailpit", "brevo"]).optional(),
  EMAIL_FROM_ADDRESS: nonEmptyStringSchema,
  EMAIL_FROM_NAME: nonEmptyStringSchema,
  MAILPIT_SMTP_HOST: nonEmptyStringSchema.default("localhost"),
  MAILPIT_SMTP_PORT: z.coerce.number().int().positive().default(1025),
  BREVO_API_KEY: nonEmptyStringSchema,
  BREVO_FROM_ADDRESS: nonEmptyStringSchema,
  BREVO_FROM_NAME: nonEmptyStringSchema,

  UPLOADS_DIR: nonEmptyStringSchema.default("public/uploads"),
  MEDIA_IMAGE_PLACEHOLDER: nonEmptyStringSchema.default("creatyss.webp"),

  CRON_SECRET: nonEmptyStringSchema.optional(),
});

const parsedServerEnv = serverEnvSchema.safeParse(process.env);

if (!parsedServerEnv.success) {
  const issues = parsedServerEnv.error.issues
    .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
    .join("\n");

  throw new Error(`Invalid server environment variables:\n${issues}`);
}

const resolvedEmailProvider =
  parsedServerEnv.data.EMAIL_PROVIDER ??
  (parsedServerEnv.data.NODE_ENV === "production" ? "brevo" : "mailpit");

const emailValidationIssues: string[] = [];

if (resolvedEmailProvider === "brevo") {
  if (
    parsedServerEnv.data.BREVO_API_KEY === "placeholder-change-me" ||
    parsedServerEnv.data.BREVO_API_KEY === "brevo_api_key_change_me"
  ) {
    emailValidationIssues.push(
      "BREVO_API_KEY: placeholder value is invalid when EMAIL_PROVIDER=brevo"
    );
  }

  if (parsedServerEnv.data.BREVO_FROM_ADDRESS === "no-reply@example.com") {
    emailValidationIssues.push(
      "BREVO_FROM_ADDRESS: placeholder value is invalid when EMAIL_PROVIDER=brevo"
    );
  }
}

if (emailValidationIssues.length > 0) {
  throw new Error(`Invalid server environment variables:\n${emailValidationIssues.join("\n")}`);
}

export const serverEnv = {
  nodeEnv: parsedServerEnv.data.NODE_ENV,
  appUrl: parsedServerEnv.data.APP_URL,
  databaseUrl: parsedServerEnv.data.DATABASE_URL,
  adminSessionSecret: parsedServerEnv.data.ADMIN_SESSION_SECRET,
  cartSessionSecret: parsedServerEnv.data.CART_SESSION_SECRET,
  favoritesSessionSecret: parsedServerEnv.data.FAVORITES_SESSION_SECRET,
  stripeSecretKey: parsedServerEnv.data.STRIPE_SECRET_KEY ?? null,
  stripeWebhookSecret: parsedServerEnv.data.STRIPE_WEBHOOK_SECRET ?? null,
  emailProvider: resolvedEmailProvider,
  emailFromAddress: parsedServerEnv.data.EMAIL_FROM_ADDRESS,
  emailFromName: parsedServerEnv.data.EMAIL_FROM_NAME,
  mailpitSmtpHost: parsedServerEnv.data.MAILPIT_SMTP_HOST,
  mailpitSmtpPort: parsedServerEnv.data.MAILPIT_SMTP_PORT,
  brevoApiKey: parsedServerEnv.data.BREVO_API_KEY,
  brevoFromAddress: parsedServerEnv.data.BREVO_FROM_ADDRESS,
  brevoFromName: parsedServerEnv.data.BREVO_FROM_NAME,
  uploadsDir: parsedServerEnv.data.UPLOADS_DIR,
  mediaImagePlaceholder: parsedServerEnv.data.MEDIA_IMAGE_PLACEHOLDER,
  cronSecret: parsedServerEnv.data.CRON_SECRET ?? null,
} as const;
