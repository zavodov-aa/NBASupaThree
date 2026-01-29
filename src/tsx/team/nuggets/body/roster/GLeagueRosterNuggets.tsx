import React, { useEffect, useState } from "react";
import { supabase } from "../../../../../Supabase";
import "./gLeagueRosterNuggets.css";

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

const GLeagueRosterNuggets = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const { data: specialPlayer, error: specialError } = await supabase
          .from("Players")
          .select("*")
          .eq("id", 1)
          .single();

        const { data: nuggetsPlayers, error: nuggetsError } = await supabase
          .from("Players")
          .select("*")
          .eq("g_league", "Denver Nuggets")
          .neq("id", 1);

        if (nuggetsError) throw nuggetsError;

        const combinedPlayers = [
          ...(specialPlayer ? [specialPlayer] : []),
          ...(nuggetsPlayers || []),
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
    return <div className="loading-text">Loading Nuggets Roster...</div>;
  }

  return (
    <div className="nuggets-containers">
      <div className="header-content-nuggets">
        <h1 className="header-title-nuggets">G-LEAGUE</h1>
      </div>

      <div className="table-containersss-nuggets">
        <div className="table-wrapper-nuggets">
          <table className="players-table-nuggets">
            <tbody className="table-body-nuggets">
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
                        ? "first-row-highlight-nuggets"
                        : "tables-row-nuggets"
                    }
                  >
                    <td className="table-tdw-nuggets player-id-nuggets">
                      {displayNumber}
                    </td>
                    <td className="table-td-nuggets">
                      <span
                        className={`roster-badge-nuggets ${
                          player.active_roster === "Yes"
                            ? "badge-active-nuggets"
                            : "badge-inactive-nuggets"
                        }`}
                      >
                        {player.active_roster}
                      </span>
                    </td>
                    <td className="table-td-nuggets player-position-nuggets">
                      {player.position}
                    </td>
                    <td className="table-td-nuggets">{player.pos_elig}</td>
                    <td className="table-td-nuggets player-age-nuggets">
                      {player.age}
                    </td>
                    <td className="table-td-nuggets">{player.year_one}</td>
                    <td className="table-td-nuggets">{player.year_two}</td>
                    <td className="table-td-nuggets">{player.year_three}</td>
                    <td className="table-td-nuggets">{player.year_four}</td>
                    <td className="table-td-nuggets">{player.year_five}</td>
                    <td className="table-td-nuggets">{player.opt}</td>
                    <td className="table-td-nuggets">{player.exp}</td>
                    <td className="table-td-nuggets">{player.bird}</td>
                    <td className="table-td-nuggets">{player.awards}</td>
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

export default GLeagueRosterNuggets;
