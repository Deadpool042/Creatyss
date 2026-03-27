//core/config/env/client.ts
import { z } from "zod";

import { nodeEnvSchema } from "./shared";

const clientEnvSchema = z.object({
  NODE_ENV: nodeEnvSchema,
  NEXT_PUBLIC_APP_URL: z.url().trim().default("http://localhost:3000"),
});

const parsedClientEnv = clientEnvSchema.safeParse({
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
});

if (!parsedClientEnv.success) {
  const issues = parsedClientEnv.error.issues
    .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
    .join("\n");

  throw new Error(`Invalid client environment variables:\n${issues}`);
}

export const clientEnv = {
  nodeEnv: parsedClientEnv.data.NODE_ENV,
  appUrl: parsedClientEnv.data.NEXT_PUBLIC_APP_URL,
} as const;
