// import React, { useState, useEffect } from "react";
// import { supabase } from "../../../Supabase";
// import "./trades.css";

// interface Player {
//   id: number;
//   active_roster: string;
//   g_league: string | null;
//   team: string;
// }

// interface DraftPick {
//   id: number;
//   year: number;
//   round: number;
//   originalTeam: string;
//   currentTeam: string;
// }

// interface TradeData {
//   activePlayersFromTeam1: Array<{
//     id: number;
//     name: string;
//     type: string;
//   }>;
//   activePlayersFromTeam2: Array<{
//     id: number;
//     name: string;
//     type: string;
//   }>;
//   gLeaguePlayersFromTeam1: Array<{
//     id: number;
//     name: string;
//     g_league: string | null;
//     type: string;
//   }>;
//   gLeaguePlayersFromTeam2: Array<{
//     id: number;
//     name: string;
//     g_league: string | null;
//     type: string;
//   }>;
//   draftPicksFromTeam1: Array<{
//     id: number;
//     year: number;
//     round: number;
//     originalTeam: string;
//     currentTeam: string;
//     type: string;
//   }>;
//   draftPicksFromTeam2: Array<{
//     id: number;
//     year: number;
//     round: number;
//     originalTeam: string;
//     currentTeam: string;
//     type: string;
//   }>;
//   tradeNote: string;
//   noteLength: number;
// }

// const Trades: React.FC = () => {
//   const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
//   const [step, setStep] = useState<0 | 1 | 2 | 3 | 4 | 5>(0);
//   const [teams, setTeams] = useState<string[]>([]);
//   const [selectedTeam1, setSelectedTeam1] = useState<string>("");
//   const [selectedTeam2, setSelectedTeam2] = useState<string>("");

//   // Игроки из active_roster (шаг 1)
//   const [playersTeam1, setPlayersTeam1] = useState<Player[]>([]);
//   const [playersTeam2, setPlayersTeam2] = useState<Player[]>([]);
//   const [selectedPlayersTeam1, setSelectedPlayersTeam1] = useState<number[]>(
//     [],
//   );
//   const [selectedPlayersTeam2, setSelectedPlayersTeam2] = useState<number[]>(
//     [],
//   );

//   // Игроки из g_league (шаг 2) - но отображаем active_roster
//   const [gLeaguePlayersTeam1, setGLeaguePlayersTeam1] = useState<Player[]>([]);
//   const [gLeaguePlayersTeam2, setGLeaguePlayersTeam2] = useState<Player[]>([]);
//   const [selectedGLeaguePlayersTeam1, setSelectedGLeaguePlayersTeam1] =
//     useState<number[]>([]);
//   const [selectedGLeaguePlayersTeam2, setSelectedGLeaguePlayersTeam2] =
//     useState<number[]>([]);

//   // Драфт пики (шаг 3)
//   const [draftYears] = useState<number[]>(
//     Array.from({ length: 14 }, (_, i) => 2027 + i),
//   );
//   const [draftRounds] = useState<number[]>([1, 2]);
//   const [availableDraftPicks, setAvailableDraftPicks] = useState<DraftPick[]>(
//     [],
//   );
//   const [selectedDraftPicksTeam1, setSelectedDraftPicksTeam1] = useState<
//     DraftPick[]
//   >([]);
//   const [selectedDraftPicksTeam2, setSelectedDraftPicksTeam2] = useState<
//     DraftPick[]
//   >([]);
//   const [pickTeamFilter1, setPickTeamFilter1] = useState<string>("");
//   const [pickTeamFilter2, setPickTeamFilter2] = useState<string>("");

//   // Примечание к трейду (шаг 4)
//   const [tradeNote, setTradeNote] = useState<string>("");
//   const [noteLength, setNoteLength] = useState<number>(0);

//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [isLoadingPlayers, setIsLoadingPlayers] = useState<boolean>(false);
//   const [isLoadingGLeaguePlayers, setIsLoadingGLeaguePlayers] =
//     useState<boolean>(false);
//   const [isLoadingDraftPicks, setIsLoadingDraftPicks] =
//     useState<boolean>(false);
//   const [isSubmittingTrade, setIsSubmittingTrade] = useState<boolean>(false);

//   // Загрузка уникальных команд из Supabase
//   useEffect(() => {
//     const fetchTeams = async (): Promise<void> => {
//       if (!isModalOpen) return;

//       setIsLoading(true);
//       try {
//         const { data, error } = await supabase
//           .from("Players")
//           .select("team")
//           .not("team", "is", null);

//         if (!error && data) {
//           const uniqueTeams = Array.from(
//             new Set(data.map((item) => item.team)),
//           ).filter(Boolean) as string[];
//           setTeams(uniqueTeams);
//         }
//       } catch (error) {
//         console.error("Error fetching teams:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchTeams();
//   }, [isModalOpen]);

//   // Загрузка игроков из active_roster при выборе команд
//   useEffect(() => {
//     const fetchPlayers = async (): Promise<void> => {
//       if (!selectedTeam1 || !selectedTeam2) return;

//       setIsLoadingPlayers(true);
//       try {
//         const { data: data1, error: error1 } = await supabase
//           .from("Players")
//           .select("id, active_roster, g_league, team")
//           .eq("team", selectedTeam1)
//           .not("active_roster", "is", null)
//           .not("active_roster", "eq", "");

//         const { data: data2, error: error2 } = await supabase
//           .from("Players")
//           .select("id, active_roster, g_league, team")
//           .eq("team", selectedTeam2)
//           .not("active_roster", "is", null)
//           .not("active_roster", "eq", "");

//         if (!error1 && data1) {
//           setPlayersTeam1(data1);
//         }
//         if (!error2 && data2) {
//           setPlayersTeam2(data2);
//         }

//         if (error1 || error2) {
//           console.error("Error fetching players:", error1 || error2);
//         }
//       } catch (error) {
//         console.error("Error fetching players:", error);
//       } finally {
//         setIsLoadingPlayers(false);
//       }
//     };

//     fetchPlayers();
//   }, [selectedTeam1, selectedTeam2]);

//   // Загрузка игроков из G-League при переходе на шаг 2
//   useEffect(() => {
//     const fetchGLeaguePlayers = async (): Promise<void> => {
//       if (step !== 2 || !selectedTeam1 || !selectedTeam2) return;

//       setIsLoadingGLeaguePlayers(true);
//       try {
//         const { data: data1, error: error1 } = await supabase
//           .from("Players")
//           .select("id, active_roster, g_league, team")
//           .eq("g_league", selectedTeam1)
//           .not("active_roster", "is", null)
//           .not("active_roster", "eq", "");

//         const { data: data2, error: error2 } = await supabase
//           .from("Players")
//           .select("id, active_roster, g_league, team")
//           .eq("g_league", selectedTeam2)
//           .not("active_roster", "is", null)
//           .not("active_roster", "eq", "");

//         if (!error1 && data1) {
//           setGLeaguePlayersTeam1(data1);
//         }
//         if (!error2 && data2) {
//           setGLeaguePlayersTeam2(data2);
//         }

//         if (error1 || error2) {
//           console.error("Error fetching G-League players:", error1 || error2);
//         }
//       } catch (error) {
//         console.error("Error fetching G-League players:", error);
//       } finally {
//         setIsLoadingGLeaguePlayers(false);
//       }
//     };

//     fetchGLeaguePlayers();
//   }, [step, selectedTeam1, selectedTeam2]);

//   // Генерация всех возможных драфт-пиков при переходе на шаг 3
//   useEffect(() => {
//     const generateAllDraftPicks = async (): Promise<void> => {
//       if (step !== 3 || !selectedTeam1 || !selectedTeam2) return;

//       setIsLoadingDraftPicks(true);
//       try {
//         // Создаем все возможные комбинации драфт-пиков
//         const allPicks: DraftPick[] = [];
//         let idCounter = 1;

//         // Для каждого года и каждого раунда создаем пики для каждой команды
//         draftYears.forEach((year) => {
//           draftRounds.forEach((round) => {
//             teams.forEach((team) => {
//               // Создаем уникальный драфт-пик
//               allPicks.push({
//                 id: idCounter++,
//                 year,
//                 round,
//                 originalTeam: team, // Изначальная команда-владелец
//                 currentTeam: team, // Текущая команда-владелец (может меняться при трейдах)
//               });
//             });
//           });
//         });

//         setAvailableDraftPicks(allPicks);

//         // Устанавливаем фильтры по умолчанию на выбранные команды
//         setPickTeamFilter1(selectedTeam1);
//         setPickTeamFilter2(selectedTeam2);
//       } catch (error) {
//         console.error("Error generating draft picks:", error);
//       } finally {
//         setIsLoadingDraftPicks(false);
//       }
//     };

//     generateAllDraftPicks();
//   }, [step, selectedTeam1, selectedTeam2, teams, draftYears, draftRounds]);

//   // Обработчики для драфт-пиков
//   const handleDraftPickSelect = (
//     team: "team1" | "team2",
//     pick: DraftPick,
//     isSelected: boolean,
//   ): void => {
//     if (team === "team1") {
//       setSelectedDraftPicksTeam1((prev) => {
//         if (isSelected) {
//           return [...prev, pick];
//         } else {
//           return prev.filter((p) => !(p.id === pick.id));
//         }
//       });
//     } else {
//       setSelectedDraftPicksTeam2((prev) => {
//         if (isSelected) {
//           return [...prev, pick];
//         } else {
//           return prev.filter((p) => !(p.id === pick.id));
//         }
//       });
//     }
//   };

//   const isDraftPickSelected = (
//     team: "team1" | "team2",
//     pickId: number,
//   ): boolean => {
//     const picks =
//       team === "team1" ? selectedDraftPicksTeam1 : selectedDraftPicksTeam2;
//     return picks.some((p) => p.id === pickId);
//   };

//   const handleTeam1Change = (e: React.ChangeEvent<HTMLSelectElement>): void => {
//     setSelectedTeam1(e.target.value);
//   };

//   const handleTeam2Change = (e: React.ChangeEvent<HTMLSelectElement>): void => {
//     setSelectedTeam2(e.target.value);
//   };

//   const handlePlayerSelectTeam1 = (playerId: number): void => {
//     setSelectedPlayersTeam1((prev) =>
//       prev.includes(playerId)
//         ? prev.filter((id) => id !== playerId)
//         : [...prev, playerId],
//     );
//   };

