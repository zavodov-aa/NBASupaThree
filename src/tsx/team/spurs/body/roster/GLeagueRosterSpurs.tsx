import React, { useEffect, useState } from "react";
import { supabase } from "../../../../../Supabase";
import "./gLeagueRosterSpurs.css";

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

const GLeagueRosterSpurs = () => {
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

        const { data: spursPlayers, error: spursError } = await supabase
          .from("Players")
          .select("*")
          .eq("g_league", "San Antonio Spurs")
          .neq("id", 1);

        if (spursError) throw spursError;

        // Объединяем данные: сначала специальный игрок, затем остальные
        const combinedPlayers = [
          ...(specialPlayer ? [specialPlayer] : []),
          ...(spursPlayers || []),
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
    return <div className="loading-text-spurs">Loading Spurs Roster...</div>;
  }

  return (
    <div className="spurs-containers">
      <div className="header-content-spurs">
        <h1 className="header-title-spurs">G-LEAGUE</h1>
      </div>

      <div className="table-containersss-spurs">
        <div className="table-wrapper-spurs">
          <table className="players-table-spurs">
            <tbody className="table-body-spurs">
              {players.map((player, index) => {
                let displayNumber;
                if (player.id === 1) {
                  displayNumber = "★";
                } else {
                  displayNumber = `${index}`;
                }

                return (
                  <tr
                    key={player.id}
                    className={
                      index === 0
                        ? "first-row-highlight-spurs"
                        : "tables-row-spurs"
                    }
                  >
                    <td className="table-tdw-spurs player-id-spurs">
                      {displayNumber}
                    </td>
                    <td className="table-td-spurs">
                      <span
                        className={`roster-badge-spurs ${
                          player.active_roster === "Yes"
                            ? "badge-active-spurs"
                            : "badge-inactive-spurs"
                        }`}
                      >
                        {player.active_roster}
                      </span>
                    </td>
                    <td className="table-td-spurs player-position-spurs">
                      {player.position}
                    </td>
                    <td className="table-td-spurs">{player.pos_elig}</td>
                    <td className="table-td-spurs player-age-spurs">
                      {player.age}
                    </td>
                    <td className="table-td-spurs">{player.year_one}</td>
                    <td className="table-td-spurs">{player.year_two}</td>
                    <td className="table-td-spurs">{player.year_three}</td>
                    <td className="table-td-spurs">{player.year_four}</td>
                    <td className="table-td-spurs">{player.year_five}</td>
                    <td className="table-td-spurs">{player.opt}</td>
                    <td className="table-td-spurs">{player.exp}</td>
                    <td className="table-td-spurs">{player.bird}</td>
                    <td className="table-td-spurs">{player.awards}</td>
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

export default GLeagueRosterSpurs;
