import Link from "next/link";
import { Notice } from "@/components/notice";

export function ProductMediaLibraryNotice() {
  return (
    <Notice tone="note">
      Aucun média n&apos;est disponible. Ajoutez d&apos;abord une image dans{" "}
      <Link
        className="link"
        href="/admin/media">
        la bibliothèque médias
      </Link>
      .
    </Notice>
  );
}
