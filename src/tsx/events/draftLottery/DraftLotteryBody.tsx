import React, { useState, useEffect, ChangeEvent } from "react";
import { supabase } from "../../../Supabase";
import "./draftLotteryBody.css";

interface RowData {
  id: number;
  team: string | null;
  percentage: number;
  info: string; // новое поле для доп. информации
}

interface TeamRecord {
  team_name: string;
}

const DraftLotteryBody: React.FC = () => {
  const [teams, setTeams] = useState<string[]>([]);
  const [rows, setRows] = useState<RowData[]>(
    Array.from({ length: 14 }, (_, index) => ({
      id: index + 1,
      team: null,
      percentage: 0,
      info: "", // по умолчанию пустая строка
    })),
  );
  const [lotteryResult, setLotteryResult] = useState<string[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchTeams = async (): Promise<void> => {
      const { data, error } = await supabase.from("Head").select("team_name");
      if (error) {
        console.error("Ошибка загрузки команд:", error);
      } else if (data) {
        const teamData = data as TeamRecord[];
        setTeams(teamData.map((item) => item.team_name));
      }
    };
    fetchTeams();
  }, []);

  const handleTeamChange = (rowId: number, teamName: string): void => {
    setRows((prev) =>
      prev.map((row) => (row.id === rowId ? { ...row, team: teamName } : row)),
    );
    setError("");
  };

  const handlePercentageChange = (rowId: number, percentage: string): void => {
    setRows((prev) =>
      prev.map((row) =>
        row.id === rowId
          ? { ...row, percentage: parseInt(percentage, 10) }
          : row,
      ),
    );
    setError("");
  };

  // Новый обработчик для поля доп. информации
  const handleInfoChange = (rowId: number, info: string): void => {
    setRows((prev) =>
      prev.map((row) => (row.id === rowId ? { ...row, info } : row)),
    );
    setError("");
  };

  // Проверка заполненности команд
  const validateInputs = (): boolean => {
    if (rows.some((row) => !row.team)) {
      setError("Не все команды выбраны");
      return false;
    }
    return true;
  };

  // Сохранение данных в Supabase
  const saveToDatabase = async (): Promise<void> => {
    const password = prompt("Введите пароль для сохранения:");
    if (password !== "1") {
      alert("Неверный пароль");
      return;
    }

    if (!validateInputs()) return;

    try {
      for (const row of rows) {
        const { error } = await supabase.from("draft_lottery").upsert(
          {
            id: row.id,
            team: row.team,
            info: row.info || "", // если пусто, сохраняем пустую строку
            percent: row.percentage,
            created_at: new Date().toISOString(),
          },
          { onConflict: "id" }, // при конфликте по id обновляем запись
        );

        if (error) {
          console.error("Ошибка сохранения:", error);
          alert("Ошибка при сохранении: " + error.message);
          return;
        }
      }
      alert("Данные успешно сохранены!");
    } catch (err) {
      console.error(err);
      alert("Произошла ошибка");
    }
  };

  const weightedRandomSample = (
    items: string[],
    weights: number[],
    k: number,
  ): string[] => {
    const result: string[] = [];
    const indices = Array.from({ length: items.length }, (_, i) => i);
    const currentWeights = [...weights];

    for (let i = 0; i < k; i++) {
      const totalWeight = currentWeights.reduce((a, b) => a + b, 0);
      let rand = Math.random() * totalWeight;
      let idx = 0;
      let cumulative = 0;

      for (let j = 0; j < currentWeights.length; j++) {
        cumulative += currentWeights[j];
        if (rand < cumulative) {
          idx = j;
          break;
        }
      }

      result.push(items[indices[idx]]);
      currentWeights[idx] = 0;
    }
    return result;
  };

  const runLottery = (): void => {
    if (!validateInputs()) return;

    const teamsList: string[] = rows.map((row) => row.team!);
    const percentages: number[] = rows.map((row) => row.percentage);

    const drawnTeams = weightedRandomSample(teamsList, percentages, 14);
    setLotteryResult(drawnTeams);
  };

  const resetLottery = (): void => {
    setLotteryResult([]);
    setError("");
  };

  return (
    <div className="draft-lottery-container">
      <h2>Драфт-лотерея НБА</h2>

      <table className="lottery-table">
        <thead>
          <tr>
            <th>№</th>
            <th>Команда</th>
            <th>Доп. инфо</th> {/* новый заголовок */}
            <th>Процент</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>{row.id}</td>
              <td>
                <select
                  value={row.team || ""}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                    handleTeamChange(row.id, e.target.value)
                  }
                >
                  <option value="" disabled>
                    Выберите команду
                  </option>
                  {teams.map((team) => (
                    <option key={team} value={team}>
                      {team}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                {/* поле для доп. информации */}
                <input
                  type="text"
                  value={row.info}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleInfoChange(row.id, e.target.value)
                  }
                  placeholder="Примечание"
                />
              </td>
              <td>
                <select
                  value={row.percentage}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                    handlePercentageChange(row.id, e.target.value)
                  }
                >
                  <option value={0} disabled>
                    Выберите процент
                  </option>
                  {Array.from({ length: 101 }, (_, i) => i).map((p) => (
                    <option key={p} value={p}>
                      {p}%
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {error && <div className="error-message">{error}</div>}

      <div className="buttons">
        <button onClick={runLottery}>Провести лотерею</button>
        <button onClick={resetLottery}>Сбросить результаты</button>
        <button onClick={saveToDatabase}>Сохранить в БД</button>{" "}
        {/* новая кнопка */}
      </div>

      {lotteryResult.length > 0 && (
        <div className="lottery-results">
          <h3>Результаты драфт-лотереи:</h3>
          <ol>
            {lotteryResult.map((team, index) => (
              <li key={index}>
                Пик {index + 1}: {team}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
};

export default DraftLotteryBody;
