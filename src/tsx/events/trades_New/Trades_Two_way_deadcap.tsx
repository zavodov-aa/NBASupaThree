// import React, { useState, useEffect } from "react";
// import { supabase } from "../../../Supabase";

// interface DeadCapPlayer {
//   id: number;
//   name: string; // active_roster
//   deadCapTeam: string;
//   salary: {
//     year1?: number | null;
//     year2?: number | null;
//     year3?: number | null;
//     year4?: number | null;
//     year5?: number | null;
//   };
// }

// interface PickItem {
//   id: string;
//   label: string;
//   team: string;
// }

// interface Trades_Two_way_deadcapProps {
//   myTeam: string;
//   theirTeam: string;
//   myPlayers: any[];
//   theirPlayers: any[];
//   myPicks: PickItem[];
//   theirPicks: PickItem[];
//   onBack: () => void;
//   onSubmit: () => void;
// }

// const Trades_Two_way_deadcap: React.FC<Trades_Two_way_deadcapProps> = ({
//   myTeam,
//   theirTeam,
//   onBack,
//   onSubmit,
// }) => {
//   const [playersByTeam, setPlayersByTeam] = useState<{
//     [team: string]: DeadCapPlayer[];
//   }>({});
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchPlayersByDeadCap = async () => {
//       if (!myTeam && !theirTeam) {
//         setLoading(false);
//         return;
//       }

//       const { data, error } = await supabase
//         .from("Players")
//         .select(
//           "id, active_roster, dead_cap_team, dc_year_one, dc_year_two, dc_year_three, dc_year_four, dc_year_five",
//         )
//         .in("dead_cap_team", [myTeam, theirTeam])
//         .not("active_roster", "is", null);

//       if (error) {
//         console.error("Ошибка загрузки игроков по dead_cap_team:", error);
//         setLoading(false);
//         return;
//       }

//       const grouped: { [team: string]: DeadCapPlayer[] } = {};
//       (data || []).forEach((row: any) => {
//         const team = row.dead_cap_team;
//         if (!grouped[team]) grouped[team] = [];
//         grouped[team].push({
//           id: row.id,
//           name: row.active_roster,
//           deadCapTeam: team,
//           salary: {
//             year1: row.dc_year_one,
//             year2: row.dc_year_two,
//             year3: row.dc_year_three,
//             year4: row.dc_year_four,
//             year5: row.dc_year_five,
//           },
//         });
//       });

//       setPlayersByTeam(grouped);
//       setLoading(false);
//     };

//     fetchPlayersByDeadCap();
//   }, [myTeam, theirTeam]);

//   const myTeamPlayers = playersByTeam[myTeam] || [];
//   const theirTeamPlayers = playersByTeam[theirTeam] || [];

//   // Вспомогательная функция для форматирования зарплаты
//   const formatSalary = (value?: number | null): string => {
//     if (value === null || value === undefined) return "—";
//     // Если зарплата в долларах, можно отформатировать с разделителями
//     return `$${value.toLocaleString()}`;
//   };

//   return (
//     <div className="Trades-Two-way-deadcap">
//       <h4>Dead cap</h4>

//       {loading && <div className="loading-spinner">Загрузка данных...</div>}

//       {!loading && (
//         <>
//           <div className="deadcap-section">
//             <h5>{myTeam}</h5>
//             {myTeamPlayers.length === 0 && <p>Нет игроков</p>}
//             {myTeamPlayers.map((player) => (
//               <div key={player.id} className="deadcap-player-row">
//                 <div className="player-name">{player.name}</div>
//                 <div className="player-salary">
//                   {player.salary.year1 !== undefined && (
//                     <span>1: {formatSalary(player.salary.year1)} </span>
//                   )}
//                   {player.salary.year2 !== undefined && (
//                     <span>2: {formatSalary(player.salary.year2)} </span>
//                   )}
//                   {player.salary.year3 !== undefined && (
//                     <span>3: {formatSalary(player.salary.year3)} </span>
//                   )}
//                   {player.salary.year4 !== undefined && (
//                     <span>4: {formatSalary(player.salary.year4)} </span>
//                   )}
//                   {player.salary.year5 !== undefined && (
//                     <span>5: {formatSalary(player.salary.year5)} </span>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className="deadcap-section">
//             <h5>{theirTeam}</h5>
//             {theirTeamPlayers.length === 0 && <p>Нет игроков</p>}
//             {theirTeamPlayers.map((player) => (
//               <div key={player.id} className="deadcap-player-row">
//                 <div className="player-name">{player.name}</div>
//                 <div className="player-salary">
//                   {player.salary.year1 !== undefined && (
//                     <span>1: {formatSalary(player.salary.year1)} </span>
//                   )}
//                   {player.salary.year2 !== undefined && (
//                     <span>2: {formatSalary(player.salary.year2)} </span>
//                   )}
//                   {player.salary.year3 !== undefined && (
//                     <span>3: {formatSalary(player.salary.year3)} </span>
//                   )}
//                   {player.salary.year4 !== undefined && (
//                     <span>4: {formatSalary(player.salary.year4)} </span>
//                   )}
//                   {player.salary.year5 !== undefined && (
//                     <span>5: {formatSalary(player.salary.year5)} </span>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </>
//       )}

//       <div className="Trades-Two-way-actions">
//         <button className="Trades-Two-way-back" onClick={onBack}>
//           Назад
//         </button>
//         <button
//           className="Trades-Two-way-submit"
//           onClick={onSubmit}
//           disabled={loading}
//         >
//           Предложить трейд
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Trades_Two_way_deadcap;

import React, { useState, useEffect } from "react";
import { supabase } from "../../../Supabase";

interface DeadCapPlayer {
  id: number;
  name: string;
  deadCapTeam: string;
  salary: {
    year1?: number | null;
    year2?: number | null;
    year3?: number | null;
    year4?: number | null;
    year5?: number | null;
  };
}

interface PickItem {
  id: string;
  label: string;
  team: string;
}

interface Trades_Two_way_deadcapProps {
  myTeam: string;
  theirTeam: string;
  myPlayers: any[];
  theirPlayers: any[];
  myPicks: PickItem[];
  theirPicks: PickItem[];
  onBack: () => void;
  onSubmit: (selectedPlayers: DeadCapPlayer[]) => void; // изменено: передаём выбранных игроков
}

const Trades_Two_way_deadcap: React.FC<Trades_Two_way_deadcapProps> = ({
  myTeam,
  theirTeam,
  onBack,
  onSubmit,
}) => {
  const [playersByTeam, setPlayersByTeam] = useState<{
    [team: string]: DeadCapPlayer[];
  }>({});
  const [loading, setLoading] = useState(true);
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<Set<number>>(
    new Set(),
  );

  useEffect(() => {
    const fetchPlayersByDeadCap = async () => {
      if (!myTeam && !theirTeam) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("Players")
        .select(
          "id, active_roster, dead_cap_team, dc_year_one, dc_year_two, dc_year_three, dc_year_four, dc_year_five",
        )
        .in("dead_cap_team", [myTeam, theirTeam])
        .not("active_roster", "is", null);

      if (error) {
        console.error("Ошибка загрузки игроков по dead_cap_team:", error);
        setLoading(false);
        return;
      }

      const grouped: { [team: string]: DeadCapPlayer[] } = {};
      (data || []).forEach((row: any) => {
        const team = row.dead_cap_team;
        if (!grouped[team]) grouped[team] = [];
        grouped[team].push({
          id: row.id,
          name: row.active_roster,
          deadCapTeam: team,
          salary: {
            year1: row.dc_year_one,
            year2: row.dc_year_two,
            year3: row.dc_year_three,
            year4: row.dc_year_four,
            year5: row.dc_year_five,
          },
        });
      });

      setPlayersByTeam(grouped);
      setLoading(false);
    };

    fetchPlayersByDeadCap();
  }, [myTeam, theirTeam]);

  const myTeamPlayers = playersByTeam[myTeam] || [];
  const theirTeamPlayers = playersByTeam[theirTeam] || [];

  // Форматирование зарплаты без знака $
  const formatSalary = (value?: number | null): string => {
    if (value === null || value === undefined) return "—";
    return value.toLocaleString(); // просто цифры с разделителями тысяч
  };

  const togglePlayerSelection = (playerId: number) => {
    setSelectedPlayerIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(playerId)) {
        newSet.delete(playerId);
      } else {
        newSet.add(playerId);
      }
      return newSet;
    });
  };

  const handleSubmit = () => {
    // Собираем всех выбранных игроков (из обеих команд)
    const allPlayers = [...myTeamPlayers, ...theirTeamPlayers];
    const selectedPlayers = allPlayers.filter((p) =>
      selectedPlayerIds.has(p.id),
    );
    onSubmit(selectedPlayers);
  };

  const renderPlayerRow = (player: DeadCapPlayer) => (
    <div key={player.id} className="deadcap-player-row">
      <input
        type="checkbox"
        checked={selectedPlayerIds.has(player.id)}
        onChange={() => togglePlayerSelection(player.id)}
      />
      <div className="player-name">{player.name}</div>
      <div className="player-salary">
        {player.salary.year1 !== undefined && (
          <span>1: {formatSalary(player.salary.year1)} </span>
        )}
        {player.salary.year2 !== undefined && (
          <span>2: {formatSalary(player.salary.year2)} </span>
        )}
        {player.salary.year3 !== undefined && (
          <span>3: {formatSalary(player.salary.year3)} </span>
        )}
        {player.salary.year4 !== undefined && (
          <span>4: {formatSalary(player.salary.year4)} </span>
        )}
        {player.salary.year5 !== undefined && (
          <span>5: {formatSalary(player.salary.year5)} </span>
        )}
      </div>
    </div>
  );

  return (
    <div className="Trades-Two-way-deadcap">
      <h4>Dead cap – выберите игроков для обмена</h4>

      {loading && <div className="loading-spinner">Загрузка данных...</div>}

      {!loading && (
        <>
          <div className="deadcap-section">
            <h5>{myTeam}</h5>
            {myTeamPlayers.length === 0 && <p>Нет игроков</p>}
            {myTeamPlayers.map(renderPlayerRow)}
          </div>

          <div className="deadcap-section">
            <h5>{theirTeam}</h5>
            {theirTeamPlayers.length === 0 && <p>Нет игроков</p>}
            {theirTeamPlayers.map(renderPlayerRow)}
          </div>
        </>
      )}

      <div className="Trades-Two-way-actions">
        <button className="Trades-Two-way-back" onClick={onBack}>
          Назад
        </button>
        <button
          className="Trades-Two-way-submit"
          onClick={handleSubmit}
          disabled={loading}
        >
          Предложить трейд
        </button>
      </div>
    </div>
  );
};

export default Trades_Two_way_deadcap;
