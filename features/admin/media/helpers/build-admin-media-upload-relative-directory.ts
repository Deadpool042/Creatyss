export function buildAdminMediaUploadRelativeDirectory(date = new Date()): string {
  const year = String(date.getUTCFullYear());
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");

  return `media/${year}/${month}`;
}
