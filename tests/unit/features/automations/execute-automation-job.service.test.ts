import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/core/config/env/server", () => ({
  serverEnv: {
    appUrl: "http://localhost:3000",
    appRuntimeEnv: "local",
    emailProvider: "mailpit",
  },
}));

vi.mock("@/core/db", () => ({
  db: {
    job: {
      findFirst: vi.fn(),
      updateMany: vi.fn(),
      update: vi.fn(),
    },
    newsletterSubscriber: {
      findFirst: vi.fn(),
    },
    order: {
      findFirst: vi.fn(),
    },
    automation: {
      findFirst: vi.fn(),
    },
    store: {
      findFirst: vi.fn(),
    },
  },
}));

vi.mock("@/features/email/automation/automation-email.repository", () => ({
  createAutomationEmailIfAbsent: vi.fn(),
  markAutomationEmailSent: vi.fn(),
  markAutomationEmailFailed: vi.fn(),
}));

vi.mock("@/features/email/providers/resolve-email-provider", () => ({
  resolveEmailProvider: vi.fn(),
}));

import { db } from "@/core/db";
import {
  createAutomationEmailIfAbsent,
  markAutomationEmailSent,
  markAutomationEmailFailed,
} from "@/features/email/automation/automation-email.repository";
import { resolveEmailProvider } from "@/features/email/providers/resolve-email-provider";
import { executeAutomationJob } from "@/features/automations/services/execute-automation-job.service";

const mockDb = db as unknown as {
  job: {
    findFirst: ReturnType<typeof vi.fn>;
    updateMany: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
  };
  newsletterSubscriber: { findFirst: ReturnType<typeof vi.fn> };
  order: { findFirst: ReturnType<typeof vi.fn> };
  automation: { findFirst: ReturnType<typeof vi.fn> };
  store: { findFirst: ReturnType<typeof vi.fn> };
};

const mockCreateAutomationEmailIfAbsent = createAutomationEmailIfAbsent as ReturnType<typeof vi.fn>;
const mockMarkAutomationEmailSent = markAutomationEmailSent as ReturnType<typeof vi.fn>;
const mockMarkAutomationEmailFailed = markAutomationEmailFailed as ReturnType<typeof vi.fn>;
const mockResolveEmailProvider = resolveEmailProvider as ReturnType<typeof vi.fn>;

const STORE_ID = "store_1";
const JOB_ID = "job_1";

function buildOrderPlacedJob(overrides: Partial<{ subjectId: string; subjectType: string }> = {}) {
  return {
    id: JOB_ID,
    status: "PENDING",
    scheduledAt: null,
    subjectType: "ORDER",
    subjectId: "order_1",
    payloadJson: JSON.stringify({
      automationId: "auto_1",
      actionType: "EMAIL_MESSAGE",
      triggerType: "ORDER_PLACED",
      templateCode: "order-placed-confirmation",
    }),
    ...overrides,
  };
}

describe("executeAutomationJob", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDb.job.updateMany.mockResolvedValue({ count: 1 });
    mockDb.job.update.mockResolvedValue({});
    mockDb.automation.findFirst.mockResolvedValue({
      id: "auto_1",
      templateCode: "order-placed-confirmation",
      actionType: "EMAIL_MESSAGE",
    });
    mockDb.store.findFirst.mockResolvedValue({
      name: "Creatyss",
      supportEmail: "support@creatyss.com",
      replyToEmail: null,
      isProduction: false,
    });
    mockCreateAutomationEmailIfAbsent.mockResolvedValue({ id: "email_1" });
    mockMarkAutomationEmailSent.mockResolvedValue(undefined);
    mockMarkAutomationEmailFailed.mockResolvedValue(undefined);
    mockResolveEmailProvider.mockReturnValue({
      kind: "mailpit",
      provider: {
        sendTransactionalEmail: vi.fn().mockResolvedValue({
          provider: "mailpit",
          providerMessageId: "msg_1",
        }),
      },
    });
  });

  it("exécute un job ORDER_PLACED : résout l'email client et envoie le template order-placed-confirmation", async () => {
    mockDb.job.findFirst.mockResolvedValue(buildOrderPlacedJob());
    mockDb.order.findFirst.mockResolvedValue({
      customerEmail: "client@example.com",
      customerFirstName: "Alice",
      orderNumber: "CMD-001",
      totalAmount: 42.5,
      currencyCode: "EUR",
    });

    await executeAutomationJob({ jobId: JOB_ID, storeId: STORE_ID });

    expect(mockDb.order.findFirst).toHaveBeenCalledWith({
      where: { id: "order_1", storeId: STORE_ID, archivedAt: null },
      select: {
        customerEmail: true,
        customerFirstName: true,
        orderNumber: true,
        totalAmount: true,
        currencyCode: true,
      },
    });

    const emailCallArgs = mockCreateAutomationEmailIfAbsent.mock.calls[0][0];
    expect(emailCallArgs.recipientEmail).toBe("client@example.com");
    expect(emailCallArgs.subjectLine).toContain("CMD-001");

    expect(mockDb.job.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: JOB_ID },
        data: expect.objectContaining({ status: "SUCCEEDED" }),
      })
    );
  });

  it("échoue avec unsupported_subject_type pour un subjectType non supporté", async () => {
    mockDb.job.findFirst.mockResolvedValue(buildOrderPlacedJob({ subjectType: "UNKNOWN_TYPE" }));

    await expect(executeAutomationJob({ jobId: JOB_ID, storeId: STORE_ID })).rejects.toMatchObject({
      code: "unsupported_subject_type",
    });

    expect(mockDb.job.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: JOB_ID },
        data: expect.objectContaining({
          status: "FAILED",
          errorCode: "unsupported_subject_type",
        }),
      })
    );
  });

  it("exécute un job NEWSLETTER_SUBSCRIBED (non-régression)", async () => {
    mockDb.job.findFirst.mockResolvedValue({
      id: JOB_ID,
      status: "PENDING",
      scheduledAt: null,
      subjectType: "NEWSLETTER_SUBSCRIBER",
      subjectId: "sub_1",
      payloadJson: JSON.stringify({
        automationId: "auto_1",
        actionType: "EMAIL_MESSAGE",
        triggerType: "NEWSLETTER_SUBSCRIBED",
        templateCode: null,
      }),
    });
    mockDb.newsletterSubscriber.findFirst.mockResolvedValue({
      email: "sub@example.com",
      firstName: "Bob",
      status: "SUBSCRIBED",
    });
    mockDb.automation.findFirst.mockResolvedValue({
      id: "auto_1",
      templateCode: null,
      actionType: "EMAIL_MESSAGE",
    });

    await executeAutomationJob({ jobId: JOB_ID, storeId: STORE_ID });

    const emailCallArgs = mockCreateAutomationEmailIfAbsent.mock.calls[0][0];
    expect(emailCallArgs.recipientEmail).toBe("sub@example.com");
    expect(mockDb.job.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ status: "SUCCEEDED" }) })
    );
  });
});
