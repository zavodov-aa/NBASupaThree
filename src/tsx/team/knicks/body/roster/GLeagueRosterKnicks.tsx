import React, { useEffect, useState } from "react";
import { supabase } from "../../../../../Supabase";
import "./gLeagueRosterKnicks.css";

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

const GLeagueRosterKnicks = () => {
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

        const { data: knicksPlayers, error: knicksError } = await supabase
          .from("Players")
          .select("*")
          .eq("g_league", "New York Knicks")
          .neq("id", 1); // Исключаем игрока с id = 1 чтобы избежать дублирования

        if (knicksError) throw knicksError;

        // Объединяем данные: сначала специальный игрок, затем остальные
        const combinedPlayers = [
          ...(specialPlayer ? [specialPlayer] : []),
          ...(knicksPlayers || []),
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
    return <div className="loading-text">Loading Knicks Roster...</div>;
  }

  return (
    <div className="knicks-containers">
      <div className="header-content-knicks">
        <h1 className="header-title-knicks">G-LEAGUE</h1>
      </div>

      <div className="table-containersss-knicks">
        <div className="table-wrapper-knicks">
          <table className="players-table-knicks">
            <tbody className="table-body-knicks">
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
                        ? "first-row-highlight-knicks"
                        : "tables-row-knicks"
                    }
                  >
                    <td className="table-tdw-knicks player-id-knicks">
                      {displayNumber}
                    </td>
                    <td className="table-td-knicks">
                      <span
                        className={`roster-badge-knicks ${
                          player.active_roster === "Yes"
                            ? "badge-active-knicks"
                            : "badge-inactive-knicks"
                        }`}
                      >
                        {player.active_roster}
                      </span>
                    </td>
                    <td className="table-td-knicks player-position-knicks">
                      {player.position}
                    </td>
                    <td className="table-td-knicks">{player.pos_elig}</td>
                    <td className="table-td-knicks player-age-knicks">
                      {player.age}
                    </td>
                    <td className="table-td-knicks">{player.year_one}</td>
                    <td className="table-td-knicks">{player.year_two}</td>
                    <td className="table-td-knicks">{player.year_three}</td>
                    <td className="table-td-knicks">{player.year_four}</td>
                    <td className="table-td-knicks">{player.year_five}</td>
                    <td className="table-td-knicks">{player.opt}</td>
                    <td className="table-td-knicks">{player.exp}</td>
                    <td className="table-td-knicks">{player.bird}</td>
                    <td className="table-td-knicks">{player.awards}</td>
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

export default GLeagueRosterKnicks;
