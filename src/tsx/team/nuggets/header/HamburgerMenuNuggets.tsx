import React, { useState } from "react";
import "./hamburgerMenuNuggets.css";

const HamburgerMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button
        className={`hamburgerButtonNuggets ${isOpen ? "active" : ""}`}
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Полный экран */}
      <div className={`fullscreenMenuNuggets ${isOpen ? "open" : ""}`}>
        <nav className="menuContentNuggets">
          <h1 className="menuContentHNuggets">
            NBA Fansy League Flshng lights
          </h1>
          <a href="/" onClick={toggleMenu}>
            Главная
          </a>
        </nav>
      </div>
    </>
  );
};

export default HamburgerMenu;
