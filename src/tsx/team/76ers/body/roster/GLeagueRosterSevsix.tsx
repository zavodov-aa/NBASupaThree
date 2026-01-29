import React, { useEffect, useState } from "react";
import { supabase } from "../../../../../Supabase";
import "./gLeagueRosterSevsix.css";

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

const GLeagueRosterSevsix = () => {
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

        const { data: sevsixPlayers, error: sevsixError } = await supabase
          .from("Players")
          .select("*")
          .eq("g_league", "Philadelphia 76ers")
          .neq("id", 1); // Исключаем игрока с id = 1 чтобы избежать дублирования

        if (sevsixError) throw sevsixError;

        // Объединяем данные: сначала специальный игрок, затем остальные
        const combinedPlayers = [
          ...(specialPlayer ? [specialPlayer] : []),
          ...(sevsixPlayers || []),
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
    return <div className="loading-text">Loading 76ers Roster...</div>;
  }

  return (
    <div className="sevsix-containers">
      <div className="header-content-sevsix">
        <h1 className="header-title-sevsix">G-LEAGUE</h1>
      </div>

      <div className="table-containersss-sevsix">
        <div className="table-wrapper-sevsix">
          <table className="players-table-sevsix">
            <tbody className="table-body-sevsix">
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
                        ? "first-row-highlight-sevsix"
                        : "tables-row-sevsix"
                    }
                  >
                    <td className="table-tdw-sevsix player-id-sevsix">
                      {displayNumber}
                    </td>
                    <td className="table-td-sevsix">
                      <span
                        className={`roster-badge-sevsix ${
                          player.active_roster === "Yes"
                            ? "badge-active-sevsix"
                            : "badge-inactive-sevsix"
                        }`}
                      >
                        {player.active_roster}
                      </span>
                    </td>
                    <td className="table-td-sevsix player-position-sevsix">
                      {player.position}
                    </td>
                    <td className="table-td-sevsix">{player.pos_elig}</td>
                    <td className="table-td-sevsix player-age-sevsix">
                      {player.age}
                    </td>
                    <td className="table-td-sevsix">{player.year_one}</td>
                    <td className="table-td-sevsix">{player.year_two}</td>
                    <td className="table-td-sevsix">{player.year_three}</td>
                    <td className="table-td-sevsix">{player.year_four}</td>
                    <td className="table-td-sevsix">{player.year_five}</td>
                    <td className="table-td-sevsix">{player.opt}</td>
                    <td className="table-td-sevsix">{player.exp}</td>
                    <td className="table-td-sevsix">{player.bird}</td>
                    <td className="table-td-sevsix">{player.awards}</td>
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

export default GLeagueRosterSevsix;
