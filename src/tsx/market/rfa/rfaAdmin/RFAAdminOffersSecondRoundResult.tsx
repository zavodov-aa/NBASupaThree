// import React, { useState, useEffect, useRef, useMemo } from "react";
// import { supabase } from "../../../../Supabase";
// import "./rfaAdminOffersSecondRoundResult.css";

// interface Player {
//   id: string;
//   active_roster: string;
//   opt: string;
// }

// interface NBATeam {
//   team_name: string;
// }

// interface RfaResult {
//   id?: string;
//   player: string;
//   rfa_second_round_result: string;
//   created_at?: string;
// }

// const RFAAdminOffersSecondRoundResult = () => {
//   const [players, setPlayers] = useState<Player[]>([]);
//   const [nbaTeams, setNbaTeams] = useState<NBATeam[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [teamsLoading, setTeamsLoading] = useState<boolean>(true);
//   const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
//   const [selectedTeam, setSelectedTeam] = useState<string>("");
//   const [searchTerm, setSearchTerm] = useState<string>("");
//   const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
//   const [saving, setSaving] = useState<boolean>(false);
//   const [saveMessage, setSaveMessage] = useState<string>("");
//   const [showResults, setShowResults] = useState<boolean>(false);
//   const [rfaResults, setRfaResults] = useState<RfaResult[]>([]);
//   const [loadingResults, setLoadingResults] = useState<boolean>(false);
//   const dropdownRef = useRef<HTMLDivElement>(null);
//   const inputRef = useRef<HTMLInputElement>(null);

//   useEffect(() => {
//     const fetchPlayers = async () => {
//       try {
//         const { data, error } = await supabase
//           .from("Players")
//           .select("id, active_roster, opt")
//           .eq("opt", "RFA")
//           .order("active_roster");

//         if (error) throw error;
//         setPlayers(data || []);
//       } catch (error) {
//         console.error("Error fetching players:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     const fetchNBATeams = async () => {
//       try {
//         const { data, error } = await supabase.from("Head").select("team_name");

//         if (error) throw error;

//         const uniqueTeams = Array.from(
//           new Set((data || []).map((item) => item.team_name)),
//         ).map((team_name) => ({ team_name }));

//         setNbaTeams(uniqueTeams);
//       } catch (error) {
//         console.error("Error fetching NBA teams:", error);
//       } finally {
//         setTeamsLoading(false);
//       }
//     };

//     fetchPlayers();
//     fetchNBATeams();
//   }, []);

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(event.target as Node)
//       ) {
//         setIsDropdownOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   const filteredPlayers = useMemo(() => {
//     if (!searchTerm) return players;
//     return players.filter((player) =>
//       player.active_roster.toLowerCase().includes(searchTerm.toLowerCase()),
//     );
//   }, [players, searchTerm]);

//   const handleInputClick = () => {
//     setIsDropdownOpen(true);
//     inputRef.current?.focus();
//   };

//   const handlePlayerSelect = (player: Player) => {
//     setSelectedPlayer(player);
//     setSearchTerm(player.active_roster);
//     setIsDropdownOpen(false);
//     setSelectedTeam("");
//     setSaveMessage("");
//   };

//   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchTerm(e.target.value);
//     setIsDropdownOpen(true);
//     if (selectedPlayer) {
//       setSelectedPlayer(null);
//       setSelectedTeam("");
//     }
//   };

//   const handleClearSelection = () => {
//     setSelectedPlayer(null);
//     setSelectedTeam("");
//     setSearchTerm("");
//     setIsDropdownOpen(true);
//     setSaveMessage("");
//     inputRef.current?.focus();
//   };

//   const handleTeamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     setSelectedTeam(e.target.value);
//     setSaveMessage("");
//   };

//   const handleSaveResult = async (): Promise<void> => {
//     if (!selectedPlayer || !selectedTeam) {
//       setSaveMessage("Пожалуйста, выберите игрока и команду");
//       return;
//     }

//     setSaving(true);
//     setSaveMessage("");

