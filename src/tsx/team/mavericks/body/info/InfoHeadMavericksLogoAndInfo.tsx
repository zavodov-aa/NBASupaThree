import React, { useState, useEffect } from "react";
import { supabase } from "../../../../../Supabase";
import logo from "../../../../../img/mavs.png";
import "./logoAndInfoMavericks.css";

interface TeamData {
  team_name: string;
  conference: string;
  division: string;
  gm: string;
}

const InfoHeadMavericksLogoAndInfo = () => {
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
          .eq("team_name", "Mavericks")
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
      .channel("head-mavericks-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Head",
          filter: "team_name=eq.Mavericks",
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

  if (loading) return <div className="mavericks-loading">Loading...</div>;
  if (error) return <div className="mavericks-error">Error: {error}</div>;

  return (
    <div className="mavericks-container">
      <div className="mavericks-card">
        <div className="mavericks-accent-top"></div>
        <div className="mavericks-accent-bottom"></div>

        <div className="mavericks-header">
          <div className="logo-wrapper-mavericks">
            <img className="mavericks-logo" src={logo} alt="Dallas MAVERICKS" />
          </div>

          <div className="mavericks-titles">
            <h1 className="mavericks-team-name">
              <span className="team-name-main-mavericks">
                {teamData?.team_name}
              </span>
              <span className="team-name-sub-mavericks">Dallas</span>
            </h1>
          </div>
        </div>

        <div className="mavericks-content">
          <div className="info-values-mavericks">
            <div className="value-item-mavericks">
              <div className="value-icon-mavericks conference-icon-mavericks"></div>
              <span className="value-text-mavericks">
                {teamData?.conference}
              </span>
            </div>

            <div className="value-item-mavericks">
              <div className="value-icon-mavericks division-icon-mavericks"></div>
              <span className="value-text-mavericks">{teamData?.division}</span>
            </div>

            <div className="value-item-mavericks">
              <div className="value-icon-mavericks gm-icon-mavericks"></div>
              <span className="value-text-mavericks">{teamData?.gm}</span>
            </div>
          </div>
        </div>

        <div className="mavericks-colors">
          <div className="color-dot-mavericks blue-dark-mavericks"></div>
          <div className="color-dot-mavericks blue-mavericks"></div>
          <div className="color-dot-mavericks navy-mavericks"></div>
          <div className="color-dot-mavericks silver-mavericks"></div>
          <div className="color-dot-mavericks silver-light-mavericks"></div>
        </div>
      </div>
    </div>
  );
};

export default InfoHeadMavericksLogoAndInfo;
