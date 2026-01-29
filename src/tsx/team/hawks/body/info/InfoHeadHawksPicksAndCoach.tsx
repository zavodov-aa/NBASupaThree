import React, { useEffect, useState } from "react";
import { supabase } from "../../../../../Supabase";
import "./hawksPicksAndCoach.css";

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
    return <div className="loading-text">Loading Hawks Picks & Coach...</div>;
  }

  if (error) {
    return <div className="loading-text error-text">Error: {error}</div>;
  }
  return (
    <div className="hawks-containers">
      <div className="header-content">
        <h1 className="header-title-hawks">HAWKS FRONT OFFICE</h1>
      </div>

      <div className="hawks-picks-coach-card">
        {/* <div className="hawks-pc-accent-top"></div> */}

        {/* Контейнер для горизонтального расположения */}
        <div className="hawks-pc-sections-container">
          {/* Head Coach Section */}
          <div className="hawks-pc-section">
            <div className="hawks-pc-header">
              <div className="hawks-coach-title-group">
                <h3 className="hawks-pc-title">HEAD COACH</h3>
                <h4 className="hawks-coach-name">
                  {teamData?.head_coach || "Coach Name"}
                </h4>
              </div>
            </div>
            <div className="hawks-coach-grid">
              <div className="hawks-coach-column">
                <div className="coach-item-hawks">
                  <span className="coach-position-hawks">PG</span>
                  <span className="coach-value-hawks">
                    {teamData?.coach_pg || "-"}
                  </span>
                </div>
                <div className="coach-item-hawks">
                  <span className="coach-position-hawks">SG</span>
                  <span className="coach-value-hawks">
                    {teamData?.coach_sg || "-"}
                  </span>
                </div>
                <div className="coach-item-hawks">
                  <span className="coach-position-hawks">SF</span>
                  <span className="coach-value-hawks">
                    {teamData?.coach_sf || "-"}
                  </span>
                </div>
                <div className="coach-item-hawks">
                  <span className="coach-position-hawks">PF</span>
                  <span className="coach-value-hawks">
                    {teamData?.coach_pf || "-"}
                  </span>
                </div>
              </div>

              <div className="hawks-coach-column">
                <div className="coach-item-hawks">
                  <span className="coach-position-hawks">C</span>
                  <span className="coach-value-hawks">
                    {teamData?.coach_c || "-"}
                  </span>
                </div>
                <div className="coach-item-hawks">
                  <span className="coach-position-hawks">STAR</span>
                  <span className="coach-value-hawks">
                    {teamData?.coach_star || "-"}
                  </span>
                </div>
                <div className="coach-item-hawks">
                  <span className="coach-position-hawks">START</span>
                  <span className="coach-value-hawks">
                    {teamData?.coach_start || "-"}
                  </span>
                </div>
                <div className="coach-item-hawks">
                  <span className="coach-position-hawks">BENCH</span>
                  <span className="coach-value-hawks">
                    {teamData?.coach_bench || "-"}
                  </span>
                </div>
              </div>

              <div className="hawks-coach-column">
                <div className="coach-item-hawks">
                  <span className="coach-position-hawks">G1</span>
                  <span className="coach-value-hawks">
                    {teamData?.coach_g1 || "-"}
                  </span>
                </div>
                <div className="coach-item-hawks">
                  <span className="coach-position-hawks">G2</span>
                  <span className="coach-value-hawks">
                    {teamData?.coach_g2 || "-"}
                  </span>
                </div>
                <div className="coach-item-hawks">
                  <span className="coach-position-hawks">G3</span>
                  <span className="coach-value-hawks">
                    {teamData?.coach_g3 || "-"}
                  </span>
                </div>
                <div className="coach-item-hawks">
                  <span className="coach-position-hawks">NEG</span>
                  <span className="coach-value-hawks">
                    {teamData?.coach_neg || "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Draft Picks Section */}
          <div className="hawks-pc-section">
            <div className="hawks-pc-header">
              <h3 className="hawks-pc-title">DRAFT PICKS</h3>
            </div>
            <div className="hawks-picks-grid">
              <div className="hawks-pick-column">
                <div className="hawks-pick-year">
                  {teamData?.year_pick_one || "2024"}
                </div>
                <div className="pick-item-hawks">
                  <span className="pick-round-hawks">1 ROUND</span>
                  <span className="pick-value-hawks">
                    {teamData?.draft_pick_one_1r || "-"}
                  </span>
                </div>
                <div className="pick-item-hawks">
                  <span className="pick-round-hawks">2 ROUND</span>
                  <span className="pick-value-hawks">
                    {teamData?.draft_pick_one_2r || "-"}
                  </span>
                </div>
              </div>

              <div className="hawks-pick-column">
                <div className="hawks-pick-year">
                  {teamData?.year_pick_two || "2025"}
                </div>
                <div className="pick-item-hawks">
                  <span className="pick-round-hawks">1 ROUND</span>
                  <span className="pick-value-hawks">
                    {teamData?.draft_pick_two_1r || "-"}
                  </span>
                </div>
                <div className="pick-item-hawks">
                  <span className="pick-round-hawks">2 ROUND</span>
                  <span className="pick-value-hawks">
                    {teamData?.draft_pick_two_2r || "-"}
                  </span>
                </div>
              </div>

              <div className="hawks-pick-column">
                <div className="hawks-pick-year">
                  {teamData?.year_pick_three || "2026"}
                </div>
                <div className="pick-item-hawks">
                  <span className="pick-round-hawks">1 ROUND</span>
                  <span className="pick-value-hawks">
                    {teamData?.draft_pick_three_1r || "-"}
                  </span>
                </div>
                <div className="pick-item-hawks">
                  <span className="pick-round-hawks">2 ROUND</span>
                  <span className="pick-value-hawks">
                    {teamData?.draft_pick_three_2r || "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="hawks-pc-colors">
          <div className="color-dot-hawks purple-dark-hawks"></div>
          <div className="color-dot-hawks purple-hawks"></div>
          <div className="color-dot-hawks purple-light-hawks"></div>
          <div className="color-dot-hawks gold-hawks"></div>
          <div className="color-dot-hawks gold-light-hawks"></div>
        </div>
      </div>
    </div>
  );
};

export default InfoHeadHawksPicksAndCoach;
