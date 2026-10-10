import React, { useState, useEffect } from "react";
import { Player } from "../types/Player";
import { formatValueWithSpaces, isYearColumn } from "../utils/formatting";

interface PlayersTableProps {
  players: Player[];
  visibleColumns: (keyof Player)[];
  isAddingNew: boolean;
  newPlayer: Omit<Player, "id">;
  editingId: number | null;
  editData: Partial<Player>;
  onEdit: (player: Player) => void;
  onSave: () => void;
  onCancel: () => void;
  onAddNew: () => void;
  onCancelAdd: () => void;
  onTeamCellClick: (
    e: React.MouseEvent,
    playerId: number,
    isNew: boolean,
  ) => void;
  onGLeagueCellClick: (
    e: React.MouseEvent,
    playerId: number,
    isNew: boolean,
  ) => void;
  onDeadCapTeamCellClick?: (
    e: React.MouseEvent,
    playerId: number,
    isNew: boolean,
  ) => void;
  onEditDataChange: (field: keyof Player, value: string) => void;
  onNewPlayerChange: (field: keyof Omit<Player, "id">, value: string) => void;
  isMobile: boolean;
  onIncrementAge?: () => void;
  onIncrementExp?: () => void;
  onShiftDC?: () => void;
  readOnly?: boolean; // 👈 ДОБАВЛЕНО
}

