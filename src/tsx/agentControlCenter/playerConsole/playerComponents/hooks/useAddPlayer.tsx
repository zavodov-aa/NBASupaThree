import { useState, useCallback } from "react";
import { Player } from "../types/Player";
import { initialNewPlayer } from "../constants/initialState";
import {
  applyInputMask,
  formatValueWithSpaces,
  isYearColumn,
  parseFormattedValue,
} from "../utils/formatting";

export const useAddPlayer = (
  addPlayer: (newPlayer: Omit<Player, "id">) => Promise<Player | undefined>,
) => {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newPlayer, setNewPlayer] =
    useState<Omit<Player, "id">>(initialNewPlayer);

  const startAdd = useCallback(() => {
    setIsAddingNew(true);
    setNewPlayer(initialNewPlayer);
  }, [initialNewPlayer]);

  const handleNewPlayerChange = useCallback(
    (field: keyof Omit<Player, "id">, value: string) => {
      let formattedValue = value;

      if (isYearColumn(field)) {
        const maskedValue = applyInputMask(
          value,
          (newPlayer[field] as string) || "",
        );
        formattedValue = formatValueWithSpaces(maskedValue);
      }

      setNewPlayer((prev) => ({ ...prev, [field]: formattedValue }));
    },
    [newPlayer, applyInputMask, formatValueWithSpaces, isYearColumn],
  );

  const addNewPlayer = useCallback(async () => {
    const playerToAdd = { ...newPlayer };
    (
      ["year_one", "year_two", "year_three", "year_four", "year_five"] as const
    ).forEach((col) => {
      if (playerToAdd[col] !== undefined) {
        playerToAdd[col] = parseFormattedValue(playerToAdd[col] as string);
      }
    });

    await addPlayer(playerToAdd);
    setIsAddingNew(false);
    setNewPlayer(initialNewPlayer);
  }, [newPlayer, addPlayer, parseFormattedValue, initialNewPlayer]);

  const cancelAdd = useCallback(() => {
    setIsAddingNew(false);
    setNewPlayer(initialNewPlayer);
  }, [initialNewPlayer]);

  return {
    isAddingNew,
    newPlayer,
    setNewPlayer,
    startAdd,
    handleNewPlayerChange,
    addNewPlayer,
    cancelAdd,
  };
};
