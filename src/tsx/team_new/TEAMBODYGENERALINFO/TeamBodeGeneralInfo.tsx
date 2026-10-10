// import React, { useState, useEffect } from "react";
// import { supabase } from "../../../Supabase";
// import "./teamBodeGeneralInfo.css";

// interface TeamHeadInfo {
//   team_name: string;
//   gm: string | null;
//   salary_cap: number | null;
//   cap_hit: number | null;
//   cap_space: number | null;
//   cash_money: number | null;
//   penalties: number | null; // больше не используется для отображения
//   active_roster: string | null;
//   dead_cap: number | null;
//   g_leage: string | null;
//   extra_pos: string | null;
//   head_coach: string | null;
// }

// interface TeamBodeGeneralInfoProps {
//   teamName: string;
// }

// const TeamBodeGeneralInfo: React.FC<TeamBodeGeneralInfoProps> = ({
//   teamName,
// }) => {
//   const [data, setData] = useState<TeamHeadInfo | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [activeRosterCount, setActiveRosterCount] = useState<number | null>(
//     null,
//   );
//   const [gLeagueCount, setGLeagueCount] = useState<number | null>(null);
//   const [penaltiesCount, setPenaltiesCount] = useState<number | null>(null); // новое состояние
//   const [isCollapsed, setIsCollapsed] = useState(true);

//   // Загрузка общей информации о команде (таблица Head)
//   useEffect(() => {
//     if (!teamName) return;

//     const fetchTeamInfo = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const { data: teamData, error: supabaseError } = await supabase
//           .from("Head")
//           .select("*")
//           .eq("team_name", teamName)
//           .single<TeamHeadInfo>();

//         if (supabaseError) throw supabaseError;
//         setData(teamData);
//       } catch (err: unknown) {
//         setError(err instanceof Error ? err.message : "Ошибка загрузки");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTeamInfo();
//   }, [teamName]);

//   // Загрузка количества игроков в активном составе
//   useEffect(() => {
//     if (!teamName) return;

//     const fetchRosterCount = async () => {
//       try {
//         const { count, error } = await supabase
//           .from("Players")
//           .select("*", { count: "exact", head: true })
//           .eq("team", teamName);

//         if (error) throw error;
//         setActiveRosterCount(count ?? 0);
//       } catch (err) {
//         console.error("Ошибка загрузки количества игроков:", err);
//         setActiveRosterCount(null);
//       }
//     };

//     fetchRosterCount();
//   }, [teamName]);

//   // Загрузка количества игроков в G-лиге
//   useEffect(() => {
//     if (!teamName) return;

//     const fetchGLeagueCount = async () => {
//       try {
//         const { count, error } = await supabase
//           .from("Players")
//           .select("*", { count: "exact", head: true })
//           .eq("g_league", teamName);

//         if (error) throw error;
//         setGLeagueCount(count ?? 0);
//       } catch (err) {
//         console.error("Ошибка загрузки количества игроков в G-лиге:", err);
//         setGLeagueCount(null);
//       }
//     };

//     fetchGLeagueCount();
//   }, [teamName]);

//   // НОВЫЙ useEffect: загрузка количества штрафов из таблицы Penalties
//   useEffect(() => {
//     if (!teamName) return;

//     const fetchPenaltiesCount = async () => {
//       try {
//         const { count, error } = await supabase
//           .from("Penalties")
//           .select("*", { count: "exact", head: true })
//           .eq("team", teamName);

//         if (error) throw error;
//         setPenaltiesCount(count ?? 0);
//       } catch (err) {
//         console.error("Ошибка загрузки количества штрафов:", err);
//         setPenaltiesCount(null);
//       }
//     };

//     fetchPenaltiesCount();
//   }, [teamName]);

//   const toggleCollapse = () => setIsCollapsed(!isCollapsed);

//   if (loading) return <div className="tbg-loading">Загрузка...</div>;
//   if (error) return <div className="tbg-error">{error}</div>;
//   if (!data) return <div className="tbg-no-data">Нет данных</div>;

//   const formatNumber = (value: number | null | undefined): string => {
//     if (value == null) return "—";
//     return new Intl.NumberFormat("en-US").format(value);
//   };

//   const getCapSpaceClass = (value: number | null | undefined): string => {
//     if (value == null) return "tbg-cap-neutral";
//     if (value > 0) return "tbg-cap-positive";
//     if (value < 0) return "tbg-cap-negative";
//     return "tbg-cap-neutral";
//   };

//   const activeRosterDisplay =
//     activeRosterCount !== null ? `${activeRosterCount}/14` : "—";
//   const gLeagueDisplay = gLeagueCount !== null ? `${gLeagueCount}/3` : "—";

