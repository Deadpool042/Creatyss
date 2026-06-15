import "server-only";

import { db } from "@/core/db";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";

const ENDPOINTS_LIMIT = 16;
const DELIVERIES_LIMIT = 24;

export type AdminWebhookEndpointSummary = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  status: "DRAFT" | "ACTIVE" | "INACTIVE" | "FAILED" | "ARCHIVED";
  targetUrl: string;
  secretPrefix: string | null;
  isEnabled: boolean;
  eventType: string;
  version: string | null;
  timeoutMs: number | null;
  maxAttempts: number;
  integrationCode: string | null;
  lastTriggeredAt: Date | null;
  lastSucceededAt: Date | null;
  lastFailedAt: Date | null;
  updatedAt: Date;
  deliveriesCount: number;
};

export type AdminWebhookDeliverySummary = {
  id: string;
  endpointCode: string;
  status: "PENDING" | "RUNNING" | "SUCCEEDED" | "FAILED" | "CANCELLED" | "EXPIRED";
  eventType: string;
  eventId: string | null;
  idempotencyKey: string | null;
  requestUrl: string;
  requestMethod: string;
  responseStatusCode: number | null;
  attemptCount: number;
  scheduledAt: Date | null;
  startedAt: Date | null;
  finishedAt: Date | null;
  errorCode: string | null;
  updatedAt: Date;
};

export type AdminWebhooksSnapshot = {
  overview: {
    totalEndpoints: number;
    enabledEndpoints: number;
    activeEndpoints: number;
    deliveries: number;
    failedDeliveries: number;
  };
  endpoints: AdminWebhookEndpointSummary[];
  deliveries: AdminWebhookDeliverySummary[];
};

export async function getAdminWebhooksSnapshot(): Promise<AdminWebhooksSnapshot> {
  const storeId = await getCurrentStoreId();

  if (storeId === null) {
    return {
      overview: {
        totalEndpoints: 0,
        enabledEndpoints: 0,
        activeEndpoints: 0,
        deliveries: 0,
        failedDeliveries: 0,
      },
      endpoints: [],
      deliveries: [],
    };
  }

  const endpointWhere = {
    OR: [{ storeId }, { storeId: null }],
    archivedAt: null,
  };

  const deliveryWhere = {
    webhookEndpoint: {
      OR: [{ storeId }, { storeId: null }],
      archivedAt: null,
    },
  };

  const [
    totalEndpoints,
    enabledEndpoints,
    activeEndpoints,
    deliveriesCount,
    failedDeliveriesCount,
    endpoints,
    deliveries,
  ] = await Promise.all([
    db.webhookEndpoint.count({ where: endpointWhere }),
    db.webhookEndpoint.count({
      where: {
        ...endpointWhere,
        isEnabled: true,
      },
    }),
    db.webhookEndpoint.count({
      where: {
        ...endpointWhere,
        status: "ACTIVE",
      },
    }),
    db.webhookDelivery.count({ where: deliveryWhere }),
    db.webhookDelivery.count({
      where: {
        ...deliveryWhere,
        status: "FAILED",
      },
    }),
    db.webhookEndpoint.findMany({
      where: endpointWhere,
      orderBy: [{ updatedAt: "desc" }],
      take: ENDPOINTS_LIMIT,
      select: {
        id: true,
        code: true,
        name: true,
        description: true,
        status: true,
        targetUrl: true,
        secretPrefix: true,
        isEnabled: true,
        eventType: true,
        version: true,
        timeoutMs: true,
        maxAttempts: true,
        lastTriggeredAt: true,
        lastSucceededAt: true,
        lastFailedAt: true,
        updatedAt: true,
        integration: {
          select: {
            code: true,
          },
        },
        _count: {
          select: {
            deliveries: true,
          },
        },
      },
    }),
    db.webhookDelivery.findMany({
      where: deliveryWhere,
      orderBy: [{ updatedAt: "desc" }],
      take: DELIVERIES_LIMIT,
      select: {
        id: true,
        status: true,
        eventType: true,
        eventId: true,
        idempotencyKey: true,
        requestUrl: true,
        requestMethod: true,
        responseStatusCode: true,
        attemptCount: true,
        scheduledAt: true,
        startedAt: true,
        finishedAt: true,
        errorCode: true,
        updatedAt: true,
        webhookEndpoint: {
          select: {
            code: true,
          },
        },
      },
    }),
  ]);

  return {
    overview: {
      totalEndpoints,
      enabledEndpoints,
      activeEndpoints,
      deliveries: deliveriesCount,
      failedDeliveries: failedDeliveriesCount,
    },
    endpoints: endpoints.map((endpoint) => ({
      id: endpoint.id,
      code: endpoint.code,
      name: endpoint.name,
      description: endpoint.description,
      status: endpoint.status,
      targetUrl: endpoint.targetUrl,
      secretPrefix: endpoint.secretPrefix,
      isEnabled: endpoint.isEnabled,
      eventType: endpoint.eventType,
      version: endpoint.version,
      timeoutMs: endpoint.timeoutMs,
      maxAttempts: endpoint.maxAttempts,
      integrationCode: endpoint.integration?.code ?? null,
      lastTriggeredAt: endpoint.lastTriggeredAt,
      lastSucceededAt: endpoint.lastSucceededAt,
      lastFailedAt: endpoint.lastFailedAt,
      updatedAt: endpoint.updatedAt,
      deliveriesCount: endpoint._count.deliveries,
    })),
    deliveries: deliveries.map((delivery) => ({
      id: delivery.id,
      endpointCode: delivery.webhookEndpoint.code,
      status: delivery.status,
      eventType: delivery.eventType,
      eventId: delivery.eventId,
      idempotencyKey: delivery.idempotencyKey,
      requestUrl: delivery.requestUrl,
      requestMethod: delivery.requestMethod,
      responseStatusCode: delivery.responseStatusCode,
      attemptCount: delivery.attemptCount,
      scheduledAt: delivery.scheduledAt,
      startedAt: delivery.startedAt,
      finishedAt: delivery.finishedAt,
      errorCode: delivery.errorCode,
      updatedAt: delivery.updatedAt,
    })),
  };
}
