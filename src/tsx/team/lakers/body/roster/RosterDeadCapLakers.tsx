import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import "./rosterDeadCapLakers.css";

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

const RosterDeadCapLakers = () => {
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
    // Фильтруем остальных игроков Lakers (исключая игрока с id = 1 если он есть)
    const lakersPlayers = players.filter(
      (player) => player.team === "Los Angeles Lakers" && player.id !== 1
    );

    // Сортируем игроков Lakers по зарплате year_one (по убыванию)
    const sortedLakersPlayers = lakersPlayers.sort((a, b) => {
      const salaryA = parseSalary(a.year_one);
      const salaryB = parseSalary(b.year_one);
      return salaryB - salaryA;
    });

    // Возвращаем массив: сначала игрок с id = 1, затем отсортированные Lakers
    return firstPlayer
      ? [firstPlayer, ...sortedLakersPlayers]
      : sortedLakersPlayers;
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
        // Запрашиваем либо игрока с id = 1, либо игроков с team = Lakers
        const { data, error } = await supabase
          .from("Dead_Cap")
          .select("*")
          .or("id.eq.1,team.eq.Los Angeles Lakers");

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
    <div className="lakers-containers">
      <div className="header-contents">
        <h1 className="header-titles">DEAD CAP</h1>
      </div>

      <div className="table-containers">
        <div className="table-wrappers">
          <table className="players-tables">
            <tbody className="table-bodys">
              {players.map((player, index) => (
                <tr
                  key={player.id}
                  className={`table-rows ${
                    index % 2 === 0 ? "row-evens" : "row-odds"
                  } ${index === 0 ? "special-players" : ""}`}
                >
                  <td className="table-tds player-ids">
                    {getDisplayNumber(index)}
                  </td>
                  <td className="table-tds">
                    <span className="roster-badges badge-actives">
                      {player.active_roster}
                    </span>
                  </td>
                  <td className="table-tds player-positions">{player.pos}</td>
                  <td className="table-tds">{player.pos_elig}</td>
                  <td className="table-tds player-ages">{player.age}</td>
                  <td className="table-tds">{player.year_one}</td>
                  <td className="table-tds">{player.year_two}</td>
                  <td className="table-tds">{player.year_three}</td>
                  <td className="table-tds">{player.year_four}</td>
                  <td className="table-tds">{player.year_five}</td>
                  <td className="table-tds">{player.opt}</td>
                  <td className="table-tds">{player.exp}</td>
                  <td className="table-tds">{player.bird}</td>
                  <td className="table-tds">{player.awards}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RosterDeadCapLakers;
