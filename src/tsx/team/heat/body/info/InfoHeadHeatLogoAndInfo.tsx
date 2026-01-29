import React, { useState, useEffect } from "react";
import { supabase } from "../../../../../Supabase";
import logo from "../../../../../img/Heat.png"; // Нужно будет заменить на логотип Miami Heat
import "./logoAndInfoHeat.css";

interface TeamData {
  team_name: string;
  conference: string;
  division: string;
  gm: string;
}

const InfoHeadHeatLogoAndInfo = () => {
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
          .eq("team_name", "Heat")
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
      .channel("head-heat-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Head",
          filter: "team_name=eq.Heat",
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

  if (loading) return <div className="heat-loading">Loading...</div>;
  if (error) return <div className="heat-error">Error: {error}</div>;

  return (
    <div className="heat-container">
      <div className="heat-card">
        <div className="heat-accent-top"></div>
        <div className="heat-accent-bottom"></div>

        <div className="heat-header">
          <div className="logo-wrapper-heat">
            <img className="heat-logo" src={logo} alt="Miami HEAT" />
          </div>

          <div className="heat-titles">
            <h1 className="heat-team-name">
              <span className="team-name-main-heat">{teamData?.team_name}</span>
              <span className="team-name-sub-heat">Miami</span>
            </h1>
          </div>
        </div>

        <div className="heat-content">
          <div className="info-values-heat">
            <div className="value-item-heat">
              <div className="value-icon-heat conference-icon-heat"></div>
              <span className="value-text-heat">{teamData?.conference}</span>
            </div>

            <div className="value-item-heat">
              <div className="value-icon-heat division-icon-heat"></div>
              <span className="value-text-heat">{teamData?.division}</span>
            </div>

            <div className="value-item-heat">
              <div className="value-icon-heat gm-icon-heat"></div>
              <span className="value-text-heat">{teamData?.gm}</span>
            </div>
          </div>
        </div>

        <div className="heat-colors">
          <div className="color-dot-heat red-dark-heat"></div>
          <div className="color-dot-heat red-heat"></div>
          <div className="color-dot-heat yellow-heat"></div>
          <div className="color-dot-heat black-heat"></div>
          <div className="color-dot-heat yellow-light-heat"></div>
        </div>
      </div>
    </div>
  );
};

export default InfoHeadHeatLogoAndInfo;
