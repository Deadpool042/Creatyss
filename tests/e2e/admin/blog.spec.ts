import { expect, test } from "@playwright/test";
import { loginAsSeedAdmin } from "./admin-auth";

test("affiche la page liste du blog admin avec le heading, le lien d'action et la zone de contenu", async ({
  page
}) => {
  await loginAsSeedAdmin(page);

  await page.goto("/admin/blog", { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/\/admin\/blog$/);

  await expect(page.getByRole("heading", { name: "Articles" })).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Nouvel article" })
  ).toBeVisible();

  await expect(page.locator("article, .empty-state").first()).toBeVisible();
});
