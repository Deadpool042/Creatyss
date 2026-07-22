import { z } from "zod";

/**
 * Marché (`PublicEvent`) : indicateur `hasSpecialConditions` purement
 * informatif côté public (pas de blocage réel — cf.
 * `docs/lots/2026-07-22-engagement-public-events-cadrage.md`).
 */
export const createPublicEventSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(2, "Le titre doit contenir au moins 2 caractères.")
      .max(160, "Le titre est trop long (160 caractères maximum)."),
    slug: z
      .string()
      .trim()
      .min(2, "Le slug doit contenir au moins 2 caractères.")
      .max(160, "Le slug est trop long (160 caractères maximum).")
      .regex(
        /^[a-z0-9-]+$/,
        "Le slug ne peut contenir que des lettres minuscules, chiffres et tirets."
      ),
    shortDescription: z
      .string()
      .trim()
      .max(300, "La description courte est trop longue (300 caractères maximum).")
      .nullable(),
    description: z
      .string()
      .trim()
      .max(5000, "La description est trop longue (5000 caractères maximum).")
      .nullable(),
    startsAt: z.date(),
    endsAt: z.date().nullable(),
    locationName: z
      .string()
      .trim()
      .min(1, "Le lieu est requis.")
      .max(160, "Le lieu est trop long (160 caractères maximum)."),
    locationAddress: z
      .string()
      .trim()
      .max(300, "L'adresse est trop longue (300 caractères maximum).")
      .nullable(),
    hasSpecialConditions: z.boolean(),
    specialConditionsNote: z
      .string()
      .trim()
      .max(300, "La note de conditions spéciales est trop longue (300 caractères maximum).")
      .nullable(),
  })
  .refine((data) => data.endsAt === null || data.endsAt.getTime() > data.startsAt.getTime(), {
    message: "La date de fin doit être postérieure à la date de début.",
    path: ["endsAt"],
  })
  .refine((data) => !data.hasSpecialConditions || (data.specialConditionsNote?.length ?? 0) > 0, {
    message: "Indiquez une note lorsque des conditions spéciales sont signalées.",
    path: ["specialConditionsNote"],
  });

export type CreatePublicEventInput = z.infer<typeof createPublicEventSchema>;
