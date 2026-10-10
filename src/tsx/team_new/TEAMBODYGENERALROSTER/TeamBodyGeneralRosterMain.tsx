// import React, { useState, useEffect, useMemo, useRef } from "react";
// import { supabase } from "../../../Supabase";
// import "./teamBodyGeneralRosterMain.css";

// interface Player {
//   id?: number;
//   active_roster: string;
//   position: string;
//   pos_elig: string;
//   age: number;
//   year_one?: string | null;
//   year_two?: string | null;
//   year_three?: string | null;
//   year_four?: string | null;
//   year_five?: string | null;
//   opt: string | null;
//   status: string | null;
//   exp: string | null;
//   bird: string | null;
//   rating: number | null;
//   retention: string | null;
//   g_league?: string | null;
//   dc_year_one?: string | null;
//   dc_year_two?: string | null;
//   dc_year_three?: string | null;
//   dc_year_four?: string | null;
//   dc_year_five?: string | null;
//   dead_cap_team?: string | null;
// }

// interface TeamRosterProps {
//   team: string;
// }

// // Парсим денежное значение. Разделителями могут быть пробелы, запятые, точки.
// // Возвращаем целое число.
// const parseMoney = (raw: string | number | null | undefined): number => {
//   if (raw === null || raw === undefined || raw === "") return 0;
//   const cleaned = String(raw)
//     .replace(/[^\d\s.,-]/g, "") // оставляем только цифры, разделители и минус
//     .replace(/[\s.,]/g, ""); // убираем разделители
//   if (!cleaned || cleaned === "-") return 0;
//   const num = parseInt(cleaned, 10);
//   return isNaN(num) ? 0 : num;
// };

// // Форматирование для отображения — единая локаль (en-US).
// const formatYearValue = (value: string | number | null | undefined): string => {
//   if (value === null || value === undefined || value === "") return "";
//   const num = parseMoney(value);
//   if (num === 0 && String(value).trim() !== "0") {
//     // если не удалось распарсить — возвращаем как есть
//     const str = String(value).trim();
//     if (!/\d/.test(str)) return str;
//   }
//   return num.toLocaleString("en-US");
// };

// const TeamRoster: React.FC<TeamRosterProps> = ({ team }) => {
//   const [mainPlayers, setMainPlayers] = useState<Player[]>([]);
//   const [gLeaguePlayers, setGLeaguePlayers] = useState<Player[]>([]);
//   const [deadCapPlayers, setDeadCapPlayers] = useState<Player[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [savingCapHit, setSavingCapHit] = useState<boolean>(false);
//   const [salaryCap, setSalaryCap] = useState<number | null>(null);

//   const lastSavedCapHit = useRef<number | null>(null);
//   const lastSavedCapSpace = useRef<number | null>(null);
//   const lastSavedDeadCap = useRef<number | null>(null);

//   useEffect(() => {
//     const fetchSalaryCap = async () => {
//       if (!team) return;
//       try {
//         const { data, error } = await supabase
//           .from("Head")
//           .select("salary_cap")
//           .eq("team_name", team)
//           .maybeSingle();

//         if (error) throw error;
//         if (data && data.salary_cap !== null && data.salary_cap !== undefined) {
//           setSalaryCap(parseMoney(data.salary_cap));
//         } else {
//           setSalaryCap(null);
//         }
//       } catch (err) {
//         console.error("Ошибка загрузки salary_cap:", err);
//         setSalaryCap(null);
//       }
//     };

//     fetchSalaryCap();
//   }, [team]);

//   useEffect(() => {
//     const fetchPlayers = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const { data: teamPlayers, error: teamError } = await supabase
//           .from("Players")
//           .select(
//             "id, active_roster, position, pos_elig, age, year_one, year_two, year_three, year_four, year_five, opt, status, exp, bird, rating, retention, g_league",
//           )
//           .eq("team", team);

//         if (teamError) throw teamError;

//         const { data: specialPlayer, error: specialError } = await supabase
//           .from("Players")
//           .select(
//             "id, active_roster, position, pos_elig, age, year_one, year_two, year_three, year_four, year_five, opt, status, exp, bird, rating, retention, g_league",
//           )
//           .eq("id", 1)
//           .maybeSingle();

//         if (specialError) throw specialError;

//         let combinedMainPlayers = teamPlayers || [];

//         if (specialPlayer) {
//           const alreadyInTeam = combinedMainPlayers.some(
//             (p) => p.id === specialPlayer.id,
//           );
//           if (!alreadyInTeam) {
//             combinedMainPlayers = [specialPlayer, ...combinedMainPlayers];
//           } else {
//             const filtered = combinedMainPlayers.filter(
//               (p) => p.id !== specialPlayer.id,
//             );
//             combinedMainPlayers = [specialPlayer, ...filtered];
//           }
//         }

//         setMainPlayers(combinedMainPlayers);

