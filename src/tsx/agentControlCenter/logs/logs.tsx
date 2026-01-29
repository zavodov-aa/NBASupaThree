import React, { useState, useEffect, useMemo, useCallback } from "react";
import "./logs.css";
import { supabase } from "../../../Supabase";

interface Log {
  id: number;
  date: string;
  team: string | null;
  teamNew: string | null;
  teamOld: string | null;
  type: string | null;
  info_players: Player[] | null;
  notes: string | null;
  decision: string | null;
}

interface Player {
  id: number;
  active_roster: string;
  is_coach?: boolean;
  is_draft_pick?: boolean;
  draft_year?: number;
  draft_round?: number;
  draft_team?: string;
}

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
];

const TYPES = [
  "trade",
  "free agent",
  "penalties",
  "Прибыль",
  "Смена ГМа",
  "Убыль",
  "Защита пика",
  "Опция игрока",
  "Продление",
  "Драфт",
  "Опция команды",
  "Квалифай",
  "Новичок",
  "Амнистия",
  "Тренер",
  "Навыки тренера",
  "RFA-Агенты",
  "UFA-Агенты",
  "Выкуп",
  "Системное",
  "Мертвые деньги",
  "Позиции",
  "Подписание СА",
  "Сброс КЭША",
  "Отчисление",
];

const DECISIONS = [
  "Кэш",
  "Принял",
  "Отклонил",
  "Назначен",
  "Уволен",
  "Отдал",
  "Получил",
  "Выбор",
  "Подписание",
  "Сброс",
  "Списание",
  "Выплата",
  "Star",
  "Start",
  "NEG",
  "PG",
  "SG",
  "SF",
  "PF",
  "C",
  "Bench",
  "G1",
  "G2",
  "G3",
  "Мертвые деньги",
  "Старт сезона",
  "Конец сезона",
  "Слот",
  "Клэйм",
  "Штрафы",
];

const TYPES_MAP: Record<string, string> = {
  trade: "Trade",
  "free agent": "Free Agent",
  penalties: "Penalties",
  fine: "Штрафы",
  Прибыль: "Прибыль",
  Смена_ГМа: "Смена ГМа",
  Убыль: "Убыль",
  Защита_пика: "Защита пика",
  Опция_игрока: "Опция игрока",
  Продление: "Продление",
  Драфт: "Драфт",
  Опция_команды: "Опция команды",
  Квалифай: "Квалифай",
  Новичок: "Новичок",
  Амнистия: "Амнистия",
  Тренер: "Тренер",
  Навыки_тренера: "Навыки тренера",
  RFA_Агенты: "RFA-Агенты",
  UFA_Агенты: "UFA-Агенты",
  Выкуп: "Выкуп",
  Системное: "Системное",
  Мертвые_деньги: "Мертвые деньги",
  Позиции: "Позиции",
  Подписание_СА: "Подписание СА",
  Сброс_КЭША: "Сброс КЭША",
  Отчисление: "Отчисление",
};

const formatType = (type: string | null): string => {
  if (!type) return "Не указана";
  return TYPES_MAP[type] || type.charAt(0).toUpperCase() + type.slice(1);
};

