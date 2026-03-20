import { useState, useMemo, useCallback } from "react";
import { Player } from "../types/Player";
import { initialFilters } from "../constants/initialState";
import { safeStringCompare } from "../utils/validation";

export const useFilters = (players: Player[]) => {
  const [filters, setFilters] = useState(initialFilters);

  const handleFilterChange = useCallback((field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field as keyof typeof prev]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, []);

  const filteredPlayers = useMemo(() => {
    let result = players;

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        result = result.filter((player) =>
          safeStringCompare(player[key as keyof Player], value),
        );
      }
    });

    return result;
  }, [filters, players]);

  return {
    filters,
    handleFilterChange,
    resetFilters,
    filteredPlayers,
  };
};
