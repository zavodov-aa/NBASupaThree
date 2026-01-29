import React, { useEffect, useState } from "react";
import { supabase } from "../../../../../Supabase";
import "./bullsPicksAndCoach.css";

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

const InfoHeadBullsPicksAndCoach = () => {
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
          .eq("team_name", "Bulls")
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
      .channel("head-bulls-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Head",
          filter: "team_name=eq.Bulls",
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
    return <div className="loading-text">Loading Bulls Picks & Coach...</div>;
  }

  if (error) {
    return <div className="loading-text error-text">Error: {error}</div>;
  }
  return (
    <div className="bulls-containers">
      <div className="header-content">
        <h1 className="header-title-bulls">BULLS FRONT OFFICE</h1>
      </div>

      <div className="bulls-picks-coach-card">
        {/* <div className="bulls-pc-accent-top"></div> */}

        {/* Контейнер для горизонтального расположения */}
        <div className="bulls-pc-sections-container">
          {/* Head Coach Section */}
          <div className="bulls-pc-section">
            <div className="bulls-pc-header">
              <div className="bulls-coach-title-group">
                <h3 className="bulls-pc-title">HEAD COACH</h3>
                <h4 className="bulls-coach-name">
                  {teamData?.head_coach || "Coach Name"}
                </h4>
              </div>
            </div>
            <div className="bulls-coach-grid">
              <div className="bulls-coach-column">
                <div className="coach-item-bulls">
                  <span className="coach-position-bulls">PG</span>
                  <span className="coach-value-bulls">
                    {teamData?.coach_pg || "-"}
                  </span>
                </div>
                <div className="coach-item-bulls">
                  <span className="coach-position-bulls">SG</span>
                  <span className="coach-value-bulls">
                    {teamData?.coach_sg || "-"}
                  </span>
                </div>
                <div className="coach-item-bulls">
                  <span className="coach-position-bulls">SF</span>
                  <span className="coach-value-bulls">
                    {teamData?.coach_sf || "-"}
                  </span>
                </div>
                <div className="coach-item-bulls">
                  <span className="coach-position-bulls">PF</span>
                  <span className="coach-value-bulls">
                    {teamData?.coach_pf || "-"}
                  </span>
                </div>
              </div>

              <div className="bulls-coach-column">
                <div className="coach-item-bulls">
                  <span className="coach-position-bulls">C</span>
                  <span className="coach-value-bulls">
                    {teamData?.coach_c || "-"}
                  </span>
                </div>
                <div className="coach-item-bulls">
                  <span className="coach-position-bulls">STAR</span>
                  <span className="coach-value-bulls">
                    {teamData?.coach_star || "-"}
                  </span>
                </div>
                <div className="coach-item-bulls">
                  <span className="coach-position-bulls">START</span>
                  <span className="coach-value-bulls">
                    {teamData?.coach_start || "-"}
                  </span>
                </div>
                <div className="coach-item-bulls">
                  <span className="coach-position-bulls">BENCH</span>
                  <span className="coach-value-bulls">
                    {teamData?.coach_bench || "-"}
                  </span>
                </div>
              </div>

              <div className="bulls-coach-column">
                <div className="coach-item-bulls">
                  <span className="coach-position-bulls">G1</span>
                  <span className="coach-value-bulls">
                    {teamData?.coach_g1 || "-"}
                  </span>
                </div>
                <div className="coach-item-bulls">
                  <span className="coach-position-bulls">G2</span>
                  <span className="coach-value-bulls">
                    {teamData?.coach_g2 || "-"}
                  </span>
                </div>
                <div className="coach-item-bulls">
                  <span className="coach-position-bulls">G3</span>
                  <span className="coach-value-bulls">
                    {teamData?.coach_g3 || "-"}
                  </span>
                </div>
                <div className="coach-item-bulls">
                  <span className="coach-position-bulls">NEG</span>
                  <span className="coach-value-bulls">
                    {teamData?.coach_neg || "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Draft Picks Section */}
          <div className="bulls-pc-section">
            <div className="bulls-pc-header">
              <h3 className="bulls-pc-title">DRAFT PICKS</h3>
            </div>
            <div className="bulls-picks-grid">
              <div className="bulls-pick-column">
                <div className="bulls-pick-year">
                  {teamData?.year_pick_one || "2024"}
                </div>
                <div className="pick-item-bulls">
                  <span className="pick-round-bulls">1 ROUND</span>
                  <span className="pick-value-bulls">
                    {teamData?.draft_pick_one_1r || "-"}
                  </span>
                </div>
                <div className="pick-item-bulls">
                  <span className="pick-round-bulls">2 ROUND</span>
                  <span className="pick-value-bulls">
                    {teamData?.draft_pick_one_2r || "-"}
                  </span>
                </div>
              </div>

              <div className="bulls-pick-column">
                <div className="bulls-pick-year">
                  {teamData?.year_pick_two || "2025"}
                </div>
                <div className="pick-item-bulls">
                  <span className="pick-round-bulls">1 ROUND</span>
                  <span className="pick-value-bulls">
                    {teamData?.draft_pick_two_1r || "-"}
                  </span>
                </div>
                <div className="pick-item-bulls">
                  <span className="pick-round-bulls">2 ROUND</span>
                  <span className="pick-value-bulls">
                    {teamData?.draft_pick_two_2r || "-"}
                  </span>
                </div>
              </div>

              <div className="bulls-pick-column">
                <div className="bulls-pick-year">
                  {teamData?.year_pick_three || "2026"}
                </div>
                <div className="pick-item-bulls">
                  <span className="pick-round-bulls">1 ROUND</span>
                  <span className="pick-value-bulls">
                    {teamData?.draft_pick_three_1r || "-"}
                  </span>
                </div>
                <div className="pick-item-bulls">
                  <span className="pick-round-bulls">2 ROUND</span>
                  <span className="pick-value-bulls">
                    {teamData?.draft_pick_three_2r || "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bulls-pc-colors">
          <div className="color-dot-bulls black-dark-bulls"></div>
          <div className="color-dot-bulls black-bulls"></div>
          <div className="color-dot-bulls red-dark-bulls"></div>
          <div className="color-dot-bulls red-bulls"></div>
          <div className="color-dot-bulls red-light-bulls"></div>
        </div>
      </div>
    </div>
  );
};

export default InfoHeadBullsPicksAndCoach;
