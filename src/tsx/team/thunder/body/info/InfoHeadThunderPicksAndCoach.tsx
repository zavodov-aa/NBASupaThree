import React, { useEffect, useState } from "react";
import { supabase } from "../../../../../Supabase";
import "./thunderPicksAndCoach.css";

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

const InfoHeadThunderPicksAndCoach = () => {
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
          .eq("team_name", "Thunder")
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
      .channel("head-thunder-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Head",
          filter: "team_name=eq.Thunder",
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
    return <div className="loading-text">Loading Thunder Picks & Coach...</div>;
  }

  if (error) {
    return <div className="loading-text error-text">Error: {error}</div>;
  }
  return (
    <div className="thunder-containers">
      <div className="header-content">
        <h1 className="header-title-thunder">THUNDER FRONT OFFICE</h1>
      </div>

      <div className="thunder-picks-coach-card">
        {/* <div className="thunder-pc-accent-top"></div> */}

        {/* Контейнер для горизонтального расположения */}
        <div className="thunder-pc-sections-container">
          {/* Head Coach Section */}
          <div className="thunder-pc-section">
            <div className="thunder-pc-header">
              <div className="thunder-coach-title-group">
                <h3 className="thunder-pc-title">HEAD COACH</h3>
                <h4 className="thunder-coach-name">
                  {teamData?.head_coach || "Coach Name"}
                </h4>
              </div>
            </div>
            <div className="thunder-coach-grid">
              <div className="thunder-coach-column">
                <div className="coach-item-thunder">
                  <span className="coach-position-thunder">PG</span>
                  <span className="coach-value-thunder">
                    {teamData?.coach_pg || "-"}
                  </span>
                </div>
                <div className="coach-item-thunder">
                  <span className="coach-position-thunder">SG</span>
                  <span className="coach-value-thunder">
                    {teamData?.coach_sg || "-"}
                  </span>
                </div>
                <div className="coach-item-thunder">
                  <span className="coach-position-thunder">SF</span>
                  <span className="coach-value-thunder">
                    {teamData?.coach_sf || "-"}
                  </span>
                </div>
                <div className="coach-item-thunder">
                  <span className="coach-position-thunder">PF</span>
                  <span className="coach-value-thunder">
                    {teamData?.coach_pf || "-"}
                  </span>
                </div>
              </div>

              <div className="thunder-coach-column">
                <div className="coach-item-thunder">
                  <span className="coach-position-thunder">C</span>
                  <span className="coach-value-thunder">
                    {teamData?.coach_c || "-"}
                  </span>
                </div>
                <div className="coach-item-thunder">
                  <span className="coach-position-thunder">STAR</span>
                  <span className="coach-value-thunder">
                    {teamData?.coach_star || "-"}
                  </span>
                </div>
                <div className="coach-item-thunder">
                  <span className="coach-position-thunder">START</span>
                  <span className="coach-value-thunder">
                    {teamData?.coach_start || "-"}
                  </span>
                </div>
                <div className="coach-item-thunder">
                  <span className="coach-position-thunder">BENCH</span>
                  <span className="coach-value-thunder">
                    {teamData?.coach_bench || "-"}
                  </span>
                </div>
              </div>

              <div className="thunder-coach-column">
                <div className="coach-item-thunder">
                  <span className="coach-position-thunder">G1</span>
                  <span className="coach-value-thunder">
                    {teamData?.coach_g1 || "-"}
                  </span>
                </div>
                <div className="coach-item-thunder">
                  <span className="coach-position-thunder">G2</span>
                  <span className="coach-value-thunder">
                    {teamData?.coach_g2 || "-"}
                  </span>
                </div>
                <div className="coach-item-thunder">
                  <span className="coach-position-thunder">G3</span>
                  <span className="coach-value-thunder">
                    {teamData?.coach_g3 || "-"}
                  </span>
                </div>
                <div className="coach-item-thunder">
                  <span className="coach-position-thunder">NEG</span>
                  <span className="coach-value-thunder">
                    {teamData?.coach_neg || "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Draft Picks Section */}
          <div className="thunder-pc-section">
            <div className="thunder-pc-header">
              <h3 className="thunder-pc-title">DRAFT PICKS</h3>
            </div>
            <div className="thunder-picks-grid">
              <div className="thunder-pick-column">
                <div className="thunder-pick-year">
                  {teamData?.year_pick_one || "2024"}
                </div>
                <div className="pick-item-thunder">
                  <span className="pick-round-thunder">1 ROUND</span>
                  <span className="pick-value-thunder">
                    {teamData?.draft_pick_one_1r || "-"}
                  </span>
                </div>
                <div className="pick-item-thunder">
                  <span className="pick-round-thunder">2 ROUND</span>
                  <span className="pick-value-thunder">
                    {teamData?.draft_pick_one_2r || "-"}
                  </span>
                </div>
              </div>

              <div className="thunder-pick-column">
                <div className="thunder-pick-year">
                  {teamData?.year_pick_two || "2025"}
                </div>
                <div className="pick-item-thunder">
                  <span className="pick-round-thunder">1 ROUND</span>
                  <span className="pick-value-thunder">
                    {teamData?.draft_pick_two_1r || "-"}
                  </span>
                </div>
                <div className="pick-item-thunder">
                  <span className="pick-round-thunder">2 ROUND</span>
                  <span className="pick-value-thunder">
                    {teamData?.draft_pick_two_2r || "-"}
                  </span>
                </div>
              </div>

              <div className="thunder-pick-column">
                <div className="thunder-pick-year">
                  {teamData?.year_pick_three || "2026"}
                </div>
                <div className="pick-item-thunder">
                  <span className="pick-round-thunder">1 ROUND</span>
                  <span className="pick-value-thunder">
                    {teamData?.draft_pick_three_1r || "-"}
                  </span>
                </div>
                <div className="pick-item-thunder">
                  <span className="pick-round-thunder">2 ROUND</span>
                  <span className="pick-value-thunder">
                    {teamData?.draft_pick_three_2r || "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="thunder-pc-colors">
          <div className="color-dot-thunder blue-dark-thunder"></div>
          <div className="color-dot-thunder blue-thunder"></div>
          <div className="color-dot-thunder orange-thunder"></div>
          <div className="color-dot-thunder yellow-thunder"></div>
          <div className="color-dot-thunder yellow-light-thunder"></div>
        </div>
      </div>
    </div>
  );
};

export default InfoHeadThunderPicksAndCoach;
