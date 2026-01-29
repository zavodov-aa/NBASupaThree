import React, { useState, useEffect } from "react";
import { supabase } from "../../../../../Supabase";
import logo from "../../../../../img/magic.png"; // Предполагается, что логотип Magic будет в этом файле
import "./logoAndInfoMagic.css";

interface TeamData {
  team_name: string;
  conference: string;
  division: string;
  gm: string;
}

const InfoHeadMagicLogoAndInfo = () => {
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
          .eq("team_name", "Magic")
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
      .channel("head-magic-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Head",
          filter: "team_name=eq.Magic",
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

  if (loading) return <div className="magic-loading">Loading...</div>;
  if (error) return <div className="magic-error">Error: {error}</div>;

  return (
    <div className="magic-container">
      <div className="magic-card">
        <div className="magic-accent-top"></div>
        <div className="magic-accent-bottom"></div>

        <div className="magic-header">
          <div className="logo-wrapper-magic">
            <img className="magic-logo" src={logo} alt="Orlando MAGIC" />
          </div>

          <div className="magic-titles">
            <h1 className="magic-team-name">
              <span className="team-name-main-magic">
                {teamData?.team_name}
              </span>
              <span className="team-name-sub-magic">Orlando</span>
            </h1>
          </div>
        </div>

        <div className="magic-content">
          <div className="info-values-magic">
            <div className="value-item-magic">
              <div className="value-icon-magic conference-icon-magic"></div>
              <span className="value-text-magic">{teamData?.conference}</span>
            </div>

            <div className="value-item-magic">
              <div className="value-icon-magic division-icon-magic"></div>
              <span className="value-text-magic">{teamData?.division}</span>
            </div>

            <div className="value-item-magic">
              <div className="value-icon-magic gm-icon-magic"></div>
              <span className="value-text-magic">{teamData?.gm}</span>
            </div>
          </div>
        </div>

        <div className="magic-colors">
          <div className="color-dot-magic blue-dark-magic"></div>
          <div className="color-dot-magic blue-magic"></div>
          <div className="color-dot-magic blue-light-magic"></div>
          <div className="color-dot-magic silver-magic"></div>
          <div className="color-dot-magic black-magic"></div>
        </div>
      </div>
    </div>
  );
};

export default InfoHeadMagicLogoAndInfo;
