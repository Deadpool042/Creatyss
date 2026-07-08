import { type DbExecutor } from "@/core/db";
import { recordDomainEvent } from "@/features/domain-events";
import { HomepageStatus, type HomepageSectionType } from "@/prisma-generated/client";

type HomepageFeaturedSelectionSnapshot = Readonly<{
  entityId: string;
  sortOrder: number;
}>;

type HomepageVisibleSectionSnapshot = Readonly<{
  code: string;
  type: HomepageSectionType;
  title: string | null;
  body: string | null;
  primaryImagePath: string | null;
  featuredProducts: readonly HomepageFeaturedSelectionSnapshot[];
  featuredCategories: readonly HomepageFeaturedSelectionSnapshot[];
  featuredBlogPosts: readonly HomepageFeaturedSelectionSnapshot[];
}>;

type HomepagePublishedSnapshot = Readonly<{
  id: string;
  title: string | null;
  status: HomepageStatus;
  publishedAt: Date | null;
}>;

type HomepageVisibleSnapshot = HomepagePublishedSnapshot &
  Readonly<{
    updatedAt: Date;
    sections: readonly HomepageVisibleSectionSnapshot[];
  }>;

type RecordHomepagePublishedDomainEventInput = Readonly<{
  executor: DbExecutor;
  storeId: string;
  previous: HomepagePublishedSnapshot;
  next: HomepagePublishedSnapshot;
}>;

type RecordHomepageUpdatedVisibleDomainEventInput = Readonly<{
  executor: DbExecutor;
  storeId: string;
  previous: HomepageVisibleSnapshot;
  next: HomepageVisibleSnapshot;
}>;

type ChangedHomepageField =
  | "hero"
  | "editorial"
  | "featuredProducts"
  | "featuredCategories"
  | "featuredBlogPosts";

const HERO_SECTION_CODE = "hero";
const EDITORIAL_SECTION_CODE = "editorial";
const FEATURED_PRODUCTS_SECTION_CODE = "featured-products";
const FEATURED_CATEGORIES_SECTION_CODE = "featured-categories";
const FEATURED_BLOG_POSTS_SECTION_CODE = "featured-blog-posts";

function isPublishedStatus(status: HomepageStatus): boolean {
  return status === HomepageStatus.ACTIVE;
}

function normalizeSection(section: HomepageVisibleSectionSnapshot | null): string {
  if (section === null) {
    return "null";
  }

  return JSON.stringify(section);
}

function getSectionByCode(
  sections: readonly HomepageVisibleSectionSnapshot[],
  code: string,
): HomepageVisibleSectionSnapshot | null {
  return sections.find((section) => section.code === code) ?? null;
}

function getChangedHomepageFields(
  previous: HomepageVisibleSnapshot,
  next: HomepageVisibleSnapshot,
): ChangedHomepageField[] {
  const changedFields: ChangedHomepageField[] = [];

  if (
    normalizeSection(getSectionByCode(previous.sections, HERO_SECTION_CODE)) !==
    normalizeSection(getSectionByCode(next.sections, HERO_SECTION_CODE))
  ) {
    changedFields.push("hero");
  }

  if (
    normalizeSection(getSectionByCode(previous.sections, EDITORIAL_SECTION_CODE)) !==
    normalizeSection(getSectionByCode(next.sections, EDITORIAL_SECTION_CODE))
  ) {
    changedFields.push("editorial");
  }

  if (
    normalizeSection(getSectionByCode(previous.sections, FEATURED_PRODUCTS_SECTION_CODE)) !==
    normalizeSection(getSectionByCode(next.sections, FEATURED_PRODUCTS_SECTION_CODE))
  ) {
    changedFields.push("featuredProducts");
  }

  if (
    normalizeSection(getSectionByCode(previous.sections, FEATURED_CATEGORIES_SECTION_CODE)) !==
    normalizeSection(getSectionByCode(next.sections, FEATURED_CATEGORIES_SECTION_CODE))
  ) {
    changedFields.push("featuredCategories");
  }

  if (
    normalizeSection(getSectionByCode(previous.sections, FEATURED_BLOG_POSTS_SECTION_CODE)) !==
    normalizeSection(getSectionByCode(next.sections, FEATURED_BLOG_POSTS_SECTION_CODE))
  ) {
    changedFields.push("featuredBlogPosts");
  }

  return changedFields;
}

export async function recordHomepagePublishedDomainEvent(
  input: RecordHomepagePublishedDomainEventInput,
): Promise<void> {
  if (isPublishedStatus(input.previous.status) || !isPublishedStatus(input.next.status)) {
    return;
  }

  await recordDomainEvent({
    executor: input.executor,
    storeId: input.storeId,
    eventType: "content.homepage.published",
    aggregateType: "HOMEPAGE",
    aggregateId: input.next.id,
    idempotencyKey: `homepage:${input.next.id}:published:${input.next.publishedAt?.toISOString() ?? input.next.status}`,
    payload: {
      homepageId: input.next.id,
      title: input.next.title,
      previousStatus: input.previous.status,
      nextStatus: input.next.status,
      publishedAt: input.next.publishedAt?.toISOString() ?? null,
    },
  });
}

export async function recordHomepageUpdatedVisibleDomainEvent(
  input: RecordHomepageUpdatedVisibleDomainEventInput,
): Promise<void> {
  if (!isPublishedStatus(input.previous.status) || !isPublishedStatus(input.next.status)) {
    return;
  }

  const changedFields = getChangedHomepageFields(input.previous, input.next);

  if (changedFields.length === 0) {
    return;
  }

  await recordDomainEvent({
    executor: input.executor,
    storeId: input.storeId,
    eventType: "content.homepage.updated_visible",
    aggregateType: "HOMEPAGE",
    aggregateId: input.next.id,
    idempotencyKey: `homepage:${input.next.id}:updated-visible:${input.next.updatedAt.toISOString()}`,
    payload: {
      homepageId: input.next.id,
      changedFields,
      publishedAt: input.next.publishedAt?.toISOString() ?? null,
      updatedAt: input.next.updatedAt.toISOString(),
    },
  });
}
