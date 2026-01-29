import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import "./rosterDeadCapNets.css";

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

const RosterDeadCapNets = () => {
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

    const netsPlayers = players.filter(
      (player) => player.team === "Brooklyn Nets" && player.id !== 1
    );

    const sortedNetsPlayers = netsPlayers.sort((a, b) => {
      const salaryA = parseSalary(a.year_one);
      const salaryB = parseSalary(b.year_one);
      return salaryB - salaryA;
    });

    return firstPlayer
      ? [firstPlayer, ...sortedNetsPlayers]
      : sortedNetsPlayers;
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
          .or("id.eq.1,team.eq.Brooklyn Nets");

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
    <div className="nets-containers">
      <div className="header-contents-nets">
        <h1 className="header-titles-nets">DEAD CAP</h1>
      </div>

      <div className="table-containers-nets">
        <div className="table-wrappers-nets">
          <table className="players-tables-nets">
            <tbody className="table-bodys-nets">
              {players.map((player, index) => (
                <tr
                  key={player.id}
                  className={`table-rows-nets ${
                    index % 2 === 0 ? "row-evens-nets" : "row-odds-nets"
                  } ${index === 0 ? "special-players-nets" : ""}`}
                >
                  <td className="table-tds player-ids-nets">
                    {getDisplayNumber(index)}
                  </td>
                  <td className="table-tds-nets">
                    <span className="roster-badges-nets badge-actives-nets">
                      {player.active_roster}
                    </span>
                  </td>
                  <td className="table-tds-nets player-positions-nets">
                    {player.pos}
                  </td>
                  <td className="table-tds-nets">{player.pos_elig}</td>
                  <td className="table-tds-nets player-ages-nets">
                    {player.age}
                  </td>
                  <td className="table-tds-nets">{player.year_one}</td>
                  <td className="table-tds-nets">{player.year_two}</td>
                  <td className="table-tds-nets">{player.year_three}</td>
                  <td className="table-tds-nets">{player.year_four}</td>
                  <td className="table-tds-nets">{player.year_five}</td>
                  <td className="table-tds-nets">{player.opt}</td>
                  <td className="table-tds-nets">{player.exp}</td>
                  <td className="table-tds-nets">{player.bird}</td>
                  <td className="table-tds-nets">{player.awards}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RosterDeadCapNets;
