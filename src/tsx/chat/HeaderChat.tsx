import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../img/LogoLeague4kFinal.png";
import HamburgerMenu from "../team_new/HEADER/HamburgerMenu";
import "./headerChat.css";

const HeaderChat = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="header-chat">
      <Link to="/" className="header-chat__logo-link">
        <img src={logo} alt="Logo" className="header-chat__logo" />
      </Link>

      <h1 className="header-chat__title">Чат лиги</h1>

      <button
        className="header-chat__burger"
        onClick={() => setIsMenuOpen(true)}
        aria-label="Открыть меню"
        aria-expanded={isMenuOpen}
      >
        ☰
      </button>

      <HamburgerMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </header>
  );
};

export default HeaderChat;
