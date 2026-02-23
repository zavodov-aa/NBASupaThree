import React, { useState, useEffect, useRef } from "react";
import "./playerOptionHeaderUser.css";
import logo from "../../../../img/LogoLeague4kFinal.png";

interface MenuItem {
  label: string;
  href: string;
}

interface PlayerOptionHeaderProps {
  menuItems?: MenuItem[];
}

const defaultMenuItems: MenuItem[] = [
  { label: "Главная", href: "/" },
  { label: "Опции игроков", href: "/playerOptionUserMain" },
  { label: "Опции команд", href: "/teamOptionUserMain" },
  { label: "RFA 1R", href: "/rfaUserFirstRoundMain" },
  { label: "RFA 2R", href: "/rfaUserSecondMain" },
  { label: "RFA Результаты", href: "/rfaUserResultMain" },
  { label: "UFA 1R 1 Этап", href: "/ufaufrFirstStageMain" },
  { label: "UFA 1R 2 Этап", href: "/ufaufrSecondStageMain" },
  { label: "Результаты 1 раунда", href: "/ufaUserFirstRoundResultMain" },
  { label: "UFA 2R 3 Этап", href: "/ufaUSRFirstStageMain" },
  { label: "UFA 2R 4 Этап", href: "/ufaUSRSecondStageMain" },
  { label: "Результаты 2 раунда", href: "/ufaUserSecondRoundResultMain" },
  { label: "UFA 3R 5 Этап", href: "/ufaUTRFirstStageMain" },
  { label: "UFA 3R 6 Этап ", href: "/ufaUTRSecondStageMain" },
  { label: "Результаты 3 раунда", href: "/ufaUserThirdRoundResultMain" },
];

const PlayerOptionHeaderUser: React.FC<PlayerOptionHeaderProps> = ({
  menuItems = defaultMenuItems,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuItemClick = (href: string) => {
    window.location.href = href;
    setIsMenuOpen(false);
  };

  // Закрытие меню при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Проверяем клик вне меню И вне гамбургера
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      // Добавляем класс для блокировки прокрутки
      document.body.classList.add("poh-menu-open");
    } else {
      document.body.classList.remove("poh-menu-open");
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.classList.remove("poh-menu-open");
    };
  }, [isMenuOpen]);

  return (
    <>
      <header className="poh-player-option-header">
        <a href="/" className="poh-header-link">
          <img src={logo} alt="League Logo" className="poh-header-logo" />
        </a>
        <h2 className="poh-header-title">Рынок</h2>
        <div
          className={`poh-hamburger-menu ${isMenuOpen ? "poh-active" : ""}`}
          onClick={toggleMenu}
          ref={hamburgerRef}
          role="button"
          aria-label={isMenuOpen ? "Закрыть меню" : "Открыть меню"}
          aria-expanded={isMenuOpen}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              toggleMenu();
            }
          }}
        >
          <div className="poh-hamburger-line"></div>
          <div className="poh-hamburger-line"></div>
          <div className="poh-hamburger-line"></div>
        </div>
      </header>

      {/* Меню */}
      <div
        className={`poh-mobile-menu-overlay ${isMenuOpen ? "poh-open" : ""}`}
        ref={menuRef}
      >
        <div className="poh-mobile-menu">
          <div className="poh-mobile-menu-header">
            <h3 className="poh-mobile-menu-title">Меню</h3>
          </div>

          <nav className="poh-mobile-menu-nav">
            <ul className="poh-mobile-menu-list">
              {menuItems.map((item, index) => (
                <li key={index} className="poh-mobile-menu-item">
                  <a
                    href={item.href}
                    className="poh-mobile-menu-link"
                    onClick={(e) => {
                      e.preventDefault();
                      handleMenuItemClick(item.href);
                    }}
                    tabIndex={isMenuOpen ? 0 : -1}
                  >
                    <span className="poh-menu-item-text">{item.label}</span>
                    <span className="poh-menu-item-arrow">›</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

export default PlayerOptionHeaderUser;
