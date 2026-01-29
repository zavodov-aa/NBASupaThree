import React, { useEffect, useState } from "react";
import { supabase } from "../../../../../Supabase";
import "./gLeagueRosterSuns.css";

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

const GLeagueRosterSuns = () => {
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

        const { data: sunsPlayers, error: sunsError } = await supabase
          .from("Players")
          .select("*")
          .eq("g_league", "Phoenix Suns")
          .neq("id", 1);

        if (sunsError) throw sunsError;

        const combinedPlayers = [
          ...(specialPlayer ? [specialPlayer] : []),
          ...(sunsPlayers || []),
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
    return <div className="loading-text-suns">Loading Suns Roster...</div>;
  }

  return (
    <div className="suns-containers">
      <div className="header-content-suns">
        <h1 className="header-title-suns">G-LEAGUE</h1>
      </div>

      <div className="table-containersss-suns">
        <div className="table-wrapper-suns">
          <table className="players-table-suns">
            <tbody className="table-body-suns">
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
                        ? "first-row-highlight-suns"
                        : "tables-row-suns"
                    }
                  >
                    <td className="table-tdw-suns player-id-suns">
                      {displayNumber}
                    </td>
                    <td className="table-td-suns">
                      <span
                        className={`roster-badge-suns ${
                          player.active_roster === "Yes"
                            ? "badge-active-suns"
                            : "badge-inactive-suns"
                        }`}
                      >
                        {player.active_roster}
                      </span>
                    </td>
                    <td className="table-td-suns player-position-suns">
                      {player.position}
                    </td>
                    <td className="table-td-suns">{player.pos_elig}</td>
                    <td className="table-td-suns player-age-suns">
                      {player.age}
                    </td>
                    <td className="table-td-suns">{player.year_one}</td>
                    <td className="table-td-suns">{player.year_two}</td>
                    <td className="table-td-suns">{player.year_three}</td>
                    <td className="table-td-suns">{player.year_four}</td>
                    <td className="table-td-suns">{player.year_five}</td>
                    <td className="table-td-suns">{player.opt}</td>
                    <td className="table-td-suns">{player.exp}</td>
                    <td className="table-td-suns">{player.bird}</td>
                    <td className="table-td-suns">{player.awards}</td>
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

export default GLeagueRosterSuns;
