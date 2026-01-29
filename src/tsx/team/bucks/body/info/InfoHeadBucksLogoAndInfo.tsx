import React, { useState, useEffect } from "react";
import { supabase } from "../../../../../Supabase";
import logo from "../../../../../img/Bucks.png"; // Предполагается, что у вас есть лого Bucks
import "./logoAndInfoBucks.css";

interface TeamData {
  team_name: string;
  conference: string;
  division: string;
  gm: string;
}

const InfoHeadBucksLogoAndInfo = () => {
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
          .eq("team_name", "Bucks")
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
      .channel("head-bucks-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Head",
          filter: "team_name=eq.Bucks",
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

  if (loading) return <div className="bucks-loading">Loading...</div>;
  if (error) return <div className="bucks-error">Error: {error}</div>;

  return (
    <div className="bucks-container">
      <div className="bucks-card">
        <div className="bucks-accent-top"></div>
        <div className="bucks-accent-bottom"></div>

        <div className="bucks-header">
          <div className="logo-wrapper-bucks">
            <img className="bucks-logo" src={logo} alt="Milwaukee BUCKS" />
          </div>

          <div className="bucks-titles">
            <h1 className="bucks-team-name">
              <span className="team-name-main-bucks">
                {teamData?.team_name}
              </span>
              <span className="team-name-sub-bucks">Milwaukee</span>
            </h1>
          </div>
        </div>

        <div className="bucks-content">
          <div className="info-values-bucks">
            <div className="value-item-bucks">
              <div className="value-icon-bucks conference-icon-bucks"></div>
              <span className="value-text-bucks">{teamData?.conference}</span>
            </div>

            <div className="value-item-bucks">
              <div className="value-icon-bucks division-icon-bucks"></div>
              <span className="value-text-bucks">{teamData?.division}</span>
            </div>

            <div className="value-item-bucks">
              <div className="value-icon-bucks gm-icon-bucks"></div>
              <span className="value-text-bucks">{teamData?.gm}</span>
            </div>
          </div>
        </div>

        <div className="bucks-colors">
          <div className="color-dot-bucks green-dark-bucks"></div>
          <div className="color-dot-bucks green-bucks"></div>
          <div className="color-dot-bucks cream-bucks"></div>
          <div className="color-dot-bucks blue-bucks"></div>
          <div className="color-dot-bucks blue-light-bucks"></div>
        </div>
      </div>
    </div>
  );
};

export default InfoHeadBucksLogoAndInfo;
