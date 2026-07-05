"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Edit3, Eye, EyeOff, FileText } from "lucide-react";

import { AdminConfigDataTableToolbar } from "@/components/admin/tables/admin-config-data-table-toolbar";
import { AdminSelectFilterControl } from "@/components/admin/tables/filters/admin-select-filter-control";
import { toggleBlogPostStatusAction } from "@/features/admin/blog/actions";
import type { AdminBlogPostSummary } from "@/features/admin/blog/types";
import { cn } from "@/lib/utils";

const STATUS_FILTER_ALL = "all";

const STATUS_FILTER_OPTIONS = [
  { value: STATUS_FILTER_ALL, label: "Tous les statuts" },
  { value: "published", label: "Publié" },
  { value: "draft", label: "Brouillon" },
] as const;

type StatusFilterValue = (typeof STATUS_FILTER_OPTIONS)[number]["value"];

type BlogPostsPanelProps = Readonly<{
  posts: ReadonlyArray<AdminBlogPostSummary>;
  canPublishBlog: boolean;
}>;

const dateFormatter = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" });

function matchesBlogPostSearch(post: AdminBlogPostSummary, query: string): boolean {
  const haystack = [
    post.title,
    post.slug,
    post.excerpt ?? "",
    post.status === "published" ? "publié" : "brouillon",
  ];

  return haystack.some((value) => value.toLocaleLowerCase("fr-FR").includes(query));
}

export function BlogPostsPanel({ posts, canPublishBlog }: BlogPostsPanelProps) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilterValue>(STATUS_FILTER_ALL);

  const normalizedQuery = search.trim().toLocaleLowerCase("fr-FR");

  const filteredPosts = useMemo(
    () =>
      posts.filter(
        (post) =>
          (status === STATUS_FILTER_ALL || post.status === status) &&
          (normalizedQuery.length === 0 || matchesBlogPostSearch(post, normalizedQuery))
      ),
    [normalizedQuery, posts, status]
  );

  return (
    <div className="flex flex-col gap-3">
      <AdminConfigDataTableToolbar
        search={search}
        onSearchChange={setSearch}
        mobileSearchPlaceholder="Rechercher un article…"
        desktopSearchPlaceholder="Rechercher un article…"
        mobileControls={
          <AdminSelectFilterControl
            value={status}
            onValueChange={(value) => setStatus(value)}
            options={[...STATUS_FILTER_OPTIONS]}
            triggerClassName="h-9 w-36 shrink-0 text-xs text-foreground/65"
          />
        }
        desktopFilters={
          <AdminSelectFilterControl
            value={status}
            onValueChange={(value) => setStatus(value)}
            options={[...STATUS_FILTER_OPTIONS]}
            triggerClassName="h-8 w-40 text-xs text-foreground/65"
          />
        }
        resultsCount={filteredPosts.length}
        resultsFullLabel={(count) => `${count} article${count > 1 ? "s" : ""}`}
        resultsShortLabel={(count) => `${count} article${count > 1 ? "s" : ""}`}
      />

      {filteredPosts.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted-foreground">
          Aucun article ne correspond à la recherche.
        </p>
      ) : (
        <div className="divide-y divide-surface-border/40">
          {filteredPosts.map((post) => (
            <div key={post.id} className="flex items-start gap-4 py-4 first:pt-0 last:pb-0">
              <div
                className={cn(
                  "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl border",
                  post.status === "published"
                    ? "border-feedback-success-border bg-feedback-success-surface/40 text-feedback-success-foreground"
                    : "border-surface-border/60 bg-surface-subtle text-muted-foreground/50"
                )}
              >
                <FileText className="size-4" />
              </div>

              <div className="min-w-0 flex-1">
                <Link
                  href={`/admin/content/blog/${post.id}`}
                  className="text-[13px] font-medium text-foreground hover:underline underline-offset-4"
                >
                  {post.title}
                </Link>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {post.status === "published" && post.publishedAt
                    ? `Publié le ${dateFormatter.format(new Date(post.publishedAt))}`
                    : post.hasContent
                      ? "Brouillon — prêt à publier"
                      : "Brouillon — contenu à compléter"}
                </p>
              </div>

              <span
                className={cn(
                  "shrink-0 inline-flex h-6 items-center rounded-md px-2 text-[11px] font-medium",
                  post.status === "published"
                    ? "bg-feedback-success-surface/75 text-feedback-success-foreground"
                    : "bg-surface-subtle text-muted-foreground"
                )}
              >
                {post.status === "published" ? "Publié" : "Brouillon"}
              </span>

              <div className="flex shrink-0 items-center gap-1">
                <Link
                  href={`/admin/content/blog/${post.id}`}
                  className="flex size-8 items-center justify-center rounded-xl text-muted-foreground/60 transition-colors hover:bg-surface-subtle hover:text-foreground"
                  title="Modifier"
                >
                  <Edit3 className="size-3.5" />
                </Link>
                {(post.status === "published" || canPublishBlog) && (
                  <form action={toggleBlogPostStatusAction}>
                    <input type="hidden" name="postId" value={post.id} />
                    <button
                      type="submit"
                      disabled={post.status === "draft" && !post.hasContent}
                      title={post.status === "published" ? "Passer en brouillon" : "Publier"}
                      className="flex size-8 items-center justify-center rounded-xl text-muted-foreground/60 transition-colors hover:bg-surface-subtle hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {post.status === "published" ? (
                        <EyeOff className="size-3.5" />
                      ) : (
                        <Eye className="size-3.5" />
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
