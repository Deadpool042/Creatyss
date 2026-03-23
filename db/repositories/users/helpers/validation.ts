import { z } from "zod";
import { AdminUserAccountRepositoryError } from "@db-users/admin";
import { UserAccountRepositoryError } from "@db-users/accounts";
import type {
  CreateAdminUserAccountInput,
  UpdateAdminUserAccountInput,
} from "@db-users/admin/types/account.types";

const userAccountStatusSchema = z.enum([
  "invited",
  "active",
  "suspended",
  "disabled",
  "archived",
]);
const userIdSchema = z.string().trim().min(1);
const normalizedEmailSchema = z
  .string()
  .trim()
  .email()
  .transform((value) => value.toLowerCase());
const optionalNullableTrimmedStringSchema = z
  .string()
  .trim()
  .nullish()
  .transform((value) => {
    if (value === undefined) {
      return undefined;
    }

    return value || null;
  });
const createAdminUserAccountInputSchema = z.object({
  storeId: optionalNullableTrimmedStringSchema,
  email: normalizedEmailSchema,
  firstName: optionalNullableTrimmedStringSchema,
  lastName: optionalNullableTrimmedStringSchema,
  displayName: optionalNullableTrimmedStringSchema,
  status: userAccountStatusSchema.optional(),
});
const updateAdminUserAccountInputSchema = z.object({
  id: userIdSchema,
  storeId: optionalNullableTrimmedStringSchema,
  firstName: optionalNullableTrimmedStringSchema,
  lastName: optionalNullableTrimmedStringSchema,
  displayName: optionalNullableTrimmedStringSchema,
});
type ParsedCreateAdminUserAccountInput = {
  storeId?: string | null;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  displayName?: string | null;
  status: NonNullable<CreateAdminUserAccountInput["status"]>;
};
type ParsedUpdateAdminUserAccountInput = {
  id: string;
  storeId?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  displayName?: string | null;
};

export function assertValidUserAccountId(id: string): string {
  const result = userIdSchema.safeParse(id);

  if (!result.success) {
    throw new UserAccountRepositoryError("user_id_invalid", "Identifiant utilisateur invalide.");
  }

  return result.data;
}

export function normalizeUserEmail(email: string): string {
  const result = normalizedEmailSchema.safeParse(email);

  if (!result.success) {
    throw new AdminUserAccountRepositoryError("user_email_invalid", "Email utilisateur invalide.");
  }

  return result.data;
}

export function parseCreateAdminUserAccountInput(
  input: CreateAdminUserAccountInput
): ParsedCreateAdminUserAccountInput {
  const result = createAdminUserAccountInputSchema.safeParse(input);

  if (!result.success) {
    const issue = result.error.issues[0];

    switch (issue?.path[0]) {
      case "storeId":
        throw new AdminUserAccountRepositoryError(
          "user_store_invalid",
          "Boutique utilisateur invalide."
        );
      case "email":
        throw new AdminUserAccountRepositoryError(
          "user_email_invalid",
          "Email utilisateur invalide."
        );
      case "status":
        throw new AdminUserAccountRepositoryError(
          "user_status_invalid",
          "Statut utilisateur invalide."
        );
      default:
        throw new AdminUserAccountRepositoryError(
          "user_email_invalid",
          "Les données utilisateur sont invalides."
        );
    }
  }

  const parsedInput: ParsedCreateAdminUserAccountInput = {
    email: result.data.email,
    status: result.data.status ?? "invited",
  };

  if (result.data.storeId !== undefined) {
    parsedInput.storeId = result.data.storeId;
  }

  if (result.data.firstName !== undefined) {
    parsedInput.firstName = result.data.firstName;
  }

  if (result.data.lastName !== undefined) {
    parsedInput.lastName = result.data.lastName;
  }

  if (result.data.displayName !== undefined) {
    parsedInput.displayName = result.data.displayName;
  }

  return parsedInput;
}

export function parseUpdateAdminUserAccountInput(
  input: UpdateAdminUserAccountInput
): ParsedUpdateAdminUserAccountInput {
  const result = updateAdminUserAccountInputSchema.safeParse(input);

  if (!result.success) {
    const issue = result.error.issues[0];

    switch (issue?.path[0]) {
      case "id":
        throw new AdminUserAccountRepositoryError(
          "user_id_invalid",
          "Identifiant utilisateur invalide."
        );
      case "storeId":
        throw new AdminUserAccountRepositoryError(
          "user_store_invalid",
          "Boutique utilisateur invalide."
        );
      default:
        throw new AdminUserAccountRepositoryError(
          "user_id_invalid",
          "Les données utilisateur sont invalides."
        );
    }
  }

  const parsedInput: ParsedUpdateAdminUserAccountInput = {
    id: result.data.id,
  };

  if (result.data.storeId !== undefined) {
    parsedInput.storeId = result.data.storeId;
  }

  if (result.data.firstName !== undefined) {
    parsedInput.firstName = result.data.firstName;
  }

  if (result.data.lastName !== undefined) {
    parsedInput.lastName = result.data.lastName;
  }

  if (result.data.displayName !== undefined) {
    parsedInput.displayName = result.data.displayName;
  }

  return parsedInput;
}
