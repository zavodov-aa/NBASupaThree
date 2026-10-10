// // import React, { useEffect, useState, useCallback } from "react";
// // import { createClient } from "@supabase/supabase-js";
// // import {
// //   parseMoney,
// //   formatValueWithSpaces,
// // } from "../../agentControlCenter/playerConsole/playerComponents/utils/formatting";
// // import "./headAdminConsoleBody.css";

// // type Head = {
// //   id: string;
// //   team_name: string;
// //   conference: string;
// //   division: string;
// //   gm: string;
// //   salary_cap: string;
// //   cap_hit: string;
// //   cap_space: string;
// //   cash_money: string;
// //   standing: string;
// //   penalties: string;
// //   active_roster: string;
// //   dead_cap: string;
// //   g_leage: string;
// //   extra_pos: string;
// //   last_season_result: string;
// //   in_team_since: string;
// //   championships: string;
// //   regular_best: string;
// //   division_winner: string;
// //   playoffs: string;
// //   best_result: string;
// //   head_coach: string;
// //   name_coach: string;
// //   coach_pg: string;
// //   coach_sg: string;
// //   coach_sf: string;
// //   coach_pf: string;
// //   coach_c: string;
// //   coach_star: string;
// //   coach_start: string;
// //   coach_bench: string;
// //   coach_g1: string;
// //   coach_g2: string;
// //   coach_g3: string;
// //   coach_neg: string;
// //   year_pick_one: string;
// //   draft_pick_one_1r: string;
// //   draft_pick_one_2r: string;
// //   year_pick_two: string;
// //   draft_pick_two_1r: string;
// //   draft_pick_two_2r: string;
// //   year_pick_three: string;
// //   draft_pick_three_1r: string;
// //   draft_pick_three_2r: string;
// // };

// // type Player = {
// //   id: string;
// //   team: string | null;
// //   g_league: string | null;
// //   year_one: string | null;
// //   year_two: string | null;
// //   year_three: string | null;
// //   year_four: string | null;
// //   year_five: string | null;
// //   dead_cap_team: string | null;
// //   dc_year_one: string | null;
// //   dc_year_two: string | null;
// //   dc_year_three: string | null;
// //   dc_year_four: string | null;
// //   dc_year_five: string | null;
// // };

// // type TeamAggregates = {
// //   active_roster: number;
// //   g_leage: number;
// //   cap_hit: number;
// //   dead_cap: number;
// // };

// // const supabase = createClient(
// //   "https://sgbsefgldsmzbvzvpjxt.supabase.co",
// //   "sb_publishable_Xl99x3YkZHWgS8l-qBSmCg_gXF_Gpcp",
// // );

// // const HeadAdminConsoleBody = () => {
// //   const [headInfo, setHeadInfo] = useState<Head[]>([]);
// //   const [filteredHeadInfo, setFilteredHeadInfo] = useState<Head[]>([]);
// //   const [editingId, setEditingId] = useState<string | null>(null);
// //   const [editData, setEditData] = useState<Partial<Head>>({});
// //   const [showFilters, setShowFilters] = useState(false);
// //   const [isMobile, setIsMobile] = useState(false);
// //   const [showColumnSelector, setShowColumnSelector] = useState(false);

// //   const [teamAggregates, setTeamAggregates] = useState<
// //     Record<string, TeamAggregates>
// //   >({});

// //   useEffect(() => {
// //     const checkMobile = () => setIsMobile(window.innerWidth <= 768);
// //     checkMobile();
// //     window.addEventListener("resize", checkMobile);
// //     return () => window.removeEventListener("resize", checkMobile);
// //   }, []);

// //   const allColumns: (keyof Head)[] = [
// //     "id",
// //     "team_name",
// //     "conference",
// //     "division",
// //     "gm",
// //     "salary_cap",
// //     "cap_hit",
// //     "cap_space",
// //     "cash_money",
// //     "standing",
// //     "penalties",
// //     "active_roster",
// //     "dead_cap",
// //     "g_leage",
// //     "extra_pos",
// //     "last_season_result",
// //     "in_team_since",
// //     "championships",
// //     "regular_best",
// //     "division_winner",
// //     "playoffs",
// //     "head_coach",
// //   ];

// //   const initialColumns: (keyof Head)[] = [
// //     "id",
// //     "team_name",
// //     "gm",
// //     "head_coach",
// //     "active_roster",
// //     "salary_cap",
// //     "cap_hit",
// //     "cap_space",
// //     "cash_money",
// //     "dead_cap",
// //     "g_leage",
// //   ];
// //   const [visibleColumns, setVisibleColumns] = useState<Set<keyof Head>>(
// //     new Set(initialColumns),
// //   );

// //   const [filters, setFilters] = useState<Record<string, string>>(
// //     Object.fromEntries(allColumns.map((col) => [col, ""])),
// //   );

// //   const cleanNumberString = (value: string): string => {
// //     if (!value) return "";
// //     return value.replace(/[^\d.-]/g, "");
// //   };

// //   const handleNumberInput = (value: string): string =>
// //     value.replace(/[^\d.-]/g, "");

// //   // ============================================================
// //   // 1. Загрузка Head и Players + расчёт агрегатов по командам
// //   // ============================================================
// //   const fetchAll = useCallback(async () => {
// //     const { data: headData, error: headError } = await supabase
// //       .from("Head")
// //       .select("*")
// //       .order("id");

// //     if (headError) {
// //       console.error("Error fetching Head:", headError);
// //       return;
// //     }

// //     const editableNumericFields = ["salary_cap", "cash_money", "penalties"];
// //     const cleanedHead = (headData || []).map((item) => {
// //       const cleaned: any = { ...item };
// //       editableNumericFields.forEach((field) => {
// //         if (cleaned[field]) {
// //           cleaned[field] = cleanNumberString(cleaned[field]);
// //         }
// //       });
// //       return cleaned as Head;
// //     });

// //     const { data: playersData, error: playersError } = await supabase
// //       .from("Players")
// //       .select(
// //         "id,team,g_league,year_one,year_two,year_three,year_four,year_five,dead_cap_team,dc_year_one,dc_year_two,dc_year_three,dc_year_four,dc_year_five",
// //       );

// //     if (playersError) {
// //       console.error("Error fetching Players:", playersError);
// //     }

// //     const players = (playersData || []) as Player[];

// //     const agg: Record<string, TeamAggregates> = {};

// //     const ensureTeam = (name: string): TeamAggregates => {
// //       if (!agg[name]) {
// //         agg[name] = {
// //           active_roster: 0,
// //           g_leage: 0,
// //           cap_hit: 0,
// //           dead_cap: 0,
// //         };
// //       }
// //       return agg[name];
// //     };

// //     players.forEach((p) => {
// //       if (p.team) {
// //         ensureTeam(p.team).active_roster += 1;
// //         ensureTeam(p.team).cap_hit += parseMoney(p.year_one);
// //       }

// //       if (p.g_league && p.g_league !== "None") {
// //         ensureTeam(p.g_league).g_leage += 1;
// //       }

// //       if (p.dead_cap_team && p.dead_cap_team !== "None") {
// //         const dcSum =
// //           parseMoney(p.dc_year_one) +
// //           parseMoney(p.dc_year_two) +
// //           parseMoney(p.dc_year_three) +
// //           parseMoney(p.dc_year_four) +
// //           parseMoney(p.dc_year_five);
// //         ensureTeam(p.dead_cap_team).dead_cap += dcSum;
// //       }
// //     });

// //     Object.keys(agg).forEach((teamName) => {
// //       agg[teamName].cap_hit += agg[teamName].dead_cap;
// //     });

// //     setTeamAggregates(agg);

