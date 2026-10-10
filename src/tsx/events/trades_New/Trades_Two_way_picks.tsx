// import React, { useState, useEffect } from "react";
// import { supabase } from "../../../Supabase";

// interface PickItem {
//   id: string;
//   label: string;
//   team: string;
//   note?: string;
// }

// interface Trades_Two_way_picksProps {
//   myTeam: string;
//   theirTeam: string;
//   onBack: () => void;
//   onSubmit: (
//     mySelectedPicks: PickItem[],
//     theirSelectedPicks: PickItem[],
//   ) => void;
// }

// type PicksRecord = {
//   "1R26": string | null;
//   "2R26": string | null;
//   "1R27": string | null;
//   "2R27": string | null;
//   "1R28": string | null;
//   "2R28": string | null;
//   team1R26: string | null;
//   team2R26: string | null;
//   team1R27: string | null;
//   team2R27: string | null;
//   team1R28: string | null;
//   team2R28: string | null;
//   note1R26: string | null;
//   note2R26: string | null;
//   note1R27: string | null;
//   note2R27: string | null;
//   note1R28: string | null;
//   note2R28: string | null;
// };

// const Trades_Two_way_picks: React.FC<Trades_Two_way_picksProps> = ({
//   myTeam,
//   theirTeam,
//   onBack,
//   onSubmit,
// }) => {
//   const [myPicks, setMyPicks] = useState<PickItem[]>([]);
//   const [theirPicks, setTheirPicks] = useState<PickItem[]>([]);
//   const [selectedMyPicks, setSelectedMyPicks] = useState<string[]>([]);
//   const [selectedTheirPicks, setSelectedTheirPicks] = useState<string[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [notes, setNotes] = useState<Record<string, string>>({});

//   const normalizeTeam = (team: string | null): string => {
//     if (!team) return "";
//     return team.trim().toLowerCase();
//   };

//   useEffect(() => {
//     const fetchPicks = async () => {
//       setLoading(true);
//       try {
//         const { data, error } = await supabase
//           .from("Picks")
//           .select(
//             "1R26, 2R26, 1R27, 2R27, 1R28, 2R28, " +
//               "team1R26, team2R26, team1R27, team2R27, team1R28, team2R28, " +
//               "note1R26, note2R26, note1R27, note2R27, note1R28, note2R28",
//           );

//         if (error) throw error;

//         if (!data || data.length === 0) {
//           setMyPicks([]);
//           setTheirPicks([]);
//           return;
//         }

//         const pickDefinitions = [
//           {
//             id: "1R26",
//             label: "1st round 2026",
//             teamCol: "team1R26" as const,
//             noteCol: "note1R26" as const,
//           },
//           {
//             id: "2R26",
//             label: "2nd round 2026",
//             teamCol: "team2R26" as const,
//             noteCol: "note2R26" as const,
//           },
//           {
//             id: "1R27",
//             label: "1st round 2027",
//             teamCol: "team1R27" as const,
//             noteCol: "note1R27" as const,
//           },
//           {
//             id: "2R27",
//             label: "2nd round 2027",
//             teamCol: "team2R27" as const,
//             noteCol: "note2R27" as const,
//           },
//           {
//             id: "1R28",
//             label: "1st round 2028",
//             teamCol: "team1R28" as const,
//             noteCol: "note1R28" as const,
//           },
//           {
//             id: "2R28",
//             label: "2nd round 2028",
//             teamCol: "team2R28" as const,
//             noteCol: "note2R28" as const,
//           },
//         ];

//         const my: PickItem[] = [];
//         const their: PickItem[] = [];
//         const initialNotes: Record<string, string> = {};

//         for (const row of data) {
//           if (!row || typeof row !== "object") continue;
//           const record = row as unknown as PicksRecord;
//           for (const def of pickDefinitions) {
//             const teamOwnerRaw = record[def.teamCol];
//             if (!teamOwnerRaw) continue;

//             const teamOwnerNorm = normalizeTeam(teamOwnerRaw);
//             const myTeamNorm = normalizeTeam(myTeam);
//             const theirTeamNorm = normalizeTeam(theirTeam);

//             const note = record[def.noteCol] || "";
//             const pickItem: PickItem = {
//               id: def.id,
//               label: def.label,
//               team: teamOwnerRaw,
//               note: note,
//             };

