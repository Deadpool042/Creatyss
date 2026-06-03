import { devices, expect, test } from "@playwright/test";

import { loginAsSeedAdmin } from "./admin-auth";

test("iphone 11 landscape laisse le document porter le scroll admin", async ({ browser }) => {
  const context = await browser.newContext({
    ...devices["iPhone 11 landscape"],
  });
  const page = await context.newPage();

  await loginAsSeedAdmin(page);
  await page.goto("/admin/catalog/products/produit-simple-de-test/edit", {
    waitUntil: "networkidle",
  });

  await expect(page.getByRole("heading", { name: "Identité produit" })).toBeVisible();

  const metrics = await page.evaluate(() => {
    const doc = document.scrollingElement ?? document.documentElement;
    const pageShellScroller = document.querySelector('[class*="overflow-y-auto"]');

    return {
      documentScrollHeight: doc.scrollHeight,
      documentClientHeight: doc.clientHeight,
      pageShellScrollerTag: pageShellScroller?.tagName ?? null,
      pageShellScrollerScrollHeight:
        pageShellScroller instanceof HTMLElement ? pageShellScroller.scrollHeight : null,
      pageShellScrollerClientHeight:
        pageShellScroller instanceof HTMLElement ? pageShellScroller.clientHeight : null,
    };
  });

  expect(metrics.documentScrollHeight).toBeGreaterThan(metrics.documentClientHeight);

  await page.evaluate(() => window.scrollTo({ top: 600, behavior: "instant" }));

  const afterScrollTop = await page.evaluate(() => window.scrollY);
  expect(afterScrollTop).toBeGreaterThan(0);

  await context.close();
});
