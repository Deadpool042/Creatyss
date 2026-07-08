import "server-only";

import { Prisma, type DomainEvent, type DomainEventStatus } from "@/prisma-generated/client";
import { db, type DbExecutor } from "@/core/db";

type DomainEventJsonValue = Prisma.JsonValue;

export class DomainEventIdempotencyCollisionError extends Error {
  constructor(idempotencyKey: string, reasons: readonly string[]) {
    super(
      `DomainEvent idempotency collision for key "${idempotencyKey}": ${reasons.join(", ")}`,
    );
    this.name = "DomainEventIdempotencyCollisionError";
  }
}

export type RecordDomainEventInput = Readonly<{
  executor?: DbExecutor;
  storeId?: string | null;
  eventType: string;
  eventVersion?: number;
  aggregateType: string;
  aggregateId: string;
  status?: DomainEventStatus;
  idempotencyKey?: string | null;
  payload: DomainEventJsonValue;
  metadata?: DomainEventJsonValue | null;
  occurredAt?: Date | null;
  publishedAt?: Date | null;
  failedAt?: Date | null;
  archivedAt?: Date | null;
  errorCode?: string | null;
  errorMessage?: string | null;
}>;

export type RecordDomainEventResult = Readonly<{
  event: DomainEvent;
  created: boolean;
}>;

function getExecutor(executor?: DbExecutor): DbExecutor {
  return executor ?? db;
}

function serializeJson(value: DomainEventJsonValue): string {
  return JSON.stringify(value);
}

function assertCompatibleExistingEvent(
  existing: DomainEvent,
  input: Pick<RecordDomainEventInput, "eventType" | "aggregateType" | "aggregateId">,
  serializedPayload: string,
  idempotencyKey: string,
): DomainEvent {
  const reasons: string[] = [];

  if (existing.eventType !== input.eventType) {
    reasons.push(`eventType mismatch (${existing.eventType} !== ${input.eventType})`);
  }

  if (existing.aggregateType !== input.aggregateType) {
    reasons.push(`aggregateType mismatch (${existing.aggregateType} !== ${input.aggregateType})`);
  }

  if (existing.aggregateId !== input.aggregateId) {
    reasons.push(`aggregateId mismatch (${existing.aggregateId} !== ${input.aggregateId})`);
  }

  if (existing.payloadJson !== serializedPayload) {
    reasons.push("payloadJson mismatch");
  }

  if (reasons.length > 0) {
    throw new DomainEventIdempotencyCollisionError(idempotencyKey, reasons);
  }

  return existing;
}

function isUniqueConstraintError(error: unknown): boolean {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return error.code === "P2002";
  }

  if (typeof error !== "object" || error === null || !("code" in error)) {
    return false;
  }

  return error.code === "P2002";
}

async function findExistingDomainEvent(
  executor: DbExecutor,
  idempotencyKey: string,
): Promise<DomainEvent | null> {
  return executor.domainEvent.findUnique({
    where: {
      idempotencyKey,
    },
  });
}

export async function recordDomainEvent(
  input: RecordDomainEventInput,
): Promise<RecordDomainEventResult> {
  const executor = getExecutor(input.executor);
  const idempotencyKey = input.idempotencyKey ?? null;
  const serializedPayload = serializeJson(input.payload);

  if (idempotencyKey !== null) {
    const existing = await findExistingDomainEvent(executor, idempotencyKey);

    if (existing !== null) {
      return {
        event: assertCompatibleExistingEvent(existing, input, serializedPayload, idempotencyKey),
        created: false,
      };
    }
  }

  try {
    const event = await executor.domainEvent.create({
      data: {
        storeId: input.storeId ?? null,
        eventType: input.eventType,
        eventVersion: input.eventVersion ?? 1,
        aggregateType: input.aggregateType,
        aggregateId: input.aggregateId,
        status: input.status ?? "PENDING",
        idempotencyKey,
        payloadJson: serializedPayload,
        metadataJson:
          input.metadata === undefined || input.metadata === null
            ? null
            : serializeJson(input.metadata),
        occurredAt: input.occurredAt ?? null,
        publishedAt: input.publishedAt ?? null,
        failedAt: input.failedAt ?? null,
        archivedAt: input.archivedAt ?? null,
        errorCode: input.errorCode ?? null,
        errorMessage: input.errorMessage ?? null,
      },
    });

    return {
      event,
      created: true,
    };
  } catch (error: unknown) {
    if (!isUniqueConstraintError(error) || idempotencyKey === null) {
      throw error;
    }

    const existing = await findExistingDomainEvent(executor, idempotencyKey);

    if (existing !== null) {
      return {
        event: assertCompatibleExistingEvent(existing, input, serializedPayload, idempotencyKey),
        created: false,
      };
    }

    throw error;
  }
}
