// import React, { useState, useEffect, useRef, useCallback } from "react";
// import { supabase } from "../../../Supabase";
// import "./tournament.css";

// interface Team {
//   path: string;
// }

// interface Matchup {
//   id: number;
//   team1: Team | null;
//   team2: Team | null;
//   round: number;
//   score1: number; // Добавлено: счет первой команды
//   score2: number; // Добавлено: счет второй команды
// }

// interface ConferenceData {
//   matchups: Matchup[];
//   expandedRounds: number[];
// }

// interface DropdownInfo {
//   conference: "west" | "east" | "finals";
//   matchupId?: number;
//   slot: "team1" | "team2" | "west" | "east";
//   position: { top: number; left: number } | null;
// }

// const CONFERENCE_CONFIG = {
//   west: { title: "Western Conference", color: "blue", startId: 1 },
//   east: { title: "Eastern Conference", color: "red", startId: 9 },
// } as const;

// const ROUND_CONFIG = [
//   { round: 1, title: "First Round" },
//   { round: 2, title: "Semifinals" },
//   { round: 3, title: "Conference Finals" },
//   { round: 4, title: "Conference Champion" },
// ] as const;

// const MAX_SCORE = 4; // Максимальное количество побед в серии

// const ScoreDisplay: React.FC<{
//   score1: number;
//   score2: number;
//   isFinals?: boolean;
// }> = ({ score1, score2, isFinals = false }) => (
//   <div className={`score-display ${isFinals ? "finals-score" : ""}`}>
//     <div className="score-team">{score1}</div>
//     <div className="score-separator">-</div>
//     <div className="score-team">{score2}</div>
//   </div>
// );

// const TeamSlot: React.FC<{
//   type: "west" | "east" | "finals";
//   matchupId: number;
//   slot: "team1" | "team2" | "west" | "east";
//   team: Team | null;
//   placeholder: string;
//   isActive: boolean;
//   onClick: (e: React.MouseEvent) => void;
// }> = ({ type, team, placeholder, isActive, onClick }) => (
//   <div className="team-slot-container">
//     <div
//       className={`team-slot ${isActive ? "active" : ""} ${
//         type === "finals" ? "finals-slot" : ""
//       }`}
//       onClick={onClick}
//     >
//       <div className="team-content">
//         {team ? (
//           <img
//             src={`/img/${team.path}`}
//             alt=""
//             className={`team-logo ${type === "finals" ? "finals-logo" : ""}`}
//             onError={(e) => (e.currentTarget.src = "/img/placeholder.png")}
//           />
//         ) : (
//           <span className="placeholder">{placeholder}</span>
//         )}
//       </div>
//     </div>
//   </div>
// );

// const createInitialMatchups = (startId: number): Matchup[] => {
//   const matchups: Matchup[] = [];
//   let id = startId;
//   const rounds = [4, 2, 1, 1];

//   rounds.forEach((count, roundIndex) => {
//     for (let i = 0; i < count; i++) {
//       matchups.push({
//         id: id++,
//         team1: null,
//         team2: null,
//         round: roundIndex + 1,
//         score1: 0,
//         score2: 0,
//       });
//     }
//   });

//   return matchups;
// };

// const TournamentM = () => {
//   const [teams, setTeams] = useState<Team[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [isMobile, setIsMobile] = useState(false);
//   const [dropdownInfo, setDropdownInfo] = useState<DropdownInfo | null>(null);
//   const containerRef = useRef<HTMLDivElement>(null);
//   const dropdownRef = useRef<HTMLDivElement>(null);

//   const [conferences, setConferences] = useState({
//     west: {
//       matchups: createInitialMatchups(CONFERENCE_CONFIG.west.startId),
//       expandedRounds: [1],
//     },
//     east: {
//       matchups: createInitialMatchups(CONFERENCE_CONFIG.east.startId),
//       expandedRounds: [1],
//     },
//   });

//   const [finals, setFinals] = useState({
//     west: null as Team | null,
//     east: null as Team | null,
//     scoreWest: 0, // Добавлено: счет западной команды в финале
//     scoreEast: 0, // Добавлено: счет восточной команды в финале
//   });

//   useEffect(() => {
//     const loadData = async () => {
//       await fetchTeams();
//       setIsMobile(window.innerWidth <= 767);
//     };
//     loadData();
//     window.addEventListener("resize", () =>
//       setIsMobile(window.innerWidth <= 767)
//     );
//     return () =>
//       window.removeEventListener("resize", () =>
//         setIsMobile(window.innerWidth <= 767)
//       );
//   }, []);

//   useEffect(() => {
//     if (isMobile && dropdownInfo) {
//       document.body.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "";
//     }
//     return () => {
//       document.body.style.overflow = "";
//     };
//   }, [dropdownInfo, isMobile]);

//   const fetchTeams = async () => {
//     try {
//       const { data, error } = await supabase
//         .from("IMG_path")
//         .select("path")
//         .order("path", { ascending: true });

//       if (error) throw error;

