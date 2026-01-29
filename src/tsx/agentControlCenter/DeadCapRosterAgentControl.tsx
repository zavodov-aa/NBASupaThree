// DeadCapRosterAgentControl.tsx
import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import "./deadCapRosterAgentControl.css";
import logo from "../../img/LogoLeague4kFinal.png";

type Player = {
  id: number;
  active_roster: string;
  pos: string;
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
};

const supabase = createClient(
  "https://sgbsefgldsmzbvzvpjxt.supabase.co",
  "sb_publishable_Xl99x3YkZHWgS8l-qBSmCg_gXF_Gpcp"
);

const TEAMS_LIST = [
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

// Функция для форматирования числа с пробелами (аналогично первому компоненту)
const formatNumberWithSpaces = (value: string | number | null): string => {
  if (value === null || value === undefined || value === "") {
    return "";
  }

  const stringValue = value.toString();
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
};

// Функция для преобразования отформатированного числа обратно в число для базы данных
const parseFormattedNumber = (formattedValue: string): string => {
  if (
    formattedValue === null ||
    formattedValue === undefined ||
    formattedValue === ""
  ) {
    return "";
  }

  // Удаляем все пробелы (разделители тысяч)
  const cleanValue = formattedValue.replace(/\s/g, "");

  if (cleanValue === "" || cleanValue === "-") {
    return cleanValue;
  }

  return cleanValue;
};

// Функция для применения маски ввода
const applyNumberMask = (value: string, previousValue: string): string => {
  // Удаляем все нецифровые символы, кроме минуса в начале и точки
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
};

// Функция для определения, является ли колонка колонкой с годом
const isYearColumn = (column: string): boolean => {
  return [
    "year_one",
    "year_two",
    "year_three",
    "year_four",
    "year_five",
  ].includes(column);
};

const DeadCapRosterAgentControl = () => {
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
  const [showAddModalMobile, setShowAddModalMobile] = useState(false);

  const [teamContextMenu, setTeamContextMenu] = useState<{
    show: boolean;
    x: number;
    y: number;
    playerId: number | null;
    target: "edit" | "new";
  }>({
    show: false,
    x: 0,
    y: 0,
    playerId: null,
    target: "edit",
  });

  const [teamSearchQuery, setTeamSearchQuery] = useState("");

  // Проверяем размер экрана
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const initialColumns: (keyof Player)[] = [
    "id",
    "active_roster",
    "team",
    "pos",
    "age",
    "year_one",
    "year_two",
    "opt",
    "exp",
  ];

  const allColumns: (keyof Player)[] = [
    "id",
    "active_roster",
    "team",
    "pos",
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
  ];

  const [visibleColumns, setVisibleColumns] = useState<Set<keyof Player>>(
    new Set(initialColumns)
  );

  const [newPlayer, setNewPlayer] = useState<Omit<Player, "id">>({
    active_roster: "",
    pos: "",
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
  });

  const [filters, setFilters] = useState({
    active_roster: "",
    pos: "",
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
  });

  useEffect(() => {
    const fetchPlayers = async () => {
      const { data, error } = await supabase
        .from("Dead_Cap")
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

  const safeStringCompare = (
    value: string | number | null | undefined,
    filter: string
  ): boolean => {
    if (value === null || value === undefined) return false;
    const stringValue = typeof value === "number" ? value.toString() : value;
    return stringValue.toLowerCase().includes(filter.toLowerCase());
  };

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
  }, [filters, players]);

  // Обновленная функция handleMassShift с учетом форматирования
  const handleMassShift = async () => {
    if (passwordInput !== "1") {
      alert("Неверный пароль! Введите цифру '1' для подтверждения.");
      setPasswordInput("");
      return;
    }

    try {
      const updatedPlayers = players.map((player) => {
        // Создаем объект для обновления
        const updatedPlayer = { ...player };

        // Для каждого year поля сначала распарсим, а потом отформатируем для следующего года
        const yearTwo = parseFormattedNumber(player.year_two || "");
        const yearThree = parseFormattedNumber(player.year_three || "");
        const yearFour = parseFormattedNumber(player.year_four || "");
        const yearFive = parseFormattedNumber(player.year_five || "");

        // Обновляем значения (они будут сохраняться без форматирования)
        updatedPlayer.year_one = yearTwo;
        updatedPlayer.year_two = yearThree;
        updatedPlayer.year_three = yearFour;
        updatedPlayer.year_four = yearFive;
        updatedPlayer.year_five = "";

        return updatedPlayer;
      });

      const { error } = await supabase.from("Dead_Cap").upsert(updatedPlayers);

      if (error) {
        console.error("Error mass updating players:", error);
        alert("Ошибка при массовом обновлении данных!");
        return;
      }

      setPlayers(updatedPlayers);
      setFilteredPlayers(updatedPlayers);

      setShowPasswordModal(false);
      setPasswordInput("");
      alert("Массовый перенос данных завершен успешно!");
    } catch (error) {
      console.error("Error in mass shift:", error);
      alert("Произошла ошибка при массовом переносе данных!");
    }
  };

  const handleShiftClick = () => {
    setShowPasswordModal(true);
    setPasswordInput("");
  };

  const handleCancelShift = () => {
    setShowPasswordModal(false);
    setPasswordInput("");
  };

  const handleTeamCellClick = (
    e: React.MouseEvent,
    playerId: number,
    target: "edit" | "new"
  ) => {
    if (
      (target === "edit" && editingId === playerId) ||
      (target === "new" && (isAddingNew || showAddModalMobile))
    ) {
      e.preventDefault();
      setTeamContextMenu({
        show: true,
        x: e.clientX,
        y: e.clientY,
        playerId,
        target,
      });
      setTeamSearchQuery("");
    }
  };

  const handleTeamSelect = (team: string) => {
    if (teamContextMenu.target === "edit" && teamContextMenu.playerId) {
      setEditData((prev) => ({ ...prev, team }));
    } else if (teamContextMenu.target === "new") {
      setNewPlayer((prev) => ({ ...prev, team }));
    }
    setTeamContextMenu({
      show: false,
      x: 0,
      y: 0,
      playerId: null,
      target: "edit",
    });
  };

  const handleCloseTeamMenu = () => {
    setTeamContextMenu({
      show: false,
      x: 0,
      y: 0,
      playerId: null,
      target: "edit",
    });
  };

  const filteredTeams = TEAMS_LIST.filter((team) =>
    team.toLowerCase().includes(teamSearchQuery.toLowerCase())
  );

  const handleFilterChange = (field: keyof typeof filters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      active_roster: "",
      pos: "",
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
    });
  };

  // Обновленная функция handleEdit с форматированием year колонок
  const handleEdit = (player: Player) => {
    setEditingId(player.id);

    // Создаем копию данных игрока с отформатированными числами
    const formattedEditData: Partial<Player> = { ...player };

    // Форматируем year колонки для отображения при редактировании
    (
      ["year_one", "year_two", "year_three", "year_four", "year_five"] as const
    ).forEach((col) => {
      if (player[col]) {
        formattedEditData[col] = formatNumberWithSpaces(player[col]);
      }
    });

    setEditData(formattedEditData);
    setIsAddingNew(false);
    setShowAddModalMobile(false);
  };

  // Обновленная функция handleSave с распарсиванием чисел
  const handleSave = async () => {
    if (!editingId) return;

    // Создаем копию editData с распарсенными числами
    const dataToSave = { ...editData };

    // Преобразуем отформатированные числа обратно в обычные
    (
      ["year_one", "year_two", "year_three", "year_four", "year_five"] as const
    ).forEach((col) => {
      if (dataToSave[col] !== undefined) {
        dataToSave[col] = parseFormattedNumber(dataToSave[col] as string);
      }
    });

    const { error } = await supabase
      .from("Dead_Cap")
      .update(dataToSave)
      .eq("id", editingId);

    if (error) {
      console.error("Error updating player:", error);
      return;
    }

    // Обновляем локальное состояние
    setPlayers(
      players.map((p) => {
        if (p.id === editingId) {
          const updatedPlayer = { ...p, ...dataToSave };
          return updatedPlayer;
        }
        return p;
      })
    );
    setEditingId(null);
    setEditData({});
  };

  // Обработчик изменения для editData с форматированием
  const handleEditDataChange = (field: keyof Player, value: string) => {
    let formattedValue = value;

    // Если это year колонка, форматируем число
    if (isYearColumn(field)) {
      // Применяем маску ввода
      const maskedValue = applyNumberMask(
        value,
        (editData[field] as string) || ""
      );
      formattedValue = formatNumberWithSpaces(maskedValue);
    }

    setEditData({
      ...editData,
      [field]: formattedValue,
    });
  };

  // Обработчик изменения для newPlayer с форматированием
  const handleNewPlayerChange = (
    field: keyof typeof newPlayer,
    value: string
  ) => {
    let formattedValue = value;

    // Если это year колонка, форматируем число
    if (isYearColumn(field)) {
      // Применяем маску ввода
      const maskedValue = applyNumberMask(
        value,
        (newPlayer[field] as string) || ""
      );
      formattedValue = formatNumberWithSpaces(maskedValue);
    }

    setNewPlayer({
      ...newPlayer,
      [field]: formattedValue,
    } as Omit<Player, "id">);
  };

  // Обновленная функция handleAddNew с распарсиванием чисел
  const handleAddNew = async () => {
    // Создаем копию newPlayer с распарсенными числами
    const playerToAdd = { ...newPlayer };

    // Преобразуем отформатированные числа обратно в обычные
    (
      ["year_one", "year_two", "year_three", "year_four", "year_five"] as const
    ).forEach((col) => {
      if (playerToAdd[col] !== undefined) {
        playerToAdd[col] = parseFormattedNumber(playerToAdd[col] as string);
      }
    });

    const { data, error } = await supabase
      .from("Dead_Cap")
      .insert([playerToAdd])
      .select();

    if (error) {
      console.error("Error adding new player:", error);
      alert("Ошибка при добавлении игрока!");
      return;
    }

    if (data && data[0]) {
      setPlayers([...players, data[0]]);
      setFilteredPlayers([...filteredPlayers, data[0]]);
    }

    setNewPlayer({
      active_roster: "",
      pos: "",
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
    });
    setIsAddingNew(false);
    setShowAddModalMobile(false);

    alert("Игрок успешно добавлен!");
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleCancelAdd = () => {
    setIsAddingNew(false);
    setShowAddModalMobile(false);
    setNewPlayer({
      active_roster: "",
      pos: "",
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
    });
  };

  const toggleColumnVisibility = (column: keyof Player) => {
    setVisibleColumns((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(column)) {
        newSet.delete(column);
      } else {
        newSet.add(column);
      }
      return newSet;
    });
  };

  const selectAllColumns = () => {
    setVisibleColumns(new Set(allColumns));
  };

  const deselectAllColumns = () => {
    setVisibleColumns(new Set());
  };

  const columnGroups: Record<string, (keyof Player)[]> = {
    "Basic Info": ["id", "pos", "pos_elig", "age", "team"],
    "Contract Years": [
      "year_one",
      "year_two",
      "year_three",
      "year_four",
      "year_five",
    ],
    "Player Details": ["opt", "exp", "bird", "awards"],
  };

  const selectGroupColumns = (columns: (keyof Player)[]) => {
    setVisibleColumns((prev) => {
      const newSet = new Set(prev);
      columns.forEach((column) => newSet.add(column));
      return newSet;
    });
  };

  const deselectGroupColumns = (columns: (keyof Player)[]) => {
    setVisibleColumns((prev) => {
      const newSet = new Set(prev);
      columns.forEach((column) => newSet.delete(column));
      return newSet;
    });
  };

  type NewPlayerType = Omit<Player, "id">;

  const getContextMenuStyle = (x: number, y: number) => {
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
  };

  // Функция для мобильного добавления игрока
  const handleMobileAddClick = () => {
    setShowAddModalMobile(true);
  };

  return (
    <div className="deadCapRosterAgentControl-container">
      {showPasswordModal && (
        <div className="deadCapRosterAgentControl-modalOverlay">
          <div className="deadCapRosterAgentControl-modalContent">
            <div className="deadCapRosterAgentControl-modalTitle">
              {isMobile
                ? "Confirm Mass Transfer"
                : "Подтверждение массового переноса данных"}
            </div>
            <p className="deadCapRosterAgentControl-modalDescription">
              {isMobile ? (
                <>
                  Enter password "1" to confirm MASS contract data transfer for
                  ALL players.
                  <br />
                  <br />
                  <strong>This action cannot be undone!</strong>
                </>
              ) : (
                <>
                  Введите пароль для подтверждения МАССОВОГО переноса данных
                  контракта для ВСЕХ игроков.
                  <br />
                  <br />
                  <strong>Будет выполнено:</strong>
                  <br />
                  • YEAR TWO → YEAR ONE
                  <br />
                  • YEAR THREE → YEAR TWO
                  <br />
                  • YEAR FOUR → YEAR THREE
                  <br />
                  • YEAR FIVE → YEAR FOUR
                  <br />
                  • YEAR FIVE станет пустым
                  <br />
                  <br />
                  <strong className="deadCapRosterAgentControl-warningText">
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
              className="deadCapRosterAgentControl-modalInput"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleMassShift();
                }
              }}
            />
            <div className="deadCapRosterAgentControl-modalButtons">
              <button
                onClick={handleCancelShift}
                className="deadCapRosterAgentControl-button"
              >
                {isMobile ? "Cancel" : "Отмена"}
              </button>
              <button
                onClick={handleMassShift}
                className="deadCapRosterAgentControl-button deadCapRosterAgentControl-primaryButton"
              >
                {isMobile ? "Confirm" : "Подтвердить массовый перенос"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно добавления игрока для мобильных */}
      {showAddModalMobile && (
        <div className="deadCapRosterAgentControl-modalOverlay">
          <div className="deadCapRosterAgentControl-modalContent deadCapRosterAgentControl-addModal">
            <div className="deadCapRosterAgentControl-modalTitle">
              Добавить нового игрока
            </div>
            <div className="deadCapRosterAgentControl-addForm">
              {Array.from(visibleColumns)
                .filter((col) => col !== "id")
                .map((column) => (
                  <div
                    key={column}
                    className="deadCapRosterAgentControl-addFormField"
                  >
                    <label className="deadCapRosterAgentControl-addFormLabel">
                      {column.replace(/_/g, " ").toUpperCase()}
                    </label>
                    {column === "team" ? (
                      <div
                        className="deadCapRosterAgentControl-teamSelect"
                        onClick={(e) => handleTeamCellClick(e, 0, "new")}
                      >
                        {newPlayer.team || "Выберите команду"}
                      </div>
                    ) : (
                      <input
                        type="text"
                        value={newPlayer[column as keyof NewPlayerType] || ""}
                        onChange={(e) =>
                          handleNewPlayerChange(
                            column as keyof NewPlayerType,
                            e.target.value
                          )
                        }
                        className="deadCapRosterAgentControl-addFormInput"
                        placeholder={`Введите ${column.replace(/_/g, " ")}`}
                      />
                    )}
                  </div>
                ))}
            </div>
            <div className="deadCapRosterAgentControl-modalButtons">
              <button
                onClick={handleCancelAdd}
                className="deadCapRosterAgentControl-button"
              >
                Отмена
              </button>
              <button
                onClick={handleAddNew}
                className="deadCapRosterAgentControl-button deadCapRosterAgentControl-successButton"
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}

      {teamContextMenu.show && (
        <div
          style={getContextMenuStyle(teamContextMenu.x, teamContextMenu.y)}
          className="deadCapRosterAgentControl-contextMenu"
          onClick={handleCloseTeamMenu}
        >
          <div
            className="deadCapRosterAgentControl-contextMenuContent"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="deadCapRosterAgentControl-contextMenuHeader">
              <input
                type="text"
                value={teamSearchQuery}
                onChange={(e) => setTeamSearchQuery(e.target.value)}
                placeholder="Search NBA teams..."
                className="deadCapRosterAgentControl-contextSearchInput"
                autoFocus
              />
            </div>
            <div className="deadCapRosterAgentControl-contextMenuList">
              {filteredTeams.length > 0 ? (
                filteredTeams.map((team) => (
                  <div
                    key={team}
                    className="deadCapRosterAgentControl-contextMenuItem"
                    onClick={() => handleTeamSelect(team)}
                  >
                    {team}
                  </div>
                ))
              ) : (
                <div className="deadCapRosterAgentControl-contextMenuItem deadCapRosterAgentControl-noResults">
                  No teams found
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Мобильный заголовок */}
      {isMobile && (
        <div className="deadCapRosterAgentControl-mobile-header">
          <div className="deadCapRosterAgentControl-mobile-header-top">
            <a href="/" className="deadCapRosterAgentControl-mobile-logo-link">
              <img
                className="deadCapRosterAgentControl-mobile-logo"
                src={logo}
                alt="League Logo"
              />
            </a>
            <button
              className="deadCapRosterAgentControl-mobile-menu-button"
              onClick={() => setShowColumnSelector(!showColumnSelector)}
            >
              {showColumnSelector ? "✕" : "☰"}
            </button>
          </div>
          <h1 className="deadCapRosterAgentControl-mobile-title">DEAD CAP</h1>
          <div className="deadCapRosterAgentControl-mobile-status">
            {filteredPlayers.length} PLAYERS • {visibleColumns.size} COLUMNS
          </div>
          <div className="deadCapRosterAgentControl-mobile-nav">
            <a
              className="deadCapRosterAgentControl-mobile-nav-link"
              href="/headInfoAgentControlCenter"
            >
              TEAMS
            </a>
            <a
              className="deadCapRosterAgentControl-mobile-nav-link"
              href="/playersRosterAgentControlCenter"
            >
              PLAYERS
            </a>
            <a
              className="deadCapRosterAgentControl-mobile-nav-link"
              href="/penalties"
            >
              PENALTIES CONSOLE
            </a>
            <a
              className="deadCapRosterAgentControl-mobile-nav-link"
              href="/logs"
            >
              LOGS CONSOLE
            </a>
          </div>
        </div>
      )}

      {/* Десктопный заголовок */}
      {!isMobile && (
        <div className="deadCapRosterAgentControl-header">
          <a href="/">
            <img className="logo" src={logo} alt="League Logo" />
          </a>
          <a
            className="HeadInfoAgent-A-Href"
            href="/headInfoAgentControlCenter"
          >
            <h3>TEAM MANAGEMENT CONSOLE</h3>
          </a>
          <a
            className="HeadInfoAgent-A-Href"
            href="/playersRosterAgentControlCenter"
          >
            <h3>PLAYER MANAGEMENT CONSOLE</h3>
          </a>
          <h1 className="deadCapRosterAgentControl-title">
            DEAD CAP MANAGEMENT CONSOLE
          </h1>
          <a className="HeadInfoAgent-A-Href" href="/penalties">
            PENALTIES CONSOLE
          </a>
          <a className="HeadInfoAgent-A-Href" href="/logs">
            LOGS CONSOLE
          </a>
          <div className="deadCapRosterAgentControl-statusBadge">
            {filteredPlayers.length} PLAYERS • {visibleColumns.size} COLUMNS
          </div>
        </div>
      )}

      {/* Мобильный контроллер представления */}
      {isMobile && (
        <div className="deadCapRosterAgentControl-mobile-view-controls">
          <button
            className="deadCapRosterAgentControl-view-button"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
          <button
            className="deadCapRosterAgentControl-view-button deadCapRosterAgentControl-successButton"
            onClick={handleMobileAddClick}
          >
            + Add Player
          </button>
        </div>
      )}

      {/* Column Selector */}
      {(showColumnSelector || !isMobile) && (
        <div className="deadCapRosterAgentControl-columnSelector">
          <div className="deadCapRosterAgentControl-columnSelectorHeader">
            <h3 className="deadCapRosterAgentControl-columnSelectorTitle">
              COLUMN VISIBILITY
            </h3>
            {!isMobile && (
              <div className="deadCapRosterAgentControl-massSelectionButtons">
                <button
                  onClick={selectAllColumns}
                  className="deadCapRosterAgentControl-smallButton"
                >
                  Select All
                </button>
                <button
                  onClick={deselectAllColumns}
                  className="deadCapRosterAgentControl-smallButton"
                >
                  Deselect All
                </button>
              </div>
            )}
          </div>

          {isMobile ? (
            <div className="deadCapRosterAgentControl-mobile-column-groups">
              {/* Кнопки выбора всех/удаления всех для мобильной версии */}
              <div className="deadCapRosterAgentControl-mobile-mass-selection">
                <button
                  onClick={selectAllColumns}
                  className="deadCapRosterAgentControl-button deadCapRosterAgentControl-successButton"
                >
                  Select All Columns
                </button>
                <button
                  onClick={deselectAllColumns}
                  className="deadCapRosterAgentControl-button"
                >
                  Deselect All Columns
                </button>
              </div>
              {Object.entries(columnGroups).map(([groupName, columns]) => (
                <div
                  key={groupName}
                  className="deadCapRosterAgentControl-mobile-column-group"
                >
                  <div className="deadCapRosterAgentControl-mobile-column-group-title">
                    {groupName} ({columns.length})
                  </div>
                  <div className="deadCapRosterAgentControl-mobile-column-checkboxes">
                    {columns.map((column) => (
                      <label
                        key={column}
                        className="deadCapRosterAgentControl-mobile-checkbox-label"
                      >
                        <input
                          type="checkbox"
                          checked={visibleColumns.has(column)}
                          onChange={() => toggleColumnVisibility(column)}
                          className="deadCapRosterAgentControl-mobile-checkbox-input"
                        />
                        <span className="deadCapRosterAgentControl-mobile-checkbox-text">
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
                className="deadCapRosterAgentControl-columnGroup"
              >
                <div className="deadCapRosterAgentControl-columnGroupTitle">
                  <span>
                    {groupName} ({columns.length})
                  </span>
                  <div>
                    <button
                      onClick={() => selectGroupColumns(columns)}
                      className="deadCapRosterAgentControl-smallButton"
                    >
                      Select All
                    </button>
                    <button
                      onClick={() => deselectGroupColumns(columns)}
                      className="deadCapRosterAgentControl-smallButton"
                    >
                      Deselect All
                    </button>
                  </div>
                </div>
                <div className="deadCapRosterAgentControl-columnCheckboxes">
                  {columns.map((column) => (
                    <label
                      key={column}
                      className="deadCapRosterAgentControl-checkboxLabel"
                    >
                      <input
                        type="checkbox"
                        checked={visibleColumns.has(column)}
                        onChange={() => toggleColumnVisibility(column)}
                        className="deadCapRosterAgentControl-checkbox"
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
        <div className="deadCapRosterAgentControl-actionButtons">
          <button
            onClick={() => setIsAddingNew(true)}
            className="deadCapRosterAgentControl-button deadCapRosterAgentControl-successButton"
          >
            + ADD NEW PLAYER
          </button>
        </div>
      )}

      {/* Filters Panel */}
      {(showFilters || !isMobile) && (
        <div className="deadCapRosterAgentControl-controlPanel">
          <div
            className="deadCapRosterAgentControl-panelHeader"
            onClick={() => setShowFilters(!showFilters)}
          >
            <div className="deadCapRosterAgentControl-panelHeaderText">
              FILTER CONTROLS
            </div>
            <div className="deadCapRosterAgentControl-panelHeaderIcon">
              {showFilters ? "▲" : "▼"}
            </div>
          </div>

          {showFilters && (
            <>
              <div className="deadCapRosterAgentControl-panelContent">
                {Object.keys(filters)
                  .slice(0, isMobile ? 4 : Object.keys(filters).length)
                  .map((field) => (
                    <div
                      key={field}
                      className="deadCapRosterAgentControl-filterGroup"
                    >
                      <label className="deadCapRosterAgentControl-label">
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
                        className="deadCapRosterAgentControl-input"
                      />
                    </div>
                  ))}
                {isMobile && Object.keys(filters).length > 4 && (
                  <div className="deadCapRosterAgentControl-mobile-more-filters">
                    <button
                      className="deadCapRosterAgentControl-button"
                      onClick={() => {
                        /* Можно добавить модалку с полными фильтрами */
                      }}
                    >
                      Show All Filters
                    </button>
                  </div>
                )}
              </div>
              <div className="deadCapRosterAgentControl-buttonGroup">
                <button
                  onClick={handleResetFilters}
                  className="deadCapRosterAgentControl-button"
                >
                  Reset Filters
                </button>
                <div className="deadCapRosterAgentControl-filterStatus">
                  Displaying {filteredPlayers.length} of {players.length}{" "}
                  records
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Data Table - всегда показывается на мобильных */}
      <div className="deadCapRosterAgentControl-tableContainer">
        <table className="deadCapRosterAgentControl-table">
          <thead>
            <tr className="deadCapRosterAgentControl-tableHeader">
              {Array.from(visibleColumns).map((column) => (
                <th
                  key={column}
                  className="deadCapRosterAgentControl-tableHeaderCell"
                >
                  {column.replace(/_/g, " ").toUpperCase()}
                  {column === "year_two" && (
                    <button
                      onClick={handleShiftClick}
                      className="deadCapRosterAgentControl-shiftButton"
                      title={
                        isMobile
                          ? "Mass contract transfer"
                          : "Массовый перенос данных контрактов для всех игроков"
                      }
                    >
                      {isMobile ? "Shift" : "Перенести"}
                    </button>
                  )}
                </th>
              ))}
              <th className="deadCapRosterAgentControl-tableHeaderCell">
                ACTIONS
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Форма добавления нового игрока для десктопной версии */}
            {isAddingNew && !isMobile && (
              <tr className="deadCapRosterAgentControl-newRow">
                <td className="deadCapRosterAgentControl-tableCell">
                  <div className="deadCapRosterAgentControl-newPlayerId">
                    NEW
                  </div>
                </td>
                {Array.from(visibleColumns)
                  .filter((col) => col !== "id")
                  .map((column) => (
                    <td
                      key={column}
                      className="deadCapRosterAgentControl-tableCell"
                    >
                      {column === "team" ? (
                        <div
                          className="deadCapRosterAgentControl-teamCell deadCapRosterAgentControl-editableCell"
                          onClick={(e) => handleTeamCellClick(e, 0, "new")}
                        >
                          {newPlayer.team || "Click to select team"}
                        </div>
                      ) : (
                        <input
                          value={newPlayer[column as keyof NewPlayerType] || ""}
                          onChange={(e) =>
                            handleNewPlayerChange(
                              column as keyof NewPlayerType,
                              e.target.value
                            )
                          }
                          className="deadCapRosterAgentControl-editInput"
                          placeholder={column.replace(/_/g, " ")}
                        />
                      )}
                    </td>
                  ))}
                <td className="deadCapRosterAgentControl-tableCell">
                  <div className="deadCapRosterAgentControl-actionButtonsContainer">
                    <button
                      onClick={handleAddNew}
                      className="deadCapRosterAgentControl-button deadCapRosterAgentControl-successButton"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelAdd}
                      className="deadCapRosterAgentControl-button"
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
                className="deadCapRosterAgentControl-tableRow"
              >
                {Array.from(visibleColumns).map((column) => {
                  const value = player[column] || "—";

                  return (
                    <td
                      key={column}
                      className="deadCapRosterAgentControl-tableCell"
                    >
                      {editingId === player.id ? (
                        column === "team" ? (
                          <div
                            className="deadCapRosterAgentControl-teamCell deadCapRosterAgentControl-editableCell"
                            onClick={(e) =>
                              handleTeamCellClick(e, player.id, "edit")
                            }
                          >
                            {editData.team || "Click to select team"}
                          </div>
                        ) : (
                          <input
                            value={editData[column] || ""}
                            onChange={(e) =>
                              handleEditDataChange(column, e.target.value)
                            }
                            className="deadCapRosterAgentControl-editInput"
                          />
                        )
                      ) : (
                        <div className="deadCapRosterAgentControl-cellValue">
                          {isYearColumn(column)
                            ? formatNumberWithSpaces(value)
                            : value}
                        </div>
                      )}
                    </td>
                  );
                })}
                <td className="deadCapRosterAgentControl-tableCell">
                  {editingId === player.id ? (
                    <div className="deadCapRosterAgentControl-actionButtonsContainer">
                      <button
                        onClick={handleSave}
                        className="deadCapRosterAgentControl-button deadCapRosterAgentControl-primaryButton"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="deadCapRosterAgentControl-button"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleEdit(player)}
                      className="deadCapRosterAgentControl-button"
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
        <div className="deadCapRosterAgentControl-emptyState">
          NO PLAYERS FOUND MATCHING CURRENT FILTERS
        </div>
      )}
    </div>
  );
};

export default DeadCapRosterAgentControl;
