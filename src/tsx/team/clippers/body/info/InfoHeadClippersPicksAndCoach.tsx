import React, { useEffect, useState } from "react";
import { supabase } from "../../../../../Supabase";
import "./clippersPicksAndCoach.css";

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

const InfoHeadClippersPicksAndCoach = () => {
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

  if (loading) {
    return (
      <div className="loading-text">Loading Clippers Picks & Coach...</div>
    );
  }

  if (error) {
    return <div className="loading-text error-text">Error: {error}</div>;
  }
  return (
    <div className="clippers-containers">
      <div className="header-content">
        <h1 className="header-title-clippers">CLIPPERS FRONT OFFICE</h1>
      </div>

      <div className="clippers-picks-coach-card">
        {/* <div className="clippers-pc-accent-top"></div> */}

        {/* Контейнер для горизонтального расположения */}
        <div className="clippers-pc-sections-container">
          {/* Head Coach Section */}
          <div className="clippers-pc-section">
            <div className="clippers-pc-header">
              <div className="clippers-coach-title-group">
                <h3 className="clippers-pc-title">HEAD COACH</h3>
                <h4 className="clippers-coach-name">
                  {teamData?.head_coach || "Coach Name"}
                </h4>
              </div>
            </div>
            <div className="clippers-coach-grid">
              <div className="clippers-coach-column">
                <div className="coach-item-clippers">
                  <span className="coach-position-clippers">PG</span>
                  <span className="coach-value-clippers">
                    {teamData?.coach_pg || "-"}
                  </span>
                </div>
                <div className="coach-item-clippers">
                  <span className="coach-position-clippers">SG</span>
                  <span className="coach-value-clippers">
                    {teamData?.coach_sg || "-"}
                  </span>
                </div>
                <div className="coach-item-clippers">
                  <span className="coach-position-clippers">SF</span>
                  <span className="coach-value-clippers">
                    {teamData?.coach_sf || "-"}
                  </span>
                </div>
                <div className="coach-item-clippers">
                  <span className="coach-position-clippers">PF</span>
                  <span className="coach-value-clippers">
                    {teamData?.coach_pf || "-"}
                  </span>
                </div>
              </div>

              <div className="clippers-coach-column">
                <div className="coach-item-clippers">
                  <span className="coach-position-clippers">C</span>
                  <span className="coach-value-clippers">
                    {teamData?.coach_c || "-"}
                  </span>
                </div>
                <div className="coach-item-clippers">
                  <span className="coach-position-clippers">STAR</span>
                  <span className="coach-value-clippers">
                    {teamData?.coach_star || "-"}
                  </span>
                </div>
                <div className="coach-item-clippers">
                  <span className="coach-position-clippers">START</span>
                  <span className="coach-value-clippers">
                    {teamData?.coach_start || "-"}
                  </span>
                </div>
                <div className="coach-item-clippers">
                  <span className="coach-position-clippers">BENCH</span>
                  <span className="coach-value-clippers">
                    {teamData?.coach_bench || "-"}
                  </span>
                </div>
              </div>

              <div className="clippers-coach-column">
                <div className="coach-item-clippers">
                  <span className="coach-position-clippers">G1</span>
                  <span className="coach-value-clippers">
                    {teamData?.coach_g1 || "-"}
                  </span>
                </div>
                <div className="coach-item-clippers">
                  <span className="coach-position-clippers">G2</span>
                  <span className="coach-value-clippers">
                    {teamData?.coach_g2 || "-"}
                  </span>
                </div>
                <div className="coach-item-clippers">
                  <span className="coach-position-clippers">G3</span>
                  <span className="coach-value-clippers">
                    {teamData?.coach_g3 || "-"}
                  </span>
                </div>
                <div className="coach-item-clippers">
                  <span className="coach-position-clippers">NEG</span>
                  <span className="coach-value-clippers">
                    {teamData?.coach_neg || "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Draft Picks Section */}
          <div className="clippers-pc-section">
            <div className="clippers-pc-header">
              <h3 className="clippers-pc-title">DRAFT PICKS</h3>
            </div>
            <div className="clippers-picks-grid">
              <div className="clippers-pick-column">
                <div className="clippers-pick-year">
                  {teamData?.year_pick_one || "2024"}
                </div>
                <div className="pick-item-clippers">
                  <span className="pick-round-clippers">1 ROUND</span>
                  <span className="pick-value-clippers">
                    {teamData?.draft_pick_one_1r || "-"}
                  </span>
                </div>
                <div className="pick-item-clippers">
                  <span className="pick-round-clippers">2 ROUND</span>
                  <span className="pick-value-clippers">
                    {teamData?.draft_pick_one_2r || "-"}
                  </span>
                </div>
              </div>

              <div className="clippers-pick-column">
                <div className="clippers-pick-year">
                  {teamData?.year_pick_two || "2025"}
                </div>
                <div className="pick-item-clippers">
                  <span className="pick-round-clippers">1 ROUND</span>
                  <span className="pick-value-clippers">
                    {teamData?.draft_pick_two_1r || "-"}
                  </span>
                </div>
                <div className="pick-item-clippers">
                  <span className="pick-round-clippers">2 ROUND</span>
                  <span className="pick-value-clippers">
                    {teamData?.draft_pick_two_2r || "-"}
                  </span>
                </div>
              </div>

              <div className="clippers-pick-column">
                <div className="clippers-pick-year">
                  {teamData?.year_pick_three || "2026"}
                </div>
                <div className="pick-item-clippers">
                  <span className="pick-round-clippers">1 ROUND</span>
                  <span className="pick-value-clippers">
                    {teamData?.draft_pick_three_1r || "-"}
                  </span>
                </div>
                <div className="pick-item-clippers">
                  <span className="pick-round-clippers">2 ROUND</span>
                  <span className="pick-value-clippers">
                    {teamData?.draft_pick_three_2r || "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="clippers-pc-colors">
          <div className="color-dot-clippers red-dark-clippers"></div>
          <div className="color-dot-clippers blue-clippers"></div>
          <div className="color-dot-clippers red-clippers"></div>
          <div className="color-dot-clippers silver-clippers"></div>
          <div className="color-dot-clippers black-clippers"></div>
        </div>
      </div>
    </div>
  );
};

export default InfoHeadClippersPicksAndCoach;
