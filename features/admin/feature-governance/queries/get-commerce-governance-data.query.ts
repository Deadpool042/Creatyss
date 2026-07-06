import "server-only";

import { db } from "@/core/db";

export type DiscountsGovernanceData = Readonly<{
  total: number;
  active: number;
  archived: number;
}>;

export type ShippingGovernanceData = Readonly<{
  total: number;
  shipped: number;
  delivered: number;
}>;

export type FulfillmentGovernanceData = Readonly<{
  total: number;
  pending: number;
  fulfilled: number;
}>;

export type ReturnsGovernanceData = Readonly<{
  total: number;
  open: number;
  closed: number;
}>;

export type TaxationGovernanceData = Readonly<{
  totalRules: number;
  activeRules: number;
  countries: number;
}>;

export type DocumentsGovernanceData = Readonly<{
  total: number;
}>;

export async function getDiscountsGovernanceData(): Promise<DiscountsGovernanceData | null> {
  try {
    const [total, active, archived] = await Promise.all([
      db.discount.count(),
      db.discount.count({ where: { status: "ACTIVE" } }),
      db.discount.count({ where: { status: "ARCHIVED" } }),
    ]);

    return { total, active, archived };
  } catch {
    return null;
  }
}

export async function getShippingGovernanceData(): Promise<ShippingGovernanceData | null> {
  try {
    const [total, shipped, delivered] = await Promise.all([
      db.shipment.count(),
      db.shipment.count({ where: { status: "SHIPPED" } }),
      db.shipment.count({ where: { status: "DELIVERED" } }),
    ]);

    return { total, shipped, delivered };
  } catch {
    return null;
  }
}

export async function getFulfillmentGovernanceData(): Promise<FulfillmentGovernanceData | null> {
  try {
    const [total, pending, fulfilled] = await Promise.all([
      db.fulfillment.count(),
      db.fulfillment.count({ where: { status: "PENDING" } }),
      db.fulfillment.count({ where: { status: "FULFILLED" } }),
    ]);

    return { total, pending, fulfilled };
  } catch {
    return null;
  }
}

export async function getReturnsGovernanceData(): Promise<ReturnsGovernanceData | null> {
  try {
    const [total, open, closed] = await Promise.all([
      db.returnRequest.count(),
      db.returnRequest.count({
        where: {
          status: {
            in: ["REQUESTED", "UNDER_REVIEW", "APPROVED", "RECEIVED"],
          },
        },
      }),
      db.returnRequest.count({
        where: {
          status: {
            in: ["CLOSED", "REFUNDED"],
          },
        },
      }),
    ]);

    return { total, open, closed };
  } catch {
    return null;
  }
}

export async function getTaxationGovernanceData(): Promise<TaxationGovernanceData | null> {
  try {
    const [totalRules, activeRules] = await Promise.all([
      db.taxRule.count(),
      db.taxRule.count({ where: { status: "ACTIVE" } }),
    ]);

    const countries = await db.taxRule
      .findMany({
        select: { countryCode: true },
        distinct: ["countryCode"],
      })
      .then((rows) => rows.length)
      .catch(() => 0);

    return {
      totalRules,
      activeRules,
      countries,
    };
  } catch {
    return null;
  }
}

export async function getDocumentsGovernanceData(): Promise<DocumentsGovernanceData | null> {
  try {
    const total = await db.document.count();

    return { total };
  } catch {
    return null;
  }
}
