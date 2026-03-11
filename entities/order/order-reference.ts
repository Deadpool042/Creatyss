import { randomBytes } from "node:crypto";

const ORDER_REFERENCE_PREFIX = "CRY";
const ORDER_REFERENCE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const ORDER_REFERENCE_LENGTH = 10;

export function formatOrderReferenceFromBytes(bytes: Uint8Array): string {
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

  return `${ORDER_REFERENCE_PREFIX}-${encodedReference}`;
}

export function createOrderReference(): string {
  return formatOrderReferenceFromBytes(randomBytes(ORDER_REFERENCE_LENGTH));
}
