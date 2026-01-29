import React, { useState, useEffect } from "react";
import { supabase } from "../../../../../Supabase";
import logo from "../../../../../img/Timberwolves.png"; // Обнови путь к логотипу
import "./logoAndInfoTimberwolves.css";

interface TeamData {
  team_name: string;
  conference: string;
  division: string;
  gm: string;
}

const InfoHeadTimberwolvesLogoAndInfo = () => {
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
          .eq("team_name", "Timberwolves")
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
      .channel("head-timberwolves-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Head",
          filter: "team_name=eq.Timberwolves",
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

  if (loading) return <div className="timberwolves-loading">Loading...</div>;
  if (error) return <div className="timberwolves-error">Error: {error}</div>;

  return (
    <div className="timberwolves-containerss">
      <div className="timberwolves-card">
        <div className="timberwolves-accent-top"></div>
        <div className="timberwolves-accent-bottom"></div>

        <div className="timberwolves-header">
          <div className="logo-wrapper-timberwolves">
            <img
              className="timberwolves-logo"
              src={logo}
              alt="Minnesota TIMBERWOLVES"
            />
          </div>

          <div className="timberwolves-titles">
            <h1 className="timberwolves-team-name">
              <span className="team-name-main-timberwolves">
                {teamData?.team_name}
              </span>
              <span className="team-name-sub-timberwolves">Minnesota</span>
            </h1>
          </div>
        </div>

        <div className="timberwolves-content">
          <div className="info-values-timberwolves">
            <div className="value-item-timberwolves">
              <div className="value-icon-timberwolves conference-icon-timberwolves"></div>
              <span className="value-text-timberwolves">
                {teamData?.conference}
              </span>
            </div>

            <div className="value-item-timberwolves">
              <div className="value-icon-timberwolves division-icon-timberwolves"></div>
              <span className="value-text-timberwolves">
                {teamData?.division}
              </span>
            </div>

            <div className="value-item-timberwolves">
              <div className="value-icon-timberwolves gm-icon-timberwolves"></div>
              <span className="value-text-timberwolves">{teamData?.gm}</span>
            </div>
          </div>
        </div>

        <div className="timberwolves-colors">
          <div className="color-dot-timberwolves blue-dark-timberwolves"></div>
          <div className="color-dot-timberwolves blue-timberwolves"></div>
          <div className="color-dot-timberwolves green-timberwolves"></div>
          <div className="color-dot-timberwolves green-light-timberwolves"></div>
          <div className="color-dot-timberwolves gray-timberwolves"></div>
        </div>
      </div>
    </div>
  );
};

export default InfoHeadTimberwolvesLogoAndInfo;
