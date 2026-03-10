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

export const env = {
  appUrl: readEnv("APP_URL", "http://localhost:3000"),
  adminSessionSecret: readRequiredEnv("ADMIN_SESSION_SECRET"),
  databaseUrl: readEnv(
    "DATABASE_URL",
    "postgresql://creatyss:creatyss@db:5432/creatyss"
  ),
  nodeEnv: process.env.NODE_ENV ?? "development",
  uploadsDir: readEnv("UPLOADS_DIR", "public/uploads")
} as const;
