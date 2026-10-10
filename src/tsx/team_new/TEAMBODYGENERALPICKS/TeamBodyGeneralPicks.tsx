// import React, { useState } from "react";
// import { supabase } from "../../../Supabase";

// // Тип для одного пика с примечанием
// type PickItem = {
//   year: string;
//   round: string;
//   value: string | number;
//   note?: string | null; // примечание (опционально)
// };

// // Тип для пропсов
// type TeamBodyGeneralPicksProps = {
//   teamName: string;
// };

// // Маппинг колонок: теперь с полем noteCol
// const columnsMapping: Array<{
//   teamCol: string;
//   pickCol: string;
//   noteCol: string;
//   year: string;
//   round: string;
// }> = [
//   {
//     teamCol: "team1R26",
//     pickCol: "1R26",
//     noteCol: "note1R26",
//     year: "2026",
//     round: "1",
//   },
//   {
//     teamCol: "team2R26",
//     pickCol: "2R26",
//     noteCol: "note2R26",
//     year: "2026",
//     round: "2",
//   },
//   {
//     teamCol: "team1R27",
//     pickCol: "1R27",
//     noteCol: "note1R27",
//     year: "2027",
//     round: "1",
//   },
//   {
//     teamCol: "team2R27",
//     pickCol: "2R27",
//     noteCol: "note2R27",
//     year: "2027",
//     round: "2",
//   },
//   {
//     teamCol: "team1R28",
//     pickCol: "1R28",
//     noteCol: "note1R28",
//     year: "2028",
//     round: "1",
//   },
//   {
//     teamCol: "team2R28",
//     pickCol: "2R28",
//     noteCol: "note2R28",
//     year: "2028",
//     round: "2",
//   },
// ];

// const TeamBodyGeneralPicks = ({ teamName }: TeamBodyGeneralPicksProps) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [picks, setPicks] = useState<PickItem[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const fetchPicks = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const { data, error: supabaseError } = await supabase
//         .from("Picks")
//         .select("*")
//         .or(columnsMapping.map((m) => `${m.teamCol}.eq.${teamName}`).join(","));

//       if (supabaseError) throw supabaseError;

//       const results: PickItem[] = [];
//       (data as any[]).forEach((row) => {
//         columnsMapping.forEach(({ teamCol, pickCol, noteCol, year, round }) => {
//           if (row[teamCol] === teamName && row[pickCol]) {
//             results.push({
//               year,
//               round,
//               value: row[pickCol],
//               note: row[noteCol] || null, // если примечания нет, будет null
//             });
//           }
//         });
//       });

//       setPicks(results);
//     } catch (err) {
//       console.error("Ошибка загрузки пиков:", err);
//       setError("Не удалось загрузить пики");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const openModal = () => {
//     setIsOpen(true);
//     fetchPicks();
//   };

//   const closeModal = () => {
//     setIsOpen(false);
//     setPicks([]);
//     setError(null);
//   };

//   // Группировка пиков по году и раунду (для удобного отображения)
//   const groupedPicks = picks.reduce<Record<string, PickItem[]>>((acc, pick) => {
//     const key = `${pick.year} - Раунд ${pick.round}`;
//     if (!acc[key]) acc[key] = [];
//     acc[key].push(pick);
//     return acc;
//   }, {});

//   return (
//     <>
//       <button
//         onClick={openModal}
//         className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
//       >
//         Пики
//       </button>

//       {isOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
//           <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative max-h-[80vh] overflow-y-auto">
//             <button
//               onClick={closeModal}
//               className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl"
//             >
//               ✕
//             </button>
//             <h2 className="text-2xl font-bold mb-4">Пики команды {teamName}</h2>

//             {loading && <div className="text-center py-4">Загрузка...</div>}
//             {error && (
//               <div className="text-red-500 text-center py-4">{error}</div>
//             )}

//             {!loading && !error && (
//               <div className="space-y-4">
//                 {Object.keys(groupedPicks).length === 0 ? (
//                   <p className="text-gray-500 text-center">
//                     Нет пиков для этой команды
//                   </p>
//                 ) : (
//                   Object.entries(groupedPicks).map(([title, picksList]) => (
//                     <div key={title}>
//                       <h3 className="font-semibold text-lg border-b pb-1">
//                         {title}
//                       </h3>
//                       <ul className="mt-2 space-y-2">
//                         {picksList.map((pick, idx) => (
//                           <li key={idx} className="text-gray-700">
//                             <div>• {pick.value}</div>
//                             {pick.note && (
//                               <div className="text-sm text-gray-500 ml-4 italic">
//                                 Примечание: {pick.note}
//                               </div>
//                             )}
//                           </li>
//                         ))}
//                       </ul>
//                     </div>
//                   ))
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default TeamBodyGeneralPicks;
// TeamBodyGeneralPicks.tsx
import React, { useState } from "react";
import { supabase } from "../../../Supabase";
import "./teamBodyGeneralPicks.css";

type PickItem = {
  year: string;
  round: string;
  value: string | number;
  note?: string | null;
};

type TeamBodyGeneralPicksProps = {
  teamName: string;
};