//     try {
//       console.log("Сохранение для игрока:", selectedPlayer.active_roster);
//       console.log("Выбранная команда:", selectedTeam);

//       const { error: deleteError } = await supabase
//         .from("Market_RFA_result")
//         .delete()
//         .eq("player", selectedPlayer.active_roster);

//       if (deleteError) {
//         console.log(
//           "Ошибка при удалении (может быть, записи не было):",
//           deleteError,
//         );
//       }

//       const { error: insertError } = await supabase
//         .from("Market_RFA_result")
//         .insert([
//           {
//             player: selectedPlayer.active_roster,
//             rfa_second_round_result: selectedTeam,
//           },
//         ]);

//       if (insertError) throw insertError;

//       setSaveMessage("Результат успешно сохранен!");

//       if (showResults) {
//         fetchRfaResults();
//       }

//       setTimeout(() => {
//         setSaveMessage("");
//       }, 3000);
//     } catch (error: any) {
//       console.error("Ошибка при сохранении результата:", error);
//       console.error("Детали ошибки:", JSON.stringify(error, null, 2));
//       setSaveMessage(
//         "Ошибка при сохранении результата: " +
//           (error.message || "Проверьте консоль для деталей"),
//       );
//     } finally {
//       setSaving(false);
//     }
//   };

//   const fetchRfaResults = async (): Promise<void> => {
//     setLoadingResults(true);
//     try {
//       const { data, error } = await supabase
//         .from("Market_RFA_result")
//         .select("*")
//         .order("player");

//       if (error) throw error;
//       setRfaResults(data || []);
//     } catch (error: any) {
//       console.error("Ошибка при загрузке результатов:", error);
//       setSaveMessage("Ошибка при загрузке результатов: " + error.message);
//     } finally {
//       setLoadingResults(false);
//     }
//   };

//   const handleToggleResults = (): void => {
//     if (!showResults) {
//       fetchRfaResults();
//     }
//     setShowResults(!showResults);
//   };

//   const handleClearResults = async (): Promise<void> => {
//     if (
//       !window.confirm("Вы уверены, что хотите очистить все результаты RFA?")
//     ) {
//       return;
//     }

//     try {
//       const { error } = await supabase
//         .from("Market_RFA_result")
//         .delete()
//         .neq("id", 0);

//       if (error) throw error;

//       setRfaResults([]);
//       setSaveMessage("Все результаты успешно очищены!");

//       setTimeout(() => {
//         setSaveMessage("");
//       }, 3000);
//     } catch (error: any) {
//       console.error("Ошибка при очистке результатов:", error);
//       setSaveMessage("Ошибка при очистке результатов: " + error.message);
//     }
//   };

//   if (loading || teamsLoading) {
//     return (
//       <div className="rfaAdminOffersSecondRoundResult-loading">
//         Загрузка игроков и команд...
//       </div>
//     );
//   }

//   return (
//     <div className="rfaAdminOffersSecondRoundResult">
//       <h2 className="rfaAdminOffersSecondRoundResult-title">
//         Результаты RFA (второй раунд)
//       </h2>

//       <div className="rfaAdminOffersSecondRoundResult-filtersPanel">
//         <div
//           className="rfaAdminOffersSecondRoundResult-searchWrapper"
//           ref={dropdownRef}
//         >
//           <label className="rfaAdminOffersSecondRoundResult-filterLabel">
//             Поиск игрока:
//           </label>
//           <div className="rfaAdminOffersSecondRoundResult-searchContainer">
//             <input
//               ref={inputRef}
//               type="text"
//               placeholder="Введите имя игрока..."
//               value={searchTerm}
//               onChange={handleSearchChange}
//               onClick={handleInputClick}
//               className="rfaAdminOffersSecondRoundResult-searchInput"
//               aria-label="Поиск игрока"
//             />
//             {selectedPlayer && (
//               <button
//                 type="button"
//                 onClick={handleClearSelection}
//                 className="rfaAdminOffersSecondRoundResult-clearBtn"
//                 aria-label="Очистить выбор"
//               >
//                 ×
//               </button>
//             )}
//           </div>

