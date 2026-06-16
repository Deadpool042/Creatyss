import { z } from "zod";

export const ADMIN_CUSTOMER_NAME_MAX_LENGTH = 120;
export const ADMIN_CUSTOMER_PHONE_MAX_LENGTH = 40;
export const ADMIN_CUSTOMER_NOTES_MAX_LENGTH = 2_000;
export const ADMIN_EDITABLE_CUSTOMER_STATUSES = [
  "LEAD",
  "ACTIVE",
  "INACTIVE",
  "BLOCKED",
] as const;

export const updateAdminCustomerSchema = z.object({
  firstName: z
    .string()
    .trim()
    .max(
      ADMIN_CUSTOMER_NAME_MAX_LENGTH,
      `Prénom trop long (${ADMIN_CUSTOMER_NAME_MAX_LENGTH} caractères max).`
    )
    .optional()
    .or(z.literal("")),
  lastName: z
    .string()
    .trim()
    .max(
      ADMIN_CUSTOMER_NAME_MAX_LENGTH,
      `Nom trop long (${ADMIN_CUSTOMER_NAME_MAX_LENGTH} caractères max).`
    )
    .optional()
    .or(z.literal("")),
  displayName: z
    .string()
    .trim()
    .max(
      ADMIN_CUSTOMER_NAME_MAX_LENGTH,
      `Nom affiché trop long (${ADMIN_CUSTOMER_NAME_MAX_LENGTH} caractères max).`
    )
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .trim()
    .max(
      ADMIN_CUSTOMER_PHONE_MAX_LENGTH,
      `Téléphone trop long (${ADMIN_CUSTOMER_PHONE_MAX_LENGTH} caractères max).`
    )
    .optional()
    .or(z.literal("")),
  status: z.enum(ADMIN_EDITABLE_CUSTOMER_STATUSES, {
    message: "Statut client invalide.",
  }),
  acceptsEmail: z.boolean(),
  acceptsSms: z.boolean(),
  notes: z
    .string()
    .trim()
    .max(
      ADMIN_CUSTOMER_NOTES_MAX_LENGTH,
      `Notes trop longues (${ADMIN_CUSTOMER_NOTES_MAX_LENGTH} caractères max).`
    )
    .optional()
    .or(z.literal("")),
});

export type UpdateAdminCustomerInput = z.infer<typeof updateAdminCustomerSchema>;
export type AdminEditableCustomerStatus = (typeof ADMIN_EDITABLE_CUSTOMER_STATUSES)[number];

export type UpdateAdminCustomerFormState =
  | { status: "idle" }
  | { status: "success"; message: string }
  | {
      status: "error";
      message: string;
      fieldErrors?: Partial<Record<keyof UpdateAdminCustomerInput, string>>;
    };
