import React, { useState, useEffect } from "react";
import { supabase } from "../../../../../Supabase";
import logo from "../../../../../img/Nuggets.png";
import "./logoAndInfoNuggets.css";

interface TeamData {
  team_name: string;
  conference: string;
  division: string;
  gm: string;
}

const InfoHeadNuggetsLogoAndInfo = () => {
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
          .eq("team_name", "Nuggets")
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
      .channel("head-nuggets-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Head",
          filter: "team_name=eq.Nuggets",
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

  if (loading) return <div className="nuggets-loading">Loading...</div>;
  if (error) return <div className="nuggets-error">Error: {error}</div>;

  return (
    <div className="nuggets-container">
      <div className="nuggets-card">
        <div className="nuggets-accent-top"></div>
        <div className="nuggets-accent-bottom"></div>

        <div className="nuggets-header">
          <div className="logo-wrapper-nuggets">
            <img className="nuggets-logo" src={logo} alt="Denver NUGGETS" />
          </div>

          <div className="nuggets-titles">
            <h1 className="nuggets-team-name">
              <span className="team-name-main-nuggets">
                {teamData?.team_name}
              </span>
              <span className="team-name-sub-nuggets">Denver</span>
            </h1>
          </div>
        </div>

        <div className="nuggets-content">
          <div className="info-values-nuggets">
            <div className="value-item-nuggets">
              <div className="value-icon-nuggets conference-icon-nuggets"></div>
              <span className="value-text-nuggets">{teamData?.conference}</span>
            </div>

            <div className="value-item-nuggets">
              <div className="value-icon-nuggets division-icon-nuggets"></div>
              <span className="value-text-nuggets">{teamData?.division}</span>
            </div>

            <div className="value-item-nuggets">
              <div className="value-icon-nuggets gm-icon-nuggets"></div>
              <span className="value-text-nuggets">{teamData?.gm}</span>
            </div>
          </div>
        </div>

        <div className="nuggets-colors">
          <div className="color-dot-nuggets navy-dark-nuggets"></div>
          <div className="color-dot-nuggets navy-nuggets"></div>
          <div className="color-dot-nuggets gold-nuggets"></div>
          <div className="color-dot-nuggets gold-light-nuggets"></div>
          <div className="color-dot-nuggets yellow-nuggets"></div>
        </div>
      </div>
    </div>
  );
};

export default InfoHeadNuggetsLogoAndInfo;
