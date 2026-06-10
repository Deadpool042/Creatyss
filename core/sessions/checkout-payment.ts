import { cookies } from "next/headers";
import {
  type CheckoutPaymentMethod,
  isCheckoutPaymentMethod,
} from "@/features/commerce/checkout/types/checkout-payment-method.types";

const CHECKOUT_PAYMENT_COOKIE_NAME = "creatyss_checkout_payment";
const CHECKOUT_PAYMENT_MAX_AGE_SECONDS = 30 * 24 * 60 * 60;

const checkoutPaymentCookieOptions = {
  httpOnly: true,
  maxAge: CHECKOUT_PAYMENT_MAX_AGE_SECONDS,
  path: "/",
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
} as const;

export async function readCheckoutPaymentMethod(): Promise<CheckoutPaymentMethod | null> {
  const cookieStore = await cookies();
  const value = cookieStore.get(CHECKOUT_PAYMENT_COOKIE_NAME)?.value;
  if (!value) return null;
  if (isCheckoutPaymentMethod(value)) return value;
  return null;
}

export async function writeCheckoutPaymentMethod(
  method: CheckoutPaymentMethod
): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(CHECKOUT_PAYMENT_COOKIE_NAME, method, checkoutPaymentCookieOptions);
}

export async function clearCheckoutPaymentMethod(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(CHECKOUT_PAYMENT_COOKIE_NAME, "", {
    ...checkoutPaymentCookieOptions,
    maxAge: 0,
  });
}
