import { useCallback } from "react";

export const useMassShiftDC = (
  archiveInitialized: boolean,
  isMobile: boolean,
  onOpenModal: () => void,
) => {
  const handleShiftClick = useCallback(async () => {
    if (!archiveInitialized) {
      const warningMessage = isMobile
        ? "Архивная таблица для DC данных не настроена. Настроить?"
        : '⚠️ ВНИМАНИЕ: Архивная таблица "Archive_dc_players_years_money" не настроена!\n\n' +
          "Рекомендуется сначала создать таблицу для сохранения резервных копий данных DC.\n\n" +
          "Создать таблицу через SQL Editor? (Рекомендуется для безопасности данных)";

      if (window.confirm(warningMessage)) {
        const sqlCommand = `
CREATE TABLE IF NOT EXISTS Archive_dc_players_years_money (
  id BIGSERIAL PRIMARY KEY,
  player_id INTEGER NOT NULL,
  active_roster VARCHAR(50),
  dc_year_one TEXT,
  dc_year_two TEXT,
  dc_year_three TEXT,
  dc_year_four TEXT,
  dc_year_five TEXT,
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
            : `📋 SQL команда для создания архивной таблицы DC:\n\n${sqlCommand}\n\n` +
                `Инструкция:\n` +
                `1. Откройте Supabase Dashboard\n` +
                `2. Перейдите в SQL Editor\n` +
                `3. Вставьте команду и выполните\n` +
                `4. После создания таблицы повторите операцию`,
        );

        await navigator.clipboard.writeText(sqlCommand);
      }
      return;
    }

    onOpenModal();
  }, [archiveInitialized, isMobile, onOpenModal]);

  return handleShiftClick;
};
