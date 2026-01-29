import React, { useState, useEffect } from "react";
import { supabase } from "../../../../../Supabase";
import logo from "../../../../../img/Knicks.png";
import "./logoAndInfoKnicks.css";

interface TeamData {
  team_name: string;
  conference: string;
  division: string;
  gm: string;
}

const InfoHeadKnicksLogoAndInfo = () => {
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
          .eq("team_name", "Knicks")
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
      .channel("head-knicks-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Head",
          filter: "team_name=eq.Knicks",
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

  if (loading) return <div className="knicks-loading">Loading...</div>;
  if (error) return <div className="knicks-error">Error: {error}</div>;

  return (
    <div className="knicks-container">
      <div className="knicks-card">
        <div className="knicks-accent-top"></div>
        <div className="knicks-accent-bottom"></div>

        <div className="knicks-header">
          <div className="logo-wrapper-knicks">
            <img className="knicks-logo" src={logo} alt="New York Knicks" />
          </div>

          <div className="knicks-titles">
            <h1 className="knicks-team-name">
              <span className="team-name-main-knicks">
                {teamData?.team_name}
              </span>
              <span className="team-name-sub-knicks">New York</span>
            </h1>
          </div>
        </div>

        <div className="knicks-content">
          <div className="info-values-knicks">
            <div className="value-item-knicks">
              <div className="value-icon-knicks conference-icon-knicks"></div>
              <span className="value-text-knicks">{teamData?.conference}</span>
            </div>

            <div className="value-item-knicks">
              <div className="value-icon-knicks division-icon-knicks"></div>
              <span className="value-text-knicks">{teamData?.division}</span>
            </div>

            <div className="value-item-knicks">
              <div className="value-icon-knicks gm-icon-knicks"></div>
              <span className="value-text-knicks">{teamData?.gm}</span>
            </div>
          </div>
        </div>

        <div className="knicks-colors">
          <div className="color-dot-knicks blue-dark-knicks"></div>
          <div className="color-dot-knicks blue-knicks"></div>
          <div className="color-dot-knicks blue-light-knicks"></div>
          <div className="color-dot-knicks orange-knicks"></div>
          <div className="color-dot-knicks orange-light-knicks"></div>
        </div>
      </div>
    </div>
  );
};

export default InfoHeadKnicksLogoAndInfo;
