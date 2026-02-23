import React, { useState, useEffect, useRef, useMemo } from "react";
import { supabase } from "../../../../../Supabase";
import "./ufaAdminFifthStageOffersResult.css";

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
  ufa_third_round_first_stage_result: string | null;
  ufa_third_round_second_stage_result: string | null;
  final_third_round_decision: string | null;
  created_at: string;
}

const UFAAdminFifthStageOffersResult = () => {
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

  // --- ЛОГИКА СОХРАНЕНИЯ ДЛЯ ТРЕТЬЕГО РАУНДА UFA (три этапа) ---
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
        .select(
          "id, ufa_third_round_first_stage_result, ufa_third_round_second_stage_result, final_third_round_decision",
        )
        .eq("player", playerName);

      if (selectError) throw selectError;

      const existingRecord = existingRecords?.[0];

      if (!existingRecord) {
        // --- СЛУЧАЙ 1: Записи нет → создаём новую, заполняем только первый этап
        const { error: insertError } = await supabase
          .from("Market_UFA_third_round_result")
          .insert([
            {
              player: playerName,
              ufa_third_round_first_stage_result: selectedTeam,
              ufa_third_round_second_stage_result: null,
              final_third_round_decision: null,
            },
          ]);

        if (insertError) throw insertError;
        setSaveMessage("Результат первого этапа успешно сохранён!");
      } else {
        // --- СЛУЧАЙ 2: Запись уже существует
        const hasFirstStage =
          existingRecord.ufa_third_round_first_stage_result &&
          existingRecord.ufa_third_round_first_stage_result.trim() !== "";
        const hasSecondStage =
          existingRecord.ufa_third_round_second_stage_result &&
          existingRecord.ufa_third_round_second_stage_result.trim() !== "";
        const hasFinalDecision =
          existingRecord.final_third_round_decision &&
          existingRecord.final_third_round_decision.trim() !== "";

        if (!hasFirstStage) {
          // 2a. Первый этап ещё не заполнен → обновляем его, остальные не трогаем
          const { error: updateError } = await supabase
            .from("Market_UFA_third_round_result")
            .update({
              ufa_third_round_first_stage_result: selectedTeam,
            })
            .eq("id", existingRecord.id);

          if (updateError) throw updateError;
          setSaveMessage("Результат первого этапа успешно обновлён!");
        } else if (!hasSecondStage) {
          // 2b. Первый этап есть, второй пуст → заполняем второй
          const { error: updateError } = await supabase
            .from("Market_UFA_third_round_result")
            .update({
              ufa_third_round_second_stage_result: selectedTeam,
            })
            .eq("id", existingRecord.id);

          if (updateError) throw updateError;
          setSaveMessage(
            "Результат второго этапа сохранён (первый не изменён)!",
          );
        } else {
          // 2c. Первый и второй этапы заполнены → заполняем/перезаписываем финальное решение
          const { error: updateError } = await supabase
            .from("Market_UFA_third_round_result")
            .update({
              final_third_round_decision: selectedTeam,
            })
            .eq("id", existingRecord.id);

          if (updateError) throw updateError;
          setSaveMessage(
            "Финальное решение сохранено (предыдущие этапы не изменены)!",
          );
        }
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

  // --- ЗАГРУЗКА РЕЗУЛЬТАТОВ (все три этапа третьего раунда) ---
  const fetchUfaResults = async (): Promise<void> => {
    setLoadingResults(true);
    try {
      const { data, error } = await supabase
        .from("Market_UFA_third_round_result")
        .select(
          "id, created_at, player, ufa_third_round_first_stage_result, ufa_third_round_second_stage_result, final_third_round_decision",
        )
        .order("player");

      if (error) throw error;
      setUfaResults(data || []);
    } catch (error: any) {
      console.error(
        "Ошибка при загрузке результатов третьего раунда UFA:",
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
        "Вы уверены, что хотите очистить все результаты UFA (третий раунд)?",
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
      <div className="ufaAdminFifthStageOffersResult-loading">
        Загрузка игроков и команд...
      </div>
    );
  }

  return (
    <div className="ufaAdminFifthStageOffersResult">
      <h2 className="ufaAdminFifthStageOffersResult-title">
        Результаты UFA (Пятый этап)
      </h2>

      {/* Блок поиска и выбора игрока */}
      <div className="ufaAdminFifthStageOffersResult-filtersPanel">
        <div
          className="ufaAdminFifthStageOffersResult-searchWrapper"
          ref={dropdownRef}
        >
          <label className="ufaAdminFifthStageOffersResult-filterLabel">
            Поиск игрока:
          </label>
          <div className="ufaAdminFifthStageOffersResult-searchContainer">
            <input
              ref={inputRef}
              type="text"
              placeholder="Введите имя игрока..."
              value={searchTerm}
              onChange={handleSearchChange}
              onClick={handleInputClick}
              className="ufaAdminFifthStageOffersResult-searchInput"
              aria-label="Поиск игрока"
            />
            {selectedPlayer && (
              <button
                type="button"
                onClick={handleClearSelection}
                className="ufaAdminFifthStageOffersResult-clearBtn"
                aria-label="Очистить выбор"
              >
                ×
              </button>
            )}
          </div>
          {isDropdownOpen && (
            <div className="ufaAdminFifthStageOffersResult-dropdown">
              <div className="ufaAdminFifthStageOffersResult-dropdownContent">
                {filteredPlayers.length === 0 ? (
                  <div className="ufaAdminFifthStageOffersResult-noResults">
                    Не найдено игроков по запросу "{searchTerm}"
                  </div>
                ) : (
                  filteredPlayers.map((player) => (
                    <div
                      key={player.id}
                      onClick={() => handlePlayerSelect(player)}
                      className={`ufaAdminFifthStageOffersResult-option ${
                        selectedPlayer?.id === player.id
                          ? "ufaAdminFifthStageOffersResult-optionSelected"
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
        <div className="ufaAdminFifthStageOffersResult-resultsCount">
          Найдено игроков: <strong>{players.length}</strong>
        </div>
      </div>

      {/* Карточка выбранного игрока */}
      {selectedPlayer && (
        <div className="ufaAdminFifthStageOffersResult-selectedContainer">
          <div className="ufaAdminFifthStageOffersResult-selectedCard">
            <div className="ufaAdminFifthStageOffersResult-selectedHeader">
              <div className="ufaAdminFifthStageOffersResult-selectedLabel">
                Выбранный игрок
              </div>
              <div className="ufaAdminFifthStageOffersResult-selectedName">
                {selectedPlayer.active_roster}
              </div>
            </div>
            <div className="ufaAdminFifthStageOffersResult-teamSelector">
              <label
                htmlFor="team-select"
                className="ufaAdminFifthStageOffersResult-filterLabel"
              >
                Команда (будет сохранена в следующий свободный этап):
              </label>
              <select
                id="team-select"
                value={selectedTeam}
                onChange={handleTeamChange}
                className="ufaAdminFifthStageOffersResult-teamSelect"
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
                className={`ufaAdminFifthStageOffersResult-message ${
                  saveMessage.includes("Ошибка")
                    ? "ufaAdminFifthStageOffersResult-messageError"
                    : saveMessage.includes("успешно")
                      ? "ufaAdminFifthStageOffersResult-messageSuccess"
                      : "ufaAdminFifthStageOffersResult-messageWarning"
                }`}
              >
                {saveMessage}
              </div>
            )}
            <div className="ufaAdminFifthStageOffersResult-actions">
              <button
                onClick={handleSaveResult}
                disabled={saving || !selectedTeam}
                className="ufaAdminFifthStageOffersResult-saveBtn"
              >
                {saving ? "Сохранение..." : "Сохранить результат"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Блок отображения результатов */}
      <div className="ufaAdminFifthStageOffersResult-resultsSection">
        <div className="ufaAdminFifthStageOffersResult-resultsHeader">
          <button
            onClick={handleToggleResults}
            className="ufaAdminFifthStageOffersResult-toggleResultsBtn"
          >
            {showResults ? "▲ Скрыть результаты" : "▼ Показать все результаты"}
          </button>
          {showResults && ufaResults.length > 0 && (
            <button
              onClick={handleClearResults}
              className="ufaAdminFifthStageOffersResult-clearAllBtn"
            >
              Очистить все
            </button>
          )}
        </div>

        {showResults && (
          <div className="ufaAdminFifthStageOffersResult-resultsTable">
            <h3>Результаты UFA (третий раунд, пятый этап)</h3>
            {loadingResults ? (
              <div className="ufaAdminFifthStageOffersResult-loading">
                Загрузка результатов...
              </div>
            ) : ufaResults.length === 0 ? (
              <div className="ufaAdminFifthStageOffersResult-noDataCell">
                Нет сохранённых результатов
              </div>
            ) : (
              <>
                <div className="ufaAdminFifthStageOffersResult-resultsCount">
                  Найдено результатов: <strong>{ufaResults.length}</strong>
                </div>
                <div className="ufaAdminFifthStageOffersResult-tableWrapper">
                  <table className="ufaAdminFifthStageOffersResult-table">
                    <thead>
                      <tr>
                        <th className="ufaAdminFifthStageOffersResult-tableHeader">
                          Игрок
                        </th>
                        <th className="ufaAdminFifthStageOffersResult-tableHeader">
                          1 этап
                        </th>
                        <th className="ufaAdminFifthStageOffersResult-tableHeader">
                          2 этап
                        </th>
                        <th className="ufaAdminFifthStageOffersResult-tableHeader">
                          Финальное решение
                        </th>
                        <th className="ufaAdminFifthStageOffersResult-tableHeader">
                          Дата обновления
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {ufaResults.map((result) => (
                        <tr
                          key={result.id}
                          className="ufaAdminFifthStageOffersResult-tableRow"
                        >
                          <td className="ufaAdminFifthStageOffersResult-tableCell">
                            {result.player}
                          </td>
                          <td className="ufaAdminFifthStageOffersResult-tableCell">
                            {result.ufa_third_round_first_stage_result || "-"}
                          </td>
                          <td className="ufaAdminFifthStageOffersResult-tableCell">
                            {result.ufa_third_round_second_stage_result || "-"}
                          </td>
                          <td className="ufaAdminFifthStageOffersResult-tableCell">
                            {result.final_third_round_decision || "-"}
                          </td>
                          <td className="ufaAdminFifthStageOffersResult-tableCell">
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

export default UFAAdminFifthStageOffersResult;
