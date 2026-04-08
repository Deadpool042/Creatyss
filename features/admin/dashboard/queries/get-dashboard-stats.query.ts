import { db } from "@/core/db";

import type { AdminDashboardStats } from "@/features/admin/dashboard/types/dashboard.types";

export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
  const [productsCount, ordersCount, blogPostsCount] = await Promise.all([
    db.product.count(),
    db.order.count(),
    db.blogPost.count(),
  ]);

  return {
    productsCount,
    ordersCount,
    blogPostsCount,
  };
}
