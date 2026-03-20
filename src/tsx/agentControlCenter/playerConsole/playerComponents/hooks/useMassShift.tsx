import { useCallback } from "react";

export const useMassShift = (
  archiveInitialized: boolean,
  isMobile: boolean,
  onOpenModal: () => void,
) => {
  const handleShiftClick = useCallback(async () => {
    if (!archiveInitialized) {
      const warningMessage = isMobile
        ? "Архивная таблица не настроена. Настроить?"
        : '⚠️ ВНИМАНИЕ: Архивная таблица "Archive_players_years_money" не настроена!\n\n' +
          "Рекомендуется сначала создать таблицу для сохранения резервных копий данных.\n\n" +
          "Создать таблицу через SQL Editor? (Рекомендуется для безопасности данных)";

      if (window.confirm(warningMessage)) {
        const sqlCommand = `
CREATE TABLE IF NOT EXISTS Archive_players_years_money (
  id BIGSERIAL PRIMARY KEY,
  player_id INTEGER NOT NULL,
  active_roster VARCHAR(50),
  year_one TEXT,
  year_two TEXT,
  year_three TEXT,
  year_four TEXT,
  year_five TEXT,
  team VARCHAR(255),
  backup_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  operation VARCHAR(50) NOT NULL,
  original_values JSONB,
  backup_values JSONB,
  metadata JSONB DEFAULT '{}'::jsonb
);`;

        window.alert(
          isMobile
            ? "Скопируйте SQL команду для создания таблицы:"
            : `📋 SQL команда для создания архивной таблицы:\n\n${sqlCommand}\n\n` +
                `Инструкция:\n` +
                `1. Откройте Supabase Dashboard\n` +
                `2. Перейдите в SQL Editor\n` +
                `3. Вставьте команду и выполните\n` +
                `4. После создания таблицы повторите операцию`,
        );

        await navigator.clipboard.writeText(sqlCommand);
      }
      return; // не открываем модалку
    }

    // Если архив инициализирован, открываем модалку
    onOpenModal();
  }, [archiveInitialized, isMobile, onOpenModal]);

  return handleShiftClick;
};