export const PlayersTable: React.FC<PlayersTableProps> = ({
  players,
  visibleColumns,
  isAddingNew,
  newPlayer,
  editingId,
  editData,
  onEdit,
  onSave,
  onCancel,
  onAddNew,
  onCancelAdd,
  onTeamCellClick,
  onGLeagueCellClick,
  onDeadCapTeamCellClick,
  onEditDataChange,
  onNewPlayerChange,
  isMobile,
  onIncrementAge,
  onIncrementExp,
  onShiftDC,
  readOnly = false, // 👈 ДОБАВЛЕНО
}) => {
  const visibleColumnsWithoutId = visibleColumns.filter((col) => col !== "id");

  const [positionPicker, setPositionPicker] = useState<{
    playerId: number;
    column: keyof Player;
  } | null>(null);

  useEffect(() => {
    setPositionPicker(null);
  }, [editingId, isAddingNew]);

  const renderYearInput = (value: string, onChange: (val: string) => void) => {
    return (
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="playersRosterAgentControlCenter-editInput"
        style={isMobile ? { fontSize: "11px", padding: "4px" } : {}}
      />
    );
  };

  const renderPositionEditor = (
    playerId: number,
    column: keyof Player,
    value: string,
    onChange: (val: string) => void,
  ) => {
    const positions = value
      ? value
          .split("/")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];
    const isOpen =
      positionPicker?.playerId === playerId &&
      positionPicker?.column === column;

    const addPosition = (pos: string) => {
      if (!positions.includes(pos)) {
        const newValue = [...positions, pos].join("/");
        onChange(newValue);
      }
      setPositionPicker(null);
    };

    const removePosition = (posToRemove: string) => {
      const newValue = positions.filter((p) => p !== posToRemove).join("/");
      onChange(newValue);
    };

    return (
      <div className="playersRosterAgentControlCenter-POS-positionEditor">
        <div className="playersRosterAgentControlCenter-POS-positionTags">
          {positions.map((pos) => (
            <span
              key={pos}
              className="playersRosterAgentControlCenter-POS-positionTag"
            >
              {pos}
              <button
                type="button"
                className="playersRosterAgentControlCenter-POS-removeTag"
                onClick={() => removePosition(pos)}
                title="Remove"
              >
                ×
              </button>
            </span>
          ))}
          <button
            type="button"
            className="playersRosterAgentControlCenter-POS-addPositionButton"
            onClick={() => setPositionPicker({ playerId, column })}
            title="Add position"
          >
            +
          </button>
        </div>
        {isOpen && (
          <div className="playersRosterAgentControlCenter-POS-positionDropdown">
            <select
              value=""
              onChange={(e) => {
                const selected = e.target.value;
                if (selected) addPosition(selected);
              }}
              onBlur={() => setPositionPicker(null)}
              autoFocus
              className="playersRosterAgentControlCenter-editInput"
              style={isMobile ? { fontSize: "11px", padding: "4px" } : {}}
            >
              <option value="">Select position</option>
              <option value="PG">PG</option>
              <option value="SG">SG</option>
              <option value="SF">SF</option>
              <option value="PF">PF</option>
              <option value="C">C</option>
            </select>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="playersRosterAgentControlCenter-tableContainer">
      <table className="playersRosterAgentControlCenter-table">
        <thead>
          <tr className="playersRosterAgentControlCenter-tableHeader">
            {visibleColumns.map((column) => (
              <th
                key={column}
                className="playersRosterAgentControlCenter-tableHeaderCell"
              >
                {column.replace(/_/g, " ").toUpperCase()}
                {column === "age" && onIncrementAge && (
                  <button
                    onClick={onIncrementAge}
                    className="playersRosterAgentControlCenter-shiftButton"
                    title={
                      isMobile
                        ? "Increment age for all players"
                        : "Повысить возраст всех игроков"
                    }
                  >
                    {isMobile ? "+1" : "Повысить"}
                  </button>
                )}
                {column === "exp" && onIncrementExp && (
                  <button
                    onClick={onIncrementExp}
                    className="playersRosterAgentControlCenter-shiftButton"
                    title={
                      isMobile
                        ? "Increment EXP for all players"
                        : "Повысить EXP всех игроков"
                    }
                  >
                    {isMobile ? "+1" : "Повысить"}
                  </button>
                )}
                {/* 👈 ИЗМЕНЕНО: кнопка "Перенести" для year_two — только для админа */}
                {column === "year_two" && !readOnly && (
                  <button
                    onClick={() => {}}
                    className="playersRosterAgentControlCenter-shiftButton"
                    title={
                      isMobile
                        ? "Mass contract transfer with backup"
                        : "Массовый перенос данных контрактов с сохранением в архив"
                    }
                  >
                    {isMobile ? "Shift" : "Перенести"}
                  </button>
                )}
                {column === "dc_year_two" && onShiftDC && (
                  <button
                    onClick={onShiftDC}
                    className="playersRosterAgentControlCenter-shiftButton"
                    title={
                      isMobile
                        ? "Mass DC contract transfer with backup"
                        : "Массовый перенос данных DC-контрактов с сохранением в архив"
                    }
                  >
                    {isMobile ? "Shift" : "Перенести"}
                  </button>
                )}
              </th>
            ))}
            <th className="playersRosterAgentControlCenter-tableHeaderCell">
              ACTIONS
            </th>
          </tr>
        </thead>
        <tbody>
          {/* 👈 ИЗМЕНЕНО: строка добавления нового игрока — только для админа */}
          {isAddingNew && !readOnly && (
            <tr className="playersRosterAgentControlCenter-newRow">
              <td className="playersRosterAgentControlCenter-tableCell">
                <div className="playersRosterAgentControlCenter-newPlayerId">
                  NEW
                </div>
              </td>
              {visibleColumnsWithoutId.map((column) => (
                <td
                  key={column}
                  className="playersRosterAgentControlCenter-tableCell"
                >
                  {column === "team" ? (
                    <div
                      className="playersRosterAgentControlCenter-teamCell playersRosterAgentControlCenter-editableCell"
                      onClick={(e) => onTeamCellClick(e, 0, true)}
                    >
                      {newPlayer.team ||
                        (isMobile ? "Select team" : "Click to select team")}
                    </div>
                  ) : column === "g_league" ? (
                    <div
                      className="playersRosterAgentControlCenter-gLeagueCell playersRosterAgentControlCenter-editableCell"
                      onClick={(e) => onGLeagueCellClick(e, 0, true)}
                    >
                      {newPlayer.g_league ||
                        (isMobile
                          ? "Select G League"
                          : "Click to select G League team")}
                    </div>
                  ) : column === "dead_cap_team" ? (
                    <div
                      className="playersRosterAgentControlCenter-deadCapTeamCell playersRosterAgentControlCenter-editableCell"
                      onClick={(e) =>
                        onDeadCapTeamCellClick &&
                        onDeadCapTeamCellClick(e, 0, true)
                      }
                    >
                      {newPlayer.dead_cap_team ||
                        (isMobile
                          ? "Select Dead Cap"
                          : "Click to select Dead Cap team")}
                    </div>
                  ) : column === "opt" ? (
                    <select
                      value={newPlayer.opt || ""}
                      onChange={(e) => onNewPlayerChange("opt", e.target.value)}
                      className="playersRosterAgentControlCenter-editInput"
                      style={
                        isMobile ? { fontSize: "11px", padding: "4px" } : {}
                      }
                    >
                      <option value="">Select option</option>
                      <option value="PO">PO</option>
                      <option value="TO">TO</option>
                      <option value="RFA">RFA</option>
                      <option value="UFA">UFA</option>
                      <option value="2TO">2TO</option>
                    </select>
                  ) : column === "bird" ? (
                    <select
                      value={newPlayer.bird || ""}
                      onChange={(e) =>
                        onNewPlayerChange("bird", e.target.value)
                      }
                      className="playersRosterAgentControlCenter-editInput"
                      style={
                        isMobile ? { fontSize: "11px", padding: "4px" } : {}
                      }
                    >
                      <option value="">Select BIRD</option>
                      <option value="YES">YES</option>
                      <option value="NO">NO</option>
                      <option value="POT">POT</option>
                    </select>
                  ) : column === "status" ? (
                    <select
                      value={newPlayer.status || ""}
                      onChange={(e) =>
                        onNewPlayerChange("status", e.target.value)
                      }
                      className="playersRosterAgentControlCenter-editInput"
                      style={
                        isMobile ? { fontSize: "11px", padding: "4px" } : {}
                      }
                    >
                      <option value="">Select status</option>
                      <option value="PO">PO</option>
                      <option value="TO">TO</option>
                      <option value="RFA">RFA</option>
                      <option value="UFA">UFA</option>
                      <option value="2TO">2TO</option>
                    </select>
                  ) : column === "position" || column === "pos_elig" ? (
                    renderPositionEditor(
                      0,
                      column,
                      newPlayer[column as keyof Omit<Player, "id">] || "",
                      (val) =>
                        onNewPlayerChange(
                          column as keyof Omit<Player, "id">,
                          val,
                        ),
                    )
                  ) : isYearColumn(column) ? (
                    renderYearInput(
                      newPlayer[column as keyof Omit<Player, "id">] || "",
                      (val) =>
                        onNewPlayerChange(
                          column as keyof Omit<Player, "id">,
                          val,
                        ),
                    )
                  ) : (
                    <input
                      value={
                        newPlayer[column as keyof Omit<Player, "id">] || ""
                      }
                      onChange={(e) =>
                        onNewPlayerChange(
                          column as keyof Omit<Player, "id">,
                          e.target.value,
                        )
                      }
                      className="playersRosterAgentControlCenter-editInput"
                      placeholder={column.replace(/_/g, " ")}
                      style={
                        isMobile ? { fontSize: "11px", padding: "4px" } : {}
                      }
                    />
                  )}
                </td>
              ))}
              <td className="playersRosterAgentControlCenter-tableCell">
                <div className="playersRosterAgentControlCenter-actionButtonsContainer">
                  <button
                    onClick={onAddNew}
                    className="playersRosterAgentControlCenter-button playersRosterAgentControlCenter-successButton"
                    style={
                      isMobile ? { padding: "6px 8px", fontSize: "11px" } : {}
                    }
                  >
                    Save
                  </button>
                  <button
                    onClick={onCancelAdd}
                    className="playersRosterAgentControlCenter-button"
                    style={
                      isMobile ? { padding: "6px 8px", fontSize: "11px" } : {}
                    }
                  >
                    Cancel
                  </button>
                </div>
              </td>
            </tr>
          )}

          {/* Существующие игроки */}
          {players.map((player) => (
            <tr
              key={player.id}
              className="playersRosterAgentControlCenter-tableRow"
            >
              {visibleColumns.map((column) => {
                const value = player[column] || "—";

                return (
                  <td
                    key={column}
                    className="playersRosterAgentControlCenter-tableCell"
                  >
                    {editingId === player.id ? (
                      column === "team" ? (
                        <div
                          className="playersRosterAgentControlCenter-teamCell playersRosterAgentControlCenter-editableCell"
                          onClick={(e) => onTeamCellClick(e, player.id, false)}
                        >
                          {editData.team ||
                            (isMobile ? "Select team" : "Click to select team")}
                        </div>
                      ) : column === "g_league" ? (
                        <div
                          className="playersRosterAgentControlCenter-gLeagueCell playersRosterAgentControlCenter-editableCell"
                          onClick={(e) =>
                            onGLeagueCellClick(e, player.id, false)
                          }
                        >
                          {editData.g_league ||
                            (isMobile
                              ? "Select G League"
                              : "Click to select G League team")}
                        </div>
                      ) : column === "dead_cap_team" ? (
                        <div
                          className="playersRosterAgentControlCenter-deadCapTeamCell playersRosterAgentControlCenter-editableCell"
                          onClick={(e) =>
                            onDeadCapTeamCellClick &&
                            onDeadCapTeamCellClick(e, player.id, false)
                          }
                        >
                          {editData.dead_cap_team ||
                            (isMobile
                              ? "Select Dead Cap"
                              : "Click to select Dead Cap team")}
                        </div>
                      ) : column === "opt" ? (
                        <select
                          value={editData.opt || ""}
                          onChange={(e) =>
                            onEditDataChange("opt", e.target.value)
                          }
                          className="playersRosterAgentControlCenter-editInput"
                          style={
                            isMobile ? { fontSize: "11px", padding: "4px" } : {}
                          }
                        >
                          <option value="">Select option</option>
                          <option value="PO">PO</option>
                          <option value="TO">TO</option>
                          <option value="RFA">RFA</option>
                          <option value="UFA">UFA</option>
                          <option value="2TO">2TO</option>
                        </select>
                      ) : column === "bird" ? (
                        <select
                          value={editData.bird || ""}
                          onChange={(e) =>
                            onEditDataChange("bird", e.target.value)
                          }
                          className="playersRosterAgentControlCenter-editInput"
                          style={
                            isMobile ? { fontSize: "11px", padding: "4px" } : {}
                          }
                        >
                          <option value="">Select BIRD</option>
                          <option value="YES">YES</option>
                          <option value="NO">NO</option>
                          <option value="POT">POT</option>
                        </select>
                      ) : column === "status" ? (
                        <select
                          value={editData.status || ""}
                          onChange={(e) =>
                            onEditDataChange("status", e.target.value)
                          }
                          className="playersRosterAgentControlCenter-editInput"
                          style={
                            isMobile ? { fontSize: "11px", padding: "4px" } : {}
                          }
                        >
                          <option value="">Select status</option>
                          <option value="PO">PO</option>
                          <option value="TO">TO</option>
                          <option value="RFA">RFA</option>
                          <option value="UFA">UFA</option>
                          <option value="2TO">2TO</option>
                        </select>
                      ) : column === "position" || column === "pos_elig" ? (
                        renderPositionEditor(
                          player.id,
                          column,
                          (editData[column] as string) || "",
                          (val) => onEditDataChange(column, val),
                        )
                      ) : isYearColumn(column) ? (
                        renderYearInput(
                          (editData[column] as string) || "",
                          (val) => onEditDataChange(column, val),
                        )
                      ) : (
                        <input
                          value={editData[column] || ""}
                          onChange={(e) =>
                            onEditDataChange(column, e.target.value)
                          }
                          className="playersRosterAgentControlCenter-editInput"
                          style={
                            isMobile ? { fontSize: "11px", padding: "4px" } : {}
                          }
                        />
                      )
                    ) : (
                      <div className="playersRosterAgentControlCenter-cellValue">
                        {isYearColumn(column)
                          ? formatValueWithSpaces(value)
                          : value}
                      </div>
                    )}
                  </td>
                );
              })}
              <td className="playersRosterAgentControlCenter-tableCell">
                {editingId === player.id ? (
                  <div className="playersRosterAgentControlCenter-actionButtonsContainer">
                    <button
                      onClick={onSave}
                      className="playersRosterAgentControlCenter-button playersRosterAgentControlCenter-primaryButton"
                      style={
                        isMobile ? { padding: "6px 8px", fontSize: "11px" } : {}
                      }
                    >
                      Save
                    </button>
                    <button
                      onClick={onCancel}
                      className="playersRosterAgentControlCenter-button"
                      style={
                        isMobile ? { padding: "6px 8px", fontSize: "11px" } : {}
                      }
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  // 👈 ИЗМЕНЕНО: кнопка Edit — только для админа
                  !readOnly && (
                    <button
                      onClick={() => onEdit(player)}
                      className="playersRosterAgentControlCenter-button"
                      style={
                        isMobile ? { padding: "6px 8px", fontSize: "11px" } : {}
                      }
                    >
                      Edit
                    </button>
                  )
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {players.length === 0 && !isAddingNew && (
        <div className="playersRosterAgentControlCenter-emptyState">
          NO PLAYERS FOUND MATCHING CURRENT FILTERS
        </div>
      )}
    </div>
  );
};
