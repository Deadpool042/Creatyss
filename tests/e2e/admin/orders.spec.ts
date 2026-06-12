import { test } from "@playwright/test";

test("legacy admin orders coverage replaced by commerce smoke", async () => {
  test.skip(
    true,
    "Replaced by tests/e2e/public/commerce-smoke.spec.ts because this file targeted /admin/orders and bypassed the current shipping and payment selection flow."
  );
});
