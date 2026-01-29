import React, { useEffect, useState } from "react";
import { supabase } from "../../../../../Supabase";
import "./spursPicksAndCoach.css";

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

const InfoHeadSpursPicksAndCoach = () => {
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
          .eq("team_name", "Spurs")
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
      .channel("head-spurs-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Head",
          filter: "team_name=eq.Spurs",
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
    return <div className="loading-text">Loading Spurs Picks & Coach...</div>;
  }

  if (error) {
    return <div className="loading-text error-text">Error: {error}</div>;
  }
  return (
    <div className="spurs-containers">
      <div className="header-content">
        <h1 className="header-title-spurs">SPURS FRONT OFFICE</h1>
      </div>

      <div className="spurs-picks-coach-card">
        {/* <div className="spurs-pc-accent-top"></div> */}

        {/* Контейнер для горизонтального расположения */}
        <div className="spurs-pc-sections-container">
          {/* Head Coach Section */}
          <div className="spurs-pc-section">
            <div className="spurs-pc-header">
              <div className="spurs-coach-title-group">
                <h3 className="spurs-pc-title">HEAD COACH</h3>
                <h4 className="spurs-coach-name">
                  {teamData?.head_coach || "Coach Name"}
                </h4>
              </div>
            </div>
            <div className="spurs-coach-grid">
              <div className="spurs-coach-column">
                <div className="coach-item-spurs">
                  <span className="coach-position-spurs">PG</span>
                  <span className="coach-value-spurs">
                    {teamData?.coach_pg || "-"}
                  </span>
                </div>
                <div className="coach-item-spurs">
                  <span className="coach-position-spurs">SG</span>
                  <span className="coach-value-spurs">
                    {teamData?.coach_sg || "-"}
                  </span>
                </div>
                <div className="coach-item-spurs">
                  <span className="coach-position-spurs">SF</span>
                  <span className="coach-value-spurs">
                    {teamData?.coach_sf || "-"}
                  </span>
                </div>
                <div className="coach-item-spurs">
                  <span className="coach-position-spurs">PF</span>
                  <span className="coach-value-spurs">
                    {teamData?.coach_pf || "-"}
                  </span>
                </div>
              </div>

              <div className="spurs-coach-column">
                <div className="coach-item-spurs">
                  <span className="coach-position-spurs">C</span>
                  <span className="coach-value-spurs">
                    {teamData?.coach_c || "-"}
                  </span>
                </div>
                <div className="coach-item-spurs">
                  <span className="coach-position-spurs">STAR</span>
                  <span className="coach-value-spurs">
                    {teamData?.coach_star || "-"}
                  </span>
                </div>
                <div className="coach-item-spurs">
                  <span className="coach-position-spurs">START</span>
                  <span className="coach-value-spurs">
                    {teamData?.coach_start || "-"}
                  </span>
                </div>
                <div className="coach-item-spurs">
                  <span className="coach-position-spurs">BENCH</span>
                  <span className="coach-value-spurs">
                    {teamData?.coach_bench || "-"}
                  </span>
                </div>
              </div>

              <div className="spurs-coach-column">
                <div className="coach-item-spurs">
                  <span className="coach-position-spurs">G1</span>
                  <span className="coach-value-spurs">
                    {teamData?.coach_g1 || "-"}
                  </span>
                </div>
                <div className="coach-item-spurs">
                  <span className="coach-position-spurs">G2</span>
                  <span className="coach-value-spurs">
                    {teamData?.coach_g2 || "-"}
                  </span>
                </div>
                <div className="coach-item-spurs">
                  <span className="coach-position-spurs">G3</span>
                  <span className="coach-value-spurs">
                    {teamData?.coach_g3 || "-"}
                  </span>
                </div>
                <div className="coach-item-spurs">
                  <span className="coach-position-spurs">NEG</span>
                  <span className="coach-value-spurs">
                    {teamData?.coach_neg || "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Draft Picks Section */}
          <div className="spurs-pc-section">
            <div className="spurs-pc-header">
              <h3 className="spurs-pc-title">DRAFT PICKS</h3>
            </div>
            <div className="spurs-picks-grid">
              <div className="spurs-pick-column">
                <div className="spurs-pick-year">
                  {teamData?.year_pick_one || "2024"}
                </div>
                <div className="pick-item-spurs">
                  <span className="pick-round-spurs">1 ROUND</span>
                  <span className="pick-value-spurs">
                    {teamData?.draft_pick_one_1r || "-"}
                  </span>
                </div>
                <div className="pick-item-spurs">
                  <span className="pick-round-spurs">2 ROUND</span>
                  <span className="pick-value-spurs">
                    {teamData?.draft_pick_one_2r || "-"}
                  </span>
                </div>
              </div>

              <div className="spurs-pick-column">
                <div className="spurs-pick-year">
                  {teamData?.year_pick_two || "2025"}
                </div>
                <div className="pick-item-spurs">
                  <span className="pick-round-spurs">1 ROUND</span>
                  <span className="pick-value-spurs">
                    {teamData?.draft_pick_two_1r || "-"}
                  </span>
                </div>
                <div className="pick-item-spurs">
                  <span className="pick-round-spurs">2 ROUND</span>
                  <span className="pick-value-spurs">
                    {teamData?.draft_pick_two_2r || "-"}
                  </span>
                </div>
              </div>

              <div className="spurs-pick-column">
                <div className="spurs-pick-year">
                  {teamData?.year_pick_three || "2026"}
                </div>
                <div className="pick-item-spurs">
                  <span className="pick-round-spurs">1 ROUND</span>
                  <span className="pick-value-spurs">
                    {teamData?.draft_pick_three_1r || "-"}
                  </span>
                </div>
                <div className="pick-item-spurs">
                  <span className="pick-round-spurs">2 ROUND</span>
                  <span className="pick-value-spurs">
                    {teamData?.draft_pick_three_2r || "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="spurs-pc-colors">
          <div className="color-dot-spurs black-spurs"></div>
          <div className="color-dot-spurs silver-spurs"></div>
          <div className="color-dot-spurs silver-light-spurs"></div>
          <div className="color-dot-spurs gray-spurs"></div>
          <div className="color-dot-spurs gray-light-spurs"></div>
        </div>
      </div>
    </div>
  );
};

export default InfoHeadSpursPicksAndCoach;
