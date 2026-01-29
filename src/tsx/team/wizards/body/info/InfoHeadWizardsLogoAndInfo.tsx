import React, { useState, useEffect } from "react";
import { supabase } from "../../../../../Supabase";
import logo from "../../../../../img/wizards.png";
import "./logoAndInfoWizards.css";

interface TeamData {
  team_name: string;
  conference: string;
  division: string;
  gm: string;
}

const InfoHeadWizardsLogoAndInfo = () => {
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
          .eq("team_name", "Wizards")
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
      .channel("head-wizards-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Head",
          filter: "team_name=eq.Wizards",
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

  if (loading) return <div className="wizards-loading">Loading...</div>;
  if (error) return <div className="wizards-error">Error: {error}</div>;

  return (
    <div className="wizards-container">
      <div className="wizards-card">
        <div className="wizards-accent-top"></div>
        <div className="wizards-accent-bottom"></div>

        <div className="wizards-header">
          <div className="logo-wrapper-wizards">
            <img className="wizards-logo" src={logo} alt="Washington WIZARDS" />
          </div>

          <div className="wizards-titles">
            <h1 className="wizards-team-name">
              <span className="team-name-main-wizards">
                {teamData?.team_name}
              </span>
              <span className="team-name-sub-wizards">Washington</span>
            </h1>
          </div>
        </div>

        <div className="wizards-content">
          <div className="info-values-wizards">
            <div className="value-item-wizards">
              <div className="value-icon-wizards conference-icon-wizards"></div>
              <span className="value-text-wizards">{teamData?.conference}</span>
            </div>

            <div className="value-item-wizards">
              <div className="value-icon-wizards division-icon-wizards"></div>
              <span className="value-text-wizards">{teamData?.division}</span>
            </div>

            <div className="value-item-wizards">
              <div className="value-icon-wizards gm-icon-wizards"></div>
              <span className="value-text-wizards">{teamData?.gm}</span>
            </div>
          </div>
        </div>

        <div className="wizards-colors">
          <div className="color-dot-wizards blue-dark-wizards"></div>
          <div className="color-dot-wizards blue-wizards"></div>
          <div className="color-dot-wizards red-wizards"></div>
          <div className="color-dot-wizards silver-wizards"></div>
          <div className="color-dot-wizards white-wizards"></div>
        </div>
      </div>
    </div>
  );
};

export default InfoHeadWizardsLogoAndInfo;
