import React, { useState, useEffect, useMemo } from "react";
import "./ufaAdminSecondStageOffers.css";
import { supabase } from "../../../../../Supabase";

interface UFASecondStageOffer {
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
  UFASecondStageOffer,
  | "team"
  | "player"
  | "type_contract"
  | "option_contract"
  | "condition"
  | "result"
>;

const UFAAdminSecondStageOffers = () => {
  const [offers, setOffers] = useState<UFASecondStageOffer[]>([]);
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
        .from("Market_UFA_first_round_second_stage")
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
      <div className="ufaAdminSecondStageOffers-loading">
        Загрузка данных...
      </div>
    );
  if (error)
    return (
      <div className="ufaAdminSecondStageOffers-error">Ошибка: {error}</div>
    );

  return (
    <div className="ufaAdminSecondStageOffers">
      <h2 className="ufaAdminSecondStageOffers-title">
        Предложения UFA (второй этап первого раунда)
      </h2>

      <div className="ufaAdminSecondStageOffers-filtersPanel">
        <div className="ufaAdminSecondStageOffers-filterGroup">
          <label
            htmlFor="team-filter"
            className="ufaAdminSecondStageOffers-filterLabel"
          >
            Фильтр по команде:
          </label>
          <input
            id="team-filter"
            type="text"
            placeholder="Введите название команды..."
            value={teamFilter}
            onChange={(e) => setTeamFilter(e.target.value)}
            className="ufaAdminSecondStageOffers-filterInput"
            aria-label="Фильтр по названию команды"
          />
        </div>

        <div className="ufaAdminSecondStageOffers-filterGroup">
          <label
            htmlFor="player-filter"
            className="ufaAdminSecondStageOffers-filterLabel"
          >
            Фильтр по игроку:
          </label>
          <input
            id="player-filter"
            type="text"
            placeholder="Введите имя игрока..."
            value={playerFilter}
            onChange={(e) => setPlayerFilter(e.target.value)}
            className="ufaAdminSecondStageOffers-filterInput"
            aria-label="Фильтр по имени игрока"
          />
        </div>

        <button
          onClick={() => {
            setTeamFilter("");
            setPlayerFilter("");
            setSortConfig(null);
          }}
          className="ufaAdminSecondStageOffers-clearFiltersBtn"
          aria-label="Сбросить все фильтры и сортировку"
        >
          Сбросить фильтры
        </button>

        <div className="ufaAdminSecondStageOffers-resultsCount">
          Найдено: {filteredAndSortedOffers.length} из {offers.length}
        </div>
      </div>

      <div className="ufaAdminSecondStageOffers-tableWrapper">
        <table className="ufaAdminSecondStageOffers-table">
          <thead>
            <tr>
              <th
                onClick={() => handleSort("team")}
                className="ufaAdminSecondStageOffers-sortableHeader"
                aria-label="Сортировать по команде"
              >
                <span className="ufaAdminSecondStageOffers-headerContent">
                  Команда{" "}
                  <span className="sortIcon">{getSortIcon("team")}</span>
                </span>
              </th>
              <th
                onClick={() => handleSort("player")}
                className="ufaAdminSecondStageOffers-sortableHeader"
                aria-label="Сортировать по игроку"
              >
                <span className="ufaAdminSecondStageOffers-headerContent">
                  Игрок{" "}
                  <span className="sortIcon">{getSortIcon("player")}</span>
                </span>
              </th>
              <th
                onClick={() => handleSort("salary_one")}
                className="ufaAdminSecondStageOffers-sortableHeader"
                aria-label="Сортировать по зарплате первого года"
              >
                <span className="ufaAdminSecondStageOffers-headerContent">
                  Зарплата 1 год{" "}
                  <span className="sortIcon">{getSortIcon("salary_one")}</span>
                </span>
              </th>
              <th
                onClick={() => handleSort("salary_two")}
                className="ufaAdminSecondStageOffers-sortableHeader"
                aria-label="Сортировать по зарплате второго года"
              >
                <span className="ufaAdminSecondStageOffers-headerContent">
                  Зарплата 2 год{" "}
                  <span className="sortIcon">{getSortIcon("salary_two")}</span>
                </span>
              </th>
              <th
                onClick={() => handleSort("salary_three")}
                className="ufaAdminSecondStageOffers-sortableHeader"
                aria-label="Сортировать по зарплате третьего года"
              >
                <span className="ufaAdminSecondStageOffers-headerContent">
                  Зарплата 3 год{" "}
                  <span className="sortIcon">
                    {getSortIcon("salary_three")}
                  </span>
                </span>
              </th>
              <th
                onClick={() => handleSort("salary_four")}
                className="ufaAdminSecondStageOffers-sortableHeader"
                aria-label="Сортировать по зарплате четвертого года"
              >
                <span className="ufaAdminSecondStageOffers-headerContent">
                  Зарплата 4 год{" "}
                  <span className="sortIcon">{getSortIcon("salary_four")}</span>
                </span>
              </th>
              <th className="ufaAdminSecondStageOffers-header">
                <span className="ufaAdminSecondStageOffers-headerContent">
                  Тип контракта
                </span>
              </th>
              <th
                onClick={() => handleSort("period_contract")}
                className="ufaAdminSecondStageOffers-sortableHeader"
                aria-label="Сортировать по периоду контракта"
              >
                <span className="ufaAdminSecondStageOffers-headerContent">
                  Период{" "}
                  <span className="sortIcon">
                    {getSortIcon("period_contract")}
                  </span>
                </span>
              </th>
              <th className="ufaAdminSecondStageOffers-header">
                <span className="ufaAdminSecondStageOffers-headerContent">
                  Опция
                </span>
              </th>
              <th
                onClick={() => handleSort("bonus")}
                className="ufaAdminSecondStageOffers-sortableHeader"
                aria-label="Сортировать по бонусу"
              >
                <span className="ufaAdminSecondStageOffers-headerContent">
                  Бонус <span className="sortIcon">{getSortIcon("bonus")}</span>
                </span>
              </th>
              <th className="ufaAdminSecondStageOffers-header">
                <span className="ufaAdminSecondStageOffers-headerContent">
                  Условие
                </span>
              </th>
              <th className="ufaAdminSecondStageOffers-header">
                <span className="ufaAdminSecondStageOffers-headerContent">
                  Результат
                </span>
              </th>
              <th
                onClick={() => handleSort("created_at")}
                className="ufaAdminSecondStageOffers-sortableHeader"
                aria-label="Сортировать по дате создания"
              >
                <span className="ufaAdminSecondStageOffers-headerContent">
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
                  className="ufaAdminSecondStageOffers-tableRow"
                >
                  <td
                    className="ufaAdminSecondStageOffers-tableCell"
                    data-label="Команда"
                  >
                    {offer.team}
                  </td>
                  <td
                    className="ufaAdminSecondStageOffers-tableCell"
                    data-label="Игрок"
                  >
                    {offer.player}
                  </td>
                  <td
                    className="ufaAdminSecondStageOffers-tableCell"
                    data-label="Зарплата 1 год"
                  >
                    {formatNumber(offer.salary_one)}
                  </td>
                  <td
                    className="ufaAdminSecondStageOffers-tableCell"
                    data-label="Зарплата 2 год"
                  >
                    {formatNumber(offer.salary_two)}
                  </td>
                  <td
                    className="ufaAdminSecondStageOffers-tableCell"
                    data-label="Зарплата 3 год"
                  >
                    {formatNumber(offer.salary_three)}
                  </td>
                  <td
                    className="ufaAdminSecondStageOffers-tableCell"
                    data-label="Зарплата 4 год"
                  >
                    {formatNumber(offer.salary_four)}
                  </td>
                  <td
                    className="ufaAdminSecondStageOffers-tableCell"
                    data-label="Тип контракта"
                  >
                    {offer.type_contract || "-"}
                  </td>
                  <td
                    className="ufaAdminSecondStageOffers-tableCell"
                    data-label="Период"
                  >
                    {offer.period_contract || "-"}
                  </td>
                  <td
                    className="ufaAdminSecondStageOffers-tableCell"
                    data-label="Опция"
                  >
                    {offer.option_contract || "-"}
                  </td>
                  <td
                    className="ufaAdminSecondStageOffers-tableCell"
                    data-label="Бонус"
                  >
                    {formatNumber(offer.bonus)}
                  </td>
                  <td
                    className="ufaAdminSecondStageOffers-tableCell"
                    data-label="Условие"
                  >
                    {offer.condition || "-"}
                  </td>
                  <td
                    className="ufaAdminSecondStageOffers-tableCell"
                    data-label="Результат"
                  >
                    {offer.result || "-"}
                  </td>
                  <td
                    className="ufaAdminSecondStageOffers-tableCell"
                    data-label="Дата создания"
                  >
                    {new Date(offer.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr className="ufaAdminSecondStageOffers-tableRow">
                <td
                  colSpan={13}
                  className="ufaAdminSecondStageOffers-noDataCell"
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

export default UFAAdminSecondStageOffers;
