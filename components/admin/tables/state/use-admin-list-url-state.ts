"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type AdminListUrlUpdates = Record<string, string | null>;

export function useAdminListUrlState() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pushParams = useCallback(
    (updates: AdminListUrlUpdates) => {
      const params = new URLSearchParams(searchParams.toString());

      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }

      if (!("page" in updates)) {
        params.delete("page");
      }

      const query = params.toString();
      router.push(query ? `${pathname}?${query}` : pathname);
    },
    [pathname, router, searchParams]
  );

  const resetUrl = useCallback(() => {
    router.push(pathname);
  }, [pathname, router]);

  return { pushParams, resetUrl };
}
