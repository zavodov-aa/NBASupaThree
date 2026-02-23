import React, { useState, useEffect, useMemo } from "react";
import { supabase } from "../../../../../../Supabase";
import "./ufaUSRSecondStageViewOffers.css";

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

const UFAUSRSecondStageViewOffers = () => {
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
        .from("Market_UFA_second_round_second_stage")
        .select("*")
        .eq("team", teamName)
        .order("created_at", { ascending: false });
      if (error) throw error;
      if (data) setOffers(data as Offer[]);
    } catch (error) {
      console.error("Ошибка загрузки предложений:", error);
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
        .from("Market_UFA_second_round_second_stage")
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
        !target.closest(".ufausrSecondStageViewOffers-container") &&
        !target.closest(
          ".ufausrSecondStageViewOffers-password-form-container",
        ) &&
        !target.closest(".ufausrSecondStageViewOffers-offers-container")
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

  const renderSalariesByYear = (offer: Offer) => {
    const salaries = [
      { year: 1, value: offer.salary_one },
      { year: 2, value: offer.salary_two },
      { year: 3, value: offer.salary_three },
      { year: 4, value: offer.salary_four },
    ];

    return salaries.slice(0, offer.period_contract).map((salary) => (
      <div
        key={salary.year}
        className="ufausrSecondStageViewOffers-salary-year"
      >
        <span className="ufausrSecondStageViewOffers-salary-year-label">
          {salary.year} год:
        </span>
        <span className="ufausrSecondStageViewOffers-salary-year-value">
          {formatCurrency(salary.value)}
        </span>
      </div>
    ));
  };

  const renderCompactSalaries = (offer: Offer) => {
    const salaries = [
      { year: 1, value: offer.salary_one },
      { year: 2, value: offer.salary_two },
      { year: 3, value: offer.salary_three },
      { year: 4, value: offer.salary_four },
    ];

    const usedSalaries = salaries.slice(0, offer.period_contract);
    return usedSalaries.map((salary) => (
      <div
        key={salary.year}
        className="ufausrSecondStageViewOffers-compact-salary"
      >
        {salary.year}г: {formatCurrency(salary.value)}
      </div>
    ));
  };

  return (
    <div className="ufausrSecondStageViewOffers-container">
      {/* Основная кнопка */}
      <button
        className="ufausrSecondStageViewOffers-button"
        onClick={handleButtonClick}
      >
        <span className="ufausrSecondStageViewOffers-button-text">
          {authorizedTeam
            ? `Команда: ${authorizedTeam}`
            : "Просмотр предложений (2 этап)"}
        </span>
        {!authorizedTeam && (
          <span className="ufausrSecondStageViewOffers-button-arrow">▼</span>
        )}
      </button>

      {/* Кнопка выхода */}
      {authorizedTeam && (
        <button
          className="ufausrSecondStageViewOffers-logout-button"
          onClick={handleLogout}
        >
          Выйти
        </button>
      )}

      {/* Меню выбора команды */}
      {isMenuOpen && !authorizedTeam && (
        <div className="ufausrSecondStageViewOffers-menu">
          <div className="ufausrSecondStageViewOffers-menu-header">
            <div className="ufausrSecondStageViewOffers-menu-title">
              Выбор команды
            </div>
            <div className="ufausrSecondStageViewOffers-menu-subtitle">
              Для доступа к предложениям (2 этап)
            </div>
            <div className="ufausrSecondStageViewOffers-divider"></div>
          </div>

          {/* Поиск команды */}
          <div className="ufausrSecondStageViewOffers-team-search-container">
            <input
              type="text"
              value={teamSearch}
              onChange={(e) => setTeamSearch(e.target.value)}
              placeholder="Поиск команды..."
              className="ufausrSecondStageViewOffers-team-search-input"
              onClick={(e) => e.stopPropagation()}
            />
            {teamSearch && (
              <button
                className="ufausrSecondStageViewOffers-clear-search-button"
                onClick={() => setTeamSearch("")}
                aria-label="Очистить поиск"
              >
                ×
              </button>
            )}
          </div>

          {/* Список команд */}
          <div className="ufausrSecondStageViewOffers-teams-list">
            {loading ? (
              <div className="ufausrSecondStageViewOffers-loading">
                <div className="ufausrSecondStageViewOffers-spinner"></div>
                <span>Загрузка команд...</span>
              </div>
            ) : filteredTeams.length > 0 ? (
              filteredTeams.map((team, index) => (
                <div
                  key={index}
                  className="ufausrSecondStageViewOffers-team-item"
                  onClick={() => handleTeamSelect(team)}
                >
                  <span className="ufausrSecondStageViewOffers-team-name">
                    {team}
                  </span>
                </div>
              ))
            ) : (
              <div className="ufausrSecondStageViewOffers-empty">
                {teamSearch ? "Команда не найдена" : "Нет доступных команд"}
              </div>
            )}
          </div>

          {/* Информация о поиске */}
          {teamSearch && filteredTeams.length > 0 && (
            <div className="ufausrSecondStageViewOffers-search-results-info">
              Найдено: {filteredTeams.length} из {teams.length}
            </div>
          )}
        </div>
      )}

      {/* Форма ввода пароля */}
      {showPasswordForm && selectedTeam && (
        <div className="ufausrSecondStageViewOffers-password-overlay">
          <div className="ufausrSecondStageViewOffers-password-form-container">
            <div className="ufausrSecondStageViewOffers-password-form">
              <div className="ufausrSecondStageViewOffers-password-header">
                <h3 className="ufausrSecondStageViewOffers-password-title">
                  Авторизация
                </h3>
                <p className="ufausrSecondStageViewOffers-password-subtitle">
                  Для команды (2 этап)
                </p>
              </div>

              <div className="ufausrSecondStageViewOffers-selected-team-card">
                <div className="ufausrSecondStageViewOffers-team-info">
                  <div className="ufausrSecondStageViewOffers-team-name-large">
                    {selectedTeam}
                  </div>
                  <div className="ufausrSecondStageViewOffers-team-hint">
                    Введите пароль команды
                  </div>
                </div>
              </div>

              <div className="ufausrSecondStageViewOffers-password-input-group">
                <div className="ufausrSecondStageViewOffers-input-wrapper">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="ufausrSecondStageViewOffers-password-input"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handlePasswordSubmit();
                    }}
                  />
                  {password && (
                    <button
                      className="ufausrSecondStageViewOffers-input-clear"
                      onClick={() => setPassword("")}
                      aria-label="Очистить пароль"
                    >
                      ×
                    </button>
                  )}
                </div>

                {passwordError && (
                  <div className="ufausrSecondStageViewOffers-password-error">
                    {passwordError}
                  </div>
                )}

                <div className="ufausrSecondStageViewOffers-password-buttons">
                  <button
                    className="ufausrSecondStageViewOffers-password-submit"
                    onClick={handlePasswordSubmit}
                    disabled={isPasswordChecking}
                  >
                    {isPasswordChecking ? (
                      <>
                        <div className="ufausrSecondStageViewOffers-mini-spinner"></div>
                        Проверка...
                      </>
                    ) : (
                      "Подтвердить"
                    )}
                  </button>
                  <button
                    className="ufausrSecondStageViewOffers-password-cancel"
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
        <div className="ufausrSecondStageViewOffers-offers-container">
          <div className="ufausrSecondStageViewOffers-offers-header">
            <h3 className="ufausrSecondStageViewOffers-offers-title">
              Мои предложения (2 этап)
            </h3>
            <div className="ufausrSecondStageViewOffers-team-badge">
              {authorizedTeam}
            </div>
          </div>

          {deleteError && (
            <div className="ufausrSecondStageViewOffers-delete-error">
              {deleteError}
            </div>
          )}

          {loadingOffers ? (
            <div className="ufausrSecondStageViewOffers-loading-offers">
              <div className="ufausrSecondStageViewOffers-spinner"></div>
              <span>Загрузка предложений...</span>
            </div>
          ) : offersError ? (
            <div className="ufausrSecondStageViewOffers-offers-error">
              {offersError}
            </div>
          ) : offers.length === 0 ? (
            <div className="ufausrSecondStageViewOffers-no-offers">
              <p>Нет отправленных предложений</p>
              <p className="ufausrSecondStageViewOffers-empty-subtext">
                Создайте свое первое предложение
              </p>
            </div>
          ) : (
            <div className="ufausrSecondStageViewOffers-offers-content">
              {/* Статистика - видна только на планшетах и десктопах */}
              <div className="ufausrSecondStageViewOffers-offers-stats">
                <div className="ufausrSecondStageViewOffers-stat-card">
                  <div className="ufausrSecondStageViewOffers-stat-value">
                    {offers.length}
                  </div>
                  <div className="ufausrSecondStageViewOffers-stat-label">
                    Всего предложений
                  </div>
                </div>
                <div className="ufausrSecondStageViewOffers-stat-card">
                  <div className="ufausrSecondStageViewOffers-stat-value">
                    {offers.filter((o) => !o.result).length}
                  </div>
                  <div className="ufausrSecondStageViewOffers-stat-label">
                    На рассмотрении
                  </div>
                </div>
              </div>

              {/* Десктопная версия (таблица) */}
              <div className="ufausrSecondStageViewOffers-table-wrapper">
                <table className="ufausrSecondStageViewOffers-offers-table">
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
                        className="ufausrSecondStageViewOffers-table-row"
                      >
                        <td>
                          <div className="ufausrSecondStageViewOffers-player-cell">
                            <span className="ufausrSecondStageViewOffers-player-name">
                              {offer.player}
                            </span>
                          </div>
                        </td>
                        <td className="ufausrSecondStageViewOffers-salary-cell">
                          <div className="ufausrSecondStageViewOffers-salary-years-container">
                            {renderCompactSalaries(offer)}
                          </div>
                        </td>
                        <td className="ufausrSecondStageViewOffers-type-cell">
                          {formatContractType(offer.type_contract)}
                        </td>
                        <td className="ufausrSecondStageViewOffers-period-cell">
                          {offer.period_contract}{" "}
                          {offer.period_contract === 1 ? "год" : "года"}
                        </td>
                        <td className="ufausrSecondStageViewOffers-option-cell">
                          {formatOption(offer.option_contract)}
                        </td>
                        <td className="ufausrSecondStageViewOffers-bonus-cell">
                          {offer.bonus ? formatCurrency(offer.bonus) : "—"}
                        </td>
                        <td className="ufausrSecondStageViewOffers-condition-cell">
                          {offer.condition ? (
                            <div className="ufausrSecondStageViewOffers-condition-tooltip">
                              {offer.condition.length > 15
                                ? `${offer.condition.substring(0, 15)}...`
                                : offer.condition}
                              <div className="ufausrSecondStageViewOffers-tooltip-text">
                                {offer.condition}
                              </div>
                            </div>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="ufausrSecondStageViewOffers-status-cell">
                          <span
                            className={`ufausrSecondStageViewOffers-status-badge ${
                              offer.result
                                ? "ufausrSecondStageViewOffers-status-processed"
                                : "ufausrSecondStageViewOffers-status-pending"
                            }`}
                          >
                            {offer.result || "Ожидание"}
                          </span>
                        </td>
                        <td className="ufausrSecondStageViewOffers-date-cell">
                          {new Date(offer.created_at).toLocaleDateString(
                            "ru-RU",
                          )}
                        </td>
                        <td className="ufausrSecondStageViewOffers-actions-cell">
                          <button
                            className="ufausrSecondStageViewOffers-delete-button"
                            onClick={() => handleDeleteOffer(offer.id)}
                            disabled={deletingId === offer.id}
                          >
                            {deletingId === offer.id ? (
                              <>
                                <div className="ufausrSecondStageViewOffers-mini-spinner"></div>
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
              <div className="ufausrSecondStageViewOffers-offers-cards">
                {offers.map((offer) => (
                  <div
                    className="ufausrSecondStageViewOffers-offer-card"
                    key={offer.id}
                  >
                    <div className="ufausrSecondStageViewOffers-offer-card-header">
                      <h4 className="ufausrSecondStageViewOffers-offer-player">
                        {offer.player}
                      </h4>
                      <span
                        className={`ufausrSecondStageViewOffers-offer-status ${
                          offer.result
                            ? "ufausrSecondStageViewOffers-offer-status-processed"
                            : "ufausrSecondStageViewOffers-offer-status-pending"
                        }`}
                      >
                        {offer.result || "Ожидание"}
                      </span>
                    </div>

                    <div className="ufausrSecondStageViewOffers-offer-details">
                      {/* Зарплаты по годам */}
                      <div className="ufausrSecondStageViewOffers-offer-row salary-years-row">
                        <span className="ufausrSecondStageViewOffers-offer-label">
                          Зарплата:
                        </span>
                        <div className="ufausrSecondStageViewOffers-salary-years-list">
                          {renderSalariesByYear(offer)}
                        </div>
                      </div>

                      <div className="ufausrSecondStageViewOffers-offer-row">
                        <span className="ufausrSecondStageViewOffers-offer-label">
                          Тип:
                        </span>
                        <span className="ufausrSecondStageViewOffers-offer-value">
                          {formatContractType(offer.type_contract)}
                        </span>
                      </div>

                      <div className="ufausrSecondStageViewOffers-offer-row">
                        <span className="ufausrSecondStageViewOffers-offer-label">
                          Срок:
                        </span>
                        <span className="ufausrSecondStageViewOffers-offer-value">
                          {offer.period_contract}{" "}
                          {offer.period_contract === 1 ? "год" : "года"}
                        </span>
                      </div>

                      <div className="ufausrSecondStageViewOffers-offer-row">
                        <span className="ufausrSecondStageViewOffers-offer-label">
                          Опция:
                        </span>
                        <span className="ufausrSecondStageViewOffers-offer-value">
                          {formatOption(offer.option_contract)}
                        </span>
                      </div>

                      {offer.bonus > 0 && (
                        <div className="ufausrSecondStageViewOffers-offer-row">
                          <span className="ufausrSecondStageViewOffers-offer-label">
                            Бонус:
                          </span>
                          <span className="ufausrSecondStageViewOffers-offer-value bonus">
                            {formatCurrency(offer.bonus)}
                          </span>
                        </div>
                      )}

                      {offer.condition && (
                        <div className="ufausrSecondStageViewOffers-offer-row">
                          <span className="ufausrSecondStageViewOffers-offer-label">
                            Условие:
                          </span>
                          <span className="ufausrSecondStageViewOffers-offer-value">
                            {offer.condition}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="ufausrSecondStageViewOffers-offer-card-footer">
                      <span className="ufausrSecondStageViewOffers-offer-date">
                        {new Date(offer.created_at).toLocaleDateString("ru-RU")}
                      </span>
                      <button
                        className="ufausrSecondStageViewOffers-card-delete-button"
                        onClick={() => handleDeleteOffer(offer.id)}
                        disabled={deletingId === offer.id}
                      >
                        {deletingId === offer.id ? (
                          <>
                            <div className="ufausrSecondStageViewOffers-mini-spinner"></div>
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

export default UFAUSRSecondStageViewOffers;
