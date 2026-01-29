import React, { useEffect, useState } from "react";
import { supabase } from "../../../../../Supabase";
import "./gLeagueRosterWarriors.css";

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

const GLeagueRosterWarriors = () => {
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

        const { data: warriorsPlayers, error: warriorsError } = await supabase
          .from("Players")
          .select("*")
          .eq("g_league", "Golden State Warriors")
          .neq("id", 1); // Исключаем игрока с id = 1 чтобы избежать дублирования

        if (warriorsError) throw warriorsError;

        // Объединяем данные: сначала специальный игрок, затем остальные
        const combinedPlayers = [
          ...(specialPlayer ? [specialPlayer] : []),
          ...(warriorsPlayers || []),
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
    return <div className="loading-text">Loading Warriors Roster...</div>;
  }

  return (
    <div className="warriors-containers">
      <div className="header-content-warriors">
        <h1 className="header-title-warriors">G-LEAGUE</h1>
      </div>

      <div className="table-container-warriors">
        <div className="table-wrapper-warriors">
          <table className="players-table-warriors">
            <tbody className="table-body-warriors">
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
                        ? "first-row-highlight-warriors"
                        : "tables-row-warriors"
                    }
                  >
                    <td className="table-tdw-warriors player-id-warriors">
                      {displayNumber}
                    </td>
                    <td className="table-td-warriors">
                      <span
                        className={`roster-badge-warriors ${
                          player.active_roster === "Yes"
                            ? "badge-active-warriors"
                            : "badge-inactive-warriors"
                        }`}
                      >
                        {player.active_roster}
                      </span>
                    </td>
                    <td className="table-td-warriors player-position-warriors">
                      {player.position}
                    </td>
                    <td className="table-td-warriors">{player.pos_elig}</td>
                    <td className="table-td-warriors player-age-warriors">
                      {player.age}
                    </td>
                    <td className="table-td-warriors">{player.year_one}</td>
                    <td className="table-td-warriors">{player.year_two}</td>
                    <td className="table-td-warriors">{player.year_three}</td>
                    <td className="table-td-warriors">{player.year_four}</td>
                    <td className="table-td-warriors">{player.year_five}</td>
                    <td className="table-td-warriors">{player.opt}</td>
                    <td className="table-td-warriors">{player.exp}</td>
                    <td className="table-td-warriors">{player.bird}</td>
                    <td className="table-td-warriors">{player.awards}</td>
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

export default GLeagueRosterWarriors;
