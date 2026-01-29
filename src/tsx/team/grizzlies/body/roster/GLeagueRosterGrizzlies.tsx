import React, { useEffect, useState } from "react";
import { supabase } from "../../../../../Supabase";
import "./gLeagueRosterGrizzlies.css";

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

const GLeagueRosterGrizzlies = () => {
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

        const { data: grizzliesPlayers, error: grizzliesError } = await supabase
          .from("Players")
          .select("*")
          .eq("g_league", "Memphis Grizzlies")
          .neq("id", 1); // Исключаем игрока с id = 1 чтобы избежать дублирования

        if (grizzliesError) throw grizzliesError;

        // Объединяем данные: сначала специальный игрок, затем остальные
        const combinedPlayers = [
          ...(specialPlayer ? [specialPlayer] : []),
          ...(grizzliesPlayers || []),
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
    return <div className="loading-text">Loading Grizzlies Roster...</div>;
  }

  return (
    <div className="grizzlies-containers">
      <div className="header-content-grizzlies">
        <h1 className="header-title-grizzlies">G-LEAGUE</h1>
      </div>

      <div className="table-containersss-grizzlies">
        <div className="table-wrapper-grizzlies">
          <table className="players-table-grizzlies">
            <tbody className="table-body-grizzlies">
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
                        ? "first-row-highlight-grizzlies"
                        : "tables-row-grizzlies"
                    }
                  >
                    <td className="table-tdw-grizzlies player-id-grizzlies">
                      {displayNumber}
                    </td>
                    <td className="table-td-grizzlies">
                      <span
                        className={`roster-badge-grizzlies ${
                          player.active_roster === "Yes"
                            ? "badge-active-grizzlies"
                            : "badge-inactive-grizzlies"
                        }`}
                      >
                        {player.active_roster}
                      </span>
                    </td>
                    <td className="table-td-grizzlies player-position-grizzlies">
                      {player.position}
                    </td>
                    <td className="table-td-grizzlies">{player.pos_elig}</td>
                    <td className="table-td-grizzlies player-age-grizzlies">
                      {player.age}
                    </td>
                    <td className="table-td-grizzlies">{player.year_one}</td>
                    <td className="table-td-grizzlies">{player.year_two}</td>
                    <td className="table-td-grizzlies">{player.year_three}</td>
                    <td className="table-td-grizzlies">{player.year_four}</td>
                    <td className="table-td-grizzlies">{player.year_five}</td>
                    <td className="table-td-grizzlies">{player.opt}</td>
                    <td className="table-td-grizzlies">{player.exp}</td>
                    <td className="table-td-grizzlies">{player.bird}</td>
                    <td className="table-td-grizzlies">{player.awards}</td>
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

export default GLeagueRosterGrizzlies;
