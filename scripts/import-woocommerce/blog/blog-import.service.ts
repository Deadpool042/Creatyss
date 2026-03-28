import type { ImportWooCommerceEnv } from "../env";
import type { WordPressMedia, WordPressPost } from "../schemas";
import type { DbClient } from "../shared/db";
import { endProgress, logProgress } from "../shared/logging";
import {
  archiveMissingImportedBlogPosts,
  setBlogPostPrimaryImage,
  upsertImportedBlogPost,
} from "./blog.repository";
import { importBlogPostPrimaryImage } from "./blog-media.service";
import { mapWordPressPostToImportedBlogPost } from "./blog-mappers";

export type ImportedBlogPostRecord = {
  blogPostId: string;
  externalId: string;
};

export type ImportBlogPostsResult = {
  importedBlogPosts: ImportedBlogPostRecord[];
  importedImages: number;
  skippedImages: number;
  reusedImages: number;
  failedImages: number;
  archivedBlogPosts: number;
};

export async function importBlogPosts(
  prisma: DbClient,
  input: {
    env: ImportWooCommerceEnv;
    storeId: string;
    posts: readonly WordPressPost[];
    featuredMediaByPostId: ReadonlyMap<number, WordPressMedia | null>;
    skipImages: boolean;
  }
): Promise<ImportBlogPostsResult> {
  const importedBlogPosts: ImportedBlogPostRecord[] = [];
  const preservedSlugs: string[] = [];

  let importedImages = 0;
  let skippedImages = 0;
  let reusedImages = 0;
  let failedImages = 0;

  for (const [index, post] of input.posts.entries()) {
    logProgress(index + 1, input.posts.length, "Importing blog posts");

    const featuredMedia = input.featuredMediaByPostId.get(post.id) ?? null;
    const mappedPost = mapWordPressPostToImportedBlogPost(post, featuredMedia);
    const savedPost = await upsertImportedBlogPost(prisma, input.storeId, mappedPost);

    preservedSlugs.push(mappedPost.slug);

    if (!input.skipImages) {
      const imageResult = await importBlogPostPrimaryImage(prisma, {
        env: input.env,
        storeId: input.storeId,
        blogPostId: savedPost.id,
        blogPostSlug: mappedPost.slug,
        image: mappedPost.featuredImage,
      });

      importedImages += imageResult.importedImages;
      reusedImages += imageResult.reusedImages;
      skippedImages += imageResult.skippedImages;
      failedImages += imageResult.failedImages;

      if (imageResult.primaryImageId !== null) {
        await setBlogPostPrimaryImage(prisma, savedPost.id, imageResult.primaryImageId);
      }
    }

    importedBlogPosts.push({
      blogPostId: savedPost.id,
      externalId: mappedPost.externalId,
    });
  }

  if (input.posts.length > 0) {
    endProgress(`Imported ${importedBlogPosts.length} blog posts`);
  }

  const archivedResult = await archiveMissingImportedBlogPosts(prisma, {
    storeId: input.storeId,
    preservedSlugs,
  });

  return {
    importedBlogPosts,
    importedImages,
    skippedImages,
    reusedImages,
    failedImages,
    archivedBlogPosts: archivedResult.count,
  };
}
