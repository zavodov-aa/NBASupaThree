import React, { useState, useEffect } from "react";
import { supabase } from "../../../../../Supabase";
import logo from "../../../../../img/bostonLogo2.png";
import "./logoAndInfoCeltics.css";

interface TeamData {
  team_name: string;
  conference: string;
  division: string;
  gm: string;
}

const InfoHeadCelticsLogoAndInfo = () => {
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
          .eq("team_name", "Celtics")
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
      .channel("head-celtics-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Head",
          filter: "team_name=eq.Celtics",
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

  if (loading) return <div className="celtics-loading">Loading...</div>;
  if (error) return <div className="celtics-error">Error: {error}</div>;

  return (
    <div className="celtics-container">
      <div className="celtics-card">
        <div className="celtics-accent-top"></div>
        <div className="celtics-accent-bottom"></div>

        <div className="celtics-header">
          <div className="logo-wrapper-celtics">
            <img className="celtics-logo" src={logo} alt="Boston CELTICS" />
          </div>

          <div className="celtics-titles">
            <h1 className="celtics-team-name">
              <span className="team-name-main-celtics">
                {teamData?.team_name}
              </span>
              <span className="team-name-sub-celtics">Boston</span>
            </h1>
          </div>
        </div>

        <div className="celtics-content">
          <div className="info-values-celtics">
            <div className="value-item-celtics">
              <div className="value-icon-celtics conference-icon-celtics"></div>
              <span className="value-text-celtics">{teamData?.conference}</span>
            </div>

            <div className="value-item-celtics">
              <div className="value-icon-celtics division-icon-celtics"></div>
              <span className="value-text-celtics">{teamData?.division}</span>
            </div>

            <div className="value-item-celtics">
              <div className="value-icon-celtics gm-icon-celtics"></div>
              <span className="value-text-celtics">{teamData?.gm}</span>
            </div>
          </div>
        </div>

        <div className="celtics-colors">
          <div className="color-dot-celtics purple-dark-celtics"></div>
          <div className="color-dot-celtics purple-celtics"></div>
          <div className="color-dot-celtics purple-light-celtics"></div>
          <div className="color-dot-celtics gold-celtics"></div>
          <div className="color-dot-celtics gold-light-celtics"></div>
        </div>
      </div>
    </div>
  );
};

export default InfoHeadCelticsLogoAndInfo;
