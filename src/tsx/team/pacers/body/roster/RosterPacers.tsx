import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import "./rosterPacers.css";

type Player = {
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
};

const supabase = createClient(
  "https://sgbsefgldsmzbvzvpjxt.supabase.co",
  "sb_publishable_Xl99x3YkZHWgS8l-qBSmCg_gXF_Gpcp"
);

const RosterPacers = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const parseSalary = (salary: string | null): number => {
    if (!salary) return 0;
    return parseFloat(salary.replace(/[$,]/g, "")) || 0;
  };

  const sortPlayers = (players: Player[]): Player[] => {
    const specialPlayer = players.find((player) => player.id === 1);
    const otherPlayers = players
      .filter((player) => player.id !== 1)
      .sort((a, b) => parseSalary(b.year_one) - parseSalary(a.year_one));

    return specialPlayer ? [specialPlayer, ...otherPlayers] : otherPlayers;
  };

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const { data, error } = await supabase
          .from("Players")
          .select("*")
          .or("id.eq.1,team.eq.Indiana Pacers")
          .order("id");

        if (error) throw error;
        setPlayers(sortPlayers(data || []));
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  const getColumnHeader = (column: string) => {
    if (!isMobile) return column;
    const shortNames: { [key: string]: string } = {
      "ACTIVE ROSTER": "PLAYER",
      "POS ELIG": "ELIG",
      "YEAR ONE": "Y1",
      "YEAR TWO": "Y2",
      "YEAR THREE": "Y3",
      "YEAR FOUR": "Y4",
      "YEAR FIVE": "Y5",
      OPT: "OPT",
      EXP: "EXP",
      BIRD: "BIRD",
      AWARDS: "AWDS",
    };
    return shortNames[column] || column;
  };

  if (loading) return <div className="loading">Loading Roster...</div>;

  return (
    <div className="rosterPacers">
      <div className="roster-headerPacers">
        <h1>PACERS ROSTER</h1>
        <div className="roster-subtitlePacers">ACTIVE PLAYERS & CONTRACTS</div>
      </div>

      <div className="table-containerPacers">
        <table className="roster-tablePacers">
          <tbody>
            {players.map((player, index) => (
              <tr
                key={player.id}
                className={player.id === 1 ? "franchisePacers" : ""}
              >
                <td>
                  <div className="number-cellPacers">
                    {index + 0}
                    {player.id === 1 && <span className="starPacers">★</span>}
                  </div>
                </td>
                <td>
                  <span className="player-tagPacers ">
                    {player.active_roster}
                  </span>
                </td>
                <td>{player.position}</td>
                <td>{player.pos_elig}</td>
                <td>{player.age || "—"}</td>
                <td className="highlightPacers">{player.year_one || "—"}</td>
                <td>{player.year_two || "—"}</td>
                <td>{player.year_three || "—"}</td>
                <td>{player.year_four || "—"}</td>
                <td>{player.year_five || "—"}</td>
                <td>{player.opt || "—"}</td>
                <td>{player.exp || "—"}</td>
                <td>{player.bird || "—"}</td>
                <td>{player.awards || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {players.length === 0 && (
        <div className="empty-statePacers">
          <div className="empty-iconPacers">🏀</div>
          <div className="empty-titlePacers">No Players in Roster</div>
          <div className="empty-subtitlePacers">
            Currently no players are assigned to the Pacers team
          </div>
        </div>
      )}
    </div>
  );
};

export default RosterPacers;
