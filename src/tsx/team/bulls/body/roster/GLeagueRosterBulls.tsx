import React, { useEffect, useState } from "react";
import { supabase } from "../../../../../Supabase";
import "./gLeagueRosterBulls.css";

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

const GLeagueRosterBulls = () => {
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

        const { data: bullsPlayers, error: bullsError } = await supabase
          .from("Players")
          .select("*")
          .eq("g_league", "Chicago Bulls")
          .neq("id", 1); // Исключаем игрока с id = 1 чтобы избежать дублирования

        if (bullsError) throw bullsError;

        // Объединяем данные: сначала специальный игрок, затем остальные
        const combinedPlayers = [
          ...(specialPlayer ? [specialPlayer] : []),
          ...(bullsPlayers || []),
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
    return <div className="loading-text">Loading Bulls Roster...</div>;
  }

  return (
    <div className="bulls-containers">
      <div className="header-content-bulls">
        <h1 className="header-title-bulls">G-LEAGUE</h1>
      </div>

      <div className="table-containersss-bulls">
        <div className="table-wrapper-bulls">
          <table className="players-table-bulls">
            <tbody className="table-body-bulls">
              {players.map((player, index) => {
                // Определяем номер для отображения
                let displayNumber;
                if (player.id === 1) {
                  displayNumber = "★"; // Звездочка для игрока с id = 1
                } else {
                  // Для остальных игроков - порядковый номер (игнорируя игрока с id = 1)
                  displayNumber = `${index}`;
                }

                return (
                  <tr
                    key={player.id}
                    className={
                      index === 0
                        ? "first-row-highlight-bulls"
                        : "tables-row-bulls"
                    }
                  >
                    <td className="table-tdw-bulls player-id-bulls">
                      {displayNumber}
                    </td>
                    <td className="table-td-bulls">
                      <span
                        className={`roster-badge-bulls ${
                          player.active_roster === "Yes"
                            ? "badge-active-bulls"
                            : "badge-inactive-bulls"
                        }`}
                      >
                        {player.active_roster}
                      </span>
                    </td>
                    <td className="table-td-bulls player-position-bulls">
                      {player.position}
                    </td>
                    <td className="table-td-bulls">{player.pos_elig}</td>
                    <td className="table-td-bulls player-age-bulls">
                      {player.age}
                    </td>
                    <td className="table-td-bulls">{player.year_one}</td>
                    <td className="table-td-bulls">{player.year_two}</td>
                    <td className="table-td-bulls">{player.year_three}</td>
                    <td className="table-td-bulls">{player.year_four}</td>
                    <td className="table-td-bulls">{player.year_five}</td>
                    <td className="table-td-bulls">{player.opt}</td>
                    <td className="table-td-bulls">{player.exp}</td>
                    <td className="table-td-bulls">{player.bird}</td>
                    <td className="table-td-bulls">{player.awards}</td>
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

export default GLeagueRosterBulls;
