import React, { useState, useEffect } from "react";
import { supabase } from "../../../../../Supabase";
import logo from "../../../../../img/hawksLogo.png";
import "./logoAndInfoHawks.css";

interface TeamData {
  team_name: string;
  conference: string;
  division: string;
  gm: string;
}

const InfoHeadHawksLogoAndInfo = () => {
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
          .eq("team_name", "Hawks")
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
      .channel("head-hawks-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Head",
          filter: "team_name=eq.Hawks",
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

  if (loading) return <div className="hawks-loading">Loading...</div>;
  if (error) return <div className="hawks-error">Error: {error}</div>;

  return (
    <div className="hawks-container">
      <div className="hawks-card">
        <div className="hawks-accent-top"></div>
        <div className="hawks-accent-bottom"></div>

        <div className="hawks-header">
          <div className="logo-wrapper-hawks">
            <img className="hawks-logo" src={logo} alt="Atlanta HAWKS" />
          </div>

          <div className="hawks-titles">
            <h1 className="hawks-team-name">
              <span className="team-name-main-hawks">
                {teamData?.team_name}
              </span>
              <span className="team-name-sub-hawks">Atlanta</span>
            </h1>
          </div>
        </div>

        <div className="hawks-content">
          <div className="info-values-hawks">
            <div className="value-item-hawks">
              <div className="value-icon-hawks conference-icon-hawks"></div>
              <span className="value-text-hawks">{teamData?.conference}</span>
            </div>

            <div className="value-item-hawks">
              <div className="value-icon-hawks division-icon-hawks"></div>
              <span className="value-text-hawks">{teamData?.division}</span>
            </div>

            <div className="value-item-hawks">
              <div className="value-icon-hawks gm-icon-hawks"></div>
              <span className="value-text-hawks">{teamData?.gm}</span>
            </div>
          </div>
        </div>

        <div className="hawks-colors">
          <div className="color-dot-hawks purple-dark-hawks"></div>
          <div className="color-dot-hawks purple-hawks"></div>
          <div className="color-dot-hawks purple-light-hawks"></div>
          <div className="color-dot-hawks gold-hawks"></div>
          <div className="color-dot-hawks gold-light-hawks"></div>
        </div>
      </div>
    </div>
  );
};

export default InfoHeadHawksLogoAndInfo;
