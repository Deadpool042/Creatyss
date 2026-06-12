import { test } from "@playwright/test";

test("legacy confirmation coverage replaced by commerce smoke", async () => {
  test.skip(
    true,
    "Replaced by tests/e2e/public/commerce-smoke.spec.ts because this file targeted legacy admin routes and a pre-selection checkout flow that no longer matches the application."
  );
});
