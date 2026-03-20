import React, { useState, useEffect } from "react";
import { supabase } from "../../../../Supabase";
import "./picksBody.css";

// Тип для пика с командой и примечанием
type PickWithDetails = {
  pick: string;
  team: string;
  note: string;
};

// Соответствие между колонками пиков, команд и примечаний
const columnMapping = [
  { pick: "1R26", team: "team1R26", note: "note1R26" },
  { pick: "2R26", team: "team2R26", note: "note2R26" },
  { pick: "1R27", team: "team1R27", note: "note1R27" },
  { pick: "2R27", team: "team2R27", note: "note2R27" },
  { pick: "1R28", team: "team1R28", note: "note1R28" },
  { pick: "2R28", team: "team2R28", note: "note2R28" },
];

const PicksBody: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pickObjects, setPickObjects] = useState<PickWithDetails[]>([]);
  const [selectedPicks, setSelectedPicks] = useState<PickWithDetails[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Состояния для редактирования команды
  const [editingPick, setEditingPick] = useState<string | null>(null);
  const [editingTeamValue, setEditingTeamValue] = useState("");
  const [teamOptions, setTeamOptions] = useState<string[]>([]);
  const [loadingTeams, setLoadingTeams] = useState(false);
  // Состояние для поиска в модалке редактирования команды
  const [teamSearchEdit, setTeamSearchEdit] = useState("");

  // Состояния для редактирования примечания
  const [editingNotePick, setEditingNotePick] = useState<string | null>(null);
  const [editingNoteValue, setEditingNoteValue] = useState("");

  // Состояние для дропдауна команд
  const [isTeamDropdownOpen, setIsTeamDropdownOpen] = useState(false);
  // Состояние для поиска по командам
  const [teamSearchTerm, setTeamSearchTerm] = useState("");

  // Состояния для множественного выбора команд
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setIsDropdownOpen(false);
    setIsTeamDropdownOpen(false);
    setSearchTerm("");
    setTeamSearchTerm("");
    setEditingPick(null);
    setEditingNotePick(null);
    setSelectedTeams([]);
    setTeamSearchEdit("");
  };

  // Загрузка пиков при открытии модального окна
  useEffect(() => {
    if (!isModalOpen) return;

    const fetchPicks = async () => {
      setLoading(true);
      setError(null);
      setSearchTerm("");

      try {
        const { data, error } = await supabase
          .from("Picks")
          .select(
            "1R26, team1R26, note1R26, 2R26, team2R26, note2R26, 1R27, team1R27, note1R27, 2R27, team2R27, note2R27, 1R28, team1R28, note1R28, 2R28, team2R28, note2R28",
          );

        if (error) throw error;

        if (data && data.length > 0) {
          const pickToTeam = new Map<string, string>();
          const pickToNote = new Map<string, string>();

          data.forEach((row: any) => {
            columnMapping.forEach(({ pick, team, note }) => {
              const pickValue = row[pick];
              const teamValue = row[team];
              const noteValue = row[note];

              if (
                pickValue &&
                typeof pickValue === "string" &&
                pickValue.trim() !== ""
              ) {
                const trimmedPick = pickValue.trim();
                const trimmedTeam =
                  teamValue && typeof teamValue === "string"
                    ? teamValue.trim()
                    : "";
                const trimmedNote =
                  noteValue && typeof noteValue === "string"
                    ? noteValue.trim()
                    : "";

                if (
                  pickToTeam.has(trimmedPick) &&
                  pickToTeam.get(trimmedPick) !== trimmedTeam
                ) {
                  console.warn(
                    `Пик "${trimmedPick}" имеет разные команды: "${pickToTeam.get(trimmedPick)}" и "${trimmedTeam}". Используется последняя.`,
                  );
                }
                pickToTeam.set(trimmedPick, trimmedTeam);

                if (
                  pickToNote.has(trimmedPick) &&
                  pickToNote.get(trimmedPick) !== trimmedNote
                ) {
                  console.warn(
                    `Пик "${trimmedPick}" имеет разные примечания: "${pickToNote.get(trimmedPick)}" и "${trimmedNote}". Используется последнее.`,
                  );
                }
                pickToNote.set(trimmedPick, trimmedNote);
              }
            });
          });

          const picksArray = Array.from(pickToTeam.keys()).map((pick) => ({
            pick,
            team: pickToTeam.get(pick) || "",
            note: pickToNote.get(pick) || "",
          }));

          setPickObjects(picksArray);
          setSelectedPicks([]);
        } else {
          setPickObjects([]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Ошибка загрузки данных");
      } finally {
        setLoading(false);
      }
    };

    fetchPicks();
  }, [isModalOpen]);

  // Загрузка списка команд из таблицы Head
  useEffect(() => {
    const fetchTeams = async () => {
      setLoadingTeams(true);
      try {
        const { data, error } = await supabase.from("Head").select("team_name");
        if (error) throw error;
        if (data) {
          const uniqueTeams = Array.from(
            new Set(data.map((item) => item.team_name).filter(Boolean)),
          );
          setTeamOptions(uniqueTeams);
        }
      } catch (err) {
        console.error("Ошибка загрузки команд:", err);
      } finally {
        setLoadingTeams(false);
      }
    };

    fetchTeams();
  }, []);

  // Закрытие дропдаунов при клике вне
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        !target.closest(".pb-dropdown-container") &&
        !target.closest(".pb-team-dropdown-container")
      ) {
        setIsDropdownOpen(false);
        setIsTeamDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Добавление пика в выбранные
  const addPick = (pickObj: PickWithDetails) => {
    if (!selectedPicks.some((p) => p.pick === pickObj.pick)) {
      setSelectedPicks([...selectedPicks, pickObj]);
    }
  };

  // Удаление пика из выбранных
  const removePick = (pick: string) => {
    setSelectedPicks(selectedPicks.filter((p) => p.pick !== pick));
  };

  // Редактирование команды
  const startEditing = (pickObj: PickWithDetails) => {
    setEditingPick(pickObj.pick);
    setEditingTeamValue(pickObj.team);
    setTeamSearchEdit(""); // сброс поиска при открытии
  };

  const cancelEditing = () => {
    setEditingPick(null);
    setEditingTeamValue("");
    setTeamSearchEdit("");
  };

  const saveEditing = async () => {
    if (!editingPick) return;

    try {
      const updatePromises = columnMapping.map(async ({ pick, team }) => {
        const { error } = await supabase
          .from("Picks")
          .update({ [team]: editingTeamValue })
          .eq(pick, editingPick);

        if (error) throw error;
      });

      await Promise.all(updatePromises);

      setSelectedPicks((prev) =>
        prev.map((p) =>
          p.pick === editingPick ? { ...p, team: editingTeamValue } : p,
        ),
      );
      setPickObjects((prev) =>
        prev.map((p) =>
          p.pick === editingPick ? { ...p, team: editingTeamValue } : p,
        ),
      );

      cancelEditing();
    } catch (err) {
      console.error("Ошибка при сохранении команды:", err);
      alert("Не удалось сохранить команду. Подробности в консоли.");
    }
  };

  // Редактирование примечания
  const startEditingNote = (pickObj: PickWithDetails) => {
    setEditingNotePick(pickObj.pick);
    setEditingNoteValue(pickObj.note);
  };

  const cancelEditingNote = () => {
    setEditingNotePick(null);
    setEditingNoteValue("");
  };

  const saveEditingNote = async () => {
    if (!editingNotePick) return;

    try {
      const updatePromises = columnMapping.map(async ({ pick, note }) => {
        const { error } = await supabase
          .from("Picks")
          .update({ [note]: editingNoteValue })
          .eq(pick, editingNotePick);

        if (error) throw error;
      });

      await Promise.all(updatePromises);

      setSelectedPicks((prev) =>
        prev.map((p) =>
          p.pick === editingNotePick ? { ...p, note: editingNoteValue } : p,
        ),
      );
      setPickObjects((prev) =>
        prev.map((p) =>
          p.pick === editingNotePick ? { ...p, note: editingNoteValue } : p,
        ),
      );

      cancelEditingNote();
    } catch (err) {
      console.error("Ошибка при сохранении примечания:", err);
      alert("Не удалось сохранить примечание. Подробности в консоли.");
    }
  };

  // Обработчик выбора/снятия команды
  const toggleTeamSelection = (team: string) => {
    setSelectedTeams((prev) =>
      prev.includes(team) ? prev.filter((t) => t !== team) : [...prev, team],
    );
  };

  // Выбрать все отфильтрованные команды
  const selectAllTeams = () => {
    setSelectedTeams(filteredTeams);
  };

  // Снять все команды
  const deselectAllTeams = () => {
    setSelectedTeams([]);
  };

  // Доступные для выбора пики
  const availablePicks = pickObjects.filter(
    (obj) => !selectedPicks.some((selected) => selected.pick === obj.pick),
  );

  // Фильтрация пиков по поиску
  const filteredPicks = availablePicks.filter((obj) =>
    obj.pick.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Фильтрация команд по поиску
  const filteredTeams = teamOptions.filter((team) =>
    team.toLowerCase().includes(teamSearchTerm.toLowerCase()),
  );

  // Группировка пиков по выбранным командам
  const picksByTeam = selectedTeams.reduce(
    (acc, team) => {
      const teamPicks = pickObjects.filter((p) => p.team === team);
      if (teamPicks.length > 0) {
        acc[team] = teamPicks;
      }
      return acc;
    },
    {} as Record<string, PickWithDetails[]>,
  );

  return (
    <div>
      <button className="pb-select-pick-button" onClick={openModal}>
        Выбор Пика
      </button>

      {isModalOpen && (
        <div className="pb-modal-overlay" onClick={closeModal}>
          <div
            className="pb-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Выбор пиков</h2>

            {loading && <p>Загрузка пиков...</p>}
            {error && <p className="pb-error">Ошибка: {error}</p>}

            {!loading && !error && (
              <>
                {/* Контейнер с двумя кнопками */}
                <div
                  style={{ display: "flex", gap: "10px", marginBottom: "10px" }}
                >
                  {/* Дропдаун пиков */}
                  <div className="pb-dropdown-container">
                    <button
                      className="pb-dropdown-trigger"
                      onClick={() => {
                        setIsDropdownOpen(!isDropdownOpen);
                        setIsTeamDropdownOpen(false);
                      }}
                    >
                      {isDropdownOpen ? "Скрыть список ▲" : "Выбрать пик ▼"}
                    </button>

                    {isDropdownOpen && (
                      <div className="pb-dropdown-menu">
                        <div className="pb-search-container">
                          <input
                            type="text"
                            placeholder="Поиск пика..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pb-search-input"
                            autoFocus
                          />
                        </div>
                        {filteredPicks.length === 0 ? (
                          <div className="pb-dropdown-empty">
                            {availablePicks.length === 0
                              ? "Нет доступных пиков"
                              : "Ничего не найдено"}
                          </div>
                        ) : (
                          filteredPicks.map((obj) => (
                            <div
                              key={obj.pick}
                              className="pb-dropdown-item"
                              onClick={() => addPick(obj)}
                            >
                              {obj.pick}
                              {obj.team ? ` (${obj.team})` : " (без команды)"}
                              {obj.note && ` — прим: ${obj.note}`}
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>

                  {/* Дропдаун команд с поиском */}
                  <div className="pb-team-dropdown-container">
                    <button
                      className="pb-dropdown-trigger"
                      onClick={() => {
                        setIsTeamDropdownOpen(!isTeamDropdownOpen);
                        setIsDropdownOpen(false);
                      }}
                    >
                      {isTeamDropdownOpen
                        ? "Скрыть список ▲"
                        : "Выбор команды ▼"}
                    </button>

                    {isTeamDropdownOpen && (
                      <div className="pb-team-dropdown-menu pb-dropdown-menu">
                        {loadingTeams ? (
                          <div className="pb-dropdown-empty">
                            Загрузка команд...
                          </div>
                        ) : teamOptions.length === 0 ? (
                          <div className="pb-dropdown-empty">Нет команд</div>
                        ) : (
                          <>
                            {/* Поиск по командам */}
                            <div
                              className="pb-search-container"
                              style={{
                                padding: "8px",
                                borderBottom: "1px solid #eee",
                              }}
                            >
                              <input
                                type="text"
                                placeholder="Поиск команды..."
                                value={teamSearchTerm}
                                onChange={(e) =>
                                  setTeamSearchTerm(e.target.value)
                                }
                                className="pb-search-input"
                                autoFocus
                              />
                            </div>
                            {/* Кнопки массового выбора */}
                            <div
                              style={{
                                display: "flex",
                                gap: "5px",
                                padding: "8px",
                                borderBottom: "1px solid #eee",
                              }}
                            >
                              <button
                                onClick={selectAllTeams}
                                style={{ fontSize: "12px", padding: "2px 6px" }}
                              >
                                Выбрать все
                              </button>
                              <button
                                onClick={deselectAllTeams}
                                style={{ fontSize: "12px", padding: "2px 6px" }}
                              >
                                Снять все
                              </button>
                            </div>
                            {/* Список команд с чекбоксами */}
                            {filteredTeams.length === 0 ? (
                              <div className="pb-dropdown-empty">
                                Ничего не найдено
                              </div>
                            ) : (
                              filteredTeams.map((team) => (
                                <div
                                  key={team}
                                  className="pb-dropdown-item"
                                  onClick={() => toggleTeamSelection(team)}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                  }}
                                >
                                  <input
                                    type="checkbox"
                                    checked={selectedTeams.includes(team)}
                                    onChange={() => {}}
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                  <span>{team}</span>
                                </div>
                              ))
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Блок с пиками по каждой выбранной команде */}
                {selectedTeams.length > 0 && (
                  <div className="pb-team-picks-container">
                    <h4>Пики по командам:</h4>
                    {Object.entries(picksByTeam).map(([team, picks]) => (
                      <div key={team} className="pb-team-group">
                        <h5 className="pb-team-group-title">{team}</h5>
                        {picks.length === 0 ? (
                          <p className="pb-no-picks">Нет пиков</p>
                        ) : (
                          <div className="pb-team-picks-list">
                            {picks.map((pick) => (
                              <div
                                key={pick.pick}
                                className="pb-team-pick-item"
                                onClick={() => addPick(pick)}
                              >
                                {pick.pick}
                                {pick.note && (
                                  <span
                                    className="pb-note-indicator"
                                    title={pick.note}
                                  >
                                    {" "}
                                    📝{" "}
                                    {pick.note.length > 15
                                      ? pick.note.slice(0, 12) + "..."
                                      : pick.note}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                    {/* Если для некоторых выбранных команд нет пиков */}
                    {Object.keys(picksByTeam).length < selectedTeams.length && (
                      <p className="pb-no-picks">
                        Для команд:{" "}
                        {selectedTeams
                          .filter((t) => !picksByTeam[t])
                          .join(", ")}{" "}
                        нет пиков
                      </p>
                    )}
                  </div>
                )}

                <div className="pb-selected-picks">
                  {selectedPicks.length === 0 ? (
                    <p className="pb-no-picks">Пики не выбраны</p>
                  ) : (
                    selectedPicks.map((obj) => (
                      <span key={obj.pick} className="pb-pick-chip">
                        {obj.pick} – {obj.team || "без команды"}
                        {obj.note && (
                          <span className="pb-note-badge" title={obj.note}>
                            {" "}
                            📝{" "}
                            {obj.note.length > 15
                              ? obj.note.slice(0, 12) + "..."
                              : obj.note}
                          </span>
                        )}
                        <button
                          className="pb-edit-chip"
                          onClick={() => startEditingNote(obj)}
                          aria-label="Редактировать примечание"
                          title="Редактировать примечание"
                        >
                          📝
                        </button>
                        <button
                          className="pb-edit-chip"
                          onClick={() => startEditing(obj)}
                          aria-label="Редактировать команду"
                          title="Редактировать команду"
                        >
                          ✎
                        </button>
                        <button
                          className="pb-remove-chip"
                          onClick={() => removePick(obj.pick)}
                          aria-label="Удалить"
                        >
                          ×
                        </button>
                      </span>
                    ))
                  )}
                </div>

                {/* Модальное окно редактирования команды с поиском */}
                {editingPick && (
                  <div className="pb-edit-modal">
                    <div className="pb-edit-content">
                      <h4>Редактирование команды для "{editingPick}"</h4>
                      {loadingTeams ? (
                        <p>Загрузка списка команд...</p>
                      ) : (
                        <>
                          {/* Поле поиска */}
                          <input
                            type="text"
                            placeholder="Поиск команды..."
                            value={teamSearchEdit}
                            onChange={(e) => setTeamSearchEdit(e.target.value)}
                            className="pb-search-input"
                            style={{ marginBottom: "8px", width: "100%" }}
                          />
                          {/* Список команд */}
                          <div
                            style={{
                              maxHeight: "200px",
                              overflowY: "auto",
                              border: "1px solid #ccc",
                              borderRadius: "4px",
                            }}
                          >
                            <div
                              className={`pb-team-option ${editingTeamValue === "" ? "selected" : ""}`}
                              onClick={() => setEditingTeamValue("")}
                              style={{
                                padding: "8px",
                                cursor: "pointer",
                                backgroundColor:
                                  editingTeamValue === ""
                                    ? "#e0e0e0"
                                    : "transparent",
                              }}
                            >
                              — без команды —
                            </div>
                            {teamOptions
                              .filter((team) =>
                                team
                                  .toLowerCase()
                                  .includes(teamSearchEdit.toLowerCase()),
                              )
                              .map((team) => (
                                <div
                                  key={team}
                                  className={`pb-team-option ${editingTeamValue === team ? "selected" : ""}`}
                                  onClick={() => setEditingTeamValue(team)}
                                  style={{
                                    padding: "8px",
                                    cursor: "pointer",
                                    backgroundColor:
                                      editingTeamValue === team
                                        ? "#e0e0e0"
                                        : "transparent",
                                    borderTop: "1px solid #eee",
                                  }}
                                >
                                  {team}
                                </div>
                              ))}
                          </div>
                        </>
                      )}
                      <div className="pb-edit-actions">
                        <button onClick={saveEditing}>Сохранить</button>
                        <button onClick={cancelEditing}>Отмена</button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Модальное окно редактирования примечания */}
                {editingNotePick && (
                  <div className="pb-edit-modal">
                    <div className="pb-edit-content">
                      <h4>Редактирование примечания для "{editingNotePick}"</h4>
                      <textarea
                        value={editingNoteValue}
                        onChange={(e) => setEditingNoteValue(e.target.value)}
                        className="pb-note-input"
                        rows={3}
                        placeholder="Введите примечание..."
                      />
                      <div className="pb-edit-actions">
                        <button onClick={saveEditingNote}>Сохранить</button>
                        <button onClick={cancelEditingNote}>Отмена</button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            <button onClick={closeModal} className="pb-close-btn">
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PicksBody;
