import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { env } from "./env";

const CART_SESSION_COOKIE_NAME = "creatyss_cart";
const CART_SESSION_MAX_AGE_SECONDS = 30 * 24 * 60 * 60;

type CartSessionVerificationResult =
  | {
      status: "valid";
      token: string;
    }
  | {
      status: "missing" | "malformed" | "invalid";
    };

export const cartSessionCookieOptions = {
  httpOnly: true,
  maxAge: CART_SESSION_MAX_AGE_SECONDS,
  path: "/",
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
};

function signCartToken(token: string): string {
  return createHmac("sha256", env.cartSessionSecret).update(token, "utf8").digest("base64url");
}

function verifyCartSessionValue(cookieValue: string | undefined): CartSessionVerificationResult {
  if (!cookieValue) {
    return { status: "missing" };
  }

  const segments = cookieValue.split(".");

  if (segments.length !== 2) {
    return { status: "malformed" };
  }

  const [token, signature] = segments;

  if (!token || !signature) {
    return { status: "malformed" };
  }

  const expectedSignature = Buffer.from(signCartToken(token), "utf8");
  const actualSignature = Buffer.from(signature, "utf8");

  if (expectedSignature.length !== actualSignature.length) {
    return { status: "invalid" };
  }

  if (!timingSafeEqual(expectedSignature, actualSignature)) {
    return { status: "invalid" };
  }

  return {
    status: "valid",
    token,
  };
}

export function createCartToken(): string {
  return randomBytes(32).toString("base64url");
}

export function createSignedCartSessionValue(token: string): string {
  return `${token}.${signCartToken(token)}`;
}

export async function readCartSessionToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(CART_SESSION_COOKIE_NAME)?.value;
  const verification = verifyCartSessionValue(cookieValue);

  if (verification.status !== "valid") {
    return null;
  }

  return verification.token;
}

export async function setCartSessionToken(token: string): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(
    CART_SESSION_COOKIE_NAME,
    createSignedCartSessionValue(token),
    cartSessionCookieOptions
  );
}

export async function clearCartSessionToken(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(CART_SESSION_COOKIE_NAME, "", {
    ...cartSessionCookieOptions,
    maxAge: 0,
  });
}
