// import React from "react";
// import logo from "../../../img/LogoLeague4kFinal.png";
// import { useTeam } from "../HEADER/HeaderTeamContext";
// import "./headerAll.css";

// const HeaderAll = () => {
//   const { colors } = useTeam();

//   const getLogoFilter = (type: "white" | "black" | "original"): string => {
//     switch (type) {
//       case "white":
//         return "brightness(0) invert(1)";
//       case "black":
//         return "brightness(0)";
//       default:
//         return "none";
//     }
//   };

//   return (
//     <header className="ha-header" style={{ backgroundColor: colors.bg }}>
//       <img
//         src={logo}
//         alt="League Logo"
//         className="ha-logo"
//         style={{ filter: getLogoFilter(colors.logo) }}
//       />
//       <div className="ha-hamburger" style={{ color: colors.text }}>
//         ☰
//       </div>
//     </header>
//   );
// };

// export default HeaderAll;

import React, { useState } from "react";
import logo from "../../../img/LogoLeague4kFinal.png";
import { useTeam } from "../HEADER/HeaderTeamContext";
import HamburgerMenu from "./HamburgerMenu"; // импортируем новый компонент
import "./headerAll.css";

const HeaderAll = () => {
  const { colors } = useTeam();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const getLogoFilter = (type: "white" | "black" | "original"): string => {
    switch (type) {
      case "white":
        return "brightness(0) invert(1)";
      case "black":
        return "brightness(0)";
      default:
        return "none";
    }
  };

  return (
    <>
      <header className="ha-header" style={{ backgroundColor: colors.bg }}>
        <a href="/">
          <img
            src={logo}
            alt="League Logo"
            className="ha-logo"
            style={{ filter: getLogoFilter(colors.logo) }}
          />
        </a>
        <button
          className="ha-hamburger"
          style={{ color: colors.text }}
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Закрыть меню" : "Открыть меню"}
        >
          {isMenuOpen ? "✕" : "☰"}
        </button>
      </header>

      <HamburgerMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
};

export default HeaderAll;
