import React, { useEffect, useState } from "react";
import { supabase } from "../../../../../Supabase";
import "./warriorsPicksAndCoach.css";

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

const InfoHeadWarriorsPicksAndCoach = () => {
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
          .eq("team_name", "Warriors")
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
      .channel("head-warriors-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Head",
          filter: "team_name=eq.Warriors",
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
      <div className="loading-text">Loading Warriors Picks & Coach...</div>
    );
  }

  if (error) {
    return <div className="loading-text error-text">Error: {error}</div>;
  }
  return (
    <div className="warriors-containers">
      <div className="header-content">
        <h1 className="header-title-warriors">WARRIORS FRONT OFFICE</h1>
      </div>

      <div className="warriors-picks-coach-card">
        <div className="warriors-pc-sections-container">
          <div className="warriors-pc-section">
            <div className="warriors-pc-header">
              <div className="warriors-coach-title-group">
                <h3 className="warriors-pc-title">HEAD COACH</h3>
                <h4 className="warriors-coach-name">
                  {teamData?.head_coach || "Coach Name"}
                </h4>
              </div>
            </div>
            <div className="warriors-coach-grid">
              <div className="warriors-coach-column">
                <div className="coach-item-warriors">
                  <span className="coach-position-warriors">PG</span>
                  <span className="coach-value-warriors">
                    {teamData?.coach_pg || "-"}
                  </span>
                </div>
                <div className="coach-item-warriors">
                  <span className="coach-position-warriors">SG</span>
                  <span className="coach-value-warriors">
                    {teamData?.coach_sg || "-"}
                  </span>
                </div>
                <div className="coach-item-warriors">
                  <span className="coach-position-warriors">SF</span>
                  <span className="coach-value-warriors">
                    {teamData?.coach_sf || "-"}
                  </span>
                </div>
                <div className="coach-item-warriors">
                  <span className="coach-position-warriors">PF</span>
                  <span className="coach-value-warriors">
                    {teamData?.coach_pf || "-"}
                  </span>
                </div>
              </div>

              <div className="warriors-coach-column">
                <div className="coach-item-warriors">
                  <span className="coach-position-warriors">C</span>
                  <span className="coach-value-warriors">
                    {teamData?.coach_c || "-"}
                  </span>
                </div>
                <div className="coach-item-warriors">
                  <span className="coach-position-warriors">STAR</span>
                  <span className="coach-value-warriors">
                    {teamData?.coach_star || "-"}
                  </span>
                </div>
                <div className="coach-item-warriors">
                  <span className="coach-position-warriors">START</span>
                  <span className="coach-value-warriors">
                    {teamData?.coach_start || "-"}
                  </span>
                </div>
                <div className="coach-item-warriors">
                  <span className="coach-position-warriors">BENCH</span>
                  <span className="coach-value-warriors">
                    {teamData?.coach_bench || "-"}
                  </span>
                </div>
              </div>

              <div className="warriors-coach-column">
                <div className="coach-item-warriors">
                  <span className="coach-position-warriors">G1</span>
                  <span className="coach-value-warriors">
                    {teamData?.coach_g1 || "-"}
                  </span>
                </div>
                <div className="coach-item-warriors">
                  <span className="coach-position-warriors">G2</span>
                  <span className="coach-value-warriors">
                    {teamData?.coach_g2 || "-"}
                  </span>
                </div>
                <div className="coach-item-warriors">
                  <span className="coach-position-warriors">G3</span>
                  <span className="coach-value-warriors">
                    {teamData?.coach_g3 || "-"}
                  </span>
                </div>
                <div className="coach-item-warriors">
                  <span className="coach-position-warriors">NEG</span>
                  <span className="coach-value-warriors">
                    {teamData?.coach_neg || "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="warriors-pc-section">
            <div className="warriors-pc-header">
              <h3 className="warriors-pc-title">DRAFT PICKS</h3>
            </div>
            <div className="warriors-picks-grid">
              <div className="warriors-pick-column">
                <div className="warriors-pick-year">
                  {teamData?.year_pick_one || "2024"}
                </div>
                <div className="pick-item-warriors">
                  <span className="pick-round-warriors">1 ROUND</span>
                  <span className="pick-value-warriors">
                    {teamData?.draft_pick_one_1r || "-"}
                  </span>
                </div>
                <div className="pick-item-warriors">
                  <span className="pick-round-warriors">2 ROUND</span>
                  <span className="pick-value-warriors">
                    {teamData?.draft_pick_one_2r || "-"}
                  </span>
                </div>
              </div>

              <div className="warriors-pick-column">
                <div className="warriors-pick-year">
                  {teamData?.year_pick_two || "2025"}
                </div>
                <div className="pick-item-warriors">
                  <span className="pick-round-warriors">1 ROUND</span>
                  <span className="pick-value-warriors">
                    {teamData?.draft_pick_two_1r || "-"}
                  </span>
                </div>
                <div className="pick-item-warriors">
                  <span className="pick-round-warriors">2 ROUND</span>
                  <span className="pick-value-warriors">
                    {teamData?.draft_pick_two_2r || "-"}
                  </span>
                </div>
              </div>

              <div className="warriors-pick-column">
                <div className="warriors-pick-year">
                  {teamData?.year_pick_three || "2026"}
                </div>
                <div className="pick-item-warriors">
                  <span className="pick-round-warriors">1 ROUND</span>
                  <span className="pick-value-warriors">
                    {teamData?.draft_pick_three_1r || "-"}
                  </span>
                </div>
                <div className="pick-item-warriors">
                  <span className="pick-round-warriors">2 ROUND</span>
                  <span className="pick-value-warriors">
                    {teamData?.draft_pick_three_2r || "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="warriors-pc-colors">
          <div className="color-dot-warriors blue-dark-warriors"></div>
          <div className="color-dot-warriors blue-warriors"></div>
          <div className="color-dot-warriors yellow-warriors"></div>
          <div className="color-dot-warriors yellow-light-warriors"></div>
          <div className="color-dot-warriors white-warriors"></div>
        </div>
      </div>
    </div>
  );
};

export default InfoHeadWarriorsPicksAndCoach;
