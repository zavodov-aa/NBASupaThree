import React, { useEffect, useState } from "react";
import { supabase } from "../../../../../Supabase";
import "./gLeagueRosterPistons.css";

interface Player {
  id: number;
  active_roster: string;
  position: string;
  pos_elig: string;
  age: string | null;
  year_one: string | null;
  year_two: string | null;
  year_three: string | null;
  year_four: string | null;
  year_five: string | null;
  opt: string;
  exp: string;
  bird: string;
  awards: string;
  team: string;
}

const GLeagueRosterPistons = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        // Запрашиваем игрока с id = 1
        const { data: specialPlayer, error: specialError } = await supabase
          .from("Players")
          .select("*")
          .eq("id", 1)
          .single();

        const { data: pistonsPlayers, error: pistonsError } = await supabase
          .from("Players")
          .select("*")
          .eq("g_league", "Detroit Pistons")
          .neq("id", 1); // Исключаем игрока с id = 1 чтобы избежать дублирования

        if (pistonsError) throw pistonsError;

        // Объединяем данные: сначала специальный игрок, затем остальные
        const combinedPlayers = [
          ...(specialPlayer ? [specialPlayer] : []),
          ...(pistonsPlayers || []),
        ];

        setPlayers(combinedPlayers);
      } catch (error) {
        console.error("Error fetching players:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  if (loading) {
    return <div className="loading-text">Loading Pistons Roster...</div>;
  }

  return (
    <div className="pistons-containers">
      <div className="header-content-pistons">
        <h1 className="header-title-pistons">G-LEAGUE</h1>
      </div>

      <div className="table-containersss-pistons">
        <div className="table-wrapper-pistons">
          <table className="players-table-pistons">
            <tbody className="table-body-pistons">
              {players.map((player, index) => {
                // Определяем номер для отображения
                let displayNumber;
                if (player.id === 1) {
                  displayNumber = "★"; // Звездочка для игрока с id = 1
                } else {
                  // Для остальных игроков - порядковый номер (игнорируя игрока с id = 1)
                  displayNumber = `${index}`; // index уже начинается с 0, но так как игрок с id=1 первый, то для следующего будет index=1
                }

                return (
                  <tr
                    key={player.id}
                    className={
                      index === 0
                        ? "first-row-highlight-pistons"
                        : "tables-row-pistons"
                    }
                  >
                    <td className="table-tdw-pistons player-id-pistons">
                      {displayNumber}
                    </td>
                    <td className="table-td-pistons">
                      <span
                        className={`roster-badge-pistons ${
                          player.active_roster === "Yes"
                            ? "badge-active-pistons"
                            : "badge-inactive-pistons"
                        }`}
                      >
                        {player.active_roster}
                      </span>
                    </td>
                    <td className="table-td-pistons player-position-pistons">
                      {player.position}
                    </td>
                    <td className="table-td-pistons">{player.pos_elig}</td>
                    <td className="table-td-pistons player-age-pistons">
                      {player.age}
                    </td>
                    <td className="table-td-pistons">{player.year_one}</td>
                    <td className="table-td-pistons">{player.year_two}</td>
                    <td className="table-td-pistons">{player.year_three}</td>
                    <td className="table-td-pistons">{player.year_four}</td>
                    <td className="table-td-pistons">{player.year_five}</td>
                    <td className="table-td-pistons">{player.opt}</td>
                    <td className="table-td-pistons">{player.exp}</td>
                    <td className="table-td-pistons">{player.bird}</td>
                    <td className="table-td-pistons">{player.awards}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GLeagueRosterPistons;
