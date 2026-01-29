import React, { useEffect, useState } from "react";
import { supabase } from "../../../../../Supabase";
import "./bucksPicksAndCoach.css";

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

const InfoHeadBucksPicksAndCoach = () => {
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
          .eq("team_name", "Bucks")
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
      .channel("head-bucks-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Head",
          filter: "team_name=eq.Bucks",
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
    return <div className="loading-text">Loading Bucks Picks & Coach...</div>;
  }

  if (error) {
    return <div className="loading-text error-text">Error: {error}</div>;
  }
  return (
    <div className="bucks-containers">
      <div className="header-content">
        <h1 className="header-title-bucks">BUCKS FRONT OFFICE</h1>
      </div>

      <div className="bucks-picks-coach-card">
        <div className="bucks-pc-sections-container">
          <div className="bucks-pc-section">
            <div className="bucks-pc-header">
              <div className="bucks-coach-title-group">
                <h3 className="bucks-pc-title">HEAD COACH</h3>
                <h4 className="bucks-coach-name">
                  {teamData?.head_coach || "Coach Name"}
                </h4>
              </div>
            </div>
            <div className="bucks-coach-grid">
              <div className="bucks-coach-column">
                <div className="coach-item-bucks">
                  <span className="coach-position-bucks">PG</span>
                  <span className="coach-value-bucks">
                    {teamData?.coach_pg || "-"}
                  </span>
                </div>
                <div className="coach-item-bucks">
                  <span className="coach-position-bucks">SG</span>
                  <span className="coach-value-bucks">
                    {teamData?.coach_sg || "-"}
                  </span>
                </div>
                <div className="coach-item-bucks">
                  <span className="coach-position-bucks">SF</span>
                  <span className="coach-value-bucks">
                    {teamData?.coach_sf || "-"}
                  </span>
                </div>
                <div className="coach-item-bucks">
                  <span className="coach-position-bucks">PF</span>
                  <span className="coach-value-bucks">
                    {teamData?.coach_pf || "-"}
                  </span>
                </div>
              </div>

              <div className="bucks-coach-column">
                <div className="coach-item-bucks">
                  <span className="coach-position-bucks">C</span>
                  <span className="coach-value-bucks">
                    {teamData?.coach_c || "-"}
                  </span>
                </div>
                <div className="coach-item-bucks">
                  <span className="coach-position-bucks">STAR</span>
                  <span className="coach-value-bucks">
                    {teamData?.coach_star || "-"}
                  </span>
                </div>
                <div className="coach-item-bucks">
                  <span className="coach-position-bucks">START</span>
                  <span className="coach-value-bucks">
                    {teamData?.coach_start || "-"}
                  </span>
                </div>
                <div className="coach-item-bucks">
                  <span className="coach-position-bucks">BENCH</span>
                  <span className="coach-value-bucks">
                    {teamData?.coach_bench || "-"}
                  </span>
                </div>
              </div>

              <div className="bucks-coach-column">
                <div className="coach-item-bucks">
                  <span className="coach-position-bucks">G1</span>
                  <span className="coach-value-bucks">
                    {teamData?.coach_g1 || "-"}
                  </span>
                </div>
                <div className="coach-item-bucks">
                  <span className="coach-position-bucks">G2</span>
                  <span className="coach-value-bucks">
                    {teamData?.coach_g2 || "-"}
                  </span>
                </div>
                <div className="coach-item-bucks">
                  <span className="coach-position-bucks">G3</span>
                  <span className="coach-value-bucks">
                    {teamData?.coach_g3 || "-"}
                  </span>
                </div>
                <div className="coach-item-bucks">
                  <span className="coach-position-bucks">NEG</span>
                  <span className="coach-value-bucks">
                    {teamData?.coach_neg || "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bucks-pc-section">
            <div className="bucks-pc-header">
              <h3 className="bucks-pc-title">DRAFT PICKS</h3>
            </div>
            <div className="bucks-picks-grid">
              <div className="bucks-pick-column">
                <div className="bucks-pick-year">
                  {teamData?.year_pick_one || "2024"}
                </div>
                <div className="pick-item-bucks">
                  <span className="pick-round-bucks">1 ROUND</span>
                  <span className="pick-value-bucks">
                    {teamData?.draft_pick_one_1r || "-"}
                  </span>
                </div>
                <div className="pick-item-bucks">
                  <span className="pick-round-bucks">2 ROUND</span>
                  <span className="pick-value-bucks">
                    {teamData?.draft_pick_one_2r || "-"}
                  </span>
                </div>
              </div>

              <div className="bucks-pick-column">
                <div className="bucks-pick-year">
                  {teamData?.year_pick_two || "2025"}
                </div>
                <div className="pick-item-bucks">
                  <span className="pick-round-bucks">1 ROUND</span>
                  <span className="pick-value-bucks">
                    {teamData?.draft_pick_two_1r || "-"}
                  </span>
                </div>
                <div className="pick-item-bucks">
                  <span className="pick-round-bucks">2 ROUND</span>
                  <span className="pick-value-bucks">
                    {teamData?.draft_pick_two_2r || "-"}
                  </span>
                </div>
              </div>

              <div className="bucks-pick-column">
                <div className="bucks-pick-year">
                  {teamData?.year_pick_three || "2026"}
                </div>
                <div className="pick-item-bucks">
                  <span className="pick-round-bucks">1 ROUND</span>
                  <span className="pick-value-bucks">
                    {teamData?.draft_pick_three_1r || "-"}
                  </span>
                </div>
                <div className="pick-item-bucks">
                  <span className="pick-round-bucks">2 ROUND</span>
                  <span className="pick-value-bucks">
                    {teamData?.draft_pick_three_2r || "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bucks-pc-colors">
          <div className="color-dot-bucks green-dark-bucks"></div>
          <div className="color-dot-bucks green-bucks"></div>
          <div className="color-dot-bucks cream-bucks"></div>
          <div className="color-dot-bucks blue-bucks"></div>
          <div className="color-dot-bucks blue-light-bucks"></div>
        </div>
      </div>
    </div>
  );
};

export default InfoHeadBucksPicksAndCoach;
