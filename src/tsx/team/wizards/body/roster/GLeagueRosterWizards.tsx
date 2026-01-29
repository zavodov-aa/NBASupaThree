import React, { useEffect, useState } from "react";
import { supabase } from "../../../../../Supabase";
import "./gLeagueRosterWizards.css";

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

const GLeagueRosterWizards = () => {
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

        const { data: wizardsPlayers, error: wizardsError } = await supabase
          .from("Players")
          .select("*")
          .eq("g_league", "Washington Wizards")
          .neq("id", 1); // Исключаем игрока с id = 1 чтобы избежать дублирования

        if (wizardsError) throw wizardsError;

        // Объединяем данные: сначала специальный игрок, затем остальные
        const combinedPlayers = [
          ...(specialPlayer ? [specialPlayer] : []),
          ...(wizardsPlayers || []),
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
    return <div className="loading-text">Loading Wizards Roster...</div>;
  }

  return (
    <div className="wizards-containers">
      <div className="header-content-wizards">
        <h1 className="header-title-wizards">G-LEAGUE</h1>
      </div>

      <div className="table-containersss-wizards">
        <div className="table-wrapper-wizards">
          <table className="players-table-wizards">
            <tbody className="table-body-wizards">
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
                        ? "first-row-highlight-wizards"
                        : "tables-row-wizards"
                    }
                  >
                    <td className="table-tdw-wizards player-id-wizards">
                      {displayNumber}
                    </td>
                    <td className="table-td-wizards">
                      <span
                        className={`roster-badge-wizards ${
                          player.active_roster === "Yes"
                            ? "badge-active-wizards"
                            : "badge-inactive-wizards"
                        }`}
                      >
                        {player.active_roster}
                      </span>
                    </td>
                    <td className="table-td-wizards player-position-wizards">
                      {player.position}
                    </td>
                    <td className="table-td-wizards">{player.pos_elig}</td>
                    <td className="table-td-wizards player-age-wizards">
                      {player.age}
                    </td>
                    <td className="table-td-wizards">{player.year_one}</td>
                    <td className="table-td-wizards">{player.year_two}</td>
                    <td className="table-td-wizards">{player.year_three}</td>
                    <td className="table-td-wizards">{player.year_four}</td>
                    <td className="table-td-wizards">{player.year_five}</td>
                    <td className="table-td-wizards">{player.opt}</td>
                    <td className="table-td-wizards">{player.exp}</td>
                    <td className="table-td-wizards">{player.bird}</td>
                    <td className="table-td-wizards">{player.awards}</td>
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

export default GLeagueRosterWizards;
