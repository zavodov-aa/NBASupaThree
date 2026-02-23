import React, { useState, useEffect, useMemo } from "react";
import { supabase } from "../../../../../Supabase";
import "./rfaUserFirstRoundSpaceViewOffers.css";

interface Offer {
  id: number;
  team: string;
  player: string;
  salary: number;
  type_contract: string;
  period_contract: number;
  option_contract: string;
  bonus: number;
  condition: string;
  result: string;
  created_at: string;
}

const RFAUserFirstRoundSpaceViewOffers = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [teams, setTeams] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isPasswordChecking, setIsPasswordChecking] = useState(false);
  const [authorizedTeam, setAuthorizedTeam] = useState<string | null>(null);

  // Состояния для поиска
  const [teamSearch, setTeamSearch] = useState("");

  // Состояния для предложений
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loadingOffers, setLoadingOffers] = useState(false);
  const [offersError, setOffersError] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState("");

  // Фильтрация команд по поисковому запросу
  const filteredTeams = useMemo(() => {
    if (!teamSearch.trim()) return teams;

    const searchTerm = teamSearch.toLowerCase().trim();
    return teams.filter((team) => team.toLowerCase().includes(searchTerm));
  }, [teams, teamSearch]);

  // Загрузка команд из Supabase
  const fetchTeams = async () => {
    try {
      const { data, error } = await supabase.from("Pass_team").select("team");

      if (error) {
        throw error;
      }

      if (data) {
        const teamNames = data
          .map((item) => item.team)
          .filter(
            (team): team is string => team !== null && team !== undefined,
          );
        setTeams(teamNames);
      }
    } catch (error) {
      console.error("Ошибка загрузки команд:", error);
    } finally {
      setLoading(false);
    }
  };

  // Загрузка предложений для авторизованной команды
  const fetchOffers = async (teamName: string) => {
    if (!teamName) return;

    setLoadingOffers(true);
    setOffersError("");

    try {
      const { data, error } = await supabase
        .from("Market_RFA_first_round")
        .select("*")
        .eq("team", teamName)
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        setOffers(data as Offer[]);
      }
    } catch (error) {
      console.error("Ошибка загрузки предложений:", error);
      setOffersError("Не удалось загрузить предложения");
    } finally {
      setLoadingOffers(false);
    }
  };

  // Удаление предложения
  const handleDeleteOffer = async (offerId: number) => {
    if (!authorizedTeam) {
      setDeleteError("Нет доступа для удаления");
      return;
    }

    if (!window.confirm("Вы уверены, что хотите удалить это предложение?")) {
      return;
    }

    setDeletingId(offerId);
    setDeleteError("");

    try {
      const { error } = await supabase
        .from("Market_RFA_first_round")
        .delete()
        .eq("id", offerId)
        .eq("team", authorizedTeam); // Дополнительная проверка на принадлежность команде

      if (error) {
        throw error;
      }

      // Обновляем локальное состояние
      setOffers(offers.filter((offer) => offer.id !== offerId));

      console.log(`Предложение ${offerId} успешно удалено`);
    } catch (error) {
      console.error("Ошибка удаления предложения:", error);
      setDeleteError("Не удалось удалить предложение");
    } finally {
      setDeletingId(null);
    }
  };

  // Загрузка команд при монтировании
  useEffect(() => {
    fetchTeams();
  }, []);

  // Загрузка предложений при изменении авторизованной команды
  useEffect(() => {
    if (authorizedTeam) {
      fetchOffers(authorizedTeam);
    } else {
      setOffers([]); // Очищаем предложения при выходе
    }
  }, [authorizedTeam]);

  const handleButtonClick = () => {
    if (authorizedTeam) {
      // Если уже авторизованы, показываем информацию об авторизованной команде
      alert(
        `Вы авторизованы как: ${authorizedTeam}\nКоличество предложений: ${offers.length}`,
      );
      return;
    }

    setIsMenuOpen((prev) => !prev);
    setShowPasswordForm(false);
    setPasswordError("");
    setTeamSearch(""); // Сбрасываем поиск при открытии меню
  };

  const handleTeamSelect = (team: string) => {
    setSelectedTeam(team);
    setIsMenuOpen(false);
    setShowPasswordForm(true);
    setPassword("");
    setPasswordError("");
    setTeamSearch(""); // Сбрасываем поиск при выборе команды
  };

  const handlePasswordSubmit = async () => {
    if (!selectedTeam || !password) {
      setPasswordError("Введите пароль");
      return;
    }

    setIsPasswordChecking(true);
    setPasswordError("");

    try {
      const { data, error } = await supabase
        .from("Pass_team")
        .select("team, pass")
        .eq("team", selectedTeam)
        .eq("pass", password)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          setPasswordError("Неправильный пароль");
        } else {
          setPasswordError("Ошибка проверки пароля");
          console.error("Ошибка проверки пароля:", error);
        }
        return;
      }

      if (data) {
        setAuthorizedTeam(selectedTeam);
        setShowPasswordForm(false);
        setSelectedTeam(null);
        setPassword("");
        console.log(`Успешная авторизация для команды: ${selectedTeam}`);
      }
    } catch (error) {
      console.error("Ошибка проверки пароля:", error);
      setPasswordError("Ошибка проверки пароля");
    } finally {
      setIsPasswordChecking(false);
    }
  };

  const handlePasswordCancel = () => {
    setShowPasswordForm(false);
    setSelectedTeam(null);
    setPassword("");
    setPasswordError("");
    setTeamSearch("");
  };

  const handleLogout = () => {
    setAuthorizedTeam(null);
    setSelectedTeam(null);
    setPassword("");
    setPasswordError("");
    setIsMenuOpen(false);
    setTeamSearch("");
  };

  // Закрытие меню при клике вне области
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        !target.closest(".view-offers-container") &&
        !target.closest(".password-form-container") &&
        !target.closest(".offers-container")
      ) {
        setIsMenuOpen(false);
        setTeamSearch("");
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="view-offers-container">
      {/* Кнопка для открытия меню */}
      <button className="view-offers-button" onClick={handleButtonClick}>
        {authorizedTeam
          ? `Авторизован: ${authorizedTeam}`
          : "Просмотр отправленных предложений"}
      </button>

      {/* Кнопка выхода, если авторизован */}
      {authorizedTeam && (
        <button
          className="logout-button"
          onClick={handleLogout}
          style={{ marginLeft: "10px", padding: "5px 10px", fontSize: "12px" }}
        >
          Выйти
        </button>
      )}

      {/* Контекстное меню */}
      {isMenuOpen && !authorizedTeam && (
        <div className="context-menu">
          <div className="menu-header">
            <div className="menu-header-title">Выберите команду</div>
            {/* Поле поиска */}
            <div className="team-search-container">
              <input
                type="text"
                value={teamSearch}
                onChange={(e) => setTeamSearch(e.target.value)}
                placeholder="Поиск команды..."
                className="team-search-input"
                onClick={(e) => e.stopPropagation()} // Предотвращаем закрытие при клике на поле ввода
              />
              {teamSearch && (
                <button
                  className="clear-search-button"
                  onClick={() => setTeamSearch("")}
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Список команд с результатами поиска */}
          <div className="teams-list">
            {loading ? (
              <div className="menu-item">Загрузка команд...</div>
            ) : filteredTeams.length > 0 ? (
              filteredTeams.map((team, index) => (
                <div
                  key={index}
                  className="menu-item"
                  onClick={() => handleTeamSelect(team)}
                >
                  {team}
                </div>
              ))
            ) : (
              <div className="menu-item">
                {teamSearch ? "Команда не найдена" : "Нет доступных команд"}
              </div>
            )}
          </div>

          {/* Информация о количестве найденных команд */}
          {teamSearch && filteredTeams.length > 0 && (
            <div className="search-results-info">
              Найдено команд: {filteredTeams.length} из {teams.length}
            </div>
          )}
        </div>
      )}

      {/* Форма ввода пароля */}
      {showPasswordForm && selectedTeam && (
        <div className="password-form-overlay">
          <div className="password-form-container">
            <div className="password-form">
              <h3>Введите пароль для команды:</h3>
              <p className="selected-team">{selectedTeam}</p>

              <div className="password-input-group">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Введите пароль"
                  className="password-input"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handlePasswordSubmit();
                    }
                  }}
                />

                {passwordError && (
                  <div className="password-error">{passwordError}</div>
                )}

                <div className="password-buttons">
                  <button
                    className="password-submit-button"
                    onClick={handlePasswordSubmit}
                    disabled={isPasswordChecking}
                  >
                    {isPasswordChecking ? "Проверка..." : "Подтвердить"}
                  </button>
                  <button
                    className="password-cancel-button"
                    onClick={handlePasswordCancel}
                  >
                    Отмена
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Отображение предложений авторизованной команды */}
      {authorizedTeam && (
        <div className="offers-container">
          <h3>Предложения команды {authorizedTeam}:</h3>

          {deleteError && (
            <div
              className="delete-error"
              style={{ color: "red", marginBottom: "10px" }}
            >
              {deleteError}
            </div>
          )}

          {loadingOffers ? (
            <div className="loading-offers">Загрузка предложений...</div>
          ) : offersError ? (
            <div className="offers-error">{offersError}</div>
          ) : offers.length === 0 ? (
            <div className="no-offers">Нет отправленных предложений</div>
          ) : (
            <div className="offers-list">
              <div className="offers-count">
                Всего предложений: {offers.length}
              </div>
              <table className="offers-table">
                <thead>
                  <tr>
                    <th>Игрок</th>
                    <th>Зарплата</th>
                    <th>Тип контракта</th>
                    <th>Период</th>
                    <th>Опция</th>
                    <th>Бонус</th>
                    <th>Условие</th>
                    <th>Результат</th>
                    <th>Дата создания</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {offers.map((offer) => (
                    <tr key={offer.id}>
                      <td>{offer.player}</td>
                      <td>${offer.salary?.toLocaleString() || 0}</td>
                      <td>{offer.type_contract || "-"}</td>
                      <td>{offer.period_contract || "-"}</td>
                      <td>{offer.option_contract || "-"}</td>
                      <td>${offer.bonus?.toLocaleString() || 0}</td>
                      <td>{offer.condition || "-"}</td>
                      <td>{offer.result || "-"}</td>
                      <td>{new Date(offer.created_at).toLocaleDateString()}</td>
                      <td>
                        <button
                          className="delete-offer-button"
                          onClick={() => handleDeleteOffer(offer.id)}
                          disabled={deletingId === offer.id}
                          style={{
                            padding: "5px 10px",
                            backgroundColor: "#ff4444",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor:
                              deletingId === offer.id
                                ? "not-allowed"
                                : "pointer",
                            opacity: deletingId === offer.id ? 0.6 : 1,
                          }}
                        >
                          {deletingId === offer.id ? "Удаление..." : "Удалить"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RFAUserFirstRoundSpaceViewOffers;
