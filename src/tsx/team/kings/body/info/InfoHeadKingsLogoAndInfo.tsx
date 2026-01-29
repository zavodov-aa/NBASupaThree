import React, { useState, useEffect } from "react";
import { supabase } from "../../../../../Supabase";
import logo from "../../../../../img/Kings.png"; // Замените на логотип Kings
import "./logoAndInfoKings.css";

interface TeamData {
  team_name: string;
  conference: string;
  division: string;
  gm: string;
}

const InfoHeadKingsLogoAndInfo = () => {
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
          .eq("team_name", "Kings") // Изменили на Kings
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
      .channel("head-kings-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Head",
          filter: "team_name=eq.Kings", // Изменили на Kings
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

  if (loading) return <div className="kings-loading">Loading...</div>;
  if (error) return <div className="kings-error">Error: {error}</div>;

  return (
    <div className="kings-container">
      <div className="kings-card">
        <div className="kings-accent-top"></div>
        <div className="kings-accent-bottom"></div>

        <div className="kings-header">
          <div className="logo-wrapper-kings">
            <img className="kings-logo" src={logo} alt="Sacramento KINGS" />{" "}
            {/* Изменили alt */}
          </div>

          <div className="kings-titles">
            <h1 className="kings-team-name">
              <span className="team-name-main-kings">
                {teamData?.team_name}
              </span>
              <span className="team-name-sub-kings">Sacramento</span>{" "}
              {/* Изменили на Sacramento */}
            </h1>
          </div>
        </div>

        <div className="kings-content">
          <div className="info-values-kings">
            <div className="value-item-kings">
              <div className="value-icon-kings conference-icon-kings"></div>
              <span className="value-text-kings">{teamData?.conference}</span>
            </div>

            <div className="value-item-kings">
              <div className="value-icon-kings division-icon-kings"></div>
              <span className="value-text-kings">{teamData?.division}</span>
            </div>

            <div className="value-item-kings">
              <div className="value-icon-kings gm-icon-kings"></div>
              <span className="value-text-kings">{teamData?.gm}</span>
            </div>
          </div>
        </div>

        <div className="kings-colors">
          <div className="color-dot-kings purple-dark-kings"></div>
          <div className="color-dot-kings purple-kings"></div>
          <div className="color-dot-kings silver-kings"></div>{" "}
          {/* Изменили названия классов для цветов */}
          <div className="color-dot-kings gray-kings"></div>
          <div className="color-dot-kings gray-light-kings"></div>
        </div>
      </div>
    </div>
  );
};

export default InfoHeadKingsLogoAndInfo;
