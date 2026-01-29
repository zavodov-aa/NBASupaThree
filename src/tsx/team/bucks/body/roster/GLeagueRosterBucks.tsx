import React, { useEffect, useState } from "react";
import { supabase } from "../../../../../Supabase";
import "./gLeagueRosterBucks.css";

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

const GLeagueRosterBucks = () => {
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

        const { data: bucksPlayers, error: bucksError } = await supabase
          .from("Players")
          .select("*")
          .eq("g_league", "Milwaukee Bucks")
          .neq("id", 1); // Исключаем игрока с id = 1 чтобы избежать дублирования

        if (bucksError) throw bucksError;

        // Объединяем данные: сначала специальный игрок, затем остальные
        const combinedPlayers = [
          ...(specialPlayer ? [specialPlayer] : []),
          ...(bucksPlayers || []),
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
    return <div className="loading-text">Loading Bucks Roster...</div>;
  }

  return (
    <div className="bucks-containers">
      <div className="header-content-bucks">
        <h1 className="header-title-bucks">G-LEAGUE</h1>
      </div>

      <div className="table-containersss-bucks">
        <div className="table-wrapper-bucks">
          <table className="players-table-bucks">
            <tbody className="table-body-bucks">
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
                        ? "first-row-highlight-bucks"
                        : "tables-row-bucks"
                    }
                  >
                    <td className="table-tdw-bucks player-id-bucks">
                      {displayNumber}
                    </td>
                    <td className="table-td-bucks">
                      <span
                        className={`roster-badge-bucks ${
                          player.active_roster === "Yes"
                            ? "badge-active-bucks"
                            : "badge-inactive-bucks"
                        }`}
                      >
                        {player.active_roster}
                      </span>
                    </td>
                    <td className="table-td-bucks player-position-bucks">
                      {player.position}
                    </td>
                    <td className="table-td-bucks">{player.pos_elig}</td>
                    <td className="table-td-bucks player-age-bucks">
                      {player.age}
                    </td>
                    <td className="table-td-bucks">{player.year_one}</td>
                    <td className="table-td-bucks">{player.year_two}</td>
                    <td className="table-td-bucks">{player.year_three}</td>
                    <td className="table-td-bucks">{player.year_four}</td>
                    <td className="table-td-bucks">{player.year_five}</td>
                    <td className="table-td-bucks">{player.opt}</td>
                    <td className="table-td-bucks">{player.exp}</td>
                    <td className="table-td-bucks">{player.bird}</td>
                    <td className="table-td-bucks">{player.awards}</td>
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

export default GLeagueRosterBucks;
