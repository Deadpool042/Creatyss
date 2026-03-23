import { prisma } from "@/db/prisma-client";
import {
  mapEmailCategoryToPrisma,
  mapEmailMessageDetail,
  mapEmailMessageStatusToPrisma,
  mapEmailRecipientKindToPrisma,
  mapEmailSummary,
} from "@db-email/helpers/mappers";
import {
  normalizeEmailAddress,
  parseCreateEmailMessageInput,
  parseFailEmailMessageInput,
} from "@db-email/helpers/validation";
import {
  findEmailMessageRowById,
  listEmailMessageRowsByStoreId,
} from "@db-email/queries/message.queries";
import type {
  CreateEmailMessageInput,
  EmailMessageDetail,
  EmailMessageSummary,
  FailEmailMessageInput,
} from "@db-email/messages/types/message.types";

export async function listEmailMessagesByStoreId(
  storeId: string
): Promise<EmailMessageSummary[]> {
  const rows = await listEmailMessageRowsByStoreId(storeId);
  return rows.map(mapEmailSummary);
}

export async function findEmailMessageById(id: string): Promise<EmailMessageDetail | null> {
  const row = await findEmailMessageRowById(id.trim());
  return row ? mapEmailMessageDetail(row) : null;
}

export async function createEmailMessage(
  input: CreateEmailMessageInput
): Promise<EmailMessageDetail> {
  const parsedInput = parseCreateEmailMessageInput(input);

  const created = await prisma.emailMessage.create({
    data: {
      storeId: parsedInput.storeId,
      category: mapEmailCategoryToPrisma(parsedInput.category),
      status: mapEmailMessageStatusToPrisma("pending"),
      recipientKind: mapEmailRecipientKindToPrisma(parsedInput.recipientKind),
      toEmail: normalizeEmailAddress(parsedInput.toEmail),
      toName: parsedInput.toName ?? null,
      subject: parsedInput.subject,
      htmlBody: parsedInput.htmlBody ?? null,
      textBody: parsedInput.textBody ?? null,
      userId: parsedInput.userId ?? null,
      customerId: parsedInput.customerId ?? null,
      templateDefinitionId: parsedInput.templateDefinitionId ?? null,
      templateVariantId: parsedInput.templateVariantId ?? null,
      notificationId: parsedInput.notificationId ?? null,
      orderId: parsedInput.orderId ?? null,
      eventId: parsedInput.eventId ?? null,
      supportTicketId: parsedInput.supportTicketId ?? null,
    },
    select: {
      id: true,
    },
  });

  const row = await findEmailMessageRowById(created.id);

  if (!row) {
    throw new Error("Email message not found after create.");
  }

  return mapEmailMessageDetail(row);
}

export async function markEmailMessagePrepared(
  id: string
): Promise<EmailMessageDetail | null> {
  const updated = await prisma.emailMessage.updateMany({
    where: {
      id: id.trim(),
    },
    data: {
      status: mapEmailMessageStatusToPrisma("prepared"),
      preparedAt: new Date(),
    },
  });

  if (updated.count === 0) {
    return null;
  }

  const row = await findEmailMessageRowById(id.trim());
  return row ? mapEmailMessageDetail(row) : null;
}

export async function markEmailMessageSent(id: string): Promise<EmailMessageDetail | null> {
  const updated = await prisma.emailMessage.updateMany({
    where: {
      id: id.trim(),
    },
    data: {
      status: mapEmailMessageStatusToPrisma("sent"),
      sentAt: new Date(),
      failureCode: null,
      failureMessage: null,
    },
  });

  if (updated.count === 0) {
    return null;
  }

  const row = await findEmailMessageRowById(id.trim());
  return row ? mapEmailMessageDetail(row) : null;
}

export async function markEmailMessageFailed(
  id: string,
  input: FailEmailMessageInput
): Promise<EmailMessageDetail | null> {
  const parsedInput = parseFailEmailMessageInput(input);
  const updated = await prisma.emailMessage.updateMany({
    where: {
      id: id.trim(),
    },
    data: {
      status: mapEmailMessageStatusToPrisma("failed"),
      failedAt: new Date(),
      failureCode: parsedInput.failureCode ?? null,
      failureMessage: parsedInput.failureMessage,
    },
  });

  if (updated.count === 0) {
    return null;
  }

  const row = await findEmailMessageRowById(id.trim());
  return row ? mapEmailMessageDetail(row) : null;
}

export async function cancelEmailMessage(id: string): Promise<EmailMessageDetail | null> {
  const updated = await prisma.emailMessage.updateMany({
    where: {
      id: id.trim(),
    },
    data: {
      status: mapEmailMessageStatusToPrisma("cancelled"),
      cancelledAt: new Date(),
    },
  });

  if (updated.count === 0) {
    return null;
  }

  const row = await findEmailMessageRowById(id.trim());
  return row ? mapEmailMessageDetail(row) : null;
}
