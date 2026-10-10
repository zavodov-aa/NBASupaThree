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

  retention: string;
  dead_cap_team: string;
  dc_year_one: string;
  dc_year_two: string;
  dc_year_three: string;
  dc_year_four: string;
  dc_year_five: string;
};

interface MassShiftDCModalProps {
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

const MassShiftDCModal: React.FC<MassShiftDCModalProps> = ({
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

  // Функция сохранения в архив для DC-полей
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
          dc_year_one: originalData.dc_year_one || null,
          dc_year_two: originalData.dc_year_two || null,
          dc_year_three: originalData.dc_year_three || null,
          dc_year_four: originalData.dc_year_four || null,
          dc_year_five: originalData.dc_year_five || null,
          team: playerInfo.team,
          backup_date: new Date().toISOString(),
          operation: "mass_shift_dc",
          original_values: originalData,
          backup_values: backupData,
          metadata: {
            player_count: players.length,
            operation_timestamp: new Date().toISOString(),
            user_agent: navigator.userAgent,
          },
        };

        const { error } = await supabase
          .from("Archive_dc_players_years_money")
          .insert([archiveRecord]);

        if (error) {
          console.error("Ошибка при сохранении в архив DC:", error);
          // fallback – сохраняем только основные поля
          const fallbackRecord = {
            player_id: playerId,
            active_roster: playerInfo.active_roster,
            dc_year_one: originalData.dc_year_one || null,
            dc_year_two: originalData.dc_year_two || null,
            dc_year_three: originalData.dc_year_three || null,
            dc_year_four: originalData.dc_year_four || null,
            dc_year_five: originalData.dc_year_five || null,
            team: playerInfo.team,
            backup_date: new Date().toISOString(),
            operation: "mass_shift_dc",
          };
          const { error: fallbackError } = await supabase
            .from("Archive_dc_players_years_money")
            .insert([fallbackRecord]);
          return !fallbackError;
        }
        return true;
      } catch (error) {
        console.error("Критическая ошибка при сохранении в архив DC:", error);
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
      ? "Вы уверены? Это действие затронет всех игроков и создаст архивную копию DC-данных."
      : `Вы уверены, что хотите выполнить массовый перенос DC-данных для ${players.length} игроков?\n\nВсе исходные данные будут сохранены в архивной таблице "Archive_dc_players_years_money".`;

    if (!showConfirm(confirmationMessage)) {
      return;
    }

    setIsProcessing(true);

    try {
      const archiveResults: Promise<boolean>[] = [];
      const updatedPlayers: Player[] = [];

      for (const player of players) {
        const originalData = {
          dc_year_one: player.dc_year_one,
          dc_year_two: player.dc_year_two,
          dc_year_three: player.dc_year_three,
          dc_year_four: player.dc_year_four,
          dc_year_five: player.dc_year_five,
        };

        // Сдвиг данных
        const dcYearTwo = parseFormattedValue(player.dc_year_two || "");
        const dcYearThree = parseFormattedValue(player.dc_year_three || "");
        const dcYearFour = parseFormattedValue(player.dc_year_four || "");
        const dcYearFive = parseFormattedValue(player.dc_year_five || "");

        const backupData = {
          dc_year_one: dcYearTwo,
          dc_year_two: dcYearThree,
          dc_year_three: dcYearFour,
          dc_year_four: dcYearFive,
          dc_year_five: "",
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
          dc_year_one: dcYearTwo,
          dc_year_two: dcYearThree,
          dc_year_three: dcYearFour,
          dc_year_four: dcYearFive,
          dc_year_five: "",
        });
      }

      const archiveSettled = await Promise.allSettled(archiveResults);
      const successfulArchives = archiveSettled.filter(
        (res) => res.status === "fulfilled" && res.value,
      ).length;

      console.log(
        `Архивация DC: ${successfulArchives} успешно из ${players.length}`,
      );

      // Если архивация не удалась – спрашиваем, продолжать ли
      if (successfulArchives === 0) {
        const continueWithoutArchive = showConfirm(
          "Не удалось сохранить данные в архив DC.\n\nПродолжить обновление без архивации?",
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
        ? `Перенос DC-данных завершен!\nСохранено в архив: ${successfulArchives}/${players.length}`
        : `✅ Массовый перенос DC-данных успешно завершен!\n\n` +
          `📊 Статистика:\n` +
          `• Обработано игроков: ${players.length}\n` +
          `• Успешно заархивировано: ${successfulArchives}\n` +
          `• Обновлено записей: ${updatedPlayers.length}\n\n` +
          `📝 Изменения:\n` +
          `• DC YEAR TWO → DC YEAR ONE\n` +
          `• DC YEAR THREE → DC YEAR TWO\n` +
          `• DC YEAR FOUR → DC YEAR THREE\n` +
          `• DC YEAR FIVE → DC YEAR FOUR\n` +
          `• DC YEAR FIVE очищен\n\n` +
          (successfulArchives === players.length
            ? "✅ Все данные сохранены в архивной таблице 'Archive_dc_players_years_money'"
            : `⚠️ В архив сохранено ${successfulArchives} из ${players.length} записей`);

      showAlert(successMessage);
      onSuccess(updatedPlayers);
    } catch (error) {
      console.error(
        "Критическая ошибка при массовом переносе DC-данных:",
        error,
      );
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
            ? "Confirm Mass DC Transfer"
            : "Подтверждение массового переноса DC-данных"}
        </div>
        <p className="playersRosterAgentControlCenter-modalDescription">
          {isMobile ? (
            <>
              Enter password "1" to confirm MASS DC contract data transfer for
              ALL players.
              <br />
              <br />
              <strong>Backup will be saved to Archive DC table</strong>
              <br />
              <strong className="playersRosterAgentControlCenter-warningText">
                This action cannot be undone!
              </strong>
            </>
          ) : (
            <>
              Введите пароль для подтверждения МАССОВОГО переноса DC-данных
              контракта для ВСЕХ игроков ({players.length} игроков).
              <br />
              <br />
              <strong>Будет выполнено:</strong>
              <br />
              • DC YEAR TWO → DC YEAR ONE (исходный DC YEAR ONE сохранится в
              архив)
              <br />
              • DC YEAR THREE → DC YEAR TWO (исходный DC YEAR TWO сохранится в
              архив)
              <br />
              • DC YEAR FOUR → DC YEAR THREE (исходный DC YEAR THREE сохранится
              в архив)
              <br />
              • DC YEAR FIVE → DC YEAR FOUR (исходный DC YEAR FOUR сохранится в
              архив)
              <br />
              • DC YEAR FIVE станет пустым
              <br />
              <br />
              <strong>Архивация:</strong>
              <br />
              • Все исходные данные будут сохранены в таблице
              "Archive_dc_players_years_money"
              <br />
              • Сохраняемые поля: active_roster, dc_year_one, dc_year_two,
              dc_year_three, dc_year_four, dc_year_five, team
              <br />
              • Будет записано время операции и идентификатор игрока
              <br />
              {!archiveInitialized && (
                <>
                  <br />
                  <strong className="playersRosterAgentControlCenter-warningText">
                    ⚠️ ВНИМАНИЕ: Архивная таблица DC не настроена!
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
                : "Подтвердить массовый перенос DC"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MassShiftDCModal;
