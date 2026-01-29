import React, { useEffect, useState } from "react";
import { supabase } from "../../../../../Supabase";
import "./lakersPicksAndCoach.css";

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

const InfoHeadLakersPicksAndCoach = () => {
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
          .eq("team_name", "Lakers")
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
      .channel("head-lakers-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Head",
          filter: "team_name=eq.Lakers",
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
    return <div className="loading-text">Loading Lakers Picks & Coach...</div>;
  }

  if (error) {
    return <div className="loading-text error-text">Error: {error}</div>;
  }
  return (
    <div className="lakers-containers">
      <div className="header-content">
        <h1 className="header-title">LAKERS FRONT OFFICE</h1>
      </div>

      <div className="lakers-picks-coach-card">
        {/* <div className="lakers-pc-accent-top"></div> */}

        {/* Контейнер для горизонтального расположения */}
        <div className="lakers-pc-sections-container">
          {/* Head Coach Section */}
          <div className="lakers-pc-section">
            <div className="lakers-pc-header">
              <div className="lakers-coach-title-group">
                <h3 className="lakers-pc-title">HEAD COACH</h3>
                <h4 className="lakers-coach-name">
                  {teamData?.head_coach || "Coach Name"}
                </h4>
              </div>
            </div>
            <div className="lakers-coach-grid">
              <div className="lakers-coach-column">
                <div className="coach-item">
                  <span className="coach-position">PG</span>
                  <span className="coach-value">
                    {teamData?.coach_pg || "-"}
                  </span>
                </div>
                <div className="coach-item">
                  <span className="coach-position">SG</span>
                  <span className="coach-value">
                    {teamData?.coach_sg || "-"}
                  </span>
                </div>
                <div className="coach-item">
                  <span className="coach-position">SF</span>
                  <span className="coach-value">
                    {teamData?.coach_sf || "-"}
                  </span>
                </div>
                <div className="coach-item">
                  <span className="coach-position">PF</span>
                  <span className="coach-value">
                    {teamData?.coach_pf || "-"}
                  </span>
                </div>
              </div>

              <div className="lakers-coach-column">
                <div className="coach-item">
                  <span className="coach-position">C</span>
                  <span className="coach-value">
                    {teamData?.coach_c || "-"}
                  </span>
                </div>
                <div className="coach-item">
                  <span className="coach-position">STAR</span>
                  <span className="coach-value">
                    {teamData?.coach_star || "-"}
                  </span>
                </div>
                <div className="coach-item">
                  <span className="coach-position">START</span>
                  <span className="coach-value">
                    {teamData?.coach_start || "-"}
                  </span>
                </div>
                <div className="coach-item">
                  <span className="coach-position">BENCH</span>
                  <span className="coach-value">
                    {teamData?.coach_bench || "-"}
                  </span>
                </div>
              </div>

              <div className="lakers-coach-column">
                <div className="coach-item">
                  <span className="coach-position">G1</span>
                  <span className="coach-value">
                    {teamData?.coach_g1 || "-"}
                  </span>
                </div>
                <div className="coach-item">
                  <span className="coach-position">G2</span>
                  <span className="coach-value">
                    {teamData?.coach_g2 || "-"}
                  </span>
                </div>
                <div className="coach-item">
                  <span className="coach-position">G3</span>
                  <span className="coach-value">
                    {teamData?.coach_g3 || "-"}
                  </span>
                </div>
                <div className="coach-item">
                  <span className="coach-position">NEG</span>
                  <span className="coach-value">
                    {teamData?.coach_neg || "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Draft Picks Section */}
          <div className="lakers-pc-section">
            <div className="lakers-pc-header">
              <h3 className="lakers-pc-title">DRAFT PICKS</h3>
            </div>
            <div className="lakers-picks-grid">
              <div className="lakers-pick-column">
                <div className="lakers-pick-year">
                  {teamData?.year_pick_one || "2024"}
                </div>
                <div className="pick-item">
                  <span className="pick-round">1 ROUND</span>
                  <span className="pick-value">
                    {teamData?.draft_pick_one_1r || "-"}
                  </span>
                </div>
                <div className="pick-item">
                  <span className="pick-round">2 ROUND</span>
                  <span className="pick-value">
                    {teamData?.draft_pick_one_2r || "-"}
                  </span>
                </div>
              </div>

              <div className="lakers-pick-column">
                <div className="lakers-pick-year">
                  {teamData?.year_pick_two || "2025"}
                </div>
                <div className="pick-item">
                  <span className="pick-round">1 ROUND</span>
                  <span className="pick-value">
                    {teamData?.draft_pick_two_1r || "-"}
                  </span>
                </div>
                <div className="pick-item">
                  <span className="pick-round">2 ROUND</span>
                  <span className="pick-value">
                    {teamData?.draft_pick_two_2r || "-"}
                  </span>
                </div>
              </div>

              <div className="lakers-pick-column">
                <div className="lakers-pick-year">
                  {teamData?.year_pick_three || "2026"}
                </div>
                <div className="pick-item">
                  <span className="pick-round">1 ROUND</span>
                  <span className="pick-value">
                    {teamData?.draft_pick_three_1r || "-"}
                  </span>
                </div>
                <div className="pick-item">
                  <span className="pick-round">2 ROUND</span>
                  <span className="pick-value">
                    {teamData?.draft_pick_three_2r || "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lakers-pc-colors">
          <div className="color-dot purple-dark"></div>
          <div className="color-dot purple"></div>
          <div className="color-dot purple-light"></div>
          <div className="color-dot gold"></div>
          <div className="color-dot gold-light"></div>
        </div>
      </div>
    </div>
  );
};

export default InfoHeadLakersPicksAndCoach;
