import React, { useState, useCallback } from "react";
import { SupabaseClient } from "@supabase/supabase-js";
import "./playerConsoleAdminArchiveComp.css";
import "../../playerConsoleAdminBody.css";

type Player = {
  id: number;
  active_roster: string;
  position: string;
  pos_elig: string;
  age: string | null;
  year_one: string | null;
  year_two: string | null;
  year_three: string | null;
  year_four: string | null;
  year_five: string | null;
  opt: string;
  status: string;
  exp: string;
  bird: string;
  awards: string;
  team: string;
  g_league: string;
  rating: string;
  rokie: string;

  // -----------
  retention: string;
  dead_cap_team: string;
  dc_year_one: string;
  dc_year_two: string;
  dc_year_three: string;
  dc_year_four: string;
  dc_year_five: string;
};

interface MassShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  players: Player[];
  supabase: SupabaseClient;
  archiveInitialized: boolean;
  isMobile?: boolean;
  showConfirm: (message: string) => boolean;
  showAlert: (message: string) => void;
  onSuccess: (updatedPlayers: Player[]) => void;
  onError: (error: Error) => void;
}

const MassShiftModal: React.FC<MassShiftModalProps> = ({
  isOpen,
  onClose,
  players,
  supabase,
  archiveInitialized,
  isMobile = false,
  showConfirm,
  showAlert,
  onSuccess,
  onError,
}) => {
  const [password, setPassword] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Вспомогательная функция для очистки форматированных чисел (убирает пробелы)
  const parseFormattedValue = useCallback((formattedValue: string): string => {
    if (!formattedValue) return "";
    // Если есть буквы – не трогаем
    if (/[^-\d.\s]/.test(formattedValue)) return formattedValue;
    return formattedValue.replace(/\s/g, "");
  }, []);

  // Функция сохранения в архив
  const saveToArchive = useCallback(
    async (
      playerId: number,
      originalData: Record<string, any>,
      backupData: Record<string, any>,
      playerInfo: { active_roster: string; team: string },
    ): Promise<boolean> => {
      try {
        const archiveRecord = {
          player_id: playerId,
          active_roster: playerInfo.active_roster,
          year_one: originalData.year_one || null,
          year_two: originalData.year_two || null,
          year_three: originalData.year_three || null,
          year_four: originalData.year_four || null,
          year_five: originalData.year_five || null,
          team: playerInfo.team,
          backup_date: new Date().toISOString(),
          operation: "mass_shift",
          original_values: originalData,
          backup_values: backupData,
          metadata: {
            player_count: players.length,
            operation_timestamp: new Date().toISOString(),
            user_agent: navigator.userAgent,
          },
        };

        const { error } = await supabase
          .from("Archive_players_years_money")
          .insert([archiveRecord]);

        if (error) {
          console.error("Ошибка при сохранении в архив:", error);
          // fallback – сохраняем только основные поля
          const fallbackRecord = {
            player_id: playerId,
            active_roster: playerInfo.active_roster,
            year_one: originalData.year_one || null,
            year_two: originalData.year_two || null,
            year_three: originalData.year_three || null,
            year_four: originalData.year_four || null,
            year_five: originalData.year_five || null,
            team: playerInfo.team,
            backup_date: new Date().toISOString(),
            operation: "mass_shift",
          };
          const { error: fallbackError } = await supabase
            .from("Archive_players_years_money")
            .insert([fallbackRecord]);
          return !fallbackError;
        }
        return true;
      } catch (error) {
        console.error("Критическая ошибка при сохранении в архив:", error);
        return false;
      }
    },
    [players.length, supabase],
  );

  const handleConfirm = async () => {
    if (password !== "1") {
      showAlert(
        isMobile
          ? "Неверный пароль! Введите цифру '1' для подтверждения."
          : "Неверный пароль! Введите цифру '1' для подтверждения.",
      );
      return;
    }

    const confirmationMessage = isMobile
      ? "Вы уверены? Это действие затронет всех игроков и создаст архивную копию."
      : `Вы уверены, что хотите выполнить массовый перенос данных для ${players.length} игроков?\n\nВсе исходные данные будут сохранены в архивной таблице "Archive_players_years_money".`;

    if (!showConfirm(confirmationMessage)) {
      return;
    }

    setIsProcessing(true);

    try {
      const archiveResults: Promise<boolean>[] = [];
      const updatedPlayers: Player[] = [];

      for (const player of players) {
        const originalData = {
          year_one: player.year_one,
          year_two: player.year_two,
          year_three: player.year_three,
          year_four: player.year_four,
          year_five: player.year_five,
        };

        // Сдвиг данных
        const yearTwo = parseFormattedValue(player.year_two || "");
        const yearThree = parseFormattedValue(player.year_three || "");
        const yearFour = parseFormattedValue(player.year_four || "");
        const yearFive = parseFormattedValue(player.year_five || "");

        const backupData = {
          year_one: yearTwo,
          year_two: yearThree,
          year_three: yearFour,
          year_four: yearFive,
          year_five: "",
        };

        const playerInfo = {
          active_roster: player.active_roster,
          team: player.team,
        };

        // Архивируем
        archiveResults.push(
          saveToArchive(player.id, originalData, backupData, playerInfo),
        );

        // Формируем обновлённого игрока
        updatedPlayers.push({
          ...player,
          year_one: yearTwo,
          year_two: yearThree,
          year_three: yearFour,
          year_four: yearFive,
          year_five: "",
        });
      }

      const archiveSettled = await Promise.allSettled(archiveResults);
      const successfulArchives = archiveSettled.filter(
        (res) => res.status === "fulfilled" && res.value,
      ).length;

      console.log(
        `Архивация: ${successfulArchives} успешно из ${players.length}`,
      );

      // Если архивация не удалась – спрашиваем, продолжать ли
      if (successfulArchives === 0) {
        const continueWithoutArchive = showConfirm(
          "Не удалось сохранить данные в архив.\n\nПродолжить обновление без архивации?",
        );
        if (!continueWithoutArchive) {
          setIsProcessing(false);
          onClose();
          return;
        }
      }

      // Обновляем записи в Supabase
      const { error: updateError } = await supabase
        .from("Players")
        .upsert(updatedPlayers);

      if (updateError) {
        throw new Error(`Ошибка обновления: ${updateError.message}`);
      }

      // Успех
      const successMessage = isMobile
        ? `Перенос завершен!\nСохранено в архив: ${successfulArchives}/${players.length}`
        : `✅ Массовый перенос данных успешно завершен!\n\n` +
          `📊 Статистика:\n` +
          `• Обработано игроков: ${players.length}\n` +
          `• Успешно заархивировано: ${successfulArchives}\n` +
          `• Обновлено записей: ${updatedPlayers.length}\n\n` +
          `📝 Изменения:\n` +
          `• YEAR TWO → YEAR ONE\n` +
          `• YEAR THREE → YEAR TWO\n` +
          `• YEAR FOUR → YEAR THREE\n` +
          `• YEAR FIVE → YEAR FOUR\n` +
          `• YEAR FIVE очищен\n\n` +
          (successfulArchives === players.length
            ? "✅ Все данные сохранены в архивной таблице 'Archive_players_years_money'"
            : `⚠️ В архив сохранено ${successfulArchives} из ${players.length} записей`);

      showAlert(successMessage);
      onSuccess(updatedPlayers);
    } catch (error) {
      console.error("Критическая ошибка при массовом переносе:", error);
      onError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isProcessing) {
      handleConfirm();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="playersRosterAgentControlCenter-modalOverlay">
      <div className="playersRosterAgentControlCenter-modalContent">
        <div className="playersRosterAgentControlCenter-modalTitle">
          {isMobile
            ? "Confirm Mass Transfer"
            : "Подтверждение массового переноса данных"}
        </div>
        <p className="playersRosterAgentControlCenter-modalDescription">
          {isMobile ? (
            <>
              Enter password "1" to confirm MASS contract data transfer for ALL
              players.
              <br />
              <br />
              <strong>Backup will be saved to Archive table</strong>
              <br />
              <strong className="playersRosterAgentControlCenter-warningText">
                This action cannot be undone!
              </strong>
            </>
          ) : (
            <>
              Введите пароль для подтверждения МАССОВОГО переноса данных
              контракта для ВСЕХ игроков ({players.length} игроков).
              <br />
              <br />
              <strong>Будет выполнено:</strong>
              <br />
              • YEAR TWO → YEAR ONE (исходный YEAR ONE сохранится в архив)
              <br />
              • YEAR THREE → YEAR TWO (исходный YEAR TWO сохранится в архив)
              <br />
              • YEAR FOUR → YEAR THREE (исходный YEAR THREE сохранится в архив)
              <br />
              • YEAR FIVE → YEAR FOUR (исходный YEAR FOUR сохранится в архив)
              <br />
              • YEAR FIVE станет пустым
              <br />
              <br />
              <strong>Архивация:</strong>
              <br />
              • Все исходные данные будут сохранены в таблице
              "Archive_players_years_money"
              <br />
              • Сохраняемые поля: active_roster, year_one, year_two, year_three,
              year_four, year_five, team
              <br />
              • Будет записано время операции и идентификатор игрока
              <br />
              {!archiveInitialized && (
                <>
                  <br />
                  <strong className="playersRosterAgentControlCenter-warningText">
                    ⚠️ ВНИМАНИЕ: Архивная таблица не настроена!
                    <br />
                    Рекомендуется сначала создать таблицу.
                  </strong>
                </>
              )}
              <br />
              <br />
              <strong className="playersRosterAgentControlCenter-warningText">
                ВНИМАНИЕ: Это действие затронет всех игроков и не может быть
                отменено!
              </strong>
            </>
          )}
        </p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={isMobile ? "Enter password..." : "Введите пароль..."}
          className="playersRosterAgentControlCenter-modalInput"
          onKeyPress={handleKeyPress}
          disabled={isProcessing}
          autoFocus
        />
        <div className="playersRosterAgentControlCenter-modalButtons">
          <button
            onClick={onClose}
            className="playersRosterAgentControlCenter-button"
            disabled={isProcessing}
          >
            {isMobile ? "Cancel" : "Отмена"}
          </button>
          <button
            onClick={handleConfirm}
            className="playersRosterAgentControlCenter-button playersRosterAgentControlCenter-primaryButton"
            disabled={isProcessing}
          >
            {isProcessing
              ? isMobile
                ? "Processing..."
                : "Выполняется..."
              : isMobile
                ? "Confirm"
                : "Подтвердить массовый перенос"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MassShiftModal;
