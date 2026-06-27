import "server-only";

import path from "node:path";

export function getUploadsDirectory() {
  return path.resolve(process.cwd(), process.env.UPLOADS_DIR ?? "public/uploads");
}

export function getUploadsPublicPath() {
  return `/${(process.env.UPLOADS_DIR ?? "public/uploads").replace(/^public\//, "").replaceAll("\\", "/")}`;
}
