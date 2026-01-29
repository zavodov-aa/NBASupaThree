import React, { useState } from "react";
import "./hamburgerMenuSevsix.css";

const HamburgerMenuSevsix: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button
        className={`hamburgerButtonSevsix ${isOpen ? "active" : ""}`}
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div className={`fullscreenMenuSevsix ${isOpen ? "open" : ""}`}>
        <nav className="menuContentSevsix">
          <h1 className="menuContentHSevsix">NBA Fansy League Flshng lights</h1>
          <a href="/" onClick={toggleMenu}>
            Главная
          </a>
        </nav>
      </div>
    </>
  );
};

export default HamburgerMenuSevsix;