// //     const headWithAgg: Head[] = cleanedHead.map((h) => {
// //       const a = agg[h.team_name] || {
// //         active_roster: 0,
// //         g_leage: 0,
// //         cap_hit: 0,
// //         dead_cap: 0,
// //       };

// //       const salaryCap = parseFloat(h.salary_cap || "0") || 0;
// //       const capHit = a.cap_hit;
// //       const capSpace = salaryCap - capHit;

// //       return {
// //         ...h,
// //         active_roster: `${a.active_roster}/14`,
// //         g_leage: `${a.g_leage}/3`,
// //         cap_hit: String(capHit),
// //         cap_space: String(capSpace),
// //         dead_cap: String(a.dead_cap),
// //       };
// //     });

// //     setHeadInfo(headWithAgg);
// //     setFilteredHeadInfo(headWithAgg);
// //   }, []);

// //   useEffect(() => {
// //     fetchAll();
// //   }, [fetchAll]);

// //   // ============================================================
// //   // Фильтрация
// //   // ============================================================
// //   const safeStringCompareHead = (
// //     value: string | null | undefined,
// //     filter: string,
// //   ): boolean => {
// //     if (!value) return false;
// //     return value.toLowerCase().includes(filter.toLowerCase());
// //   };

// //   useEffect(() => {
// //     let result = headInfo;
// //     Object.entries(filters).forEach(([key, value]) => {
// //       if (value) {
// //         result = result.filter((h) =>
// //           safeStringCompareHead(h[key as keyof Head], value),
// //         );
// //       }
// //     });
// //     setFilteredHeadInfo(result);
// //   }, [filters, headInfo]);

// //   const handleFilterChange = (field: keyof typeof filters, value: string) => {
// //     setFilters((prev) => ({ ...prev, [field]: value }));
// //   };

// //   const handleResetFilters = () => {
// //     setFilters(Object.fromEntries(allColumns.map((col) => [col, ""])));
// //   };

// //   // ============================================================
// //   // Редактирование
// //   // ============================================================
// //   const computedFields: (keyof Head)[] = [
// //     "active_roster",
// //     "g_leage",
// //     "cap_hit",
// //     "cap_space",
// //     "dead_cap",
// //   ];

// //   const editableNumericFields: (keyof Head)[] = [
// //     "salary_cap",
// //     "cash_money",
// //     "penalties",
// //   ];

// //   const handleEdit = (headInfo: Head) => {
// //     setEditingId(headInfo.id);
// //     const formattedEditData: Partial<Head> = { ...headInfo };
// //     editableNumericFields.forEach((field) => {
// //       const val = formattedEditData[field] as string;
// //       if (val) {
// //         formattedEditData[field] = cleanNumberString(val) as any;
// //       }
// //     });
// //     setEditData(formattedEditData);
// //   };

// //   const handleSave = async () => {
// //     if (!editingId) return;

// //     const dataToSave: Partial<Head> = { ...editData };

// //     computedFields.forEach((field) => {
// //       delete dataToSave[field];
// //     });

// //     editableNumericFields.forEach((field) => {
// //       const val = dataToSave[field] as string | undefined;
// //       if (val) {
// //         dataToSave[field] = cleanNumberString(val) as any;
// //       }
// //     });

// //     const { error } = await supabase
// //       .from("Head")
// //       .update(dataToSave)
// //       .eq("id", editingId);

// //     if (error) {
// //       console.error("Error updating headInfo:", error);
// //       return;
// //     }

// //     setEditingId(null);
// //     setEditData({});

// //     await fetchAll();
// //   };

// //   const handleCancel = () => {
// //     setEditingId(null);
// //     setEditData({});
// //   };

// //   const handleInputChange = (field: keyof Head, value: string) => {
// //     const processedValue = editableNumericFields.includes(field)
// //       ? handleNumberInput(value)
// //       : value;
// //     setEditData((prev) => ({ ...prev, [field]: processedValue }));
// //   };

// //   // ============================================================
// //   // Колонки
// //   // ============================================================
// //   const toggleColumnVisibility = (column: keyof Head) => {
// //     setVisibleColumns((prev) => {
// //       const newSet = new Set(prev);
// //       if (newSet.has(column)) newSet.delete(column);
// //       else newSet.add(column);
// //       return newSet;
// //     });
// //   };

// //   const selectAllColumns = () => setVisibleColumns(new Set(allColumns));
// //   const deselectAllColumns = () => setVisibleColumns(new Set());

// //   const selectGroupColumns = (columns: (keyof Head)[]) => {
// //     setVisibleColumns((prev) => {
// //       const newSet = new Set(prev);
// //       columns.forEach((c) => newSet.add(c));
// //       return newSet;
// //     });
// //   };
// //   const deselectGroupColumns = (columns: (keyof Head)[]) => {
// //     setVisibleColumns((prev) => {
// //       const newSet = new Set(prev);
// //       columns.forEach((c) => newSet.delete(c));
// //       return newSet;
// //     });
// //   };

// //   const columnGroups: Record<string, (keyof Head)[]> = {
// //     "Basic Info": ["id", "team_name", "conference", "division", "gm"],
// //     Financials: [
// //       "salary_cap",
// //       "cap_hit",
// //       "cap_space",
// //       "cash_money",
// //       "dead_cap",
// //       "penalties",
// //     ],
// //     Roster: ["active_roster", "g_leage", "extra_pos", "standing"],
// //     Performance: [
// //       "last_season_result",
// //       "championships",
// //       "regular_best",
// //       "division_winner",
// //       "playoffs",
// //     ],
// //     Coaching: ["head_coach"],
// //   };

// //   const numericFields: (keyof Head)[] = [
// //     "salary_cap",
// //     "cap_hit",
// //     "cap_space",
// //     "cash_money",
// //     "dead_cap",
// //     "penalties",
// //   ];

// //   return (
// //     <div className="HeadInfoAgent-main">
// //       {isMobile && (
// //         <div className="HeadInfoAgent-mobile-view-controls">
// //           <button
// //             className="HeadInfoAgent-view-button"
// //             onClick={() => setShowFilters(!showFilters)}
// //           >
// //             {showFilters ? "Hide Filters" : "Show Filters"}
// //           </button>
// //           <button
// //             className="HeadInfoAgent-view-button"
// //             onClick={() => setShowColumnSelector(!showColumnSelector)}
// //           >
// //             {showColumnSelector ? "Hide Columns" : "Show Columns"}
// //           </button>
// //         </div>
// //       )}

// //       {/* Column Selector */}
// //       {(showColumnSelector || !isMobile) && (
// //         <div className="HeadInfoAgent-column-selector">
// //           <div className="HeadInfoAgent-column-selector-header">
// //             <h3 className="HeadInfoAgent-column-selector-title">
// //               COLUMN VISIBILITY
// //             </h3>
// //             <div className="HeadInfoAgent-mass-selection-buttons">
// //               <button
// //                 onClick={selectAllColumns}
// //                 className="HeadInfoAgent-small-button"
// //               >
// //                 Select All
// //               </button>
// //               <button
// //                 onClick={deselectAllColumns}
// //                 className="HeadInfoAgent-small-button"
// //               >
// //                 Deselect All
// //               </button>
// //             </div>
// //           </div>

