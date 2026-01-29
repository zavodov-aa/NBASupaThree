import React, { useEffect, useState } from "react";
import { supabase } from "../../../../../Supabase";
import "./jazzPicksAndCoach.css";

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

const InfoHeadJazzPicksAndCoach = () => {
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
          .eq("team_name", "Jazz")
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
      .channel("head-jazz-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Head",
          filter: "team_name=eq.Jazz",
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
    return <div className="loading-text">Loading Jazz Picks & Coach...</div>;
  }

  if (error) {
    return <div className="loading-text error-text">Error: {error}</div>;
  }
  return (
    <div className="jazz-containers">
      <div className="header-content">
        <h1 className="header-title-jazz">JAZZ FRONT OFFICE</h1>
      </div>

      <div className="jazz-picks-coach-card">
        {/* <div className="jazz-pc-accent-top"></div> */}

        {/* Контейнер для горизонтального расположения */}
        <div className="jazz-pc-sections-container">
          {/* Head Coach Section */}
          <div className="jazz-pc-section">
            <div className="jazz-pc-header">
              <div className="jazz-coach-title-group">
                <h3 className="jazz-pc-title">HEAD COACH</h3>
                <h4 className="jazz-coach-name">
                  {teamData?.head_coach || "Coach Name"}
                </h4>
              </div>
            </div>
            <div className="jazz-coach-grid">
              <div className="jazz-coach-column">
                <div className="coach-item-jazz">
                  <span className="coach-position-jazz">PG</span>
                  <span className="coach-value-jazz">
                    {teamData?.coach_pg || "-"}
                  </span>
                </div>
                <div className="coach-item-jazz">
                  <span className="coach-position-jazz">SG</span>
                  <span className="coach-value-jazz">
                    {teamData?.coach_sg || "-"}
                  </span>
                </div>
                <div className="coach-item-jazz">
                  <span className="coach-position-jazz">SF</span>
                  <span className="coach-value-jazz">
                    {teamData?.coach_sf || "-"}
                  </span>
                </div>
                <div className="coach-item-jazz">
                  <span className="coach-position-jazz">PF</span>
                  <span className="coach-value-jazz">
                    {teamData?.coach_pf || "-"}
                  </span>
                </div>
              </div>

              <div className="jazz-coach-column">
                <div className="coach-item-jazz">
                  <span className="coach-position-jazz">C</span>
                  <span className="coach-value-jazz">
                    {teamData?.coach_c || "-"}
                  </span>
                </div>
                <div className="coach-item-jazz">
                  <span className="coach-position-jazz">STAR</span>
                  <span className="coach-value-jazz">
                    {teamData?.coach_star || "-"}
                  </span>
                </div>
                <div className="coach-item-jazz">
                  <span className="coach-position-jazz">START</span>
                  <span className="coach-value-jazz">
                    {teamData?.coach_start || "-"}
                  </span>
                </div>
                <div className="coach-item-jazz">
                  <span className="coach-position-jazz">BENCH</span>
                  <span className="coach-value-jazz">
                    {teamData?.coach_bench || "-"}
                  </span>
                </div>
              </div>

              <div className="jazz-coach-column">
                <div className="coach-item-jazz">
                  <span className="coach-position-jazz">G1</span>
                  <span className="coach-value-jazz">
                    {teamData?.coach_g1 || "-"}
                  </span>
                </div>
                <div className="coach-item-jazz">
                  <span className="coach-position-jazz">G2</span>
                  <span className="coach-value-jazz">
                    {teamData?.coach_g2 || "-"}
                  </span>
                </div>
                <div className="coach-item-jazz">
                  <span className="coach-position-jazz">G3</span>
                  <span className="coach-value-jazz">
                    {teamData?.coach_g3 || "-"}
                  </span>
                </div>
                <div className="coach-item-jazz">
                  <span className="coach-position-jazz">NEG</span>
                  <span className="coach-value-jazz">
                    {teamData?.coach_neg || "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Draft Picks Section */}
          <div className="jazz-pc-section">
            <div className="jazz-pc-header">
              <h3 className="jazz-pc-title">DRAFT PICKS</h3>
            </div>
            <div className="jazz-picks-grid">
              <div className="jazz-pick-column">
                <div className="jazz-pick-year">
                  {teamData?.year_pick_one || "2024"}
                </div>
                <div className="pick-item-jazz">
                  <span className="pick-round-jazz">1 ROUND</span>
                  <span className="pick-value-jazz">
                    {teamData?.draft_pick_one_1r || "-"}
                  </span>
                </div>
                <div className="pick-item-jazz">
                  <span className="pick-round-jazz">2 ROUND</span>
                  <span className="pick-value-jazz">
                    {teamData?.draft_pick_one_2r || "-"}
                  </span>
                </div>
              </div>

              <div className="jazz-pick-column">
                <div className="jazz-pick-year">
                  {teamData?.year_pick_two || "2025"}
                </div>
                <div className="pick-item-jazz">
                  <span className="pick-round-jazz">1 ROUND</span>
                  <span className="pick-value-jazz">
                    {teamData?.draft_pick_two_1r || "-"}
                  </span>
                </div>
                <div className="pick-item-jazz">
                  <span className="pick-round-jazz">2 ROUND</span>
                  <span className="pick-value-jazz">
                    {teamData?.draft_pick_two_2r || "-"}
                  </span>
                </div>
              </div>

              <div className="jazz-pick-column">
                <div className="jazz-pick-year">
                  {teamData?.year_pick_three || "2026"}
                </div>
                <div className="pick-item-jazz">
                  <span className="pick-round-jazz">1 ROUND</span>
                  <span className="pick-value-jazz">
                    {teamData?.draft_pick_three_1r || "-"}
                  </span>
                </div>
                <div className="pick-item-jazz">
                  <span className="pick-round-jazz">2 ROUND</span>
                  <span className="pick-value-jazz">
                    {teamData?.draft_pick_three_2r || "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="jazz-pc-colors">
          <div className="color-dot-jazz navy-jazz"></div>
          <div className="color-dot-jazz blue-jazz"></div>
          <div className="color-dot-jazz yellow-jazz"></div>
          <div className="color-dot-jazz green-jazz"></div>
          <div className="color-dot-jazz gray-jazz"></div>
        </div>
      </div>
    </div>
  );
};

export default InfoHeadJazzPicksAndCoach;