//           {isDropdownOpen && (
//             <div className="rfaAdminOffersSecondRoundResult-dropdown">
//               <div className="rfaAdminOffersSecondRoundResult-dropdownContent">
//                 {filteredPlayers.length === 0 ? (
//                   <div className="rfaAdminOffersSecondRoundResult-noResults">
//                     Не найдено игроков по запросу "{searchTerm}"
//                   </div>
//                 ) : (
//                   filteredPlayers.map((player) => (
//                     <div
//                       key={player.id}
//                       onClick={() => handlePlayerSelect(player)}
//                       className={`rfaAdminOffersSecondRoundResult-option ${
//                         selectedPlayer?.id === player.id
//                           ? "rfaAdminOffersSecondRoundResult-optionSelected"
//                           : ""
//                       }`}
//                     >
//                       {player.active_roster}
//                     </div>
//                   ))
//                 )}
//               </div>
//             </div>
//           )}
//         </div>

//         <div className="rfaAdminOffersSecondRoundResult-resultsCount">
//           Найдено игроков: <strong>{players.length}</strong>
//         </div>
//       </div>

//       {selectedPlayer && (
//         <div className="rfaAdminOffersSecondRoundResult-selectedContainer">
//           <div className="rfaAdminOffersSecondRoundResult-selectedCard">
//             <div className="rfaAdminOffersSecondRoundResult-selectedHeader">
//               <div className="rfaAdminOffersSecondRoundResult-selectedLabel">
//                 Выбранный игрок
//               </div>
//               <div className="rfaAdminOffersSecondRoundResult-selectedName">
//                 {selectedPlayer.active_roster}
//               </div>
//             </div>

//             <div className="rfaAdminOffersSecondRoundResult-teamSelector">
//               <label
//                 htmlFor="team-select"
//                 className="rfaAdminOffersSecondRoundResult-filterLabel"
//               >
//                 Лидирующая команда после RFA 2 Round:
//               </label>
//               <select
//                 id="team-select"
//                 value={selectedTeam}
//                 onChange={handleTeamChange}
//                 className="rfaAdminOffersSecondRoundResult-teamSelect"
//                 disabled={saving}
//               >
//                 <option value="">-- Выберите команду --</option>
//                 {nbaTeams.map((team, index) => (
//                   <option key={index} value={team.team_name}>
//                     {team.team_name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {saveMessage && (
//               <div
//                 className={`rfaAdminOffersSecondRoundResult-message ${
//                   saveMessage.includes("Ошибка")
//                     ? "rfaAdminOffersSecondRoundResult-messageError"
//                     : saveMessage.includes("успешно")
//                       ? "rfaAdminOffersSecondRoundResult-messageSuccess"
//                       : "rfaAdminOffersSecondRoundResult-messageWarning"
//                 }`}
//               >
//                 {saveMessage}
//               </div>
//             )}

//             <div className="rfaAdminOffersSecondRoundResult-actions">
//               <button
//                 onClick={handleSaveResult}
//                 disabled={saving || !selectedTeam}
//                 className="rfaAdminOffersSecondRoundResult-saveBtn"
//               >
//                 {saving ? "Сохранение..." : "Сохранить результат"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="rfaAdminOffersSecondRoundResult-resultsSection">
//         <div className="rfaAdminOffersSecondRoundResult-resultsHeader">
//           <button
//             onClick={handleToggleResults}
//             className="rfaAdminOffersSecondRoundResult-toggleResultsBtn"
//           >
//             {showResults ? "▲ Скрыть результаты" : "▼ Показать все результаты"}
//           </button>

//           {showResults && rfaResults.length > 0 && (
//             <button
//               onClick={handleClearResults}
//               className="rfaAdminOffersSecondRoundResult-clearAllBtn"
//             >
//               Очистить все
//             </button>
//           )}
//         </div>

//         {showResults && (
//           <div className="rfaAdminOffersSecondRoundResult-resultsTable">
//             <h3>Результаты RFA второго раунда</h3>

