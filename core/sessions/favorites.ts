import { createHmac, timingSafeEqual } from "node:crypto";

import { cookies } from "next/headers";

import { serverEnv } from "@/core/config/env/server";

const FAVORITES_COOKIE_NAME = "creatyss_favorites";
const FAVORITES_COOKIE_MAX_AGE = 30 * 24 * 60 * 60;
const FAVORITES_MAX_IDS = 50;

export const favoritesCookieOptions = {
  httpOnly: true,
  maxAge: FAVORITES_COOKIE_MAX_AGE,
  path: "/",
  sameSite: "lax" as const,
  secure: serverEnv.nodeEnv === "production",
};

function signFavoritesPayload(payload: string): string {
  return createHmac("sha256", serverEnv.favoritesSessionSecret)
    .update(payload, "utf8")
    .digest("base64url");
}

function buildFavoritesCookieValue(productIds: string[]): string {
  const payload = Buffer.from(JSON.stringify(productIds)).toString("base64url");
  const signature = signFavoritesPayload(payload);
  return `${payload}.${signature}`;
}

function parseFavoritesCookieValue(raw: string | undefined): string[] | null {
  if (!raw) {
    return null;
  }

  const lastDot = raw.lastIndexOf(".");

  if (lastDot === -1) {
    return null;
  }

  const payload = raw.slice(0, lastDot);
  const signature = raw.slice(lastDot + 1);

  if (!payload || !signature) {
    return null;
  }

  try {
    const expectedSignature = Buffer.from(signFavoritesPayload(payload), "utf8");
    const actualSignature = Buffer.from(signature, "utf8");

    if (expectedSignature.length !== actualSignature.length) {
      return null;
    }

    if (!timingSafeEqual(expectedSignature, actualSignature)) {
      return null;
    }

    const decoded = Buffer.from(payload, "base64url").toString("utf8");
    const parsed: unknown = JSON.parse(decoded);

    if (
      !Array.isArray(parsed) ||
      !parsed.every((item): item is string => typeof item === "string")
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function normalizeFavoriteProductIds(ids: readonly string[]): string[] {
  const filtered = ids.filter((id) => id !== "");
  const deduped = [...new Set(filtered)];
  return deduped.slice(0, FAVORITES_MAX_IDS);
}

export async function readFavoriteProductIds(): Promise<string[]> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(FAVORITES_COOKIE_NAME)?.value;
  return parseFavoritesCookieValue(raw) ?? [];
}

export async function writeFavoriteProductIds(productIds: string[]): Promise<void> {
  const normalized = normalizeFavoriteProductIds(productIds);
  const cookieStore = await cookies();
  cookieStore.set(FAVORITES_COOKIE_NAME, buildFavoritesCookieValue(normalized), favoritesCookieOptions);
}

export async function toggleFavoriteProductId(
  productId: string
): Promise<{ productIds: string[]; isFavorite: boolean }> {
  const current = await readFavoriteProductIds();
  const wasFavorite = current.includes(productId);

  const next = wasFavorite
    ? current.filter((id) => id !== productId)
    : [productId, ...current];

  const normalized = normalizeFavoriteProductIds(next);
  await writeFavoriteProductIds(normalized);

  return { productIds: normalized, isFavorite: !wasFavorite };
}

export async function isFavoriteProductId(productId: string): Promise<boolean> {
  const ids = await readFavoriteProductIds();
  return ids.includes(productId);
}
