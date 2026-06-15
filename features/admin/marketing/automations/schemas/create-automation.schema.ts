import { z } from "zod";

import {
  AUTOMATION_ACTION_TYPES,
  AUTOMATION_TRIGGER_TYPES,
} from "@/features/admin/marketing/automations/shared/admin-automation-options";

/**
 * CRUD admin des définitions `Automation` uniquement
 * (cf. `docs/lots/2026-06-14-engagement-automations-crud-cadrage.md`).
 */
export const createAutomationSchema = z.object({
  code: z
    .string()
    .trim()
    .min(2, "Le code doit contenir au moins 2 caractères.")
    .max(64, "Le code est trop long (64 caractères maximum).")
    .regex(
      /^[A-Z0-9_-]+$/i,
      "Le code ne peut contenir que des lettres, chiffres, tirets et underscores."
    ),
  name: z
    .string()
    .trim()
    .min(2, "Le nom doit contenir au moins 2 caractères.")
    .max(120, "Le nom est trop long (120 caractères maximum)."),
  description: z
    .string()
    .trim()
    .max(500, "La description est trop longue (500 caractères maximum).")
    .nullable(),
  triggerType: z.enum(AUTOMATION_TRIGGER_TYPES),
  actionType: z.enum(AUTOMATION_ACTION_TYPES),
  delayMinutes: z
    .number()
    .int("Le délai doit être un entier.")
    .min(0, "Le délai ne peut pas être négatif."),
  templateCode: z
    .string()
    .trim()
    .max(100, "Le code template est trop long (100 caractères maximum).")
    .nullable(),
});

export type CreateAutomationInput = z.infer<typeof createAutomationSchema>;
