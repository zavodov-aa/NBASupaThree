import React from "react";

interface DesktopHeaderProps {
  onAddClick: () => void;
}

export const DesktopHeader: React.FC<DesktopHeaderProps> = ({ onAddClick }) => {
  return (
    <>
      <div className="playersRosterAgentControlCenter-header">
        <h1 className="playersRosterAgentControlCenter-title">
          PLAYER MANAGEMENT CONSOLE
        </h1>
      </div>
      <div className="playersRosterAgentControlCenter-actionButtons">
        <button
          onClick={onAddClick}
          className="playersRosterAgentControlCenter-button playersRosterAgentControlCenter-successButton"
        >
          + ADD NEW PLAYER
        </button>
      </div>
    </>
  );
};
