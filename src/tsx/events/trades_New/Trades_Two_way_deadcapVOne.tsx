// import React, { useState, useEffect } from "react";
// import { supabase } from "../../../Supabase";
// import "./trades_Two_way_deadcapVOne.css";

// interface Player {
//   id: number;
//   active_roster: string | boolean | null;
//   position?: string;
//   team?: string;
//   g_league?: string;
//   name?: string;
//   year_one?: number | string;
//   year_two?: number | string;
//   year_three?: number | string;
//   year_four?: number | string;
//   year_five?: number | string;
// }

// interface SelectedPlayer extends Player {
//   retentionByYear: Record<number, number>;
//   finalSalariesByYear: Record<number, number>;
// }

// interface Trades_Two_way_deadcapVOneProps {
//   myTeam: string;
//   theirTeam: string;
//   onBack: () => void;
//   onSubmit: (
//     mySelected: SelectedPlayer[],
//     theirSelected: SelectedPlayer[],
//   ) => void;
// }

// // Форматирует число, добавляя пробелы как разделители тысяч
// const formatWithSpaces = (value: number | string | null | undefined): string => {
//   if (value === undefined || value === null) return "—";
//   let num: number;
//   if (typeof value === "string") {
//     // Удаляем все пробелы и преобразуем в число
//     const cleaned = value.replace(/\s/g, "");
//     const parsed = parseFloat(cleaned);
//     if (isNaN(parsed)) return value;
//     num = parsed;
//   } else {
//     num = value;
//   }
//   const parts = num.toString().split(".");
//   parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
//   return parts.join(".");
// };

// // Парсит строку, введённую пользователем (может содержать пробелы, запятые как разделители)
// const parseFormattedNumber = (str: string): number => {
//   const cleaned = str.replace(/\s/g, "").replace(",", ".");
//   const num = parseFloat(cleaned);
//   return isNaN(num) ? 0 : num;
// };

// // Извлекает число из любого значения (учитывая пробелы и префиксы типа "PO-15 000 000")
// const extractSalaryNumber = (value: unknown): number => {
//   if (value === undefined || value === null) return 0;
//   if (typeof value === "number") return isNaN(value) ? 0 : value;
//   if (typeof value === "boolean") return 0;
//   if (typeof value === "string") {
//     // Сначала удаляем все пробелы
//     const withoutSpaces = value.replace(/\s/g, "");
//     // Ищем первое число (целое или десятичное) в строке
//     const match = withoutSpaces.match(/(\d+(?:\.\d+)?)/);
//     if (match) {
//       const num = parseFloat(match[1]);
//       return isNaN(num) ? 0 : num;
//     }
//   }
//   return 0;
// };

// const getSalaryForYear = (player: Player, yearIndex: number): number => {
//   const key = `year_${["one", "two", "three", "four", "five"][yearIndex - 1]}` as keyof Player;
//   const raw = player[key];
//   return extractSalaryNumber(raw);
// };

// const getNonEmptyYears = (player: Player): { index: number; salary: number }[] => {
//   const years = [];
//   for (let i = 1; i <= 5; i++) {
//     const salary = getSalaryForYear(player, i);
//     if (salary > 0) {
//       years.push({ index: i, salary });
//     }
//   }
//   return years;
// };

// const computeFinalSalaries = (
//   player: Player,
//   retentionByYear: Record<number, number>
// ): Record<number, number> => {
//   const result: Record<number, number> = {};
//   const years = getNonEmptyYears(player);
//   for (const { index, salary } of years) {
//     const retention = retentionByYear[index] || 0;
//     result[index] = Math.max(0, salary - retention);
//   }
//   return result;
// };

// const Trades_Two_way_deadcapVOne: React.FC<Trades_Two_way_deadcapVOneProps> = ({
//   myTeam,
//   theirTeam,
//   onBack,
//   onSubmit,
// }) => {
//   const [myPlayers, setMyPlayers] = useState<Player[]>([]);
//   const [theirPlayers, setTheirPlayers] = useState<Player[]>([]);
//   const [selectedMy, setSelectedMy] = useState<number[]>([]);
//   const [selectedTheir, setSelectedTheir] = useState<number[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [openSalaryId, setOpenSalaryId] = useState<number | null>(null);
//   const [retentionMap, setRetentionMap] = useState<Record<number, Record<number, number>>>({});

//   const fetchPlayersByTeam = async (teamName: string): Promise<Player[]> => {
//     if (!teamName) return [];
//     const { data, error } = await supabase.from("Players").select("*").eq("team", teamName);
//     if (error) throw new Error(`Ошибка загрузки: ${error.message}`);
//     return data || [];
//   };

//   useEffect(() => {
//     const load = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const [my, their] = await Promise.all([fetchPlayersByTeam(myTeam), fetchPlayersByTeam(theirTeam)]);
//         setMyPlayers(my);
//         setTheirPlayers(their);
//         setSelectedMy([]);
//         setSelectedTheir([]);
//         setRetentionMap({});
//         setOpenSalaryId(null);
//       } catch (err: any) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     if (myTeam && theirTeam) load();
//   }, [myTeam, theirTeam]);

