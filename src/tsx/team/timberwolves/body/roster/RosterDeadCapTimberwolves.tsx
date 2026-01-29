import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import "./rosterDeadCapTimberwolves.css";

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

const RosterDeadCapTimberwolves = () => {
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

    const timberwolvesPlayers = players.filter(
      (player) => player.team === "Minnesota Timberwolves" && player.id !== 1
    );

    const sortedTimberwolvesPlayers = timberwolvesPlayers.sort((a, b) => {
      const salaryA = parseSalary(a.year_one);
      const salaryB = parseSalary(b.year_one);
      return salaryB - salaryA;
    });

    return firstPlayer
      ? [firstPlayer, ...sortedTimberwolvesPlayers]
      : sortedTimberwolvesPlayers;
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
          .or("id.eq.1,team.eq.Minnesota Timberwolves");

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
    <div className="timberwolves-containers">
      <div className="header-contents-timberwolves">
        <h1 className="header-titles-timberwolves">DEAD CAP</h1>
      </div>

      <div className="table-containers-timberwolves">
        <div className="table-wrappers-timberwolves">
          <table className="players-tables-timberwolves">
            <tbody className="table-bodys-timberwolves">
              {players.map((player, index) => (
                <tr
                  key={player.id}
                  className={`table-rows-timberwolves ${
                    index % 2 === 0
                      ? "row-evens-timberwolves"
                      : "row-odds-timberwolves"
                  } ${index === 0 ? "special-players-timberwolves" : ""}`}
                >
                  <td className="table-tds player-ids-timberwolves">
                    {getDisplayNumber(index)}
                  </td>
                  <td className="table-tds-timberwolves">
                    <span className="roster-badges-timberwolves badge-actives-timberwolves">
                      {player.active_roster}
                    </span>
                  </td>
                  <td className="table-tds-timberwolves player-positions-timberwolves">
                    {player.pos}
                  </td>
                  <td className="table-tds-timberwolves">{player.pos_elig}</td>
                  <td className="table-tds-timberwolves player-ages-timberwolves">
                    {player.age}
                  </td>
                  <td className="table-tds-timberwolves">{player.year_one}</td>
                  <td className="table-tds-timberwolves">{player.year_two}</td>
                  <td className="table-tds-timberwolves">
                    {player.year_three}
                  </td>
                  <td className="table-tds-timberwolves">{player.year_four}</td>
                  <td className="table-tds-timberwolves">{player.year_five}</td>
                  <td className="table-tds-timberwolves">{player.opt}</td>
                  <td className="table-tds-timberwolves">{player.exp}</td>
                  <td className="table-tds-timberwolves">{player.bird}</td>
                  <td className="table-tds-timberwolves">{player.awards}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RosterDeadCapTimberwolves;
