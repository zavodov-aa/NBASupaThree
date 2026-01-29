import React, { useState, useEffect } from "react";
import { supabase } from "../../../../../Supabase";
import logo from "../../../../../img/LakersLogo.png";
import "./logoAndInfo.css";

interface TeamData {
  team_name: string;
  conference: string;
  division: string;
  gm: string;
}

const InfoHeadLakerLogoAndInfo = () => {
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
          .eq("team_name", "Lakers")
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
      .channel("head-lakers-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Head",
          filter: "team_name=eq.Lakers",
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

  if (loading) return <div className="lakers-loading">Loading...</div>;
  if (error) return <div className="lakers-error">Error: {error}</div>;

  return (
    <div className="lakers-container">
      <div className="lakers-card">
        <div className="lakers-accent-top"></div>
        <div className="lakers-accent-bottom"></div>

        <div className="lakers-header">
          <div className="logo-wrapper">
            <img className="lakers-logo" src={logo} alt="Los Angeles Lakers" />
          </div>

          <div className="lakers-titles">
            <h1 className="lakers-team-name">
              <span className="team-name-main">{teamData?.team_name}</span>
              <span className="team-name-sub">Los Angeles</span>
            </h1>
          </div>
        </div>

        <div className="lakers-content">
          <div className="info-values">
            <div className="value-item">
              <div className="value-icon conference-icon"></div>
              <span className="value-text">{teamData?.conference}</span>
            </div>

            <div className="value-item">
              <div className="value-icon division-icon"></div>
              <span className="value-text">{teamData?.division}</span>
            </div>

            <div className="value-item">
              <div className="value-icon gm-icon"></div>
              <span className="value-text">{teamData?.gm}</span>
            </div>
          </div>
        </div>

        <div className="lakers-colors">
          <div className="color-dot purple-dark"></div>
          <div className="color-dot purple"></div>
          <div className="color-dot purple-light"></div>
          <div className="color-dot gold"></div>
          <div className="color-dot gold-light"></div>
        </div>
      </div>
    </div>
  );
};

export default InfoHeadLakerLogoAndInfo;
