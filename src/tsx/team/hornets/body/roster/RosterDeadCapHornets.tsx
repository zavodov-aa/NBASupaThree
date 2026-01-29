import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import "./rosterDeadCapHornets.css";

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

const RosterDeadCapHornets = () => {
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
    const hornetsPlayers = players.filter(
      (player) => player.team === "Charlotte Hornets" && player.id !== 1
    );
    const sortedHornetsPlayers = hornetsPlayers.sort((a, b) => {
      const salaryA = parseSalary(a.year_one);
      const salaryB = parseSalary(b.year_one);
      return salaryB - salaryA;
    });
    return firstPlayer
      ? [firstPlayer, ...sortedHornetsPlayers]
      : sortedHornetsPlayers;
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
          .or("id.eq.1,team.eq.Charlotte Hornets");
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
    <div className="hornets-containers">
      <div className="header-contents-hornets">
        <h1 className="header-titles-hornets">DEAD CAP</h1>
      </div>
      <div className="table-containers-hornets">
        <div className="table-wrappers-hornets">
          <table className="players-tables-hornets">
            <tbody className="table-bodys-hornets">
              {players.map((player, index) => (
                <tr
                  key={player.id}
                  className={`table-rows-hornets ${
                    index % 2 === 0 ? "row-evens-hornets" : "row-odds-hornets"
                  } ${index === 0 ? "special-players-hornets" : ""}`}
                >
                  <td className="table-tds player-ids-hornets">
                    {getDisplayNumber(index)}
                  </td>
                  <td className="table-tds-hornets">
                    <span className="roster-badges-hornets badge-actives-hornets">
                      {player.active_roster}
                    </span>
                  </td>
                  <td className="table-tds-hornets player-positions-hornets">
                    {player.pos}
                  </td>
                  <td className="table-tds-hornets">{player.pos_elig}</td>
                  <td className="table-tds-hornets player-ages-hornets">
                    {player.age}
                  </td>
                  <td className="table-tds-hornets">{player.year_one}</td>
                  <td className="table-tds-hornets">{player.year_two}</td>
                  <td className="table-tds-hornets">{player.year_three}</td>
                  <td className="table-tds-hornets">{player.year_four}</td>
                  <td className="table-tds-hornets">{player.year_five}</td>
                  <td className="table-tds-hornets">{player.opt}</td>
                  <td className="table-tds-hornets">{player.exp}</td>
                  <td className="table-tds-hornets">{player.bird}</td>
                  <td className="table-tds-hornets">{player.awards}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RosterDeadCapHornets;
