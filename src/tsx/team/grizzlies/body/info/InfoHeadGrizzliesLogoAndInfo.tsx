import React, { useState, useEffect } from "react";
import { supabase } from "../../../../../Supabase";
import logo from "../../../../../img/Grizzlies.png";
import "./logoAndInfoGrizzlies.css";

interface TeamData {
  team_name: string;
  conference: string;
  division: string;
  gm: string;
}

const InfoHeadGrizzliesLogoAndInfo = () => {
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
          .eq("team_name", "Grizzlies")
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
      .channel("head-grizzlies-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Head",
          filter: "team_name=eq.Grizzlies",
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

  if (loading) return <div className="grizzlies-loading">Loading...</div>;
  if (error) return <div className="grizzlies-error">Error: {error}</div>;

  return (
    <div className="grizzlies-container">
      <div className="grizzlies-card">
        <div className="grizzlies-accent-top"></div>
        <div className="grizzlies-accent-bottom"></div>

        <div className="grizzlies-header">
          <div className="logo-wrapper-grizzlies">
            <img
              className="grizzlies-logo"
              src={logo}
              alt="Memphis Grizzlies"
            />
          </div>

          <div className="grizzlies-titles">
            <h1 className="grizzlies-team-name">
              <span className="team-name-main-grizzlies">
                {teamData?.team_name}
              </span>
              <span className="team-name-sub-grizzlies">Memphis</span>
            </h1>
          </div>
        </div>

        <div className="grizzlies-content">
          <div className="info-values-grizzlies">
            <div className="value-item-grizzlies">
              <div className="value-icon-grizzlies conference-icon-grizzlies"></div>
              <span className="value-text-grizzlies">
                {teamData?.conference}
              </span>
            </div>

            <div className="value-item-grizzlies">
              <div className="value-icon-grizzlies division-icon-grizzlies"></div>
              <span className="value-text-grizzlies">{teamData?.division}</span>
            </div>

            <div className="value-item-grizzlies">
              <div className="value-icon-grizzlies gm-icon-grizzlies"></div>
              <span className="value-text-grizzlies">{teamData?.gm}</span>
            </div>
          </div>
        </div>

        <div className="grizzlies-colors">
          <div className="color-dot-grizzlies navy-dark-grizzlies"></div>
          <div className="color-dot-grizzlies navy-grizzlies"></div>
          <div className="color-dot-grizzlies blue-grizzlies"></div>
          <div className="color-dot-grizzlies yellow-grizzlies"></div>
          <div className="color-dot-grizzlies yellow-light-grizzlies"></div>
        </div>
      </div>
    </div>
  );
};

export default InfoHeadGrizzliesLogoAndInfo;
