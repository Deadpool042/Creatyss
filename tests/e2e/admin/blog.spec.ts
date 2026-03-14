import { expect, test } from "@playwright/test";
import { loginAsSeedAdmin } from "./admin-auth";
import {
  createBlogPostDraftWithoutContent,
  deleteBlogPostBySlug,
} from "../blog-db";

const TEST_POST_SLUG = "test-sans-contenu-e2e";
const TEST_POST_TITLE = "Test Sans Contenu E2E";

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

  await expect(page.locator("table, .empty-state").first()).toBeVisible();
});

test("refuse la publication d'un article sans contenu", async ({ page }) => {
  // Cleanup any leftover state from a previous failed run
  deleteBlogPostBySlug(TEST_POST_SLUG);

  // Setup: draft blog post with no content → not publishable
  createBlogPostDraftWithoutContent({
    slug: TEST_POST_SLUG,
    title: TEST_POST_TITLE,
  });

  try {
    await loginAsSeedAdmin(page);
    await page.goto("/admin/blog", { waitUntil: "domcontentloaded" });

    // The test post row should be visible in the table
    const row = page.locator("tr").filter({ hasText: TEST_POST_TITLE });
    await expect(row).toBeVisible();

    // The "Publier" button should be disabled for a draft without content
    await expect(row.getByRole("button", { name: "Publier" })).toBeDisabled();

    // Navigate to the detail page
    await row.getByRole("link", { name: "Modifier l'article" }).click();

    await expect(page).toHaveURL(/\/admin\/blog\/\d+$/);

    // The non-publishable notice should be visible on the detail page
    await expect(
      page.getByText("Le contenu de l'article est vide")
    ).toBeVisible();

    // Try to save as published — should be refused
    await page.locator('select[name="status"]').selectOption("published");
    await page
      .getByRole("button", { name: "Enregistrer les modifications" })
      .click();

    await expect(page).toHaveURL(/error=cannot_publish_missing_content/);
    await expect(
      page.getByText("Le contenu de l'article est obligatoire pour publier")
    ).toBeVisible();

    // Article must still be a draft
    await expect(
      page.locator('select[name="status"]').inputValue()
    ).resolves.toBe("draft");
  } finally {
    deleteBlogPostBySlug(TEST_POST_SLUG);
  }
});
