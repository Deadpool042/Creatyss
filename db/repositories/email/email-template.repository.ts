import { Prisma } from "@prisma/client";
import { prisma } from "@/db/prisma-client";
import {
  EmailTemplateRepositoryError,
  type CreateEmailTemplateInput,
  type EmailTemplateDetail,
  type EmailTemplateStatus,
  type EmailTemplateSummary,
  type UpdateEmailTemplateInput,
} from "./email-template.types";
import { mapEmailTemplateDetail, mapEmailTemplateSummary } from "./helpers/mappers";
import { parseCreateEmailTemplateInput, parseUpdateEmailTemplateInput } from "./helpers/validation";
import {
  findEmailTemplateRowById,
  findEmailTemplateRowByKey,
  listEmailTemplateRows,
} from "./queries/email-template.queries";

function mapPrismaEmailTemplateError(error: unknown): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    throw new EmailTemplateRepositoryError(
      "email_template_key_conflict",
      "Une template avec cette clé existe déjà."
    );
  }

  throw error;
}

export async function listEmailTemplates(): Promise<EmailTemplateSummary[]> {
  const rows = await listEmailTemplateRows();
  return rows.map(mapEmailTemplateSummary);
}

export async function findEmailTemplateById(id: string): Promise<EmailTemplateDetail | null> {
  const row = await findEmailTemplateRowById(id);

  if (!row) {
    return null;
  }

  return mapEmailTemplateDetail(row);
}

export async function findEmailTemplateByKey(key: string): Promise<EmailTemplateDetail | null> {
  const row = await findEmailTemplateRowByKey(key);

  if (!row) {
    return null;
  }

  return mapEmailTemplateDetail(row);
}

export async function createEmailTemplate(
  input: CreateEmailTemplateInput
): Promise<EmailTemplateDetail> {
  const parsedInput = parseCreateEmailTemplateInput(input);
  const resolvedStatus = parsedInput.status ?? "draft";

  try {
    const created = await prisma.emailTemplate.create({
      data: {
        key: parsedInput.key,
        name: parsedInput.name,
        type: parsedInput.type,
        subjectTemplate: parsedInput.subjectTemplate,
        bodyHtml: parsedInput.bodyHtml,
        bodyText: parsedInput.bodyText ?? null,
        status: resolvedStatus,
      },
      select: {
        id: true,
      },
    });

    const row = await findEmailTemplateRowById(created.id);

    if (!row) {
      throw new EmailTemplateRepositoryError("email_template_not_found", "Template introuvable.");
    }

    return mapEmailTemplateDetail(row);
  } catch (error) {
    mapPrismaEmailTemplateError(error);
  }
}

export async function updateEmailTemplate(
  input: UpdateEmailTemplateInput
): Promise<EmailTemplateDetail | null> {
  const parsedInput = parseUpdateEmailTemplateInput(input);

  try {
    const updated = await prisma.emailTemplate.updateMany({
      where: {
        id: parsedInput.id,
      },
      data: {
        key: parsedInput.key,
        name: parsedInput.name,
        type: parsedInput.type,
        subjectTemplate: parsedInput.subjectTemplate,
        bodyHtml: parsedInput.bodyHtml,
        bodyText: parsedInput.bodyText ?? null,
        status: parsedInput.status,
      },
    });

    if (updated.count === 0) {
      return null;
    }

    const row = await findEmailTemplateRowById(parsedInput.id);

    if (!row) {
      return null;
    }

    return mapEmailTemplateDetail(row);
  } catch (error) {
    mapPrismaEmailTemplateError(error);
  }
}

export async function updateEmailTemplateStatus(
  id: string,
  status: EmailTemplateStatus
): Promise<EmailTemplateStatus | null> {
  const updated = await prisma.emailTemplate.updateMany({
    where: { id },
    data: { status },
  });

  if (updated.count === 0) {
    return null;
  }

  return status;
}

export async function deleteEmailTemplate(id: string): Promise<boolean> {
  const deleted = await prisma.emailTemplate.deleteMany({
    where: { id },
  });

  return deleted.count > 0;
}
