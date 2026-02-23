import React, { useState, useEffect, useCallback, useRef } from "react";
import "./ufafrFirstSrageForm.css"; // импортируем новый CSS файл
import { supabase } from "../../../../../../Supabase";

interface Player {
  id: string;
  active_roster: string;
  opt: string;
}

interface Team {
  id: string;
  team_name: string;
}

type ContractType = "flat" | "front" | "back" | "bird";

interface ContractOption {
  id: ContractType;
  label: string;
  description: string;
}

type SigningConditionType = "always" | "other";

interface SigningConditionOption {
  id: SigningConditionType;
  label: string;
}

interface ContractLengthOption {
  id: number;
  label: string;
}

interface ContractClauseOption {
  id: string;
  label: string;
}

const CONTRACT_OPTIONS: ContractOption[] = [
  { id: "flat", label: "Flat (0%)", description: "Без изменения каждый год" },
  {
    id: "front",
    label: "Front (-5%)",
    description: "Уменьшается на 5% каждый год",
  },
  {
    id: "back",
    label: "Back (+5%)",
    description: "Возрастает на 5% каждый год",
  },
  {
    id: "bird",
    label: "Bird (+8%)",
    description: "Возрастает на 8% каждый год",
  },
];

const CONTRACT_LENGTH_OPTIONS: ContractLengthOption[] = [
  { id: 1, label: "1 год" },
  { id: 2, label: "2 года" },
  { id: 3, label: "3 года" },
  { id: 4, label: "4 года" },
];

const CONTRACT_CLAUSE_OPTIONS: ContractClauseOption[] = [
  { id: "none", label: "Без опции" },
  { id: "team", label: "Опция команды" },
  { id: "player", label: "Опция игрока" },
];

const SIGNING_CONDITION_OPTIONS: SigningConditionOption[] = [
  { id: "always", label: "Готов подписать при любых обстоятельствах" },
  { id: "other", label: "Другое" },
];

const MINIMUM_SALARY_NOTES = [
  { experience: "0", salary: "1 180 461" },
  { experience: "1", salary: "1 899 777" },
  { experience: "2", salary: "2 129 568" },
  { experience: "3", salary: "2 206 167" },
  { experience: "4", salary: "2 282 766" },
  { experience: "5", salary: "2 474 259" },
  { experience: "6", salary: "2 665 756" },
  { experience: "7", salary: "2 857 252" },
  { experience: "8", salary: "3 048 748" },
  { experience: "9", salary: "3 063 926" },
  { experience: "10+", salary: "3 370 318" },
];

