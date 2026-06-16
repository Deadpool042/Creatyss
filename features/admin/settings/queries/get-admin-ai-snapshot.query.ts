import "server-only";

import { db } from "@/core/db";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";

const PROVIDERS_LIMIT = 16;
const TASKS_LIMIT = 24;

export type AdminAiProviderSummary = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  provider: string;
  modelCode: string | null;
  status: "DRAFT" | "ACTIVE" | "INACTIVE" | "ARCHIVED";
  isEnabled: boolean;
  tasksCount: number;
  lastTaskAt: Date | null;
  activatedAt: Date | null;
  updatedAt: Date;
};

export type AdminAiTaskSummary = {
  id: string;
  providerCode: string | null;
  type:
    | "TEXT_GENERATION"
    | "TEXT_SUMMARIZATION"
    | "SEO_SUGGESTION"
    | "PRODUCT_ENRICHMENT"
    | "CONTENT_ASSIST"
    | "CLASSIFICATION"
    | "OTHER";
  status:
    | "PENDING"
    | "RUNNING"
    | "SUCCEEDED"
    | "FAILED"
    | "CANCELLED"
    | "EXPIRED"
    | "ARCHIVED";
  subjectType: string | null;
  subjectId: string | null;
  requestedByEmail: string | null;
  hasInputText: boolean;
  hasOutputText: boolean;
  errorCode: string | null;
  startedAt: Date | null;
  finishedAt: Date | null;
  expiresAt: Date | null;
  updatedAt: Date;
};

export type AdminAiSnapshot = {
  overview: {
    totalProviders: number;
    activeProviders: number;
    enabledProviders: number;
    tasks: number;
    failedTasks: number;
  };
  providers: AdminAiProviderSummary[];
  tasks: AdminAiTaskSummary[];
};

export async function getAdminAiSnapshot(): Promise<AdminAiSnapshot> {
  const storeId = await getCurrentStoreId();

  if (storeId === null) {
    return {
      overview: {
        totalProviders: 0,
        activeProviders: 0,
        enabledProviders: 0,
        tasks: 0,
        failedTasks: 0,
      },
      providers: [],
      tasks: [],
    };
  }

  const providerWhere = {
    OR: [{ storeId }, { storeId: null }],
    archivedAt: null,
  };

  const taskWhere = {
    OR: [{ storeId }, { storeId: null }],
    archivedAt: null,
  };

  const [totalProviders, activeProviders, enabledProviders, tasksCount, failedTasksCount, providers, tasks] =
    await Promise.all([
      db.aiProvider.count({ where: providerWhere }),
      db.aiProvider.count({ where: { ...providerWhere, status: "ACTIVE" } }),
      db.aiProvider.count({ where: { ...providerWhere, isEnabled: true } }),
      db.aiTask.count({ where: taskWhere }),
      db.aiTask.count({ where: { ...taskWhere, status: "FAILED" } }),
      db.aiProvider.findMany({
        where: providerWhere,
        orderBy: [{ updatedAt: "desc" }],
        take: PROVIDERS_LIMIT,
        select: {
          id: true,
          code: true,
          name: true,
          description: true,
          provider: true,
          modelCode: true,
          status: true,
          isEnabled: true,
          updatedAt: true,
          tasks: {
            where: { archivedAt: null },
            orderBy: [{ createdAt: "desc" }],
            take: 1,
            select: { createdAt: true },
          },
          _count: {
            select: {
              tasks: {
                where: { archivedAt: null },
              },
            },
          },
        },
      }),
      db.aiTask.findMany({
        where: taskWhere,
        orderBy: [{ updatedAt: "desc" }],
        take: TASKS_LIMIT,
        select: {
          id: true,
          type: true,
          status: true,
          subjectType: true,
          subjectId: true,
          inputText: true,
          outputText: true,
          errorCode: true,
          startedAt: true,
          finishedAt: true,
          expiresAt: true,
          updatedAt: true,
          aiProvider: {
            select: {
              code: true,
            },
          },
          requestedBy: {
            select: {
              email: true,
            },
          },
        },
      }),
    ]);

  return {
    overview: {
      totalProviders,
      activeProviders,
      enabledProviders,
      tasks: tasksCount,
      failedTasks: failedTasksCount,
    },
    providers: providers.map((provider) => ({
      id: provider.id,
      code: provider.code,
      name: provider.name,
      description: provider.description,
      provider: provider.provider,
      modelCode: provider.modelCode,
      status: provider.status,
      isEnabled: provider.isEnabled,
      tasksCount: provider._count.tasks,
      lastTaskAt: provider.tasks[0]?.createdAt ?? null,
      activatedAt: provider.status === "ACTIVE" ? provider.updatedAt : null,
      updatedAt: provider.updatedAt,
    })),
    tasks: tasks.map((task) => ({
      id: task.id,
      providerCode: task.aiProvider?.code ?? null,
      type: task.type,
      status: task.status,
      subjectType: task.subjectType,
      subjectId: task.subjectId,
      requestedByEmail: task.requestedBy?.email ?? null,
      hasInputText: Boolean(task.inputText && task.inputText.length > 0),
      hasOutputText: Boolean(task.outputText && task.outputText.length > 0),
      errorCode: task.errorCode,
      startedAt: task.startedAt,
      finishedAt: task.finishedAt,
      expiresAt: task.expiresAt,
      updatedAt: task.updatedAt,
    })),
  };
}
