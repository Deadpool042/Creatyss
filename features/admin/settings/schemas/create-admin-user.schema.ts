import { z } from "zod";

const ADMIN_PASSWORD_MIN_LENGTH = 12;

export const createAdminUserSchema = z
  .object({
    email: z
      .email()
      .trim()
      .transform((v) => v.toLowerCase()),
    displayName: z.string().trim().min(2).max(100),
    password: z.string().min(ADMIN_PASSWORD_MIN_LENGTH, {
      message: `Le mot de passe doit contenir au moins ${ADMIN_PASSWORD_MIN_LENGTH} caractères.`,
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["confirmPassword"],
  });

export type CreateAdminUserInput = z.infer<typeof createAdminUserSchema>;
