import React, { useState, useEffect } from "react";
import { supabase } from "../../../../../Supabase";
import logo from "../../../../../img/Clippers.png"; // Измените на логотип Clippers
import "./logoAndInfoClippers.css";

interface TeamData {
  team_name: string;
  conference: string;
  division: string;
  gm: string;
}

const InfoHeadClippersLogoAndInfo = () => {
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
          .eq("team_name", "Clippers")
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
      .channel("head-clippers-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Head",
          filter: "team_name=eq.Clippers",
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

  if (loading) return <div className="clippers-loading">Loading...</div>;
  if (error) return <div className="clippers-error">Error: {error}</div>;

  return (
    <div className="clippers-container">
      <div className="clippers-card">
        <div className="clippers-accent-top"></div>
        <div className="clippers-accent-bottom"></div>

        <div className="clippers-header">
          <div className="logo-wrapper-clippers">
            <img
              className="clippers-logo"
              src={logo}
              alt="Los Angeles CLIPPERS"
            />
          </div>

          <div className="clippers-titles">
            <h1 className="clippers-team-name">
              <span className="team-name-main-clippers">
                {teamData?.team_name}
              </span>
              <span className="team-name-sub-clippers">Los Angeles</span>
            </h1>
          </div>
        </div>

        <div className="clippers-content">
          <div className="info-values-clippers">
            <div className="value-item-clippers">
              <div className="value-icon-clippers conference-icon-clippers"></div>
              <span className="value-text-clippers">
                {teamData?.conference}
              </span>
            </div>

            <div className="value-item-clippers">
              <div className="value-icon-clippers division-icon-clippers"></div>
              <span className="value-text-clippers">{teamData?.division}</span>
            </div>

            <div className="value-item-clippers">
              <div className="value-icon-clippers gm-icon-clippers"></div>
              <span className="value-text-clippers">{teamData?.gm}</span>
            </div>
          </div>
        </div>

        <div className="clippers-colors">
          <div className="color-dot-clippers blue-dark-clippers"></div>
          <div className="color-dot-clippers blue-clippers"></div>
          <div className="color-dot-clippers red-clippers"></div>
          <div className="color-dot-clippers red-light-clippers"></div>
          <div className="color-dot-clippers silver-clippers"></div>
        </div>
      </div>
    </div>
  );
};

export default InfoHeadClippersLogoAndInfo;
