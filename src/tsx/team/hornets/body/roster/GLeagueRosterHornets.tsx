import React, { useEffect, useState } from "react";
import { supabase } from "../../../../../Supabase";
import "./gLeagueRosterHornets.css";

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

const GLeagueRosterHornets = () => {
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

        const { data: hornetsPlayers, error: hornetsError } = await supabase
          .from("Players")
          .select("*")
          .eq("g_league", "Charlotte Hornets")
          .neq("id", 1); // Исключаем игрока с id = 1 чтобы избежать дублирования

        if (hornetsError) throw hornetsError;

        // Объединяем данные: сначала специальный игрок, затем остальные
        const combinedPlayers = [
          ...(specialPlayer ? [specialPlayer] : []),
          ...(hornetsPlayers || []),
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
    return <div className="loading-text">Loading Hornets Roster...</div>;
  }

  return (
    <div className="hornets-containers">
      <div className="header-content-hornets">
        <h1 className="header-title-hornets">G-LEAGUE</h1>
      </div>

      <div className="table-containersss-hornets">
        <div className="table-wrapper-hornets">
          <table className="players-table-hornets">
            <tbody className="table-body-hornets">
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
                        ? "first-row-highlight-hornets"
                        : "tables-row-hornets"
                    }
                  >
                    <td className="table-tdw-hornets player-id-hornets">
                      {displayNumber}
                    </td>
                    <td className="table-td-hornets">
                      <span
                        className={`roster-badge-hornets ${
                          player.active_roster === "Yes"
                            ? "badge-active-hornets"
                            : "badge-inactive-hornets"
                        }`}
                      >
                        {player.active_roster}
                      </span>
                    </td>
                    <td className="table-td-hornets player-position-hornets">
                      {player.position}
                    </td>
                    <td className="table-td-hornets">{player.pos_elig}</td>
                    <td className="table-td-hornets player-age-hornets">
                      {player.age}
                    </td>
                    <td className="table-td-hornets">{player.year_one}</td>
                    <td className="table-td-hornets">{player.year_two}</td>
                    <td className="table-td-hornets">{player.year_three}</td>
                    <td className="table-td-hornets">{player.year_four}</td>
                    <td className="table-td-hornets">{player.year_five}</td>
                    <td className="table-td-hornets">{player.opt}</td>
                    <td className="table-td-hornets">{player.exp}</td>
                    <td className="table-td-hornets">{player.bird}</td>
                    <td className="table-td-hornets">{player.awards}</td>
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

export default GLeagueRosterHornets;
