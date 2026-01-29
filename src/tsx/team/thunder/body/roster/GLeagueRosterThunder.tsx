import React, { useEffect, useState } from "react";
import { supabase } from "../../../../../Supabase";
import "./gLeagueRosterThunder.css";

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

const GLeagueRosterThunder = () => {
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

        const { data: thunderPlayers, error: thunderError } = await supabase
          .from("Players")
          .select("*")
          .eq("g_league", "Oklahoma City Thunder")
          .neq("id", 1); // Исключаем игрока с id = 1 чтобы избежать дублирования

        if (thunderError) throw thunderError;

        // Объединяем данные: сначала специальный игрок, затем остальные
        const combinedPlayers = [
          ...(specialPlayer ? [specialPlayer] : []),
          ...(thunderPlayers || []),
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
      <div className="loading-text-thunder">Loading Thunder Roster...</div>
    );
  }

  return (
    <div className="thunder-container">
      <div className="header-content-thunder">
        <h1 className="header-title-thunder">G-LEAGUE</h1>
      </div>

      <div className="table-container-thunder">
        <div className="table-wrapper-thunder">
          <table className="players-table-thunder">
            <tbody className="table-body-thunder">
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
                        ? "first-row-highlight-thunder"
                        : "tables-row-thunder"
                    }
                  >
                    <td className="table-tdw-thunder player-id-thunder">
                      {displayNumber}
                    </td>
                    <td className="table-td-thunder">
                      <span
                        className={`roster-badge-thunder ${
                          player.active_roster === "Yes"
                            ? "badge-active-thunder"
                            : "badge-inactive-thunder"
                        }`}
                      >
                        {player.active_roster}
                      </span>
                    </td>
                    <td className="table-td-thunder player-position-thunder">
                      {player.position}
                    </td>
                    <td className="table-td-thunder">{player.pos_elig}</td>
                    <td className="table-td-thunder player-age-thunder">
                      {player.age}
                    </td>
                    <td className="table-td-thunder">{player.year_one}</td>
                    <td className="table-td-thunder">{player.year_two}</td>
                    <td className="table-td-thunder">{player.year_three}</td>
                    <td className="table-td-thunder">{player.year_four}</td>
                    <td className="table-td-thunder">{player.year_five}</td>
                    <td className="table-td-thunder">{player.opt}</td>
                    <td className="table-td-thunder">{player.exp}</td>
                    <td className="table-td-thunder">{player.bird}</td>
                    <td className="table-td-thunder">{player.awards}</td>
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

export default GLeagueRosterThunder;
