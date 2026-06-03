import "server-only";

import { existsSync } from "node:fs";
import path from "node:path";

import { getUploadsDirectory } from "./runtime";

export function localUploadExists(storageKey: string): boolean {
  return existsSync(path.join(getUploadsDirectory(), storageKey));
}