//             {loadingResults ? (
//               <div className="rfaAdminOffersSecondRoundResult-loading">
//                 Загрузка результатов...
//               </div>
//             ) : rfaResults.length === 0 ? (
//               <div className="rfaAdminOffersSecondRoundResult-noDataCell">
//                 Нет сохраненных результатов
//               </div>
//             ) : (
//               <>
//                 <div className="rfaAdminOffersSecondRoundResult-resultsCount">
//                   Найдено результатов: <strong>{rfaResults.length}</strong>
//                 </div>
//                 <div className="rfaAdminOffersSecondRoundResult-tableWrapper">
//                   <table className="rfaAdminOffersSecondRoundResult-table">
//                     <thead>
//                       <tr>
//                         <th className="rfaAdminOffersSecondRoundResult-tableHeader">
//                           Игрок
//                         </th>
//                         <th className="rfaAdminOffersSecondRoundResult-tableHeader">
//                           Команда (RFA 2 Round)
//                         </th>
//                         <th className="rfaAdminOffersSecondRoundResult-tableHeader">
//                           Дата обновления
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {rfaResults.map((result) => (
//                         <tr
//                           key={result.player}
//                           className="rfaAdminOffersSecondRoundResult-tableRow"
//                         >
//                           <td className="rfaAdminOffersSecondRoundResult-tableCell">
//                             {result.player}
//                           </td>
//                           <td className="rfaAdminOffersSecondRoundResult-tableCell">
//                             {result.rfa_second_round_result}
//                           </td>
//                           <td className="rfaAdminOffersSecondRoundResult-tableCell">
//                             {result.created_at
//                               ? new Date(result.created_at).toLocaleDateString(
//                                   "ru-RU",
//                                   {
//                                     day: "2-digit",
//                                     month: "2-digit",
//                                     year: "numeric",
//                                   },
//                                 )
//                               : "-"}
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default RFAAdminOffersSecondRoundResult;

import React, { useState, useEffect, useRef, useMemo } from "react";
import { supabase } from "../../../../Supabase";
import "./rfaAdminOffersSecondRoundResult.css";

interface Player {
  id: string;
  active_roster: string;
  opt: string;
}

interface NBATeam {
  team_name: string;
}

interface RfaResult {
  id?: string;
  player: string;
  rfa_second_round_result: string;
  created_at?: string;
}

const RFAAdminOffersSecondRoundResult = () => {
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
  const [rfaResults, setRfaResults] = useState<RfaResult[]>([]);
  const [loadingResults, setLoadingResults] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const { data, error } = await supabase
          .from("Players")
          .select("id, active_roster, opt")
          .eq("opt", "RFA")
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

  // ----- СОХРАНЕНИЕ (БЕЗ updated_at) -----
  const handleSaveResult = async (): Promise<void> => {
    if (!selectedPlayer || !selectedTeam) {
      setSaveMessage("Пожалуйста, выберите игрока и команду");
      return;
    }

    setSaving(true);
    setSaveMessage("");

    try {
      const playerName = selectedPlayer.active_roster;

      // Проверяем, есть ли запись для этого игрока
      const { data: existing } = await supabase
        .from("Market_RFA_result")
        .select("id")
        .eq("player", playerName)
        .maybeSingle();

      if (existing) {
        // ✅ Обновляем только поле второго раунда
        const { error: updateError } = await supabase
          .from("Market_RFA_result")
          .update({
            rfa_second_round_result: selectedTeam,
          })
          .eq("id", existing.id);

        if (updateError) throw updateError;
      } else {
        // ✅ Создаём новую запись
        const { error: insertError } = await supabase
          .from("Market_RFA_result")
          .insert([
            {
              player: playerName,
              rfa_second_round_result: selectedTeam,
              created_at: new Date().toISOString(),
            },
          ]);

        if (insertError) throw insertError;
      }

      setSaveMessage("Результат успешно сохранён!");

      if (showResults) {
        await fetchRfaResults();
      }

      setTimeout(() => setSaveMessage(""), 3000);
    } catch (error: any) {
      console.error("Ошибка при сохранении:", error);
      setSaveMessage(
        "Ошибка при сохранении результата: " +
          (error.message || "Неизвестная ошибка"),
      );
    } finally {
      setSaving(false);
    }
  };

  // ----- ЗАГРУЗКА (ТОЛЬКО ВТОРОЙ РАУНД) -----
  const fetchRfaResults = async (): Promise<void> => {
    setLoadingResults(true);
    try {
      const { data, error } = await supabase
        .from("Market_RFA_result")
        .select("id, player, rfa_second_round_result, created_at")
        .not("rfa_second_round_result", "is", null) // только заполненные вторые раунды
        .order("player");

      if (error) throw error;
      setRfaResults(data || []);
    } catch (error: any) {
      console.error("Ошибка загрузки:", error);
      setSaveMessage("Ошибка при загрузке результатов: " + error.message);
    } finally {
      setLoadingResults(false);
    }
  };

  const handleToggleResults = (): void => {
    if (!showResults) {
      fetchRfaResults();
    }
    setShowResults(!showResults);
  };

  // ----- ОЧИСТКА (обнуляем второй раунд, НЕ удаляем строки) -----
  const handleClearResults = async (): Promise<void> => {
    if (
      !window.confirm(
        "Вы уверены, что хотите очистить все результаты RFA второго раунда?",
      )
    ) {
      return;
    }

    try {
      const { error } = await supabase
        .from("Market_RFA_result")
        .update({
          rfa_second_round_result: null,
        })
        .not("rfa_second_round_result", "is", null); // обновляем только те записи, где он был

      if (error) throw error;

      setRfaResults([]);
      setSaveMessage("Все результаты второго раунда успешно очищены!");
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (error: any) {
      console.error("Ошибка при очистке:", error);
      setSaveMessage("Ошибка при очистке результатов: " + error.message);
    }
  };

  if (loading || teamsLoading) {
    return (
      <div className="rfaAdminOffersSecondRoundResult-loading">
        Загрузка игроков и команд...
      </div>
    );
  }

  return (
    <div className="rfaAdminOffersSecondRoundResult">
      <h2 className="rfaAdminOffersSecondRoundResult-title">
        Результаты RFA (второй раунд)
      </h2>

      {/* Панель поиска и выбора игрока (без изменений) */}
      <div className="rfaAdminOffersSecondRoundResult-filtersPanel">
        <div
          className="rfaAdminOffersSecondRoundResult-searchWrapper"
          ref={dropdownRef}
        >
          <label className="rfaAdminOffersSecondRoundResult-filterLabel">
            Поиск игрока:
          </label>
          <div className="rfaAdminOffersSecondRoundResult-searchContainer">
            <input
              ref={inputRef}
              type="text"
              placeholder="Введите имя игрока..."
              value={searchTerm}
              onChange={handleSearchChange}
              onClick={handleInputClick}
              className="rfaAdminOffersSecondRoundResult-searchInput"
              aria-label="Поиск игрока"
            />
            {selectedPlayer && (
              <button
                type="button"
                onClick={handleClearSelection}
                className="rfaAdminOffersSecondRoundResult-clearBtn"
                aria-label="Очистить выбор"
              >
                ×
              </button>
            )}
          </div>

          {isDropdownOpen && (
            <div className="rfaAdminOffersSecondRoundResult-dropdown">
              <div className="rfaAdminOffersSecondRoundResult-dropdownContent">
                {filteredPlayers.length === 0 ? (
                  <div className="rfaAdminOffersSecondRoundResult-noResults">
                    Не найдено игроков по запросу "{searchTerm}"
                  </div>
                ) : (
                  filteredPlayers.map((player) => (
                    <div
                      key={player.id}
                      onClick={() => handlePlayerSelect(player)}
                      className={`rfaAdminOffersSecondRoundResult-option ${
                        selectedPlayer?.id === player.id
                          ? "rfaAdminOffersSecondRoundResult-optionSelected"
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

        <div className="rfaAdminOffersSecondRoundResult-resultsCount">
          Найдено игроков: <strong>{players.length}</strong>
        </div>
      </div>

      {/* Карточка выбранного игрока */}
      {selectedPlayer && (
        <div className="rfaAdminOffersSecondRoundResult-selectedContainer">
          <div className="rfaAdminOffersSecondRoundResult-selectedCard">
            <div className="rfaAdminOffersSecondRoundResult-selectedHeader">
              <div className="rfaAdminOffersSecondRoundResult-selectedLabel">
                Выбранный игрок
              </div>
              <div className="rfaAdminOffersSecondRoundResult-selectedName">
                {selectedPlayer.active_roster}
              </div>
            </div>

            <div className="rfaAdminOffersSecondRoundResult-teamSelector">
              <label
                htmlFor="team-select"
                className="rfaAdminOffersSecondRoundResult-filterLabel"
              >
                Лидирующая команда после RFA 2 Round:
              </label>
              <select
                id="team-select"
                value={selectedTeam}
                onChange={handleTeamChange}
                className="rfaAdminOffersSecondRoundResult-teamSelect"
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
                className={`rfaAdminOffersSecondRoundResult-message ${
                  saveMessage.includes("Ошибка")
                    ? "rfaAdminOffersSecondRoundResult-messageError"
                    : saveMessage.includes("успешно")
                      ? "rfaAdminOffersSecondRoundResult-messageSuccess"
                      : "rfaAdminOffersSecondRoundResult-messageWarning"
                }`}
              >
                {saveMessage}
              </div>
            )}

            <div className="rfaAdminOffersSecondRoundResult-actions">
              <button
                onClick={handleSaveResult}
                disabled={saving || !selectedTeam}
                className="rfaAdminOffersSecondRoundResult-saveBtn"
              >
                {saving ? "Сохранение..." : "Сохранить результат"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Блок отображения всех результатов */}
      <div className="rfaAdminOffersSecondRoundResult-resultsSection">
        <div className="rfaAdminOffersSecondRoundResult-resultsHeader">
          <button
            onClick={handleToggleResults}
            className="rfaAdminOffersSecondRoundResult-toggleResultsBtn"
          >
            {showResults ? "▲ Скрыть результаты" : "▼ Показать все результаты"}
          </button>

          {showResults && rfaResults.length > 0 && (
            <button
              onClick={handleClearResults}
              className="rfaAdminOffersSecondRoundResult-clearAllBtn"
            >
              Очистить все
            </button>
          )}
        </div>

        {showResults && (
          <div className="rfaAdminOffersSecondRoundResult-resultsTable">
            <h3>Результаты RFA второго раунда</h3>

            {loadingResults ? (
              <div className="rfaAdminOffersSecondRoundResult-loading">
                Загрузка результатов...
              </div>
            ) : rfaResults.length === 0 ? (
              <div className="rfaAdminOffersSecondRoundResult-noDataCell">
                Нет сохраненных результатов
              </div>
            ) : (
              <>
                <div className="rfaAdminOffersSecondRoundResult-resultsCount">
                  Найдено результатов: <strong>{rfaResults.length}</strong>
                </div>
                <div className="rfaAdminOffersSecondRoundResult-tableWrapper">
                  <table className="rfaAdminOffersSecondRoundResult-table">
                    <thead>
                      <tr>
                        <th className="rfaAdminOffersSecondRoundResult-tableHeader">
                          Игрок
                        </th>
                        <th className="rfaAdminOffersSecondRoundResult-tableHeader">
                          Команда (RFA 2 Round)
                        </th>
                        <th className="rfaAdminOffersSecondRoundResult-tableHeader">
                          Дата обновления
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {rfaResults.map((result) => (
                        <tr
                          key={result.id || result.player}
                          className="rfaAdminOffersSecondRoundResult-tableRow"
                        >
                          <td className="rfaAdminOffersSecondRoundResult-tableCell">
                            {result.player}
                          </td>
                          <td className="rfaAdminOffersSecondRoundResult-tableCell">
                            {result.rfa_second_round_result}
                          </td>
                          <td className="rfaAdminOffersSecondRoundResult-tableCell">
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

export default RFAAdminOffersSecondRoundResult;
