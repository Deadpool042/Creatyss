export type CartBlockingIssueCode =
  | "empty_cart"
  | "invalid_line"
  | "shipping_method_missing"
  | "shipping_method_invalid"
  | "address_incomplete";

export type CartBlockingIssue = {
  code: CartBlockingIssueCode;
  message: string;
};

export type CartCheckoutReadiness = {
  isCheckoutReady: boolean;
  blockingIssues: CartBlockingIssue[];
  warnings: string[];
};
