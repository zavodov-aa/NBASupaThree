import React, { useState, useEffect, useMemo } from "react";
import "./ufaAdminThirdStageOffers.css";
import { supabase } from "../../../../../Supabase";

interface UFAThirdStageOffer {
  team: string;
  player: string;
  salary_one: number | null;
  salary_two: number | null;
  salary_three: number | null;
  salary_four: number | null;
  type_contract: string | null;
  period_contract: number | null;
  option_contract: string | null;
  bonus: number | null;
  condition: string | null;
  result: string | null;
  created_at: string;
}

type SortableColumn = keyof Omit<
  UFAThirdStageOffer,
  | "team"
  | "player"
  | "type_contract"
  | "option_contract"
  | "condition"
  | "result"
>;

const UFAAdminThirdStageOffers = () => {
  const [offers, setOffers] = useState<UFAThirdStageOffer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [teamFilter, setTeamFilter] = useState<string>("");
  const [playerFilter, setPlayerFilter] = useState<string>("");

  const [sortConfig, setSortConfig] = useState<{
    key: SortableColumn | "team" | "player";
    direction: "asc" | "desc";
  } | null>(null);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("Market_UFA_second_round_first_stage")
        .select(
          "team, player, salary_one, salary_two, salary_three, salary_four, type_contract, period_contract, option_contract, bonus, condition, result, created_at",
        )
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOffers(data || []);
    } catch (err) {
      console.error("Error fetching offers:", err);
      setError(err instanceof Error ? err.message : "Неизвестная ошибка");
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key: SortableColumn | "team" | "player") => {
    let direction: "asc" | "desc" = "asc";

    if (sortConfig && sortConfig.key === key) {
      if (sortConfig.direction === "asc") {
        direction = "desc";
      } else {
        setSortConfig(null);
        return;
      }
    }

    setSortConfig({ key, direction });
  };

  const filteredAndSortedOffers = useMemo(() => {
    let result = [...offers];

    if (teamFilter) {
      result = result.filter((offer) =>
        offer.team.toLowerCase().includes(teamFilter.toLowerCase()),
      );
    }

    if (playerFilter) {
      result = result.filter((offer) =>
        offer.player.toLowerCase().includes(playerFilter.toLowerCase()),
      );
    }

    if (sortConfig) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue === null && bValue === null) return 0;
        if (aValue === null) return 1;
        if (bValue === null) return -1;

        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortConfig.direction === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [offers, teamFilter, playerFilter, sortConfig]);

  const getSortIcon = (key: SortableColumn | "team" | "player") => {
    if (!sortConfig || sortConfig.key !== key) return "↕️";
    return sortConfig.direction === "asc" ? "↑" : "↓";
  };

  const formatNumber = (value: number | null) => {
    if (value === null) return "-";
    return value.toLocaleString();
  };

  if (loading)
    return (
      <div className="ufaAdminThirdStageOffers-loading">Загрузка данных...</div>
    );
  if (error)
    return (
      <div className="ufaAdminThirdStageOffers-error">Ошибка: {error}</div>
    );

  return (
    <div className="ufaAdminThirdStageOffers">
      <h2 className="ufaAdminThirdStageOffers-title">
        Предложения UFA (третий этап)
      </h2>

      <div className="ufaAdminThirdStageOffers-filtersPanel">
        <div className="ufaAdminThirdStageOffers-filterGroup">
          <label
            htmlFor="team-filter"
            className="ufaAdminThirdStageOffers-filterLabel"
          >
            Фильтр по команде:
          </label>
          <input
            id="team-filter"
            type="text"
            placeholder="Введите название команды..."
            value={teamFilter}
            onChange={(e) => setTeamFilter(e.target.value)}
            className="ufaAdminThirdStageOffers-filterInput"
            aria-label="Фильтр по названию команды"
          />
        </div>

        <div className="ufaAdminThirdStageOffers-filterGroup">
          <label
            htmlFor="player-filter"
            className="ufaAdminThirdStageOffers-filterLabel"
          >
            Фильтр по игроку:
          </label>
          <input
            id="player-filter"
            type="text"
            placeholder="Введите имя игрока..."
            value={playerFilter}
            onChange={(e) => setPlayerFilter(e.target.value)}
            className="ufaAdminThirdStageOffers-filterInput"
            aria-label="Фильтр по имени игрока"
          />
        </div>

        <button
          onClick={() => {
            setTeamFilter("");
            setPlayerFilter("");
            setSortConfig(null);
          }}
          className="ufaAdminThirdStageOffers-clearFiltersBtn"
          aria-label="Сбросить все фильтры и сортировку"
        >
          Сбросить фильтры
        </button>

        <div className="ufaAdminThirdStageOffers-resultsCount">
          Найдено: {filteredAndSortedOffers.length} из {offers.length}
        </div>
      </div>

      <div className="ufaAdminThirdStageOffers-tableWrapper">
        <table className="ufaAdminThirdStageOffers-table">
          <thead>
            <tr>
              <th
                onClick={() => handleSort("team")}
                className="ufaAdminThirdStageOffers-sortableHeader"
                aria-label="Сортировать по команде"
              >
                <span className="ufaAdminThirdStageOffers-headerContent">
                  Команда{" "}
                  <span className="sortIcon">{getSortIcon("team")}</span>
                </span>
              </th>
              <th
                onClick={() => handleSort("player")}
                className="ufaAdminThirdStageOffers-sortableHeader"
                aria-label="Сортировать по игроку"
              >
                <span className="ufaAdminThirdStageOffers-headerContent">
                  Игрок{" "}
                  <span className="sortIcon">{getSortIcon("player")}</span>
                </span>
              </th>
              <th
                onClick={() => handleSort("salary_one")}
                className="ufaAdminThirdStageOffers-sortableHeader"
                aria-label="Сортировать по зарплате первого года"
              >
                <span className="ufaAdminThirdStageOffers-headerContent">
                  Зарплата 1 год{" "}
                  <span className="sortIcon">{getSortIcon("salary_one")}</span>
                </span>
              </th>
              <th
                onClick={() => handleSort("salary_two")}
                className="ufaAdminThirdStageOffers-sortableHeader"
                aria-label="Сортировать по зарплате второго года"
              >
                <span className="ufaAdminThirdStageOffers-headerContent">
                  Зарплата 2 год{" "}
                  <span className="sortIcon">{getSortIcon("salary_two")}</span>
                </span>
              </th>
              <th
                onClick={() => handleSort("salary_three")}
                className="ufaAdminThirdStageOffers-sortableHeader"
                aria-label="Сортировать по зарплате третьего года"
              >
                <span className="ufaAdminThirdStageOffers-headerContent">
                  Зарплата 3 год{" "}
                  <span className="sortIcon">
                    {getSortIcon("salary_three")}
                  </span>
                </span>
              </th>
              <th
                onClick={() => handleSort("salary_four")}
                className="ufaAdminThirdStageOffers-sortableHeader"
                aria-label="Сортировать по зарплате четвертого года"
              >
                <span className="ufaAdminThirdStageOffers-headerContent">
                  Зарплата 4 год{" "}
                  <span className="sortIcon">{getSortIcon("salary_four")}</span>
                </span>
              </th>
              <th className="ufaAdminThirdStageOffers-header">
                <span className="ufaAdminThirdStageOffers-headerContent">
                  Тип контракта
                </span>
              </th>
              <th
                onClick={() => handleSort("period_contract")}
                className="ufaAdminThirdStageOffers-sortableHeader"
                aria-label="Сортировать по периоду контракта"
              >
                <span className="ufaAdminThirdStageOffers-headerContent">
                  Период{" "}
                  <span className="sortIcon">
                    {getSortIcon("period_contract")}
                  </span>
                </span>
              </th>
              <th className="ufaAdminThirdStageOffers-header">
                <span className="ufaAdminThirdStageOffers-headerContent">
                  Опция
                </span>
              </th>
              <th
                onClick={() => handleSort("bonus")}
                className="ufaAdminThirdStageOffers-sortableHeader"
                aria-label="Сортировать по бонусу"
              >
                <span className="ufaAdminThirdStageOffers-headerContent">
                  Бонус <span className="sortIcon">{getSortIcon("bonus")}</span>
                </span>
              </th>
              <th className="ufaAdminThirdStageOffers-header">
                <span className="ufaAdminThirdStageOffers-headerContent">
                  Условие
                </span>
              </th>
              <th className="ufaAdminThirdStageOffers-header">
                <span className="ufaAdminThirdStageOffers-headerContent">
                  Результат
                </span>
              </th>
              <th
                onClick={() => handleSort("created_at")}
                className="ufaAdminThirdStageOffers-sortableHeader"
                aria-label="Сортировать по дате создания"
              >
                <span className="ufaAdminThirdStageOffers-headerContent">
                  Дата{" "}
                  <span className="sortIcon">{getSortIcon("created_at")}</span>
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedOffers.length > 0 ? (
              filteredAndSortedOffers.map((offer, index) => (
                <tr
                  key={`${offer.team}-${offer.player}-${index}`}
                  className="ufaAdminThirdStageOffers-tableRow"
                >
                  <td
                    className="ufaAdminThirdStageOffers-tableCell"
                    data-label="Команда"
                  >
                    {offer.team}
                  </td>
                  <td
                    className="ufaAdminThirdStageOffers-tableCell"
                    data-label="Игрок"
                  >
                    {offer.player}
                  </td>
                  <td
                    className="ufaAdminThirdStageOffers-tableCell"
                    data-label="Зарплата 1 год"
                  >
                    {formatNumber(offer.salary_one)}
                  </td>
                  <td
                    className="ufaAdminThirdStageOffers-tableCell"
                    data-label="Зарплата 2 год"
                  >
                    {formatNumber(offer.salary_two)}
                  </td>
                  <td
                    className="ufaAdminThirdStageOffers-tableCell"
                    data-label="Зарплата 3 год"
                  >
                    {formatNumber(offer.salary_three)}
                  </td>
                  <td
                    className="ufaAdminThirdStageOffers-tableCell"
                    data-label="Зарплата 4 год"
                  >
                    {formatNumber(offer.salary_four)}
                  </td>
                  <td
                    className="ufaAdminThirdStageOffers-tableCell"
                    data-label="Тип контракта"
                  >
                    {offer.type_contract || "-"}
                  </td>
                  <td
                    className="ufaAdminThirdStageOffers-tableCell"
                    data-label="Период"
                  >
                    {offer.period_contract || "-"}
                  </td>
                  <td
                    className="ufaAdminThirdStageOffers-tableCell"
                    data-label="Опция"
                  >
                    {offer.option_contract || "-"}
                  </td>
                  <td
                    className="ufaAdminThirdStageOffers-tableCell"
                    data-label="Бонус"
                  >
                    {formatNumber(offer.bonus)}
                  </td>
                  <td
                    className="ufaAdminThirdStageOffers-tableCell"
                    data-label="Условие"
                  >
                    {offer.condition || "-"}
                  </td>
                  <td
                    className="ufaAdminThirdStageOffers-tableCell"
                    data-label="Результат"
                  >
                    {offer.result || "-"}
                  </td>
                  <td
                    className="ufaAdminThirdStageOffers-tableCell"
                    data-label="Дата создания"
                  >
                    {new Date(offer.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr className="ufaAdminThirdStageOffers-tableRow">
                <td
                  colSpan={13}
                  className="ufaAdminThirdStageOffers-noDataCell"
                >
                  {teamFilter || playerFilter
                    ? "Нет данных, соответствующих фильтрам"
                    : "Нет данных"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UFAAdminThirdStageOffers;
