import React from "react";
import { NBA_TEAMS } from "../constants/teams";

interface TeamContextMenuProps {
  show: boolean;
  x: number;
  y: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelect: (team: string) => void;
  onClose: () => void;
  isMobile: boolean;
}

export const TeamContextMenu: React.FC<TeamContextMenuProps> = ({
  show,
  x,
  y,
  searchQuery,
  onSearchChange,
  onSelect,
  onClose,
  isMobile,
}) => {
  if (!show) return null;

  const filteredTeams = NBA_TEAMS.filter((team) =>
    team.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getStyle = () => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const menuWidth = isMobile ? Math.min(viewportWidth - 20, 280) : 300;
    const menuHeight = isMobile ? 300 : 400;

    let left = x;
    let top = y;

    if (left + menuWidth > viewportWidth) {
      left = viewportWidth - menuWidth - 10;
    }
    if (top + menuHeight > viewportHeight) {
      top = viewportHeight - menuHeight - 10;
    }

    return { left, top, width: menuWidth };
  };

  return (
    <div
      style={getStyle()}
      className="playersRosterAgentControlCenter-contextMenu"
      onClick={onClose}
    >
      <div
        className="playersRosterAgentControlCenter-contextMenuContent"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="playersRosterAgentControlCenter-contextMenuHeader">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search NBA teams..."
            className="playersRosterAgentControlCenter-contextSearchInput"
            autoFocus
          />
        </div>
        <div className="playersRosterAgentControlCenter-contextMenuList">
          {filteredTeams.length > 0 ? (
            filteredTeams.map((team) => (
              <div
                key={team}
                className="playersRosterAgentControlCenter-contextMenuItem"
                onClick={() => onSelect(team)}
              >
                {team}
              </div>
            ))
          ) : (
            <div className="playersRosterAgentControlCenter-contextMenuItem playersRosterAgentControlCenter-noResults">
              No teams found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
