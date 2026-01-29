import React, { useState, useEffect } from "react";
import { supabase } from "../../../../../Supabase";
import logo from "../../../../../img/Pacers.png"; // Обновите путь к логотипу
import "./logoAndInfoPacers.css";

interface TeamData {
  team_name: string;
  conference: string;
  division: string;
  gm: string;
}

const InfoHeadPacersLogoAndInfo = () => {
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
          .eq("team_name", "Pacers")
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
      .channel("head-pacers-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Head",
          filter: "team_name=eq.Pacers",
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

  if (loading) return <div className="pacers-loading">Loading...</div>;
  if (error) return <div className="pacers-error">Error: {error}</div>;

  return (
    <div className="pacers-container">
      <div className="pacers-card">
        <div className="pacers-accent-top"></div>
        <div className="pacers-accent-bottom"></div>

        <div className="pacers-header">
          <div className="logo-wrapper-pacers">
            <img className="pacers-logo" src={logo} alt="Indiana PACERS" />
          </div>

          <div className="pacers-titles">
            <h1 className="pacers-team-name">
              <span className="team-name-main-pacers">
                {teamData?.team_name}
              </span>
              <span className="team-name-sub-pacers">Indiana</span>
            </h1>
          </div>
        </div>

        <div className="pacers-content">
          <div className="info-values-pacers">
            <div className="value-item-pacers">
              <div className="value-icon-pacers conference-icon-pacers"></div>
              <span className="value-text-pacers">{teamData?.conference}</span>
            </div>

            <div className="value-item-pacers">
              <div className="value-icon-pacers division-icon-pacers"></div>
              <span className="value-text-pacers">{teamData?.division}</span>
            </div>

            <div className="value-item-pacers">
              <div className="value-icon-pacers gm-icon-pacers"></div>
              <span className="value-text-pacers">{teamData?.gm}</span>
            </div>
          </div>
        </div>

        <div className="pacers-colors">
          <div className="color-dot-pacers blue-dark-pacers"></div>
          <div className="color-dot-pacers blue-pacers"></div>
          <div className="color-dot-pacers blue-light-pacers"></div>
          <div className="color-dot-pacers gold-pacers"></div>
          <div className="color-dot-pacers gold-light-pacers"></div>
        </div>
      </div>
    </div>
  );
};

export default InfoHeadPacersLogoAndInfo;
