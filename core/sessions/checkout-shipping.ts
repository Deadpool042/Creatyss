import { cookies } from "next/headers";

const CHECKOUT_SHIPPING_COOKIE_NAME = "creatyss_checkout_shipping";
const CHECKOUT_SHIPPING_MAX_AGE_SECONDS = 30 * 24 * 60 * 60;

const checkoutShippingCookieOptions = {
  httpOnly: true,
  maxAge: CHECKOUT_SHIPPING_MAX_AGE_SECONDS,
  path: "/",
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
} as const;

export async function readCheckoutShippingCode(): Promise<string | null> {
  const cookieStore = await cookies();
  const value = cookieStore.get(CHECKOUT_SHIPPING_COOKIE_NAME)?.value;
  return value && value.length > 0 ? value : null;
}

export async function writeCheckoutShippingCode(code: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(CHECKOUT_SHIPPING_COOKIE_NAME, code, checkoutShippingCookieOptions);
}

export async function clearCheckoutShippingCode(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(CHECKOUT_SHIPPING_COOKIE_NAME, "", {
    ...checkoutShippingCookieOptions,
    maxAge: 0,
  });
}
