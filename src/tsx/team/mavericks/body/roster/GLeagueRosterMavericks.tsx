import React, { useEffect, useState } from "react";
import { supabase } from "../../../../../Supabase";
import "./gLeagueRosterMavericks.css";

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

const GLeagueRosterMavericks = () => {
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

        const { data: mavericksPlayers, error: mavericksError } = await supabase
          .from("Players")
          .select("*")
          .eq("g_league", "Dallas Mavericks") // Изменено на Dallas Mavericks
          .neq("id", 1); // Исключаем игрока с id = 1 чтобы избежать дублирования

        if (mavericksError) throw mavericksError;

        // Объединяем данные: сначала специальный игрок, затем остальные
        const combinedPlayers = [
          ...(specialPlayer ? [specialPlayer] : []),
          ...(mavericksPlayers || []),
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
      <div className="loading-text-mavericks">Loading Mavericks Roster...</div>
    ); // Изменено
  }

  return (
    <div className="mavericks-containers">
      {" "}
      {/* Изменено */}
      <div className="header-content-mavericks">
        {" "}
        {/* Изменено */}
        <h1 className="header-title-mavericks">G-LEAGUE</h1> {/* Изменено */}
      </div>
      <div className="table-containersss-mavericks">
        {" "}
        {/* Изменено */}
        <div className="table-wrapper-mavericks">
          {" "}
          {/* Изменено */}
          <table className="players-table-mavericks">
            {" "}
            {/* Изменено */}
            <tbody className="table-body-mavericks">
              {" "}
              {/* Изменено */}
              {players.map((player, index) => {
                // Определяем номер для отображения
                let displayNumber;
                if (player.id === 1) {
                  displayNumber = "★"; // Звездочка для игрока с id = 1
                } else {
                  // Для остальных игроков - порядковый номер
                  displayNumber = `${index}`;
                }

                return (
                  <tr
                    key={player.id}
                    className={
                      index === 0
                        ? "first-row-highlight-mavericks" // Изменено
                        : "tables-row-mavericks" // Изменено
                    }
                  >
                    <td className="table-tdw-mavericks player-id-mavericks">
                      {" "}
                      {/* Изменено */}
                      {displayNumber}
                    </td>
                    <td className="table-td-mavericks">
                      {" "}
                      {/* Изменено */}
                      <span
                        className={`roster-badge-mavericks ${
                          // Изменено
                          player.active_roster === "Yes"
                            ? "badge-active-mavericks" // Изменено
                            : "badge-inactive-mavericks" // Изменено
                        }`}
                      >
                        {player.active_roster}
                      </span>
                    </td>
                    <td className="table-td-mavericks player-position-mavericks">
                      {" "}
                      {/* Изменено */}
                      {player.position}
                    </td>
                    <td className="table-td-mavericks">{player.pos_elig}</td>
                    <td className="table-td-mavericks player-age-mavericks">
                      {" "}
                      {/* Изменено */}
                      {player.age}
                    </td>
                    <td className="table-td-mavericks">{player.year_one}</td>
                    <td className="table-td-mavericks">{player.year_two}</td>
                    <td className="table-td-mavericks">{player.year_three}</td>
                    <td className="table-td-mavericks">{player.year_four}</td>
                    <td className="table-td-mavericks">{player.year_five}</td>
                    <td className="table-td-mavericks">{player.opt}</td>
                    <td className="table-td-mavericks">{player.exp}</td>
                    <td className="table-td-mavericks">{player.bird}</td>
                    <td className="table-td-mavericks">{player.awards}</td>
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

export default GLeagueRosterMavericks;
