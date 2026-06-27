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

if (!parsedServerEnv.success && !process.env.SKIP_ENV_VALIDATION) {
  const issues = parsedServerEnv.error.issues
    .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
    .join("\n");

  throw new Error(`Invalid server environment variables:\n${issues}`);
}

const data = parsedServerEnv.data ?? null;

if (data) {
  const resolvedEmailProviderCheck =
    data.EMAIL_PROVIDER ?? (data.NODE_ENV === "production" ? "brevo" : "mailpit");
  const emailValidationIssues: string[] = [];

  if (resolvedEmailProviderCheck === "brevo") {
    if (
      data.BREVO_API_KEY === "placeholder-change-me" ||
      data.BREVO_API_KEY === "brevo_api_key_change_me"
    ) {
      emailValidationIssues.push(
        "BREVO_API_KEY: placeholder value is invalid when EMAIL_PROVIDER=brevo"
      );
    }
    if (data.BREVO_FROM_ADDRESS === "no-reply@example.com") {
      emailValidationIssues.push(
        "BREVO_FROM_ADDRESS: placeholder value is invalid when EMAIL_PROVIDER=brevo"
      );
    }
  }

  if (emailValidationIssues.length > 0) {
    throw new Error(`Invalid server environment variables:\n${emailValidationIssues.join("\n")}`);
  }
}

const resolvedEmailProvider: "brevo" | "mailpit" =
  data?.EMAIL_PROVIDER ?? (data?.NODE_ENV === "production" ? "brevo" : "mailpit");

const validatedEnv = data
  ? ({
      nodeEnv: data.NODE_ENV,
      appUrl: data.APP_URL,
      databaseUrl: data.DATABASE_URL,
      adminSessionSecret: data.ADMIN_SESSION_SECRET,
      cartSessionSecret: data.CART_SESSION_SECRET,
      favoritesSessionSecret: data.FAVORITES_SESSION_SECRET,
      stripeSecretKey: data.STRIPE_SECRET_KEY ?? null,
      stripeWebhookSecret: data.STRIPE_WEBHOOK_SECRET ?? null,
      emailProvider: resolvedEmailProvider,
      emailFromAddress: data.EMAIL_FROM_ADDRESS,
      emailFromName: data.EMAIL_FROM_NAME,
      mailpitSmtpHost: data.MAILPIT_SMTP_HOST,
      mailpitSmtpPort: data.MAILPIT_SMTP_PORT,
      brevoApiKey: data.BREVO_API_KEY,
      brevoFromAddress: data.BREVO_FROM_ADDRESS,
      brevoFromName: data.BREVO_FROM_NAME,
      uploadsDir: data.UPLOADS_DIR,
      mediaImagePlaceholder: data.MEDIA_IMAGE_PLACEHOLDER,
      cronSecret: data.CRON_SECRET ?? null,
    } as const)
  : null;

type ServerEnv = NonNullable<typeof validatedEnv>;

// En mode build (SKIP_ENV_VALIDATION=1), le parse peut échouer — les vraies vars
// sont injectées au runtime. Le proxy retourne des stubs vides pour permettre
// l'évaluation des modules par Next.js sans exposer de vraies valeurs.
export const serverEnv: ServerEnv =
  validatedEnv ??
  new Proxy({} as ServerEnv, {
    get(_, key) {
      if (process.env.SKIP_ENV_VALIDATION) {
        const nullableKeys: (keyof ServerEnv)[] = [
          "stripeSecretKey",
          "stripeWebhookSecret",
          "cronSecret",
        ];
        if (nullableKeys.includes(key as keyof ServerEnv)) return null;
        return "" as never;
      }
      throw new Error(
        `[serverEnv] Accès à "${String(key)}" sans variables d'environnement valides.`
      );
    },
  });
