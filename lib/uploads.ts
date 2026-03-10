import { mkdir } from "node:fs/promises";
import path from "node:path";
import { env } from "@/lib/env";

export async function ensureUploadsDirectory() {
  const directory = getUploadsDirectory();

  await mkdir(directory, { recursive: true });

  return directory;
}

export function getUploadsDirectory() {
  return path.resolve(process.cwd(), env.uploadsDir);
}

export function getUploadsPublicPath() {
  return `/${env.uploadsDir.replace(/^public\//, "").replaceAll("\\", "/")}`;
}
