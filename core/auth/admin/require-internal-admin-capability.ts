import { notFound } from "next/navigation";

import { db } from "@/core/db";
import { getAdminNavigationContext } from "@/features/admin/navigation/server";

import { requireAuthenticatedAdmin } from "./guard";

/**
 * Asserts that the authenticated admin is an internal user AND holds a given capability.
 *
 * - If the admin is not an internal user (isInternalUser is false), calls notFound().
 * - If the admin does not hold the capability, calls notFound().
 * - Does not return a value — this is a guard assert.
 */
export async function requireInternalAdminCapability(capability: string): Promise<void> {
  const admin = await requireAuthenticatedAdmin();

  const context = await getAdminNavigationContext({
    db,
    admin: { id: admin.id, email: admin.email },
  });

  if (!context.isInternalUser) {
    notFound();
  }

  if (!context.capabilities.has(capability)) {
    notFound();
  }
}
