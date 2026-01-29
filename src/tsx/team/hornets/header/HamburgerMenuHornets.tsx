import React, { useState } from "react";
import "./hamburgerMenuHornets.css";

const HamburgerMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button
        className={`hamburgerButtonHornets ${isOpen ? "active" : ""}`}
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Полный экран */}
      <div className={`fullscreenMenuHornets ${isOpen ? "open" : ""}`}>
        <nav className="menuContentHornets">
          <h1 className="menuContentHHornets">
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
