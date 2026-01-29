import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import "./rosterDeadCapPistons.css";

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

const RosterDeadCapPistons = () => {
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
    const pistonsPlayers = players.filter(
      (player) => player.team === "Detroit Pistons" && player.id !== 1
    );
    const sortedPistonsPlayers = pistonsPlayers.sort((a, b) => {
      const salaryA = parseSalary(a.year_one);
      const salaryB = parseSalary(b.year_one);
      return salaryB - salaryA;
    });
    return firstPlayer
      ? [firstPlayer, ...sortedPistonsPlayers]
      : sortedPistonsPlayers;
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
          .or("id.eq.1,team.eq.Detroit Pistons");
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
    <div className="pistons-containers">
      <div className="header-contents-pistons">
        <h1 className="header-titles-pistons">DEAD CAP</h1>
      </div>
      <div className="table-containers-pistons">
        <div className="table-wrappers-pistons">
          <table className="players-tables-pistons">
            <tbody className="table-bodys-pistons">
              {players.map((player, index) => (
                <tr
                  key={player.id}
                  className={`table-rows-pistons ${
                    index % 2 === 0 ? "row-evens-pistons" : "row-odds-pistons"
                  } ${index === 0 ? "special-players-pistons" : ""}`}
                >
                  <td className="table-tds player-ids-pistons">
                    {getDisplayNumber(index)}
                  </td>
                  <td className="table-tds-pistons">
                    <span className="roster-badges-pistons badge-actives-pistons">
                      {player.active_roster}
                    </span>
                  </td>
                  <td className="table-tds-pistons player-positions-pistons">
                    {player.pos}
                  </td>
                  <td className="table-tds-pistons">{player.pos_elig}</td>
                  <td className="table-tds-pistons player-ages-pistons">
                    {player.age}
                  </td>
                  <td className="table-tds-pistons">{player.year_one}</td>
                  <td className="table-tds-pistons">{player.year_two}</td>
                  <td className="table-tds-pistons">{player.year_three}</td>
                  <td className="table-tds-pistons">{player.year_four}</td>
                  <td className="table-tds-pistons">{player.year_five}</td>
                  <td className="table-tds-pistons">{player.opt}</td>
                  <td className="table-tds-pistons">{player.exp}</td>
                  <td className="table-tds-pistons">{player.bird}</td>
                  <td className="table-tds-pistons">{player.awards}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RosterDeadCapPistons;
