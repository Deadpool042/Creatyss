import { Button } from "@/components/ui/button";

type AdminDataTablePaginationProps = {
  currentPage: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
  previousDisabled?: boolean;
  nextDisabled?: boolean;
};

export function AdminDataTablePagination({
  currentPage,
  totalPages,
  onPrevious,
  onNext,
  previousDisabled = false,
  nextDisabled = false,
}: AdminDataTablePaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between [@media(max-height:480px)]:gap-1.5">
      <span className="text-xs sm:text-sm">
        Page {currentPage} sur {totalPages}
      </span>

      <div className="flex items-center gap-2 [@media(max-height:480px)]:gap-1.5">
        <Button
          variant="outline"
          size="sm"
          onClick={onPrevious}
          disabled={previousDisabled}
          className="[@media(max-height:480px)]:h-8 [@media(max-height:480px)]:px-2.5"
        >
          Précédent
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onNext}
          disabled={nextDisabled}
          className="[@media(max-height:480px)]:h-8 [@media(max-height:480px)]:px-2.5"
        >
          Suivant
        </Button>
      </div>
    </div>
  );
}
