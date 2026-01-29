import React, { useState, useEffect } from "react";
import { supabase } from "../../../../../Supabase";
import logo from "../../../../../img/Suns.png"; // Обновите имя файла
import "./logoAndInfoSuns.css"; // Обновите имя файла

interface TeamData {
  team_name: string;
  conference: string;
  division: string;
  gm: string;
}

const InfoHeadSunsLogoAndInfo = () => {
  // Обновите имя компонента
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
          .eq("team_name", "Suns") // Обновите на "Suns"
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
      .channel("head-suns-changes") // Обновите имя канала
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Head",
          filter: "team_name=eq.Suns", // Обновите на "Suns"
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

  if (loading) return <div className="suns-loading">Loading...</div>; // Обновите класс
  if (error) return <div className="suns-error">Error: {error}</div>; // Обновите класс

  return (
    <div className="suns-container">
      {" "}
      {/* Обновите класс */}
      <div className="suns-card">
        {" "}
        {/* Обновите класс */}
        <div className="suns-accent-top"></div> {/* Обновите класс */}
        <div className="suns-accent-bottom"></div> {/* Обновите класс */}
        <div className="suns-header">
          {" "}
          {/* Обновите класс */}
          <div className="logo-wrapper-suns">
            {" "}
            {/* Обновите класс */}
            <img className="suns-logo" src={logo} alt="Phoenix SUNS" />{" "}
            {/* Обновите класс и alt */}
          </div>
          <div className="suns-titles">
            {" "}
            {/* Обновите класс */}
            <h1 className="suns-team-name">
              {" "}
              {/* Обновите класс */}
              <span className="team-name-main-suns">
                {" "}
                {/* Обновите класс */}
                {teamData?.team_name}
              </span>
              <span className="team-name-sub-suns">Phoenix</span>{" "}
              {/* Обновите класс */}
            </h1>
          </div>
        </div>
        <div className="suns-content">
          {" "}
          {/* Обновите класс */}
          <div className="info-values-suns">
            {" "}
            {/* Обновите класс */}
            <div className="value-item-suns">
              {" "}
              {/* Обновите класс */}
              <div className="value-icon-suns conference-icon-suns"></div>{" "}
              {/* Обновите класс */}
              <span className="value-text-suns">
                {teamData?.conference}
              </span>{" "}
              {/* Обновите класс */}
            </div>
            <div className="value-item-suns">
              {" "}
              {/* Обновите класс */}
              <div className="value-icon-suns division-icon-suns"></div>{" "}
              {/* Обновите класс */}
              <span className="value-text-suns">{teamData?.division}</span>{" "}
              {/* Обновите класс */}
            </div>
            <div className="value-item-suns">
              {" "}
              {/* Обновите класс */}
              <div className="value-icon-suns gm-icon-suns"></div>{" "}
              {/* Обновите класс */}
              <span className="value-text-suns">{teamData?.gm}</span>{" "}
              {/* Обновите класс */}
            </div>
          </div>
        </div>
        <div className="suns-colors">
          {" "}
          {/* Обновите класс */}
          <div className="color-dot-suns purple-suns"></div>{" "}
          {/* Обновите класс */}
          <div className="color-dot-suns orange-suns"></div>{" "}
          {/* Обновите класс */}
          <div className="color-dot-suns gray-suns"></div>{" "}
          {/* Обновите класс */}
          <div className="color-dot-suns yellow-suns"></div>{" "}
          {/* Обновите класс */}
          <div className="color-dot-suns white-suns"></div>{" "}
          {/* Обновите класс */}
        </div>
      </div>
    </div>
  );
};

export default InfoHeadSunsLogoAndInfo; // Обновите имя экспорта
