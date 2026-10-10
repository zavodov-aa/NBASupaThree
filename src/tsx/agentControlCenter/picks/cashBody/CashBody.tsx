import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../../../../Supabase";
import "./cashBody.css";

interface TeamData {
  team_name: string;
  cash_money: number;
}

// Пропсы
type CashBodyProps = {
  readOnly?: boolean;
};

const CashBody: React.FC<CashBodyProps> = ({ readOnly = false }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [teamsData, setTeamsData] = useState<TeamData[]>([]);
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [editingTeam, setEditingTeam] = useState<string | null>(null);
  const [operationAmount, setOperationAmount] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState<string>("");

  // Загрузка команд с принудительным преобразованием cash_money в число
  useEffect(() => {
    const fetchTeamsData = async () => {
      const { data, error } = await supabase
        .from("Head")
        .select("team_name, cash_money");
      if (error) {
        console.error("Ошибка загрузки данных:", error);
        return;
      }
      const uniqueMap = new Map<string, number>();
      data?.forEach((item) => {
        if (!uniqueMap.has(item.team_name)) {
          const cash = parseFloat(item.cash_money);
          uniqueMap.set(item.team_name, isNaN(cash) ? 0 : cash);
        }
      });
      const uniqueData = Array.from(uniqueMap, ([team_name, cash_money]) => ({
        team_name,
        cash_money,
      }));
      setTeamsData(uniqueData);
    };
    fetchTeamsData();
  }, []);

  // Закрытие дропдауна по клику вне
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    // сбрасываем редактирование при закрытии
    setEditingTeam(null);
    setOperationAmount(null);
    setInputValue("");
  };

  const filteredTeams = teamsData.filter((team) =>
    team.team_name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleTeamToggle = (teamName: string) => {
    setSelectedTeams((prev) =>
      prev.includes(teamName)
        ? prev.filter((t) => t !== teamName)
        : [...prev, teamName],
    );
  };

  const clearSelection = () => setSelectedTeams([]);

  const selectedTeamsWithCash = selectedTeams.map((teamName) => {
    const team = teamsData.find((t) => t.team_name === teamName);
    return { team_name: teamName, cash_money: team?.cash_money ?? 0 };
  });

  const handleSaveCash = async (teamName: string, newCash: number) => {
    if (readOnly) return;

    try {
      const { error } = await supabase
        .from("Head")
        .update({ cash_money: newCash })
        .eq("team_name", teamName);

      if (error) {
        console.error("Ошибка обновления cash:", error);
        alert("Не удалось обновить сумму. Попробуйте ещё раз.");
        return;
      }

      setTeamsData((prevData) =>
        prevData.map((team) =>
          team.team_name === teamName ? { ...team, cash_money: newCash } : team,
        ),
      );

      setEditingTeam(null);
      setOperationAmount(null);
      setInputValue("");
    } catch (err) {
      console.error("Неожиданная ошибка:", err);
      alert("Произошла ошибка при сохранении.");
    }
  };

  const handleAdd = async (teamName: string) => {
    if (readOnly) return;
    if (!operationAmount || operationAmount <= 0) {
      alert("Введите положительную сумму для прибавления.");
      return;
    }
    const team = teamsData.find((t) => t.team_name === teamName);
    const currentCash = team ? Number(team.cash_money) : 0;
    const newCash = currentCash + operationAmount;
    await handleSaveCash(teamName, newCash);
  };

  const handleSubtract = async (teamName: string) => {
    if (readOnly) return;
    if (!operationAmount || operationAmount <= 0) {
      alert("Введите положительную сумму для вычитания.");
      return;
    }
    const team = teamsData.find((t) => t.team_name === teamName);
    const currentCash = team ? Number(team.cash_money) : 0;
    const newCash = currentCash - operationAmount;
    if (newCash < 0) {
      alert("Сумма не может стать отрицательной.");
      return;
    }
    await handleSaveCash(teamName, newCash);
  };

  // Форматирование числа с пробелами
  const formatNumber = (num: number | null | undefined): string => {
    if (num === null || num === undefined || isNaN(num)) return "0";
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  // Обработчик ввода суммы с пробелами
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const numericString = raw.replace(/\s/g, "");
    const num = parseFloat(numericString);
    if (isNaN(num)) {
      setOperationAmount(null);
      setInputValue("");
    } else {
      setOperationAmount(num);
      setInputValue(formatNumber(num));
    }
  };

  // При начале редактирования поле ввода пустое, текущая сумма отображается выше
  const startEditing = (team: { team_name: string; cash_money: number }) => {
    if (readOnly) return;
    setEditingTeam(team.team_name);
    setOperationAmount(null);
    setInputValue(""); // поле пустое
  };

  return (
    <>
      <button onClick={openModal} className="cb-button">
        Cash
      </button>

      {isModalOpen && (
        <div className="cb-modal-overlay" onClick={closeModal}>
          <div
            className="cb-modal-content"
            onClick={(e: React.MouseEvent<HTMLDivElement>) =>
              e.stopPropagation()
            }
          >
            <h2 className="cb-modal-title">Распределение Cash</h2>
            <p className="cb-modal-text">Выберите команды:</p>

            <div className="cb-team-selector" ref={dropdownRef}>
              <button
                className="cb-dropdown-button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                {selectedTeams.length > 0
                  ? `Выбрано: ${selectedTeams.length}`
                  : "Выберите команды"}
              </button>

              {isDropdownOpen && (
                <div className="cb-dropdown-menu">
                  <input
                    type="text"
                    placeholder="Поиск команды..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="cb-search-input"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="cb-teams-list">
                    {filteredTeams.length === 0 ? (
                      <div className="cb-no-teams">Команды не найдены</div>
                    ) : (
                      filteredTeams.map((team) => (
                        <label key={team.team_name} className="cb-team-item">
                          <input
                            type="checkbox"
                            checked={selectedTeams.includes(team.team_name)}
                            onChange={() => handleTeamToggle(team.team_name)}
                          />
                          {team.team_name} (Cash:{" "}
                          {formatNumber(team.cash_money)})
                        </label>
                      ))
                    )}
                  </div>
                  <div className="cb-dropdown-actions">
                    <button onClick={clearSelection} className="cb-clear-btn">
                      Сбросить
                    </button>
                    <button
                      onClick={() => setIsDropdownOpen(false)}
                      className="cb-apply-btn"
                    >
                      Готово
                    </button>
                  </div>
                </div>
              )}
            </div>

            {selectedTeams.length > 0 && (
              <div className="cb-selected-teams">
                <h3>Выбранные команды и сумма Cash:</h3>
                <ul className="cb-cash-list">
                  {selectedTeamsWithCash.map((team) => (
                    <li key={team.team_name}>
                      <span className="cb-team-name">{team.team_name}: </span>
                      {editingTeam === team.team_name ? (
                        <div className="cb-edit-container">
                          <div className="cb-current-cash">
                            Текущая сумма: {formatNumber(team.cash_money)}
                          </div>
                          <input
                            type="text"
                            value={inputValue}
                            onChange={handleInputChange}
                            className="cb-edit-input"
                            placeholder="Сумма операции"
                            autoFocus
                          />
                          <div className="cb-operation-buttons">
                            <button
                              onClick={() => handleAdd(team.team_name)}
                              className="cb-save-btn"
                            >
                              Прибавить
                            </button>
                            <button
                              onClick={() => handleSubtract(team.team_name)}
                              className="cb-cancel-edit-btn"
                            >
                              Убавить
                            </button>
                          </div>
                          <button
                            onClick={() => {
                              setEditingTeam(null);
                              setInputValue("");
                              setOperationAmount(null);
                            }}
                            className="cb-cancel-edit-btn"
                          >
                            Отмена
                          </button>
                        </div>
                      ) : (
                        <span className="cb-cash-amount">
                          {formatNumber(team.cash_money)}
                          {/* 👈 кнопка редактирования — только админам */}
                          {!readOnly && (
                            <button
                              onClick={() => startEditing(team)}
                              className="cb-edit-icon"
                              title="Редактировать сумму"
                            >
                              ✏️
                            </button>
                          )}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button onClick={closeModal} className="cb-close-btn">
              Закрыть
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default CashBody;
