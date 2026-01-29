// export default PlayersRosterAgentControlCenter;
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { createClient } from "@supabase/supabase-js";
import "./playersRosterAgentControlCenter.css";
import logo from "../../img/LogoLeague4kFinal.png";

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
  exp: string;
  bird: string;
  awards: string;
  team: string;
  g_league: string;
  rating: string;
  rokie: string;
};

type ArchiveRecord = {
  id?: number;
  player_id: number;
  active_roster: string;
  year_one: string | null;
  year_two: string | null;
  year_three: string | null;
  year_four: string | null;
  year_five: string | null;
  team: string;
  backup_date: string;
  operation: string;
  original_values?: Record<string, any>;
  backup_values?: Record<string, any>;
  metadata?: Record<string, any>;
};

const supabase = createClient(
  "https://sgbsefgldsmzbvzvpjxt.supabase.co",
  "sb_publishable_Xl99x3YkZHWgS8l-qBSmCg_gXF_Gpcp"
);

const NBA_TEAMS = [
  "Atlanta Hawks",
  "Boston Celtics",
  "Brooklyn Nets",
  "Charlotte Hornets",
  "Chicago Bulls",
  "Cleveland Cavaliers",
  "Dallas Mavericks",
  "Denver Nuggets",
  "Detroit Pistons",
  "Golden State Warriors",
  "Houston Rockets",
  "Indiana Pacers",
  "LA Clippers",
  "Los Angeles Lakers",
  "Memphis Grizzlies",
  "Miami Heat",
  "Milwaukee Bucks",
  "Minnesota Timberwolves",
  "New Orleans Pelicans",
  "New York Knicks",
  "Oklahoma City Thunder",
  "Orlando Magic",
  "Philadelphia 76ers",
  "Phoenix Suns",
  "Portland Trail Blazers",
  "Sacramento Kings",
  "San Antonio Spurs",
  "Toronto Raptors",
  "Utah Jazz",
  "Washington Wizards",
  "None",
];

const G_LEAGUE_TEAMS = [
  "Atlanta Hawks",
  "Boston Celtics",
  "Brooklyn Nets",
  "Charlotte Hornets",
  "Chicago Bulls",
  "Cleveland Cavaliers",
  "Dallas Mavericks",
  "Denver Nuggets",
  "Detroit Pistons",
  "Golden State Warriors",
  "Houston Rockets",
  "Indiana Pacers",
  "LA Clippers",
  "Los Angeles Lakers",
  "Memphis Grizzlies",
  "Miami Heat",
  "Milwaukee Bucks",
  "Minnesota Timberwolves",
  "New Orleans Pelicans",
  "New York Knicks",
  "Oklahoma City Thunder",
  "Orlando Magic",
  "Philadelphia 76ers",
  "Phoenix Suns",
  "Portland Trail Blazers",
  "Sacramento Kings",
  "San Antonio Spurs",
  "Toronto Raptors",
  "Utah Jazz",
  "Washington Wizards",
  "None",
];

