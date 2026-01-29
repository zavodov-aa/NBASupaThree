import React, { useState, useEffect } from "react";
import { supabase } from "../../../../../Supabase";
import logo from "../../../../../img/Brooklyn.png";
import "./logoAndInfoNets.css";

interface TeamData {
  team_name: string;
  conference: string;
  division: string;
  gm: string;
}

const InfoHeadNetsLogoAndInfo = () => {
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
          .eq("team_name", "Nets")
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
      .channel("head-nets-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Head",
          filter: "team_name=eq.Nets",
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

  if (loading) return <div className="nets-loading">Loading...</div>;
  if (error) return <div className="nets-error">Error: {error}</div>;

  return (
    <div className="nets-container">
      <div className="nets-card">
        <div className="nets-accent-top"></div>
        <div className="nets-accent-bottom"></div>

        <div className="nets-header">
          <div className="logo-wrapper-nets">
            <img className="nets-logo" src={logo} alt="Brooklyn NETS" />
          </div>

          <div className="nets-titles">
            <h1 className="nets-team-name">
              <span className="team-name-main-nets">{teamData?.team_name}</span>
              <span className="team-name-sub-nets">Brooklyn</span>
            </h1>
          </div>
        </div>

        <div className="nets-content">
          <div className="info-values-nets">
            <div className="value-item-nets">
              <div className="value-icon-nets conference-icon-nets"></div>
              <span className="value-text-nets">{teamData?.conference}</span>
            </div>

            <div className="value-item-nets">
              <div className="value-icon-nets division-icon-nets"></div>
              <span className="value-text-nets">{teamData?.division}</span>
            </div>

            <div className="value-item-nets">
              <div className="value-icon-nets gm-icon-nets"></div>
              <span className="value-text-nets">{teamData?.gm}</span>
            </div>
          </div>
        </div>

        <div className="nets-colors">
          <div className="color-dot-nets purple-dark-nets"></div>
          <div className="color-dot-nets purple-nets"></div>
          <div className="color-dot-nets purple-light-nets"></div>
          <div className="color-dot-nets gold-nets"></div>
          <div className="color-dot-nets gold-light-nets"></div>
        </div>
      </div>
    </div>
  );
};

export default InfoHeadNetsLogoAndInfo;
