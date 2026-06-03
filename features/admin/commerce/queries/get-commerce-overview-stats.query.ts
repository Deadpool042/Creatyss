import type { OrderStatus } from "@/entities/order/order-status-transition";
import { listAdminOrders } from "@/features/admin/commerce/orders/list/queries/list-admin-orders.query";

export type CommerceOrderSignal = {
  key: string;
  label: string;
  detail: string;
  tone: "warning" | "error" | "info";
  count: number;
};

export type CommerceRecentOrder = {
  id: string;
  reference: string;
  status: OrderStatus;
  paymentStatus: string;
  totalAmount: string;
  createdAt: string;
};

export type CommerceOverviewStats = {
  totalOrders: number;
  ordersByStatus: Partial<Record<OrderStatus, number>>;
  confirmedRevenue: number; // totalAmount des commandes paid + preparing + shipped
  pendingRevenue: number; // totalAmount des commandes pending (en attente de paiement)
  pendingCount: number;
  preparingCount: number;
  shippedCount: number;
  cancelledCount: number;
  recentOrders: CommerceRecentOrder[];
  signals: CommerceOrderSignal[];
};

const EMPTY: CommerceOverviewStats = {
  totalOrders: 0,
  ordersByStatus: {},
  confirmedRevenue: 0,
  pendingRevenue: 0,
  pendingCount: 0,
  preparingCount: 0,
  shippedCount: 0,
  cancelledCount: 0,
  recentOrders: [],
  signals: [],
};

function parseAmount(raw: string): number {
  const n = parseFloat(raw);
  return Number.isFinite(n) ? n : 0;
}

export async function getCommerceOverviewStats(): Promise<CommerceOverviewStats> {
  let orders;
  try {
    orders = await listAdminOrders();
  } catch {
    // Module commerce non encore activé
    return EMPTY;
  }

  if (orders.length === 0) return EMPTY;

  const byStatus: Partial<Record<OrderStatus, number>> = {};
  let confirmedRevenue = 0;
  let pendingRevenue = 0;

  for (const order of orders) {
    byStatus[order.status] = (byStatus[order.status] ?? 0) + 1;
    const amount = parseAmount(order.totalAmount);

    if (order.status === "paid" || order.status === "preparing" || order.status === "shipped") {
      confirmedRevenue += amount;
    } else if (order.status === "pending") {
      pendingRevenue += amount;
    }
  }

  const pendingCount = byStatus.pending ?? 0;
  const preparingCount = byStatus.preparing ?? 0;
  const shippedCount = byStatus.shipped ?? 0;
  const cancelledCount = byStatus.cancelled ?? 0;

  // Signaux d'attention
  const signals: CommerceOrderSignal[] = [];

  if (pendingCount > 0) {
    signals.push({
      key: "pending",
      label: `${pendingCount} commande${pendingCount > 1 ? "s" : ""} en attente`,
      detail: "Paiement non confirmé. Vérifier le statut paiement avant expédition.",
      tone: "warning",
      count: pendingCount,
    });
  }

  if (preparingCount > 0) {
    signals.push({
      key: "preparing",
      label: `${preparingCount} commande${preparingCount > 1 ? "s" : ""} à expédier`,
      detail: "En cours de préparation. Générer les étiquettes et notifier les clients.",
      tone: "info",
      count: preparingCount,
    });
  }

  // Commandes avec paiement échoué ou inconnu
  const paymentIssues = orders.filter(
    (o) => o.status !== "cancelled" && o.paymentStatus === "failed"
  );
  if (paymentIssues.length > 0) {
    signals.push({
      key: "payment_failed",
      label: `${paymentIssues.length} paiement${paymentIssues.length > 1 ? "s" : ""} en échec`,
      detail: "Contacter le client ou vérifier le prestataire de paiement.",
      tone: "error",
      count: paymentIssues.length,
    });
  }

  // 5 commandes les plus récentes
  const sorted = [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const recentOrders: CommerceRecentOrder[] = sorted.slice(0, 5).map((o) => ({
    id: o.id,
    reference: o.reference,
    status: o.status,
    paymentStatus: o.paymentStatus,
    totalAmount: o.totalAmount,
    createdAt: o.createdAt,
  }));

  return {
    totalOrders: orders.length,
    ordersByStatus: byStatus,
    confirmedRevenue,
    pendingRevenue,
    pendingCount,
    preparingCount,
    shippedCount,
    cancelledCount,
    recentOrders,
    signals,
  };
}
