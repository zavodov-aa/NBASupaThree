import { useCallback } from "react";
import { Player } from "../types/Player";

export const useIncrementAge = (
  players: Player[],
  updatePlayer: (id: number, updates: Partial<Player>) => Promise<void>,
  isMobile: boolean,
) => {
  const incrementAge = useCallback(async () => {
    const password = window.prompt(
      "Введите пароль для подтверждения повышения возраста:",
    );
    if (password === null) return;
    if (password !== "1") {
      alert("Неверный пароль. Операция отменена.");
      return;
    }

    try {
      const updatePromises = players
        .filter((player) => player.id !== 1)
        .map((player) => {
          const newAge =
            player.age != null ? (Number(player.age) + 1).toString() : null;
          return updatePlayer(player.id, { age: newAge });
        });

      await Promise.all(updatePromises);

      alert(
        isMobile
          ? "Возраст всех игроков (кроме ID 1) успешно повышен и сохранён"
          : "✅ Возраст всех игроков успешно обновлён в базе данных",
      );
    } catch (error) {
      console.error("Ошибка при сохранении возраста:", error);
      alert("❌ Ошибка при сохранении возраста. Попробуйте ещё раз.");
    }
  }, [players, updatePlayer, isMobile]);

  return incrementAge;
};
