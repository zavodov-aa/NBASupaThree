// import React, { useState, useEffect } from "react";
// import { supabase } from "../../../Supabase";

// interface Player {
//   id: number;
//   active_roster: string;
//   position?: string;
//   g_league: string;
// }

// interface Trades_Two_way_gleagueProps {
//   myTeam: string;
//   theirTeam: string;
//   onBack: () => void;
//   onSubmit: (mySelected: Player[], theirSelected: Player[]) => void;
// }

// const Trades_Two_way_gleague: React.FC<Trades_Two_way_gleagueProps> = ({
//   myTeam,
//   theirTeam,
//   onBack,
//   onSubmit,
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
//           .select("id, active_roster, position, g_league")
//           .in("g_league", [myTeam, theirTeam]);

//         if (error) throw error;

//         if (data && data.length > 0) {
//           const my = data.filter((p) => p.g_league === myTeam);
//           const their = data.filter((p) => p.g_league === theirTeam);
//           setMyPlayers(my);
//           setTheirPlayers(their);
//         } else {
//           setMyPlayers([]);
//           setTheirPlayers([]);
//         }
//       } catch (err) {
//         console.error("Ошибка загрузки G-League игроков:", err);
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

//   const handleSubmit = () => {
//     const mySelectedObjects = myPlayers.filter((p) =>
//       selectedMyPlayers.includes(p.id),
//     );
//     const theirSelectedObjects = theirPlayers.filter((p) =>
//       selectedTheirPlayers.includes(p.id),
//     );
//     onSubmit(mySelectedObjects, theirSelectedObjects);
//   };

//   if (loading)
//     return <div className="loading">Загрузка G-League игроков...</div>;

//   return (
//     <div className="trades-players-container">
//       <div className="players-column">
//         <h4>Ваша G-League команда: {myTeam}</h4>
//         {myPlayers.length === 0 ? (
//           <p>Нет игроков в G-League</p>
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
//         <h4>G-League команда соперника: {theirTeam}</h4>
//         {theirPlayers.length === 0 ? (
//           <p>Нет игроков в G-League</p>
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
//         <button onClick={handleSubmit} className="next-button">
//           Далее
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Trades_Two_way_gleague;

import React, { useState, useEffect } from "react";
import { supabase } from "../../../Supabase";
import "./trades_Two_way_gleague.css";

interface Player {
  id: number;
  active_roster: string;
  position?: string;
  g_league: string;
}

interface Trades_Two_way_gleagueProps {
  myTeam: string;
  theirTeam: string;
  onBack: () => void;
  onSubmit: (mySelected: Player[], theirSelected: Player[]) => void;
}

const Trades_Two_way_gleague: React.FC<Trades_Two_way_gleagueProps> = ({
  myTeam,
  theirTeam,
  onBack,
  onSubmit,
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
          .select("id, active_roster, position, g_league")
          .in("g_league", [myTeam, theirTeam]);

        if (error) throw error;

        if (data && data.length > 0) {
          const my = data.filter((p) => p.g_league === myTeam);
          const their = data.filter((p) => p.g_league === theirTeam);
          setMyPlayers(my);
          setTheirPlayers(their);
        } else {
          setMyPlayers([]);
          setTheirPlayers([]);
        }
      } catch (err) {
        console.error("Ошибка загрузки G-League игроков:", err);
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

  const handleSubmit = () => {
    const mySelectedObjects = myPlayers.filter((p) =>
      selectedMyPlayers.includes(p.id),
    );
    const theirSelectedObjects = theirPlayers.filter((p) =>
      selectedTheirPlayers.includes(p.id),
    );
    onSubmit(mySelectedObjects, theirSelectedObjects);
  };

  if (loading)
    return (
      <div className="Trades_Two_way_gleague-loading">
        Загрузка G-League игроков...
      </div>
    );

  return (
    <div className="Trades_Two_way_gleague-container">
      <div className="Trades_Two_way_gleague-columns">
        <div className="Trades_Two_way_gleague-column">
          <h4 className="Trades_Two_way_gleague-title">
            Ваша G-League команда: {myTeam}
          </h4>
          {myPlayers.length === 0 ? (
            <p className="Trades_Two_way_gleague-empty">
              Нет игроков в G-League
            </p>
          ) : (
            <ul className="Trades_Two_way_gleague-player-list">
              {myPlayers.map((player) => (
                <li
                  key={player.id}
                  className="Trades_Two_way_gleague-player-item"
                >
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedMyPlayers.includes(player.id)}
                      onChange={() => toggleMyPlayer(player.id)}
                    />
                    {player.active_roster}{" "}
                    {player.position && `(${player.position})`}
                  </label>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="Trades_Two_way_gleague-column">
          <h4 className="Trades_Two_way_gleague-title">
            G-League команда соперника: {theirTeam}
          </h4>
          {theirPlayers.length === 0 ? (
            <p className="Trades_Two_way_gleague-empty">
              Нет игроков в G-League
            </p>
          ) : (
            <ul className="Trades_Two_way_gleague-player-list">
              {theirPlayers.map((player) => (
                <li
                  key={player.id}
                  className="Trades_Two_way_gleague-player-item"
                >
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedTheirPlayers.includes(player.id)}
                      onChange={() => toggleTheirPlayer(player.id)}
                    />
                    {player.active_roster}{" "}
                    {player.position && `(${player.position})`}
                  </label>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="Trades_Two_way_gleague-actions">
        <button
          onClick={onBack}
          className="Trades_Two_way_gleague-button Trades_Two_way_gleague-button-back"
        >
          Назад
        </button>
        <button
          onClick={handleSubmit}
          className="Trades_Two_way_gleague-button Trades_Two_way_gleague-button-next"
        >
          Далее
        </button>
      </div>
    </div>
  );
};

export default Trades_Two_way_gleague;
