import React, { useState, useEffect } from "react";
import { supabase } from "../../../../../Supabase";
import logo from "../../../../../img/Bulls.png"; // Замените на логотип Bulls
import "./logoAndInfoBulls.css";

interface TeamData {
  team_name: string;
  conference: string;
  division: string;
  gm: string;
}

const InfoHeadBullsLogoAndInfo = () => {
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
          .eq("team_name", "Bulls")
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
      .channel("head-bulls-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Head",
          filter: "team_name=eq.Bulls",
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

  if (loading) return <div className="bulls-loading">Loading...</div>;
  if (error) return <div className="bulls-error">Error: {error}</div>;

  return (
    <div className="bulls-container">
      <div className="bulls-card">
        <div className="bulls-accent-top"></div>
        <div className="bulls-accent-bottom"></div>

        <div className="bulls-header">
          <div className="logo-wrapper-bulls">
            <img className="bulls-logo" src={logo} alt="Chicago BULLS" />
          </div>

          <div className="bulls-titles">
            <h1 className="bulls-team-name">
              <span className="team-name-main-bulls">
                {teamData?.team_name}
              </span>
              <span className="team-name-sub-bulls">Chicago</span>
            </h1>
          </div>
        </div>

        <div className="bulls-content">
          <div className="info-values-bulls">
            <div className="value-item-bulls">
              <div className="value-icon-bulls conference-icon-bulls"></div>
              <span className="value-text-bulls">{teamData?.conference}</span>
            </div>

            <div className="value-item-bulls">
              <div className="value-icon-bulls division-icon-bulls"></div>
              <span className="value-text-bulls">{teamData?.division}</span>
            </div>

            <div className="value-item-bulls">
              <div className="value-icon-bulls gm-icon-bulls"></div>
              <span className="value-text-bulls">{teamData?.gm}</span>
            </div>
          </div>
        </div>

        <div className="bulls-colors">
          <div className="color-dot-bulls red-dark-bulls"></div>
          <div className="color-dot-bulls red-bulls"></div>
          <div className="color-dot-bulls red-light-bulls"></div>
          <div className="color-dot-bulls black-bulls"></div>
          <div className="color-dot-bulls white-bulls"></div>
        </div>
      </div>
    </div>
  );
};

export default InfoHeadBullsLogoAndInfo;