//             if (teamOwnerNorm === myTeamNorm) {
//               my.push(pickItem);
//               initialNotes[def.id] = note;
//             } else if (teamOwnerNorm === theirTeamNorm) {
//               their.push(pickItem);
//               initialNotes[def.id] = note;
//             }
//           }
//         }

//         const uniqueMy = Array.from(new Map(my.map((p) => [p.id, p])).values());
//         const uniqueTheir = Array.from(
//           new Map(their.map((p) => [p.id, p])).values(),
//         );

//         setMyPicks(uniqueMy);
//         setTheirPicks(uniqueTheir);
//         setNotes(initialNotes);
//       } catch (err) {
//         console.error("Ошибка загрузки драфт-пиков:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (myTeam && theirTeam) {
//       fetchPicks();
//     }
//   }, [myTeam, theirTeam]);

//   const toggleMyPick = (pickId: string) => {
//     setSelectedMyPicks((prev) =>
//       prev.includes(pickId)
//         ? prev.filter((id) => id !== pickId)
//         : [...prev, pickId],
//     );
//   };

//   const toggleTheirPick = (pickId: string) => {
//     setSelectedTheirPicks((prev) =>
//       prev.includes(pickId)
//         ? prev.filter((id) => id !== pickId)
//         : [...prev, pickId],
//     );
//   };

//   const handleNoteChange = (pickId: string, newNote: string) => {
//     setNotes((prev) => ({ ...prev, [pickId]: newNote }));
//   };

//   const handleSubmit = () => {
//     const mySelectedObjects = myPicks
//       .filter((p) => selectedMyPicks.includes(p.id))
//       .map((p) => ({ ...p, note: notes[p.id] || "" }));
//     const theirSelectedObjects = theirPicks
//       .filter((p) => selectedTheirPicks.includes(p.id))
//       .map((p) => ({ ...p, note: notes[p.id] || "" }));
//     onSubmit(mySelectedObjects, theirSelectedObjects);
//   };

//   const renderPickItem = (pick: PickItem, isMy: boolean) => {
//     const isSelected = isMy
//       ? selectedMyPicks.includes(pick.id)
//       : selectedTheirPicks.includes(pick.id);
//     const toggle = isMy
//       ? () => toggleMyPick(pick.id)
//       : () => toggleTheirPick(pick.id);
//     const currentNote = notes[pick.id] || "";

//     return (
//       <li key={pick.id} style={{ marginBottom: "12px" }}>
//         <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//           <input type="checkbox" checked={isSelected} onChange={toggle} />
//           <span style={{ fontWeight: 500 }}>{pick.label}</span>
//         </label>
//         <div style={{ marginLeft: "24px", marginTop: "6px" }}>
//           <input
//             type="text"
//             value={currentNote}
//             onChange={(e) => handleNoteChange(pick.id, e.target.value)}
//             placeholder="Примечание к пику (опционально)"
//             disabled={!isSelected}
//             style={{
//               width: "100%",
//               padding: "6px 8px",
//               fontSize: "0.9em",
//               borderRadius: "4px",
//               border: "1px solid #ccc",
//               backgroundColor: isSelected ? "#fff" : "#f5f5f5",
//               cursor: isSelected ? "text" : "default",
//             }}
//           />
//         </div>
//       </li>
//     );
//   };

//   if (loading) return <div className="loading">Загрузка драфт-пиков...</div>;

//   return (
//     <div className="trades-players-container">
//       <div className="players-column">
//         <h4>Ваши драфт-пики: {myTeam}</h4>
//         {myPicks.length === 0 ? (
//           <p>Нет драфт-пиков</p>
//         ) : (
//           <ul style={{ listStyle: "none", paddingLeft: 0 }}>
//             {myPicks.map((pick) => renderPickItem(pick, true))}
//           </ul>
//         )}
//       </div>

//       <div className="players-column">
//         <h4>Драфт-пики соперника: {theirTeam}</h4>
//         {theirPicks.length === 0 ? (
//           <p>Нет драфт-пиков</p>
//         ) : (
//           <ul style={{ listStyle: "none", paddingLeft: 0 }}>
//             {theirPicks.map((pick) => renderPickItem(pick, false))}
//           </ul>
//         )}
//       </div>

//       <div className="trades-actions">
//         <button onClick={onBack} className="back-button">
//           Назад
//         </button>
//         <button onClick={handleSubmit} className="submit-trade-button">
//           Далее
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Trades_Two_way_picks;

