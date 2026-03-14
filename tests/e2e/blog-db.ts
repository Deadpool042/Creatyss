import { execFileSync } from "node:child_process";

function escapeSqlLiteral(value: string): string {
  return value.replace(/'/g, "''");
}

function assertValidBlogPostSlug(slug: string): void {
  if (!/^[a-z0-9-]+$/.test(slug)) {
    throw new Error(`Invalid blog post slug: ${slug}`);
  }
}

function runBlogDatabaseSql(sql: string): void {
  execFileSync("docker", [
    "compose",
    "--env-file",
    ".env.local",
    "exec",
    "-T",
    "db",
    "psql",
    "-U",
    "creatyss",
    "-d",
    "creatyss",
    "-c",
    sql
  ]);
}

export function createBlogPostDraftWithoutContent(input: {
  slug: string;
  title: string;
}): void {
  assertValidBlogPostSlug(input.slug);

  runBlogDatabaseSql(`
      insert into blog_posts (title, slug, content, status)
      values (
        '${escapeSqlLiteral(input.title)}',
        '${escapeSqlLiteral(input.slug)}',
        null,
        'draft'
      )
      on conflict (slug) do nothing;
    `);
}

export function deleteBlogPostBySlug(slug: string): void {
  assertValidBlogPostSlug(slug);

  runBlogDatabaseSql(`
      delete from blog_posts where slug = '${escapeSqlLiteral(slug)}';
    `);
}
