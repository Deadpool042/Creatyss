import { z } from "zod";

export const createApiClientSchema = z.object({
  name: z.string().trim().min(2).max(100),
  code: z
    .string()
    .trim()
    .toLowerCase()
    .min(2)
    .max(50)
    .regex(/^[a-z0-9-_]+$/, {
      message: "Le code ne peut contenir que des lettres minuscules, chiffres, tirets et underscores.",
    }),
  description: z.string().trim().max(500).optional(),
});

export type CreateApiClientInput = z.infer<typeof createApiClientSchema>;
