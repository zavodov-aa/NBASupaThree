import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import "./rosterDeadCapBucks.css";

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

const RosterDeadCapHawks = () => {
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
    const hawksPlayers = players.filter(
      (player) => player.team === "Milwaukee Bucks" && player.id !== 1
    );
    const sortedHawksPlayers = hawksPlayers.sort((a, b) => {
      const salaryA = parseSalary(a.year_one);
      const salaryB = parseSalary(b.year_one);
      return salaryB - salaryA;
    });
    return firstPlayer
      ? [firstPlayer, ...sortedHawksPlayers]
      : sortedHawksPlayers;
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
          .or("id.eq.1,team.eq.Milwaukee Bucks");
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
    <div className="bucks-containers">
      <div className="header-contents-bucks">
        <h1 className="header-titles-bucks">DEAD CAP</h1>
      </div>
      <div className="table-containers-bucks">
        <div className="table-wrappers-bucks">
          <table className="players-tables-bucks">
            <tbody className="table-bodys-bucks">
              {players.map((player, index) => (
                <tr
                  key={player.id}
                  className={`table-rows-bucks ${
                    index % 2 === 0 ? "row-evens-bucks" : "row-odds-bucks"
                  } ${index === 0 ? "special-players-bucks" : ""}`}
                >
                  <td className="table-tds player-ids-bucks">
                    {getDisplayNumber(index)}
                  </td>
                  <td className="table-tds-bucks">
                    <span className="roster-badges-bucks badge-actives-bucks">
                      {player.active_roster}
                    </span>
                  </td>
                  <td className="table-tds-bucks player-positions-bucks">
                    {player.pos}
                  </td>
                  <td className="table-tds-bucks">{player.pos_elig}</td>
                  <td className="table-tds-bucks player-ages-bucks">
                    {player.age}
                  </td>
                  <td className="table-tds-bucks">{player.year_one}</td>
                  <td className="table-tds-bucks">{player.year_two}</td>
                  <td className="table-tds-bucks">{player.year_three}</td>
                  <td className="table-tds-bucks">{player.year_four}</td>
                  <td className="table-tds-bucks">{player.year_five}</td>
                  <td className="table-tds-bucks">{player.opt}</td>
                  <td className="table-tds-bucks">{player.exp}</td>
                  <td className="table-tds-bucks">{player.bird}</td>
                  <td className="table-tds-bucks">{player.awards}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RosterDeadCapHawks;
