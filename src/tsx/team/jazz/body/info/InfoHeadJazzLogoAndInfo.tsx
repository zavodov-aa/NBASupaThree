import React, { useState, useEffect } from "react";
import { supabase } from "../../../../../Supabase";
import logo from "../../../../../img/Jazz.png"; // Обновите путь к логотипу
import "./logoAndInfoJazz.css";

interface TeamData {
  team_name: string;
  conference: string;
  division: string;
  gm: string;
}

const InfoHeadJazzLogoAndInfo = () => {
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
          .eq("team_name", "Jazz")
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
      .channel("head-jazz-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Head",
          filter: "team_name=eq.Jazz",
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

  if (loading) return <div className="jazz-loading">Loading...</div>;
  if (error) return <div className="jazz-error">Error: {error}</div>;

  return (
    <div className="jazz-container">
      <div className="jazz-card">
        <div className="jazz-accent-top"></div>
        <div className="jazz-accent-bottom"></div>

        <div className="jazz-header">
          <div className="logo-wrapper-jazz">
            <img className="jazz-logo" src={logo} alt="Utah JAZZ" />
          </div>

          <div className="jazz-titles">
            <h1 className="jazz-team-name">
              <span className="team-name-main-jazz">{teamData?.team_name}</span>
              <span className="team-name-sub-jazz">Utah</span>
            </h1>
          </div>
        </div>

        <div className="jazz-content">
          <div className="info-values-jazz">
            <div className="value-item-jazz">
              <div className="value-icon-jazz conference-icon-jazz"></div>
              <span className="value-text-jazz">{teamData?.conference}</span>
            </div>

            <div className="value-item-jazz">
              <div className="value-icon-jazz division-icon-jazz"></div>
              <span className="value-text-jazz">{teamData?.division}</span>
            </div>

            <div className="value-item-jazz">
              <div className="value-icon-jazz gm-icon-jazz"></div>
              <span className="value-text-jazz">{teamData?.gm}</span>
            </div>
          </div>
        </div>

        <div className="jazz-colors">
          <div className="color-dot-jazz navy-jazz"></div>
          <div className="color-dot-jazz blue-jazz"></div>
          <div className="color-dot-jazz yellow-dark-jazz"></div>
          <div className="color-dot-jazz yellow-jazz"></div>
          <div className="color-dot-jazz yellow-light-jazz"></div>
        </div>
      </div>
    </div>
  );
};

export default InfoHeadJazzLogoAndInfo;
