import React, { useState } from "react";
import "./hamburgerMenuGrizzlies.css";

const HamburgerMenuGrizzlies: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button
        className={`hamburgerButtonGrizzlies ${isOpen ? "active" : ""}`}
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Полный экран */}
      <div className={`fullscreenMenuGrizzlies ${isOpen ? "open" : ""}`}>
        <nav className="menuContentGrizzlies">
          <h1 className="menuContentHGrizzlies">
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

export default HamburgerMenuGrizzlies;
