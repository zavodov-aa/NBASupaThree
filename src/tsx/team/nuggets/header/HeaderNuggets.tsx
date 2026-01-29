import React from "react";
import "./headerNuggets.css";
import logo from "../../../../img/LogoLeague4kFinal.png";
import HamburgerMenu from "./HamburgerMenuNuggets";

interface HeaderNuggetsProps {
  onScrollToRoster: () => void;
  onScrollToTrades: () => void;
  onScrollToDeadCap: () => void;
  // onScrollToGLeague: () => void;
}

const HeaderNuggets: React.FC<HeaderNuggetsProps> = ({
  onScrollToRoster,
  onScrollToTrades,
  onScrollToDeadCap,
  // onScrollToGLeague,
}) => {
  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    scrollFunction: () => void
  ) => {
    e.preventDefault();
    scrollFunction();
  };

  return (
    <div className="headerNuggets">
      <a href="/" style={{ display: "contents" }}>
        <img className="headerLogoNuggets" src={logo} alt="" />
      </a>
      <div>
        <nav className="headerNavNuggets">
          <a
            href="#roster"
            className="headerNavLinkNuggets"
            onClick={(e) => handleLinkClick(e, onScrollToRoster)}
          >
            Roster
          </a>

          <a
            href="#trades"
            className="headerNavLinkNuggets"
            onClick={(e) => handleLinkClick(e, onScrollToTrades)}
          >
            Trades
          </a>
          <a
            href="#dead-cap"
            className="headerNavLinkNuggets"
            onClick={(e) => handleLinkClick(e, onScrollToDeadCap)}
          >
            Dead Cap
          </a>
          {/* <a
            href="#g-league"
            className="headerNavLinkNuggets"
            onClick={(e) => handleLinkClick(e, onScrollToGLeague)}
          >
            G-League
          </a> */}
        </nav>
      </div>
      <HamburgerMenu />
    </div>
  );
};

export default HeaderNuggets;