//       const teamData = (data || []).map((item) => ({ path: item.path }));
//       setTeams(teamData);
//     } catch (error) {
//       console.error("Ошибка при загрузке команд:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateMatchupScore = useCallback(
//     (
//       conference: "west" | "east",
//       matchupId: number,
//       teamSlot: "team1" | "team2",
//       delta: number
//     ) => {
//       setConferences((prev) => ({
//         ...prev,
//         [conference]: {
//           ...prev[conference],
//           matchups: prev[conference].matchups.map((matchup) => {
//             if (matchup.id === matchupId) {
//               if (teamSlot === "team1") {
//                 const newScore = Math.max(
//                   0,
//                   Math.min(MAX_SCORE, matchup.score1 + delta)
//                 );
//                 return { ...matchup, score1: newScore };
//               } else {
//                 const newScore = Math.max(
//                   0,
//                   Math.min(MAX_SCORE, matchup.score2 + delta)
//                 );
//                 return { ...matchup, score2: newScore };
//               }
//             }
//             return matchup;
//           }),
//         },
//       }));
//     },
//     []
//   );

//   const updateFinalsScore = useCallback(
//     (teamSlot: "west" | "east", delta: number) => {
//       setFinals((prev) => {
//         if (teamSlot === "west") {
//           const newScore = Math.max(
//             0,
//             Math.min(MAX_SCORE, prev.scoreWest + delta)
//           );
//           return { ...prev, scoreWest: newScore };
//         } else {
//           const newScore = Math.max(
//             0,
//             Math.min(MAX_SCORE, prev.scoreEast + delta)
//           );
//           return { ...prev, scoreEast: newScore };
//         }
//       });
//     },
//     []
//   );

//   const handleTeamSelect = useCallback(
//     (
//       conference: "west" | "east" | "finals",
//       matchupId: number,
//       slot: "team1" | "team2" | "west" | "east",
//       team: Team
//     ) => {
//       if (conference === "west" || conference === "east") {
//         setConferences((prev) => ({
//           ...prev,
//           [conference]: {
//             ...prev[conference],
//             matchups: prev[conference].matchups.map((m) =>
//               m.id === matchupId ? { ...m, [slot]: team } : m
//             ),
//           },
//         }));
//       } else if (conference === "finals") {
//         setFinals((prev) => ({ ...prev, [slot]: team }));
//       }
//       setDropdownInfo(null);
//     },
//     []
//   );

//   const handleTeamSlotClick = useCallback(
//     (
//       e: React.MouseEvent,
//       conference: "west" | "east" | "finals",
//       matchupId: number,
//       slot: "team1" | "team2" | "west" | "east"
//     ) => {
//       e.stopPropagation();
//       const buttonRect = e.currentTarget.getBoundingClientRect();

//       if (isMobile) {
//         setDropdownInfo({ conference, matchupId, slot, position: null });
//         return;
//       }

//       const dropdownWidth = 280;
//       const dropdownHeight = 400;
//       let top = buttonRect.bottom + 8;
//       let left = buttonRect.left;

//       if (top + dropdownHeight > window.innerHeight) {
//         top = buttonRect.top - dropdownHeight - 8;
//         if (top < 0) top = 8;
//       }
//       if (left + dropdownWidth > window.innerWidth)
//         left = window.innerWidth - dropdownWidth - 8;
//       if (left < 0) left = 8;

//       setDropdownInfo({ conference, matchupId, slot, position: { top, left } });
//     },
//     [isMobile]
//   );

//   const toggleRound = useCallback(
//     (conference: "west" | "east", round: number) => {
//       setConferences((prev) => ({
//         ...prev,
//         [conference]: {
//           ...prev[conference],
//           expandedRounds: prev[conference].expandedRounds.includes(round)
//             ? prev[conference].expandedRounds.filter((r) => r !== round)
//             : [...prev[conference].expandedRounds, round],
//         },
//       }));
//     },
//     []
//   );

//   const renderMatchup = useCallback(
//     (
//       matchup: Matchup,
//       conference: "west" | "east",
//       isMirrored: boolean = false
//     ) => {
//       const isChampion = matchup.round === 4;

//       if (isChampion) {
//         return (
//           <div
//             key={matchup.id}
//             className={`champion-slot champion-${conference}`}
//           >
//             <TeamSlot
//               type={conference}
//               matchupId={matchup.id}
//               slot="team1"
//               team={matchup.team1}
//               placeholder="Выберите чемпиона"
//               isActive={
//                 dropdownInfo?.conference === conference &&
//                 dropdownInfo?.matchupId === matchup.id &&
//                 dropdownInfo?.slot === "team1"
//               }
//               onClick={(e) =>
//                 handleTeamSlotClick(e, conference, matchup.id, "team1")
//               }
//             />
//             <div className="badge">Champion</div>
//           </div>
//         );
//       }

//       return (
//         <div
//           key={matchup.id}
//           className={`matchup round-${matchup.round} ${
//             isMirrored ? "mirrored" : ""
//           }`}
//         >
//           <div className="matchup-teams">
//             <TeamSlot
//               type={conference}
//               matchupId={matchup.id}
//               slot="team1"
//               team={matchup.team1}
//               placeholder="Выберите команду..."
//               isActive={
//                 dropdownInfo?.conference === conference &&
//                 dropdownInfo?.matchupId === matchup.id &&
//                 dropdownInfo?.slot === "team1"
//               }
//               onClick={(e) =>
//                 handleTeamSlotClick(e, conference, matchup.id, "team1")
//               }
//             />

