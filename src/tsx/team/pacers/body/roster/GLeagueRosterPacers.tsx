import React, { useEffect, useState } from "react";
import { supabase } from "../../../../../Supabase";
import "./gLeagueRosterPacers.css";

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

const GLeagueRosterPacers = () => {
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

        const { data: pacersPlayers, error: pacersError } = await supabase
          .from("Players")
          .select("*")
          .eq("g_league", "Indiana Pacers")
          .neq("id", 1); // Исключаем игрока с id = 1 чтобы избежать дублирования

        if (pacersError) throw pacersError;

        // Объединяем данные: сначала специальный игрок, затем остальные
        const combinedPlayers = [
          ...(specialPlayer ? [specialPlayer] : []),
          ...(pacersPlayers || []),
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
    return <div className="loading-text-pacers">Loading Pacers Roster...</div>;
  }

  return (
    <div className="pacers-containers">
      <div className="header-content-pacers">
        <h1 className="header-title-pacers">G-LEAGUE</h1>
      </div>

      <div className="table-containersss-pacers">
        <div className="table-wrapper-pacers">
          <table className="players-table-pacers">
            <tbody className="table-body-pacers">
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
                        ? "first-row-highlight-pacers"
                        : "tables-row-pacers"
                    }
                  >
                    <td className="table-tdw-pacers player-id-pacers">
                      {displayNumber}
                    </td>
                    <td className="table-td-pacers">
                      <span
                        className={`roster-badge-pacers ${
                          player.active_roster === "Yes"
                            ? "badge-active-pacers"
                            : "badge-inactive-pacers"
                        }`}
                      >
                        {player.active_roster}
                      </span>
                    </td>
                    <td className="table-td-pacers player-position-pacers">
                      {player.position}
                    </td>
                    <td className="table-td-pacers">{player.pos_elig}</td>
                    <td className="table-td-pacers player-age-pacers">
                      {player.age}
                    </td>
                    <td className="table-td-pacers">{player.year_one}</td>
                    <td className="table-td-pacers">{player.year_two}</td>
                    <td className="table-td-pacers">{player.year_three}</td>
                    <td className="table-td-pacers">{player.year_four}</td>
                    <td className="table-td-pacers">{player.year_five}</td>
                    <td className="table-td-pacers">{player.opt}</td>
                    <td className="table-td-pacers">{player.exp}</td>
                    <td className="table-td-pacers">{player.bird}</td>
                    <td className="table-td-pacers">{player.awards}</td>
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

export default GLeagueRosterPacers;
