import { expect, test, type Page } from "@playwright/test";

const PDP_VIEWPORTS = [
  { name: "mobile-portrait", width: 375, height: 667 },
  { name: "mobile-landscape", width: 667, height: 375 },
  { name: "tablet-portrait", width: 768, height: 1024 },
  { name: "tablet-landscape", width: 1024, height: 768 },
  { name: "desktop", width: 1440, height: 900 },
  { name: "wide", width: 1728, height: 1117 },
  { name: "ultra-wide", width: 2560, height: 1440 },
] as const;

const EXCLUDED_PRODUCT_PATHS = new Set(["/boutique/produit-simple-de-test"]);

function isCriticalConsoleError(message: string): boolean {
  const ignoredPatterns = [/favicon\.ico/i, /status of 400/i];
  const isRadixHydrationIdNoise =
    message.includes(
      "A tree hydrated but some attributes of the server rendered HTML didn't match"
    ) &&
    message.includes("hydration-mismatch") &&
    message.includes("radix-");

  if (isRadixHydrationIdNoise) {
    return false;
  }

  return !ignoredPatterns.some((pattern) => pattern.test(message));
}

function attachConsoleWatchers(page: Page) {
  const criticalErrors: string[] = [];

  const onConsole = (msg: { type(): string; text(): string }) => {
    if (msg.type() !== "error") {
      return;
    }

    const text = msg.text();
    if (isCriticalConsoleError(text)) {
      criticalErrors.push(text);
    }
  };

  const onPageError = (error: Error) => {
    criticalErrors.push(String(error));
  };

  page.on("console", onConsole);
  page.on("pageerror", onPageError);

  return {
    criticalErrors,
    dispose: () => {
      page.off("console", onConsole);
      page.off("pageerror", onPageError);
    },
  };
}

async function resolveMerchantProductPath(page: Page): Promise<string> {
  await page.goto("/boutique", { waitUntil: "domcontentloaded" });

  const candidatePaths = await page
    .locator('[data-testid="boutique-product-grid"] h3 a')
    .evaluateAll((anchors) => {
      const hrefs = anchors
        .map((anchor) => anchor.getAttribute("href"))
        .filter((href): href is string => href !== null);

      return [...new Set(hrefs)];
    });

  const filteredCandidates = candidatePaths.filter((path) => !EXCLUDED_PRODUCT_PATHS.has(path));
  expect(filteredCandidates.length).toBeGreaterThan(0);

  for (const candidatePath of filteredCandidates) {
    await page.goto(candidatePath, { waitUntil: "domcontentloaded" });

    const visibleH1Count = await page.evaluate(() => {
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

      return [...document.querySelectorAll("main h1")].filter((h1) => visible(h1)).length;
    });

    const hasVisiblePrice = await page
      .locator("main")
      .innerText()
      .then((text) => /\d+[,.]\d{2}\s?€|€/.test(text));

    if (visibleH1Count === 1 && hasVisiblePrice) {
      return candidatePath;
    }
  }

  throw new Error("Aucun produit marchand exploitable trouvé depuis la grille boutique.");
}

async function getVisibleH1Snapshot(page: Page) {
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

    const h1s = [...document.querySelectorAll("main h1")].filter((h1) => visible(h1));

    return {
      count: h1s.length,
      texts: h1s.map((h1) => (h1.textContent || "").trim()).filter(Boolean),
    };
  });
}

async function getOverflowSnapshot(page: Page) {
  return page.evaluate(() => {
    const root = document.documentElement;
    return {
      scrollWidth: root.scrollWidth,
      clientWidth: root.clientWidth,
      hasOverflowX: root.scrollWidth - root.clientWidth > 1,
    };
  });
}

async function getVisibleImageCount(page: Page) {
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

    const images = [...document.querySelectorAll("main img")];
    const openImageButtons = [...document.querySelectorAll("main button")].filter((button) => {
      const label = (button.getAttribute("aria-label") || "").toLowerCase();
      return label.includes("plein écran");
    });

    return {
      domImageCount: images.length,
      visibleImageCount: images.filter((img) => visible(img)).length,
      openImageButtonCount: openImageButtons.length,
    };
  });
}

