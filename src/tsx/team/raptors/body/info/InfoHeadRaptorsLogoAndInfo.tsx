import React, { useState, useEffect } from "react";
import { supabase } from "../../../../../Supabase";
import logo from "../../../../../img/Raptors.png"; // Изменил путь к логотипу
import "./logoAndInfoRaptors.css"; // Изменил путь к CSS

interface TeamData {
  team_name: string;
  conference: string;
  division: string;
  gm: string;
}

const InfoHeadRaptorsLogoAndInfo = () => {
  const [teamData, setTeamData] = useState<TeamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("Head")
          .select("*")
          .eq("team_name", "Raptors") // Изменил на Raptors
          .single();

        if (error) throw error;
        setTeamData(data as TeamData);
        setError(null);
      } catch (error: any) {
        setError(`Failed to load team data: ${error.message}`);
        setTeamData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();

    const subscription = supabase
      .channel("head-raptors-changes") // Изменил канал
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Head",
          filter: "team_name=eq.Raptors", // Изменил фильтр
        },
        () => {
          fetchTeamData();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (loading) return <div className="raptors-loading">Loading...</div>;
  if (error) return <div className="raptors-error">Error: {error}</div>;

  return (
    <div className="raptors-container">
      <div className="raptors-card">
        <div className="raptors-accent-top"></div>
        <div className="raptors-accent-bottom"></div>

        <div className="raptors-header">
          <div className="logo-wrapper-raptors">
            <img className="raptors-logo" src={logo} alt="Toronto RAPTORS" />{" "}
            {/* Изменил alt */}
          </div>

          <div className="raptors-titles">
            <h1 className="raptors-team-name">
              <span className="team-name-main-raptors">
                {teamData?.team_name}
              </span>
              <span className="team-name-sub-raptors">Toronto</span>{" "}
              {/* Изменил город */}
            </h1>
          </div>
        </div>

        <div className="raptors-content">
          <div className="info-values-raptors">
            <div className="value-item-raptors">
              <div className="value-icon-raptors conference-icon-raptors"></div>
              <span className="value-text-raptors">{teamData?.conference}</span>
            </div>

            <div className="value-item-raptors">
              <div className="value-icon-raptors division-icon-raptors"></div>
              <span className="value-text-raptors">{teamData?.division}</span>
            </div>

            <div className="value-item-raptors">
              <div className="value-icon-raptors gm-icon-raptors"></div>
              <span className="value-text-raptors">{teamData?.gm}</span>
            </div>
          </div>
        </div>

        <div className="raptors-colors">
          <div className="color-dot-raptors red-dark-raptors"></div>
          <div className="color-dot-raptors red-raptors"></div>
          <div className="color-dot-raptors black-raptors"></div>
          <div className="color-dot-raptors silver-raptors"></div>
          <div className="color-dot-raptors purple-raptors"></div>
        </div>
      </div>
    </div>
  );
};

export default InfoHeadRaptorsLogoAndInfo;