// //           {isMobile ? (
// //             <div className="HeadInfoAgent-mobile-column-groups">
// //               <div className="HeadInfoAgent-mobile-mass-selection">
// //                 <div className="HeadInfoAgent-mobile-mass-buttons">
// //                   <button
// //                     onClick={selectAllColumns}
// //                     className="HeadInfoAgent-button HeadInfoAgent-mobile-mass-button"
// //                   >
// //                     Select All Columns
// //                   </button>
// //                   <button
// //                     onClick={deselectAllColumns}
// //                     className="HeadInfoAgent-button HeadInfoAgent-mobile-mass-button"
// //                   >
// //                     Deselect All Columns
// //                   </button>
// //                 </div>
// //               </div>
// //               {Object.entries(columnGroups).map(([groupName, columns]) => (
// //                 <div
// //                   key={groupName}
// //                   className="HeadInfoAgent-mobile-column-group"
// //                 >
// //                   <div className="HeadInfoAgent-mobile-column-group-title">
// //                     {groupName} ({columns.length})
// //                   </div>
// //                   <div className="HeadInfoAgent-mobile-column-checkboxes">
// //                     {columns.map((column) => (
// //                       <label
// //                         key={column}
// //                         className="HeadInfoAgent-mobile-checkbox-label"
// //                       >
// //                         <input
// //                           type="checkbox"
// //                           checked={visibleColumns.has(column)}
// //                           onChange={() => toggleColumnVisibility(column)}
// //                           className="HeadInfoAgent-mobile-checkbox-input"
// //                         />
// //                         <span className="HeadInfoAgent-mobile-checkbox-text">
// //                           {column.replace(/_/g, " ")}
// //                         </span>
// //                       </label>
// //                     ))}
// //                   </div>
// //                 </div>
// //               ))}
// //             </div>
// //           ) : (
// //             Object.entries(columnGroups).map(([groupName, columns]) => (
// //               <div key={groupName} className="HeadInfoAgent-column-group">
// //                 <div className="HeadInfoAgent-column-group-title">
// //                   <span>
// //                     {groupName} ({columns.length})
// //                   </span>
// //                   <div>
// //                     <button
// //                       onClick={() => selectGroupColumns(columns)}
// //                       className="HeadInfoAgent-small-button"
// //                     >
// //                       Select All
// //                     </button>
// //                     <button
// //                       onClick={() => deselectGroupColumns(columns)}
// //                       className="HeadInfoAgent-small-button"
// //                     >
// //                       Deselect All
// //                     </button>
// //                   </div>
// //                 </div>
// //                 <div className="HeadInfoAgent-column-checkboxes">
// //                   {columns.map((column) => (
// //                     <label
// //                       key={column}
// //                       className="HeadInfoAgent-checkbox-label"
// //                     >
// //                       <input
// //                         type="checkbox"
// //                         checked={visibleColumns.has(column)}
// //                         onChange={() => toggleColumnVisibility(column)}
// //                         className="HeadInfoAgent-checkbox-input"
// //                       />
// //                       {column.replace(/_/g, " ")}
// //                     </label>
// //                   ))}
// //                 </div>
// //               </div>
// //             ))
// //           )}
// //         </div>
// //       )}

// //       {/* Filters Panel */}
// //       {(showFilters || !isMobile) && (
// //         <div className="HeadInfoAgent-control-panel">
// //           <div
// //             className="HeadInfoAgent-panel-header"
// //             onClick={() => setShowFilters(!showFilters)}
// //           >
// //             <div className="HeadInfoAgent-panel-header-text">
// //               FILTER CONTROLS
// //             </div>
// //             <div>{showFilters ? "▲" : "▼"}</div>
// //           </div>

// //           {showFilters && (
// //             <>
// //               <div className="HeadInfoAgent-panel-content">
// //                 {Object.keys(filters)
// //                   .slice(0, isMobile ? 6 : Object.keys(filters).length)
// //                   .map((field) => (
// //                     <div key={field} className="HeadInfoAgent-filter-group">
// //                       <label className="HeadInfoAgent-label">
// //                         {field.replace(/_/g, " ")}
// //                       </label>
// //                       <input
// //                         type="text"
// //                         value={filters[field as keyof typeof filters]}
// //                         onChange={(e) =>
// //                           handleFilterChange(
// //                             field as keyof typeof filters,
// //                             e.target.value,
// //                           )
// //                         }
// //                         placeholder={`Filter ${field}...`}
// //                         className="HeadInfoAgent-input"
// //                       />
// //                     </div>
// //                   ))}
// //               </div>
// //               <div className="HeadInfoAgent-button-group">
// //                 <button
// //                   onClick={handleResetFilters}
// //                   className="HeadInfoAgent-button"
// //                 >
// //                   Reset Filters
// //                 </button>
// //                 <div className="HeadInfoAgent-record-count">
// //                   Displaying {filteredHeadInfo.length} of {headInfo.length}{" "}
// //                   records
// //                 </div>
// //               </div>
// //             </>
// //           )}
// //         </div>
// //       )}

// //       {/* Data Table */}
// //       <div className="HeadInfoAgent-table-wrapper">
// //         <table className="HeadInfoAgent-table">
// //           <thead>
// //             <tr className="HeadInfoAgent-table-header">
// //               {Array.from(visibleColumns).map((column) => (
// //                 <th key={column} className="HeadInfoAgent-table-header-cell">
// //                   {column.replace(/_/g, " ")}
// //                 </th>
// //               ))}
// //               <th className="HeadInfoAgent-table-header-cell">Actions</th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {filteredHeadInfo.map((head) => (
// //               <tr key={head.id} className="HeadInfoAgent-table-row">
// //                 {Array.from(visibleColumns).map((column) => {
// //                   const isComputed = computedFields.includes(column);
// //                   let displayValue: any = head[column] || "N/A";

// //                   if (
// //                     numericFields.includes(column) &&
// //                     displayValue !== "N/A"
// //                   ) {
// //                     displayValue = formatValueWithSpaces(String(displayValue));
// //                   }

// //                   return (
// //                     <td key={column} className="HeadInfoAgent-table-cell">
// //                       {editingId === head.id && !isComputed ? (
// //                         <input
// //                           value={(editData[column] as string) || ""}
// //                           onChange={(e) =>
// //                             handleInputChange(column, e.target.value)
// //                           }
// //                           className="HeadInfoAgent-edit-input"
// //                           type="text"
// //                         />
// //                       ) : (
// //                         <div
// //                           className="HeadInfoAgent-cell-value"
// //                           title={
// //                             isComputed
// //                               ? "Вычисляется автоматически из Players"
// //                               : undefined
// //                           }
// //                         >
// //                           {displayValue}
// //                         </div>
// //                       )}
// //                     </td>
// //                   );
// //                 })}
// //                 <td className="HeadInfoAgent-table-cell">
// //                   {editingId === head.id ? (
// //                     <div className="HeadInfoAgent-action-buttons">
// //                       <button
// //                         onClick={handleSave}
// //                         className="HeadInfoAgent-button HeadInfoAgent-primary-button"
// //                       >
// //                         Save
// //                       </button>
// //                       <button
// //                         onClick={handleCancel}
// //                         className="HeadInfoAgent-button"
// //                       >
// //                         Cancel
// //                       </button>
// //                     </div>
// //                   ) : (
// //                     <button
// //                       onClick={() => handleEdit(head)}
// //                       className="HeadInfoAgent-button"
// //                     >
// //                       Edit
// //                     </button>
// //                   )}
// //                 </td>
// //               </tr>
// //             ))}
// //           </tbody>
// //         </table>
// //       </div>
// //     </div>
// //   );
// // };

// // export default HeadAdminConsoleBody;

// import React, { useEffect, useState, useCallback } from "react";
// import { createClient } from "@supabase/supabase-js";
// import {
//   parseMoney,
//   formatValueWithSpaces,
// } from "../../agentControlCenter/playerConsole/playerComponents/utils/formatting";
// import "./headAdminConsoleBody.css";