async function getVisibleBackToBoutiqueLinkCount(page: Page) {
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

    const links = [...document.querySelectorAll('a[href="/boutique"], a[href^="/boutique?"]')];
    return links.filter((link) => visible(link)).length;
  });
}

async function getVisibleFooterSnapshot(page: Page) {
  return page.evaluate(() => {
    const footer = document.querySelector("footer");
    if (!(footer instanceof HTMLElement)) {
      return { hasFooter: false, isVisible: false, notMaskedByBottomNav: false };
    }

    footer.scrollIntoView({ block: "end" });
    const footerRect = footer.getBoundingClientRect();
    const footerVisible = footerRect.width > 0 && footerRect.height > 0;

    const contentRange = document.createRange();
    contentRange.selectNodeContents(footer);
    const contentRect = contentRange.getBoundingClientRect();
    const contentBottom =
      contentRect.width > 0 && contentRect.height > 0 ? contentRect.bottom : footerRect.bottom;

    const touchNav = document.querySelector('nav[aria-label="Navigation tactile"]');
    if (!(touchNav instanceof HTMLElement)) {
      return {
        hasFooter: true,
        isVisible: footerVisible,
        notMaskedByBottomNav: contentBottom <= window.innerHeight + 1,
      };
    }

    const navStyle = window.getComputedStyle(touchNav);
    const navRect = touchNav.getBoundingClientRect();
    const navIsVisible =
      navStyle.display !== "none" &&
      navStyle.visibility !== "hidden" &&
      navRect.width > 0 &&
      navRect.height > 0;

    if (!navIsVisible) {
      return {
        hasFooter: true,
        isVisible: footerVisible,
        notMaskedByBottomNav: contentBottom <= window.innerHeight + 1,
      };
    }

    return {
      hasFooter: true,
      isVisible: footerVisible,
      notMaskedByBottomNav: contentBottom <= navRect.top + 1,
    };
  });
}

async function hasVisibleCtaOrAlternative(page: Page) {
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

    const candidates = [
      ...document.querySelectorAll("main button"),
      ...document.querySelectorAll('main a[href*="contact"]'),
      ...document.querySelectorAll('main a[href*="panier"]'),
    ].filter((node) => visible(node));

    const textBlob = candidates
      .map((node) => {
        const text = (node.textContent || "").trim();
        const label = (node.getAttribute("aria-label") || "").trim();
        return `${text} ${label}`.trim();
      })
      .join(" | ")
      .toLowerCase();

    return /(ajouter|panier|contacter|contact|indisponible|rupture|sur commande)/i.test(textBlob);
  });
}

async function hasNoVisibleNamelessEnabledButton(page: Page) {
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

    const enabledVisibleButtons = [...document.querySelectorAll("button")].filter((button) => {
      if (!visible(button)) {
        return false;
      }

      const isDisabled =
        button.hasAttribute("disabled") || button.getAttribute("aria-disabled") === "true";

      return !isDisabled;
    });

    const namelessButtons = enabledVisibleButtons.filter((button) => {
      const text = (button.textContent || "").trim();
      const label = (button.getAttribute("aria-label") || "").trim();
      return text.length === 0 && label.length === 0;
    });

    return namelessButtons.length === 0;
  });
}

async function getMinVisibleFontSizeForText(page: Page, textNeedle: string) {
  return page.evaluate((needle) => {
    const normalize = (value: string) =>
      value
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .toLowerCase()
        .trim();

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

    const normalizedNeedle = normalize(needle);
    const fontSizes: number[] = [];

    for (const element of document.querySelectorAll("main *")) {
      if (!visible(element)) {
        continue;
      }

      const text = normalize((element.textContent || "").replace(/\s+/g, " "));
      if (!text.includes(normalizedNeedle)) {
        continue;
      }

      const fontSize = Number.parseFloat(window.getComputedStyle(element).fontSize || "0");
      if (Number.isFinite(fontSize) && fontSize > 0) {
        fontSizes.push(fontSize);
      }
    }

    if (fontSizes.length === 0) {
      return null;
    }

    return Math.min(...fontSizes);
  }, textNeedle);
}

