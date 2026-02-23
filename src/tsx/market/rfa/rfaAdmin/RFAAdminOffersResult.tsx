// import React, { useState, useEffect, useRef, useMemo } from "react";
// import { supabase } from "../../../../Supabase";
// import "./rfaAdminOffersResult.css";

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
//   rfa_first_round_result: string;
//   created_at?: string;
// }

// const RFAAdminOffersResult = () => {
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

//         // Убираем дубликаты команд
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

//   // Закрытие dropdown при клике вне его области
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
//     // Сбрасываем выбранную команду при смене игрока
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

//   // Функция сохранения в базу данных
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

//       // Удаляем старую запись (если есть)
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

//       // Вставляем новую запись
//       const { error: insertError } = await supabase
//         .from("Market_RFA_result")
//         .insert([
//           {
//             player: selectedPlayer.active_roster,
//             rfa_first_round_result: selectedTeam,
//           },
//         ]);

//       if (insertError) throw insertError;

//       setSaveMessage("Результат успешно сохранен!");

//       // Если результаты уже показаны, обновляем их
//       if (showResults) {
//         fetchRfaResults();
//       }

//       // Очищаем сообщение через 3 секунды
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

//   // Функция загрузки результатов из базы данных
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

//   // Функция показа/скрытия результатов
//   const handleToggleResults = (): void => {
//     if (!showResults) {
//       fetchRfaResults();
//     }
//     setShowResults(!showResults);
//   };

//   // Функция для очистки результатов
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
//         .neq("id", 0); // Удаляем все записи

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
//       <div className="rfaAdminOffersResult-loading">
//         Загрузка игроков и команд...
//       </div>
//     );
//   }

//   return (
//     <div className="rfaAdminOffersResult">
//       <h2 className="rfaAdminOffersResult-title">Результаты RFA (1 раунд)</h2>

//       <div className="rfaAdminOffersResult-filtersPanel">
//         <div className="rfaAdminOffersResult-searchWrapper" ref={dropdownRef}>
//           <label className="rfaAdminOffersResult-filterLabel">
//             Поиск игрока:
//           </label>
//           <div className="rfaAdminOffersResult-searchContainer">
//             <input
//               ref={inputRef}
//               type="text"
//               placeholder="Введите имя игрока..."
//               value={searchTerm}
//               onChange={handleSearchChange}
//               onClick={handleInputClick}
//               className="rfaAdminOffersResult-searchInput"
//               aria-label="Поиск игрока"
//             />
//             {selectedPlayer && (
//               <button
//                 type="button"
//                 onClick={handleClearSelection}
//                 className="rfaAdminOffersResult-clearBtn"
//                 aria-label="Очистить выбор"
//               >
//                 ×
//               </button>
//             )}
//           </div>

//           {isDropdownOpen && (
//             <div className="rfaAdminOffersResult-dropdown">
//               <div className="rfaAdminOffersResult-dropdownContent">
//                 {filteredPlayers.length === 0 ? (
//                   <div className="rfaAdminOffersResult-noResults">
//                     Не найдено игроков по запросу "{searchTerm}"
//                   </div>
//                 ) : (
//                   filteredPlayers.map((player) => (
//                     <div
//                       key={player.id}
//                       onClick={() => handlePlayerSelect(player)}
//                       className={`rfaAdminOffersResult-option ${
//                         selectedPlayer?.id === player.id
//                           ? "rfaAdminOffersResult-optionSelected"
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

//         <div className="rfaAdminOffersResult-resultsCount">
//           Найдено игроков: <strong>{players.length}</strong>
//         </div>
//       </div>

//       {selectedPlayer && (
//         <div className="rfaAdminOffersResult-selectedContainer">
//           <div className="rfaAdminOffersResult-selectedCard">
//             <div className="rfaAdminOffersResult-selectedHeader">
//               <div className="rfaAdminOffersResult-selectedLabel">
//                 Выбранный игрок
//               </div>
//               <div className="rfaAdminOffersResult-selectedName">
//                 {selectedPlayer.active_roster}
//               </div>
//             </div>

