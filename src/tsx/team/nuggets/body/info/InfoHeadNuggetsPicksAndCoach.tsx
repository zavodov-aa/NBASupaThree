import React, { useEffect, useState } from "react";
import { supabase } from "../../../../../Supabase";
import "./nuggetsPicksAndCoach.css";

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

const InfoHeadNuggetsPicksAndCoach = () => {
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
          .eq("team_name", "Nuggets")
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
      .channel("head-nuggets-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Head",
          filter: "team_name=eq.Nuggets",
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
    return <div className="loading-text">Loading Nuggets Picks & Coach...</div>;
  }

  if (error) {
    return <div className="loading-text error-text">Error: {error}</div>;
  }
  return (
    <div className="nuggets-containers">
      <div className="header-content">
        <h1 className="header-title-nuggets">NUGGETS FRONT OFFICE</h1>
      </div>

      <div className="nuggets-picks-coach-card">
        <div className="nuggets-pc-sections-container">
          {/* Head Coach Section */}
          <div className="nuggets-pc-section">
            <div className="nuggets-pc-header">
              <div className="nuggets-coach-title-group">
                <h3 className="nuggets-pc-title">HEAD COACH</h3>
                <h4 className="nuggets-coach-name">
                  {teamData?.head_coach || "Coach Name"}
                </h4>
              </div>
            </div>
            <div className="nuggets-coach-grid">
              <div className="nuggets-coach-column">
                <div className="coach-item-nuggets">
                  <span className="coach-position-nuggets">PG</span>
                  <span className="coach-value-nuggets">
                    {teamData?.coach_pg || "-"}
                  </span>
                </div>
                <div className="coach-item-nuggets">
                  <span className="coach-position-nuggets">SG</span>
                  <span className="coach-value-nuggets">
                    {teamData?.coach_sg || "-"}
                  </span>
                </div>
                <div className="coach-item-nuggets">
                  <span className="coach-position-nuggets">SF</span>
                  <span className="coach-value-nuggets">
                    {teamData?.coach_sf || "-"}
                  </span>
                </div>
                <div className="coach-item-nuggets">
                  <span className="coach-position-nuggets">PF</span>
                  <span className="coach-value-nuggets">
                    {teamData?.coach_pf || "-"}
                  </span>
                </div>
              </div>

              <div className="nuggets-coach-column">
                <div className="coach-item-nuggets">
                  <span className="coach-position-nuggets">C</span>
                  <span className="coach-value-nuggets">
                    {teamData?.coach_c || "-"}
                  </span>
                </div>
                <div className="coach-item-nuggets">
                  <span className="coach-position-nuggets">STAR</span>
                  <span className="coach-value-nuggets">
                    {teamData?.coach_star || "-"}
                  </span>
                </div>
                <div className="coach-item-nuggets">
                  <span className="coach-position-nuggets">START</span>
                  <span className="coach-value-nuggets">
                    {teamData?.coach_start || "-"}
                  </span>
                </div>
                <div className="coach-item-nuggets">
                  <span className="coach-position-nuggets">BENCH</span>
                  <span className="coach-value-nuggets">
                    {teamData?.coach_bench || "-"}
                  </span>
                </div>
              </div>

              <div className="nuggets-coach-column">
                <div className="coach-item-nuggets">
                  <span className="coach-position-nuggets">G1</span>
                  <span className="coach-value-nuggets">
                    {teamData?.coach_g1 || "-"}
                  </span>
                </div>
                <div className="coach-item-nuggets">
                  <span className="coach-position-nuggets">G2</span>
                  <span className="coach-value-nuggets">
                    {teamData?.coach_g2 || "-"}
                  </span>
                </div>
                <div className="coach-item-nuggets">
                  <span className="coach-position-nuggets">G3</span>
                  <span className="coach-value-nuggets">
                    {teamData?.coach_g3 || "-"}
                  </span>
                </div>
                <div className="coach-item-nuggets">
                  <span className="coach-position-nuggets">NEG</span>
                  <span className="coach-value-nuggets">
                    {teamData?.coach_neg || "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Draft Picks Section */}
          <div className="nuggets-pc-section">
            <div className="nuggets-pc-header">
              <h3 className="nuggets-pc-title">DRAFT PICKS</h3>
            </div>
            <div className="nuggets-picks-grid">
              <div className="nuggets-pick-column">
                <div className="nuggets-pick-year">
                  {teamData?.year_pick_one || "2024"}
                </div>
                <div className="pick-item-nuggets">
                  <span className="pick-round-nuggets">1 ROUND</span>
                  <span className="pick-value-nuggets">
                    {teamData?.draft_pick_one_1r || "-"}
                  </span>
                </div>
                <div className="pick-item-nuggets">
                  <span className="pick-round-nuggets">2 ROUND</span>
                  <span className="pick-value-nuggets">
                    {teamData?.draft_pick_one_2r || "-"}
                  </span>
                </div>
              </div>

              <div className="nuggets-pick-column">
                <div className="nuggets-pick-year">
                  {teamData?.year_pick_two || "2025"}
                </div>
                <div className="pick-item-nuggets">
                  <span className="pick-round-nuggets">1 ROUND</span>
                  <span className="pick-value-nuggets">
                    {teamData?.draft_pick_two_1r || "-"}
                  </span>
                </div>
                <div className="pick-item-nuggets">
                  <span className="pick-round-nuggets">2 ROUND</span>
                  <span className="pick-value-nuggets">
                    {teamData?.draft_pick_two_2r || "-"}
                  </span>
                </div>
              </div>

              <div className="nuggets-pick-column">
                <div className="nuggets-pick-year">
                  {teamData?.year_pick_three || "2026"}
                </div>
                <div className="pick-item-nuggets">
                  <span className="pick-round-nuggets">1 ROUND</span>
                  <span className="pick-value-nuggets">
                    {teamData?.draft_pick_three_1r || "-"}
                  </span>
                </div>
                <div className="pick-item-nuggets">
                  <span className="pick-round-nuggets">2 ROUND</span>
                  <span className="pick-value-nuggets">
                    {teamData?.draft_pick_three_2r || "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="nuggets-pc-colors">
          <div className="color-dot-nuggets navy-dark-nuggets"></div>
          <div className="color-dot-nuggets navy-nuggets"></div>
          <div className="color-dot-nuggets sky-blue-nuggets"></div>
          <div className="color-dot-nuggets gold-nuggets"></div>
          <div className="color-dot-nuggets yellow-nuggets"></div>
        </div>
      </div>
    </div>
  );
};

export default InfoHeadNuggetsPicksAndCoach;
