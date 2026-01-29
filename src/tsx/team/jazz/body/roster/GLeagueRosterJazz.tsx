import React, { useEffect, useState } from "react";
import { supabase } from "../../../../../Supabase";
import "./gLeagueRosterJazz.css";

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

const GLeagueRosterJazz = () => {
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

        const { data: jazzPlayers, error: jazzError } = await supabase
          .from("Players")
          .select("*")
          .eq("g_league", "Utah Jazz")
          .neq("id", 1); // Исключаем игрока с id = 1 чтобы избежать дублирования

        if (jazzError) throw jazzError;

        // Объединяем данные: сначала специальный игрок, затем остальные
        const combinedPlayers = [
          ...(specialPlayer ? [specialPlayer] : []),
          ...(jazzPlayers || []),
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
    return <div className="loading-text">Loading Jazz Roster...</div>;
  }

  return (
    <div className="jazz-containers">
      <div className="header-content-jazz">
        <h1 className="header-title-jazz">G-LEAGUE</h1>
      </div>

      <div className="table-containersss-jazz">
        <div className="table-wrapper-jazz">
          <table className="players-table-jazz">
            <tbody className="table-body-jazz">
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
                        ? "first-row-highlight-jazz"
                        : "tables-row-jazz"
                    }
                  >
                    <td className="table-tdw-jazz player-id-jazz">
                      {displayNumber}
                    </td>
                    <td className="table-td-jazz">
                      <span
                        className={`roster-badge-jazz ${
                          player.active_roster === "Yes"
                            ? "badge-active-jazz"
                            : "badge-inactive-jazz"
                        }`}
                      >
                        {player.active_roster}
                      </span>
                    </td>
                    <td className="table-td-jazz player-position-jazz">
                      {player.position}
                    </td>
                    <td className="table-td-jazz">{player.pos_elig}</td>
                    <td className="table-td-jazz player-age-jazz">
                      {player.age}
                    </td>
                    <td className="table-td-jazz">{player.year_one}</td>
                    <td className="table-td-jazz">{player.year_two}</td>
                    <td className="table-td-jazz">{player.year_three}</td>
                    <td className="table-td-jazz">{player.year_four}</td>
                    <td className="table-td-jazz">{player.year_five}</td>
                    <td className="table-td-jazz">{player.opt}</td>
                    <td className="table-td-jazz">{player.exp}</td>
                    <td className="table-td-jazz">{player.bird}</td>
                    <td className="table-td-jazz">{player.awards}</td>
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

export default GLeagueRosterJazz;
