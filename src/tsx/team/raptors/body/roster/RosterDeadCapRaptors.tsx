import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import "./rosterDeadCapRaptors.css";

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

const RosterDeadCapRaptors = () => {
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

    const raptorsPlayers = players.filter(
      (player) => player.team === "Toronto Raptors" && player.id !== 1
    );

    const sortedRaptorsPlayers = raptorsPlayers.sort((a, b) => {
      const salaryA = parseSalary(a.year_one);
      const salaryB = parseSalary(b.year_one);
      return salaryB - salaryA;
    });

    return firstPlayer
      ? [firstPlayer, ...sortedRaptorsPlayers]
      : sortedRaptorsPlayers;
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
          .or("id.eq.1,team.eq.Toronto Raptors");

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
    <div className="raptors-containers">
      <div className="header-contents-raptors">
        <h1 className="header-titles-raptors">DEAD CAP</h1>
      </div>

      <div className="table-containers-raptors">
        <div className="table-wrappers-raptors">
          <table className="players-tables-raptors">
            <tbody className="table-bodys-raptors">
              {players.map((player, index) => (
                <tr
                  key={player.id}
                  className={`table-rows-raptors ${
                    index % 2 === 0 ? "row-evens-raptors" : "row-odds-raptors"
                  } ${index === 0 ? "special-players-raptors" : ""}`}
                >
                  <td className="table-tds player-ids-raptors">
                    {getDisplayNumber(index)}
                  </td>
                  <td className="table-tds-raptors">
                    <span className="roster-badges-raptors badge-actives-raptors">
                      {player.active_roster}
                    </span>
                  </td>
                  <td className="table-tds-raptors player-positions-raptors">
                    {player.pos}
                  </td>
                  <td className="table-tds-raptors">{player.pos_elig}</td>
                  <td className="table-tds-raptors player-ages-raptors">
                    {player.age}
                  </td>
                  <td className="table-tds-raptors">{player.year_one}</td>
                  <td className="table-tds-raptors">{player.year_two}</td>
                  <td className="table-tds-raptors">{player.year_three}</td>
                  <td className="table-tds-raptors">{player.year_four}</td>
                  <td className="table-tds-raptors">{player.year_five}</td>
                  <td className="table-tds-raptors">{player.opt}</td>
                  <td className="table-tds-raptors">{player.exp}</td>
                  <td className="table-tds-raptors">{player.bird}</td>
                  <td className="table-tds-raptors">{player.awards}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RosterDeadCapRaptors;
