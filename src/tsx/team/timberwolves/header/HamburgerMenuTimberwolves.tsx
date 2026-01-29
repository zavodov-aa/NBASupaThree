import React, { useState } from "react";
import "./hamburgerMenuTimberwolves.css";

const HamburgerMenuTimberwolves: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button
        className={`hamburgerButtonTimberwolves ${isOpen ? "active" : ""}`}
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Полный экран */}
      <div className={`fullscreenMenuTimberwolves ${isOpen ? "open" : ""}`}>
        <nav className="menuContentTimberwolves">
          <h1 className="menuContentHTimberwolves">NBA Fansy League Flshng lights</h1>
          <a href="/" onClick={toggleMenu}>
            Главная
          </a>
        </nav>
      </div>
    </>
  );
};

export default HamburgerMenuTimberwolves;