import React, { useState, useEffect } from "react";
import { supabase } from "../../../../../Supabase";
import logo from "../../../../../img/Warriors.png";
import "./logoAndInfoWarriors.css";

interface TeamData {
  team_name: string;
  conference: string;
  division: string;
  gm: string;
}

const InfoHeadWarriorsLogoAndInfo = () => {
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
          .eq("team_name", "Warriors")
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
      .channel("head-warriors-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Head",
          filter: "team_name=eq.Warriors",
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

  if (loading) return <div className="warriors-loading">Loading...</div>;
  if (error) return <div className="warriors-error">Error: {error}</div>;

  return (
    <div className="warriors-container">
      <div className="warriors-card">
        <div className="warriors-accent-top"></div>
        <div className="warriors-accent-bottom"></div>

        <div className="warriors-header">
          <div className="logo-wrapper-warriors">
            <img
              className="warriors-logo"
              src={logo}
              alt="Golden State Warriors"
            />
          </div>

          <div className="warriors-titles">
            <h1 className="warriors-team-name">
              <span className="team-name-main-warriors">
                {teamData?.team_name}
              </span>
              <span className="team-name-sub-warriors">Golden State</span>
            </h1>
          </div>
        </div>

        <div className="warriors-content">
          <div className="info-values-warriors">
            <div className="value-item-warriors">
              <div className="value-icon-warriors conference-icon-warriors"></div>
              <span className="value-text-warriors">
                {teamData?.conference}
              </span>
            </div>

            <div className="value-item-warriors">
              <div className="value-icon-warriors division-icon-warriors"></div>
              <span className="value-text-warriors">{teamData?.division}</span>
            </div>

            <div className="value-item-warriors">
              <div className="value-icon-warriors gm-icon-warriors"></div>
              <span className="value-text-warriors">{teamData?.gm}</span>
            </div>
          </div>
        </div>

        <div className="warriors-colors">
          <div className="color-dot-warriors blue-dark-warriors"></div>
          <div className="color-dot-warriors blue-warriors"></div>
          <div className="color-dot-warriors blue-light-warriors"></div>
          <div className="color-dot-warriors gold-warriors"></div>
          <div className="color-dot-warriors gold-light-warriors"></div>
        </div>
      </div>
    </div>
  );
};

export default InfoHeadWarriorsLogoAndInfo;
