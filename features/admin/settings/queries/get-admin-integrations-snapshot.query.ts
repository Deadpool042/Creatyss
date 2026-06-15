import "server-only";

import { db } from "@/core/db";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";

const INTEGRATIONS_LIMIT = 16;
const CREDENTIALS_LIMIT = 24;
const SYNC_STATES_LIMIT = 24;

export type AdminIntegrationSummary = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  type:
    | "PAYMENT_PROVIDER"
    | "SHIPPING_PROVIDER"
    | "EMAIL_PROVIDER"
    | "SOCIAL_PROVIDER"
    | "ERP"
    | "CRM"
    | "MARKETPLACE"
    | "STORAGE"
    | "OTHER";
  provider: string;
  status: "DRAFT" | "ACTIVE" | "INACTIVE" | "FAILED" | "ARCHIVED";
  isEnabled: boolean;
  isSandbox: boolean;
  baseUrl: string | null;
  webhookBaseUrl: string | null;
  lastCheckedAt: Date | null;
  activatedAt: Date | null;
  failedAt: Date | null;
  updatedAt: Date;
  credentialsCount: number;
  syncStatesCount: number;
};

export type AdminIntegrationCredentialSummary = {
  id: string;
  integrationCode: string;
  key: string;
  secretPrefix: string | null;
  valueHint: string | null;
  status: "ACTIVE" | "REVOKED" | "EXPIRED";
  expiresAt: Date | null;
  lastUsedAt: Date | null;
  updatedAt: Date;
};

export type AdminIntegrationSyncStateSummary = {
  id: string;
  integrationCode: string;
  scopeType: string;
  scopeId: string | null;
  status: "IDLE" | "PENDING" | "RUNNING" | "SUCCEEDED" | "FAILED" | "CANCELLED";
  lastJobId: string | null;
  lastRunAt: Date | null;
  lastSuccessAt: Date | null;
  lastFailureAt: Date | null;
  externalReference: string | null;
  errorCode: string | null;
  updatedAt: Date;
};

export type AdminIntegrationsSnapshot = {
  overview: {
    totalIntegrations: number;
    enabledIntegrations: number;
    activeIntegrations: number;
    credentials: number;
    syncStates: number;
  };
  integrations: AdminIntegrationSummary[];
  credentials: AdminIntegrationCredentialSummary[];
  syncStates: AdminIntegrationSyncStateSummary[];
};

export async function getAdminIntegrationsSnapshot(): Promise<AdminIntegrationsSnapshot> {
  const storeId = await getCurrentStoreId();

  if (storeId === null) {
    return {
      overview: {
        totalIntegrations: 0,
        enabledIntegrations: 0,
        activeIntegrations: 0,
        credentials: 0,
        syncStates: 0,
      },
      integrations: [],
      credentials: [],
      syncStates: [],
    };
  }

  const integrationWhere = {
    OR: [{ storeId }, { storeId: null }],
    archivedAt: null,
  };

  const credentialWhere = {
    integration: {
      OR: [{ storeId }, { storeId: null }],
      archivedAt: null,
    },
  };

  const syncStateWhere = {
    integration: {
      OR: [{ storeId }, { storeId: null }],
      archivedAt: null,
    },
  };

  const [
    totalIntegrations,
    enabledIntegrations,
    activeIntegrations,
    credentialsCount,
    syncStatesCount,
    integrations,
    credentials,
    syncStates,
  ] = await Promise.all([
    db.integration.count({ where: integrationWhere }),
    db.integration.count({
      where: {
        ...integrationWhere,
        isEnabled: true,
      },
    }),
    db.integration.count({
      where: {
        ...integrationWhere,
        status: "ACTIVE",
      },
    }),
    db.integrationCredential.count({ where: credentialWhere }),
    db.integrationSyncState.count({ where: syncStateWhere }),
    db.integration.findMany({
      where: integrationWhere,
      orderBy: [{ updatedAt: "desc" }],
      take: INTEGRATIONS_LIMIT,
      select: {
        id: true,
        code: true,
        name: true,
        description: true,
        type: true,
        provider: true,
        status: true,
        isEnabled: true,
        isSandbox: true,
        baseUrl: true,
        webhookBaseUrl: true,
        lastCheckedAt: true,
        activatedAt: true,
        failedAt: true,
        updatedAt: true,
        _count: {
          select: {
            credentials: true,
            syncStates: true,
          },
        },
      },
    }),
    db.integrationCredential.findMany({
      where: credentialWhere,
      orderBy: [{ updatedAt: "desc" }],
      take: CREDENTIALS_LIMIT,
      select: {
        id: true,
        key: true,
        secretPrefix: true,
        valueHint: true,
        status: true,
        expiresAt: true,
        lastUsedAt: true,
        updatedAt: true,
        integration: {
          select: {
            code: true,
          },
        },
      },
    }),
    db.integrationSyncState.findMany({
      where: syncStateWhere,
      orderBy: [{ updatedAt: "desc" }],
      take: SYNC_STATES_LIMIT,
      select: {
        id: true,
        scopeType: true,
        scopeId: true,
        status: true,
        lastJobId: true,
        lastRunAt: true,
        lastSuccessAt: true,
        lastFailureAt: true,
        externalReference: true,
        errorCode: true,
        updatedAt: true,
        integration: {
          select: {
            code: true,
          },
        },
      },
    }),
  ]);

  return {
    overview: {
      totalIntegrations,
      enabledIntegrations,
      activeIntegrations,
      credentials: credentialsCount,
      syncStates: syncStatesCount,
    },
    integrations: integrations.map((integration) => ({
      id: integration.id,
      code: integration.code,
      name: integration.name,
      description: integration.description,
      type: integration.type,
      provider: integration.provider,
      status: integration.status,
      isEnabled: integration.isEnabled,
      isSandbox: integration.isSandbox,
      baseUrl: integration.baseUrl,
      webhookBaseUrl: integration.webhookBaseUrl,
      lastCheckedAt: integration.lastCheckedAt,
      activatedAt: integration.activatedAt,
      failedAt: integration.failedAt,
      updatedAt: integration.updatedAt,
      credentialsCount: integration._count.credentials,
      syncStatesCount: integration._count.syncStates,
    })),
    credentials: credentials.map((credential) => ({
      id: credential.id,
      integrationCode: credential.integration.code,
      key: credential.key,
      secretPrefix: credential.secretPrefix,
      valueHint: credential.valueHint,
      status: credential.status,
      expiresAt: credential.expiresAt,
      lastUsedAt: credential.lastUsedAt,
      updatedAt: credential.updatedAt,
    })),
    syncStates: syncStates.map((state) => ({
      id: state.id,
      integrationCode: state.integration.code,
      scopeType: state.scopeType,
      scopeId: state.scopeId,
      status: state.status,
      lastJobId: state.lastJobId,
      lastRunAt: state.lastRunAt,
      lastSuccessAt: state.lastSuccessAt,
      lastFailureAt: state.lastFailureAt,
      externalReference: state.externalReference,
      errorCode: state.errorCode,
      updatedAt: state.updatedAt,
    })),
  };
}