// type Head = {
//   id: string;
//   team_name: string;
//   conference: string;
//   division: string;
//   gm: string;
//   salary_cap: string;
//   cap_hit: string;
//   cap_space: string;
//   cash_money: string;
//   standing: string;
//   penalties: string;
//   active_roster: string;
//   dead_cap: string;
//   g_leage: string;
//   extra_pos: string;
//   last_season_result: string;
//   in_team_since: string;
//   championships: string;
//   regular_best: string;
//   division_winner: string;
//   playoffs: string;
//   best_result: string;
//   head_coach: string;
//   name_coach: string;
//   coach_pg: string;
//   coach_sg: string;
//   coach_sf: string;
//   coach_pf: string;
//   coach_c: string;
//   coach_star: string;
//   coach_start: string;
//   coach_bench: string;
//   coach_g1: string;
//   coach_g2: string;
//   coach_g3: string;
//   coach_neg: string;
//   year_pick_one: string;
//   draft_pick_one_1r: string;
//   draft_pick_one_2r: string;
//   year_pick_two: string;
//   draft_pick_two_1r: string;
//   draft_pick_two_2r: string;
//   year_pick_three: string;
//   draft_pick_three_1r: string;
//   draft_pick_three_2r: string;
// };

// type Player = {
//   id: string;
//   team: string | null;
//   g_league: string | null;
//   year_one: string | null;
//   year_two: string | null;
//   year_three: string | null;
//   year_four: string | null;
//   year_five: string | null;
//   dead_cap_team: string | null;
//   dc_year_one: string | null;
//   dc_year_two: string | null;
//   dc_year_three: string | null;
//   dc_year_four: string | null;
//   dc_year_five: string | null;
// };

// type TeamAggregates = {
//   active_roster: number;
//   g_leage: number;
//   cap_hit: number;
//   dead_cap: number;
// };

// const supabase = createClient(
//   "https://sgbsefgldsmzbvzvpjxt.supabase.co",
//   "sb_publishable_Xl99x3YkZHWgS8l-qBSmCg_gXF_Gpcp",
// );

// const HeadAdminConsoleBody = () => {
//   const [headInfo, setHeadInfo] = useState<Head[]>([]);
//   const [filteredHeadInfo, setFilteredHeadInfo] = useState<Head[]>([]);
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [editData, setEditData] = useState<Partial<Head>>({});
//   const [showFilters, setShowFilters] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);
//   const [showColumnSelector, setShowColumnSelector] = useState(false);

//   const [teamAggregates, setTeamAggregates] = useState<
//     Record<string, TeamAggregates>
//   >({});

//   useEffect(() => {
//     const checkMobile = () => setIsMobile(window.innerWidth <= 768);
//     checkMobile();
//     window.addEventListener("resize", checkMobile);
//     return () => window.removeEventListener("resize", checkMobile);
//   }, []);

//   const allColumns: (keyof Head)[] = [
//     "id",
//     "team_name",
//     "conference",
//     "division",
//     "gm",
//     "salary_cap",
//     "cap_hit",
//     "cap_space",
//     "cash_money",
//     "standing",
//     "penalties",
//     "active_roster",
//     "dead_cap",
//     "g_leage",
//     "extra_pos",
//     "last_season_result",
//     "in_team_since",
//     "championships",
//     "regular_best",
//     "division_winner",
//     "playoffs",
//     "head_coach",
//   ];

//   const initialColumns: (keyof Head)[] = [
//     "id",
//     "team_name",
//     "gm",
//     "head_coach",
//     "active_roster",
//     "salary_cap",
//     "cap_hit",
//     "cap_space",
//     "cash_money",
//     "dead_cap",
//     "g_leage",
//   ];
//   const [visibleColumns, setVisibleColumns] = useState<Set<keyof Head>>(
//     new Set(initialColumns),
//   );

//   const [filters, setFilters] = useState<Record<string, string>>(
//     Object.fromEntries(allColumns.map((col) => [col, ""])),
//   );

//   const cleanNumberString = (value: string): string => {
//     if (!value) return "";
//     return value.replace(/[^\d.-]/g, "");
//   };

//   const handleNumberInput = (value: string): string =>
//     value.replace(/[^\d.-]/g, "");

//   // ============================================================
//   // 1. Загрузка Head и Players + расчёт агрегатов по командам
//   // ============================================================
//   const fetchAll = useCallback(async () => {
//     const { data: headData, error: headError } = await supabase
//       .from("Head")
//       .select("*")
//       .order("id");

//     if (headError) {
//       console.error("Error fetching Head:", headError);
//       return;
//     }

//     const editableNumericFields = ["salary_cap", "cash_money", "penalties"];
//     const cleanedHead = (headData || []).map((item) => {
//       const cleaned: any = { ...item };
//       editableNumericFields.forEach((field) => {
//         if (cleaned[field]) {
//           cleaned[field] = cleanNumberString(cleaned[field]);
//         }
//       });
//       return cleaned as Head;
//     });

//     const { data: playersData, error: playersError } = await supabase
//       .from("Players")
//       .select(
//         "id,team,g_league,year_one,year_two,year_three,year_four,year_five,dead_cap_team,dc_year_one,dc_year_two,dc_year_three,dc_year_four,dc_year_five",
//       );

//     if (playersError) {
//       console.error("Error fetching Players:", playersError);
//     }

//     const players = (playersData || []) as Player[];

//     const agg: Record<string, TeamAggregates> = {};

//     const ensureTeam = (name: string): TeamAggregates => {
//       if (!agg[name]) {
//         agg[name] = {
//           active_roster: 0,
//           g_leage: 0,
//           cap_hit: 0,
//           dead_cap: 0,
//         };
//       }
//       return agg[name];
//     };

//     players.forEach((p) => {
//       // Активный ростер + cap hit за текущий сезон (year_one)
//       if (p.team) {
//         ensureTeam(p.team).active_roster += 1;
//         ensureTeam(p.team).cap_hit += parseMoney(p.year_one);
//       }

//       // G-League
//       if (p.g_league && p.g_league !== "None") {
//         ensureTeam(p.g_league).g_leage += 1;
//       }

//       // Dead cap — только текущий сезон (dc_year_one)
//       if (p.dead_cap_team && p.dead_cap_team !== "None") {
//         ensureTeam(p.dead_cap_team).dead_cap += parseMoney(p.dc_year_one);
//       }
//     });

//     // cap_hit включает dead cap (стандартная логика NHL-кэпа)
//     Object.keys(agg).forEach((teamName) => {
//       agg[teamName].cap_hit += agg[teamName].dead_cap;
//     });

//     setTeamAggregates(agg);

//     const headWithAgg: Head[] = cleanedHead.map((h) => {
//       const a = agg[h.team_name] || {
//         active_roster: 0,
//         g_leage: 0,
//         cap_hit: 0,
//         dead_cap: 0,
//       };

//       const salaryCap = parseMoney(h.salary_cap);
//       const capHit = a.cap_hit;
//       const capSpace = salaryCap - capHit;

//       return {
//         ...h,
//         active_roster: `${a.active_roster}/14`,
//         g_leage: `${a.g_leage}/3`,
//         cap_hit: String(capHit),
//         cap_space: String(capSpace),
//         dead_cap: String(a.dead_cap),
//       };
//     });

//     setHeadInfo(headWithAgg);
//     setFilteredHeadInfo(headWithAgg);
//   }, []);

//   useEffect(() => {
//     fetchAll();
//   }, [fetchAll]);

//   // ============================================================
//   // Фильтрация
//   // ============================================================
//   const safeStringCompareHead = (
//     value: string | null | undefined,
//     filter: string,
//   ): boolean => {
//     if (!value) return false;
//     return value.toLowerCase().includes(filter.toLowerCase());
//   };