//   const getPlayerName = (p: Player): string => String(p.active_roster ?? `ID ${p.id}`);

//   const getSalaryInfo = (p: Player): string => {
//     const years = [
//       { label: "Год 1", value: p.year_one },
//       { label: "Год 2", value: p.year_two },
//       { label: "Год 3", value: p.year_three },
//       { label: "Год 4", value: p.year_four },
//       { label: "Год 5", value: p.year_five },
//     ];
//     const parts = years.map(({ label, value }) => {
//       if (value === undefined || value === null) return `${label}: —`;
//       return `${label}: ${String(value)}`;
//     });
//     return parts.join(" | ");
//   };

//   const toggleSalary = (id: number) => {
//     setOpenSalaryId((prev) => (prev === id ? null : id));
//   };

//   const toggle = (id: number, type: "my" | "their") => {
//     if (type === "my") {
//       const isSelected = selectedMy.includes(id);
//       if (!isSelected) {
//         setRetentionMap((prev) => ({ ...prev, [id]: {} }));
//       } else {
//         const newMap = { ...retentionMap };
//         delete newMap[id];
//         setRetentionMap(newMap);
//       }
//       setSelectedMy((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
//     } else {
//       const isSelected = selectedTheir.includes(id);
//       if (!isSelected) {
//         setRetentionMap((prev) => ({ ...prev, [id]: {} }));
//       } else {
//         const newMap = { ...retentionMap };
//         delete newMap[id];
//         setRetentionMap(newMap);
//       }
//       setSelectedTheir((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
//     }
//   };

//   const handleRetentionChange = (playerId: number, yearIndex: number, value: number) => {
//     const num = Math.max(0, value);
//     setRetentionMap((prev) => ({
//       ...prev,
//       [playerId]: {
//         ...(prev[playerId] || {}),
//         [yearIndex]: num,
//       },
//     }));
//   };

//   const handleSubmit = () => {
//     const buildSelected = (players: Player[], selectedIds: number[]): SelectedPlayer[] => {
//       return players
//         .filter((p) => selectedIds.includes(p.id))
//         .map((p) => {
//           const retentionByYear = retentionMap[p.id] || {};
//           const finalSalariesByYear = computeFinalSalaries(p, retentionByYear);
//           return {
//             ...p,
//             retentionByYear,
//             finalSalariesByYear,
//           };
//         });
//     };

//     const mySelected = buildSelected(myPlayers, selectedMy);
//     const theirSelected = buildSelected(theirPlayers, selectedTheir);
//     onSubmit(mySelected, theirSelected);
//   };

//   const renderPlayerList = (players: Player[], selectedIds: number[], type: "my" | "their") => (
//     <ul className="Trades_Two_way_deadcapVOne-player-list">
//       {players.map((p) => {
//         const isSelected = selectedIds.includes(p.id);
//         const retentionByYear = retentionMap[p.id] || {};
//         const nonEmptyYears = getNonEmptyYears(p);

//         return (
//           <li key={p.id} className="Trades_Two_way_deadcapVOne-player-item">
//             <div className="Trades_Two_way_deadcapVOne-player-header">
//               <label className="Trades_Two_way_deadcapVOne-checkbox-label">
//                 <input
//                   type="checkbox"
//                   checked={isSelected}
//                   onChange={() => toggle(p.id, type)}
//                   className="Trades_Two_way_deadcapVOne-checkbox"
//                 />
//                 {getPlayerName(p)}
//               </label>
//               <button
//                 type="button"
//                 onClick={() => toggleSalary(p.id)}
//                 className="Trades_Two_way_deadcapVOne-info-button"
//               >
//                 ?
//               </button>
//             </div>

//             {openSalaryId === p.id && <div className="Trades_Two_way_deadcapVOne-salary-popup">{getSalaryInfo(p)}</div>}

//             {isSelected && (
//               <div className="Trades_Two_way_deadcapVOne-retention-section">
//                 {nonEmptyYears.length === 0 ? (
//                   <div className="Trades_Two_way_deadcapVOne-no-salary">Нет данных о зарплате ни за один год</div>
//                 ) : (
//                   nonEmptyYears.map(({ index, salary }) => {
//                     const retention = retentionByYear[index] || 0;
//                     const finalSalary = Math.max(0, salary - retention);
//                     const displayValue = retention === 0 ? "" : formatWithSpaces(retention);
//                     const originalSalaryFormatted = formatWithSpaces(salary); // теперь корректно форматирует число с пробелами