//             <div className="matchup-controls">
//               <div className="score-controls">
//                 <button
//                   className="score-btn decrement"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     updateMatchupScore(conference, matchup.id, "team1", -1);
//                   }}
//                   disabled={matchup.score1 <= 0}
//                 >
//                   -
//                 </button>
//                 <ScoreDisplay score1={matchup.score1} score2={matchup.score2} />
//                 <button
//                   className="score-btn increment"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     updateMatchupScore(conference, matchup.id, "team2", -1);
//                   }}
//                   disabled={matchup.score2 <= 0}
//                 >
//                   -
//                 </button>
//               </div>
//               <div className="score-controls">
//                 <button
//                   className="score-btn increment"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     updateMatchupScore(conference, matchup.id, "team1", 1);
//                   }}
//                   disabled={matchup.score1 >= MAX_SCORE}
//                 >
//                   +
//                 </button>
//                 <div className="score-label">Счет</div>
//                 <button
//                   className="score-btn increment"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     updateMatchupScore(conference, matchup.id, "team2", 1);
//                   }}
//                   disabled={matchup.score2 >= MAX_SCORE}
//                 >
//                   +
//                 </button>
//               </div>
//             </div>

//             <TeamSlot
//               type={conference}
//               matchupId={matchup.id}
//               slot="team2"
//               team={matchup.team2}
//               placeholder="Выберите команду..."
//               isActive={
//                 dropdownInfo?.conference === conference &&
//                 dropdownInfo?.matchupId === matchup.id &&
//                 dropdownInfo?.slot === "team2"
//               }
//               onClick={(e) =>
//                 handleTeamSlotClick(e, conference, matchup.id, "team2")
//               }
//             />
//           </div>
//         </div>
//       );
//     },
//     [dropdownInfo, handleTeamSlotClick, updateMatchupScore]
//   );

//   const renderConference = useCallback(
//     (conference: "west" | "east", isMirrored: boolean) => {
//       const config = CONFERENCE_CONFIG[conference];
//       const { matchups, expandedRounds } = conferences[conference];

//       if (isMobile) {
//         return (
//           <div
//             className={`conference ${conference} ${
//               isMirrored ? "mirrored" : ""
//             }`}
//           >
//             <h2>{config.title}</h2>
//             <div
//               className={`bracket mobile-bracket ${
//                 isMirrored ? "mirrored" : ""
//               }`}
//             >
//               {ROUND_CONFIG.map(({ round, title }) => {
//                 const isExpanded = expandedRounds.includes(round);
//                 const matchupsCount = matchups.filter(
//                   (m) => m.round === round
//                 ).length;

//                 return (
//                   <div
//                     key={round}
//                     className={`round round-${round} ${
//                       isExpanded ? "expanded" : ""
//                     }`}
//                     onClick={() => toggleRound(conference, round)}
//                   >
//                     <h3>
//                       {title}
//                       <span className="match-count">({matchupsCount})</span>
//                       <span className="expand-icon">
//                         {isExpanded ? "−" : "+"}
//                       </span>
//                     </h3>
//                     <div className="round-content">
//                       {matchups
//                         .filter((m) => m.round === round)
//                         .map((m) => renderMatchup(m, conference, isMirrored))}
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         );
//       }

//       return (
//         <div
//           className={`conference ${conference} ${isMirrored ? "mirrored" : ""}`}
//         >
//           <h2>{config.title}</h2>
//           <div className={`bracket ${isMirrored ? "mirrored" : ""}`}>
//             {ROUND_CONFIG.map(({ round, title }) => (
//               <div
//                 key={round}
//                 className={`round round-${round}`}
//                 style={isMirrored ? { order: 5 - round } : {}}
//               >
//                 <h3>{title}</h3>
//                 <div className="round-content">
//                   {matchups
//                     .filter((m) => m.round === round)
//                     .map((m) => renderMatchup(m, conference, isMirrored))}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       );
//     },
//     [isMobile, conferences, toggleRound, renderMatchup]
//   );

//   const renderFinals = useCallback(
//     () => (
//       <div className="finals">
//         <div className="finals-container">
//           <h2>NBA Finals</h2>
//           <div className="finals-matchup">
//             <TeamSlot
//               type="finals"
//               matchupId={0}
//               slot="west"
//               team={finals.west}
//               placeholder="West Champion"
//               isActive={
//                 dropdownInfo?.conference === "finals" &&
//                 dropdownInfo?.slot === "west"
//               }
//               onClick={(e) => handleTeamSlotClick(e, "finals", 0, "west")}
//             />

//             <div className="finals-controls">
//               <div className="score-controls">
//                 <button
//                   className="score-btn decrement"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     updateFinalsScore("west", -1);
//                   }}
//                   disabled={finals.scoreWest <= 0}
//                 >
//                   -
//                 </button>
//                 <ScoreDisplay
//                   score1={finals.scoreWest}
//                   score2={finals.scoreEast}
//                   isFinals
//                 />
//                 <button
//                   className="score-btn increment"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     updateFinalsScore("east", -1);
//                   }}
//                   disabled={finals.scoreEast <= 0}
//                 >
//                   -
//                 </button>
//               </div>
//               <div className="score-controls">
//                 <button
//                   className="score-btn increment"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     updateFinalsScore("west", 1);
//                   }}
//                   disabled={finals.scoreWest >= MAX_SCORE}
//                 >
//                   +
//                 </button>
//                 <div className="score-label">Финальный счет</div>
//                 <button
//                   className="score-btn increment"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     updateFinalsScore("east", 1);
//                   }}
//                   disabled={finals.scoreEast >= MAX_SCORE}
//                 >
//                   +
//                 </button>
//               </div>
//             </div>

