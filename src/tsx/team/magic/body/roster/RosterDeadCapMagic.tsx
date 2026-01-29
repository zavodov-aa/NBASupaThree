import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import "./rosterDeadCapMagic.css";

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

const RosterDeadCapMagic = () => {
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

    const magicPlayers = players.filter(
      (player) => player.team === "Orlando Magic" && player.id !== 1
    );

    const sortedMagicPlayers = magicPlayers.sort((a, b) => {
      const salaryA = parseSalary(a.year_one);
      const salaryB = parseSalary(b.year_one);
      return salaryB - salaryA;
    });

    return firstPlayer
      ? [firstPlayer, ...sortedMagicPlayers]
      : sortedMagicPlayers;
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
          .or("id.eq.1,team.eq.Orlando Magic");

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
    <div className="magic-containers">
      <div className="header-contents-magic">
        <h1 className="header-titles-magic">DEAD CAP</h1>
      </div>

      <div className="table-containers-magic">
        <div className="table-wrappers-magic">
          <table className="players-tables-magic">
            <tbody className="table-bodys-magic">
              {players.map((player, index) => (
                <tr
                  key={player.id}
                  className={`table-rows-magic ${
                    index % 2 === 0 ? "row-evens-magic" : "row-odds-magic"
                  } ${index === 0 ? "special-players-magic" : ""}`}
                >
                  <td className="table-tds player-ids-magic">
                    {getDisplayNumber(index)}
                  </td>
                  <td className="table-tds-magic">
                    <span className="roster-badges-magic badge-actives-magic">
                      {player.active_roster}
                    </span>
                  </td>
                  <td className="table-tds-magic player-positions-magic">
                    {player.pos}
                  </td>
                  <td className="table-tds-magic">{player.pos_elig}</td>
                  <td className="table-tds-magic player-ages-magic">
                    {player.age}
                  </td>
                  <td className="table-tds-magic">{player.year_one}</td>
                  <td className="table-tds-magic">{player.year_two}</td>
                  <td className="table-tds-magic">{player.year_three}</td>
                  <td className="table-tds-magic">{player.year_four}</td>
                  <td className="table-tds-magic">{player.year_five}</td>
                  <td className="table-tds-magic">{player.opt}</td>
                  <td className="table-tds-magic">{player.exp}</td>
                  <td className="table-tds-magic">{player.bird}</td>
                  <td className="table-tds-magic">{player.awards}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RosterDeadCapMagic;