//   const handlePlayerSelectTeam2 = (playerId: number): void => {
//     setSelectedPlayersTeam2((prev) =>
//       prev.includes(playerId)
//         ? prev.filter((id) => id !== playerId)
//         : [...prev, playerId],
//     );
//   };

//   const handleGLeaguePlayerSelectTeam1 = (playerId: number): void => {
//     setSelectedGLeaguePlayersTeam1((prev) =>
//       prev.includes(playerId)
//         ? prev.filter((id) => id !== playerId)
//         : [...prev, playerId],
//     );
//   };

//   const handleGLeaguePlayerSelectTeam2 = (playerId: number): void => {
//     setSelectedGLeaguePlayersTeam2((prev) =>
//       prev.includes(playerId)
//         ? prev.filter((id) => id !== playerId)
//         : [...prev, playerId],
//     );
//   };

//   const handleTradeNoteChange = (
//     e: React.ChangeEvent<HTMLTextAreaElement>,
//   ): void => {
//     const text = e.target.value;
//     setTradeNote(text);
//     setNoteLength(text.length);
//   };

//   const handleStartTrade = (): void => {
//     if (selectedTeam1 && selectedTeam2 && selectedTeam1 !== selectedTeam2) {
//       setStep(1);
//     } else if (selectedTeam1 === selectedTeam2) {
//       alert("Please select two different teams");
//     } else {
//       alert("Please select both teams");
//     }
//   };

//   const handleProceedToGLeague = (): void => {
//     setStep(2);
//   };

//   const handleProceedToDraftPicks = (): void => {
//     setStep(3);
//   };

//   const handleProceedToNotes = (): void => {
//     setStep(4);
//   };

//   const handleProceedToSummary = (): void => {
//     setStep(5);
//   };

//   const handleBackToTeamSelection = (): void => {
//     setStep(0);
//     resetSelections();
//   };

//   const handleBackToActivePlayers = (): void => {
//     setStep(1);
//   };

//   const handleBackToGLeaguePlayers = (): void => {
//     setStep(2);
//   };

//   const handleBackToDraftPicks = (): void => {
//     setStep(3);
//   };

//   const handleBackToNotes = (): void => {
//     setStep(4);
//   };

//   const resetSelections = (): void => {
//     setSelectedPlayersTeam1([]);
//     setSelectedPlayersTeam2([]);
//     setSelectedGLeaguePlayersTeam1([]);
//     setSelectedGLeaguePlayersTeam2([]);
//     setSelectedDraftPicksTeam1([]);
//     setSelectedDraftPicksTeam2([]);
//     setPlayersTeam1([]);
//     setPlayersTeam2([]);
//     setGLeaguePlayersTeam1([]);
//     setGLeaguePlayersTeam2([]);
//     setAvailableDraftPicks([]);
//     setPickTeamFilter1("");
//     setPickTeamFilter2("");
//     setTradeNote("");
//     setNoteLength(0);
//   };

//   // Функция для сохранения трейда в Supabase
//   const saveTradeToSupabase = async (
//     tradeData: TradeData,
//   ): Promise<boolean> => {
//     try {
//       const { error } = await supabase.from("Trades").insert([
//         {
//           current_team: selectedTeam1,
//           trade_team: selectedTeam2,
//           data: tradeData,
//         },
//       ]);

//       if (error) {
//         console.error("Error saving trade to Supabase:", error);
//         return false;
//       }

//       console.log("Trade saved successfully to Supabase");
//       return true;
//     } catch (error) {
//       console.error("Error in saveTradeToSupabase:", error);
//       return false;
//     }
//   };

//   const handleSubmitTrade = async (): Promise<void> => {
//     const selectedActivePlayers1 = playersTeam1.filter((player) =>
//       selectedPlayersTeam1.includes(player.id),
//     );
//     const selectedActivePlayers2 = playersTeam2.filter((player) =>
//       selectedPlayersTeam2.includes(player.id),
//     );

//     const selectedGLeaguePlayers1 = gLeaguePlayersTeam1.filter((player) =>
//       selectedGLeaguePlayersTeam1.includes(player.id),
//     );
//     const selectedGLeaguePlayers2 = gLeaguePlayersTeam2.filter((player) =>
//       selectedGLeaguePlayersTeam2.includes(player.id),
//     );

//     if (
//       selectedActivePlayers1.length === 0 &&
//       selectedActivePlayers2.length === 0 &&
//       selectedGLeaguePlayers1.length === 0 &&
//       selectedGLeaguePlayers2.length === 0 &&
//       selectedDraftPicksTeam1.length === 0 &&
//       selectedDraftPicksTeam2.length === 0
//     ) {
//       alert("Please select at least one player or draft pick from any team");
//       return;
//     }

//     // Формируем данные трейда для сохранения
//     const tradeData: TradeData = {
//       activePlayersFromTeam1: selectedActivePlayers1.map((p) => ({
//         id: p.id,
//         name: p.active_roster,
//         type: "active",
//       })),
//       activePlayersFromTeam2: selectedActivePlayers2.map((p) => ({
//         id: p.id,
//         name: p.active_roster,
//         type: "active",
//       })),
//       gLeaguePlayersFromTeam1: selectedGLeaguePlayers1.map((p) => ({
//         id: p.id,
//         name: p.active_roster,
//         g_league: p.g_league,
//         type: "g_league",
//       })),
//       gLeaguePlayersFromTeam2: selectedGLeaguePlayers2.map((p) => ({
//         id: p.id,
//         name: p.active_roster,
//         g_league: p.g_league,
//         type: "g_league",
//       })),
//       draftPicksFromTeam1: selectedDraftPicksTeam1.map((p) => ({
//         id: p.id,
//         year: p.year,
//         round: p.round,
//         originalTeam: p.originalTeam,
//         currentTeam: p.currentTeam,
//         type: "draft_pick",
//       })),
//       draftPicksFromTeam2: selectedDraftPicksTeam2.map((p) => ({
//         id: p.id,
//         year: p.year,
//         round: p.round,
//         originalTeam: p.originalTeam,
//         currentTeam: p.currentTeam,
//         type: "draft_pick",
//       })),
//       tradeNote: tradeNote.trim(),
//       noteLength: noteLength,
//     };

//     console.log("Trade Proposal:", {
//       team1: selectedTeam1,
//       team2: selectedTeam2,
//       ...tradeData,
//     });

//     // Показываем индикатор загрузки
//     setIsSubmittingTrade(true);

//     try {
//       // Сохраняем трейд в Supabase
//       const isSaved = await saveTradeToSupabase(tradeData);

//       if (isSaved) {
//         alert("Трейд успешно сохранен!");
//         // Закрываем модальное окно и сбрасываем состояние
//         handleCloseModal();
//       } else {
//         alert("Ошибка при сохранении трейда. Пожалуйста, попробуйте снова.");
//       }
//     } catch (error) {
//       console.error("Error submitting trade:", error);
//       alert("Произошла ошибка при сохранении трейда.");
//     } finally {
//       setIsSubmittingTrade(false);
//     }
//   };

//   const handleCloseModal = (): void => {
//     setIsModalOpen(false);
//     setSelectedTeam1("");
//     setSelectedTeam2("");
//     resetSelections();
//     setStep(0);
//     setIsSubmittingTrade(false);
//   };

//   // Фильтрация драфт-пиков по команде
//   const getFilteredDraftPicks = (teamFilter: string) => {
//     if (!teamFilter) return availableDraftPicks;
//     return availableDraftPicks.filter(
//       (pick) => pick.originalTeam === teamFilter,
//     );
//   };

//   // Группировка драфт-пиков по году для удобного отображения
//   const getGroupedDraftPicks = (teamFilter: string) => {
//     const filteredPicks = getFilteredDraftPicks(teamFilter);
//     const grouped: {
//       [year: number]: { round1?: DraftPick; round2?: DraftPick };
//     } = {};

//     filteredPicks.forEach((pick) => {
//       if (!grouped[pick.year]) {
//         grouped[pick.year] = {};
//       }
//       if (pick.round === 1) {
//         grouped[pick.year].round1 = pick;
//       } else if (pick.round === 2) {
//         grouped[pick.year].round2 = pick;
//       }
//     });

//     return grouped;
//   };

//   // Функция для отображения шага выбора команд (шаг 0)
//   const renderTeamSelectionStep = () => (
//     <>
//       <div className="teams-selection">
//         <div className="team-select">
//           <label className="team-label">Ваша команда</label>
//           <select
//             className="team-dropdown"
//             value={selectedTeam1}
//             onChange={handleTeam1Change}
//             disabled={isLoading}
//           >
//             <option value="">Выберите команду</option>
//             {teams.map((team) => (
//               <option key={team} value={team}>
//                 {team}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="vs-text">VS</div>

//         <div className="team-select">
//           <label className="team-label">Выбор команды для трейда</label>
//           <select
//             className="team-dropdown"
//             value={selectedTeam2}
//             onChange={handleTeam2Change}
//             disabled={isLoading}
//           >
//             <option value="">Выберите команду</option>
//             {teams.map((team) => (
//               <option key={team} value={team}>
//                 {team}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>

//       {isLoading && <div className="loading">Загрузка команд...</div>}

//       <div className="modal-actions">
//         <button
//           className="submit-button"
//           onClick={handleStartTrade}
//           disabled={!selectedTeam1 || !selectedTeam2 || isLoading}
//         >
//           Начать трейд → Выбор активных игроков
//         </button>
//         <button className="cancel-button" onClick={handleCloseModal}>
//           Отмена
//         </button>
//       </div>
//     </>
//   );

//   // Функция для отображения шага 1 (активные игроки)
//   const renderActivePlayersStep = () => (
//     <>
//       <div className="players-selection-container">
//         {isLoadingPlayers ? (
//           <div className="loading">Загрузка игроков...</div>
//         ) : (
//           <>
//             <div className="team-players-section">
//               <h4 className="team-players-title">
//                 {selectedTeam1} (Активный состав)
//               </h4>
//               <div className="players-list">
//                 {playersTeam1.length > 0 ? (
//                   playersTeam1.map((player) => (
//                     <div
//                       key={player.id}
//                       className={`player-item ${selectedPlayersTeam1.includes(player.id) ? "selected" : ""}`}
//                       onClick={() => handlePlayerSelectTeam1(player.id)}
//                     >
//                       <input
//                         type="checkbox"
//                         checked={selectedPlayersTeam1.includes(player.id)}
//                         onChange={() => {}}
//                         className="player-checkbox"
//                       />
//                       <span className="player-name">
//                         {player.active_roster}
//                       </span>
//                     </div>
//                   ))
//                 ) : (
//                   <div className="no-players">
//                     Нет игроков в активном составе
//                   </div>
//                 )}
//               </div>
//               <div className="selected-count">
//                 Выбрано: {selectedPlayersTeam1.length}
//               </div>
//             </div>

