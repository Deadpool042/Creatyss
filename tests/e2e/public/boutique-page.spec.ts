import { expect, test, type Page } from "@playwright/test";

const COUNT_CASES = [
  { url: "/boutique", expectedCountLabel: "50 produits", hasPagination: true },
  { url: "/boutique?category=sacs", expectedCountLabel: "40 produits", hasPagination: true },
  { url: "/boutique?category=mini-sacs", expectedCountLabel: "11 produits", hasPagination: false },
  { url: "/boutique?category=cabas", expectedCountLabel: "4 produits", hasPagination: false },
  { url: "/boutique?category=accessoires", expectedCountLabel: "9 produits", hasPagination: false },
  { url: "/boutique?category=pochettes", expectedCountLabel: "3 produits", hasPagination: false },
  { url: "/boutique?category=trousses", expectedCountLabel: "6 produits", hasPagination: false },
] as const;

async function getVisibleHeaderCountLabel(page: Page) {
  return page.evaluate(() => {
    const visible = (element: Element | null) => {
      if (!(element instanceof HTMLElement)) return false;
      const style = window.getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return (
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        style.opacity !== "0" &&
        rect.width > 0 &&
        rect.height > 0
      );
    };

    const header = document.querySelector("main section > div > section");
    const candidates = header
      ? [...header.querySelectorAll("p")]
          .filter(
            (element) =>
              visible(element) && /\d+ produits?$/.test((element.textContent || "").trim())
          )
          .map((element) => (element.textContent || "").trim())
      : [];

    return candidates.at(-1) ?? null;
  });
}

async function getVisibleProductHrefs(page: Page) {
  return page.locator(".boutique-product-grid h3 a").evaluateAll((links) => {
    const visible = (element: Element) => {
      const node = element as HTMLElement;
      const style = window.getComputedStyle(node);
      const rect = node.getBoundingClientRect();
      return (
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        style.opacity !== "0" &&
        rect.width > 0 &&
        rect.height > 0
      );
    };

    return links
      .filter(visible)
      .map((link) => (link as HTMLAnchorElement).getAttribute("href"))
      .filter((href): href is string => href !== null);
  });
}

async function expectNoVisibleDuplicateProducts(page: Page) {
  const hrefs = await getVisibleProductHrefs(page);
  expect(hrefs.length).toBeGreaterThan(0);
  expect(new Set(hrefs).size).toBe(hrefs.length);
}

async function getLayoutSnapshot(page: Page) {
  return page.evaluate(() => {
    const isVisible = (element: Element | null) => {
      if (!(element instanceof HTMLElement)) return false;
      const style = window.getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return (
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        style.opacity !== "0" &&
        rect.width > 0 &&
        rect.height > 0
      );
    };

    const asides = [...document.querySelectorAll("aside")].filter((element) => isVisible(element));
    const marketAside =
      asides.find((element) => /Les marchés/i.test(element.textContent || "")) ?? null;
    const sidebarAside =
      asides.find((element) => /Filtres/i.test(element.textContent || "")) ?? null;
    const cards = [...document.querySelectorAll(".boutique-product-grid > *")].filter((element) =>
      isVisible(element)
    );
    const columns = new Set(
      cards.map((element) => Math.round((element as HTMLElement).getBoundingClientRect().left))
    ).size;

    return {
      sidebarVisible: isVisible(sidebarAside),
      marketVisible: isVisible(marketAside),
      gridColumns: columns,
    };
  });
}

async function getMarketStickySnapshot(page: Page) {
  return page.evaluate(() => {
    const isVisible = (element: Element | null) => {
      if (!(element instanceof HTMLElement)) return false;
      const style = window.getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return (
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        style.opacity !== "0" &&
        rect.width > 0 &&
        rect.height > 0
      );
    };

    const aside = [...document.querySelectorAll("aside")].find((element) =>
      /Les marchés/i.test(element.textContent || "")
    );
    const sticky = aside?.querySelector("div") ?? null;

    return {
      asideVisible: isVisible(aside ?? null),
      stickyTop:
        sticky instanceof HTMLElement ? Math.round(sticky.getBoundingClientRect().top) : null,
    };
  });
}

async function isFocusInsideSelector(page: Page, containerSelector: string) {
  return page.evaluate((selector) => {
    const container = document.querySelector(selector);
    const active = document.activeElement;
    return !!container && !!active && container.contains(active);
  }, containerSelector);
}

async function expectFocusInsideSelector(page: Page, containerSelector: string) {
  await expect.poll(async () => isFocusInsideSelector(page, containerSelector)).toBe(true);
}

async function expectTabFocusStaysInsideSelector(
  page: Page,
  containerSelector: string,
  tabCount: number
) {
  for (let i = 0; i < tabCount; i += 1) {
    await page.keyboard.press("Tab");
    await expectFocusInsideSelector(page, containerSelector);
  }
}

