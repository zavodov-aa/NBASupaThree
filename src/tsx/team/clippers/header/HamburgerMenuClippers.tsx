import React, { useState } from "react";
import "./hamburgerMenuClippers.css";

const HamburgerMenuClippers: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button
        className={`hamburgerButtonClippers ${isOpen ? "active" : ""}`}
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Полный экран */}
      <div className={`fullscreenMenuClippers ${isOpen ? "open" : ""}`}>
        <nav className="menuContentClippers">
          <h1 className="menuContentHClippers">
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

export default HamburgerMenuClippers;
