import React, { useState, useEffect } from "react";
import { supabase } from "../../../../../Supabase";

interface UFASecondRoundResultRow {
  player: string | null;
  ufa_second_round_first_stage_result: string | null;
  ufa_second_round_second_stage_result: string | null;
  final_second_round_decision: string;
}

const UFAUserSecondRoundFinalDecision: React.FC = () => {
  const [data, setData] = useState<UFASecondRoundResultRow[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false); // состояние видимости таблицы

  // Функция загрузки данных (вызывается только при первом открытии)
  const fetchFinalDecisions = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const { data: result, error } = await supabase
        .from("Market_UFA_second_round_result")
        .select(
          "player, ufa_second_round_first_stage_result, ufa_second_round_second_stage_result, final_second_round_decision",
        )
        .not("final_second_round_decision", "is", null)
        .neq("final_second_round_decision", "");

      if (error) throw error;
      setData((result as UFASecondRoundResultRow[]) || []);
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
      <h1>Итоги второго раунда UFA</h1>

      {/* Кнопка с динамическим текстом */}
      <button onClick={toggleVisibility}>
        {isVisible ? "Скрыть результаты" : "Показать результаты"}
      </button>

      {/* Таблица отображается только при isVisible === true */}
      {isVisible && (
        <>
          {loading && <div>Загрузка итогов второго раунда UFA...</div>}
          {error && <div style={{ color: "red" }}>Ошибка: {error}</div>}
          {!loading && !error && data.length === 0 && (
            <p>Нет записей с итоговым решением второго раунда</p>
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
                  <th>Результат первого этапа</th>
                  <th>Результат второго этапа</th>
                  <th>Итоговое решение второго раунда</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, index) => (
                  <tr key={index}>
                    <td>{row.player ?? "—"}</td>
                    <td>{row.ufa_second_round_first_stage_result ?? "—"}</td>
                    <td>{row.ufa_second_round_second_stage_result ?? "—"}</td>
                    <td>{row.final_second_round_decision}</td>
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

export default UFAUserSecondRoundFinalDecision;
