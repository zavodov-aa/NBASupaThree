import { useState, useEffect, useCallback } from "react";
import { supabase } from "../../../../../Supabase"; // предполагаем, что клиент вынесен в отдельный файл

export const useArchive = () => {
  const [archiveInitialized, setArchiveInitialized] = useState(false);

  const initializeArchiveTable = useCallback(async (): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from("Archive_players_years_money")
        .select("id")
        .limit(1);

      if (error) {
        console.warn(
          "Архивная таблица требует настройки. Пожалуйста, создайте таблицу через SQL Editor:",
        );
        console.warn(`
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
);`);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Ошибка при инициализации архивной таблицы:", error);
      return false;
    }
  }, []);

  useEffect(() => {
    initializeArchiveTable().then(setArchiveInitialized);
  }, [initializeArchiveTable]);

  return { archiveInitialized, initializeArchiveTable };
};
