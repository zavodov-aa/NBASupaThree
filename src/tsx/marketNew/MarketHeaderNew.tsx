import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../img/LogoLeague4kFinal.png";
import HamburgerMenu from "../team_new/HEADER/HamburgerMenu";
import "./marketHeaderNew.css";

const MarketHeaderNew = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="market-header">
      <Link to="/" className="market-header__logo-link">
        <img src={logo} alt="Logo" className="market-header__logo" />
      </Link>

      <h1 className="market-header__title">Маркет лиги</h1>

      <button
        className="market-header__burger"
        onClick={() => setIsMenuOpen(true)}
        aria-label="Открыть меню"
        aria-expanded={isMenuOpen}
      >
        ☰
      </button>

      <HamburgerMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </header>
  );
};

export default MarketHeaderNew;
