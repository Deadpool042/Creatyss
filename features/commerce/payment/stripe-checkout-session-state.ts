export type StripeCheckoutSessionStatus = "open" | "complete" | "expired" | null;

export type StripeCheckoutSessionStateInput = {
  status: StripeCheckoutSessionStatus;
  url: string | null;
};

export type StripeCheckoutSessionState =
  | {
      kind: "reuse";
      url: string;
    }
  | {
      kind: "await_confirmation";
    }
  | {
      kind: "replace";
    }
  | {
      kind: "unavailable";
    };

export function resolveStripeCheckoutSessionState(
  input: StripeCheckoutSessionStateInput
): StripeCheckoutSessionState {
  switch (input.status) {
    case "open":
      if (typeof input.url === "string" && input.url.length > 0) {
        return {
          kind: "reuse",
          url: input.url,
        };
      }

      return {
        kind: "unavailable",
      };
    case "complete":
      return {
        kind: "await_confirmation",
      };
    case "expired":
      return {
        kind: "replace",
      };
    default:
      return {
        kind: "unavailable",
      };
  }
}
