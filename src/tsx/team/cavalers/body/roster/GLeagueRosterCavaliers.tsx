import React, { useEffect, useState } from "react";
import { supabase } from "../../../../../Supabase";
import "./gLeagueRosterCavaliers.css";

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

const GLeagueRosterCavaliers = () => {
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

        const { data: cavaliersPlayers, error: cavaliersError } = await supabase
          .from("Players")
          .select("*")
          .eq("g_league", "Cleveland Cavaliers")
          .neq("id", 1); // Исключаем игрока с id = 1 чтобы избежать дублирования

        if (cavaliersError) throw cavaliersError;

        // Объединяем данные: сначала специальный игрок, затем остальные
        const combinedPlayers = [
          ...(specialPlayer ? [specialPlayer] : []),
          ...(cavaliersPlayers || []),
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
    return <div className="loading-text">Loading Cavaliers Roster...</div>;
  }

  return (
    <div className="cavaliers-containers">
      <div className="header-content-cavaliers">
        <h1 className="header-title-cavaliers">G-LEAGUE</h1>
      </div>

      <div className="table-containersss-cavaliers">
        <div className="table-wrapper-cavaliers">
          <table className="players-table-cavaliers">
            <tbody className="table-body-cavaliers">
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
                        ? "first-row-highlight-cavaliers"
                        : "tables-row-cavaliers"
                    }
                  >
                    <td className="table-tdw-cavaliers player-id-cavaliers">
                      {displayNumber}
                    </td>
                    <td className="table-td-cavaliers">
                      <span
                        className={`roster-badge-cavaliers ${
                          player.active_roster === "Yes"
                            ? "badge-active-cavaliers"
                            : "badge-inactive-cavaliers"
                        }`}
                      >
                        {player.active_roster}
                      </span>
                    </td>
                    <td className="table-td-cavaliers player-position-cavaliers">
                      {player.position}
                    </td>
                    <td className="table-td-cavaliers">{player.pos_elig}</td>
                    <td className="table-td-cavaliers player-age-cavaliers">
                      {player.age}
                    </td>
                    <td className="table-td-cavaliers">{player.year_one}</td>
                    <td className="table-td-cavaliers">{player.year_two}</td>
                    <td className="table-td-cavaliers">{player.year_three}</td>
                    <td className="table-td-cavaliers">{player.year_four}</td>
                    <td className="table-td-cavaliers">{player.year_five}</td>
                    <td className="table-td-cavaliers">{player.opt}</td>
                    <td className="table-td-cavaliers">{player.exp}</td>
                    <td className="table-td-cavaliers">{player.bird}</td>
                    <td className="table-td-cavaliers">{player.awards}</td>
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

export default GLeagueRosterCavaliers;
