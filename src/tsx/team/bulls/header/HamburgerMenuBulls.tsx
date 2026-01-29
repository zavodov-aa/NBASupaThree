import React, { useState } from "react";
import "./hamburgerMenuBulls.css";

const HamburgerMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button
        className={`hamburgerButtonBulls ${isOpen ? "active" : ""}`}
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Полный экран */}
      <div className={`fullscreenMenuBulls ${isOpen ? "open" : ""}`}>
        <nav className="menuContentBulls">
          <h1 className="menuContentHBulls">NBA Fansy League Flshng lights</h1>
          <a href="/" onClick={toggleMenu}>
            Главная
          </a>
        </nav>
      </div>
    </>
  );
};

export default HamburgerMenu;
