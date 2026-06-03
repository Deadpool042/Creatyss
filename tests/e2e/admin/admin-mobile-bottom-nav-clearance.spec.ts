import { devices, expect, test } from "@playwright/test";

import { loginAsSeedAdmin } from "./admin-auth";

test("iphone 11 portrait garde une marge visible au-dessus de la bottom nav en fin de scroll", async ({
  browser,
}) => {
  const context = await browser.newContext({
    ...devices["iPhone 11"],
  });
  const page = await context.newPage();

  await loginAsSeedAdmin(page);
  await page.goto("/admin/catalog/overview", { waitUntil: "networkidle" });

  await expect(page.getByRole("navigation", { name: "Navigation mobile admin" })).toBeVisible();

  await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "instant" }));

  const metrics = await page.evaluate(() => {
    const nav = document.querySelector('nav[aria-label="Navigation mobile admin"]');
    const link = document.querySelector('a[href="/admin/media"]');
    const target = link?.querySelector('[data-slot="card"]') ?? link?.firstElementChild ?? link ?? null;

    const navRect = nav instanceof HTMLElement ? nav.getBoundingClientRect() : null;
    const targetRect = target instanceof HTMLElement ? target.getBoundingClientRect() : null;

    return {
      navTop: navRect?.top ?? null,
      targetBottom: targetRect?.bottom ?? null,
      targetVisibleAboveNav:
        navRect && targetRect ? targetRect.bottom <= navRect.top - 8 : false,
      scrollY: window.scrollY,
    };
  });

  expect(metrics.scrollY).toBeGreaterThan(0);
  expect(metrics.targetVisibleAboveNav).toBeTruthy();

  await context.close();
});

test("iphone 11 portrait garde une marge visible au-dessus de la bottom nav sur le dashboard admin", async ({
  browser,
}) => {
  const context = await browser.newContext({
    ...devices["iPhone 11"],
  });
  const page = await context.newPage();

  await loginAsSeedAdmin(page);
  await page.goto("/admin", { waitUntil: "networkidle" });

  await expect(page.getByRole("navigation", { name: "Navigation mobile admin" })).toBeVisible();

  await page.evaluate(() =>
    window.scrollTo({ top: document.body.scrollHeight, behavior: "instant" })
  );

  const metrics = await page.evaluate(() => {
    const nav = document.querySelector('nav[aria-label="Navigation mobile admin"]');
    const link = document.querySelector('a[href="/admin/blog"]');
    const card = link?.querySelector('[data-slot="card"]') ?? link?.firstElementChild ?? link ?? null;

    const navRect = nav instanceof HTMLElement ? nav.getBoundingClientRect() : null;
    const linkRect = link instanceof HTMLElement ? link.getBoundingClientRect() : null;
    const cardRect = card instanceof HTMLElement ? card.getBoundingClientRect() : null;

    return {
      navTop: navRect?.top ?? null,
      linkBottom: linkRect?.bottom ?? null,
      cardBottom: cardRect?.bottom ?? null,
      linkVisibleAboveNav: navRect && linkRect ? linkRect.bottom <= navRect.top - 8 : false,
      cardVisibleAboveNav: navRect && cardRect ? cardRect.bottom <= navRect.top - 8 : false,
      scrollY: window.scrollY,
    };
  });

  expect(metrics.scrollY).toBeGreaterThan(0);
  expect(metrics.linkVisibleAboveNav).toBeTruthy();
  expect(metrics.cardVisibleAboveNav).toBeTruthy();

  await context.close();
});
