//lib/env.ts
function readEnv(name: string, fallback: string) {
  const value = process.env[name];

  if (!value || value.trim().length === 0) {
    return fallback;
  }

  return value;
}

function readRequiredEnv(name: string) {
  const value = process.env[name];

  if (!value || value.trim().length === 0) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function readRequiredSecretEnv(name: string, invalidPlaceholders: string[]) {
  const value = readRequiredEnv(name);

  if (invalidPlaceholders.includes(value.trim())) {
    throw new Error(
      `Invalid placeholder value for environment variable: ${name}`
    );
  }

  return value;
}

export function getStripeSecretKey(): string {
  return readRequiredSecretEnv("STRIPE_SECRET_KEY", ["sk_test_change_me"]);
}

export function getStripeWebhookSecret(): string {
  return readRequiredSecretEnv("STRIPE_WEBHOOK_SECRET", ["whsec_change_me"]);
}

export function getBrevoApiKey(): string {
  return readRequiredSecretEnv("BREVO_API_KEY", ["brevo_api_key_change_me"]);
}

export function getEmailFrom(): string {
  return readRequiredEnv("EMAIL_FROM");
}

export const env = {
  appUrl: readEnv("APP_URL", "http://localhost:3000"),
  adminSessionSecret: readRequiredEnv("ADMIN_SESSION_SECRET"),
  cartSessionSecret: readRequiredEnv("CART_SESSION_SECRET"),
  databaseUrl: readEnv(
    "DATABASE_URL",
    "postgresql://creatyss:creatyss@db:5432/creatyss"
  ),
  nodeEnv: process.env.NODE_ENV ?? "development",
  uploadsDir: readEnv("UPLOADS_DIR", "public/uploads")
} as const;
