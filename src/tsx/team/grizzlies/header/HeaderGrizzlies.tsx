import React from "react";
import "./headerGrizzlies.css";
import logo from "../../../../img/LogoLeague4kFinal.png";
import HamburgerMenu from "./HamburgerMenuGrizzlies";

interface HeaderGrizzliesProps {
  onScrollToRoster: () => void;
  onScrollToTrades: () => void;
  onScrollToDeadCap: () => void;
  // onScrollToGLeague: () => void;
}

const HeaderGrizzlies: React.FC<HeaderGrizzliesProps> = ({
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
    <div className="headerGrizzlies">
      <a href="/" style={{ display: "contents" }}>
        <img className="headerLogoGrizzlies" src={logo} alt="" />
      </a>
      <div>
        <nav className="headerNavGrizzlies">
          <a
            href="#roster"
            className="headerNavLinkGrizzlies"
            onClick={(e) => handleLinkClick(e, onScrollToRoster)}
          >
            Roster
          </a>

          <a
            href="#trades"
            className="headerNavLinkGrizzlies"
            onClick={(e) => handleLinkClick(e, onScrollToTrades)}
          >
            Trades
          </a>
          <a
            href="#dead-cap"
            className="headerNavLinkGrizzlies"
            onClick={(e) => handleLinkClick(e, onScrollToDeadCap)}
          >
            Dead Cap
          </a>
          {/* <a
            href="#g-league"
            className="headerNavLinkGrizzlies"
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

export default HeaderGrizzlies;