//             <div className="vs-text">↔</div>

//             <div className="team-players-section">
//               <h4 className="team-players-title">
//                 {selectedTeam2} (Активный состав)
//               </h4>
//               <div className="players-list">
//                 {playersTeam2.length > 0 ? (
//                   playersTeam2.map((player) => (
//                     <div
//                       key={player.id}
//                       className={`player-item ${selectedPlayersTeam2.includes(player.id) ? "selected" : ""}`}
//                       onClick={() => handlePlayerSelectTeam2(player.id)}
//                     >
//                       <input
//                         type="checkbox"
//                         checked={selectedPlayersTeam2.includes(player.id)}
//                         onChange={() => {}}
//                         className="player-checkbox"
//                       />
//                       <span className="player-name">
//                         {player.active_roster}
//                       </span>
//                     </div>
//                   ))
//                 ) : (
//                   <div className="no-players">
//                     Нет игроков в активном составе
//                   </div>
//                 )}
//               </div>
//               <div className="selected-count">
//                 Выбрано: {selectedPlayersTeam2.length}
//               </div>
//             </div>
//           </>
//         )}
//       </div>

//       <div className="modal-actions">
//         <button className="back-button" onClick={handleBackToTeamSelection}>
//           ← Назад к выбору команд
//         </button>
//         <button
//           className="submit-button"
//           onClick={handleProceedToGLeague}
//           disabled={isLoadingPlayers}
//         >
//           Далее → Выбор игроков из G-League
//         </button>
//       </div>
//     </>
//   );

//   // Функция для отображения шага 2 (G-League игроки)
//   const renderGLeaguePlayersStep = () => (
//     <>
//       <div className="players-selection-container">
//         {isLoadingGLeaguePlayers ? (
//           <div className="loading">Загрузка игроков из G-League...</div>
//         ) : (
//           <>
//             <div className="team-players-section">
//               <h4 className="team-players-title">
//                 G-League: Игроки привязанные к {selectedTeam1}
//                 <div className="subtitle">(отображаются из active_roster)</div>
//               </h4>
//               <div className="players-list">
//                 {gLeaguePlayersTeam1.length > 0 ? (
//                   gLeaguePlayersTeam1.map((player) => (
//                     <div
//                       key={player.id}
//                       className={`player-item ${selectedGLeaguePlayersTeam1.includes(player.id) ? "selected" : ""}`}
//                       onClick={() => handleGLeaguePlayerSelectTeam1(player.id)}
//                     >
//                       <input
//                         type="checkbox"
//                         checked={selectedGLeaguePlayersTeam1.includes(
//                           player.id,
//                         )}
//                         onChange={() => {}}
//                         className="player-checkbox"
//                       />
//                       <span className="player-name">
//                         {player.active_roster}
//                         <span className="player-info">
//                           (из команды: {player.team})
//                         </span>
//                       </span>
//                     </div>
//                   ))
//                 ) : (
//                   <div className="no-players">
//                     Нет игроков в G-League для этой команды
//                   </div>
//                 )}
//               </div>
//               <div className="selected-count">
//                 Выбрано: {selectedGLeaguePlayersTeam1.length}
//               </div>
//             </div>

//             <div className="vs-text">↔</div>

//             <div className="team-players-section">
//               <h4 className="team-players-title">
//                 G-League: Игроки привязанные к {selectedTeam2}
//                 <div className="subtitle">(отображаются из active_roster)</div>
//               </h4>
//               <div className="players-list">
//                 {gLeaguePlayersTeam2.length > 0 ? (
//                   gLeaguePlayersTeam2.map((player) => (
//                     <div
//                       key={player.id}
//                       className={`player-item ${selectedGLeaguePlayersTeam2.includes(player.id) ? "selected" : ""}`}
//                       onClick={() => handleGLeaguePlayerSelectTeam2(player.id)}
//                     >
//                       <input
//                         type="checkbox"
//                         checked={selectedGLeaguePlayersTeam2.includes(
//                           player.id,
//                         )}
//                         onChange={() => {}}
//                         className="player-checkbox"
//                       />
//                       <span className="player-name">
//                         {player.active_roster}
//                         <span className="player-info">
//                           (из команды: {player.team})
//                         </span>
//                       </span>
//                     </div>
//                   ))
//                 ) : (
//                   <div className="no-players">
//                     Нет игроков в G-League для этой команды
//                   </div>
//                 )}
//               </div>
//               <div className="selected-count">
//                 Выбрано: {selectedGLeaguePlayersTeam2.length}
//               </div>
//             </div>
//           </>
//         )}
//       </div>

//       <div className="modal-actions">
//         <button
//           className="back-button"
//           onClick={handleBackToActivePlayers}
//           disabled={isLoadingGLeaguePlayers}
//         >
//           ← Назад к выбору активных игроков
//         </button>
//         <button
//           className="submit-button"
//           onClick={handleProceedToDraftPicks}
//           disabled={isLoadingGLeaguePlayers}
//         >
//           Далее → Выбор драфт-пиков
//         </button>
//       </div>
//     </>
//   );

//   // Функция для отображения шага 3 (драфт-пики любой команды)
//   const renderDraftPicksStep = () => (
//     <>
//       <div className="draft-picks-container">
//         <div className="draft-picks-section">
//           <div className="draft-picks-header-section">
//             <h4 className="draft-picks-title">
//               Драфт-пики для команды {selectedTeam1}
//             </h4>
//             <div className="team-filter">
//               <label>Фильтр по команде-владельцу:</label>
//               <select
//                 value={pickTeamFilter1}
//                 onChange={(e) => setPickTeamFilter1(e.target.value)}
//                 className="team-filter-select"
//               >
//                 <option value="">Все команды</option>
//                 {teams.map((team) => (
//                   <option key={team} value={team}>
//                     {team}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           {isLoadingDraftPicks ? (
//             <div className="loading">Загрузка драфт-пиков...</div>
//           ) : (
//             <>
//               <div className="draft-picks-table">
//                 <div className="draft-picks-header">
//                   <div className="draft-year">Год</div>
//                   <div className="draft-team">Команда-владелец</div>
//                   <div className="draft-round">1 раунд</div>
//                   <div className="draft-round">2 раунд</div>
//                 </div>
//                 {draftYears.map((year) => {
//                   const groupedPicks = getGroupedDraftPicks(pickTeamFilter1);
//                   const yearPicks = groupedPicks[year] || {};
//                   const round1Pick = yearPicks.round1;
//                   const round2Pick = yearPicks.round2;

//                   // Если есть фильтр по команде и для этого года нет пиков этой команды, не показываем строку
//                   if (pickTeamFilter1 && !round1Pick && !round2Pick) {
//                     return null;
//                   }

//                   return (
//                     <div key={year} className="draft-picks-row">
//                       <div className="draft-year">{year}</div>
//                       <div className="draft-team">
//                         {pickTeamFilter1 || "Разные команды"}
//                       </div>
//                       <div className="draft-round">
//                         {round1Pick ? (
//                           <label className="draft-pick-label">
//                             <input
//                               type="checkbox"
//                               checked={isDraftPickSelected(
//                                 "team1",
//                                 round1Pick.id,
//                               )}
//                               onChange={(e) =>
//                                 handleDraftPickSelect(
//                                   "team1",
//                                   round1Pick,
//                                   e.target.checked,
//                                 )
//                               }
//                               className="draft-checkbox"
//                             />
//                             <span className="draft-pick-info">
//                               {!pickTeamFilter1 &&
//                                 ` (${round1Pick.originalTeam})`}
//                             </span>
//                           </label>
//                         ) : (
//                           <span className="no-pick">-</span>
//                         )}
//                       </div>
//                       <div className="draft-round">
//                         {round2Pick ? (
//                           <label className="draft-pick-label">
//                             <input
//                               type="checkbox"
//                               checked={isDraftPickSelected(
//                                 "team1",
//                                 round2Pick.id,
//                               )}
//                               onChange={(e) =>
//                                 handleDraftPickSelect(
//                                   "team1",
//                                   round2Pick,
//                                   e.target.checked,
//                                 )
//                               }
//                               className="draft-checkbox"
//                             />
//                             <span className="draft-pick-info">
//                               {!pickTeamFilter1 &&
//                                 ` (${round2Pick.originalTeam})`}
//                             </span>
//                           </label>
//                         ) : (
//                           <span className="no-pick">-</span>
//                         )}
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//               <div className="selected-count">
//                 Выбрано драфт-пиков для {selectedTeam1}:{" "}
//                 {selectedDraftPicksTeam1.length}
//               </div>
//             </>
//           )}
//         </div>

//         <div className="vs-text">↔</div>

//         <div className="draft-picks-section">
//           <div className="draft-picks-header-section">
//             <h4 className="draft-picks-title">
//               Драфт-пики для команды {selectedTeam2}
//             </h4>
//             <div className="team-filter">
//               <label>Фильтр по команде-владельцу:</label>
//               <select
//                 value={pickTeamFilter2}
//                 onChange={(e) => setPickTeamFilter2(e.target.value)}
//                 className="team-filter-select"
//               >
//                 <option value="">Все команды</option>
//                 {teams.map((team) => (
//                   <option key={team} value={team}>
//                     {team}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           {isLoadingDraftPicks ? (
//             <div className="loading">Загрузка драфт-пиков...</div>
//           ) : (
//             <>
//               <div className="draft-picks-table">
//                 <div className="draft-picks-header">
//                   <div className="draft-year">Год</div>
//                   <div className="draft-team">Команда-владелец</div>
//                   <div className="draft-round">1 раунд</div>
//                   <div className="draft-round">2 раунд</div>
//                 </div>
//                 {draftYears.map((year) => {
//                   const groupedPicks = getGroupedDraftPicks(pickTeamFilter2);
//                   const yearPicks = groupedPicks[year] || {};
//                   const round1Pick = yearPicks.round1;
//                   const round2Pick = yearPicks.round2;

