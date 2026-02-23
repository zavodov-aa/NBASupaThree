import React, { useState, useEffect } from "react";
import { supabase } from "../../../../../Supabase";

interface RFAResultRow {
  player: string | null;
  rfa_first_round_result: string | null;
  rfa_second_round_result: string | null;
  final_decision: string;
}

const RFAUserFinalDecision: React.FC = () => {
  const [data, setData] = useState<RFAResultRow[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false); // состояние видимости таблицы

  // Функция загрузки данных (вызывается только при первом открытии)
  const fetchFinalDecisions = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const { data: result, error } = await supabase
        .from("Market_RFA_result")
        .select(
          "player, rfa_first_round_result, rfa_second_round_result, final_decision",
        )
        .not("final_decision", "is", null)
        .neq("final_decision", "");

      if (error) throw error;
      setData((result as RFAResultRow[]) || []);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Неизвестная ошибка");
      }
    } finally {
      setLoading(false);
    }
  };

  // Загружаем данные только в тот момент, когда таблица становится видимой,
  // и если они ещё не загружены (или предыдущая загрузка не завершена с ошибкой)
  useEffect(() => {
    if (isVisible && data.length === 0 && !loading) {
      fetchFinalDecisions();
    }
  }, [isVisible]); // эффект срабатывает при изменении isVisible

  // Обработчик клика по кнопке – переключает видимость
  const toggleVisibility = () => {
    setIsVisible((prev) => !prev);
  };

  return (
    <div>
      <h1>Итоги RFA</h1>

      {/* Кнопка с динамическим текстом */}
      <button onClick={toggleVisibility}>
        {isVisible ? "Скрыть результаты" : "Показать результаты"}
      </button>

      {/* Таблица отображается только при isVisible === true */}
      {isVisible && (
        <>
          {loading && <div>Загрузка итогов RFA...</div>}
          {error && <div style={{ color: "red" }}>Ошибка: {error}</div>}
          {!loading && !error && data.length === 0 && (
            <p>Нет записей с итоговым решением</p>
          )}
          {!loading && !error && data.length > 0 && (
            <table
              style={{
                borderCollapse: "collapse",
                width: "100%",
                marginTop: "1rem",
              }}
              border={1}
              cellPadding="8"
            >
              <thead>
                <tr>
                  <th>Игрок</th>
                  <th>Результат 1-го раунда</th>
                  <th>Результат 2-го раунда</th>
                  <th>Итоговое решение</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, index) => (
                  <tr key={index}>
                    <td>{row.player ?? "—"}</td>
                    <td>{row.rfa_first_round_result ?? "—"}</td>
                    <td>{row.rfa_second_round_result ?? "—"}</td>
                    <td>{row.final_decision}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
};

export default RFAUserFinalDecision;
