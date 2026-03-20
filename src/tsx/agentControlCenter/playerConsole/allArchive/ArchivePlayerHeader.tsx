import React from "react";
import logo from "../../../img/LogoLeague4kFinal.png";
import "../playersRosterAgentControlCenter.css";

interface HeaderProps {
  isMobile: boolean;
  showColumnSelector: boolean;
  setShowColumnSelector: (value: boolean) => void;
  filteredPlayersCount: number;
  visibleColumnsCount: number;
  archiveInitialized: boolean;
}

const PlayersRosterHeaderArchive: React.FC<HeaderProps> = ({
  isMobile,
  showColumnSelector,
  setShowColumnSelector,
  filteredPlayersCount,
  visibleColumnsCount,
  archiveInitialized,
}) => {
  if (isMobile) {
    return (
      <div className="playersRosterAgentControlCenter-mobile-header">
        <div className="playersRosterAgentControlCenter-mobile-header-top">
          <a
            href="/"
            className="playersRosterAgentControlCenter-mobile-logo-link"
          >
            <img
              className="playersRosterAgentControlCenter-mobile-logo"
              src={logo}
              alt="League Logo"
            />
          </a>
          <button
            className="playersRosterAgentControlCenter-mobile-menu-button"
            onClick={() => setShowColumnSelector(!showColumnSelector)}
          >
            {showColumnSelector ? "✕" : "☰"}
          </button>
        </div>
        <h1 className="playersRosterAgentControlCenter-mobile-title">
          PLAYERS
        </h1>
        <div className="playersRosterAgentControlCenter-mobile-status">
          {filteredPlayersCount} PLAYERS • {visibleColumnsCount} COLUMNS
          {!archiveInitialized && " • ⚠️ NO ARCHIVE"}
        </div>
        <div className="playersRosterAgentControlCenter-mobile-nav">
          <a
            className="playersRosterAgentControlCenter-mobile-nav-link"
            href="/headInfoAgentControlCenter"
          >
            TEAMS
          </a>
          <a
            className="playersRosterAgentControlCenter-mobile-nav-link"
            href="/deadCapRosterAgentControl"
          >
            DEAD CAP
          </a>
          <a
            className="playersRosterAgentControlCenter-mobile-nav-link"
            href="/penalties"
          >
            PENALTIES
          </a>
          <a
            className="playersRosterAgentControlCenter-mobile-nav-link"
            href="/logs"
          >
            LOGS CONSOLE
          </a>
        </div>
      </div>
    );
  }

  // Десктопная версия
  return (
    <div className="playersRosterAgentControlCenter-header">
      <a href="/">
        <img className="logo" src={logo} alt="League Logo" />
      </a>
      <a className="HeadInfoAgent-A-Href" href="/headInfoAgentControlCenter">
        <h3>TEAM MANAGEMENT CONSOLE</h3>
      </a>
      <h1 className="playersRosterAgentControlCenter-title">
        PLAYER MANAGEMENT CONSOLE
      </h1>
      <a className="HeadInfoAgent-A-Href" href="/deadCapRosterAgentControl">
        <h3>DEAD CAP MANAGEMENT CONSOLE</h3>
      </a>
      <a className="HeadInfoAgent-A-Href" href="/penalties">
        PENALTIES CONSOLE
      </a>
      <a className="HeadInfoAgent-A-Href" href="/logs">
        LOGS CONSOLE
      </a>
      <div className="playersRosterAgentControlCenter-statusBadge">
        {filteredPlayersCount} PLAYERS • {visibleColumnsCount} COLUMNS
        {!archiveInitialized && " • ⚠️ ARCHIVE NOT CONFIGURED"}
      </div>
    </div>
  );
};

export default PlayersRosterHeaderArchive;
