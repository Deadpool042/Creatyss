export type AdminSessionPayload = {
  userId: string;
  exp: number;
};

export type AuthenticatedAdmin = {
  id: string;
  email: string;
  displayName: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CurrentAdminResult =
  | {
      status: "authenticated";
      admin: AuthenticatedAdmin;
    }
  | {
      status: "missing" | "invalid" | "expired" | "inactive";
    };
