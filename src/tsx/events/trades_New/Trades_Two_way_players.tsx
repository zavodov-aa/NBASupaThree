// import React, { useState, useEffect } from "react";
// import { supabase } from "../../../Supabase";

// interface Player {
//   id: number;
//   active_roster: string;
//   position?: string;
//   team: string;
// }

// interface Trades_Two_way_playersProps {
//   myTeam: string;
//   theirTeam: string;
//   onBack: () => void;
//   onNext: (mySelected: Player[], theirSelected: Player[]) => void; // изменено
// }

// const Trades_Two_way_players: React.FC<Trades_Two_way_playersProps> = ({
//   myTeam,
//   theirTeam,
//   onBack,
//   onNext,
// }) => {
//   const [myPlayers, setMyPlayers] = useState<Player[]>([]);
//   const [theirPlayers, setTheirPlayers] = useState<Player[]>([]);
//   const [selectedMyPlayers, setSelectedMyPlayers] = useState<number[]>([]);
//   const [selectedTheirPlayers, setSelectedTheirPlayers] = useState<number[]>(
//     [],
//   );
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchPlayers = async () => {
//       setLoading(true);
//       try {
//         const { data, error } = await supabase
//           .from("Players")
//           .select("id, active_roster, position, team")
//           .in("team", [myTeam, theirTeam]);

//         if (error) throw error;

//         if (data && data.length > 0) {
//           const my = data.filter((p) => p.team === myTeam);
//           const their = data.filter((p) => p.team === theirTeam);
//           setMyPlayers(my);
//           setTheirPlayers(their);
//         } else {
//           setMyPlayers([]);
//           setTheirPlayers([]);
//         }
//       } catch (err) {
//         console.error("Ошибка загрузки игроков:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (myTeam && theirTeam) {
//       fetchPlayers();
//     }
//   }, [myTeam, theirTeam]);

//   const toggleMyPlayer = (playerId: number) => {
//     setSelectedMyPlayers((prev) =>
//       prev.includes(playerId)
//         ? prev.filter((id) => id !== playerId)
//         : [...prev, playerId],
//     );
//   };

//   const toggleTheirPlayer = (playerId: number) => {
//     setSelectedTheirPlayers((prev) =>
//       prev.includes(playerId)
//         ? prev.filter((id) => id !== playerId)
//         : [...prev, playerId],
//     );
//   };

//   const handleNext = () => {
//     const mySelectedObjects = myPlayers.filter((p) =>
//       selectedMyPlayers.includes(p.id),
//     );
//     const theirSelectedObjects = theirPlayers.filter((p) =>
//       selectedTheirPlayers.includes(p.id),
//     );
//     onNext(mySelectedObjects, theirSelectedObjects);
//   };

//   if (loading) return <div className="loading">Загрузка игроков...</div>;

//   return (
//     <div className="trades-players-container">
//       <div className="players-column">
//         <h4>Ваша команда: {myTeam}</h4>
//         {myPlayers.length === 0 ? (
//           <p>Нет игроков</p>
//         ) : (
//           <ul>
//             {myPlayers.map((player) => (
//               <li key={player.id}>
//                 <label>
//                   <input
//                     type="checkbox"
//                     checked={selectedMyPlayers.includes(player.id)}
//                     onChange={() => toggleMyPlayer(player.id)}
//                   />
//                   {player.active_roster}{" "}
//                   {player.position && `(${player.position})`}
//                 </label>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>

//       <div className="players-column">
//         <h4>Команда соперника: {theirTeam}</h4>
//         {theirPlayers.length === 0 ? (
//           <p>Нет игроков</p>
//         ) : (
//           <ul>
//             {theirPlayers.map((player) => (
//               <li key={player.id}>
//                 <label>
//                   <input
//                     type="checkbox"
//                     checked={selectedTheirPlayers.includes(player.id)}
//                     onChange={() => toggleTheirPlayer(player.id)}
//                   />
//                   {player.active_roster}{" "}
//                   {player.position && `(${player.position})`}
//                 </label>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>

//       <div className="trades-actions">
//         <button onClick={onBack} className="back-button">
//           Назад
//         </button>
//         <button onClick={handleNext} className="next-button">
//           Далее
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Trades_Two_way_players;

import React, { useState, useEffect } from "react";
import { supabase } from "../../../Supabase";
import "./trades_Two_way_players.css";

interface Player {
  id: number;
  active_roster: string;
  position?: string;
  team: string;
}

interface Trades_Two_way_playersProps {
  myTeam: string;
  theirTeam: string;
  onBack: () => void;
  onNext: (mySelected: Player[], theirSelected: Player[]) => void;
}

const Trades_Two_way_players: React.FC<Trades_Two_way_playersProps> = ({
  myTeam,
  theirTeam,
  onBack,
  onNext,
}) => {
  const [myPlayers, setMyPlayers] = useState<Player[]>([]);
  const [theirPlayers, setTheirPlayers] = useState<Player[]>([]);
  const [selectedMyPlayers, setSelectedMyPlayers] = useState<number[]>([]);
  const [selectedTheirPlayers, setSelectedTheirPlayers] = useState<number[]>(
    [],
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlayers = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("Players")
          .select("id, active_roster, position, team")
          .in("team", [myTeam, theirTeam]);

        if (error) throw error;

        if (data && data.length > 0) {
          const my = data.filter((p) => p.team === myTeam);
          const their = data.filter((p) => p.team === theirTeam);
          setMyPlayers(my);
          setTheirPlayers(their);
        } else {
          setMyPlayers([]);
          setTheirPlayers([]);
        }
      } catch (err) {
        console.error("Ошибка загрузки игроков:", err);
      } finally {
        setLoading(false);
      }
    };

    if (myTeam && theirTeam) {
      fetchPlayers();
    }
  }, [myTeam, theirTeam]);

  const toggleMyPlayer = (playerId: number) => {
    setSelectedMyPlayers((prev) =>
      prev.includes(playerId)
        ? prev.filter((id) => id !== playerId)
        : [...prev, playerId],
    );
  };

  const toggleTheirPlayer = (playerId: number) => {
    setSelectedTheirPlayers((prev) =>
      prev.includes(playerId)
        ? prev.filter((id) => id !== playerId)
        : [...prev, playerId],
    );
  };

  const handleNext = () => {
    const mySelectedObjects = myPlayers.filter((p) =>
      selectedMyPlayers.includes(p.id),
    );
    const theirSelectedObjects = theirPlayers.filter((p) =>
      selectedTheirPlayers.includes(p.id),
    );
    onNext(mySelectedObjects, theirSelectedObjects);
  };

  if (loading) return <div className="loading">Загрузка игроков...</div>;
  return (
    <div className="Trades_Two_way_players-container">
      <div className="Trades_Two_way_players-column">
        <h4>Ваша команда: {myTeam}</h4>
        {myPlayers.length === 0 ? (
          <p>Нет игроков</p>
        ) : (
          <div className="Trades_Two_way_players-grid">
            {myPlayers.map((player) => (
              <div
                key={player.id}
                className={`Trades_Two_way_players-card ${selectedMyPlayers.includes(player.id) ? "Trades_Two_way_players-selected" : ""}`}
                onClick={() => toggleMyPlayer(player.id)}
              >
                <div className="Trades_Two_way_players-name">
                  {player.active_roster}
                </div>
                {player.position && (
                  <div className="Trades_Two_way_players-position">
                    {player.position}
                  </div>
                )}
                <div className="Trades_Two_way_players-check">
                  <input
                    type="checkbox"
                    checked={selectedMyPlayers.includes(player.id)}
                    onChange={() => {}}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="Trades_Two_way_players-column">
        <h4>Команда соперника: {theirTeam}</h4>
        {theirPlayers.length === 0 ? (
          <p>Нет игроков</p>
        ) : (
          <div className="Trades_Two_way_players-grid">
            {theirPlayers.map((player) => (
              <div
                key={player.id}
                className={`Trades_Two_way_players-card ${selectedTheirPlayers.includes(player.id) ? "Trades_Two_way_players-selected" : ""}`}
                onClick={() => toggleTheirPlayer(player.id)}
              >
                <div className="Trades_Two_way_players-name">
                  {player.active_roster}
                </div>
                {player.position && (
                  <div className="Trades_Two_way_players-position">
                    {player.position}
                  </div>
                )}
                <div className="Trades_Two_way_players-check">
                  <input
                    type="checkbox"
                    checked={selectedTheirPlayers.includes(player.id)}
                    onChange={() => {}}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="Trades_Two_way_players-actions">
        <button onClick={onBack} className="Trades_Two_way_players-back">
          Назад
        </button>
        <button onClick={handleNext} className="Trades_Two_way_players-next">
          Далее
        </button>
      </div>
    </div>
  );
};

export default Trades_Two_way_players;
