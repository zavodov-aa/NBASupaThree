import { useState, useCallback, useMemo } from "react";
import { Player } from "../types/Player";
import { initialColumns, allColumns, columnGroups } from "../constants/columns";

export const useColumnVisibility = () => {
  const [visibleColumns, setVisibleColumns] = useState<Set<keyof Player>>(
    new Set(initialColumns),
  );

  const toggleColumn = useCallback((column: keyof Player) => {
    setVisibleColumns((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(column)) {
        newSet.delete(column);
      } else {
        newSet.add(column);
      }
      return newSet;
    });
  }, []);

  const selectAll = useCallback(() => {
    setVisibleColumns(new Set(allColumns));
  }, []);

  const deselectAll = useCallback(() => {
    setVisibleColumns(new Set());
  }, []);

  const selectGroup = useCallback((columns: (keyof Player)[]) => {
    setVisibleColumns((prev) => {
      const newSet = new Set(prev);
      columns.forEach((col) => newSet.add(col));
      return newSet;
    });
  }, []);

  const deselectGroup = useCallback((columns: (keyof Player)[]) => {
    setVisibleColumns((prev) => {
      const newSet = new Set(prev);
      columns.forEach((col) => newSet.delete(col));
      return newSet;
    });
  }, []);

  const visibleColumnsArray = useMemo(
    () => Array.from(visibleColumns),
    [visibleColumns],
  );

  const visibleColumnsWithoutId = useMemo(
    () => Array.from(visibleColumns).filter((col) => col !== "id"),
    [visibleColumns],
  );

  return {
    visibleColumns,
    visibleColumnsArray,
    visibleColumnsWithoutId,
    toggleColumn,
    selectAll,
    deselectAll,
    selectGroup,
    deselectGroup,
    columnGroups,
  };
};