//         const { data: gLeagueData, error: gLeagueError } = await supabase
//           .from("Players")
//           .select(
//             "id, active_roster, position, pos_elig, age, year_one, year_two, year_three, year_four, year_five, opt, status, exp, bird, rating, retention, g_league",
//           )
//           .eq("g_league", team);

//         if (gLeagueError) throw gLeagueError;

//         setGLeaguePlayers(gLeagueData || []);

//         const { data: deadCapData, error: deadCapError } = await supabase
//           .from("Players")
//           .select(
//             "id, active_roster, position, pos_elig, age, dc_year_one, dc_year_two, dc_year_three, dc_year_four, dc_year_five, opt, status, exp, bird, rating, retention",
//           )
//           .eq("dead_cap_team", team);

//         if (deadCapError) throw deadCapError;

//         setDeadCapPlayers(deadCapData || []);
//       } catch (err: any) {
//         console.error("Ошибка загрузки игроков:", err);
//         setError(err.message || "Неизвестная ошибка");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (team) {
//       fetchPlayers();
//     }
//   }, [team]);

//   const sortedMainPlayers = useMemo(() => {
//     return [...mainPlayers].sort((a, b) => {
//       if (a.id === 1 && b.id !== 1) return -1;
//       if (b.id === 1 && a.id !== 1) return 1;
//       if (a.id === 1 && b.id === 1) return 0;

//       const aValue = parseMoney(a.year_one);
//       const bValue = parseMoney(b.year_one);
//       return bValue - aValue;
//     });
//   }, [mainPlayers]);

//   const sortedGLeaguePlayers = useMemo(() => {
//     return [...gLeaguePlayers].sort((a, b) => (a.id ?? 0) - (b.id ?? 0));
//   }, [gLeaguePlayers]);

//   const sortedDeadCapPlayers = useMemo(() => {
//     return [...deadCapPlayers].sort((a, b) => (a.id ?? 0) - (b.id ?? 0));
//   }, [deadCapPlayers]);

//   const mainYearSums = useMemo(() => {
//     const sums = { y1: 0, y2: 0, y3: 0, y4: 0, y5: 0 };
//     for (const p of sortedMainPlayers) {
//       if (p.id === 1) continue;
//       sums.y1 += parseMoney(p.year_one);
//       sums.y2 += parseMoney(p.year_two);
//       sums.y3 += parseMoney(p.year_three);
//       sums.y4 += parseMoney(p.year_four);
//       sums.y5 += parseMoney(p.year_five);
//     }
//     return sums;
//   }, [sortedMainPlayers]);

//   const deadCapYearSums = useMemo(() => {
//     const sums = { y1: 0, y2: 0, y3: 0, y4: 0, y5: 0 };
//     for (const p of sortedDeadCapPlayers) {
//       if (p.id === 1) continue;
//       sums.y1 += parseMoney(p.dc_year_one);
//       sums.y2 += parseMoney(p.dc_year_two);
//       sums.y3 += parseMoney(p.dc_year_three);
//       sums.y4 += parseMoney(p.dc_year_four);
//       sums.y5 += parseMoney(p.dc_year_five);
//     }
//     return sums;
//   }, [sortedDeadCapPlayers]);

//   const totalYearSums = useMemo(
//     () => ({
//       y1: mainYearSums.y1 + deadCapYearSums.y1,
//       y2: mainYearSums.y2 + deadCapYearSums.y2,
//       y3: mainYearSums.y3 + deadCapYearSums.y3,
//       y4: mainYearSums.y4 + deadCapYearSums.y4,
//       y5: mainYearSums.y5 + deadCapYearSums.y5,
//     }),
//     [mainYearSums, deadCapYearSums],
//   );

//   const capSpace = useMemo(() => {
//     if (salaryCap === null) return null;
//     return salaryCap - totalYearSums.y1;
//   }, [salaryCap, totalYearSums.y1]);

//   useEffect(() => {
//     const saveCapData = async () => {
//       if (loading) return;
//       if (salaryCap === null) return;
//       if (!team) return;

//       const currentCapHit = totalYearSums.y1;
//       const currentCapSpace = capSpace;
//       const currentDeadCap = deadCapYearSums.y1;

//       const capHitChanged = lastSavedCapHit.current !== currentCapHit;
//       const capSpaceChanged = lastSavedCapSpace.current !== currentCapSpace;
//       const deadCapChanged = lastSavedDeadCap.current !== currentDeadCap;

//       if (!capHitChanged && !capSpaceChanged && !deadCapChanged) {
//         return;
//       }

//       setSavingCapHit(true);
//       try {
//         const { data: existing, error: selectError } = await supabase
//           .from("Head")
//           .select("team_name")
//           .eq("team_name", team)
//           .maybeSingle();

//         if (selectError) throw selectError;

//         if (existing) {
//           const { error: updateError } = await supabase
//             .from("Head")
//             .update({
//               cap_hit: currentCapHit,
//               cap_space: currentCapSpace,
//               dead_cap: currentDeadCap,
//             })
//             .eq("team_name", team);