// Функция для инициализации архивной таблицы
const initializeArchiveTable = async (): Promise<boolean> => {
  try {
    // Проверяем существование таблицы
    const { error } = await supabase
      .from("Archive_players_years_money")
      .select("id")
      .limit(1);

    if (error) {
      console.warn(
        "Архивная таблица требует настройки. Пожалуйста, создайте таблицу через SQL Editor:"
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
};

const PlayersRosterAgentControlCenter = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<Player>>({});
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [archiveInitialized, setArchiveInitialized] = useState(false);
  const [isMassShifting, setIsMassShifting] = useState(false);

  const [teamContextMenu, setTeamContextMenu] = useState<{
    show: boolean;
    x: number;
    y: number;
    playerId: number | null;
    isNewPlayer: boolean;
  }>({
    show: false,
    x: 0,
    y: 0,
    playerId: null,
    isNewPlayer: false,
  });

  const [teamSearchQuery, setTeamSearchQuery] = useState("");

  const [gLeagueContextMenu, setGLeagueContextMenu] = useState<{
    show: boolean;
    x: number;
    y: number;
    playerId: number | null;
    isNewPlayer: boolean;
  }>({
    show: false,
    x: 0,
    y: 0,
    playerId: null,
    isNewPlayer: false,
  });

  const [gLeagueSearchQuery, setGLeagueSearchQuery] = useState("");

  // Мемоизированные функции форматирования
  const formatValueWithSpaces = useCallback(
    (value: string | number | null): string => {
      if (value === null || value === undefined || value === "") {
        return "";
      }

      const stringValue = value.toString();

      // Проверяем, является ли значение числом (может содержать минус и точку)
      const isNumber = /^-?\d*\.?\d*$/.test(stringValue.replace(/\s/g, ""));

      if (!isNumber) {
        // Если это не число, возвращаем как есть (это текст)
        return stringValue;
      }

      // Удаляем все нецифровые символы, кроме минуса в начале и точки
      const cleanValue = stringValue.replace(/[^\d.-]/g, "");

      if (cleanValue === "" || cleanValue === "-") {
        return cleanValue;
      }

      // Разделяем целую и десятичную части
      const parts = cleanValue.split(".");
      let integerPart = parts[0];
      const decimalPart = parts.length > 1 ? `.${parts[1]}` : "";

      // Добавляем пробелы как разделители тысяч
      integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, " ");

      const formatted = integerPart + decimalPart;
      return cleanValue.startsWith("-") ? `-${formatted}` : formatted;
    },
    []
  );

  const parseFormattedValue = useCallback((formattedValue: string): string => {
    if (
      formattedValue === null ||
      formattedValue === undefined ||
      formattedValue === ""
    ) {
      return "";
    }

    // Проверяем, является ли значение текстом (содержит не только цифры, минус, точку и пробелы)
    const hasText = /[^-\d.\s]/.test(formattedValue);

    if (hasText) {
      // Если есть текст - возвращаем как есть
      return formattedValue;
    }

    // Если только числа - убираем пробелы
    return formattedValue.replace(/\s/g, "");
  }, []);

  const applyInputMask = useCallback(
    (value: string, previousValue: string): string => {
      // Если значение содержит не только цифры, минус и точку, значит это текст
      const hasNonNumericChars = /[^-\d.\s]/.test(value);

      if (hasNonNumericChars) {
        // Если есть нечисловые символы, разрешаем весь текст
        return value;
      }

      // Если только цифры, минус и точка - применяем старую логику
      let cleanValue = value.replace(/[^\d.-]/g, "");

      // Ограничиваем минус только первым символом
      if (cleanValue.includes("-")) {
        if (cleanValue.charAt(0) !== "-") {
          cleanValue = cleanValue.replace(/-/g, "");
        } else if (cleanValue.lastIndexOf("-") > 0) {
          cleanValue = "-" + cleanValue.replace(/-/g, "");
        }
      }

      // Ограничиваем только одну точку для десятичных чисел
      const dotCount = (cleanValue.match(/\./g) || []).length;
      if (dotCount > 1) {
        // Оставляем только первую точку
        const firstDotIndex = cleanValue.indexOf(".");
        cleanValue =
          cleanValue.substring(0, firstDotIndex + 1) +
          cleanValue.substring(firstDotIndex + 1).replace(/\./g, "");
      }

      return cleanValue;
    },
    []
  );

  const isYearColumn = useCallback((column: string): boolean => {
    return [
      "year_one",
      "year_two",
      "year_three",
      "year_four",
      "year_five",
    ].includes(column);
  }, []);

  // Проверяем размер экрана
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    // Инициализируем архивную таблицу
    initializeArchiveTable().then((initialized) => {
      setArchiveInitialized(initialized);
    });

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Мемоизированные колонки
  const initialColumns = useMemo(
    (): (keyof Player)[] => [
      "id",
      "active_roster",
      "position",
      "team",
      "age",
      "year_one",
      "year_two",
      "opt",
      "exp",
      "rating",
    ],
    []
  );

  const allColumns = useMemo(
    (): (keyof Player)[] => [
      "id",
      "active_roster",
      "position",
      "pos_elig",
      "age",
      "year_one",
      "year_two",
      "year_three",
      "year_four",
      "year_five",
      "opt",
      "exp",
      "bird",
      "awards",
      "team",
      "g_league",
      "rating",
      "rokie",
    ],
    []
  );

  const [visibleColumns, setVisibleColumns] = useState<Set<keyof Player>>(
    new Set(initialColumns)
  );

  const initialNewPlayer = useMemo(
    (): Omit<Player, "id"> => ({
      active_roster: "",
      position: "",
      pos_elig: "",
      age: "",
      year_one: "",
      year_two: "",
      year_three: "",
      year_four: "",
      year_five: "",
      opt: "",
      exp: "",
      bird: "",
      awards: "",
      team: "",
      g_league: "",
      rating: "",
      rokie: "",
    }),
    []
  );

  const [newPlayer, setNewPlayer] =
    useState<Omit<Player, "id">>(initialNewPlayer);

  const initialFilters = useMemo(
    () => ({
      active_roster: "",
      position: "",
      pos_elig: "",
      age: "",
      year_one: "",
      year_two: "",
      year_three: "",
      year_four: "",
      year_five: "",
      opt: "",
      exp: "",
      bird: "",
      awards: "",
      team: "",
      g_league: "",
      rating: "",
      rokie: "",
    }),
    []
  );

  const [filters, setFilters] = useState(initialFilters);

  // Функция сохранения в архив
  const saveToArchive = useCallback(
    async (
      playerId: number,
      originalData: Record<string, any>,
      backupData: Record<string, any>,
      playerInfo: {
        active_roster: string;
        team: string;
      }
    ): Promise<boolean> => {
      try {
        const archiveRecord: ArchiveRecord = {
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

          // Fallback: пробуем сохранить только обязательные поля
          try {
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
          } catch (fallbackError) {
            console.error("Ошибка при fallback сохранении:", fallbackError);
            return false;
          }
        }

        return true;
      } catch (error) {
        console.error("Критическая ошибка при сохранении в архив:", error);
        return false;
      }
    },
    [players.length]
  );

  // Функция для безопасного подтверждения
  const safeConfirm = useCallback((message: string): boolean => {
    // Используем window.confirm напрямую
    // eslint-disable-next-line no-restricted-globals
    return window.confirm(message);
  }, []);

  // Функция для безопасного алерта
  const safeAlert = useCallback((message: string): void => {
    // Используем window.alert напрямую
    // eslint-disable-next-line no-restricted-globals
    window.alert(message);
  }, []);

  // Оптимизированная функция массового переноса с архивацией
  const handleMassShift = useCallback(async () => {
    if (passwordInput !== "1") {
      safeAlert("Неверный пароль! Введите цифру '1' для подтверждения.");
      setPasswordInput("");
      return;
    }

    // Дополнительное подтверждение
    const confirmationMessageText = isMobile
      ? "Вы уверены? Это действие затронет всех игроков и создаст архивную копию."
      : `Вы уверены, что хотите выполнить массовый перенос данных для ${players.length} игроков?\n\nВсе исходные данные будут сохранены в архивной таблице "Archive_players_years_money".`;

    if (!safeConfirm(confirmationMessageText)) {
      return;
    }

    setIsMassShifting(true);

    try {
      // Создаем массив для хранения результатов архивации
      const archiveResults: Promise<boolean>[] = [];
      const updatedPlayers: Player[] = [];

      // Обрабатываем каждого игрока
      for (const player of players) {
        // Сохраняем оригинальные данные
        const originalData = {
          year_one: player.year_one,
          year_two: player.year_two,
          year_three: player.year_three,
          year_four: player.year_four,
          year_five: player.year_five,
        };

        // Вычисляем новые значения с парсингом
        const yearTwo = parseFormattedValue(player.year_two || "");
        const yearThree = parseFormattedValue(player.year_three || "");
        const yearFour = parseFormattedValue(player.year_four || "");
        const yearFive = parseFormattedValue(player.year_five || "");

        // Данные для архивации (новые значения)
        const backupData = {
          year_one: yearTwo,
          year_two: yearThree,
          year_three: yearFour,
          year_four: yearFive,
          year_five: "",
        };

        // Информация об игроке для архива
        const playerInfo = {
          active_roster: player.active_roster,
          team: player.team,
        };

        // Сохраняем в архив
        const archivePromise = saveToArchive(
          player.id,
          originalData,
          backupData,
          playerInfo
        );
        archiveResults.push(archivePromise);

        // Подготавливаем обновленного игрока
        const updatedPlayer: Player = {
          ...player,
          year_one: yearTwo,
          year_two: yearThree,
          year_three: yearFour,
          year_four: yearFive,
          year_five: "",
        };

        updatedPlayers.push(updatedPlayer);
      }

      // Ждем завершения всех операций архивации
      const archiveSettledResults = await Promise.allSettled(archiveResults);
      const successfulArchives = archiveSettledResults.filter(
        (result) => result.status === "fulfilled" && result.value
      ).length;

      console.log(
        `Архивация: ${successfulArchives} успешно из ${players.length}`
      );

      // Если архивная таблица не инициализирована или архивация полностью провалилась
      if (!archiveInitialized && successfulArchives === 0) {
        const continueWithoutArchive = safeConfirm(
          "Не удалось сохранить данные в архив. Таблица архивации не настроена.\n\n" +
            "Продолжить обновление без архивации? (Рекомендуется сначала настроить архивную таблицу)"
        );

        if (!continueWithoutArchive) {
          setIsMassShifting(false);
          setPasswordInput("");
          return;
        }
      } else if (successfulArchives === 0) {
        const continueWithoutArchive = safeConfirm(
          "Не удалось сохранить данные в архив.\n\n" +
            "Продолжить обновление без архивации?"
        );

        if (!continueWithoutArchive) {
          setIsMassShifting(false);
          setPasswordInput("");
          return;
        }
      }

      // Выполняем массовое обновление в базе данных
      const { error: updateError } = await supabase
        .from("Players")
        .upsert(updatedPlayers);

      if (updateError) {
        throw new Error(`Ошибка обновления: ${updateError.message}`);
      }

      // Обновляем локальное состояние
      setPlayers(updatedPlayers);
      setFilteredPlayers(updatedPlayers);

      // Закрываем модальное окно и сбрасываем пароль
      setShowPasswordModal(false);
      setPasswordInput("");
      setIsMassShifting(false);

      // Показываем итоговый отчет
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

      safeAlert(successMessage);
    } catch (error) {
      console.error("Критическая ошибка при массовом переносе:", error);
      setIsMassShifting(false);

      safeAlert(
        isMobile
          ? "Ошибка при переносе данных!"
          : `❌ Произошла ошибка при массовом переносе данных!\n\n` +
              `Ошибка: ${
                error instanceof Error ? error.message : "Неизвестная ошибка"
              }\n\n` +
              `Пожалуйста, проверьте:\n` +
              `1. Подключение к интернету\n` +
              `2. Настройки базы данных\n` +
              `3. Попробуйте выполнить операцию позже`
      );
    }
  }, [
    passwordInput,
    isMobile,
    players,
    saveToArchive,
    archiveInitialized,
    safeConfirm,
    safeAlert,
    parseFormattedValue,
  ]);

  useEffect(() => {
    const fetchPlayers = async () => {
      const { data, error } = await supabase
        .from("Players")
        .select("*")
        .order("id");

      if (error) {
        console.error("Error fetching players:", error);
        return;
      }

      setPlayers(data || []);
      setFilteredPlayers(data || []);
    };

    fetchPlayers();
  }, []);

  const safeStringCompare = useCallback(
    (value: string | number | null | undefined, filter: string): boolean => {
      if (value === null || value === undefined) return false;
      const stringValue = typeof value === "number" ? value.toString() : value;
      return stringValue.toLowerCase().includes(filter.toLowerCase());
    },
    []
  );

  useEffect(() => {
    let result = players;

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        result = result.filter((player) =>
          safeStringCompare(player[key as keyof Player], value)
        );
      }
    });

    setFilteredPlayers(result);
  }, [filters, players, safeStringCompare]);

  const handleShiftClick = useCallback(() => {
    if (!archiveInitialized) {
      const warningMessage = isMobile
        ? "Архивная таблица не настроена. Настроить?"
        : "⚠️ ВНИМАНИЕ: Архивная таблица 'Archive_players_years_money' не настроена!\n\n" +
          "Рекомендуется сначала создать таблицу для сохранения резервных копий данных.\n\n" +
          "Создать таблицу через SQL Editor? (Рекомендуется для безопасности данных)";

      if (safeConfirm(warningMessage)) {
        // Показываем инструкцию по созданию таблицы
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

        safeAlert(
          isMobile
            ? "Скопируйте SQL команду для создания таблицы:"
            : `📋 SQL команда для создания архивной таблицы:\n\n${sqlCommand}\n\n` +
                `Инструкция:\n` +
                `1. Откройте Supabase Dashboard\n` +
                `2. Перейдите в SQL Editor\n` +
                `3. Вставьте команду и выполните\n` +
                `4. После создания таблицы повторите операцию`
        );

        // Копируем в буфер обмена
        navigator.clipboard.writeText(sqlCommand).then(() => {
          if (!isMobile) {
            safeAlert("SQL команда скопирована в буфер обмена!");
          }
        });

        return;
      }
    }

    setShowPasswordModal(true);
    setPasswordInput("");
  }, [archiveInitialized, isMobile, safeConfirm, safeAlert]);

  const handleCancelShift = useCallback(() => {
    setShowPasswordModal(false);
    setPasswordInput("");
    setIsMassShifting(false);
  }, []);

  const handleTeamCellClick = useCallback(
    (e: React.MouseEvent, playerId: number) => {
      if (editingId === playerId || isAddingNew) {
        e.preventDefault();
        setTeamContextMenu({
          show: true,
          x: e.clientX,
          y: e.clientY,
          playerId: isAddingNew ? 0 : playerId,
          isNewPlayer: isAddingNew,
        });
        setTeamSearchQuery("");
      }
    },
    [editingId, isAddingNew]
  );

  const handleTeamSelect = useCallback(
    (team: string) => {
      const { isNewPlayer } = teamContextMenu;

      if (isNewPlayer) {
        setNewPlayer((prev) => ({ ...prev, team }));
      } else {
        setEditData((prev) => ({ ...prev, team }));
      }

      setTeamContextMenu({
        show: false,
        x: 0,
        y: 0,
        playerId: null,
        isNewPlayer: false,
      });
    },
    [teamContextMenu]
  );

  const handleCloseTeamMenu = useCallback(() => {
    setTeamContextMenu({
      show: false,
      x: 0,
      y: 0,
      playerId: null,
      isNewPlayer: false,
    });
  }, []);

  const handleGLeagueCellClick = useCallback(
    (e: React.MouseEvent, playerId: number) => {
      if (editingId === playerId || isAddingNew) {
        e.preventDefault();
        setGLeagueContextMenu({
          show: true,
          x: e.clientX,
          y: e.clientY,
          playerId: isAddingNew ? 0 : playerId,
          isNewPlayer: isAddingNew,
        });
        setGLeagueSearchQuery("");
      }
    },
    [editingId, isAddingNew]
  );

  const handleGLeagueSelect = useCallback(
    (g_league: string) => {
      const { isNewPlayer } = gLeagueContextMenu;

      if (isNewPlayer) {
        setNewPlayer((prev) => ({ ...prev, g_league }));
      } else {
        setEditData((prev) => ({ ...prev, g_league }));
      }

      setGLeagueContextMenu({
        show: false,
        x: 0,
        y: 0,
        playerId: null,
        isNewPlayer: false,
      });
    },
    [gLeagueContextMenu]
  );

  const handleCloseGLeagueMenu = useCallback(() => {
    setGLeagueContextMenu({
      show: false,
      x: 0,
      y: 0,
      playerId: null,
      isNewPlayer: false,
    });
  }, []);

  const filteredTeams = useMemo(
    () =>
      NBA_TEAMS.filter((team) =>
        team.toLowerCase().includes(teamSearchQuery.toLowerCase())
      ),
    [teamSearchQuery]
  );

  const filteredGLeagueTeams = useMemo(
    () =>
      G_LEAGUE_TEAMS.filter((team) =>
        team.toLowerCase().includes(gLeagueSearchQuery.toLowerCase())
      ),
    [gLeagueSearchQuery]
  );

  const handleFilterChange = useCallback(
    (field: keyof typeof filters, value: string) => {
      setFilters((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    []
  );

  const handleResetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  const handleEdit = useCallback(
    (player: Player) => {
      setEditingId(player.id);

      const formattedEditData: Partial<Player> = { ...player };

      // Форматируем year колонки
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
      setIsAddingNew(false);
    },
    [formatValueWithSpaces]
  );

  const handleSave = useCallback(async () => {
    if (!editingId) return;

    const dataToSave = { ...editData };

    // Преобразуем отформатированные значения обратно
    (
      ["year_one", "year_two", "year_three", "year_four", "year_five"] as const
    ).forEach((col) => {
      if (dataToSave[col] !== undefined) {
        dataToSave[col] = parseFormattedValue(dataToSave[col] as string);
      }
    });

    const { error } = await supabase
      .from("Players")
      .update(dataToSave)
      .eq("id", editingId);

    if (error) {
      console.error("Error updating player:", error);
      safeAlert("Ошибка при обновлении игрока!");
      return;
    }

    setPlayers(
      players.map((p) => {
        if (p.id === editingId) {
          return { ...p, ...dataToSave };
        }
        return p;
      })
    );
    setEditingId(null);
    setEditData({});
  }, [editingId, editData, players, parseFormattedValue, safeAlert]);

  const handleEditDataChange = useCallback(
    (field: keyof Player, value: string) => {
      let formattedValue = value;

      if (isYearColumn(field)) {
        const maskedValue = applyInputMask(
          value,
          (editData[field] as string) || ""
        );
        formattedValue = formatValueWithSpaces(maskedValue);
      }

      setEditData({
        ...editData,
        [field]: formattedValue,
      });
    },
    [editData, isYearColumn, applyInputMask, formatValueWithSpaces]
  );

  const handleNewPlayerChange = useCallback(
    (field: keyof typeof newPlayer, value: string) => {
      let formattedValue = value;

      if (isYearColumn(field)) {
        const maskedValue = applyInputMask(
          value,
          (newPlayer[field] as string) || ""
        );
        formattedValue = formatValueWithSpaces(maskedValue);
      }

      setNewPlayer({
        ...newPlayer,
        [field]: formattedValue,
      } as Omit<Player, "id">);
    },
    [newPlayer, isYearColumn, applyInputMask, formatValueWithSpaces]
  );

  const handleAddNew = useCallback(async () => {
    const playerToAdd = { ...newPlayer };

    // Преобразуем отформатированные значения обратно
    (
      ["year_one", "year_two", "year_three", "year_four", "year_five"] as const
    ).forEach((col) => {
      if (playerToAdd[col] !== undefined) {
        playerToAdd[col] = parseFormattedValue(playerToAdd[col] as string);
      }
    });

    const { data, error } = await supabase
      .from("Players")
      .insert([playerToAdd])
      .select();

    if (error) {
      console.error("Error adding new player:", error);
      safeAlert("Ошибка при добавлении игрока!");
      return;
    }

    if (data?.[0]) {
      setPlayers([...players, data[0]]);
    }

    setNewPlayer(initialNewPlayer);
    setIsAddingNew(false);
  }, [newPlayer, players, parseFormattedValue, initialNewPlayer, safeAlert]);

  const handleCancel = useCallback(() => {
    setEditingId(null);
    setEditData({});
  }, []);

  const handleCancelAdd = useCallback(() => {
    setIsAddingNew(false);
    setNewPlayer(initialNewPlayer);
  }, [initialNewPlayer]);

  const toggleColumnVisibility = useCallback((column: keyof Player) => {
    setVisibleColumns((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(column)) {
        newSet.delete(column);
      } else {
        newSet.add(column);
      }
      return newSet;
    });
  }, []);

  const selectAllColumns = useCallback(() => {
    setVisibleColumns(new Set(allColumns));
  }, [allColumns]);

  const deselectAllColumns = useCallback(() => {
    setVisibleColumns(new Set());
  }, []);

  const columnGroups: Record<string, (keyof Player)[]> = useMemo(
    () => ({
      "Basic Info": [
        "id",
        "active_roster",
        "position",
        "pos_elig",
        "age",
        "team",
        "rating",
        "g_league",
      ],
      "Contract Years": [
        "year_one",
        "year_two",
        "year_three",
        "year_four",
        "year_five",
      ],
      "Player Details": ["opt", "exp", "bird", "awards", "rokie"],
    }),
    []
  );

  const selectGroupColumns = useCallback((columns: (keyof Player)[]) => {
    setVisibleColumns((prev) => {
      const newSet = new Set(prev);
      columns.forEach((column) => newSet.add(column));
      return newSet;
    });
  }, []);

  const deselectGroupColumns = useCallback((columns: (keyof Player)[]) => {
    setVisibleColumns((prev) => {
      const newSet = new Set(prev);
      columns.forEach((column) => newSet.delete(column));
      return newSet;
    });
  }, []);

  const getContextMenuStyle = useCallback(
    (x: number, y: number) => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const menuWidth = isMobile ? Math.min(viewportWidth - 20, 280) : 300;
      const menuHeight = isMobile ? 300 : 400;

      let adjustedX = x;
      let adjustedY = y;

      if (x + menuWidth > viewportWidth) {
        adjustedX = viewportWidth - menuWidth - 10;
      }

      if (y + menuHeight > viewportHeight) {
        adjustedY = viewportHeight - menuHeight - 10;
      }

      return {
        left: adjustedX,
        top: adjustedY,
        width: menuWidth,
      };
    },
    [isMobile]
  );

  // Мемоизированные массивы видимых колонок для рендеринга
  const visibleColumnsArray = useMemo(
    () => Array.from(visibleColumns),
    [visibleColumns]
  );
  const visibleColumnsWithoutId = useMemo(
    () => Array.from(visibleColumns).filter((col) => col !== "id"),
    [visibleColumns]
  );

  return (
    <div className="playersRosterAgentControlCenter-container">
      {showPasswordModal && (
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
                  Enter password "1" to confirm MASS contract data transfer for
                  ALL players.
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
                  • YEAR FOUR → YEAR THREE (исходный YEAR THREE сохранится в
                  архив)
                  <br />
                  • YEAR FIVE → YEAR FOUR (исходный YEAR FOUR сохранится в
                  архив)
                  <br />
                  • YEAR FIVE станет пустым
                  <br />
                  <br />
                  <strong>Архивация:</strong>
                  <br />
                  • Все исходные данные будут сохранены в таблице
                  "Archive_players_years_money"
                  <br />
                  • Сохраняемые поля: active_roster, year_one, year_two,
                  year_three, year_four, year_five, team
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
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder={isMobile ? "Enter password..." : "Введите пароль..."}
              className="playersRosterAgentControlCenter-modalInput"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleMassShift();
                }
              }}
              disabled={isMassShifting}
            />
            <div className="playersRosterAgentControlCenter-modalButtons">
              <button
                onClick={handleCancelShift}
                className="playersRosterAgentControlCenter-button"
                disabled={isMassShifting}
              >
                {isMobile ? "Cancel" : "Отмена"}
              </button>
              <button
                onClick={handleMassShift}
                className="playersRosterAgentControlCenter-button playersRosterAgentControlCenter-primaryButton"
                disabled={isMassShifting}
              >
                {isMassShifting
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
      )}

      {teamContextMenu.show && (
        <div
          style={getContextMenuStyle(teamContextMenu.x, teamContextMenu.y)}
          className="playersRosterAgentControlCenter-contextMenu"
          onClick={handleCloseTeamMenu}
        >
          <div
            className="playersRosterAgentControlCenter-contextMenuContent"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="playersRosterAgentControlCenter-contextMenuHeader">
              <input
                type="text"
                value={teamSearchQuery}
                onChange={(e) => setTeamSearchQuery(e.target.value)}
                placeholder="Search NBA teams..."
                className="playersRosterAgentControlCenter-contextSearchInput"
                autoFocus
              />
            </div>
            <div className="playersRosterAgentControlCenter-contextMenuList">
              {filteredTeams.length > 0 ? (
                filteredTeams.map((team) => (
                  <div
                    key={team}
                    className="playersRosterAgentControlCenter-contextMenuItem"
                    onClick={() => handleTeamSelect(team)}
                  >
                    {team}
                  </div>
                ))
              ) : (
                <div className="playersRosterAgentControlCenter-contextMenuItem playersRosterAgentControlCenter-noResults">
                  No teams found
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {gLeagueContextMenu.show && (
        <div
          style={getContextMenuStyle(
            gLeagueContextMenu.x,
            gLeagueContextMenu.y
          )}
          className="playersRosterAgentControlCenter-contextMenu"
          onClick={handleCloseGLeagueMenu}
        >
          <div
            className="playersRosterAgentControlCenter-contextMenuContent"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="playersRosterAgentControlCenter-contextMenuHeader">
              <input
                type="text"
                value={gLeagueSearchQuery}
                onChange={(e) => setGLeagueSearchQuery(e.target.value)}
                placeholder="Search G League teams..."
                className="playersRosterAgentControlCenter-contextSearchInput"
                autoFocus
              />
            </div>
            <div className="playersRosterAgentControlCenter-contextMenuList">
              {filteredGLeagueTeams.length > 0 ? (
                filteredGLeagueTeams.map((team) => (
                  <div
                    key={team}
                    className="playersRosterAgentControlCenter-contextMenuItem"
                    onClick={() => handleGLeagueSelect(team)}
                  >
                    {team}
                  </div>
                ))
              ) : (
                <div className="playersRosterAgentControlCenter-contextMenuItem playersRosterAgentControlCenter-noResults">
                  No teams found
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Мобильный заголовок */}
      {isMobile && (
        <div className="playersRosterAgentControlCenter-mobile-header">
          <div className="playersRosterAgentControlCenter-mobile-header-top">
            <a
              href="/"
              className="playersRosterAgentControlCenter-mobile-logo-link"
            >
              <img
                className="playersRosterAgentControlCenter-mobile-logo"
                src={logo}
                alt="League Logo"
              />
            </a>
            <button
              className="playersRosterAgentControlCenter-mobile-menu-button"
              onClick={() => setShowColumnSelector(!showColumnSelector)}
            >
              {showColumnSelector ? "✕" : "☰"}
            </button>
          </div>
          <h1 className="playersRosterAgentControlCenter-mobile-title">
            PLAYERS
          </h1>
          <div className="playersRosterAgentControlCenter-mobile-status">
            {filteredPlayers.length} PLAYERS • {visibleColumns.size} COLUMNS
            {!archiveInitialized && " • ⚠️ NO ARCHIVE"}
          </div>
          <div className="playersRosterAgentControlCenter-mobile-nav">
            <a
              className="playersRosterAgentControlCenter-mobile-nav-link"
              href="/headInfoAgentControlCenter"
            >
              TEAMS
            </a>
            <a
              className="playersRosterAgentControlCenter-mobile-nav-link"
              href="/deadCapRosterAgentControl"
            >
              DEAD CAP
            </a>
            <a
              className="playersRosterAgentControlCenter-mobile-nav-link"
              href="/penalties"
            >
              PENALTIES
            </a>
            <a
              className="playersRosterAgentControlCenter-mobile-nav-link"
              href="/logs"
            >
              LOGS CONSOLE
            </a>
          </div>
        </div>
      )}

      {/* Десктопный заголовок */}
      {!isMobile && (
        <div className="playersRosterAgentControlCenter-header">
          <a href="/">
            <img className="logo" src={logo} alt="League Logo" />
          </a>
          <a
            className="HeadInfoAgent-A-Href"
            href="/headInfoAgentControlCenter"
          >
            <h3>TEAM MANAGEMENT CONSOLE</h3>
          </a>
          <h1 className="playersRosterAgentControlCenter-title">
            PLAYER MANAGEMENT CONSOLE
          </h1>
          <a className="HeadInfoAgent-A-Href" href="/deadCapRosterAgentControl">
            <h3>DEAD CAP MANAGEMENT CONSOLE</h3>
          </a>
          <a className="HeadInfoAgent-A-Href" href="/penalties">
            PENALTIES CONSOLE
          </a>
          <a className="HeadInfoAgent-A-Href" href="/logs">
            LOGS CONSOLE
          </a>
          <div className="playersRosterAgentControlCenter-statusBadge">
            {filteredPlayers.length} PLAYERS • {visibleColumns.size} COLUMNS
            {!archiveInitialized && " • ⚠️ ARCHIVE NOT CONFIGURED"}
          </div>
        </div>
      )}

      {/* Мобильный контроллер представления */}
      {isMobile && (
        <div className="playersRosterAgentControlCenter-mobile-view-controls">
          <button
            className="playersRosterAgentControlCenter-view-button"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
          <button
            className="playersRosterAgentControlCenter-view-button playersRosterAgentControlCenter-successButton"
            onClick={() => setIsAddingNew(true)}
          >
            + Add
          </button>
        </div>
      )}

      {/* Column Selector */}
      {(showColumnSelector || !isMobile) && (
        <div className="playersRosterAgentControlCenter-columnSelector">
          <div className="playersRosterAgentControlCenter-columnSelectorHeader">
            <h3 className="playersRosterAgentControlCenter-columnSelectorTitle">
              COLUMN VISIBILITY
            </h3>
            {!isMobile && (
              <div className="playersRosterAgentControlCenter-massSelectionButtons">
                <button
                  onClick={selectAllColumns}
                  className="playersRosterAgentControlCenter-smallButton"
                >
                  Select All
                </button>
                <button
                  onClick={deselectAllColumns}
                  className="playersRosterAgentControlCenter-smallButton"
                >
                  Deselect All
                </button>
              </div>
            )}
          </div>

          {isMobile ? (
            <div className="playersRosterAgentControlCenter-mobile-column-groups">
              <div className="playersRosterAgentControlCenter-mobile-mass-selection">
                <button
                  onClick={selectAllColumns}
                  className="playersRosterAgentControlCenter-button playersRosterAgentControlCenter-successButton"
                >
                  Select All Columns
                </button>
                <button
                  onClick={deselectAllColumns}
                  className="playersRosterAgentControlCenter-button"
                >
                  Deselect All Columns
                </button>
              </div>
              {Object.entries(columnGroups).map(([groupName, columns]) => (
                <div
                  key={groupName}
                  className="playersRosterAgentControlCenter-mobile-column-group"
                >
                  <div className="playersRosterAgentControlCenter-mobile-column-group-title">
                    {groupName} ({columns.length})
                  </div>
                  <div className="playersRosterAgentControlCenter-mobile-column-checkboxes">
                    {columns.map((column) => (
                      <label
                        key={column}
                        className="playersRosterAgentControlCenter-mobile-checkbox-label"
                      >
                        <input
                          type="checkbox"
                          checked={visibleColumns.has(column)}
                          onChange={() => toggleColumnVisibility(column)}
                          className="playersRosterAgentControlCenter-mobile-checkbox-input"
                        />
                        <span className="playersRosterAgentControlCenter-mobile-checkbox-text">
                          {column.replace(/_/g, " ")}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            Object.entries(columnGroups).map(([groupName, columns]) => (
              <div
                key={groupName}
                className="playersRosterAgentControlCenter-columnGroup"
              >
                <div className="playersRosterAgentControlCenter-columnGroupTitle">
                  <span>
                    {groupName} ({columns.length})
                  </span>
                  <div>
                    <button
                      onClick={() => selectGroupColumns(columns)}
                      className="playersRosterAgentControlCenter-smallButton"
                    >
                      Select All
                    </button>
                    <button
                      onClick={() => deselectGroupColumns(columns)}
                      className="playersRosterAgentControlCenter-smallButton"
                    >
                      Deselect All
                    </button>
                  </div>
                </div>
                <div className="playersRosterAgentControlCenter-columnCheckboxes">
                  {columns.map((column) => (
                    <label
                      key={column}
                      className="playersRosterAgentControlCenter-checkboxLabel"
                    >
                      <input
                        type="checkbox"
                        checked={visibleColumns.has(column)}
                        onChange={() => toggleColumnVisibility(column)}
                        className="playersRosterAgentControlCenter-checkbox"
                      />
                      {column.replace(/_/g, " ")}
                    </label>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Кнопка добавления для десктопа */}
      {!isMobile && (
        <div className="playersRosterAgentControlCenter-actionButtons">
          <button
            onClick={() => setIsAddingNew(true)}
            className="playersRosterAgentControlCenter-button playersRosterAgentControlCenter-successButton"
          >
            + ADD NEW PLAYER
          </button>
        </div>
      )}

      {/* Filters Panel */}
      {(showFilters || !isMobile) && (
        <div className="playersRosterAgentControlCenter-controlPanel">
          <div
            className="playersRosterAgentControlCenter-panelHeader"
            onClick={() => setShowFilters(!showFilters)}
          >
            <div className="playersRosterAgentControlCenter-panelHeaderText">
              FILTER CONTROLS
            </div>
            <div className="playersRosterAgentControlCenter-panelHeaderIcon">
              {showFilters ? "▲" : "▼"}
            </div>
          </div>

          {showFilters && (
            <>
              <div className="playersRosterAgentControlCenter-panelContent">
                {Object.keys(filters)
                  .slice(0, isMobile ? 4 : Object.keys(filters).length)
                  .map((field) => (
                    <div
                      key={field}
                      className="playersRosterAgentControlCenter-filterGroup"
                    >
                      <label className="playersRosterAgentControlCenter-label">
                        {field.replace(/_/g, " ")}
                      </label>
                      <input
                        type="text"
                        value={filters[field as keyof typeof filters]}
                        onChange={(e) =>
                          handleFilterChange(
                            field as keyof typeof filters,
                            e.target.value
                          )
                        }
                        placeholder={`Filter ${field}...`}
                        className="playersRosterAgentControlCenter-input"
                      />
                    </div>
                  ))}
                {isMobile && Object.keys(filters).length > 4 && (
                  <div className="playersRosterAgentControlCenter-mobile-more-filters">
                    <button
                      className="playersRosterAgentControlCenter-button"
                      onClick={() => {
                        safeAlert(
                          "Используйте фильтры через десктопную версию для полного доступа"
                        );
                      }}
                    >
                      Show All Filters
                    </button>
                  </div>
                )}
              </div>
              <div className="playersRosterAgentControlCenter-buttonGroup">
                <button
                  onClick={handleResetFilters}
                  className="playersRosterAgentControlCenter-button"
                >
                  Reset Filters
                </button>
                <div className="playersRosterAgentControlCenter-filterStatus">
                  Displaying {filteredPlayers.length} of {players.length}{" "}
                  records
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Data Table */}
      <div className="playersRosterAgentControlCenter-tableContainer">
        <table className="playersRosterAgentControlCenter-table">
          <thead>
            <tr className="playersRosterAgentControlCenter-tableHeader">
              {visibleColumnsArray.map((column) => (
                <th
                  key={column}
                  className="playersRosterAgentControlCenter-tableHeaderCell"
                >
                  {column.replace(/_/g, " ").toUpperCase()}
                  {column === "year_two" && (
                    <button
                      onClick={handleShiftClick}
                      className="playersRosterAgentControlCenter-shiftButton"
                      title={
                        isMobile
                          ? "Mass contract transfer with backup"
                          : "Массовый перенос данных контрактов с сохранением в архив"
                      }
                      disabled={isMassShifting}
                    >
                      {isMassShifting ? "⏳" : isMobile ? "Shift" : "Перенести"}
                    </button>
                  )}
                </th>
              ))}
              <th className="playersRosterAgentControlCenter-tableHeaderCell">
                ACTIONS
              </th>
            </tr>
          </thead>
          <tbody>
            {isAddingNew && (
              <tr className="playersRosterAgentControlCenter-newRow">
                <td className="playersRosterAgentControlCenter-tableCell">
                  <div className="playersRosterAgentControlCenter-newPlayerId">
                    NEW
                  </div>
                </td>
                {visibleColumnsWithoutId.map((column) => (
                  <td
                    key={column}
                    className="playersRosterAgentControlCenter-tableCell"
                  >
                    {column === "team" ? (
                      <div
                        className="playersRosterAgentControlCenter-teamCell playersRosterAgentControlCenter-editableCell"
                        onClick={(e) => handleTeamCellClick(e, 0)}
                      >
                        {newPlayer.team ||
                          (isMobile ? "Select team" : "Click to select team")}
                      </div>
                    ) : column === "g_league" ? (
                      <div
                        className="playersRosterAgentControlCenter-gLeagueCell playersRosterAgentControlCenter-editableCell"
                        onClick={(e) => handleGLeagueCellClick(e, 0)}
                      >
                        {newPlayer.g_league ||
                          (isMobile
                            ? "Select G League"
                            : "Click to select G League team")}
                      </div>
                    ) : (
                      <input
                        value={
                          newPlayer[column as keyof Omit<Player, "id">] || ""
                        }
                        onChange={(e) =>
                          handleNewPlayerChange(
                            column as keyof Omit<Player, "id">,
                            e.target.value
                          )
                        }
                        className="playersRosterAgentControlCenter-editInput"
                        placeholder={column.replace(/_/g, " ")}
                        style={
                          isMobile ? { fontSize: "11px", padding: "4px" } : {}
                        }
                      />
                    )}
                  </td>
                ))}
                <td className="playersRosterAgentControlCenter-tableCell">
                  <div className="playersRosterAgentControlCenter-actionButtonsContainer">
                    <button
                      onClick={handleAddNew}
                      className="playersRosterAgentControlCenter-button playersRosterAgentControlCenter-successButton"
                      style={
                        isMobile ? { padding: "6px 8px", fontSize: "11px" } : {}
                      }
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelAdd}
                      className="playersRosterAgentControlCenter-button"
                      style={
                        isMobile ? { padding: "6px 8px", fontSize: "11px" } : {}
                      }
                    >
                      Cancel
                    </button>
                  </div>
                </td>
              </tr>
            )}

            {filteredPlayers.map((player) => (
              <tr
                key={player.id}
                className="playersRosterAgentControlCenter-tableRow"
              >
                {visibleColumnsArray.map((column) => {
                  const value = player[column] || "—";

                  return (
                    <td
                      key={column}
                      className="playersRosterAgentControlCenter-tableCell"
                    >
                      {editingId === player.id ? (
                        column === "team" ? (
                          <div
                            className="playersRosterAgentControlCenter-teamCell playersRosterAgentControlCenter-editableCell"
                            onClick={(e) => handleTeamCellClick(e, player.id)}
                          >
                            {editData.team ||
                              (isMobile
                                ? "Select team"
                                : "Click to select team")}
                          </div>
                        ) : column === "g_league" ? (
                          <div
                            className="playersRosterAgentControlCenter-gLeagueCell playersRosterAgentControlCenter-editableCell"
                            onClick={(e) =>
                              handleGLeagueCellClick(e, player.id)
                            }
                          >
                            {editData.g_league ||
                              (isMobile
                                ? "Select G League"
                                : "Click to select G League team")}
                          </div>
                        ) : (
                          <input
                            value={editData[column] || ""}
                            onChange={(e) =>
                              handleEditDataChange(column, e.target.value)
                            }
                            className="playersRosterAgentControlCenter-editInput"
                            style={
                              isMobile
                                ? { fontSize: "11px", padding: "4px" }
                                : {}
                            }
                          />
                        )
                      ) : (
                        <div className="playersRosterAgentControlCenter-cellValue">
                          {isYearColumn(column)
                            ? formatValueWithSpaces(value)
                            : value}
                        </div>
                      )}
                    </td>
                  );
                })}
                <td className="playersRosterAgentControlCenter-tableCell">
                  {editingId === player.id ? (
                    <div className="playersRosterAgentControlCenter-actionButtonsContainer">
                      <button
                        onClick={handleSave}
                        className="playersRosterAgentControlCenter-button playersRosterAgentControlCenter-primaryButton"
                        style={
                          isMobile
                            ? { padding: "6px 8px", fontSize: "11px" }
                            : {}
                        }
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="playersRosterAgentControlCenter-button"
                        style={
                          isMobile
                            ? { padding: "6px 8px", fontSize: "11px" }
                            : {}
                        }
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleEdit(player)}
                      className="playersRosterAgentControlCenter-button"
                      style={
                        isMobile ? { padding: "6px 8px", fontSize: "11px" } : {}
                      }
                    >
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredPlayers.length === 0 && !isAddingNew && (
        <div className="playersRosterAgentControlCenter-emptyState">
          NO PLAYERS FOUND MATCHING CURRENT FILTERS
        </div>
      )}
    </div>
  );
};

export default PlayersRosterAgentControlCenter;
