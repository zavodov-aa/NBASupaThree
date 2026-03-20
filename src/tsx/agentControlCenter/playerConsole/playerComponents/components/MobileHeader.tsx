import React from "react";

interface MobileHeaderProps {
  showColumnSelector: boolean;
  onToggleColumnSelector: () => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  showColumnSelector,
  onToggleColumnSelector,
}) => {
  return (
    <div className="playersRosterAgentControlCenter-mobile-header">
      <div className="playersRosterAgentControlCenter-mobile-header-top">
        <h1 className="playersRosterAgentControlCenter-mobile-title">
          PLAYERS
        </h1>
        <button
          className="playersRosterAgentControlCenter-mobile-menu-button"
          onClick={onToggleColumnSelector}
        >
          {showColumnSelector ? "✕" : "☰"}
        </button>
      </div>
    </div>
  );
};