//           if (updateError) throw updateError;
//         } else {
//           const { error: insertError } = await supabase.from("Head").insert({
//             team_name: team,
//             cap_hit: currentCapHit,
//             cap_space: currentCapSpace,
//             dead_cap: currentDeadCap,
//           });

//           if (insertError) throw insertError;
//         }

//         console.log(
//           `Данные для команды ${team} сохранены: cap_hit=${currentCapHit}, cap_space=${currentCapSpace}, dead_cap=${currentDeadCap}`,
//         );
//         lastSavedCapHit.current = currentCapHit;
//         lastSavedCapSpace.current = currentCapSpace;
//         lastSavedDeadCap.current = currentDeadCap;
//       } catch (err: any) {
//         console.error("Ошибка сохранения cap данных:", err);
//         setError(err.message || "Неизвестная ошибка при сохранении");
//       } finally {
//         setSavingCapHit(false);
//       }
//     };

//     saveCapData();
//   }, [
//     team,
//     loading,
//     salaryCap,
//     totalYearSums.y1,
//     capSpace,
//     deadCapYearSums.y1,
//   ]);

//   if (loading)
//     return (
//       <div className="general-roster">
//         <div className="general-roster__content">
//           <div className="general-roster__loading">Загрузка состава...</div>
//         </div>
//       </div>
//     );
//   if (error)
//     return (
//       <div className="general-roster">
//         <div className="general-roster__content">
//           <div className="general-roster__error">Ошибка: {error}</div>
//         </div>
//       </div>
//     );
//   if (!mainPlayers.length && !gLeaguePlayers.length && !deadCapPlayers.length)
//     return (
//       <div className="general-roster">
//         <div className="general-roster__content">
//           <div className="general-roster__empty">
//             Нет игроков в команде, G-лиге и dead cap
//           </div>
//         </div>
//       </div>
//     );

//   let mainRowNumber = 0;
//   let deadCapRowNumber = 0;
//   let gLeagueRowNumber = 0;

//   const capSpaceRow = (
//     <tbody className="general-roster__total-row general-roster__cap-space-row">
//       <tr>
//         <td colSpan={7} className="general-roster__total-label">
//           Свободное пространство под потолком зарплат
//         </td>
//         <td className="general-roster__numeric">
//           {capSpace !== null ? formatYearValue(capSpace) : "—"}
//         </td>
//         <td className="general-roster__numeric">—</td>
//         <td className="general-roster__numeric">—</td>
//         <td className="general-roster__numeric">—</td>
//         <td className="general-roster__numeric">—</td>
//         <td colSpan={4}> </td>
//       </tr>
//     </tbody>
//   );

//   return (
//     <div className="general-roster">
//       <div className="general-roster__content">
//         <h2 className="general-roster__title">Состав команды: {team}</h2>
//         {savingCapHit && (
//           <div className="general-roster__saving">Сохранение cap hit...</div>
//         )}
//         <div className="general-roster__table-wrapper">
//           <table className="general-roster__table">
//             {/* Основной состав */}
//             {mainPlayers.length > 0 && (
//               <>
//                 <tbody>
//                   {sortedMainPlayers.map((player) => {
//                     const isSpecial = player.id === 1;
//                     const displayNumber = !isSpecial ? ++mainRowNumber : "";
//                     return (
//                       <tr
//                         key={
//                           player.id ||
//                           `${player.active_roster}-${player.position}`
//                         }
//                         className={
//                           isSpecial ? "general-roster__special-row" : ""
//                         }
//                       >
//                         <td className="general-roster__row-number">
//                           {displayNumber}
//                         </td>
//                         <td>{player.active_roster}</td>
//                         <td>{player.position}</td>
//                         <td>{player.pos_elig}</td>
//                         <td>{player.age}</td>
//                         <td>{player.opt}</td>
//                         <td>{player.status}</td>

//                         <td className="general-roster__numeric">
//                           {formatYearValue(player.year_one)}
//                         </td>
//                         <td className="general-roster__numeric">
//                           {formatYearValue(player.year_two)}
//                         </td>
//                         <td className="general-roster__numeric">
//                           {formatYearValue(player.year_three)}
//                         </td>
//                         <td className="general-roster__numeric">
//                           {formatYearValue(player.year_four)}
//                         </td>
//                         <td className="general-roster__numeric">
//                           {formatYearValue(player.year_five)}
//                         </td>
//                         <td>{player.exp}</td>
//                         <td>{player.bird}</td>
//                         <td className="general-roster__numeric">
//                           {player.rating}
//                         </td>
//                         <td>{player.retention}</td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//                 <tbody className="general-roster__total-row">
//                   <tr>
//                     <td colSpan={7} className="general-roster__total-label">
//                       Итого по основному составу
//                     </td>
//                     <td className="general-roster__numeric">
//                       {formatYearValue(mainYearSums.y1)}
//                     </td>
//                     <td className="general-roster__numeric">
//                       {formatYearValue(mainYearSums.y2)}
//                     </td>
//                     <td className="general-roster__numeric">
//                       {formatYearValue(mainYearSums.y3)}
//                     </td>
//                     <td className="general-roster__numeric">
//                       {formatYearValue(mainYearSums.y4)}
//                     </td>
//                     <td className="general-roster__numeric">
//                       {formatYearValue(mainYearSums.y5)}
//                     </td>
//                     <td colSpan={4}> </td>
//                   </tr>
//                 </tbody>
//                 {deadCapPlayers.length === 0 && capSpaceRow}
//               </>
//             )}