async function expectNoHorizontalOverflow(page: Page) {
  await expect
    .poll(async () =>
      page.evaluate(() => {
        const root = document.documentElement;
        return root.scrollWidth - root.clientWidth <= 1;
      })
    )
    .toBe(true);
}

async function getHorizontalOverflowPx(page: Page) {
  return page.evaluate(() => {
    const root = document.documentElement;
    return root.scrollWidth - root.clientWidth;
  });
}

async function expectNoVisibleInertInteractive(page: Page) {
  await expect
    .poll(async () =>
      page.evaluate(() => {
        const visible = (element: Element | null) => {
          if (!(element instanceof HTMLElement)) return false;
          const style = window.getComputedStyle(element);
          const rect = element.getBoundingClientRect();
          return (
            style.display !== "none" &&
            style.visibility !== "hidden" &&
            style.opacity !== "0" &&
            rect.width > 0 &&
            rect.height > 0
          );
        };

        const nodes = [...document.querySelectorAll("button, a")].filter((node) => visible(node));

        return nodes.every((node) => {
          if (node.tagName.toLowerCase() === "a") {
            return ((node as HTMLAnchorElement).getAttribute("href") || "").trim().length > 0;
          }

          const text = (node.textContent || "").trim();
          const label = (node.getAttribute("aria-label") || "").trim();
          return text.length > 0 || label.length > 0;
        });
      })
    )
    .toBe(true);
}

