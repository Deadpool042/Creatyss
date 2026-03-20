type SortableAdminCategory = {
  id: bigint;
  name: string;
};

type RepresentativeImageCandidate = {
  productId: bigint;
  createdAt: Date;
};

export function sortCategoriesForAdmin<T extends SortableAdminCategory>(rows: readonly T[]): T[] {
  return [...rows].sort((a, b) => {
    const nameCompare = a.name.toLowerCase().localeCompare(b.name.toLowerCase());

    if (nameCompare !== 0) {
      return nameCompare;
    }

    if (a.id < b.id) {
      return -1;
    }

    if (a.id > b.id) {
      return 1;
    }

    return 0;
  });
}

export function isRepresentativeImageCandidateBetter<T extends RepresentativeImageCandidate>(
  candidate: T,
  current: T
): boolean {
  const candidateTime = candidate.createdAt.getTime();
  const currentTime = current.createdAt.getTime();

  if (candidateTime !== currentTime) {
    return candidateTime > currentTime;
  }

  return candidate.productId > current.productId;
}
