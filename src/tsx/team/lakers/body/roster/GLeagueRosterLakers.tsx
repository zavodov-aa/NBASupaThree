import React, { useEffect, useState } from "react";
import { supabase } from "../../../../../Supabase";
import "./GLeagueRosterLakers.css";

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

const GLeagueRosterLakers = () => {
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

        // Запрашиваем остальных игроков Lakers
        const { data: lakersPlayers, error: lakersError } = await supabase
          .from("Players")
          .select("*")
          .eq("g_league", "Los Angeles Lakers")
          .neq("id", 1); // Исключаем игрока с id = 1 чтобы избежать дублирования

        if (lakersError) throw lakersError;

        // Объединяем данные: сначала специальный игрок, затем остальные
        const combinedPlayers = [
          ...(specialPlayer ? [specialPlayer] : []),
          ...(lakersPlayers || []),
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
    return <div className="loading-text">Loading Lakers Roster...</div>;
  }

  return (
    <div className="lakers-containers">
      <div className="header-content">
        <h1 className="header-title">G-LEAGUE</h1>
      </div>

      <div className="table-containersss">
        <div className="table-wrapper">
          <table className="players-table">
            <tbody className="table-body">
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
                      index === 0 ? "first-row-highlight" : "tables-row"
                    }
                  >
                    <td className="table-tdw player-id">{displayNumber}</td>
                    <td className="table-td">
                      <span
                        className={`roster-badge ${
                          player.active_roster === "Yes"
                            ? "badge-active"
                            : "badge-inactive"
                        }`}
                      >
                        {player.active_roster}
                      </span>
                    </td>
                    <td className="table-td player-position">
                      {player.position}
                    </td>
                    <td className="table-td">{player.pos_elig}</td>
                    <td className="table-td player-age">{player.age}</td>
                    <td className="table-td">{player.year_one}</td>
                    <td className="table-td">{player.year_two}</td>
                    <td className="table-td">{player.year_three}</td>
                    <td className="table-td">{player.year_four}</td>
                    <td className="table-td">{player.year_five}</td>
                    <td className="table-td">{player.opt}</td>
                    <td className="table-td">{player.exp}</td>
                    <td className="table-td">{player.bird}</td>
                    <td className="table-td">{player.awards}</td>
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

export default GLeagueRosterLakers;
