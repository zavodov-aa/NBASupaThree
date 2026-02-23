import React, { useState, useEffect, useMemo } from "react";
import { supabase } from "../../../../../Supabase";
import "./rfaUserSecondRoundSpaceViewOffers.css";

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

const RFAUserSecondRoundSpaceViewOffers = () => {
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
        .from("Market_RFA_second_round") // Изменено здесь
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
        .from("Market_RFA_second_round") // Изменено здесь
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
        !target.closest(".rfaUserSecondRoundSpaceViewOffers-container") &&
        !target.closest(
          ".rfaUserSecondRoundSpaceViewOffers-password-form-container",
        ) &&
        !target.closest(".rfaUserSecondRoundSpaceViewOffers-offers-container")
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
        className="rfaUserSecondRoundSpaceViewOffers-salary-year"
      >
        <span className="rfaUserSecondRoundSpaceViewOffers-salary-year-label">
          {salary.year} год:
        </span>
        <span className="rfaUserSecondRoundSpaceViewOffers-salary-year-value">
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
        className="rfaUserSecondRoundSpaceViewOffers-compact-salary"
      >
        {salary.year}г: {formatCurrency(salary.value)}
      </div>
    ));
  };

  return (
    <div className="rfaUserSecondRoundSpaceViewOffers-container">
      {/* Основная кнопка */}
      <button
        className="rfaUserSecondRoundSpaceViewOffers-button"
        onClick={handleButtonClick}
      >
        <span className="rfaUserSecondRoundSpaceViewOffers-button-text">
          {authorizedTeam
            ? `Команда: ${authorizedTeam}`
            : "Просмотр предложений"}
        </span>
        {!authorizedTeam && (
          <span className="rfaUserSecondRoundSpaceViewOffers-button-arrow">
            ▼
          </span>
        )}
      </button>

      {/* Кнопка выхода */}
      {authorizedTeam && (
        <button
          className="rfaUserSecondRoundSpaceViewOffers-logout-button"
          onClick={handleLogout}
        >
          Выйти
        </button>
      )}

      {/* Меню выбора команды */}
      {isMenuOpen && !authorizedTeam && (
        <div className="rfaUserSecondRoundSpaceViewOffers-menu">
          <div className="rfaUserSecondRoundSpaceViewOffers-menu-header">
            <div className="rfaUserSecondRoundSpaceViewOffers-menu-title">
              Выбор команды
            </div>
            <div className="rfaUserSecondRoundSpaceViewOffers-menu-subtitle">
              Для доступа к предложениям
            </div>
            <div className="rfaUserSecondRoundSpaceViewOffers-divider"></div>
          </div>

          {/* Поиск команды */}
          <div className="rfaUserSecondRoundSpaceViewOffers-team-search-container">
            <input
              type="text"
              value={teamSearch}
              onChange={(e) => setTeamSearch(e.target.value)}
              placeholder="Поиск команды..."
              className="rfaUserSecondRoundSpaceViewOffers-team-search-input"
              onClick={(e) => e.stopPropagation()}
            />
            {teamSearch && (
              <button
                className="rfaUserSecondRoundSpaceViewOffers-clear-search-button"
                onClick={() => setTeamSearch("")}
                aria-label="Очистить поиск"
              >
                ×
              </button>
            )}
          </div>

          {/* Список команд */}
          <div className="rfaUserSecondRoundSpaceViewOffers-teams-list">
            {loading ? (
              <div className="rfaUserSecondRoundSpaceViewOffers-loading">
                <div className="rfaUserSecondRoundSpaceViewOffers-spinner"></div>
                <span>Загрузка команд...</span>
              </div>
            ) : filteredTeams.length > 0 ? (
              filteredTeams.map((team, index) => (
                <div
                  key={index}
                  className="rfaUserSecondRoundSpaceViewOffers-team-item"
                  onClick={() => handleTeamSelect(team)}
                >
                  <span className="rfaUserSecondRoundSpaceViewOffers-team-name">
                    {team}
                  </span>
                </div>
              ))
            ) : (
              <div className="rfaUserSecondRoundSpaceViewOffers-empty">
                {teamSearch ? "Команда не найдена" : "Нет доступных команд"}
              </div>
            )}
          </div>

          {/* Информация о поиске */}
          {teamSearch && filteredTeams.length > 0 && (
            <div className="rfaUserSecondRoundSpaceViewOffers-search-results-info">
              Найдено: {filteredTeams.length} из {teams.length}
            </div>
          )}
        </div>
      )}

      {/* Форма ввода пароля */}
      {showPasswordForm && selectedTeam && (
        <div className="rfaUserSecondRoundSpaceViewOffers-password-overlay">
          <div className="rfaUserSecondRoundSpaceViewOffers-password-form-container">
            <div className="rfaUserSecondRoundSpaceViewOffers-password-form">
              <div className="rfaUserSecondRoundSpaceViewOffers-password-header">
                <h3 className="rfaUserSecondRoundSpaceViewOffers-password-title">
                  Авторизация
                </h3>
                <p className="rfaUserSecondRoundSpaceViewOffers-password-subtitle">
                  Для команды
                </p>
              </div>

              <div className="rfaUserSecondRoundSpaceViewOffers-selected-team-card">
                <div className="rfaUserSecondRoundSpaceViewOffers-team-info">
                  <div className="rfaUserSecondRoundSpaceViewOffers-team-name-large">
                    {selectedTeam}
                  </div>
                  <div className="rfaUserSecondRoundSpaceViewOffers-team-hint">
                    Введите пароль команды
                  </div>
                </div>
              </div>

              <div className="rfaUserSecondRoundSpaceViewOffers-password-input-group">
                <div className="rfaUserSecondRoundSpaceViewOffers-input-wrapper">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="rfaUserSecondRoundSpaceViewOffers-password-input"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handlePasswordSubmit();
                    }}
                  />
                  {password && (
                    <button
                      className="rfaUserSecondRoundSpaceViewOffers-input-clear"
                      onClick={() => setPassword("")}
                      aria-label="Очистить пароль"
                    >
                      ×
                    </button>
                  )}
                </div>

                {passwordError && (
                  <div className="rfaUserSecondRoundSpaceViewOffers-password-error">
                    {passwordError}
                  </div>
                )}

                <div className="rfaUserSecondRoundSpaceViewOffers-password-buttons">
                  <button
                    className="rfaUserSecondRoundSpaceViewOffers-password-submit"
                    onClick={handlePasswordSubmit}
                    disabled={isPasswordChecking}
                  >
                    {isPasswordChecking ? (
                      <>
                        <div className="rfaUserSecondRoundSpaceViewOffers-mini-spinner"></div>
                        Проверка...
                      </>
                    ) : (
                      "Подтвердить"
                    )}
                  </button>
                  <button
                    className="rfaUserSecondRoundSpaceViewOffers-password-cancel"
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
        <div className="rfaUserSecondRoundSpaceViewOffers-offers-container">
          <div className="rfaUserSecondRoundSpaceViewOffers-offers-header">
            <h3 className="rfaUserSecondRoundSpaceViewOffers-offers-title">
              Мои предложения
            </h3>
            <div className="rfaUserSecondRoundSpaceViewOffers-team-badge">
              {authorizedTeam}
            </div>
          </div>

          {deleteError && (
            <div className="rfaUserSecondRoundSpaceViewOffers-delete-error">
              {deleteError}
            </div>
          )}

          {loadingOffers ? (
            <div className="rfaUserSecondRoundSpaceViewOffers-loading-offers">
              <div className="rfaUserSecondRoundSpaceViewOffers-spinner"></div>
              <span>Загрузка предложений...</span>
            </div>
          ) : offersError ? (
            <div className="rfaUserSecondRoundSpaceViewOffers-offers-error">
              {offersError}
            </div>
          ) : offers.length === 0 ? (
            <div className="rfaUserSecondRoundSpaceViewOffers-no-offers">
              <p>Нет отправленных предложений</p>
              <p className="rfaUserSecondRoundSpaceViewOffers-empty-subtext">
                Создайте свое первое предложение
              </p>
            </div>
          ) : (
            <div className="rfaUserSecondRoundSpaceViewOffers-offers-content">
              {/* Статистика - видна только на планшетах и десктопах */}
              <div className="rfaUserSecondRoundSpaceViewOffers-offers-stats">
                <div className="rfaUserSecondRoundSpaceViewOffers-stat-card">
                  <div className="rfaUserSecondRoundSpaceViewOffers-stat-value">
                    {offers.length}
                  </div>
                  <div className="rfaUserSecondRoundSpaceViewOffers-stat-label">
                    Всего предложений
                  </div>
                </div>
                <div className="rfaUserSecondRoundSpaceViewOffers-stat-card">
                  <div className="rfaUserSecondRoundSpaceViewOffers-stat-value">
                    {offers.filter((o) => !o.result).length}
                  </div>
                  <div className="rfaUserSecondRoundSpaceViewOffers-stat-label">
                    На рассмотрении
                  </div>
                </div>
              </div>

              {/* Десктопная версия (таблица) */}
              <div className="rfaUserSecondRoundSpaceViewOffers-table-wrapper">
                <table className="rfaUserSecondRoundSpaceViewOffers-offers-table">
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
                        className="rfaUserSecondRoundSpaceViewOffers-table-row"
                      >
                        <td>
                          <div className="rfaUserSecondRoundSpaceViewOffers-player-cell">
                            <span className="rfaUserSecondRoundSpaceViewOffers-player-name">
                              {offer.player}
                            </span>
                          </div>
                        </td>
                        <td className="rfaUserSecondRoundSpaceViewOffers-salary-cell">
                          <div className="rfaUserSecondRoundSpaceViewOffers-salary-years-container">
                            {renderCompactSalaries(offer)}
                          </div>
                        </td>
                        <td className="rfaUserSecondRoundSpaceViewOffers-type-cell">
                          {formatContractType(offer.type_contract)}
                        </td>
                        <td className="rfaUserSecondRoundSpaceViewOffers-period-cell">
                          {offer.period_contract}{" "}
                          {offer.period_contract === 1 ? "год" : "года"}
                        </td>
                        <td className="rfaUserSecondRoundSpaceViewOffers-option-cell">
                          {formatOption(offer.option_contract)}
                        </td>
                        <td className="rfaUserSecondRoundSpaceViewOffers-bonus-cell">
                          {offer.bonus ? formatCurrency(offer.bonus) : "—"}
                        </td>
                        <td className="rfaUserSecondRoundSpaceViewOffers-condition-cell">
                          {offer.condition ? (
                            <div className="rfaUserSecondRoundSpaceViewOffers-condition-tooltip">
                              {offer.condition.length > 15
                                ? `${offer.condition.substring(0, 15)}...`
                                : offer.condition}
                              <div className="rfaUserSecondRoundSpaceViewOffers-tooltip-text">
                                {offer.condition}
                              </div>
                            </div>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="rfaUserSecondRoundSpaceViewOffers-status-cell">
                          <span
                            className={`rfaUserSecondRoundSpaceViewOffers-status-badge ${
                              offer.result
                                ? "rfaUserSecondRoundSpaceViewOffers-status-processed"
                                : "rfaUserSecondRoundSpaceViewOffers-status-pending"
                            }`}
                          >
                            {offer.result || "Ожидание"}
                          </span>
                        </td>
                        <td className="rfaUserSecondRoundSpaceViewOffers-date-cell">
                          {new Date(offer.created_at).toLocaleDateString(
                            "ru-RU",
                          )}
                        </td>
                        <td className="rfaUserSecondRoundSpaceViewOffers-actions-cell">
                          <button
                            className="rfaUserSecondRoundSpaceViewOffers-delete-button"
                            onClick={() => handleDeleteOffer(offer.id)}
                            disabled={deletingId === offer.id}
                          >
                            {deletingId === offer.id ? (
                              <>
                                <div className="rfaUserSecondRoundSpaceViewOffers-mini-spinner"></div>
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
              <div className="rfaUserSecondRoundSpaceViewOffers-offers-cards">
                {offers.map((offer) => (
                  <div
                    className="rfaUserSecondRoundSpaceViewOffers-offer-card"
                    key={offer.id}
                  >
                    <div className="rfaUserSecondRoundSpaceViewOffers-offer-card-header">
                      <h4 className="rfaUserSecondRoundSpaceViewOffers-offer-player">
                        {offer.player}
                      </h4>
                      <span
                        className={`rfaUserSecondRoundSpaceViewOffers-offer-status ${
                          offer.result
                            ? "rfaUserSecondRoundSpaceViewOffers-offer-status-processed"
                            : "rfaUserSecondRoundSpaceViewOffers-offer-status-pending"
                        }`}
                      >
                        {offer.result || "Ожидание"}
                      </span>
                    </div>

                    <div className="rfaUserSecondRoundSpaceViewOffers-offer-details">
                      {/* Зарплаты по годам */}
                      <div className="rfaUserSecondRoundSpaceViewOffers-offer-row salary-years-row">
                        <span className="rfaUserSecondRoundSpaceViewOffers-offer-label">
                          Зарплата:
                        </span>
                        <div className="rfaUserSecondRoundSpaceViewOffers-salary-years-list">
                          {renderSalariesByYear(offer)}
                        </div>
                      </div>

                      <div className="rfaUserSecondRoundSpaceViewOffers-offer-row">
                        <span className="rfaUserSecondRoundSpaceViewOffers-offer-label">
                          Тип:
                        </span>
                        <span className="rfaUserSecondRoundSpaceViewOffers-offer-value">
                          {formatContractType(offer.type_contract)}
                        </span>
                      </div>

                      <div className="rfaUserSecondRoundSpaceViewOffers-offer-row">
                        <span className="rfaUserSecondRoundSpaceViewOffers-offer-label">
                          Срок:
                        </span>
                        <span className="rfaUserSecondRoundSpaceViewOffers-offer-value">
                          {offer.period_contract}{" "}
                          {offer.period_contract === 1 ? "год" : "года"}
                        </span>
                      </div>

                      <div className="rfaUserSecondRoundSpaceViewOffers-offer-row">
                        <span className="rfaUserSecondRoundSpaceViewOffers-offer-label">
                          Опция:
                        </span>
                        <span className="rfaUserSecondRoundSpaceViewOffers-offer-value">
                          {formatOption(offer.option_contract)}
                        </span>
                      </div>

                      {offer.bonus > 0 && (
                        <div className="rfaUserSecondRoundSpaceViewOffers-offer-row">
                          <span className="rfaUserSecondRoundSpaceViewOffers-offer-label">
                            Бонус:
                          </span>
                          <span className="rfaUserSecondRoundSpaceViewOffers-offer-value bonus">
                            {formatCurrency(offer.bonus)}
                          </span>
                        </div>
                      )}

                      {offer.condition && (
                        <div className="rfaUserSecondRoundSpaceViewOffers-offer-row">
                          <span className="rfaUserSecondRoundSpaceViewOffers-offer-label">
                            Условие:
                          </span>
                          <span className="rfaUserSecondRoundSpaceViewOffers-offer-value">
                            {offer.condition}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="rfaUserSecondRoundSpaceViewOffers-offer-card-footer">
                      <span className="rfaUserSecondRoundSpaceViewOffers-offer-date">
                        {new Date(offer.created_at).toLocaleDateString("ru-RU")}
                      </span>
                      <button
                        className="rfaUserSecondRoundSpaceViewOffers-card-delete-button"
                        onClick={() => handleDeleteOffer(offer.id)}
                        disabled={deletingId === offer.id}
                      >
                        {deletingId === offer.id ? (
                          <>
                            <div className="rfaUserSecondRoundSpaceViewOffers-mini-spinner"></div>
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

export default RFAUserSecondRoundSpaceViewOffers;
