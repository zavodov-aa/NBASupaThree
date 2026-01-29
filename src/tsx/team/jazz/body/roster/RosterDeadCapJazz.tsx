import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import "./rosterDeadCapJazz.css";

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

const RosterDeadCapJazz = () => {
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

    const jazzPlayers = players.filter(
      (player) => player.team === "Utah Jazz" && player.id !== 1
    );

    const sortedJazzPlayers = jazzPlayers.sort((a, b) => {
      const salaryA = parseSalary(a.year_one);
      const salaryB = parseSalary(b.year_one);
      return salaryB - salaryA;
    });

    return firstPlayer
      ? [firstPlayer, ...sortedJazzPlayers]
      : sortedJazzPlayers;
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
          .or("id.eq.1,team.eq.Utah Jazz"); // Изменено на Utah Jazz

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
    <div className="jazz-containers">
      <div className="header-contents-jazz">
        <h1 className="header-titles-jazz">DEAD CAP</h1>
      </div>

      <div className="table-containers-jazz">
        <div className="table-wrappers-jazz">
          <table className="players-tables-jazz">
            <tbody className="table-bodys-jazz">
              {players.map((player, index) => (
                <tr
                  key={player.id}
                  className={`table-rows-jazz ${
                    index % 2 === 0 ? "row-evens-jazz" : "row-odds-jazz"
                  } ${index === 0 ? "special-players-jazz" : ""}`}
                >
                  <td className="table-tds player-ids-jazz">
                    {getDisplayNumber(index)}
                  </td>
                  <td className="table-tds-jazz">
                    <span className="roster-badges-jazz badge-actives-jazz">
                      {player.active_roster}
                    </span>
                  </td>
                  <td className="table-tds-jazz player-positions-jazz">
                    {player.pos}
                  </td>
                  <td className="table-tds-jazz">{player.pos_elig}</td>
                  <td className="table-tds-jazz player-ages-jazz">
                    {player.age}
                  </td>
                  <td className="table-tds-jazz">{player.year_one}</td>
                  <td className="table-tds-jazz">{player.year_two}</td>
                  <td className="table-tds-jazz">{player.year_three}</td>
                  <td className="table-tds-jazz">{player.year_four}</td>
                  <td className="table-tds-jazz">{player.year_five}</td>
                  <td className="table-tds-jazz">{player.opt}</td>
                  <td className="table-tds-jazz">{player.exp}</td>
                  <td className="table-tds-jazz">{player.bird}</td>
                  <td className="table-tds-jazz">{player.awards}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RosterDeadCapJazz;
