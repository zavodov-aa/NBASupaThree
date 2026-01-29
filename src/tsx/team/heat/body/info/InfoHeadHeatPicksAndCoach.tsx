import React, { useEffect, useState } from "react";
import { supabase } from "../../../../../Supabase";
import "./heatPicksAndCoach.css";

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

const InfoHeadHeatPicksAndCoach = () => {
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
          .eq("team_name", "Heat")
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
      .channel("head-heat-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Head",
          filter: "team_name=eq.Heat",
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
    return <div className="loading-text">Loading Heat Picks & Coach...</div>;
  }

  if (error) {
    return <div className="loading-text error-text">Error: {error}</div>;
  }
  return (
    <div className="heat-containers">
      <div className="header-content">
        <h1 className="header-title-heat">HEAT FRONT OFFICE</h1>
      </div>

      <div className="heat-picks-coach-card">
        {/* <div className="heat-pc-accent-top"></div> */}

        {/* Контейнер для горизонтального расположения */}
        <div className="heat-pc-sections-container">
          {/* Head Coach Section */}
          <div className="heat-pc-section">
            <div className="heat-pc-header">
              <div className="heat-coach-title-group">
                <h3 className="heat-pc-title">HEAD COACH</h3>
                <h4 className="heat-coach-name">
                  {teamData?.head_coach || "Coach Name"}
                </h4>
              </div>
            </div>
            <div className="heat-coach-grid">
              <div className="heat-coach-column">
                <div className="coach-item-heat">
                  <span className="coach-position-heat">PG</span>
                  <span className="coach-value-heat">
                    {teamData?.coach_pg || "-"}
                  </span>
                </div>
                <div className="coach-item-heat">
                  <span className="coach-position-heat">SG</span>
                  <span className="coach-value-heat">
                    {teamData?.coach_sg || "-"}
                  </span>
                </div>
                <div className="coach-item-heat">
                  <span className="coach-position-heat">SF</span>
                  <span className="coach-value-heat">
                    {teamData?.coach_sf || "-"}
                  </span>
                </div>
                <div className="coach-item-heat">
                  <span className="coach-position-heat">PF</span>
                  <span className="coach-value-heat">
                    {teamData?.coach_pf || "-"}
                  </span>
                </div>
              </div>

              <div className="heat-coach-column">
                <div className="coach-item-heat">
                  <span className="coach-position-heat">C</span>
                  <span className="coach-value-heat">
                    {teamData?.coach_c || "-"}
                  </span>
                </div>
                <div className="coach-item-heat">
                  <span className="coach-position-heat">STAR</span>
                  <span className="coach-value-heat">
                    {teamData?.coach_star || "-"}
                  </span>
                </div>
                <div className="coach-item-heat">
                  <span className="coach-position-heat">START</span>
                  <span className="coach-value-heat">
                    {teamData?.coach_start || "-"}
                  </span>
                </div>
                <div className="coach-item-heat">
                  <span className="coach-position-heat">BENCH</span>
                  <span className="coach-value-heat">
                    {teamData?.coach_bench || "-"}
                  </span>
                </div>
              </div>

              <div className="heat-coach-column">
                <div className="coach-item-heat">
                  <span className="coach-position-heat">G1</span>
                  <span className="coach-value-heat">
                    {teamData?.coach_g1 || "-"}
                  </span>
                </div>
                <div className="coach-item-heat">
                  <span className="coach-position-heat">G2</span>
                  <span className="coach-value-heat">
                    {teamData?.coach_g2 || "-"}
                  </span>
                </div>
                <div className="coach-item-heat">
                  <span className="coach-position-heat">G3</span>
                  <span className="coach-value-heat">
                    {teamData?.coach_g3 || "-"}
                  </span>
                </div>
                <div className="coach-item-heat">
                  <span className="coach-position-heat">NEG</span>
                  <span className="coach-value-heat">
                    {teamData?.coach_neg || "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Draft Picks Section */}
          <div className="heat-pc-section">
            <div className="heat-pc-header">
              <h3 className="heat-pc-title">DRAFT PICKS</h3>
            </div>
            <div className="heat-picks-grid">
              <div className="heat-pick-column">
                <div className="heat-pick-year">
                  {teamData?.year_pick_one || "2024"}
                </div>
                <div className="pick-item-heat">
                  <span className="pick-round-heat">1 ROUND</span>
                  <span className="pick-value-heat">
                    {teamData?.draft_pick_one_1r || "-"}
                  </span>
                </div>
                <div className="pick-item-heat">
                  <span className="pick-round-heat">2 ROUND</span>
                  <span className="pick-value-heat">
                    {teamData?.draft_pick_one_2r || "-"}
                  </span>
                </div>
              </div>

              <div className="heat-pick-column">
                <div className="heat-pick-year">
                  {teamData?.year_pick_two || "2025"}
                </div>
                <div className="pick-item-heat">
                  <span className="pick-round-heat">1 ROUND</span>
                  <span className="pick-value-heat">
                    {teamData?.draft_pick_two_1r || "-"}
                  </span>
                </div>
                <div className="pick-item-heat">
                  <span className="pick-round-heat">2 ROUND</span>
                  <span className="pick-value-heat">
                    {teamData?.draft_pick_two_2r || "-"}
                  </span>
                </div>
              </div>

              <div className="heat-pick-column">
                <div className="heat-pick-year">
                  {teamData?.year_pick_three || "2026"}
                </div>
                <div className="pick-item-heat">
                  <span className="pick-round-heat">1 ROUND</span>
                  <span className="pick-value-heat">
                    {teamData?.draft_pick_three_1r || "-"}
                  </span>
                </div>
                <div className="pick-item-heat">
                  <span className="pick-round-heat">2 ROUND</span>
                  <span className="pick-value-heat">
                    {teamData?.draft_pick_three_2r || "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="heat-pc-colors">
          <div className="color-dot-heat black-heat"></div>
          <div className="color-dot-heat red-dark-heat"></div>
          <div className="color-dot-heat red-heat"></div>
          <div className="color-dot-heat yellow-heat"></div>
          <div className="color-dot-heat yellow-light-heat"></div>
        </div>
      </div>
    </div>
  );
};

export default InfoHeadHeatPicksAndCoach;