//   useEffect(() => {
//     let result = headInfo;
//     Object.entries(filters).forEach(([key, value]) => {
//       if (value) {
//         result = result.filter((h) =>
//           safeStringCompareHead(h[key as keyof Head], value),
//         );
//       }
//     });
//     setFilteredHeadInfo(result);
//   }, [filters, headInfo]);

//   const handleFilterChange = (field: keyof typeof filters, value: string) => {
//     setFilters((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleResetFilters = () => {
//     setFilters(Object.fromEntries(allColumns.map((col) => [col, ""])));
//   };

//   // ============================================================
//   // Редактирование
//   // ============================================================
//   const computedFields: (keyof Head)[] = [
//     "active_roster",
//     "g_leage",
//     "cap_hit",
//     "cap_space",
//     "dead_cap",
//   ];

//   const editableNumericFields: (keyof Head)[] = [
//     "salary_cap",
//     "cash_money",
//     "penalties",
//   ];

//   const handleEdit = (headInfo: Head) => {
//     setEditingId(headInfo.id);
//     const formattedEditData: Partial<Head> = { ...headInfo };
//     editableNumericFields.forEach((field) => {
//       const val = formattedEditData[field] as string;
//       if (val) {
//         formattedEditData[field] = cleanNumberString(val) as any;
//       }
//     });
//     setEditData(formattedEditData);
//   };

//   const handleSave = async () => {
//     if (!editingId) return;

//     const dataToSave: Partial<Head> = { ...editData };

//     computedFields.forEach((field) => {
//       delete dataToSave[field];
//     });

//     editableNumericFields.forEach((field) => {
//       const val = dataToSave[field] as string | undefined;
//       if (val) {
//         dataToSave[field] = cleanNumberString(val) as any;
//       }
//     });

//     const { error } = await supabase
//       .from("Head")
//       .update(dataToSave)
//       .eq("id", editingId);

//     if (error) {
//       console.error("Error updating headInfo:", error);
//       return;
//     }

//     setEditingId(null);
//     setEditData({});

//     await fetchAll();
//   };

//   const handleCancel = () => {
//     setEditingId(null);
//     setEditData({});
//   };

//   const handleInputChange = (field: keyof Head, value: string) => {
//     const processedValue = editableNumericFields.includes(field)
//       ? handleNumberInput(value)
//       : value;
//     setEditData((prev) => ({ ...prev, [field]: processedValue }));
//   };

//   // ============================================================
//   // Колонки
//   // ============================================================
//   const toggleColumnVisibility = (column: keyof Head) => {
//     setVisibleColumns((prev) => {
//       const newSet = new Set(prev);
//       if (newSet.has(column)) newSet.delete(column);
//       else newSet.add(column);
//       return newSet;
//     });
//   };

//   const selectAllColumns = () => setVisibleColumns(new Set(allColumns));
//   const deselectAllColumns = () => setVisibleColumns(new Set());

//   const selectGroupColumns = (columns: (keyof Head)[]) => {
//     setVisibleColumns((prev) => {
//       const newSet = new Set(prev);
//       columns.forEach((c) => newSet.add(c));
//       return newSet;
//     });
//   };
//   const deselectGroupColumns = (columns: (keyof Head)[]) => {
//     setVisibleColumns((prev) => {
//       const newSet = new Set(prev);
//       columns.forEach((c) => newSet.delete(c));
//       return newSet;
//     });
//   };

//   const columnGroups: Record<string, (keyof Head)[]> = {
//     "Basic Info": ["id", "team_name", "conference", "division", "gm"],
//     Financials: [
//       "salary_cap",
//       "cap_hit",
//       "cap_space",
//       "cash_money",
//       "dead_cap",
//       "penalties",
//     ],
//     Roster: ["active_roster", "g_leage", "extra_pos", "standing"],
//     Performance: [
//       "last_season_result",
//       "championships",
//       "regular_best",
//       "division_winner",
//       "playoffs",
//     ],
//     Coaching: ["head_coach"],
//   };

//   const numericFields: (keyof Head)[] = [
//     "salary_cap",
//     "cap_hit",
//     "cap_space",
//     "cash_money",
//     "dead_cap",
//     "penalties",
//   ];

//   return (
//     <div className="HeadInfoAgent-main">
//       {isMobile && (
//         <div className="HeadInfoAgent-mobile-view-controls">
//           <button
//             className="HeadInfoAgent-view-button"
//             onClick={() => setShowFilters(!showFilters)}
//           >
//             {showFilters ? "Hide Filters" : "Show Filters"}
//           </button>
//           <button
//             className="HeadInfoAgent-view-button"
//             onClick={() => setShowColumnSelector(!showColumnSelector)}
//           >
//             {showColumnSelector ? "Hide Columns" : "Show Columns"}
//           </button>
//         </div>
//       )}

//       {/* Column Selector */}
//       {(showColumnSelector || !isMobile) && (
//         <div className="HeadInfoAgent-column-selector">
//           <div className="HeadInfoAgent-column-selector-header">
//             <h3 className="HeadInfoAgent-column-selector-title">
//               COLUMN VISIBILITY
//             </h3>
//             <div className="HeadInfoAgent-mass-selection-buttons">
//               <button
//                 onClick={selectAllColumns}
//                 className="HeadInfoAgent-small-button"
//               >
//                 Select All
//               </button>
//               <button
//                 onClick={deselectAllColumns}
//                 className="HeadInfoAgent-small-button"
//               >
//                 Deselect All
//               </button>
//             </div>
//           </div>

//           {isMobile ? (
//             <div className="HeadInfoAgent-mobile-column-groups">
//               <div className="HeadInfoAgent-mobile-mass-selection">
//                 <div className="HeadInfoAgent-mobile-mass-buttons">
//                   <button
//                     onClick={selectAllColumns}
//                     className="HeadInfoAgent-button HeadInfoAgent-mobile-mass-button"
//                   >
//                     Select All Columns
//                   </button>
//                   <button
//                     onClick={deselectAllColumns}
//                     className="HeadInfoAgent-button HeadInfoAgent-mobile-mass-button"
//                   >
//                     Deselect All Columns
//                   </button>
//                 </div>
//               </div>
//               {Object.entries(columnGroups).map(([groupName, columns]) => (
//                 <div
//                   key={groupName}
//                   className="HeadInfoAgent-mobile-column-group"
//                 >
//                   <div className="HeadInfoAgent-mobile-column-group-title">
//                     {groupName} ({columns.length})
//                   </div>
//                   <div className="HeadInfoAgent-mobile-column-checkboxes">
//                     {columns.map((column) => (
//                       <label
//                         key={column}
//                         className="HeadInfoAgent-mobile-checkbox-label"
//                       >
//                         <input
//                           type="checkbox"
//                           checked={visibleColumns.has(column)}
//                           onChange={() => toggleColumnVisibility(column)}
//                           className="HeadInfoAgent-mobile-checkbox-input"
//                         />
//                         <span className="HeadInfoAgent-mobile-checkbox-text">
//                           {column.replace(/_/g, " ")}
//                         </span>
//                       </label>
//                     ))}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             Object.entries(columnGroups).map(([groupName, columns]) => (
//               <div key={groupName} className="HeadInfoAgent-column-group">
//                 <div className="HeadInfoAgent-column-group-title">
//                   <span>
//                     {groupName} ({columns.length})
//                   </span>
//                   <div>
//                     <button
//                       onClick={() => selectGroupColumns(columns)}
//                       className="HeadInfoAgent-small-button"
//                     >
//                       Select All
//                     </button>
//                     <button
//                       onClick={() => deselectGroupColumns(columns)}
//                       className="HeadInfoAgent-small-button"
//                     >
//                       Deselect All
//                     </button>
//                   </div>
//                 </div>
//                 <div className="HeadInfoAgent-column-checkboxes">
//                   {columns.map((column) => (
//                     <label
//                       key={column}
//                       className="HeadInfoAgent-checkbox-label"
//                     >
//                       <input
//                         type="checkbox"
//                         checked={visibleColumns.has(column)}
//                         onChange={() => toggleColumnVisibility(column)}
//                         className="HeadInfoAgent-checkbox-input"
//                       />
//                       {column.replace(/_/g, " ")}
//                     </label>
//                   ))}
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       )}

