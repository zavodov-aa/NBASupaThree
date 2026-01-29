import React, { useState, useEffect } from "react";
import { supabase } from "../../../../../Supabase";
import logo from "../../../../../img/Pelicans.png";
import "./logoAndInfoPelicans.css";

interface TeamData {
  team_name: string;
  conference: string;
  division: string;
  gm: string;
}

const InfoHeadPelicansLogoAndInfo = () => {
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
          .eq("team_name", "Pelicans")
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
      .channel("head-pelicans-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Head",
          filter: "team_name=eq.Pelicans",
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

  if (loading) return <div className="pelicans-loading">Loading...</div>;
  if (error) return <div className="pelicans-error">Error: {error}</div>;

  return (
    <div className="pelicans-container">
      <div className="pelicans-card">
        <div className="pelicans-accent-top"></div>
        <div className="pelicans-accent-bottom"></div>

        <div className="pelicans-header">
          <div className="logo-wrapper-pelicans">
            <img
              className="pelicans-logo"
              src={logo}
              alt="New Orleans PELICANS"
            />
          </div>

          <div className="pelicans-titles">
            <h1 className="pelicans-team-name">
              <span className="team-name-main-pelicans">
                {teamData?.team_name}
              </span>
              <span className="team-name-sub-pelicans">New Orleans</span>
            </h1>
          </div>
        </div>

        <div className="pelicans-content">
          <div className="info-values-pelicans">
            <div className="value-item-pelicans">
              <div className="value-icon-pelicans conference-icon-pelicans"></div>
              <span className="value-text-pelicans">
                {teamData?.conference}
              </span>
            </div>

            <div className="value-item-pelicans">
              <div className="value-icon-pelicans division-icon-pelicans"></div>
              <span className="value-text-pelicans">{teamData?.division}</span>
            </div>

            <div className="value-item-pelicans">
              <div className="value-icon-pelicans gm-icon-pelicans"></div>
              <span className="value-text-pelicans">{teamData?.gm}</span>
            </div>
          </div>
        </div>

        <div className="pelicans-colors">
          <div className="color-dot-pelicans navy-dark-pelicans"></div>
          <div className="color-dot-pelicans navy-pelicans"></div>
          <div className="color-dot-pelicans gold-pelicans"></div>
          <div className="color-dot-pelicans red-pelicans"></div>
          <div className="color-dot-pelicans cream-pelicans"></div>
        </div>
      </div>
    </div>
  );
};

export default InfoHeadPelicansLogoAndInfo;