//                     return (
//                       <div key={index} className="Trades_Two_way_deadcapVOne-year-block">
//                         <div className="Trades_Two_way_deadcapVOne-year-title">Год {index}</div>
//                         <div className="Trades_Two_way_deadcapVOne-year-details">
//                           <span>
//                             Исходная зарплата: <strong>{originalSalaryFormatted}</strong>
//                           </span>
//                           <label className="Trades_Two_way_deadcapVOne-retention-label">
//                             Удержание:
//                             <input
//                               type="text"
//                               placeholder="0"
//                               value={displayValue}
//                               onChange={(e) => {
//                                 const raw = e.target.value;
//                                 if (raw.trim() === "") {
//                                   handleRetentionChange(p.id, index, 0);
//                                   return;
//                                 }
//                                 const num = parseFormattedNumber(raw);
//                                 handleRetentionChange(p.id, index, num);
//                               }}
//                               className="Trades_Two_way_deadcapVOne-retention-input"
//                             />
//                           </label>
//                           <span>
//                             Итоговая зарплата:{" "}
//                             <strong
//                               className={
//                                 finalSalary < 0
//                                   ? "Trades_Two_way_deadcapVOne-negative-salary"
//                                   : "Trades_Two_way_deadcapVOne-positive-salary"
//                               }
//                             >
//                               {formatWithSpaces(finalSalary)}
//                             </strong>
//                           </span>
//                         </div>
//                       </div>
//                     );
//                   })
//                 )}
//               </div>
//             )}
//           </li>
//         );
//       })}
//     </ul>
//   );

//   if (loading) return <div className="Trades_Two_way_deadcapVOne-loading">Загрузка игроков...</div>;
//   if (error) return <div className="Trades_Two_way_deadcapVOne-error">Ошибка: {error}</div>;

//   return (
//     <div className="Trades_Two_way_deadcapVOne-container">
//       <div className="Trades_Two_way_deadcapVOne-header">
//         <h4>Шаг: Dead Cap (версия VOne)</h4>
//         <p>
//           <strong>Моя команда:</strong> {myTeam}
//         </p>
//         <p>
//           <strong>Команда соперника:</strong> {theirTeam}
//         </p>
//       </div>

//       <div className="Trades_Two_way_deadcapVOne-columns">
//         <div className="Trades_Two_way_deadcapVOne-column">
//           <strong className="Trades_Two_way_deadcapVOne-column-title">Мои игроки ({myPlayers.length})</strong>
//           {renderPlayerList(myPlayers, selectedMy, "my")}
//         </div>
//         <div className="Trades_Two_way_deadcapVOne-column">
//           <strong className="Trades_Two_way_deadcapVOne-column-title">Игроки соперника ({theirPlayers.length})</strong>
//           {renderPlayerList(theirPlayers, selectedTheir, "their")}
//         </div>
//       </div>

//       <div className="Trades_Two_way_deadcapVOne-actions">
//         <button onClick={onBack} className="Trades_Two_way_deadcapVOne-button Trades_Two_way_deadcapVOne-button-back">
//           Назад
//         </button>
//         <button
//           onClick={handleSubmit}
//           className="Trades_Two_way_deadcapVOne-button Trades_Two_way_deadcapVOne-button-next"
//         >
//           Далее
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Trades_Two_way_deadcapVOne;

// -------------------------------------------------------------

// import React, { useState, useEffect } from "react";
// import { supabase } from "../../../Supabase";
// import "./trades_Two_way_deadcapVOne.css";

// interface Player {
//   id: number;
//   active_roster: string | boolean | null;
//   position?: string;
//   team?: string;
//   g_league?: string;
//   name?: string;
//   year_one?: number | string;
//   year_two?: number | string;
//   year_three?: number | string;
//   year_four?: number | string;
//   year_five?: number | string;
// }

// interface SelectedPlayer extends Player {
//   retentionByYear: Record<number, number>;
//   finalSalariesByYear: Record<number, number>;
// }

// interface Trades_Two_way_deadcapVOneProps {
//   myTeam: string;
//   theirTeam: string;
//   onBack: () => void;
//   onSubmit: (
//     mySelected: SelectedPlayer[],
//     theirSelected: SelectedPlayer[],
//   ) => void;
// }

// // Форматирует число, добавляя пробелы как разделители тысяч
// const formatWithSpaces = (
//   value: number | string | null | undefined,
// ): string => {
//   if (value === undefined || value === null) return "—";
//   let num: number;
//   if (typeof value === "string") {
//     const cleaned = value.replace(/\s/g, "");
//     const parsed = parseFloat(cleaned);
//     if (isNaN(parsed)) return value;
//     num = parsed;
//   } else {
//     num = value;
//   }
//   const parts = num.toString().split(".");
//   parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
//   return parts.join(".");
// };

// // Парсит строку, введённую пользователем (может содержать пробелы, запятые как разделители)
// const parseFormattedNumber = (str: string): number => {
//   const cleaned = str.replace(/\s/g, "").replace(",", ".");
//   const num = parseFloat(cleaned);
//   return isNaN(num) ? 0 : num;
// };

// // Извлекает число из любого значения (учитывая пробелы и префиксы типа "PO-15 000 000")
// const extractSalaryNumber = (value: unknown): number => {
//   if (value === undefined || value === null) return 0;
//   if (typeof value === "number") return isNaN(value) ? 0 : value;
//   if (typeof value === "boolean") return 0;
//   if (typeof value === "string") {
//     const withoutSpaces = value.replace(/\s/g, "");
//     const match = withoutSpaces.match(/(\d+(?:\.\d+)?)/);
//     if (match) {
//       const num = parseFloat(match[1]);
//       return isNaN(num) ? 0 : num;
//     }
//   }
//   return 0;
// };