const columnsMapping = [
  {
    teamCol: "team1R26",
    pickCol: "1R26",
    noteCol: "note1R26",
    year: "2026",
    round: "1",
  },
  {
    teamCol: "team2R26",
    pickCol: "2R26",
    noteCol: "note2R26",
    year: "2026",
    round: "2",
  },
  {
    teamCol: "team1R27",
    pickCol: "1R27",
    noteCol: "note1R27",
    year: "2027",
    round: "1",
  },
  {
    teamCol: "team2R27",
    pickCol: "2R27",
    noteCol: "note2R27",
    year: "2027",
    round: "2",
  },
  {
    teamCol: "team1R28",
    pickCol: "1R28",
    noteCol: "note1R28",
    year: "2028",
    round: "1",
  },
  {
    teamCol: "team2R28",
    pickCol: "2R28",
    noteCol: "note2R28",
    year: "2028",
    round: "2",
  },
];

const TeamBodyGeneralPicks = ({ teamName }: TeamBodyGeneralPicksProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [picks, setPicks] = useState<PickItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPicks = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: supabaseError } = await supabase
        .from("Picks")
        .select("*")
        .or(columnsMapping.map((m) => `${m.teamCol}.eq.${teamName}`).join(","));

      if (supabaseError) throw supabaseError;

      const results: PickItem[] = [];
      (data as any[]).forEach((row) => {
        columnsMapping.forEach(({ teamCol, pickCol, noteCol, year, round }) => {
          if (row[teamCol] === teamName && row[pickCol]) {
            results.push({
              year,
              round,
              value: row[pickCol],
              note: row[noteCol] || null,
            });
          }
        });
      });

      results.sort((a, b) => {
        if (a.year !== b.year) return parseInt(a.year) - parseInt(b.year);
        return parseInt(a.round) - parseInt(b.round);
      });

      setPicks(results);
    } catch (err) {
      console.error("Ошибка загрузки пиков:", err);
      setError("Не удалось загрузить пики");
    } finally {
      setLoading(false);
    }
  };

  const openModal = () => {
    setIsOpen(true);
    fetchPicks();
  };

  const closeModal = () => {
    setIsOpen(false);
    setPicks([]);
    setError(null);
  };

  const groupedByYear = picks.reduce<
    Record<string, Record<string, PickItem[]>>
  >((acc, pick) => {
    if (!acc[pick.year]) acc[pick.year] = {};
    if (!acc[pick.year][pick.round]) acc[pick.year][pick.round] = [];
    acc[pick.year][pick.round].push(pick);
    return acc;
  }, {});

  return (
    <>
      <button className="general-picks-button" onClick={openModal}>
        Пики
      </button>

      {isOpen && (
        <div className="general-picks-modal-overlay" onClick={closeModal}>
          <div
            className="general-picks-modal-container"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="general-picks-modal-header">
              <h2 className="general-picks-modal-title">
                Пики команды {teamName}
              </h2>
              <button
                className="general-picks-modal-close"
                onClick={closeModal}
              >
                ✕
              </button>
            </div>

            <div className="general-picks-modal-content">
              {loading && (
                <div className="general-picks-loading-state">
                  <div className="general-picks-spinner"></div>
                  <p>Загрузка пиков...</p>
                </div>
              )}

              {error && (
                <div className="general-picks-error-state">{error}</div>
              )}

              {!loading && !error && (
                <>
                  {Object.keys(groupedByYear).length === 0 ? (
                    <div className="general-picks-empty-state">
                      Нет пиков для этой команды
                    </div>
                  ) : (
                    <div className="general-picks-list">
                      {Object.entries(groupedByYear)
                        .sort(([a], [b]) => parseInt(a) - parseInt(b))
                        .map(([year, rounds]) => (
                          <div key={year} className="general-picks-year-card">
                            <h3 className="general-picks-year-title">{year}</h3>
                            <div className="general-picks-rounds-grid">
                              {/* Раунд 1 */}
                              <div className="general-picks-round-card">
                                <div className="general-picks-round-header">
                                  <h4 className="general-picks-round-title">
                                    1-й раунд
                                  </h4>
                                </div>
                                {rounds["1"]?.length ? (
                                  rounds["1"].map((pick, idx) => (
                                    <div
                                      key={idx}
                                      className="general-picks-pick-value"
                                    >
                                      {pick.value}
                                      {pick.note && (
                                        <div className="general-picks-pick-note">
                                          {pick.note}
                                        </div>
                                      )}
                                    </div>
                                  ))
                                ) : (
                                  <div className="general-picks-no-pick">
                                    Нет пика
                                  </div>
                                )}
                              </div>

                              {/* Раунд 2 */}
                              <div className="general-picks-round-card">
                                <div className="general-picks-round-header">
                                  <h4 className="general-picks-round-title">
                                    2-й раунд
                                  </h4>
                                </div>
                                {rounds["2"]?.length ? (
                                  rounds["2"].map((pick, idx) => (
                                    <div
                                      key={idx}
                                      className="general-picks-pick-value"
                                    >
                                      {pick.value}
                                      {pick.note && (
                                        <div className="general-picks-pick-note">
                                          {pick.note}
                                        </div>
                                      )}
                                    </div>
                                  ))
                                ) : (
                                  <div className="general-picks-no-pick">
                                    Нет пика
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="general-picks-modal-footer">Данные о пиках</div>
          </div>
        </div>
      )}
    </>
  );
};

export default TeamBodyGeneralPicks;
