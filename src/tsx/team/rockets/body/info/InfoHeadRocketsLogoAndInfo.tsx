import React, { useState, useEffect } from "react";
import { supabase } from "../../../../../Supabase";
import logo from "../../../../../img/Rockets.png"; // Предполагаем, что файл переименован
import "./logoAndInfoRockets.css";

interface TeamData {
  team_name: string;
  conference: string;
  division: string;
  gm: string;
}

const InfoHeadRocketsLogoAndInfo = () => {
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
          .eq("team_name", "Rockets")
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
      .channel("head-rockets-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Head",
          filter: "team_name=eq.Rockets",
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

  if (loading) return <div className="rockets-loading">Loading...</div>;
  if (error) return <div className="rockets-error">Error: {error}</div>;

  return (
    <div className="rockets-container">
      <div className="rockets-card">
        <div className="rockets-accent-top"></div>
        <div className="rockets-accent-bottom"></div>

        <div className="rockets-header">
          <div className="logo-wrapper-rockets">
            <img className="rockets-logo" src={logo} alt="Houston ROCKETS" />
          </div>

          <div className="rockets-titles">
            <h1 className="rockets-team-name">
              <span className="team-name-main-rockets">
                {teamData?.team_name}
              </span>
              <span className="team-name-sub-rockets">Houston</span>
            </h1>
          </div>
        </div>

        <div className="rockets-content">
          <div className="info-values-rockets">
            <div className="value-item-rockets">
              <div className="value-icon-rockets conference-icon-rockets"></div>
              <span className="value-text-rockets">{teamData?.conference}</span>
            </div>

            <div className="value-item-rockets">
              <div className="value-icon-rockets division-icon-rockets"></div>
              <span className="value-text-rockets">{teamData?.division}</span>
            </div>

            <div className="value-item-rockets">
              <div className="value-icon-rockets gm-icon-rockets"></div>
              <span className="value-text-rockets">{teamData?.gm}</span>
            </div>
          </div>
        </div>

        <div className="rockets-colors">
          <div className="color-dot-rockets black-dark-rockets"></div>
          <div className="color-dot-rockets black-rockets"></div>
          <div className="color-dot-rockets silver-rockets"></div>
          <div className="color-dot-rockets red-rockets"></div>
          <div className="color-dot-rockets red-light-rockets"></div>
        </div>
      </div>
    </div>
  );
};

export default InfoHeadRocketsLogoAndInfo;