// // Возвращает оригинальное значение зарплаты для отображения (с префиксами/суффиксами)
// const getRawSalaryForYear = (player: Player, yearIndex: number): string => {
//   const key =
//     `year_${["one", "two", "three", "four", "five"][yearIndex - 1]}` as keyof Player;
//   const raw = player[key];
//   if (raw === undefined || raw === null) return "—";
//   return String(raw);
// };

// const getSalaryForYear = (player: Player, yearIndex: number): number => {
//   const key =
//     `year_${["one", "two", "three", "four", "five"][yearIndex - 1]}` as keyof Player;
//   const raw = player[key];
//   return extractSalaryNumber(raw);
// };

// const getNonEmptyYears = (
//   player: Player,
// ): { index: number; salary: number; rawValue: string }[] => {
//   const years = [];
//   for (let i = 1; i <= 5; i++) {
//     const salary = getSalaryForYear(player, i);
//     if (salary > 0) {
//       years.push({
//         index: i,
//         salary,
//         rawValue: getRawSalaryForYear(player, i),
//       });
//     }
//   }
//   return years;
// };

// const computeFinalSalaries = (
//   player: Player,
//   retentionByYear: Record<number, number>,
// ): Record<number, number> => {
//   const result: Record<number, number> = {};
//   const years = getNonEmptyYears(player);
//   for (const { index, salary } of years) {
//     const retention = retentionByYear[index] || 0;
//     result[index] = Math.max(0, salary - retention);
//   }
//   return result;
// };

// // Формирует итоговую зарплату, сохраняя префикс/суффикс исходной строки
// const formatFinalSalaryWithPrefix = (
//   rawValue: string,
//   finalSalary: number,
// ): string => {
//   if (finalSalary < 0) finalSalary = 0;
//   const formattedNumber = formatWithSpaces(finalSalary);
//   // Ищем первое число в строке (с учётом пробелов)
//   const match = rawValue.match(/\d[\d\s]*\.?\d*/);
//   if (!match) return formattedNumber; // если числа нет, просто число
//   const originalNumberStr = match[0];
//   // Заменяем найденное число на новое
//   return rawValue.replace(originalNumberStr, formattedNumber);
// };

// const Trades_Two_way_deadcapVOne: React.FC<Trades_Two_way_deadcapVOneProps> = ({
//   myTeam,
//   theirTeam,
//   onBack,
//   onSubmit,
// }) => {
//   const [myPlayers, setMyPlayers] = useState<Player[]>([]);
//   const [theirPlayers, setTheirPlayers] = useState<Player[]>([]);
//   const [selectedMy, setSelectedMy] = useState<number[]>([]);
//   const [selectedTheir, setSelectedTheir] = useState<number[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [openSalaryId, setOpenSalaryId] = useState<number | null>(null);
//   const [retentionMap, setRetentionMap] = useState<
//     Record<number, Record<number, number>>
//   >({});

//   const fetchPlayersByTeam = async (teamName: string): Promise<Player[]> => {
//     if (!teamName) return [];
//     const { data, error } = await supabase
//       .from("Players")
//       .select("*")
//       .eq("team", teamName);
//     if (error) throw new Error(`Ошибка загрузки: ${error.message}`);
//     return data || [];
//   };

//   useEffect(() => {
//     const load = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const [my, their] = await Promise.all([
//           fetchPlayersByTeam(myTeam),
//           fetchPlayersByTeam(theirTeam),
//         ]);
//         setMyPlayers(my);
//         setTheirPlayers(their);
//         setSelectedMy([]);
//         setSelectedTheir([]);
//         setRetentionMap({});
//         setOpenSalaryId(null);
//       } catch (err: any) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     if (myTeam && theirTeam) load();
//   }, [myTeam, theirTeam]);

//   const getPlayerName = (p: Player): string =>
//     String(p.active_roster ?? `ID ${p.id}`);

//   const getSalaryInfo = (p: Player): string => {
//     const years = [
//       { label: "Год 1", value: p.year_one },
//       { label: "Год 2", value: p.year_two },
//       { label: "Год 3", value: p.year_three },
//       { label: "Год 4", value: p.year_four },
//       { label: "Год 5", value: p.year_five },
//     ];
//     const parts = years.map(({ label, value }) => {
//       if (value === undefined || value === null) return `${label}: —`;
//       return `${label}: ${String(value)}`;
//     });
//     return parts.join(" | ");
//   };

//   const toggleSalary = (id: number) => {
//     setOpenSalaryId((prev) => (prev === id ? null : id));
//   };

//   const toggle = (id: number, type: "my" | "their") => {
//     if (type === "my") {
//       const isSelected = selectedMy.includes(id);
//       if (!isSelected) {
//         setRetentionMap((prev) => ({ ...prev, [id]: {} }));
//       } else {
//         const newMap = { ...retentionMap };
//         delete newMap[id];
//         setRetentionMap(newMap);
//       }
//       setSelectedMy((prev) =>
//         prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
//       );
//     } else {
//       const isSelected = selectedTheir.includes(id);
//       if (!isSelected) {
//         setRetentionMap((prev) => ({ ...prev, [id]: {} }));
//       } else {
//         const newMap = { ...retentionMap };
//         delete newMap[id];
//         setRetentionMap(newMap);
//       }
//       setSelectedTheir((prev) =>
//         prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
//       );
//     }
//   };

