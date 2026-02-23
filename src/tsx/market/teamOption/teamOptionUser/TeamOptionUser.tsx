import React, { useState, useEffect, ChangeEvent } from "react";
import { supabase } from "../../../../Supabase";
import "./teamOptionUser.css";

// Типы для данных
interface PlayerData {
  id?: number;
  name?: string;
  salary?: string;
  opt?: string;
  year_one?: string;
  [key: string]: any;
}

interface PlayersRow {
  team: string;
  active_roster: PlayerData[] | string | null;
  opt?: string;
  year_one?: string;
  id?: number;
  [key: string]: any;
}

interface Decision {
  playerName: string;
  team: string;
  salary?: string;
  result: "accepted" | "declined";
  saving?: boolean;
}

const TeamOptionUser: React.FC = () => {
  const [teams, setTeams] = useState<string[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string>("");
  const [players, setPlayers] = useState<PlayerData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [teamsLoading, setTeamsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [decisions, setDecisions] = useState<{ [key: string]: Decision }>({});
  const [saving, setSaving] = useState<boolean>(false);

  // Функция для форматирования числа в виде тысячи (с разделителем)
  const formatNumber = (value: string | number | undefined): string => {
    if (!value) return "";

    const numStr = String(value).replace(/[^\d.]/g, "");
    const num = parseFloat(numStr);

    if (isNaN(num)) return String(value);

    return new Intl.NumberFormat("ru-RU", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  // Функция для извлечения значения после "TO-" из year_one
  const extractValueAfterTO = (yearOneValue: string | undefined): string => {
    if (!yearOneValue) return "";

    if (typeof yearOneValue === "string") {
      const toMatch = yearOneValue.match(/^TO-\s*(.+)/i);
      if (toMatch && toMatch[1]) {
        return toMatch[1].trim();
      } else if (yearOneValue.startsWith("TO-")) {
        return yearOneValue.substring(3).trim();
      }
    }

    return "";
  };

  // Получаем список уникальных команд
  useEffect(() => {
    const fetchTeams = async (): Promise<void> => {
      try {
        setTeamsLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from("Players")
          .select<string, PlayersRow>("team, opt");

        if (error) throw error;

        const uniqueTeams = Array.from(
          new Set(
            data
              .map((item) => item.team)
              .filter(
                (team): team is string => team != null && team.trim() !== "",
              ),
          ),
        );

        setTeams(uniqueTeams.sort());
      } catch (err) {
        console.error("Ошибка при загрузке команд:", err);
        setError("Не удалось загрузить список команд");
      } finally {
        setTeamsLoading(false);
      }
    };

    fetchTeams();
  }, []);

  // Загружаем существующие решения для выбранной команды
  useEffect(() => {
    const fetchExistingDecisions = async () => {
      if (!selectedTeam) return;

      try {
        const { data, error } = await supabase
          .from("market_TO")
          .select("*")
          .eq("team", selectedTeam);

        if (error) throw error;

        const decisionsMap: { [key: string]: Decision } = {};
        data?.forEach((item: any) => {
          const key = `${item.name}_${selectedTeam}`;
          decisionsMap[key] = {
            playerName: item.name,
            team: item.team,
            salary: item.salary,
            result: item.result,
            saving: false,
          };
        });

        setDecisions(decisionsMap);
      } catch (err) {
        console.error("Ошибка при загрузке решений:", err);
      }
    };

    if (selectedTeam) {
      fetchExistingDecisions();
    }
  }, [selectedTeam]);

  // Функция для фильтрации игроков по значению opt === "TO" и year_one с префиксом "TO-"
  const filterPlayersByOpt = (playersList: PlayerData[]): PlayerData[] => {
    return playersList.filter((player) => {
      if (player.opt && player.opt === "TO") {
        return true;
      }

      const optValue = player.OPT || player.option || player.player_option;
      if (optValue === "TO") {
        return true;
      }

      if (player.year_one && player.year_one.startsWith("TO-")) {
        return true;
      }

      const yearOneValue = player.yearOne || player.year;
      if (
        yearOneValue &&
        typeof yearOneValue === "string" &&
        yearOneValue.startsWith("TO-")
      ) {
        return true;
      }

      return false;
    });
  };

  // Получаем игроков выбранной команды
  const fetchPlayers = async (teamName: string): Promise<void> => {
    if (!teamName) {
      setPlayers([]);
      setDecisions({});
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("Players")
        .select<string, PlayersRow>("active_roster, opt, year_one")
        .eq("team", teamName);

      if (error) throw error;

      let playerList: PlayerData[] = [];

      if (data && data.length > 0) {
        data.forEach((row) => {
          if (row && row.active_roster) {
            if (Array.isArray(row.active_roster)) {
              const playersWithOpt = row.active_roster.map((player) => ({
                ...player,
                opt: player.opt || row.opt,
                year_one: player.year_one || row.year_one,
              }));
              playerList = [...playerList, ...playersWithOpt];
            } else if (typeof row.active_roster === "string") {
              try {
                const parsed = JSON.parse(row.active_roster);
                if (Array.isArray(parsed)) {
                  const playersWithOpt = parsed.map((player) => ({
                    ...player,
                    opt: player.opt || row.opt,
                    year_one: player.year_one || row.year_one,
                  }));
                  playerList = [...playerList, ...playersWithOpt];
                } else if (parsed && typeof parsed === "object") {
                  playerList.push({
                    ...parsed,
                    opt: parsed.opt || row.opt,
                    year_one: parsed.year_one || row.year_one,
                  });
                }
              } catch (parseError) {
                console.warn("Не удалось распарсить JSON игроков:", parseError);
                if (row.active_roster.includes(",")) {
                  const playersFromString = row.active_roster
                    .split(",")
                    .map((name) => ({
                      name: name.trim(),
                      opt: row.opt,
                      year_one: row.year_one,
                    }));
                  playerList = [...playerList, ...playersFromString];
                } else if (row.active_roster.trim() !== "") {
                  playerList.push({
                    name: row.active_roster,
                    opt: row.opt,
                    year_one: row.year_one,
                  });
                }
              }
            } else if (
              typeof row.active_roster === "object" &&
              row.active_roster !== null &&
              !Array.isArray(row.active_roster)
            ) {
              const playerObj = row.active_roster as PlayerData;
              playerList.push({
                ...playerObj,
                opt: playerObj.opt || row.opt,
                year_one: playerObj.year_one || row.year_one,
              });
            }
          }
        });
      }

      const uniquePlayers = playerList.filter((player, index, self) => {
        if (!player) return false;

        const hasData =
          player.name ||
          Object.keys(player).some(
            (key) =>
              key !== "id" &&
              key !== "opt" &&
              key !== "year_one" &&
              player[key] &&
              typeof player[key] === "string" &&
              player[key].trim() !== "",
          );

        if (!hasData) return false;

        if (player.name) {
          return self.findIndex((p) => p.name === player.name) === index;
        }
        return true;
      });

      const filteredPlayers = filterPlayersByOpt(uniquePlayers);
      setPlayers(filteredPlayers);
    } catch (err: any) {
      console.error("Ошибка при загрузке игроков:", err);

      let errorMessage = "Неизвестная ошибка";
      if (
        err.message.includes("Cannot coerce the result to a single JSON object")
      ) {
        errorMessage =
          "Ошибка структуры данных. В базе может быть несколько записей для одной команды. Обратитесь к администратору.";
      } else {
        errorMessage = `Ошибка загрузки игроков: ${err.message || "Неизвестная ошибка"}`;
      }

      setError(errorMessage);
      setPlayers([]);
    } finally {
      setLoading(false);
    }
  };

  // Функция для сохранения решения
  const saveDecision = async (
    player: PlayerData,
    result: "accepted" | "declined",
  ): Promise<void> => {
    if (!player.name || !selectedTeam) {
      setError(
        "Не удалось сохранить решение: отсутствует имя игрока или команда",
      );
      return;
    }

    let salaryToSave = "";
    const yearOneValue = player.year_one || player.yearOne || player.year;
    salaryToSave = extractValueAfterTO(yearOneValue);

    if (!salaryToSave && player.salary) {
      salaryToSave = String(player.salary);
    }

    const key = `${player.name}_${selectedTeam}`;

    setDecisions((prev) => ({
      ...prev,
      [key]: {
        playerName: player.name!,
        team: selectedTeam,
        salary: salaryToSave,
        result,
        saving: true,
      },
    }));

    setSaving(true);

    try {
      const { data: existingData, error: checkError } = await supabase
        .from("market_TO")
        .select("*")
        .eq("name", player.name)
        .eq("team", selectedTeam);

      if (checkError) throw checkError;

      if (existingData && existingData.length > 0) {
        const { error: updateError } = await supabase
          .from("market_TO")
          .update({
            salary: salaryToSave,
            result,
          })
          .eq("name", player.name)
          .eq("team", selectedTeam);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase.from("market_TO").insert({
          name: player.name,
          team: selectedTeam,
          salary: salaryToSave,
          result,
        });

        if (insertError) throw insertError;
      }

      setDecisions((prev) => ({
        ...prev,
        [key]: {
          ...prev[key],
          saving: false,
        },
      }));
    } catch (err: any) {
      console.error("Ошибка при сохранении решения:", err);
      setError(
        `Не удалось сохранить решение: ${err.message || "Неизвестная ошибка"}`,
      );

      setDecisions((prev) => ({
        ...prev,
        [key]: {
          ...prev[key],
          saving: false,
        },
      }));
    } finally {
      setSaving(false);
    }
  };

  // Функция для получения решения по игроку
  const getPlayerDecision = (player: PlayerData): Decision | null => {
    if (!player.name || !selectedTeam) return null;
    const key = `${player.name}_${selectedTeam}`;
    return decisions[key] || null;
  };

  const handleTeamSelect = (e: ChangeEvent<HTMLSelectElement>): void => {
    const team = e.target.value;
    setSelectedTeam(team);
    if (team) {
      fetchPlayers(team);
    } else {
      setPlayers([]);
      setDecisions({});
    }
  };

  const renderPlayerCard = (
    player: PlayerData,
    index: number,
  ): React.ReactElement => {
    if (typeof player === "string") {
      return (
        <div key={index} className="playerTeamOption-card">
          <p className="playerTeamOption-card-name">{player}</p>
        </div>
      );
    }

    // Определяем, показывать ли бейдж TO
    const hasTOOpt =
      player.opt === "TO" ||
      player.OPT === "TO" ||
      player.option === "TO" ||
      player.player_option === "TO";

    const hasTOYearOne =
      (player.year_one && player.year_one.startsWith("TO-")) ||
      (player.yearOne && player.yearOne.startsWith("TO-")) ||
      (player.year && player.year.startsWith("TO-"));

    const showTOBadge = hasTOOpt || hasTOYearOne;

    // Извлекаем значение для сохранения
    const yearOneValue = player.year_one || player.yearOne || player.year;
    const extractedValue = extractValueAfterTO(yearOneValue);

    // Получаем решение по игроку
    const playerDecision = getPlayerDecision(player);
    const hasDecision = !!playerDecision;
    const isSaving = playerDecision?.saving || false;

    return (
      <div key={player.id || index} className="playerTeamOption-card">
        {showTOBadge && <div className="playerTeamOption-badge">TO</div>}

        {player.name && (
          <h3 className="playerTeamOption-card-name">{player.name}</h3>
        )}

        <div className="playerTeamOption-details">
          {player.salary && (
            <p>
              <span className="playerTeamOption-detail-label">Зарплата:</span>{" "}
              {player.salary}
            </p>
          )}
          {player.opt && (
            <p className="playerTeamOption-opt-detail">
              <span className="playerTeamOption-detail-label">Опция:</span>{" "}
              {player.opt}
            </p>
          )}
          {/* Отображаем только отформатированную сумму опции */}
          {extractedValue && (
            <p className="playerTeamOption-extracted-value">
              <span className="playerTeamOption-detail-label">
                Сумма опции:
              </span>{" "}
              {formatNumber(extractedValue)}
            </p>
          )}
        </div>

        {/* Кнопки принятия решения */}
        {player.name && (
          <div className="playerTeamOption-decision-section">
            {hasDecision ? (
              <div className="playerTeamOption-decision-display">
                <div
                  className={`playerTeamOption-decision-result playerTeamOption-decision-result-${playerDecision.result}`}
                >
                  {playerDecision.result === "accepted"
                    ? "✓ Принято"
                    : "✗ Отклонено"}
                </div>
                {playerDecision.salary && (
                  <div className="playerTeamOption-decision-salary">
                    {formatNumber(playerDecision.salary)}
                  </div>
                )}
                {isSaving && <div className="playerTeamOption-spinner" />}
                <button
                  onClick={() =>
                    setDecisions((prev) => {
                      const key = `${player.name}_${selectedTeam}`;
                      const newDecisions = { ...prev };
                      delete newDecisions[key];
                      return newDecisions;
                    })
                  }
                  className="playerTeamOption-change-decision-btn"
                  disabled={isSaving}
                >
                  Изменить
                </button>
              </div>
            ) : (
              <div className="playerTeamOption-decision-buttons">
                <button
                  onClick={() => saveDecision(player, "accepted")}
                  disabled={isSaving || saving}
                  className="playerTeamOption-accept-btn"
                >
                  Принято
                </button>
                <button
                  onClick={() => saveDecision(player, "declined")}
                  disabled={isSaving || saving}
                  className="playerTeamOption-decline-btn"
                >
                  Отклонено
                </button>
                {isSaving && (
                  <div className="playerTeamOption-spinner-container">
                    <div className="playerTeamOption-spinner" />
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="playerTeamOption-container">
      <div className="playerTeamOption-header-section">
        <h1 className="playerTeamOption-main-title">
          Командные опции (Team Options)
        </h1>
        <p className="playerTeamOption-subtitle">
          Выберите команду НБА для просмотра игроков с опцией TO
        </p>
      </div>

      {error && (
        <div className="playerTeamOption-error-container">
          <p className="playerTeamOption-error-message">Ошибка: {error}</p>
          <button
            onClick={() => setError(null)}
            className="playerTeamOption-error-dismiss"
          >
            Скрыть
          </button>
        </div>
      )}

      <div className="playerTeamOption-team-selector-container">
        <label className="playerTeamOption-team-selector-label">
          Выберите команду НБА:
        </label>

        <div className="playerTeamOption-selector-wrapper">
          {teamsLoading ? (
            <div className="playerTeamOption-loading-teams">
              <div className="playerTeamOption-spinner-large" />
            </div>
          ) : teams.length > 0 ? (
            <select
              value={selectedTeam}
              onChange={handleTeamSelect}
              disabled={loading}
              className="playerTeamOption-team-select"
            >
              <option value="">
                {loading ? "Загрузка..." : "Выберите команду"}
              </option>
              {teams.map((team) => (
                <option key={team} value={team}>
                  {team}
                </option>
              ))}
            </select>
          ) : (
            <div className="playerTeamOption-no-teams">
              Команды не найдены в базе данных
            </div>
          )}
        </div>

        {selectedTeam && !loading && (
          <div className="playerTeamOption-selected-team-info">
            <div>
              <span className="playerTeamOption-selected-team-label">
                Выбрана команда:{" "}
              </span>
              <span className="playerTeamOption-selected-team-name">
                {selectedTeam}
              </span>
            </div>
            <button
              onClick={() => {
                setSelectedTeam("");
                setPlayers([]);
                setDecisions({});
              }}
              className="playerTeamOption-reset-btn"
            >
              Сбросить выбор
            </button>
          </div>
        )}
      </div>

      {selectedTeam && (
        <div className="playerTeamOption-players-container">
          <div className="playerTeamOption-players-content">
            <div className="playerTeamOption-players-header">
              <div className="playerTeamOption-players-title-section">
                <h2 className="playerTeamOption-players-title">
                  Игроки с опцией TO в команде{" "}
                  <span className="playerTeamOption-team-highlight">
                    {selectedTeam}
                  </span>
                </h2>
                <p className="playerTeamOption-players-subtitle">
                  Показаны только игроки с опцией Team Option (TO) или с годом,
                  начинающимся с "TO-"
                </p>
              </div>

              <div className="playerTeamOption-players-stats-info">
                <div className="playerTeamOption-stats-badge">
                  <div className="playerTeamOption-stats-indicator" />
                  <span className="playerTeamOption-stats-text">
                    Всего игроков с опцией TO: <strong>{players.length}</strong>
                  </span>
                </div>
              </div>

              <div className="playerTeamOption-players-status">
                {loading && (
                  <div className="playerTeamOption-loading-players">
                    <div className="playerTeamOption-spinner" />
                    <span>Загрузка игроков с опцией TO...</span>
                  </div>
                )}
                {players.length > 0 && !loading && (
                  <div className="playerTeamOption-decisions-stats">
                    <span className="playerTeamOption-accepted-count">
                      Принято:{" "}
                      {
                        Object.values(decisions).filter(
                          (d) => d.result === "accepted",
                        ).length
                      }
                    </span>
                    <span className="playerTeamOption-declined-count">
                      Отклонено:{" "}
                      {
                        Object.values(decisions).filter(
                          (d) => d.result === "declined",
                        ).length
                      }
                    </span>
                  </div>
                )}
              </div>
            </div>

            {loading ? (
              <div className="playerTeamOption-players-grid">
                {[...Array(6)].map((_, index) => (
                  <div
                    key={index}
                    className="playerTeamOption-player-card-skeleton"
                  >
                    <div className="playerTeamOption-skeleton-line playerTeamOption-name-skeleton" />
                    <div className="playerTeamOption-skeleton-details">
                      <div className="playerTeamOption-skeleton-line playerTeamOption-detail-skeleton" />
                      <div className="playerTeamOption-skeleton-line playerTeamOption-detail-skeleton" />
                    </div>
                  </div>
                ))}
              </div>
            ) : players.length > 0 ? (
              <div className="playerTeamOption-players-grid">
                {players.map((player, index) =>
                  renderPlayerCard(player, index),
                )}
              </div>
            ) : !loading ? (
              <div className="playerTeamOption-no-players">
                <div className="playerTeamOption-no-players-icon">
                  <svg
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <p className="playerTeamOption-no-players-title">
                  Игроки с опцией TO не найдены
                </p>
                <p className="playerTeamOption-no-players-subtitle">
                  В этой команде нет игроков с опцией "TO" или year_one,
                  начинающимся с "TO-"
                </p>
              </div>
            ) : null}
          </div>
        </div>
      )}

      <div className="playerTeamOption-footer-info">
        <p>Данные загружаются из базы данных Supabase</p>
        <p>Таблица: Players, Колонки: team, active_roster, opt, year_one</p>
        <p>
          Сохранение решений: таблица market_TO, Колонки: id, name, team,
          salary, result
        </p>
        <p className="playerTeamOption-footer-note">
          Фильтр: показываются только игроки с opt="TO" ИЛИ year_one начинается
          с "TO-"
        </p>
        <p className="playerTeamOption-footer-note">
          В salary сохраняется значение после "TO-" из поля year_one
        </p>
      </div>
    </div>
  );
};

export default TeamOptionUser;

// import React, { useState, useEffect, ChangeEvent } from "react";
// import { supabase } from "../../../../Supabase";
// import "./teamOptionUser.css";

// // Типы для данных
// interface PlayerData {
//   id?: number;
//   name?: string;
//   salary?: string;
//   opt?: string;
//   year_one?: string;
//   [key: string]: any;
// }

// interface PlayersRow {
//   team: string;
//   active_roster: PlayerData[] | string | null;
//   opt?: string;
//   year_one?: string;
//   id?: number;
//   [key: string]: any;
// }

// interface Decision {
//   playerName: string;
//   team: string;
//   salary?: string;
//   result: "accepted" | "declined";
//   saving?: boolean;
//   id?: number;
// }

// const TeamOptionUser: React.FC = () => {
//   const [teams, setTeams] = useState<string[]>([]);
//   const [selectedTeam, setSelectedTeam] = useState<string>("");
//   const [players, setPlayers] = useState<PlayerData[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [teamsLoading, setTeamsLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [decisions, setDecisions] = useState<{ [key: string]: Decision }>({});
//   const [saving, setSaving] = useState<boolean>(false);

//   // Функция для форматирования числа в виде тысячи (с разделителем)
//   const formatNumber = (value: string | number | undefined): string => {
//     if (!value) return "";

//     const numStr = String(value).replace(/[^\d.]/g, "");
//     const num = parseFloat(numStr);

//     if (isNaN(num)) return String(value);

//     return new Intl.NumberFormat("ru-RU", {
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0,
//     }).format(num);
//   };

//   // Функция для извлечения значения после "TO-" из year_one
//   const extractValueAfterTO = (yearOneValue: string | undefined): string => {
//     if (!yearOneValue) return "";

//     if (typeof yearOneValue === "string") {
//       const toMatch = yearOneValue.match(/^TO-\s*(.+)/i);
//       if (toMatch && toMatch[1]) {
//         return toMatch[1].trim();
//       } else if (yearOneValue.startsWith("TO-")) {
//         return yearOneValue.substring(3).trim();
//       }
//     }

//     return "";
//   };

//   // Получаем список уникальных команд
//   useEffect(() => {
//     const fetchTeams = async (): Promise<void> => {
//       try {
//         setTeamsLoading(true);
//         setError(null);

//         const { data, error } = await supabase
//           .from("Players")
//           .select<string, PlayersRow>("team, opt");

//         if (error) throw error;

//         const uniqueTeams = Array.from(
//           new Set(
//             data
//               .map((item) => item.team)
//               .filter(
//                 (team): team is string => team != null && team.trim() !== "",
//               ),
//           ),
//         );

//         setTeams(uniqueTeams.sort());
//       } catch (err) {
//         console.error("Ошибка при загрузке команд:", err);
//         setError("Не удалось загрузить список команд");
//       } finally {
//         setTeamsLoading(false);
//       }
//     };

//     fetchTeams();
//   }, []);

//   // Загружаем существующие решения для выбранной команды
//   useEffect(() => {
//     const fetchExistingDecisions = async () => {
//       if (!selectedTeam) return;

//       try {
//         const { data, error } = await supabase
//           .from("market_TO")
//           .select("*")
//           .eq("team", selectedTeam);

//         if (error) throw error;

//         const decisionsMap: { [key: string]: Decision } = {};
//         data?.forEach((item: any) => {
//           const key = `${item.name}_${selectedTeam}`;
//           decisionsMap[key] = {
//             playerName: item.name,
//             team: item.team,
//             salary: item.salary,
//             result: item.result,
//             id: item.id,
//             saving: false,
//           };
//         });

//         setDecisions(decisionsMap);
//       } catch (err) {
//         console.error("Ошибка при загрузке решений:", err);
//       }
//     };

//     if (selectedTeam) {
//       fetchExistingDecisions();
//     }
//   }, [selectedTeam]);

//   // Функция для фильтрации игроков по значению opt === "TO" и year_one с префиксом "TO-"
//   const filterPlayersByOpt = (playersList: PlayerData[]): PlayerData[] => {
//     return playersList.filter((player) => {
//       if (player.opt && player.opt === "TO") {
//         return true;
//       }

//       const optValue = player.OPT || player.option || player.player_option;
//       if (optValue === "TO") {
//         return true;
//       }

//       if (player.year_one && player.year_one.startsWith("TO-")) {
//         return true;
//       }

//       const yearOneValue = player.yearOne || player.year;
//       if (
//         yearOneValue &&
//         typeof yearOneValue === "string" &&
//         yearOneValue.startsWith("TO-")
//       ) {
//         return true;
//       }

//       return false;
//     });
//   };

//   // Получаем игроков выбранной команды
//   const fetchPlayers = async (teamName: string): Promise<void> => {
//     if (!teamName) {
//       setPlayers([]);
//       setDecisions({});
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     try {
//       const { data, error } = await supabase
//         .from("Players")
//         .select<string, PlayersRow>("active_roster, opt, year_one")
//         .eq("team", teamName);

//       if (error) throw error;

//       let playerList: PlayerData[] = [];

//       if (data && data.length > 0) {
//         data.forEach((row) => {
//           if (row && row.active_roster) {
//             if (Array.isArray(row.active_roster)) {
//               const playersWithOpt = row.active_roster.map((player) => ({
//                 ...player,
//                 opt: player.opt || row.opt,
//                 year_one: player.year_one || row.year_one,
//               }));
//               playerList = [...playerList, ...playersWithOpt];
//             } else if (typeof row.active_roster === "string") {
//               try {
//                 const parsed = JSON.parse(row.active_roster);
//                 if (Array.isArray(parsed)) {
//                   const playersWithOpt = parsed.map((player) => ({
//                     ...player,
//                     opt: player.opt || row.opt,
//                     year_one: player.year_one || row.year_one,
//                   }));
//                   playerList = [...playerList, ...playersWithOpt];
//                 } else if (parsed && typeof parsed === "object") {
//                   playerList.push({
//                     ...parsed,
//                     opt: parsed.opt || row.opt,
//                     year_one: parsed.year_one || row.year_one,
//                   });
//                 }
//               } catch (parseError) {
//                 console.warn("Не удалось распарсить JSON игроков:", parseError);
//                 if (row.active_roster.includes(",")) {
//                   const playersFromString = row.active_roster
//                     .split(",")
//                     .map((name) => ({
//                       name: name.trim(),
//                       opt: row.opt,
//                       year_one: row.year_one,
//                     }));
//                   playerList = [...playerList, ...playersFromString];
//                 } else if (row.active_roster.trim() !== "") {
//                   playerList.push({
//                     name: row.active_roster,
//                     opt: row.opt,
//                     year_one: row.year_one,
//                   });
//                 }
//               }
//             } else if (
//               typeof row.active_roster === "object" &&
//               row.active_roster !== null &&
//               !Array.isArray(row.active_roster)
//             ) {
//               const playerObj = row.active_roster as PlayerData;
//               playerList.push({
//                 ...playerObj,
//                 opt: playerObj.opt || row.opt,
//                 year_one: playerObj.year_one || row.year_one,
//               });
//             }
//           }
//         });
//       }

//       const uniquePlayers = playerList.filter((player, index, self) => {
//         if (!player) return false;

//         const hasData =
//           player.name ||
//           Object.keys(player).some(
//             (key) =>
//               key !== "id" &&
//               key !== "opt" &&
//               key !== "year_one" &&
//               player[key] &&
//               typeof player[key] === "string" &&
//               player[key].trim() !== "",
//           );

//         if (!hasData) return false;

//         if (player.name) {
//           return self.findIndex((p) => p.name === player.name) === index;
//         }
//         return true;
//       });

//       const filteredPlayers = filterPlayersByOpt(uniquePlayers);
//       setPlayers(filteredPlayers);
//     } catch (err: any) {
//       console.error("Ошибка при загрузке игроков:", err);

//       let errorMessage = "Неизвестная ошибка";
//       if (
//         err.message.includes("Cannot coerce the result to a single JSON object")
//       ) {
//         errorMessage =
//           "Ошибка структуры данных. В базе может быть несколько записей для одной команды. Обратитесь к администратору.";
//       } else {
//         errorMessage = `Ошибка загрузки игроков: ${err.message || "Неизвестная ошибка"}`;
//       }

//       setError(errorMessage);
//       setPlayers([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Функция для сохранения решения
//   const saveDecision = async (
//     player: PlayerData,
//     result: "accepted" | "declined",
//   ): Promise<void> => {
//     if (!player.name || !selectedTeam) {
//       setError(
//         "Не удалось сохранить решение: отсутствует имя игрока или команда",
//       );
//       return;
//     }

//     let salaryToSave = "";
//     const yearOneValue = player.year_one || player.yearOne || player.year;
//     salaryToSave = extractValueAfterTO(yearOneValue);

//     if (!salaryToSave && player.salary) {
//       salaryToSave = String(player.salary);
//     }

//     const key = `${player.name}_${selectedTeam}`;
//     const currentDecision = decisions[key];

//     // Сразу обновляем UI
//     setDecisions((prev) => ({
//       ...prev,
//       [key]: {
//         playerName: player.name!,
//         team: selectedTeam,
//         salary: salaryToSave,
//         result,
//         id: currentDecision?.id,
//         saving: true,
//       },
//     }));

//     setSaving(true);

//     try {
//       // Проверяем существование записи по имени и команде
//       const { data: existingData, error: checkError } = await supabase
//         .from("market_TO")
//         .select("id")
//         .eq("name", player.name)
//         .eq("team", selectedTeam)
//         .maybeSingle();

//       if (checkError) throw checkError;

//       // Если запись существует - обновляем, иначе создаем новую
//       if (existingData) {
//         const { error: updateError } = await supabase
//           .from("market_TO")
//           .update({
//             salary: salaryToSave,
//             result,
//           })
//           .eq("id", existingData.id);

//         if (updateError) throw updateError;

//         // Успешное обновление
//         setDecisions((prev) => ({
//           ...prev,
//           [key]: {
//             ...prev[key],
//             id: existingData.id,
//             saving: false,
//           },
//         }));
//       } else {
//         const { data: insertData, error: insertError } = await supabase
//           .from("market_TO")
//           .insert({
//             name: player.name,
//             team: selectedTeam,
//             salary: salaryToSave,
//             result,
//           })
//           .select();

//         if (insertError) throw insertError;

//         // Успешное создание, получаем id новой записи
//         if (insertData && insertData.length > 0) {
//           setDecisions((prev) => ({
//             ...prev,
//             [key]: {
//               ...prev[key],
//               id: insertData[0].id,
//               saving: false,
//             },
//           }));
//         }
//       }
//     } catch (err: any) {
//       console.error("Ошибка при сохранении решения:", err);

//       // Восстанавливаем предыдущее состояние при ошибке
//       if (currentDecision) {
//         setDecisions((prev) => ({
//           ...prev,
//           [key]: {
//             ...currentDecision,
//             saving: false,
//           },
//         }));
//       } else {
//         // Удаляем запись из состояния если она не существовала ранее
//         setDecisions((prev) => {
//           const newDecisions = { ...prev };
//           delete newDecisions[key];
//           return newDecisions;
//         });
//       }

//       setError(
//         `Не удалось сохранить решение: ${err.message || "Неизвестная ошибка"}`,
//       );
//     } finally {
//       setSaving(false);
//     }
//   };

//   // Функция для удаления решения
//   const deleteDecision = async (playerName: string): Promise<void> => {
//     if (!playerName || !selectedTeam) return;

//     try {
//       const { error } = await supabase
//         .from("market_TO")
//         .delete()
//         .eq("name", playerName)
//         .eq("team", selectedTeam);

//       if (error) throw error;

//       // Обновляем локальное состояние
//       const key = `${playerName}_${selectedTeam}`;
//       setDecisions((prev) => {
//         const newDecisions = { ...prev };
//         delete newDecisions[key];
//         return newDecisions;
//       });
//     } catch (err: any) {
//       console.error("Ошибка при удалении решения:", err);
//       setError(
//         `Не удалось удалить решение: ${err.message || "Неизвестная ошибка"}`,
//       );
//     }
//   };

//   // Функция для получения решения по игроку
//   const getPlayerDecision = (player: PlayerData): Decision | null => {
//     if (!player.name || !selectedTeam) return null;
//     const key = `${player.name}_${selectedTeam}`;
//     const decision = decisions[key];

//     // Дополнительная проверка, что это именно тот игрок
//     if (
//       decision &&
//       decision.playerName === player.name &&
//       decision.team === selectedTeam
//     ) {
//       return decision;
//     }

//     return null;
//   };

//   const handleTeamSelect = (e: ChangeEvent<HTMLSelectElement>): void => {
//     const team = e.target.value;
//     setSelectedTeam(team);
//     if (team) {
//       fetchPlayers(team);
//     } else {
//       setPlayers([]);
//       setDecisions({});
//     }
//   };

//   const renderPlayerCard = (
//     player: PlayerData,
//     index: number,
//   ): React.ReactElement => {
//     if (typeof player === "string") {
//       return (
//         <div key={index} className="playerTeamOption-card">
//           <p className="playerTeamOption-card-name">{player}</p>
//         </div>
//       );
//     }

//     // Определяем, показывать ли бейдж TO
//     const hasTOOpt =
//       player.opt === "TO" ||
//       player.OPT === "TO" ||
//       player.option === "TO" ||
//       player.player_option === "TO";

//     const hasTOYearOne =
//       (player.year_one && player.year_one.startsWith("TO-")) ||
//       (player.yearOne && player.yearOne.startsWith("TO-")) ||
//       (player.year && player.year.startsWith("TO-"));

//     const showTOBadge = hasTOOpt || hasTOYearOne;

//     // Извлекаем значение для сохранения
//     const yearOneValue = player.year_one || player.yearOne || player.year;
//     const extractedValue = extractValueAfterTO(yearOneValue);

//     // Получаем решение по игроку
//     const playerDecision = getPlayerDecision(player);
//     const hasDecision = !!playerDecision;
//     const isSaving = playerDecision?.saving || false;

//     return (
//       <div key={player.id || index} className="playerTeamOption-card">
//         {showTOBadge && <div className="playerTeamOption-badge">TO</div>}

//         {player.name && (
//           <h3 className="playerTeamOption-card-name">{player.name}</h3>
//         )}

//         <div className="playerTeamOption-details">
//           {player.salary && (
//             <p>
//               <span className="playerTeamOption-detail-label">Зарплата:</span>{" "}
//               {player.salary}
//             </p>
//           )}
//           {player.opt && (
//             <p className="playerTeamOption-opt-detail">
//               <span className="playerTeamOption-detail-label">Опция:</span>{" "}
//               {player.opt}
//             </p>
//           )}
//           {/* Отображаем только отформатированную сумму опции */}
//           {extractedValue && (
//             <p className="playerTeamOption-extracted-value">
//               <span className="playerTeamOption-detail-label">
//                 Сумма опции:
//               </span>{" "}
//               {formatNumber(extractedValue)}
//             </p>
//           )}
//         </div>

//         {/* Кнопки принятия решения */}
//         {player.name && (
//           <div className="playerTeamOption-decision-section">
//             {hasDecision ? (
//               <div className="playerTeamOption-decision-display">
//                 <div
//                   className={`playerTeamOption-decision-result playerTeamOption-decision-result-${playerDecision.result}`}
//                 >
//                   {playerDecision.result === "accepted"
//                     ? "✓ Принято"
//                     : "✗ Отклонено"}
//                 </div>
//                 {playerDecision.salary && (
//                   <div className="playerTeamOption-decision-salary">
//                     {formatNumber(playerDecision.salary)}
//                   </div>
//                 )}
//                 {isSaving && <div className="playerTeamOption-spinner" />}
//                 <button
//                   onClick={() => {
//                     const key = `${player.name}_${selectedTeam}`;
//                     setDecisions((prev) => {
//                       const newDecisions = { ...prev };
//                       delete newDecisions[key];
//                       return newDecisions;
//                     });
//                     deleteDecision(player.name!);
//                   }}
//                   className="playerTeamOption-change-decision-btn"
//                   disabled={isSaving}
//                 >
//                   Изменить
//                 </button>
//               </div>
//             ) : (
//               <div className="playerTeamOption-decision-buttons">
//                 <button
//                   onClick={() => saveDecision(player, "accepted")}
//                   disabled={isSaving || saving}
//                   className="playerTeamOption-accept-btn"
//                 >
//                   Принято
//                 </button>
//                 <button
//                   onClick={() => saveDecision(player, "declined")}
//                   disabled={isSaving || saving}
//                   className="playerTeamOption-decline-btn"
//                 >
//                   Отклонено
//                 </button>
//                 {isSaving && (
//                   <div className="playerTeamOption-spinner-container">
//                     <div className="playerTeamOption-spinner" />
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     );
//   };

//   return (
//     <div className="playerTeamOption-container">
//       <div className="playerTeamOption-header-section">
//         <h1 className="playerTeamOption-main-title">
//           Командные опции (Team Options)
//         </h1>
//         <p className="playerTeamOption-subtitle">
//           Выберите команду НБА для просмотра игроков с опцией TO
//         </p>
//       </div>

//       {error && (
//         <div className="playerTeamOption-error-container">
//           <p className="playerTeamOption-error-message">Ошибка: {error}</p>
//           <button
//             onClick={() => setError(null)}
//             className="playerTeamOption-error-dismiss"
//           >
//             Скрыть
//           </button>
//         </div>
//       )}

//       <div className="playerTeamOption-team-selector-container">
//         <label className="playerTeamOption-team-selector-label">
//           Выберите команду НБА:
//         </label>

//         <div className="playerTeamOption-selector-wrapper">
//           {teamsLoading ? (
//             <div className="playerTeamOption-loading-teams">
//               <div className="playerTeamOption-spinner-large" />
//             </div>
//           ) : teams.length > 0 ? (
//             <select
//               value={selectedTeam}
//               onChange={handleTeamSelect}
//               disabled={loading}
//               className="playerTeamOption-team-select"
//             >
//               <option value="">
//                 {loading ? "Загрузка..." : "Выберите команду"}
//               </option>
//               {teams.map((team) => (
//                 <option key={team} value={team}>
//                   {team}
//                 </option>
//               ))}
//             </select>
//           ) : (
//             <div className="playerTeamOption-no-teams">
//               Команды не найдены в базе данных
//             </div>
//           )}
//         </div>

//         {selectedTeam && !loading && (
//           <div className="playerTeamOption-selected-team-info">
//             <div>
//               <span className="playerTeamOption-selected-team-label">
//                 Выбрана команда:{" "}
//               </span>
//               <span className="playerTeamOption-selected-team-name">
//                 {selectedTeam}
//               </span>
//             </div>
//             <button
//               onClick={() => {
//                 setSelectedTeam("");
//                 setPlayers([]);
//                 setDecisions({});
//               }}
//               className="playerTeamOption-reset-btn"
//             >
//               Сбросить выбор
//             </button>
//           </div>
//         )}
//       </div>

//       {selectedTeam && (
//         <div className="playerTeamOption-players-container">
//           <div className="playerTeamOption-players-content">
//             <div className="playerTeamOption-players-header">
//               <div className="playerTeamOption-players-title-section">
//                 <h2 className="playerTeamOption-players-title">
//                   Игроки с опцией TO в команде{" "}
//                   <span className="playerTeamOption-team-highlight">
//                     {selectedTeam}
//                   </span>
//                 </h2>
//                 <p className="playerTeamOption-players-subtitle">
//                   Показаны только игроки с опцией Team Option (TO) или с годом,
//                   начинающимся с "TO-"
//                 </p>
//               </div>

//               <div className="playerTeamOption-players-stats-info">
//                 <div className="playerTeamOption-stats-badge">
//                   <div className="playerTeamOption-stats-indicator" />
//                   <span className="playerTeamOption-stats-text">
//                     Всего игроков с опцией TO: <strong>{players.length}</strong>
//                   </span>
//                 </div>
//               </div>

//               <div className="playerTeamOption-players-status">
//                 {loading && (
//                   <div className="playerTeamOption-loading-players">
//                     <div className="playerTeamOption-spinner" />
//                     <span>Загрузка игроков с опцией TO...</span>
//                   </div>
//                 )}
//                 {players.length > 0 && !loading && (
//                   <div className="playerTeamOption-decisions-stats">
//                     <span className="playerTeamOption-accepted-count">
//                       Принято:{" "}
//                       {
//                         Object.values(decisions).filter(
//                           (d) => d.result === "accepted",
//                         ).length
//                       }
//                     </span>
//                     <span className="playerTeamOption-declined-count">
//                       Отклонено:{" "}
//                       {
//                         Object.values(decisions).filter(
//                           (d) => d.result === "declined",
//                         ).length
//                       }
//                     </span>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {loading ? (
//               <div className="playerTeamOption-players-grid">
//                 {[...Array(6)].map((_, index) => (
//                   <div
//                     key={index}
//                     className="playerTeamOption-player-card-skeleton"
//                   >
//                     <div className="playerTeamOption-skeleton-line playerTeamOption-name-skeleton" />
//                     <div className="playerTeamOption-skeleton-details">
//                       <div className="playerTeamOption-skeleton-line playerTeamOption-detail-skeleton" />
//                       <div className="playerTeamOption-skeleton-line playerTeamOption-detail-skeleton" />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : players.length > 0 ? (
//               <div className="playerTeamOption-players-grid">
//                 {players.map((player, index) =>
//                   renderPlayerCard(player, index),
//                 )}
//               </div>
//             ) : !loading ? (
//               <div className="playerTeamOption-no-players">
//                 <div className="playerTeamOption-no-players-icon">
//                   <svg
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                     xmlns="http://www.w3.org/2000/svg"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={1}
//                       d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
//                     />
//                   </svg>
//                 </div>
//                 <p className="playerTeamOption-no-players-title">
//                   Игроки с опцией TO не найдены
//                 </p>
//                 <p className="playerTeamOption-no-players-subtitle">
//                   В этой команде нет игроков с опцией "TO" или year_one,
//                   начинающимся с "TO-"
//                 </p>
//               </div>
//             ) : null}
//           </div>
//         </div>
//       )}

//       <div className="playerTeamOption-footer-info">
//         <p>Данные загружаются из базы данных Supabase</p>
//         <p>Таблица: Players, Колонки: team, active_roster, opt, year_one</p>
//         <p>
//           Сохранение решений: таблица market_TO, Колонки: id, name, team,
//           salary, result
//         </p>
//         <p className="playerTeamOption-footer-note">
//           Фильтр: показываются только игроки с opt="TO" ИЛИ year_one начинается
//           с "TO-"
//         </p>
//         <p className="playerTeamOption-footer-note">
//           В salary сохраняется значение после "TO-" из поля year_one
//         </p>
//         <p className="playerTeamOption-footer-note">
//           При сохранении проверяется существование записи по name и team
//         </p>
//       </div>
//     </div>
//   );
// };

// export default TeamOptionUser;
