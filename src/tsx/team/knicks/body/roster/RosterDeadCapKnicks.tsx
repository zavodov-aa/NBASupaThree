import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import "./rosterDeadCapKnicks.css";

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

const RosterDeadCapKnicks = () => {
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

    const knicksPlayers = players.filter(
      (player) => player.team === "New York Knicks" && player.id !== 1
    );

    const sortedKnicksPlayers = knicksPlayers.sort((a, b) => {
      const salaryA = parseSalary(a.year_one);
      const salaryB = parseSalary(b.year_one);
      return salaryB - salaryA;
    });

    return firstPlayer
      ? [firstPlayer, ...sortedKnicksPlayers]
      : sortedKnicksPlayers;
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
          .or("id.eq.1,team.eq.New York Knicks");

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
    return <div className="loading-text">Loading Dead Cap...</div>;
  }

  return (
    <div className="knicks-containers">
      <div className="header-contents-knicks">
        <h1 className="header-titles-knicks">DEAD CAP</h1>
      </div>

      <div className="table-containers-knicks">
        <div className="table-wrappers-knicks">
          <table className="players-tables-knicks">
            <tbody className="table-bodys-knicks">
              {players.map((player, index) => (
                <tr
                  key={player.id}
                  className={`table-rows-knicks ${
                    index % 2 === 0 ? "row-evens-knicks" : "row-odds-knicks"
                  } ${index === 0 ? "special-players-knicks" : ""}`}
                >
                  <td className="table-tds player-ids-knicks">
                    {getDisplayNumber(index)}
                  </td>
                  <td className="table-tds-knicks">
                    <span className="roster-badges-knicks badge-actives-knicks">
                      {player.active_roster}
                    </span>
                  </td>
                  <td className="table-tds-knicks player-positions-knicks">
                    {player.pos}
                  </td>
                  <td className="table-tds-knicks">{player.pos_elig}</td>
                  <td className="table-tds-knicks player-ages-knicks">
                    {player.age}
                  </td>
                  <td className="table-tds-knicks">{player.year_one}</td>
                  <td className="table-tds-knicks">{player.year_two}</td>
                  <td className="table-tds-knicks">{player.year_three}</td>
                  <td className="table-tds-knicks">{player.year_four}</td>
                  <td className="table-tds-knicks">{player.year_five}</td>
                  <td className="table-tds-knicks">{player.opt}</td>
                  <td className="table-tds-knicks">{player.exp}</td>
                  <td className="table-tds-knicks">{player.bird}</td>
                  <td className="table-tds-knicks">{player.awards}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RosterDeadCapKnicks;