//       {/* Filters Panel */}
//       {(showFilters || !isMobile) && (
//         <div className="HeadInfoAgent-control-panel">
//           <div
//             className="HeadInfoAgent-panel-header"
//             onClick={() => setShowFilters(!showFilters)}
//           >
//             <div className="HeadInfoAgent-panel-header-text">
//               FILTER CONTROLS
//             </div>
//             <div>{showFilters ? "▲" : "▼"}</div>
//           </div>

//           {showFilters && (
//             <>
//               <div className="HeadInfoAgent-panel-content">
//                 {Object.keys(filters)
//                   .slice(0, isMobile ? 6 : Object.keys(filters).length)
//                   .map((field) => (
//                     <div key={field} className="HeadInfoAgent-filter-group">
//                       <label className="HeadInfoAgent-label">
//                         {field.replace(/_/g, " ")}
//                       </label>
//                       <input
//                         type="text"
//                         value={filters[field as keyof typeof filters]}
//                         onChange={(e) =>
//                           handleFilterChange(
//                             field as keyof typeof filters,
//                             e.target.value,
//                           )
//                         }
//                         placeholder={`Filter ${field}...`}
//                         className="HeadInfoAgent-input"
//                       />
//                     </div>
//                   ))}
//               </div>
//               <div className="HeadInfoAgent-button-group">
//                 <button
//                   onClick={handleResetFilters}
//                   className="HeadInfoAgent-button"
//                 >
//                   Reset Filters
//                 </button>
//                 <div className="HeadInfoAgent-record-count">
//                   Displaying {filteredHeadInfo.length} of {headInfo.length}{" "}
//                   records
//                 </div>
//               </div>
//             </>
//           )}
//         </div>
//       )}

//       {/* Data Table */}
//       <div className="HeadInfoAgent-table-wrapper">
//         <table className="HeadInfoAgent-table">
//           <thead>
//             <tr className="HeadInfoAgent-table-header">
//               {Array.from(visibleColumns).map((column) => (
//                 <th key={column} className="HeadInfoAgent-table-header-cell">
//                   {column.replace(/_/g, " ")}
//                 </th>
//               ))}
//               <th className="HeadInfoAgent-table-header-cell">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredHeadInfo.map((head) => (
//               <tr key={head.id} className="HeadInfoAgent-table-row">
//                 {Array.from(visibleColumns).map((column) => {
//                   const isComputed = computedFields.includes(column);
//                   let displayValue: any = head[column] || "N/A";

//                   if (
//                     numericFields.includes(column) &&
//                     displayValue !== "N/A"
//                   ) {
//                     displayValue = formatValueWithSpaces(String(displayValue));
//                   }

//                   return (
//                     <td key={column} className="HeadInfoAgent-table-cell">
//                       {editingId === head.id && !isComputed ? (
//                         <input
//                           value={(editData[column] as string) || ""}
//                           onChange={(e) =>
//                             handleInputChange(column, e.target.value)
//                           }
//                           className="HeadInfoAgent-edit-input"
//                           type="text"
//                         />
//                       ) : (
//                         <div
//                           className="HeadInfoAgent-cell-value"
//                           title={
//                             isComputed
//                               ? "Вычисляется автоматически из Players"
//                               : undefined
//                           }
//                         >
//                           {displayValue}
//                         </div>
//                       )}
//                     </td>
//                   );
//                 })}
//                 <td className="HeadInfoAgent-table-cell">
//                   {editingId === head.id ? (
//                     <div className="HeadInfoAgent-action-buttons">
//                       <button
//                         onClick={handleSave}
//                         className="HeadInfoAgent-button HeadInfoAgent-primary-button"
//                       >
//                         Save
//                       </button>
//                       <button
//                         onClick={handleCancel}
//                         className="HeadInfoAgent-button"
//                       >
//                         Cancel
//                       </button>
//                     </div>
//                   ) : (
//                     <button
//                       onClick={() => handleEdit(head)}
//                       className="HeadInfoAgent-button"
//                     >
//                       Edit
//                     </button>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default HeadAdminConsoleBody;

import React, { useEffect, useState, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  parseMoney,
  formatValueWithSpaces,
} from "../../agentControlCenter/playerConsole/playerComponents/utils/formatting";
import "./headAdminConsoleBody.css";

// 👈 ДОБАВЛЕНО: импорт хука роли
import { useRole } from "../../authorization/useRole";

type Head = {
  id: string;
  team_name: string;
  conference: string;
  division: string;
  gm: string;
  salary_cap: string;
  cap_hit: string;
  cap_space: string;
  cash_money: string;
  standing: string;
  penalties: string;
  active_roster: string;
  dead_cap: string;
  g_leage: string;
  extra_pos: string;
  last_season_result: string;
  in_team_since: string;
  championships: string;
  regular_best: string;
  division_winner: string;
  playoffs: string;
  best_result: string;
  head_coach: string;
  name_coach: string;
  coach_pg: string;
  coach_sg: string;
  coach_sf: string;
  coach_pf: string;
  coach_c: string;
  coach_star: string;
  coach_start: string;
  coach_bench: string;
  coach_g1: string;
  coach_g2: string;
  coach_g3: string;
  coach_neg: string;
  year_pick_one: string;
  draft_pick_one_1r: string;
  draft_pick_one_2r: string;
  year_pick_two: string;
  draft_pick_two_1r: string;
  draft_pick_two_2r: string;
  year_pick_three: string;
  draft_pick_three_1r: string;
  draft_pick_three_2r: string;
};

type Player = {
  id: string;
  team: string | null;
  g_league: string | null;
  year_one: string | null;
  year_two: string | null;
  year_three: string | null;
  year_four: string | null;
  year_five: string | null;
  dead_cap_team: string | null;
  dc_year_one: string | null;
  dc_year_two: string | null;
  dc_year_three: string | null;
  dc_year_four: string | null;
  dc_year_five: string | null;
};

type TeamAggregates = {
  active_roster: number;
  g_leage: number;
  cap_hit: number;
  dead_cap: number;
};

const supabase = createClient(
  "https://sgbsefgldsmzbvzvpjxt.supabase.co",
  "sb_publishable_Xl99x3YkZHWgS8l-qBSmCg_gXF_Gpcp",
);

