import React, { useState, useEffect } from "react";
import { supabase } from "../../../Supabase";
import "./teamBodeGeneralInfo.css";

interface TeamHeadInfo {
  team_name: string;
  gm: string | null;
  salary_cap: number | null;
  cap_hit: number | null;
  cap_space: number | null;
  cash_money: number | null;
  penalties: number | null;
  active_roster: string | null;
  dead_cap: number | null;
  g_leage: string | null;
  extra_pos: string | null;
  head_coach: string | null;
}

interface TeamBodeGeneralInfoProps {
  teamName: string;
}

const TeamBodeGeneralInfo: React.FC<TeamBodeGeneralInfoProps> = ({
  teamName,
}) => {
  const [data, setData] = useState<TeamHeadInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (!teamName) return;

    const fetchTeamInfo = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: teamData, error: supabaseError } = await supabase
          .from("Head")
          .select("*")
          .eq("team_name", teamName)
          .single<TeamHeadInfo>();

        if (supabaseError) throw supabaseError;
        setData(teamData);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Ошибка загрузки");
      } finally {
        setLoading(false);
      }
    };

    fetchTeamInfo();
  }, [teamName]);

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  if (loading) return <div className="tbg-loading">Загрузка...</div>;
  if (error) return <div className="tbg-error">{error}</div>;
  if (!data) return <div className="tbg-no-data">Нет данных</div>;

  const formatMoney = (value: number | null | undefined): string => {
    if (value == null) return "—";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getCapSpaceClass = (value: number | null | undefined): string => {
    if (value == null) return "tbg-cap-neutral";
    if (value > 0) return "tbg-cap-positive";
    if (value < 0) return "tbg-cap-negative";
    return "tbg-cap-neutral";
  };

  const personnelFields = [
    { label: "GM", key: "gm" as const, format: (v: string | null) => v || "—" },
    {
      label: "Head Coach",
      key: "head_coach" as const,
      format: (v: string | null) => v || "—",
    },
    {
      label: "Active Roster",
      key: "active_roster" as const,
      format: (v: string | null) => v || "—",
    },
    {
      label: "G-League",
      key: "g_leage" as const,
      format: (v: string | null) => v || "—",
    },
    {
      label: "Extra Pos",
      key: "extra_pos" as const,
      format: (v: string | null) => v || "—",
    },
  ];

  const financeFields = [
    { label: "Salary Cap", key: "salary_cap" as const, format: formatMoney },
    { label: "Cap Hit", key: "cap_hit" as const, format: formatMoney },
    {
      label: "Cap Space",
      key: "cap_space" as const,
      format: formatMoney,
      className: getCapSpaceClass,
    },
    { label: "Cash Money", key: "cash_money" as const, format: formatMoney },
    { label: "Penalties", key: "penalties" as const, format: formatMoney },
    { label: "Dead Cap", key: "dead_cap" as const, format: formatMoney },
  ];

  return (
    <div className="tbg-team-info-compact">
      <div className="tbg-header">
        <div className="tbg-header-title">Информация о команде</div>
        <button className="tbg-collapse-btn" onClick={toggleCollapse}>
          {isCollapsed ? "Развернуть" : "Свернуть"}
        </button>
      </div>
      {!isCollapsed && (
        <div className="tbg-info-sections">
          <div className="tbg-info-section">
            <div className="tbg-section-title">Staff & Roster</div>
            <div className="tbg-info-grid">
              {personnelFields.map(({ label, key, format }) => (
                <div className="tbg-info-item" key={key}>
                  <span className="tbg-info-label">{label}</span>
                  <span className="tbg-info-value">{format(data[key])}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="tbg-info-section">
            <div className="tbg-section-title">Finances</div>
            <div className="tbg-info-grid">
              {financeFields.map(({ label, key, format, className }) => {
                const value = data[key];
                const valueClass = className ? className(value) : "";
                return (
                  <div className="tbg-info-item" key={key}>
                    <span className="tbg-info-label">{label}</span>
                    <span className={`tbg-info-value ${valueClass}`}>
                      {format(value)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamBodeGeneralInfo;
