import React, { useState, useEffect } from "react";
import { supabase } from "../../../../Supabase";

// Интерфейс строки данных из таблицы Market_RFA_result
interface RfaResultRow {
  id: number;
  player: string;
  rfa_first_round_result: string;
  rfa_second_round_result: string;
  final_decision: string | null;
}

const RFAFinalDecision = () => {
  const [showTable, setShowTable] = useState(false);
  const [data, setData] = useState<RfaResultRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [teams, setTeams] = useState<string[]>([]);
  const [editingRowId, setEditingRowId] = useState<number | null>(null);

  // Загрузка списка команд из таблицы Head
  const fetchTeams = async () => {
    try {
      const { data: teamsData, error } = await supabase
        .from("Head")
        .select("team_name");
      if (error) throw error;
      const teamNames = teamsData?.map((item) => item.team_name) || [];
      setTeams(teamNames);
    } catch (err) {
      console.error("Ошибка загрузки команд:", err);
    }
  };

  // Загрузка данных из таблицы Market_RFA_result
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: fetchedData, error } = await supabase
        .from("Market_RFA_result")
        .select(
          "id, player, rfa_first_round_result, rfa_second_round_result, final_decision",
        );

      if (error) throw error;
      setData((fetchedData as RfaResultRow[]) || []);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ошибка загрузки данных");
      }
    } finally {
      setLoading(false);
    }
  };

  // Обновление финального решения в Supabase
  const updateFinalDecision = async (id: number, team: string) => {
    try {
      const { error } = await supabase
        .from("Market_RFA_result")
        .update({ final_decision: team })
        .eq("id", id);
      if (error) throw error;
    } catch (err) {
      console.error("Ошибка обновления:", err);
      setError("Не удалось сохранить финальное решение");
    }
  };

  // Обработчик выбора команды из селекта
  const handleTeamSelect = async (rowId: number, team: string) => {
    // Обновляем локальное состояние
    setData((prevData) =>
      prevData.map((row) =>
        row.id === rowId ? { ...row, final_decision: team } : row,
      ),
    );
    // Сохраняем в БД
    await updateFinalDecision(rowId, team);
    // Закрываем режим редактирования
    setEditingRowId(null);
  };

  // Обработчик кнопки показа/скрытия таблицы
  const handleShowTable = async () => {
    if (!showTable) {
      await fetchData();
      setShowTable(true);
    } else {
      setShowTable(false);
    }
  };

  // Загружаем список команд при первом рендере
  useEffect(() => {
    fetchTeams();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Финальное решение по игрокам с опцией RFA</h1>

      <button onClick={handleShowTable} style={{ marginBottom: "20px" }}>
        {showTable ? "Скрыть таблицу" : "Показать таблицу"}
      </button>

      {showTable && (
        <>
          {loading && <p>Загрузка данных...</p>}
          {error && <p style={{ color: "red" }}>Ошибка: {error}</p>}
          {!loading && !error && (
            <table
              style={{
                borderCollapse: "collapse",
                width: "100%",
                border: "1px solid #ccc",
              }}
            >
              <thead>
                <tr>
                  <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                    ID
                  </th>
                  <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                    Игрок
                  </th>
                  <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                    Результат 1-го раунда RFA
                  </th>
                  <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                    Результат 2-го раунда RFA
                  </th>
                  <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                    Финальное решение
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data.map((row) => (
                    <tr key={row.id}>
                      <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                        {row.id}
                      </td>
                      <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                        {row.player}
                      </td>
                      <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                        {row.rfa_first_round_result}
                      </td>
                      <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                        {row.rfa_second_round_result}
                      </td>
                      <td
                        style={{
                          border: "1px solid #ccc",
                          padding: "8px",
                          cursor: "pointer",
                          backgroundColor:
                            editingRowId === row.id ? "#f0f0f0" : "transparent",
                        }}
                        onClick={() => setEditingRowId(row.id)}
                      >
                        {editingRowId === row.id ? (
                          <select
                            value={row.final_decision || ""}
                            onChange={(e) =>
                              handleTeamSelect(row.id, e.target.value)
                            }
                            onBlur={() => setEditingRowId(null)} // закрыть при потере фокуса
                            autoFocus
                            style={{ width: "100%" }}
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
                        ) : (
                          <span style={{ display: "block", width: "100%" }}>
                            {row.final_decision || "—"}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      style={{
                        border: "1px solid #ccc",
                        padding: "8px",
                        textAlign: "center",
                      }}
                    >
                      Нет данных
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
};

export default RFAFinalDecision;
