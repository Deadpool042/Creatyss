import { z } from "zod";
import { RoleRepositoryError } from "@db-roles/definitions";
import type {
  CreateRoleDefinitionInput,
  UpdateRoleDefinitionInput,
} from "@db-roles/definitions/types/role.types";
import type { AssignUserRoleInput, UnassignUserRoleInput } from "@db-roles/assignments";

const roleStatusSchema = z.enum(["active", "disabled", "archived"]);
const roleScopeTypeSchema = z.enum(["platform", "store"]);
const nonEmptyStringSchema = z.string().trim().min(1);
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
const createRoleDefinitionInputSchema = z.object({
  storeId: optionalNullableTrimmedStringSchema,
  code: z.string(),
  name: nonEmptyStringSchema,
  description: optionalNullableTrimmedStringSchema,
  scopeType: roleScopeTypeSchema,
  status: roleStatusSchema.optional(),
  isSystemRole: z.boolean().optional(),
});
const updateRoleDefinitionInputSchema = z.object({
  id: nonEmptyStringSchema,
  code: z.string().optional(),
  name: nonEmptyStringSchema.optional(),
  description: optionalNullableTrimmedStringSchema,
  scopeType: roleScopeTypeSchema.optional(),
  status: roleStatusSchema.optional(),
  isSystemRole: z.boolean().optional(),
});
const assignUserRoleInputSchema = z.object({
  userId: nonEmptyStringSchema,
  roleId: nonEmptyStringSchema,
  assignedById: optionalNullableTrimmedStringSchema,
});
const unassignUserRoleInputSchema = z.object({
  userId: nonEmptyStringSchema,
  roleId: nonEmptyStringSchema,
});
type ParsedCreateRoleDefinitionInput = {
  storeId?: string | null;
  code: string;
  name: string;
  description: string | null;
  scopeType: CreateRoleDefinitionInput["scopeType"];
  status: NonNullable<CreateRoleDefinitionInput["status"]>;
  isSystemRole: boolean;
};
type ParsedUpdateRoleDefinitionInput = {
  id: string;
  code?: string;
  name?: string;
  description?: string | null;
  scopeType?: UpdateRoleDefinitionInput["scopeType"];
  status?: UpdateRoleDefinitionInput["status"];
  isSystemRole?: boolean;
};
type ParsedAssignUserRoleInput = {
  userId: string;
  roleId: string;
  assignedById?: string | null;
};

export function normalizeRoleCode(code: string): string {
  const result = nonEmptyStringSchema.safeParse(code);

  if (!result.success) {
    throw new RoleRepositoryError("role_code_invalid", "Code de rôle invalide.");
  }

  const normalizedCode = result.data.toLowerCase().replace(/[^a-z0-9_]+/g, "_");

  if (!normalizedCode) {
    throw new RoleRepositoryError("role_code_invalid", "Code de rôle invalide.");
  }

  return normalizedCode;
}

export function parseCreateRoleDefinitionInput(
  input: CreateRoleDefinitionInput
): ParsedCreateRoleDefinitionInput {
  const result = createRoleDefinitionInputSchema.safeParse(input);

  if (!result.success) {
    const issue = result.error.issues[0];

    switch (issue?.path[0]) {
      case "code":
        throw new RoleRepositoryError("role_code_invalid", "Code de rôle invalide.");
      case "name":
        throw new RoleRepositoryError("role_name_invalid", "Nom de rôle invalide.");
      case "scopeType":
        throw new RoleRepositoryError("role_scope_invalid", "Scope de rôle invalide.");
      case "status":
        throw new RoleRepositoryError("role_status_invalid", "Statut de rôle invalide.");
      default:
        throw new RoleRepositoryError("role_name_invalid", "Les données de rôle sont invalides.");
    }
  }

  const parsedInput: ParsedCreateRoleDefinitionInput = {
    code: normalizeRoleCode(result.data.code),
    name: result.data.name,
    description: result.data.description ?? null,
    scopeType: result.data.scopeType,
    status: result.data.status ?? "active",
    isSystemRole: result.data.isSystemRole ?? false,
  };

  if (result.data.storeId !== undefined) {
    parsedInput.storeId = result.data.storeId;
  }

  return parsedInput;
}

export function parseUpdateRoleDefinitionInput(
  input: UpdateRoleDefinitionInput
): ParsedUpdateRoleDefinitionInput {
  const result = updateRoleDefinitionInputSchema.safeParse(input);

  if (!result.success) {
    const issue = result.error.issues[0];

    switch (issue?.path[0]) {
      case "id":
        throw new RoleRepositoryError("role_id_invalid", "Identifiant de rôle invalide.");
      case "code":
        throw new RoleRepositoryError("role_code_invalid", "Code de rôle invalide.");
      case "name":
        throw new RoleRepositoryError("role_name_invalid", "Nom de rôle invalide.");
      case "scopeType":
        throw new RoleRepositoryError("role_scope_invalid", "Scope de rôle invalide.");
      case "status":
        throw new RoleRepositoryError("role_status_invalid", "Statut de rôle invalide.");
      default:
        throw new RoleRepositoryError("role_name_invalid", "Les données de rôle sont invalides.");
    }
  }

  const parsedInput: ParsedUpdateRoleDefinitionInput = {
    id: result.data.id,
  };

  if (result.data.code !== undefined) {
    parsedInput.code = normalizeRoleCode(result.data.code);
  }

  if (result.data.name !== undefined) {
    parsedInput.name = result.data.name;
  }

  if (result.data.description !== undefined) {
    parsedInput.description = result.data.description;
  }

  if (result.data.scopeType !== undefined) {
    parsedInput.scopeType = result.data.scopeType;
  }

  if (result.data.status !== undefined) {
    parsedInput.status = result.data.status;
  }

  if (result.data.isSystemRole !== undefined) {
    parsedInput.isSystemRole = result.data.isSystemRole;
  }

  return parsedInput;
}

export function parseAssignUserRoleInput(input: AssignUserRoleInput): ParsedAssignUserRoleInput {
  const result = assignUserRoleInputSchema.safeParse(input);

  if (!result.success) {
    const issue = result.error.issues[0];

    switch (issue?.path[0]) {
      case "userId":
        throw new RoleRepositoryError("user_id_invalid", "Utilisateur invalide.");
      case "roleId":
        throw new RoleRepositoryError("role_id_invalid", "Rôle invalide.");
      default:
        throw new RoleRepositoryError(
          "role_assignment_invalid",
          "Affectation de rôle invalide."
        );
    }
  }

  const parsedInput: ParsedAssignUserRoleInput = {
    userId: result.data.userId,
    roleId: result.data.roleId,
  };

  if (result.data.assignedById !== undefined) {
    parsedInput.assignedById = result.data.assignedById;
  }

  return parsedInput;
}

export function parseUnassignUserRoleInput(
  input: UnassignUserRoleInput
): UnassignUserRoleInput {
  const result = unassignUserRoleInputSchema.safeParse(input);

  if (!result.success) {
    const issue = result.error.issues[0];

    switch (issue?.path[0]) {
      case "userId":
        throw new RoleRepositoryError("user_id_invalid", "Utilisateur invalide.");
      case "roleId":
        throw new RoleRepositoryError("role_id_invalid", "Rôle invalide.");
      default:
        throw new RoleRepositoryError(
          "role_assignment_invalid",
          "Affectation de rôle invalide."
        );
    }
  }

  return result.data;
}
