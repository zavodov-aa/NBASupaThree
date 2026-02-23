import React, { useState, useEffect, useMemo } from "react";
import { supabase } from "../../../../../../Supabase";
import "./ufaufrSecondStageViewOffers.css"; // Новый CSS для второго этапа

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

const UFAUFRSecondStageViewOffers = () => {
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
        .from("Market_UFA_first_round_second_stage") // Изменено на таблицу второго этапа
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
        .from("Market_UFA_first_round_second_stage") // Изменено на таблицу второго этапа
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
        !target.closest(".ufaufrSecondStageViewOffers-container") &&
        !target.closest(
          ".ufaufrSecondStageViewOffers-password-form-container",
        ) &&
        !target.closest(".ufaufrSecondStageViewOffers-offers-container")
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
        className="ufaufrSecondStageViewOffers-salary-year"
      >
        <span className="ufaufrSecondStageViewOffers-salary-year-label">
          {salary.year} год:
        </span>
        <span className="ufaufrSecondStageViewOffers-salary-year-value">
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
        className="ufaufrSecondStageViewOffers-compact-salary"
      >
        {salary.year}г: {formatCurrency(salary.value)}
      </div>
    ));
  };

  return (
    <div className="ufaufrSecondStageViewOffers-container">
      {/* Основная кнопка */}
      <button
        className="ufaufrSecondStageViewOffers-button"
        onClick={handleButtonClick}
      >
        <span className="ufaufrSecondStageViewOffers-button-text">
          {authorizedTeam
            ? `Команда: ${authorizedTeam}`
            : "Просмотр предложений (2 этап)"}
        </span>
        {!authorizedTeam && (
          <span className="ufaufrSecondStageViewOffers-button-arrow">▼</span>
        )}
      </button>

      {/* Кнопка выхода */}
      {authorizedTeam && (
        <button
          className="ufaufrSecondStageViewOffers-logout-button"
          onClick={handleLogout}
        >
          Выйти
        </button>
      )}

      {/* Меню выбора команды */}
      {isMenuOpen && !authorizedTeam && (
        <div className="ufaufrSecondStageViewOffers-menu">
          <div className="ufaufrSecondStageViewOffers-menu-header">
            <div className="ufaufrSecondStageViewOffers-menu-title">
              Выбор команды
            </div>
            <div className="ufaufrSecondStageViewOffers-menu-subtitle">
              Для доступа к предложениям (2 этап)
            </div>
            <div className="ufaufrSecondStageViewOffers-divider"></div>
          </div>

          {/* Поиск команды */}
          <div className="ufaufrSecondStageViewOffers-team-search-container">
            <input
              type="text"
              value={teamSearch}
              onChange={(e) => setTeamSearch(e.target.value)}
              placeholder="Поиск команды..."
              className="ufaufrSecondStageViewOffers-team-search-input"
              onClick={(e) => e.stopPropagation()}
            />
            {teamSearch && (
              <button
                className="ufaufrSecondStageViewOffers-clear-search-button"
                onClick={() => setTeamSearch("")}
                aria-label="Очистить поиск"
              >
                ×
              </button>
            )}
          </div>

          {/* Список команд */}
          <div className="ufaufrSecondStageViewOffers-teams-list">
            {loading ? (
              <div className="ufaufrSecondStageViewOffers-loading">
                <div className="ufaufrSecondStageViewOffers-spinner"></div>
                <span>Загрузка команд...</span>
              </div>
            ) : filteredTeams.length > 0 ? (
              filteredTeams.map((team, index) => (
                <div
                  key={index}
                  className="ufaufrSecondStageViewOffers-team-item"
                  onClick={() => handleTeamSelect(team)}
                >
                  <span className="ufaufrSecondStageViewOffers-team-name">
                    {team}
                  </span>
                </div>
              ))
            ) : (
              <div className="ufaufrSecondStageViewOffers-empty">
                {teamSearch ? "Команда не найдена" : "Нет доступных команд"}
              </div>
            )}
          </div>

          {/* Информация о поиске */}
          {teamSearch && filteredTeams.length > 0 && (
            <div className="ufaufrSecondStageViewOffers-search-results-info">
              Найдено: {filteredTeams.length} из {teams.length}
            </div>
          )}
        </div>
      )}

      {/* Форма ввода пароля */}
      {showPasswordForm && selectedTeam && (
        <div className="ufaufrSecondStageViewOffers-password-overlay">
          <div className="ufaufrSecondStageViewOffers-password-form-container">
            <div className="ufaufrSecondStageViewOffers-password-form">
              <div className="ufaufrSecondStageViewOffers-password-header">
                <h3 className="ufaufrSecondStageViewOffers-password-title">
                  Авторизация
                </h3>
                <p className="ufaufrSecondStageViewOffers-password-subtitle">
                  Для команды
                </p>
              </div>

              <div className="ufaufrSecondStageViewOffers-selected-team-card">
                <div className="ufaufrSecondStageViewOffers-team-info">
                  <div className="ufaufrSecondStageViewOffers-team-name-large">
                    {selectedTeam}
                  </div>
                  <div className="ufaufrSecondStageViewOffers-team-hint">
                    Введите пароль команды
                  </div>
                </div>
              </div>

              <div className="ufaufrSecondStageViewOffers-password-input-group">
                <div className="ufaufrSecondStageViewOffers-input-wrapper">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="ufaufrSecondStageViewOffers-password-input"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handlePasswordSubmit();
                    }}
                  />
                  {password && (
                    <button
                      className="ufaufrSecondStageViewOffers-input-clear"
                      onClick={() => setPassword("")}
                      aria-label="Очистить пароль"
                    >
                      ×
                    </button>
                  )}
                </div>

                {passwordError && (
                  <div className="ufaufrSecondStageViewOffers-password-error">
                    {passwordError}
                  </div>
                )}

                <div className="ufaufrSecondStageViewOffers-password-buttons">
                  <button
                    className="ufaufrSecondStageViewOffers-password-submit"
                    onClick={handlePasswordSubmit}
                    disabled={isPasswordChecking}
                  >
                    {isPasswordChecking ? (
                      <>
                        <div className="ufaufrSecondStageViewOffers-mini-spinner"></div>
                        Проверка...
                      </>
                    ) : (
                      "Подтвердить"
                    )}
                  </button>
                  <button
                    className="ufaufrSecondStageViewOffers-password-cancel"
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
        <div className="ufaufrSecondStageViewOffers-offers-container">
          <div className="ufaufrSecondStageViewOffers-offers-header">
            <h3 className="ufaufrSecondStageViewOffers-offers-title">
              Мои предложения (2 этап)
            </h3>
            <div className="ufaufrSecondStageViewOffers-team-badge">
              {authorizedTeam}
            </div>
          </div>

          {deleteError && (
            <div className="ufaufrSecondStageViewOffers-delete-error">
              {deleteError}
            </div>
          )}

          {loadingOffers ? (
            <div className="ufaufrSecondStageViewOffers-loading-offers">
              <div className="ufaufrSecondStageViewOffers-spinner"></div>
              <span>Загрузка предложений...</span>
            </div>
          ) : offersError ? (
            <div className="ufaufrSecondStageViewOffers-offers-error">
              {offersError}
            </div>
          ) : offers.length === 0 ? (
            <div className="ufaufrSecondStageViewOffers-no-offers">
              <p>Нет отправленных предложений</p>
              <p className="ufaufrSecondStageViewOffers-empty-subtext">
                Создайте свое первое предложение
              </p>
            </div>
          ) : (
            <div className="ufaufrSecondStageViewOffers-offers-content">
              {/* Статистика - видна только на планшетах и десктопах */}
              <div className="ufaufrSecondStageViewOffers-offers-stats">
                <div className="ufaufrSecondStageViewOffers-stat-card">
                  <div className="ufaufrSecondStageViewOffers-stat-value">
                    {offers.length}
                  </div>
                  <div className="ufaufrSecondStageViewOffers-stat-label">
                    Всего предложений
                  </div>
                </div>
                <div className="ufaufrSecondStageViewOffers-stat-card">
                  <div className="ufaufrSecondStageViewOffers-stat-value">
                    {offers.filter((o) => !o.result).length}
                  </div>
                  <div className="ufaufrSecondStageViewOffers-stat-label">
                    На рассмотрении
                  </div>
                </div>
              </div>

              {/* Десктопная версия (таблица) */}
              <div className="ufaufrSecondStageViewOffers-table-wrapper">
                <table className="ufaufrSecondStageViewOffers-offers-table">
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
                        className="ufaufrSecondStageViewOffers-table-row"
                      >
                        <td>
                          <div className="ufaufrSecondStageViewOffers-player-cell">
                            <span className="ufaufrSecondStageViewOffers-player-name">
                              {offer.player}
                            </span>
                          </div>
                        </td>
                        <td className="ufaufrSecondStageViewOffers-salary-cell">
                          <div className="ufaufrSecondStageViewOffers-salary-years-container">
                            {renderCompactSalaries(offer)}
                          </div>
                        </td>
                        <td className="ufaufrSecondStageViewOffers-type-cell">
                          {formatContractType(offer.type_contract)}
                        </td>
                        <td className="ufaufrSecondStageViewOffers-period-cell">
                          {offer.period_contract}{" "}
                          {offer.period_contract === 1 ? "год" : "года"}
                        </td>
                        <td className="ufaufrSecondStageViewOffers-option-cell">
                          {formatOption(offer.option_contract)}
                        </td>
                        <td className="ufaufrSecondStageViewOffers-bonus-cell">
                          {offer.bonus ? formatCurrency(offer.bonus) : "—"}
                        </td>
                        <td className="ufaufrSecondStageViewOffers-condition-cell">
                          {offer.condition ? (
                            <div className="ufaufrSecondStageViewOffers-condition-tooltip">
                              {offer.condition.length > 15
                                ? `${offer.condition.substring(0, 15)}...`
                                : offer.condition}
                              <div className="ufaufrSecondStageViewOffers-tooltip-text">
                                {offer.condition}
                              </div>
                            </div>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="ufaufrSecondStageViewOffers-status-cell">
                          <span
                            className={`ufaufrSecondStageViewOffers-status-badge ${
                              offer.result
                                ? "ufaufrSecondStageViewOffers-status-processed"
                                : "ufaufrSecondStageViewOffers-status-pending"
                            }`}
                          >
                            {offer.result || "Ожидание"}
                          </span>
                        </td>
                        <td className="ufaufrSecondStageViewOffers-date-cell">
                          {new Date(offer.created_at).toLocaleDateString(
                            "ru-RU",
                          )}
                        </td>
                        <td className="ufaufrSecondStageViewOffers-actions-cell">
                          <button
                            className="ufaufrSecondStageViewOffers-delete-button"
                            onClick={() => handleDeleteOffer(offer.id)}
                            disabled={deletingId === offer.id}
                          >
                            {deletingId === offer.id ? (
                              <>
                                <div className="ufaufrSecondStageViewOffers-mini-spinner"></div>
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
              <div className="ufaufrSecondStageViewOffers-offers-cards">
                {offers.map((offer) => (
                  <div
                    className="ufaufrSecondStageViewOffers-offer-card"
                    key={offer.id}
                  >
                    <div className="ufaufrSecondStageViewOffers-offer-card-header">
                      <h4 className="ufaufrSecondStageViewOffers-offer-player">
                        {offer.player}
                      </h4>
                      <span
                        className={`ufaufrSecondStageViewOffers-offer-status ${
                          offer.result
                            ? "ufaufrSecondStageViewOffers-offer-status-processed"
                            : "ufaufrSecondStageViewOffers-offer-status-pending"
                        }`}
                      >
                        {offer.result || "Ожидание"}
                      </span>
                    </div>

                    <div className="ufaufrSecondStageViewOffers-offer-details">
                      {/* Зарплаты по годам */}
                      <div className="ufaufrSecondStageViewOffers-offer-row salary-years-row">
                        <span className="ufaufrSecondStageViewOffers-offer-label">
                          Зарплата:
                        </span>
                        <div className="ufaufrSecondStageViewOffers-salary-years-list">
                          {renderSalariesByYear(offer)}
                        </div>
                      </div>

                      <div className="ufaufrSecondStageViewOffers-offer-row">
                        <span className="ufaufrSecondStageViewOffers-offer-label">
                          Тип:
                        </span>
                        <span className="ufaufrSecondStageViewOffers-offer-value">
                          {formatContractType(offer.type_contract)}
                        </span>
                      </div>

                      <div className="ufaufrSecondStageViewOffers-offer-row">
                        <span className="ufaufrSecondStageViewOffers-offer-label">
                          Срок:
                        </span>
                        <span className="ufaufrSecondStageViewOffers-offer-value">
                          {offer.period_contract}{" "}
                          {offer.period_contract === 1 ? "год" : "года"}
                        </span>
                      </div>

                      <div className="ufaufrSecondStageViewOffers-offer-row">
                        <span className="ufaufrSecondStageViewOffers-offer-label">
                          Опция:
                        </span>
                        <span className="ufaufrSecondStageViewOffers-offer-value">
                          {formatOption(offer.option_contract)}
                        </span>
                      </div>

                      {offer.bonus > 0 && (
                        <div className="ufaufrSecondStageViewOffers-offer-row">
                          <span className="ufaufrSecondStageViewOffers-offer-label">
                            Бонус:
                          </span>
                          <span className="ufaufrSecondStageViewOffers-offer-value bonus">
                            {formatCurrency(offer.bonus)}
                          </span>
                        </div>
                      )}

                      {offer.condition && (
                        <div className="ufaufrSecondStageViewOffers-offer-row">
                          <span className="ufaufrSecondStageViewOffers-offer-label">
                            Условие:
                          </span>
                          <span className="ufaufrSecondStageViewOffers-offer-value">
                            {offer.condition}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="ufaufrSecondStageViewOffers-offer-card-footer">
                      <span className="ufaufrSecondStageViewOffers-offer-date">
                        {new Date(offer.created_at).toLocaleDateString("ru-RU")}
                      </span>
                      <button
                        className="ufaufrSecondStageViewOffers-card-delete-button"
                        onClick={() => handleDeleteOffer(offer.id)}
                        disabled={deletingId === offer.id}
                      >
                        {deletingId === offer.id ? (
                          <>
                            <div className="ufaufrSecondStageViewOffers-mini-spinner"></div>
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

export default UFAUFRSecondStageViewOffers;
