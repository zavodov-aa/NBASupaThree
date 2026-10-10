// // Trades_Two_way_currentTeam.tsx
// import React, { useState, useEffect } from "react";
// import { supabase } from "../../../Supabase";

// interface NBATeamSelectorProps {
//   currentTeam?: string; // неизменяемая команда пользователя
//   onTeamSelect: (team: string) => void; // вызывается при выборе команды для трейда
// }

// const Trades_Two_way_currentTeam: React.FC<NBATeamSelectorProps> = ({
//   currentTeam = "",
//   onTeamSelect,
// }) => {
//   const [teamsList, setTeamsList] = useState<string[]>([]);
//   const [tradeTeam, setTradeTeam] = useState<string>(""); // выбранная команда для трейда
//   const [loading, setLoading] = useState<boolean>(false);

//   // Загрузка списка всех команд (без перезапуска от currentTeam)
//   useEffect(() => {
//     const fetchTeams = async () => {
//       setLoading(true);
//       try {
//         const { data, error } = await supabase
//           .from("Players")
//           .select("team")
//           .not("team", "is", null)
//           .order("team");

//         if (error) throw error;

//         const uniqueTeams = Array.from(
//           new Set(data.map((item) => item.team)),
//         ) as string[];
//         setTeamsList(uniqueTeams);
//       } catch (err) {
//         console.error("Ошибка загрузки команд:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTeams();
//   }, []); // пустой массив – загружаем один раз

//   const handleTeamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const newTeam = e.target.value;
//     setTradeTeam(newTeam);
//     onTeamSelect(newTeam); // передаём выбранную команду в родителя
//   };

//   return (
//     <div className="nba-team-selector">
//       {/* Неизменяемая информация о своей команде */}
//       <div className="current-team-info">
//         Ваша команда: <strong>{currentTeam || "Не выбрана"}</strong>
//       </div>

//       <label htmlFor="nba-team-select">Выберите команду для трейда:</label>
//       {loading ? (
//         <p>Загрузка команд...</p>
//       ) : (
//         <select
//           id="nba-team-select"
//           value={tradeTeam}
//           onChange={handleTeamChange}
//           className="nba-team-select"
//         >
//           <option value="">-- Выберите команду --</option>
//           {teamsList
//             .filter((team) => team !== currentTeam) // исключаем свою команду
//             .map((team) => (
//               <option key={team} value={team}>
//                 {team}
//               </option>
//             ))}
//         </select>
//       )}

//       {tradeTeam && !loading && (
//         <p className="nba-team-current">
//           Выбрана команда для обмена: <strong>{tradeTeam}</strong>
//         </p>
//       )}
//     </div>
//   );
// };

// export default Trades_Two_way_currentTeam;

import React, { useState, useEffect } from "react";
import { supabase } from "../../../Supabase";
import "./trades_Two_way_currentTeam.css";

interface NBATeamSelectorProps {
  currentTeam?: string;
  onTeamSelect: (team: string) => void;
}

const Trades_Two_way_currentTeam: React.FC<NBATeamSelectorProps> = ({
  currentTeam = "",
  onTeamSelect,
}) => {
  const [teamsList, setTeamsList] = useState<string[]>([]);
  const [tradeTeam, setTradeTeam] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchTeams = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("Players")
          .select("team")
          .not("team", "is", null)
          .order("team");

        if (error) throw error;

        const uniqueTeams = Array.from(
          new Set(data.map((item) => item.team)),
        ) as string[];
        setTeamsList(uniqueTeams);
      } catch (err) {
        console.error("Ошибка загрузки команд:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  const handleTeamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTeam = e.target.value;
    setTradeTeam(newTeam);
    onTeamSelect(newTeam);
  };

  return (
    <div className="Trades_Two_way_currentTeam-nba-team-selector">
      {/* Горизонтальное сопоставление двух команд */}
      <div className="Trades_Two_way_currentTeam-teams-comparison">
        <div className="Trades_Two_way_currentTeam-team-card">
          <div className="Trades_Two_way_currentTeam-team-label">
            Ваша команда
          </div>
          <div className="Trades_Two_way_currentTeam-team-name">
            {currentTeam || "Не выбрана"}
          </div>
        </div>
        <div className="Trades_Two_way_currentTeam-trade-arrow">⇄</div>
        <div className="Trades_Two_way_currentTeam-team-card">
          <div className="Trades_Two_way_currentTeam-team-label">
            Команда для трейда
          </div>
          <div className="Trades_Two_way_currentTeam-team-name">
            {tradeTeam || "—"}
          </div>
        </div>
      </div>

      {/* Выпадающий список для выбора */}
      <label htmlFor="nba-team-select">Выберите команду для трейда:</label>
      {loading ? (
        <p>Загрузка команд...</p>
      ) : (
        <select
          id="nba-team-select"
          value={tradeTeam}
          onChange={handleTeamChange}
          className="Trades_Two_way_currentTeam-nba-team-select"
        >
          <option value="">-- Выберите команду --</option>
          {teamsList
            .filter((team) => team !== currentTeam)
            .map((team) => (
              <option key={team} value={team}>
                {team}
              </option>
            ))}
        </select>
      )}
    </div>
  );
};

export default Trades_Two_way_currentTeam;
