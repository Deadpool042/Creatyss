import { z } from "zod";

export const ADMIN_PAGE_BODY_MAX_LENGTH = 50_000;

export const adminPageBodySchema = z.object({
  body: z
    .string()
    .trim()
    .max(ADMIN_PAGE_BODY_MAX_LENGTH, "Texte trop long (50 000 caractères max)."),
});

export type AdminPageBodyInput = z.infer<typeof adminPageBodySchema>;

export type AdminPageBodyFormState =
  | { status: "idle" }
  | { status: "success"; message: string }
  | { status: "error"; message: string; fieldError?: string };
