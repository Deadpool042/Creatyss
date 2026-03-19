export type AdminUser = {
  id: string;
  email: string;
  displayName: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AdminUserWithPassword = AdminUser & {
  passwordHash: string;
};

export type CreateAdminUserInput = {
  email: string;
  displayName: string;
  passwordHash: string;
};
