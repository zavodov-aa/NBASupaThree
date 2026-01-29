import React, { useEffect, useState } from "react";
import { supabase } from "../../../../../Supabase";
import "./gLeagueRosterNets.css";

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

const GLeagueRosterNets = () => {
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

        const { data: netsPlayers, error: netsError } = await supabase
          .from("Players")
          .select("*")
          .eq("g_league", "Brooklyn Nets")
          .neq("id", 1); // Исключаем игрока с id = 1 чтобы избежать дублирования

        if (netsError) throw netsError;

        // Объединяем данные: сначала специальный игрок, затем остальные
        const combinedPlayers = [
          ...(specialPlayer ? [specialPlayer] : []),
          ...(netsPlayers || []),
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
    return <div className="loading-text">Loading Nets Roster...</div>;
  }

  return (
    <div className="nets-containers">
      <div className="header-content-nets">
        <h1 className="header-title-nets">G-LEAGUE</h1>
      </div>

      <div className="table-containersss-nets">
        <div className="table-wrapper-nets">
          <table className="players-table-nets">
            <tbody className="table-body-nets">
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
                        ? "first-row-highlight-nets"
                        : "tables-row-nets"
                    }
                  >
                    <td className="table-tdw-nets player-id-nets">
                      {displayNumber}
                    </td>
                    <td className="table-td-nets">
                      <span
                        className={`roster-badge-nets ${
                          player.active_roster === "Yes"
                            ? "badge-active-nets"
                            : "badge-inactive-nets"
                        }`}
                      >
                        {player.active_roster}
                      </span>
                    </td>
                    <td className="table-td-nets player-position-nets">
                      {player.position}
                    </td>
                    <td className="table-td-nets">{player.pos_elig}</td>
                    <td className="table-td-nets player-age-nets">
                      {player.age}
                    </td>
                    <td className="table-td-nets">{player.year_one}</td>
                    <td className="table-td-nets">{player.year_two}</td>
                    <td className="table-td-nets">{player.year_three}</td>
                    <td className="table-td-nets">{player.year_four}</td>
                    <td className="table-td-nets">{player.year_five}</td>
                    <td className="table-td-nets">{player.opt}</td>
                    <td className="table-td-nets">{player.exp}</td>
                    <td className="table-td-nets">{player.bird}</td>
                    <td className="table-td-nets">{player.awards}</td>
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

export default GLeagueRosterNets;