//                   // Если есть фильтр по команде и для этого года нет пиков этой команды, не показываем строку
//                   if (pickTeamFilter2 && !round1Pick && !round2Pick) {
//                     return null;
//                   }

//                   return (
//                     <div key={year} className="draft-picks-row">
//                       <div className="draft-year">{year}</div>
//                       <div className="draft-team">
//                         {pickTeamFilter2 || "Разные команды"}
//                       </div>
//                       <div className="draft-round">
//                         {round1Pick ? (
//                           <label className="draft-pick-label">
//                             <input
//                               type="checkbox"
//                               checked={isDraftPickSelected(
//                                 "team2",
//                                 round1Pick.id,
//                               )}
//                               onChange={(e) =>
//                                 handleDraftPickSelect(
//                                   "team2",
//                                   round1Pick,
//                                   e.target.checked,
//                                 )
//                               }
//                               className="draft-checkbox"
//                             />
//                             <span className="draft-pick-info">
//                               {!pickTeamFilter2 &&
//                                 ` (${round1Pick.originalTeam})`}
//                             </span>
//                           </label>
//                         ) : (
//                           <span className="no-pick">-</span>
//                         )}
//                       </div>
//                       <div className="draft-round">
//                         {round2Pick ? (
//                           <label className="draft-pick-label">
//                             <input
//                               type="checkbox"
//                               checked={isDraftPickSelected(
//                                 "team2",
//                                 round2Pick.id,
//                               )}
//                               onChange={(e) =>
//                                 handleDraftPickSelect(
//                                   "team2",
//                                   round2Pick,
//                                   e.target.checked,
//                                 )
//                               }
//                               className="draft-checkbox"
//                             />
//                             <span className="draft-pick-info">
//                               {!pickTeamFilter2 &&
//                                 ` (${round2Pick.originalTeam})`}
//                             </span>
//                           </label>
//                         ) : (
//                           <span className="no-pick">-</span>
//                         )}
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//               <div className="selected-count">
//                 Выбрано драфт-пиков для {selectedTeam2}:{" "}
//                 {selectedDraftPicksTeam2.length}
//               </div>
//             </>
//           )}
//         </div>
//       </div>

//       <div className="modal-actions">
//         <button className="back-button" onClick={handleBackToGLeaguePlayers}>
//           ← Назад к выбору игроков из G-League
//         </button>
//         <button className="submit-button" onClick={handleProceedToNotes}>
//           Далее → Ввод примечания
//         </button>
//       </div>
//     </>
//   );

//   // Функция для отображения шага 4 (примечание к трейду)
//   const renderNotesStep = () => (
//     <>
//       <div className="trade-notes-container">
//         <div className="notes-section">
//           <h4>Примечание к трейду (необязательно):</h4>
//           <textarea
//             className="trade-notes-textarea"
//             value={tradeNote}
//             onChange={handleTradeNoteChange}
//             placeholder="Оставьте комментарий или объяснение к этому трейду..."
//             maxLength={500}
//             rows={6}
//           />
//           <div
//             className={`notes-counter ${noteLength >= 450 ? "warning" : ""}`}
//           >
//             {noteLength}/500 символов
//           </div>
//         </div>
//       </div>

//       <div className="modal-actions">
//         <button className="back-button" onClick={handleBackToDraftPicks}>
//           ← Назад к выбору драфт-пиков
//         </button>
//         <button className="submit-button" onClick={handleProceedToSummary}>
//           Далее → Сводка и подтверждение
//         </button>
//       </div>
//     </>
//   );

//   // Функция для отображения шага 5 (сводка и подтверждение)
//   const renderSummaryStep = () => (
//     <>
//       <div className="trade-summary-container">
//         <div className="trade-summary">
//           <h4>Сводка трейда:</h4>

//           <div className="trade-summary-section">
//             <div className="summary-team">
//               <h5>{selectedTeam1} отдает:</h5>
//               {selectedPlayersTeam1.length > 0 && (
//                 <div className="summary-items">
//                   <strong>Активные игроки:</strong>
//                   {playersTeam1
//                     .filter((p) => selectedPlayersTeam1.includes(p.id))
//                     .map((p) => (
//                       <div key={p.id} className="summary-item">
//                         {p.active_roster}
//                       </div>
//                     ))}
//                 </div>
//               )}
//               {selectedGLeaguePlayersTeam1.length > 0 && (
//                 <div className="summary-items">
//                   <strong>Игроки из G-League:</strong>
//                   {gLeaguePlayersTeam1
//                     .filter((p) => selectedGLeaguePlayersTeam1.includes(p.id))
//                     .map((p) => (
//                       <div key={p.id} className="summary-item">
//                         {p.active_roster}
//                       </div>
//                     ))}
//                 </div>
//               )}
//               {selectedDraftPicksTeam1.length > 0 && (
//                 <div className="summary-items">
//                   <strong>Драфт-пики:</strong>
//                   {selectedDraftPicksTeam1.map((p) => (
//                     <div key={p.id} className="summary-item">
//                       {p.year} год, {p.round} раунд ({p.originalTeam})
//                     </div>
//                   ))}
//                 </div>
//               )}
//               {selectedPlayersTeam1.length === 0 &&
//                 selectedGLeaguePlayersTeam1.length === 0 &&
//                 selectedDraftPicksTeam1.length === 0 && (
//                   <div className="summary-items">Ничего</div>
//                 )}
//             </div>

//             <div className="vs-text-summary">↔</div>

//             <div className="summary-team">
//               <h5>{selectedTeam2} отдает:</h5>
//               {selectedPlayersTeam2.length > 0 && (
//                 <div className="summary-items">
//                   <strong>Активные игроки:</strong>
//                   {playersTeam2
//                     .filter((p) => selectedPlayersTeam2.includes(p.id))
//                     .map((p) => (
//                       <div key={p.id} className="summary-item">
//                         {p.active_roster}
//                       </div>
//                     ))}
//                 </div>
//               )}
//               {selectedGLeaguePlayersTeam2.length > 0 && (
//                 <div className="summary-items">
//                   <strong>Игроки из G-League:</strong>
//                   {gLeaguePlayersTeam2
//                     .filter((p) => selectedGLeaguePlayersTeam2.includes(p.id))
//                     .map((p) => (
//                       <div key={p.id} className="summary-item">
//                         {p.active_roster}
//                       </div>
//                     ))}
//                 </div>
//               )}
//               {selectedDraftPicksTeam2.length > 0 && (
//                 <div className="summary-items">
//                   <strong>Драфт-пики:</strong>
//                   {selectedDraftPicksTeam2.map((p) => (
//                     <div key={p.id} className="summary-item">
//                       {p.year} год, {p.round} раунд ({p.originalTeam})
//                     </div>
//                   ))}
//                 </div>
//               )}
//               {selectedPlayersTeam2.length === 0 &&
//                 selectedGLeaguePlayersTeam2.length === 0 &&
//                 selectedDraftPicksTeam2.length === 0 && (
//                   <div className="summary-items">Ничего</div>
//                 )}
//             </div>
//           </div>

//           {tradeNote && (
//             <div className="notes-summary">
//               <h5>Ваше примечание:</h5>
//               <div className="note-text">{tradeNote}</div>
//             </div>
//           )}
//         </div>

//         <div className="trade-validation">
//           {selectedPlayersTeam1.length === 0 &&
//             selectedPlayersTeam2.length === 0 &&
//             selectedGLeaguePlayersTeam1.length === 0 &&
//             selectedGLeaguePlayersTeam2.length === 0 &&
//             selectedDraftPicksTeam1.length === 0 &&
//             selectedDraftPicksTeam2.length === 0 && (
//               <div className="validation-warning">
//                 ⚠️ В трейде нет выбранных игроков или пиков. Пожалуйста,
//                 вернитесь и выберите хотя бы один элемент.
//               </div>
//             )}
//         </div>
//       </div>

//       <div className="modal-actions">
//         <button className="back-button" onClick={handleBackToNotes}>
//           ← Назад к примечанию
//         </button>
//         <button
//           className="submit-button"
//           onClick={handleSubmitTrade}
//           disabled={
//             (selectedPlayersTeam1.length === 0 &&
//               selectedPlayersTeam2.length === 0 &&
//               selectedGLeaguePlayersTeam1.length === 0 &&
//               selectedGLeaguePlayersTeam2.length === 0 &&
//               selectedDraftPicksTeam1.length === 0 &&
//               selectedDraftPicksTeam2.length === 0) ||
//             isSubmittingTrade
//           }
//         >
//           {isSubmittingTrade ? "Сохранение..." : "Подтвердить обмен"}
//         </button>
//         <button className="cancel-button" onClick={handleCloseModal}>
//           Отмена
//         </button>
//       </div>
//     </>
//   );

//   return (
//     <div className="trades-container">
//       <button className="trade-button" onClick={() => setIsModalOpen(true)}>
//         Предложить трейд
//       </button>

//       {isModalOpen && (
//         <div className="modal-overlay" onClick={handleCloseModal}>
//           <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//             <div className="modal-header">
//               <h3>
//                 {step === 0
//                   ? "Выбор команд для обмена"
//                   : step === 1
//                     ? `Обмен активными игроками: ${selectedTeam1} ↔ ${selectedTeam2}`
//                     : step === 2
//                       ? `Обмен игроками из G-League: ${selectedTeam1} ↔ ${selectedTeam2}`
//                       : step === 3
//                         ? `Обмен драфт-пиками: ${selectedTeam1} ↔ ${selectedTeam2}`
//                         : step === 4
//                           ? `Примечание к трейду: ${selectedTeam1} ↔ ${selectedTeam2}`
//                           : `Сводка трейда: ${selectedTeam1} ↔ ${selectedTeam2}`}
//               </h3>
//               <button className="close-button" onClick={handleCloseModal}>
//                 ×
//               </button>
//             </div>

//             {step === 0
//               ? renderTeamSelectionStep()
//               : step === 1
//                 ? renderActivePlayersStep()
//                 : step === 2
//                   ? renderGLeaguePlayersStep()
//                   : step === 3
//                     ? renderDraftPicksStep()
//                     : step === 4
//                       ? renderNotesStep()
//                       : renderSummaryStep()}

