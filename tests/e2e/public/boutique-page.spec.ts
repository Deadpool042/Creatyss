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

    const header =
      document.querySelector("[data-testid='boutique-mobile-hero']") ??
      document.querySelector("main section > section") ??
      document.querySelector("main section > div > section");
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
      asides.find((element) => /atelier creatyss/i.test(element.textContent || "")) ?? null;
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
      /atelier creatyss/i.test(element.textContent || "")
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

async function getLocalCategoryRailMetrics(page: Page) {
  return page.evaluate(() => {
    const rail = document.querySelector("div.snap-x.snap-mandatory.overflow-x-auto");
    if (!(rail instanceof HTMLElement)) {
      return null;
    }

    return {
      scrollWidth: rail.scrollWidth,
      clientWidth: rail.clientWidth,
      hasLocalOverflow: rail.scrollWidth - rail.clientWidth > 1,
    };
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

        await expect(page.getByRole("heading", { level: 1, name: "Boutique" }).first()).toBeVisible();
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

  test("keeps global reflow stable on required boutique urls and narrow viewports", async ({
    page,
  }) => {
    for (const viewport of [
      { width: 320, height: 667 },
      { width: 375, height: 667 },
      { width: 667, height: 375 },
      { width: 768, height: 1024 },
    ]) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });

      for (const url of ["/boutique", "/boutique?category=sacs", "/boutique?category=mini-sacs"]) {
        await page.goto(url);

        const globalOverflowPx = await getHorizontalOverflowPx(page);
        expect(
          globalOverflowPx,
          `Global overflow should stay <= 1 on ${url} at ${viewport.width}x${viewport.height}`
        ).toBeLessThanOrEqual(1);

        if (url === "/boutique" && viewport.width <= 375) {
          const rail = await getLocalCategoryRailMetrics(page);
          expect(rail).not.toBeNull();
          expect(rail?.hasLocalOverflow).toBe(true);
        }
      }
    }
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
      await expect
        .poll(async () => page.locator('[data-slot="drawer-content"]:visible').count())
        .toBe(0);

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
      { width: 1280, height: 800, expectedColumns: 3, sidebarVisible: false, marketVisible: true },
      { width: 1440, height: 900, expectedColumns: 3, sidebarVisible: false, marketVisible: true },
      { width: 1441, height: 900, expectedColumns: 4, sidebarVisible: true, marketVisible: true },
      { width: 1728, height: 1117, expectedColumns: 4, sidebarVisible: true, marketVisible: true },
      { width: 2560, height: 1440, expectedColumns: 4, sidebarVisible: true, marketVisible: true },
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
      { width: 1441, height: 900, marketVisible: true },
    ]) {
      await page.setViewportSize({ width: viewportCase.width, height: viewportCase.height });
      await page.goto("/boutique");

      const initialSnapshot = await getMarketStickySnapshot(page);

      if (!viewportCase.marketVisible) {
        expect(initialSnapshot.asideVisible).toBe(false);
        continue;
      }

      expect(initialSnapshot.asideVisible).toBe(true);
      expect(initialSnapshot.stickyTop).not.toBeNull();

      // Scroll suffisant pour dépasser le seuil sticky (top: 8rem = 128px)
      // L'aside démarre à ~320-384px du haut de page ; 300px suffit à l'activer
      await page.mouse.wheel(0, 300);
      await page.waitForTimeout(150);

      const afterScroll = await getMarketStickySnapshot(page);
      expect(afterScroll.asideVisible).toBe(true);
      expect(afterScroll.stickyTop).not.toBeNull();

      // L'élément doit être accroché près de top: 8rem = 128px (±24px de tolérance)
      const STICKY_TOP_PX = 8 * 16;
      expect(
        afterScroll.stickyTop,
        `[${viewportCase.width}x${viewportCase.height}] market-sticky should be near top:8rem after scroll`
      ).toBeGreaterThanOrEqual(STICKY_TOP_PX - 24);
      expect(
        afterScroll.stickyTop,
        `[${viewportCase.width}x${viewportCase.height}] market-sticky should be near top:8rem after scroll`
      ).toBeLessThanOrEqual(STICKY_TOP_PX + 24);
    }
  });

  test("keeps mobile toolbar controls and category rail UX correct across narrow viewports", async ({
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

      // Sort select visible on mobile
      // There may be 2 sort selects in the DOM (dual-layout portrait/landscape) — check a visible one exists
      const visibleSortCount = await page.evaluate(() => {
        return [...document.querySelectorAll('select[name="sort"]')].filter((el) => {
          const htmlEl = el as HTMLElement;
          const style = window.getComputedStyle(htmlEl);
          const rect = htmlEl.getBoundingClientRect();
          return (
            style.display !== "none" &&
            style.visibility !== "hidden" &&
            style.opacity !== "0" &&
            rect.width > 0 &&
            rect.height > 0
          );
        }).length;
      });
      expect(
        visibleSortCount,
        `At least one visible sort select expected at ${viewport.width}x${viewport.height}`
      ).toBeGreaterThan(0);

      // ViewToggle visible (grille/liste)
      const viewToggle = page.getByRole("group", { name: /changer la vue/i });
      await expect(viewToggle).toBeVisible();

      // OK button hidden on mobile (auto-submit via onChange handles it)
      const okButton = page.getByRole("button", { name: "Appliquer le tri" });
      if (viewport.width < 700) {
        await expect(okButton).toBeHidden();
      }

      // Category rail section visible at portrait mobile widths (hidden from sm and above)
      if (viewport.width < 640) {
        const categorySection = page.getByRole("region", { name: /explorer les cr/i });
        await expect(categorySection).toBeVisible();

        // "Voir tout" rendered at >= 12px (0.75rem)
        const voirTout = categorySection.getByRole("link", { name: /voir tout/i });
        await expect(voirTout).toBeVisible();
        const fontSize = await voirTout.evaluate((el) =>
          parseFloat(window.getComputedStyle(el).fontSize)
        );
        expect(
          fontSize,
          `"Voir tout" font-size should be >= 12px at ${viewport.width}x${viewport.height}`
        ).toBeGreaterThanOrEqual(12);
      }

      // No global horizontal overflow
      const globalOverflowPx = await getHorizontalOverflowPx(page);
      expect(
        globalOverflowPx,
        `Global overflow should stay <= 1 at ${viewport.width}x${viewport.height}`
      ).toBeLessThanOrEqual(1);
    }
  });

  test("keeps hero above shop layout and column order stable across desktop breakpoints", async ({
    page,
  }) => {
    async function getStructuralBoxes(p: typeof page) {
      return p.evaluate(() => {
        const getBBox = (
          selector: string
        ): { x: number; y: number; width: number; height: number } | null => {
          const el = document.querySelector(selector);
          if (!(el instanceof HTMLElement)) return null;
          const rect = el.getBoundingClientRect();
          if (rect.width === 0 && rect.height === 0) return null;
          return {
            x: Math.round(rect.x),
            y: Math.round(rect.y),
            width: Math.round(rect.width),
            height: Math.round(rect.height),
          };
        };
        return {
          hero: getBBox(".boutique-page-header-shell"),
          catalog: getBBox('[data-testid="boutique-catalog-panel"]'),
          sidebar: getBBox(".boutique-sidebar-shell"),
          aside: getBBox(".boutique-market-shell"),
        };
      });
    }

    for (const routeUrl of [
      "/boutique",
      "/boutique?category=pochettes",
      "/boutique?category=sacs",
    ]) {
      // 1728x1117 — 3 colonnes : sidebar | catalogue | aside
      await page.setViewportSize({ width: 1728, height: 1117 });
      await page.goto(routeUrl);

      const boxes1728 = await getStructuralBoxes(page);
      expect(boxes1728.hero, `hero should be visible at 1728 on ${routeUrl}`).not.toBeNull();
      expect(boxes1728.catalog, `catalog should be visible at 1728 on ${routeUrl}`).not.toBeNull();
      expect(boxes1728.sidebar, `sidebar should be visible at 1728 on ${routeUrl}`).not.toBeNull();
      expect(boxes1728.aside, `aside should be visible at 1728 on ${routeUrl}`).not.toBeNull();

      const h = boxes1728.hero!;
      const c = boxes1728.catalog!;
      const s = boxes1728.sidebar!;
      const a = boxes1728.aside!;

      expect(h.y, "hero above sidebar").toBeLessThan(s.y);
      expect(h.y, "hero above catalog").toBeLessThan(c.y);
      expect(h.y, "hero above aside").toBeLessThan(a.y);
      expect(s.x, "sidebar left of catalog").toBeLessThan(c.x);
      expect(c.x, "catalog left of aside").toBeLessThan(a.x);
      expect(c.width, "catalog wider than sidebar").toBeGreaterThan(s.width);
      expect(c.width, "catalog wider than aside").toBeGreaterThan(a.width);

      const overflow1728 = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth
      );
      expect(overflow1728, `overflow <= 1 at 1728 on ${routeUrl}`).toBeLessThanOrEqual(1);

      // 1024x768 — 2 colonnes : catalogue | aside, sidebar masquée
      await page.setViewportSize({ width: 1024, height: 768 });
      await page.goto(routeUrl);

      const boxes1024 = await getStructuralBoxes(page);
      expect(boxes1024.hero, `hero visible at 1024 on ${routeUrl}`).not.toBeNull();
      expect(boxes1024.catalog, `catalog visible at 1024 on ${routeUrl}`).not.toBeNull();
      expect(boxes1024.aside, `aside visible at 1024 on ${routeUrl}`).not.toBeNull();
      expect(boxes1024.sidebar, `sidebar hidden at 1024 on ${routeUrl}`).toBeNull();

      expect(boxes1024.hero!.y, "hero above catalog at 1024").toBeLessThan(boxes1024.catalog!.y);
      expect(boxes1024.catalog!.x, "catalog left of aside at 1024").toBeLessThan(
        boxes1024.aside!.x
      );

      const overflow1024 = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth
      );
      expect(overflow1024, `overflow <= 1 at 1024 on ${routeUrl}`).toBeLessThanOrEqual(1);

      // 667x375 — mobile landscape : un seul hero, toolbar et grille visibles
      await page.setViewportSize({ width: 667, height: 375 });
      await page.goto(routeUrl);

      const portraitHero = page.locator(".boutique-mobile-portrait");
      const landscapeHero = page.locator(".boutique-mobile-landscape");
      await expect(landscapeHero, `landscape hero visible at 667x375 on ${routeUrl}`).toBeVisible();
      await expect(portraitHero, `portrait hero hidden at 667x375 on ${routeUrl}`).toBeHidden();

      await expect(
        page.getByRole("group", { name: /changer la vue/i }),
        `toolbar visible at 667x375 on ${routeUrl}`
      ).toBeVisible();
      await expect(
        page.locator(".boutique-product-grid article").first(),
        `grid visible at 667x375 on ${routeUrl}`
      ).toBeVisible();

      const overflowLandscape = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth
      );
      expect(overflowLandscape, `overflow <= 1 at 667x375 on ${routeUrl}`).toBeLessThanOrEqual(1);
    }
  });

  test("keeps boutique mobile landscape header compact and product-first", async ({ page }) => {
    await page.setViewportSize({ width: 667, height: 375 });

    for (const url of ["/boutique", "/boutique?category=pochettes", "/boutique?category=sacs"]) {
      await page.goto(url);

      // 1. No global overflow
      const overflowPx = await getHorizontalOverflowPx(page);
      expect(overflowPx, `overflow <= 1 on ${url}`).toBeLessThanOrEqual(1);

      // 2. Landscape context bar visible
      await expect(
        page.getByTestId("boutique-landscape-hero"),
        `landscape context bar should be visible on ${url}`
      ).toBeVisible();

      // 3. Portrait hero hidden
      await expect(
        page.locator(".boutique-mobile-portrait"),
        `portrait hero should be hidden on ${url}`
      ).toBeHidden();

      // 4. Un seul h1 visible
      const visibleH1Count = await page.evaluate(
        () =>
          [...document.querySelectorAll("h1")].filter((el) => {
            const style = window.getComputedStyle(el);
            const rect = el.getBoundingClientRect();
            return (
              style.display !== "none" &&
              style.visibility !== "hidden" &&
              style.opacity !== "0" &&
              rect.width > 0 &&
              rect.height > 0
            );
          }).length
      );
      expect(visibleH1Count, `exactly 1 h1 visible on ${url}`).toBe(1);

      // 5. Hero context bar height <= 64px
      const heroHeight = await page
        .getByTestId("boutique-landscape-hero")
        .evaluate((el) => Math.round(el.getBoundingClientRect().height));
      expect(
        heroHeight,
        `landscape context bar height should be <= 64px on ${url}`
      ).toBeLessThanOrEqual(64);

      // 6. View toggle visible
      const viewToggle = page.getByRole("group", { name: /changer la vue/i });
      await expect(viewToggle, `view toggle should be visible on ${url}`).toBeVisible();

      // 7. Toolbar height <= 56px (view toggle row as proxy for toolbar row)
      const toggleHeight = await viewToggle.evaluate((el) =>
        Math.round(el.getBoundingClientRect().height)
      );
      expect(
        toggleHeight,
        `toolbar view toggle height should be <= 56px on ${url}`
      ).toBeLessThanOrEqual(56);

      // 8. Filtres button visible
      await expect(
        page.getByRole("button", { name: "Filtres", exact: true }).first(),
        `Filtres button should be visible on ${url}`
      ).toBeVisible();

      // 9. Sort select visible (at least one)
      const visibleSortCount = await page.evaluate(
        () =>
          [...document.querySelectorAll('select[name="sort"]')].filter((el) => {
            const htmlEl = el as HTMLElement;
            const style = window.getComputedStyle(htmlEl);
            const rect = htmlEl.getBoundingClientRect();
            return (
              style.display !== "none" &&
              style.visibility !== "hidden" &&
              style.opacity !== "0" &&
              rect.width > 0 &&
              rect.height > 0
            );
          }).length
      );
      expect(
        visibleSortCount,
        `at least one sort select should be visible on ${url}`
      ).toBeGreaterThan(0);

      // 10. Discovery rail not visible
      await expect(
        page.getByTestId("boutique-mobile-discovery"),
        `discovery rail should not be visible in landscape on ${url}`
      ).toBeHidden();

      // 11. Sidebar not visible
      const sidebarVisible = await page.evaluate(() => {
        const el = document.querySelector(".boutique-sidebar-shell");
        if (!(el instanceof HTMLElement)) return false;
        const style = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        return (
          style.display !== "none" &&
          style.visibility !== "hidden" &&
          rect.width > 0 &&
          rect.height > 0
        );
      });
      expect(sidebarVisible, `sidebar should not be visible on ${url}`).toBe(false);

      // 12. Market aside not visible
      const marketVisible = await page.evaluate(() => {
        const el = document.querySelector(".boutique-market-shell");
        if (!(el instanceof HTMLElement)) return false;
        const style = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        return (
          style.display !== "none" &&
          style.visibility !== "hidden" &&
          rect.width > 0 &&
          rect.height > 0
        );
      });
      expect(marketVisible, `market aside should not be visible on ${url}`).toBe(false);

      // 13. At least 2 product cards visible in viewport
      const cardsInViewport = await page.evaluate(
        () =>
          [...document.querySelectorAll(".boutique-product-grid article")].filter((el) => {
            if (!(el instanceof HTMLElement)) return false;
            const rect = el.getBoundingClientRect();
            return (
              rect.width > 0 && rect.height > 0 && rect.top < window.innerHeight && rect.bottom > 0
            );
          }).length
      );
      expect(
        cardsInViewport,
        `at least 2 product cards should be visible on ${url}`
      ).toBeGreaterThanOrEqual(2);
    }
  });

  test("keeps mobile hero ambience stable between discovery and category routes", async ({
    page,
  }) => {
    for (const viewport of [
      { width: 320, height: 667 },
      { width: 375, height: 667 },
      { width: 667, height: 375 },
      { width: 768, height: 1024 },
    ]) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });

      for (const routeCase of [
        { url: "/boutique", hasActiveCategory: false },
        { url: "/boutique?category=pochettes", hasActiveCategory: true },
        { url: "/boutique?category=sacs", hasActiveCategory: true },
      ]) {
        await page.goto(routeCase.url);

        // Hero ambiance remains visible in portrait mobile, including filtered category pages
        if (viewport.width < 640) {
          const hero = page.getByTestId("boutique-mobile-hero");
          await expect(hero).toBeVisible();
          await expect(hero.getByRole("heading", { level: 1, name: "Boutique" })).toBeVisible();

          const heroVisualCount = await hero.locator("img").count();
          expect(heroVisualCount).toBeGreaterThan(0);
        }

        // Toolbar controls remain stable
        await expect(
          page.getByRole("button", { name: "Filtres", exact: true }).first()
        ).toBeVisible();
        await expect(page.getByRole("group", { name: /changer la vue/i })).toBeVisible();

        // Discovery rail appears only in pure discovery (no active filters) on portrait mobile widths
        const discoveryRail = page.getByTestId("boutique-mobile-discovery");
        if (viewport.width < 640 && !routeCase.hasActiveCategory) {
          await expect(discoveryRail).toBeVisible();
        } else if (viewport.width < 640 && routeCase.hasActiveCategory) {
          await expect(discoveryRail).toHaveCount(0);
        } else {
          await expect(discoveryRail).toBeHidden();
        }

        // Active filters are visible when a category is active
        if (routeCase.hasActiveCategory) {
          const visibleActiveFiltersLabelCount = await page.evaluate(() => {
            return [...document.querySelectorAll("span")].filter((node) => {
              if (!(node instanceof HTMLElement)) {
                return false;
              }

              if ((node.textContent || "").trim() !== "Filtres :") {
                return false;
              }

              const style = window.getComputedStyle(node);
              const rect = node.getBoundingClientRect();

              return (
                style.display !== "none" &&
                style.visibility !== "hidden" &&
                style.opacity !== "0" &&
                rect.width > 0 &&
                rect.height > 0
              );
            }).length;
          });

          expect(visibleActiveFiltersLabelCount).toBeGreaterThan(0);
        }

        // Product grid stays visible
        await expect(page.locator(".boutique-product-grid article").first()).toBeVisible();

        // No global overflow
        const globalOverflowPx = await getHorizontalOverflowPx(page);
        expect(
          globalOverflowPx,
          `Global overflow should stay <= 1 on ${routeCase.url} at ${viewport.width}x${viewport.height}`
        ).toBeLessThanOrEqual(1);
      }
    }
  });

  test("keeps boutique layout full-width at 1440, 1728 and 2560", async ({ page }) => {
    for (const viewportCase of [
      {
        width: 1440,
        height: 900,
        expectedColumns: 3,
        sidebarVisible: false,
        minLayoutWidthRatio: 0.88,
      },
      {
        width: 1728,
        height: 1117,
        expectedColumns: 4,
        sidebarVisible: true,
        minLayoutWidthRatio: 0.88,
      },
      {
        width: 2560,
        height: 1440,
        expectedColumns: 4,
        sidebarVisible: true,
        minLayoutWidthRatio: 0.88,
      },
    ]) {
      await page.setViewportSize({ width: viewportCase.width, height: viewportCase.height });
      await page.goto("/boutique");

      const layoutBox = await page.locator(".boutique-page-layout").boundingBox();
      expect(
        layoutBox,
        `layout bounding box visible at ${viewportCase.width}x${viewportCase.height}`
      ).not.toBeNull();

      const minExpectedWidth = Math.floor(viewportCase.width * viewportCase.minLayoutWidthRatio);
      expect(
        layoutBox!.width,
        `layout width should be >= ${minExpectedWidth}px (88% of ${viewportCase.width}px viewport) at ${viewportCase.width}x${viewportCase.height}`
      ).toBeGreaterThanOrEqual(minExpectedWidth);

      // Hero visible and large
      const heroBox = await page.locator(".boutique-page-header-shell").boundingBox();
      expect(
        heroBox,
        `hero visible at ${viewportCase.width}x${viewportCase.height}`
      ).not.toBeNull();
      expect(
        heroBox!.width,
        `hero should be >= ${minExpectedWidth}px at ${viewportCase.width}x${viewportCase.height}`
      ).toBeGreaterThanOrEqual(minExpectedWidth);

      // Shop layout uses available width
      const shopBox = await page.locator(".boutique-shop-layout").boundingBox();
      expect(
        shopBox,
        `shop layout visible at ${viewportCase.width}x${viewportCase.height}`
      ).not.toBeNull();

      // Catalog panel visible
      await expect(
        page.locator('[data-testid="boutique-catalog-panel"]'),
        `catalog panel visible at ${viewportCase.width}x${viewportCase.height}`
      ).toBeVisible();

      // Market aside visible
      const asideVisible = await page.evaluate(() => {
        const el = document.querySelector(".boutique-market-shell");
        if (!(el instanceof HTMLElement)) return false;
        const style = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        return style.display !== "none" && rect.width > 0 && rect.height > 0;
      });
      expect(
        asideVisible,
        `market aside visible at ${viewportCase.width}x${viewportCase.height}`
      ).toBe(true);

      // Sidebar visibility
      const sidebarVisible = await page.evaluate(() => {
        const el = document.querySelector(".boutique-sidebar-shell");
        if (!(el instanceof HTMLElement)) return false;
        const style = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        return style.display !== "none" && rect.width > 0 && rect.height > 0;
      });
      expect(
        sidebarVisible,
        `sidebar visibility should be ${viewportCase.sidebarVisible} at ${viewportCase.width}x${viewportCase.height}`
      ).toBe(viewportCase.sidebarVisible);

      // Column count: expected columns, never 5
      const columns = await page.evaluate(() => {
        const cards = [...document.querySelectorAll(".boutique-product-grid > *")];
        return new Set(
          cards.map((el) => Math.round((el as HTMLElement).getBoundingClientRect().left))
        ).size;
      });
      expect(
        columns,
        `columns should be ${viewportCase.expectedColumns} at ${viewportCase.width}x${viewportCase.height}`
      ).toBe(viewportCase.expectedColumns);
      expect(
        columns,
        `never 5 columns at ${viewportCase.width}x${viewportCase.height}`
      ).toBeLessThanOrEqual(4);

      // No horizontal overflow
      const overflowPx = await getHorizontalOverflowPx(page);
      expect(
        overflowPx,
        `overflow should be <= 1 at ${viewportCase.width}x${viewportCase.height}`
      ).toBeLessThanOrEqual(1);
    }
  });

  test("keeps desktop 1440x900 boutique layout correct", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });

    for (const url of ["/boutique", "/boutique?category=sacs"]) {
      await page.goto(url);

      // Hero card visible
      await expect(page.getByTestId("boutique-mobile-hero")).toBeVisible();

      // Shop layout positioned below hero
      const heroBox = await page.locator(".boutique-page-header-shell").boundingBox();
      const shopBox = await page.locator(".boutique-shop-layout").boundingBox();
      expect(heroBox, `hero bounding box visible at 1440 on ${url}`).not.toBeNull();
      expect(shopBox, `shop layout bounding box visible at 1440 on ${url}`).not.toBeNull();
      expect(heroBox!.y, `hero above shop layout at 1440 on ${url}`).toBeLessThan(shopBox!.y);

      // Catalog panel visible
      await expect(
        page.locator('[data-testid="boutique-catalog-panel"]'),
        `catalog panel visible at 1440 on ${url}`
      ).toBeVisible();

      // Market aside visible (laptop+ breakpoint)
      const asideVisible = await page.evaluate(() => {
        const el = document.querySelector(".boutique-market-shell");
        if (!(el instanceof HTMLElement)) return false;
        const style = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        return style.display !== "none" && rect.width > 0 && rect.height > 0;
      });
      expect(asideVisible, `market aside visible at 1440 on ${url}`).toBe(true);

      // At least 2 product columns (target: 3)
      const columns = await page.evaluate(() => {
        const cards = [...document.querySelectorAll(".boutique-product-grid > *")];
        return new Set(
          cards.map((el) => Math.round((el as HTMLElement).getBoundingClientRect().left))
        ).size;
      });
      expect(columns, `at least 2 product columns at 1440 on ${url}`).toBeGreaterThanOrEqual(2);

      // No horizontal overflow
      await expectNoHorizontalOverflow(page);
    }
  });

  test("keeps mobile portrait 375x667 boutique layout correct", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/boutique");

    // Portrait hero visible
    await expect(
      page.getByTestId("boutique-mobile-hero"),
      "portrait hero visible at 375x667"
    ).toBeVisible();

    // Toolbar (view toggle) visible
    await expect(
      page.getByRole("group", { name: /changer la vue/i }),
      "view toggle visible at 375x667"
    ).toBeVisible();

    // Discovery rail visible when no filter active
    await expect(
      page.getByTestId("boutique-mobile-discovery"),
      "discovery rail visible at 375x667 with no active filter"
    ).toBeVisible();

    // Sidebar hidden on mobile
    const sidebarVisible = await page.evaluate(() => {
      const el = document.querySelector(".boutique-sidebar-shell");
      if (!(el instanceof HTMLElement)) return false;
      const style = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return style.display !== "none" && rect.width > 0 && rect.height > 0;
    });
    expect(sidebarVisible, "sidebar hidden at 375x667").toBe(false);

    // Market aside hidden on mobile
    const asideVisible = await page.evaluate(() => {
      const el = document.querySelector(".boutique-market-shell");
      if (!(el instanceof HTMLElement)) return false;
      const style = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return style.display !== "none" && rect.width > 0 && rect.height > 0;
    });
    expect(asideVisible, "market aside hidden at 375x667").toBe(false);

    // Product grid visible with at least 2 cards
    await expect(
      page.locator(".boutique-product-grid article").first(),
      "product grid visible at 375x667"
    ).toBeVisible();

    // Exactly 2 columns on mobile portrait
    const columns = await page.evaluate(() => {
      const cards = [...document.querySelectorAll(".boutique-product-grid > *")];
      return new Set(
        cards.map((el) => Math.round((el as HTMLElement).getBoundingClientRect().left))
      ).size;
    });
    expect(columns, "2 product columns at 375x667").toBe(2);

    // No horizontal overflow
    await expectNoHorizontalOverflow(page);
  });

  test("keeps hero image rendering stable across key viewports", async ({ page }) => {
    const heroViewports = [
      // Ultrawide extrême — hero doit être visible, pas déformé, overflow = 0
      { width: 3740, height: 673, expectLandscapeHero: false, maxHeroPx: 280 },
      // 4K / 2K large
      { width: 2560, height: 1440, expectLandscapeHero: false, maxHeroPx: 280 },
      // Desktop standard
      { width: 1440, height: 900, expectLandscapeHero: false, maxHeroPx: 280 },
      // Tablet portrait
      { width: 768, height: 1024, expectLandscapeHero: false, maxHeroPx: null },
      // Mobile portrait
      { width: 375, height: 667, expectLandscapeHero: false, maxHeroPx: null },
      // Mobile landscape
      { width: 667, height: 375, expectLandscapeHero: true, maxHeroPx: 64 },
    ] as const;

    for (const vp of heroViewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("/boutique");

      // No horizontal overflow
      const overflowPx = await getHorizontalOverflowPx(page);
      expect(
        overflowPx,
        `overflow <= 1 at ${vp.width}x${vp.height}`
      ).toBeLessThanOrEqual(1);

      if (vp.expectLandscapeHero) {
        // Mobile landscape : landscape context bar visible, portrait hero hidden
        await expect(
          page.getByTestId("boutique-landscape-hero"),
          `landscape hero visible at ${vp.width}x${vp.height}`
        ).toBeVisible();
        await expect(
          page.locator(".boutique-mobile-portrait"),
          `portrait hero hidden at ${vp.width}x${vp.height}`
        ).toBeHidden();

        if (vp.maxHeroPx !== null) {
          const heroHeight = await page
            .getByTestId("boutique-landscape-hero")
            .evaluate((el) => Math.round(el.getBoundingClientRect().height));
          expect(
            heroHeight,
            `landscape hero height <= ${vp.maxHeroPx}px at ${vp.width}x${vp.height}`
          ).toBeLessThanOrEqual(vp.maxHeroPx);
        }
      } else {
        // Portrait/tablet/desktop : hero card visible
        const heroCard = page.getByTestId("boutique-mobile-hero");
        await expect(
          heroCard,
          `hero card visible at ${vp.width}x${vp.height}`
        ).toBeVisible();

        // At least one img inside the hero
        const imgCount = await heroCard.locator("img").count();
        expect(
          imgCount,
          `hero card has at least 1 img at ${vp.width}x${vp.height}`
        ).toBeGreaterThan(0);

        if (vp.maxHeroPx !== null) {
          const heroHeight = await heroCard.evaluate((el) =>
            Math.round(el.getBoundingClientRect().height)
          );
          expect(
            heroHeight,
            `hero card height <= ${vp.maxHeroPx}px at ${vp.width}x${vp.height}`
          ).toBeLessThanOrEqual(vp.maxHeroPx);
        }

        // Shop layout visible below hero on desktop+
        if (vp.width >= 768) {
          const heroBox = await page.locator(".boutique-page-header-shell").boundingBox();
          const shopBox = await page.locator(".boutique-shop-layout").boundingBox();
          expect(heroBox, `hero shell visible at ${vp.width}x${vp.height}`).not.toBeNull();
          expect(shopBox, `shop layout visible at ${vp.width}x${vp.height}`).not.toBeNull();
          expect(
            heroBox!.y,
            `hero above shop layout at ${vp.width}x${vp.height}`
          ).toBeLessThan(shopBox!.y);
        }
      }

      // h1 heading visible
      await expect(
        page.getByRole("heading", { level: 1, name: "Boutique" }).first(),
        `h1 visible at ${vp.width}x${vp.height}`
      ).toBeVisible();
    }
  });
});