test.describe("public product page smoke", () => {
  test("covers pdp responsive baseline and shell behavior", async ({ page }) => {
    const productPath = await resolveMerchantProductPath(page);
    const consoleWatch = attachConsoleWatchers(page);

    for (const viewport of PDP_VIEWPORTS) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto(productPath, { waitUntil: "domcontentloaded" });

      const h1Snapshot = await getVisibleH1Snapshot(page);
      expect(h1Snapshot.count).toBe(1);
      expect(h1Snapshot.texts[0]?.length ?? 0).toBeGreaterThan(0);

      const overflowSnapshot = await getOverflowSnapshot(page);
      expect(overflowSnapshot.hasOverflowX).toBe(false);

      await expect(page.locator("main")).toContainText(/\d+[,.]\d{2}\s?€|€/);
      await expect(page.locator("main")).toContainText(
        /(disponible|indisponible|sur commande|rupture)/i
      );

      const imageSnapshot = await getVisibleImageCount(page);
      if (imageSnapshot.domImageCount > 0) {
        expect(imageSnapshot.visibleImageCount > 0 || imageSnapshot.openImageButtonCount > 0).toBe(
          true
        );
      }

      expect(await getVisibleBackToBoutiqueLinkCount(page)).toBeGreaterThan(0);

      const favoriteButtons = page.locator('button[aria-label*="favori" i]:visible');
      await expect(favoriteButtons).toHaveCount(1);
      const favoriteButton = favoriteButtons.first();
      await expect(favoriteButton).toBeEnabled();
      await favoriteButton.click({ trial: true });

      if (viewport.name === "mobile-portrait" || viewport.name === "mobile-landscape") {
        const originFontSize = await getMinVisibleFontSizeForText(
          page,
          "Fait main à Saint-Etienne"
        );
        expect(originFontSize).not.toBeNull();
        expect(originFontSize ?? 0).toBeGreaterThanOrEqual(12);

        if (viewport.name === "mobile-portrait") {
          const legacyBadgeFontSize = await getMinVisibleFontSizeForText(
            page,
            "Pièces uniques ou petites séries"
          );
          const badgeFontSize =
            legacyBadgeFontSize ??
            (await getMinVisibleFontSizeForText(page, "Chaque sac est unique"));
          expect(badgeFontSize).not.toBeNull();
          expect(badgeFontSize ?? 0).toBeGreaterThanOrEqual(12);
        }
      }

      expect(await hasVisibleCtaOrAlternative(page)).toBe(true);

      const footerSnapshot = await getVisibleFooterSnapshot(page);
      expect(footerSnapshot.hasFooter).toBe(true);
      expect(footerSnapshot.isVisible).toBe(true);
      expect(footerSnapshot.notMaskedByBottomNav).toBe(true);

      expect(await hasNoVisibleNamelessEnabledButton(page)).toBe(true);
    }

    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(productPath, { waitUntil: "domcontentloaded" });

    const mobileMenuTrigger = page.getByRole("button", { name: /ouvrir le menu principal/i });
    await expect(mobileMenuTrigger).toBeVisible();
    await mobileMenuTrigger.focus();
    await page.keyboard.press("Enter");

    const mobileMenuDialog = page.getByRole("dialog");
    await expect(mobileMenuDialog).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(mobileMenuDialog).toHaveCount(0);

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(productPath, { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("button", { name: /ouvrir le menu principal/i })).toHaveCount(0);

    consoleWatch.dispose();
    expect(consoleWatch.criticalErrors).toEqual([]);
  });
});
