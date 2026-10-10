import React from "react";
import logo from "../../../img/LogoLeague4kFinal.png";
import "./logsHeader.css";

const LogsHeader = () => {
  return (
    <header className="logs-header">
      <div className="logs-header__container">
        <a href="/">
          <img src={logo} alt="League Logo" className="logs-header__logo" />
        </a>
        <nav className="logs-header__nav">
          <a href="/headInfoAgentControlCenter" className="logs-header__link">
            TEAM MANAGEMENT CONSOLE
          </a>
          <a
            href="/playersRosterAgentControlCenter"
            className="logs-header__link"
          >
            PLAYER MANAGEMENT CONSOLE
          </a>
          <a href="/deadCapRosterAgentControl" className="logs-header__link">
            DEAD CAP MANAGEMENT CONSOLE
          </a>
          <a href="/penalties" className="logs-header__link">
            PENALTIES
          </a>
          <a
            href="/logs"
            className="logs-header__link logs-header__link--active"
          >
            Logs
          </a>
        </nav>
      </div>
    </header>
  );
};

export default LogsHeader;
