import React, { useState, useEffect, useCallback, useRef } from "react";
import "./ufaUSRFirstStageForm.css";
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

const UFAUSRFirstStageForm: React.FC = () => {
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

  useEffect(() => {
    calculateYearlyContractAmounts();
  }, [calculateYearlyContractAmounts]);

  const formatAmount = (amount: number): string => {
    return amount.toLocaleString("ru-RU").replace(/,/g, " ");
  };

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

  const fetchPlayers = useCallback(async (): Promise<void> => {
    setLoadingPlayers(true);
    setPlayerError(null);

    try {
      const { data, error } = await supabase
        .from("Players")
        .select("id, active_roster, opt")
        .eq("opt", "UFA")
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

  const handleSubmit = useCallback(async (): Promise<void> => {
    if (!selectedTeam) {
      setSubmitError("Пожалуйста, выберите команду NBA");
      return;
    }
    if (!selectedPlayer) {
      setSubmitError("Пожалуйста, выберите игрока UFA");
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

      // ИЗМЕНЕНО: таблица для второго раунда
      const { error } = await supabase
        .from("Market_UFA_second_round_first_stage")
        .insert([dataToInsert]);

      if (error) throw error;

      setSubmitSuccess(true);
      console.log(
        "Данные успешно сохранены в таблицу Market_UFA_second_round_first_stage",
      );

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

  const clearContractAmount = useCallback((): void => {
    setContractAmount("");
    if (contractInputRef.current) {
      contractInputRef.current.value = "";
      contractInputRef.current.focus();
    }
  }, []);

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

  const clearBonusPercentage = useCallback((): void => {
    setBonusPercentage("");
    if (bonusInputRef.current) {
      bonusInputRef.current.value = "";
      bonusInputRef.current.focus();
    }
  }, []);

  const handleCommentChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      setComment(e.target.value);
    },
    [],
  );

  const clearComment = useCallback((): void => {
    setComment("");
    if (commentInputRef.current) {
      commentInputRef.current.value = "";
      commentInputRef.current.focus();
    }
  }, []);

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
    return "Выберите игрока UFA";
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
    <div className="ufaUSRFirstStageForm-container">
      <div className="ufaUSRFirstStageForm-content">
        <div className="ufaUSRFirstStageForm-section-header">
          <div className="ufaUSRFirstStageForm-title-wrapper">
            <h2 className="ufaUSRFirstStageForm-main-title">
              СОЗДАНИЕ ПРЕДЛОЖЕНИЯ UFA (ВТОРОЙ РАУНД, ТРЕТИЙ ЭТАП)
            </h2>
            <p className="ufaUSRFirstStageForm-subtitle">
              Заполните все поля для подачи предложения
            </p>
            <div className="ufaUSRFirstStageForm-divider"></div>
          </div>
        </div>

        {submitError && (
          <div className="ufaUSRFirstStageForm-error-message">
            {submitError}
          </div>
        )}

        {submitSuccess && (
          <div className="ufaUSRFirstStageForm-success-message">
            Предложение успешно отправлено!
          </div>
        )}

        <div className="ufaUSRFirstStageForm-section">
          <h3 className="ufaUSRFirstStageForm-section-title">
            Выберите команду NBA
          </h3>
          <div
            className="ufaUSRFirstStageForm-dropdown-wrapper"
            ref={teamDropdownRef}
          >
            <button
              className={`ufaUSRFirstStageForm-toggle ${selectedTeam ? "has-selection" : ""} ${isTeamOpen ? "active" : ""}`}
              onClick={toggleTeamDropdown}
              disabled={loadingTeams}
              type="button"
            >
              <span className="ufaUSRFirstStageForm-button-text">
                {getTeamButtonText()}
              </span>
              {selectedTeam && (
                <button
                  className="ufaUSRFirstStageForm-clear"
                  onClick={clearTeamSelection}
                  aria-label="Clear team selection"
                  type="button"
                >
                  ×
                </button>
              )}
              <span className="ufaUSRFirstStageForm-arrow">
                {isTeamOpen ? "▲" : "▼"}
              </span>
            </button>

            {teamError && (
              <div className="ufaUSRFirstStageForm-error">{teamError}</div>
            )}

            {isTeamOpen && (
              <div className="ufaUSRFirstStageForm-menu">
                {loadingTeams ? (
                  <div className="ufaUSRFirstStageForm-loading">
                    <div className="ufaUSRFirstStageForm-spinner"></div>
                    <span>Загрузка команд...</span>
                  </div>
                ) : teams.length === 0 ? (
                  <div className="ufaUSRFirstStageForm-empty">
                    Команды не найдены
                  </div>
                ) : (
                  <div className="ufaUSRFirstStageForm-list-wrapper">
                    <ul className="ufaUSRFirstStageForm-list">
                      {teams.map((team) => (
                        <li
                          key={team.id}
                          className={`ufaUSRFirstStageForm-item ${selectedTeam?.id === team.id ? "selected" : ""}`}
                          onClick={() => handleTeamSelect(team)}
                        >
                          <span className="ufaUSRFirstStageForm-item-name">
                            {team.team_name}
                          </span>
                          {selectedTeam?.id === team.id && (
                            <span className="ufaUSRFirstStageForm-checkmark">
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

        <div className="ufaUSRFirstStageForm-section">
          <h3 className="ufaUSRFirstStageForm-section-title">
            Выберите игрока UFA
          </h3>
          <div
            className="ufaUSRFirstStageForm-dropdown-wrapper"
            ref={playerDropdownRef}
          >
            <button
              className={`ufaUSRFirstStageForm-toggle ${selectedPlayer ? "has-selection" : ""} ${isPlayerOpen ? "active" : ""}`}
              onClick={togglePlayerDropdown}
              disabled={loadingPlayers}
              type="button"
            >
              <span className="ufaUSRFirstStageForm-button-text">
                {getPlayerButtonText()}
              </span>
              {selectedPlayer && (
                <button
                  className="ufaUSRFirstStageForm-clear"
                  onClick={clearPlayerSelection}
                  aria-label="Clear player selection"
                  type="button"
                >
                  ×
                </button>
              )}
              <span className="ufaUSRFirstStageForm-arrow">
                {isPlayerOpen ? "▲" : "▼"}
              </span>
            </button>

            {playerError && (
              <div className="ufaUSRFirstStageForm-error">{playerError}</div>
            )}

            {isPlayerOpen && (
              <div className="ufaUSRFirstStageForm-menu">
                {loadingPlayers ? (
                  <div className="ufaUSRFirstStageForm-loading">
                    <div className="ufaUSRFirstStageForm-spinner"></div>
                    <span>Загрузка игроков...</span>
                  </div>
                ) : players.length === 0 ? (
                  <div className="ufaUSRFirstStageForm-empty">
                    Игроки UFA не найдены
                  </div>
                ) : (
                  <div className="ufaUSRFirstStageForm-list-wrapper">
                    <ul className="ufaUSRFirstStageForm-list">
                      {players.map((player) => (
                        <li
                          key={player.id}
                          className={`ufaUSRFirstStageForm-item ${selectedPlayer?.id === player.id ? "selected" : ""}`}
                          onClick={() => handlePlayerSelect(player)}
                        >
                          <span className="ufaUSRFirstStageForm-item-name">
                            {player.active_roster}
                          </span>
                          {selectedPlayer?.id === player.id && (
                            <span className="ufaUSRFirstStageForm-checkmark">
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

        <div className="ufaUSRFirstStageForm-section">
          <h3 className="ufaUSRFirstStageForm-section-title">
            Сумма контракта (в тысячах)
          </h3>
          <div className="ufaUSRFirstStageForm-input-section">
            <div className="ufaUSRFirstStageForm-minimum-salaries">
              <div className="ufaUSRFirstStageForm-minimum-title">
                Минимальная сумма контракта по стажу (тыс.):
              </div>
              <div className="ufaUSRFirstStageForm-minimum-grid">
                {MINIMUM_SALARY_NOTES.map((item, index) => (
                  <div
                    key={index}
                    className="ufaUSRFirstStageForm-minimum-item"
                  >
                    <span className="ufaUSRFirstStageForm-minimum-experience">
                      {item.experience} год:
                    </span>
                    <span className="ufaUSRFirstStageForm-minimum-salary">
                      {item.salary}
                    </span>
                  </div>
                ))}
              </div>
              <div className="ufaUSRFirstStageForm-minimum-note">
                * Минимальная сумма зависит от стажа игрока в NBA
              </div>
            </div>

            <div className="ufaUSRFirstStageForm-input-wrapper">
              <input
                ref={contractInputRef}
                type="text"
                className="ufaUSRFirstStageForm-input"
                onChange={handleContractAmountChange}
                placeholder="Введите сумму контракта"
                inputMode="numeric"
              />
              {contractAmount && (
                <button
                  className="ufaUSRFirstStageForm-input-clear"
                  onClick={clearContractAmount}
                  aria-label="Clear contract amount"
                  type="button"
                >
                  ×
                </button>
              )}
            </div>
            <div className="ufaUSRFirstStageForm-input-hint">
              Сумма в тысячах (например: 1 000 = $1,000,000)
            </div>

            {contractAmount &&
              selectedContractType &&
              selectedContractLength && (
                <div className="ufaUSRFirstStageForm-yearly-amounts">
                  <div className="ufaUSRFirstStageForm-yearly-title">
                    Сумма контракта по годам ({selectedContractType.label}):
                  </div>
                  <div className="ufaUSRFirstStageForm-yearly-list">
                    {yearlyContractAmounts.map((amount, index) => {
                      const optionLabel = getYearOptionLabel(index);
                      const isLastYear =
                        index === yearlyContractAmounts.length - 1;

                      return (
                        <div
                          key={index}
                          className="ufaUSRFirstStageForm-yearly-item"
                        >
                          <span className="ufaUSRFirstStageForm-year-label">
                            Год {index + 1}
                            {optionLabel && (
                              <span className="ufaUSRFirstStageForm-year-option">
                                {optionLabel}
                              </span>
                            )}
                          </span>
                          <span className="ufaUSRFirstStageForm-year-amount">
                            {formatAmount(amount)} тыс.
                          </span>
                          {index > 0 && (
                            <span className="ufaUSRFirstStageForm-year-change">
                              {selectedContractType.id === "flat" ? (
                                "без изменений"
                              ) : selectedContractType.id === "front" ? (
                                <span className="ufaUSRFirstStageForm-decrease">
                                  ▼ 5%
                                </span>
                              ) : selectedContractType.id === "back" ? (
                                <span className="ufaUSRFirstStageForm-increase">
                                  ▲ 5%
                                </span>
                              ) : (
                                <span className="ufaUSRFirstStageForm-increase">
                                  ▲ 8%
                                </span>
                              )}
                            </span>
                          )}
                        </div>
                      );
                    })}
                    {yearlyContractAmounts.length > 0 && (
                      <div className="ufaUSRFirstStageForm-total-amount">
                        <span className="ufaUSRFirstStageForm-total-label">
                          Общая сумма:
                        </span>
                        <span className="ufaUSRFirstStageForm-total-value">
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

        <div className="ufaUSRFirstStageForm-section">
          <h3 className="ufaUSRFirstStageForm-section-title">Тип контракта</h3>
          <div
            className="ufaUSRFirstStageForm-dropdown-wrapper"
            ref={contractTypeDropdownRef}
          >
            <button
              className={`ufaUSRFirstStageForm-toggle ${selectedContractType ? "has-selection" : ""} ${isContractTypeOpen ? "active" : ""}`}
              onClick={toggleContractTypeDropdown}
              type="button"
            >
              <span className="ufaUSRFirstStageForm-button-text">
                {getContractTypeButtonText()}
              </span>
              {selectedContractType && (
                <button
                  className="ufaUSRFirstStageForm-clear"
                  onClick={clearContractTypeSelection}
                  aria-label="Clear contract type selection"
                  type="button"
                >
                  ×
                </button>
              )}
              <span className="ufaUSRFirstStageForm-arrow">
                {isContractTypeOpen ? "▲" : "▼"}
              </span>
            </button>

            {isContractTypeOpen && (
              <div className="ufaUSRFirstStageForm-menu">
                <div className="ufaUSRFirstStageForm-list-wrapper">
                  <ul className="ufaUSRFirstStageForm-list">
                    {CONTRACT_OPTIONS.map((option) => (
                      <li
                        key={option.id}
                        className={`ufaUSRFirstStageForm-item ${selectedContractType?.id === option.id ? "selected" : ""}`}
                        onClick={() => handleContractTypeSelect(option)}
                      >
                        <div className="ufaUSRFirstStageForm-contract-option">
                          <div className="ufaUSRFirstStageForm-contract-label">
                            {option.label}
                          </div>
                          <div className="ufaUSRFirstStageForm-contract-description">
                            {option.description}
                          </div>
                        </div>
                        {selectedContractType?.id === option.id && (
                          <span className="ufaUSRFirstStageForm-checkmark">
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

        <div className="ufaUSRFirstStageForm-section">
          <h3 className="ufaUSRFirstStageForm-section-title">Срок контракта</h3>
          <div
            className="ufaUSRFirstStageForm-dropdown-wrapper"
            ref={contractLengthDropdownRef}
          >
            <button
              className={`ufaUSRFirstStageForm-toggle ${selectedContractLength ? "has-selection" : ""} ${isContractLengthOpen ? "active" : ""}`}
              onClick={toggleContractLengthDropdown}
              type="button"
            >
              <span className="ufaUSRFirstStageForm-button-text">
                {getContractLengthButtonText()}
              </span>
              {selectedContractLength && (
                <button
                  className="ufaUSRFirstStageForm-clear"
                  onClick={clearContractLengthSelection}
                  aria-label="Clear contract length selection"
                  type="button"
                >
                  ×
                </button>
              )}
              <span className="ufaUSRFirstStageForm-arrow">
                {isContractLengthOpen ? "▲" : "▼"}
              </span>
            </button>

            {isContractLengthOpen && (
              <div className="ufaUSRFirstStageForm-menu">
                <div className="ufaUSRFirstStageForm-list-wrapper">
                  <ul className="ufaUSRFirstStageForm-list">
                    {CONTRACT_LENGTH_OPTIONS.map((option) => (
                      <li
                        key={option.id}
                        className={`ufaUSRFirstStageForm-item ${selectedContractLength?.id === option.id ? "selected" : ""}`}
                        onClick={() => handleContractLengthSelect(option)}
                      >
                        <span className="ufaUSRFirstStageForm-item-name">
                          {option.label}
                        </span>
                        {selectedContractLength?.id === option.id && (
                          <span className="ufaUSRFirstStageForm-checkmark">
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

        <div className="ufaUSRFirstStageForm-section">
          <h3 className="ufaUSRFirstStageForm-section-title">
            Опция контракта
          </h3>
          <div
            className="ufaUSRFirstStageForm-dropdown-wrapper"
            ref={contractClauseDropdownRef}
          >
            <button
              className={`ufaUSRFirstStageForm-toggle ${selectedContractClause ? "has-selection" : ""} ${isContractClauseOpen ? "active" : ""}`}
              onClick={toggleContractClauseDropdown}
              type="button"
            >
              <span className="ufaUSRFirstStageForm-button-text">
                {getContractClauseButtonText()}
              </span>
              {selectedContractClause && (
                <button
                  className="ufaUSRFirstStageForm-clear"
                  onClick={clearContractClauseSelection}
                  aria-label="Clear contract clause selection"
                  type="button"
                >
                  ×
                </button>
              )}
              <span className="ufaUSRFirstStageForm-arrow">
                {isContractClauseOpen ? "▲" : "▼"}
              </span>
            </button>

            {isContractClauseOpen && (
              <div className="ufaUSRFirstStageForm-menu">
                <div className="ufaUSRFirstStageForm-list-wrapper">
                  <ul className="ufaUSRFirstStageForm-list">
                    {CONTRACT_CLAUSE_OPTIONS.map((option) => (
                      <li
                        key={option.id}
                        className={`ufaUSRFirstStageForm-item ${selectedContractClause?.id === option.id ? "selected" : ""}`}
                        onClick={() => handleContractClauseSelect(option)}
                      >
                        <span className="ufaUSRFirstStageForm-item-name">
                          {option.label}
                        </span>
                        {selectedContractClause?.id === option.id && (
                          <span className="ufaUSRFirstStageForm-checkmark">
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

        <div className="ufaUSRFirstStageForm-section">
          <h3 className="ufaUSRFirstStageForm-section-title">
            Размер подписного бонуса (не более 10% от общей суммы)
          </h3>
          <div className="ufaUSRFirstStageForm-input-section">
            <div className="ufaUSRFirstStageForm-input-wrapper">
              <input
                ref={bonusInputRef}
                type="text"
                className="ufaUSRFirstStageForm-input"
                onChange={handleBonusPercentageChange}
                placeholder="Введите процент (например: 5 или 5.5)"
                inputMode="decimal"
              />
              {bonusPercentage && (
                <button
                  className="ufaUSRFirstStageForm-input-clear"
                  onClick={clearBonusPercentage}
                  aria-label="Clear bonus percentage"
                  type="button"
                >
                  ×
                </button>
              )}
            </div>
            <div className="ufaUSRFirstStageForm-input-hint">
              Необязательное поле. Введите процент (например: 5 для 5%)
            </div>
          </div>
        </div>

        <div className="ufaUSRFirstStageForm-section">
          <h3 className="ufaUSRFirstStageForm-section-title">
            Условия подписания контракта
          </h3>
          <div
            className="ufaUSRFirstStageForm-dropdown-wrapper"
            ref={signingConditionDropdownRef}
          >
            <button
              className={`ufaUSRFirstStageForm-toggle ${selectedSigningCondition ? "has-selection" : ""} ${isSigningConditionOpen ? "active" : ""}`}
              onClick={toggleSigningConditionDropdown}
              type="button"
            >
              <span className="ufaUSRFirstStageForm-button-text">
                {getSigningConditionButtonText()}
              </span>
              {selectedSigningCondition && (
                <button
                  className="ufaUSRFirstStageForm-clear"
                  onClick={clearSigningConditionSelection}
                  aria-label="Clear signing condition selection"
                  type="button"
                >
                  ×
                </button>
              )}
              <span className="ufaUSRFirstStageForm-arrow">
                {isSigningConditionOpen ? "▲" : "▼"}
              </span>
            </button>

            {isSigningConditionOpen && (
              <div className="ufaUSRFirstStageForm-menu">
                <div className="ufaUSRFirstStageForm-list-wrapper">
                  <ul className="ufaUSRFirstStageForm-list">
                    {SIGNING_CONDITION_OPTIONS.map((option) => (
                      <li
                        key={option.id}
                        className={`ufaUSRFirstStageForm-item ${selectedSigningCondition?.id === option.id ? "selected" : ""}`}
                        onClick={() => handleSigningConditionSelect(option)}
                      >
                        <span className="ufaUSRFirstStageForm-item-name">
                          {option.label}
                        </span>
                        {selectedSigningCondition?.id === option.id && (
                          <span className="ufaUSRFirstStageForm-checkmark">
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

        {selectedSigningCondition?.id === "other" && (
          <div className="ufaUSRFirstStageForm-section">
            <h3 className="ufaUSRFirstStageForm-section-title">Комментарий</h3>
            <div className="ufaUSRFirstStageForm-input-section">
              <div className="ufaUSRFirstStageForm-input-wrapper">
                <input
                  ref={commentInputRef}
                  type="text"
                  className="ufaUSRFirstStageForm-input"
                  value={comment}
                  onChange={handleCommentChange}
                  placeholder="Введите ваш комментарий"
                />
                {comment && (
                  <button
                    className="ufaUSRFirstStageForm-input-clear"
                    onClick={clearComment}
                    aria-label="Clear comment"
                    type="button"
                  >
                    ×
                  </button>
                )}
              </div>
              <div className="ufaUSRFirstStageForm-input-hint">
                Укажите дополнительные условия подписания
              </div>
            </div>
          </div>
        )}

        <div className="ufaUSRFirstStageForm-section ufaUSRFirstStageForm-submit-section">
          <button
            className="ufaUSRFirstStageForm-submit-button"
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

export default UFAUSRFirstStageForm;
