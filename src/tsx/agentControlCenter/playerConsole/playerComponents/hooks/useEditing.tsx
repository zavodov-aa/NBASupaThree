import { useState, useCallback } from "react";
import { Player } from "../types/Player";
import {
  formatValueWithSpaces,
  parseFormattedValue,
  applyInputMask,
  isYearColumn,
} from "../utils/formatting";

export const useEditing = (
  updatePlayer: (id: number, updates: Partial<Player>) => Promise<void>,
  players: Player[],
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>,
) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<Player>>({});

  const startEdit = useCallback(
    (player: Player) => {
      setEditingId(player.id);
      const formattedEditData: Partial<Player> = { ...player };
      (
        [
          "year_one",
          "year_two",
          "year_three",
          "year_four",
          "year_five",
        ] as const
      ).forEach((col) => {
        if (player[col]) {
          formattedEditData[col] = formatValueWithSpaces(player[col]);
        }
      });
      setEditData(formattedEditData);
    },
    [formatValueWithSpaces],
  );

  const handleEditDataChange = useCallback(
    (field: keyof Player, value: string) => {
      let formattedValue = value;

      if (isYearColumn(field)) {
        const maskedValue = applyInputMask(
          value,
          (editData[field] as string) || "",
        );
        formattedValue = formatValueWithSpaces(maskedValue);
      }

      setEditData((prev) => ({ ...prev, [field]: formattedValue }));
    },
    [editData, applyInputMask, formatValueWithSpaces, isYearColumn],
  );

  const saveEdit = useCallback(async () => {
    if (!editingId) return;

    const dataToSave = { ...editData };
    (
      ["year_one", "year_two", "year_three", "year_four", "year_five"] as const
    ).forEach((col) => {
      if (dataToSave[col] !== undefined) {
        dataToSave[col] = parseFormattedValue(dataToSave[col] as string);
      }
    });

    await updatePlayer(editingId, dataToSave);
    setEditingId(null);
    setEditData({});
  }, [editingId, editData, updatePlayer, parseFormattedValue]);

  const cancelEdit = useCallback(() => {
    setEditingId(null);
    setEditData({});
  }, []);

  return {
    editingId,
    editData,
    setEditData,
    startEdit,
    handleEditDataChange,
    saveEdit,
    cancelEdit,
  };
};
