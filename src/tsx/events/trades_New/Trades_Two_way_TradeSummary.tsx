
import React, { useMemo } from "react";
import "./trades_Two_way_TradeSummary.css";

// Интерфейсы
interface Player {
  id: number;
  active_roster: string;
  position?: string;
  team?: string;
  g_league?: string;
}

interface PickItem {
  id: string;
  label: string;
  team: string;
  note?: string;
}

export interface DeadCapPlayer {
  id: number;
  name: string;
  originalSalariesRawByYear: Record<number, string>;
  retentionByYear: Record<number, number>;
  finalSalariesByYear: Record<number, number>;
}

interface CashData {
  amount: number;
  direction: "myToTheir" | "theirToMy";
}

interface TradeSummaryProps {
  myTeam: string;
  theirTeam: string;
  selectedMainMy: Player[];
  selectedMainTheir: Player[];
  selectedGleagueMy: Player[];
  selectedGleagueTheir: Player[];
  selectedPicksMy: PickItem[];
  selectedPicksTheir: PickItem[];
  generalNote: string;
  myTeamNote: string;
  theirTeamNote: string;
  deadCapPlayersMy: DeadCapPlayer[];
  deadCapPlayersTheir: DeadCapPlayer[];
  cash?: CashData; // новый проп
  onGeneralNoteChange: (val: string) => void;
  onMyTeamNoteChange: (val: string) => void;
  onTheirTeamNoteChange: (val: string) => void;
  onSubmit: () => void;
  onReset: () => void;
  onBack?: () => void; // новый проп
}

// Форматирование чисел с пробелами
const formatWithSpaces = (value: number): string => {
  if (value === undefined || value === null) return "—";
  const parts = value.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return parts.join(".");
};

// Формирует итоговую зарплату, сохраняя префикс/суффикс исходной строки
const formatFinalSalaryWithPrefix = (
  rawValue: string,
  finalSalary: number,
): string => {
  if (finalSalary < 0) finalSalary = 0;
  const formattedNumber = formatWithSpaces(finalSalary);
  const match = rawValue.match(/\d[\d\s]*\.?\d*/);
  if (!match) return formattedNumber;
  const originalNumberStr = match[0];
  return rawValue.replace(originalNumberStr, formattedNumber);
};

