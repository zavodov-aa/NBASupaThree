import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import "./rosterDeadCapWarriors.css";

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

const RosterDeadCapWarriors = () => {
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
    const warriorsPlayers = players.filter(
      (player) => player.team === "Golden State Warriors" && player.id !== 1
    );
    const sortedWarriorsPlayers = warriorsPlayers.sort((a, b) => {
      const salaryA = parseSalary(a.year_one);
      const salaryB = parseSalary(b.year_one);
      return salaryB - salaryA;
    });
    return firstPlayer
      ? [firstPlayer, ...sortedWarriorsPlayers]
      : sortedWarriorsPlayers;
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
          .or("id.eq.1,team.eq.Golden State Warriors");
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
    <div className="warriors-containers">
      <div className="header-contents-warriors">
        <h1 className="header-titles-warriors">DEAD CAP</h1>
      </div>
      <div className="table-containers-warriors">
        <div className="table-wrappers-warriors">
          <table className="players-tables-warriors">
            <tbody className="table-bodys-warriors">
              {players.map((player, index) => (
                <tr
                  key={player.id}
                  className={`table-rows-warriors ${
                    index % 2 === 0 ? "row-evens-warriors" : "row-odds-warriors"
                  } ${index === 0 ? "special-players-warriors" : ""}`}
                >
                  <td className="table-tds player-ids-warriors">
                    {getDisplayNumber(index)}
                  </td>
                  <td className="table-tds-warriors">
                    <span className="roster-badges-warriors badge-actives-warriors">
                      {player.active_roster}
                    </span>
                  </td>
                  <td className="table-tds-warriors player-positions-warriors">
                    {player.pos}
                  </td>
                  <td className="table-tds-warriors">{player.pos_elig}</td>
                  <td className="table-tds-warriors player-ages-warriors">
                    {player.age}
                  </td>
                  <td className="table-tds-warriors">{player.year_one}</td>
                  <td className="table-tds-warriors">{player.year_two}</td>
                  <td className="table-tds-warriors">{player.year_three}</td>
                  <td className="table-tds-warriors">{player.year_four}</td>
                  <td className="table-tds-warriors">{player.year_five}</td>
                  <td className="table-tds-warriors">{player.opt}</td>
                  <td className="table-tds-warriors">{player.exp}</td>
                  <td className="table-tds-warriors">{player.bird}</td>
                  <td className="table-tds-warriors">{player.awards}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RosterDeadCapWarriors;
