type EmailSender = {
  email: string;
  name?: string;
};

const SIMPLE_EMAIL_PATTERN = /^[^<>\s@]+@[^<>\s@]+\.[^<>\s@]+$/;

export function parseEmailFrom(value: string): EmailSender {
  const normalizedValue = value.trim();

  if (SIMPLE_EMAIL_PATTERN.test(normalizedValue)) {
    return { email: normalizedValue };
  }

  const match = /^(?<name>.+?)\s*<(?<email>[^<>\s@]+@[^<>\s@]+\.[^<>\s@]+)>$/.exec(normalizedValue);

  const name = match?.groups?.name?.trim().replace(/^"|"$/g, "");
  const email = match?.groups?.email?.trim();

  if (!name || !email || !SIMPLE_EMAIL_PATTERN.test(email)) {
    throw new Error("Invalid EMAIL_FROM format.");
  }

  return { email, name };
}
