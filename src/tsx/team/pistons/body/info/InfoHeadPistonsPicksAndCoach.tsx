import React, { useEffect, useState } from "react";
import { supabase } from "../../../../../Supabase";
import "./pistonsPicksAndCoach.css";

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

const InfoHeadHawksPicksAndCoach = () => {
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
          .eq("team_name", "Hawks")
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
      .channel("head-hawks-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Head",
          filter: "team_name=eq.Hawks",
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
    return <div className="loading-text">Loading Pistons Picks & Coach...</div>;
  }

  if (error) {
    return <div className="loading-text error-text">Error: {error}</div>;
  }
  return (
    <div className="pistons-containers">
      <div className="header-content">
        <h1 className="header-title-pistons">PISTONS FRONT OFFICE</h1>
      </div>

      <div className="pistons-picks-coach-card">
        {/* <div className="pistons-pc-accent-top"></div> */}

        {/* Контейнер для горизонтального расположения */}
        <div className="pistons-pc-sections-container">
          {/* Head Coach Section */}
          <div className="pistons-pc-section">
            <div className="pistons-pc-header">
              <div className="pistons-coach-title-group">
                <h3 className="pistons-pc-title">HEAD COACH</h3>
                <h4 className="pistons-coach-name">
                  {teamData?.head_coach || "Coach Name"}
                </h4>
              </div>
            </div>
            <div className="pistons-coach-grid">
              <div className="pistons-coach-column">
                <div className="coach-item-pistons">
                  <span className="coach-position-pistons">PG</span>
                  <span className="coach-value-pistons">
                    {teamData?.coach_pg || "-"}
                  </span>
                </div>
                <div className="coach-item-pistons">
                  <span className="coach-position-pistons">SG</span>
                  <span className="coach-value-pistons">
                    {teamData?.coach_sg || "-"}
                  </span>
                </div>
                <div className="coach-item-pistons">
                  <span className="coach-position-pistons">SF</span>
                  <span className="coach-value-pistons">
                    {teamData?.coach_sf || "-"}
                  </span>
                </div>
                <div className="coach-item-pistons">
                  <span className="coach-position-pistons">PF</span>
                  <span className="coach-value-pistons">
                    {teamData?.coach_pf || "-"}
                  </span>
                </div>
              </div>

              <div className="pistons-coach-column">
                <div className="coach-item-pistons">
                  <span className="coach-position-pistons">C</span>
                  <span className="coach-value-pistons">
                    {teamData?.coach_c || "-"}
                  </span>
                </div>
                <div className="coach-item-pistons">
                  <span className="coach-position-pistons">STAR</span>
                  <span className="coach-value-pistons">
                    {teamData?.coach_star || "-"}
                  </span>
                </div>
                <div className="coach-item-pistons">
                  <span className="coach-position-pistons">START</span>
                  <span className="coach-value-pistons">
                    {teamData?.coach_start || "-"}
                  </span>
                </div>
                <div className="coach-item-pistons">
                  <span className="coach-position-pistons">BENCH</span>
                  <span className="coach-value-pistons">
                    {teamData?.coach_bench || "-"}
                  </span>
                </div>
              </div>

              <div className="pistons-coach-column">
                <div className="coach-item-pistons">
                  <span className="coach-position-pistons">G1</span>
                  <span className="coach-value-pistons">
                    {teamData?.coach_g1 || "-"}
                  </span>
                </div>
                <div className="coach-item-pistons">
                  <span className="coach-position-pistons">G2</span>
                  <span className="coach-value-pistons">
                    {teamData?.coach_g2 || "-"}
                  </span>
                </div>
                <div className="coach-item-pistons">
                  <span className="coach-position-pistons">G3</span>
                  <span className="coach-value-pistons">
                    {teamData?.coach_g3 || "-"}
                  </span>
                </div>
                <div className="coach-item-pistons">
                  <span className="coach-position-pistons">NEG</span>
                  <span className="coach-value-pistons">
                    {teamData?.coach_neg || "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Draft Picks Section */}
          <div className="pistons-pc-section">
            <div className="pistons-pc-header">
              <h3 className="pistons-pc-title">DRAFT PICKS</h3>
            </div>
            <div className="pistons-picks-grid">
              <div className="pistons-pick-column">
                <div className="pistons-pick-year">
                  {teamData?.year_pick_one || "2024"}
                </div>
                <div className="pick-item-pistons">
                  <span className="pick-round-pistons">1 ROUND</span>
                  <span className="pick-value-pistons">
                    {teamData?.draft_pick_one_1r || "-"}
                  </span>
                </div>
                <div className="pick-item-pistons">
                  <span className="pick-round-pistons">2 ROUND</span>
                  <span className="pick-value-pistons">
                    {teamData?.draft_pick_one_2r || "-"}
                  </span>
                </div>
              </div>

              <div className="pistons-pick-column">
                <div className="pistons-pick-year">
                  {teamData?.year_pick_two || "2025"}
                </div>
                <div className="pick-item-pistons">
                  <span className="pick-round-pistons">1 ROUND</span>
                  <span className="pick-value-pistons">
                    {teamData?.draft_pick_two_1r || "-"}
                  </span>
                </div>
                <div className="pick-item-pistons">
                  <span className="pick-round-pistons">2 ROUND</span>
                  <span className="pick-value-pistons">
                    {teamData?.draft_pick_two_2r || "-"}
                  </span>
                </div>
              </div>

              <div className="pistons-pick-column">
                <div className="pistons-pick-year">
                  {teamData?.year_pick_three || "2026"}
                </div>
                <div className="pick-item-pistons">
                  <span className="pick-round-pistons">1 ROUND</span>
                  <span className="pick-value-pistons">
                    {teamData?.draft_pick_three_1r || "-"}
                  </span>
                </div>
                <div className="pick-item-pistons">
                  <span className="pick-round-pistons">2 ROUND</span>
                  <span className="pick-value-pistons">
                    {teamData?.draft_pick_three_2r || "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pistons-pc-colors">
          <div className="color-dot-pistons blue-dark-pistons"></div>
          <div className="color-dot-pistons blue-pistons"></div>
          <div className="color-dot-pistons red-pistons"></div>
          <div className="color-dot-pistons red-light-pistons"></div>
          <div className="color-dot-pistons silver-pistons"></div>
        </div>
      </div>
    </div>
  );
};

export default InfoHeadHawksPicksAndCoach;