//   const handleRetentionChange = (
//     playerId: number,
//     yearIndex: number,
//     value: number,
//   ) => {
//     const num = Math.max(0, value);
//     setRetentionMap((prev) => ({
//       ...prev,
//       [playerId]: {
//         ...(prev[playerId] || {}),
//         [yearIndex]: num,
//       },
//     }));
//   };

//   const handleSubmit = () => {
//     const buildSelected = (
//       players: Player[],
//       selectedIds: number[],
//     ): SelectedPlayer[] => {
//       return players
//         .filter((p) => selectedIds.includes(p.id))
//         .map((p) => {
//           const retentionByYear = retentionMap[p.id] || {};
//           const finalSalariesByYear = computeFinalSalaries(p, retentionByYear);
//           return {
//             ...p,
//             retentionByYear,
//             finalSalariesByYear,
//           };
//         });
//     };

//     const mySelected = buildSelected(myPlayers, selectedMy);
//     const theirSelected = buildSelected(theirPlayers, selectedTheir);
//     onSubmit(mySelected, theirSelected);
//   };

//   const renderPlayerList = (
//     players: Player[],
//     selectedIds: number[],
//     type: "my" | "their",
//   ) => (
//     <ul className="Trades_Two_way_deadcapVOne-player-list">
//       {players.map((p) => {
//         const isSelected = selectedIds.includes(p.id);
//         const retentionByYear = retentionMap[p.id] || {};
//         const nonEmptyYears = getNonEmptyYears(p);

//         return (
//           <li key={p.id} className="Trades_Two_way_deadcapVOne-player-item">
//             <div className="Trades_Two_way_deadcapVOne-player-header">
//               <label className="Trades_Two_way_deadcapVOne-checkbox-label">
//                 <input
//                   type="checkbox"
//                   checked={isSelected}
//                   onChange={() => toggle(p.id, type)}
//                   className="Trades_Two_way_deadcapVOne-checkbox"
//                 />
//                 {getPlayerName(p)}
//               </label>
//               <button
//                 type="button"
//                 onClick={() => toggleSalary(p.id)}
//                 className="Trades_Two_way_deadcapVOne-info-button"
//               >
//                 ?
//               </button>
//             </div>

//             {openSalaryId === p.id && (
//               <div className="Trades_Two_way_deadcapVOne-salary-popup">
//                 {getSalaryInfo(p)}
//               </div>
//             )}

//             {isSelected && (
//               <div className="Trades_Two_way_deadcapVOne-retention-section">
//                 {nonEmptyYears.length === 0 ? (
//                   <div className="Trades_Two_way_deadcapVOne-no-salary">
//                     Нет данных о зарплате ни за один год
//                   </div>
//                 ) : (
//                   nonEmptyYears.map(({ index, salary, rawValue }) => {
//                     const retention = retentionByYear[index] || 0;
//                     const finalSalary = Math.max(0, salary - retention);
//                     const displayValue =
//                       retention === 0 ? "" : formatWithSpaces(retention);
//                     const finalSalaryDisplay = formatFinalSalaryWithPrefix(
//                       rawValue,
//                       finalSalary,
//                     );

//                     return (
//                       <div
//                         key={index}
//                         className="Trades_Two_way_deadcapVOne-year-block"
//                       >
//                         <div className="Trades_Two_way_deadcapVOne-year-title">
//                           Год {index}
//                         </div>
//                         <div className="Trades_Two_way_deadcapVOne-year-details">
//                           <span>
//                             Исходная зарплата: <strong>{rawValue}</strong>
//                           </span>
//                           <label className="Trades_Two_way_deadcapVOne-retention-label">
//                             Удержание:
//                             <input
//                               type="text"
//                               placeholder="0"
//                               value={displayValue}
//                               onChange={(e) => {
//                                 const raw = e.target.value;
//                                 if (raw.trim() === "") {
//                                   handleRetentionChange(p.id, index, 0);
//                                   return;
//                                 }
//                                 const num = parseFormattedNumber(raw);
//                                 handleRetentionChange(p.id, index, num);
//                               }}
//                               className="Trades_Two_way_deadcapVOne-retention-input"
//                             />
//                           </label>
//                           <span>
//                             Итоговая зарплата:{" "}
//                             <strong
//                               className={
//                                 finalSalary < 0
//                                   ? "Trades_Two_way_deadcapVOne-negative-salary"
//                                   : "Trades_Two_way_deadcapVOne-positive-salary"
//                               }
//                             >
//                               {finalSalaryDisplay}
//                             </strong>
//                           </span>
//                         </div>
//                       </div>
//                     );
//                   })
//                 )}
//               </div>
//             )}
//           </li>
//         );
//       })}
//     </ul>
//   );

