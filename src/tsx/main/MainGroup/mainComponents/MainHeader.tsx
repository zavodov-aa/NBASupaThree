// components/Header.tsx
import React from "react";
import logo from "../../../../img/LogoLeague4kFinal.png";
import quest from "../../../../img/quest4kf.png";
import Tabs from "./MainTabs";
import { TabType } from "../MainTypes";
import { useAuth } from "../../../authorization/AuthContext";
import { useAuthModal } from "../../../authorization/AuthModalContext";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  onFeedbackClick: () => void;
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const Header: React.FC<HeaderProps> = ({
  onFeedbackClick,
  activeTab,
  onTabChange,
}) => {
  const { user, logout } = useAuth();
  const { openAuthModal } = useAuthModal();
  const navigate = useNavigate();

  return (
    <div className="headerMain">
      <img className="logo" src={logo} alt="League Logo" />

      {/* <button type="button" onClick={() => navigate("/chat")}> */}
      <button type="button" onClick={() => navigate("/talk")}>
        Чат
      </button>

      <Tabs activeTab={activeTab} onTabChange={onTabChange} />

      <div className="quest-wrapper">
        <img
          className="quest"
          src={quest}
          alt="Quest Icon"
          onClick={onFeedbackClick}
          style={{ cursor: "pointer" }}
        />
        <span className="quest-tooltip">Обратная связь</span>
      </div>

      {/* Кнопка входа / выхода */}
      {user ? (
        <div className="auth-block">
          <span className="auth-user" title={user.team}>
            {user.team}
          </span>
          <button type="button" onClick={logout}>
            Выйти
          </button>
        </div>
      ) : (
        <button type="button" onClick={() => openAuthModal()}>
          Войти
        </button>
      )}
    </div>
  );
};

export default Header;
