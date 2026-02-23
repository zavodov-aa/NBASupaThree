import React, { useState, useEffect, useMemo } from "react";
import { supabase } from "../../../../../Supabase";
import "./rfaUserFirstRoundSpaceViewOffers.css";

interface Offer {
  id: number;
  team: string;
  player: string;
  salary_one: number;
  salary_two: number;
  salary_three: number;
  salary_four: number;
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
  const [teamSearch, setTeamSearch] = useState("");
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loadingOffers, setLoadingOffers] = useState(false);
  const [offersError, setOffersError] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState("");

  const filteredTeams = useMemo(() => {
    if (!teamSearch.trim()) return teams;
    const searchTerm = teamSearch.toLowerCase().trim();
    return teams.filter((team) => team.toLowerCase().includes(searchTerm));
  }, [teams, teamSearch]);

  const fetchTeams = async () => {
    try {
      const { data, error } = await supabase.from("Pass_team").select("team");
      if (error) throw error;
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
      if (error) throw error;
      if (data) setOffers(data as Offer[]);
    } catch (error) {
      console.error("Ошибка загрузи предложений:", error);
      setOffersError("Не удалось загрузить предложения");
    } finally {
      setLoadingOffers(false);
    }
  };

  const handleDeleteOffer = async (offerId: number) => {
    if (!authorizedTeam) {
      setDeleteError("Нет доступа для удаления");
      return;
    }
    if (!window.confirm("Вы уверены, что хотите удалить это предложение?"))
      return;
    setDeletingId(offerId);
    setDeleteError("");
    try {
      const { error } = await supabase
        .from("Market_RFA_first_round")
        .delete()
        .eq("id", offerId)
        .eq("team", authorizedTeam);
      if (error) throw error;
      setOffers(offers.filter((offer) => offer.id !== offerId));
    } catch (error) {
      console.error("Ошибка удаления предложения:", error);
      setDeleteError("Не удалось удалить предложение");
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  useEffect(() => {
    if (authorizedTeam) fetchOffers(authorizedTeam);
    else setOffers([]);
  }, [authorizedTeam]);

  const handleButtonClick = () => {
    if (authorizedTeam) return;
    setIsMenuOpen((prev) => !prev);
    setShowPasswordForm(false);
    setPasswordError("");
    setTeamSearch("");
  };

  const handleTeamSelect = (team: string) => {
    setSelectedTeam(team);
    setIsMenuOpen(false);
    setShowPasswordForm(true);
    setPassword("");
    setPasswordError("");
    setTeamSearch("");
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
        if (error.code === "PGRST116") setPasswordError("Неправильный пароль");
        else setPasswordError("Ошибка проверки пароля");
        return;
      }
      if (data) {
        setAuthorizedTeam(selectedTeam);
        setShowPasswordForm(false);
        setSelectedTeam(null);
        setPassword("");
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        !target.closest(".rfaUserFirstRoundSpaceViewOffers-container") &&
        !target.closest(
          ".rfaUserFirstRoundSpaceViewOffers-password-form-container",
        ) &&
        !target.closest(".rfaUserFirstRoundSpaceViewOffers-offers-container")
      ) {
        setIsMenuOpen(false);
        setTeamSearch("");
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString()}`;
  };

  const formatContractType = (type: string) => {
    const types: { [key: string]: string } = {
      flat: "Flat (0%)",
      front: "Front (-5%)",
      back: "Back (+5%)",
      bird: "Bird (+8%)",
    };
    return types[type] || type;
  };

  const formatOption = (option: string) => {
    const options: { [key: string]: string } = {
      none: "Без опции",
      team: "Опция команды",
      player: "Опция игрока",
    };
    return options[option] || option;
  };

  // Функция для отображения зарплат по годам
  const renderSalariesByYear = (offer: Offer) => {
    const salaries = [
      { year: 1, value: offer.salary_one },
      { year: 2, value: offer.salary_two },
      { year: 3, value: offer.salary_three },
      { year: 4, value: offer.salary_four },
    ];

    // Отображаем только те годы, которые используются в контракте
    return salaries.slice(0, offer.period_contract).map((salary, index) => (
      <div
        key={salary.year}
        className="rfaUserFirstRoundSpaceViewOffers-salary-year"
      >
        <span className="rfaUserFirstRoundSpaceViewOffers-salary-year-label">
          {salary.year} год:
        </span>
        <span className="rfaUserFirstRoundSpaceViewOffers-salary-year-value">
          {formatCurrency(salary.value)}
        </span>
      </div>
    ));
  };

  // Компактное отображение зарплат для таблицы
  const renderCompactSalaries = (offer: Offer) => {
    const salaries = [
      { year: 1, value: offer.salary_one },
      { year: 2, value: offer.salary_two },
      { year: 3, value: offer.salary_three },
      { year: 4, value: offer.salary_four },
    ];

    const usedSalaries = salaries.slice(0, offer.period_contract);
    return usedSalaries.map((salary, index) => (
      <div
        key={salary.year}
        className="rfaUserFirstRoundSpaceViewOffers-compact-salary"
      >
        {salary.year}г: {formatCurrency(salary.value)}
      </div>
    ));
  };

  return (
    <div className="rfaUserFirstRoundSpaceViewOffers-container">
      {/* Основная кнопка */}
      <button
        className="rfaUserFirstRoundSpaceViewOffers-button"
        onClick={handleButtonClick}
      >
        <span className="rfaUserFirstRoundSpaceViewOffers-button-text">
          {authorizedTeam
            ? `Команда: ${authorizedTeam}`
            : "Просмотр предложений"}
        </span>
        {!authorizedTeam && (
          <span className="rfaUserFirstRoundSpaceViewOffers-button-arrow">
            ▼
          </span>
        )}
      </button>

      {/* Кнопка выхода */}
      {authorizedTeam && (
        <button
          className="rfaUserFirstRoundSpaceViewOffers-logout-button"
          onClick={handleLogout}
        >
          Выйти
        </button>
      )}

      {/* Меню выбора команды */}
      {isMenuOpen && !authorizedTeam && (
        <div className="rfaUserFirstRoundSpaceViewOffers-menu">
          <div className="rfaUserFirstRoundSpaceViewOffers-menu-header">
            <div className="rfaUserFirstRoundSpaceViewOffers-menu-title">
              Выбор команды
            </div>
            <div className="rfaUserFirstRoundSpaceViewOffers-menu-subtitle">
              Для доступа к предложениям
            </div>
            <div className="rfaUserFirstRoundSpaceViewOffers-divider"></div>
          </div>

          {/* Поиск команды */}
          <div className="rfaUserFirstRoundSpaceViewOffers-team-search-container">
            <input
              type="text"
              value={teamSearch}
              onChange={(e) => setTeamSearch(e.target.value)}
              placeholder="Поиск команды..."
              className="rfaUserFirstRoundSpaceViewOffers-team-search-input"
              onClick={(e) => e.stopPropagation()}
            />
            {teamSearch && (
              <button
                className="rfaUserFirstRoundSpaceViewOffers-clear-search-button"
                onClick={() => setTeamSearch("")}
                aria-label="Очистить поиск"
              >
                ×
              </button>
            )}
          </div>

          {/* Список команд */}
          <div className="rfaUserFirstRoundSpaceViewOffers-teams-list">
            {loading ? (
              <div className="rfaUserFirstRoundSpaceViewOffers-loading">
                <div className="rfaUserFirstRoundSpaceViewOffers-spinner"></div>
                <span>Загрузка команд...</span>
              </div>
            ) : filteredTeams.length > 0 ? (
              filteredTeams.map((team, index) => (
                <div
                  key={index}
                  className="rfaUserFirstRoundSpaceViewOffers-team-item"
                  onClick={() => handleTeamSelect(team)}
                >
                  <span className="rfaUserFirstRoundSpaceViewOffers-team-name">
                    {team}
                  </span>
                </div>
              ))
            ) : (
              <div className="rfaUserFirstRoundSpaceViewOffers-empty">
                {teamSearch ? "Команда не найдена" : "Нет доступных команд"}
              </div>
            )}
          </div>

          {/* Информация о поиске */}
          {teamSearch && filteredTeams.length > 0 && (
            <div className="rfaUserFirstRoundSpaceViewOffers-search-results-info">
              Найдено: {filteredTeams.length} из {teams.length}
            </div>
          )}
        </div>
      )}

      {/* Форма ввода пароля */}
      {showPasswordForm && selectedTeam && (
        <div className="rfaUserFirstRoundSpaceViewOffers-password-overlay">
          <div className="rfaUserFirstRoundSpaceViewOffers-password-form-container">
            <div className="rfaUserFirstRoundSpaceViewOffers-password-form">
              <div className="rfaUserFirstRoundSpaceViewOffers-password-header">
                <h3 className="rfaUserFirstRoundSpaceViewOffers-password-title">
                  Авторизация
                </h3>
                <p className="rfaUserFirstRoundSpaceViewOffers-password-subtitle">
                  Для команды
                </p>
              </div>

              <div className="rfaUserFirstRoundSpaceViewOffers-selected-team-card">
                <div className="rfaUserFirstRoundSpaceViewOffers-team-info">
                  <div className="rfaUserFirstRoundSpaceViewOffers-team-name-large">
                    {selectedTeam}
                  </div>
                  <div className="rfaUserFirstRoundSpaceViewOffers-team-hint">
                    Введите пароль команды
                  </div>
                </div>
              </div>

              <div className="rfaUserFirstRoundSpaceViewOffers-password-input-group">
                <div className="rfaUserFirstRoundSpaceViewOffers-input-wrapper">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="rfaUserFirstRoundSpaceViewOffers-password-input"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handlePasswordSubmit();
                    }}
                  />
                  {password && (
                    <button
                      className="rfaUserFirstRoundSpaceViewOffers-input-clear"
                      onClick={() => setPassword("")}
                      aria-label="Очистить пароль"
                    >
                      ×
                    </button>
                  )}
                </div>

                {passwordError && (
                  <div className="rfaUserFirstRoundSpaceViewOffers-password-error">
                    {passwordError}
                  </div>
                )}

                <div className="rfaUserFirstRoundSpaceViewOffers-password-buttons">
                  <button
                    className="rfaUserFirstRoundSpaceViewOffers-password-submit"
                    onClick={handlePasswordSubmit}
                    disabled={isPasswordChecking}
                  >
                    {isPasswordChecking ? (
                      <>
                        <div className="rfaUserFirstRoundSpaceViewOffers-mini-spinner"></div>
                        Проверка...
                      </>
                    ) : (
                      "Подтвердить"
                    )}
                  </button>
                  <button
                    className="rfaUserFirstRoundSpaceViewOffers-password-cancel"
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

      {/* Список предложений */}
      {authorizedTeam && (
        <div className="rfaUserFirstRoundSpaceViewOffers-offers-container">
          <div className="rfaUserFirstRoundSpaceViewOffers-offers-header">
            <h3 className="rfaUserFirstRoundSpaceViewOffers-offers-title">
              Мои предложения
            </h3>
            <div className="rfaUserFirstRoundSpaceViewOffers-team-badge">
              {authorizedTeam}
            </div>
          </div>

          {deleteError && (
            <div className="rfaUserFirstRoundSpaceViewOffers-delete-error">
              {deleteError}
            </div>
          )}

          {loadingOffers ? (
            <div className="rfaUserFirstRoundSpaceViewOffers-loading-offers">
              <div className="rfaUserFirstRoundSpaceViewOffers-spinner"></div>
              <span>Загрузка предложений...</span>
            </div>
          ) : offersError ? (
            <div className="rfaUserFirstRoundSpaceViewOffers-offers-error">
              {offersError}
            </div>
          ) : offers.length === 0 ? (
            <div className="rfaUserFirstRoundSpaceViewOffers-no-offers">
              <p>Нет отправленных предложений</p>
              <p className="rfaUserFirstRoundSpaceViewOffers-empty-subtext">
                Создайте свое первое предложение
              </p>
            </div>
          ) : (
            <div className="rfaUserFirstRoundSpaceViewOffers-offers-content">
              {/* Статистика - видна только на планшетах и десктопах */}
              <div className="rfaUserFirstRoundSpaceViewOffers-offers-stats">
                <div className="rfaUserFirstRoundSpaceViewOffers-stat-card">
                  <div className="rfaUserFirstRoundSpaceViewOffers-stat-value">
                    {offers.length}
                  </div>
                  <div className="rfaUserFirstRoundSpaceViewOffers-stat-label">
                    Всего предложений
                  </div>
                </div>
                <div className="rfaUserFirstRoundSpaceViewOffers-stat-card">
                  <div className="rfaUserFirstRoundSpaceViewOffers-stat-value">
                    {offers.filter((o) => !o.result).length}
                  </div>
                  <div className="rfaUserFirstRoundSpaceViewOffers-stat-label">
                    На рассмотрении
                  </div>
                </div>
              </div>

              {/* Десктопная версия (таблица) */}
              <div className="rfaUserFirstRoundSpaceViewOffers-table-wrapper">
                <table className="rfaUserFirstRoundSpaceViewOffers-offers-table">
                  <thead>
                    <tr>
                      <th>Игрок</th>
                      <th>Зарплата по годам</th>
                      <th>Тип</th>
                      <th>Срок</th>
                      <th>Опция</th>
                      <th>Бонус</th>
                      <th>Условие</th>
                      <th>Статус</th>
                      <th>Дата</th>
                      <th>Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {offers.map((offer) => (
                      <tr
                        key={offer.id}
                        className="rfaUserFirstRoundSpaceViewOffers-table-row"
                      >
                        <td>
                          <div className="rfaUserFirstRoundSpaceViewOffers-player-cell">
                            <span className="rfaUserFirstRoundSpaceViewOffers-player-name">
                              {offer.player}
                            </span>
                          </div>
                        </td>
                        <td className="rfaUserFirstRoundSpaceViewOffers-salary-cell">
                          <div className="rfaUserFirstRoundSpaceViewOffers-salary-years-container">
                            {renderCompactSalaries(offer)}
                          </div>
                        </td>
                        <td className="rfaUserFirstRoundSpaceViewOffers-type-cell">
                          {formatContractType(offer.type_contract)}
                        </td>
                        <td className="rfaUserFirstRoundSpaceViewOffers-period-cell">
                          {offer.period_contract}{" "}
                          {offer.period_contract === 1 ? "год" : "года"}
                        </td>
                        <td className="rfaUserFirstRoundSpaceViewOffers-option-cell">
                          {formatOption(offer.option_contract)}
                        </td>
                        <td className="rfaUserFirstRoundSpaceViewOffers-bonus-cell">
                          {offer.bonus ? formatCurrency(offer.bonus) : "—"}
                        </td>
                        <td className="rfaUserFirstRoundSpaceViewOffers-condition-cell">
                          {offer.condition ? (
                            <div className="rfaUserFirstRoundSpaceViewOffers-condition-tooltip">
                              {offer.condition.length > 15
                                ? `${offer.condition.substring(0, 15)}...`
                                : offer.condition}
                              <div className="rfaUserFirstRoundSpaceViewOffers-tooltip-text">
                                {offer.condition}
                              </div>
                            </div>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="rfaUserFirstRoundSpaceViewOffers-status-cell">
                          <span
                            className={`rfaUserFirstRoundSpaceViewOffers-status-badge ${
                              offer.result
                                ? "rfaUserFirstRoundSpaceViewOffers-status-processed"
                                : "rfaUserFirstRoundSpaceViewOffers-status-pending"
                            }`}
                          >
                            {offer.result || "Ожидание"}
                          </span>
                        </td>
                        <td className="rfaUserFirstRoundSpaceViewOffers-date-cell">
                          {new Date(offer.created_at).toLocaleDateString(
                            "ru-RU",
                          )}
                        </td>
                        <td className="rfaUserFirstRoundSpaceViewOffers-actions-cell">
                          <button
                            className="rfaUserFirstRoundSpaceViewOffers-delete-button"
                            onClick={() => handleDeleteOffer(offer.id)}
                            disabled={deletingId === offer.id}
                          >
                            {deletingId === offer.id ? (
                              <>
                                <div className="rfaUserFirstRoundSpaceViewOffers-mini-spinner"></div>
                                Удаление...
                              </>
                            ) : (
                              "Удалить"
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Мобильная версия (карточки) */}
              <div className="rfaUserFirstRoundSpaceViewOffers-offers-cards">
                {offers.map((offer) => (
                  <div
                    className="rfaUserFirstRoundSpaceViewOffers-offer-card"
                    key={offer.id}
                  >
                    <div className="rfaUserFirstRoundSpaceViewOffers-offer-card-header">
                      <h4 className="rfaUserFirstRoundSpaceViewOffers-offer-player">
                        {offer.player}
                      </h4>
                      <span
                        className={`rfaUserFirstRoundSpaceViewOffers-offer-status ${
                          offer.result
                            ? "rfaUserFirstRoundSpaceViewOffers-offer-status-processed"
                            : "rfaUserFirstRoundSpaceViewOffers-offer-status-pending"
                        }`}
                      >
                        {offer.result || "Ожидание"}
                      </span>
                    </div>

                    <div className="rfaUserFirstRoundSpaceViewOffers-offer-details">
                      {/* Зарплаты по годам */}
                      <div className="rfaUserFirstRoundSpaceViewOffers-offer-row salary-years-row">
                        <span className="rfaUserFirstRoundSpaceViewOffers-offer-label">
                          Зарплата:
                        </span>
                        <div className="rfaUserFirstRoundSpaceViewOffers-salary-years-list">
                          {renderSalariesByYear(offer)}
                        </div>
                      </div>

                      <div className="rfaUserFirstRoundSpaceViewOffers-offer-row">
                        <span className="rfaUserFirstRoundSpaceViewOffers-offer-label">
                          Тип:
                        </span>
                        <span className="rfaUserFirstRoundSpaceViewOffers-offer-value">
                          {formatContractType(offer.type_contract)}
                        </span>
                      </div>

                      <div className="rfaUserFirstRoundSpaceViewOffers-offer-row">
                        <span className="rfaUserFirstRoundSpaceViewOffers-offer-label">
                          Срок:
                        </span>
                        <span className="rfaUserFirstRoundSpaceViewOffers-offer-value">
                          {offer.period_contract}{" "}
                          {offer.period_contract === 1 ? "год" : "года"}
                        </span>
                      </div>

                      <div className="rfaUserFirstRoundSpaceViewOffers-offer-row">
                        <span className="rfaUserFirstRoundSpaceViewOffers-offer-label">
                          Опция:
                        </span>
                        <span className="rfaUserFirstRoundSpaceViewOffers-offer-value">
                          {formatOption(offer.option_contract)}
                        </span>
                      </div>

                      {offer.bonus > 0 && (
                        <div className="rfaUserFirstRoundSpaceViewOffers-offer-row">
                          <span className="rfaUserFirstRoundSpaceViewOffers-offer-label">
                            Бонус:
                          </span>
                          <span className="rfaUserFirstRoundSpaceViewOffers-offer-value bonus">
                            {formatCurrency(offer.bonus)}
                          </span>
                        </div>
                      )}

                      {offer.condition && (
                        <div className="rfaUserFirstRoundSpaceViewOffers-offer-row">
                          <span className="rfaUserFirstRoundSpaceViewOffers-offer-label">
                            Условие:
                          </span>
                          <span className="rfaUserFirstRoundSpaceViewOffers-offer-value">
                            {offer.condition}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="rfaUserFirstRoundSpaceViewOffers-offer-card-footer">
                      <span className="rfaUserFirstRoundSpaceViewOffers-offer-date">
                        {new Date(offer.created_at).toLocaleDateString("ru-RU")}
                      </span>
                      <button
                        className="rfaUserFirstRoundSpaceViewOffers-card-delete-button"
                        onClick={() => handleDeleteOffer(offer.id)}
                        disabled={deletingId === offer.id}
                      >
                        {deletingId === offer.id ? (
                          <>
                            <div className="rfaUserFirstRoundSpaceViewOffers-mini-spinner"></div>
                            Удаление...
                          </>
                        ) : (
                          "Удалить"
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RFAUserFirstRoundSpaceViewOffers;
