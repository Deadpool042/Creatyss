export type RoleStatus = "active" | "disabled" | "archived";
export type RoleScopeType = "platform" | "store";

export type RoleDefinitionSummary = {
  id: string;
  storeId: string | null;
  code: string;
  name: string;
  description: string | null;
  scopeType: RoleScopeType;
  status: RoleStatus;
  isSystemRole: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type RoleDefinitionDetail = RoleDefinitionSummary;

export type CreateRoleDefinitionInput = {
  storeId?: string | null;
  code: string;
  name: string;
  description?: string | null;
  scopeType: RoleScopeType;
  status?: RoleStatus;
  isSystemRole?: boolean;
};

export type UpdateRoleDefinitionInput = {
  id: string;
  code?: string;
  name?: string;
  description?: string | null;
  scopeType?: RoleScopeType;
  status?: RoleStatus;
  isSystemRole?: boolean;
};

export class RoleRepositoryError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "RoleRepositoryError";
    this.code = code;
  }
}