import React, { useState, useEffect } from "react";
import { supabase } from "../../../Supabase";
import "./trades_Two_way_picks.css";

interface PickItem {
  id: string;
  label: string;
  team: string;
  note?: string;
}

interface Trades_Two_way_picksProps {
  myTeam: string;
  theirTeam: string;
  onBack: () => void;
  onSubmit: (
    mySelectedPicks: PickItem[],
    theirSelectedPicks: PickItem[],
  ) => void;
}

type PicksRecord = {
  "1R26": string | null;
  "2R26": string | null;
  "1R27": string | null;
  "2R27": string | null;
  "1R28": string | null;
  "2R28": string | null;
  team1R26: string | null;
  team2R26: string | null;
  team1R27: string | null;
  team2R27: string | null;
  team1R28: string | null;
  team2R28: string | null;
  note1R26: string | null;
  note2R26: string | null;
  note1R27: string | null;
  note2R27: string | null;
  note1R28: string | null;
  note2R28: string | null;
};

const Trades_Two_way_picks: React.FC<Trades_Two_way_picksProps> = ({
  myTeam,
  theirTeam,
  onBack,
  onSubmit,
}) => {
  const [myPicks, setMyPicks] = useState<PickItem[]>([]);
  const [theirPicks, setTheirPicks] = useState<PickItem[]>([]);
  const [selectedMyPicks, setSelectedMyPicks] = useState<string[]>([]);
  const [selectedTheirPicks, setSelectedTheirPicks] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState<Record<string, string>>({});

  const normalizeTeam = (team: string | null): string => {
    if (!team) return "";
    return team.trim().toLowerCase();
  };

  useEffect(() => {
    const fetchPicks = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("Picks")
          .select(
            "1R26, 2R26, 1R27, 2R27, 1R28, 2R28, " +
              "team1R26, team2R26, team1R27, team2R27, team1R28, team2R28, " +
              "note1R26, note2R26, note1R27, note2R27, note1R28, note2R28",
          );

        if (error) throw error;

        if (!data || data.length === 0) {
          setMyPicks([]);
          setTheirPicks([]);
          return;
        }

        const pickDefinitions = [
          {
            id: "1R26",
            label: "1st round 2026",
            teamCol: "team1R26" as const,
            noteCol: "note1R26" as const,
          },
          {
            id: "2R26",
            label: "2nd round 2026",
            teamCol: "team2R26" as const,
            noteCol: "note2R26" as const,
          },
          {
            id: "1R27",
            label: "1st round 2027",
            teamCol: "team1R27" as const,
            noteCol: "note1R27" as const,
          },
          {
            id: "2R27",
            label: "2nd round 2027",
            teamCol: "team2R27" as const,
            noteCol: "note2R27" as const,
          },
          {
            id: "1R28",
            label: "1st round 2028",
            teamCol: "team1R28" as const,
            noteCol: "note1R28" as const,
          },
          {
            id: "2R28",
            label: "2nd round 2028",
            teamCol: "team2R28" as const,
            noteCol: "note2R28" as const,
          },
        ];

        const my: PickItem[] = [];
        const their: PickItem[] = [];
        const initialNotes: Record<string, string> = {};

        for (const row of data) {
          if (!row || typeof row !== "object") continue;
          const record = row as unknown as PicksRecord;
          for (const def of pickDefinitions) {
            const teamOwnerRaw = record[def.teamCol];
            if (!teamOwnerRaw) continue;

            const teamOwnerNorm = normalizeTeam(teamOwnerRaw);
            const myTeamNorm = normalizeTeam(myTeam);
            const theirTeamNorm = normalizeTeam(theirTeam);

            const note = record[def.noteCol] || "";
            const pickItem: PickItem = {
              id: def.id,
              label: def.label,
              team: teamOwnerRaw,
              note: note,
            };

            if (teamOwnerNorm === myTeamNorm) {
              my.push(pickItem);
              initialNotes[def.id] = note;
            } else if (teamOwnerNorm === theirTeamNorm) {
              their.push(pickItem);
              initialNotes[def.id] = note;
            }
          }
        }

        const uniqueMy = Array.from(new Map(my.map((p) => [p.id, p])).values());
        const uniqueTheir = Array.from(
          new Map(their.map((p) => [p.id, p])).values(),
        );

        setMyPicks(uniqueMy);
        setTheirPicks(uniqueTheir);
        setNotes(initialNotes);
      } catch (err) {
        console.error("Ошибка загрузки драфт-пиков:", err);
      } finally {
        setLoading(false);
      }
    };

    if (myTeam && theirTeam) {
      fetchPicks();
    }
  }, [myTeam, theirTeam]);

  const toggleMyPick = (pickId: string) => {
    setSelectedMyPicks((prev) =>
      prev.includes(pickId)
        ? prev.filter((id) => id !== pickId)
        : [...prev, pickId],
    );
  };

  const toggleTheirPick = (pickId: string) => {
    setSelectedTheirPicks((prev) =>
      prev.includes(pickId)
        ? prev.filter((id) => id !== pickId)
        : [...prev, pickId],
    );
  };

  const handleNoteChange = (pickId: string, newNote: string) => {
    setNotes((prev) => ({ ...prev, [pickId]: newNote }));
  };

  const handleSubmit = () => {
    const mySelectedObjects = myPicks
      .filter((p) => selectedMyPicks.includes(p.id))
      .map((p) => ({ ...p, note: notes[p.id] || "" }));
    const theirSelectedObjects = theirPicks
      .filter((p) => selectedTheirPicks.includes(p.id))
      .map((p) => ({ ...p, note: notes[p.id] || "" }));
    onSubmit(mySelectedObjects, theirSelectedObjects);
  };

  const renderPickItem = (pick: PickItem, isMy: boolean) => {
    const isSelected = isMy
      ? selectedMyPicks.includes(pick.id)
      : selectedTheirPicks.includes(pick.id);
    const toggle = isMy
      ? () => toggleMyPick(pick.id)
      : () => toggleTheirPick(pick.id);
    const currentNote = notes[pick.id] || "";

    return (
      <li key={pick.id} className="Trades_Two_way_picks-item">
        <label className="Trades_Two_way_picks-checkbox-label">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={toggle}
            className="Trades_Two_way_picks-checkbox"
          />
          <span className="Trades_Two_way_picks-label">{pick.label}</span>
        </label>
        <div className="Trades_Two_way_picks-note-container">
          <input
            type="text"
            value={currentNote}
            onChange={(e) => handleNoteChange(pick.id, e.target.value)}
            placeholder="Примечание к пику (опционально)"
            disabled={!isSelected}
            className={`Trades_Two_way_picks-note-input ${
              isSelected
                ? "Trades_Two_way_picks-note-input-enabled"
                : "Trades_Two_way_picks-note-input-disabled"
            }`}
          />
        </div>
      </li>
    );
  };

  if (loading)
    return (
      <div className="Trades_Two_way_picks-loading">
        Загрузка драфт-пиков...
      </div>
    );

  return (
    <div className="Trades_Two_way_picks-container">
      <div className="Trades_Two_way_picks-columns">
        <div className="Trades_Two_way_picks-column">
          <h4 className="Trades_Two_way_picks-title">
            Ваши драфт-пики: {myTeam}
          </h4>
          {myPicks.length === 0 ? (
            <p className="Trades_Two_way_picks-empty">Нет драфт-пиков</p>
          ) : (
            <ul className="Trades_Two_way_picks-list">
              {myPicks.map((pick) => renderPickItem(pick, true))}
            </ul>
          )}
        </div>

        <div className="Trades_Two_way_picks-column">
          <h4 className="Trades_Two_way_picks-title">
            Драфт-пики соперника: {theirTeam}
          </h4>
          {theirPicks.length === 0 ? (
            <p className="Trades_Two_way_picks-empty">Нет драфт-пиков</p>
          ) : (
            <ul className="Trades_Two_way_picks-list">
              {theirPicks.map((pick) => renderPickItem(pick, false))}
            </ul>
          )}
        </div>
      </div>

      <div className="Trades_Two_way_picks-actions">
        <button
          onClick={onBack}
          className="Trades_Two_way_picks-button Trades_Two_way_picks-button-back"
        >
          Назад
        </button>
        <button
          onClick={handleSubmit}
          className="Trades_Two_way_picks-button Trades_Two_way_picks-button-next"
        >
          Далее
        </button>
      </div>
    </div>
  );
};

export default Trades_Two_way_picks;
