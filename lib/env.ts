function readEnv(name: string, fallback: string) {
  const value = process.env[name];

  if (!value || value.trim().length === 0) {
    return fallback;
  }

  return value;
}

export const env = {
  appUrl: readEnv("APP_URL", "http://localhost:3000"),
  databaseUrl: readEnv(
    "DATABASE_URL",
    "postgresql://creatyss:creatyss@db:5432/creatyss"
  ),
  nodeEnv: process.env.NODE_ENV ?? "development",
  uploadsDir: readEnv("UPLOADS_DIR", "public/uploads")
} as const;
