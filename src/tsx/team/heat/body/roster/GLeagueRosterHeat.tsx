import React, { useEffect, useState } from "react";
import { supabase } from "../../../../../Supabase";
import "./gLeagueRosterHeat.css";

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

const GLeagueRosterHeat = () => {
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

        const { data: heatPlayers, error: heatError } = await supabase
          .from("Players")
          .select("*")
          .eq("g_league", "Miami Heat")
          .neq("id", 1);

        if (heatError) throw heatError;

        const combinedPlayers = [
          ...(specialPlayer ? [specialPlayer] : []),
          ...(heatPlayers || []),
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
    return <div className="loading-text">Loading Heat Roster...</div>;
  }

  return (
    <div className="heat-containers">
      <div className="header-content-heat">
        <h1 className="header-title-heat">G-LEAGUE</h1>
      </div>

      <div className="table-containersss-heat">
        <div className="table-wrapper-heat">
          <table className="players-table-heat">
            <tbody className="table-body-heat">
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
                        ? "first-row-highlight-heat"
                        : "tables-row-heat"
                    }
                  >
                    <td className="table-tdw-heat player-id-heat">
                      {displayNumber}
                    </td>
                    <td className="table-td-heat">
                      <span
                        className={`roster-badge-heat ${
                          player.active_roster === "Yes"
                            ? "badge-active-heat"
                            : "badge-inactive-heat"
                        }`}
                      >
                        {player.active_roster}
                      </span>
                    </td>
                    <td className="table-td-heat player-position-heat">
                      {player.position}
                    </td>
                    <td className="table-td-heat">{player.pos_elig}</td>
                    <td className="table-td-heat player-age-heat">
                      {player.age}
                    </td>
                    <td className="table-td-heat">{player.year_one}</td>
                    <td className="table-td-heat">{player.year_two}</td>
                    <td className="table-td-heat">{player.year_three}</td>
                    <td className="table-td-heat">{player.year_four}</td>
                    <td className="table-td-heat">{player.year_five}</td>
                    <td className="table-td-heat">{player.opt}</td>
                    <td className="table-td-heat">{player.exp}</td>
                    <td className="table-td-heat">{player.bird}</td>
                    <td className="table-td-heat">{player.awards}</td>
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

export default GLeagueRosterHeat;
