import React, { useEffect, useState } from "react";
import { supabase } from "../../../../../Supabase";
import "./gLeagueRosterTimberwolves.css";

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

const GLeagueRosterTimberwolves = () => {
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

        const { data: timberwolvesPlayers, error: timberwolvesError } = await supabase
          .from("Players")
          .select("*")
          .eq("g_league", "Minnesota Timberwolves")
          .neq("id", 1); // Исключаем игрока с id = 1 чтобы избежать дублирования

        if (timberwolvesError) throw timberwolvesError;

        // Объединяем данные: сначала специальный игрок, затем остальные
        const combinedPlayers = [
          ...(specialPlayer ? [specialPlayer] : []),
          ...(timberwolvesPlayers || []),
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
    return <div className="loading-text">Loading Timberwolves Roster...</div>;
  }

  return (
    <div className="timberwolves-container">
      <div className="header-content-timberwolves">
        <h1 className="header-title-timberwolves">G-LEAGUE</h1>
      </div>

      <div className="table-container-timberwolves">
        <div className="table-wrapper-timberwolves">
          <table className="players-table-timberwolves">
            <tbody className="table-body-timberwolves">
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
                        ? "first-row-highlight-timberwolves"
                        : "table-row-timberwolves"
                    }
                  >
                    <td className="table-td-timberwolves player-id-timberwolves">
                      {displayNumber}
                    </td>
                    <td className="table-td-timberwolves">
                      <span
                        className={`roster-badge-timberwolves ${
                          player.active_roster === "Yes"
                            ? "badge-active-timberwolves"
                            : "badge-inactive-timberwolves"
                        }`}
                      >
                        {player.active_roster}
                      </span>
                    </td>
                    <td className="table-td-timberwolves player-position-timberwolves">
                      {player.position}
                    </td>
                    <td className="table-td-timberwolves">{player.pos_elig}</td>
                    <td className="table-td-timberwolves player-age-timberwolves">
                      {player.age}
                    </td>
                    <td className="table-td-timberwolves">{player.year_one}</td>
                    <td className="table-td-timberwolves">{player.year_two}</td>
                    <td className="table-td-timberwolves">{player.year_three}</td>
                    <td className="table-td-timberwolves">{player.year_four}</td>
                    <td className="table-td-timberwolves">{player.year_five}</td>
                    <td className="table-td-timberwolves">{player.opt}</td>
                    <td className="table-td-timberwolves">{player.exp}</td>
                    <td className="table-td-timberwolves">{player.bird}</td>
                    <td className="table-td-timberwolves">{player.awards}</td>
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

export default GLeagueRosterTimberwolves;