//             <div className="rfaAdminOffersResult-teamSelector">
//               <label
//                 htmlFor="team-select"
//                 className="rfaAdminOffersResult-filterLabel"
//               >
//                 Лидирующая команда после RFA 1 Round:
//               </label>
//               <select
//                 id="team-select"
//                 value={selectedTeam}
//                 onChange={handleTeamChange}
//                 className="rfaAdminOffersResult-teamSelect"
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
//                 className={`rfaAdminOffersResult-message ${
//                   saveMessage.includes("Ошибка")
//                     ? "rfaAdminOffersResult-messageError"
//                     : saveMessage.includes("успешно")
//                       ? "rfaAdminOffersResult-messageSuccess"
//                       : "rfaAdminOffersResult-messageWarning"
//                 }`}
//               >
//                 {saveMessage}
//               </div>
//             )}

//             <div className="rfaAdminOffersResult-actions">
//               <button
//                 onClick={handleSaveResult}
//                 disabled={saving || !selectedTeam}
//                 className="rfaAdminOffersResult-saveBtn"
//               >
//                 {saving ? "Сохранение..." : "Сохранить результат"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="rfaAdminOffersResult-resultsSection">
//         <div className="rfaAdminOffersResult-resultsHeader">
//           <button
//             onClick={handleToggleResults}
//             className="rfaAdminOffersResult-toggleResultsBtn"
//           >
//             {showResults ? "▲ Скрыть результаты" : "▼ Показать все результаты"}
//           </button>

//           {showResults && rfaResults.length > 0 && (
//             <button
//               onClick={handleClearResults}
//               className="rfaAdminOffersResult-clearAllBtn"
//             >
//               Очистить все
//             </button>
//           )}
//         </div>

//         {showResults && (
//           <div className="rfaAdminOffersResult-resultsTable">
//             <h3>Результаты RFA первого раунда</h3>