const TradeSummary: React.FC<TradeSummaryProps> = ({
  myTeam,
  theirTeam,
  selectedMainMy,
  selectedMainTheir,
  selectedGleagueMy,
  selectedGleagueTheir,
  selectedPicksMy,
  selectedPicksTheir,
  generalNote,
  myTeamNote,
  theirTeamNote,
  deadCapPlayersMy,
  deadCapPlayersTheir,
  cash,
  onGeneralNoteChange,
  onMyTeamNoteChange,
  onTheirTeamNoteChange,
  onSubmit,
  onReset,
  onBack,
}) => {
  const renderList = (items: any[], renderItem: (item: any) => string) => {
    if (items.length === 0) return <span> нет</span>;
    return (
      <ul className="TradeSummary-list">
        {items.map((item) => (
          <li key={item.id} className="TradeSummary-list-item">
            {renderItem(item)}
          </li>
        ))}
      </ul>
    );
  };

  const renderPick = (pick: PickItem) => {
    return pick.note ? `${pick.label} (${pick.note})` : pick.label;
  };

  const renderDeadCapPlayers = (players: DeadCapPlayer[], title: string) => {
    if (players.length === 0) return null;
    return (
      <div className="TradeSummary-section">
        <strong>{title}</strong>
        {players.map((player) => (
          <div key={player.id} className="TradeSummary-deadcap-player">
            <div className="TradeSummary-deadcap-name">{player.name}</div>
            <table className="TradeSummary-deadcap-table">
              <thead>
                <tr>
                  <th>Год</th>
                  <th>Исходная зарплата</th>
                  <th>Удержание (Dead Cap)</th>
                  <th>Итоговая зарплата</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(player.originalSalariesRawByYear)
                  .sort((a, b) => Number(a) - Number(b))
                  .map((year) => {
                    const y = Number(year);
                    const originalRaw = player.originalSalariesRawByYear[y];
                    const retention = player.retentionByYear[y] || 0;
                    const finalSalaryNum = player.finalSalariesByYear[y];
                    const finalDisplay = formatFinalSalaryWithPrefix(
                      originalRaw,
                      finalSalaryNum,
                    );
                    return (
                      <tr key={y}>
                        <td>{y}</td>
                        <td>{originalRaw}</td>
                        <td>{formatWithSpaces(retention)}</td>
                        <td>{finalDisplay}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    );
  };

  const totalDeadCap = useMemo(() => {
    let total = 0;
    for (const p of deadCapPlayersMy) {
      for (const retention of Object.values(p.retentionByYear)) {
        total += retention;
      }
    }
    for (const p of deadCapPlayersTheir) {
      for (const retention of Object.values(p.retentionByYear)) {
        total += retention;
      }
    }
    return total;
  }, [deadCapPlayersMy, deadCapPlayersTheir]);

  return (
    <div className="TradeSummary-container">
      <h4 className="TradeSummary-title">Итоги трейда</h4>

      <div className="TradeSummary-teams-row">
        {myTeam} ↔ {theirTeam}
      </div>

      <div className="TradeSummary-grid">
        <div className="TradeSummary-column">
          <h5 className="TradeSummary-column-title">{myTeam}</h5>
          <div className="TradeSummary-section">
            <strong>Основной состав</strong>
            {renderList(selectedMainMy, (p) => p.active_roster)}
          </div>
          <div className="TradeSummary-section">
            <strong>G-League</strong>
            {renderList(selectedGleagueMy, (p) => p.active_roster)}
          </div>
          <div className="TradeSummary-section">
            <strong>Пики</strong>
            {renderList(selectedPicksMy, (p) => renderPick(p))}
          </div>
          <div className="TradeSummary-section">
            <strong>Примечание</strong>
            <textarea
              className="TradeSummary-textarea"
              value={myTeamNote}
              onChange={(e) => onMyTeamNoteChange(e.target.value)}
              rows={2}
              placeholder={`Заметка для ${myTeam}`}
            />
          </div>
        </div>

        <div className="TradeSummary-column">
          <h5 className="TradeSummary-column-title">{theirTeam}</h5>
          <div className="TradeSummary-section">
            <strong>Основной состав</strong>
            {renderList(selectedMainTheir, (p) => p.active_roster)}
          </div>
          <div className="TradeSummary-section">
            <strong>G-League</strong>
            {renderList(selectedGleagueTheir, (p) => p.active_roster)}
          </div>
          <div className="TradeSummary-section">
            <strong>Пики</strong>
            {renderList(selectedPicksTheir, (p) => renderPick(p))}
          </div>
          <div className="TradeSummary-section">
            <strong>Примечание</strong>
            <textarea
              className="TradeSummary-textarea"
              value={theirTeamNote}
              onChange={(e) => onTheirTeamNoteChange(e.target.value)}
              rows={2}
              placeholder={`Заметка для ${theirTeam}`}
            />
          </div>
        </div>
      </div>

      {renderDeadCapPlayers(deadCapPlayersMy, `Dead Cap игроки (${myTeam})`)}
      {renderDeadCapPlayers(
        deadCapPlayersTheir,
        `Dead Cap игроки (${theirTeam})`,
      )}

      <div className="TradeSummary-section">
        <strong>Общая сумма Dead Cap (удержания):</strong>{" "}
        {formatWithSpaces(totalDeadCap)}
      </div>

      {/* Блок денежной компенсации */}
      {cash && cash.amount > 0 && (
        <div className="TradeSummary-section TradeSummary-cash">
          <strong>Денежная компенсация:</strong>{" "}
          {cash.direction === "myToTheir"
            ? `${myTeam} → ${theirTeam}`
            : `${theirTeam} → ${myTeam}`}{" "}
          ${cash.amount.toLocaleString()}
        </div>
      )}

      <div className="TradeSummary-section">
        <strong>Общее примечание</strong>
        <textarea
          className="TradeSummary-textarea"
          value={generalNote}
          onChange={(e) => onGeneralNoteChange(e.target.value)}
          rows={2}
          placeholder="Общий комментарий к трейду"
        />
      </div>

      <div className="TradeSummary-actions">
        {onBack && (
          <button
            className="TradeSummary-button TradeSummary-button-back"
            onClick={onBack}
          >
            Назад
          </button>
        )}
        <button
          className="TradeSummary-button TradeSummary-button-reset"
          onClick={onReset}
        >
          Сбросить
        </button>
        <button
          className="TradeSummary-button TradeSummary-button-submit"
          onClick={onSubmit}
        >
          Отправить трейд
        </button>
      </div>
    </div>
  );
};

export default TradeSummary;