//   if (loading)
//     return (
//       <div className="Trades_Two_way_deadcapVOne-loading">
//         Загрузка игроков...
//       </div>
//     );
//   if (error)
//     return (
//       <div className="Trades_Two_way_deadcapVOne-error">Ошибка: {error}</div>
//     );

//   return (
//     <div className="Trades_Two_way_deadcapVOne-container">
//       <div className="Trades_Two_way_deadcapVOne-header">
//         <h4>Шаг: Dead Cap (версия VOne)</h4>
//         <p>
//           <strong>Моя команда:</strong> {myTeam}
//         </p>
//         <p>
//           <strong>Команда соперника:</strong> {theirTeam}
//         </p>
//       </div>

//       <div className="Trades_Two_way_deadcapVOne-columns">
//         <div className="Trades_Two_way_deadcapVOne-column">
//           <strong className="Trades_Two_way_deadcapVOne-column-title">
//             Мои игроки ({myPlayers.length})
//           </strong>
//           {renderPlayerList(myPlayers, selectedMy, "my")}
//         </div>
//         <div className="Trades_Two_way_deadcapVOne-column">
//           <strong className="Trades_Two_way_deadcapVOne-column-title">
//             Игроки соперника ({theirPlayers.length})
//           </strong>
//           {renderPlayerList(theirPlayers, selectedTheir, "their")}
//         </div>
//       </div>

//       <div className="Trades_Two_way_deadcapVOne-actions">
//         <button
//           onClick={onBack}
//           className="Trades_Two_way_deadcapVOne-button Trades_Two_way_deadcapVOne-button-back"
//         >
//           Назад
//         </button>
//         <button
//           onClick={handleSubmit}
//           className="Trades_Two_way_deadcapVOne-button Trades_Two_way_deadcapVOne-button-next"
//         >
//           Далее
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Trades_Two_way_deadcapVOne;

import React, { useState, useEffect } from "react";
import { supabase } from "../../../Supabase";
import "./trades_Two_way_deadcapVOne.css";

interface Player {
  id: number;
  active_roster: string | boolean | null;
  position?: string;
  team?: string;
  g_league?: string;
  name?: string;
  year_one?: number | string;
  year_two?: number | string;
  year_three?: number | string;
  year_four?: number | string;
  year_five?: number | string;
}

interface SelectedPlayer extends Player {
  retentionByYear: Record<number, number>;
  finalSalariesByYear: Record<number, number>;
  originalSalariesRawByYear: Record<number, string>; // добавлено
}

interface Trades_Two_way_deadcapVOneProps {
  myTeam: string;
  theirTeam: string;
  onBack: () => void;
  onSubmit: (
    mySelected: SelectedPlayer[],
    theirSelected: SelectedPlayer[],
  ) => void;
}

// Форматирует число, добавляя пробелы как разделители тысяч
const formatWithSpaces = (
  value: number | string | null | undefined,
): string => {
  if (value === undefined || value === null) return "—";
  let num: number;
  if (typeof value === "string") {
    const cleaned = value.replace(/\s/g, "");
    const parsed = parseFloat(cleaned);
    if (isNaN(parsed)) return value;
    num = parsed;
  } else {
    num = value;
  }
  const parts = num.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return parts.join(".");
};

// Парсит строку, введённую пользователем (может содержать пробелы, запятые как разделители)
const parseFormattedNumber = (str: string): number => {
  const cleaned = str.replace(/\s/g, "").replace(",", ".");
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
};

// Извлекает число из любого значения (учитывая пробелы и префиксы типа "PO-15 000 000")
const extractSalaryNumber = (value: unknown): number => {
  if (value === undefined || value === null) return 0;
  if (typeof value === "number") return isNaN(value) ? 0 : value;
  if (typeof value === "boolean") return 0;
  if (typeof value === "string") {
    const withoutSpaces = value.replace(/\s/g, "");
    const match = withoutSpaces.match(/(\d+(?:\.\d+)?)/);
    if (match) {
      const num = parseFloat(match[1]);
      return isNaN(num) ? 0 : num;
    }
  }
  return 0;
};

// Возвращает оригинальное значение зарплаты для отображения (с префиксами/суффиксами)
const getRawSalaryForYear = (player: Player, yearIndex: number): string => {
  const key =
    `year_${["one", "two", "three", "four", "five"][yearIndex - 1]}` as keyof Player;
  const raw = player[key];
  if (raw === undefined || raw === null) return "—";
  return String(raw);
};

const getSalaryForYear = (player: Player, yearIndex: number): number => {
  const key =
    `year_${["one", "two", "three", "four", "five"][yearIndex - 1]}` as keyof Player;
  const raw = player[key];
  return extractSalaryNumber(raw);
};

const getNonEmptyYears = (
  player: Player,
): { index: number; salary: number; rawValue: string }[] => {
  const years = [];
  for (let i = 1; i <= 5; i++) {
    const salary = getSalaryForYear(player, i);
    if (salary > 0) {
      years.push({
        index: i,
        salary,
        rawValue: getRawSalaryForYear(player, i),
      });
    }
  }
  return years;
};