//             {loadingResults ? (
//               <div className="rfaAdminOffersResult-loading">
//                 Загрузка результатов...
//               </div>
//             ) : rfaResults.length === 0 ? (
//               <div className="rfaAdminOffersResult-noDataCell">
//                 Нет сохраненных результатов
//               </div>
//             ) : (
//               <>
//                 <div className="rfaAdminOffersResult-resultsCount">
//                   Найдено результатов: <strong>{rfaResults.length}</strong>
//                 </div>
//                 <div className="rfaAdminOffersResult-tableWrapper">
//                   <table className="rfaAdminOffersResult-table">
//                     <thead>
//                       <tr>
//                         <th className="rfaAdminOffersResult-tableHeader">
//                           Игрок
//                         </th>
//                         <th className="rfaAdminOffersResult-tableHeader">
//                           Команда (RFA 1 Round)
//                         </th>
//                         <th className="rfaAdminOffersResult-tableHeader">
//                           Дата обновления
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {rfaResults.map((result) => (
//                         <tr
//                           key={result.player}
//                           className="rfaAdminOffersResult-tableRow"
//                         >
//                           <td className="rfaAdminOffersResult-tableCell">
//                             {result.player}
//                           </td>
//                           <td className="rfaAdminOffersResult-tableCell">
//                             {result.rfa_first_round_result}
//                           </td>
//                           <td className="rfaAdminOffersResult-tableCell">
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

// export default RFAAdminOffersResult;

import React, { useState, useEffect, useRef, useMemo } from "react";
import { supabase } from "../../../../Supabase";
import "./rfaAdminOffersResult.css";

interface Player {
  id: string;
  active_roster: string;
  opt: string;
}

interface NBATeam {
  team_name: string;
}

interface RfaResult {
  id: number;
  player: string;
  rfa_first_round_result: string | null;
  created_at: string;
}

const RFAAdminOffersResult = () => {
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

  // Загрузка игроков с opt = RFA и уникальных команд
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

  // --- ИСПРАВЛЕННАЯ ЛОГИКА СОХРАНЕНИЯ ---
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
        .from("Market_RFA_result")
        .select("id, rfa_first_round_result, rfa_second_round_result")
        .eq("player", playerName);

      if (selectError) throw selectError;

      const existingRecord = existingRecords?.[0];

      if (!existingRecord) {
        // --- СЛУЧАЙ 1: Записи нет → создаём новую, заполняем только первый результат
        const { error: insertError } = await supabase
          .from("Market_RFA_result")
          .insert([
            {
              player: playerName,
              rfa_first_round_result: selectedTeam,
              rfa_second_round_result: null,
            },
          ]);

        if (insertError) throw insertError;
        setSaveMessage("Результат первого раунда успешно сохранён!");
      } else {
        // --- СЛУЧАЙ 2: Запись уже существует
        const hasFirstRound =
          existingRecord.rfa_first_round_result &&
          existingRecord.rfa_first_round_result.trim() !== "";

        if (!hasFirstRound) {
          // 2a. Первый раунд ещё не заполнен → обновляем его, второй не трогаем
          const { error: updateError } = await supabase
            .from("Market_RFA_result")
            .update({
              rfa_first_round_result: selectedTeam,
              // created_at обновится автоматически, если настроено
            })
            .eq("id", existingRecord.id);

          if (updateError) throw updateError;
          setSaveMessage("Результат первого раунда успешно обновлён!");
        } else {
          // 2b. Первый раунд уже есть → сохраняем команду во второй раунд (перезаписываем)
          const { error: updateError } = await supabase
            .from("Market_RFA_result")
            .update({
              rfa_second_round_result: selectedTeam,
            })
            .eq("id", existingRecord.id);

          if (updateError) throw updateError;
          setSaveMessage(
            "Результат второго раунда сохранён (первый не изменён)!",
          );
        }
      }

      // Если таблица результатов открыта — обновляем её
      if (showResults) {
        await fetchRfaResults();
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

  // --- ИСПРАВЛЕННАЯ ЗАГРУЗКА РЕЗУЛЬТАТОВ (только первый раунд) ---
  const fetchRfaResults = async (): Promise<void> => {
    setLoadingResults(true);
    try {
      // Выбираем только нужные колонки, только записи с непустым первым результатом
      const { data, error } = await supabase
        .from("Market_RFA_result")
        .select("id, created_at, player, rfa_first_round_result")
        .not("rfa_first_round_result", "is", null) // исключаем null
        .neq("rfa_first_round_result", "") // исключаем пустые строки
        .order("player");

      if (error) throw error;
      setRfaResults(data || []);
    } catch (error: any) {
      console.error("Ошибка при загрузке результатов первого раунда:", error);
      setSaveMessage("Ошибка загрузки результатов: " + error.message);
    } finally {
      setLoadingResults(false);
    }
  };

  // Очистка всех результатов (полная очистка таблицы)
  const handleClearResults = async (): Promise<void> => {
    if (
      !window.confirm("Вы уверены, что хотите очистить все результаты RFA?")
    ) {
      return;
    }

    try {
      const { error } = await supabase
        .from("Market_RFA_result")
        .delete()
        .neq("id", 0); // удаляем все строки

      if (error) throw error;

      setRfaResults([]);
      setSaveMessage("Все результаты успешно очищены!");
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (error: any) {
      console.error("Ошибка при очистке результатов:", error);
      setSaveMessage("Ошибка очистки: " + error.message);
    }
  };

  const handleToggleResults = (): void => {
    if (!showResults) {
      fetchRfaResults();
    }
    setShowResults(!showResults);
  };

  if (loading || teamsLoading) {
    return (
      <div className="rfaAdminOffersResult-loading">
        Загрузка игроков и команд...
      </div>
    );
  }

  return (
    <div className="rfaAdminOffersResult">
      <h2 className="rfaAdminOffersResult-title">Результаты RFA (1 раунд)</h2>

      {/* Блок поиска и выбора игрока (без изменений) */}
      <div className="rfaAdminOffersResult-filtersPanel">
        <div className="rfaAdminOffersResult-searchWrapper" ref={dropdownRef}>
          <label className="rfaAdminOffersResult-filterLabel">
            Поиск игрока:
          </label>
          <div className="rfaAdminOffersResult-searchContainer">
            <input
              ref={inputRef}
              type="text"
              placeholder="Введите имя игрока..."
              value={searchTerm}
              onChange={handleSearchChange}
              onClick={handleInputClick}
              className="rfaAdminOffersResult-searchInput"
              aria-label="Поиск игрока"
            />
            {selectedPlayer && (
              <button
                type="button"
                onClick={handleClearSelection}
                className="rfaAdminOffersResult-clearBtn"
                aria-label="Очистить выбор"
              >
                ×
              </button>
            )}
          </div>
          {isDropdownOpen && (
            <div className="rfaAdminOffersResult-dropdown">
              <div className="rfaAdminOffersResult-dropdownContent">
                {filteredPlayers.length === 0 ? (
                  <div className="rfaAdminOffersResult-noResults">
                    Не найдено игроков по запросу "{searchTerm}"
                  </div>
                ) : (
                  filteredPlayers.map((player) => (
                    <div
                      key={player.id}
                      onClick={() => handlePlayerSelect(player)}
                      className={`rfaAdminOffersResult-option ${
                        selectedPlayer?.id === player.id
                          ? "rfaAdminOffersResult-optionSelected"
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
        <div className="rfaAdminOffersResult-resultsCount">
          Найдено игроков: <strong>{players.length}</strong>
        </div>
      </div>

      {/* Карточка выбранного игрока (без изменений в вёрстке, только сообщения) */}
      {selectedPlayer && (
        <div className="rfaAdminOffersResult-selectedContainer">
          <div className="rfaAdminOffersResult-selectedCard">
            <div className="rfaAdminOffersResult-selectedHeader">
              <div className="rfaAdminOffersResult-selectedLabel">
                Выбранный игрок
              </div>
              <div className="rfaAdminOffersResult-selectedName">
                {selectedPlayer.active_roster}
              </div>
            </div>
            <div className="rfaAdminOffersResult-teamSelector">
              <label
                htmlFor="team-select"
                className="rfaAdminOffersResult-filterLabel"
              >
                Лидирующая команда после RFA 1 Round:
              </label>
              <select
                id="team-select"
                value={selectedTeam}
                onChange={handleTeamChange}
                className="rfaAdminOffersResult-teamSelect"
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
                className={`rfaAdminOffersResult-message ${
                  saveMessage.includes("Ошибка")
                    ? "rfaAdminOffersResult-messageError"
                    : saveMessage.includes("успешно")
                      ? "rfaAdminOffersResult-messageSuccess"
                      : "rfaAdminOffersResult-messageWarning"
                }`}
              >
                {saveMessage}
              </div>
            )}
            <div className="rfaAdminOffersResult-actions">
              <button
                onClick={handleSaveResult}
                disabled={saving || !selectedTeam}
                className="rfaAdminOffersResult-saveBtn"
              >
                {saving ? "Сохранение..." : "Сохранить результат"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Блок отображения результатов (изменена выборка данных) */}
      <div className="rfaAdminOffersResult-resultsSection">
        <div className="rfaAdminOffersResult-resultsHeader">
          <button
            onClick={handleToggleResults}
            className="rfaAdminOffersResult-toggleResultsBtn"
          >
            {showResults ? "▲ Скрыть результаты" : "▼ Показать все результаты"}
          </button>
          {showResults && rfaResults.length > 0 && (
            <button
              onClick={handleClearResults}
              className="rfaAdminOffersResult-clearAllBtn"
            >
              Очистить все
            </button>
          )}
        </div>

        {showResults && (
          <div className="rfaAdminOffersResult-resultsTable">
            <h3>Результаты RFA первого раунда</h3>
            {loadingResults ? (
              <div className="rfaAdminOffersResult-loading">
                Загрузка результатов...
              </div>
            ) : rfaResults.length === 0 ? (
              <div className="rfaAdminOffersResult-noDataCell">
                Нет сохранённых результатов первого раунда
              </div>
            ) : (
              <>
                <div className="rfaAdminOffersResult-resultsCount">
                  Найдено результатов: <strong>{rfaResults.length}</strong>
                </div>
                <div className="rfaAdminOffersResult-tableWrapper">
                  <table className="rfaAdminOffersResult-table">
                    <thead>
                      <tr>
                        <th className="rfaAdminOffersResult-tableHeader">
                          Игрок
                        </th>
                        <th className="rfaAdminOffersResult-tableHeader">
                          Команда (RFA 1 Round)
                        </th>
                        <th className="rfaAdminOffersResult-tableHeader">
                          Дата обновления
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {rfaResults.map((result) => (
                        <tr
                          key={result.id}
                          className="rfaAdminOffersResult-tableRow"
                        >
                          <td className="rfaAdminOffersResult-tableCell">
                            {result.player}
                          </td>
                          <td className="rfaAdminOffersResult-tableCell">
                            {result.rfa_first_round_result}
                          </td>
                          <td className="rfaAdminOffersResult-tableCell">
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

export default RFAAdminOffersResult;
