import React, { useEffect, useState } from "react";
import { supabase } from "../../../../../Supabase";
import "./celticsPicksAndCoach.css";

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

const InfoHeadCelticsPicksAndCoach = () => {
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
          .eq("team_name", "Celtics")
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
      .channel("head-celtics-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Head",
          filter: "team_name=eq.Celtics",
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
    return <div className="loading-text">Loading Celtics Picks & Coach...</div>;
  }

  if (error) {
    return <div className="loading-text error-text">Error: {error}</div>;
  }
  return (
    <div className="celtics-containers">
      <div className="header-content">
        <h1 className="header-title-celtics">CELTICS FRONT OFFICE</h1>
      </div>

      <div className="celtics-picks-coach-card">
        {/* <div className="celtics-pc-accent-top"></div> */}

        {/* Контейнер для горизонтального расположения */}
        <div className="celtics-pc-sections-container">
          {/* Head Coach Section */}
          <div className="celtics-pc-section">
            <div className="celtics-pc-header">
              <div className="celtics-coach-title-group">
                <h3 className="celtics-pc-title">HEAD COACH</h3>
                <h4 className="celtics-coach-name">
                  {teamData?.head_coach || "Coach Name"}
                </h4>
              </div>
            </div>
            <div className="celtics-coach-grid">
              <div className="celtics-coach-column">
                <div className="coach-item-celtics">
                  <span className="coach-position-celtics">PG</span>
                  <span className="coach-value-celtics">
                    {teamData?.coach_pg || "-"}
                  </span>
                </div>
                <div className="coach-item-celtics">
                  <span className="coach-position-celtics">SG</span>
                  <span className="coach-value-celtics">
                    {teamData?.coach_sg || "-"}
                  </span>
                </div>
                <div className="coach-item-celtics">
                  <span className="coach-position-celtics">SF</span>
                  <span className="coach-value-celtics">
                    {teamData?.coach_sf || "-"}
                  </span>
                </div>
                <div className="coach-item-celtics">
                  <span className="coach-position-celtics">PF</span>
                  <span className="coach-value-celtics">
                    {teamData?.coach_pf || "-"}
                  </span>
                </div>
              </div>

              <div className="celtics-coach-column">
                <div className="coach-item-celtics">
                  <span className="coach-position-celtics">C</span>
                  <span className="coach-value-celtics">
                    {teamData?.coach_c || "-"}
                  </span>
                </div>
                <div className="coach-item-celtics">
                  <span className="coach-position-celtics">STAR</span>
                  <span className="coach-value-celtics">
                    {teamData?.coach_star || "-"}
                  </span>
                </div>
                <div className="coach-item-celtics">
                  <span className="coach-position-celtics">START</span>
                  <span className="coach-value-celtics">
                    {teamData?.coach_start || "-"}
                  </span>
                </div>
                <div className="coach-item-celtics">
                  <span className="coach-position-celtics">BENCH</span>
                  <span className="coach-value-celtics">
                    {teamData?.coach_bench || "-"}
                  </span>
                </div>
              </div>

              <div className="celtics-coach-column">
                <div className="coach-item-celtics">
                  <span className="coach-position-celtics">G1</span>
                  <span className="coach-value-celtics">
                    {teamData?.coach_g1 || "-"}
                  </span>
                </div>
                <div className="coach-item-celtics">
                  <span className="coach-position-celtics">G2</span>
                  <span className="coach-value-celtics">
                    {teamData?.coach_g2 || "-"}
                  </span>
                </div>
                <div className="coach-item-celtics">
                  <span className="coach-position-celtics">G3</span>
                  <span className="coach-value-celtics">
                    {teamData?.coach_g3 || "-"}
                  </span>
                </div>
                <div className="coach-item-celtics">
                  <span className="coach-position-celtics">NEG</span>
                  <span className="coach-value-celtics">
                    {teamData?.coach_neg || "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Draft Picks Section */}
          <div className="celtics-pc-section">
            <div className="celtics-pc-header">
              <h3 className="celtics-pc-title">DRAFT PICKS</h3>
            </div>
            <div className="celtics-picks-grid">
              <div className="celtics-pick-column">
                <div className="celtics-pick-year">
                  {teamData?.year_pick_one || "2024"}
                </div>
                <div className="pick-item-celtics">
                  <span className="pick-round-celtics">1 ROUND</span>
                  <span className="pick-value-celtics">
                    {teamData?.draft_pick_one_1r || "-"}
                  </span>
                </div>
                <div className="pick-item-celtics">
                  <span className="pick-round-celtics">2 ROUND</span>
                  <span className="pick-value-celtics">
                    {teamData?.draft_pick_one_2r || "-"}
                  </span>
                </div>
              </div>

              <div className="celtics-pick-column">
                <div className="celtics-pick-year">
                  {teamData?.year_pick_two || "2025"}
                </div>
                <div className="pick-item-celtics">
                  <span className="pick-round-celtics">1 ROUND</span>
                  <span className="pick-value-celtics">
                    {teamData?.draft_pick_two_1r || "-"}
                  </span>
                </div>
                <div className="pick-item-celtics">
                  <span className="pick-round-celtics">2 ROUND</span>
                  <span className="pick-value-celtics">
                    {teamData?.draft_pick_two_2r || "-"}
                  </span>
                </div>
              </div>

              <div className="celtics-pick-column">
                <div className="celtics-pick-year">
                  {teamData?.year_pick_three || "2026"}
                </div>
                <div className="pick-item-celtics">
                  <span className="pick-round-celtics">1 ROUND</span>
                  <span className="pick-value-celtics">
                    {teamData?.draft_pick_three_1r || "-"}
                  </span>
                </div>
                <div className="pick-item-celtics">
                  <span className="pick-round-celtics">2 ROUND</span>
                  <span className="pick-value-celtics">
                    {teamData?.draft_pick_three_2r || "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="celtics-pc-colors">
          <div className="color-dot-celtics purple-dark-celtics"></div>
          <div className="color-dot-celtics purple-celtics"></div>
          <div className="color-dot-celtics purple-light-celtics"></div>
          <div className="color-dot-celtics gold-celtics"></div>
          <div className="color-dot-celtics gold-light-celtics"></div>
        </div>
      </div>
    </div>
  );
};

export default InfoHeadCelticsPicksAndCoach;
