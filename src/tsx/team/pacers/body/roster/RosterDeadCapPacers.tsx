import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import "./rosterDeadCapPacers.css"; // Изменен импорт

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

const RosterDeadCapPacers = () => {
  // Изменено имя компонента
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

    const pacersPlayers = players.filter(
      (player) => player.team === "Indiana Pacers" && player.id !== 1
    );

    const sortedPacersPlayers = pacersPlayers.sort((a, b) => {
      const salaryA = parseSalary(a.year_one);
      const salaryB = parseSalary(b.year_one);
      return salaryB - salaryA;
    });

    return firstPlayer
      ? [firstPlayer, ...sortedPacersPlayers]
      : sortedPacersPlayers;
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
          .or("id.eq.1,team.eq.Indiana Pacers");

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
    <div className="pacers-containers">
      {" "}
      {/* Изменен класс */}
      <div className="header-contents-pacers">
        {" "}
        {/* Изменен класс */}
        <h1 className="header-titles-pacers">DEAD CAP</h1> {/* Изменен класс */}
      </div>
      <div className="table-containers-pacers">
        {" "}
        {/* Изменен класс */}
        <div className="table-wrappers-pacers">
          {" "}
          {/* Изменен класс */}
          <table className="players-tables-pacers">
            {" "}
            {/* Изменен класс */}
            <tbody className="table-bodys-pacers">
              {" "}
              {/* Изменен класс */}
              {players.map((player, index) => (
                <tr
                  key={player.id}
                  className={`table-rows-pacers ${
                    // Изменен класс
                    index % 2 === 0 ? "row-evens-pacers" : "row-odds-pacers" // Изменены классы
                  } ${index === 0 ? "special-players-pacers" : ""}`} // Изменен класс
                >
                  <td className="table-tds player-ids-pacers">
                    {" "}
                    {/* Изменен класс */}
                    {getDisplayNumber(index)}
                  </td>
                  <td className="table-tds-pacers">
                    {" "}
                    {/* Изменен класс */}
                    <span className="roster-badges-pacers badge-actives-pacers">
                      {" "}
                      {/* Изменены классы */}
                      {player.active_roster}
                    </span>
                  </td>
                  <td className="table-tds-pacers player-positions-pacers">
                    {" "}
                    {/* Изменен класс */}
                    {player.pos}
                  </td>
                  <td className="table-tds-pacers">{player.pos_elig}</td>{" "}
                  {/* Изменен класс */}
                  <td className="table-tds-pacers player-ages-pacers">
                    {" "}
                    {/* Изменен класс */}
                    {player.age}
                  </td>
                  <td className="table-tds-pacers">{player.year_one}</td>{" "}
                  {/* Изменен класс */}
                  <td className="table-tds-pacers">{player.year_two}</td>{" "}
                  {/* Изменен класс */}
                  <td className="table-tds-pacers">{player.year_three}</td>{" "}
                  {/* Изменен класс */}
                  <td className="table-tds-pacers">{player.year_four}</td>{" "}
                  {/* Изменен класс */}
                  <td className="table-tds-pacers">{player.year_five}</td>{" "}
                  {/* Изменен класс */}
                  <td className="table-tds-pacers">{player.opt}</td>{" "}
                  {/* Изменен класс */}
                  <td className="table-tds-pacers">{player.exp}</td>{" "}
                  {/* Изменен класс */}
                  <td className="table-tds-pacers">{player.bird}</td>{" "}
                  {/* Изменен класс */}
                  <td className="table-tds-pacers">{player.awards}</td>{" "}
                  {/* Изменен класс */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RosterDeadCapPacers; // Изменено имя экспорта