const Logs = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [dateTime, setDateTime] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");
  const [selectedTradeFromTeam, setSelectedTradeFromTeam] = useState("");
  const [selectedTradeToTeam, setSelectedTradeToTeam] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedDecision, setSelectedDecision] = useState("");
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);
  const [selectedDraftPicks, setSelectedDraftPicks] = useState<Player[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [searchTermPlayers, setSearchTermPlayers] = useState("");
  const [searchTermPicks, setSearchTermPicks] = useState("");
  const [notes, setNotes] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [loading, setLoading] = useState(false);

  const draftPicks = useMemo(() => {
    const picks: Player[] = [];
    let counter = 1;
    const years = Array.from({ length: 15 }, (_, i) => 2026 + i);
    const rounds = [1, 2];

    NBA_TEAMS.forEach((team) => {
      years.forEach((year) => {
        rounds.forEach((round) => {
          picks.push({
            id: -counter - 20000,
            active_roster: `${team} - ${round}p ${year}`,
            is_coach: false,
            is_draft_pick: true,
            draft_year: year,
            draft_round: round,
            draft_team: team,
          });
          counter++;
        });
      });
    });
    return picks;
  }, []);

  const filteredPlayersAndCoaches = useMemo(() => {
    const regularPlayers = players.filter((p) => !p.is_draft_pick);
    if (!searchTermPlayers.trim()) return regularPlayers;
    const term = searchTermPlayers.toLowerCase();
    return regularPlayers.filter((p) =>
      p.active_roster.toLowerCase().includes(term)
    );
  }, [players, searchTermPlayers]);

  const filteredPicks = useMemo(
    () =>
      players.filter(
        (p) =>
          p.is_draft_pick &&
          p.active_roster.toLowerCase().includes(searchTermPicks.toLowerCase())
      ),
    [players, searchTermPicks]
  );

  // Динамический расчет высоты для десктопа
  useEffect(() => {
    const updateHeights = () => {
      if (window.innerWidth >= 1024) {
        const container = document.querySelector(
          ".logs-container"
        ) as HTMLElement;
        const form = document.querySelector(".logs-form") as HTMLElement;
        const history = document.querySelector(".logs-history") as HTMLElement;

        if (container && form && history) {
          const containerPadding = 16 * 2; // padding top + bottom
          const availableHeight = window.innerHeight - containerPadding;

          form.style.maxHeight = `${availableHeight}px`;
          history.style.maxHeight = `${availableHeight}px`;
        }
      }
    };

    window.addEventListener("resize", updateHeights);
    updateHeights();

    return () => window.removeEventListener("resize", updateHeights);
  }, []);

  useEffect(() => {
    const now = new Date();
    setDateTime(
      new Date(now.getTime() - now.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16)
    );
    fetchLogs();
    fetchPlayersAndCoaches();
  }, []);

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("Logs")
        .select("*")
        .order("id", { ascending: false });
      if (error) throw error;
      setLogs(
        data?.map((log) => ({
          ...log,
          info_players: parseInfoPlayers(log.info_players),
        })) || []
      );
    } catch (error) {
      console.error("Error fetching logs:", error);
      alert("Ошибка при загрузке записей");
    } finally {
      setLoading(false);
    }
  }, []);

  const parseInfoPlayers = useCallback((info_players: any): Player[] | null => {
    if (!info_players || info_players === "null") return null;
    try {
      if (Array.isArray(info_players)) return info_players;
      if (typeof info_players === "string") {
        const parsed = JSON.parse(info_players);
        return Array.isArray(parsed) ? parsed : null;
      }
      return null;
    } catch (error) {
      console.warn("Error parsing info_players:", error);
      return null;
    }
  }, []);

  const fetchPlayersAndCoaches = useCallback(async () => {
    try {
      const [playersResult, headResult] = await Promise.all([
        supabase
          .from("Players")
          .select("id, active_roster")
          .order("active_roster"),
        supabase.from("Head").select("head_coach"),
      ]);

      const allPlayers: Player[] = [];
      if (playersResult.data) {
        allPlayers.push(
          ...playersResult.data.map((p) => ({
            ...p,
            is_coach: false,
            is_draft_pick: false,
          }))
        );
      }

      const coachesSet = new Set<string>();
      headResult.data?.forEach((head) => {
        if (head.head_coach && typeof head.head_coach === "string") {
          const coach = head.head_coach.trim();
          if (coach && !coachesSet.has(coach)) {
            coachesSet.add(coach);
            allPlayers.push({
              id: -coachesSet.size - 10000,
              active_roster: coach,
              is_coach: true,
              is_draft_pick: false,
            });
          }
        }
      });

      allPlayers.push(...draftPicks);
      allPlayers.sort((a, b) => a.active_roster.localeCompare(b.active_roster));
      setPlayers(allPlayers);
    } catch (error) {
      console.error("Error fetching players and coaches:", error);
      alert("Ошибка при загрузке игроков, тренеров и драфт-пиков");
    }
  }, [draftPicks]);

  const addLog = useCallback(async () => {
    if (!dateTime) {
      alert("Пожалуйста, укажите дату и время");
      return;
    }
    if (
      selectedType === "trade" &&
      !!selectedTradeFromTeam !== !!selectedTradeToTeam
    ) {
      alert("Для трейда укажите обе команды или оставьте обе пустыми");
      return;
    }

    try {
      const allSelected = [...selectedPlayers, ...selectedDraftPicks];
      const { error } = await supabase.from("Logs").insert([
        {
          date: dateTime,
          team: selectedTeam || null,
          teamNew: selectedTradeFromTeam || null,
          teamOld: selectedTradeToTeam || null,
          type: selectedType || null,
          decision: selectedDecision || null,
          info_players: allSelected.length > 0 ? allSelected : null,
          notes: notes.trim() || null,
        },
      ]);
      if (error) throw error;

      const now = new Date();
      setDateTime(
        new Date(now.getTime() - now.getTimezoneOffset() * 60000)
          .toISOString()
          .slice(0, 16)
      );
      setSelectedTeam("");
      setSelectedTradeFromTeam("");
      setSelectedTradeToTeam("");
      setSelectedType("");
      setSelectedDecision("");
      setSelectedPlayers([]);
      setSelectedDraftPicks([]);
      setSearchTermPlayers("");
      setSearchTermPicks("");
      setNotes("");
      fetchLogs();
      alert("Запись успешно добавлена!");
    } catch (error) {
      console.error("Error adding log:", error);
      alert("Ошибка при добавлении записи");
    }
  }, [
    dateTime,
    selectedTeam,
    selectedTradeFromTeam,
    selectedTradeToTeam,
    selectedType,
    selectedDecision,
    selectedPlayers,
    selectedDraftPicks,
    notes,
    fetchLogs,
  ]);

  const handlePlayerSelect = useCallback(
    (playerId: number) => {
      const player = players.find((p) => p.id === playerId);
      if (player && !selectedPlayers.some((p) => p.id === playerId)) {
        setSelectedPlayers([...selectedPlayers, player]);
      }
    },
    [players, selectedPlayers]
  );

  const handleDraftPickSelect = useCallback(
    (pickId: number) => {
      const pick = players.find((p) => p.id === pickId);
      if (pick && !selectedDraftPicks.some((p) => p.id === pickId)) {
        setSelectedDraftPicks([...selectedDraftPicks, pick]);
      }
    },
    [players, selectedDraftPicks]
  );

  const removePlayer = useCallback(
    (playerId: number) => {
      setSelectedPlayers(selectedPlayers.filter((p) => p.id !== playerId));
    },
    [selectedPlayers]
  );

  const removeDraftPick = useCallback(
    (pickId: number) => {
      setSelectedDraftPicks(selectedDraftPicks.filter((p) => p.id !== pickId));
    },
    [selectedDraftPicks]
  );

  const filteredLogs = useMemo(
    () =>
      filterType === "all"
        ? logs
        : logs.filter((log) => log.type === filterType),
    [logs, filterType]
  );

  const clearAllSelections = useCallback(() => {
    setSelectedTeam("");
    setSelectedTradeFromTeam("");
    setSelectedTradeToTeam("");
    setSelectedType("");
    setSelectedDecision("");
    setSelectedPlayers([]);
    setSelectedDraftPicks([]);
    setSearchTermPlayers("");
    setSearchTermPicks("");
    setNotes("");
  }, []);

  // Функция для обрезки длинных имен в отображении
  const truncateText = (text: string, maxLength: number = 25) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div className="logs-container">
      <div className="logs-form">
        <h2 className="form-title">Добавить запись</h2>

        <div className="form-group">
          <label>Дата и время</label>
          <input
            type="datetime-local"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
            className="form-select"
            required
          />
        </div>

        <div className="form-group">
          <label>Команда</label>
          <select
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            className="form-select"
          >
            <option value="">Выберите команду</option>
            {NBA_TEAMS.map((team) => (
              <option key={team} value={team}>
                {team}
              </option>
            ))}
          </select>
        </div>

        {selectedType === "trade" && (
          <div className="trade-section">
            <label>Трейд между командами</label>
            <div className="trade-inputs">
              <select
                value={selectedTradeFromTeam}
                onChange={(e) => setSelectedTradeFromTeam(e.target.value)}
                className="form-select"
              >
                <option value="">Из команды</option>
                {NBA_TEAMS.map((team) => (
                  <option key={`from-${team}`} value={team}>
                    {team}
                  </option>
                ))}
              </select>
              <span className="trade-arrow">→</span>
              <select
                value={selectedTradeToTeam}
                onChange={(e) => setSelectedTradeToTeam(e.target.value)}
                className="form-select"
              >
                <option value="">В команду</option>
                {NBA_TEAMS.map((team) => (
                  <option key={`to-${team}`} value={team}>
                    {team}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        <div className="form-group">
          <label>Тип операции</label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="form-select"
          >
            <option value="">Выберите тип</option>
            {TYPES.map((type) => (
              <option key={type} value={type}>
                {formatType(type)}
              </option>
            ))}
          </select>
        </div>

        <div className="players-grid">
          <div className="players-column">
            <label>Игроки и тренеры ({selectedPlayers.length})</label>
            <input
              type="text"
              value={searchTermPlayers}
              onChange={(e) => setSearchTermPlayers(e.target.value)}
              placeholder="Поиск..."
              className="form-select"
            />
            <select
              value=""
              onChange={(e) => {
                if (e.target.value)
                  handlePlayerSelect(parseInt(e.target.value));
                e.target.value = "";
                setSearchTermPlayers("");
              }}
              className="form-select"
            >
              <option value="">Выберите...</option>
              {filteredPlayersAndCoaches.map((player) => (
                <option key={player.id} value={player.id}>
                  {player.active_roster}
                  {player.is_coach ? " (Тренер)" : ""}
                </option>
              ))}
            </select>
            <div className="selected-list">
              {selectedPlayers.map((player) => (
                <div
                  key={player.id}
                  className="selected-item"
                  title={player.active_roster}
                >
                  <span>{truncateText(player.active_roster)}</span>
                  <button onClick={() => removePlayer(player.id)}>×</button>
                </div>
              ))}
            </div>
          </div>

          <div className="players-column">
            <label>Драфт-пики ({selectedDraftPicks.length})</label>
            <input
              type="text"
              value={searchTermPicks}
              onChange={(e) => setSearchTermPicks(e.target.value)}
              placeholder="Поиск..."
              className="form-select"
            />
            <select
              value=""
              onChange={(e) => {
                if (e.target.value)
                  handleDraftPickSelect(parseInt(e.target.value));
                e.target.value = "";
                setSearchTermPicks("");
              }}
              className="form-select"
            >
              <option value="">Выберите...</option>
              {filteredPicks.map((pick) => (
                <option key={pick.id} value={pick.id}>
                  {pick.active_roster}
                </option>
              ))}
            </select>
            <div className="selected-list">
              {selectedDraftPicks.map((pick) => (
                <div
                  key={pick.id}
                  className="selected-item"
                  title={pick.active_roster}
                >
                  <span>{truncateText(pick.active_roster)}</span>
                  <button onClick={() => removeDraftPick(pick.id)}>×</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="form-group">
          <label>Решение</label>
          <select
            value={selectedDecision}
            onChange={(e) => setSelectedDecision(e.target.value)}
            className="form-select"
          >
            <option value="">Выберите решение</option>
            {DECISIONS.map((decision) => (
              <option key={decision} value={decision}>
                {decision}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Примечания</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Введите примечания..."
            className="form-textarea"
            rows={2}
          />
        </div>

        <div className="form-actions">
          <button
            onClick={addLog}
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? "Добавление..." : "Добавить запись"}
          </button>
          <button onClick={clearAllSelections} className="btn btn-secondary">
            Очистить
          </button>
        </div>
      </div>

      <div className="logs-history">
        <div className="history-header">
          <h2 className="form-title">История записей</h2>
          <div className="history-controls">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="form-select"
            >
              <option value="all">Все записи</option>
              {TYPES.map((type) => (
                <option key={type} value={type}>
                  {formatType(type)}
                </option>
              ))}
            </select>
            <span className="counter">
              {filteredLogs.length} из {logs.length}
            </span>
          </div>
        </div>

        {loading ? (
          <div className="loading">Загрузка...</div>
        ) : filteredLogs.length === 0 ? (
          <div className="empty">Записей не найдено</div>
        ) : (
          <div className="logs-grid">
            {filteredLogs.map((log) => {
              const hasPlayers =
                log.info_players && log.info_players.length > 0;
              const hasNotes = log.notes;
              const isTrade = log.type === "trade";

              return (
                <div
                  key={log.id}
                  className={`log-card ${isTrade ? "trade" : ""}`}
                >
                  <div className="log-header">
                    <div className="log-date">{log.date.replace("T", " ")}</div>
                    <div className="log-team">
                      {isTrade && log.teamNew && log.teamOld
                        ? `${log.teamNew} → ${log.teamOld}`
                        : log.team || "—"}
                    </div>
                    <div className={`log-type ${log.type || ""}`}>
                      {formatType(log.type)}
                    </div>
                    {log.decision && (
                      <div className="log-decision">{log.decision}</div>
                    )}
                  </div>
                  <div className="log-content">
                    {hasPlayers && (
                      <div className="log-players">
                        {log.info_players!.map((p) => (
                          <span
                            key={p.id}
                            className={`player-tag ${
                              p.is_coach
                                ? "coach"
                                : p.is_draft_pick
                                ? "pick"
                                : ""
                            }`}
                            title={p.active_roster}
                          >
                            {truncateText(p.active_roster, 20)}
                            {p.is_coach && <span className="tag-badge">Т</span>}
                            {p.is_draft_pick && (
                              <span className="tag-badge">
                                {p.draft_round}p
                              </span>
                            )}
                          </span>
                        ))}
                      </div>
                    )}
                    {hasNotes && (
                      <div className="log-notes" title={log.notes || ""}>
                        {log.notes}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Logs;
