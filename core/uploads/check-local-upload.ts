import { existsSync } from "node:fs";
import path from "node:path";

import { getUploadsDirectory } from "@/core/uploads";

export function localUploadExists(storageKey: string): boolean {
  return existsSync(path.join(getUploadsDirectory(), storageKey));
}
