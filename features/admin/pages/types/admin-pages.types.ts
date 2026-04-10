export type AdminPageStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type AdminPagesListItem = {
  id: string;
  title: string;
  slug: string;
  status: AdminPageStatus;
  updatedAt: string;
};

export type AdminPageDetail = {
  id: string;
  title: string;
  slug: string;
  status: AdminPageStatus;
  excerpt: string | null;
  body: string | null;
  updatedAt: string;
};

export type AdminPageFormValues = {
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  status: AdminPageStatus;
};