//             {/* Dead cap секция */}
//             {deadCapPlayers.length > 0 && (
//               <>
//                 <tbody className="general-roster__deadcap-separator">
//                   <tr>
//                     <td colSpan={16} className="general-roster__subtitle-cell">
//                       Dead cap
//                     </td>
//                   </tr>
//                 </tbody>
//                 <tbody>
//                   {sortedDeadCapPlayers.map((player) => {
//                     const displayNumber = ++deadCapRowNumber;
//                     return (
//                       <tr
//                         key={
//                           player.id ||
//                           `${player.active_roster}-${player.position}-deadcap`
//                         }
//                       >
//                         <td className="general-roster__row-number">
//                           {displayNumber}
//                         </td>
//                         <td>{player.active_roster}</td>
//                         <td>{player.position}</td>
//                         <td>{player.pos_elig}</td>
//                         <td>{player.age}</td>
//                         <td>{player.opt}</td>
//                         <td>{player.status}</td>

//                         <td className="general-roster__numeric">
//                           {formatYearValue(player.dc_year_one)}
//                         </td>
//                         <td className="general-roster__numeric">
//                           {formatYearValue(player.dc_year_two)}
//                         </td>
//                         <td className="general-roster__numeric">
//                           {formatYearValue(player.dc_year_three)}
//                         </td>
//                         <td className="general-roster__numeric">
//                           {formatYearValue(player.dc_year_four)}
//                         </td>
//                         <td className="general-roster__numeric">
//                           {formatYearValue(player.dc_year_five)}
//                         </td>
//                         <td>{player.exp}</td>
//                         <td>{player.bird}</td>
//                         <td className="general-roster__numeric">
//                           {player.rating}
//                         </td>
//                         <td>{player.retention}</td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//                 <tbody className="general-roster__total-row">
//                   <tr>
//                     <td colSpan={7} className="general-roster__total-label">
//                       Итого по dead cap
//                     </td>
//                     <td className="general-roster__numeric">
//                       {formatYearValue(deadCapYearSums.y1)}
//                     </td>
//                     <td className="general-roster__numeric">
//                       {formatYearValue(deadCapYearSums.y2)}
//                     </td>
//                     <td className="general-roster__numeric">
//                       {formatYearValue(deadCapYearSums.y3)}
//                     </td>
//                     <td className="general-roster__numeric">
//                       {formatYearValue(deadCapYearSums.y4)}
//                     </td>
//                     <td className="general-roster__numeric">
//                       {formatYearValue(deadCapYearSums.y5)}
//                     </td>
//                     <td colSpan={4}> </td>
//                   </tr>
//                 </tbody>
//                 <tbody className="general-roster__total-row general-roster__grand-total">
//                   <tr>
//                     <td colSpan={7} className="general-roster__total-label">
//                       Общая сумма (основной + dead cap)
//                     </td>
//                     <td className="general-roster__numeric">
//                       {formatYearValue(totalYearSums.y1)}
//                     </td>
//                     <td className="general-roster__numeric">
//                       {formatYearValue(totalYearSums.y2)}
//                     </td>
//                     <td className="general-roster__numeric">
//                       {formatYearValue(totalYearSums.y3)}
//                     </td>
//                     <td className="general-roster__numeric">
//                       {formatYearValue(totalYearSums.y4)}
//                     </td>
//                     <td className="general-roster__numeric">
//                       {formatYearValue(totalYearSums.y5)}
//                     </td>
//                     <td colSpan={4}> </td>
//                   </tr>
//                 </tbody>
//                 {capSpaceRow}
//               </>
//             )}

//             {/* Разделитель: заголовок G-лиги */}
//             {gLeaguePlayers.length > 0 && (
//               <tbody className="general-roster__gleague-separator">
//                 <tr>
//                   <td colSpan={16} className="general-roster__subtitle-cell">
//                     G-league roster
//                   </td>
//                 </tr>
//               </tbody>
//             )}

//             {/* Игроки G-лиги */}
//             {gLeaguePlayers.length > 0 && (
//               <tbody>
//                 {sortedGLeaguePlayers.map((player) => {
//                   const displayNumber = ++gLeagueRowNumber;
//                   return (
//                     <tr
//                       key={
//                         player.id ||
//                         `${player.active_roster}-${player.position}`
//                       }
//                     >
//                       <td className="general-roster__row-number">
//                         {displayNumber}
//                       </td>
//                       <td>{player.active_roster}</td>
//                       <td>{player.position}</td>
//                       <td>{player.pos_elig}</td>
//                       <td>{player.age}</td>
//                       <td>{player.opt}</td>
//                       <td>{player.status}</td>

