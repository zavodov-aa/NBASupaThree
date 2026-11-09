import React from "react";
import { useAuth } from "../../authorization/AuthContext";
import { usePlayerOptions, toNumber } from "./usePlayerOptions";
import "./playerOptionUserNew.css";

function formatSalary(value: string | null): string {
  const num = toNumber(value);
  if (num === null) return "—";
  return num.toLocaleString("en-US");
}

export default function PlayerOptionUserNew() {
  const { user } = useAuth();
  const team = user?.team ?? null;

  const { players, loading, error } = usePlayerOptions(team);

  return (
    <div className="po-page">
      <header className="po-header">
        <h1>Player Options</h1>
        <p className="po-subtitle">
          {team ? `Команда: ${team}` : "Команда не определена"}
        </p>
      </header>

      {!team && (
        <div className="po-message po-message--error">
          Вы не авторизованы как команда.
        </div>
      )}

      {team && loading && <div className="po-message">Загрузка опций…</div>}

      {team && !loading && error && (
        <div className="po-message po-message--error">
          Ошибка загрузки: {error}
        </div>
      )}

      {team && !loading && !error && players.length === 0 && (
        <div className="po-message">
          У вашей команды нет активных player options.
        </div>
      )}

      {team && !loading && !error && players.length > 0 && (
        <table className="po-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Игрок</th>
              <th>Позиция</th>
              <th>Возраст</th>
              <th>Опция</th>
              <th>Сумма (год 1)</th>
              <th>Статус</th>
            </tr>
          </thead>
          <tbody>
            {players.map((p, idx) => (
              <tr key={p.id}>
                <td>{idx + 1}</td>
                <td className="po-name">{p.active_roster}</td>
                <td>{p.position ?? "—"}</td>
                <td>{p.age ?? "—"}</td>
                <td>
                  <span className="po-badge po-badge--po">{p.opt}</span>
                </td>
                <td className="po-salary">${formatSalary(p.year_one)}</td>
                <td>{p.status ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
