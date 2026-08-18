import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/shared/ui/button/Button";

export interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

type PageItem = number | "start-ellipsis" | "end-ellipsis";

const getPageItems = (page: number, pageCount: number): PageItem[] => {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }

  if (page <= 4) return [1, 2, 3, 4, 5, "end-ellipsis", pageCount];
  if (page >= pageCount - 3) {
    return [
      1,
      "start-ellipsis",
      pageCount - 4,
      pageCount - 3,
      pageCount - 2,
      pageCount - 1,
      pageCount,
    ];
  }

  return [
    1,
    "start-ellipsis",
    page - 1,
    page,
    page + 1,
    "end-ellipsis",
    pageCount,
  ];
};

export const Pagination = ({
  page,
  pageSize,
  total,
  onPageChange,
  disabled = false,
}: PaginationProps) => {
  const pageCount = Math.max(1, Math.ceil(total / Math.max(1, pageSize)));
  const currentPage = Math.min(Math.max(1, page), pageCount);
  const start = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, total);

  return (
    <nav
      className="flex flex-col gap-3 border-t border-slate-150 px-4 py-3 sm:flex-row sm:items-center sm:justify-between dark:border-navy-600"
      aria-label="Pagination"
    >
      <p className="text-xs text-slate-500 dark:text-navy-300">
        Showing {start}–{end} of {total}
      </p>

      <div className="flex flex-wrap items-center gap-1">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled || currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          leftIcon={<ChevronLeft className="size-3.5" />}
        >
          Previous
        </Button>

        {getPageItems(currentPage, pageCount).map((item) =>
          typeof item === "number" ? (
            <Button
              key={item}
              type="button"
              variant={item === currentPage ? "primary" : "ghost"}
              size="sm"
              className="min-w-8 px-2"
              disabled={disabled}
              aria-current={item === currentPage ? "page" : undefined}
              aria-label={`Go to page ${item}`}
              onClick={() => onPageChange(item)}
            >
              {item}
            </Button>
          ) : (
            <span
              key={item}
              className="px-1 text-sm text-slate-400 dark:text-navy-400"
              aria-hidden="true"
            >
              …
            </span>
          ),
        )}

        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled || currentPage >= pageCount}
          onClick={() => onPageChange(currentPage + 1)}
          rightIcon={<ChevronRight className="size-3.5" />}
        >
          Next
        </Button>
      </div>
    </nav>
  );
};

