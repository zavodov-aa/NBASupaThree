import React, { useState } from "react";
import "./hamburgerMenuHeat.css";

const HamburgerMenuHeat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button
        className={`hamburgerButtonHeat ${isOpen ? "active" : ""}`}
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Полный экран */}
      <div className={`fullscreenMenuHeat ${isOpen ? "open" : ""}`}>
        <nav className="menuContentHeat">
          <h1 className="menuContentHHeat">NBA Fansy League Flshng lights</h1>
          <a href="/" onClick={toggleMenu}>
            Главная
          </a>
        </nav>
      </div>
    </>
  );
};

export default HamburgerMenuHeat;