//                       <td className="general-roster__numeric">
//                         {formatYearValue(player.year_one)}
//                       </td>
//                       <td className="general-roster__numeric">
//                         {formatYearValue(player.year_two)}
//                       </td>
//                       <td className="general-roster__numeric">
//                         {formatYearValue(player.year_three)}
//                       </td>
//                       <td className="general-roster__numeric">
//                         {formatYearValue(player.year_four)}
//                       </td>
//                       <td className="general-roster__numeric">
//                         {formatYearValue(player.year_five)}
//                       </td>
//                       <td>{player.exp}</td>
//                       <td>{player.bird}</td>
//                       <td className="general-roster__numeric">
//                         {player.rating}
//                       </td>
//                       <td>{player.retention}</td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             )}
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TeamRoster;

import React, { useState, useEffect, useMemo, useRef } from "react";
import { supabase } from "../../../Supabase";
import {
  parseMoney,
  formatValueWithSpaces,
} from "../../agentControlCenter/playerConsole/playerComponents/utils/formatting";
import "./teamBodyGeneralRosterMain.css";

interface Player {
  id?: number;
  active_roster: string;
  position: string;
  pos_elig: string;
  age: number;
  year_one?: string | null;
  year_two?: string | null;
  year_three?: string | null;
  year_four?: string | null;
  year_five?: string | null;
  opt: string | null;
  status: string | null;
  exp: string | null;
  bird: string | null;
  rating: number | null;
  retention: string | null;
  g_league?: string | null;
  dc_year_one?: string | null;
  dc_year_two?: string | null;
  dc_year_three?: string | null;
  dc_year_four?: string | null;
  dc_year_five?: string | null;
  dead_cap_team?: string | null;
}

interface TeamRosterProps {
  team: string;
}