const HeadAdminConsoleBody = () => {
  // 👈 ДОБАВЛЕНО: определяем роль и readOnly
  const { isAdmin } = useRole();
  const readOnly = !isAdmin;

  const [headInfo, setHeadInfo] = useState<Head[]>([]);
  const [filteredHeadInfo, setFilteredHeadInfo] = useState<Head[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Head>>({});
  const [showFilters, setShowFilters] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showColumnSelector, setShowColumnSelector] = useState(false);

  const [teamAggregates, setTeamAggregates] = useState<
    Record<string, TeamAggregates>
  >({});

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const allColumns: (keyof Head)[] = [
    "id",
    "team_name",
    "conference",
    "division",
    "gm",
    "salary_cap",
    "cap_hit",
    "cap_space",
    "cash_money",
    "standing",
    "penalties",
    "active_roster",
    "dead_cap",
    "g_leage",
    "extra_pos",
    "last_season_result",
    "in_team_since",
    "championships",
    "regular_best",
    "division_winner",
    "playoffs",
    "head_coach",
  ];

  const initialColumns: (keyof Head)[] = [
    "id",
    "team_name",
    "gm",
    "head_coach",
    "active_roster",
    "salary_cap",
    "cap_hit",
    "cap_space",
    "cash_money",
    "dead_cap",
    "g_leage",
  ];
  const [visibleColumns, setVisibleColumns] = useState<Set<keyof Head>>(
    new Set(initialColumns),
  );

  const [filters, setFilters] = useState<Record<string, string>>(
    Object.fromEntries(allColumns.map((col) => [col, ""])),
  );

  const cleanNumberString = (value: string): string => {
    if (!value) return "";
    return value.replace(/[^\d.-]/g, "");
  };

  const handleNumberInput = (value: string): string =>
    value.replace(/[^\d.-]/g, "");

  // ============================================================
  // 1. Загрузка Head и Players + расчёт агрегатов по командам
  // ============================================================
  const fetchAll = useCallback(async () => {
    const { data: headData, error: headError } = await supabase
      .from("Head")
      .select("*")
      .order("id");

    if (headError) {
      console.error("Error fetching Head:", headError);
      return;
    }

    const editableNumericFields = ["salary_cap", "cash_money", "penalties"];
    const cleanedHead = (headData || []).map((item) => {
      const cleaned: any = { ...item };
      editableNumericFields.forEach((field) => {
        if (cleaned[field]) {
          cleaned[field] = cleanNumberString(cleaned[field]);
        }
      });
      return cleaned as Head;
    });

    const { data: playersData, error: playersError } = await supabase
      .from("Players")
      .select(
        "id,team,g_league,year_one,year_two,year_three,year_four,year_five,dead_cap_team,dc_year_one,dc_year_two,dc_year_three,dc_year_four,dc_year_five",
      );

    if (playersError) {
      console.error("Error fetching Players:", playersError);
    }

    const players = (playersData || []) as Player[];

    const agg: Record<string, TeamAggregates> = {};

    const ensureTeam = (name: string): TeamAggregates => {
      if (!agg[name]) {
        agg[name] = {
          active_roster: 0,
          g_leage: 0,
          cap_hit: 0,
          dead_cap: 0,
        };
      }
      return agg[name];
    };

    players.forEach((p) => {
      // Активный ростер + cap hit за текущий сезон (year_one)
      if (p.team) {
        ensureTeam(p.team).active_roster += 1;
        ensureTeam(p.team).cap_hit += parseMoney(p.year_one);
      }

      // G-League
      if (p.g_league && p.g_league !== "None") {
        ensureTeam(p.g_league).g_leage += 1;
      }

      // Dead cap — только текущий сезон (dc_year_one)
      if (p.dead_cap_team && p.dead_cap_team !== "None") {
        ensureTeam(p.dead_cap_team).dead_cap += parseMoney(p.dc_year_one);
      }
    });

    // cap_hit включает dead cap (стандартная логика NHL-кэпа)
    Object.keys(agg).forEach((teamName) => {
      agg[teamName].cap_hit += agg[teamName].dead_cap;
    });

    setTeamAggregates(agg);

    const headWithAgg: Head[] = cleanedHead.map((h) => {
      const a = agg[h.team_name] || {
        active_roster: 0,
        g_leage: 0,
        cap_hit: 0,
        dead_cap: 0,
      };

      const salaryCap = parseMoney(h.salary_cap);
      const capHit = a.cap_hit;
      const capSpace = salaryCap - capHit;

      return {
        ...h,
        active_roster: `${a.active_roster}/14`,
        g_leage: `${a.g_leage}/3`,
        cap_hit: String(capHit),
        cap_space: String(capSpace),
        dead_cap: String(a.dead_cap),
      };
    });

    setHeadInfo(headWithAgg);
    setFilteredHeadInfo(headWithAgg);
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // ============================================================
  // Фильтрация
  // ============================================================
  const safeStringCompareHead = (
    value: string | null | undefined,
    filter: string,
  ): boolean => {
    if (!value) return false;
    return value.toLowerCase().includes(filter.toLowerCase());
  };

  useEffect(() => {
    let result = headInfo;
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        result = result.filter((h) =>
          safeStringCompareHead(h[key as keyof Head], value),
        );
      }
    });
    setFilteredHeadInfo(result);
  }, [filters, headInfo]);

  const handleFilterChange = (field: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleResetFilters = () => {
    setFilters(Object.fromEntries(allColumns.map((col) => [col, ""])));
  };

  // ============================================================
  // Редактирование
  // ============================================================
  const computedFields: (keyof Head)[] = [
    "active_roster",
    "g_leage",
    "cap_hit",
    "cap_space",
    "dead_cap",
  ];

  const editableNumericFields: (keyof Head)[] = [
    "salary_cap",
    "cash_money",
    "penalties",
  ];

  const handleEdit = (headInfo: Head) => {
    // 👈 ДОБАВЛЕНО: защита от вызова у не-админа
    if (readOnly) return;
    setEditingId(headInfo.id);
    const formattedEditData: Partial<Head> = { ...headInfo };
    editableNumericFields.forEach((field) => {
      const val = formattedEditData[field] as string;
      if (val) {
        formattedEditData[field] = cleanNumberString(val) as any;
      }
    });
    setEditData(formattedEditData);
  };

  const handleSave = async () => {
    // 👈 ДОБАВЛЕНО: защита от вызова у не-админа
    if (readOnly) return;
    if (!editingId) return;

    const dataToSave: Partial<Head> = { ...editData };

    computedFields.forEach((field) => {
      delete dataToSave[field];
    });

    editableNumericFields.forEach((field) => {
      const val = dataToSave[field] as string | undefined;
      if (val) {
        dataToSave[field] = cleanNumberString(val) as any;
      }
    });

    const { error } = await supabase
      .from("Head")
      .update(dataToSave)
      .eq("id", editingId);

    if (error) {
      console.error("Error updating headInfo:", error);
      return;
    }

    setEditingId(null);
    setEditData({});

    await fetchAll();
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleInputChange = (field: keyof Head, value: string) => {
    // 👈 ДОБАВЛЕНО: защита от вызова у не-админа
    if (readOnly) return;
    const processedValue = editableNumericFields.includes(field)
      ? handleNumberInput(value)
      : value;
    setEditData((prev) => ({ ...prev, [field]: processedValue }));
  };

  // ============================================================
  // Колонки
  // ============================================================
  const toggleColumnVisibility = (column: keyof Head) => {
    setVisibleColumns((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(column)) newSet.delete(column);
      else newSet.add(column);
      return newSet;
    });
  };

  const selectAllColumns = () => setVisibleColumns(new Set(allColumns));
  const deselectAllColumns = () => setVisibleColumns(new Set());

  const selectGroupColumns = (columns: (keyof Head)[]) => {
    setVisibleColumns((prev) => {
      const newSet = new Set(prev);
      columns.forEach((c) => newSet.add(c));
      return newSet;
    });
  };
  const deselectGroupColumns = (columns: (keyof Head)[]) => {
    setVisibleColumns((prev) => {
      const newSet = new Set(prev);
      columns.forEach((c) => newSet.delete(c));
      return newSet;
    });
  };

  const columnGroups: Record<string, (keyof Head)[]> = {
    "Basic Info": ["id", "team_name", "conference", "division", "gm"],
    Financials: [
      "salary_cap",
      "cap_hit",
      "cap_space",
      "cash_money",
      "dead_cap",
      "penalties",
    ],
    Roster: ["active_roster", "g_leage", "extra_pos", "standing"],
    Performance: [
      "last_season_result",
      "championships",
      "regular_best",
      "division_winner",
      "playoffs",
    ],
    Coaching: ["head_coach"],
  };

  const numericFields: (keyof Head)[] = [
    "salary_cap",
    "cap_hit",
    "cap_space",
    "cash_money",
    "dead_cap",
    "penalties",
  ];

  return (
    <div className="HeadInfoAgent-main">
      {isMobile && (
        <div className="HeadInfoAgent-mobile-view-controls">
          <button
            className="HeadInfoAgent-view-button"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
          <button
            className="HeadInfoAgent-view-button"
            onClick={() => setShowColumnSelector(!showColumnSelector)}
          >
            {showColumnSelector ? "Hide Columns" : "Show Columns"}
          </button>
        </div>
      )}

      {/* Column Selector */}
      {(showColumnSelector || !isMobile) && (
        <div className="HeadInfoAgent-column-selector">
          <div className="HeadInfoAgent-column-selector-header">
            <h3 className="HeadInfoAgent-column-selector-title">
              COLUMN VISIBILITY
            </h3>
            <div className="HeadInfoAgent-mass-selection-buttons">
              <button
                onClick={selectAllColumns}
                className="HeadInfoAgent-small-button"
              >
                Select All
              </button>
              <button
                onClick={deselectAllColumns}
                className="HeadInfoAgent-small-button"
              >
                Deselect All
              </button>
            </div>
          </div>

          {isMobile ? (
            <div className="HeadInfoAgent-mobile-column-groups">
              <div className="HeadInfoAgent-mobile-mass-selection">
                <div className="HeadInfoAgent-mobile-mass-buttons">
                  <button
                    onClick={selectAllColumns}
                    className="HeadInfoAgent-button HeadInfoAgent-mobile-mass-button"
                  >
                    Select All Columns
                  </button>
                  <button
                    onClick={deselectAllColumns}
                    className="HeadInfoAgent-button HeadInfoAgent-mobile-mass-button"
                  >
                    Deselect All Columns
                  </button>
                </div>
              </div>
              {Object.entries(columnGroups).map(([groupName, columns]) => (
                <div
                  key={groupName}
                  className="HeadInfoAgent-mobile-column-group"
                >
                  <div className="HeadInfoAgent-mobile-column-group-title">
                    {groupName} ({columns.length})
                  </div>
                  <div className="HeadInfoAgent-mobile-column-checkboxes">
                    {columns.map((column) => (
                      <label
                        key={column}
                        className="HeadInfoAgent-mobile-checkbox-label"
                      >
                        <input
                          type="checkbox"
                          checked={visibleColumns.has(column)}
                          onChange={() => toggleColumnVisibility(column)}
                          className="HeadInfoAgent-mobile-checkbox-input"
                        />
                        <span className="HeadInfoAgent-mobile-checkbox-text">
                          {column.replace(/_/g, " ")}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            Object.entries(columnGroups).map(([groupName, columns]) => (
              <div key={groupName} className="HeadInfoAgent-column-group">
                <div className="HeadInfoAgent-column-group-title">
                  <span>
                    {groupName} ({columns.length})
                  </span>
                  <div>
                    <button
                      onClick={() => selectGroupColumns(columns)}
                      className="HeadInfoAgent-small-button"
                    >
                      Select All
                    </button>
                    <button
                      onClick={() => deselectGroupColumns(columns)}
                      className="HeadInfoAgent-small-button"
                    >
                      Deselect All
                    </button>
                  </div>
                </div>
                <div className="HeadInfoAgent-column-checkboxes">
                  {columns.map((column) => (
                    <label
                      key={column}
                      className="HeadInfoAgent-checkbox-label"
                    >
                      <input
                        type="checkbox"
                        checked={visibleColumns.has(column)}
                        onChange={() => toggleColumnVisibility(column)}
                        className="HeadInfoAgent-checkbox-input"
                      />
                      {column.replace(/_/g, " ")}
                    </label>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Filters Panel */}
      {(showFilters || !isMobile) && (
        <div className="HeadInfoAgent-control-panel">
          <div
            className="HeadInfoAgent-panel-header"
            onClick={() => setShowFilters(!showFilters)}
          >
            <div className="HeadInfoAgent-panel-header-text">
              FILTER CONTROLS
            </div>
            <div>{showFilters ? "▲" : "▼"}</div>
          </div>

          {showFilters && (
            <>
              <div className="HeadInfoAgent-panel-content">
                {Object.keys(filters)
                  .slice(0, isMobile ? 6 : Object.keys(filters).length)
                  .map((field) => (
                    <div key={field} className="HeadInfoAgent-filter-group">
                      <label className="HeadInfoAgent-label">
                        {field.replace(/_/g, " ")}
                      </label>
                      <input
                        type="text"
                        value={filters[field as keyof typeof filters]}
                        onChange={(e) =>
                          handleFilterChange(
                            field as keyof typeof filters,
                            e.target.value,
                          )
                        }
                        placeholder={`Filter ${field}...`}
                        className="HeadInfoAgent-input"
                      />
                    </div>
                  ))}
              </div>
              <div className="HeadInfoAgent-button-group">
                <button
                  onClick={handleResetFilters}
                  className="HeadInfoAgent-button"
                >
                  Reset Filters
                </button>
                <div className="HeadInfoAgent-record-count">
                  Displaying {filteredHeadInfo.length} of {headInfo.length}{" "}
                  records
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Data Table */}
      <div className="HeadInfoAgent-table-wrapper">
        <table className="HeadInfoAgent-table">
          <thead>
            <tr className="HeadInfoAgent-table-header">
              {Array.from(visibleColumns).map((column) => (
                <th key={column} className="HeadInfoAgent-table-header-cell">
                  {column.replace(/_/g, " ")}
                </th>
              ))}
              {/* 👈 ИЗМЕНЕНО: колонка Actions — только для админа */}
              {isAdmin && (
                <th className="HeadInfoAgent-table-header-cell">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {filteredHeadInfo.map((head) => (
              <tr key={head.id} className="HeadInfoAgent-table-row">
                {Array.from(visibleColumns).map((column) => {
                  const isComputed = computedFields.includes(column);
                  let displayValue: any = head[column] || "N/A";

                  if (
                    numericFields.includes(column) &&
                    displayValue !== "N/A"
                  ) {
                    displayValue = formatValueWithSpaces(String(displayValue));
                  }

                  return (
                    <td key={column} className="HeadInfoAgent-table-cell">
                      {/* 👈 ИЗМЕНЕНО: режим редактирования — только для админа */}
                      {isAdmin && editingId === head.id && !isComputed ? (
                        <input
                          value={(editData[column] as string) || ""}
                          onChange={(e) =>
                            handleInputChange(column, e.target.value)
                          }
                          className="HeadInfoAgent-edit-input"
                          type="text"
                        />
                      ) : (
                        <div
                          className="HeadInfoAgent-cell-value"
                          title={
                            isComputed
                              ? "Вычисляется автоматически из Players"
                              : undefined
                          }
                        >
                          {displayValue}
                        </div>
                      )}
                    </td>
                  );
                })}
                {/* 👈 ИЗМЕНЕНО: кнопки действий — только для админа */}
                {isAdmin && (
                  <td className="HeadInfoAgent-table-cell">
                    {editingId === head.id ? (
                      <div className="HeadInfoAgent-action-buttons">
                        <button
                          onClick={handleSave}
                          className="HeadInfoAgent-button HeadInfoAgent-primary-button"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancel}
                          className="HeadInfoAgent-button"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEdit(head)}
                        className="HeadInfoAgent-button"
                      >
                        Edit
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HeadAdminConsoleBody;