//   const staffItems = [
//     { label: "GM", value: data.gm || "—", key: "gm" },
//     {
//       label: "Active Roster",
//       value: activeRosterDisplay,
//       key: "active-roster",
//     },
//     { label: "Head Coach", value: data.head_coach || "—", key: "head_coach" },
//     { label: "G-League", value: gLeagueDisplay, key: "g_leage" },
//     { label: "Extra Pos", value: data.extra_pos || "—", key: "extra_pos" },
//   ];

//   // Финансовые поля – для Penalties используем penaltiesCount, а не data.penalties
//   const financeFields = [
//     { label: "Salary Cap", key: "salary_cap" as const, format: formatNumber },
//     { label: "Cap Hit", key: "cap_hit" as const, format: formatNumber },
//     {
//       label: "Cap Space",
//       key: "cap_space" as const,
//       format: formatNumber,
//       className: getCapSpaceClass,
//     },
//     { label: "Cash Money", key: "cash_money" as const, format: formatNumber },
//     // ⚠️ Penalties теперь берётся из penaltiesCount, а не из data.penalties
//     {
//       label: "Penalties",
//       key: "penalties_count", // фиктивный ключ, чтобы не конфликтовать с data.penalties
//       value: penaltiesCount,
//       format: (val: number | null) => (val !== null ? val.toString() : "—"),
//     },
//     { label: "Dead Cap", key: "dead_cap" as const, format: formatNumber },
//   ];

//   return (
//     <div className="tbg-team-info-compact">
//       <div className="tbg-header">
//         <div className="tbg-header-title">Информация о команде</div>
//         <button className="tbg-collapse-btn" onClick={toggleCollapse}>
//           {isCollapsed ? "Развернуть" : "Свернуть"}
//         </button>
//       </div>
//       {!isCollapsed && (
//         <div className="tbg-info-sections">
//           <div className="tbg-info-section">
//             <div className="tbg-section-title">Staff & Roster</div>
//             <div className="tbg-info-grid">
//               {staffItems.map((item) => (
//                 <div className="tbg-info-item" key={item.key}>
//                   <span className="tbg-info-label">{item.label}</span>
//                   <span className="tbg-info-value">{item.value}</span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="tbg-info-section">
//             <div className="tbg-section-title">Finances</div>
//             <div className="tbg-info-grid">
//               {financeFields.map((field) => {
//                 // Для обычных полей (Salary Cap, Cap Hit, ...) берём значение из data
//                 // Для Penalties используем специально подготовленное значение
//                 let value: any;
//                 if (field.key === "penalties_count") {
//                   value = field.value;
//                 } else {
//                   value = data[field.key as keyof TeamHeadInfo];
//                 }
//                 const valueClass = field.className
//                   ? field.className(value)
//                   : "";
//                 const displayValue = field.format
//                   ? field.format(value)
//                   : (value ?? "—");
//                 return (
//                   <div className="tbg-info-item" key={field.key}>
//                     <span className="tbg-info-label">{field.label}</span>
//                     <span className={`tbg-info-value ${valueClass}`}>
//                       {displayValue}
//                     </span>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TeamBodeGeneralInfo;

import React, { useState, useEffect } from "react";
import { supabase } from "../../../Supabase";
import { formatValueWithSpaces } from "../../agentControlCenter/playerConsole/playerComponents/utils/formatting";
import "./teamBodeGeneralInfo.css";

interface TeamHeadInfo {
  team_name: string;
  gm: string | null;
  salary_cap: number | null;
  cap_hit: number | null;
  cap_space: number | null;
  cash_money: number | null;
  penalties: number | null; // больше не используется для отображения
  active_roster: string | null;
  dead_cap: number | null;
  g_leage: string | null;
  extra_pos: string | null;
  head_coach: string | null;
}

interface TeamBodeGeneralInfoProps {
  teamName: string;
}

