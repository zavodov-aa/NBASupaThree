import React, { useState, useEffect } from "react";
import { supabase } from "../../../../../Supabase";
import logo from "../../../../../img/76ers.png"; // Обновите путь к логотипу
import "./logoAndInfoSevsix.css";

interface TeamData {
  team_name: string;
  conference: string;
  division: string;
  gm: string;
}

const InfoHeadSevsixLogoAndInfo = () => {
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
          .eq("team_name", "76ers") // Обновите на 76ers
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
      .channel("head-sevsix-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Head",
          filter: "team_name=eq.76ers", // Обновите на 76ers
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

  if (loading) return <div className="sevsix-loading">Loading...</div>;
  if (error) return <div className="sevsix-error">Error: {error}</div>;

  return (
    <div className="sevsix-container">
      <div className="sevsix-card">
        <div className="sevsix-accent-top"></div>
        <div className="sevsix-accent-bottom"></div>

        <div className="sevsix-header">
          <div className="logo-wrapper-sevsix">
            <img className="sevsix-logo" src={logo} alt="Philadelphia 76ers" />
          </div>

          <div className="sevsix-titles">
            <h1 className="sevsix-team-name">
              <span className="team-name-main-sevsix">
                {teamData?.team_name}
              </span>
              <span className="team-name-sub-sevsix">Philadelphia</span>
            </h1>
          </div>
        </div>

        <div className="sevsix-content">
          <div className="info-values-sevsix">
            <div className="value-item-sevsix">
              <div className="value-icon-sevsix conference-icon-sevsix"></div>
              <span className="value-text-sevsix">{teamData?.conference}</span>
            </div>

            <div className="value-item-sevsix">
              <div className="value-icon-sevsix division-icon-sevsix"></div>
              <span className="value-text-sevsix">{teamData?.division}</span>
            </div>

            <div className="value-item-sevsix">
              <div className="value-icon-sevsix gm-icon-sevsix"></div>
              <span className="value-text-sevsix">{teamData?.gm}</span>
            </div>
          </div>
        </div>

        <div className="sevsix-colors">
          <div className="color-dot-sevsix blue-dark-sevsix"></div>
          <div className="color-dot-sevsix blue-sevsix"></div>
          <div className="color-dot-sevsix red-sevsix"></div>
          <div className="color-dot-sevsix silver-sevsix"></div>
          <div className="color-dot-sevsix white-sevsix"></div>
        </div>
      </div>
    </div>
  );
};

export default InfoHeadSevsixLogoAndInfo;
