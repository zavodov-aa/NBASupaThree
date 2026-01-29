import React, { useEffect, useState } from "react";
import { supabase } from "../../../../../Supabase";
import "./sunsPicksAndCoach.css";

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

const InfoHeadSunsPicksAndCoach = () => {
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
          .eq("team_name", "Suns")
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
      .channel("head-suns-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Head",
          filter: "team_name=eq.Suns",
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
    return <div className="loading-text">Loading Suns Picks & Coach...</div>;
  }

  if (error) {
    return <div className="loading-text error-text">Error: {error}</div>;
  }
  return (
    <div className="suns-containers">
      <div className="header-content">
        <h1 className="header-title-suns">SUNS FRONT OFFICE</h1>
      </div>

      <div className="suns-picks-coach-card">
        {/* <div className="suns-pc-accent-top"></div> */}

        {/* Контейнер для горизонтального расположения */}
        <div className="suns-pc-sections-container">
          {/* Head Coach Section */}
          <div className="suns-pc-section">
            <div className="suns-pc-header">
              <div className="suns-coach-title-group">
                <h3 className="suns-pc-title">HEAD COACH</h3>
                <h4 className="suns-coach-name">
                  {teamData?.head_coach || "Coach Name"}
                </h4>
              </div>
            </div>
            <div className="suns-coach-grid">
              <div className="suns-coach-column">
                <div className="coach-item-suns">
                  <span className="coach-position-suns">PG</span>
                  <span className="coach-value-suns">
                    {teamData?.coach_pg || "-"}
                  </span>
                </div>
                <div className="coach-item-suns">
                  <span className="coach-position-suns">SG</span>
                  <span className="coach-value-suns">
                    {teamData?.coach_sg || "-"}
                  </span>
                </div>
                <div className="coach-item-suns">
                  <span className="coach-position-suns">SF</span>
                  <span className="coach-value-suns">
                    {teamData?.coach_sf || "-"}
                  </span>
                </div>
                <div className="coach-item-suns">
                  <span className="coach-position-suns">PF</span>
                  <span className="coach-value-suns">
                    {teamData?.coach_pf || "-"}
                  </span>
                </div>
              </div>

              <div className="suns-coach-column">
                <div className="coach-item-suns">
                  <span className="coach-position-suns">C</span>
                  <span className="coach-value-suns">
                    {teamData?.coach_c || "-"}
                  </span>
                </div>
                <div className="coach-item-suns">
                  <span className="coach-position-suns">STAR</span>
                  <span className="coach-value-suns">
                    {teamData?.coach_star || "-"}
                  </span>
                </div>
                <div className="coach-item-suns">
                  <span className="coach-position-suns">START</span>
                  <span className="coach-value-suns">
                    {teamData?.coach_start || "-"}
                  </span>
                </div>
                <div className="coach-item-suns">
                  <span className="coach-position-suns">BENCH</span>
                  <span className="coach-value-suns">
                    {teamData?.coach_bench || "-"}
                  </span>
                </div>
              </div>

              <div className="suns-coach-column">
                <div className="coach-item-suns">
                  <span className="coach-position-suns">G1</span>
                  <span className="coach-value-suns">
                    {teamData?.coach_g1 || "-"}
                  </span>
                </div>
                <div className="coach-item-suns">
                  <span className="coach-position-suns">G2</span>
                  <span className="coach-value-suns">
                    {teamData?.coach_g2 || "-"}
                  </span>
                </div>
                <div className="coach-item-suns">
                  <span className="coach-position-suns">G3</span>
                  <span className="coach-value-suns">
                    {teamData?.coach_g3 || "-"}
                  </span>
                </div>
                <div className="coach-item-suns">
                  <span className="coach-position-suns">NEG</span>
                  <span className="coach-value-suns">
                    {teamData?.coach_neg || "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Draft Picks Section */}
          <div className="suns-pc-section">
            <div className="suns-pc-header">
              <h3 className="suns-pc-title">DRAFT PICKS</h3>
            </div>
            <div className="suns-picks-grid">
              <div className="suns-pick-column">
                <div className="suns-pick-year">
                  {teamData?.year_pick_one || "2024"}
                </div>
                <div className="pick-item-suns">
                  <span className="pick-round-suns">1 ROUND</span>
                  <span className="pick-value-suns">
                    {teamData?.draft_pick_one_1r || "-"}
                  </span>
                </div>
                <div className="pick-item-suns">
                  <span className="pick-round-suns">2 ROUND</span>
                  <span className="pick-value-suns">
                    {teamData?.draft_pick_one_2r || "-"}
                  </span>
                </div>
              </div>

              <div className="suns-pick-column">
                <div className="suns-pick-year">
                  {teamData?.year_pick_two || "2025"}
                </div>
                <div className="pick-item-suns">
                  <span className="pick-round-suns">1 ROUND</span>
                  <span className="pick-value-suns">
                    {teamData?.draft_pick_two_1r || "-"}
                  </span>
                </div>
                <div className="pick-item-suns">
                  <span className="pick-round-suns">2 ROUND</span>
                  <span className="pick-value-suns">
                    {teamData?.draft_pick_two_2r || "-"}
                  </span>
                </div>
              </div>

              <div className="suns-pick-column">
                <div className="suns-pick-year">
                  {teamData?.year_pick_three || "2026"}
                </div>
                <div className="pick-item-suns">
                  <span className="pick-round-suns">1 ROUND</span>
                  <span className="pick-value-suns">
                    {teamData?.draft_pick_three_1r || "-"}
                  </span>
                </div>
                <div className="pick-item-suns">
                  <span className="pick-round-suns">2 ROUND</span>
                  <span className="pick-value-suns">
                    {teamData?.draft_pick_three_2r || "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="suns-pc-colors">
          <div className="color-dot-suns purple-dark-suns"></div>
          <div className="color-dot-suns purple-suns"></div>
          <div className="color-dot-suns orange-suns"></div>
          <div className="color-dot-suns yellow-suns"></div>
          <div className="color-dot-suns gray-suns"></div>
        </div>
      </div>
    </div>
  );
};

export default InfoHeadSunsPicksAndCoach;
