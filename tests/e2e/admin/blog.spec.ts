import { expect, test } from "@playwright/test";
import { loginAsSeedAdmin } from "./admin-auth";
import { createBlogPostDraftWithoutContent, deleteBlogPostBySlug } from "../blog-db";

const TEST_POST_SLUG = "test-sans-contenu-e2e";
const TEST_POST_TITLE = "Test Sans Contenu E2E";

test("affiche la page liste du blog admin avec le heading, le lien d'action et la zone de contenu", async ({
  page,
}) => {
  await loginAsSeedAdmin(page);

  await page.goto("/admin/content/blog", { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/\/admin\/content\/blog$/);

  await expect(page.getByRole("heading", { name: "Articles" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Nouvel article" })).toBeVisible();
  await expect(page.getByText("Niveau blog")).toBeVisible();

  const emptyState = page.getByRole("heading", {
    name: "Le blog ne contient pas encore d'article",
  });

  if (await emptyState.isVisible()) {
    await expect(emptyState).toBeVisible();
    return;
  }

  await expect(page.getByText("Total", { exact: true })).toBeVisible();
  await expect(page.getByText("Brouillons", { exact: true })).toBeVisible();
});

test("refuse la publication d'un article sans contenu", async ({ page }) => {
  // Cleanup any leftover state from a previous failed run
  await deleteBlogPostBySlug(TEST_POST_SLUG);

  // Setup: draft blog post with no content → not publishable
  await createBlogPostDraftWithoutContent({
    slug: TEST_POST_SLUG,
    title: TEST_POST_TITLE,
  });

  try {
    await loginAsSeedAdmin(page);
    await page.goto("/admin/content/blog", { waitUntil: "domcontentloaded" });

    const postLink = page.getByRole("link", { name: TEST_POST_TITLE });
    await expect(postLink).toBeVisible();

    const postItem = postLink.locator(
      "xpath=ancestor::div[contains(@class,'flex items-start')][1]"
    );

    await expect(postItem.getByText("Brouillon — contenu à compléter")).toBeVisible();

    const publishAction = postItem.getByTitle("Publier");
    const publishActionCount = await publishAction.count();

    if (publishActionCount > 0) {
      await expect(publishAction).toBeDisabled();
    } else {
      await expect(publishAction).toHaveCount(0);
    }
  } finally {
    await deleteBlogPostBySlug(TEST_POST_SLUG);
  }
});
