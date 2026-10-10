import React from "react";
import "./playerColumnSelectorMain.css";

// Определение типа Player (для изоляции компонента)
type Player = {
  id: number;
  active_roster: string;
  position: string;
  pos_elig: string;
  age: string | null;
  year_one: string | null;
  year_two: string | null;
  year_three: string | null;
  year_four: string | null;
  year_five: string | null;
  opt: string;
  status: string;
  exp: string;
  bird: string;
  awards: string;
  team: string;
  g_league: string;
  rating: string;
  rokie: string;
  // ---------
  retention: string;
  dead_cap_team: string;
  dc_year_one: string;
  dc_year_two: string;
  dc_year_three: string;
  dc_year_four: string;
  dc_year_five: string;
};

interface ColumnSelectorProps {
  visibleColumns: Set<keyof Player>;
  onToggleColumn: (column: keyof Player) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  columnGroups: Record<string, (keyof Player)[]>;
  onSelectGroup: (columns: (keyof Player)[]) => void;
  onDeselectGroup: (columns: (keyof Player)[]) => void;
  isMobile: boolean;
}

const ColumnSelector: React.FC<ColumnSelectorProps> = ({
  visibleColumns,
  onToggleColumn,
  onSelectAll,
  onDeselectAll,
  columnGroups,
  onSelectGroup,
  onDeselectGroup,
  isMobile,
}) => {
  // Мобильная версия
  if (isMobile) {
    return (
      <div className="playersRosterAgentControlCenter-columnSelector">
        <div className="playersRosterAgentControlCenter-columnSelectorHeader">
          <h3 className="playersRosterAgentControlCenter-columnSelectorTitle">
            COLUMN VISIBILITY
          </h3>
        </div>
        <div className="playersRosterAgentControlCenter-mobile-column-groups">
          <div className="playersRosterAgentControlCenter-mobile-mass-selection">
            <button
              onClick={onSelectAll}
              className="playersRosterAgentControlCenter-button playersRosterAgentControlCenter-successButton"
            >
              Select All Columns
            </button>
            <button
              onClick={onDeselectAll}
              className="playersRosterAgentControlCenter-button"
            >
              Deselect All Columns
            </button>
          </div>
          {Object.entries(columnGroups).map(([groupName, columns]) => (
            <div
              key={groupName}
              className="playersRosterAgentControlCenter-mobile-column-group"
            >
              <div className="playersRosterAgentControlCenter-mobile-column-group-title">
                {groupName} ({columns.length})
              </div>
              <div className="playersRosterAgentControlCenter-mobile-column-checkboxes">
                {columns.map((column) => (
                  <label
                    key={column}
                    className="playersRosterAgentControlCenter-mobile-checkbox-label"
                  >
                    <input
                      type="checkbox"
                      checked={visibleColumns.has(column)}
                      onChange={() => onToggleColumn(column)}
                      className="playersRosterAgentControlCenter-mobile-checkbox-input"
                    />
                    <span className="playersRosterAgentControlCenter-mobile-checkbox-text">
                      {column.replace(/_/g, " ")}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Десктопная версия
  return (
    <div className="playersRosterAgentControlCenter-columnSelector">
      <div className="playersRosterAgentControlCenter-columnSelectorHeader">
        <h3 className="playersRosterAgentControlCenter-columnSelectorTitle">
          COLUMN VISIBILITY
        </h3>
        <div className="playersRosterAgentControlCenter-massSelectionButtons">
          <button
            onClick={onSelectAll}
            className="playersRosterAgentControlCenter-smallButton"
          >
            Select All
          </button>
          <button
            onClick={onDeselectAll}
            className="playersRosterAgentControlCenter-smallButton"
          >
            Deselect All
          </button>
        </div>
      </div>

      {Object.entries(columnGroups).map(([groupName, columns]) => (
        <div
          key={groupName}
          className="playersRosterAgentControlCenter-columnGroup"
        >
          <div className="playersRosterAgentControlCenter-columnGroupTitle">
            <span>
              {groupName} ({columns.length})
            </span>
            <div>
              <button
                onClick={() => onSelectGroup(columns)}
                className="playersRosterAgentControlCenter-smallButton"
              >
                Select All
              </button>
              <button
                onClick={() => onDeselectGroup(columns)}
                className="playersRosterAgentControlCenter-smallButton"
              >
                Deselect All
              </button>
            </div>
          </div>
          <div className="playersRosterAgentControlCenter-columnCheckboxes">
            {columns.map((column) => (
              <label
                key={column}
                className="playersRosterAgentControlCenter-checkboxLabel"
              >
                <input
                  type="checkbox"
                  checked={visibleColumns.has(column)}
                  onChange={() => onToggleColumn(column)}
                  className="playersRosterAgentControlCenter-checkbox"
                />
                {column.replace(/_/g, " ")}
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ColumnSelector;