test.describe("boutique page smoke", () => {
  test.describe("catalogue / counts", () => {
    for (const countCase of COUNT_CASES) {
      test(`shows expected total and pagination state for ${countCase.url}`, async ({ page }) => {
        await page.goto(countCase.url);

        await expect(page.getByRole("heading", { level: 1, name: "Boutique" })).toBeVisible();
        await expect
          .poll(async () => getVisibleHeaderCountLabel(page))
          .toBe(countCase.expectedCountLabel);

        const pagination = page.getByRole("navigation", { name: "Pagination" });
        if (countCase.hasPagination) {
          await expect(pagination).toBeVisible();
        } else {
          await expect(pagination).toHaveCount(0);
        }

        await expectNoVisibleDuplicateProducts(page);
      });
    }
  });

  test("shows category tree and toggles an active category back to boutique while preserving other filters", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1441, height: 900 });
    await page.goto("/boutique?category=sacs&availability=in-stock");

    const filtersAside = page.getByRole("complementary").filter({ hasText: "Filtres" });
    await expect(filtersAside).toBeVisible();

    await expect(filtersAside.getByRole("link", { name: "Sacs", exact: true })).toBeVisible();
    await expect(
      filtersAside.getByRole("link", { name: "Sacs à main", exact: true })
    ).toBeVisible();
    await expect(
      filtersAside.getByRole("link", { name: "Sacs à bandoulière", exact: true })
    ).toBeVisible();
    await expect(filtersAside.getByRole("link", { name: "Mini sacs", exact: true })).toBeVisible();
    await expect(filtersAside.getByRole("link", { name: "Cabas", exact: true })).toBeVisible();
    await expect(filtersAside.getByRole("link", { name: "Sacs à dos", exact: true })).toBeVisible();
    await expect(
      filtersAside.getByRole("link", { name: "Accessoires", exact: true })
    ).toBeVisible();
    await expect(filtersAside.getByRole("link", { name: "Pochettes", exact: true })).toBeVisible();
    await expect(filtersAside.getByRole("link", { name: "Trousses", exact: true })).toBeVisible();
    await expect(
      filtersAside.getByRole("link", { name: "Porte-cartes", exact: true })
    ).toBeVisible();

    await filtersAside.getByRole("link", { name: "Sacs", exact: true }).click();

    await expect(page).toHaveURL(/\/boutique\?availability=in-stock$/);
    await expect(page.getByRole("region", { name: "Disponibilité" })).toBeVisible();
  });

  test("opens and closes the mobile topbar menu", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/boutique");

    const menuButton = page.getByRole("button", { name: /ouvrir le menu principal/i });
    await expect(menuButton).toBeVisible();
    await menuButton.click();

    const mobileMenu = page.getByRole("dialog");
    await expect(mobileMenu).toBeVisible();
    await expect(mobileMenu.getByRole("link", { name: "Accueil", exact: true })).toBeVisible();
    await expect(mobileMenu.getByRole("link", { name: "Boutique", exact: true })).toBeVisible();
    await expect(mobileMenu.getByRole("link", { name: "Blog", exact: true })).toBeVisible();
    await expect(mobileMenu.getByRole("link", { name: "Favoris", exact: true })).toBeVisible();
    await expect(mobileMenu.getByRole("link", { name: "Contact", exact: true })).toBeVisible();

    await mobileMenu.getByRole("link", { name: "Boutique", exact: true }).click();
    await expect(page).toHaveURL(/\/boutique$/);
    await expect(mobileMenu).toHaveCount(0);
  });

  test("does not show the mobile menu trigger on desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 900 });
    await page.goto("/boutique");

    await expect(page.getByRole("button", { name: /ouvrir le menu principal/i })).toHaveCount(0);
  });

  test("keeps keyboard focus trapped in mobile topbar menu and restores trigger focus on close", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/boutique");

    const menuTrigger = page.getByRole("button", { name: /ouvrir le menu principal/i });
    const sheetContent = page.locator('[data-slot="sheet-content"]');

    await expect(menuTrigger).toBeVisible();
    await menuTrigger.focus();
    await expect(menuTrigger).toBeFocused();

    await page.keyboard.press("Enter");
    await expect(sheetContent).toBeVisible();

    await expectFocusInsideSelector(page, '[data-slot="sheet-content"]');
    await expectTabFocusStaysInsideSelector(page, '[data-slot="sheet-content"]', 6);

    await page.keyboard.press("Escape");
    await expect(sheetContent).toBeHidden();
    await expect(menuTrigger).toBeFocused();
  });

  test("keeps keyboard focus trapped in mobile filters drawer and restores trigger focus on close", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/boutique");

    const drawerTrigger = page.getByRole("button", { name: "Filtres", exact: true }).first();
    const drawerContent = page.locator('[data-slot="drawer-content"]');

    await expect(drawerTrigger).toBeVisible();
    await drawerTrigger.focus();
    await expect(drawerTrigger).toBeFocused();

    await page.keyboard.press("Enter");
    await expect(drawerContent).toBeVisible();

    expect
      .soft(
        await isFocusInsideSelector(page, '[data-slot="drawer-content"]'),
        "Le focus devrait entrer dans le drawer après Enter"
      )
      .toBe(true);

    for (let i = 0; i < 6; i += 1) {
      await page.keyboard.press("Tab");
      expect
        .soft(
          await isFocusInsideSelector(page, '[data-slot="drawer-content"]'),
          `Le focus devrait rester dans le drawer après Tab #${i + 1}`
        )
        .toBe(true);
    }

    await page.keyboard.press("Escape");
    await expect(drawerContent).toBeHidden();
    await expect.soft(drawerTrigger).toBeFocused();
  });

  test("keeps mobile filters drawer accessible and functional across required mobile viewports", async ({
    page,
  }) => {
    for (const viewport of [
      { width: 320, height: 667 },
      { width: 375, height: 667 },
      { width: 667, height: 375 },
      { width: 768, height: 1024 },
    ]) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });

      await page.goto("/boutique");
      const baselineOverflowPx = await getHorizontalOverflowPx(page);
      const drawerTrigger = page.getByRole("button", { name: "Filtres", exact: true }).first();
      const drawerContent = page.locator('[data-slot="drawer-content"]');

      await expect(drawerTrigger).toBeVisible();
      await drawerTrigger.focus();
      await expect(drawerTrigger).toBeFocused();

      await page.keyboard.press("Enter");
      await expect(drawerContent).toBeVisible();
      await expectFocusInsideSelector(page, '[data-slot="drawer-content"]');
      await expectTabFocusStaysInsideSelector(page, '[data-slot="drawer-content"]', 6);

      await page.keyboard.press("Escape");
      await expect(drawerContent).toBeHidden();
      await expect(drawerTrigger).toBeFocused();

      await drawerTrigger.click();
      await expect(drawerContent).toBeVisible();
      await drawerContent.locator("label", { hasText: "Sacs" }).first().click();
      await page.waitForURL(/\/boutique\?.*category=sacs/);
      await expect(drawerContent).toBeHidden();

      await page.goto("/boutique");
      const enterTrigger = page.getByRole("button", { name: "Filtres", exact: true }).first();
      await enterTrigger.click();
      await expect(drawerContent).toBeVisible();
      const categoryRadio = drawerContent.locator("#boutique-filter-category-sacs");
      await categoryRadio.focus();
      await page.keyboard.press("Enter");
      await page.waitForURL(/\/boutique\?.*category=sacs/);
      await expect(drawerContent).toBeHidden();

      await page.goto("/boutique?category=sacs&availability=in-stock");
      const resetTrigger = page.getByRole("button", { name: "Filtres", exact: true }).first();
      await resetTrigger.click();
      await expect(drawerContent).toBeVisible();
      await drawerContent.getByRole("button", { name: "Réinitialiser", exact: true }).click();
      await expect(page).toHaveURL(/\/boutique(?:\?.*)?$/);
      await expect(page).not.toHaveURL(/[?&](category|availability|minPrice|maxPrice)=/);
      await expect(drawerContent).toBeHidden();

      const finalOverflowPx = await getHorizontalOverflowPx(page);
      expect(finalOverflowPx).toBeLessThanOrEqual(baselineOverflowPx);
      await expectNoVisibleInertInteractive(page);
    }
  });

  test("keeps typography and key controls usable with zoom-equivalent 200%", async ({ page }) => {
    for (const viewport of [
      { width: 320, height: 667 },
      { width: 375, height: 667 },
      { width: 667, height: 375 },
      { width: 768, height: 1024 },
      { width: 1440, height: 900 },
      { width: 1728, height: 1117 },
      { width: 2560, height: 1440 },
    ]) {
      const zoomEquivalentViewport = {
        width: Math.max(320, Math.floor(viewport.width / 2)),
        height: Math.max(320, Math.floor(viewport.height / 2)),
      };

      await page.setViewportSize(zoomEquivalentViewport);
      await page.goto("/boutique");
      const baselineOverflowPx = await getHorizontalOverflowPx(page);

      await expect(page.getByRole("heading", { level: 1, name: "Boutique" }).first()).toBeVisible();
      await expect(page.getByRole("link", { name: /boutique/i }).first()).toBeVisible();
      await expect(page.locator(".boutique-product-grid article").first()).toBeVisible();
      await expect(page.getByRole("navigation", { name: "Pagination" })).toBeVisible();

      const filtersTrigger = page.getByRole("button", { name: "Filtres", exact: true }).first();
      if (await filtersTrigger.count()) {
        await filtersTrigger.click();
        await expect(page.locator('[data-slot="drawer-content"]')).toBeVisible();
        await page.keyboard.press("Escape");
      }

      const overflowPx = await getHorizontalOverflowPx(page);
      expect(overflowPx).toBeLessThanOrEqual(baselineOverflowPx + 1);
      await expectNoVisibleInertInteractive(page);
    }
  });

  test("keeps desktop and large-tablet boutique layout stable around drawer breakpoints", async ({
    page,
  }) => {
    for (const viewport of [
      { width: 1200, height: 900, triggerVisible: true },
      { width: 1441, height: 900, triggerVisible: false },
      { width: 1728, height: 1117, triggerVisible: false },
    ]) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto("/boutique");

      const drawerTrigger = page.getByRole("button", { name: "Filtres", exact: true }).first();

      if (viewport.triggerVisible) {
        await expect(drawerTrigger).toBeVisible();
      } else {
        await expect(drawerTrigger).toHaveCount(0);
      }

      await expectNoHorizontalOverflow(page);
      await expectNoVisibleInertInteractive(page);
    }
  });

  test("keeps the expected layout around the 1440/1441 transition and on 4k", async ({ page }) => {
    for (const viewportCase of [
      { width: 1280, height: 800, expectedColumns: 4, sidebarVisible: false, marketVisible: true },
      { width: 1440, height: 900, expectedColumns: 4, sidebarVisible: false, marketVisible: true },
      { width: 1441, height: 900, expectedColumns: 5, sidebarVisible: true, marketVisible: false },
      { width: 1728, height: 1117, expectedColumns: 5, sidebarVisible: true, marketVisible: true },
      { width: 2560, height: 1440, expectedColumns: 6, sidebarVisible: true, marketVisible: true },
    ]) {
      await page.setViewportSize({ width: viewportCase.width, height: viewportCase.height });
      await page.goto("/boutique");

      const snapshot = await getLayoutSnapshot(page);

      expect(snapshot.gridColumns).toBe(viewportCase.expectedColumns);
      expect(snapshot.sidebarVisible).toBe(viewportCase.sidebarVisible);
      expect(snapshot.marketVisible).toBe(viewportCase.marketVisible);
    }
  });

  test("keeps the market aside sticky where it is expected", async ({ page }) => {
    for (const viewportCase of [
      { width: 1280, height: 800, marketVisible: true },
      { width: 1728, height: 1117, marketVisible: true },
      { width: 1441, height: 900, marketVisible: false },
    ]) {
      await page.setViewportSize({ width: viewportCase.width, height: viewportCase.height });
      await page.goto("/boutique");

      const beforeScroll = await getMarketStickySnapshot(page);

      if (!viewportCase.marketVisible) {
        expect(beforeScroll.asideVisible).toBe(false);
        continue;
      }

      expect(beforeScroll.asideVisible).toBe(true);
      expect(beforeScroll.stickyTop).not.toBeNull();

      await page.mouse.wheel(0, 700);
      await page.waitForTimeout(120);

      const afterScroll = await getMarketStickySnapshot(page);
      expect(afterScroll.asideVisible).toBe(true);
      expect(afterScroll.stickyTop).not.toBeNull();
      expect(
        Math.abs((afterScroll.stickyTop ?? 0) - (beforeScroll.stickyTop ?? 0))
      ).toBeLessThanOrEqual(1);
    }
  });
});
