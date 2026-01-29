import React, { useEffect, useState } from "react";
import { supabase } from "../../../../../Supabase";
import "./gLeagueRosterKings.css";

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

const GLeagueRosterKings = () => {
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

        const { data: kingsPlayers, error: kingsError } = await supabase
          .from("Players")
          .select("*")
          .eq("g_league", "Sacramento Kings")
          .neq("id", 1); // Исключаем игрока с id = 1 чтобы избежать дублирования

        if (kingsError) throw kingsError;

        // Объединяем данные: сначала специальный игрок, затем остальные
        const combinedPlayers = [
          ...(specialPlayer ? [specialPlayer] : []),
          ...(kingsPlayers || []),
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
    return <div className="loading-text">Loading Kings Roster...</div>;
  }

  return (
    <div className="kings-containers">
      <div className="header-content-kings">
        <h1 className="header-title-kings">G-LEAGUE</h1>
      </div>

      <div className="table-containersss-kings">
        <div className="table-wrapper-kings">
          <table className="players-table-kings">
            <tbody className="table-body-kings">
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
                        ? "first-row-highlight-kings"
                        : "tables-row-kings"
                    }
                  >
                    <td className="table-tdw-kings player-id-kings">
                      {displayNumber}
                    </td>
                    <td className="table-td-kings">
                      <span
                        className={`roster-badge-kings ${
                          player.active_roster === "Yes"
                            ? "badge-active-kings"
                            : "badge-inactive-kings"
                        }`}
                      >
                        {player.active_roster}
                      </span>
                    </td>
                    <td className="table-td-kings player-position-kings">
                      {player.position}
                    </td>
                    <td className="table-td-kings">{player.pos_elig}</td>
                    <td className="table-td-kings player-age-kings">
                      {player.age}
                    </td>
                    <td className="table-td-kings">{player.year_one}</td>
                    <td className="table-td-kings">{player.year_two}</td>
                    <td className="table-td-kings">{player.year_three}</td>
                    <td className="table-td-kings">{player.year_four}</td>
                    <td className="table-td-kings">{player.year_five}</td>
                    <td className="table-td-kings">{player.opt}</td>
                    <td className="table-td-kings">{player.exp}</td>
                    <td className="table-td-kings">{player.bird}</td>
                    <td className="table-td-kings">{player.awards}</td>
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

export default GLeagueRosterKings;
