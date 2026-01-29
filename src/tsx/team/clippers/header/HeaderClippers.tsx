import React from "react";
import "./headerClippers.css";
// import logo from "../../../../img/clippersLogo.png";
import logo from "../../../../img/LogoLeague4kFinal.png";
import HamburgerMenu from "./HamburgerMenuClippers";

interface HeaderClippersProps {
  onScrollToRoster: () => void;
  onScrollToTrades: () => void;
  onScrollToDeadCap: () => void;
  // onScrollToGLeague: () => void;
}

const HeaderClippers: React.FC<HeaderClippersProps> = ({
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
    <div className="headerClippers">
      <a href="/" style={{ display: "contents" }}>
        <img className="headerLogoClippers" src={logo} alt="" />
      </a>
      <div>
        <nav className="headerNavClippers">
          <a
            href="#roster"
            className="headerNavLinkClippers"
            onClick={(e) => handleLinkClick(e, onScrollToRoster)}
          >
            Roster
          </a>

          <a
            href="#trades"
            className="headerNavLinkClippers"
            onClick={(e) => handleLinkClick(e, onScrollToTrades)}
          >
            Trades
          </a>
          <a
            href="#dead-cap"
            className="headerNavLinkClippers"
            onClick={(e) => handleLinkClick(e, onScrollToDeadCap)}
          >
            Dead Cap
          </a>
          {/* <a
            href="#g-league"
            className="headerNavLinkClippers"
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

export default HeaderClippers;
