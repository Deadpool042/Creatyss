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
  return page.locator('[data-testid="boutique-product-grid"] h3 a').evaluateAll((links) => {
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

async function getFilterTriggerSnapshot(page: Page) {
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

    return {
      mobileVisible: isVisible(document.querySelector('[data-testid="boutique-filter-trigger-mobile"]')),
      tabletVisible: isVisible(document.querySelector('[data-testid="boutique-filter-trigger-tablet"]')),
      shortcutVisible: isVisible(document.querySelector('[data-testid="boutique-filter-shortcut"]')),
    };
  });
}

async function getMarketPlacementSnapshot(page: Page) {
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

    return {
      inlineVisible: isVisible(document.querySelector(".boutique-market-inline-shell")),
      columnVisible: isVisible(
        document.querySelector('[data-testid="boutique-market-aside"]')
      ),
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

    const aside = [...document.querySelectorAll("aside")].find(
      (element) => /atelier creatyss/i.test(element.textContent || "") && isVisible(element)
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

async function getElementBox(
  page: Page,
  selector: string
): Promise<{ width: number; height: number } | null> {
  return page.evaluate((inputSelector) => {
    const element = document.querySelector(inputSelector);
    if (!(element instanceof HTMLElement)) {
      return null;
    }

    const style = window.getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    if (
      style.display === "none" ||
      style.visibility === "hidden" ||
      style.opacity === "0" ||
      (rect.width === 0 && rect.height === 0)
    ) {
      return null;
    }

    return {
      width: rect.width,
      height: rect.height,
    };
  }, selector);
}

async function getLocalCategoryRailMetrics(page: Page) {
  return page.evaluate(() => {
    const rail = document.querySelector('[data-testid="boutique-mobile-category-rail"]');
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

        await expect(
          page.getByRole("heading", { level: 1, name: "Boutique" }).first()
        ).toBeVisible();
        await expect
          .poll(async () => getVisibleHeaderCountLabel(page))
          .toBe(countCase.expectedCountLabel);
        await expect(page.locator('[data-testid="boutique-listing-actions-count"]')).toHaveText(
          countCase.expectedCountLabel.replace("produits", "créations").replace("produit", "création")
        );

        const pagination = page.getByRole("navigation", { name: "Pagination" });
        if (countCase.hasPagination) {
          await expect(pagination).toBeVisible();
          await expect(
            pagination.getByRole("link", { name: "Voir plus de créations", exact: true })
          ).toBeVisible();
          await expect(pagination.getByText(/Page \d+ sur \d+/)).toBeVisible();
        } else {
          await expect(pagination).toHaveCount(0);
        }

        const reassuranceBand = page.getByRole("region", { name: "Engagements Creatyss" });
        await expect(reassuranceBand).toBeVisible();
        await expect(reassuranceBand.getByText("Fait main à Saint-Étienne")).toBeVisible();
        await expect(reassuranceBand.getByText("Matières responsables et sans cuir")).toBeVisible();
        await expect(reassuranceBand.getByText("Pièces uniques en petites séries")).toBeVisible();
        await expect(reassuranceBand.getByText("Sur-mesure sur demande")).toBeVisible();

        await expectNoVisibleDuplicateProducts(page);
      });
    }
  });

  test("keeps compact sidebar shortcuts and toggles an active category while preserving other filters", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1728, height: 1117 });
    await page.goto("/boutique?category=sacs&availability=in-stock");

    const filtersAside = page.getByRole("complementary").filter({ hasText: "Filtres" });
    await expect(filtersAside).toBeVisible();

    await expect(filtersAside.getByRole("link", { name: "Sacs", exact: true })).toBeVisible();
    await expect(
      filtersAside.getByRole("link", { name: "Tous les produits", exact: true })
    ).toBeVisible();
    await expect(
      filtersAside.getByRole("link", { name: "Sacs à main", exact: true })
    ).toHaveCount(0);
    await expect(
      filtersAside.getByRole("link", { name: "Sacs à bandoulière", exact: true })
    ).toHaveCount(0);
    await expect(filtersAside.getByText("Couleurs", { exact: true })).toHaveCount(0);
    await expect(filtersAside.getByText("Matières", { exact: true })).toHaveCount(0);
    await expect(
      filtersAside.getByRole("link", { name: "Porte-cartes", exact: true })
    ).toHaveCount(0);

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

  test("keeps the boutique desktop header compact without the reassurance bar", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem("theme", "light");
    });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/boutique");

    await expect(page.getByRole("navigation", { name: "Navigation principale" })).toBeVisible();
    const visibleLogoCount = await page
      .locator("header")
      .getByRole("link", { name: /creatyss/i })
      .evaluateAll((links) => {
        return links.filter((link) => {
          const element = link as HTMLElement;
          const style = window.getComputedStyle(element);
          const rect = element.getBoundingClientRect();
          return style.display !== "none" && rect.width > 0 && rect.height > 0;
        }).length;
      });
    expect(visibleLogoCount, "visible boutique logo links").toBeGreaterThan(0);
    await expect(page.getByTestId("public-reassurance-bar")).toHaveCount(0);

    const headerHeight = await page.locator("header").first().evaluate((element) => {
      return Math.round(element.getBoundingClientRect().height);
    });
    expect(headerHeight, "boutique desktop header height").toBeLessThanOrEqual(72);

    const heroBackgroundImage = await page.getByTestId("boutique-mobile-hero").evaluate((element) =>
      window.getComputedStyle(element, "::before").backgroundImage
    );
    expect(heroBackgroundImage).toContain("bg-light-hero");
  });

  test("keeps keyboard focus trapped in mobile topbar menu and restores trigger focus on close", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/boutique");

    const menuTrigger = page.getByRole("button", { name: /ouvrir le menu principal/i });
    const drawerContent = page.locator('[data-slot="drawer-content"]');

    await expect(menuTrigger).toBeVisible();
    await menuTrigger.focus();
    await expect(menuTrigger).toBeFocused();

    await page.keyboard.press("Enter");
    await expect(drawerContent).toBeVisible();

    await expectFocusInsideSelector(page, '[data-slot="drawer-content"]');
    await expectTabFocusStaysInsideSelector(page, '[data-slot="drawer-content"]', 6);

    await page.keyboard.press("Escape");
    await expect(drawerContent).toBeHidden();
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
      await expect(drawerContent).toBeVisible();
      await expect(page).toHaveURL(/\/boutique$/);
      await drawerContent.getByRole("button", { name: /Voir .*résultat/i }).click();
      await page.waitForURL(/\/boutique\?.*category=sacs/);
      await expect(drawerContent).toBeHidden();

      await page.goto("/boutique");
      const enterTrigger = page.getByRole("button", { name: "Filtres", exact: true }).first();
      await enterTrigger.click();
      await expect(drawerContent).toBeVisible();
      const categoryRadio = drawerContent.locator("#boutique-filter-category-sacs");
      await categoryRadio.focus();
      await page.keyboard.press("Enter");
      await expect(drawerContent).toBeVisible();
      await expect(page).toHaveURL(/\/boutique$/);
      await drawerContent.getByRole("button", { name: /Voir .*résultat/i }).click();
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
      await expect(page.locator('[data-testid="boutique-product-grid"] article').first()).toBeVisible();
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

  test("keeps the responsive trigger and aside/sidebar matrix aligned with breakpoints", async ({
    page,
  }) => {
    for (const viewport of [
      {
        width: 375,
        height: 667,
        mobileTriggerVisible: true,
        tabletTriggerVisible: false,
        shortcutVisible: false,
        sidebarVisible: false,
        marketVisible: false,
        marketInlineVisible: false,
        marketColumnVisible: false,
      },
      {
        width: 768,
        height: 854,
        mobileTriggerVisible: false,
        tabletTriggerVisible: true,
        shortcutVisible: true,
        sidebarVisible: false,
        marketVisible: true,
        marketInlineVisible: false,
        marketColumnVisible: true,
      },
      {
        width: 1024,
        height: 899,
        mobileTriggerVisible: false,
        tabletTriggerVisible: true,
        shortcutVisible: true,
        sidebarVisible: false,
        marketVisible: true,
        marketInlineVisible: false,
        marketColumnVisible: true,
      },
      {
        width: 1199,
        height: 854,
        mobileTriggerVisible: false,
        tabletTriggerVisible: true,
        shortcutVisible: true,
        sidebarVisible: false,
        marketVisible: true,
        marketInlineVisible: false,
        marketColumnVisible: true,
      },
      {
        width: 1200,
        height: 854,
        mobileTriggerVisible: false,
        tabletTriggerVisible: true,
        shortcutVisible: true,
        sidebarVisible: false,
        marketVisible: true,
        marketInlineVisible: false,
        marketColumnVisible: true,
      },
      {
        width: 1440,
        height: 900,
        mobileTriggerVisible: false,
        tabletTriggerVisible: false,
        shortcutVisible: false,
        sidebarVisible: true,
        marketVisible: true,
        marketInlineVisible: false,
        marketColumnVisible: true,
      },
      {
        width: 1536,
        height: 960,
        mobileTriggerVisible: false,
        tabletTriggerVisible: false,
        shortcutVisible: false,
        sidebarVisible: true,
        marketVisible: true,
        marketInlineVisible: false,
        marketColumnVisible: true,
      },
      {
        width: 1728,
        height: 1117,
        mobileTriggerVisible: false,
        tabletTriggerVisible: false,
        shortcutVisible: false,
        sidebarVisible: true,
        marketVisible: true,
        marketInlineVisible: false,
        marketColumnVisible: true,
      },
    ]) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto("/boutique");

      const triggerSnapshot = await getFilterTriggerSnapshot(page);
      const layoutSnapshot = await getLayoutSnapshot(page);
      const marketPlacementSnapshot = await getMarketPlacementSnapshot(page);

      expect(triggerSnapshot.mobileVisible).toBe(viewport.mobileTriggerVisible);
      expect(triggerSnapshot.tabletVisible).toBe(viewport.tabletTriggerVisible);
      expect(triggerSnapshot.shortcutVisible).toBe(viewport.shortcutVisible);
      expect(layoutSnapshot.sidebarVisible).toBe(viewport.sidebarVisible);
      expect(layoutSnapshot.marketVisible).toBe(viewport.marketVisible);
      expect(marketPlacementSnapshot.inlineVisible).toBe(viewport.marketInlineVisible);
      expect(marketPlacementSnapshot.columnVisible).toBe(viewport.marketColumnVisible);

      if (viewport.shortcutVisible) {
        const shortcuts = page.getByTestId("boutique-filter-shortcuts");
        await expect(shortcuts.getByRole("button", { name: "Catégories", exact: true })).toBeVisible();
        await expect(shortcuts.getByRole("button", { name: "Disponibilité", exact: true })).toBeVisible();
        await expect(shortcuts.getByRole("button", { name: "Prix", exact: true })).toBeVisible();
      }

      if (viewport.marketVisible) {
        const marketAside = page.getByTestId("boutique-market-aside");
        await expect(marketAside.getByText("Prochains marchés", { exact: true })).toBeVisible();
        await expect(
          marketAside.getByRole("link", { name: "Voir les marchés", exact: true })
        ).toHaveAttribute("href", "/les-marches");
        await expect(marketAside.getByText("Voir la boutique", { exact: true })).toHaveCount(0);
      }

      if (viewport.sidebarVisible) {
        const sidebar = page.getByTestId("boutique-sidebar-shell");
        await expect(sidebar.getByText("Filtres", { exact: true })).toBeVisible();
        await expect(sidebar.getByText("Réinitialiser", { exact: true })).toBeVisible();
        await expect(sidebar.getByText("Couleurs", { exact: true })).toHaveCount(0);
        await expect(sidebar.getByText("Fait main", { exact: true })).toHaveCount(0);
        await expect(sidebar.getByText("Matières", { exact: true })).toHaveCount(0);
      }

      await expectNoHorizontalOverflow(page);
      await expectNoVisibleInertInteractive(page);
    }

    await page.setViewportSize({ width: 1200, height: 854 });
    await page.goto("/boutique");
    await page.getByRole("button", { name: "Filtres", exact: true }).first().click();
    const drawerContent = page.locator('[data-slot="drawer-content"]');
    await expect(drawerContent).toBeVisible();
    await expect(drawerContent.getByText("Couleurs", { exact: true })).toBeVisible();
    await expect(drawerContent.getByText("Matières", { exact: true })).toBeVisible();
    await page.keyboard.press("Escape");
  });

  test("keeps the expected layout from 640px to ultrawide", async ({ page }) => {
    for (const viewportCase of [
      { width: 640, height: 854, expectedColumns: 3, sidebarVisible: false, marketVisible: false },
      { width: 768, height: 854, expectedColumns: 3, sidebarVisible: false, marketVisible: true },
      { width: 1024, height: 899, expectedColumns: 4, sidebarVisible: false, marketVisible: true },
      { width: 1199, height: 854, expectedColumns: 4, sidebarVisible: false, marketVisible: true },
      { width: 1200, height: 854, expectedColumns: 4, sidebarVisible: false, marketVisible: true },
      { width: 1366, height: 900, expectedColumns: 4, sidebarVisible: false, marketVisible: true },
      { width: 1440, height: 900, expectedColumns: 4, sidebarVisible: true, marketVisible: true },
      { width: 1536, height: 960, expectedColumns: 4, sidebarVisible: true, marketVisible: true },
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
      { width: 1024, height: 899, marketVisible: true },
      { width: 1199, height: 854, marketVisible: true },
      { width: 1200, height: 854, marketVisible: true },
      { width: 1440, height: 900, marketVisible: true },
      { width: 1728, height: 1117, marketVisible: true },
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

      // Sort select visible on mobile — check a visible one exists
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
          `"Voir tout" font-size should be >= 11px at ${viewport.width}x${viewport.height}`
        ).toBeGreaterThanOrEqual(11);
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
          hero: getBBox('[data-testid="boutique-page-header"]'),
          catalog: getBBox('[data-testid="boutique-catalog-panel"]'),
          sidebar: getBBox('[data-testid="boutique-sidebar-shell"]'),
          aside: getBBox('[data-testid="boutique-market-aside"]'),
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

      // 1200x854 — 2 colonnes : catalogue | aside, sidebar masquée
      await page.setViewportSize({ width: 1200, height: 854 });
      await page.goto(routeUrl);

      const boxes1200 = await getStructuralBoxes(page);
      expect(boxes1200.hero, `hero visible at 1200 on ${routeUrl}`).not.toBeNull();
      expect(boxes1200.catalog, `catalog visible at 1200 on ${routeUrl}`).not.toBeNull();
      expect(boxes1200.aside, `aside visible at 1200 on ${routeUrl}`).not.toBeNull();
      expect(boxes1200.sidebar, `sidebar hidden at 1200 on ${routeUrl}`).toBeNull();

      expect(boxes1200.hero!.y, "hero above catalog at 1200").toBeLessThan(boxes1200.catalog!.y);
      expect(boxes1200.catalog!.x, "catalog left of aside at 1200").toBeLessThan(
        boxes1200.aside!.x
      );

      const overflow1200 = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth
      );
      expect(overflow1200, `overflow <= 1 at 1200 on ${routeUrl}`).toBeLessThanOrEqual(1);
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
        } else if (viewport.width >= 768) {
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
        await expect(page.locator('[data-testid="boutique-product-grid"] article').first()).toBeVisible();

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
        expectedColumns: 4,
        sidebarVisible: true,
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
        minLayoutWidthRatio: 0.66,
      },
    ]) {
      await page.setViewportSize({ width: viewportCase.width, height: viewportCase.height });
      await page.goto("/boutique");

      const minExpectedWidth = Math.floor(viewportCase.width * viewportCase.minLayoutWidthRatio);
      const shopBox = await getElementBox(page, '[data-testid="boutique-shop-layout"]');
      expect(
        shopBox,
        `shop layout visible at ${viewportCase.width}x${viewportCase.height}`
      ).not.toBeNull();
      expect(
        shopBox!.width,
        `shop layout width should be >= ${minExpectedWidth}px at ${viewportCase.width}x${viewportCase.height}`
      ).toBeGreaterThanOrEqual(minExpectedWidth);

      // Hero visible and large
      const heroBox = await getElementBox(page, '[data-testid="boutique-page-header"]');
      expect(
        heroBox,
        `hero visible at ${viewportCase.width}x${viewportCase.height}`
      ).not.toBeNull();
      expect(
        heroBox!.width,
        `hero should be >= ${minExpectedWidth}px at ${viewportCase.width}x${viewportCase.height}`
      ).toBeGreaterThanOrEqual(minExpectedWidth);

      // Catalog panel visible
      await expect(
        page.locator('[data-testid="boutique-catalog-panel"]'),
        `catalog panel visible at ${viewportCase.width}x${viewportCase.height}`
      ).toBeVisible();

      // Market aside visible
      const asideVisible = await page.evaluate(() => {
        const el = document.querySelector('[data-testid="boutique-market-aside"]');
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
        const el = document.querySelector('[data-testid="boutique-sidebar-shell"]');
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
      const heroBox = await page.locator('[data-testid="boutique-page-header"]').boundingBox();
      const shopBox = await page.getByTestId("boutique-shop-layout").boundingBox();
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
        const el = document.querySelector('[data-testid="boutique-market-aside"]');
        if (!(el instanceof HTMLElement)) return false;
        const style = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        return style.display !== "none" && rect.width > 0 && rect.height > 0;
      });
      expect(asideVisible, `market aside visible at 1440 on ${url}`).toBe(true);

      const sidebarVisible = await page.evaluate(() => {
        const el = document.querySelector('[data-testid="boutique-sidebar-shell"]');
        if (!(el instanceof HTMLElement)) return false;
        const style = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        return style.display !== "none" && rect.width > 0 && rect.height > 0;
      });
      expect(sidebarVisible, `sidebar hidden at 1440 on ${url}`).toBe(false);

      await expect(
        page.getByRole("button", { name: "Filtres", exact: true }).first(),
        `drawer trigger visible at 1440 on ${url}`
      ).toBeVisible();

      // Exactly 4 product columns at 1440
      const columns = await page.evaluate(() => {
        const cards = [...document.querySelectorAll(".boutique-product-grid > *")];
        return new Set(
          cards.map((el) => Math.round((el as HTMLElement).getBoundingClientRect().left))
        ).size;
      });
      expect(columns, `4 product columns at 1440 on ${url}`).toBe(4);

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
      const el = document.querySelector('[data-testid="boutique-sidebar-shell"]');
      if (!(el instanceof HTMLElement)) return false;
      const style = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return style.display !== "none" && rect.width > 0 && rect.height > 0;
    });
    expect(sidebarVisible, "sidebar hidden at 375x667").toBe(false);

    // Market aside hidden on mobile
    const asideVisible = await page.evaluate(() => {
      const el = document.querySelector('[data-testid="boutique-market-aside"]');
      if (!(el instanceof HTMLElement)) return false;
      const style = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return style.display !== "none" && rect.width > 0 && rect.height > 0;
    });
    expect(asideVisible, "market aside hidden at 375x667").toBe(false);

    // Product grid visible with at least 2 cards
    await expect(
      page.locator('[data-testid="boutique-product-grid"] article').first(),
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
      { width: 3740, height: 673, maxHeroPx: 280 },
      // 4K / 2K large
      { width: 2560, height: 1440, maxHeroPx: 280 },
      // Desktop standard
      { width: 1440, height: 900, maxHeroPx: 280 },
      // Tablet portrait
      { width: 768, height: 1024, maxHeroPx: null },
      // Mobile portrait
      { width: 375, height: 667, maxHeroPx: null },
    ] as const;

    for (const vp of heroViewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("/boutique");

      // No horizontal overflow
      const overflowPx = await getHorizontalOverflowPx(page);
      expect(overflowPx, `overflow <= 1 at ${vp.width}x${vp.height}`).toBeLessThanOrEqual(1);

      // Hero card visible
      const heroCard = page.getByTestId("boutique-mobile-hero");
      await expect(heroCard, `hero card visible at ${vp.width}x${vp.height}`).toBeVisible();

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
        const heroBox = await page.locator('[data-testid="boutique-page-header"]').boundingBox();
        const shopBox = await page.getByTestId("boutique-shop-layout").boundingBox();
        expect(heroBox, `hero shell visible at ${vp.width}x${vp.height}`).not.toBeNull();
        expect(shopBox, `shop layout visible at ${vp.width}x${vp.height}`).not.toBeNull();
        expect(heroBox!.y, `hero above shop layout at ${vp.width}x${vp.height}`).toBeLessThan(
          shopBox!.y
        );
      }

      // h1 heading visible
      await expect(
        page.getByRole("heading", { level: 1, name: "Boutique" }).first(),
        `h1 visible at ${vp.width}x${vp.height}`
      ).toBeVisible();
    }
  });

  test("footer — structure et accessibilité", async ({ page }) => {
    await page.goto("/boutique");

    const footer = page.getByRole("contentinfo");
    await expect(footer).toBeVisible();

    // Texte marque visible (exact pour éviter la collision avec le copyright)
    await expect(footer.getByText("Creatyss", { exact: true })).toBeVisible();

    // Lien /boutique présent
    await expect(footer.getByRole("link", { name: "Toute la boutique" })).toBeVisible();

    // Lien /blog présent
    await expect(footer.getByRole("link", { name: "Blog" })).toBeVisible();

    // Lien /favoris présent
    await expect(footer.getByRole("link", { name: "Favoris" })).toBeVisible();

    // Pas de champ newsletter actif
    await expect(footer.getByRole("textbox")).toHaveCount(0);
    await expect(footer.getByRole("button", { name: /newsletter|s'abonner|abonnez/i })).toHaveCount(0);

    // Copyright présent
    await expect(footer.getByText(/Tous droits réservés/)).toBeVisible();
  });
});

test.describe("orientation guard", () => {
  test("affiche le guard en mobile landscape", async ({ page }) => {
    await page.setViewportSize({ width: 667, height: 375 });
    await page.goto("/boutique");
    await expect(page.getByText("Mode portrait recommandé")).toBeVisible();
    await expect(page.getByText("Tournez votre téléphone")).toBeVisible();
  });

  test("masque le guard en mobile portrait", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/boutique");
    await expect(page.getByText("Mode portrait recommandé")).toBeHidden();
  });

  test("masque le guard sur desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/boutique");
    await expect(page.getByText("Mode portrait recommandé")).toBeHidden();
  });
});
