import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import "./headInfoAgentControlCenter.css";
import logo from "../../img/LogoLeague4kFinal.png";

type Head = {
  id: string;
  team_name: string;
  conference: string;
  division: string;
  gm: string;
  salary_cap: string;
  cap_hit: string;
  cap_space: string;
  cash_money: string;
  standing: string;
  penalties: string;
  active_roster: string;
  dead_cap: string;
  g_leage: string;
  extra_pos: string;
  last_season_result: string;
  in_team_since: string;
  championships: string;
  regular_best: string;
  division_winner: string;
  playoffs: string;
  best_result: string;
  head_coach: string;
  name_coach: string;
  coach_pg: string;
  coach_sg: string;
  coach_sf: string;
  coach_pf: string;
  coach_c: string;
  coach_star: string;
  coach_start: string;
  coach_bench: string;
  coach_g1: string;
  coach_g2: string;
  coach_g3: string;
  coach_neg: string;
  year_pick_one: string;
  draft_pick_one_1r: string;
  draft_pick_one_2r: string;
  year_pick_two: string;
  draft_pick_two_1r: string;
  draft_pick_two_2r: string;
  year_pick_three: string;
  draft_pick_three_1r: string;
  draft_pick_three_2r: string;
};

const supabase = createClient(
  "https://sgbsefgldsmzbvzvpjxt.supabase.co",
  "sb_publishable_Xl99x3YkZHWgS8l-qBSmCg_gXF_Gpcp"
);