//             <TeamSlot
//               type="finals"
//               matchupId={0}
//               slot="east"
//               team={finals.east}
//               placeholder="East Champion"
//               isActive={
//                 dropdownInfo?.conference === "finals" &&
//                 dropdownInfo?.slot === "east"
//               }
//               onClick={(e) => handleTeamSlotClick(e, "finals", 0, "east")}
//             />
//           </div>
//           <div className="nba-champion">
//             <div className="trophy">🏆</div>
//             <div className="champion-label">NBA Champion</div>
//           </div>
//         </div>
//       </div>
//     ),
//     [dropdownInfo, finals, handleTeamSlotClick, updateFinalsScore]
//   );

//   const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
//   const scrollToBottom = () =>
//     window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });

//   if (loading) return <div className="loading">Загрузка команд...</div>;

//   return (
//     <div className="tournament-wrapper">
//       <div
//         className="tournament-container"
//         ref={containerRef}
//         onClick={() => setDropdownInfo(null)}
//       >
//         <div className="tournament-header">
//           <h1>NBA Playoffs Bracket</h1>
//         </div>
//         <div className="tournament-content">
//           <div className="playoff-bracket">
//             {renderConference("west", false)}
//             {renderFinals()}
//             {renderConference("east", true)}
//           </div>
//         </div>
//       </div>

//       {dropdownInfo && (
//         <div className="dropdown-overlay" onClick={() => setDropdownInfo(null)}>
//           <div
//             ref={dropdownRef}
//             className="dropdown-fixed"
//             style={
//               !isMobile && dropdownInfo.position
//                 ? {
//                     top: `${dropdownInfo.position.top}px`,
//                     left: `${dropdownInfo.position.left}px`,
//                   }
//                 : {}
//             }
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="dropdown-header">
//               <h4>Выберите команду</h4>
//               <button
//                 className="dropdown-close"
//                 onClick={() => setDropdownInfo(null)}
//               >
//                 ×
//               </button>
//             </div>
//             <div className="dropdown-grid">
//               {teams.map((team, index) => (
//                 <div
//                   key={index}
//                   className="dropdown-item"
//                   onClick={() =>
//                     handleTeamSelect(
//                       dropdownInfo.conference,
//                       dropdownInfo.matchupId || 0,
//                       dropdownInfo.slot,
//                       team
//                     )
//                   }
//                   title={team.path.replace(".png", "").replace(/_/g, " ")}
//                 >
//                   <img
//                     src={`/img/${team.path}`}
//                     alt=""
//                     className="item-logo"
//                     onError={(e) =>
//                       (e.currentTarget.src = "/img/placeholder.png")
//                     }
//                   />
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}

//       {isMobile && (
//         <div className="mobile-nav">
//           <button
//             className="mobile-nav-button up"
//             onClick={scrollToTop}
//             aria-label="Scroll to top"
//           >
//             ↑
//           </button>
//           <button
//             className="mobile-nav-button down"
//             onClick={scrollToBottom}
//             aria-label="Scroll to bottom"
//           >
//             ↓
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TournamentM;

