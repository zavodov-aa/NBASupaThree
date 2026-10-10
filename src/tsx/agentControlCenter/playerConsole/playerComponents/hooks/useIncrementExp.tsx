import { useCallback } from "react";
import { Player } from "../types/Player";

export const useIncrementExp = (
  players: Player[],
  updatePlayer: (id: number, updates: Partial<Player>) => Promise<void>,
  isMobile: boolean,
) => {
  const incrementExp = useCallback(async () => {
    const password = window.prompt(
      "Введите пароль для подтверждения повышения EXP:",
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
          const newExp =
            player.exp != null
              ? (Number(player.exp) + 1).toString()
              : undefined; // 👈 было null
          return updatePlayer(player.id, { exp: newExp });
        });

      await Promise.all(updatePromises);

      alert(
        isMobile
          ? "EXP всех игроков (кроме ID 1) успешно повышен и сохранён"
          : "✅ EXP всех игроков успешно обновлён в базе данных",
      );
    } catch (error) {
      console.error("Ошибка при сохранении EXP:", error);
      alert("❌ Ошибка при сохранении EXP. Попробуйте ещё раз.");
    }
  }, [players, updatePlayer, isMobile]);

  return incrementExp;
};
