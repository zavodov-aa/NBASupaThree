import React from "react";
import "./headerRockets.css";
// import logo from "../../../../img/rocketsLogo.png";
import logo from "../../../../img/LogoLeague4kFinal.png";
import HamburgerMenu from "./HamburgerMenuRockets";

interface HeaderRocketsProps {
  onScrollToRoster: () => void;
  onScrollToTrades: () => void;
  onScrollToDeadCap: () => void;
  // onScrollToGLeague: () => void;
}

const HeaderRockets: React.FC<HeaderRocketsProps> = ({
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
    <div className="headerRockets">
      <a href="/" style={{ display: "contents" }}>
        <img className="headerLogoRockets" src={logo} alt="" />
      </a>
      <div>
        <nav className="headerNavRockets">
          <a
            href="#roster"
            className="headerNavLinkRockets"
            onClick={(e) => handleLinkClick(e, onScrollToRoster)}
          >
            Roster
          </a>

          <a
            href="#trades"
            className="headerNavLinkRockets"
            onClick={(e) => handleLinkClick(e, onScrollToTrades)}
          >
            Trades
          </a>
          <a
            href="#dead-cap"
            className="headerNavLinkRockets"
            onClick={(e) => handleLinkClick(e, onScrollToDeadCap)}
          >
            Dead Cap
          </a>
          {/* <a
            href="#g-league"
            className="headerNavLinkRockets"
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

export default HeaderRockets;
