import React, { useState } from 'react';
import { AdjustmentsHorizontalIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Card from './Card';
import Button from './Button';
import Pagination from './Pagination';
import Spinner from './Spinner';
import Table, { Column } from './Table';

interface DataTableSectionProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string | number;
  rowClassName?: (item: T) => string;
  selectable?: boolean;
  checkedRows?: (string | number)[];
  onCheckRow?: (item: T, isChecked: boolean) => void;
  onCheckAll?: (isChecked: boolean) => void;
  isRowSelectionDisabled?: (item: T) => boolean;
  isLoading?: boolean;
  emptyTitle: string;
  emptyDescription: string;
  searchTerm?: string;
  onSearchTermChange?: (value: string) => void;
  onSearchSubmit?: () => void;
  showSearchButton?: boolean;
  searchPlaceholder?: string;
  showFilterButton?: boolean;
  onFilterClick?: () => void;
  filterContent?: React.ReactNode;
  toolbarActions?: React.ReactNode;
  toolbarClassName?: string;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalElements: number;
    pageSize: number;
    onPageChange: (page: number) => void;
  };
}

export function DataTableSection<T>({
  data,
  columns,
  keyExtractor,
  rowClassName,
  selectable = false,
  checkedRows = [],
  onCheckRow,
  onCheckAll,
  isRowSelectionDisabled,
  isLoading = false,
  emptyTitle,
  emptyDescription,
  searchTerm,
  onSearchTermChange,
  onSearchSubmit,
  showSearchButton = false,
  searchPlaceholder = 'Search...',
  showFilterButton = false,
  onFilterClick,
  filterContent,
  toolbarActions,
  toolbarClassName,
  pagination,
}: DataTableSectionProps<T>) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const hasToolbar = Boolean(onSearchTermChange || toolbarActions || showFilterButton);
  const shouldShowFilterPanel = isFilterOpen && Boolean(filterContent);

  return (
    <>
      {hasToolbar && (
        <Card className={toolbarClassName ?? 'flex flex-col sm:flex-row gap-4 items-center justify-between'}>
          {onSearchTermChange && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onSearchSubmit?.();
              }}
              className="w-full sm:max-w-md flex gap-2"
            >
              <div className="relative flex-1">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchTerm ?? ''}
                  onChange={(e) => onSearchTermChange(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-950 dark:text-neutral-200 focus:outline-hidden focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                />
              </div>
              {showSearchButton && (
                <Button type="submit" variant="secondary">
                  Search
                </Button>
              )}
            </form>
          )}

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {toolbarActions}
            {showFilterButton && (filterContent || onFilterClick) && (
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => {
                  if (onFilterClick) {
                    onFilterClick();
                    return;
                  }
                  setIsFilterOpen((prev) => !prev);
                }}
              >
                <AdjustmentsHorizontalIcon className="w-4 h-4" /> Filter
              </Button>
            )}
          </div>
        </Card>
      )}

      {shouldShowFilterPanel && (
        <Card className="p-4">
          {filterContent}
        </Card>
      )}

      <Card className="p-0 overflow-hidden flex-1 min-h-0 flex flex-col">
        {isLoading ? (
          <div className="h-64 flex items-center justify-center">
            <Spinner className="w-8 h-8 text-brand-600 animate-spin" />
          </div>
        ) : data.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-neutral-500">
            <p className="text-sm font-semibold">{emptyTitle}</p>
            <p className="text-xs mt-1">{emptyDescription}</p>
          </div>
        ) : (
          <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
            <Table
              data={data}
              columns={columns}
              keyExtractor={keyExtractor}
              rowClassName={rowClassName}
              selectable={selectable}
              checkedRows={checkedRows}
              onCheckRow={onCheckRow}
              onCheckAll={onCheckAll}
              isRowSelectionDisabled={isRowSelectionDisabled}
            />
            {pagination && data.length > 0 && (
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                totalElements={pagination.totalElements}
                pageSize={pagination.pageSize}
                onPageChange={pagination.onPageChange}
              />
            )}
          </div>
        )}
      </Card>
    </>
  );
}

export default DataTableSection;
