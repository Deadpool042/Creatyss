import { randomBytes } from "node:crypto";

export const DEFAULT_ORDER_REFERENCE_PREFIX = "CRY";
const ORDER_REFERENCE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const ORDER_REFERENCE_LENGTH = 10;

export function formatOrderReferenceFromBytes(
  bytes: Uint8Array,
  prefix = DEFAULT_ORDER_REFERENCE_PREFIX
): string {
  let encodedReference = "";

  for (const byte of bytes) {
    encodedReference += ORDER_REFERENCE_ALPHABET[byte % ORDER_REFERENCE_ALPHABET.length];

    if (encodedReference.length === ORDER_REFERENCE_LENGTH) {
      break;
    }
  }

  if (encodedReference.length < ORDER_REFERENCE_LENGTH) {
    encodedReference = encodedReference.padEnd(
      ORDER_REFERENCE_LENGTH,
      ORDER_REFERENCE_ALPHABET[0] ?? "A"
    );
  }

  return `${prefix}-${encodedReference}`;
}

export function createOrderReference(prefix = DEFAULT_ORDER_REFERENCE_PREFIX): string {
  return formatOrderReferenceFromBytes(randomBytes(ORDER_REFERENCE_LENGTH), prefix);
}

export function isValidOrderReference(ref: string): boolean {
  return /^[A-Z0-9]{1,10}-[A-Z0-9]{10}$/.test(ref);
}
