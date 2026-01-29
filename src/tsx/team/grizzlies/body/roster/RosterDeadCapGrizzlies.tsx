import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import "./rosterDeadCapGrizzlies.css";

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

const RosterDeadCapGrizzlies = () => {
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

    const grizzliesPlayers = players.filter(
      (player) => player.team === "Memphis Grizzlies" && player.id !== 1
    );

    const sortedGrizzliesPlayers = grizzliesPlayers.sort((a, b) => {
      const salaryA = parseSalary(a.year_one);
      const salaryB = parseSalary(b.year_one);
      return salaryB - salaryA;
    });

    return firstPlayer
      ? [firstPlayer, ...sortedGrizzliesPlayers]
      : sortedGrizzliesPlayers;
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
          .or("id.eq.1,team.eq.Memphis Grizzlies");

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
    <div className="grizzlies-containers">
      <div className="header-contents-grizzlies">
        <h1 className="header-titles-grizzlies">DEAD CAP</h1>
      </div>

      <div className="table-containers-grizzlies">
        <div className="table-wrappers-grizzlies">
          <table className="players-tables-grizzlies">
            <tbody className="table-bodys-grizzlies">
              {players.map((player, index) => (
                <tr
                  key={player.id}
                  className={`table-rows-grizzlies ${
                    index % 2 === 0
                      ? "row-evens-grizzlies"
                      : "row-odds-grizzlies"
                  } ${index === 0 ? "special-players-grizzlies" : ""}`}
                >
                  <td className="table-tds player-ids-grizzlies">
                    {getDisplayNumber(index)}
                  </td>
                  <td className="table-tds-grizzlies">
                    <span className="roster-badges-grizzlies badge-actives-grizzlies">
                      {player.active_roster}
                    </span>
                  </td>
                  <td className="table-tds-grizzlies player-positions-grizzlies">
                    {player.pos}
                  </td>
                  <td className="table-tds-grizzlies">{player.pos_elig}</td>
                  <td className="table-tds-grizzlies player-ages-grizzlies">
                    {player.age}
                  </td>
                  <td className="table-tds-grizzlies">{player.year_one}</td>
                  <td className="table-tds-grizzlies">{player.year_two}</td>
                  <td className="table-tds-grizzlies">{player.year_three}</td>
                  <td className="table-tds-grizzlies">{player.year_four}</td>
                  <td className="table-tds-grizzlies">{player.year_five}</td>
                  <td className="table-tds-grizzlies">{player.opt}</td>
                  <td className="table-tds-grizzlies">{player.exp}</td>
                  <td className="table-tds-grizzlies">{player.bird}</td>
                  <td className="table-tds-grizzlies">{player.awards}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RosterDeadCapGrizzlies;
