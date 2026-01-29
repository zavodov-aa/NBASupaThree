import React, { useEffect, useState } from "react";
import { supabase } from "../../../../../Supabase";
import "./kingsPicksAndCoach.css";

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

const InfoHeadKingsPicksAndCoach = () => {
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
          .eq("team_name", "Kings")
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
      .channel("head-kings-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Head",
          filter: "team_name=eq.Kings",
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
    return <div className="loading-text">Loading Kings Picks & Coach...</div>;
  }

  if (error) {
    return <div className="loading-text error-text">Error: {error}</div>;
  }
  return (
    <div className="kings-containers">
      <div className="header-content">
        <h1 className="header-title-kings">KINGS FRONT OFFICE</h1>
      </div>

      <div className="kings-picks-coach-card">
        {/* <div className="kings-pc-accent-top"></div> */}

        {/* Контейнер для горизонтального расположения */}
        <div className="kings-pc-sections-container">
          {/* Head Coach Section */}
          <div className="kings-pc-section">
            <div className="kings-pc-header">
              <div className="kings-coach-title-group">
                <h3 className="kings-pc-title">HEAD COACH</h3>
                <h4 className="kings-coach-name">
                  {teamData?.head_coach || "Coach Name"}
                </h4>
              </div>
            </div>
            <div className="kings-coach-grid">
              <div className="kings-coach-column">
                <div className="coach-item-kings">
                  <span className="coach-position-kings">PG</span>
                  <span className="coach-value-kings">
                    {teamData?.coach_pg || "-"}
                  </span>
                </div>
                <div className="coach-item-kings">
                  <span className="coach-position-kings">SG</span>
                  <span className="coach-value-kings">
                    {teamData?.coach_sg || "-"}
                  </span>
                </div>
                <div className="coach-item-kings">
                  <span className="coach-position-kings">SF</span>
                  <span className="coach-value-kings">
                    {teamData?.coach_sf || "-"}
                  </span>
                </div>
                <div className="coach-item-kings">
                  <span className="coach-position-kings">PF</span>
                  <span className="coach-value-kings">
                    {teamData?.coach_pf || "-"}
                  </span>
                </div>
              </div>

              <div className="kings-coach-column">
                <div className="coach-item-kings">
                  <span className="coach-position-kings">C</span>
                  <span className="coach-value-kings">
                    {teamData?.coach_c || "-"}
                  </span>
                </div>
                <div className="coach-item-kings">
                  <span className="coach-position-kings">STAR</span>
                  <span className="coach-value-kings">
                    {teamData?.coach_star || "-"}
                  </span>
                </div>
                <div className="coach-item-kings">
                  <span className="coach-position-kings">START</span>
                  <span className="coach-value-kings">
                    {teamData?.coach_start || "-"}
                  </span>
                </div>
                <div className="coach-item-kings">
                  <span className="coach-position-kings">BENCH</span>
                  <span className="coach-value-kings">
                    {teamData?.coach_bench || "-"}
                  </span>
                </div>
              </div>

              <div className="kings-coach-column">
                <div className="coach-item-kings">
                  <span className="coach-position-kings">G1</span>
                  <span className="coach-value-kings">
                    {teamData?.coach_g1 || "-"}
                  </span>
                </div>
                <div className="coach-item-kings">
                  <span className="coach-position-kings">G2</span>
                  <span className="coach-value-kings">
                    {teamData?.coach_g2 || "-"}
                  </span>
                </div>
                <div className="coach-item-kings">
                  <span className="coach-position-kings">G3</span>
                  <span className="coach-value-kings">
                    {teamData?.coach_g3 || "-"}
                  </span>
                </div>
                <div className="coach-item-kings">
                  <span className="coach-position-kings">NEG</span>
                  <span className="coach-value-kings">
                    {teamData?.coach_neg || "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Draft Picks Section */}
          <div className="kings-pc-section">
            <div className="kings-pc-header">
              <h3 className="kings-pc-title">DRAFT PICKS</h3>
            </div>
            <div className="kings-picks-grid">
              <div className="kings-pick-column">
                <div className="kings-pick-year">
                  {teamData?.year_pick_one || "2024"}
                </div>
                <div className="pick-item-kings">
                  <span className="pick-round-kings">1 ROUND</span>
                  <span className="pick-value-kings">
                    {teamData?.draft_pick_one_1r || "-"}
                  </span>
                </div>
                <div className="pick-item-kings">
                  <span className="pick-round-kings">2 ROUND</span>
                  <span className="pick-value-kings">
                    {teamData?.draft_pick_one_2r || "-"}
                  </span>
                </div>
              </div>

              <div className="kings-pick-column">
                <div className="kings-pick-year">
                  {teamData?.year_pick_two || "2025"}
                </div>
                <div className="pick-item-kings">
                  <span className="pick-round-kings">1 ROUND</span>
                  <span className="pick-value-kings">
                    {teamData?.draft_pick_two_1r || "-"}
                  </span>
                </div>
                <div className="pick-item-kings">
                  <span className="pick-round-kings">2 ROUND</span>
                  <span className="pick-value-kings">
                    {teamData?.draft_pick_two_2r || "-"}
                  </span>
                </div>
              </div>

              <div className="kings-pick-column">
                <div className="kings-pick-year">
                  {teamData?.year_pick_three || "2026"}
                </div>
                <div className="pick-item-kings">
                  <span className="pick-round-kings">1 ROUND</span>
                  <span className="pick-value-kings">
                    {teamData?.draft_pick_three_1r || "-"}
                  </span>
                </div>
                <div className="pick-item-kings">
                  <span className="pick-round-kings">2 ROUND</span>
                  <span className="pick-value-kings">
                    {teamData?.draft_pick_three_2r || "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="kings-pc-colors">
          <div className="color-dot-kings purple-dark-kings"></div>
          <div className="color-dot-kings purple-kings"></div>
          <div className="color-dot-kings silver-kings"></div>
          <div className="color-dot-kings black-kings"></div>
          <div className="color-dot-kings gray-light-kings"></div>
        </div>
      </div>
    </div>
  );
};

export default InfoHeadKingsPicksAndCoach;