const TeamRoster: React.FC<TeamRosterProps> = ({ team }) => {
  const [mainPlayers, setMainPlayers] = useState<Player[]>([]);
  const [gLeaguePlayers, setGLeaguePlayers] = useState<Player[]>([]);
  const [deadCapPlayers, setDeadCapPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [savingCapHit, setSavingCapHit] = useState<boolean>(false);
  const [salaryCap, setSalaryCap] = useState<number | null>(null);

  const lastSavedCapHit = useRef<number | null>(null);
  const lastSavedCapSpace = useRef<number | null>(null);
  const lastSavedDeadCap = useRef<number | null>(null);

  useEffect(() => {
    const fetchSalaryCap = async () => {
      if (!team) return;
      try {
        const { data, error } = await supabase
          .from("Head")
          .select("salary_cap")
          .eq("team_name", team)
          .maybeSingle();

        if (error) throw error;
        if (data && data.salary_cap !== null && data.salary_cap !== undefined) {
          setSalaryCap(parseMoney(data.salary_cap));
        } else {
          setSalaryCap(null);
        }
      } catch (err) {
        console.error("Ошибка загрузки salary_cap:", err);
        setSalaryCap(null);
      }
    };

    fetchSalaryCap();
  }, [team]);

  useEffect(() => {
    const fetchPlayers = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: teamPlayers, error: teamError } = await supabase
          .from("Players")
          .select(
            "id, active_roster, position, pos_elig, age, year_one, year_two, year_three, year_four, year_five, opt, status, exp, bird, rating, retention, g_league",
          )
          .eq("team", team);

        if (teamError) throw teamError;

        const { data: specialPlayer, error: specialError } = await supabase
          .from("Players")
          .select(
            "id, active_roster, position, pos_elig, age, year_one, year_two, year_three, year_four, year_five, opt, status, exp, bird, rating, retention, g_league",
          )
          .eq("id", 1)
          .maybeSingle();

        if (specialError) throw specialError;

        let combinedMainPlayers = teamPlayers || [];

        if (specialPlayer) {
          const alreadyInTeam = combinedMainPlayers.some(
            (p) => p.id === specialPlayer.id,
          );
          if (!alreadyInTeam) {
            combinedMainPlayers = [specialPlayer, ...combinedMainPlayers];
          } else {
            const filtered = combinedMainPlayers.filter(
              (p) => p.id !== specialPlayer.id,
            );
            combinedMainPlayers = [specialPlayer, ...filtered];
          }
        }

        setMainPlayers(combinedMainPlayers);

        const { data: gLeagueData, error: gLeagueError } = await supabase
          .from("Players")
          .select(
            "id, active_roster, position, pos_elig, age, year_one, year_two, year_three, year_four, year_five, opt, status, exp, bird, rating, retention, g_league",
          )
          .eq("g_league", team);

        if (gLeagueError) throw gLeagueError;

        setGLeaguePlayers(gLeagueData || []);

        const { data: deadCapData, error: deadCapError } = await supabase
          .from("Players")
          .select(
            "id, active_roster, position, pos_elig, age, dc_year_one, dc_year_two, dc_year_three, dc_year_four, dc_year_five, opt, status, exp, bird, rating, retention",
          )
          .eq("dead_cap_team", team);

        if (deadCapError) throw deadCapError;

        setDeadCapPlayers(deadCapData || []);
      } catch (err: any) {
        console.error("Ошибка загрузки игроков:", err);
        setError(err.message || "Неизвестная ошибка");
      } finally {
        setLoading(false);
      }
    };

    if (team) {
      fetchPlayers();
    }
  }, [team]);

  const sortedMainPlayers = useMemo(() => {
    return [...mainPlayers].sort((a, b) => {
      if (a.id === 1 && b.id !== 1) return -1;
      if (b.id === 1 && a.id !== 1) return 1;
      if (a.id === 1 && b.id === 1) return 0;

      const aValue = parseMoney(a.year_one);
      const bValue = parseMoney(b.year_one);
      return bValue - aValue;
    });
  }, [mainPlayers]);

  const sortedGLeaguePlayers = useMemo(() => {
    return [...gLeaguePlayers].sort((a, b) => (a.id ?? 0) - (b.id ?? 0));
  }, [gLeaguePlayers]);

  const sortedDeadCapPlayers = useMemo(() => {
    return [...deadCapPlayers].sort((a, b) => (a.id ?? 0) - (b.id ?? 0));
  }, [deadCapPlayers]);

  const mainYearSums = useMemo(() => {
    const sums = { y1: 0, y2: 0, y3: 0, y4: 0, y5: 0 };
    for (const p of sortedMainPlayers) {
      if (p.id === 1) continue;
      sums.y1 += parseMoney(p.year_one);
      sums.y2 += parseMoney(p.year_two);
      sums.y3 += parseMoney(p.year_three);
      sums.y4 += parseMoney(p.year_four);
      sums.y5 += parseMoney(p.year_five);
    }
    return sums;
  }, [sortedMainPlayers]);

  const deadCapYearSums = useMemo(() => {
    const sums = { y1: 0, y2: 0, y3: 0, y4: 0, y5: 0 };
    for (const p of sortedDeadCapPlayers) {
      if (p.id === 1) continue;
      sums.y1 += parseMoney(p.dc_year_one);
      sums.y2 += parseMoney(p.dc_year_two);
      sums.y3 += parseMoney(p.dc_year_three);
      sums.y4 += parseMoney(p.dc_year_four);
      sums.y5 += parseMoney(p.dc_year_five);
    }
    return sums;
  }, [sortedDeadCapPlayers]);

  const totalYearSums = useMemo(
    () => ({
      y1: mainYearSums.y1 + deadCapYearSums.y1,
      y2: mainYearSums.y2 + deadCapYearSums.y2,
      y3: mainYearSums.y3 + deadCapYearSums.y3,
      y4: mainYearSums.y4 + deadCapYearSums.y4,
      y5: mainYearSums.y5 + deadCapYearSums.y5,
    }),
    [mainYearSums, deadCapYearSums],
  );

  const capSpace = useMemo(() => {
    if (salaryCap === null) return null;
    return salaryCap - totalYearSums.y1;
  }, [salaryCap, totalYearSums.y1]);

  useEffect(() => {
    const saveCapData = async () => {
      if (loading) return;
      if (salaryCap === null) return;
      if (!team) return;

      const currentCapHit = totalYearSums.y1;
      const currentCapSpace = capSpace;
      const currentDeadCap = deadCapYearSums.y1;

      const capHitChanged = lastSavedCapHit.current !== currentCapHit;
      const capSpaceChanged = lastSavedCapSpace.current !== currentCapSpace;
      const deadCapChanged = lastSavedDeadCap.current !== currentDeadCap;

      if (!capHitChanged && !capSpaceChanged && !deadCapChanged) {
        return;
      }

      setSavingCapHit(true);
      try {
        const { data: existing, error: selectError } = await supabase
          .from("Head")
          .select("team_name")
          .eq("team_name", team)
          .maybeSingle();

        if (selectError) throw selectError;

        if (existing) {
          const { error: updateError } = await supabase
            .from("Head")
            .update({
              cap_hit: currentCapHit,
              cap_space: currentCapSpace,
              dead_cap: currentDeadCap,
            })
            .eq("team_name", team);

          if (updateError) throw updateError;
        } else {
          const { error: insertError } = await supabase.from("Head").insert({
            team_name: team,
            cap_hit: currentCapHit,
            cap_space: currentCapSpace,
            dead_cap: currentDeadCap,
          });

          if (insertError) throw insertError;
        }

        console.log(
          `Данные для команды ${team} сохранены: cap_hit=${currentCapHit}, cap_space=${currentCapSpace}, dead_cap=${currentDeadCap}`,
        );
        lastSavedCapHit.current = currentCapHit;
        lastSavedCapSpace.current = currentCapSpace;
        lastSavedDeadCap.current = currentDeadCap;
      } catch (err: any) {
        console.error("Ошибка сохранения cap данных:", err);
        setError(err.message || "Неизвестная ошибка при сохранении");
      } finally {
        setSavingCapHit(false);
      }
    };

    saveCapData();
  }, [
    team,
    loading,
    salaryCap,
    totalYearSums.y1,
    capSpace,
    deadCapYearSums.y1,
  ]);

  if (loading)
    return (
      <div className="general-roster">
        <div className="general-roster__content">
          <div className="general-roster__loading">Загрузка состава...</div>
        </div>
      </div>
    );
  if (error)
    return (
      <div className="general-roster">
        <div className="general-roster__content">
          <div className="general-roster__error">Ошибка: {error}</div>
        </div>
      </div>
    );
  if (!mainPlayers.length && !gLeaguePlayers.length && !deadCapPlayers.length)
    return (
      <div className="general-roster">
        <div className="general-roster__content">
          <div className="general-roster__empty">
            Нет игроков в команде, G-лиге и dead cap
          </div>
        </div>
      </div>
    );

  let mainRowNumber = 0;
  let deadCapRowNumber = 0;
  let gLeagueRowNumber = 0;

  const capSpaceRow = (
    <tbody className="general-roster__total-row general-roster__cap-space-row">
      <tr>
        <td colSpan={7} className="general-roster__total-label">
          Свободное пространство под потолком зарплат
        </td>
        <td className="general-roster__numeric">
          {capSpace !== null ? formatValueWithSpaces(capSpace) : "—"}
        </td>
        <td className="general-roster__numeric">—</td>
        <td className="general-roster__numeric">—</td>
        <td className="general-roster__numeric">—</td>
        <td className="general-roster__numeric">—</td>
        <td colSpan={4}> </td>
      </tr>
    </tbody>
  );

  return (
    <div className="general-roster">
      <div className="general-roster__content">
        <h2 className="general-roster__title">Состав команды: {team}</h2>
        {savingCapHit && (
          <div className="general-roster__saving">Сохранение cap hit...</div>
        )}
        <div className="general-roster__table-wrapper">
          <table className="general-roster__table">
            {/* Основной состав */}
            {mainPlayers.length > 0 && (
              <>
                <tbody>
                  {sortedMainPlayers.map((player) => {
                    const isSpecial = player.id === 1;
                    const displayNumber = !isSpecial ? ++mainRowNumber : "";
                    return (
                      <tr
                        key={
                          player.id ||
                          `${player.active_roster}-${player.position}`
                        }
                        className={
                          isSpecial ? "general-roster__special-row" : ""
                        }
                      >
                        <td className="general-roster__row-number">
                          {displayNumber}
                        </td>
                        <td>{player.active_roster}</td>
                        <td>{player.position}</td>
                        <td>{player.pos_elig}</td>
                        <td>{player.age}</td>
                        <td>{player.opt}</td>
                        <td>{player.status}</td>

                        <td className="general-roster__numeric">
                          {formatValueWithSpaces(player.year_one)}
                        </td>
                        <td className="general-roster__numeric">
                          {formatValueWithSpaces(player.year_two)}
                        </td>
                        <td className="general-roster__numeric">
                          {formatValueWithSpaces(player.year_three)}
                        </td>
                        <td className="general-roster__numeric">
                          {formatValueWithSpaces(player.year_four)}
                        </td>
                        <td className="general-roster__numeric">
                          {formatValueWithSpaces(player.year_five)}
                        </td>
                        <td>{player.exp}</td>
                        <td>{player.bird}</td>
                        <td className="general-roster__numeric">
                          {player.rating}
                        </td>
                        <td>{player.retention}</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tbody className="general-roster__total-row">
                  <tr>
                    <td colSpan={7} className="general-roster__total-label">
                      Итого по основному составу
                    </td>
                    <td className="general-roster__numeric">
                      {formatValueWithSpaces(mainYearSums.y1)}
                    </td>
                    <td className="general-roster__numeric">
                      {formatValueWithSpaces(mainYearSums.y2)}
                    </td>
                    <td className="general-roster__numeric">
                      {formatValueWithSpaces(mainYearSums.y3)}
                    </td>
                    <td className="general-roster__numeric">
                      {formatValueWithSpaces(mainYearSums.y4)}
                    </td>
                    <td className="general-roster__numeric">
                      {formatValueWithSpaces(mainYearSums.y5)}
                    </td>
                    <td colSpan={4}> </td>
                  </tr>
                </tbody>
                {deadCapPlayers.length === 0 && capSpaceRow}
              </>
            )}

            {/* Dead cap секция */}
            {deadCapPlayers.length > 0 && (
              <>
                <tbody className="general-roster__deadcap-separator">
                  <tr>
                    <td colSpan={16} className="general-roster__subtitle-cell">
                      Dead cap
                    </td>
                  </tr>
                </tbody>
                <tbody>
                  {sortedDeadCapPlayers.map((player) => {
                    const displayNumber = ++deadCapRowNumber;
                    return (
                      <tr
                        key={
                          player.id ||
                          `${player.active_roster}-${player.position}-deadcap`
                        }
                      >
                        <td className="general-roster__row-number">
                          {displayNumber}
                        </td>
                        <td>{player.active_roster}</td>
                        <td>{player.position}</td>
                        <td>{player.pos_elig}</td>
                        <td>{player.age}</td>
                        <td>{player.opt}</td>
                        <td>{player.status}</td>

                        <td className="general-roster__numeric">
                          {formatValueWithSpaces(player.dc_year_one)}
                        </td>
                        <td className="general-roster__numeric">
                          {formatValueWithSpaces(player.dc_year_two)}
                        </td>
                        <td className="general-roster__numeric">
                          {formatValueWithSpaces(player.dc_year_three)}
                        </td>
                        <td className="general-roster__numeric">
                          {formatValueWithSpaces(player.dc_year_four)}
                        </td>
                        <td className="general-roster__numeric">
                          {formatValueWithSpaces(player.dc_year_five)}
                        </td>
                        <td>{player.exp}</td>
                        <td>{player.bird}</td>
                        <td className="general-roster__numeric">
                          {player.rating}
                        </td>
                        <td>{player.retention}</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tbody className="general-roster__total-row">
                  <tr>
                    <td colSpan={7} className="general-roster__total-label">
                      Итого по dead cap
                    </td>
                    <td className="general-roster__numeric">
                      {formatValueWithSpaces(deadCapYearSums.y1)}
                    </td>
                    <td className="general-roster__numeric">
                      {formatValueWithSpaces(deadCapYearSums.y2)}
                    </td>
                    <td className="general-roster__numeric">
                      {formatValueWithSpaces(deadCapYearSums.y3)}
                    </td>
                    <td className="general-roster__numeric">
                      {formatValueWithSpaces(deadCapYearSums.y4)}
                    </td>
                    <td className="general-roster__numeric">
                      {formatValueWithSpaces(deadCapYearSums.y5)}
                    </td>
                    <td colSpan={4}> </td>
                  </tr>
                </tbody>
                <tbody className="general-roster__total-row general-roster__grand-total">
                  <tr>
                    <td colSpan={7} className="general-roster__total-label">
                      Общая сумма (основной + dead cap)
                    </td>
                    <td className="general-roster__numeric">
                      {formatValueWithSpaces(totalYearSums.y1)}
                    </td>
                    <td className="general-roster__numeric">
                      {formatValueWithSpaces(totalYearSums.y2)}
                    </td>
                    <td className="general-roster__numeric">
                      {formatValueWithSpaces(totalYearSums.y3)}
                    </td>
                    <td className="general-roster__numeric">
                      {formatValueWithSpaces(totalYearSums.y4)}
                    </td>
                    <td className="general-roster__numeric">
                      {formatValueWithSpaces(totalYearSums.y5)}
                    </td>
                    <td colSpan={4}> </td>
                  </tr>
                </tbody>
                {capSpaceRow}
              </>
            )}

            {/* Разделитель: заголовок G-лиги */}
            {gLeaguePlayers.length > 0 && (
              <tbody className="general-roster__gleague-separator">
                <tr>
                  <td colSpan={16} className="general-roster__subtitle-cell">
                    G-league roster
                  </td>
                </tr>
              </tbody>
            )}

            {/* Игроки G-лиги */}
            {gLeaguePlayers.length > 0 && (
              <tbody>
                {sortedGLeaguePlayers.map((player) => {
                  const displayNumber = ++gLeagueRowNumber;
                  return (
                    <tr
                      key={
                        player.id ||
                        `${player.active_roster}-${player.position}`
                      }
                    >
                      <td className="general-roster__row-number">
                        {displayNumber}
                      </td>
                      <td>{player.active_roster}</td>
                      <td>{player.position}</td>
                      <td>{player.pos_elig}</td>
                      <td>{player.age}</td>
                      <td>{player.opt}</td>
                      <td>{player.status}</td>

                      <td className="general-roster__numeric">
                        {formatValueWithSpaces(player.year_one)}
                      </td>
                      <td className="general-roster__numeric">
                        {formatValueWithSpaces(player.year_two)}
                      </td>
                      <td className="general-roster__numeric">
                        {formatValueWithSpaces(player.year_three)}
                      </td>
                      <td className="general-roster__numeric">
                        {formatValueWithSpaces(player.year_four)}
                      </td>
                      <td className="general-roster__numeric">
                        {formatValueWithSpaces(player.year_five)}
                      </td>
                      <td>{player.exp}</td>
                      <td>{player.bird}</td>
                      <td className="general-roster__numeric">
                        {player.rating}
                      </td>
                      <td>{player.retention}</td>
                    </tr>
                  );
                })}
              </tbody>
            )}
          </table>
        </div>
      </div>
    </div>
  );
};

export default TeamRoster;
