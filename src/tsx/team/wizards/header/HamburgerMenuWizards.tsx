import React, { useState } from "react";
import "./hamburgerMenuWizards.css";

const HamburgerMenuWizards: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button
        className={`hamburgerButtonWizards ${isOpen ? "active" : ""}`}
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Полный экран */}
      <div className={`fullscreenMenuWizards ${isOpen ? "open" : ""}`}>
        <nav className="menuContentWizards">
          <h1 className="menuContentHWizards">
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

export default HamburgerMenuWizards;
