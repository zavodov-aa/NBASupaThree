import React, { useEffect, useState } from "react";
import { supabase } from "../../../../../Supabase";
import "./gLeagueRosterMagic.css";

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

const GLeagueRosterMagic = () => {
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

        const { data: magicPlayers, error: magicError } = await supabase
          .from("Players")
          .select("*")
          .eq("g_league", "Orlando Magic")
          .neq("id", 1); // Исключаем игрока с id = 1 чтобы избежать дублирования

        if (magicError) throw magicError;

        // Объединяем данные: сначала специальный игрок, затем остальные
        const combinedPlayers = [
          ...(specialPlayer ? [specialPlayer] : []),
          ...(magicPlayers || []),
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
    return <div className="loading-text">Loading Magic Roster...</div>;
  }

  return (
    <div className="magic-containers">
      <div className="header-content-magic">
        <h1 className="header-title-magic">G-LEAGUE</h1>
      </div>

      <div className="table-containersss-magic">
        <div className="table-wrapper-magic">
          <table className="players-table-magic">
            <tbody className="table-body-magic">
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
                        ? "first-row-highlight-magic"
                        : "tables-row-magic"
                    }
                  >
                    <td className="table-tdw-magic player-id-magic">
                      {displayNumber}
                    </td>
                    <td className="table-td-magic">
                      <span
                        className={`roster-badge-magic ${
                          player.active_roster === "Yes"
                            ? "badge-active-magic"
                            : "badge-inactive-magic"
                        }`}
                      >
                        {player.active_roster}
                      </span>
                    </td>
                    <td className="table-td-magic player-position-magic">
                      {player.position}
                    </td>
                    <td className="table-td-magic">{player.pos_elig}</td>
                    <td className="table-td-magic player-age-magic">
                      {player.age}
                    </td>
                    <td className="table-td-magic">{player.year_one}</td>
                    <td className="table-td-magic">{player.year_two}</td>
                    <td className="table-td-magic">{player.year_three}</td>
                    <td className="table-td-magic">{player.year_four}</td>
                    <td className="table-td-magic">{player.year_five}</td>
                    <td className="table-td-magic">{player.opt}</td>
                    <td className="table-td-magic">{player.exp}</td>
                    <td className="table-td-magic">{player.bird}</td>
                    <td className="table-td-magic">{player.awards}</td>
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

export default GLeagueRosterMagic;
