import React, { useState } from "react";
import "./hamburgerMenuJazz.css";

const HamburgerMenuJazz: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button
        className={`hamburgerButtonJazz ${isOpen ? "active" : ""}`}
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Полный экран */}
      <div className={`fullscreenMenuJazz ${isOpen ? "open" : ""}`}>
        <nav className="menuContentJazz">
          <h1 className="menuContentHJazz">NBA Fansy League Flshng lights</h1>
          <a href="/" onClick={toggleMenu}>
            Главная
          </a>
        </nav>
      </div>
    </>
  );
};

export default HamburgerMenuJazz;
