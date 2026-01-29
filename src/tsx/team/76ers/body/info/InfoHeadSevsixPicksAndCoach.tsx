import React, { useEffect, useState } from "react";
import { supabase } from "../../../../../Supabase";
import "./sevsixPicksAndCoach.css";

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

const InfoHeadSevsixPicksAndCoach = () => {
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
          .eq("team_name", "76ers")
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
      .channel("head-sevsix-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Head",
          filter: "team_name=eq.76ers",
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
    return <div className="loading-text">Loading 76ers Picks & Coach...</div>;
  }

  if (error) {
    return <div className="loading-text error-text">Error: {error}</div>;
  }
  return (
    <div className="sevsix-containers">
      <div className="header-content">
        <h1 className="header-title-sevsix">76ERS FRONT OFFICE</h1>
      </div>

      <div className="sevsix-picks-coach-card">
        {/* <div className="sevsix-pc-accent-top"></div> */}

        {/* Контейнер для горизонтального расположения */}
        <div className="sevsix-pc-sections-container">
          {/* Head Coach Section */}
          <div className="sevsix-pc-section">
            <div className="sevsix-pc-header">
              <div className="sevsix-coach-title-group">
                <h3 className="sevsix-pc-title">HEAD COACH</h3>
                <h4 className="sevsix-coach-name">
                  {teamData?.head_coach || "Coach Name"}
                </h4>
              </div>
            </div>
            <div className="sevsix-coach-grid">
              <div className="sevsix-coach-column">
                <div className="coach-item-sevsix">
                  <span className="coach-position-sevsix">PG</span>
                  <span className="coach-value-sevsix">
                    {teamData?.coach_pg || "-"}
                  </span>
                </div>
                <div className="coach-item-sevsix">
                  <span className="coach-position-sevsix">SG</span>
                  <span className="coach-value-sevsix">
                    {teamData?.coach_sg || "-"}
                  </span>
                </div>
                <div className="coach-item-sevsix">
                  <span className="coach-position-sevsix">SF</span>
                  <span className="coach-value-sevsix">
                    {teamData?.coach_sf || "-"}
                  </span>
                </div>
                <div className="coach-item-sevsix">
                  <span className="coach-position-sevsix">PF</span>
                  <span className="coach-value-sevsix">
                    {teamData?.coach_pf || "-"}
                  </span>
                </div>
              </div>

              <div className="sevsix-coach-column">
                <div className="coach-item-sevsix">
                  <span className="coach-position-sevsix">C</span>
                  <span className="coach-value-sevsix">
                    {teamData?.coach_c || "-"}
                  </span>
                </div>
                <div className="coach-item-sevsix">
                  <span className="coach-position-sevsix">STAR</span>
                  <span className="coach-value-sevsix">
                    {teamData?.coach_star || "-"}
                  </span>
                </div>
                <div className="coach-item-sevsix">
                  <span className="coach-position-sevsix">START</span>
                  <span className="coach-value-sevsix">
                    {teamData?.coach_start || "-"}
                  </span>
                </div>
                <div className="coach-item-sevsix">
                  <span className="coach-position-sevsix">BENCH</span>
                  <span className="coach-value-sevsix">
                    {teamData?.coach_bench || "-"}
                  </span>
                </div>
              </div>

              <div className="sevsix-coach-column">
                <div className="coach-item-sevsix">
                  <span className="coach-position-sevsix">G1</span>
                  <span className="coach-value-sevsix">
                    {teamData?.coach_g1 || "-"}
                  </span>
                </div>
                <div className="coach-item-sevsix">
                  <span className="coach-position-sevsix">G2</span>
                  <span className="coach-value-sevsix">
                    {teamData?.coach_g2 || "-"}
                  </span>
                </div>
                <div className="coach-item-sevsix">
                  <span className="coach-position-sevsix">G3</span>
                  <span className="coach-value-sevsix">
                    {teamData?.coach_g3 || "-"}
                  </span>
                </div>
                <div className="coach-item-sevsix">
                  <span className="coach-position-sevsix">NEG</span>
                  <span className="coach-value-sevsix">
                    {teamData?.coach_neg || "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Draft Picks Section */}
          <div className="sevsix-pc-section">
            <div className="sevsix-pc-header">
              <h3 className="sevsix-pc-title">DRAFT PICKS</h3>
            </div>
            <div className="sevsix-picks-grid">
              <div className="sevsix-pick-column">
                <div className="sevsix-pick-year">
                  {teamData?.year_pick_one || "2024"}
                </div>
                <div className="pick-item-sevsix">
                  <span className="pick-round-sevsix">1 ROUND</span>
                  <span className="pick-value-sevsix">
                    {teamData?.draft_pick_one_1r || "-"}
                  </span>
                </div>
                <div className="pick-item-sevsix">
                  <span className="pick-round-sevsix">2 ROUND</span>
                  <span className="pick-value-sevsix">
                    {teamData?.draft_pick_one_2r || "-"}
                  </span>
                </div>
              </div>

              <div className="sevsix-pick-column">
                <div className="sevsix-pick-year">
                  {teamData?.year_pick_two || "2025"}
                </div>
                <div className="pick-item-sevsix">
                  <span className="pick-round-sevsix">1 ROUND</span>
                  <span className="pick-value-sevsix">
                    {teamData?.draft_pick_two_1r || "-"}
                  </span>
                </div>
                <div className="pick-item-sevsix">
                  <span className="pick-round-sevsix">2 ROUND</span>
                  <span className="pick-value-sevsix">
                    {teamData?.draft_pick_two_2r || "-"}
                  </span>
                </div>
              </div>

              <div className="sevsix-pick-column">
                <div className="sevsix-pick-year">
                  {teamData?.year_pick_three || "2026"}
                </div>
                <div className="pick-item-sevsix">
                  <span className="pick-round-sevsix">1 ROUND</span>
                  <span className="pick-value-sevsix">
                    {teamData?.draft_pick_three_1r || "-"}
                  </span>
                </div>
                <div className="pick-item-sevsix">
                  <span className="pick-round-sevsix">2 ROUND</span>
                  <span className="pick-value-sevsix">
                    {teamData?.draft_pick_three_2r || "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="sevsix-pc-colors">
          <div className="color-dot-sevsix blue-dark-sevsix"></div>
          <div className="color-dot-sevsix blue-sevsix"></div>
          <div className="color-dot-sevsix blue-light-sevsix"></div>
          <div className="color-dot-sevsix red-sevsix"></div>
          <div className="color-dot-sevsix silver-sevsix"></div>
        </div>
      </div>
    </div>
  );
};

export default InfoHeadSevsixPicksAndCoach;