const TeamBodeGeneralInfo: React.FC<TeamBodeGeneralInfoProps> = ({
  teamName,
}) => {
  const [data, setData] = useState<TeamHeadInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeRosterCount, setActiveRosterCount] = useState<number | null>(
    null,
  );
  const [gLeagueCount, setGLeagueCount] = useState<number | null>(null);
  const [penaltiesCount, setPenaltiesCount] = useState<number | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(true);

  // Загрузка общей информации о команде (таблица Head)
  useEffect(() => {
    if (!teamName) return;

    const fetchTeamInfo = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: teamData, error: supabaseError } = await supabase
          .from("Head")
          .select("*")
          .eq("team_name", teamName)
          .single<TeamHeadInfo>();

        if (supabaseError) throw supabaseError;
        setData(teamData);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Ошибка загрузки");
      } finally {
        setLoading(false);
      }
    };

    fetchTeamInfo();
  }, [teamName]);

  // Загрузка количества игроков в активном составе
  useEffect(() => {
    if (!teamName) return;

    const fetchRosterCount = async () => {
      try {
        const { count, error } = await supabase
          .from("Players")
          .select("*", { count: "exact", head: true })
          .eq("team", teamName);

        if (error) throw error;
        setActiveRosterCount(count ?? 0);
      } catch (err) {
        console.error("Ошибка загрузки количества игроков:", err);
        setActiveRosterCount(null);
      }
    };

    fetchRosterCount();
  }, [teamName]);

  // Загрузка количества игроков в G-лиге
  useEffect(() => {
    if (!teamName) return;

    const fetchGLeagueCount = async () => {
      try {
        const { count, error } = await supabase
          .from("Players")
          .select("*", { count: "exact", head: true })
          .eq("g_league", teamName);

        if (error) throw error;
        setGLeagueCount(count ?? 0);
      } catch (err) {
        console.error("Ошибка загрузки количества игроков в G-лиге:", err);
        setGLeagueCount(null);
      }
    };

    fetchGLeagueCount();
  }, [teamName]);

  // Загрузка количества штрафов из таблицы Penalties
  useEffect(() => {
    if (!teamName) return;

    const fetchPenaltiesCount = async () => {
      try {
        const { count, error } = await supabase
          .from("Penalties")
          .select("*", { count: "exact", head: true })
          .eq("team", teamName);

        if (error) throw error;
        setPenaltiesCount(count ?? 0);
      } catch (err) {
        console.error("Ошибка загрузки количества штрафов:", err);
        setPenaltiesCount(null);
      }
    };

    fetchPenaltiesCount();
  }, [teamName]);

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  if (loading) return <div className="tbg-loading">Загрузка...</div>;
  if (error) return <div className="tbg-error">{error}</div>;
  if (!data) return <div className="tbg-no-data">Нет данных</div>;

  // Форматирование чисел через пробелы (как в PlayersTable)
  const formatNumber = (value: number | null | undefined): string => {
    if (value == null) return "—";
    return formatValueWithSpaces(String(value));
  };

  const getCapSpaceClass = (value: number | null | undefined): string => {
    if (value == null) return "tbg-cap-neutral";
    if (value > 0) return "tbg-cap-positive";
    if (value < 0) return "tbg-cap-negative";
    return "tbg-cap-neutral";
  };

  const activeRosterDisplay =
    activeRosterCount !== null ? `${activeRosterCount}/14` : "—";
  const gLeagueDisplay = gLeagueCount !== null ? `${gLeagueCount}/3` : "—";

  const staffItems = [
    { label: "GM", value: data.gm || "—", key: "gm" },
    {
      label: "Active Roster",
      value: activeRosterDisplay,
      key: "active-roster",
    },
    { label: "Head Coach", value: data.head_coach || "—", key: "head_coach" },
    { label: "G-League", value: gLeagueDisplay, key: "g_leage" },
    { label: "Extra Pos", value: data.extra_pos || "—", key: "extra_pos" },
  ];

  // Финансовые поля – для Penalties используем penaltiesCount
  const financeFields = [
    { label: "Salary Cap", key: "salary_cap" as const, format: formatNumber },
    { label: "Cap Hit", key: "cap_hit" as const, format: formatNumber },
    {
      label: "Cap Space",
      key: "cap_space" as const,
      format: formatNumber,
      className: getCapSpaceClass,
    },
    { label: "Cash Money", key: "cash_money" as const, format: formatNumber },
    {
      label: "Penalties",
      key: "penalties_count",
      value: penaltiesCount,
      format: (val: number | null) =>
        val !== null ? formatValueWithSpaces(String(val)) : "—",
    },
    { label: "Dead Cap", key: "dead_cap" as const, format: formatNumber },
  ];

  return (
    <div className="tbg-team-info-compact">
      <div className="tbg-header">
        <div className="tbg-header-title">Информация о команде</div>
        <button className="tbg-collapse-btn" onClick={toggleCollapse}>
          {isCollapsed ? "Развернуть" : "Свернуть"}
        </button>
      </div>
      {!isCollapsed && (
        <div className="tbg-info-sections">
          <div className="tbg-info-section">
            <div className="tbg-section-title">Staff & Roster</div>
            <div className="tbg-info-grid">
              {staffItems.map((item) => (
                <div className="tbg-info-item" key={item.key}>
                  <span className="tbg-info-label">{item.label}</span>
                  <span className="tbg-info-value">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="tbg-info-section">
            <div className="tbg-section-title">Finances</div>
            <div className="tbg-info-grid">
              {financeFields.map((field) => {
                let value: any;
                if (field.key === "penalties_count") {
                  value = field.value;
                } else {
                  value = data[field.key as keyof TeamHeadInfo];
                }
                const valueClass = field.className
                  ? field.className(value)
                  : "";
                const displayValue = field.format
                  ? field.format(value)
                  : (value ?? "—");
                return (
                  <div className="tbg-info-item" key={field.key}>
                    <span className="tbg-info-label">{field.label}</span>
                    <span className={`tbg-info-value ${valueClass}`}>
                      {displayValue}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamBodeGeneralInfo;
