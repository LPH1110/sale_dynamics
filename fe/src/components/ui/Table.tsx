import React, { useMemo, useState } from 'react';
import clsx from 'clsx';

export interface Column<T> {
  header: React.ReactNode;
  className?: string;
  headerClassName?: string;
  render: (item: T, index: number) => React.ReactNode;
}

export interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string | number;
  rowClassName?: (item: T) => string;

  // Selection props
  selectable?: boolean;
  checkedRows?: (string | number)[];
  onCheckRow?: (item: T, isChecked: boolean) => void;
  onCheckAll?: (isChecked: boolean) => void;
  isRowSelectionDisabled?: (item: T) => boolean;

  // Layout customization
  containerHeightClass?: string; // e.g. "h-[500px]"
}

export function Table<T>({
  data,
  columns,
  keyExtractor,
  rowClassName,
  selectable = false,
  checkedRows,
  onCheckRow,
  onCheckAll,
  isRowSelectionDisabled,
  containerHeightClass = 'flex-1 min-h-0',
}: TableProps<T>) {
  const [internalCheckedRows, setInternalCheckedRows] = useState<(string | number)[]>([]);

  const activeCheckedRows = checkedRows ?? internalCheckedRows;

  const checkableRows = isRowSelectionDisabled
    ? data.filter((item) => !isRowSelectionDisabled(item))
    : data;

  const checkableKeys = useMemo(
    () => checkableRows.map((item) => keyExtractor(item)),
    [checkableRows, keyExtractor]
  );

  const isAllChecked =
    checkableRows.length > 0 &&
    checkableRows.every((item) => activeCheckedRows.includes(keyExtractor(item)));

  const handleCheckAll = (isChecked: boolean) => {
    if (onCheckAll) {
      onCheckAll(isChecked);
      return;
    }

    if (isChecked) {
      setInternalCheckedRows(checkableKeys);
    } else {
      setInternalCheckedRows([]);
    }
  };

  const handleCheckRow = (item: T, isChecked: boolean) => {
    if (onCheckRow) {
      onCheckRow(item, isChecked);
      return;
    }

    const itemKey = keyExtractor(item);
    setInternalCheckedRows((prev) => {
      if (isChecked) {
        return prev.includes(itemKey) ? prev : [...prev, itemKey];
      }
      return prev.filter((key) => key !== itemKey);
    });
  };

  return (
    <div className={clsx('flex flex-col overflow-hidden', containerHeightClass)}>
      <div className="flex-1 overflow-auto">
        <table className="w-full border-collapse text-left text-sm text-neutral-600 dark:text-neutral-300">
          <thead className="bg-neutral-50 dark:bg-neutral-800/50 text-neutral-700 dark:text-neutral-300 font-semibold border-b border-neutral-200 dark:border-neutral-800 sticky top-0 z-10">
            <tr>
              {selectable && (
                <th className="p-4 w-12 text-center bg-neutral-50 dark:bg-neutral-850">
                  <input
                    type="checkbox"
                    checked={isAllChecked}
                    onChange={(e) => handleCheckAll(e.target.checked)}
                    className="w-4 h-4 text-brand-600 border-neutral-300 rounded-sm focus:ring-brand-500"
                  />
                </th>
              )}
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={clsx(
                    'p-4 bg-neutral-50 dark:bg-neutral-850',
                    col.headerClassName
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {data.map((item, rowIdx) => {
              const itemKey = keyExtractor(item);
              const isRowChecked = activeCheckedRows.includes(itemKey);
              const isDisabled = isRowSelectionDisabled?.(item) ?? false;
              const customRowClass = rowClassName?.(item);

              return (
                <tr
                  key={itemKey}
                  className={clsx(
                    'hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors duration-150',
                    isRowChecked && 'bg-brand-50/20 dark:bg-brand-950/10',
                    customRowClass
                  )}
                >
                  {selectable && (
                    <td className="p-4 text-center">
                      <input
                        type="checkbox"
                        checked={isRowChecked}
                        disabled={isDisabled}
                        onChange={(e) => handleCheckRow(item, e.target.checked)}
                        className="w-4 h-4 text-brand-600 border-neutral-300 rounded-sm focus:ring-brand-500 disabled:opacity-40"
                      />
                    </td>
                  )}
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className={clsx('p-4', col.className)}>
                      {col.render(item, rowIdx)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Table;
