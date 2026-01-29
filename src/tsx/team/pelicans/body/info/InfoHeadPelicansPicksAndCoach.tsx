import React, { useEffect, useState } from "react";
import { supabase } from "../../../../../Supabase";
import "./pelicansPicksAndCoach.css";

interface TeamData {
  head_coach: string;
  name_coach: string;
  coach_pg: string;
  coach_sg: string;
  coach_sf: string;
  coach_pf: string;
  coach_c: string;
  coach_star: string;
  coach_start: string;
  coach_bench: string;
  coach_g1: string;
  coach_g2: string;
  coach_g3: string;
  coach_neg: string;
  year_pick_one: string;
  draft_pick_one_1r: string;
  draft_pick_one_2r: string;
  year_pick_two: string;
  draft_pick_two_1r: string;
  draft_pick_two_2r: string;
  year_pick_three: string;
  draft_pick_three_1r: string;
  draft_pick_three_2r: string;
}

const InfoHeadPelicansPicksAndCoach = () => {
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
          .eq("team_name", "Pelicans")
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
      .channel("head-pelicans-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Head",
          filter: "team_name=eq.Pelicans",
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

  if (loading) {
    return (
      <div className="loading-text">Loading Pelicans Picks & Coach...</div>
    );
  }

  if (error) {
    return <div className="loading-text error-text">Error: {error}</div>;
  }
  return (
    <div className="pelicans-containers">
      <div className="header-content">
        <h1 className="header-title-pelicans">PELICANS FRONT OFFICE</h1>
      </div>

      <div className="pelicans-picks-coach-card">
        {/* <div className="pelicans-pc-accent-top"></div> */}

        {/* Контейнер для горизонтального расположения */}
        <div className="pelicans-pc-sections-container">
          {/* Head Coach Section */}
          <div className="pelicans-pc-section">
            <div className="pelicans-pc-header">
              <div className="pelicans-coach-title-group">
                <h3 className="pelicans-pc-title">HEAD COACH</h3>
                <h4 className="pelicans-coach-name">
                  {teamData?.head_coach || "Coach Name"}
                </h4>
              </div>
            </div>
            <div className="pelicans-coach-grid">
              <div className="pelicans-coach-column">
                <div className="coach-item-pelicans">
                  <span className="coach-position-pelicans">PG</span>
                  <span className="coach-value-pelicans">
                    {teamData?.coach_pg || "-"}
                  </span>
                </div>
                <div className="coach-item-pelicans">
                  <span className="coach-position-pelicans">SG</span>
                  <span className="coach-value-pelicans">
                    {teamData?.coach_sg || "-"}
                  </span>
                </div>
                <div className="coach-item-pelicans">
                  <span className="coach-position-pelicans">SF</span>
                  <span className="coach-value-pelicans">
                    {teamData?.coach_sf || "-"}
                  </span>
                </div>
                <div className="coach-item-pelicans">
                  <span className="coach-position-pelicans">PF</span>
                  <span className="coach-value-pelicans">
                    {teamData?.coach_pf || "-"}
                  </span>
                </div>
              </div>

              <div className="pelicans-coach-column">
                <div className="coach-item-pelicans">
                  <span className="coach-position-pelicans">C</span>
                  <span className="coach-value-pelicans">
                    {teamData?.coach_c || "-"}
                  </span>
                </div>
                <div className="coach-item-pelicans">
                  <span className="coach-position-pelicans">STAR</span>
                  <span className="coach-value-pelicans">
                    {teamData?.coach_star || "-"}
                  </span>
                </div>
                <div className="coach-item-pelicans">
                  <span className="coach-position-pelicans">START</span>
                  <span className="coach-value-pelicans">
                    {teamData?.coach_start || "-"}
                  </span>
                </div>
                <div className="coach-item-pelicans">
                  <span className="coach-position-pelicans">BENCH</span>
                  <span className="coach-value-pelicans">
                    {teamData?.coach_bench || "-"}
                  </span>
                </div>
              </div>

              <div className="pelicans-coach-column">
                <div className="coach-item-pelicans">
                  <span className="coach-position-pelicans">G1</span>
                  <span className="coach-value-pelicans">
                    {teamData?.coach_g1 || "-"}
                  </span>
                </div>
                <div className="coach-item-pelicans">
                  <span className="coach-position-pelicans">G2</span>
                  <span className="coach-value-pelicans">
                    {teamData?.coach_g2 || "-"}
                  </span>
                </div>
                <div className="coach-item-pelicans">
                  <span className="coach-position-pelicans">G3</span>
                  <span className="coach-value-pelicans">
                    {teamData?.coach_g3 || "-"}
                  </span>
                </div>
                <div className="coach-item-pelicans">
                  <span className="coach-position-pelicans">NEG</span>
                  <span className="coach-value-pelicans">
                    {teamData?.coach_neg || "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Draft Picks Section */}
          <div className="pelicans-pc-section">
            <div className="pelicans-pc-header">
              <h3 className="pelicans-pc-title">DRAFT PICKS</h3>
            </div>
            <div className="pelicans-picks-grid">
              <div className="pelicans-pick-column">
                <div className="pelicans-pick-year">
                  {teamData?.year_pick_one || "2024"}
                </div>
                <div className="pick-item-pelicans">
                  <span className="pick-round-pelicans">1 ROUND</span>
                  <span className="pick-value-pelicans">
                    {teamData?.draft_pick_one_1r || "-"}
                  </span>
                </div>
                <div className="pick-item-pelicans">
                  <span className="pick-round-pelicans">2 ROUND</span>
                  <span className="pick-value-pelicans">
                    {teamData?.draft_pick_one_2r || "-"}
                  </span>
                </div>
              </div>

              <div className="pelicans-pick-column">
                <div className="pelicans-pick-year">
                  {teamData?.year_pick_two || "2025"}
                </div>
                <div className="pick-item-pelicans">
                  <span className="pick-round-pelicans">1 ROUND</span>
                  <span className="pick-value-pelicans">
                    {teamData?.draft_pick_two_1r || "-"}
                  </span>
                </div>
                <div className="pick-item-pelicans">
                  <span className="pick-round-pelicans">2 ROUND</span>
                  <span className="pick-value-pelicans">
                    {teamData?.draft_pick_two_2r || "-"}
                  </span>
                </div>
              </div>

              <div className="pelicans-pick-column">
                <div className="pelicans-pick-year">
                  {teamData?.year_pick_three || "2026"}
                </div>
                <div className="pick-item-pelicans">
                  <span className="pick-round-pelicans">1 ROUND</span>
                  <span className="pick-value-pelicans">
                    {teamData?.draft_pick_three_1r || "-"}
                  </span>
                </div>
                <div className="pick-item-pelicans">
                  <span className="pick-round-pelicans">2 ROUND</span>
                  <span className="pick-value-pelicans">
                    {teamData?.draft_pick_three_2r || "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pelicans-pc-colors">
          <div className="color-dot-pelicans blue-dark-pelicans"></div>
          <div className="color-dot-pelicans blue-pelicans"></div>
          <div className="color-dot-pelicans gold-pelicans"></div>
          <div className="color-dot-pelicans red-pelicans"></div>
          <div className="color-dot-pelicans purple-pelicans"></div>
        </div>
      </div>
    </div>
  );
};

export default InfoHeadPelicansPicksAndCoach;
