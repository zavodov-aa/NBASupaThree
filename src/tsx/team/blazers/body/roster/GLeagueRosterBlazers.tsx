import React, { useEffect, useState } from "react";
import { supabase } from "../../../../../Supabase";
import "./gLeagueRosterBlazers.css";

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

const GLeagueRosterBlazers = () => {
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

        const { data: blazersPlayers, error: blazersError } = await supabase
          .from("Players")
          .select("*")
          .eq("g_league", "Portland Blazers")
          .neq("id", 1); // Исключаем игрока с id = 1 чтобы избежать дублирования

        if (blazersError) throw blazersError;

        // Объединяем данные: сначала специальный игрок, затем остальные
        const combinedPlayers = [
          ...(specialPlayer ? [specialPlayer] : []),
          ...(blazersPlayers || []),
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
      <div className="loading-text-blazers">Loading Blazers Roster...</div>
    );
  }

  return (
    <div className="blazers-containers">
      <div className="header-content-blazers">
        <h1 className="header-title-blazers">G-LEAGUE</h1>
      </div>

      <div className="table-containersss-blazers">
        <div className="table-wrapper-blazers">
          <table className="players-table-blazers">
            <tbody className="table-body-blazers">
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
                        ? "first-row-highlight-blazers"
                        : "tables-row-blazers"
                    }
                  >
                    <td className="table-tdw-blazers player-id-blazers">
                      {displayNumber}
                    </td>
                    <td className="table-td-blazers">
                      <span
                        className={`roster-badge-blazers ${
                          player.active_roster === "Yes"
                            ? "badge-active-blazers"
                            : "badge-inactive-blazers"
                        }`}
                      >
                        {player.active_roster}
                      </span>
                    </td>
                    <td className="table-td-blazers player-position-blazers">
                      {player.position}
                    </td>
                    <td className="table-td-blazers">{player.pos_elig}</td>
                    <td className="table-td-blazers player-age-blazers">
                      {player.age}
                    </td>
                    <td className="table-td-blazers">{player.year_one}</td>
                    <td className="table-td-blazers">{player.year_two}</td>
                    <td className="table-td-blazers">{player.year_three}</td>
                    <td className="table-td-blazers">{player.year_four}</td>
                    <td className="table-td-blazers">{player.year_five}</td>
                    <td className="table-td-blazers">{player.opt}</td>
                    <td className="table-td-blazers">{player.exp}</td>
                    <td className="table-td-blazers">{player.bird}</td>
                    <td className="table-td-blazers">{player.awards}</td>
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

export default GLeagueRosterBlazers;
