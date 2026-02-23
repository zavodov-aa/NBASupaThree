// UFAUTRFirstStageViewOffers.tsx
import React, { useState, useEffect, useMemo } from "react";
import { supabase } from "../../../../../../Supabase";
import "./ufaUTRFirstStageViewOffers.css";

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

const UFAUTRFirstStageViewOffers = () => {
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
        .from("Market_UFA_third_round_first_stage") // <-- изменено
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
        .from("Market_UFA_third_round_first_stage") // <-- изменено
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
        !target.closest(".ufautrFirstStageViewOffers-container") &&
        !target.closest(
          ".ufautrFirstStageViewOffers-password-form-container",
        ) &&
        !target.closest(".ufautrFirstStageViewOffers-offers-container")
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
      <div key={salary.year} className="ufautrFirstStageViewOffers-salary-year">
        <span className="ufautrFirstStageViewOffers-salary-year-label">
          {salary.year} год:
        </span>
        <span className="ufautrFirstStageViewOffers-salary-year-value">
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
        className="ufautrFirstStageViewOffers-compact-salary"
      >
        {salary.year}г: {formatCurrency(salary.value)}
      </div>
    ));
  };

  return (
    <div className="ufautrFirstStageViewOffers-container">
      {/* Основная кнопка */}
      <button
        className="ufautrFirstStageViewOffers-button"
        onClick={handleButtonClick}
      >
        <span className="ufautrFirstStageViewOffers-button-text">
          {authorizedTeam
            ? `Команда: ${authorizedTeam}`
            : "Просмотр предложений"}
        </span>
        {!authorizedTeam && (
          <span className="ufautrFirstStageViewOffers-button-arrow">▼</span>
        )}
      </button>

      {/* Кнопка выхода */}
      {authorizedTeam && (
        <button
          className="ufautrFirstStageViewOffers-logout-button"
          onClick={handleLogout}
        >
          Выйти
        </button>
      )}

      {/* Меню выбора команды */}
      {isMenuOpen && !authorizedTeam && (
        <div className="ufautrFirstStageViewOffers-menu">
          <div className="ufautrFirstStageViewOffers-menu-header">
            <div className="ufautrFirstStageViewOffers-menu-title">
              Выбор команды
            </div>
            <div className="ufautrFirstStageViewOffers-menu-subtitle">
              Для доступа к предложениям
            </div>
            <div className="ufautrFirstStageViewOffers-divider"></div>
          </div>

          {/* Поиск команды */}
          <div className="ufautrFirstStageViewOffers-team-search-container">
            <input
              type="text"
              value={teamSearch}
              onChange={(e) => setTeamSearch(e.target.value)}
              placeholder="Поиск команды..."
              className="ufautrFirstStageViewOffers-team-search-input"
              onClick={(e) => e.stopPropagation()}
            />
            {teamSearch && (
              <button
                className="ufautrFirstStageViewOffers-clear-search-button"
                onClick={() => setTeamSearch("")}
                aria-label="Очистить поиск"
              >
                ×
              </button>
            )}
          </div>

          {/* Список команд */}
          <div className="ufautrFirstStageViewOffers-teams-list">
            {loading ? (
              <div className="ufautrFirstStageViewOffers-loading">
                <div className="ufautrFirstStageViewOffers-spinner"></div>
                <span>Загрузка команд...</span>
              </div>
            ) : filteredTeams.length > 0 ? (
              filteredTeams.map((team, index) => (
                <div
                  key={index}
                  className="ufautrFirstStageViewOffers-team-item"
                  onClick={() => handleTeamSelect(team)}
                >
                  <span className="ufautrFirstStageViewOffers-team-name">
                    {team}
                  </span>
                </div>
              ))
            ) : (
              <div className="ufautrFirstStageViewOffers-empty">
                {teamSearch ? "Команда не найдена" : "Нет доступных команд"}
              </div>
            )}
          </div>

          {/* Информация о поиске */}
          {teamSearch && filteredTeams.length > 0 && (
            <div className="ufautrFirstStageViewOffers-search-results-info">
              Найдено: {filteredTeams.length} из {teams.length}
            </div>
          )}
        </div>
      )}

      {/* Форма ввода пароля */}
      {showPasswordForm && selectedTeam && (
        <div className="ufautrFirstStageViewOffers-password-overlay">
          <div className="ufautrFirstStageViewOffers-password-form-container">
            <div className="ufautrFirstStageViewOffers-password-form">
              <div className="ufautrFirstStageViewOffers-password-header">
                <h3 className="ufautrFirstStageViewOffers-password-title">
                  Авторизация
                </h3>
                <p className="ufautrFirstStageViewOffers-password-subtitle">
                  Для команды
                </p>
              </div>

              <div className="ufautrFirstStageViewOffers-selected-team-card">
                <div className="ufautrFirstStageViewOffers-team-info">
                  <div className="ufautrFirstStageViewOffers-team-name-large">
                    {selectedTeam}
                  </div>
                  <div className="ufautrFirstStageViewOffers-team-hint">
                    Введите пароль команды
                  </div>
                </div>
              </div>

              <div className="ufautrFirstStageViewOffers-password-input-group">
                <div className="ufautrFirstStageViewOffers-input-wrapper">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="ufautrFirstStageViewOffers-password-input"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handlePasswordSubmit();
                    }}
                  />
                  {password && (
                    <button
                      className="ufautrFirstStageViewOffers-input-clear"
                      onClick={() => setPassword("")}
                      aria-label="Очистить пароль"
                    >
                      ×
                    </button>
                  )}
                </div>

                {passwordError && (
                  <div className="ufautrFirstStageViewOffers-password-error">
                    {passwordError}
                  </div>
                )}

                <div className="ufautrFirstStageViewOffers-password-buttons">
                  <button
                    className="ufautrFirstStageViewOffers-password-submit"
                    onClick={handlePasswordSubmit}
                    disabled={isPasswordChecking}
                  >
                    {isPasswordChecking ? (
                      <>
                        <div className="ufautrFirstStageViewOffers-mini-spinner"></div>
                        Проверка...
                      </>
                    ) : (
                      "Подтвердить"
                    )}
                  </button>
                  <button
                    className="ufautrFirstStageViewOffers-password-cancel"
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
        <div className="ufautrFirstStageViewOffers-offers-container">
          <div className="ufautrFirstStageViewOffers-offers-header">
            <h3 className="ufautrFirstStageViewOffers-offers-title">
              Мои предложения
            </h3>
            <div className="ufautrFirstStageViewOffers-team-badge">
              {authorizedTeam}
            </div>
          </div>

          {deleteError && (
            <div className="ufautrFirstStageViewOffers-delete-error">
              {deleteError}
            </div>
          )}

          {loadingOffers ? (
            <div className="ufautrFirstStageViewOffers-loading-offers">
              <div className="ufautrFirstStageViewOffers-spinner"></div>
              <span>Загрузка предложений...</span>
            </div>
          ) : offersError ? (
            <div className="ufautrFirstStageViewOffers-offers-error">
              {offersError}
            </div>
          ) : offers.length === 0 ? (
            <div className="ufautrFirstStageViewOffers-no-offers">
              <p>Нет отправленных предложений</p>
              <p className="ufautrFirstStageViewOffers-empty-subtext">
                Создайте свое первое предложение
              </p>
            </div>
          ) : (
            <div className="ufautrFirstStageViewOffers-offers-content">
              {/* Статистика - видна только на планшетах и десктопах */}
              <div className="ufautrFirstStageViewOffers-offers-stats">
                <div className="ufautrFirstStageViewOffers-stat-card">
                  <div className="ufautrFirstStageViewOffers-stat-value">
                    {offers.length}
                  </div>
                  <div className="ufautrFirstStageViewOffers-stat-label">
                    Всего предложений
                  </div>
                </div>
                <div className="ufautrFirstStageViewOffers-stat-card">
                  <div className="ufautrFirstStageViewOffers-stat-value">
                    {offers.filter((o) => !o.result).length}
                  </div>
                  <div className="ufautrFirstStageViewOffers-stat-label">
                    На рассмотрении
                  </div>
                </div>
              </div>

              {/* Десктопная версия (таблица) */}
              <div className="ufautrFirstStageViewOffers-table-wrapper">
                <table className="ufautrFirstStageViewOffers-offers-table">
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
                        className="ufautrFirstStageViewOffers-table-row"
                      >
                        <td>
                          <div className="ufautrFirstStageViewOffers-player-cell">
                            <span className="ufautrFirstStageViewOffers-player-name">
                              {offer.player}
                            </span>
                          </div>
                        </td>
                        <td className="ufautrFirstStageViewOffers-salary-cell">
                          <div className="ufautrFirstStageViewOffers-salary-years-container">
                            {renderCompactSalaries(offer)}
                          </div>
                        </td>
                        <td className="ufautrFirstStageViewOffers-type-cell">
                          {formatContractType(offer.type_contract)}
                        </td>
                        <td className="ufautrFirstStageViewOffers-period-cell">
                          {offer.period_contract}{" "}
                          {offer.period_contract === 1 ? "год" : "года"}
                        </td>
                        <td className="ufautrFirstStageViewOffers-option-cell">
                          {formatOption(offer.option_contract)}
                        </td>
                        <td className="ufautrFirstStageViewOffers-bonus-cell">
                          {offer.bonus ? formatCurrency(offer.bonus) : "—"}
                        </td>
                        <td className="ufautrFirstStageViewOffers-condition-cell">
                          {offer.condition ? (
                            <div className="ufautrFirstStageViewOffers-condition-tooltip">
                              {offer.condition.length > 15
                                ? `${offer.condition.substring(0, 15)}...`
                                : offer.condition}
                              <div className="ufautrFirstStageViewOffers-tooltip-text">
                                {offer.condition}
                              </div>
                            </div>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="ufautrFirstStageViewOffers-status-cell">
                          <span
                            className={`ufautrFirstStageViewOffers-status-badge ${
                              offer.result
                                ? "ufautrFirstStageViewOffers-status-processed"
                                : "ufautrFirstStageViewOffers-status-pending"
                            }`}
                          >
                            {offer.result || "Ожидание"}
                          </span>
                        </td>
                        <td className="ufautrFirstStageViewOffers-date-cell">
                          {new Date(offer.created_at).toLocaleDateString(
                            "ru-RU",
                          )}
                        </td>
                        <td className="ufautrFirstStageViewOffers-actions-cell">
                          <button
                            className="ufautrFirstStageViewOffers-delete-button"
                            onClick={() => handleDeleteOffer(offer.id)}
                            disabled={deletingId === offer.id}
                          >
                            {deletingId === offer.id ? (
                              <>
                                <div className="ufautrFirstStageViewOffers-mini-spinner"></div>
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
              <div className="ufautrFirstStageViewOffers-offers-cards">
                {offers.map((offer) => (
                  <div
                    className="ufautrFirstStageViewOffers-offer-card"
                    key={offer.id}
                  >
                    <div className="ufautrFirstStageViewOffers-offer-card-header">
                      <h4 className="ufautrFirstStageViewOffers-offer-player">
                        {offer.player}
                      </h4>
                      <span
                        className={`ufautrFirstStageViewOffers-offer-status ${
                          offer.result
                            ? "ufautrFirstStageViewOffers-offer-status-processed"
                            : "ufautrFirstStageViewOffers-offer-status-pending"
                        }`}
                      >
                        {offer.result || "Ожидание"}
                      </span>
                    </div>

                    <div className="ufautrFirstStageViewOffers-offer-details">
                      {/* Зарплаты по годам */}
                      <div className="ufautrFirstStageViewOffers-offer-row salary-years-row">
                        <span className="ufautrFirstStageViewOffers-offer-label">
                          Зарплата:
                        </span>
                        <div className="ufautrFirstStageViewOffers-salary-years-list">
                          {renderSalariesByYear(offer)}
                        </div>
                      </div>

                      <div className="ufautrFirstStageViewOffers-offer-row">
                        <span className="ufautrFirstStageViewOffers-offer-label">
                          Тип:
                        </span>
                        <span className="ufautrFirstStageViewOffers-offer-value">
                          {formatContractType(offer.type_contract)}
                        </span>
                      </div>

                      <div className="ufautrFirstStageViewOffers-offer-row">
                        <span className="ufautrFirstStageViewOffers-offer-label">
                          Срок:
                        </span>
                        <span className="ufautrFirstStageViewOffers-offer-value">
                          {offer.period_contract}{" "}
                          {offer.period_contract === 1 ? "год" : "года"}
                        </span>
                      </div>

                      <div className="ufautrFirstStageViewOffers-offer-row">
                        <span className="ufautrFirstStageViewOffers-offer-label">
                          Опция:
                        </span>
                        <span className="ufautrFirstStageViewOffers-offer-value">
                          {formatOption(offer.option_contract)}
                        </span>
                      </div>

                      {offer.bonus > 0 && (
                        <div className="ufautrFirstStageViewOffers-offer-row">
                          <span className="ufautrFirstStageViewOffers-offer-label">
                            Бонус:
                          </span>
                          <span className="ufautrFirstStageViewOffers-offer-value bonus">
                            {formatCurrency(offer.bonus)}
                          </span>
                        </div>
                      )}

                      {offer.condition && (
                        <div className="ufautrFirstStageViewOffers-offer-row">
                          <span className="ufautrFirstStageViewOffers-offer-label">
                            Условие:
                          </span>
                          <span className="ufautrFirstStageViewOffers-offer-value">
                            {offer.condition}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="ufautrFirstStageViewOffers-offer-card-footer">
                      <span className="ufautrFirstStageViewOffers-offer-date">
                        {new Date(offer.created_at).toLocaleDateString("ru-RU")}
                      </span>
                      <button
                        className="ufautrFirstStageViewOffers-card-delete-button"
                        onClick={() => handleDeleteOffer(offer.id)}
                        disabled={deletingId === offer.id}
                      >
                        {deletingId === offer.id ? (
                          <>
                            <div className="ufautrFirstStageViewOffers-mini-spinner"></div>
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

export default UFAUTRFirstStageViewOffers;
