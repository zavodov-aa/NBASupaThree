import React, { useEffect, useState } from "react";
import { supabase } from "../../../../../Supabase";
import "./cavaliersPicksAndCoach.css";

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

const InfoHeadCavaliersPicksAndCoach = () => {
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
          .eq("team_name", "Cavaliers")
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
      .channel("head-cavaliers-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Head",
          filter: "team_name=eq.Cavaliers",
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
      <div className="loading-text">Loading Cavaliers Picks & Coach...</div>
    );
  }

  if (error) {
    return <div className="loading-text error-text">Error: {error}</div>;
  }
  return (
    <div className="cavaliers-containers">
      <div className="header-content">
        <h1 className="header-title-cavaliers">CAVALIERS FRONT OFFICE</h1>
      </div>

      <div className="cavaliers-picks-coach-card">
        {/* <div className="cavaliers-pc-accent-top"></div> */}

        {/* Контейнер для горизонтального расположения */}
        <div className="cavaliers-pc-sections-container">
          {/* Head Coach Section */}
          <div className="cavaliers-pc-section">
            <div className="cavaliers-pc-header">
              <div className="cavaliers-coach-title-group">
                <h3 className="cavaliers-pc-title">HEAD COACH</h3>
                <h4 className="cavaliers-coach-name">
                  {teamData?.head_coach || "Coach Name"}
                </h4>
              </div>
            </div>
            <div className="cavaliers-coach-grid">
              <div className="cavaliers-coach-column">
                <div className="coach-item-cavaliers">
                  <span className="coach-position-cavaliers">PG</span>
                  <span className="coach-value-cavaliers">
                    {teamData?.coach_pg || "-"}
                  </span>
                </div>
                <div className="coach-item-cavaliers">
                  <span className="coach-position-cavaliers">SG</span>
                  <span className="coach-value-cavaliers">
                    {teamData?.coach_sg || "-"}
                  </span>
                </div>
                <div className="coach-item-cavaliers">
                  <span className="coach-position-cavaliers">SF</span>
                  <span className="coach-value-cavaliers">
                    {teamData?.coach_sf || "-"}
                  </span>
                </div>
                <div className="coach-item-cavaliers">
                  <span className="coach-position-cavaliers">PF</span>
                  <span className="coach-value-cavaliers">
                    {teamData?.coach_pf || "-"}
                  </span>
                </div>
              </div>

              <div className="cavaliers-coach-column">
                <div className="coach-item-cavaliers">
                  <span className="coach-position-cavaliers">C</span>
                  <span className="coach-value-cavaliers">
                    {teamData?.coach_c || "-"}
                  </span>
                </div>
                <div className="coach-item-cavaliers">
                  <span className="coach-position-cavaliers">STAR</span>
                  <span className="coach-value-cavaliers">
                    {teamData?.coach_star || "-"}
                  </span>
                </div>
                <div className="coach-item-cavaliers">
                  <span className="coach-position-cavaliers">START</span>
                  <span className="coach-value-cavaliers">
                    {teamData?.coach_start || "-"}
                  </span>
                </div>
                <div className="coach-item-cavaliers">
                  <span className="coach-position-cavaliers">BENCH</span>
                  <span className="coach-value-cavaliers">
                    {teamData?.coach_bench || "-"}
                  </span>
                </div>
              </div>

              <div className="cavaliers-coach-column">
                <div className="coach-item-cavaliers">
                  <span className="coach-position-cavaliers">G1</span>
                  <span className="coach-value-cavaliers">
                    {teamData?.coach_g1 || "-"}
                  </span>
                </div>
                <div className="coach-item-cavaliers">
                  <span className="coach-position-cavaliers">G2</span>
                  <span className="coach-value-cavaliers">
                    {teamData?.coach_g2 || "-"}
                  </span>
                </div>
                <div className="coach-item-cavaliers">
                  <span className="coach-position-cavaliers">G3</span>
                  <span className="coach-value-cavaliers">
                    {teamData?.coach_g3 || "-"}
                  </span>
                </div>
                <div className="coach-item-cavaliers">
                  <span className="coach-position-cavaliers">NEG</span>
                  <span className="coach-value-cavaliers">
                    {teamData?.coach_neg || "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Draft Picks Section */}
          <div className="cavaliers-pc-section">
            <div className="cavaliers-pc-header">
              <h3 className="cavaliers-pc-title">DRAFT PICKS</h3>
            </div>
            <div className="cavaliers-picks-grid">
              <div className="cavaliers-pick-column">
                <div className="cavaliers-pick-year">
                  {teamData?.year_pick_one || "2024"}
                </div>
                <div className="pick-item-cavaliers">
                  <span className="pick-round-cavaliers">1 ROUND</span>
                  <span className="pick-value-cavaliers">
                    {teamData?.draft_pick_one_1r || "-"}
                  </span>
                </div>
                <div className="pick-item-cavaliers">
                  <span className="pick-round-cavaliers">2 ROUND</span>
                  <span className="pick-value-cavaliers">
                    {teamData?.draft_pick_one_2r || "-"}
                  </span>
                </div>
              </div>

              <div className="cavaliers-pick-column">
                <div className="cavaliers-pick-year">
                  {teamData?.year_pick_two || "2025"}
                </div>
                <div className="pick-item-cavaliers">
                  <span className="pick-round-cavaliers">1 ROUND</span>
                  <span className="pick-value-cavaliers">
                    {teamData?.draft_pick_two_1r || "-"}
                  </span>
                </div>
                <div className="pick-item-cavaliers">
                  <span className="pick-round-cavaliers">2 ROUND</span>
                  <span className="pick-value-cavaliers">
                    {teamData?.draft_pick_two_2r || "-"}
                  </span>
                </div>
              </div>

              <div className="cavaliers-pick-column">
                <div className="cavaliers-pick-year">
                  {teamData?.year_pick_three || "2026"}
                </div>
                <div className="pick-item-cavaliers">
                  <span className="pick-round-cavaliers">1 ROUND</span>
                  <span className="pick-value-cavaliers">
                    {teamData?.draft_pick_three_1r || "-"}
                  </span>
                </div>
                <div className="pick-item-cavaliers">
                  <span className="pick-round-cavaliers">2 ROUND</span>
                  <span className="pick-value-cavaliers">
                    {teamData?.draft_pick_three_2r || "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="cavaliers-pc-colors">
          <div className="color-dot-cavaliers wine-dark-cavaliers"></div>
          <div className="color-dot-cavaliers wine-cavaliers"></div>
          <div className="color-dot-cavaliers gold-cavaliers"></div>
          <div className="color-dot-cavaliers navy-cavaliers"></div>
          <div className="color-dot-cavaliers white-cavaliers"></div>
        </div>
      </div>
    </div>
  );
};

export default InfoHeadCavaliersPicksAndCoach;
