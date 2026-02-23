import React, { useState, useEffect, useCallback, useRef } from "react";
import "./rfaUserFirstRound.css";
import { supabase } from "../../../../../Supabase";

interface Player {
  id: string;
  active_roster: string;
  opt: string;
}

interface Team {
  id: string;
  team_name: string;
}

// Типы контрактов
type ContractType = "flat" | "front" | "back" | "bird";

interface ContractOption {
  id: ContractType;
  label: string;
  description: string;
}

// Типы для условий подписания
type SigningConditionType = "always" | "other";

interface SigningConditionOption {
  id: SigningConditionType;
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

// Опции срока контракта
const CONTRACT_LENGTH_OPTIONS = [
  { id: 1, label: "1 year" },
  { id: 2, label: "2 years" },
  { id: 3, label: "3 years" },
  { id: 4, label: "4 years" },
];

// Опции опций контракта
const CONTRACT_CLAUSE_OPTIONS = [
  { id: "none", label: "Без опции" },
  { id: "team", label: "Опция команды (Team Option)" },
  { id: "player", label: "Опция игрока (Player Option)" },
];

// Опции условий подписания
const SIGNING_CONDITION_OPTIONS: SigningConditionOption[] = [
  { id: "always", label: "Готов подписать при любых обстоятельствах" },
  { id: "other", label: "Другое" },
];

interface ContractLengthOption {
  id: number;
  label: string;
}

interface ContractClauseOption {
  id: string;
  label: string;
}

const RFAUserFirstRound: React.FC = () => {
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

  const teamDropdownRef = useRef<HTMLDivElement>(null);
  const playerDropdownRef = useRef<HTMLDivElement>(null);
  const contractInputRef = useRef<HTMLInputElement>(null);
  const bonusInputRef = useRef<HTMLInputElement>(null);
  const contractTypeDropdownRef = useRef<HTMLDivElement>(null);
  const contractLengthDropdownRef = useRef<HTMLDivElement>(null);
  const contractClauseDropdownRef = useRef<HTMLDivElement>(null);
  const signingConditionDropdownRef = useRef<HTMLDivElement>(null);
  const commentInputRef = useRef<HTMLInputElement>(null);

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

  // Загрузка игроков
  const fetchPlayers = useCallback(async (): Promise<void> => {
    setLoadingPlayers(true);
    setPlayerError(null);

    try {
      const { data, error } = await supabase
        .from("Players")
        .select("id, active_roster, opt")
        .eq("opt", "RFA")
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

      // Если выбрано "Готов подписать при любых обстоятельствах", очищаем комментарий
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

      // Разрешаем только цифры и одну точку для десятичных значений
      value = value.replace(/[^\d.]/g, "");

      // Убираем лишние точки
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
    if (loadingTeams) return "Loading teams...";
    if (selectedTeam) return selectedTeam.team_name;
    return "Select NBA Team";
  };

  const getPlayerButtonText = () => {
    if (loadingPlayers) return "Loading players...";
    if (selectedPlayer) return selectedPlayer.active_roster;
    return "Select RFA Player";
  };

  const getContractTypeButtonText = () => {
    if (selectedContractType) return selectedContractType.label;
    return "Select Contract Type";
  };

  const getContractLengthButtonText = () => {
    if (selectedContractLength) return selectedContractLength.label;
    return "Select Contract Length";
  };

  const getContractClauseButtonText = () => {
    if (selectedContractClause) return selectedContractClause.label;
    return "Select Contract Option";
  };

  const getSigningConditionButtonText = () => {
    if (selectedSigningCondition) return selectedSigningCondition.label;
    return "Выберите условие";
  };

  return (
    <div className="rfaFirstRound-container">
      {/* Выбор команды */}
      <div className="rfaFirstRound-section">
        <h3 className="rfaFirstRound-section-title">Select NBA Team</h3>
        <div className="rfaFirstRound-dropdown-wrapper" ref={teamDropdownRef}>
          <button
            className={`rfaFirstRound-toggle ${selectedTeam ? "has-selection" : ""}`}
            onClick={toggleTeamDropdown}
            disabled={loadingTeams}
            type="button"
          >
            <span className="rfaFirstRound-button-text">
              {getTeamButtonText()}
            </span>
            {selectedTeam && (
              <button
                className="rfaFirstRound-clear"
                onClick={clearTeamSelection}
                aria-label="Clear team selection"
                type="button"
              >
                ×
              </button>
            )}
            <span className="rfaFirstRound-arrow">
              {isTeamOpen ? "▲" : "▼"}
            </span>
          </button>

          {teamError && <div className="rfaFirstRound-error">{teamError}</div>}

          {isTeamOpen && (
            <div className="rfaFirstRound-menu">
              {loadingTeams ? (
                <div className="rfaFirstRound-loading">
                  Loading NBA teams...
                </div>
              ) : teams.length === 0 ? (
                <div className="rfaFirstRound-empty">No teams found</div>
              ) : (
                <ul className="rfaFirstRound-list">
                  {teams.map((team) => (
                    <li
                      key={team.id}
                      className={`rfaFirstRound-item ${selectedTeam?.id === team.id ? "selected" : ""}`}
                      onClick={() => handleTeamSelect(team)}
                    >
                      <span className="rfaFirstRound-item-name">
                        {team.team_name}
                      </span>
                      {selectedTeam?.id === team.id && (
                        <span className="rfaFirstRound-checkmark">✓</span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Выбор игрока */}
      <div className="rfaFirstRound-section">
        <h3 className="rfaFirstRound-section-title">Select RFA Player</h3>
        <div className="rfaFirstRound-dropdown-wrapper" ref={playerDropdownRef}>
          <button
            className={`rfaFirstRound-toggle ${selectedPlayer ? "has-selection" : ""}`}
            onClick={togglePlayerDropdown}
            disabled={loadingPlayers}
            type="button"
          >
            <span className="rfaFirstRound-button-text">
              {getPlayerButtonText()}
            </span>
            {selectedPlayer && (
              <button
                className="rfaFirstRound-clear"
                onClick={clearPlayerSelection}
                aria-label="Clear player selection"
                type="button"
              >
                ×
              </button>
            )}
            <span className="rfaFirstRound-arrow">
              {isPlayerOpen ? "▲" : "▼"}
            </span>
          </button>

          {playerError && (
            <div className="rfaFirstRound-error">{playerError}</div>
          )}

          {isPlayerOpen && (
            <div className="rfaFirstRound-menu">
              {loadingPlayers ? (
                <div className="rfaFirstRound-loading">
                  Loading RFA players...
                </div>
              ) : players.length === 0 ? (
                <div className="rfaFirstRound-empty">No RFA players found</div>
              ) : (
                <ul className="rfaFirstRound-list">
                  {players.map((player) => (
                    <li
                      key={player.id}
                      className={`rfaFirstRound-item ${selectedPlayer?.id === player.id ? "selected" : ""}`}
                      onClick={() => handlePlayerSelect(player)}
                    >
                      <span className="rfaFirstRound-item-name">
                        {player.active_roster}
                      </span>
                      {selectedPlayer?.id === player.id && (
                        <span className="rfaFirstRound-checkmark">✓</span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Поле для ввода суммы контракта */}
      <div className="rfaFirstRound-section">
        <h3 className="rfaFirstRound-section-title">
          Contract Amount (in thousands)
        </h3>
        <div className="rfaFirstRound-input-wrapper">
          <input
            ref={contractInputRef}
            type="text"
            className="rfaFirstRound-input"
            onChange={handleContractAmountChange}
            placeholder="Enter contract amount"
            inputMode="numeric"
          />
          {contractAmount && (
            <button
              className="rfaFirstRound-input-clear"
              onClick={clearContractAmount}
              aria-label="Clear contract amount"
              type="button"
            >
              ×
            </button>
          )}
        </div>
        <div className="rfaFirstRound-input-hint">
          Enter amount in thousands (e.g., 1 000 = $1,000,000)
        </div>
      </div>

      {/* Выбор типа контракта */}
      <div className="rfaFirstRound-section">
        <h3 className="rfaFirstRound-section-title">Contract Type</h3>
        <div
          className="rfaFirstRound-dropdown-wrapper"
          ref={contractTypeDropdownRef}
        >
          <button
            className={`rfaFirstRound-toggle ${selectedContractType ? "has-selection" : ""}`}
            onClick={toggleContractTypeDropdown}
            type="button"
          >
            <span className="rfaFirstRound-button-text">
              {getContractTypeButtonText()}
            </span>
            {selectedContractType && (
              <button
                className="rfaFirstRound-clear"
                onClick={clearContractTypeSelection}
                aria-label="Clear contract type selection"
                type="button"
              >
                ×
              </button>
            )}
            <span className="rfaFirstRound-arrow">
              {isContractTypeOpen ? "▲" : "▼"}
            </span>
          </button>

          {isContractTypeOpen && (
            <div className="rfaFirstRound-menu">
              <ul className="rfaFirstRound-list">
                {CONTRACT_OPTIONS.map((option) => (
                  <li
                    key={option.id}
                    className={`rfaFirstRound-item ${selectedContractType?.id === option.id ? "selected" : ""}`}
                    onClick={() => handleContractTypeSelect(option)}
                  >
                    <div className="rfaFirstRound-contract-option">
                      <div className="rfaFirstRound-contract-label">
                        {option.label}
                      </div>
                      <div className="rfaFirstRound-contract-description">
                        {option.description}
                      </div>
                    </div>
                    {selectedContractType?.id === option.id && (
                      <span className="rfaFirstRound-checkmark">✓</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Выбор срока контракта */}
      <div className="rfaFirstRound-section">
        <h3 className="rfaFirstRound-section-title">Contract Length</h3>
        <div
          className="rfaFirstRound-dropdown-wrapper"
          ref={contractLengthDropdownRef}
        >
          <button
            className={`rfaFirstRound-toggle ${selectedContractLength ? "has-selection" : ""}`}
            onClick={toggleContractLengthDropdown}
            type="button"
          >
            <span className="rfaFirstRound-button-text">
              {getContractLengthButtonText()}
            </span>
            {selectedContractLength && (
              <button
                className="rfaFirstRound-clear"
                onClick={clearContractLengthSelection}
                aria-label="Clear contract length selection"
                type="button"
              >
                ×
              </button>
            )}
            <span className="rfaFirstRound-arrow">
              {isContractLengthOpen ? "▲" : "▼"}
            </span>
          </button>

          {isContractLengthOpen && (
            <div className="rfaFirstRound-menu">
              <ul className="rfaFirstRound-list">
                {CONTRACT_LENGTH_OPTIONS.map((option) => (
                  <li
                    key={option.id}
                    className={`rfaFirstRound-item ${selectedContractLength?.id === option.id ? "selected" : ""}`}
                    onClick={() => handleContractLengthSelect(option)}
                  >
                    <span className="rfaFirstRound-item-name">
                      {option.label}
                    </span>
                    {selectedContractLength?.id === option.id && (
                      <span className="rfaFirstRound-checkmark">✓</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Выбор опции контракта */}
      <div className="rfaFirstRound-section">
        <h3 className="rfaFirstRound-section-title">Contract Option</h3>
        <div
          className="rfaFirstRound-dropdown-wrapper"
          ref={contractClauseDropdownRef}
        >
          <button
            className={`rfaFirstRound-toggle ${selectedContractClause ? "has-selection" : ""}`}
            onClick={toggleContractClauseDropdown}
            type="button"
          >
            <span className="rfaFirstRound-button-text">
              {getContractClauseButtonText()}
            </span>
            {selectedContractClause && (
              <button
                className="rfaFirstRound-clear"
                onClick={clearContractClauseSelection}
                aria-label="Clear contract clause selection"
                type="button"
              >
                ×
              </button>
            )}
            <span className="rfaFirstRound-arrow">
              {isContractClauseOpen ? "▲" : "▼"}
            </span>
          </button>

          {isContractClauseOpen && (
            <div className="rfaFirstRound-menu">
              <ul className="rfaFirstRound-list">
                {CONTRACT_CLAUSE_OPTIONS.map((option) => (
                  <li
                    key={option.id}
                    className={`rfaFirstRound-item ${selectedContractClause?.id === option.id ? "selected" : ""}`}
                    onClick={() => handleContractClauseSelect(option)}
                  >
                    <span className="rfaFirstRound-item-name">
                      {option.label}
                    </span>
                    {selectedContractClause?.id === option.id && (
                      <span className="rfaFirstRound-checkmark">✓</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Поле для ввода подписного бонуса */}
      <div className="rfaFirstRound-section">
        <h3 className="rfaFirstRound-section-title">
          Укажите размер подписного бонуса в контракте игрока (не более 10% от
          общей гарантированной суммы, если необходимо):
        </h3>
        <div className="rfaFirstRound-input-wrapper">
          <input
            ref={bonusInputRef}
            type="text"
            className="rfaFirstRound-input"
            onChange={handleBonusPercentageChange}
            placeholder="Введите процент (например: 5 или 5.5)"
            inputMode="decimal"
          />
          {bonusPercentage && (
            <button
              className="rfaFirstRound-input-clear"
              onClick={clearBonusPercentage}
              aria-label="Clear bonus percentage"
              type="button"
            >
              ×
            </button>
          )}
        </div>
        <div className="rfaFirstRound-input-hint">
          Необязательное поле. Введите процент (например: 5 для 5%)
        </div>
      </div>

      {/* Выбор условий подписания */}
      <div className="rfaFirstRound-section">
        <h3 className="rfaFirstRound-section-title">
          Условия подписания контракта
        </h3>
        <div
          className="rfaFirstRound-dropdown-wrapper"
          ref={signingConditionDropdownRef}
        >
          <button
            className={`rfaFirstRound-toggle ${selectedSigningCondition ? "has-selection" : ""}`}
            onClick={toggleSigningConditionDropdown}
            type="button"
          >
            <span className="rfaFirstRound-button-text">
              {getSigningConditionButtonText()}
            </span>
            {selectedSigningCondition && (
              <button
                className="rfaFirstRound-clear"
                onClick={clearSigningConditionSelection}
                aria-label="Clear signing condition selection"
                type="button"
              >
                ×
              </button>
            )}
            <span className="rfaFirstRound-arrow">
              {isSigningConditionOpen ? "▲" : "▼"}
            </span>
          </button>

          {isSigningConditionOpen && (
            <div className="rfaFirstRound-menu">
              <ul className="rfaFirstRound-list">
                {SIGNING_CONDITION_OPTIONS.map((option) => (
                  <li
                    key={option.id}
                    className={`rfaFirstRound-item ${selectedSigningCondition?.id === option.id ? "selected" : ""}`}
                    onClick={() => handleSigningConditionSelect(option)}
                  >
                    <span className="rfaFirstRound-item-name">
                      {option.label}
                    </span>
                    {selectedSigningCondition?.id === option.id && (
                      <span className="rfaFirstRound-checkmark">✓</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Поле для комментария (отображается только если выбрано "Другое") */}
      {selectedSigningCondition?.id === "other" && (
        <div className="rfaFirstRound-section">
          <h3 className="rfaFirstRound-section-title">Оставьте комментарий</h3>
          <div className="rfaFirstRound-input-wrapper">
            <input
              ref={commentInputRef}
              type="text"
              className="rfaFirstRound-input"
              value={comment}
              onChange={handleCommentChange}
              placeholder="Введите ваш комментарий"
            />
            {comment && (
              <button
                className="rfaFirstRound-input-clear"
                onClick={clearComment}
                aria-label="Clear comment"
                type="button"
              >
                ×
              </button>
            )}
          </div>
          <div className="rfaFirstRound-input-hint">
            Укажите дополнительные условия подписания
          </div>
        </div>
      )}
    </div>
  );
};

export default RFAUserFirstRound;
