import React from "react";
import "./headerMagic.css";
// import logo from "../../../../img/magicLogo.png";
import logo from "../../../../img/LogoLeague4kFinal.png";
import HamburgerMenu from "./HamburgerMenuMagic";

interface HeaderMagicProps {
  onScrollToRoster: () => void;
  onScrollToTrades: () => void;
  onScrollToDeadCap: () => void;
  // onScrollToGLeague: () => void;
}

const HeaderMagic: React.FC<HeaderMagicProps> = ({
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
    <div className="headerMagic">
      <a href="/" style={{ display: "contents" }}>
        <img className="headerLogoMagic" src={logo} alt="" />
      </a>
      <div>
        <nav className="headerNavMagic">
          <a
            href="#roster"
            className="headerNavLinkMagic"
            onClick={(e) => handleLinkClick(e, onScrollToRoster)}
          >
            Roster
          </a>

          <a
            href="#trades"
            className="headerNavLinkMagic"
            onClick={(e) => handleLinkClick(e, onScrollToTrades)}
          >
            Trades
          </a>
          <a
            href="#dead-cap"
            className="headerNavLinkMagic"
            onClick={(e) => handleLinkClick(e, onScrollToDeadCap)}
          >
            Dead Cap
          </a>
          {/* <a
            href="#g-league"
            className="headerNavLinkMagic"
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

export default HeaderMagic;
