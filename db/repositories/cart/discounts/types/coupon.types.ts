export type CouponCode = {
  code: string;
};

export type CouponApplicationResult = {
  code: string;
  applied: boolean;
  reason: string | null;
};
