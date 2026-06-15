import "server-only";

import { db } from "@/core/db";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";

const CHANNELS_LIMIT = 16;
const PRODUCT_STATUSES_LIMIT = 16;
const VARIANT_STATUSES_LIMIT = 16;

export type AdminChannelSummary = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  type: "GOOGLE_SHOPPING" | "META_CATALOG" | "MARKETPLACE" | "INTERNAL_FEED" | "OTHER";
  status: "DRAFT" | "ACTIVE" | "INACTIVE" | "ARCHIVED";
  isEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
  productStatusesCount: number;
  variantStatusesCount: number;
};

export type AdminChannelProductStatusSummary = {
  id: string;
  channelCode: string;
  productSlug: string;
  productName: string;
  publicationStatus:
    | "PENDING"
    | "ELIGIBLE"
    | "INELIGIBLE"
    | "PUBLISHED"
    | "REJECTED"
    | "EXCLUDED"
    | "SUSPENDED"
    | "ARCHIVED";
  isEligible: boolean;
  reasonCode: string | null;
  publishedAt: Date | null;
  updatedAt: Date;
};

export type AdminChannelVariantStatusSummary = {
  id: string;
  channelCode: string;
  productSlug: string;
  variantSku: string;
  variantName: string | null;
  publicationStatus:
    | "PENDING"
    | "ELIGIBLE"
    | "INELIGIBLE"
    | "PUBLISHED"
    | "REJECTED"
    | "EXCLUDED"
    | "SUSPENDED"
    | "ARCHIVED";
  isEligible: boolean;
  reasonCode: string | null;
  publishedAt: Date | null;
  updatedAt: Date;
};

export type AdminChannelsSnapshot = {
  overview: {
    totalChannels: number;
    enabledChannels: number;
    activeChannels: number;
    productStatuses: number;
    variantStatuses: number;
  };
  channels: AdminChannelSummary[];
  productStatuses: AdminChannelProductStatusSummary[];
  variantStatuses: AdminChannelVariantStatusSummary[];
};

export async function getAdminChannelsSnapshot(): Promise<AdminChannelsSnapshot> {
  const storeId = await getCurrentStoreId();

  if (storeId === null) {
    return {
      overview: {
        totalChannels: 0,
        enabledChannels: 0,
        activeChannels: 0,
        productStatuses: 0,
        variantStatuses: 0,
      },
      channels: [],
      productStatuses: [],
      variantStatuses: [],
    };
  }

  const channelWhere = {
    storeId,
    archivedAt: null,
  };

  const productStatusWhere = {
    archivedAt: null,
    channel: {
      storeId,
    },
  };

  const variantStatusWhere = {
    archivedAt: null,
    channel: {
      storeId,
    },
  };

  const [
    totalChannels,
    enabledChannels,
    activeChannels,
    productStatusesCount,
    variantStatusesCount,
    channels,
    productStatuses,
    variantStatuses,
  ] = await Promise.all([
    db.channel.count({ where: channelWhere }),
    db.channel.count({
      where: {
        ...channelWhere,
        isEnabled: true,
      },
    }),
    db.channel.count({
      where: {
        ...channelWhere,
        status: "ACTIVE",
      },
    }),
    db.channelProductStatus.count({ where: productStatusWhere }),
    db.channelVariantStatus.count({ where: variantStatusWhere }),
    db.channel.findMany({
      where: channelWhere,
      orderBy: [{ updatedAt: "desc" }],
      take: CHANNELS_LIMIT,
      select: {
        id: true,
        code: true,
        name: true,
        description: true,
        type: true,
        status: true,
        isEnabled: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            productStatuses: true,
            variantStatuses: true,
          },
        },
      },
    }),
    db.channelProductStatus.findMany({
      where: productStatusWhere,
      orderBy: [{ updatedAt: "desc" }],
      take: PRODUCT_STATUSES_LIMIT,
      select: {
        id: true,
        publicationStatus: true,
        isEligible: true,
        reasonCode: true,
        publishedAt: true,
        updatedAt: true,
        channel: {
          select: {
            code: true,
          },
        },
        product: {
          select: {
            slug: true,
            name: true,
          },
        },
      },
    }),
    db.channelVariantStatus.findMany({
      where: variantStatusWhere,
      orderBy: [{ updatedAt: "desc" }],
      take: VARIANT_STATUSES_LIMIT,
      select: {
        id: true,
        publicationStatus: true,
        isEligible: true,
        reasonCode: true,
        publishedAt: true,
        updatedAt: true,
        channel: {
          select: {
            code: true,
          },
        },
        variant: {
          select: {
            sku: true,
            name: true,
            product: {
              select: {
                slug: true,
              },
            },
          },
        },
      },
    }),
  ]);

  return {
    overview: {
      totalChannels,
      enabledChannels,
      activeChannels,
      productStatuses: productStatusesCount,
      variantStatuses: variantStatusesCount,
    },
    channels: channels.map((channel) => ({
      id: channel.id,
      code: channel.code,
      name: channel.name,
      description: channel.description,
      type: channel.type,
      status: channel.status,
      isEnabled: channel.isEnabled,
      createdAt: channel.createdAt,
      updatedAt: channel.updatedAt,
      productStatusesCount: channel._count.productStatuses,
      variantStatusesCount: channel._count.variantStatuses,
    })),
    productStatuses: productStatuses.map((status) => ({
      id: status.id,
      channelCode: status.channel.code,
      productSlug: status.product.slug,
      productName: status.product.name,
      publicationStatus: status.publicationStatus,
      isEligible: status.isEligible,
      reasonCode: status.reasonCode,
      publishedAt: status.publishedAt,
      updatedAt: status.updatedAt,
    })),
    variantStatuses: variantStatuses.map((status) => ({
      id: status.id,
      channelCode: status.channel.code,
      productSlug: status.variant.product.slug,
      variantSku: status.variant.sku,
      variantName: status.variant.name,
      publicationStatus: status.publicationStatus,
      isEligible: status.isEligible,
      reasonCode: status.reasonCode,
      publishedAt: status.publishedAt,
      updatedAt: status.updatedAt,
    })),
  };
}
