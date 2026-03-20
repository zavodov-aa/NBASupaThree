import React, { useState, useEffect, ChangeEvent } from "react";
import { supabase } from "../../../Supabase";
import "./draftLotteryBody.css";

interface RowData {
  id: number;
  team: string | null;
  percentage: number;
  info: string;
}

interface TeamRecord {
  team_name: string;
}

const DraftLotteryBody: React.FC = () => {
  const [teams, setTeams] = useState<string[]>([]);
  const [rows, setRows] = useState<RowData[]>([]);
  const [lotteryResult, setLotteryResult] = useState<string[]>([]);
  const [error, setError] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Загрузка списка команд из таблицы Head
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

  // Функция загрузки данных лотереи из draft_lottery
  const loadLotteryData = async (): Promise<void> => {
    const { data, error } = await supabase
      .from("draft_lottery")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("Ошибка загрузки данных лотереи:", error);
      setRows(createEmptyRows());
      return;
    }

    if (data && data.length > 0) {
      const loadedRows: RowData[] = data.map((item: any) => ({
        id: item.id,
        team: item.team,
        percentage: item.percent,
        info: item.info || "",
      }));

      const fullRows: RowData[] = [];
      for (let i = 1; i <= 14; i++) {
        const existing = loadedRows.find((r) => r.id === i);
        if (existing) {
          fullRows.push(existing);
        } else {
          fullRows.push({ id: i, team: null, percentage: 0, info: "" });
        }
      }
      setRows(fullRows);
    } else {
      setRows(createEmptyRows());
    }
  };

  // Загрузка сохранённых данных лотереи при монтировании
  useEffect(() => {
    loadLotteryData();
  }, []);

  // Вспомогательная функция для создания пустых строк
  const createEmptyRows = (): RowData[] =>
    Array.from({ length: 14 }, (_, index) => ({
      id: index + 1,
      team: null,
      percentage: 0,
      info: "",
    }));

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

  const handleInfoChange = (rowId: number, info: string): void => {
    setRows((prev) =>
      prev.map((row) => (row.id === rowId ? { ...row, info } : row)),
    );
    setError("");
  };

  const validateInputs = (): boolean => {
    if (rows.some((row) => !row.team)) {
      setError("Не все команды выбраны");
      return false;
    }
    return true;
  };

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
            info: row.info || "",
            percent: row.percentage,
            created_at: new Date().toISOString(),
          },
          { onConflict: "id" },
        );

        if (error) {
          console.error("Ошибка сохранения:", error);
          alert("Ошибка при сохранении: " + error.message);
          return;
        }
      }
      alert("Данные успешно сохранены!");
      setIsEditing(false); // После сохранения выходим из режима редактирования
    } catch (err) {
      console.error(err);
      alert("Произошла ошибка");
    }
  };

  // Вход в режим редактирования с проверкой пароля
  const handleEditClick = (): void => {
    const password = prompt("Введите пароль для редактирования:");
    if (password === "1") {
      setIsEditing(true);
    } else {
      alert("Неверный пароль");
    }
  };

  // Выход из режима редактирования без сохранения (перезагрузка данных)
  const handleCancelClick = async (): Promise<void> => {
    await loadLotteryData(); // сброс к последнему сохранённому состоянию
    setIsEditing(false);
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
            <th>Доп. инфо</th>
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
                  disabled={!isEditing}
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
                <input
                  type="text"
                  value={row.info}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleInfoChange(row.id, e.target.value)
                  }
                  placeholder="Примечание"
                  disabled={!isEditing}
                />
              </td>
              <td>
                <select
                  value={row.percentage}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                    handlePercentageChange(row.id, e.target.value)
                  }
                  disabled={!isEditing}
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
        {!isEditing ? (
          <button onClick={handleEditClick}>Редактировать</button>
        ) : (
          <button onClick={handleCancelClick}>Отмена</button>
        )}
        <button onClick={runLottery}>Провести лотерею</button>
        <button onClick={resetLottery}>Сбросить результаты</button>
        <button onClick={saveToDatabase} disabled={!isEditing}>
          Сохранить в БД
        </button>
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
