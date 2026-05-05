const { chromium } = require("@playwright/test");

const BASE_URL = "http://127.0.0.1:3000";
const VIEWPORTS = [
  { name: "375x667", width: 375, height: 667 },
  { name: "667x375", width: 667, height: 375 },
  { name: "768x1024", width: 768, height: 1024 },
  { name: "1024x768", width: 1024, height: 768 },
  { name: "1440x900", width: 1440, height: 900 },
  { name: "1728x1117", width: 1728, height: 1117 },
  { name: "2560x1440", width: 2560, height: 1440 },
];

const EXCLUDED = new Set(["/boutique/produit-simple-de-test"]);

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ baseURL: BASE_URL });
  const page = await context.newPage();

  await page.goto("/boutique", { waitUntil: "domcontentloaded" });
  const candidates = await page.locator(".boutique-product-grid h3 a").evaluateAll((anchors) => {
    const hrefs = anchors.map((a) => a.getAttribute("href")).filter(Boolean);
    return [...new Set(hrefs)];
  });

  const filtered = candidates.filter((p) => !EXCLUDED.has(p));
  let productPath = null;

  for (const path of filtered) {
    await page.goto(path, { waitUntil: "domcontentloaded" });
    const ok = await page.evaluate(() => {
      const main = document.querySelector("main");
      if (!main) return false;

      const h1s = [...main.querySelectorAll("h1")].filter((h1) => {
        const style = getComputedStyle(h1);
        const rect = h1.getBoundingClientRect();
        return (
          style.display !== "none" &&
          style.visibility !== "hidden" &&
          style.opacity !== "0" &&
          rect.width > 0 &&
          rect.height > 0
        );
      });

      const hasPrice = /\d+[,.]\d{2}\s?€|€/.test(main.textContent || "");
      return h1s.length === 1 && hasPrice;
    });

    if (ok) {
      productPath = path;
      break;
    }
  }

  if (!productPath) {
    throw new Error("Aucun produit marchand exploitable trouve");
  }

  const criticalErrors = [];
  const onConsole = (msg) => {
    if (msg.type() !== "error") return;
    const text = msg.text();
    if (!/favicon\.ico/i.test(text) && !/status of 400/i.test(text)) {
      criticalErrors.push(text);
    }
  };
  const onPageError = (err) => criticalErrors.push(String(err));

  page.on("console", onConsole);
  page.on("pageerror", onPageError);

  const results = [];

  for (const vp of VIEWPORTS) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto(productPath, { waitUntil: "domcontentloaded" });

    const result = { viewport: vp.name };

    result.h1 = await page.evaluate(() => {
      const h1s = [...document.querySelectorAll("main h1")].filter((h1) => {
        const style = getComputedStyle(h1);
        const rect = h1.getBoundingClientRect();
        return (
          style.display !== "none" &&
          style.visibility !== "hidden" &&
          style.opacity !== "0" &&
          rect.width > 0 &&
          rect.height > 0
        );
      });

      return {
        ok: h1s.length === 1,
        count: h1s.length,
        text: (h1s[0]?.textContent || "").trim(),
      };
    });

    result.priceVisible = await page
      .locator("main")
      .evaluate((main) => /\d+[,.]\d{2}\s?€|€/.test(main.textContent || ""));
    result.availabilityVisible = await page
      .locator("main")
      .evaluate((main) =>
        /(disponible|indisponible|sur commande|rupture)/i.test(main.textContent || "")
      );

    result.images = await page.evaluate(() => {
      const imgs = [...document.querySelectorAll("main img")];
      const visibleCount = imgs.filter((img) => {
        const style = getComputedStyle(img);
        const rect = img.getBoundingClientRect();
        return (
          style.display !== "none" &&
          style.visibility !== "hidden" &&
          style.opacity !== "0" &&
          rect.width > 0 &&
          rect.height > 0
        );
      }).length;

      const openButtons = [...document.querySelectorAll("main button")].filter((btn) =>
        (btn.getAttribute("aria-label") || "").toLowerCase().includes("plein écran")
      ).length;

      return { domCount: imgs.length, visibleCount, openButtons };
    });

    result.galleryFunctional =
      result.images.domCount === 0
        ? true
        : result.images.visibleCount > 0 || result.images.openButtons > 0;

    const favoriteButton = page.getByRole("button", { name: /favori|favoris/i }).first();
    const favoriteCount = await favoriteButton.count();
    let favoriteVisible = false;
    let favoriteEnabled = false;
    let favoriteTrialClickable = false;

    if (favoriteCount > 0) {
      favoriteVisible = await favoriteButton.isVisible();
      favoriteEnabled = await favoriteButton.isEnabled();

      if (favoriteVisible && favoriteEnabled) {
        try {
          await favoriteButton.click({ trial: true });
          favoriteTrialClickable = true;
        } catch {
          favoriteTrialClickable = false;
        }
      }
    }

    result.favorite = {
      visible: favoriteVisible,
      enabled: favoriteEnabled,
      trialClickable: favoriteTrialClickable,
    };

    result.ctaOrAlternative = await page.evaluate(() => {
      const candidates = [
        ...document.querySelectorAll("main button"),
        ...document.querySelectorAll('main a[href*="contact"]'),
        ...document.querySelectorAll('main a[href*="panier"]'),
      ];

      const visibleCandidates = candidates.filter((el) => {
        const style = getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        return (
          style.display !== "none" &&
          style.visibility !== "hidden" &&
          style.opacity !== "0" &&
          rect.width > 0 &&
          rect.height > 0
        );
      });

      const blob = visibleCandidates
        .map((el) =>
          `${(el.textContent || "").trim()} ${(el.getAttribute("aria-label") || "").trim()}`.trim()
        )
        .join(" | ")
        .toLowerCase();

      return {
        ok: /(ajouter|panier|contacter|contact|indisponible|rupture|sur commande)/i.test(blob),
        count: visibleCandidates.length,
      };
    });

    result.backToShopVisible = await page.evaluate(() => {
      const links = [...document.querySelectorAll('a[href="/boutique"], a[href^="/boutique?"]')];
      const visible = links.filter((el) => {
        const style = getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        return (
          style.display !== "none" &&
          style.visibility !== "hidden" &&
          style.opacity !== "0" &&
          rect.width > 0 &&
          rect.height > 0
        );
      });
      return visible.length > 0;
    });

    result.overflowX = await page.evaluate(() => {
      const root = document.documentElement;
      return root.scrollWidth - root.clientWidth > 1;
    });

    const isTouch = vp.width < 1200;
    if (isTouch) {
      const menuBtn = page.getByRole("button", { name: /ouvrir le menu principal/i });
      let menuOk = false;

      if ((await menuBtn.count()) > 0 && (await menuBtn.isVisible())) {
        await menuBtn.focus();
        await page.keyboard.press("Enter");
        const dialog = page.getByRole("dialog");
        const opened = (await dialog.count()) > 0 && (await dialog.first().isVisible());
        await page.keyboard.press("Escape");
        const closed = (await page.getByRole("dialog").count()) === 0;
        menuOk = opened && closed;
      }

      result.mobileMenuOk = menuOk;
    } else {
      result.mobileMenuOk = true;
    }

    result.footerNotMasked = await page.evaluate(() => {
      const footer = document.querySelector("footer");
      if (!footer) return false;

      footer.scrollIntoView({ block: "end" });
      const footerRect = footer.getBoundingClientRect();

      const nav = document.querySelector('nav[aria-label="Navigation tactile"]');
      if (!nav) {
        return footerRect.bottom <= window.innerHeight + 1;
      }

      const style = getComputedStyle(nav);
      const navRect = nav.getBoundingClientRect();

      if (style.display === "none" || navRect.height === 0) {
        return footerRect.bottom <= window.innerHeight + 1;
      }

      return footerRect.bottom <= navRect.top + 1;
    });

    result.inertVisibleButtons = await page.evaluate(() => {
      const buttons = [...document.querySelectorAll("button")];
      const visibleEnabled = buttons.filter((btn) => {
        const style = getComputedStyle(btn);
        const rect = btn.getBoundingClientRect();
        const visible =
          style.display !== "none" &&
          style.visibility !== "hidden" &&
          style.opacity !== "0" &&
          rect.width > 0 &&
          rect.height > 0;
        const disabled =
          btn.hasAttribute("disabled") || btn.getAttribute("aria-disabled") === "true";
        return visible && !disabled;
      });

      const suspicious = visibleEnabled.filter((btn) => {
        const text = (btn.textContent || "").trim();
        const aria = (btn.getAttribute("aria-label") || "").trim();
        return text.length === 0 && aria.length === 0;
      });

      return {
        count: suspicious.length,
        samples: suspicious.slice(0, 5).map((btn) => btn.outerHTML.slice(0, 140)),
      };
    });

    results.push(result);
  }

  page.off("console", onConsole);
  page.off("pageerror", onPageError);

  console.log(`PRODUCT ${productPath}`);
  console.log(`CRITICAL_ERRORS ${criticalErrors.length}`);
  for (const result of results) {
    const row = {
      h1: result.h1?.ok === true,
      price: result.priceVisible === true,
      availability: result.availabilityVisible === true,
      gallery: result.galleryFunctional === true,
      favorite: result.favorite?.visible === true && result.favorite?.trialClickable === true,
      cta: result.ctaOrAlternative?.ok === true,
      back: result.backToShopVisible === true,
      overflow: result.overflowX === false,
      mobileMenu: result.mobileMenuOk === true,
      footer: result.footerNotMasked === true,
      inertButtons: result.inertVisibleButtons?.count === 0,
    };
    console.log(`${result.viewport} ${JSON.stringify(row)}`);
  }

  await browser.close();
})();
