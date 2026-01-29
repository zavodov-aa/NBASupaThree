import React, { useEffect, useState } from "react";
import { supabase } from "../../../../../Supabase";
import "./gLeagueRosterCeltics.css";

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

const GLeagueRosterCeltics = () => {
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

        const { data: celticsPlayers, error: celticsError } = await supabase
          .from("Players")
          .select("*")
          .eq("g_league", "Boston Celtics")
          .neq("id", 1); // Исключаем игрока с id = 1 чтобы избежать дублирования

        if (celticsError) throw celticsError;

        // Объединяем данные: сначала специальный игрок, затем остальные
        const combinedPlayers = [
          ...(specialPlayer ? [specialPlayer] : []),
          ...(celticsPlayers || []),
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
    return <div className="loading-text">Loading Celtics Roster...</div>;
  }

  return (
    <div className="celtics-containers">
      <div className="header-content-celtics">
        <h1 className="header-title-celtics">G-LEAGUE</h1>
      </div>

      <div className="table-containersss-celtics">
        <div className="table-wrapper-celtics">
          <table className="players-table-celtics">
            <tbody className="table-body-celtics">
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
                        ? "first-row-highlight-celtics"
                        : "tables-row-celtics"
                    }
                  >
                    <td className="table-tdw-celtics player-id-celtics">
                      {displayNumber}
                    </td>
                    <td className="table-td-celtics">
                      <span
                        className={`roster-badge-celtics ${
                          player.active_roster === "Yes"
                            ? "badge-active-celtics"
                            : "badge-inactive-celtics"
                        }`}
                      >
                        {player.active_roster}
                      </span>
                    </td>
                    <td className="table-td-celtics player-position-celtics">
                      {player.position}
                    </td>
                    <td className="table-td-celtics">{player.pos_elig}</td>
                    <td className="table-td-celtics player-age-celtics">
                      {player.age}
                    </td>
                    <td className="table-td-celtics">{player.year_one}</td>
                    <td className="table-td-celtics">{player.year_two}</td>
                    <td className="table-td-celtics">{player.year_three}</td>
                    <td className="table-td-celtics">{player.year_four}</td>
                    <td className="table-td-celtics">{player.year_five}</td>
                    <td className="table-td-celtics">{player.opt}</td>
                    <td className="table-td-celtics">{player.exp}</td>
                    <td className="table-td-celtics">{player.bird}</td>
                    <td className="table-td-celtics">{player.awards}</td>
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

export default GLeagueRosterCeltics;
