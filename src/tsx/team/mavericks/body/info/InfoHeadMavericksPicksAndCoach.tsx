import React, { useEffect, useState } from "react";
import { supabase } from "../../../../../Supabase";
import "./mavericksPicksAndCoach.css";

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

const InfoHeadMavericksPicksAndCoach = () => {
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
          .eq("team_name", "Mavericks")
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
      .channel("head-mavericks-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Head",
          filter: "team_name=eq.Mavericks",
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
      <div className="loading-text">Loading Mavericks Picks & Coach...</div>
    );
  }

  if (error) {
    return <div className="loading-text error-text">Error: {error}</div>;
  }
  return (
    <div className="mavericks-containers">
      <div className="header-content">
        <h1 className="header-title-mavericks">MAVERICKS FRONT OFFICE</h1>
      </div>

      <div className="mavericks-picks-coach-card">
        {/* <div className="mavericks-pc-accent-top"></div> */}

        {/* Контейнер для горизонтального расположения */}
        <div className="mavericks-pc-sections-container">
          {/* Head Coach Section */}
          <div className="mavericks-pc-section">
            <div className="mavericks-pc-header">
              <div className="mavericks-coach-title-group">
                <h3 className="mavericks-pc-title">HEAD COACH</h3>
                <h4 className="mavericks-coach-name">
                  {teamData?.head_coach || "Coach Name"}
                </h4>
              </div>
            </div>
            <div className="mavericks-coach-grid">
              <div className="mavericks-coach-column">
                <div className="coach-item-mavericks">
                  <span className="coach-position-mavericks">PG</span>
                  <span className="coach-value-mavericks">
                    {teamData?.coach_pg || "-"}
                  </span>
                </div>
                <div className="coach-item-mavericks">
                  <span className="coach-position-mavericks">SG</span>
                  <span className="coach-value-mavericks">
                    {teamData?.coach_sg || "-"}
                  </span>
                </div>
                <div className="coach-item-mavericks">
                  <span className="coach-position-mavericks">SF</span>
                  <span className="coach-value-mavericks">
                    {teamData?.coach_sf || "-"}
                  </span>
                </div>
                <div className="coach-item-mavericks">
                  <span className="coach-position-mavericks">PF</span>
                  <span className="coach-value-mavericks">
                    {teamData?.coach_pf || "-"}
                  </span>
                </div>
              </div>

              <div className="mavericks-coach-column">
                <div className="coach-item-mavericks">
                  <span className="coach-position-mavericks">C</span>
                  <span className="coach-value-mavericks">
                    {teamData?.coach_c || "-"}
                  </span>
                </div>
                <div className="coach-item-mavericks">
                  <span className="coach-position-mavericks">STAR</span>
                  <span className="coach-value-mavericks">
                    {teamData?.coach_star || "-"}
                  </span>
                </div>
                <div className="coach-item-mavericks">
                  <span className="coach-position-mavericks">START</span>
                  <span className="coach-value-mavericks">
                    {teamData?.coach_start || "-"}
                  </span>
                </div>
                <div className="coach-item-mavericks">
                  <span className="coach-position-mavericks">BENCH</span>
                  <span className="coach-value-mavericks">
                    {teamData?.coach_bench || "-"}
                  </span>
                </div>
              </div>

              <div className="mavericks-coach-column">
                <div className="coach-item-mavericks">
                  <span className="coach-position-mavericks">G1</span>
                  <span className="coach-value-mavericks">
                    {teamData?.coach_g1 || "-"}
                  </span>
                </div>
                <div className="coach-item-mavericks">
                  <span className="coach-position-mavericks">G2</span>
                  <span className="coach-value-mavericks">
                    {teamData?.coach_g2 || "-"}
                  </span>
                </div>
                <div className="coach-item-mavericks">
                  <span className="coach-position-mavericks">G3</span>
                  <span className="coach-value-mavericks">
                    {teamData?.coach_g3 || "-"}
                  </span>
                </div>
                <div className="coach-item-mavericks">
                  <span className="coach-position-mavericks">NEG</span>
                  <span className="coach-value-mavericks">
                    {teamData?.coach_neg || "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Draft Picks Section */}
          <div className="mavericks-pc-section">
            <div className="mavericks-pc-header">
              <h3 className="mavericks-pc-title">DRAFT PICKS</h3>
            </div>
            <div className="mavericks-picks-grid">
              <div className="mavericks-pick-column">
                <div className="mavericks-pick-year">
                  {teamData?.year_pick_one || "2024"}
                </div>
                <div className="pick-item-mavericks">
                  <span className="pick-round-mavericks">1 ROUND</span>
                  <span className="pick-value-mavericks">
                    {teamData?.draft_pick_one_1r || "-"}
                  </span>
                </div>
                <div className="pick-item-mavericks">
                  <span className="pick-round-mavericks">2 ROUND</span>
                  <span className="pick-value-mavericks">
                    {teamData?.draft_pick_one_2r || "-"}
                  </span>
                </div>
              </div>

              <div className="mavericks-pick-column">
                <div className="mavericks-pick-year">
                  {teamData?.year_pick_two || "2025"}
                </div>
                <div className="pick-item-mavericks">
                  <span className="pick-round-mavericks">1 ROUND</span>
                  <span className="pick-value-mavericks">
                    {teamData?.draft_pick_two_1r || "-"}
                  </span>
                </div>
                <div className="pick-item-mavericks">
                  <span className="pick-round-mavericks">2 ROUND</span>
                  <span className="pick-value-mavericks">
                    {teamData?.draft_pick_two_2r || "-"}
                  </span>
                </div>
              </div>

              <div className="mavericks-pick-column">
                <div className="mavericks-pick-year">
                  {teamData?.year_pick_three || "2026"}
                </div>
                <div className="pick-item-mavericks">
                  <span className="pick-round-mavericks">1 ROUND</span>
                  <span className="pick-value-mavericks">
                    {teamData?.draft_pick_three_1r || "-"}
                  </span>
                </div>
                <div className="pick-item-mavericks">
                  <span className="pick-round-mavericks">2 ROUND</span>
                  <span className="pick-value-mavericks">
                    {teamData?.draft_pick_three_2r || "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mavericks-pc-colors">
          <div className="color-dot-mavericks blue-dark-mavericks"></div>
          <div className="color-dot-mavericks blue-mavericks"></div>
          <div className="color-dot-mavericks silver-mavericks"></div>
          <div className="color-dot-mavericks navy-mavericks"></div>
          <div className="color-dot-mavericks silver-light-mavericks"></div>
        </div>
      </div>
    </div>
  );
};

export default InfoHeadMavericksPicksAndCoach;
