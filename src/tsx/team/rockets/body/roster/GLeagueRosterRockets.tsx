import React, { useEffect, useState } from "react";
import { supabase } from "../../../../../Supabase";
import "./gLeagueRosterRockets.css";

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

const GLeagueRosterHawks = () => {
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

        const { data: hawksPlayers, error: hawksError } = await supabase
          .from("Players")
          .select("*")
          .eq("g_league", "Houston Rockets")
          .neq("id", 1); // Исключаем игрока с id = 1 чтобы избежать дублирования

        if (hawksError) throw hawksError;

        // Объединяем данные: сначала специальный игрок, затем остальные
        const combinedPlayers = [
          ...(specialPlayer ? [specialPlayer] : []),
          ...(hawksPlayers || []),
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
    return (
      <div className="loading-text-rockets">Loading Rockets Roster...</div>
    );
  }

  return (
    <div className="rockets-containers">
      <div className="header-content-rockets">
        <h1 className="header-title-rockets">G-LEAGUE</h1>
      </div>

      <div className="table-containersss-rockets">
        <div className="table-wrapper-rockets">
          <table className="players-table-rockets">
            <tbody className="table-body-rockets">
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
                        ? "first-row-highlight-rockets"
                        : "tables-row-rockets"
                    }
                  >
                    <td className="table-tdw-rockets player-id-rockets">
                      {displayNumber}
                    </td>
                    <td className="table-td-rockets">
                      <span
                        className={`roster-badge-rockets ${
                          player.active_roster === "Yes"
                            ? "badge-active-rockets"
                            : "badge-inactive-rockets"
                        }`}
                      >
                        {player.active_roster}
                      </span>
                    </td>
                    <td className="table-td-rockets player-position-rockets">
                      {player.position}
                    </td>
                    <td className="table-td-rockets">{player.pos_elig}</td>
                    <td className="table-td-rockets player-age-rockets">
                      {player.age}
                    </td>
                    <td className="table-td-rockets">{player.year_one}</td>
                    <td className="table-td-rockets">{player.year_two}</td>
                    <td className="table-td-rockets">{player.year_three}</td>
                    <td className="table-td-rockets">{player.year_four}</td>
                    <td className="table-td-rockets">{player.year_five}</td>
                    <td className="table-td-rockets">{player.opt}</td>
                    <td className="table-td-rockets">{player.exp}</td>
                    <td className="table-td-rockets">{player.bird}</td>
                    <td className="table-td-rockets">{player.awards}</td>
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

export default GLeagueRosterHawks;
