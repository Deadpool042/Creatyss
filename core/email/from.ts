// core/email/from.ts
type EmailSender = {
  email: string;
  name?: string;
};

const SIMPLE_EMAIL_PATTERN = /^[^<>\s@]+@[^<>\s@]+\.[^<>\s@]+$/;

function assertEmailAddress(value: string): string {
  const normalizedValue = value.trim();

  if (!SIMPLE_EMAIL_PATTERN.test(normalizedValue)) {
    throw new Error("Invalid email sender address.");
  }

  return normalizedValue;
}

export function createEmailSender(address: string, name?: string): EmailSender {
  const email = assertEmailAddress(address);
  const normalizedName = name?.trim();

  if (!normalizedName) {
    return { email };
  }

  return {
    email,
    name: normalizedName.replace(/^"|"$/g, ""),
  };
}

export function formatEmailSenderHeader(address: string, name?: string): string {
  const sender = createEmailSender(address, name);

  if (!sender.name) {
    return sender.email;
  }

  return `${sender.name} <${sender.email}>`;
}
