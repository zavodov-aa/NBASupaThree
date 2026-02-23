import React, { useState, useEffect, useMemo } from "react";
import { supabase } from "../../../../../../Supabase";
import "./ufaufrFirstStageViewOffers.css"; // Импорт CSS с новым именем

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

const UFAUFRFirstStageViewOffers = () => {
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
        .from("Market_UFA_first_round_first_stage") // Изменено на нужную таблицу
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
        .from("Market_UFA_first_round_first_stage") // Изменено на нужную таблицу
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
        !target.closest(".ufaufrFirstStageViewOffers-container") &&
        !target.closest(
          ".ufaufrFirstStageViewOffers-password-form-container",
        ) &&
        !target.closest(".ufaufrFirstStageViewOffers-offers-container")
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
      <div key={salary.year} className="ufaufrFirstStageViewOffers-salary-year">
        <span className="ufaufrFirstStageViewOffers-salary-year-label">
          {salary.year} год:
        </span>
        <span className="ufaufrFirstStageViewOffers-salary-year-value">
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
        className="ufaufrFirstStageViewOffers-compact-salary"
      >
        {salary.year}г: {formatCurrency(salary.value)}
      </div>
    ));
  };

  return (
    <div className="ufaufrFirstStageViewOffers-container">
      {/* Основная кнопка */}
      <button
        className="ufaufrFirstStageViewOffers-button"
        onClick={handleButtonClick}
      >
        <span className="ufaufrFirstStageViewOffers-button-text">
          {authorizedTeam
            ? `Команда: ${authorizedTeam}`
            : "Просмотр предложений"}
        </span>
        {!authorizedTeam && (
          <span className="ufaufrFirstStageViewOffers-button-arrow">▼</span>
        )}
      </button>

      {/* Кнопка выхода */}
      {authorizedTeam && (
        <button
          className="ufaufrFirstStageViewOffers-logout-button"
          onClick={handleLogout}
        >
          Выйти
        </button>
      )}

      {/* Меню выбора команды */}
      {isMenuOpen && !authorizedTeam && (
        <div className="ufaufrFirstStageViewOffers-menu">
          <div className="ufaufrFirstStageViewOffers-menu-header">
            <div className="ufaufrFirstStageViewOffers-menu-title">
              Выбор команды
            </div>
            <div className="ufaufrFirstStageViewOffers-menu-subtitle">
              Для доступа к предложениям
            </div>
            <div className="ufaufrFirstStageViewOffers-divider"></div>
          </div>

          {/* Поиск команды */}
          <div className="ufaufrFirstStageViewOffers-team-search-container">
            <input
              type="text"
              value={teamSearch}
              onChange={(e) => setTeamSearch(e.target.value)}
              placeholder="Поиск команды..."
              className="ufaufrFirstStageViewOffers-team-search-input"
              onClick={(e) => e.stopPropagation()}
            />
            {teamSearch && (
              <button
                className="ufaufrFirstStageViewOffers-clear-search-button"
                onClick={() => setTeamSearch("")}
                aria-label="Очистить поиск"
              >
                ×
              </button>
            )}
          </div>

          {/* Список команд */}
          <div className="ufaufrFirstStageViewOffers-teams-list">
            {loading ? (
              <div className="ufaufrFirstStageViewOffers-loading">
                <div className="ufaufrFirstStageViewOffers-spinner"></div>
                <span>Загрузка команд...</span>
              </div>
            ) : filteredTeams.length > 0 ? (
              filteredTeams.map((team, index) => (
                <div
                  key={index}
                  className="ufaufrFirstStageViewOffers-team-item"
                  onClick={() => handleTeamSelect(team)}
                >
                  <span className="ufaufrFirstStageViewOffers-team-name">
                    {team}
                  </span>
                </div>
              ))
            ) : (
              <div className="ufaufrFirstStageViewOffers-empty">
                {teamSearch ? "Команда не найдена" : "Нет доступных команд"}
              </div>
            )}
          </div>

          {/* Информация о поиске */}
          {teamSearch && filteredTeams.length > 0 && (
            <div className="ufaufrFirstStageViewOffers-search-results-info">
              Найдено: {filteredTeams.length} из {teams.length}
            </div>
          )}
        </div>
      )}

      {/* Форма ввода пароля */}
      {showPasswordForm && selectedTeam && (
        <div className="ufaufrFirstStageViewOffers-password-overlay">
          <div className="ufaufrFirstStageViewOffers-password-form-container">
            <div className="ufaufrFirstStageViewOffers-password-form">
              <div className="ufaufrFirstStageViewOffers-password-header">
                <h3 className="ufaufrFirstStageViewOffers-password-title">
                  Авторизация
                </h3>
                <p className="ufaufrFirstStageViewOffers-password-subtitle">
                  Для команды
                </p>
              </div>

              <div className="ufaufrFirstStageViewOffers-selected-team-card">
                <div className="ufaufrFirstStageViewOffers-team-info">
                  <div className="ufaufrFirstStageViewOffers-team-name-large">
                    {selectedTeam}
                  </div>
                  <div className="ufaufrFirstStageViewOffers-team-hint">
                    Введите пароль команды
                  </div>
                </div>
              </div>

              <div className="ufaufrFirstStageViewOffers-password-input-group">
                <div className="ufaufrFirstStageViewOffers-input-wrapper">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="ufaufrFirstStageViewOffers-password-input"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handlePasswordSubmit();
                    }}
                  />
                  {password && (
                    <button
                      className="ufaufrFirstStageViewOffers-input-clear"
                      onClick={() => setPassword("")}
                      aria-label="Очистить пароль"
                    >
                      ×
                    </button>
                  )}
                </div>

                {passwordError && (
                  <div className="ufaufrFirstStageViewOffers-password-error">
                    {passwordError}
                  </div>
                )}

                <div className="ufaufrFirstStageViewOffers-password-buttons">
                  <button
                    className="ufaufrFirstStageViewOffers-password-submit"
                    onClick={handlePasswordSubmit}
                    disabled={isPasswordChecking}
                  >
                    {isPasswordChecking ? (
                      <>
                        <div className="ufaufrFirstStageViewOffers-mini-spinner"></div>
                        Проверка...
                      </>
                    ) : (
                      "Подтвердить"
                    )}
                  </button>
                  <button
                    className="ufaufrFirstStageViewOffers-password-cancel"
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
        <div className="ufaufrFirstStageViewOffers-offers-container">
          <div className="ufaufrFirstStageViewOffers-offers-header">
            <h3 className="ufaufrFirstStageViewOffers-offers-title">
              Мои предложения
            </h3>
            <div className="ufaufrFirstStageViewOffers-team-badge">
              {authorizedTeam}
            </div>
          </div>

          {deleteError && (
            <div className="ufaufrFirstStageViewOffers-delete-error">
              {deleteError}
            </div>
          )}

          {loadingOffers ? (
            <div className="ufaufrFirstStageViewOffers-loading-offers">
              <div className="ufaufrFirstStageViewOffers-spinner"></div>
              <span>Загрузка предложений...</span>
            </div>
          ) : offersError ? (
            <div className="ufaufrFirstStageViewOffers-offers-error">
              {offersError}
            </div>
          ) : offers.length === 0 ? (
            <div className="ufaufrFirstStageViewOffers-no-offers">
              <p>Нет отправленных предложений</p>
              <p className="ufaufrFirstStageViewOffers-empty-subtext">
                Создайте свое первое предложение
              </p>
            </div>
          ) : (
            <div className="ufaufrFirstStageViewOffers-offers-content">
              {/* Статистика - видна только на планшетах и десктопах */}
              <div className="ufaufrFirstStageViewOffers-offers-stats">
                <div className="ufaufrFirstStageViewOffers-stat-card">
                  <div className="ufaufrFirstStageViewOffers-stat-value">
                    {offers.length}
                  </div>
                  <div className="ufaufrFirstStageViewOffers-stat-label">
                    Всего предложений
                  </div>
                </div>
                <div className="ufaufrFirstStageViewOffers-stat-card">
                  <div className="ufaufrFirstStageViewOffers-stat-value">
                    {offers.filter((o) => !o.result).length}
                  </div>
                  <div className="ufaufrFirstStageViewOffers-stat-label">
                    На рассмотрении
                  </div>
                </div>
              </div>

              {/* Десктопная версия (таблица) */}
              <div className="ufaufrFirstStageViewOffers-table-wrapper">
                <table className="ufaufrFirstStageViewOffers-offers-table">
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
                        className="ufaufrFirstStageViewOffers-table-row"
                      >
                        <td>
                          <div className="ufaufrFirstStageViewOffers-player-cell">
                            <span className="ufaufrFirstStageViewOffers-player-name">
                              {offer.player}
                            </span>
                          </div>
                        </td>
                        <td className="ufaufrFirstStageViewOffers-salary-cell">
                          <div className="ufaufrFirstStageViewOffers-salary-years-container">
                            {renderCompactSalaries(offer)}
                          </div>
                        </td>
                        <td className="ufaufrFirstStageViewOffers-type-cell">
                          {formatContractType(offer.type_contract)}
                        </td>
                        <td className="ufaufrFirstStageViewOffers-period-cell">
                          {offer.period_contract}{" "}
                          {offer.period_contract === 1 ? "год" : "года"}
                        </td>
                        <td className="ufaufrFirstStageViewOffers-option-cell">
                          {formatOption(offer.option_contract)}
                        </td>
                        <td className="ufaufrFirstStageViewOffers-bonus-cell">
                          {offer.bonus ? formatCurrency(offer.bonus) : "—"}
                        </td>
                        <td className="ufaufrFirstStageViewOffers-condition-cell">
                          {offer.condition ? (
                            <div className="ufaufrFirstStageViewOffers-condition-tooltip">
                              {offer.condition.length > 15
                                ? `${offer.condition.substring(0, 15)}...`
                                : offer.condition}
                              <div className="ufaufrFirstStageViewOffers-tooltip-text">
                                {offer.condition}
                              </div>
                            </div>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="ufaufrFirstStageViewOffers-status-cell">
                          <span
                            className={`ufaufrFirstStageViewOffers-status-badge ${
                              offer.result
                                ? "ufaufrFirstStageViewOffers-status-processed"
                                : "ufaufrFirstStageViewOffers-status-pending"
                            }`}
                          >
                            {offer.result || "Ожидание"}
                          </span>
                        </td>
                        <td className="ufaufrFirstStageViewOffers-date-cell">
                          {new Date(offer.created_at).toLocaleDateString(
                            "ru-RU",
                          )}
                        </td>
                        <td className="ufaufrFirstStageViewOffers-actions-cell">
                          <button
                            className="ufaufrFirstStageViewOffers-delete-button"
                            onClick={() => handleDeleteOffer(offer.id)}
                            disabled={deletingId === offer.id}
                          >
                            {deletingId === offer.id ? (
                              <>
                                <div className="ufaufrFirstStageViewOffers-mini-spinner"></div>
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
              <div className="ufaufrFirstStageViewOffers-offers-cards">
                {offers.map((offer) => (
                  <div
                    className="ufaufrFirstStageViewOffers-offer-card"
                    key={offer.id}
                  >
                    <div className="ufaufrFirstStageViewOffers-offer-card-header">
                      <h4 className="ufaufrFirstStageViewOffers-offer-player">
                        {offer.player}
                      </h4>
                      <span
                        className={`ufaufrFirstStageViewOffers-offer-status ${
                          offer.result
                            ? "ufaufrFirstStageViewOffers-offer-status-processed"
                            : "ufaufrFirstStageViewOffers-offer-status-pending"
                        }`}
                      >
                        {offer.result || "Ожидание"}
                      </span>
                    </div>

                    <div className="ufaufrFirstStageViewOffers-offer-details">
                      {/* Зарплаты по годам */}
                      <div className="ufaufrFirstStageViewOffers-offer-row salary-years-row">
                        <span className="ufaufrFirstStageViewOffers-offer-label">
                          Зарплата:
                        </span>
                        <div className="ufaufrFirstStageViewOffers-salary-years-list">
                          {renderSalariesByYear(offer)}
                        </div>
                      </div>

                      <div className="ufaufrFirstStageViewOffers-offer-row">
                        <span className="ufaufrFirstStageViewOffers-offer-label">
                          Тип:
                        </span>
                        <span className="ufaufrFirstStageViewOffers-offer-value">
                          {formatContractType(offer.type_contract)}
                        </span>
                      </div>

                      <div className="ufaufrFirstStageViewOffers-offer-row">
                        <span className="ufaufrFirstStageViewOffers-offer-label">
                          Срок:
                        </span>
                        <span className="ufaufrFirstStageViewOffers-offer-value">
                          {offer.period_contract}{" "}
                          {offer.period_contract === 1 ? "год" : "года"}
                        </span>
                      </div>

                      <div className="ufaufrFirstStageViewOffers-offer-row">
                        <span className="ufaufrFirstStageViewOffers-offer-label">
                          Опция:
                        </span>
                        <span className="ufaufrFirstStageViewOffers-offer-value">
                          {formatOption(offer.option_contract)}
                        </span>
                      </div>

                      {offer.bonus > 0 && (
                        <div className="ufaufrFirstStageViewOffers-offer-row">
                          <span className="ufaufrFirstStageViewOffers-offer-label">
                            Бонус:
                          </span>
                          <span className="ufaufrFirstStageViewOffers-offer-value bonus">
                            {formatCurrency(offer.bonus)}
                          </span>
                        </div>
                      )}

                      {offer.condition && (
                        <div className="ufaufrFirstStageViewOffers-offer-row">
                          <span className="ufaufrFirstStageViewOffers-offer-label">
                            Условие:
                          </span>
                          <span className="ufaufrFirstStageViewOffers-offer-value">
                            {offer.condition}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="ufaufrFirstStageViewOffers-offer-card-footer">
                      <span className="ufaufrFirstStageViewOffers-offer-date">
                        {new Date(offer.created_at).toLocaleDateString("ru-RU")}
                      </span>
                      <button
                        className="ufaufrFirstStageViewOffers-card-delete-button"
                        onClick={() => handleDeleteOffer(offer.id)}
                        disabled={deletingId === offer.id}
                      >
                        {deletingId === offer.id ? (
                          <>
                            <div className="ufaufrFirstStageViewOffers-mini-spinner"></div>
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

export default UFAUFRFirstStageViewOffers;
