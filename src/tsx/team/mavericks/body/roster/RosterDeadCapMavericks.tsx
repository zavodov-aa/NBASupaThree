import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import "./rosterDeadCapMavericks.css";

type Player = {
  id: number;
  active_roster: string;
  pos: string;
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

const RosterDeadCapMavericks = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  const parseSalary = (salary: string | null): number => {
    if (!salary) return 0;
    const cleaned = salary.replace(/[$,]/g, "").trim();
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  };

  const sortPlayers = (players: Player[]): Player[] => {
    const firstPlayer = players.find((player) => player.id === 1);

    const mavericksPlayers = players.filter(
      (player) => player.team === "Dallas Mavericks" && player.id !== 1
    );

    const sortedMavericksPlayers = mavericksPlayers.sort((a, b) => {
      const salaryA = parseSalary(a.year_one);
      const salaryB = parseSalary(b.year_one);
      return salaryB - salaryA;
    });

    return firstPlayer
      ? [firstPlayer, ...sortedMavericksPlayers]
      : sortedMavericksPlayers;
  };

  const getDisplayNumber = (index: number): string => {
    if (index === 0) return "★";
    return `${index}`;
  };

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const { data, error } = await supabase
          .from("Dead_Cap")
          .select("*")
          .or("id.eq.1,team.eq.Dallas Mavericks");

        if (error) throw error;
        const sortedPlayers = sortPlayers(data || []);
        setPlayers(sortedPlayers);
      } catch (error) {
        console.error("Error fetching players:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  if (loading) {
    return <div className="loading-text-mavericks">Loading Dead Cap...</div>;
  }

  return (
    <div className="mavericks-containers">
      <div className="header-contents-mavericks">
        <h1 className="header-titles-mavericks">DEAD CAP</h1>
      </div>

      <div className="table-containers-mavericks">
        <div className="table-wrappers-mavericks">
          <table className="players-tables-mavericks">
            <tbody className="table-bodys-mavericks">
              {players.map((player, index) => (
                <tr
                  key={player.id}
                  className={`table-rows-mavericks ${
                    index % 2 === 0
                      ? "row-evens-mavericks"
                      : "row-odds-mavericks"
                  } ${index === 0 ? "special-players-mavericks" : ""}`}
                >
                  <td className="table-tds player-ids-mavericks">
                    {getDisplayNumber(index)}
                  </td>
                  <td className="table-tds-mavericks">
                    <span className="roster-badges-mavericks badge-actives-mavericks">
                      {player.active_roster}
                    </span>
                  </td>
                  <td className="table-tds-mavericks player-positions-mavericks">
                    {player.pos}
                  </td>
                  <td className="table-tds-mavericks">{player.pos_elig}</td>
                  <td className="table-tds-mavericks player-ages-mavericks">
                    {player.age}
                  </td>
                  <td className="table-tds-mavericks">{player.year_one}</td>
                  <td className="table-tds-mavericks">{player.year_two}</td>
                  <td className="table-tds-mavericks">{player.year_three}</td>
                  <td className="table-tds-mavericks">{player.year_four}</td>
                  <td className="table-tds-mavericks">{player.year_five}</td>
                  <td className="table-tds-mavericks">{player.opt}</td>
                  <td className="table-tds-mavericks">{player.exp}</td>
                  <td className="table-tds-mavericks">{player.bird}</td>
                  <td className="table-tds-mavericks">{player.awards}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RosterDeadCapMavericks;
