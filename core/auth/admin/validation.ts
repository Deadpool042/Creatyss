import { z } from "zod";

const ADMIN_PASSWORD_MIN_LENGTH = 12;

const adminEmailSchema = z
  .email()
  .trim()
  .min(1)
  .transform((value) => value.toLowerCase());

const adminPasswordSchema = z.string().min(1);

const adminBootstrapPasswordSchema = z.string().min(ADMIN_PASSWORD_MIN_LENGTH);

export const adminLoginSchema = z.object({
  email: adminEmailSchema,
  password: adminPasswordSchema,
});

export const adminBootstrapSchema = z.object({
  email: adminEmailSchema,
  displayName: z.string().trim().min(1),
  password: adminBootstrapPasswordSchema,
});

export type NormalizedAdminCredentials = z.infer<typeof adminLoginSchema>;
export type NormalizedAdminBootstrapInput = z.infer<typeof adminBootstrapSchema>;

export function normalizeAdminEmail(email: string): string {
  return adminEmailSchema.parse(email);
}

export function normalizeAdminLoginCredentials(input: {
  email: FormDataEntryValue | string | null | undefined;
  password: FormDataEntryValue | string | null | undefined;
}): NormalizedAdminCredentials | null {
  const parsed = adminLoginSchema.safeParse({
    email: input.email,
    password: input.password,
  });

  if (!parsed.success) {
    return null;
  }

  return parsed.data;
}

export function normalizeAdminBootstrapInput(input: {
  email: string;
  displayName: string;
  password: string;
}): NormalizedAdminBootstrapInput | null {
  const parsed = adminBootstrapSchema.safeParse(input);

  if (!parsed.success) {
    return null;
  }

  return parsed.data;
}
