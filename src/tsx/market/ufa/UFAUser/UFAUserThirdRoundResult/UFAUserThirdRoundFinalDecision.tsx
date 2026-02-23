import React, { useState, useEffect } from "react";
import { supabase } from "../../../../../Supabase";

interface UFAThirdRoundResultRow {
  player: string | null;
  ufa_third_round_first_stage_result: string | null;
  ufa_third_round_second_stage_result: string | null;
  final_third_round_decision: string;
}

const UFAUserThirdRoundFinalDecision: React.FC = () => {
  const [data, setData] = useState<UFAThirdRoundResultRow[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const fetchFinalDecisions = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const { data: result, error } = await supabase
        .from("Market_UFA_third_round_result")
        .select(
          "player, ufa_third_round_first_stage_result, ufa_third_round_second_stage_result, final_third_round_decision",
        )
        .not("final_third_round_decision", "is", null)
        .neq("final_third_round_decision", "");

      if (error) throw error;
      setData((result as UFAThirdRoundResultRow[]) || []);
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

  useEffect(() => {
    if (isVisible && data.length === 0 && !loading) {
      fetchFinalDecisions();
    }
  }, [isVisible]);

  const toggleVisibility = () => {
    setIsVisible((prev) => !prev);
  };

  return (
    <div>
      <h1>Итоги третьего раунда UFA</h1>

      <button onClick={toggleVisibility}>
        {isVisible ? "Скрыть результаты" : "Показать результаты"}
      </button>

      {isVisible && (
        <>
          {loading && <div>Загрузка итогов третьего раунда UFA...</div>}
          {error && <div style={{ color: "red" }}>Ошибка: {error}</div>}
          {!loading && !error && data.length === 0 && (
            <p>Нет записей с итоговым решением третьего раунда</p>
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
                  <th>Итоговое решение третьего раунда</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, index) => (
                  <tr key={index}>
                    <td>{row.player ?? "—"}</td>
                    <td>{row.ufa_third_round_first_stage_result ?? "—"}</td>
                    <td>{row.ufa_third_round_second_stage_result ?? "—"}</td>
                    <td>{row.final_third_round_decision}</td>
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

export default UFAUserThirdRoundFinalDecision;
