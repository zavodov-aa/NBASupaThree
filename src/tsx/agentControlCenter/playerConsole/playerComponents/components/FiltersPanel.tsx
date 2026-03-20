import React from "react";

interface FiltersPanelProps {
  filters: Record<string, string>;
  onFilterChange: (field: string, value: string) => void;
  onReset: () => void;
  filteredCount: number;
  totalCount: number;
  showFilters: boolean;
  onToggleFilters: () => void;
  isMobile: boolean;
}

export const FiltersPanel: React.FC<FiltersPanelProps> = ({
  filters,
  onFilterChange,
  onReset,
  filteredCount,
  totalCount,
  showFilters,
  onToggleFilters,
  isMobile,
}) => {
  const filterKeys = Object.keys(filters);
  const visibleKeys = isMobile ? filterKeys.slice(0, 4) : filterKeys;

  return (
    <div className="playersRosterAgentControlCenter-controlPanel">
      <div
        className="playersRosterAgentControlCenter-panelHeader"
        onClick={onToggleFilters}
      >
        <div className="playersRosterAgentControlCenter-panelHeaderText">
          FILTER CONTROLS
        </div>
        <div className="playersRosterAgentControlCenter-panelHeaderIcon">
          {showFilters ? "▲" : "▼"}
        </div>
      </div>

      {showFilters && (
        <>
          <div className="playersRosterAgentControlCenter-panelContent">
            {visibleKeys.map((field) => (
              <div
                key={field}
                className="playersRosterAgentControlCenter-filterGroup"
              >
                <label className="playersRosterAgentControlCenter-label">
                  {field.replace(/_/g, " ")}
                </label>
                <input
                  type="text"
                  value={filters[field]}
                  onChange={(e) => onFilterChange(field, e.target.value)}
                  placeholder={`Filter ${field}...`}
                  className="playersRosterAgentControlCenter-input"
                />
              </div>
            ))}
            {isMobile && filterKeys.length > 4 && (
              <div className="playersRosterAgentControlCenter-mobile-more-filters">
                <button
                  className="playersRosterAgentControlCenter-button"
                  onClick={() => {
                    alert(
                      "Используйте фильтры через десктопную версию для полного доступа",
                    );
                  }}
                >
                  Show All Filters
                </button>
              </div>
            )}
          </div>
          <div className="playersRosterAgentControlCenter-buttonGroup">
            <button
              onClick={onReset}
              className="playersRosterAgentControlCenter-button"
            >
              Reset Filters
            </button>
            <div className="playersRosterAgentControlCenter-filterStatus">
              Displaying {filteredCount} of {totalCount} records
            </div>
          </div>
        </>
      )}
    </div>
  );
};
