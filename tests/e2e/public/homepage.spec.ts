import { expect, test } from "@playwright/test";
import { loginAsSeedAdmin } from "../admin/admin-auth";

test("reflects homepage hero updates on the public home page", async ({
  page
}) => {
  const suffix = Date.now().toString();
  const heroTitle = `Hero smoke ${suffix}`;
  const heroText = `Texte smoke ${suffix}`;

  await loginAsSeedAdmin(page);
  await page.goto("/admin/homepage");

  await page.getByLabel("Titre hero").fill(heroTitle);
  await page.getByLabel("Texte principal").fill(heroText);
  await page.getByRole("button", { name: "Enregistrer la homepage" }).click();

  await expect(page).toHaveURL(/\/admin\/homepage\?status=updated$/);
  await expect(
    page.getByText("Homepage enregistree avec succes.")
  ).toBeVisible();

  await page.goto("/");

  await expect(page.getByRole("heading", { name: heroTitle })).toBeVisible();
  await expect(page.getByText(heroText)).toBeVisible();
});
