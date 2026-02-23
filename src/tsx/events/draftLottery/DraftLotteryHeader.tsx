import React, { useState } from "react";
import logo from "../../../img/LogoLeague4kFinal.png";
import "./draftLotteryHeader.css";

const DraftLotteryHeader: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <header className="draft-lottery-header">
      <a href="/" className="draft-lottery-logo-link">
        <img
          src={logo}
          alt="Draft Lottery Logo"
          className="draft-lottery-logo"
        />
      </a>
      <h1 className="draft-lottery-title">Draft Lottery</h1>
      <button
        className="draft-lottery-hamburger"
        onClick={toggleMenu}
        aria-label="Menu"
      >
        ☰
      </button>
      <div
        className={`draft-lottery-overlay ${menuOpen ? "open" : ""}`}
        onClick={toggleMenu}
      ></div>
      <nav className={`draft-lottery-mobile-menu ${menuOpen ? "open" : ""}`}>
        <a href="/" onClick={toggleMenu}>
          Home
        </a>
        <a href="/about" onClick={toggleMenu}>
          About
        </a>
        <a href="/contact" onClick={toggleMenu}>
          Contact
        </a>
      </nav>
    </header>
  );
};

export default DraftLotteryHeader;
