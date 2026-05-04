import { expect, test, type Page } from "@playwright/test";

const PDP_VIEWPORTS = [
  { name: "mobile-portrait", width: 375, height: 667 },
  { name: "mobile-landscape", width: 667, height: 375 },
  { name: "tablet-portrait", width: 768, height: 1024 },
  { name: "desktop", width: 1440, height: 900 },
  { name: "wide", width: 1728, height: 1117 },
] as const;

const EXCLUDED_PRODUCT_PATHS = new Set(["/boutique/produit-simple-de-test"]);

function isCriticalConsoleError(message: string): boolean {
  const ignoredPatterns = [/favicon\.ico/i, /status of 400/i];
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
    .locator(".boutique-product-grid h3 a")
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
