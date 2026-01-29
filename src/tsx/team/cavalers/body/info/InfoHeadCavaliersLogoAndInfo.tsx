import React, { useState, useEffect } from "react";
import { supabase } from "../../../../../Supabase";
import logo from "../../../../../img/cavaliers.svg";
import "./logoAndInfoCavaliers.css";

interface TeamData {
  team_name: string;
  conference: string;
  division: string;
  gm: string;
}

const InfoHeadCavaliersLogoAndInfo = () => {
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
          .eq("team_name", "Cavaliers")
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
      .channel("head-cavaliers-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Head",
          filter: "team_name=eq.Cavaliers",
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

  if (loading) return <div className="cavaliers-loading">Loading...</div>;
  if (error) return <div className="cavaliers-error">Error: {error}</div>;

  return (
    <div className="cavaliers-container">
      <div className="cavaliers-card">
        <div className="cavaliers-accent-top"></div>
        <div className="cavaliers-accent-bottom"></div>

        <div className="cavaliers-header">
          <div className="logo-wrapper-cavaliers">
            <img
              className="cavaliers-logo"
              src={logo}
              alt="Cleveland CAVALIERS"
            />
          </div>

          <div className="cavaliers-titles">
            <h1 className="cavaliers-team-name">
              <span className="team-name-main-cavaliers">
                {teamData?.team_name}
              </span>
              <span className="team-name-sub-cavaliers">Cleveland</span>
            </h1>
          </div>
        </div>

        <div className="cavaliers-content">
          <div className="info-values-cavaliers">
            <div className="value-item-cavaliers">
              <div className="value-icon-cavaliers conference-icon-cavaliers"></div>
              <span className="value-text-cavaliers">
                {teamData?.conference}
              </span>
            </div>

            <div className="value-item-cavaliers">
              <div className="value-icon-cavaliers division-icon-cavaliers"></div>
              <span className="value-text-cavaliers">{teamData?.division}</span>
            </div>

            <div className="value-item-cavaliers">
              <div className="value-icon-cavaliers gm-icon-cavaliers"></div>
              <span className="value-text-cavaliers">{teamData?.gm}</span>
            </div>
          </div>
        </div>

        <div className="cavaliers-colors">
          <div className="color-dot-cavaliers burgundy-dark-cavaliers"></div>
          <div className="color-dot-cavaliers burgundy-cavaliers"></div>
          <div className="color-dot-cavaliers gold-cavaliers"></div>
          <div className="color-dot-cavaliers navy-cavaliers"></div>
          <div className="color-dot-cavaliers white-cavaliers"></div>
        </div>
      </div>
    </div>
  );
};

export default InfoHeadCavaliersLogoAndInfo;
