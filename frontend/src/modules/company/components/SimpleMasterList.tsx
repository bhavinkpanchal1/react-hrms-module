import type { ReactNode } from "react";
import {
  AlertTriangle,
  ListTree,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Trash2,
} from "lucide-react";
import { Button, Input, Pagination, TableRowSkeleton } from "@/shared/ui";
import EmptyState from "@/shared/ui/empty-state/EmptyState";

interface SimpleMasterRecord {
  id: number;
  name: string;
}

interface SimpleMasterListProps<T extends SimpleMasterRecord> {
  title: string;
  description: string;
  singularLabel: string;
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  search: string;
  isLoading: boolean;
  isFetching: boolean;
  error?: unknown;
  onSearchChange: (value: string) => void;
  onPageChange: (page: number) => void;
  onRetry: () => void;
  onAdd: () => void;
  onEdit?: (item: T) => void;
  onDelete: (item: T) => void;
  renderActions?: (item: T) => ReactNode;
  secondaryContent?: (item: T) => ReactNode;
  filters?: ReactNode;
  hasActiveFilters?: boolean;
  onClearFilters?: () => void;
}

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

export const SimpleMasterList = <T extends SimpleMasterRecord>({
  title,
  description,
  singularLabel,
  items,
  total,
  page,
  pageSize,
  search,
  isLoading,
  isFetching,
  error,
  onSearchChange,
  onPageChange,
  onRetry,
  onAdd,
  onEdit,
  onDelete,
  renderActions,
  secondaryContent,
  filters,
  hasActiveFilters = false,
  onClearFilters,
}: SimpleMasterListProps<T>) => (
  <div className="space-y-4">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="font-semibold text-slate-800 dark:text-navy-100">{title}</h2>
        <p className="text-sm text-slate-500 dark:text-navy-300">{description}</p>
      </div>
      <Button onClick={onAdd} leftIcon={<Plus className="size-4" />}>
        Add {singularLabel}
      </Button>
    </div>

    <div className="card p-4">
      <div className={filters ? "grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_14rem]" : undefined}>
        <Input
          aria-label={`Search ${title.toLocaleLowerCase()}`}
          placeholder={`Search ${title.toLocaleLowerCase()}`}
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          leftIcon={<Search className="size-4" />}
        />
        {filters}
      </div>
    </div>

    {error ? (
      <div className="card flex flex-col items-center gap-3 border border-error/30 p-8 text-center">
        <AlertTriangle className="size-9 text-error" />
        <div>
          <h3 className="font-semibold text-slate-800 dark:text-navy-100">
            Unable to load {title.toLocaleLowerCase()}
          </h3>
          <p className="mt-1 text-sm text-error">
            {getErrorMessage(error, "Something went wrong")}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={onRetry}
          leftIcon={<RotateCcw className="size-4" />}
          isLoading={isFetching}
        >
          Retry
        </Button>
      </div>
    ) : (
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="is-hoverable w-full text-sm">
            <thead>
              <tr className="border-b border-slate-150 dark:border-navy-600">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-navy-300">
                  {singularLabel} Name
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-navy-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-navy-600">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <TableRowSkeleton key={index} cols={2} />
                ))
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={2}>
                    <EmptyState
                      icon={ListTree}
                      title={`No ${title.toLocaleLowerCase()} found`}
                      description={
                        search || hasActiveFilters
                          ? "Try changing or clearing the current filters."
                          : `Add the first ${singularLabel} for this Company.`
                      }
                      action={
                        search || hasActiveFilters ? (
                          <Button
                            variant="outline"
                            onClick={() => {
                              onSearchChange("");
                              onClearFilters?.();
                            }}
                          >
                            Clear filters
                          </Button>
                        ) : (
                          <Button onClick={onAdd} leftIcon={<Plus className="size-4" />}>
                            Add {singularLabel}
                          </Button>
                        )
                      }
                    />
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3 font-medium text-slate-800 dark:text-navy-100">
                      <div>{item.name}</div>
                      {secondaryContent && (
                        <div className="mt-1 text-xs font-normal text-slate-400 dark:text-navy-400">
                          {secondaryContent(item)}
                        </div>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right">
                      {renderActions?.(item)}
                      {onEdit && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(item)}
                          leftIcon={<Pencil className="size-3.5" />}
                        >
                          Edit
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-error hover:bg-error/10"
                        onClick={() => onDelete(item)}
                        leftIcon={<Trash2 className="size-3.5" />}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {!isLoading && total > 0 && (
          <Pagination
            page={page}
            pageSize={pageSize}
            total={total}
            onPageChange={onPageChange}
            disabled={isFetching}
          />
        )}
      </div>
    )}
  </div>
);
