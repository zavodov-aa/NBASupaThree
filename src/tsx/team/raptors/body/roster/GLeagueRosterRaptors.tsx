import React, { useEffect, useState } from "react";
import { supabase } from "../../../../../Supabase";
import "./gLeagueRosterRaptors.css";

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

const GLeagueRosterRaptors = () => {
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

        const { data: raptorsPlayers, error: raptorsError } = await supabase
          .from("Players")
          .select("*")
          .eq("g_league", "Toronto Raptors")
          .neq("id", 1); // Исключаем игрока с id = 1 чтобы избежать дублирования

        if (raptorsError) throw raptorsError;

        // Объединяем данные: сначала специальный игрок, затем остальные
        const combinedPlayers = [
          ...(specialPlayer ? [specialPlayer] : []),
          ...(raptorsPlayers || []),
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
    return <div className="loading-text">Loading Raptors Roster...</div>;
  }

  return (
    <div className="raptors-containers">
      <div className="header-content-raptors">
        <h1 className="header-title-raptors">G-LEAGUE</h1>
      </div>

      <div className="table-containersss-raptors">
        <div className="table-wrapper-raptors">
          <table className="players-table-raptors">
            <tbody className="table-body-raptors">
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
                        ? "first-row-highlight-raptors"
                        : "tables-row-raptors"
                    }
                  >
                    <td className="table-tdw-raptors player-id-raptors">
                      {displayNumber}
                    </td>
                    <td className="table-td-raptors">
                      <span
                        className={`roster-badge-raptors ${
                          player.active_roster === "Yes"
                            ? "badge-active-raptors"
                            : "badge-inactive-raptors"
                        }`}
                      >
                        {player.active_roster}
                      </span>
                    </td>
                    <td className="table-td-raptors player-position-raptors">
                      {player.position}
                    </td>
                    <td className="table-td-raptors">{player.pos_elig}</td>
                    <td className="table-td-raptors player-age-raptors">
                      {player.age}
                    </td>
                    <td className="table-td-raptors">{player.year_one}</td>
                    <td className="table-td-raptors">{player.year_two}</td>
                    <td className="table-td-raptors">{player.year_three}</td>
                    <td className="table-td-raptors">{player.year_four}</td>
                    <td className="table-td-raptors">{player.year_five}</td>
                    <td className="table-td-raptors">{player.opt}</td>
                    <td className="table-td-raptors">{player.exp}</td>
                    <td className="table-td-raptors">{player.bird}</td>
                    <td className="table-td-raptors">{player.awards}</td>
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

export default GLeagueRosterRaptors;
