//core/config/env/shared.ts
import { z } from "zod";

export const nodeEnvSchema = z.enum(["development", "test", "production"]).default("development");

export const nonEmptyStringSchema = z.string().trim().min(1);
