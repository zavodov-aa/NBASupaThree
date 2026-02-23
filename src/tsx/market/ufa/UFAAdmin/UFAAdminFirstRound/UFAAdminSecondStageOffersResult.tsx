// UFAAdminSecondStageOffersResult.tsx
import React, { useState, useEffect, useRef, useMemo } from "react";
import { supabase } from "../../../../../Supabase";
import "./ufaAdminSecondStageOffersResult.css";

interface Player {
  id: string;
  active_roster: string;
  opt: string;
}

interface NBATeam {
  team_name: string;
}

interface UfaResult {
  id: number;
  player: string;
  ufa_first_round_second_stage_result: string | null;
  created_at: string;
}

const UFAAdminSecondStageOffersResult = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [nbaTeams, setNbaTeams] = useState<NBATeam[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [teamsLoading, setTeamsLoading] = useState<boolean>(true);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [saveMessage, setSaveMessage] = useState<string>("");
  const [showResults, setShowResults] = useState<boolean>(false);
  const [ufaResults, setUfaResults] = useState<UfaResult[]>([]);
  const [loadingResults, setLoadingResults] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Загрузка игроков с opt = UFA
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const { data, error } = await supabase
          .from("Players")
          .select("id, active_roster, opt")
          .eq("opt", "UFA")
          .order("active_roster");

        if (error) throw error;
        setPlayers(data || []);
      } catch (error) {
        console.error("Error fetching players:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchNBATeams = async () => {
      try {
        const { data, error } = await supabase.from("Head").select("team_name");

        if (error) throw error;

        const uniqueTeams = Array.from(
          new Set((data || []).map((item) => item.team_name)),
        ).map((team_name) => ({ team_name }));

        setNbaTeams(uniqueTeams);
      } catch (error) {
        console.error("Error fetching NBA teams:", error);
      } finally {
        setTeamsLoading(false);
      }
    };

    fetchPlayers();
    fetchNBATeams();
  }, []);

  // Закрытие dropdown при клике вне
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Фильтрация игроков по поиску
  const filteredPlayers = useMemo(() => {
    if (!searchTerm) return players;
    return players.filter((player) =>
      player.active_roster.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [players, searchTerm]);

  const handleInputClick = () => {
    setIsDropdownOpen(true);
    inputRef.current?.focus();
  };

  const handlePlayerSelect = (player: Player) => {
    setSelectedPlayer(player);
    setSearchTerm(player.active_roster);
    setIsDropdownOpen(false);
    setSelectedTeam("");
    setSaveMessage("");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsDropdownOpen(true);
    if (selectedPlayer) {
      setSelectedPlayer(null);
      setSelectedTeam("");
    }
  };

  const handleClearSelection = () => {
    setSelectedPlayer(null);
    setSelectedTeam("");
    setSearchTerm("");
    setIsDropdownOpen(true);
    setSaveMessage("");
    inputRef.current?.focus();
  };

  const handleTeamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTeam(e.target.value);
    setSaveMessage("");
  };

  // --- ЛОГИКА СОХРАНЕНИЯ ДЛЯ ВТОРОГО ЭТАПА UFA ---
  const handleSaveResult = async (): Promise<void> => {
    if (!selectedPlayer || !selectedTeam) {
      setSaveMessage("Пожалуйста, выберите игрока и команду");
      return;
    }

    setSaving(true);
    setSaveMessage("");

    try {
      const playerName = selectedPlayer.active_roster;

      // 1. Проверяем, существует ли уже запись для этого игрока
      const { data: existingRecords, error: selectError } = await supabase
        .from("Market_UFA_first_round_result")
        .select("id")
        .eq("player", playerName);

      if (selectError) throw selectError;

      const existingRecord = existingRecords?.[0];

      if (!existingRecord) {
        // Записи нет → создаём новую, заполняем только второй этап
        const { error: insertError } = await supabase
          .from("Market_UFA_first_round_result")
          .insert([
            {
              player: playerName,
              ufa_first_round_first_stage_result: null,
              ufa_first_round_second_stage_result: selectedTeam,
            },
          ]);

        if (insertError) throw insertError;
        setSaveMessage("Результат второго этапа успешно сохранён!");
      } else {
        // Запись уже есть → обновляем только второй этап
        const { error: updateError } = await supabase
          .from("Market_UFA_first_round_result")
          .update({
            ufa_first_round_second_stage_result: selectedTeam,
          })
          .eq("id", existingRecord.id);

        if (updateError) throw updateError;
        setSaveMessage("Результат второго этапа успешно обновлён!");
      }

      // Если таблица результатов открыта — обновляем её
      if (showResults) {
        await fetchUfaResults();
      }

      setTimeout(() => setSaveMessage(""), 3000);
    } catch (error: any) {
      console.error("Ошибка при сохранении результата:", error);
      setSaveMessage(
        "Ошибка при сохранении: " + (error.message || "неизвестная ошибка"),
      );
    } finally {
      setSaving(false);
    }
  };

  // --- ЗАГРУЗКА РЕЗУЛЬТАТОВ (только второй этап) ---
  const fetchUfaResults = async (): Promise<void> => {
    setLoadingResults(true);
    try {
      const { data, error } = await supabase
        .from("Market_UFA_first_round_result")
        .select("id, created_at, player, ufa_first_round_second_stage_result")
        .not("ufa_first_round_second_stage_result", "is", null)
        .neq("ufa_first_round_second_stage_result", "")
        .order("player");

      if (error) throw error;
      setUfaResults(data || []);
    } catch (error: any) {
      console.error(
        "Ошибка при загрузке результатов второго этапа UFA:",
        error,
      );
      setSaveMessage("Ошибка загрузки результатов: " + error.message);
    } finally {
      setLoadingResults(false);
    }
  };

  // Очистка всех результатов (полная очистка таблицы)
  const handleClearResults = async (): Promise<void> => {
    if (
      !window.confirm("Вы уверены, что хотите очистить все результаты UFA?")
    ) {
      return;
    }

    try {
      const { error } = await supabase
        .from("Market_UFA_first_round_result")
        .delete()
        .neq("id", 0);

      if (error) throw error;

      setUfaResults([]);
      setSaveMessage("Все результаты успешно очищены!");
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (error: any) {
      console.error("Ошибка при очистке результатов:", error);
      setSaveMessage("Ошибка очистки: " + error.message);
    }
  };

  const handleToggleResults = (): void => {
    if (!showResults) {
      fetchUfaResults();
    }
    setShowResults(!showResults);
  };

  if (loading || teamsLoading) {
    return (
      <div className="ufaAdminSecondStageOffersResult-loading">
        Загрузка игроков и команд...
      </div>
    );
  }

  return (
    <div className="ufaAdminSecondStageOffersResult">
      <h2 className="ufaAdminSecondStageOffersResult-title">
        Результаты UFA (второй этап)
      </h2>

      {/* Блок поиска и выбора игрока */}
      <div className="ufaAdminSecondStageOffersResult-filtersPanel">
        <div
          className="ufaAdminSecondStageOffersResult-searchWrapper"
          ref={dropdownRef}
        >
          <label className="ufaAdminSecondStageOffersResult-filterLabel">
            Поиск игрока:
          </label>
          <div className="ufaAdminSecondStageOffersResult-searchContainer">
            <input
              ref={inputRef}
              type="text"
              placeholder="Введите имя игрока..."
              value={searchTerm}
              onChange={handleSearchChange}
              onClick={handleInputClick}
              className="ufaAdminSecondStageOffersResult-searchInput"
              aria-label="Поиск игрока"
            />
            {selectedPlayer && (
              <button
                type="button"
                onClick={handleClearSelection}
                className="ufaAdminSecondStageOffersResult-clearBtn"
                aria-label="Очистить выбор"
              >
                ×
              </button>
            )}
          </div>
          {isDropdownOpen && (
            <div className="ufaAdminSecondStageOffersResult-dropdown">
              <div className="ufaAdminSecondStageOffersResult-dropdownContent">
                {filteredPlayers.length === 0 ? (
                  <div className="ufaAdminSecondStageOffersResult-noResults">
                    Не найдено игроков по запросу "{searchTerm}"
                  </div>
                ) : (
                  filteredPlayers.map((player) => (
                    <div
                      key={player.id}
                      onClick={() => handlePlayerSelect(player)}
                      className={`ufaAdminSecondStageOffersResult-option ${
                        selectedPlayer?.id === player.id
                          ? "ufaAdminSecondStageOffersResult-optionSelected"
                          : ""
                      }`}
                    >
                      {player.active_roster}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
        <div className="ufaAdminSecondStageOffersResult-resultsCount">
          Найдено игроков: <strong>{players.length}</strong>
        </div>
      </div>

      {/* Карточка выбранного игрока */}
      {selectedPlayer && (
        <div className="ufaAdminSecondStageOffersResult-selectedContainer">
          <div className="ufaAdminSecondStageOffersResult-selectedCard">
            <div className="ufaAdminSecondStageOffersResult-selectedHeader">
              <div className="ufaAdminSecondStageOffersResult-selectedLabel">
                Выбранный игрок
              </div>
              <div className="ufaAdminSecondStageOffersResult-selectedName">
                {selectedPlayer.active_roster}
              </div>
            </div>
            <div className="ufaAdminSecondStageOffersResult-teamSelector">
              <label
                htmlFor="team-select"
                className="ufaAdminSecondStageOffersResult-filterLabel"
              >
                Лидирующая команда после второго этапа UFA:
              </label>
              <select
                id="team-select"
                value={selectedTeam}
                onChange={handleTeamChange}
                className="ufaAdminSecondStageOffersResult-teamSelect"
                disabled={saving}
              >
                <option value="">-- Выберите команду --</option>
                {nbaTeams.map((team, index) => (
                  <option key={index} value={team.team_name}>
                    {team.team_name}
                  </option>
                ))}
              </select>
            </div>
            {saveMessage && (
              <div
                className={`ufaAdminSecondStageOffersResult-message ${
                  saveMessage.includes("Ошибка")
                    ? "ufaAdminSecondStageOffersResult-messageError"
                    : saveMessage.includes("успешно")
                      ? "ufaAdminSecondStageOffersResult-messageSuccess"
                      : "ufaAdminSecondStageOffersResult-messageWarning"
                }`}
              >
                {saveMessage}
              </div>
            )}
            <div className="ufaAdminSecondStageOffersResult-actions">
              <button
                onClick={handleSaveResult}
                disabled={saving || !selectedTeam}
                className="ufaAdminSecondStageOffersResult-saveBtn"
              >
                {saving ? "Сохранение..." : "Сохранить результат"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Блок отображения результатов */}
      <div className="ufaAdminSecondStageOffersResult-resultsSection">
        <div className="ufaAdminSecondStageOffersResult-resultsHeader">
          <button
            onClick={handleToggleResults}
            className="ufaAdminSecondStageOffersResult-toggleResultsBtn"
          >
            {showResults ? "▲ Скрыть результаты" : "▼ Показать все результаты"}
          </button>
          {showResults && ufaResults.length > 0 && (
            <button
              onClick={handleClearResults}
              className="ufaAdminSecondStageOffersResult-clearAllBtn"
            >
              Очистить все
            </button>
          )}
        </div>

        {showResults && (
          <div className="ufaAdminSecondStageOffersResult-resultsTable">
            <h3>Результаты UFA (второй этап)</h3>
            {loadingResults ? (
              <div className="ufaAdminSecondStageOffersResult-loading">
                Загрузка результатов...
              </div>
            ) : ufaResults.length === 0 ? (
              <div className="ufaAdminSecondStageOffersResult-noDataCell">
                Нет сохранённых результатов второго этапа
              </div>
            ) : (
              <>
                <div className="ufaAdminSecondStageOffersResult-resultsCount">
                  Найдено результатов: <strong>{ufaResults.length}</strong>
                </div>
                <div className="ufaAdminSecondStageOffersResult-tableWrapper">
                  <table className="ufaAdminSecondStageOffersResult-table">
                    <thead>
                      <tr>
                        <th className="ufaAdminSecondStageOffersResult-tableHeader">
                          Игрок
                        </th>
                        <th className="ufaAdminSecondStageOffersResult-tableHeader">
                          Команда (2 этап)
                        </th>
                        <th className="ufaAdminSecondStageOffersResult-tableHeader">
                          Дата обновления
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {ufaResults.map((result) => (
                        <tr
                          key={result.id}
                          className="ufaAdminSecondStageOffersResult-tableRow"
                        >
                          <td className="ufaAdminSecondStageOffersResult-tableCell">
                            {result.player}
                          </td>
                          <td className="ufaAdminSecondStageOffersResult-tableCell">
                            {result.ufa_first_round_second_stage_result}
                          </td>
                          <td className="ufaAdminSecondStageOffersResult-tableCell">
                            {result.created_at
                              ? new Date(result.created_at).toLocaleDateString(
                                  "ru-RU",
                                  {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                  },
                                )
                              : "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UFAAdminSecondStageOffersResult;
