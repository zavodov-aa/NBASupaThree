import React, { useState, useEffect, useRef, useMemo } from "react";
import { supabase } from "../../../../../Supabase";
import "./ufaAdminSixthStageOffersResult.css";

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
  ufa_third_round_second_stage_result: string | null;
  created_at: string;
}

const UFAAdminSixthStageOffersResult = () => {
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

  // --- ЛОГИКА СОХРАНЕНИЯ ДЛЯ ШЕСТОГО ЭТАПА UFA (второй подэтап) ---
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
        .from("Market_UFA_third_round_result")
        .select("id")
        .eq("player", playerName);

      if (selectError) throw selectError;

      const existingRecord = existingRecords?.[0];

      if (!existingRecord) {
        // Записи нет → создаём новую, заполняем только второй подэтап
        const { error: insertError } = await supabase
          .from("Market_UFA_third_round_result")
          .insert([
            {
              player: playerName,
              ufa_third_round_second_stage_result: selectedTeam,
            },
          ]);

        if (insertError) throw insertError;
        setSaveMessage("Результат шестого этапа успешно сохранён!");
      } else {
        // Запись уже есть → обновляем только второй подэтап
        const { error: updateError } = await supabase
          .from("Market_UFA_third_round_result")
          .update({
            ufa_third_round_second_stage_result: selectedTeam,
          })
          .eq("id", existingRecord.id);

        if (updateError) throw updateError;
        setSaveMessage("Результат шестого этапа успешно обновлён!");
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

  // --- ЗАГРУЗКА РЕЗУЛЬТАТОВ (только второй подэтап) ---
  const fetchUfaResults = async (): Promise<void> => {
    setLoadingResults(true);
    try {
      const { data, error } = await supabase
        .from("Market_UFA_third_round_result")
        .select("id, created_at, player, ufa_third_round_second_stage_result")
        .not("ufa_third_round_second_stage_result", "is", null)
        .neq("ufa_third_round_second_stage_result", "")
        .order("player");

      if (error) throw error;
      setUfaResults(data || []);
    } catch (error: any) {
      console.error(
        "Ошибка при загрузке результатов шестого этапа UFA:",
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
      !window.confirm(
        "Вы уверены, что хотите очистить все результаты UFA (шестой этап)?",
      )
    ) {
      return;
    }

    try {
      const { error } = await supabase
        .from("Market_UFA_third_round_result")
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
      <div className="ufaAdminSixthStageOffersResult-loading">
        Загрузка игроков и команд...
      </div>
    );
  }

  return (
    <div className="ufaAdminSixthStageOffersResult">
      <h2 className="ufaAdminSixthStageOffersResult-title">
        Результаты UFA (шестой этап)
      </h2>

      {/* Блок поиска и выбора игрока */}
      <div className="ufaAdminSixthStageOffersResult-filtersPanel">
        <div
          className="ufaAdminSixthStageOffersResult-searchWrapper"
          ref={dropdownRef}
        >
          <label className="ufaAdminSixthStageOffersResult-filterLabel">
            Поиск игрока:
          </label>
          <div className="ufaAdminSixthStageOffersResult-searchContainer">
            <input
              ref={inputRef}
              type="text"
              placeholder="Введите имя игрока..."
              value={searchTerm}
              onChange={handleSearchChange}
              onClick={handleInputClick}
              className="ufaAdminSixthStageOffersResult-searchInput"
              aria-label="Поиск игрока"
            />
            {selectedPlayer && (
              <button
                type="button"
                onClick={handleClearSelection}
                className="ufaAdminSixthStageOffersResult-clearBtn"
                aria-label="Очистить выбор"
              >
                ×
              </button>
            )}
          </div>
          {isDropdownOpen && (
            <div className="ufaAdminSixthStageOffersResult-dropdown">
              <div className="ufaAdminSixthStageOffersResult-dropdownContent">
                {filteredPlayers.length === 0 ? (
                  <div className="ufaAdminSixthStageOffersResult-noResults">
                    Не найдено игроков по запросу "{searchTerm}"
                  </div>
                ) : (
                  filteredPlayers.map((player) => (
                    <div
                      key={player.id}
                      onClick={() => handlePlayerSelect(player)}
                      className={`ufaAdminSixthStageOffersResult-option ${
                        selectedPlayer?.id === player.id
                          ? "ufaAdminSixthStageOffersResult-optionSelected"
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
        <div className="ufaAdminSixthStageOffersResult-resultsCount">
          Найдено игроков: <strong>{players.length}</strong>
        </div>
      </div>

      {/* Карточка выбранного игрока */}
      {selectedPlayer && (
        <div className="ufaAdminSixthStageOffersResult-selectedContainer">
          <div className="ufaAdminSixthStageOffersResult-selectedCard">
            <div className="ufaAdminSixthStageOffersResult-selectedHeader">
              <div className="ufaAdminSixthStageOffersResult-selectedLabel">
                Выбранный игрок
              </div>
              <div className="ufaAdminSixthStageOffersResult-selectedName">
                {selectedPlayer.active_roster}
              </div>
            </div>
            <div className="ufaAdminSixthStageOffersResult-teamSelector">
              <label
                htmlFor="team-select"
                className="ufaAdminSixthStageOffersResult-filterLabel"
              >
                Лидирующая команда после шестого этапа UFA:
              </label>
              <select
                id="team-select"
                value={selectedTeam}
                onChange={handleTeamChange}
                className="ufaAdminSixthStageOffersResult-teamSelect"
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
                className={`ufaAdminSixthStageOffersResult-message ${
                  saveMessage.includes("Ошибка")
                    ? "ufaAdminSixthStageOffersResult-messageError"
                    : saveMessage.includes("успешно")
                      ? "ufaAdminSixthStageOffersResult-messageSuccess"
                      : "ufaAdminSixthStageOffersResult-messageWarning"
                }`}
              >
                {saveMessage}
              </div>
            )}
            <div className="ufaAdminSixthStageOffersResult-actions">
              <button
                onClick={handleSaveResult}
                disabled={saving || !selectedTeam}
                className="ufaAdminSixthStageOffersResult-saveBtn"
              >
                {saving ? "Сохранение..." : "Сохранить результат"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Блок отображения результатов */}
      <div className="ufaAdminSixthStageOffersResult-resultsSection">
        <div className="ufaAdminSixthStageOffersResult-resultsHeader">
          <button
            onClick={handleToggleResults}
            className="ufaAdminSixthStageOffersResult-toggleResultsBtn"
          >
            {showResults ? "▲ Скрыть результаты" : "▼ Показать все результаты"}
          </button>
          {showResults && ufaResults.length > 0 && (
            <button
              onClick={handleClearResults}
              className="ufaAdminSixthStageOffersResult-clearAllBtn"
            >
              Очистить все
            </button>
          )}
        </div>

        {showResults && (
          <div className="ufaAdminSixthStageOffersResult-resultsTable">
            <h3>Результаты UFA (шестой этап)</h3>
            {loadingResults ? (
              <div className="ufaAdminSixthStageOffersResult-loading">
                Загрузка результатов...
              </div>
            ) : ufaResults.length === 0 ? (
              <div className="ufaAdminSixthStageOffersResult-noDataCell">
                Нет сохранённых результатов шестого этапа
              </div>
            ) : (
              <>
                <div className="ufaAdminSixthStageOffersResult-resultsCount">
                  Найдено результатов: <strong>{ufaResults.length}</strong>
                </div>
                <div className="ufaAdminSixthStageOffersResult-tableWrapper">
                  <table className="ufaAdminSixthStageOffersResult-table">
                    <thead>
                      <tr>
                        <th className="ufaAdminSixthStageOffersResult-tableHeader">
                          Игрок
                        </th>
                        <th className="ufaAdminSixthStageOffersResult-tableHeader">
                          Команда (6 этап)
                        </th>
                        <th className="ufaAdminSixthStageOffersResult-tableHeader">
                          Дата обновления
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {ufaResults.map((result) => (
                        <tr
                          key={result.id}
                          className="ufaAdminSixthStageOffersResult-tableRow"
                        >
                          <td className="ufaAdminSixthStageOffersResult-tableCell">
                            {result.player}
                          </td>
                          <td className="ufaAdminSixthStageOffersResult-tableCell">
                            {result.ufa_third_round_second_stage_result}
                          </td>
                          <td className="ufaAdminSixthStageOffersResult-tableCell">
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

export default UFAAdminSixthStageOffersResult;
