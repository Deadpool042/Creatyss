export type AdminPageStatus = "DRAFT" | "ACTIVE" | "INACTIVE" | "ARCHIVED";

export type AdminPagesListItem = {
  id: string;
  title: string;
  code: string;
  slug: string;
  status: AdminPageStatus;
  isSystemPage: boolean;
  bodyIsEmpty: boolean;
  updatedAt: string;
};

export type AdminPageDetail = {
  id: string;
  title: string;
  code: string;
  slug: string;
  status: AdminPageStatus;
  isSystemPage: boolean;
  excerpt: string | null;
  body: string | null;
  updatedAt: string;
};