const computeFinalSalaries = (
  player: Player,
  retentionByYear: Record<number, number>,
): Record<number, number> => {
  const result: Record<number, number> = {};
  const years = getNonEmptyYears(player);
  for (const { index, salary } of years) {
    const retention = retentionByYear[index] || 0;
    result[index] = Math.max(0, salary - retention);
  }
  return result;
};

// Формирует итоговую зарплату, сохраняя префикс/суффикс исходной строки
const formatFinalSalaryWithPrefix = (
  rawValue: string,
  finalSalary: number,
): string => {
  if (finalSalary < 0) finalSalary = 0;
  const formattedNumber = formatWithSpaces(finalSalary);
  // Ищем первое число в строке (с учётом пробелов)
  const match = rawValue.match(/\d[\d\s]*\.?\d*/);
  if (!match) return formattedNumber; // если числа нет, просто число
  const originalNumberStr = match[0];
  // Заменяем найденное число на новое
  return rawValue.replace(originalNumberStr, formattedNumber);
};

const Trades_Two_way_deadcapVOne: React.FC<Trades_Two_way_deadcapVOneProps> = ({
  myTeam,
  theirTeam,
  onBack,
  onSubmit,
}) => {
  const [myPlayers, setMyPlayers] = useState<Player[]>([]);
  const [theirPlayers, setTheirPlayers] = useState<Player[]>([]);
  const [selectedMy, setSelectedMy] = useState<number[]>([]);
  const [selectedTheir, setSelectedTheir] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openSalaryId, setOpenSalaryId] = useState<number | null>(null);
  const [retentionMap, setRetentionMap] = useState<
    Record<number, Record<number, number>>
  >({});

  const fetchPlayersByTeam = async (teamName: string): Promise<Player[]> => {
    if (!teamName) return [];
    const { data, error } = await supabase
      .from("Players")
      .select("*")
      .eq("team", teamName);
    if (error) throw new Error(`Ошибка загрузки: ${error.message}`);
    return data || [];
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [my, their] = await Promise.all([
          fetchPlayersByTeam(myTeam),
          fetchPlayersByTeam(theirTeam),
        ]);
        setMyPlayers(my);
        setTheirPlayers(their);
        setSelectedMy([]);
        setSelectedTheir([]);
        setRetentionMap({});
        setOpenSalaryId(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (myTeam && theirTeam) load();
  }, [myTeam, theirTeam]);

  const getPlayerName = (p: Player): string =>
    String(p.active_roster ?? `ID ${p.id}`);

  const getSalaryInfo = (p: Player): string => {
    const years = [
      { label: "Год 1", value: p.year_one },
      { label: "Год 2", value: p.year_two },
      { label: "Год 3", value: p.year_three },
      { label: "Год 4", value: p.year_four },
      { label: "Год 5", value: p.year_five },
    ];
    const parts = years.map(({ label, value }) => {
      if (value === undefined || value === null) return `${label}: —`;
      return `${label}: ${String(value)}`;
    });
    return parts.join(" | ");
  };

  const toggleSalary = (id: number) => {
    setOpenSalaryId((prev) => (prev === id ? null : id));
  };

  const toggle = (id: number, type: "my" | "their") => {
    if (type === "my") {
      const isSelected = selectedMy.includes(id);
      if (!isSelected) {
        setRetentionMap((prev) => ({ ...prev, [id]: {} }));
      } else {
        const newMap = { ...retentionMap };
        delete newMap[id];
        setRetentionMap(newMap);
      }
      setSelectedMy((prev) =>
        prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
      );
    } else {
      const isSelected = selectedTheir.includes(id);
      if (!isSelected) {
        setRetentionMap((prev) => ({ ...prev, [id]: {} }));
      } else {
        const newMap = { ...retentionMap };
        delete newMap[id];
        setRetentionMap(newMap);
      }
      setSelectedTheir((prev) =>
        prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
      );
    }
  };

  const handleRetentionChange = (
    playerId: number,
    yearIndex: number,
    value: number,
  ) => {
    const num = Math.max(0, value);
    setRetentionMap((prev) => ({
      ...prev,
      [playerId]: {
        ...(prev[playerId] || {}),
        [yearIndex]: num,
      },
    }));
  };

  const handleSubmit = () => {
    const buildSelected = (
      players: Player[],
      selectedIds: number[],
    ): SelectedPlayer[] => {
      return players
        .filter((p) => selectedIds.includes(p.id))
        .map((p) => {
          const retentionByYear = retentionMap[p.id] || {};
          const finalSalariesByYear = computeFinalSalaries(p, retentionByYear);
          // Собираем сырые строки зарплат
          const originalSalariesRawByYear: Record<number, string> = {};
          const nonEmptyYears = getNonEmptyYears(p);
          for (const { index, rawValue } of nonEmptyYears) {
            originalSalariesRawByYear[index] = rawValue;
          }
          return {
            ...p,
            retentionByYear,
            finalSalariesByYear,
            originalSalariesRawByYear,
          };
        });
    };

    const mySelected = buildSelected(myPlayers, selectedMy);
    const theirSelected = buildSelected(theirPlayers, selectedTheir);
    onSubmit(mySelected, theirSelected);
  };

  const renderPlayerList = (
    players: Player[],
    selectedIds: number[],
    type: "my" | "their",
  ) => (
    <ul className="Trades_Two_way_deadcapVOne-player-list">
      {players.map((p) => {
        const isSelected = selectedIds.includes(p.id);
        const retentionByYear = retentionMap[p.id] || {};
        const nonEmptyYears = getNonEmptyYears(p);

        return (
          <li key={p.id} className="Trades_Two_way_deadcapVOne-player-item">
            <div className="Trades_Two_way_deadcapVOne-player-header">
              <label className="Trades_Two_way_deadcapVOne-checkbox-label">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggle(p.id, type)}
                  className="Trades_Two_way_deadcapVOne-checkbox"
                />
                {getPlayerName(p)}
              </label>
              <button
                type="button"
                onClick={() => toggleSalary(p.id)}
                className="Trades_Two_way_deadcapVOne-info-button"
              >
                ?
              </button>
            </div>

            {openSalaryId === p.id && (
              <div className="Trades_Two_way_deadcapVOne-salary-popup">
                {getSalaryInfo(p)}
              </div>
            )}

            {isSelected && (
              <div className="Trades_Two_way_deadcapVOne-retention-section">
                {nonEmptyYears.length === 0 ? (
                  <div className="Trades_Two_way_deadcapVOne-no-salary">
                    Нет данных о зарплате ни за один год
                  </div>
                ) : (
                  nonEmptyYears.map(({ index, salary, rawValue }) => {
                    const retention = retentionByYear[index] || 0;
                    const finalSalary = Math.max(0, salary - retention);
                    const displayValue =
                      retention === 0 ? "" : formatWithSpaces(retention);
                    const finalSalaryDisplay = formatFinalSalaryWithPrefix(
                      rawValue,
                      finalSalary,
                    );

                    return (
                      <div
                        key={index}
                        className="Trades_Two_way_deadcapVOne-year-block"
                      >
                        <div className="Trades_Two_way_deadcapVOne-year-title">
                          Год {index}
                        </div>
                        <div className="Trades_Two_way_deadcapVOne-year-details">
                          <span>
                            Исходная зарплата: <strong>{rawValue}</strong>
                          </span>
                          <label className="Trades_Two_way_deadcapVOne-retention-label">
                            Удержание:
                            <input
                              type="text"
                              placeholder="0"
                              value={displayValue}
                              onChange={(e) => {
                                const raw = e.target.value;
                                if (raw.trim() === "") {
                                  handleRetentionChange(p.id, index, 0);
                                  return;
                                }
                                const num = parseFormattedNumber(raw);
                                handleRetentionChange(p.id, index, num);
                              }}
                              className="Trades_Two_way_deadcapVOne-retention-input"
                            />
                          </label>
                          <span>
                            Итоговая зарплата:{" "}
                            <strong
                              className={
                                finalSalary < 0
                                  ? "Trades_Two_way_deadcapVOne-negative-salary"
                                  : "Trades_Two_way_deadcapVOne-positive-salary"
                              }
                            >
                              {finalSalaryDisplay}
                            </strong>
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );

  if (loading)
    return (
      <div className="Trades_Two_way_deadcapVOne-loading">
        Загрузка игроков...
      </div>
    );
  if (error)
    return (
      <div className="Trades_Two_way_deadcapVOne-error">Ошибка: {error}</div>
    );

  return (
    <div className="Trades_Two_way_deadcapVOne-container">
      <div className="Trades_Two_way_deadcapVOne-header">
        <h4>Шаг: Dead Cap (версия VOne)</h4>
        <p>
          <strong>Моя команда:</strong> {myTeam}
        </p>
        <p>
          <strong>Команда соперника:</strong> {theirTeam}
        </p>
      </div>

      <div className="Trades_Two_way_deadcapVOne-columns">
        <div className="Trades_Two_way_deadcapVOne-column">
          <strong className="Trades_Two_way_deadcapVOne-column-title">
            Мои игроки ({myPlayers.length})
          </strong>
          {renderPlayerList(myPlayers, selectedMy, "my")}
        </div>
        <div className="Trades_Two_way_deadcapVOne-column">
          <strong className="Trades_Two_way_deadcapVOne-column-title">
            Игроки соперника ({theirPlayers.length})
          </strong>
          {renderPlayerList(theirPlayers, selectedTheir, "their")}
        </div>
      </div>

      <div className="Trades_Two_way_deadcapVOne-actions">
        <button
          onClick={onBack}
          className="Trades_Two_way_deadcapVOne-button Trades_Two_way_deadcapVOne-button-back"
        >
          Назад
        </button>
        <button
          onClick={handleSubmit}
          className="Trades_Two_way_deadcapVOne-button Trades_Two_way_deadcapVOne-button-next"
        >
          Далее
        </button>
      </div>
    </div>
  );
};

export default Trades_Two_way_deadcapVOne;
