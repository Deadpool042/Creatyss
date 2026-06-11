import { db } from "@/core/db";

export type AdminNotificationSettings = {
  emailConfirmationEnabled: boolean;
  emailShippingEnabled: boolean;
  replyToEmail: string | null;
};

const defaultAdminNotificationSettings: AdminNotificationSettings = {
  emailConfirmationEnabled: true,
  emailShippingEnabled: true,
  replyToEmail: null,
};

export async function getAdminNotificationSettings(): Promise<AdminNotificationSettings> {
  const store = await db.store.findFirst({
    orderBy: { createdAt: "asc" },
    select: {
      emailConfirmationEnabled: true,
      emailShippingEnabled: true,
      replyToEmail: true,
    },
  });

  if (!store) return defaultAdminNotificationSettings;

  return {
    emailConfirmationEnabled: store.emailConfirmationEnabled,
    emailShippingEnabled: store.emailShippingEnabled,
    replyToEmail: store.replyToEmail ?? null,
  };
}
