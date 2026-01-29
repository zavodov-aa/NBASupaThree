import React, { useState, useEffect } from "react";
import { supabase } from "../../../../../Supabase";
import logo from "../../../../../img/Thunder.png";
import "./logoAndInfoThunder.css";

interface TeamData {
  team_name: string;
  conference: string;
  division: string;
  gm: string;
}

const InfoHeadThunderLogoAndInfo = () => {
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
          .eq("team_name", "Thunder")
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
      .channel("head-thunder-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Head",
          filter: "team_name=eq.Thunder",
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

  if (loading) return <div className="thunder-loading">Loading...</div>;
  if (error) return <div className="thunder-error">Error: {error}</div>;

  return (
    <div className="thunder-containerss">
      <div className="thunder-card">
        <div className="thunder-accent-top"></div>
        <div className="thunder-accent-bottom"></div>

        <div className="thunder-header">
          <div className="logo-wrapper-thunder">
            <img
              className="thunder-logo"
              src={logo}
              alt="Oklahoma City THUNDER"
            />
          </div>

          <div className="thunder-titles">
            <h1 className="thunder-team-name">
              <span className="team-name-main-thunder">
                {teamData?.team_name}
              </span>
              <span className="team-name-sub-thunder">Oklahoma City</span>
            </h1>
          </div>
        </div>

        <div className="thunder-content">
          <div className="info-values-thunder">
            <div className="value-item-thunder">
              <div className="value-icon-thunder conference-icon-thunder"></div>
              <span className="value-text-thunder">{teamData?.conference}</span>
            </div>

            <div className="value-item-thunder">
              <div className="value-icon-thunder division-icon-thunder"></div>
              <span className="value-text-thunder">{teamData?.division}</span>
            </div>

            <div className="value-item-thunder">
              <div className="value-icon-thunder gm-icon-thunder"></div>
              <span className="value-text-thunder">{teamData?.gm}</span>
            </div>
          </div>
        </div>

        <div className="thunder-colors">
          <div className="color-dot-thunder blue-dark-thunder"></div>
          <div className="color-dot-thunder blue-thunder"></div>
          <div className="color-dot-thunder orange-dark-thunder"></div>
          <div className="color-dot-thunder orange-thunder"></div>
          <div className="color-dot-thunder yellow-thunder"></div>
        </div>
      </div>
    </div>
  );
};

export default InfoHeadThunderLogoAndInfo;