const UFAUFRFirstStageForm: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [contractAmount, setContractAmount] = useState<string>("");
  const [bonusPercentage, setBonusPercentage] = useState<string>("");
  const [selectedContractType, setSelectedContractType] =
    useState<ContractOption | null>(null);
  const [selectedContractLength, setSelectedContractLength] =
    useState<ContractLengthOption | null>(null);
  const [selectedContractClause, setSelectedContractClause] =
    useState<ContractClauseOption | null>(null);
  const [selectedSigningCondition, setSelectedSigningCondition] =
    useState<SigningConditionOption | null>(null);
  const [comment, setComment] = useState<string>("");
  const [isTeamOpen, setIsTeamOpen] = useState<boolean>(false);
  const [isPlayerOpen, setIsPlayerOpen] = useState<boolean>(false);
  const [isContractTypeOpen, setIsContractTypeOpen] = useState<boolean>(false);
  const [isContractLengthOpen, setIsContractLengthOpen] =
    useState<boolean>(false);
  const [isContractClauseOpen, setIsContractClauseOpen] =
    useState<boolean>(false);
  const [isSigningConditionOpen, setIsSigningConditionOpen] =
    useState<boolean>(false);
  const [loadingTeams, setLoadingTeams] = useState<boolean>(false);
  const [loadingPlayers, setLoadingPlayers] = useState<boolean>(false);
  const [teamError, setTeamError] = useState<string | null>(null);
  const [playerError, setPlayerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [yearlyContractAmounts, setYearlyContractAmounts] = useState<number[]>(
    [],
  );

  const teamDropdownRef = useRef<HTMLDivElement>(null);
  const playerDropdownRef = useRef<HTMLDivElement>(null);
  const contractInputRef = useRef<HTMLInputElement>(null);
  const bonusInputRef = useRef<HTMLInputElement>(null);
  const contractTypeDropdownRef = useRef<HTMLDivElement>(null);
  const contractLengthDropdownRef = useRef<HTMLDivElement>(null);
  const contractClauseDropdownRef = useRef<HTMLDivElement>(null);
  const signingConditionDropdownRef = useRef<HTMLDivElement>(null);
  const commentInputRef = useRef<HTMLInputElement>(null);

  // Функция для расчета суммы контракта по годам
  const calculateYearlyContractAmounts = useCallback(() => {
    if (!contractAmount || !selectedContractType || !selectedContractLength) {
      setYearlyContractAmounts([]);
      return;
    }

    const baseAmount = parseInt(contractAmount.replace(/\s/g, ""), 10);
    const years = selectedContractLength.id;
    const amounts: number[] = [];

    for (let year = 1; year <= years; year++) {
      let yearAmount = baseAmount;

      if (selectedContractType.id === "front") {
        const decreaseFactor = 0.95;
        yearAmount = Math.round(
          baseAmount * Math.pow(decreaseFactor, year - 1),
        );
      } else if (selectedContractType.id === "back") {
        const increaseFactor = 1.05;
        yearAmount = Math.round(
          baseAmount * Math.pow(increaseFactor, year - 1),
        );
      } else if (selectedContractType.id === "bird") {
        const increaseFactor = 1.08;
        yearAmount = Math.round(
          baseAmount * Math.pow(increaseFactor, year - 1),
        );
      }

      amounts.push(yearAmount);
    }

    setYearlyContractAmounts(amounts);
  }, [contractAmount, selectedContractType, selectedContractLength]);

  // Вызываем расчет при изменении зависимостей
  useEffect(() => {
    calculateYearlyContractAmounts();
  }, [calculateYearlyContractAmounts]);

  // Функция для форматирования суммы с разделителями
  const formatAmount = (amount: number): string => {
    return amount.toLocaleString("ru-RU").replace(/,/g, " ");
  };

  // Функция для получения пометки опции для года
  const getYearOptionLabel = (yearIndex: number): string | null => {
    const isLastYear = yearIndex === yearlyContractAmounts.length - 1;

    if (!isLastYear || !selectedContractClause) {
      return null;
    }

    switch (selectedContractClause.id) {
      case "team":
        return "TO";
      case "player":
        return "PO";
      default:
        return null;
    }
  };

  // Загрузка команд
  const fetchTeams = useCallback(async (): Promise<void> => {
    setLoadingTeams(true);
    setTeamError(null);

    try {
      const { data, error } = await supabase
        .from("Head")
        .select("id, team_name")
        .order("team_name", { ascending: true });

      if (error) throw error;
      setTeams(data || []);
    } catch (err: any) {
      console.error("Error fetching teams:", err);
      setTeamError(err.message || "Failed to load teams");
    } finally {
      setLoadingTeams(false);
    }
  }, []);

  // Загрузка игроков (UFA вместо RFA)
  const fetchPlayers = useCallback(async (): Promise<void> => {
    setLoadingPlayers(true);
    setPlayerError(null);

    try {
      const { data, error } = await supabase
        .from("Players")
        .select("id, active_roster, opt")
        .eq("opt", "UFA") // ИЗМЕНЕНО: RFA -> UFA
        .not("active_roster", "is", null)
        .order("active_roster", { ascending: true });

      if (error) throw error;
      setPlayers(data || []);
    } catch (err: any) {
      console.error("Error fetching players:", err);
      setPlayerError(err.message || "Failed to load players");
    } finally {
      setLoadingPlayers(false);
    }
  }, []);

  // Функция отправки данных в Supabase
  const handleSubmit = useCallback(async (): Promise<void> => {
    if (!selectedTeam) {
      setSubmitError("Пожалуйста, выберите команду NBA");
      return;
    }
    if (!selectedPlayer) {
      setSubmitError("Пожалуйста, выберите игрока UFA"); // ИЗМЕНЕНО: RFA -> UFA
      return;
    }
    if (!contractAmount) {
      setSubmitError("Пожалуйста, укажите сумму контракта");
      return;
    }
    if (!selectedContractType) {
      setSubmitError("Пожалуйста, выберите тип контракта");
      return;
    }
    if (!selectedContractLength) {
      setSubmitError("Пожалуйста, выберите срок контракта");
      return;
    }
    if (!selectedSigningCondition) {
      setSubmitError("Пожалуйста, выберите условие подписания");
      return;
    }

    if (yearlyContractAmounts.length === 0) {
      setSubmitError("Не удалось рассчитать сумму контракта по годам");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      // Создаем объект с данными для вставки
      const dataToInsert: any = {
        team: selectedTeam.team_name,
        player: selectedPlayer.active_roster,
        salary: parseInt(contractAmount.replace(/\s/g, ""), 10),
        type_contract: selectedContractType.id,
        period_contract: selectedContractLength.id,
        option_contract: selectedContractClause?.id || null,
        bonus: bonusPercentage ? Math.round(parseFloat(bonusPercentage)) : null,
        condition:
          selectedSigningCondition.id === "always" ? "always" : comment || null,
        created_at: new Date().toISOString(),
      };

      // Добавляем зарплаты по годам в отдельные колонки
      const yearlySalaries = yearlyContractAmounts;

      if (yearlySalaries.length >= 1) {
        dataToInsert.salary_one = yearlySalaries[0];
      }
      if (yearlySalaries.length >= 2) {
        dataToInsert.salary_two = yearlySalaries[1];
      }
      if (yearlySalaries.length >= 3) {
        dataToInsert.salary_three = yearlySalaries[2];
      }
      if (yearlySalaries.length >= 4) {
        dataToInsert.salary_four = yearlySalaries[3];
      }

      console.log("Отправляемые данные:", dataToInsert);
      console.log("Сумма по годам:", yearlyContractAmounts);

      // ИЗМЕНЕНО: таблица сохранения
      const { error } = await supabase
        .from("Market_UFA_first_round_first_stage")
        .insert([dataToInsert]);

      if (error) throw error;

      setSubmitSuccess(true);
      console.log(
        "Данные успешно сохранены в таблицу Market_UFA_first_round_first_stage",
      );

      // Сброс всех полей формы
      setSelectedTeam(null);
      setSelectedPlayer(null);
      setContractAmount("");
      setBonusPercentage("");
      setSelectedContractType(null);
      setSelectedContractLength(null);
      setSelectedContractClause(null);
      setSelectedSigningCondition(null);
      setComment("");
      setYearlyContractAmounts([]);

      // Очистка refs
      if (contractInputRef.current) contractInputRef.current.value = "";
      if (bonusInputRef.current) bonusInputRef.current.value = "";
      if (commentInputRef.current) commentInputRef.current.value = "";
    } catch (err: any) {
      console.error("Ошибка при сохранении данных:", err);
      setSubmitError(err.message || "Произошла ошибка при отправке данных");
    } finally {
      setIsSubmitting(false);
    }
  }, [
    selectedTeam,
    selectedPlayer,
    contractAmount,
    selectedContractType,
    selectedContractLength,
    selectedContractClause,
    bonusPercentage,
    selectedSigningCondition,
    comment,
    yearlyContractAmounts,
  ]);

  // Обработчики для команд
  const toggleTeamDropdown = useCallback((): void => {
    if (!isTeamOpen && teams.length === 0) {
      fetchTeams();
    }
    setIsTeamOpen((prev) => !prev);
    setIsPlayerOpen(false);
    setIsContractTypeOpen(false);
    setIsContractLengthOpen(false);
    setIsContractClauseOpen(false);
    setIsSigningConditionOpen(false);
  }, [isTeamOpen, teams.length, fetchTeams]);

  const handleTeamSelect = useCallback((team: Team): void => {
    setSelectedTeam(team);
    setIsTeamOpen(false);
    console.log("Selected team:", team);
  }, []);

  const clearTeamSelection = useCallback((e: React.MouseEvent): void => {
    e.stopPropagation();
    setSelectedTeam(null);
  }, []);

  // Обработчики для игроков
  const togglePlayerDropdown = useCallback((): void => {
    if (!isPlayerOpen && players.length === 0) {
      fetchPlayers();
    }
    setIsPlayerOpen((prev) => !prev);
    setIsTeamOpen(false);
    setIsContractTypeOpen(false);
    setIsContractLengthOpen(false);
    setIsContractClauseOpen(false);
    setIsSigningConditionOpen(false);
  }, [isPlayerOpen, players.length, fetchPlayers]);

  const handlePlayerSelect = useCallback((player: Player): void => {
    setSelectedPlayer(player);
    setIsPlayerOpen(false);
    console.log("Selected player:", player);
  }, []);

  const clearPlayerSelection = useCallback((e: React.MouseEvent): void => {
    e.stopPropagation();
    setSelectedPlayer(null);
  }, []);

  // Обработчики для типа контракта
  const toggleContractTypeDropdown = useCallback((): void => {
    setIsContractTypeOpen((prev) => !prev);
    setIsTeamOpen(false);
    setIsPlayerOpen(false);
    setIsContractLengthOpen(false);
    setIsContractClauseOpen(false);
    setIsSigningConditionOpen(false);
  }, []);

  const handleContractTypeSelect = useCallback(
    (contractType: ContractOption): void => {
      setSelectedContractType(contractType);
      setIsContractTypeOpen(false);
      console.log("Selected contract type:", contractType);
    },
    [],
  );

  const clearContractTypeSelection = useCallback(
    (e: React.MouseEvent): void => {
      e.stopPropagation();
      setSelectedContractType(null);
    },
    [],
  );

  // Обработчики для срока контракта
  const toggleContractLengthDropdown = useCallback((): void => {
    setIsContractLengthOpen((prev) => !prev);
    setIsTeamOpen(false);
    setIsPlayerOpen(false);
    setIsContractTypeOpen(false);
    setIsContractClauseOpen(false);
    setIsSigningConditionOpen(false);
  }, []);

  const handleContractLengthSelect = useCallback(
    (contractLength: ContractLengthOption): void => {
      setSelectedContractLength(contractLength);
      setIsContractLengthOpen(false);
      console.log("Selected contract length:", contractLength);
    },
    [],
  );

  const clearContractLengthSelection = useCallback(
    (e: React.MouseEvent): void => {
      e.stopPropagation();
      setSelectedContractLength(null);
    },
    [],
  );

  // Обработчики для опции контракта
  const toggleContractClauseDropdown = useCallback((): void => {
    setIsContractClauseOpen((prev) => !prev);
    setIsTeamOpen(false);
    setIsPlayerOpen(false);
    setIsContractTypeOpen(false);
    setIsContractLengthOpen(false);
    setIsSigningConditionOpen(false);
  }, []);

  const handleContractClauseSelect = useCallback(
    (contractClause: ContractClauseOption): void => {
      setSelectedContractClause(contractClause);
      setIsContractClauseOpen(false);
      console.log("Selected contract clause:", contractClause);
    },
    [],
  );

  const clearContractClauseSelection = useCallback(
    (e: React.MouseEvent): void => {
      e.stopPropagation();
      setSelectedContractClause(null);
    },
    [],
  );

  // Обработчики для условий подписания
  const toggleSigningConditionDropdown = useCallback((): void => {
    setIsSigningConditionOpen((prev) => !prev);
    setIsTeamOpen(false);
    setIsPlayerOpen(false);
    setIsContractTypeOpen(false);
    setIsContractLengthOpen(false);
    setIsContractClauseOpen(false);
  }, []);

  const handleSigningConditionSelect = useCallback(
    (condition: SigningConditionOption): void => {
      setSelectedSigningCondition(condition);
      setIsSigningConditionOpen(false);
      console.log("Selected signing condition:", condition);

      if (condition.id === "always") {
        setComment("");
      }
    },
    [],
  );

  const clearSigningConditionSelection = useCallback(
    (e: React.MouseEvent): void => {
      e.stopPropagation();
      setSelectedSigningCondition(null);
      setComment("");
    },
    [],
  );

  // Обработчик ввода суммы контракта
  const handleContractAmountChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      let value = e.target.value;
      value = value.replace(/[^\d]/g, "");

      const formattedValue = value.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
      setContractAmount(value);

      if (contractInputRef.current) {
        contractInputRef.current.value = formattedValue;
      }
    },
    [],
  );

  // Очистка суммы контракта
  const clearContractAmount = useCallback((): void => {
    setContractAmount("");
    if (contractInputRef.current) {
      contractInputRef.current.value = "";
      contractInputRef.current.focus();
    }
  }, []);

  // Обработчик ввода процента бонуса
  const handleBonusPercentageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      let value = e.target.value;

      value = value.replace(/[^\d.]/g, "");

      const parts = value.split(".");
      if (parts.length > 2) {
        value = parts[0] + "." + parts.slice(1).join("");
      }

      setBonusPercentage(value);

      if (bonusInputRef.current) {
        bonusInputRef.current.value = value;
      }
    },
    [],
  );

  // Очистка процента бонуса
  const clearBonusPercentage = useCallback((): void => {
    setBonusPercentage("");
    if (bonusInputRef.current) {
      bonusInputRef.current.value = "";
      bonusInputRef.current.focus();
    }
  }, []);

  // Обработчик ввода комментария
  const handleCommentChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      setComment(e.target.value);
    },
    [],
  );

  // Очистка комментария
  const clearComment = useCallback((): void => {
    setComment("");
    if (commentInputRef.current) {
      commentInputRef.current.value = "";
      commentInputRef.current.focus();
    }
  }, []);

  // Закрытие dropdown при клике вне их
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        teamDropdownRef.current?.contains(target) ||
        playerDropdownRef.current?.contains(target) ||
        contractTypeDropdownRef.current?.contains(target) ||
        contractLengthDropdownRef.current?.contains(target) ||
        contractClauseDropdownRef.current?.contains(target) ||
        signingConditionDropdownRef.current?.contains(target)
      ) {
        return;
      }

      setIsTeamOpen(false);
      setIsPlayerOpen(false);
      setIsContractTypeOpen(false);
      setIsContractLengthOpen(false);
      setIsContractClauseOpen(false);
      setIsSigningConditionOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getTeamButtonText = () => {
    if (loadingTeams) return "Загрузка команд...";
    if (selectedTeam) return selectedTeam.team_name;
    return "Выберите NBA команду";
  };

  const getPlayerButtonText = () => {
    if (loadingPlayers) return "Загрузка игроков...";
    if (selectedPlayer) return selectedPlayer.active_roster;
    return "Выберите игрока UFA"; // ИЗМЕНЕНО: RFA -> UFA
  };

  const getContractTypeButtonText = () => {
    if (selectedContractType) return selectedContractType.label;
    return "Выберите тип контракта";
  };

  const getContractLengthButtonText = () => {
    if (selectedContractLength) return selectedContractLength.label;
    return "Выберите срок контракта";
  };

  const getContractClauseButtonText = () => {
    if (selectedContractClause) return selectedContractClause.label;
    return "Выберите опцию контракта";
  };

  const getSigningConditionButtonText = () => {
    if (selectedSigningCondition) return selectedSigningCondition.label;
    return "Выберите условие подписания";
  };

  return (
    <div className="ufaUFRFirstStageForm-container">
      <div className="ufaUFRFirstStageForm-content">
        {/* Заголовок секции */}
        <div className="ufaUFRFirstStageForm-section-header">
          <div className="ufaUFRFirstStageForm-title-wrapper">
            <h2 className="ufaUFRFirstStageForm-main-title">
              СОЗДАНИЕ ПРЕДЛОЖЕНИЯ UFA (ПЕРВЫЙ РАУНД, ПЕРВЫЙ ЭТАП){" "}
              {/* ИЗМЕНЕНО */}
            </h2>
            <p className="ufaUFRFirstStageForm-subtitle">
              Заполните все поля для подачи предложения
            </p>
            <div className="ufaUFRFirstStageForm-divider"></div>
          </div>
        </div>

        {/* Сообщения об ошибке/успехе */}
        {submitError && (
          <div className="ufaUFRFirstStageForm-error-message">
            {submitError}
          </div>
        )}

        {submitSuccess && (
          <div className="ufaUFRFirstStageForm-success-message">
            Предложение успешно отправлено!
          </div>
        )}

        {/* Выбор команды */}
        <div className="ufaUFRFirstStageForm-section">
          <h3 className="ufaUFRFirstStageForm-section-title">
            Выберите команду NBA
          </h3>
          <div
            className="ufaUFRFirstStageForm-dropdown-wrapper"
            ref={teamDropdownRef}
          >
            <button
              className={`ufaUFRFirstStageForm-toggle ${selectedTeam ? "has-selection" : ""} ${isTeamOpen ? "active" : ""}`}
              onClick={toggleTeamDropdown}
              disabled={loadingTeams}
              type="button"
            >
              <span className="ufaUFRFirstStageForm-button-text">
                {getTeamButtonText()}
              </span>
              {selectedTeam && (
                <button
                  className="ufaUFRFirstStageForm-clear"
                  onClick={clearTeamSelection}
                  aria-label="Clear team selection"
                  type="button"
                >
                  ×
                </button>
              )}
              <span className="ufaUFRFirstStageForm-arrow">
                {isTeamOpen ? "▲" : "▼"}
              </span>
            </button>

            {teamError && (
              <div className="ufaUFRFirstStageForm-error">{teamError}</div>
            )}

            {isTeamOpen && (
              <div className="ufaUFRFirstStageForm-menu">
                {loadingTeams ? (
                  <div className="ufaUFRFirstStageForm-loading">
                    <div className="ufaUFRFirstStageForm-spinner"></div>
                    <span>Загрузка команд...</span>
                  </div>
                ) : teams.length === 0 ? (
                  <div className="ufaUFRFirstStageForm-empty">
                    Команды не найдены
                  </div>
                ) : (
                  <div className="ufaUFRFirstStageForm-list-wrapper">
                    <ul className="ufaUFRFirstStageForm-list">
                      {teams.map((team) => (
                        <li
                          key={team.id}
                          className={`ufaUFRFirstStageForm-item ${selectedTeam?.id === team.id ? "selected" : ""}`}
                          onClick={() => handleTeamSelect(team)}
                        >
                          <span className="ufaUFRFirstStageForm-item-name">
                            {team.team_name}
                          </span>
                          {selectedTeam?.id === team.id && (
                            <span className="ufaUFRFirstStageForm-checkmark">
                              ✓
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Выбор игрока */}
        <div className="ufaUFRFirstStageForm-section">
          <h3 className="ufaUFRFirstStageForm-section-title">
            Выберите игрока UFA {/* ИЗМЕНЕНО: RFA -> UFA */}
          </h3>
          <div
            className="ufaUFRFirstStageForm-dropdown-wrapper"
            ref={playerDropdownRef}
          >
            <button
              className={`ufaUFRFirstStageForm-toggle ${selectedPlayer ? "has-selection" : ""} ${isPlayerOpen ? "active" : ""}`}
              onClick={togglePlayerDropdown}
              disabled={loadingPlayers}
              type="button"
            >
              <span className="ufaUFRFirstStageForm-button-text">
                {getPlayerButtonText()}
              </span>
              {selectedPlayer && (
                <button
                  className="ufaUFRFirstStageForm-clear"
                  onClick={clearPlayerSelection}
                  aria-label="Clear player selection"
                  type="button"
                >
                  ×
                </button>
              )}
              <span className="ufaUFRFirstStageForm-arrow">
                {isPlayerOpen ? "▲" : "▼"}
              </span>
            </button>

            {playerError && (
              <div className="ufaUFRFirstStageForm-error">{playerError}</div>
            )}

            {isPlayerOpen && (
              <div className="ufaUFRFirstStageForm-menu">
                {loadingPlayers ? (
                  <div className="ufaUFRFirstStageForm-loading">
                    <div className="ufaUFRFirstStageForm-spinner"></div>
                    <span>Загрузка игроков...</span>
                  </div>
                ) : players.length === 0 ? (
                  <div className="ufaUFRFirstStageForm-empty">
                    Игроки UFA не найдены {/* ИЗМЕНЕНО: RFA -> UFA */}
                  </div>
                ) : (
                  <div className="ufaUFRFirstStageForm-list-wrapper">
                    <ul className="ufaUFRFirstStageForm-list">
                      {players.map((player) => (
                        <li
                          key={player.id}
                          className={`ufaUFRFirstStageForm-item ${selectedPlayer?.id === player.id ? "selected" : ""}`}
                          onClick={() => handlePlayerSelect(player)}
                        >
                          <span className="ufaUFRFirstStageForm-item-name">
                            {player.active_roster}
                          </span>
                          {selectedPlayer?.id === player.id && (
                            <span className="ufaUFRFirstStageForm-checkmark">
                              ✓
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Поле для ввода суммы контракта с отображением суммы по годам */}
        <div className="ufaUFRFirstStageForm-section">
          <h3 className="ufaUFRFirstStageForm-section-title">
            Сумма контракта (в тысячах)
          </h3>
          <div className="ufaUFRFirstStageForm-input-section">
            {/* Блок с минимальными суммами по стажу */}
            <div className="ufaUFRFirstStageForm-minimum-salaries">
              <div className="ufaUFRFirstStageForm-minimum-title">
                Минимальная сумма контракта по стажу (тыс.):
              </div>
              <div className="ufaUFRFirstStageForm-minimum-grid">
                {MINIMUM_SALARY_NOTES.map((item, index) => (
                  <div
                    key={index}
                    className="ufaUFRFirstStageForm-minimum-item"
                  >
                    <span className="ufaUFRFirstStageForm-minimum-experience">
                      {item.experience} год:
                    </span>
                    <span className="ufaUFRFirstStageForm-minimum-salary">
                      {item.salary}
                    </span>
                  </div>
                ))}
              </div>
              <div className="ufaUFRFirstStageForm-minimum-note">
                * Минимальная сумма зависит от стажа игрока в NBA
              </div>
            </div>

            {/* Поле ввода суммы контракта */}
            <div className="ufaUFRFirstStageForm-input-wrapper">
              <input
                ref={contractInputRef}
                type="text"
                className="ufaUFRFirstStageForm-input"
                onChange={handleContractAmountChange}
                placeholder="Введите сумму контракта"
                inputMode="numeric"
              />
              {contractAmount && (
                <button
                  className="ufaUFRFirstStageForm-input-clear"
                  onClick={clearContractAmount}
                  aria-label="Clear contract amount"
                  type="button"
                >
                  ×
                </button>
              )}
            </div>
            <div className="ufaUFRFirstStageForm-input-hint">
              Сумма в тысячах (например: 1 000 = $1,000,000)
            </div>

            {/* Блок отображения суммы по годам */}
            {contractAmount &&
              selectedContractType &&
              selectedContractLength && (
                <div className="ufaUFRFirstStageForm-yearly-amounts">
                  <div className="ufaUFRFirstStageForm-yearly-title">
                    Сумма контракта по годам ({selectedContractType.label}):
                  </div>
                  <div className="ufaUFRFirstStageForm-yearly-list">
                    {yearlyContractAmounts.map((amount, index) => {
                      const optionLabel = getYearOptionLabel(index);
                      const isLastYear =
                        index === yearlyContractAmounts.length - 1;

                      return (
                        <div
                          key={index}
                          className="ufaUFRFirstStageForm-yearly-item"
                        >
                          <span className="ufaUFRFirstStageForm-year-label">
                            Год {index + 1}
                            {optionLabel && (
                              <span className="ufaUFRFirstStageForm-year-option">
                                {optionLabel}
                              </span>
                            )}
                          </span>
                          <span className="ufaUFRFirstStageForm-year-amount">
                            {formatAmount(amount)} тыс.
                          </span>
                          {index > 0 && (
                            <span className="ufaUFRFirstStageForm-year-change">
                              {selectedContractType.id === "flat" ? (
                                "без изменений"
                              ) : selectedContractType.id === "front" ? (
                                <span className="ufaUFRFirstStageForm-decrease">
                                  ▼ 5%
                                </span>
                              ) : selectedContractType.id === "back" ? (
                                <span className="ufaUFRFirstStageForm-increase">
                                  ▲ 5%
                                </span>
                              ) : (
                                <span className="ufaUFRFirstStageForm-increase">
                                  ▲ 8%
                                </span>
                              )}
                            </span>
                          )}
                        </div>
                      );
                    })}
                    {yearlyContractAmounts.length > 0 && (
                      <div className="ufaUFRFirstStageForm-total-amount">
                        <span className="ufaUFRFirstStageForm-total-label">
                          Общая сумма:
                        </span>
                        <span className="ufaUFRFirstStageForm-total-value">
                          {formatAmount(
                            yearlyContractAmounts.reduce((a, b) => a + b, 0),
                          )}{" "}
                          тыс.
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
          </div>
        </div>

        {/* Выбор типа контракта */}
        <div className="ufaUFRFirstStageForm-section">
          <h3 className="ufaUFRFirstStageForm-section-title">Тип контракта</h3>
          <div
            className="ufaUFRFirstStageForm-dropdown-wrapper"
            ref={contractTypeDropdownRef}
          >
            <button
              className={`ufaUFRFirstStageForm-toggle ${selectedContractType ? "has-selection" : ""} ${isContractTypeOpen ? "active" : ""}`}
              onClick={toggleContractTypeDropdown}
              type="button"
            >
              <span className="ufaUFRFirstStageForm-button-text">
                {getContractTypeButtonText()}
              </span>
              {selectedContractType && (
                <button
                  className="ufaUFRFirstStageForm-clear"
                  onClick={clearContractTypeSelection}
                  aria-label="Clear contract type selection"
                  type="button"
                >
                  ×
                </button>
              )}
              <span className="ufaUFRFirstStageForm-arrow">
                {isContractTypeOpen ? "▲" : "▼"}
              </span>
            </button>

            {isContractTypeOpen && (
              <div className="ufaUFRFirstStageForm-menu">
                <div className="ufaUFRFirstStageForm-list-wrapper">
                  <ul className="ufaUFRFirstStageForm-list">
                    {CONTRACT_OPTIONS.map((option) => (
                      <li
                        key={option.id}
                        className={`ufaUFRFirstStageForm-item ${selectedContractType?.id === option.id ? "selected" : ""}`}
                        onClick={() => handleContractTypeSelect(option)}
                      >
                        <div className="ufaUFRFirstStageForm-contract-option">
                          <div className="ufaUFRFirstStageForm-contract-label">
                            {option.label}
                          </div>
                          <div className="ufaUFRFirstStageForm-contract-description">
                            {option.description}
                          </div>
                        </div>
                        {selectedContractType?.id === option.id && (
                          <span className="ufaUFRFirstStageForm-checkmark">
                            ✓
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Выбор срока контракта */}
        <div className="ufaUFRFirstStageForm-section">
          <h3 className="ufaUFRFirstStageForm-section-title">Срок контракта</h3>
          <div
            className="ufaUFRFirstStageForm-dropdown-wrapper"
            ref={contractLengthDropdownRef}
          >
            <button
              className={`ufaUFRFirstStageForm-toggle ${selectedContractLength ? "has-selection" : ""} ${isContractLengthOpen ? "active" : ""}`}
              onClick={toggleContractLengthDropdown}
              type="button"
            >
              <span className="ufaUFRFirstStageForm-button-text">
                {getContractLengthButtonText()}
              </span>
              {selectedContractLength && (
                <button
                  className="ufaUFRFirstStageForm-clear"
                  onClick={clearContractLengthSelection}
                  aria-label="Clear contract length selection"
                  type="button"
                >
                  ×
                </button>
              )}
              <span className="ufaUFRFirstStageForm-arrow">
                {isContractLengthOpen ? "▲" : "▼"}
              </span>
            </button>

            {isContractLengthOpen && (
              <div className="ufaUFRFirstStageForm-menu">
                <div className="ufaUFRFirstStageForm-list-wrapper">
                  <ul className="ufaUFRFirstStageForm-list">
                    {CONTRACT_LENGTH_OPTIONS.map((option) => (
                      <li
                        key={option.id}
                        className={`ufaUFRFirstStageForm-item ${selectedContractLength?.id === option.id ? "selected" : ""}`}
                        onClick={() => handleContractLengthSelect(option)}
                      >
                        <span className="ufaUFRFirstStageForm-item-name">
                          {option.label}
                        </span>
                        {selectedContractLength?.id === option.id && (
                          <span className="ufaUFRFirstStageForm-checkmark">
                            ✓
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Выбор опции контракта */}
        <div className="ufaUFRFirstStageForm-section">
          <h3 className="ufaUFRFirstStageForm-section-title">
            Опция контракта
          </h3>
          <div
            className="ufaUFRFirstStageForm-dropdown-wrapper"
            ref={contractClauseDropdownRef}
          >
            <button
              className={`ufaUFRFirstStageForm-toggle ${selectedContractClause ? "has-selection" : ""} ${isContractClauseOpen ? "active" : ""}`}
              onClick={toggleContractClauseDropdown}
              type="button"
            >
              <span className="ufaUFRFirstStageForm-button-text">
                {getContractClauseButtonText()}
              </span>
              {selectedContractClause && (
                <button
                  className="ufaUFRFirstStageForm-clear"
                  onClick={clearContractClauseSelection}
                  aria-label="Clear contract clause selection"
                  type="button"
                >
                  ×
                </button>
              )}
              <span className="ufaUFRFirstStageForm-arrow">
                {isContractClauseOpen ? "▲" : "▼"}
              </span>
            </button>

            {isContractClauseOpen && (
              <div className="ufaUFRFirstStageForm-menu">
                <div className="ufaUFRFirstStageForm-list-wrapper">
                  <ul className="ufaUFRFirstStageForm-list">
                    {CONTRACT_CLAUSE_OPTIONS.map((option) => (
                      <li
                        key={option.id}
                        className={`ufaUFRFirstStageForm-item ${selectedContractClause?.id === option.id ? "selected" : ""}`}
                        onClick={() => handleContractClauseSelect(option)}
                      >
                        <span className="ufaUFRFirstStageForm-item-name">
                          {option.label}
                        </span>
                        {selectedContractClause?.id === option.id && (
                          <span className="ufaUFRFirstStageForm-checkmark">
                            ✓
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Поле для ввода подписного бонуса */}
        <div className="ufaUFRFirstStageForm-section">
          <h3 className="ufaUFRFirstStageForm-section-title">
            Размер подписного бонуса (не более 10% от общей суммы)
          </h3>
          <div className="ufaUFRFirstStageForm-input-section">
            <div className="ufaUFRFirstStageForm-input-wrapper">
              <input
                ref={bonusInputRef}
                type="text"
                className="ufaUFRFirstStageForm-input"
                onChange={handleBonusPercentageChange}
                placeholder="Введите процент (например: 5 или 5.5)"
                inputMode="decimal"
              />
              {bonusPercentage && (
                <button
                  className="ufaUFRFirstStageForm-input-clear"
                  onClick={clearBonusPercentage}
                  aria-label="Clear bonus percentage"
                  type="button"
                >
                  ×
                </button>
              )}
            </div>
            <div className="ufaUFRFirstStageForm-input-hint">
              Необязательное поле. Введите процент (например: 5 для 5%)
            </div>
          </div>
        </div>

        {/* Выбор условий подписания */}
        <div className="ufaUFRFirstStageForm-section">
          <h3 className="ufaUFRFirstStageForm-section-title">
            Условия подписания контракта
          </h3>
          <div
            className="ufaUFRFirstStageForm-dropdown-wrapper"
            ref={signingConditionDropdownRef}
          >
            <button
              className={`ufaUFRFirstStageForm-toggle ${selectedSigningCondition ? "has-selection" : ""} ${isSigningConditionOpen ? "active" : ""}`}
              onClick={toggleSigningConditionDropdown}
              type="button"
            >
              <span className="ufaUFRFirstStageForm-button-text">
                {getSigningConditionButtonText()}
              </span>
              {selectedSigningCondition && (
                <button
                  className="ufaUFRFirstStageForm-clear"
                  onClick={clearSigningConditionSelection}
                  aria-label="Clear signing condition selection"
                  type="button"
                >
                  ×
                </button>
              )}
              <span className="ufaUFRFirstStageForm-arrow">
                {isSigningConditionOpen ? "▲" : "▼"}
              </span>
            </button>

            {isSigningConditionOpen && (
              <div className="ufaUFRFirstStageForm-menu">
                <div className="ufaUFRFirstStageForm-list-wrapper">
                  <ul className="ufaUFRFirstStageForm-list">
                    {SIGNING_CONDITION_OPTIONS.map((option) => (
                      <li
                        key={option.id}
                        className={`ufaUFRFirstStageForm-item ${selectedSigningCondition?.id === option.id ? "selected" : ""}`}
                        onClick={() => handleSigningConditionSelect(option)}
                      >
                        <span className="ufaUFRFirstStageForm-item-name">
                          {option.label}
                        </span>
                        {selectedSigningCondition?.id === option.id && (
                          <span className="ufaUFRFirstStageForm-checkmark">
                            ✓
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Поле для комментария */}
        {selectedSigningCondition?.id === "other" && (
          <div className="ufaUFRFirstStageForm-section">
            <h3 className="ufaUFRFirstStageForm-section-title">Комментарий</h3>
            <div className="ufaUFRFirstStageForm-input-section">
              <div className="ufaUFRFirstStageForm-input-wrapper">
                <input
                  ref={commentInputRef}
                  type="text"
                  className="ufaUFRFirstStageForm-input"
                  value={comment}
                  onChange={handleCommentChange}
                  placeholder="Введите ваш комментарий"
                />
                {comment && (
                  <button
                    className="ufaUFRFirstStageForm-input-clear"
                    onClick={clearComment}
                    aria-label="Clear comment"
                    type="button"
                  >
                    ×
                  </button>
                )}
              </div>
              <div className="ufaUFRFirstStageForm-input-hint">
                Укажите дополнительные условия подписания
              </div>
            </div>
          </div>
        )}

        {/* Кнопка подтверждения */}
        <div className="ufaUFRFirstStageForm-section ufaUFRFirstStageForm-submit-section">
          <button
            className="ufaUFRFirstStageForm-submit-button"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Отправка..." : "Отправить предложение"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UFAUFRFirstStageForm;
