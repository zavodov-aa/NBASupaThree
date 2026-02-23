import React, { useState, useEffect, useRef, useMemo } from "react";
import { supabase } from "../../../../../Supabase";
import "./ufaAdminThirdStageOffersResult.css";

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
  ufa_second_round_first_stage_result: string | null;
  created_at: string;
}

const UFAAdminThirdStageOffersResult = () => {
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

  // --- ЛОГИКА СОХРАНЕНИЯ ДЛЯ ВТОРОГО РАУНДА UFA ---
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
        .from("Market_UFA_second_round_result")
        .select(
          "id, ufa_second_round_first_stage_result, ufa_second_round_second_stage_result",
        )
        .eq("player", playerName);

      if (selectError) throw selectError;

      const existingRecord = existingRecords?.[0];

      if (!existingRecord) {
        // --- СЛУЧАЙ 1: Записи нет → создаём новую, заполняем только первый этап
        const { error: insertError } = await supabase
          .from("Market_UFA_second_round_result")
          .insert([
            {
              player: playerName,
              ufa_second_round_first_stage_result: selectedTeam,
              ufa_second_round_second_stage_result: null,
            },
          ]);

        if (insertError) throw insertError;
        setSaveMessage("Результат первого этапа успешно сохранён!");
      } else {
        // --- СЛУЧАЙ 2: Запись уже существует
        const hasFirstStage =
          existingRecord.ufa_second_round_first_stage_result &&
          existingRecord.ufa_second_round_first_stage_result.trim() !== "";

        if (!hasFirstStage) {
          // 2a. Первый этап ещё не заполнен → обновляем его, второй не трогаем
          const { error: updateError } = await supabase
            .from("Market_UFA_second_round_result")
            .update({
              ufa_second_round_first_stage_result: selectedTeam,
            })
            .eq("id", existingRecord.id);

          if (updateError) throw updateError;
          setSaveMessage("Результат первого этапа успешно обновлён!");
        } else {
          // 2b. Первый этап уже есть → сохраняем команду во второй этап (перезаписываем)
          const { error: updateError } = await supabase
            .from("Market_UFA_second_round_result")
            .update({
              ufa_second_round_second_stage_result: selectedTeam,
            })
            .eq("id", existingRecord.id);

          if (updateError) throw updateError;
          setSaveMessage(
            "Результат второго этапа сохранён (первый не изменён)!",
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

  // --- ЗАГРУЗКА РЕЗУЛЬТАТОВ (только первый этап второго раунда) ---
  const fetchUfaResults = async (): Promise<void> => {
    setLoadingResults(true);
    try {
      const { data, error } = await supabase
        .from("Market_UFA_second_round_result")
        .select("id, created_at, player, ufa_second_round_first_stage_result")
        .not("ufa_second_round_first_stage_result", "is", null)
        .neq("ufa_second_round_first_stage_result", "")
        .order("player");

      if (error) throw error;
      setUfaResults(data || []);
    } catch (error: any) {
      console.error(
        "Ошибка при загрузке результатов первого этапа UFA (второй раунд):",
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
        "Вы уверены, что хотите очистить все результаты UFA (второй раунд)?",
      )
    ) {
      return;
    }

    try {
      const { error } = await supabase
        .from("Market_UFA_second_round_result")
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
      <div className="ufaAdminThirdStageOffersResult-loading">
        Загрузка игроков и команд...
      </div>
    );
  }

  return (
    <div className="ufaAdminThirdStageOffersResult">
      <h2 className="ufaAdminThirdStageOffersResult-title">
        Результаты UFA (Третий этап)
      </h2>

      {/* Блок поиска и выбора игрока */}
      <div className="ufaAdminThirdStageOffersResult-filtersPanel">
        <div
          className="ufaAdminThirdStageOffersResult-searchWrapper"
          ref={dropdownRef}
        >
          <label className="ufaAdminThirdStageOffersResult-filterLabel">
            Поиск игрока:
          </label>
          <div className="ufaAdminThirdStageOffersResult-searchContainer">
            <input
              ref={inputRef}
              type="text"
              placeholder="Введите имя игрока..."
              value={searchTerm}
              onChange={handleSearchChange}
              onClick={handleInputClick}
              className="ufaAdminThirdStageOffersResult-searchInput"
              aria-label="Поиск игрока"
            />
            {selectedPlayer && (
              <button
                type="button"
                onClick={handleClearSelection}
                className="ufaAdminThirdStageOffersResult-clearBtn"
                aria-label="Очистить выбор"
              >
                ×
              </button>
            )}
          </div>
          {isDropdownOpen && (
            <div className="ufaAdminThirdStageOffersResult-dropdown">
              <div className="ufaAdminThirdStageOffersResult-dropdownContent">
                {filteredPlayers.length === 0 ? (
                  <div className="ufaAdminThirdStageOffersResult-noResults">
                    Не найдено игроков по запросу "{searchTerm}"
                  </div>
                ) : (
                  filteredPlayers.map((player) => (
                    <div
                      key={player.id}
                      onClick={() => handlePlayerSelect(player)}
                      className={`ufaAdminThirdStageOffersResult-option ${
                        selectedPlayer?.id === player.id
                          ? "ufaAdminThirdStageOffersResult-optionSelected"
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
        <div className="ufaAdminThirdStageOffersResult-resultsCount">
          Найдено игроков: <strong>{players.length}</strong>
        </div>
      </div>

      {/* Карточка выбранного игрока */}
      {selectedPlayer && (
        <div className="ufaAdminThirdStageOffersResult-selectedContainer">
          <div className="ufaAdminThirdStageOffersResult-selectedCard">
            <div className="ufaAdminThirdStageOffersResult-selectedHeader">
              <div className="ufaAdminThirdStageOffersResult-selectedLabel">
                Выбранный игрок
              </div>
              <div className="ufaAdminThirdStageOffersResult-selectedName">
                {selectedPlayer.active_roster}
              </div>
            </div>
            <div className="ufaAdminThirdStageOffersResult-teamSelector">
              <label
                htmlFor="team-select"
                className="ufaAdminThirdStageOffersResult-filterLabel"
              >
                Лидирующая команда после первого этапа (второй раунд):
              </label>
              <select
                id="team-select"
                value={selectedTeam}
                onChange={handleTeamChange}
                className="ufaAdminThirdStageOffersResult-teamSelect"
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
                className={`ufaAdminThirdStageOffersResult-message ${
                  saveMessage.includes("Ошибка")
                    ? "ufaAdminThirdStageOffersResult-messageError"
                    : saveMessage.includes("успешно")
                      ? "ufaAdminThirdStageOffersResult-messageSuccess"
                      : "ufaAdminThirdStageOffersResult-messageWarning"
                }`}
              >
                {saveMessage}
              </div>
            )}
            <div className="ufaAdminThirdStageOffersResult-actions">
              <button
                onClick={handleSaveResult}
                disabled={saving || !selectedTeam}
                className="ufaAdminThirdStageOffersResult-saveBtn"
              >
                {saving ? "Сохранение..." : "Сохранить результат"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Блок отображения результатов */}
      <div className="ufaAdminThirdStageOffersResult-resultsSection">
        <div className="ufaAdminThirdStageOffersResult-resultsHeader">
          <button
            onClick={handleToggleResults}
            className="ufaAdminThirdStageOffersResult-toggleResultsBtn"
          >
            {showResults ? "▲ Скрыть результаты" : "▼ Показать все результаты"}
          </button>
          {showResults && ufaResults.length > 0 && (
            <button
              onClick={handleClearResults}
              className="ufaAdminThirdStageOffersResult-clearAllBtn"
            >
              Очистить все
            </button>
          )}
        </div>

        {showResults && (
          <div className="ufaAdminThirdStageOffersResult-resultsTable">
            <h3>Результаты UFA (второй этап, первый раунд)</h3>
            {loadingResults ? (
              <div className="ufaAdminThirdStageOffersResult-loading">
                Загрузка результатов...
              </div>
            ) : ufaResults.length === 0 ? (
              <div className="ufaAdminThirdStageOffersResult-noDataCell">
                Нет сохранённых результатов первого этапа
              </div>
            ) : (
              <>
                <div className="ufaAdminThirdStageOffersResult-resultsCount">
                  Найдено результатов: <strong>{ufaResults.length}</strong>
                </div>
                <div className="ufaAdminThirdStageOffersResult-tableWrapper">
                  <table className="ufaAdminThirdStageOffersResult-table">
                    <thead>
                      <tr>
                        <th className="ufaAdminThirdStageOffersResult-tableHeader">
                          Игрок
                        </th>
                        <th className="ufaAdminThirdStageOffersResult-tableHeader">
                          Команда (1 этап)
                        </th>
                        <th className="ufaAdminThirdStageOffersResult-tableHeader">
                          Дата обновления
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {ufaResults.map((result) => (
                        <tr
                          key={result.id}
                          className="ufaAdminThirdStageOffersResult-tableRow"
                        >
                          <td className="ufaAdminThirdStageOffersResult-tableCell">
                            {result.player}
                          </td>
                          <td className="ufaAdminThirdStageOffersResult-tableCell">
                            {result.ufa_second_round_first_stage_result}
                          </td>
                          <td className="ufaAdminThirdStageOffersResult-tableCell">
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

export default UFAAdminThirdStageOffersResult;
