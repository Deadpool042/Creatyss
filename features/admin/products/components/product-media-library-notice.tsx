import Link from "next/link";
import { Notice } from "@/components/shared/notice";

export function ProductMediaLibraryNotice() {
  return (
    <Notice tone="note">
      Aucun média n&apos;est disponible. Ajoutez d&apos;abord une image dans{" "}
      <Link
        className="font-medium text-primary underline-offset-4 hover:underline"
        href="/admin/media">
        la bibliothèque médias
      </Link>
      .
    </Notice>
  );
}
