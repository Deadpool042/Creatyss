import { z } from "zod";
import {
  AdminUserRepositoryError,
  type CreateAdminUserInput,
  type UpdateAdminUserInput,
} from "../admin-user.types";
import { UserRepositoryError, type UpdateUserProfileInput } from "../user.types";

const userRoleSchema = z.enum(["admin", "customer"]);
const userStatusSchema = z.enum(["active", "disabled"]);
const idSchema = z.string().trim().min(1);
const emailSchema = z.email().trim();

const createAdminUserInputSchema = z.object({
  email: emailSchema,
  passwordHash: z.string().trim().min(1),
  firstName: z.string().trim().nullable().optional(),
  lastName: z.string().trim().nullable().optional(),
  displayName: z.string().trim().nullable().optional(),
  status: userStatusSchema.optional(),
});

const updateAdminUserInputSchema = z.object({
  id: idSchema,
  firstName: z.string().trim().nullable().optional(),
  lastName: z.string().trim().nullable().optional(),
  displayName: z.string().trim().nullable().optional(),
  status: userStatusSchema.optional(),
});

const updateUserProfileInputSchema = z.object({
  id: idSchema,
  firstName: z.string().trim().nullable().optional(),
  lastName: z.string().trim().nullable().optional(),
  displayName: z.string().trim().nullable().optional(),
});

export function assertValidUserId(id: string): void {
  const result = idSchema.safeParse(id);

  if (!result.success) {
    throw new UserRepositoryError("user_not_found", "Utilisateur introuvable.");
  }
}

export function assertValidAdminUserId(id: string): void {
  const result = idSchema.safeParse(id);

  if (!result.success) {
    throw new AdminUserRepositoryError("admin_user_not_found", "Utilisateur admin introuvable.");
  }
}

export function normalizeUserEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function parseCreateAdminUserInput(input: CreateAdminUserInput): CreateAdminUserInput {
  const result = createAdminUserInputSchema.safeParse(input);

  if (!result.success) {
    const issue = result.error.issues[0];

    switch (issue?.path[0]) {
      case "email":
        throw new AdminUserRepositoryError("admin_user_email_invalid", "Email admin invalide.");
      case "passwordHash":
        throw new AdminUserRepositoryError(
          "admin_user_password_invalid",
          "Mot de passe admin invalide."
        );
      default:
        throw new AdminUserRepositoryError(
          "admin_user_profile_invalid",
          "Données admin invalides."
        );
    }
  }

  const data = result.data;
  const parsed: CreateAdminUserInput = {
    email: data.email,
    passwordHash: data.passwordHash,
  };

  if (data.firstName !== undefined) parsed.firstName = data.firstName;
  if (data.lastName !== undefined) parsed.lastName = data.lastName;
  if (data.displayName !== undefined) parsed.displayName = data.displayName;
  if (data.status !== undefined) parsed.status = data.status;

  return parsed;
}

export function parseUpdateAdminUserInput(input: UpdateAdminUserInput): UpdateAdminUserInput {
  const result = updateAdminUserInputSchema.safeParse(input);

  if (!result.success) {
    throw new AdminUserRepositoryError("admin_user_profile_invalid", "Données admin invalides.");
  }

  const data = result.data;
  const parsed: UpdateAdminUserInput = {
    id: data.id,
  };

  if (data.firstName !== undefined) parsed.firstName = data.firstName;
  if (data.lastName !== undefined) parsed.lastName = data.lastName;
  if (data.displayName !== undefined) parsed.displayName = data.displayName;
  if (data.status !== undefined) parsed.status = data.status;

  return parsed;
}

export function parseUpdateUserProfileInput(input: UpdateUserProfileInput): UpdateUserProfileInput {
  const result = updateUserProfileInputSchema.safeParse(input);

  if (!result.success) {
    throw new UserRepositoryError("user_profile_invalid", "Données utilisateur invalides.");
  }

  const data = result.data;
  const parsed: UpdateUserProfileInput = {
    id: data.id,
  };

  if (data.firstName !== undefined) parsed.firstName = data.firstName;
  if (data.lastName !== undefined) parsed.lastName = data.lastName;
  if (data.displayName !== undefined) parsed.displayName = data.displayName;

  return parsed;
}

export function listAvailableUserRoles() {
  return userRoleSchema.options;
}
