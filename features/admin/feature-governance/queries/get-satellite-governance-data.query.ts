import "server-only";

import { db } from "@/core/db";

export type SearchGovernanceData = Readonly<{
  total: number;
}>;

export type ChannelsGovernanceData = Readonly<{
  totalChannels: number;
  totalProductStatuses: number;
}>;

export async function getSearchGovernanceData(): Promise<SearchGovernanceData | null> {
  try {
    const total = await db.searchDocument.count();

    return { total };
  } catch {
    return null;
  }
}

export async function getChannelsGovernanceData(): Promise<ChannelsGovernanceData | null> {
  try {
    const [totalChannels, totalProductStatuses] = await Promise.all([
      db.channel.count(),
      db.channelProductStatus.count(),
    ]);

    return {
      totalChannels,
      totalProductStatuses,
    };
  } catch {
    return null;
  }
}
