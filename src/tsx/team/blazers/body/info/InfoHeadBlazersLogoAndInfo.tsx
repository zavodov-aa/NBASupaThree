import React, { useState, useEffect } from "react";
import { supabase } from "../../../../../Supabase";
import logo from "../../../../../img/Blazers.png"; // обновите путь к логотипу
import "./logoAndInfoBlazers.css";

interface TeamData {
  team_name: string;
  conference: string;
  division: string;
  gm: string;
}

const InfoHeadBlazersLogoAndInfo = () => {
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
          .eq("team_name", "Blazers")
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
      .channel("head-blazers-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Head",
          filter: "team_name=eq.Blazers",
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

  if (loading) return <div className="blazers-loading">Loading...</div>;
  if (error) return <div className="blazers-error">Error: {error}</div>;

  return (
    <div className="blazers-container">
      <div className="blazers-card">
        <div className="blazers-accent-top"></div>
        <div className="blazers-accent-bottom"></div>

        <div className="blazers-header">
          <div className="logo-wrapper-blazers">
            <img
              className="blazers-logo"
              src={logo}
              alt="Portland TRAIL BLAZERS"
            />
          </div>

          <div className="blazers-titles">
            <h1 className="blazers-team-name">
              <span className="team-name-main-blazers">
                {teamData?.team_name}
              </span>
              <span className="team-name-sub-blazers">Portland</span>
            </h1>
          </div>
        </div>

        <div className="blazers-content">
          <div className="info-values-blazers">
            <div className="value-item-blazers">
              <div className="value-icon-blazers conference-icon-blazers"></div>
              <span className="value-text-blazers">{teamData?.conference}</span>
            </div>

            <div className="value-item-blazers">
              <div className="value-icon-blazers division-icon-blazers"></div>
              <span className="value-text-blazers">{teamData?.division}</span>
            </div>

            <div className="value-item-blazers">
              <div className="value-icon-blazers gm-icon-blazers"></div>
              <span className="value-text-blazers">{teamData?.gm}</span>
            </div>
          </div>
        </div>

        <div className="blazers-colors">
          <div className="color-dot-blazers red-dark-blazers"></div>
          <div className="color-dot-blazers red-blazers"></div>
          <div className="color-dot-blazers black-blazers"></div>
          <div className="color-dot-blazers silver-blazers"></div>
          <div className="color-dot-blazers white-blazers"></div>
        </div>
      </div>
    </div>
  );
};

export default InfoHeadBlazersLogoAndInfo;
