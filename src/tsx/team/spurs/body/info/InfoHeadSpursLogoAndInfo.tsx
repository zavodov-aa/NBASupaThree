import React, { useState, useEffect } from "react";
import { supabase } from "../../../../../Supabase";
import logo from "../../../../../img/Spurs.png";
import "./logoAndInfoSpurs.css";

interface TeamData {
  team_name: string;
  conference: string;
  division: string;
  gm: string;
}

const InfoHeadSpursLogoAndInfo = () => {
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
          .eq("team_name", "Spurs")
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
      .channel("head-spurs-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Head",
          filter: "team_name=eq.Spurs",
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

  if (loading) return <div className="spurs-loading">Loading...</div>;
  if (error) return <div className="spurs-error">Error: {error}</div>;

  return (
    <div className="spurs-container">
      <div className="spurs-card">
        <div className="spurs-accent-top"></div>
        <div className="spurs-accent-bottom"></div>

        <div className="spurs-header">
          <div className="logo-wrapper-spurs">
            <img className="spurs-logo" src={logo} alt="San Antonio SPURS" />
          </div>

          <div className="spurs-titles">
            <h1 className="spurs-team-name">
              <span className="team-name-main-spurs">
                {teamData?.team_name}
              </span>
              <span className="team-name-sub-spurs">San Antonio</span>
            </h1>
          </div>
        </div>

        <div className="spurs-content">
          <div className="info-values-spurs">
            <div className="value-item-spurs">
              <div className="value-icon-spurs conference-icon-spurs"></div>
              <span className="value-text-spurs">{teamData?.conference}</span>
            </div>

            <div className="value-item-spurs">
              <div className="value-icon-spurs division-icon-spurs"></div>
              <span className="value-text-spurs">{teamData?.division}</span>
            </div>

            <div className="value-item-spurs">
              <div className="value-icon-spurs gm-icon-spurs"></div>
              <span className="value-text-spurs">{teamData?.gm}</span>
            </div>
          </div>
        </div>

        <div className="spurs-colors">
          <div className="color-dot-spurs black-spurs"></div>
          <div className="color-dot-spurs silver-spurs"></div>
          <div className="color-dot-spurs gray-spurs"></div>
          <div className="color-dot-spurs white-spurs"></div>
          <div className="color-dot-spurs light-gray-spurs"></div>
        </div>
      </div>
    </div>
  );
};

export default InfoHeadSpursLogoAndInfo;
