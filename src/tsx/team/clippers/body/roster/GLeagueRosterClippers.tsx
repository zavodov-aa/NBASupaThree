import React, { useEffect, useState } from "react";
import { supabase } from "../../../../../Supabase";
import "./gLeagueRosterClippers.css";

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

const GLeagueRosterClippers = () => {
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

        const { data: clippersPlayers, error: clippersError } = await supabase
          .from("Players")
          .select("*")
          .eq("g_league", "LA Clippers")
          .neq("id", 1); // Исключаем игрока с id = 1 чтобы избежать дублирования

        if (clippersError) throw clippersError;

        // Объединяем данные: сначала специальный игрок, затем остальные
        const combinedPlayers = [
          ...(specialPlayer ? [specialPlayer] : []),
          ...(clippersPlayers || []),
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
    return <div className="loading-text">Loading Clippers Roster...</div>;
  }

  return (
    <div className="clippers-containers">
      <div className="header-content-clippers">
        <h1 className="header-title-clippers">G-LEAGUE</h1>
      </div>

      <div className="table-containersss-clippers">
        <div className="table-wrapper-clippers">
          <table className="players-table-clippers">
            <tbody className="table-body-clippers">
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
                        ? "first-row-highlight-clippers"
                        : "tables-row-clippers"
                    }
                  >
                    <td className="table-tdw-clippers player-id-clippers">
                      {displayNumber}
                    </td>
                    <td className="table-td-clippers">
                      <span
                        className={`roster-badge-clippers ${
                          player.active_roster === "Yes"
                            ? "badge-active-clippers"
                            : "badge-inactive-clippers"
                        }`}
                      >
                        {player.active_roster}
                      </span>
                    </td>
                    <td className="table-td-clippers player-position-clippers">
                      {player.position}
                    </td>
                    <td className="table-td-clippers">{player.pos_elig}</td>
                    <td className="table-td-clippers player-age-clippers">
                      {player.age}
                    </td>
                    <td className="table-td-clippers">{player.year_one}</td>
                    <td className="table-td-clippers">{player.year_two}</td>
                    <td className="table-td-clippers">{player.year_three}</td>
                    <td className="table-td-clippers">{player.year_four}</td>
                    <td className="table-td-clippers">{player.year_five}</td>
                    <td className="table-td-clippers">{player.opt}</td>
                    <td className="table-td-clippers">{player.exp}</td>
                    <td className="table-td-clippers">{player.bird}</td>
                    <td className="table-td-clippers">{player.awards}</td>
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

export default GLeagueRosterClippers;
