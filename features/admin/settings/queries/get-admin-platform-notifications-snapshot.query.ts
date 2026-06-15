import "server-only";

import { db } from "@/core/db";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";

const RECENT_NOTIFICATIONS_LIMIT = 12;
const RECENT_PREFERENCES_LIMIT = 12;

export type AdminPlatformNotificationSummary = {
  id: string;
  storeId: string | null;
  recipientType: "USER" | "CUSTOMER";
  recipientUserId: string | null;
  recipientCustomerId: string | null;
  channel: "IN_APP" | "EMAIL" | "REALTIME";
  status: "PENDING" | "SENT" | "READ" | "FAILED" | "CANCELLED" | "ARCHIVED";
  title: string | null;
  body: string;
  subjectType: string | null;
  subjectId: string | null;
  readAt: Date | null;
  sentAt: Date | null;
  failedAt: Date | null;
  createdAt: Date;
};

export type AdminPlatformNotificationPreferenceSummary = {
  id: string;
  storeId: string | null;
  recipientType: "USER" | "CUSTOMER";
  recipientUserId: string | null;
  recipientCustomerId: string | null;
  recipientKey: string;
  channel: "IN_APP" | "EMAIL" | "REALTIME";
  topic: string;
  isEnabled: boolean;
  archivedAt: Date | null;
  updatedAt: Date;
};

export type AdminPlatformNotificationsSnapshot = {
  overview: {
    totalNotifications: number;
    pendingNotifications: number;
    failedNotifications: number;
    unreadNotifications: number;
    activePreferences: number;
  };
  notifications: AdminPlatformNotificationSummary[];
  preferences: AdminPlatformNotificationPreferenceSummary[];
};

export async function getAdminPlatformNotificationsSnapshot(): Promise<AdminPlatformNotificationsSnapshot> {
  const storeId = await getCurrentStoreId();

  if (storeId === null) {
    return {
      overview: {
        totalNotifications: 0,
        pendingNotifications: 0,
        failedNotifications: 0,
        unreadNotifications: 0,
        activePreferences: 0,
      },
      notifications: [],
      preferences: [],
    };
  }

  const notificationWhere = {
    archivedAt: null,
    OR: [{ storeId }, { storeId: null }],
  };

  const preferenceWhere = {
    OR: [{ storeId }, { storeId: null }],
  };

  const [
    totalNotifications,
    pendingNotifications,
    failedNotifications,
    unreadNotifications,
    activePreferences,
    notifications,
    preferences,
  ] = await Promise.all([
    db.notification.count({ where: notificationWhere }),
    db.notification.count({
      where: {
        ...notificationWhere,
        status: "PENDING",
      },
    }),
    db.notification.count({
      where: {
        ...notificationWhere,
        status: "FAILED",
      },
    }),
    db.notification.count({
      where: {
        ...notificationWhere,
        readAt: null,
      },
    }),
    db.notificationPreference.count({
      where: {
        ...preferenceWhere,
        archivedAt: null,
        isEnabled: true,
      },
    }),
    db.notification.findMany({
      where: notificationWhere,
      orderBy: [{ createdAt: "desc" }],
      take: RECENT_NOTIFICATIONS_LIMIT,
      select: {
        id: true,
        storeId: true,
        recipientType: true,
        recipientUserId: true,
        recipientCustomerId: true,
        channel: true,
        status: true,
        title: true,
        body: true,
        subjectType: true,
        subjectId: true,
        readAt: true,
        sentAt: true,
        failedAt: true,
        createdAt: true,
      },
    }),
    db.notificationPreference.findMany({
      where: preferenceWhere,
      orderBy: [{ updatedAt: "desc" }],
      take: RECENT_PREFERENCES_LIMIT,
      select: {
        id: true,
        storeId: true,
        recipientType: true,
        recipientUserId: true,
        recipientCustomerId: true,
        recipientKey: true,
        channel: true,
        topic: true,
        isEnabled: true,
        archivedAt: true,
        updatedAt: true,
      },
    }),
  ]);

  return {
    overview: {
      totalNotifications,
      pendingNotifications,
      failedNotifications,
      unreadNotifications,
      activePreferences,
    },
    notifications: notifications.map((notification) => ({
      id: notification.id,
      storeId: notification.storeId,
      recipientType: notification.recipientType,
      recipientUserId: notification.recipientUserId,
      recipientCustomerId: notification.recipientCustomerId,
      channel: notification.channel,
      status: notification.status,
      title: notification.title,
      body: notification.body,
      subjectType: notification.subjectType,
      subjectId: notification.subjectId,
      readAt: notification.readAt,
      sentAt: notification.sentAt,
      failedAt: notification.failedAt,
      createdAt: notification.createdAt,
    })),
    preferences: preferences.map((preference) => ({
      id: preference.id,
      storeId: preference.storeId,
      recipientType: preference.recipientType,
      recipientUserId: preference.recipientUserId,
      recipientCustomerId: preference.recipientCustomerId,
      recipientKey: preference.recipientKey,
      channel: preference.channel,
      topic: preference.topic,
      isEnabled: preference.isEnabled,
      archivedAt: preference.archivedAt,
      updatedAt: preference.updatedAt,
    })),
  };
}