import React, { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "../../../Supabase";
import "./tournament.css";
import logo from "../../../img/LogoLeague4kFinal.png";

interface Team {
  path: string;
}

interface Matchup {
  id: number;
  team1: Team | null;
  team2: Team | null;
  round: number;
  score1: number;
  score2: number;
}

interface ConferenceData {
  matchups: Matchup[];
  expandedRounds: number[];
}

interface DropdownInfo {
  conference: "west" | "east" | "finals";
  matchupId?: number;
  slot: "team1" | "team2" | "west" | "east";
  position: { top: number; left: number } | null;
}

interface TournamentData {
  conferences: {
    west: ConferenceData;
    east: ConferenceData;
  };
  finals: {
    west: Team | null;
    east: Team | null;
    scoreWest: number;
    scoreEast: number;
  };
  savedAt: string;
}

const CONFERENCE_CONFIG = {
  west: { title: "Western Conference", color: "blue", startId: 1 },
  east: { title: "Eastern Conference", color: "red", startId: 17 },
} as const;

const ROUND_CONFIG = [
  { round: 1, title: "First Round" },
  { round: 2, title: "Semifinals" },
  { round: 3, title: "Conference Finals" },
  { round: 4, title: "Conference Champion" },
] as const;

const MAX_SCORE = 4;

const ScoreDisplay: React.FC<{
  score1: number;
  score2: number;
  isFinals?: boolean;
}> = ({ score1, score2, isFinals = false }) => (
  <div className={`score-display ${isFinals ? "finals-score" : ""}`}>
    <div className="score-team">{score1}</div>
    <div className="score-separator">-</div>
    <div className="score-team">{score2}</div>
  </div>
);

const TeamSlot: React.FC<{
  type: "west" | "east" | "finals";
  matchupId: number;
  slot: "team1" | "team2" | "west" | "east";
  team: Team | null;
  placeholder: string;
  isActive: boolean;
  onClick: (e: React.MouseEvent) => void;
}> = ({ type, team, placeholder, isActive, onClick }) => (
  <div className="team-slot-container">
    <div
      className={`team-slot ${isActive ? "active" : ""} ${
        type === "finals" ? "finals-slot" : ""
      }`}
      onClick={onClick}
    >
      <div className="team-content">
        {team ? (
          <img
            src={`/img/${team.path}`}
            alt=""
            className={`team-logo ${type === "finals" ? "finals-logo" : ""}`}
            onError={(e) => (e.currentTarget.src = "/img/placeholder.png")}
          />
        ) : (
          <span className="placeholder">{placeholder}</span>
        )}
      </div>
    </div>
  </div>
);

const createInitialMatchups = (startId: number): Matchup[] => {
  const matchups: Matchup[] = [];
  let id = startId;
  const rounds = [4, 2, 1, 1];

  rounds.forEach((count, roundIndex) => {
    for (let i = 0; i < count; i++) {
      matchups.push({
        id: id++,
        team1: null,
        team2: null,
        round: roundIndex + 1,
        score1: 0,
        score2: 0,
      });
    }
  });

  return matchups;
};

const TournamentM = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [dropdownInfo, setDropdownInfo] = useState<DropdownInfo | null>(null);
  const [saving, setSaving] = useState(false);
  const [hasLoadedSavedData, setHasLoadedSavedData] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [conferences, setConferences] = useState({
    west: {
      matchups: createInitialMatchups(CONFERENCE_CONFIG.west.startId),
      expandedRounds: [1],
    },
    east: {
      matchups: createInitialMatchups(CONFERENCE_CONFIG.east.startId),
      expandedRounds: [1],
    },
  });

  const [finals, setFinals] = useState({
    west: null as Team | null,
    east: null as Team | null,
    scoreWest: 0,
    scoreEast: 0,
  });

  useEffect(() => {
    const loadData = async () => {
      await fetchTeams();
      await loadSavedTournament();
      setIsMobile(window.innerWidth <= 767);
    };
    loadData();
    window.addEventListener("resize", () =>
      setIsMobile(window.innerWidth <= 767)
    );
    return () =>
      window.removeEventListener("resize", () =>
        setIsMobile(window.innerWidth <= 767)
      );
  }, []);

  useEffect(() => {
    if (isMobile && dropdownInfo) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [dropdownInfo, isMobile]);

  const fetchTeams = async () => {
    try {
      const { data, error } = await supabase
        .from("IMG_path")
        .select("path")
        .order("path", { ascending: true });

      if (error) throw error;

      const teamData = (data || []).map((item) => ({ path: item.path }));
      setTeams(teamData);
    } catch (error) {
      console.error("Ошибка при загрузке команд:", error);
    }
  };

  const loadSavedTournament = async () => {
    try {
      const { data, error } = await supabase
        .from("Tournament27")
        .select("*")
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0 && data[0].data) {
        try {
          const savedData = JSON.parse(data[0].data) as TournamentData;

          // Восстанавливаем конференции
          if (savedData.conferences) {
            setConferences(savedData.conferences);
          }

          // Восстанавливаем финал
          if (savedData.finals) {
            setFinals(savedData.finals);
          }

          setHasLoadedSavedData(true);
          console.log("Турнир успешно загружен из базы данных");
        } catch (parseError) {
          console.error("Ошибка при парсинге сохраненных данных:", parseError);
          // Пробуем загрузить старый формат
          await loadOldFormat(data[0]);
        }
      } else {
        console.log("Сохраненный турнир не найден");
      }
    } catch (error) {
      console.error("Ошибка при загрузке турнира:", error);
    } finally {
      setLoading(false);
    }
  };

  // Функция для загрузки старого формата данных (если есть)
  const loadOldFormat = async (savedData: any) => {
    try {
      const westMatchups = [...conferences.west.matchups];
      const eastMatchups = [...conferences.east.matchups];
      const newFinals = { ...finals };

      // Старый формат колонок
      const oldColumnMapping = {
        westOneFirstRound: 1,
        westTwoFirstRound: 2,
        westThreeFirstRound: 3,
        westFourFirstRound: 4,
        westFiveFirstRound: 5,
        westSixFirstRound: 6,
        westSevenFirstRound: 7,
        westEightFirstRound: 8,
        westOneSecondRound: 9,
        westTwoSecondRound: 10,
        westThreeSecondRound: 11,
        westFourSecondRound: 12,
        westOneThirdRound: 13,
        westTwoThirdRound: 14,
        easternOneFirstRound: 17,
        easternTwoFirstRound: 18,
        easternThreeFirstRound: 19,
        easternFourFirstRound: 20,
        easternFiveFirstRound: 21,
        easternSixFirstRound: 22,
        easternSevenFirstRound: 23,
        easternEightFirstRound: 24,
        easternOneSecondRound: 25,
        easternTwoSecondRound: 26,
        easternThreeSecondRound: 27,
        easternFourSecondRound: 28,
        easternOneThirdRound: 29,
        easternTwoThirdRound: 30,
      };

      Object.entries(oldColumnMapping).forEach(([columnName, matchupId]) => {
        const teamPath = savedData[columnName];
        if (teamPath) {
          const team = { path: teamPath };

          if (matchupId <= 16) {
            const matchupIndex = westMatchups.findIndex(
              (m) => m.id === matchupId
            );
            if (matchupIndex !== -1) {
              westMatchups[matchupIndex] = {
                ...westMatchups[matchupIndex],
                team1: team,
              };
            }
          } else {
            const matchupIndex = eastMatchups.findIndex(
              (m) => m.id === matchupId
            );
            if (matchupIndex !== -1) {
              eastMatchups[matchupIndex] = {
                ...eastMatchups[matchupIndex],
                team1: team,
              };
            }
          }
        }
      });

      // Загружаем чемпионов
      if (savedData.westFinalChampions) {
        const westChampionIndex = westMatchups.findIndex((m) => m.round === 4);
        if (westChampionIndex !== -1) {
          westMatchups[westChampionIndex] = {
            ...westMatchups[westChampionIndex],
            team1: { path: savedData.westFinalChampions },
          };
        }
      }

      if (savedData.easternFinalChampions) {
        const eastChampionIndex = eastMatchups.findIndex((m) => m.round === 4);
        if (eastChampionIndex !== -1) {
          eastMatchups[eastChampionIndex] = {
            ...eastMatchups[eastChampionIndex],
            team1: { path: savedData.easternFinalChampions },
          };
        }
      }

      if (savedData.finalsWestChamp) {
        newFinals.west = { path: savedData.finalsWestChamp };
      }
      if (savedData.finalsEasternChamp) {
        newFinals.east = { path: savedData.finalsEasternChamp };
      }

      setConferences({
        west: { ...conferences.west, matchups: westMatchups },
        east: { ...conferences.east, matchups: eastMatchups },
      });
      setFinals(newFinals);
      setHasLoadedSavedData(true);
      console.log("Турнир загружен в старом формате");
    } catch (error) {
      console.error("Ошибка при загрузке старого формата:", error);
    }
  };

  const updateMatchupScore = useCallback(
    (
      conference: "west" | "east",
      matchupId: number,
      teamSlot: "team1" | "team2",
      delta: number
    ) => {
      setConferences((prev) => ({
        ...prev,
        [conference]: {
          ...prev[conference],
          matchups: prev[conference].matchups.map((matchup) => {
            if (matchup.id === matchupId) {
              if (teamSlot === "team1") {
                const newScore = Math.max(
                  0,
                  Math.min(MAX_SCORE, matchup.score1 + delta)
                );
                return { ...matchup, score1: newScore };
              } else {
                const newScore = Math.max(
                  0,
                  Math.min(MAX_SCORE, matchup.score2 + delta)
                );
                return { ...matchup, score2: newScore };
              }
            }
            return matchup;
          }),
        },
      }));
    },
    []
  );

  const updateFinalsScore = useCallback(
    (teamSlot: "west" | "east", delta: number) => {
      setFinals((prev) => {
        if (teamSlot === "west") {
          const newScore = Math.max(
            0,
            Math.min(MAX_SCORE, prev.scoreWest + delta)
          );
          return { ...prev, scoreWest: newScore };
        } else {
          const newScore = Math.max(
            0,
            Math.min(MAX_SCORE, prev.scoreEast + delta)
          );
          return { ...prev, scoreEast: newScore };
        }
      });
    },
    []
  );

  const handleTeamSelect = useCallback(
    (
      conference: "west" | "east" | "finals",
      matchupId: number,
      slot: "team1" | "team2" | "west" | "east",
      team: Team
    ) => {
      if (conference === "west" || conference === "east") {
        setConferences((prev) => ({
          ...prev,
          [conference]: {
            ...prev[conference],
            matchups: prev[conference].matchups.map((m) =>
              m.id === matchupId ? { ...m, [slot]: team } : m
            ),
          },
        }));
      } else if (conference === "finals") {
        setFinals((prev) => ({ ...prev, [slot]: team }));
      }
      setDropdownInfo(null);
    },
    []
  );

  const handleTeamSlotClick = useCallback(
    (
      e: React.MouseEvent,
      conference: "west" | "east" | "finals",
      matchupId: number,
      slot: "team1" | "team2" | "west" | "east"
    ) => {
      e.stopPropagation();
      const buttonRect = e.currentTarget.getBoundingClientRect();

      if (isMobile) {
        setDropdownInfo({ conference, matchupId, slot, position: null });
        return;
      }

      const dropdownWidth = 280;
      const dropdownHeight = 400;
      let top = buttonRect.bottom + 8;
      let left = buttonRect.left;

      if (top + dropdownHeight > window.innerHeight) {
        top = buttonRect.top - dropdownHeight - 8;
        if (top < 0) top = 8;
      }
      if (left + dropdownWidth > window.innerWidth)
        left = window.innerWidth - dropdownWidth - 8;
      if (left < 0) left = 8;

      setDropdownInfo({ conference, matchupId, slot, position: { top, left } });
    },
    [isMobile]
  );

  const toggleRound = useCallback(
    (conference: "west" | "east", round: number) => {
      setConferences((prev) => ({
        ...prev,
        [conference]: {
          ...prev[conference],
          expandedRounds: prev[conference].expandedRounds.includes(round)
            ? prev[conference].expandedRounds.filter((r) => r !== round)
            : [...prev[conference].expandedRounds, round],
        },
      }));
    },
    []
  );

  const saveTournament = async () => {
    setSaving(true);
    try {
      const tournamentData: TournamentData = {
        conferences,
        finals,
        savedAt: new Date().toISOString(),
      };

      // Проверяем, есть ли уже сохраненные данные
      const { data: existingData, error: fetchError } = await supabase
        .from("Tournament27")
        .select("id")
        .limit(1);

      if (fetchError) throw fetchError;

      let upsertError;

      if (existingData && existingData.length > 0) {
        // Обновляем существующую запись
        const { error } = await supabase
          .from("Tournament27")
          .update({ data: JSON.stringify(tournamentData) })
          .eq("id", existingData[0].id);
        upsertError = error;
      } else {
        // Создаем новую запись
        const { error } = await supabase
          .from("Tournament27")
          .insert([{ data: JSON.stringify(tournamentData) }]);
        upsertError = error;
      }

      if (upsertError) throw upsertError;

      alert("Турнир успешно сохранен!");
    } catch (error) {
      console.error("Ошибка при сохранении турнира:", error);
      alert("Произошла ошибка при сохранении турнира");
    } finally {
      setSaving(false);
    }
  };

  const renderMatchup = useCallback(
    (
      matchup: Matchup,
      conference: "west" | "east",
      isMirrored: boolean = false
    ) => {
      const isChampion = matchup.round === 4;

      if (isChampion) {
        return (
          <div
            key={matchup.id}
            className={`champion-slot champion-${conference}`}
          >
            <TeamSlot
              type={conference}
              matchupId={matchup.id}
              slot="team1"
              team={matchup.team1}
              placeholder="Выберите чемпиона"
              isActive={
                dropdownInfo?.conference === conference &&
                dropdownInfo?.matchupId === matchup.id &&
                dropdownInfo?.slot === "team1"
              }
              onClick={(e) =>
                handleTeamSlotClick(e, conference, matchup.id, "team1")
              }
            />
            <div className="badge">Champion</div>
          </div>
        );
      }

      return (
        <div
          key={matchup.id}
          className={`matchup round-${matchup.round} ${
            isMirrored ? "mirrored" : ""
          }`}
        >
          <div className="matchup-teams">
            <TeamSlot
              type={conference}
              matchupId={matchup.id}
              slot="team1"
              team={matchup.team1}
              placeholder="Выберите команду..."
              isActive={
                dropdownInfo?.conference === conference &&
                dropdownInfo?.matchupId === matchup.id &&
                dropdownInfo?.slot === "team1"
              }
              onClick={(e) =>
                handleTeamSlotClick(e, conference, matchup.id, "team1")
              }
            />

            <div className="matchup-controls">
              <div className="score-controls">
                <button
                  className="score-btn decrement"
                  onClick={(e) => {
                    e.stopPropagation();
                    updateMatchupScore(conference, matchup.id, "team1", -1);
                  }}
                  disabled={matchup.score1 <= 0}
                >
                  -
                </button>
                <ScoreDisplay score1={matchup.score1} score2={matchup.score2} />
                <button
                  className="score-btn increment"
                  onClick={(e) => {
                    e.stopPropagation();
                    updateMatchupScore(conference, matchup.id, "team2", -1);
                  }}
                  disabled={matchup.score2 <= 0}
                >
                  -
                </button>
              </div>
              <div className="score-controls">
                <button
                  className="score-btn increment"
                  onClick={(e) => {
                    e.stopPropagation();
                    updateMatchupScore(conference, matchup.id, "team1", 1);
                  }}
                  disabled={matchup.score1 >= MAX_SCORE}
                >
                  +
                </button>
                <div className="score-label">Счет</div>
                <button
                  className="score-btn increment"
                  onClick={(e) => {
                    e.stopPropagation();
                    updateMatchupScore(conference, matchup.id, "team2", 1);
                  }}
                  disabled={matchup.score2 >= MAX_SCORE}
                >
                  +
                </button>
              </div>
            </div>

            <TeamSlot
              type={conference}
              matchupId={matchup.id}
              slot="team2"
              team={matchup.team2}
              placeholder="Выберите команду..."
              isActive={
                dropdownInfo?.conference === conference &&
                dropdownInfo?.matchupId === matchup.id &&
                dropdownInfo?.slot === "team2"
              }
              onClick={(e) =>
                handleTeamSlotClick(e, conference, matchup.id, "team2")
              }
            />
          </div>
        </div>
      );
    },
    [dropdownInfo, handleTeamSlotClick, updateMatchupScore]
  );

  const renderConference = useCallback(
    (conference: "west" | "east", isMirrored: boolean) => {
      const config = CONFERENCE_CONFIG[conference];
      const { matchups, expandedRounds } = conferences[conference];

      if (isMobile) {
        return (
          <div
            className={`conference ${conference} ${
              isMirrored ? "mirrored" : ""
            }`}
          >
            <h2>{config.title}</h2>
            <div
              className={`bracket mobile-bracket ${
                isMirrored ? "mirrored" : ""
              }`}
            >
              {ROUND_CONFIG.map(({ round, title }) => {
                const isExpanded = expandedRounds.includes(round);
                const matchupsCount = matchups.filter(
                  (m) => m.round === round
                ).length;

                return (
                  <div
                    key={round}
                    className={`round round-${round} ${
                      isExpanded ? "expanded" : ""
                    }`}
                    onClick={() => toggleRound(conference, round)}
                  >
                    <h3>
                      {title}
                      <span className="match-count">({matchupsCount})</span>
                      <span className="expand-icon">
                        {isExpanded ? "−" : "+"}
                      </span>
                    </h3>
                    <div className="round-content">
                      {matchups
                        .filter((m) => m.round === round)
                        .map((m) => renderMatchup(m, conference, isMirrored))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }

      return (
        <div
          className={`conference ${conference} ${isMirrored ? "mirrored" : ""}`}
        >
          <h2>{config.title}</h2>
          <div className={`bracket ${isMirrored ? "mirrored" : ""}`}>
            {ROUND_CONFIG.map(({ round, title }) => (
              <div
                key={round}
                className={`round round-${round}`}
                style={isMirrored ? { order: 5 - round } : {}}
              >
                <h3>{title}</h3>
                <div className="round-content">
                  {matchups
                    .filter((m) => m.round === round)
                    .map((m) => renderMatchup(m, conference, isMirrored))}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    },
    [isMobile, conferences, toggleRound, renderMatchup]
  );

  const renderFinals = useCallback(
    () => (
      <div className="finals">
        <div className="finals-container">
          <h2>NBA Finals</h2>
          <div className="finals-matchup">
            <TeamSlot
              type="finals"
              matchupId={0}
              slot="west"
              team={finals.west}
              placeholder="West Champion"
              isActive={
                dropdownInfo?.conference === "finals" &&
                dropdownInfo?.slot === "west"
              }
              onClick={(e) => handleTeamSlotClick(e, "finals", 0, "west")}
            />

            <div className="finals-controls">
              <div className="score-controls">
                <button
                  className="score-btn decrement"
                  onClick={(e) => {
                    e.stopPropagation();
                    updateFinalsScore("west", -1);
                  }}
                  disabled={finals.scoreWest <= 0}
                >
                  -
                </button>
                <ScoreDisplay
                  score1={finals.scoreWest}
                  score2={finals.scoreEast}
                  isFinals
                />
                <button
                  className="score-btn increment"
                  onClick={(e) => {
                    e.stopPropagation();
                    updateFinalsScore("east", -1);
                  }}
                  disabled={finals.scoreEast <= 0}
                >
                  -
                </button>
              </div>
              <div className="score-controls">
                <button
                  className="score-btn increment"
                  onClick={(e) => {
                    e.stopPropagation();
                    updateFinalsScore("west", 1);
                  }}
                  disabled={finals.scoreWest >= MAX_SCORE}
                >
                  +
                </button>
                <div className="score-label">Финальный счет</div>
                <button
                  className="score-btn increment"
                  onClick={(e) => {
                    e.stopPropagation();
                    updateFinalsScore("east", 1);
                  }}
                  disabled={finals.scoreEast >= MAX_SCORE}
                >
                  +
                </button>
              </div>
            </div>

            <TeamSlot
              type="finals"
              matchupId={0}
              slot="east"
              team={finals.east}
              placeholder="East Champion"
              isActive={
                dropdownInfo?.conference === "finals" &&
                dropdownInfo?.slot === "east"
              }
              onClick={(e) => handleTeamSlotClick(e, "finals", 0, "east")}
            />
          </div>
          <div className="nba-champion">
            <div className="trophy">🏆</div>
            <div className="champion-label">NBA Champion</div>
          </div>
        </div>
      </div>
    ),
    [dropdownInfo, finals, handleTeamSlotClick, updateFinalsScore]
  );

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const scrollToBottom = () =>
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });

  if (loading) return <div className="loading">Загрузка команд...</div>;

  return (
    <div className="tournament-wrapper">
      <div
        className="tournament-container"
        ref={containerRef}
        onClick={() => setDropdownInfo(null)}
      >
        <div className="tournament-header">
          <div className="header-content">
            <a href="/" className="logo-link">
              <img src={logo} alt="NBA Logo" className="tournament-logo" />
            </a>
            <div className="header-title">
              <h1>NBA Playoffs Bracket</h1>
              <div className="save-container">
                <div className="save-buttons">
                  <button
                    className="save-button"
                    onClick={saveTournament}
                    disabled={saving}
                  >
                    {saving ? "Сохранение..." : "Сохранить турнир"}
                  </button>
                </div>
                {hasLoadedSavedData && (
                  <div className="saved-indicator">
                    ✓ Загружены сохраненные данные
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="tournament-content">
          <div className="playoff-bracket">
            {renderConference("west", false)}
            {renderFinals()}
            {renderConference("east", true)}
          </div>
        </div>
      </div>

      {dropdownInfo && (
        <div className="dropdown-overlay" onClick={() => setDropdownInfo(null)}>
          <div
            ref={dropdownRef}
            className="dropdown-fixed"
            style={
              !isMobile && dropdownInfo.position
                ? {
                    top: `${dropdownInfo.position.top}px`,
                    left: `${dropdownInfo.position.left}px`,
                  }
                : {}
            }
            onClick={(e) => e.stopPropagation()}
          >
            <div className="dropdown-header">
              <h4>Выберите команду</h4>
              <button
                className="dropdown-close"
                onClick={() => setDropdownInfo(null)}
              >
                ×
              </button>
            </div>
            <div className="dropdown-grid">
              {teams.map((team, index) => (
                <div
                  key={index}
                  className="dropdown-item"
                  onClick={() =>
                    handleTeamSelect(
                      dropdownInfo.conference,
                      dropdownInfo.matchupId || 0,
                      dropdownInfo.slot,
                      team
                    )
                  }
                  title={team.path.replace(".png", "").replace(/_/g, " ")}
                >
                  <img
                    src={`/img/${team.path}`}
                    alt=""
                    className="item-logo"
                    onError={(e) =>
                      (e.currentTarget.src = "/img/placeholder.png")
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {isMobile && (
        <div className="mobile-nav">
          <button
            className="mobile-nav-button up"
            onClick={scrollToTop}
            aria-label="Scroll to top"
          >
            ↑
          </button>
          <button
            className="mobile-nav-button down"
            onClick={scrollToBottom}
            aria-label="Scroll to bottom"
          >
            ↓
          </button>
        </div>
      )}
    </div>
  );
};

export default TournamentM;
