import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import "./rosterDeadCapSpurs.css";

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

const RosterDeadCapSpurs = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  const parseSalary = (salary: string | null): number => {
    if (!salary) return 0;
    const cleaned = salary.replace(/[$,]/g, "").trim();
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  };

  const sortPlayers = (players: Player[]): Player[] => {
    // Находим игрока с id = 1
    const firstPlayer = players.find((player) => player.id === 1);

    const spursPlayers = players.filter(
      (player) => player.team === "San Antonio Spurs" && player.id !== 1
    );

    const sortedSpursPlayers = spursPlayers.sort((a, b) => {
      const salaryA = parseSalary(a.year_one);
      const salaryB = parseSalary(b.year_one);
      return salaryB - salaryA;
    });

    return firstPlayer
      ? [firstPlayer, ...sortedSpursPlayers]
      : sortedSpursPlayers;
  };

  // Функция для получения порядкового номера для отображения
  const getDisplayNumber = (index: number): string => {
    // Для первого элемента (специальный игрок) возвращаем звездочку
    if (index === 0) return "★";
    // Для остальных - возвращаем последовательную нумерацию, начиная с 1
    return `${index}`;
  };

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const { data, error } = await supabase
          .from("Dead_Cap")
          .select("*")
          .or("id.eq.1,team.eq.San Antonio Spurs");

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
    <div className="spurs-containers">
      <div className="header-contents-spurs">
        <h1 className="header-titles-spurs">DEAD CAP</h1>
      </div>

      <div className="table-containers-spurs">
        <div className="table-wrappers-spurs">
          <table className="players-tables-spurs">
            <tbody className="table-bodys-spurs">
              {players.map((player, index) => (
                <tr
                  key={player.id}
                  className={`table-rows-spurs ${
                    index % 2 === 0 ? "row-evens-spurs" : "row-odds-spurs"
                  } ${index === 0 ? "special-players-spurs" : ""}`}
                >
                  <td className="table-tds player-ids-spurs">
                    {getDisplayNumber(index)}
                  </td>
                  <td className="table-tds-spurs">
                    <span className="roster-badges-spurs badge-actives-spurs">
                      {player.active_roster}
                    </span>
                  </td>
                  <td className="table-tds-spurs player-positions-spurs">
                    {player.pos}
                  </td>
                  <td className="table-tds-spurs">{player.pos_elig}</td>
                  <td className="table-tds-spurs player-ages-spurs">
                    {player.age}
                  </td>
                  <td className="table-tds-spurs">{player.year_one}</td>
                  <td className="table-tds-spurs">{player.year_two}</td>
                  <td className="table-tds-spurs">{player.year_three}</td>
                  <td className="table-tds-spurs">{player.year_four}</td>
                  <td className="table-tds-spurs">{player.year_five}</td>
                  <td className="table-tds-spurs">{player.opt}</td>
                  <td className="table-tds-spurs">{player.exp}</td>
                  <td className="table-tds-spurs">{player.bird}</td>
                  <td className="table-tds-spurs">{player.awards}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RosterDeadCapSpurs;
