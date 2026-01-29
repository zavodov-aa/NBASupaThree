import React, { useState, useEffect } from "react";
import { supabase } from "../../../../../Supabase";
import logo from "../../../../../img/Pistons.png"; // Убедитесь, что у вас есть файл pistonsLogo.png
import "./logoAndInfoPistons.css";

interface TeamData {
  team_name: string;
  conference: string;
  division: string;
  gm: string;
}

const InfoHeadPistonsLogoAndInfo = () => {
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
          .eq("team_name", "Pistons")
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
      .channel("head-pistons-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Head",
          filter: "team_name=eq.Pistons",
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

  if (loading) return <div className="pistons-loading">Loading...</div>;
  if (error) return <div className="pistons-error">Error: {error}</div>;

  return (
    <div className="pistons-container">
      <div className="pistons-card">
        <div className="pistons-accent-top"></div>
        <div className="pistons-accent-bottom"></div>

        <div className="pistons-header">
          <div className="logo-wrapper-pistons">
            <img className="pistons-logo" src={logo} alt="Detroit PISTONS" />
          </div>

          <div className="pistons-titles">
            <h1 className="pistons-team-name">
              <span className="team-name-main-pistons">
                {teamData?.team_name}
              </span>
              <span className="team-name-sub-pistons">Detroit</span>
            </h1>
          </div>
        </div>

        <div className="pistons-content">
          <div className="info-values-pistons">
            <div className="value-item-pistons">
              <div className="value-icon-pistons conference-icon-pistons"></div>
              <span className="value-text-pistons">{teamData?.conference}</span>
            </div>

            <div className="value-item-pistons">
              <div className="value-icon-pistons division-icon-pistons"></div>
              <span className="value-text-pistons">{teamData?.division}</span>
            </div>

            <div className="value-item-pistons">
              <div className="value-icon-pistons gm-icon-pistons"></div>
              <span className="value-text-pistons">{teamData?.gm}</span>
            </div>
          </div>
        </div>

        <div className="pistons-colors">
          <div className="color-dot-pistons blue-dark-pistons"></div>
          <div className="color-dot-pistons blue-pistons"></div>
          <div className="color-dot-pistons red-pistons"></div>
          <div className="color-dot-pistons red-light-pistons"></div>
          <div className="color-dot-pistons white-pistons"></div>
        </div>
      </div>
    </div>
  );
};

export default InfoHeadPistonsLogoAndInfo;
