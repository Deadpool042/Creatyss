export const CONTACT_MESSAGE_SUBJECT_CODES = [
  "question_produit",
  "sur_mesure",
  "commande",
  "marche",
  "autre",
] as const;

export type ContactMessageSubjectCode = (typeof CONTACT_MESSAGE_SUBJECT_CODES)[number];

export type ValidatedContactMessageInput = {
  firstName: string;
  lastName: string | null;
  email: string;
  subject: ContactMessageSubjectCode | null;
  message: string;
};

export type ContactMessageInputErrorCode =
  | "missing_first_name"
  | "missing_email"
  | "invalid_email"
  | "missing_message";

type ContactMessageInputSource = {
  firstName: FormDataEntryValue | string | null | undefined;
  lastName: FormDataEntryValue | string | null | undefined;
  email: FormDataEntryValue | string | null | undefined;
  subject: FormDataEntryValue | string | null | undefined;
  message: FormDataEntryValue | string | null | undefined;
};

export type ContactMessageInputValidationResult =
  | {
      ok: true;
      data: ValidatedContactMessageInput;
    }
  | {
      ok: false;
      code: ContactMessageInputErrorCode;
    };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MESSAGE_MAX_LENGTH = 5000;
const NAME_MAX_LENGTH = 200;

function readTrimmedString(value: FormDataEntryValue | string | null | undefined): string | null {
  if (typeof value !== "string") {
    return null;
  }

  return value.trim();
}

function normalizeSubject(
  value: FormDataEntryValue | string | null | undefined
): ContactMessageSubjectCode | null {
  const normalizedValue = readTrimmedString(value);

  if (
    normalizedValue !== null &&
    (CONTACT_MESSAGE_SUBJECT_CODES as readonly string[]).includes(normalizedValue)
  ) {
    return normalizedValue as ContactMessageSubjectCode;
  }

  return null;
}

export function validateContactMessageInput(
  input: ContactMessageInputSource
): ContactMessageInputValidationResult {
  const firstName = readTrimmedString(input.firstName);

  if (firstName === null || firstName.length === 0) {
    return { ok: false, code: "missing_first_name" };
  }

  const lastNameRaw = readTrimmedString(input.lastName);
  const lastName = lastNameRaw !== null && lastNameRaw.length > 0 ? lastNameRaw : null;

  const email = readTrimmedString(input.email)?.toLowerCase() ?? null;

  if (email === null || email.length === 0) {
    return { ok: false, code: "missing_email" };
  }

  if (email.length > NAME_MAX_LENGTH || !EMAIL_PATTERN.test(email)) {
    return { ok: false, code: "invalid_email" };
  }

  const message = readTrimmedString(input.message);

  if (message === null || message.length === 0) {
    return { ok: false, code: "missing_message" };
  }

  return {
    ok: true,
    data: {
      firstName: firstName.slice(0, NAME_MAX_LENGTH),
      lastName: lastName !== null ? lastName.slice(0, NAME_MAX_LENGTH) : null,
      email,
      subject: normalizeSubject(input.subject),
      message: message.slice(0, MESSAGE_MAX_LENGTH),
    },
  };
}
