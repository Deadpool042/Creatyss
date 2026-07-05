import "server-only";

import { db } from "@/core/db";
import { readLocalePreferenceCookie } from "@/core/sessions/locale-preference";
import {
  BLOG_POST_COPY_FIELDS,
  BLOG_POST_COPY_SUBJECT_TYPE,
} from "@/entities/localization/blog-post-copy-fields";
import {
  resolveLocalizedValue,
  type LocalizedValueCandidate,
} from "@/entities/localization/resolve-localized-value";
import { resolvePreferredLocaleCode } from "@/entities/localization/resolve-preferred-locale";
import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";
import { LOCALIZATION_FEATURE_CODE } from "@/features/localization/queries/get-localization-feature-state.query";

type BlogPostCopySource = {
  id: string;
  storeId: string;
  title: string;
  excerpt: string | null;
  body: string | null;
};

type LocalizedBlogPostCopy = {
  title: string;
  excerpt: string | null;
  content: string | null;
};

type LocalizationContext = {
  defaultLocaleId: string;
  visitorLocaleId: string;
};

async function getLocalizationContext(storeId: string): Promise<LocalizationContext | null> {
  const allowed = await meetsFeatureLevel(LOCALIZATION_FEATURE_CODE, "multilingual");

  if (!allowed) {
    return null;
  }

  const store = await db.store.findUnique({
    where: { id: storeId },
    select: { defaultLocaleCode: true },
  });

  const locales = await db.localizationLocale.findMany({
    where: { storeId, archivedAt: null, status: "ACTIVE" },
    select: { id: true, code: true, isDefault: true },
  });

  if (locales.length < 2) {
    return null;
  }

  const defaultLocale =
    locales.find((locale) => locale.code === store?.defaultLocaleCode) ??
    locales.find((locale) => locale.isDefault) ??
    null;

  if (defaultLocale === null) {
    return null;
  }

  const cookieLocaleCode = await readLocalePreferenceCookie();
  const visitorLocaleCode = resolvePreferredLocaleCode({
    availableLocaleCodes: locales.map((locale) => locale.code),
    defaultLocaleCode: defaultLocale.code,
    cookieLocaleCode,
  });

  if (visitorLocaleCode === defaultLocale.code) {
    return null;
  }

  const visitorLocale = locales.find((locale) => locale.code === visitorLocaleCode);

  if (visitorLocale === undefined) {
    return null;
  }

  return {
    defaultLocaleId: defaultLocale.id,
    visitorLocaleId: visitorLocale.id,
  };
}

function buildSourceCopy(post: BlogPostCopySource): LocalizedBlogPostCopy {
  return {
    title: post.title,
    excerpt: post.excerpt,
    content: post.body,
  };
}

export async function resolveLocalizedBlogPostCopy(
  posts: readonly BlogPostCopySource[]
): Promise<Map<string, LocalizedBlogPostCopy>> {
  const localizedByPostId = new Map<string, LocalizedBlogPostCopy>();

  for (const post of posts) {
    localizedByPostId.set(post.id, buildSourceCopy(post));
  }

  if (posts.length === 0) {
    return localizedByPostId;
  }

  const postsByStoreId = new Map<string, BlogPostCopySource[]>();

  for (const post of posts) {
    const group = postsByStoreId.get(post.storeId);

    if (group === undefined) {
      postsByStoreId.set(post.storeId, [post]);
    } else {
      group.push(post);
    }
  }

  for (const [storeId, storePosts] of postsByStoreId) {
    const context = await getLocalizationContext(storeId);

    if (context === null) {
      continue;
    }

    const values = await db.localizedValue.findMany({
      where: {
        storeId,
        subjectType: BLOG_POST_COPY_SUBJECT_TYPE,
        subjectId: { in: storePosts.map((post) => post.id) },
        fieldName: { in: BLOG_POST_COPY_FIELDS.map((field) => field.fieldName) },
        status: "ACTIVE",
        archivedAt: null,
        localeId: { in: [context.visitorLocaleId, context.defaultLocaleId] },
      },
      select: { subjectId: true, fieldName: true, localeId: true, valueText: true, status: true },
    });

    const candidatesByPostField = new Map<string, LocalizedValueCandidate[]>();

    for (const value of values) {
      const key = `${value.subjectId}:${value.fieldName}`;
      const candidates = candidatesByPostField.get(key);

      if (candidates === undefined) {
        candidatesByPostField.set(key, [value]);
      } else {
        candidates.push(value);
      }
    }

    for (const post of storePosts) {
      const localized = buildSourceCopy(post);

      for (const field of BLOG_POST_COPY_FIELDS) {
        const resolved = resolveLocalizedValue({
          candidates: candidatesByPostField.get(`${post.id}:${field.fieldName}`) ?? [],
          requestedLocaleId: context.visitorLocaleId,
          defaultLocaleId: context.defaultLocaleId,
        });

        if (resolved === null || resolved.isFallback) {
          continue;
        }

        if (field.fieldName === "title") {
          localized.title = resolved.valueText;
        } else if (field.fieldName === "excerpt") {
          localized.excerpt = resolved.valueText;
        } else if (field.fieldName === "content") {
          localized.content = resolved.valueText;
        }
      }

      localizedByPostId.set(post.id, localized);
    }
  }

  return localizedByPostId;
}