const HeadInfoAgentControlCenter = () => {
  const [headInfo, setHeadInfo] = useState<Head[]>([]);
  const [filteredHeadInfo, setFilteredHeadInfo] = useState<Head[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Head>>({});
  const [showFilters, setShowFilters] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showColumnSelector, setShowColumnSelector] = useState(false);

  // Проверяем размер экрана
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const allColumns: (keyof Head)[] = [
    "id",
    "team_name",
    "conference",
    "division",
    "gm",
    "salary_cap",
    "cap_hit",
    "cap_space",
    "cash_money",
    "standing",
    "penalties",
    "active_roster",
    "dead_cap",
    "g_leage",
    "extra_pos",
    "last_season_result",
    "in_team_since",
    "championships",
    "regular_best",
    "division_winner",
    "playoffs",
    "best_result",
    "head_coach",
    "name_coach",
    "coach_pg",
    "coach_sg",
    "coach_sf",
    "coach_pf",
    "coach_c",
    "coach_star",
    "coach_start",
    "coach_bench",
    "coach_g1",
    "coach_g2",
    "coach_g3",
    "coach_neg",
    "year_pick_one",
    "draft_pick_one_1r",
    "draft_pick_one_2r",
    "year_pick_two",
    "draft_pick_two_1r",
    "draft_pick_two_2r",
    "year_pick_three",
    "draft_pick_three_1r",
    "draft_pick_three_2r",
  ];

  const initialColumns: (keyof Head)[] = [
    "id",
    "team_name",
    "gm",
    "salary_cap",
    "cap_hit",
    "cap_space",
    "cash_money",
  ];
  const [visibleColumns, setVisibleColumns] = useState<Set<keyof Head>>(
    new Set(initialColumns)
  );

  const [filters, setFilters] = useState<Record<string, string>>(
    Object.fromEntries(allColumns.map((col) => [col, ""]))
  );

  // Функция для форматирования числа с пробелами
  const formatNumberWithSpaces = (value: string): string => {
    if (!value) return "0";
    const cleanValue = value.replace(/\s/g, "").replace(/[^\d.-]/g, "");
    const numberValue = parseFloat(cleanValue);
    if (isNaN(numberValue)) return value;
    return numberValue
      .toLocaleString("ru-RU", {
        maximumFractionDigits: 0,
        useGrouping: true,
      })
      .replace(/,/g, " ");
  };

  // Функция для обработки ввода чисел с автоматическим форматированием
  const handleNumberInput = (value: string): string => {
    // Удаляем все пробелы и нецифровые символы (кроме минуса)
    const cleanValue = value.replace(/\s/g, "").replace(/[^\d-]/g, "");

    // Если пустая строка, возвращаем пустую
    if (cleanValue === "") return "";

    // Преобразуем в число
    const numberValue = parseFloat(cleanValue);

    // Если не число, возвращаем исходное значение
    if (isNaN(numberValue)) return value;

    // Форматируем с пробелами
    return numberValue
      .toLocaleString("ru-RU", {
        maximumFractionDigits: 0,
        useGrouping: true,
      })
      .replace(/,/g, " ");
  };

  // Функция для парсинга отформатированного числа обратно в числовую строку
  const parseFormattedNumber = (value: string): string => {
    return value.replace(/\s/g, "").replace(/[^\d-]/g, "");
  };

  useEffect(() => {
    const fetchHead = async () => {
      const { data, error } = await supabase
        .from("Head")
        .select("*")
        .order("id");

      if (error) {
        console.error("Error fetching Head:", error);
        return;
      }

      setHeadInfo(data || []);
      setFilteredHeadInfo(data || []);
    };
    fetchHead();
  }, []);

  const safeStringCompareHead = (
    value: string | null | undefined,
    filter: string
  ): boolean => {
    if (!value) return false;
    return value.toLowerCase().includes(filter.toLowerCase());
  };

  const parseNumber = (value: string | null): number => {
    if (!value) return 0;
    try {
      const cleanValue = value.replace(/\s/g, "").replace(/[^\d.-]/g, "");
      return parseFloat(cleanValue) || 0;
    } catch (error) {
      console.error("Error parsing number:", value, error);
      return 0;
    }
  };

  const calculateCapSpace = (salaryCap: string, capHit: string): string => {
    const salaryCapValue = parseNumber(salaryCap);
    const capHitValue = parseNumber(capHit);
    const capSpaceValue = salaryCapValue - capHitValue;
    return handleNumberInput(capSpaceValue.toString());
  };

  useEffect(() => {
    let result = headInfo;

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        result = result.filter((headInfo) =>
          safeStringCompareHead(headInfo[key as keyof Head], value)
        );
      }
    });

    setFilteredHeadInfo(result);
  }, [filters, headInfo]);

  const handleFilterChange = (field: keyof typeof filters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleResetFilters = () => {
    setFilters(Object.fromEntries(allColumns.map((col) => [col, ""])));
  };

  const handleEdit = (headInfo: Head) => {
    setEditingId(headInfo.id);
    const formattedEditData = { ...headInfo };
    const numericFields = [
      "salary_cap",
      "cap_hit",
      "cap_space",
      "cash_money",
      "dead_cap",
      "penalties",
    ];

    numericFields.forEach((field) => {
      if (formattedEditData[field as keyof Head]) {
        formattedEditData[field as keyof Head] = formatNumberWithSpaces(
          formattedEditData[field as keyof Head] as string
        );
      }
    });

    setEditData(formattedEditData);
  };

  const handleSave = async () => {
    if (!editingId) return;

    const dataToSave = { ...editData };
    const numericFields = [
      "salary_cap",
      "cap_hit",
      "cap_space",
      "cash_money",
      "dead_cap",
      "penalties",
    ];

    numericFields.forEach((field) => {
      if (dataToSave[field as keyof Head]) {
        dataToSave[field as keyof Head] = parseFormattedNumber(
          dataToSave[field as keyof Head] as string
        );
      }
    });

    const { error } = await supabase
      .from("Head")
      .update(dataToSave)
      .eq("id", editingId);

    if (error) {
      console.error("Error updating headInfo:", error);
      return;
    }

    setHeadInfo(
      headInfo.map((p) => (p.id === editingId ? { ...p, ...dataToSave } : p))
    );
    setEditingId(null);
    setEditData({});
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleInputChange = (field: keyof Head, value: string) => {
    const numericFields = [
      "salary_cap",
      "cap_hit",
      "cap_space",
      "cash_money",
      "dead_cap",
      "penalties",
    ];

    let processedValue = value;

    // Для числовых полей применяем форматирование с пробелами
    if (numericFields.includes(field)) {
      processedValue = handleNumberInput(value);
    }

    const newEditData = {
      ...editData,
      [field]: processedValue,
    };

    // Автоматически пересчитываем cap_space при изменении salary_cap или cap_hit
    if (field === "salary_cap" || field === "cap_hit") {
      const currentSalaryCap =
        field === "salary_cap" ? processedValue : editData.salary_cap || "";
      const currentCapHit =
        field === "cap_hit" ? processedValue : editData.cap_hit || "";

      if (currentSalaryCap && currentCapHit) {
        const salaryCapNum = parseNumber(
          parseFormattedNumber(currentSalaryCap)
        );
        const capHitNum = parseNumber(parseFormattedNumber(currentCapHit));
        const capSpaceValue = salaryCapNum - capHitNum;

        // Форматируем cap_space с пробелами
        newEditData.cap_space = handleNumberInput(capSpaceValue.toString());
      } else if (currentSalaryCap || currentCapHit) {
        // Если одно из значений пустое, сбрасываем cap_space
        newEditData.cap_space = "";
      }
    }

    setEditData(newEditData);
  };

  const toggleColumnVisibility = (column: keyof Head) => {
    setVisibleColumns((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(column)) {
        newSet.delete(column);
      } else {
        newSet.add(column);
      }
      return newSet;
    });
  };

  const selectAllColumns = () => {
    setVisibleColumns(new Set(allColumns));
  };

  const deselectAllColumns = () => {
    setVisibleColumns(new Set());
  };

  const selectGroupColumns = (columns: (keyof Head)[]) => {
    setVisibleColumns((prev) => {
      const newSet = new Set(prev);
      columns.forEach((column) => newSet.add(column));
      return newSet;
    });
  };

  const deselectGroupColumns = (columns: (keyof Head)[]) => {
    setVisibleColumns((prev) => {
      const newSet = new Set(prev);
      columns.forEach((column) => newSet.delete(column));
      return newSet;
    });
  };

  const columnGroups: Record<string, (keyof Head)[]> = {
    "Basic Info": ["id", "team_name", "conference", "division", "gm"],
    Financials: [
      "salary_cap",
      "cap_hit",
      "cap_space",
      "cash_money",
      "dead_cap",
      "penalties",
    ],
    Roster: ["active_roster", "g_leage", "extra_pos", "standing"],
    Performance: [
      "last_season_result",
      "championships",
      "regular_best",
      "division_winner",
      "playoffs",
      "best_result",
    ],
    Coaching: [
      "head_coach",
      "name_coach",
      "coach_pg",
      "coach_sg",
      "coach_sf",
      "coach_pf",
      "coach_c",
      "coach_star",
      "coach_start",
      "coach_bench",
      "coach_g1",
      "coach_g2",
      "coach_g3",
      "coach_neg",
    ],
    "Draft Picks": [
      "year_pick_one",
      "draft_pick_one_1r",
      "draft_pick_one_2r",
      "year_pick_two",
      "draft_pick_two_1r",
      "draft_pick_two_2r",
      "year_pick_three",
      "draft_pick_three_1r",
      "draft_pick_three_2r",
    ],
    History: ["in_team_since"],
  };

  const numericFields = [
    "salary_cap",
    "cap_hit",
    "cap_space",
    "cash_money",
    "dead_cap",
    "penalties",
  ];

  return (
    <div className="HeadInfoAgent-main">
      {/* Мобильный заголовок */}
      {isMobile && (
        <div className="HeadInfoAgent-mobile-header">
          <div className="HeadInfoAgent-mobile-header-top">
            <a href="/" className="HeadInfoAgent-mobile-logo-link">
              <img
                className="HeadInfoAgent-mobile-logo"
                src={logo}
                alt="League Logo"
              />
            </a>
            <button
              className="HeadInfoAgent-mobile-menu-button"
              onClick={() => setShowColumnSelector(!showColumnSelector)}
            >
              {showColumnSelector ? "✕" : "☰"}
            </button>
          </div>
          <h1 className="HeadInfoAgent-mobile-title">TEAMS</h1>
          <div className="HeadInfoAgent-mobile-status">
            {filteredHeadInfo.length} TEAMS
          </div>
          <div className="HeadInfoAgent-mobile-nav">
            <a
              className="HeadInfoAgent-mobile-nav-link"
              href="/playersRosterAgentControlCenter"
            >
              PLAYERS
            </a>
            <a
              className="HeadInfoAgent-mobile-nav-link"
              href="/deadCapRosterAgentControl"
            >
              DEAD CAP
            </a>
            <a className="HeadInfoAgent-mobile-nav-link" href="/penalties">
              PENALTIES
            </a>
            <a className="HeadInfoAgent-mobile-nav-link" href="/logs">
              LOGS CONSOLE
            </a>
          </div>
        </div>
      )}

      {/* Десктопный заголовок */}
      {!isMobile && (
        <div className="HeadInfoAgent-header">
          <a href="/">
            <img className="logo" src={logo} alt="League Logo" />
          </a>
          <h1 className="HeadInfoAgent-title">TEAM MANAGEMENT CONSOLE</h1>
          <a
            className="HeadInfoAgent-A-Href"
            href="/playersRosterAgentControlCenter"
          >
            <h3>PLAYER MANAGEMENT CONSOLE</h3>
          </a>
          <a className="HeadInfoAgent-A-Href" href="/deadCapRosterAgentControl">
            <h3>DEAD CAP MANAGEMENT CONSOLE</h3>
          </a>
          <a className="HeadInfoAgent-A-Href" href="/penalties">
            PENALTIES CONSOLE
          </a>
          <a className="HeadInfoAgent-A-Href" href="/logs">
            LOGS CONSOLE
          </a>
          <div className="HeadInfoAgent-status-badge">
            {filteredHeadInfo.length} TEAMS ACTIVE • {visibleColumns.size}{" "}
            COLUMNS VISIBLE
          </div>
        </div>
      )}

      {/* Мобильный контроллер представления */}
      {isMobile && (
        <div className="HeadInfoAgent-mobile-view-controls">
          <button
            className="HeadInfoAgent-view-button"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
        </div>
      )}

      {/* Column Selector */}
      {(showColumnSelector || !isMobile) && (
        <div className="HeadInfoAgent-column-selector">
          <div className="HeadInfoAgent-column-selector-header">
            <h3 className="HeadInfoAgent-column-selector-title">
              COLUMN VISIBILITY
            </h3>
            <div className="HeadInfoAgent-mass-selection-buttons">
              <button
                onClick={selectAllColumns}
                className="HeadInfoAgent-small-button"
              >
                Select All
              </button>
              <button
                onClick={deselectAllColumns}
                className="HeadInfoAgent-small-button"
              >
                Deselect All
              </button>
            </div>
          </div>

          {isMobile ? (
            <div className="HeadInfoAgent-mobile-column-groups">
              <div className="HeadInfoAgent-mobile-mass-selection">
                <div className="HeadInfoAgent-mobile-mass-buttons">
                  <button
                    onClick={selectAllColumns}
                    className="HeadInfoAgent-button HeadInfoAgent-mobile-mass-button"
                  >
                    Select All Columns
                  </button>
                  <button
                    onClick={deselectAllColumns}
                    className="HeadInfoAgent-button HeadInfoAgent-mobile-mass-button"
                  >
                    Deselect All Columns
                  </button>
                </div>
              </div>
              {Object.entries(columnGroups).map(([groupName, columns]) => (
                <div
                  key={groupName}
                  className="HeadInfoAgent-mobile-column-group"
                >
                  <div className="HeadInfoAgent-mobile-column-group-title">
                    {groupName} ({columns.length})
                  </div>
                  <div className="HeadInfoAgent-mobile-column-checkboxes">
                    {columns.map((column) => (
                      <label
                        key={column}
                        className="HeadInfoAgent-mobile-checkbox-label"
                      >
                        <input
                          type="checkbox"
                          checked={visibleColumns.has(column)}
                          onChange={() => toggleColumnVisibility(column)}
                          className="HeadInfoAgent-mobile-checkbox-input"
                        />
                        <span className="HeadInfoAgent-mobile-checkbox-text">
                          {column.replace(/_/g, " ")}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            Object.entries(columnGroups).map(([groupName, columns]) => (
              <div key={groupName} className="HeadInfoAgent-column-group">
                <div className="HeadInfoAgent-column-group-title">
                  <span>
                    {groupName} ({columns.length})
                  </span>
                  <div>
                    <button
                      onClick={() => selectGroupColumns(columns)}
                      className="HeadInfoAgent-small-button"
                    >
                      Select All
                    </button>
                    <button
                      onClick={() => deselectGroupColumns(columns)}
                      className="HeadInfoAgent-small-button"
                    >
                      Deselect All
                    </button>
                  </div>
                </div>
                <div className="HeadInfoAgent-column-checkboxes">
                  {columns.map((column) => (
                    <label
                      key={column}
                      className="HeadInfoAgent-checkbox-label"
                    >
                      <input
                        type="checkbox"
                        checked={visibleColumns.has(column)}
                        onChange={() => toggleColumnVisibility(column)}
                        className="HeadInfoAgent-checkbox-input"
                      />
                      {column.replace(/_/g, " ")}
                    </label>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Filters Panel */}
      {(showFilters || !isMobile) && (
        <div className="HeadInfoAgent-control-panel">
          <div
            className="HeadInfoAgent-panel-header"
            onClick={() => setShowFilters(!showFilters)}
          >
            <div className="HeadInfoAgent-panel-header-text">
              FILTER CONTROLS
            </div>
            <div>{showFilters ? "▲" : "▼"}</div>
          </div>

          {showFilters && (
            <>
              <div className="HeadInfoAgent-panel-content">
                {Object.keys(filters)
                  .slice(0, isMobile ? 6 : Object.keys(filters).length)
                  .map((field) => (
                    <div key={field} className="HeadInfoAgent-filter-group">
                      <label className="HeadInfoAgent-label">
                        {field.replace(/_/g, " ")}
                      </label>
                      <input
                        type="text"
                        value={filters[field as keyof typeof filters]}
                        onChange={(e) =>
                          handleFilterChange(
                            field as keyof typeof filters,
                            e.target.value
                          )
                        }
                        placeholder={`Filter ${field}...`}
                        className="HeadInfoAgent-input"
                      />
                    </div>
                  ))}
                {isMobile && Object.keys(filters).length > 6 && (
                  <div className="HeadInfoAgent-mobile-more-filters">
                    <button
                      className="HeadInfoAgent-button"
                      onClick={() => {
                        /* Можно добавить модалку с полными фильтрами */
                      }}
                    >
                      Show All Filters
                    </button>
                  </div>
                )}
              </div>
              <div className="HeadInfoAgent-button-group">
                <button
                  onClick={handleResetFilters}
                  className="HeadInfoAgent-button"
                >
                  Reset Filters
                </button>
                <div className="HeadInfoAgent-record-count">
                  Displaying {filteredHeadInfo.length} of {headInfo.length}{" "}
                  records
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Data Table */}
      <div className="HeadInfoAgent-table-wrapper">
        <table className="HeadInfoAgent-table">
          <thead>
            <tr className="HeadInfoAgent-table-header">
              {Array.from(visibleColumns).map((column) => (
                <th key={column} className="HeadInfoAgent-table-header-cell">
                  {column.replace(/_/g, " ")}
                </th>
              ))}
              <th className="HeadInfoAgent-table-header-cell">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredHeadInfo.map((head) => (
              <tr key={head.id} className="HeadInfoAgent-table-row">
                {Array.from(visibleColumns).map((column) => {
                  let displayValue = head[column] || "N/A";

                  // Форматируем числовые поля для отображения
                  if (
                    numericFields.includes(column) &&
                    displayValue !== "N/A"
                  ) {
                    displayValue = formatNumberWithSpaces(displayValue);
                  }

                  return (
                    <td key={column} className="HeadInfoAgent-table-cell">
                      {editingId === head.id ? (
                        column === "cap_space" ? (
                          // cap_space только для чтения
                          <input
                            value={editData[column] || ""}
                            className="HeadInfoAgent-read-only-input"
                            readOnly
                          />
                        ) : (
                          // Редактируемые поля
                          <input
                            value={editData[column] || ""}
                            onChange={(e) =>
                              handleInputChange(column, e.target.value)
                            }
                            className="HeadInfoAgent-edit-input"
                            // Для числовых полей меняем тип ввода
                            type={
                              numericFields.includes(column) ? "text" : "text"
                            }
                          />
                        )
                      ) : (
                        // Режим просмотра
                        <div
                          className={`HeadInfoAgent-cell-value ${
                            numericFields.includes(column)
                              ? "HeadInfoAgent-numeric-value"
                              : ""
                          }`}
                        >
                          {displayValue}
                        </div>
                      )}
                    </td>
                  );
                })}
                <td className="HeadInfoAgent-table-cell">
                  {editingId === head.id ? (
                    <div className="HeadInfoAgent-action-buttons">
                      <button
                        onClick={handleSave}
                        className="HeadInfoAgent-button HeadInfoAgent-primary-button"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="HeadInfoAgent-button"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleEdit(head)}
                      className="HeadInfoAgent-button"
                    >
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HeadInfoAgentControlCenter;
