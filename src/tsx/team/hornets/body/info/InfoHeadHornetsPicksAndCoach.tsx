import React, { useEffect, useState } from "react";
import { supabase } from "../../../../../Supabase";
import "./hornetsPicksAndCoach.css";

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

const InfoHeadHornetsPicksAndCoach = () => {
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
          .eq("team_name", "Hornets")
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
      .channel("head-hornets-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Head",
          filter: "team_name=eq.Hornets",
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
    return <div className="loading-text">Loading Hornets Picks & Coach...</div>;
  }

  if (error) {
    return <div className="loading-text error-text">Error: {error}</div>;
  }
  return (
    <div className="hornets-containers">
      <div className="header-content">
        <h1 className="header-title-hornets">HORNETS FRONT OFFICE</h1>
      </div>

      <div className="hornets-picks-coach-card">
        {/* <div className="hornets-pc-accent-top"></div> */}

        {/* Контейнер для горизонтального расположения */}
        <div className="hornets-pc-sections-container">
          {/* Head Coach Section */}
          <div className="hornets-pc-section">
            <div className="hornets-pc-header">
              <div className="hornets-coach-title-group">
                <h3 className="hornets-pc-title">HEAD COACH</h3>
                <h4 className="hornets-coach-name">
                  {teamData?.head_coach || "Coach Name"}
                </h4>
              </div>
            </div>
            <div className="hornets-coach-grid">
              <div className="hornets-coach-column">
                <div className="coach-item-hornets">
                  <span className="coach-position-hornets">PG</span>
                  <span className="coach-value-hornets">
                    {teamData?.coach_pg || "-"}
                  </span>
                </div>
                <div className="coach-item-hornets">
                  <span className="coach-position-hornets">SG</span>
                  <span className="coach-value-hornets">
                    {teamData?.coach_sg || "-"}
                  </span>
                </div>
                <div className="coach-item-hornets">
                  <span className="coach-position-hornets">SF</span>
                  <span className="coach-value-hornets">
                    {teamData?.coach_sf || "-"}
                  </span>
                </div>
                <div className="coach-item-hornets">
                  <span className="coach-position-hornets">PF</span>
                  <span className="coach-value-hornets">
                    {teamData?.coach_pf || "-"}
                  </span>
                </div>
              </div>

              <div className="hornets-coach-column">
                <div className="coach-item-hornets">
                  <span className="coach-position-hornets">C</span>
                  <span className="coach-value-hornets">
                    {teamData?.coach_c || "-"}
                  </span>
                </div>
                <div className="coach-item-hornets">
                  <span className="coach-position-hornets">STAR</span>
                  <span className="coach-value-hornets">
                    {teamData?.coach_star || "-"}
                  </span>
                </div>
                <div className="coach-item-hornets">
                  <span className="coach-position-hornets">START</span>
                  <span className="coach-value-hornets">
                    {teamData?.coach_start || "-"}
                  </span>
                </div>
                <div className="coach-item-hornets">
                  <span className="coach-position-hornets">BENCH</span>
                  <span className="coach-value-hornets">
                    {teamData?.coach_bench || "-"}
                  </span>
                </div>
              </div>

              <div className="hornets-coach-column">
                <div className="coach-item-hornets">
                  <span className="coach-position-hornets">G1</span>
                  <span className="coach-value-hornets">
                    {teamData?.coach_g1 || "-"}
                  </span>
                </div>
                <div className="coach-item-hornets">
                  <span className="coach-position-hornets">G2</span>
                  <span className="coach-value-hornets">
                    {teamData?.coach_g2 || "-"}
                  </span>
                </div>
                <div className="coach-item-hornets">
                  <span className="coach-position-hornets">G3</span>
                  <span className="coach-value-hornets">
                    {teamData?.coach_g3 || "-"}
                  </span>
                </div>
                <div className="coach-item-hornets">
                  <span className="coach-position-hornets">NEG</span>
                  <span className="coach-value-hornets">
                    {teamData?.coach_neg || "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Draft Picks Section */}
          <div className="hornets-pc-section">
            <div className="hornets-pc-header">
              <h3 className="hornets-pc-title">DRAFT PICKS</h3>
            </div>
            <div className="hornets-picks-grid">
              <div className="hornets-pick-column">
                <div className="hornets-pick-year">
                  {teamData?.year_pick_one || "2024"}
                </div>
                <div className="pick-item-hornets">
                  <span className="pick-round-hornets">1 ROUND</span>
                  <span className="pick-value-hornets">
                    {teamData?.draft_pick_one_1r || "-"}
                  </span>
                </div>
                <div className="pick-item-hornets">
                  <span className="pick-round-hornets">2 ROUND</span>
                  <span className="pick-value-hornets">
                    {teamData?.draft_pick_one_2r || "-"}
                  </span>
                </div>
              </div>

              <div className="hornets-pick-column">
                <div className="hornets-pick-year">
                  {teamData?.year_pick_two || "2025"}
                </div>
                <div className="pick-item-hornets">
                  <span className="pick-round-hornets">1 ROUND</span>
                  <span className="pick-value-hornets">
                    {teamData?.draft_pick_two_1r || "-"}
                  </span>
                </div>
                <div className="pick-item-hornets">
                  <span className="pick-round-hornets">2 ROUND</span>
                  <span className="pick-value-hornets">
                    {teamData?.draft_pick_two_2r || "-"}
                  </span>
                </div>
              </div>

              <div className="hornets-pick-column">
                <div className="hornets-pick-year">
                  {teamData?.year_pick_three || "2026"}
                </div>
                <div className="pick-item-hornets">
                  <span className="pick-round-hornets">1 ROUND</span>
                  <span className="pick-value-hornets">
                    {teamData?.draft_pick_three_1r || "-"}
                  </span>
                </div>
                <div className="pick-item-hornets">
                  <span className="pick-round-hornets">2 ROUND</span>
                  <span className="pick-value-hornets">
                    {teamData?.draft_pick_three_2r || "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="hornets-pc-colors">
          <div className="color-dot-hornets teal-hornets"></div>
          <div className="color-dot-hornets purple-dark-hornets"></div>
          <div className="color-dot-hornets purple-hornets"></div>
          <div className="color-dot-hornets blue-hornets"></div>
          <div className="color-dot-hornets gray-hornets"></div>
        </div>
      </div>
    </div>
  );
};

export default InfoHeadHornetsPicksAndCoach;
