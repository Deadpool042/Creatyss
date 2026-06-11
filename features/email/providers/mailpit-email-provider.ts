import { randomUUID } from "node:crypto";
import { Socket } from "node:net";

import { serverEnv } from "@/core/config/env/server";
import { formatEmailSenderHeader } from "@/core/email/from";

import type {
  TransactionalEmailPayload,
  TransactionalEmailProvider,
  TransactionalEmailResult,
} from "./email-provider.types";

function escapeSmtpLine(value: string): string {
  if (value.startsWith(".")) {
    return `.${value}`;
  }

  return value;
}

function normalizeTextContent(value: string): string {
  return value.replace(/\r?\n/g, "\r\n");
}

function createBoundary(): string {
  return `creatyss-${randomUUID()}`;
}

function buildMessage(input: TransactionalEmailPayload): {
  messageId: string;
  raw: string;
} {
  const boundary = createBoundary();
  const messageId = `<${randomUUID()}@creatyss.local>`;
  const fromHeader = formatEmailSenderHeader(serverEnv.emailFromAddress, serverEnv.emailFromName);
  const textContent = normalizeTextContent(input.text);
  const htmlContent = normalizeTextContent(input.html);

  const lines = [
    `From: ${fromHeader}`,
    `To: ${input.to}`,
    `Subject: ${input.subject}`,
    ...(input.replyTo ? [`Reply-To: ${input.replyTo}`] : []),
    `Message-ID: ${messageId}`,
    `Date: ${new Date().toUTCString()}`,
    "MIME-Version: 1.0",
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    "",
    `--${boundary}`,
    'Content-Type: text/plain; charset="utf-8"',
    "Content-Transfer-Encoding: 8bit",
    "",
    ...textContent.split("\r\n").map(escapeSmtpLine),
    "",
    `--${boundary}`,
    'Content-Type: text/html; charset="utf-8"',
    "Content-Transfer-Encoding: 8bit",
    "",
    ...htmlContent.split("\r\n").map(escapeSmtpLine),
    "",
    `--${boundary}--`,
    "",
  ];

  return {
    messageId,
    raw: [...lines, "."].join("\r\n"),
  };
}

function readSmtpResponse(socket: Socket): Promise<string> {
  return new Promise((resolve, reject) => {
    let buffer = "";

    const cleanup = () => {
      socket.off("data", onData);
      socket.off("error", onError);
      socket.off("close", onClose);
    };

    const onError = (error: Error) => {
      cleanup();
      reject(error);
    };

    const onClose = () => {
      cleanup();
      reject(new Error("Mailpit SMTP connection closed unexpectedly."));
    };

    const onData = (chunk: Buffer) => {
      buffer += chunk.toString("utf8");

      const lines = buffer.split("\r\n").filter((line) => line.length > 0);
      const lastLine = lines.at(-1);

      if (!lastLine) {
        return;
      }

      if (/^\d{3} /.test(lastLine)) {
        cleanup();
        resolve(buffer);
      }
    };

    socket.on("data", onData);
    socket.on("error", onError);
    socket.on("close", onClose);
  });
}

async function sendSmtpCommand(
  socket: Socket,
  command: string,
  expectedCodes: readonly string[]
): Promise<void> {
  socket.write(`${command}\r\n`);
  const response = await readSmtpResponse(socket);

  if (!expectedCodes.some((code) => response.startsWith(code))) {
    throw new Error(
      `Mailpit SMTP command failed for "${command}": ${response.replace(/\s+/g, " ").trim()}`
    );
  }
}

async function withSmtpConnection<T>(run: (socket: Socket) => Promise<T>): Promise<T> {
  const socket = new Socket();

  await new Promise<void>((resolve, reject) => {
    socket.once("error", reject);
    socket.connect(serverEnv.mailpitSmtpPort, serverEnv.mailpitSmtpHost, () => {
      socket.off("error", reject);
      resolve();
    });
  });

  try {
    const greeting = await readSmtpResponse(socket);

    if (!greeting.startsWith("220")) {
      throw new Error(`Mailpit SMTP greeting failed: ${greeting.replace(/\s+/g, " ").trim()}`);
    }

    return await run(socket);
  } finally {
    if (!socket.destroyed) {
      socket.end();
      socket.destroy();
    }
  }
}

export class MailpitEmailProvider implements TransactionalEmailProvider {
  async sendTransactionalEmail(
    payload: TransactionalEmailPayload
  ): Promise<TransactionalEmailResult> {
    const message = buildMessage(payload);

    await withSmtpConnection(async (socket) => {
      await sendSmtpCommand(socket, "EHLO creatyss.local", ["250"]);
      await sendSmtpCommand(socket, `MAIL FROM:<${serverEnv.emailFromAddress}>`, ["250"]);
      await sendSmtpCommand(socket, `RCPT TO:<${payload.to}>`, ["250", "251"]);
      await sendSmtpCommand(socket, "DATA", ["354"]);

      socket.write(`${message.raw}\r\n`);
      const dataResponse = await readSmtpResponse(socket);

      if (!dataResponse.startsWith("250")) {
        throw new Error(
          `Mailpit SMTP message rejected: ${dataResponse.replace(/\s+/g, " ").trim()}`
        );
      }

      await sendSmtpCommand(socket, "QUIT", ["221"]);
    });

    return {
      provider: "mailpit",
      providerMessageId: message.messageId,
    };
  }
}
