import React, { useState, useEffect } from "react";
import { supabase } from "../../../../../Supabase";
import logo from "../../../../../img/hornets.png"; // Замените на актуальный логотип
import "./logoAndInfoHornets.css";

interface TeamData {
  team_name: string;
  conference: string;
  division: string;
  gm: string;
}

const InfoHeadHornetsLogoAndInfo = () => {
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
          .eq("team_name", "Hornets")
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
      .channel("head-hornets-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Head",
          filter: "team_name=eq.Hornets",
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

  if (loading) return <div className="hornets-loading">Loading...</div>;
  if (error) return <div className="hornets-error">Error: {error}</div>;

  return (
    <div className="hornets-container">
      <div className="hornets-card">
        <div className="hornets-accent-top"></div>
        <div className="hornets-accent-bottom"></div>

        <div className="hornets-header">
          <div className="logo-wrapper-hornets">
            <img className="hornets-logo" src={logo} alt="Charlotte HORNETS" />
          </div>

          <div className="hornets-titles">
            <h1 className="hornets-team-name">
              <span className="team-name-main-hornets">
                {teamData?.team_name}
              </span>
              <span className="team-name-sub-hornets">Charlotte</span>
            </h1>
          </div>
        </div>

        <div className="hornets-content">
          <div className="info-values-hornets">
            <div className="value-item-hornets">
              <div className="value-icon-hornets conference-icon-hornets"></div>
              <span className="value-text-hornets">{teamData?.conference}</span>
            </div>

            <div className="value-item-hornets">
              <div className="value-icon-hornets division-icon-hornets"></div>
              <span className="value-text-hornets">{teamData?.division}</span>
            </div>

            <div className="value-item-hornets">
              <div className="value-icon-hornets gm-icon-hornets"></div>
              <span className="value-text-hornets">{teamData?.gm}</span>
            </div>
          </div>
        </div>

        <div className="hornets-colors">
          <div className="color-dot-hornets teal-dark-hornets"></div>
          <div className="color-dot-hornets teal-hornets"></div>
          <div className="color-dot-hornets purple-dark-hornets"></div>
          <div className="color-dot-hornets purple-hornets"></div>
          <div className="color-dot-hornets purple-light-hornets"></div>
        </div>
      </div>
    </div>
  );
};

export default InfoHeadHornetsLogoAndInfo;
