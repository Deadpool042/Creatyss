import { NextResponse } from "next/server";

import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";
import { storefrontNewsletterSubscribeSchema } from "@/features/storefront/newsletter/schemas/storefront-newsletter-subscribe.schema";
import { subscribeStorefrontNewsletter } from "@/features/storefront/newsletter/services/subscribe-storefront-newsletter.service";

type NewsletterRequestBody = {
  email?: unknown;
};

export async function POST(request: Request) {
  const featureEnabled = await meetsFeatureLevel("engagement.newsletter", "basic");

  if (!featureEnabled) {
    return NextResponse.json({ error: "feature_inactive" }, { status: 404 });
  }

  let body: NewsletterRequestBody;

  try {
    body = (await request.json()) as NewsletterRequestBody;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = storefrontNewsletterSubscribeSchema.safeParse({
    email: body.email,
  });

  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  try {
    const result = await subscribeStorefrontNewsletter(parsed.data);

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 503 });
    }

    return NextResponse.json({
      ok: true,
      created: result.created,
      reactivated: result.reactivated,
      queuedAutomationJobs: result.queuedAutomationJobs,
    });
  } catch (error) {
    console.error("newsletter_subscription_failed", error);
    return NextResponse.json({ error: "internal_server_error" }, { status: 500 });
  }
}
