import { notFound } from "next/navigation";

import { db } from "@/core/db";
import { getAdminNavigationContext } from "@/features/admin/navigation/server";

import { requireAuthenticatedAdmin } from "./guard";

/**
 * Asserts that the authenticated admin has a given capability.
 *
 * - Internal users (isInternalUser) bypass the capability check.
 * - If the admin does not hold the capability, calls notFound().
 * - Does not return a value — this is a guard assert.
 */
export async function requireAdminCapability(capability: string): Promise<void> {
  const admin = await requireAuthenticatedAdmin();

  const context = await getAdminNavigationContext({
    db,
    admin: { id: admin.id, email: admin.email },
  });

  if (context.isInternalUser) {
    return;
  }

  if (context.capabilities.has(capability)) {
    return;
  }

  notFound();
}
