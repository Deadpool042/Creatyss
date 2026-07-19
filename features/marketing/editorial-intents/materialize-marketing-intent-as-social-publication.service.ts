import "server-only";

import {
  Prisma,
  type MarketingIntent,
  type MarketingIntentStatus,
  type SocialPublication,
} from "@/prisma-generated/client";
import { db } from "@/core/db";

const SOCIAL_CHANNEL = "SOCIAL" as const;
const GENERIC_CHANNEL_CODE = "generic" as const;

const DEFAULT_PUBLICATION_TITLE = "Communication sociale";
const BODY_MAX_LENGTH = 500_000;

export type MaterializeMarketingIntentAsSocialPublicationInput = Readonly<{
  intentId: string;
}>;

export type MaterializeMarketingIntentAsSocialPublicationResult =
  | Readonly<{
      status: "created";
      socialPublication: SocialPublication;
    }>
  | Readonly<{
      status: "already_materialized";
      socialPublication: SocialPublication;
    }>
  | Readonly<{
      status: "not_found";
      socialPublication: null;
    }>
  | Readonly<{
      status: "invalid_status";
      socialPublication: null;
      currentStatus: MarketingIntentStatus;
    }>
  | Readonly<{
      status: "channel_not_suggested";
      socialPublication: null;
    }>;

function isUniqueConstraintError(error: unknown): boolean {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return error.code === "P2002";
  }

  if (typeof error !== "object" || error === null || !("code" in error)) {
    return false;
  }

  return error.code === "P2002";
}

function asJsonObject(value: Prisma.JsonValue | null): Prisma.JsonObject | null {
  if (value === null || Array.isArray(value) || typeof value !== "object") {
    return null;
  }

  return value as Prisma.JsonObject;
}

function readContextString(value: Prisma.JsonValue | null, key: string): string | null {
  const objectValue = asJsonObject(value);

  if (objectValue === null) {
    return null;
  }

  const item = objectValue[key];
  const trimmed = typeof item === "string" ? item.trim() : "";
  return trimmed.length > 0 ? trimmed : null;
}

export function buildMaterializedSocialPublicationCode(intentId: string): string {
  return `mi-${intentId}`;
}

function getPublicationTitle(intent: MarketingIntent): string {
  return readContextString(intent.contextJson, "title") ?? intent.subjectId;
}

function getSourceLink(intent: MarketingIntent): string | null {
  switch (intent.subjectType) {
    case "BLOG_POST": {
      const slug = readContextString(intent.contextJson, "slug");
      return slug !== null ? `/blog/${slug}` : null;
    }
    case "HOMEPAGE":
      return "/";
    default:
      return null;
  }
}

function buildBody(title: string, link: string | null): string {
  const linkText = link !== null ? `\n${link}` : "";
  return `${title}${linkText}`.slice(0, BODY_MAX_LENGTH);
}

async function findExistingMaterializedPublication(
  storeId: string | null,
  code: string
): Promise<SocialPublication | null> {
  return db.socialPublication.findFirst({
    where: { storeId, code },
  });
}

/**
 * Matérialise un `MarketingIntent` APPROVED compatible social en
 * `SocialPublication` DRAFT. Idempotent via `code = mi-${intentId}` +
 * `@@unique([storeId, code])` — un rejeu retourne la publication existante.
 * Ne contacte aucun provider, ne modifie pas le statut de l'intent.
 */
export async function materializeMarketingIntentAsSocialPublication(
  input: MaterializeMarketingIntentAsSocialPublicationInput
): Promise<MaterializeMarketingIntentAsSocialPublicationResult> {
  const intent = await db.marketingIntent.findUnique({
    where: { id: input.intentId },
  });

  if (intent === null) {
    return { status: "not_found", socialPublication: null };
  }

  if (intent.status !== "APPROVED") {
    return {
      status: "invalid_status",
      socialPublication: null,
      currentStatus: intent.status,
    };
  }

  if (!intent.suggestedChannels.includes(SOCIAL_CHANNEL)) {
    return { status: "channel_not_suggested", socialPublication: null };
  }

  const code = buildMaterializedSocialPublicationCode(intent.id);
  const existingPublication = await findExistingMaterializedPublication(intent.storeId, code);

  if (existingPublication !== null) {
    return { status: "already_materialized", socialPublication: existingPublication };
  }

  const title = getPublicationTitle(intent);
  const link = getSourceLink(intent);

  try {
    const socialPublication = await db.socialPublication.create({
      data: {
        storeId: intent.storeId,
        code,
        channelCode: GENERIC_CHANNEL_CODE,
        subjectType: intent.subjectType,
        subjectId: intent.subjectId,
        title: title.length > 0 ? title : DEFAULT_PUBLICATION_TITLE,
        body: buildBody(title, link),
        status: "DRAFT",
      },
    });

    return { status: "created", socialPublication };
  } catch (error: unknown) {
    if (!isUniqueConstraintError(error)) {
      throw error;
    }

    const concurrentPublication = await findExistingMaterializedPublication(intent.storeId, code);

    if (concurrentPublication === null) {
      throw error;
    }

    return { status: "already_materialized", socialPublication: concurrentPublication };
  }
}