//             {/* Индикатор прогресса */}
//             <div className="progress-indicator">
//               <div className="progress-steps">
//                 <div
//                   className={`progress-step ${step >= 0 ? "active" : ""} ${step === 0 ? "current" : ""}`}
//                 >
//                   <div className="step-number">1</div>
//                   <div className="step-label">Команды</div>
//                 </div>
//                 <div
//                   className={`progress-line ${step >= 1 ? "active" : ""}`}
//                 ></div>
//                 <div
//                   className={`progress-step ${step >= 1 ? "active" : ""} ${step === 1 ? "current" : ""}`}
//                 >
//                   <div className="step-number">2</div>
//                   <div className="step-label">Активные игроки</div>
//                 </div>
//                 <div
//                   className={`progress-line ${step >= 2 ? "active" : ""}`}
//                 ></div>
//                 <div
//                   className={`progress-step ${step >= 2 ? "active" : ""} ${step === 2 ? "current" : ""}`}
//                 >
//                   <div className="step-number">3</div>
//                   <div className="step-label">G-League</div>
//                 </div>
//                 <div
//                   className={`progress-line ${step >= 3 ? "active" : ""}`}
//                 ></div>
//                 <div
//                   className={`progress-step ${step >= 3 ? "active" : ""} ${step === 3 ? "current" : ""}`}
//                 >
//                   <div className="step-number">4</div>
//                   <div className="step-label">Драфт-пики</div>
//                 </div>
//                 <div
//                   className={`progress-line ${step >= 4 ? "active" : ""}`}
//                 ></div>
//                 <div
//                   className={`progress-step ${step >= 4 ? "active" : ""} ${step === 4 ? "current" : ""}`}
//                 >
//                   <div className="step-number">5</div>
//                   <div className="step-label">Примечание</div>
//                 </div>
//                 <div
//                   className={`progress-line ${step >= 5 ? "active" : ""}`}
//                 ></div>
//                 <div
//                   className={`progress-step ${step >= 5 ? "active" : ""} ${step === 5 ? "current" : ""}`}
//                 >
//                   <div className="step-number">✓</div>
//                   <div className="step-label">Сводка</div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Trades;

import React, { useState, useEffect } from "react";
import { supabase } from "../../../Supabase";
import "./trades.css";

interface Player {
  id: number;
  active_roster: string;
  g_league: string | null;
  team: string;
}

interface DraftPick {
  id: number;
  year: number;
  round: number;
  originalTeam: string;
  currentTeam: string;
}

interface TradeData {
  team1: string;
  team2: string;
  activePlayersFromTeam1: Array<{
    id: number;
    name: string;
    type: string;
  }>;
  activePlayersFromTeam2: Array<{
    id: number;
    name: string;
    type: string;
  }>;
  gLeaguePlayersFromTeam1: Array<{
    id: number;
    name: string;
    g_league: string | null;
    type: string;
  }>;
  gLeaguePlayersFromTeam2: Array<{
    id: number;
    name: string;
    g_league: string | null;
    type: string;
  }>;
  draftPicksFromTeam1: Array<{
    id: number;
    year: number;
    round: number;
    originalTeam: string;
    currentTeam: string;
    type: string;
  }>;
  draftPicksFromTeam2: Array<{
    id: number;
    year: number;
    round: number;
    originalTeam: string;
    currentTeam: string;
    type: string;
  }>;
  tradeNote: string;
  noteLength: number;
  timestamp: string;
  status: string;
}

