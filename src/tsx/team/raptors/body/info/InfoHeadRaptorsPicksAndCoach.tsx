import React, { useEffect, useState } from "react";
import { supabase } from "../../../../../Supabase";
import "./raptorsPicksAndCoach.css";

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

const InfoHeadRaptorsPicksAndCoach = () => {
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
          .eq("team_name", "Raptors")
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
      .channel("head-raptors-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Head",
          filter: "team_name=eq.Raptors",
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
    return <div className="loading-text">Loading Raptors Picks & Coach...</div>;
  }

  if (error) {
    return <div className="loading-text error-text">Error: {error}</div>;
  }
  return (
    <div className="raptors-containers">
      <div className="header-content">
        <h1 className="header-title-raptors">RAPTORS FRONT OFFICE</h1>
      </div>

      <div className="raptors-picks-coach-card">
        {/* <div className="raptors-pc-accent-top"></div> */}

        {/* Контейнер для горизонтального расположения */}
        <div className="raptors-pc-sections-container">
          {/* Head Coach Section */}
          <div className="raptors-pc-section">
            <div className="raptors-pc-header">
              <div className="raptors-coach-title-group">
                <h3 className="raptors-pc-title">HEAD COACH</h3>
                <h4 className="raptors-coach-name">
                  {teamData?.head_coach || "Coach Name"}
                </h4>
              </div>
            </div>
            <div className="raptors-coach-grid">
              <div className="raptors-coach-column">
                <div className="coach-item-raptors">
                  <span className="coach-position-raptors">PG</span>
                  <span className="coach-value-raptors">
                    {teamData?.coach_pg || "-"}
                  </span>
                </div>
                <div className="coach-item-raptors">
                  <span className="coach-position-raptors">SG</span>
                  <span className="coach-value-raptors">
                    {teamData?.coach_sg || "-"}
                  </span>
                </div>
                <div className="coach-item-raptors">
                  <span className="coach-position-raptors">SF</span>
                  <span className="coach-value-raptors">
                    {teamData?.coach_sf || "-"}
                  </span>
                </div>
                <div className="coach-item-raptors">
                  <span className="coach-position-raptors">PF</span>
                  <span className="coach-value-raptors">
                    {teamData?.coach_pf || "-"}
                  </span>
                </div>
              </div>

              <div className="raptors-coach-column">
                <div className="coach-item-raptors">
                  <span className="coach-position-raptors">C</span>
                  <span className="coach-value-raptors">
                    {teamData?.coach_c || "-"}
                  </span>
                </div>
                <div className="coach-item-raptors">
                  <span className="coach-position-raptors">STAR</span>
                  <span className="coach-value-raptors">
                    {teamData?.coach_star || "-"}
                  </span>
                </div>
                <div className="coach-item-raptors">
                  <span className="coach-position-raptors">START</span>
                  <span className="coach-value-raptors">
                    {teamData?.coach_start || "-"}
                  </span>
                </div>
                <div className="coach-item-raptors">
                  <span className="coach-position-raptors">BENCH</span>
                  <span className="coach-value-raptors">
                    {teamData?.coach_bench || "-"}
                  </span>
                </div>
              </div>

              <div className="raptors-coach-column">
                <div className="coach-item-raptors">
                  <span className="coach-position-raptors">G1</span>
                  <span className="coach-value-raptors">
                    {teamData?.coach_g1 || "-"}
                  </span>
                </div>
                <div className="coach-item-raptors">
                  <span className="coach-position-raptors">G2</span>
                  <span className="coach-value-raptors">
                    {teamData?.coach_g2 || "-"}
                  </span>
                </div>
                <div className="coach-item-raptors">
                  <span className="coach-position-raptors">G3</span>
                  <span className="coach-value-raptors">
                    {teamData?.coach_g3 || "-"}
                  </span>
                </div>
                <div className="coach-item-raptors">
                  <span className="coach-position-raptors">NEG</span>
                  <span className="coach-value-raptors">
                    {teamData?.coach_neg || "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Draft Picks Section */}
          <div className="raptors-pc-section">
            <div className="raptors-pc-header">
              <h3 className="raptors-pc-title">DRAFT PICKS</h3>
            </div>
            <div className="raptors-picks-grid">
              <div className="raptors-pick-column">
                <div className="raptors-pick-year">
                  {teamData?.year_pick_one || "2024"}
                </div>
                <div className="pick-item-raptors">
                  <span className="pick-round-raptors">1 ROUND</span>
                  <span className="pick-value-raptors">
                    {teamData?.draft_pick_one_1r || "-"}
                  </span>
                </div>
                <div className="pick-item-raptors">
                  <span className="pick-round-raptors">2 ROUND</span>
                  <span className="pick-value-raptors">
                    {teamData?.draft_pick_one_2r || "-"}
                  </span>
                </div>
              </div>

              <div className="raptors-pick-column">
                <div className="raptors-pick-year">
                  {teamData?.year_pick_two || "2025"}
                </div>
                <div className="pick-item-raptors">
                  <span className="pick-round-raptors">1 ROUND</span>
                  <span className="pick-value-raptors">
                    {teamData?.draft_pick_two_1r || "-"}
                  </span>
                </div>
                <div className="pick-item-raptors">
                  <span className="pick-round-raptors">2 ROUND</span>
                  <span className="pick-value-raptors">
                    {teamData?.draft_pick_two_2r || "-"}
                  </span>
                </div>
              </div>

              <div className="raptors-pick-column">
                <div className="raptors-pick-year">
                  {teamData?.year_pick_three || "2026"}
                </div>
                <div className="pick-item-raptors">
                  <span className="pick-round-raptors">1 ROUND</span>
                  <span className="pick-value-raptors">
                    {teamData?.draft_pick_three_1r || "-"}
                  </span>
                </div>
                <div className="pick-item-raptors">
                  <span className="pick-round-raptors">2 ROUND</span>
                  <span className="pick-value-raptors">
                    {teamData?.draft_pick_three_2r || "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="raptors-pc-colors">
          <div className="color-dot-raptors purple-dark-raptors"></div>
          <div className="color-dot-raptors purple-raptors"></div>
          <div className="color-dot-raptors purple-light-raptors"></div>
          <div className="color-dot-raptors gold-raptors"></div>
          <div className="color-dot-raptors gold-light-raptors"></div>
        </div>
      </div>
    </div>
  );
};

export default InfoHeadRaptorsPicksAndCoach;
