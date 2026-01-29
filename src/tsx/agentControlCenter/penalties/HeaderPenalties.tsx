import React from "react";
import "./headerPenalties.css";
import logo from "../../../img/LogoLeague4kFinal.png";

const HeaderPenalties = () => {
  return (
    <div>
      <header className="penalties-header">
        <div className="penalties-header__container">
          <a href="/">
            <img
              src={logo}
              alt="League Logo"
              className="penalties-header__logo"
            />
          </a>
          <nav className="penalties-header__nav">
            <a
              href="/headInfoAgentControlCenter"
              className="penalties-header__link"
            >
              TEAM MANAGEMENT CONSOLE
            </a>
            <a
              href="/playersRosterAgentControlCenter"
              className="penalties-header__link"
            >
              PLAYER MANAGEMENT CONSOLE
            </a>
            <a
              href="/deadCapRosterAgentControl"
              className="penalties-header__link"
            >
              DEAD CAP MANAGEMENT CONSOLE
            </a>
            <a
              href="/penalties"
              className="penalties-header__link penalties-header__link--active"
            >
              PENALTIES
            </a>
            <a href="/logs" className="penalties-header__link">
              LOGS
            </a>
          </nav>
        </div>
      </header>
    </div>
  );
};
export default HeaderPenalties;