const Trades: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [step, setStep] = useState<0 | 1 | 2 | 3 | 4 | 5>(0);
  const [teams, setTeams] = useState<string[]>([]);
  const [selectedTeam1, setSelectedTeam1] = useState<string>("");
  const [selectedTeam2, setSelectedTeam2] = useState<string>("");

  // Игроки из active_roster (шаг 1)
  const [playersTeam1, setPlayersTeam1] = useState<Player[]>([]);
  const [playersTeam2, setPlayersTeam2] = useState<Player[]>([]);
  const [selectedPlayersTeam1, setSelectedPlayersTeam1] = useState<number[]>(
    [],
  );
  const [selectedPlayersTeam2, setSelectedPlayersTeam2] = useState<number[]>(
    [],
  );

  // Игроки из g_league (шаг 2) - но отображаем active_roster
  const [gLeaguePlayersTeam1, setGLeaguePlayersTeam1] = useState<Player[]>([]);
  const [gLeaguePlayersTeam2, setGLeaguePlayersTeam2] = useState<Player[]>([]);
  const [selectedGLeaguePlayersTeam1, setSelectedGLeaguePlayersTeam1] =
    useState<number[]>([]);
  const [selectedGLeaguePlayersTeam2, setSelectedGLeaguePlayersTeam2] =
    useState<number[]>([]);

  // Драфт пики (шаг 3)
  const [draftYears] = useState<number[]>(
    Array.from({ length: 14 }, (_, i) => 2027 + i),
  );
  const [draftRounds] = useState<number[]>([1, 2]);
  const [availableDraftPicks, setAvailableDraftPicks] = useState<DraftPick[]>(
    [],
  );
  const [selectedDraftPicksTeam1, setSelectedDraftPicksTeam1] = useState<
    DraftPick[]
  >([]);
  const [selectedDraftPicksTeam2, setSelectedDraftPicksTeam2] = useState<
    DraftPick[]
  >([]);
  const [pickTeamFilter1, setPickTeamFilter1] = useState<string>("");
  const [pickTeamFilter2, setPickTeamFilter2] = useState<string>("");

  // Примечание к трейду (шаг 4)
  const [tradeNote, setTradeNote] = useState<string>("");
  const [noteLength, setNoteLength] = useState<number>(0);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingPlayers, setIsLoadingPlayers] = useState<boolean>(false);
  const [isLoadingGLeaguePlayers, setIsLoadingGLeaguePlayers] =
    useState<boolean>(false);
  const [isLoadingDraftPicks, setIsLoadingDraftPicks] =
    useState<boolean>(false);
  const [isSubmittingTrade, setIsSubmittingTrade] = useState<boolean>(false);

  // Загрузка уникальных команд из Supabase
  useEffect(() => {
    const fetchTeams = async (): Promise<void> => {
      if (!isModalOpen) return;

      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("Players")
          .select("team")
          .not("team", "is", null);

        if (!error && data) {
          const uniqueTeams = Array.from(
            new Set(data.map((item) => item.team)),
          ).filter(Boolean) as string[];
          setTeams(uniqueTeams);
        }
      } catch (error) {
        console.error("Error fetching teams:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeams();
  }, [isModalOpen]);

  // Загрузка игроков из active_roster при выборе команд
  useEffect(() => {
    const fetchPlayers = async (): Promise<void> => {
      if (!selectedTeam1 || !selectedTeam2) return;

      setIsLoadingPlayers(true);
      try {
        const { data: data1, error: error1 } = await supabase
          .from("Players")
          .select("id, active_roster, g_league, team")
          .eq("team", selectedTeam1)
          .not("active_roster", "is", null)
          .not("active_roster", "eq", "");

        const { data: data2, error: error2 } = await supabase
          .from("Players")
          .select("id, active_roster, g_league, team")
          .eq("team", selectedTeam2)
          .not("active_roster", "is", null)
          .not("active_roster", "eq", "");

        if (!error1 && data1) {
          setPlayersTeam1(data1);
        }
        if (!error2 && data2) {
          setPlayersTeam2(data2);
        }

        if (error1 || error2) {
          console.error("Error fetching players:", error1 || error2);
        }
      } catch (error) {
        console.error("Error fetching players:", error);
      } finally {
        setIsLoadingPlayers(false);
      }
    };

    fetchPlayers();
  }, [selectedTeam1, selectedTeam2]);

  // Загрузка игроков из G-League при переходе на шаг 2
  useEffect(() => {
    const fetchGLeaguePlayers = async (): Promise<void> => {
      if (step !== 2 || !selectedTeam1 || !selectedTeam2) return;

      setIsLoadingGLeaguePlayers(true);
      try {
        const { data: data1, error: error1 } = await supabase
          .from("Players")
          .select("id, active_roster, g_league, team")
          .eq("g_league", selectedTeam1)
          .not("active_roster", "is", null)
          .not("active_roster", "eq", "");

        const { data: data2, error: error2 } = await supabase
          .from("Players")
          .select("id, active_roster, g_league, team")
          .eq("g_league", selectedTeam2)
          .not("active_roster", "is", null)
          .not("active_roster", "eq", "");

        if (!error1 && data1) {
          setGLeaguePlayersTeam1(data1);
        }
        if (!error2 && data2) {
          setGLeaguePlayersTeam2(data2);
        }

        if (error1 || error2) {
          console.error("Error fetching G-League players:", error1 || error2);
        }
      } catch (error) {
        console.error("Error fetching G-League players:", error);
      } finally {
        setIsLoadingGLeaguePlayers(false);
      }
    };

    fetchGLeaguePlayers();
  }, [step, selectedTeam1, selectedTeam2]);

  // Генерация всех возможных драфт-пиков при переходе на шаг 3
  useEffect(() => {
    const generateAllDraftPicks = async (): Promise<void> => {
      if (step !== 3 || !selectedTeam1 || !selectedTeam2) return;

      setIsLoadingDraftPicks(true);
      try {
        // Создаем все возможные комбинации драфт-пиков
        const allPicks: DraftPick[] = [];
        let idCounter = 1;

        // Для каждого года и каждого раунда создаем пики для каждой команды
        draftYears.forEach((year) => {
          draftRounds.forEach((round) => {
            teams.forEach((team) => {
              // Создаем уникальный драфт-пик
              allPicks.push({
                id: idCounter++,
                year,
                round,
                originalTeam: team, // Изначальная команда-владелец
                currentTeam: team, // Текущая команда-владелец (может меняться при трейдах)
              });
            });
          });
        });

        setAvailableDraftPicks(allPicks);

        // Устанавливаем фильтры по умолчанию на выбранные команды
        setPickTeamFilter1(selectedTeam1);
        setPickTeamFilter2(selectedTeam2);
      } catch (error) {
        console.error("Error generating draft picks:", error);
      } finally {
        setIsLoadingDraftPicks(false);
      }
    };

    generateAllDraftPicks();
  }, [step, selectedTeam1, selectedTeam2, teams, draftYears, draftRounds]);

  // Обработчики для драфт-пиков
  const handleDraftPickSelect = (
    team: "team1" | "team2",
    pick: DraftPick,
    isSelected: boolean,
  ): void => {
    if (team === "team1") {
      setSelectedDraftPicksTeam1((prev) => {
        if (isSelected) {
          return [...prev, pick];
        } else {
          return prev.filter((p) => !(p.id === pick.id));
        }
      });
    } else {
      setSelectedDraftPicksTeam2((prev) => {
        if (isSelected) {
          return [...prev, pick];
        } else {
          return prev.filter((p) => !(p.id === pick.id));
        }
      });
    }
  };

  const isDraftPickSelected = (
    team: "team1" | "team2",
    pickId: number,
  ): boolean => {
    const picks =
      team === "team1" ? selectedDraftPicksTeam1 : selectedDraftPicksTeam2;
    return picks.some((p) => p.id === pickId);
  };

  const handleTeam1Change = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setSelectedTeam1(e.target.value);
  };

  const handleTeam2Change = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setSelectedTeam2(e.target.value);
  };

  const handlePlayerSelectTeam1 = (playerId: number): void => {
    setSelectedPlayersTeam1((prev) =>
      prev.includes(playerId)
        ? prev.filter((id) => id !== playerId)
        : [...prev, playerId],
    );
  };

  const handlePlayerSelectTeam2 = (playerId: number): void => {
    setSelectedPlayersTeam2((prev) =>
      prev.includes(playerId)
        ? prev.filter((id) => id !== playerId)
        : [...prev, playerId],
    );
  };

  const handleGLeaguePlayerSelectTeam1 = (playerId: number): void => {
    setSelectedGLeaguePlayersTeam1((prev) =>
      prev.includes(playerId)
        ? prev.filter((id) => id !== playerId)
        : [...prev, playerId],
    );
  };

  const handleGLeaguePlayerSelectTeam2 = (playerId: number): void => {
    setSelectedGLeaguePlayersTeam2((prev) =>
      prev.includes(playerId)
        ? prev.filter((id) => id !== playerId)
        : [...prev, playerId],
    );
  };

  const handleTradeNoteChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ): void => {
    const text = e.target.value;
    setTradeNote(text);
    setNoteLength(text.length);
  };

  const handleStartTrade = (): void => {
    if (selectedTeam1 && selectedTeam2 && selectedTeam1 !== selectedTeam2) {
      setStep(1);
    } else if (selectedTeam1 === selectedTeam2) {
      alert("Please select two different teams");
    } else {
      alert("Please select both teams");
    }
  };

  const handleProceedToGLeague = (): void => {
    setStep(2);
  };

  const handleProceedToDraftPicks = (): void => {
    setStep(3);
  };

  const handleProceedToNotes = (): void => {
    setStep(4);
  };

  const handleProceedToSummary = (): void => {
    setStep(5);
  };

  const handleBackToTeamSelection = (): void => {
    setStep(0);
    resetSelections();
  };

  const handleBackToActivePlayers = (): void => {
    setStep(1);
  };

  const handleBackToGLeaguePlayers = (): void => {
    setStep(2);
  };

  const handleBackToDraftPicks = (): void => {
    setStep(3);
  };

  const handleBackToNotes = (): void => {
    setStep(4);
  };

  const resetSelections = (): void => {
    setSelectedPlayersTeam1([]);
    setSelectedPlayersTeam2([]);
    setSelectedGLeaguePlayersTeam1([]);
    setSelectedGLeaguePlayersTeam2([]);
    setSelectedDraftPicksTeam1([]);
    setSelectedDraftPicksTeam2([]);
    setPlayersTeam1([]);
    setPlayersTeam2([]);
    setGLeaguePlayersTeam1([]);
    setGLeaguePlayersTeam2([]);
    setAvailableDraftPicks([]);
    setPickTeamFilter1("");
    setPickTeamFilter2("");
    setTradeNote("");
    setNoteLength(0);
  };

  // Функция для сохранения трейда в Supabase
  const saveTradeToSupabase = async (
    tradeData: TradeData,
  ): Promise<boolean> => {
    try {
      const { error } = await supabase.from("Trades").insert([
        {
          current_team: selectedTeam1,
          trade_team: selectedTeam2,
          data: tradeData,
        },
      ]);

      if (error) {
        console.error("Error saving trade to Supabase:", error);
        return false;
      }

      console.log("Trade saved successfully to Supabase");
      return true;
    } catch (error) {
      console.error("Error in saveTradeToSupabase:", error);
      return false;
    }
  };

  const handleSubmitTrade = async (): Promise<void> => {
    const selectedActivePlayers1 = playersTeam1.filter((player) =>
      selectedPlayersTeam1.includes(player.id),
    );
    const selectedActivePlayers2 = playersTeam2.filter((player) =>
      selectedPlayersTeam2.includes(player.id),
    );

    const selectedGLeaguePlayers1 = gLeaguePlayersTeam1.filter((player) =>
      selectedGLeaguePlayersTeam1.includes(player.id),
    );
    const selectedGLeaguePlayers2 = gLeaguePlayersTeam2.filter((player) =>
      selectedGLeaguePlayersTeam2.includes(player.id),
    );

    if (
      selectedActivePlayers1.length === 0 &&
      selectedActivePlayers2.length === 0 &&
      selectedGLeaguePlayers1.length === 0 &&
      selectedGLeaguePlayers2.length === 0 &&
      selectedDraftPicksTeam1.length === 0 &&
      selectedDraftPicksTeam2.length === 0
    ) {
      alert("Please select at least one player or draft pick from any team");
      return;
    }

    // Формируем данные трейда для сохранения
    const tradeData: TradeData = {
      team1: selectedTeam1,
      team2: selectedTeam2,
      activePlayersFromTeam1: selectedActivePlayers1.map((p) => ({
        id: p.id,
        name: p.active_roster,
        type: "active",
      })),
      activePlayersFromTeam2: selectedActivePlayers2.map((p) => ({
        id: p.id,
        name: p.active_roster,
        type: "active",
      })),
      gLeaguePlayersFromTeam1: selectedGLeaguePlayers1.map((p) => ({
        id: p.id,
        name: p.active_roster,
        g_league: p.g_league,
        type: "g_league",
      })),
      gLeaguePlayersFromTeam2: selectedGLeaguePlayers2.map((p) => ({
        id: p.id,
        name: p.active_roster,
        g_league: p.g_league,
        type: "g_league",
      })),
      draftPicksFromTeam1: selectedDraftPicksTeam1.map((p) => ({
        id: p.id,
        year: p.year,
        round: p.round,
        originalTeam: p.originalTeam,
        currentTeam: p.currentTeam,
        type: "draft_pick",
      })),
      draftPicksFromTeam2: selectedDraftPicksTeam2.map((p) => ({
        id: p.id,
        year: p.year,
        round: p.round,
        originalTeam: p.originalTeam,
        currentTeam: p.currentTeam,
        type: "draft_pick",
      })),
      tradeNote: tradeNote.trim(),
      noteLength: noteLength,
      timestamp: new Date().toISOString(),
      status: "pending",
    };

    console.log("Trade Proposal:", tradeData);

    // Показываем индикатор загрузки
    setIsSubmittingTrade(true);

    try {
      // Сохраняем трейд в Supabase
      const isSaved = await saveTradeToSupabase(tradeData);

      if (isSaved) {
        alert("Трейд успешно сохранен!");
        // Закрываем модальное окно и сбрасываем состояние
        handleCloseModal();
      } else {
        alert("Ошибка при сохранении трейда. Пожалуйста, попробуйте снова.");
      }
    } catch (error) {
      console.error("Error submitting trade:", error);
      alert("Произошла ошибка при сохранении трейда.");
    } finally {
      setIsSubmittingTrade(false);
    }
  };

  const handleCloseModal = (): void => {
    setIsModalOpen(false);
    setSelectedTeam1("");
    setSelectedTeam2("");
    resetSelections();
    setStep(0);
    setIsSubmittingTrade(false);
  };

  // Фильтрация драфт-пиков по команде
  const getFilteredDraftPicks = (teamFilter: string) => {
    if (!teamFilter) return availableDraftPicks;
    return availableDraftPicks.filter(
      (pick) => pick.originalTeam === teamFilter,
    );
  };

  // Группировка драфт-пиков по году для удобного отображения
  const getGroupedDraftPicks = (teamFilter: string) => {
    const filteredPicks = getFilteredDraftPicks(teamFilter);
    const grouped: {
      [year: number]: { round1?: DraftPick; round2?: DraftPick };
    } = {};

    filteredPicks.forEach((pick) => {
      if (!grouped[pick.year]) {
        grouped[pick.year] = {};
      }
      if (pick.round === 1) {
        grouped[pick.year].round1 = pick;
      } else if (pick.round === 2) {
        grouped[pick.year].round2 = pick;
      }
    });

    return grouped;
  };

  // Функция для отображения шага выбора команд (шаг 0)
  const renderTeamSelectionStep = () => (
    <>
      <div className="teams-selection">
        <div className="team-select">
          <label className="team-label">Ваша команда</label>
          <select
            className="team-dropdown"
            value={selectedTeam1}
            onChange={handleTeam1Change}
            disabled={isLoading}
          >
            <option value="">Выберите команду</option>
            {teams.map((team) => (
              <option key={team} value={team}>
                {team}
              </option>
            ))}
          </select>
        </div>

        <div className="vs-text">VS</div>

        <div className="team-select">
          <label className="team-label">Выбор команды для трейда</label>
          <select
            className="team-dropdown"
            value={selectedTeam2}
            onChange={handleTeam2Change}
            disabled={isLoading}
          >
            <option value="">Выберите команду</option>
            {teams.map((team) => (
              <option key={team} value={team}>
                {team}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading && <div className="loading">Загрузка команд...</div>}

      <div className="modal-actions">
        <button
          className="submit-button"
          onClick={handleStartTrade}
          disabled={!selectedTeam1 || !selectedTeam2 || isLoading}
        >
          Начать трейд → Выбор активных игроков
        </button>
        <button className="cancel-button" onClick={handleCloseModal}>
          Отмена
        </button>
      </div>
    </>
  );

  // Функция для отображения шага 1 (активные игроки)
  const renderActivePlayersStep = () => (
    <>
      <div className="players-selection-container">
        {isLoadingPlayers ? (
          <div className="loading">Загрузка игроков...</div>
        ) : (
          <>
            <div className="team-players-section">
              <h4 className="team-players-title">
                {selectedTeam1} (Активный состав)
              </h4>
              <div className="players-list">
                {playersTeam1.length > 0 ? (
                  playersTeam1.map((player) => (
                    <div
                      key={player.id}
                      className={`player-item ${selectedPlayersTeam1.includes(player.id) ? "selected" : ""}`}
                      onClick={() => handlePlayerSelectTeam1(player.id)}
                    >
                      <input
                        type="checkbox"
                        checked={selectedPlayersTeam1.includes(player.id)}
                        onChange={() => {}}
                        className="player-checkbox"
                      />
                      <span className="player-name">
                        {player.active_roster}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="no-players">
                    Нет игроков в активном составе
                  </div>
                )}
              </div>
              <div className="selected-count">
                Выбрано: {selectedPlayersTeam1.length}
              </div>
            </div>

            <div className="vs-text">↔</div>

            <div className="team-players-section">
              <h4 className="team-players-title">
                {selectedTeam2} (Активный состав)
              </h4>
              <div className="players-list">
                {playersTeam2.length > 0 ? (
                  playersTeam2.map((player) => (
                    <div
                      key={player.id}
                      className={`player-item ${selectedPlayersTeam2.includes(player.id) ? "selected" : ""}`}
                      onClick={() => handlePlayerSelectTeam2(player.id)}
                    >
                      <input
                        type="checkbox"
                        checked={selectedPlayersTeam2.includes(player.id)}
                        onChange={() => {}}
                        className="player-checkbox"
                      />
                      <span className="player-name">
                        {player.active_roster}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="no-players">
                    Нет игроков в активном составе
                  </div>
                )}
              </div>
              <div className="selected-count">
                Выбрано: {selectedPlayersTeam2.length}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="modal-actions">
        <button className="back-button" onClick={handleBackToTeamSelection}>
          ← Назад к выбору команд
        </button>
        <button
          className="submit-button"
          onClick={handleProceedToGLeague}
          disabled={isLoadingPlayers}
        >
          Далее → Выбор игроков из G-League
        </button>
      </div>
    </>
  );

  // Функция для отображения шага 2 (G-League игроки)
  const renderGLeaguePlayersStep = () => (
    <>
      <div className="players-selection-container">
        {isLoadingGLeaguePlayers ? (
          <div className="loading">Загрузка игроков из G-League...</div>
        ) : (
          <>
            <div className="team-players-section">
              <h4 className="team-players-title">
                G-League: Игроки привязанные к {selectedTeam1}
                <div className="subtitle">(отображаются из active_roster)</div>
              </h4>
              <div className="players-list">
                {gLeaguePlayersTeam1.length > 0 ? (
                  gLeaguePlayersTeam1.map((player) => (
                    <div
                      key={player.id}
                      className={`player-item ${selectedGLeaguePlayersTeam1.includes(player.id) ? "selected" : ""}`}
                      onClick={() => handleGLeaguePlayerSelectTeam1(player.id)}
                    >
                      <input
                        type="checkbox"
                        checked={selectedGLeaguePlayersTeam1.includes(
                          player.id,
                        )}
                        onChange={() => {}}
                        className="player-checkbox"
                      />
                      <span className="player-name">
                        {player.active_roster}
                        <span className="player-info">
                          (из команды: {player.team})
                        </span>
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="no-players">
                    Нет игроков в G-League для этой команды
                  </div>
                )}
              </div>
              <div className="selected-count">
                Выбрано: {selectedGLeaguePlayersTeam1.length}
              </div>
            </div>

            <div className="vs-text">↔</div>

            <div className="team-players-section">
              <h4 className="team-players-title">
                G-League: Игроки привязанные к {selectedTeam2}
                <div className="subtitle">(отображаются из active_roster)</div>
              </h4>
              <div className="players-list">
                {gLeaguePlayersTeam2.length > 0 ? (
                  gLeaguePlayersTeam2.map((player) => (
                    <div
                      key={player.id}
                      className={`player-item ${selectedGLeaguePlayersTeam2.includes(player.id) ? "selected" : ""}`}
                      onClick={() => handleGLeaguePlayerSelectTeam2(player.id)}
                    >
                      <input
                        type="checkbox"
                        checked={selectedGLeaguePlayersTeam2.includes(
                          player.id,
                        )}
                        onChange={() => {}}
                        className="player-checkbox"
                      />
                      <span className="player-name">
                        {player.active_roster}
                        <span className="player-info">
                          (из команды: {player.team})
                        </span>
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="no-players">
                    Нет игроков в G-League для этой команды
                  </div>
                )}
              </div>
              <div className="selected-count">
                Выбрано: {selectedGLeaguePlayersTeam2.length}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="modal-actions">
        <button
          className="back-button"
          onClick={handleBackToActivePlayers}
          disabled={isLoadingGLeaguePlayers}
        >
          ← Назад к выбору активных игроков
        </button>
        <button
          className="submit-button"
          onClick={handleProceedToDraftPicks}
          disabled={isLoadingGLeaguePlayers}
        >
          Далее → Выбор драфт-пиков
        </button>
      </div>
    </>
  );

  // Функция для отображения шага 3 (драфт-пики любой команды)
  const renderDraftPicksStep = () => (
    <>
      <div className="draft-picks-container">
        <div className="draft-picks-section">
          <div className="draft-picks-header-section">
            <h4 className="draft-picks-title">
              Драфт-пики для команды {selectedTeam1}
            </h4>
            <div className="team-filter">
              <label>Фильтр по команде-владельцу:</label>
              <select
                value={pickTeamFilter1}
                onChange={(e) => setPickTeamFilter1(e.target.value)}
                className="team-filter-select"
              >
                <option value="">Все команды</option>
                {teams.map((team) => (
                  <option key={team} value={team}>
                    {team}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {isLoadingDraftPicks ? (
            <div className="loading">Загрузка драфт-пиков...</div>
          ) : (
            <>
              <div className="draft-picks-table">
                <div className="draft-picks-header">
                  <div className="draft-year">Год</div>
                  <div className="draft-team">Команда-владелец</div>
                  <div className="draft-round">1 раунд</div>
                  <div className="draft-round">2 раунд</div>
                </div>
                {draftYears.map((year) => {
                  const groupedPicks = getGroupedDraftPicks(pickTeamFilter1);
                  const yearPicks = groupedPicks[year] || {};
                  const round1Pick = yearPicks.round1;
                  const round2Pick = yearPicks.round2;

                  // Если есть фильтр по команде и для этого года нет пиков этой команды, не показываем строку
                  if (pickTeamFilter1 && !round1Pick && !round2Pick) {
                    return null;
                  }

                  return (
                    <div key={year} className="draft-picks-row">
                      <div className="draft-year">{year}</div>
                      <div className="draft-team">
                        {pickTeamFilter1 || "Разные команды"}
                      </div>
                      <div className="draft-round">
                        {round1Pick ? (
                          <label className="draft-pick-label">
                            <input
                              type="checkbox"
                              checked={isDraftPickSelected(
                                "team1",
                                round1Pick.id,
                              )}
                              onChange={(e) =>
                                handleDraftPickSelect(
                                  "team1",
                                  round1Pick,
                                  e.target.checked,
                                )
                              }
                              className="draft-checkbox"
                            />
                            <span className="draft-pick-info">
                              {!pickTeamFilter1 &&
                                ` (${round1Pick.originalTeam})`}
                            </span>
                          </label>
                        ) : (
                          <span className="no-pick">-</span>
                        )}
                      </div>
                      <div className="draft-round">
                        {round2Pick ? (
                          <label className="draft-pick-label">
                            <input
                              type="checkbox"
                              checked={isDraftPickSelected(
                                "team1",
                                round2Pick.id,
                              )}
                              onChange={(e) =>
                                handleDraftPickSelect(
                                  "team1",
                                  round2Pick,
                                  e.target.checked,
                                )
                              }
                              className="draft-checkbox"
                            />
                            <span className="draft-pick-info">
                              {!pickTeamFilter1 &&
                                ` (${round2Pick.originalTeam})`}
                            </span>
                          </label>
                        ) : (
                          <span className="no-pick">-</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="selected-count">
                Выбрано драфт-пиков для {selectedTeam1}:{" "}
                {selectedDraftPicksTeam1.length}
              </div>
            </>
          )}
        </div>

        <div className="vs-text">↔</div>

        <div className="draft-picks-section">
          <div className="draft-picks-header-section">
            <h4 className="draft-picks-title">
              Драфт-пики для команды {selectedTeam2}
            </h4>
            <div className="team-filter">
              <label>Фильтр по команде-владельцу:</label>
              <select
                value={pickTeamFilter2}
                onChange={(e) => setPickTeamFilter2(e.target.value)}
                className="team-filter-select"
              >
                <option value="">Все команды</option>
                {teams.map((team) => (
                  <option key={team} value={team}>
                    {team}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {isLoadingDraftPicks ? (
            <div className="loading">Загрузка драфт-пиков...</div>
          ) : (
            <>
              <div className="draft-picks-table">
                <div className="draft-picks-header">
                  <div className="draft-year">Год</div>
                  <div className="draft-team">Команда-владелец</div>
                  <div className="draft-round">1 раунд</div>
                  <div className="draft-round">2 раунд</div>
                </div>
                {draftYears.map((year) => {
                  const groupedPicks = getGroupedDraftPicks(pickTeamFilter2);
                  const yearPicks = groupedPicks[year] || {};
                  const round1Pick = yearPicks.round1;
                  const round2Pick = yearPicks.round2;

                  // Если есть фильтр по команде и для этого года нет пиков этой команды, не показываем строку
                  if (pickTeamFilter2 && !round1Pick && !round2Pick) {
                    return null;
                  }

                  return (
                    <div key={year} className="draft-picks-row">
                      <div className="draft-year">{year}</div>
                      <div className="draft-team">
                        {pickTeamFilter2 || "Разные команды"}
                      </div>
                      <div className="draft-round">
                        {round1Pick ? (
                          <label className="draft-pick-label">
                            <input
                              type="checkbox"
                              checked={isDraftPickSelected(
                                "team2",
                                round1Pick.id,
                              )}
                              onChange={(e) =>
                                handleDraftPickSelect(
                                  "team2",
                                  round1Pick,
                                  e.target.checked,
                                )
                              }
                              className="draft-checkbox"
                            />
                            <span className="draft-pick-info">
                              {!pickTeamFilter2 &&
                                ` (${round1Pick.originalTeam})`}
                            </span>
                          </label>
                        ) : (
                          <span className="no-pick">-</span>
                        )}
                      </div>
                      <div className="draft-round">
                        {round2Pick ? (
                          <label className="draft-pick-label">
                            <input
                              type="checkbox"
                              checked={isDraftPickSelected(
                                "team2",
                                round2Pick.id,
                              )}
                              onChange={(e) =>
                                handleDraftPickSelect(
                                  "team2",
                                  round2Pick,
                                  e.target.checked,
                                )
                              }
                              className="draft-checkbox"
                            />
                            <span className="draft-pick-info">
                              {!pickTeamFilter2 &&
                                ` (${round2Pick.originalTeam})`}
                            </span>
                          </label>
                        ) : (
                          <span className="no-pick">-</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="selected-count">
                Выбрано драфт-пиков для {selectedTeam2}:{" "}
                {selectedDraftPicksTeam2.length}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="modal-actions">
        <button className="back-button" onClick={handleBackToGLeaguePlayers}>
          ← Назад к выбору игроков из G-League
        </button>
        <button className="submit-button" onClick={handleProceedToNotes}>
          Далее → Ввод примечания
        </button>
      </div>
    </>
  );

  // Функция для отображения шага 4 (примечание к трейду)
  const renderNotesStep = () => (
    <>
      <div className="trade-notes-container">
        <div className="notes-section">
          <h4>Примечание к трейду (необязательно):</h4>
          <textarea
            className="trade-notes-textarea"
            value={tradeNote}
            onChange={handleTradeNoteChange}
            placeholder="Оставьте комментарий или объяснение к этому трейду..."
            maxLength={500}
            rows={6}
          />
          <div
            className={`notes-counter ${noteLength >= 450 ? "warning" : ""}`}
          >
            {noteLength}/500 символов
          </div>
        </div>
      </div>

      <div className="modal-actions">
        <button className="back-button" onClick={handleBackToDraftPicks}>
          ← Назад к выбору драфт-пиков
        </button>
        <button className="submit-button" onClick={handleProceedToSummary}>
          Далее → Сводка и подтверждение
        </button>
      </div>
    </>
  );

  // Функция для отображения шага 5 (сводка и подтверждение)
  const renderSummaryStep = () => (
    <>
      <div className="trade-summary-container">
        <div className="trade-summary">
          <h4>Сводка трейда:</h4>

          <div className="trade-summary-section">
            <div className="summary-team">
              <h5>{selectedTeam1} отдает:</h5>
              {selectedPlayersTeam1.length > 0 && (
                <div className="summary-items">
                  <strong>Активные игроки:</strong>
                  {playersTeam1
                    .filter((p) => selectedPlayersTeam1.includes(p.id))
                    .map((p) => (
                      <div key={p.id} className="summary-item">
                        {p.active_roster}
                      </div>
                    ))}
                </div>
              )}
              {selectedGLeaguePlayersTeam1.length > 0 && (
                <div className="summary-items">
                  <strong>Игроки из G-League:</strong>
                  {gLeaguePlayersTeam1
                    .filter((p) => selectedGLeaguePlayersTeam1.includes(p.id))
                    .map((p) => (
                      <div key={p.id} className="summary-item">
                        {p.active_roster}
                      </div>
                    ))}
                </div>
              )}
              {selectedDraftPicksTeam1.length > 0 && (
                <div className="summary-items">
                  <strong>Драфт-пики:</strong>
                  {selectedDraftPicksTeam1.map((p) => (
                    <div key={p.id} className="summary-item">
                      {p.year} год, {p.round} раунд ({p.originalTeam})
                    </div>
                  ))}
                </div>
              )}
              {selectedPlayersTeam1.length === 0 &&
                selectedGLeaguePlayersTeam1.length === 0 &&
                selectedDraftPicksTeam1.length === 0 && (
                  <div className="summary-items">Ничего</div>
                )}
            </div>

            <div className="vs-text-summary">↔</div>

            <div className="summary-team">
              <h5>{selectedTeam2} отдает:</h5>
              {selectedPlayersTeam2.length > 0 && (
                <div className="summary-items">
                  <strong>Активные игроки:</strong>
                  {playersTeam2
                    .filter((p) => selectedPlayersTeam2.includes(p.id))
                    .map((p) => (
                      <div key={p.id} className="summary-item">
                        {p.active_roster}
                      </div>
                    ))}
                </div>
              )}
              {selectedGLeaguePlayersTeam2.length > 0 && (
                <div className="summary-items">
                  <strong>Игроки из G-League:</strong>
                  {gLeaguePlayersTeam2
                    .filter((p) => selectedGLeaguePlayersTeam2.includes(p.id))
                    .map((p) => (
                      <div key={p.id} className="summary-item">
                        {p.active_roster}
                      </div>
                    ))}
                </div>
              )}
              {selectedDraftPicksTeam2.length > 0 && (
                <div className="summary-items">
                  <strong>Драфт-пики:</strong>
                  {selectedDraftPicksTeam2.map((p) => (
                    <div key={p.id} className="summary-item">
                      {p.year} год, {p.round} раунд ({p.originalTeam})
                    </div>
                  ))}
                </div>
              )}
              {selectedPlayersTeam2.length === 0 &&
                selectedGLeaguePlayersTeam2.length === 0 &&
                selectedDraftPicksTeam2.length === 0 && (
                  <div className="summary-items">Ничего</div>
                )}
            </div>
          </div>

          {tradeNote && (
            <div className="notes-summary">
              <h5>Ваше примечание:</h5>
              <div className="note-text">{tradeNote}</div>
            </div>
          )}
        </div>

        <div className="trade-validation">
          {selectedPlayersTeam1.length === 0 &&
            selectedPlayersTeam2.length === 0 &&
            selectedGLeaguePlayersTeam1.length === 0 &&
            selectedGLeaguePlayersTeam2.length === 0 &&
            selectedDraftPicksTeam1.length === 0 &&
            selectedDraftPicksTeam2.length === 0 && (
              <div className="validation-warning">
                ⚠️ В трейде нет выбранных игроков или пиков. Пожалуйста,
                вернитесь и выберите хотя бы один элемент.
              </div>
            )}
        </div>
      </div>

      <div className="modal-actions">
        <button className="back-button" onClick={handleBackToNotes}>
          ← Назад к примечанию
        </button>
        <button
          className="submit-button"
          onClick={handleSubmitTrade}
          disabled={
            (selectedPlayersTeam1.length === 0 &&
              selectedPlayersTeam2.length === 0 &&
              selectedGLeaguePlayersTeam1.length === 0 &&
              selectedGLeaguePlayersTeam2.length === 0 &&
              selectedDraftPicksTeam1.length === 0 &&
              selectedDraftPicksTeam2.length === 0) ||
            isSubmittingTrade
          }
        >
          {isSubmittingTrade ? "Сохранение..." : "Подтвердить обмен"}
        </button>
        <button className="cancel-button" onClick={handleCloseModal}>
          Отмена
        </button>
      </div>
    </>
  );

  return (
    <div className="trades-container">
      <button className="trade-button" onClick={() => setIsModalOpen(true)}>
        Предложить трейд
      </button>

      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                {step === 0
                  ? "Выбор команд для обмена"
                  : step === 1
                    ? `Обмен активными игроками: ${selectedTeam1} ↔ ${selectedTeam2}`
                    : step === 2
                      ? `Обмен игроками из G-League: ${selectedTeam1} ↔ ${selectedTeam2}`
                      : step === 3
                        ? `Обмен драфт-пиками: ${selectedTeam1} ↔ ${selectedTeam2}`
                        : step === 4
                          ? `Примечание к трейду: ${selectedTeam1} ↔ ${selectedTeam2}`
                          : `Сводка трейда: ${selectedTeam1} ↔ ${selectedTeam2}`}
              </h3>
              <button className="close-button" onClick={handleCloseModal}>
                ×
              </button>
            </div>

            {step === 0
              ? renderTeamSelectionStep()
              : step === 1
                ? renderActivePlayersStep()
                : step === 2
                  ? renderGLeaguePlayersStep()
                  : step === 3
                    ? renderDraftPicksStep()
                    : step === 4
                      ? renderNotesStep()
                      : renderSummaryStep()}

            {/* Индикатор прогресса */}
            <div className="progress-indicator">
              <div className="progress-steps">
                <div
                  className={`progress-step ${step >= 0 ? "active" : ""} ${step === 0 ? "current" : ""}`}
                >
                  <div className="step-number">1</div>
                  <div className="step-label">Команды</div>
                </div>
                <div
                  className={`progress-line ${step >= 1 ? "active" : ""}`}
                ></div>
                <div
                  className={`progress-step ${step >= 1 ? "active" : ""} ${step === 1 ? "current" : ""}`}
                >
                  <div className="step-number">2</div>
                  <div className="step-label">Активные игроки</div>
                </div>
                <div
                  className={`progress-line ${step >= 2 ? "active" : ""}`}
                ></div>
                <div
                  className={`progress-step ${step >= 2 ? "active" : ""} ${step === 2 ? "current" : ""}`}
                >
                  <div className="step-number">3</div>
                  <div className="step-label">G-League</div>
                </div>
                <div
                  className={`progress-line ${step >= 3 ? "active" : ""}`}
                ></div>
                <div
                  className={`progress-step ${step >= 3 ? "active" : ""} ${step === 3 ? "current" : ""}`}
                >
                  <div className="step-number">4</div>
                  <div className="step-label">Драфт-пики</div>
                </div>
                <div
                  className={`progress-line ${step >= 4 ? "active" : ""}`}
                ></div>
                <div
                  className={`progress-step ${step >= 4 ? "active" : ""} ${step === 4 ? "current" : ""}`}
                >
                  <div className="step-number">5</div>
                  <div className="step-label">Примечание</div>
                </div>
                <div
                  className={`progress-line ${step >= 5 ? "active" : ""}`}
                ></div>
                <div
                  className={`progress-step ${step >= 5 ? "active" : ""} ${step === 5 ? "current" : ""}`}
                >
                  <div className="step-number">✓</div>
                  <div className="step-label">Сводка</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Trades;
