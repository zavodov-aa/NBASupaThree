import React, { useState } from "react";
import "./tradesAllHeader.css";
import logo from "../../../../img/LogoLeague4kFinal.png";

interface MenuItem {
  id: number;
  label: string;
  icon: string;
  href: string;
}

const TradesAllHeader: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems: MenuItem[] = [
    { id: 1, label: "Главная", icon: "🏠", href: "/" },
    // { id: 2, label: "Торги", icon: "📊", href: "/trades" },
    // { id: 3, label: "Профиль", icon: "👤", href: "/profile" },
    // { id: 4, label: "Настройки", icon: "⚙️", href: "/settings" },
    // { id: 5, label: "Помощь", icon: "❓", href: "/help" },
  ];

  return (
    <>
      <header className="tradesAllHeader">
        <div className="tradesAllHeader__content">
          <a href="/">
            <img src={logo} alt="Логотип" className="tradesAllHeader__logo" />
          </a>
          <h1 className="tradesAllHeader__title">Trades</h1>
          <button
            className={`tradesAllHeader__hamburger ${isMenuOpen ? "active" : ""}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Меню"
            aria-expanded={isMenuOpen}
            type="button"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          {isMenuOpen && (
            <div className="tradesAllHeader__dropdown">
              <div
                className="tradesAllHeader__backdrop"
                onClick={() => setIsMenuOpen(false)}
              ></div>
              <div className="tradesAllHeader__dropdown-content">
                <h3>Меню</h3>
                <ul>
                  {menuItems.map((item) => (
                    <li key={item.id}>
                      <a href={item.href} onClick={() => setIsMenuOpen(false)}>
                        <span>{item.icon}</span>
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
                <button onClick={() => setIsMenuOpen(false)} type="button">
                  Закрыть
                </button>
              </div>
            </div>
          )}
        </div>
      </header>
      <div className="tradesAllHeader__spacer"></div>
    </>
  );
};

export default TradesAllHeader;
