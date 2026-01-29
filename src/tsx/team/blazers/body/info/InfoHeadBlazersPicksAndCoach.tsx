import React, { useEffect, useState } from "react";
import { supabase } from "../../../../../Supabase";
import "./blazersPicksAndCoach.css";

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

const InfoHeadBlazersPicksAndCoach = () => {
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
          .eq("team_name", "Blazers")
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
      .channel("head-blazers-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Head",
          filter: "team_name=eq.Blazers",
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
    return <div className="loading-text">Loading Blazers Picks & Coach...</div>;
  }

  if (error) {
    return <div className="loading-text error-text">Error: {error}</div>;
  }
  return (
    <div className="blazers-containers">
      <div className="header-content">
        <h1 className="header-title-blazers">BLAZERS FRONT OFFICE</h1>
      </div>

      <div className="blazers-picks-coach-card">
        {/* <div className="blazers-pc-accent-top"></div> */}

        {/* Контейнер для горизонтального расположения */}
        <div className="blazers-pc-sections-container">
          {/* Head Coach Section */}
          <div className="blazers-pc-section">
            <div className="blazers-pc-header">
              <div className="blazers-coach-title-group">
                <h3 className="blazers-pc-title">HEAD COACH</h3>
                <h4 className="blazers-coach-name">
                  {teamData?.head_coach || "Coach Name"}
                </h4>
              </div>
            </div>
            <div className="blazers-coach-grid">
              <div className="blazers-coach-column">
                <div className="coach-item-blazers">
                  <span className="coach-position-blazers">PG</span>
                  <span className="coach-value-blazers">
                    {teamData?.coach_pg || "-"}
                  </span>
                </div>
                <div className="coach-item-blazers">
                  <span className="coach-position-blazers">SG</span>
                  <span className="coach-value-blazers">
                    {teamData?.coach_sg || "-"}
                  </span>
                </div>
                <div className="coach-item-blazers">
                  <span className="coach-position-blazers">SF</span>
                  <span className="coach-value-blazers">
                    {teamData?.coach_sf || "-"}
                  </span>
                </div>
                <div className="coach-item-blazers">
                  <span className="coach-position-blazers">PF</span>
                  <span className="coach-value-blazers">
                    {teamData?.coach_pf || "-"}
                  </span>
                </div>
              </div>

              <div className="blazers-coach-column">
                <div className="coach-item-blazers">
                  <span className="coach-position-blazers">C</span>
                  <span className="coach-value-blazers">
                    {teamData?.coach_c || "-"}
                  </span>
                </div>
                <div className="coach-item-blazers">
                  <span className="coach-position-blazers">STAR</span>
                  <span className="coach-value-blazers">
                    {teamData?.coach_star || "-"}
                  </span>
                </div>
                <div className="coach-item-blazers">
                  <span className="coach-position-blazers">START</span>
                  <span className="coach-value-blazers">
                    {teamData?.coach_start || "-"}
                  </span>
                </div>
                <div className="coach-item-blazers">
                  <span className="coach-position-blazers">BENCH</span>
                  <span className="coach-value-blazers">
                    {teamData?.coach_bench || "-"}
                  </span>
                </div>
              </div>

              <div className="blazers-coach-column">
                <div className="coach-item-blazers">
                  <span className="coach-position-blazers">G1</span>
                  <span className="coach-value-blazers">
                    {teamData?.coach_g1 || "-"}
                  </span>
                </div>
                <div className="coach-item-blazers">
                  <span className="coach-position-blazers">G2</span>
                  <span className="coach-value-blazers">
                    {teamData?.coach_g2 || "-"}
                  </span>
                </div>
                <div className="coach-item-blazers">
                  <span className="coach-position-blazers">G3</span>
                  <span className="coach-value-blazers">
                    {teamData?.coach_g3 || "-"}
                  </span>
                </div>
                <div className="coach-item-blazers">
                  <span className="coach-position-blazers">NEG</span>
                  <span className="coach-value-blazers">
                    {teamData?.coach_neg || "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Draft Picks Section */}
          <div className="blazers-pc-section">
            <div className="blazers-pc-header">
              <h3 className="blazers-pc-title">DRAFT PICKS</h3>
            </div>
            <div className="blazers-picks-grid">
              <div className="blazers-pick-column">
                <div className="blazers-pick-year">
                  {teamData?.year_pick_one || "2024"}
                </div>
                <div className="pick-item-blazers">
                  <span className="pick-round-blazers">1 ROUND</span>
                  <span className="pick-value-blazers">
                    {teamData?.draft_pick_one_1r || "-"}
                  </span>
                </div>
                <div className="pick-item-blazers">
                  <span className="pick-round-blazers">2 ROUND</span>
                  <span className="pick-value-blazers">
                    {teamData?.draft_pick_one_2r || "-"}
                  </span>
                </div>
              </div>

              <div className="blazers-pick-column">
                <div className="blazers-pick-year">
                  {teamData?.year_pick_two || "2025"}
                </div>
                <div className="pick-item-blazers">
                  <span className="pick-round-blazers">1 ROUND</span>
                  <span className="pick-value-blazers">
                    {teamData?.draft_pick_two_1r || "-"}
                  </span>
                </div>
                <div className="pick-item-blazers">
                  <span className="pick-round-blazers">2 ROUND</span>
                  <span className="pick-value-blazers">
                    {teamData?.draft_pick_two_2r || "-"}
                  </span>
                </div>
              </div>

              <div className="blazers-pick-column">
                <div className="blazers-pick-year">
                  {teamData?.year_pick_three || "2026"}
                </div>
                <div className="pick-item-blazers">
                  <span className="pick-round-blazers">1 ROUND</span>
                  <span className="pick-value-blazers">
                    {teamData?.draft_pick_three_1r || "-"}
                  </span>
                </div>
                <div className="pick-item-blazers">
                  <span className="pick-round-blazers">2 ROUND</span>
                  <span className="pick-value-blazers">
                    {teamData?.draft_pick_three_2r || "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="blazers-pc-colors">
          <div className="color-dot-blazers red-dark-blazers"></div>
          <div className="color-dot-blazers red-blazers"></div>
          <div className="color-dot-blazers silver-dark-blazers"></div>
          <div className="color-dot-blazers black-blazers"></div>
          <div className="color-dot-blazers silver-blazers"></div>
        </div>
      </div>
    </div>
  );
};

export default InfoHeadBlazersPicksAndCoach;
