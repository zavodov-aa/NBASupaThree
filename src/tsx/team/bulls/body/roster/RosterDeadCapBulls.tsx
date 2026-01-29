import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import "./rosterDeadCapBulls.css";

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

const RosterDeadCapBulls = () => {
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

    const bullsPlayers = players.filter(
      (player) => player.team === "Chicago Bulls" && player.id !== 1
    );

    const sortedBullsPlayers = bullsPlayers.sort((a, b) => {
      const salaryA = parseSalary(a.year_one);
      const salaryB = parseSalary(b.year_one);
      return salaryB - salaryA;
    });

    return firstPlayer
      ? [firstPlayer, ...sortedBullsPlayers]
      : sortedBullsPlayers;
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
          .or("id.eq.1,team.eq.Chicago Bulls");

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
    <div className="bulls-containers">
      <div className="header-contents-bulls">
        <h1 className="header-titles-bulls">DEAD CAP</h1>
      </div>

      <div className="table-containers-bulls">
        <div className="table-wrappers-bulls">
          <table className="players-tables-bulls">
            <tbody className="table-bodys-bulls">
              {players.map((player, index) => (
                <tr
                  key={player.id}
                  className={`table-rows-bulls ${
                    index % 2 === 0 ? "row-evens-bulls" : "row-odds-bulls"
                  } ${index === 0 ? "special-players-bulls" : ""}`}
                >
                  <td className="table-tds player-ids-bulls">
                    {getDisplayNumber(index)}
                  </td>
                  <td className="table-tds-bulls">
                    <span className="roster-badges-bulls badge-actives-bulls">
                      {player.active_roster}
                    </span>
                  </td>
                  <td className="table-tds-bulls player-positions-bulls">
                    {player.pos}
                  </td>
                  <td className="table-tds-bulls">{player.pos_elig}</td>
                  <td className="table-tds-bulls player-ages-bulls">
                    {player.age}
                  </td>
                  <td className="table-tds-bulls">{player.year_one}</td>
                  <td className="table-tds-bulls">{player.year_two}</td>
                  <td className="table-tds-bulls">{player.year_three}</td>
                  <td className="table-tds-bulls">{player.year_four}</td>
                  <td className="table-tds-bulls">{player.year_five}</td>
                  <td className="table-tds-bulls">{player.opt}</td>
                  <td className="table-tds-bulls">{player.exp}</td>
                  <td className="table-tds-bulls">{player.bird}</td>
                  <td className="table-tds-bulls">{player.awards}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RosterDeadCapBulls;
