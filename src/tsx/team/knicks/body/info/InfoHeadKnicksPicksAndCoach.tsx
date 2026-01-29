import React, { useEffect, useState } from "react";
import { supabase } from "../../../../../Supabase";
import "./knicksPicksAndCoach.css";

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
    return <div className="loading-text">Loading Knicks Picks & Coach...</div>;
  }

  if (error) {
    return <div className="loading-text error-text">Error: {error}</div>;
  }
  return (
    <div className="knicks-containers">
      <div className="header-content">
        <h1 className="header-title-knicks">KNICKS FRONT OFFICE</h1>
      </div>

      <div className="knicks-picks-coach-card">
        <div className="knicks-pc-sections-container">
          {/* Head Coach Section */}
          <div className="knicks-pc-section">
            <div className="knicks-pc-header">
              <div className="knicks-coach-title-group">
                <h3 className="knicks-pc-title">HEAD COACH</h3>
                <h4 className="knicks-coach-name">
                  {teamData?.head_coach || "Coach Name"}
                </h4>
              </div>
            </div>
            <div className="knicks-coach-grid">
              <div className="knicks-coach-column">
                <div className="coach-item-knicks">
                  <span className="coach-position-knicks">PG</span>
                  <span className="coach-value-knicks">
                    {teamData?.coach_pg || "-"}
                  </span>
                </div>
                <div className="coach-item-knicks">
                  <span className="coach-position-knicks">SG</span>
                  <span className="coach-value-knicks">
                    {teamData?.coach_sg || "-"}
                  </span>
                </div>
                <div className="coach-item-knicks">
                  <span className="coach-position-knicks">SF</span>
                  <span className="coach-value-knicks">
                    {teamData?.coach_sf || "-"}
                  </span>
                </div>
                <div className="coach-item-knicks">
                  <span className="coach-position-knicks">PF</span>
                  <span className="coach-value-knicks">
                    {teamData?.coach_pf || "-"}
                  </span>
                </div>
              </div>

              <div className="knicks-coach-column">
                <div className="coach-item-knicks">
                  <span className="coach-position-knicks">C</span>
                  <span className="coach-value-knicks">
                    {teamData?.coach_c || "-"}
                  </span>
                </div>
                <div className="coach-item-knicks">
                  <span className="coach-position-knicks">STAR</span>
                  <span className="coach-value-knicks">
                    {teamData?.coach_star || "-"}
                  </span>
                </div>
                <div className="coach-item-knicks">
                  <span className="coach-position-knicks">START</span>
                  <span className="coach-value-knicks">
                    {teamData?.coach_start || "-"}
                  </span>
                </div>
                <div className="coach-item-knicks">
                  <span className="coach-position-knicks">BENCH</span>
                  <span className="coach-value-knicks">
                    {teamData?.coach_bench || "-"}
                  </span>
                </div>
              </div>

              <div className="knicks-coach-column">
                <div className="coach-item-knicks">
                  <span className="coach-position-knicks">G1</span>
                  <span className="coach-value-knicks">
                    {teamData?.coach_g1 || "-"}
                  </span>
                </div>
                <div className="coach-item-knicks">
                  <span className="coach-position-knicks">G2</span>
                  <span className="coach-value-knicks">
                    {teamData?.coach_g2 || "-"}
                  </span>
                </div>
                <div className="coach-item-knicks">
                  <span className="coach-position-knicks">G3</span>
                  <span className="coach-value-knicks">
                    {teamData?.coach_g3 || "-"}
                  </span>
                </div>
                <div className="coach-item-knicks">
                  <span className="coach-position-knicks">NEG</span>
                  <span className="coach-value-knicks">
                    {teamData?.coach_neg || "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Draft Picks Section */}
          <div className="knicks-pc-section">
            <div className="knicks-pc-header">
              <h3 className="knicks-pc-title">DRAFT PICKS</h3>
            </div>
            <div className="knicks-picks-grid">
              <div className="knicks-pick-column">
                <div className="knicks-pick-year">
                  {teamData?.year_pick_one || "2024"}
                </div>
                <div className="pick-item-knicks">
                  <span className="pick-round-knicks">1 ROUND</span>
                  <span className="pick-value-knicks">
                    {teamData?.draft_pick_one_1r || "-"}
                  </span>
                </div>
                <div className="pick-item-knicks">
                  <span className="pick-round-knicks">2 ROUND</span>
                  <span className="pick-value-knicks">
                    {teamData?.draft_pick_one_2r || "-"}
                  </span>
                </div>
              </div>

              <div className="knicks-pick-column">
                <div className="knicks-pick-year">
                  {teamData?.year_pick_two || "2025"}
                </div>
                <div className="pick-item-knicks">
                  <span className="pick-round-knicks">1 ROUND</span>
                  <span className="pick-value-knicks">
                    {teamData?.draft_pick_two_1r || "-"}
                  </span>
                </div>
                <div className="pick-item-knicks">
                  <span className="pick-round-knicks">2 ROUND</span>
                  <span className="pick-value-knicks">
                    {teamData?.draft_pick_two_2r || "-"}
                  </span>
                </div>
              </div>

              <div className="knicks-pick-column">
                <div className="knicks-pick-year">
                  {teamData?.year_pick_three || "2026"}
                </div>
                <div className="pick-item-knicks">
                  <span className="pick-round-knicks">1 ROUND</span>
                  <span className="pick-value-knicks">
                    {teamData?.draft_pick_three_1r || "-"}
                  </span>
                </div>
                <div className="pick-item-knicks">
                  <span className="pick-round-knicks">2 ROUND</span>
                  <span className="pick-value-knicks">
                    {teamData?.draft_pick_three_2r || "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="knicks-pc-colors">
          <div className="color-dot-knicks blue-dark-knicks"></div>
          <div className="color-dot-knicks blue-knicks"></div>
          <div className="color-dot-knicks blue-light-knicks"></div>
          <div className="color-dot-knicks orange-knicks"></div>
          <div className="color-dot-knicks orange-light-knicks"></div>
        </div>
      </div>
    </div>
  );
};

export default InfoHeadHawksPicksAndCoach;
